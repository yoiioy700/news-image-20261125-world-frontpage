import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  EDITION_META,
  LEAD_STORIES,
  MARKET_METRICS,
  TIMELINE_EVENTS,
  WIRE_STORIES,
  type BeatCategory,
} from '../src/stories.ts';
import { renderWorldMapSvg, type MapPin } from '../src/world_map.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');
const ART_DIR = resolve(REPO_ROOT, '..', 'news-image-20261125-work', 'art_cropped');
const BUILD_DIR = resolve(REPO_ROOT, '..', 'news-image-20261125-work', 'build');
const OUT_PNG = resolve(REPO_ROOT, 'assets', 'entry.png');

const BEAT_COLORS: Record<BeatCategory, string> = {
  trade: '#1A365D',
  markets: '#9B1C1C',
  policy: '#2B4C7E',
  conflict: '#B42318',
  disaster: '#B45309',
  science: '#1B5E4B',
};

function esc(s: string): string {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function artDataUri(filename: string): string {
  const fullPath = resolve(ART_DIR, filename);
  const b64 = readFileSync(fullPath).toString('base64');
  return `data:image/png;base64,${b64}`;
}

function buildPins(): MapPin[] {
  const pins: MapPin[] = [];
  for (const s of LEAD_STORIES) {
    pins.push({ pin: s.pin, label: s.regionLabel, lat: s.lat, lon: s.lon, beat: s.beat });
  }
  for (const w of WIRE_STORIES) {
    if (w.pin !== undefined && w.lat !== undefined && w.lon !== undefined) {
      pins.push({ pin: w.pin, label: w.kicker, lat: w.lat, lon: w.lon, beat: w.beat });
    }
  }
  return pins.sort((a, b) => a.pin - b.pin);
}

function renderTimelineSvg(width = 492, height = 64): string {
  const padX = 28;
  const lineY = 33;
  const span = width - padX * 2;
  const count = TIMELINE_EVENTS.length;

  const ticks = TIMELINE_EVENTS.map((ev, idx) => {
    const x = padX + (idx / (count - 1)) * span;
    const above = idx % 2 === 0;
    const color = BEAT_COLORS[ev.beat];
    const stemY = above ? lineY - 9 : lineY + 9;
    const utcY = above ? lineY - 21 : lineY + 17;
    const lblY = above ? lineY - 12 : lineY + 26;
    return `
      <g>
        <line x1="${x.toFixed(1)}" y1="${lineY}" x2="${x.toFixed(1)}" y2="${stemY}" stroke="${color}" stroke-width="1.3" />
        <circle cx="${x.toFixed(1)}" cy="${lineY}" r="3.6" fill="${color}" stroke="#F7F4EC" stroke-width="1.2" />
        <text x="${x.toFixed(1)}" y="${utcY}" text-anchor="middle" font-family="Consolas, Segoe UI, monospace" font-size="7.7" font-weight="800" fill="${color}">${esc(ev.utc)}</text>
        <text x="${x.toFixed(1)}" y="${lblY}" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="8.0" font-weight="700" fill="#11151C">${esc(ev.label)}</text>
      </g>
    `;
  }).join('\n');

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="display:block;width:100%;">
      <line x1="${padX - 6}" y1="${lineY}" x2="${width - padX + 4}" y2="${lineY}" stroke="#1A365D" stroke-width="1.8" />
      <polygon points="${width - padX + 9},${lineY} ${width - padX + 3},${lineY - 3.2} ${width - padX + 3},${lineY + 3.2}" fill="#1A365D" />
      ${ticks}
    </svg>
  `;
}

function renderHtml(): string {
  const flagships = LEAD_STORIES.filter((s) => s.tier === 'flagship');
  const secondaries = LEAD_STORIES.filter((s) => s.tier === 'secondary');
  const mapSvg = renderWorldMapSvg(buildPins(), 482, 138);
  const timelineSvg = renderTimelineSvg(492, 64);

  const columns: Array<{ key: 'americas' | 'europe' | 'mena_africa' | 'asia_global'; title: string; accent: string }> = [
    { key: 'americas', title: 'AMERICAS · NORTH & LATIN', accent: '#1A365D' },
    { key: 'europe', title: 'EUROPE & EURASIA', accent: '#2B4C7E' },
    { key: 'mena_africa', title: 'MIDDLE EAST & AFRICA', accent: '#9B1C1C' },
    { key: 'asia_global', title: 'ASIA-PACIFIC · HEALTH · SCIENCE', accent: '#1B5E4B' },
  ];

  const flagshipHtml = flagships
    .map((s) => {
      const color = BEAT_COLORS[s.beat];
      return `
        <article class="flagship-card">
          <div class="flagship-art-wrap">
            <img class="flagship-art" src="${artDataUri(s.artFile)}" alt="${esc(s.headline)}" />
            <span class="pin-badge" style="background:${color}">${s.pin}</span>
          </div>
          <div class="flagship-body">
            <div class="meta-row">
              <span class="beat-pill" style="background:${color}">${esc(s.regionLabel)}</span>
              <span class="status-tag">${esc(s.status)} · ${esc(s.utc)}</span>
            </div>
            <h2 class="flagship-headline">${esc(s.headline)}</h2>
            <ul class="flagship-list">
              ${s.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}
            </ul>
            <div class="source-line">Source: ${esc(s.source)}</div>
          </div>
        </article>
      `;
    })
    .join('\n');

  const secondaryHtml = secondaries
    .map((s) => {
      const color = BEAT_COLORS[s.beat];
      return `
        <article class="sec-card">
          <div class="sec-art-wrap">
            <img class="sec-art" src="${artDataUri(s.artFile)}" alt="${esc(s.headline)}" />
            <span class="pin-badge pin-sm" style="background:${color}">${s.pin}</span>
          </div>
          <div class="sec-body">
            <div class="meta-row meta-tight">
              <span class="beat-pill pill-sm" style="background:${color}">${esc(s.regionLabel)}</span>
              <span class="status-tag status-sm">${esc(s.status)}</span>
            </div>
            <h3 class="sec-headline">${esc(s.headline)}</h3>
            <p class="sec-text">${esc(s.bullets.join(' '))}</p>
            <div class="source-line src-sm">${esc(s.source)} · ${esc(s.utc)}</div>
          </div>
        </article>
      `;
    })
    .join('\n');

  const metricsHtml = MARKET_METRICS.map((m) => {
    const cls = m.direction === 'down' ? 'm-down' : m.direction === 'up' ? 'm-up' : 'm-warn';
    return `
      <div class="metric-tile ${cls}">
        <div class="m-lbl">${esc(m.label)}</div>
        <div class="m-val">${esc(m.value)}</div>
        <div class="m-delta">${esc(m.delta)}</div>
      </div>
    `;
  }).join('\n');

  const ledgerHtml = columns
    .map((col) => {
      const items = WIRE_STORIES.filter((w) => w.column === col.key);
      return `
        <section class="wire-col">
          <div class="wire-col-hdr" style="border-top-color:${col.accent}; color:${col.accent};">${esc(col.title)}</div>
          <div class="wire-items">
            ${items
              .map((w) => {
                const pinSpan =
                  w.pin !== undefined
                    ? `<span class="inline-pin" style="background:${BEAT_COLORS[w.beat]}">${w.pin}</span>`
                    : '';
                return `
                  <div class="wire-item">
                    <div class="wire-h">${pinSpan}<span class="wire-kicker">${esc(w.kicker)}:</span> ${esc(w.headline)}</div>
                    <div class="wire-d">${esc(w.detail)} <span class="wire-src">[${esc(w.source)}]</span></div>
                  </div>
                `;
              })
              .join('')}
          </div>
        </section>
      `;
    })
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body {
    width: 1024px;
    height: 1024px;
    overflow: hidden;
    background: #F7F4EC;
    color: #11151C;
    font-family: 'Segoe UI', 'Calibri', Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  .page {
    width: 1024px;
    height: 1024px;
    padding: 9px 10px 8px 10px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    background: #F7F4EC;
  }

  /* BAND 1: MASTHEAD */
  .masthead {
    height: 66px;
    background: #12233B;
    color: #F7F4EC;
    padding: 7px 12px 6px 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 3px solid #C4892B;
  }
  .mast-left {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .mast-eyebrow {
    font-size: 9.2px;
    font-weight: 700;
    letter-spacing: 1.5px;
    color: #E5BE73;
    text-transform: uppercase;
  }
  .mast-date {
    font-family: Georgia, Cambria, 'Times New Roman', serif;
    font-size: 31px;
    font-weight: 700;
    line-height: 1.02;
    letter-spacing: 0.4px;
    color: #FFFFFF;
  }
  .mast-right {
    text-align: right;
    border-left: 1px solid rgba(229, 190, 115, 0.45);
    padding-left: 11px;
    max-width: 292px;
  }
  .mast-stats {
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.4px;
    color: #FFFFFF;
    margin-bottom: 2px;
  }
  .mast-audit {
    font-size: 8.6px;
    line-height: 1.24;
    color: #D7E0EC;
  }

  /* BAND 2: FLAGSHIP ROW */
  .flagship-row {
    height: 158px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  .flagship-card {
    background: #FFFFFF;
    border: 1px solid #C2BAA8;
    border-top: 2.5px solid #12233B;
    padding: 6px;
    display: flex;
    gap: 8px;
    overflow: hidden;
  }
  .flagship-art-wrap {
    position: relative;
    width: 142px;
    height: 142px;
    flex-shrink: 0;
    border: 1px solid #1E293B;
    overflow: hidden;
    background: #F7F4EC;
  }
  .flagship-art {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .flagship-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-width: 0;
  }
  .meta-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 4px;
    margin-bottom: 2px;
  }
  .beat-pill {
    font-size: 7.8px;
    font-weight: 800;
    letter-spacing: 0.55px;
    color: #FFFFFF;
    padding: 1.5px 5px;
    border-radius: 2px;
    text-transform: uppercase;
    white-space: nowrap;
  }
  .status-tag {
    font-family: Consolas, 'Segoe UI', monospace;
    font-size: 7.6px;
    font-weight: 700;
    color: #475569;
    white-space: nowrap;
  }
  .flagship-headline {
    font-family: Georgia, Cambria, serif;
    font-size: 15.8px;
    font-weight: 700;
    line-height: 1.12;
    color: #11151C;
    margin-bottom: 3px;
  }
  .flagship-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 2.2px;
  }
  .flagship-list li {
    font-size: 9.35px;
    line-height: 1.22;
    color: #1F2937;
    padding-left: 8px;
    position: relative;
  }
  .flagship-list li::before {
    content: '▪';
    position: absolute;
    left: 0;
    top: 0;
    color: #9B1C1C;
    font-size: 8px;
  }
  .source-line {
    font-size: 7.8px;
    font-weight: 700;
    color: #57606F;
    margin-top: 2px;
  }
  .pin-badge {
    position: absolute;
    top: 4px;
    left: 4px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    color: #FFFFFF;
    font-size: 10px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1.5px solid #F7F4EC;
  }
  .pin-sm {
    width: 16px;
    height: 16px;
    font-size: 9px;
    top: 3px;
    left: 3px;
  }

  /* BAND 3: SIX SECONDARY ILLUSTRATED CARDS */
  .secondary-grid {
    height: 224px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 109px);
    gap: 6px 8px;
  }
  .sec-card {
    background: #FFFFFF;
    border: 1px solid #C2BAA8;
    padding: 5px;
    display: flex;
    gap: 7px;
    overflow: hidden;
  }
  .sec-art-wrap {
    position: relative;
    width: 97px;
    height: 97px;
    flex-shrink: 0;
    border: 1px solid #2C3545;
    overflow: hidden;
    background: #F7F4EC;
  }
  .sec-art {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .sec-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-width: 0;
  }
  .meta-tight { margin-bottom: 1px; }
  .pill-sm { font-size: 7.2px; padding: 1px 4px; }
  .status-sm { font-size: 7px; }
  .sec-headline {
    font-family: Georgia, Cambria, serif;
    font-size: 12.1px;
    font-weight: 700;
    line-height: 1.13;
    color: #11151C;
    margin-bottom: 2px;
  }
  .sec-text {
    font-size: 8.55px;
    line-height: 1.19;
    color: #26303F;
  }
  .src-sm { font-size: 7.2px; }

  /* BAND 4: WORLD PIN MAP + MARKETS & TIMELINE */
  .mid-band {
    height: 158px;
    display: grid;
    grid-template-columns: 492px 1fr;
    gap: 8px;
  }
  .panel-box {
    background: #FFFFFF;
    border: 1px solid #C2BAA8;
    padding: 4px 5px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
  }
  .panel-hdr {
    display: flex;
    justify-content: space-between;
    align-items: center;
    white-space: nowrap;
    font-size: 8.3px;
    font-weight: 800;
    letter-spacing: 0.55px;
    color: #12233B;
    border-bottom: 1px solid #D6CFC0;
    padding-bottom: 2px;
    margin-bottom: 2px;
    text-transform: uppercase;
  }
  .legend-inline {
    display: flex;
    gap: 6px;
    font-size: 7.3px;
    font-weight: 700;
    letter-spacing: 0.1px;
    text-transform: none;
    color: #334155;
  }
  .lg-dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    margin-right: 2px;
    vertical-align: middle;
  }
  .right-stack {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .markets-panel { height: 71px; }
  .timeline-panel { height: 82px; }
  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 4px;
  }
  .metric-tile {
    background: #F7F4EC;
    border: 1px solid #D5CEBE;
    border-top: 2.5px solid #1A365D;
    padding: 2px 3px;
    text-align: center;
  }
  .metric-tile.m-down { border-top-color: #B42318; }
  .metric-tile.m-up { border-top-color: #1B5E4B; }
  .metric-tile.m-warn { border-top-color: #B45309; }
  .m-lbl { font-size: 7.3px; font-weight: 800; color: #475569; letter-spacing: 0.3px; }
  .m-val { font-size: 11px; font-weight: 800; color: #11151C; line-height: 1.1; }
  .m-delta { font-size: 8.4px; font-weight: 800; line-height: 1.08; }
  .m-down .m-delta { color: #9B1C1C; }
  .m-up .m-delta { color: #1B5E4B; }
  .m-warn .m-delta { color: #9A5B13; }
  .tape-line {
    font-size: 7.5px;
    font-weight: 700;
    color: #334155;
    text-align: center;
    margin-top: 1px;
  }

  /* BAND 5: GLOBAL WIRE LEDGER (4 COLUMNS) */
  .ledger-grid {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 7px;
    min-height: 0;
  }
  .wire-col {
    background: #FFFFFF;
    border: 1px solid #C2BAA8;
    padding: 4px 5.5px 4px 5.5px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .wire-col-hdr {
    font-size: 8.2px;
    font-weight: 800;
    letter-spacing: 0.5px;
    border-top: 2.5px solid #12233B;
    border-bottom: 1px solid #D6CFC0;
    padding: 2px 0 2px 0;
    margin-bottom: 2.5px;
    text-transform: uppercase;
    white-space: nowrap;
  }
  .wire-items {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    gap: 1.5px;
  }
  .wire-item {
    border-bottom: 1px dotted #DDD6C7;
    padding-bottom: 2px;
  }
  .wire-item:last-child { border-bottom: none; padding-bottom: 0; }
  .wire-h {
    font-size: 8.45px;
    font-weight: 800;
    line-height: 1.13;
    color: #11151C;
  }
  .wire-kicker {
    color: #1A365D;
    font-size: 7.7px;
    letter-spacing: 0.15px;
  }
  .wire-d {
    font-size: 7.65px;
    line-height: 1.14;
    color: #2D3748;
  }
  .wire-src {
    font-size: 6.95px;
    font-weight: 700;
    color: #64748B;
  }
  .inline-pin {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    color: #FFFFFF;
    font-size: 7.2px;
    font-weight: 800;
    margin-right: 3px;
    vertical-align: 0.5px;
  }

  /* BAND 6: COLOPHON */
  .colophon {
    height: 19px;
    background: #12233B;
    color: #E2E8F0;
    font-size: 7.7px;
    font-weight: 600;
    letter-spacing: 0.35px;
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .colophon strong { color: #E5BE73; }
</style>
</head>
<body>
  <div class="page">
    <header class="masthead">
      <div class="mast-left">
        <div class="mast-eyebrow">THE WORLD IN ONE DAY · GLOBAL FRONT PAGE · 2026-11-25 (00:00–23:59 UTC)</div>
        <h1 class="mast-date">${esc(EDITION_META.dateLong)}</h1>
      </div>
      <div class="mast-right">
        <div class="mast-stats">${EDITION_META.storyCount} VERIFIED STORIES · ${EDITION_META.regionCount} REGIONS · ${EDITION_META.beatCount} BEATS</div>
        <div class="mast-audit">${esc(EDITION_META.dateAudit)}</div>
      </div>
    </header>

    <section class="flagship-row">
      ${flagshipHtml}
    </section>

    <section class="secondary-grid">
      ${secondaryHtml}
    </section>

    <section class="mid-band">
      <div class="panel-box">
        <div class="panel-hdr">
          <span>WORLD DISPATCH MAP · 18 PINS · 9 REGIONS</span>
          <span class="legend-inline">
            <span><i class="lg-dot" style="background:#1A365D"></i>Trade/Policy</span>
            <span><i class="lg-dot" style="background:#B42318"></i>Conflict/Mkts</span>
            <span><i class="lg-dot" style="background:#B45309"></i>Disaster</span>
            <span><i class="lg-dot" style="background:#1B5E4B"></i>Space/Sci</span>
          </span>
        </div>
        ${mapSvg}
      </div>

      <div class="right-stack">
        <div class="panel-box markets-panel">
          <div class="panel-hdr">
            <span>MARKETS & MACRO SNAPSHOT · 25 NOV 2026</span>
            <span style="font-size:7.3px;color:#475569;font-weight:700;text-transform:none;">Reported closes & official releases</span>
          </div>
          <div class="metrics-grid">${metricsHtml}</div>
          <div class="tape-line">Dow &gt;50k (+0.85%) · S&amp;P 500 7,201 (−0.5%) · Gold ~$3,520 · UK Energy Cap £2,166 (+26%) · Venezuela Debt $237.5B</div>
        </div>

        <div class="panel-box timeline-panel">
          <div class="panel-hdr">
            <span>24-HOUR CHRONOLOGY · 25 NOVEMBER 2026 (UTC)</span>
            <span style="font-size:7.3px;color:#475569;font-weight:700;text-transform:none;">00:00 → 23:59 UTC</span>
          </div>
          ${timelineSvg}
        </div>
      </div>
    </section>

    <section class="ledger-grid">
      ${ledgerHtml}
    </section>

    <footer class="colophon">
      <span><strong>DATE CHECK:</strong> 25 NOV 2026 ONLY · NO PRE-25 NOV EVENTS · REPORTED FACTS WITHOUT SPECULATION</span>
      <span><strong>SOURCES:</strong> USTR · OFGEM · BEA · ABS · FCC · EC · WHO · UN · REUTERS · AP · AL JAZEERA · GUARDIAN · CNSA · UEFA</span>
    </footer>
  </div>
</body>
</html>`;
}

function findChrome(): string {
  const candidates = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  ];
  for (const c of candidates) {
    if (existsSync(c)) return c;
  }
  throw new Error('Could not locate Chrome or Edge binary');
}

