import { createHash } from 'node:crypto';
import { chmodSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const MAX_BYTES = 1_048_576;
const MAX_DIM = 1024;
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const PNG_IEND = Buffer.from([0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82]);

function assertValidImage(buf: Buffer): { format: 'png' | 'jpeg'; width: number; height: number } {
  if (buf.length === 0 || buf.length > MAX_BYTES) {
    throw new Error(`Image size ${buf.length} bytes exceeds limit (${MAX_BYTES} bytes)`);
  }
  if (buf.length >= 33 && buf.subarray(0, 8).equals(PNG_SIGNATURE)) {
    const width = buf.readUInt32BE(16);
    const height = buf.readUInt32BE(20);
    if (width < 1 || height < 1 || width > MAX_DIM || height > MAX_DIM) {
      throw new Error(`PNG dimensions ${width}x${height} exceed ${MAX_DIM}x${MAX_DIM}`);
    }
    if (!buf.subarray(buf.length - 8).equals(PNG_IEND)) {
      throw new Error('PNG file is missing valid IEND trailer');
    }
    return { format: 'png', width, height };
  }
  if (buf.length >= 4 && buf[0] === 0xff && buf[1] === 0xd8 && buf[buf.length - 2] === 0xff && buf[buf.length - 1] === 0xd9) {
    return { format: 'jpeg', width: MAX_DIM, height: MAX_DIM };
  }
  throw new Error('Asset is neither a valid whole PNG nor JPEG image');
}

function main(): void {
  const rootDir = dirname(fileURLToPath(import.meta.url));
  const sourcePath = resolve(rootDir, 'assets', 'entry.png');
  const outputDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? '/output');
  const targetPath = join(outputDir, 'entry.png');

  const imageBytes = readFileSync(sourcePath);
  const meta = assertValidImage(imageBytes);
  const digest = createHash('sha256').update(imageBytes).digest('hex');

  mkdirSync(outputDir, { recursive: true, mode: 0o755 });
  writeFileSync(targetPath, imageBytes, { mode: 0o644 });
  try {
    chmodSync(targetPath, 0o644);
  } catch {
    // Non-POSIX filesystems ignore chmod bits.
  }

  process.stdout.write(
    `Wrote ${targetPath} (${meta.format.toUpperCase()} ${meta.width}x${meta.height}, ${imageBytes.length} bytes, sha256=${digest.slice(0, 12)})\n`,
  );
}

main();