function main(): void {
  mkdirSync(BUILD_DIR, { recursive: true });
  mkdirSync(dirname(OUT_PNG), { recursive: true });

  const htmlPath = resolve(BUILD_DIR, 'broadsheet.html');
  const rawPng = resolve(BUILD_DIR, 'raw_1024.png');
  writeFileSync(htmlPath, renderHtml(), 'utf8');

  const chrome = findChrome();
  const fileUrl = `file:///${htmlPath.replaceAll('\\', '/')}`;
  execFileSync(
    chrome,
    [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      '--window-size=1024,1024',
      `--screenshot=${rawPng}`,
      fileUrl,
    ],
    { stdio: 'pipe', timeout: 30_000 },
  );

  // Optimize PNG and also generate 300px readability preview using uv + Pillow
  const optScript = `
from PIL import Image
import pathlib
raw = pathlib.Path(r"${rawPng}")
out_png = pathlib.Path(r"${OUT_PNG}")
prev_300 = pathlib.Path(r"${BUILD_DIR}") / "preview_300.png"
im = Image.open(raw).convert("RGB")
assert im.size == (1024, 1024), f"Unexpected size {im.size}"
# Try quantized high-quality palette PNG or optimize RGB PNG under 1 MiB
im.save(out_png, format="PNG", optimize=True, compress_level=9)
size_rgb = out_png.stat().st_size
if size_rgb > 950_000:
    # Adaptive 256-color or crisp JPEG fallback? Better: test PNG-8 vs high-quality JPEG94!
    q = im.quantize(colors=256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.FLOYDSTEINBERG)
    q.save(out_png, format="PNG", optimize=True, compress_level=9)
    print(f"RGB PNG was {size_rgb} bytes -> quantized PNG is {out_png.stat().st_size} bytes")
else:
    print(f"Lossless RGB PNG: {size_rgb} bytes")
im.resize((300, 300), Image.Resampling.LANCZOS).save(prev_300, format="PNG", optimize=True)
print(f"Saved 300px preview: {prev_300}")
`;
  execFileSync('uv', ['run', '--with', 'pillow', 'python', '-c', optScript], {
    stdio: 'inherit',
    timeout: 30_000,
  });

  const finalSize = statSync(OUT_PNG).size;
  console.log(`Final entry.png size: ${finalSize} bytes (${(finalSize / 1024).toFixed(1)} KiB)`);
}

main();
