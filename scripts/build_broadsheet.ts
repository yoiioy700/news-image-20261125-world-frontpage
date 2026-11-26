import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  EDITION_META,
  KPI_STATS,
  LEAD_STORIES,
  REGION_BAR,
  WIRE_STORIES,
  type BeatCategory,
  type EpistemicTag,
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

const STATUS_STYLE: Record<EpistemicTag, { bg: string; fg: string; border: string }> = {
  OFFICIAL: { bg: '#E6F0EC', fg: '#15503E', border: '#8ABAA8' },
  REPORTED: { bg: '#EBF0F7', fg: '#1D395E', border: '#A7BDD6' },
  CLAIM: { bg: '#FDF0E6', fg: '#9A430D', border: '#DFAA80' },
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
  return LEAD_STORIES.map((s) => ({
    pin: s.pin,
    label: s.locationLabel,
    lat: s.lat,
    lon: s.lon,
    beat: s.beat,
  })).sort((a, b) => a.pin - b.pin);
}

function statusBadge(tag: EpistemicTag, compact = false): string {
  const st = STATUS_STYLE[tag];
  return `<span class="ep-badge ${compact ? 'ep-sm' : ''}" style="background:${st.bg};color:${st.fg};border-color:${st.border}">${tag}</span>`;
}

function renderDhakaWageSvg(): string {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 234 58" style="width:100%;height:100%;display:block;background:#F4EFE3;">
      <defs>
        <pattern id="weave" width="8" height="8" patternUnits="userSpaceOnUse">
          <path d="M0 4 H8 M4 0 V8" stroke="#E5DEC9" stroke-width="0.7"/>
        </pattern>
      </defs>
      <rect width="234" height="58" fill="url(#weave)" />
      <path d="M0 48 Q46 36 92 43 T180 24 L234 15 L234 58 L0 58 Z" fill="#1F5E52" opacity="0.18"/>
      <path d="M6 48 Q52 38 100 43 T186 24 L234 16" fill="none" stroke="#1F5E52" stroke-width="2.0" stroke-dasharray="5,3"/>
      <!-- Old wage bar -->
      <rect x="26" y="31" width="36" height="22" rx="1.5" fill="#1A365D" stroke="#0E1726" stroke-width="1"/>
      <text x="44" y="27" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="7.4" font-weight="800" fill="#334155">12,500৳</text>
      <text x="44" y="45" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="6.8" font-weight="700" fill="#E2E8F0">OLD</text>
      <!-- Arrow -->
      <path d="M67 37 L85 26" stroke="#9B1C1C" stroke-width="2.1" fill="none" stroke-linecap="round"/>
      <polygon points="89,23 81,23 86,30" fill="#9B1C1C"/>
      <text x="76" y="21" text-anchor="middle" font-family="Georgia, serif" font-size="9.2" font-weight="800" fill="#9B1C1C">+36%</text>
      <!-- New wage bar -->
      <rect x="94" y="17" width="44" height="36" rx="1.5" fill="#C47D2B" stroke="#0E1726" stroke-width="1"/>
      <text x="116" y="13.5" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="7.8" font-weight="800" fill="#11151C">17,000৳</text>
      <text x="116" y="38" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="7.2" font-weight="800" fill="#FFFFFF">$136/MO</text>
      <!-- Thread bobbin & coins clear of bottom-right ribbon -->
      <rect x="150" y="9" width="16" height="22" rx="2" fill="#A62626" stroke="#11151C" stroke-width="1"/>
      <rect x="147" y="6" width="22" height="3.5" rx="1" fill="#1A365D" stroke="#11151C" stroke-width="0.9"/>
      <rect x="147" y="30" width="22" height="3.5" rx="1" fill="#1A365D" stroke="#11151C" stroke-width="0.9"/>
      <ellipse cx="192" cy="24" rx="11" ry="3.5" fill="#C47D2B" stroke="#11151C" stroke-width="0.9"/>
      <ellipse cx="192" cy="19.5" rx="11" ry="3.5" fill="#D99B43" stroke="#11151C" stroke-width="0.9"/>
      <ellipse cx="192" cy="15" rx="11" ry="3.5" fill="#E6B25E" stroke="#11151C" stroke-width="0.9"/>
    </svg>
  `;
}

function artOrSvg(artFile: string, alt: string, pos?: string): string {
  if (artFile === '11_dhaka_wage.png') {
    return renderDhakaWageSvg();
  }
  return `<img class="sec-art" src="${artDataUri(artFile)}" style="object-position:${pos ?? 'center'}" alt="${esc(alt)}" />`;
}

function renderHtml(): string {
  const flagships = LEAD_STORIES.filter((s) => s.tier === 'flagship');
  const secondaries = LEAD_STORIES.filter((s) => s.tier === 'secondary');
  const mapSvg = renderWorldMapSvg(buildPins(), 296, 178);

  const regionBarHtml = REGION_BAR.map(
    (r) => `<div class="reg-seg" style="flex:${r.count};background:${r.color}">${esc(r.label)}</div>`,
  ).join('');

  const kpiHtml = KPI_STATS.map(
    (k) => `
      <div class="kpi-card" style="border-top-color:${k.accent}">
        <div class="kpi-big" style="color:${k.accent}">${esc(k.big)}</div>
        <div class="kpi-desc">${esc(k.desc)}</div>
      </div>
    `,
  ).join('');

  const flagshipHtml = flagships
    .map((s) => {
      const color = BEAT_COLORS[s.beat];
      return `
        <article class="hero-card">
          <div class="hero-art-box">
            <img class="hero-art" src="${artDataUri(s.artFile)}" style="object-position:${s.artPos ?? 'center'}" alt="${esc(s.headline)}" />
            <span class="pin-circle" style="background:${color}">${s.pin}</span>
            <span class="stat-ribbon">${esc(s.statTag)}</span>
          </div>
          <div class="card-meta">
            <span class="loc-tag" style="color:${color}">${esc(s.locationLabel)}</span>
            ${statusBadge(s.status)}
          </div>
          <h2 class="hero-h">${esc(s.headline)}</h2>
          <p class="hero-p">${esc(s.summary)} <span class="src-inline">(${esc(s.source)})</span></p>
        </article>
      `;
    })
    .join('\n');

  const secondaryHtml = secondaries
    .map((s) => {
      const color = BEAT_COLORS[s.beat];
      return `
        <article class="sec-card">
          <div class="sec-art-box">
            ${artOrSvg(s.artFile, s.headline, s.artPos)}
            <span class="pin-circle pin-sm" style="background:${color}">${s.pin}</span>
            <span class="stat-ribbon rib-sm">${esc(s.statTag)}</span>
          </div>
          <div class="card-meta meta-sm">
            <span class="loc-sm" style="color:${color}">${esc(s.locationLabel)}</span>
            ${statusBadge(s.status, true)}
          </div>
          <h3 class="sec-h">${esc(s.headline)}</h3>
          <p class="sec-p">${esc(s.summary)} <span class="src-inline">(${esc(s.source)})</span></p>
        </article>
      `;
    })
    .join('\n');

  const leftWire = WIRE_STORIES.slice(0, 11);
  const rightWire = WIRE_STORIES.slice(11, 22);

  const renderWireCol = (items: typeof WIRE_STORIES) =>
    items
      .map((w) => {
        const badge = w.status === 'CLAIM' ? ` ${statusBadge('CLAIM', true)}` : '';
        return `
          <div class="w-row">
            <span class="w-num">${w.num}</span><strong class="w-place">${esc(w.place)}:</strong> ${esc(w.text)}${badge} <span class="w-src">(${esc(w.source)})</span>
          </div>
        `;
      })
      .join('');

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
    background: #F6F3EB;
    color: #11151C;
    font-family: 'Segoe UI', Calibri, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  .page {
    width: 1024px;
    height: 1024px;
    padding: 8px 10px 7px 10px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    background: #F6F3EB;
  }

  /* MASTHEAD */
  .mast-top {
    display: flex;
    justify-content: space-between;
    font-size: 9.2px;
    font-weight: 800;
    letter-spacing: 0.85px;
    color: #9B1C1C;
    border-bottom: 1px solid #C8C0AE;
    padding-bottom: 1.5px;
  }
  .mast-top-r { color: #1A365D; letter-spacing: 0.55px; }
  .mast-title {
    font-family: Georgia, Cambria, 'Times New Roman', serif;
    font-size: 56px;
    font-weight: 700;
    line-height: 0.95;
    text-align: center;
    letter-spacing: -0.7px;
    color: #0D121A;
    margin: 1px 0 1px 0;
  }
  .mast-deck {
    font-family: Georgia, Cambria, serif;
    font-size: 11.4px;
    font-weight: 700;
    text-align: center;
    color: #8C1D18;
    border-top: 1px solid #D4CCB8;
    border-bottom: 2px solid #11151C;
    padding: 2px 0 2.5px 0;
  }

  /* KPI ROW + REGION + UTC STRIP */
  .kpi-row {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 5px;
    height: 46px;
  }
  .kpi-card {
    background: #FFFFFF;
    border: 1px solid #C6BEAD;
    border-top: 3px solid #1A365D;
    padding: 2.5px 5.5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .kpi-big {
    font-family: Georgia, Cambria, serif;
    font-size: 16.5px;
    font-weight: 800;
    line-height: 1.04;
  }
  .kpi-desc {
    font-size: 8.1px;
    line-height: 1.12;
    color: #242D3B;
    font-weight: 600;
  }
  .strip-wrap {
    display: flex;
    flex-direction: column;
    gap: 2.5px;
  }
  .reg-bar {
    display: flex;
    height: 14px;
    gap: 1.5px;
  }
  .reg-seg {
    color: #FFFFFF;
    font-size: 7.5px;
    font-weight: 800;
    letter-spacing: 0.25px;
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
  }
  .utc-bar {
    background: #12233B;
    color: #F7F4EC;
    font-size: 8.6px;
    font-weight: 700;
    padding: 2.5px 8px;
    display: flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
    overflow: hidden;
  }
  .utc-tag {
    background: #B42318;
    color: #FFFFFF;
    font-size: 7.8px;
    font-weight: 800;
    padding: 0.5px 5px;
    border-radius: 2px;
    letter-spacing: 0.4px;
    flex-shrink: 0;
  }

  /* HERO TRIO (3 LARGE ILLUSTRATED CARDS) */
  .hero-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 7px;
    height: 204px;
  }
  .hero-card {
    background: #FFFFFF;
    border: 1px solid #C2BAA8;
    padding: 5px 6px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
  }
  .hero-art-box {
    position: relative;
    width: 100%;
    height: 98px;
    border: 1px solid #1E293B;
    overflow: hidden;
    background: #12233B;
  }
  .hero-art {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .stat-ribbon {
    position: absolute;
    bottom: 3px;
    right: 3px;
    background: rgba(14, 24, 42, 0.90);
    color: #FFFFFF;
    font-size: 8.8px;
    font-weight: 800;
    letter-spacing: 0.4px;
    padding: 2px 6px;
    border-radius: 2px;
  }
  .rib-sm {
    font-size: 8.2px;
    padding: 1.5px 5px;
    bottom: 2.5px;
    right: 2.5px;
  }
  .pin-circle {
    position: absolute;
    top: 4px;
    left: 4px;
    width: 19px;
    height: 19px;
    border-radius: 50%;
    color: #FFFFFF;
    font-size: 10.5px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1.5px solid #F6F3EB;
  }
  .pin-sm { width: 17px; height: 17px; font-size: 9.2px; top: 3px; left: 3px; }
  .card-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 2px;
  }
  .meta-sm { margin-top: 1.5px; }
  .loc-tag {
    font-size: 8.1px;
    font-weight: 800;
    letter-spacing: 0.35px;
    text-transform: uppercase;
  }
  .loc-sm {
    font-size: 7.4px;
    font-weight: 800;
    letter-spacing: 0.25px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .ep-badge {
    font-family: Consolas, 'Segoe UI', monospace;
    font-size: 7.3px;
    font-weight: 800;
    padding: 0.5px 4.5px;
    border: 1px solid;
    border-radius: 2px;
    flex-shrink: 0;
  }
  .ep-sm { font-size: 6.7px; padding: 0 3.5px; }
  .hero-h {
    font-family: Georgia, Cambria, serif;
    font-size: 15.2px;
    font-weight: 700;
    line-height: 1.1;
    color: #0E131B;
  }
  .hero-p {
    font-size: 9.5px;
    line-height: 1.18;
    color: #1F2937;
  }
  .src-inline {
    font-size: 8.1px;
    font-weight: 700;
    color: #64748B;
  }

  /* 8 SECONDARY ILLUSTRATED CARDS (2 ROWS x 4 COLS) */
  .sec-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(2, 134px);
    gap: 6px;
    height: 274px;
  }
  .sec-card {
    background: #FFFFFF;
    border: 1px solid #C2BAA8;
    padding: 4.5px 5.5px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
  }
  .sec-art-box {
    position: relative;
    width: 100%;
    height: 58px;
    border: 1px solid #263143;
    overflow: hidden;
    background: #F6F3EB;
  }
  .sec-art {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .sec-h {
    font-family: Georgia, Cambria, serif;
    font-size: 11.6px;
    font-weight: 700;
    line-height: 1.1;
    color: #0E131B;
  }
  .sec-p {
    font-size: 8.85px;
    line-height: 1.16;
    color: #242D3B;
  }

  /* BOTTOM BAND: BIG-PIN MAP + 2 WIDE CRISP WIRE COLUMNS (22 STORIES) */
  .bottom-band {
    flex: 1;
    display: grid;
    grid-template-columns: 308px 1fr;
    gap: 7px;
    min-height: 0;
  }
  .box {
    background: #FFFFFF;
    border: 1px solid #C2BAA8;
    padding: 4.5px 6px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
  }
  .box-hdr {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 8.6px;
    font-weight: 800;
    letter-spacing: 0.55px;
    color: #12233B;
    border-bottom: 1.5px solid #12233B;
    padding-bottom: 2px;
    margin-bottom: 3px;
    white-space: nowrap;
  }
  .map-foot {
    font-size: 7.7px;
    color: #475569;
    font-weight: 600;
    display: flex;
    justify-content: space-between;
    margin-top: 2px;
  }
  .lg-dot { display: inline-block; width: 6px; height: 6px; border-radius: 50%; margin-right: 2px; vertical-align: middle; }
  .wire-grid {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    min-height: 0;
  }
  .wire-col {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .wire-col:first-child {
    border-right: 1px dotted #D5CEBE;
    padding-right: 8px;
  }
  .w-row {
    font-size: 8.65px;
    line-height: 1.16;
    color: #1A222E;
  }
  .w-num {
    display: inline-block;
    font-weight: 800;
    color: #9B1C1C;
    margin-right: 3px;
    font-size: 8.6px;
  }
  .w-place { color: #0E131B; font-weight: 800; }
  .w-src { color: #64748B; font-size: 7.7px; font-weight: 700; }

  /* DATE CHECK FOOTER */
  .date-footer {
    height: 36px;
    background: #FFFFFF;
    border: 1px solid #C2BAA8;
    border-left: 4px solid #9B1C1C;
    padding: 3px 7px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1.5px;
  }
  .df-line1 {
    font-size: 8.1px;
    line-height: 1.15;
    color: #11151C;
  }
  .df-line1 strong { color: #9B1C1C; letter-spacing: 0.4px; margin-right: 4px; }
  .df-line2 {
    font-size: 7.45px;
    line-height: 1.12;
    color: #475569;
    display: flex;
    justify-content: space-between;
  }
  .df-line2 strong { color: #12233B; }
</style>
</head>
<body>
  <div class="page">
    <header>
      <div class="mast-top">
        <span>THE WORLD IN ONE DAY · 2026-11-25 (00:00–23:59 UTC)</span>
        <span class="mast-top-r">${EDITION_META.storyCount} VERIFIED STORIES · ${EDITION_META.regionCount} REGIONS · ${EDITION_META.beatCount} BEATS · ALL FROM WEDNESDAY 25 NOV 2026</span>
      </div>
      <h1 class="mast-title">${esc(EDITION_META.dateLong)}</h1>
      <div class="mast-deck">${esc(EDITION_META.deck)}</div>
    </header>

    <section class="kpi-row">${kpiHtml}</section>

    <div class="strip-wrap">
      <div class="reg-bar">${regionBarHtml}</div>
      <div class="utc-bar"><span class="utc-tag">25 NOV UTC</span><span>${esc(EDITION_META.utcStrip)}</span></div>
    </div>

    <section class="hero-grid">${flagshipHtml}</section>

    <section class="sec-grid">${secondaryHtml}</section>

    <section class="bottom-band">
      <div class="box">
        <div class="box-hdr">
          <span>WHERE IT HAPPENED · STORIES 1–11</span>
          <span style="font-size:7.4px;color:#475569;font-weight:700;">10 Regions</span>
        </div>
        ${mapSvg}
        <div class="map-foot">
          <span><i class="lg-dot" style="background:#1A365D"></i>Trade/Pol</span>
          <span><i class="lg-dot" style="background:#B42318"></i>War/Mkt</span>
          <span><i class="lg-dot" style="background:#B45309"></i>Disaster</span>
          <span><i class="lg-dot" style="background:#1B5E4B"></i>Sci/Space</span>
        </div>
      </div>

      <div class="box">
        <div class="box-hdr">
          <span>ALSO ON WEDNESDAY 25 NOVEMBER 2026 · 22 MORE VERIFIED STORIES</span>
          <span style="font-size:7.6px;color:#475569;font-weight:700;">Americas · Europe · MENA · Africa · Asia-Pacific</span>
        </div>
        <div class="wire-grid">
          <div class="wire-col">${renderWireCol(leftWire)}</div>
          <div class="wire-col">${renderWireCol(rightWire)}</div>
        </div>
      </div>
    </section>

    <footer class="date-footer">
      <div class="df-line1"><strong>DATE CHECK:</strong> ${esc(EDITION_META.dateCheck)}</div>
      <div class="df-line2">
        <span><strong>OFFICIAL</strong> = authority’s own figure/act · <strong>REPORTED</strong> = press/agency report · <strong>CLAIM</strong> = one side’s account · All 11 illustrations original</span>
        <span><strong>Sources:</strong> USTR · Ofgem · BEA · ABS · EC · ESA · WHO · UN · OPCW · Reuters · AP · Al Jazeera · Guardian · CNSA · UEFA</span>
      </div>
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

  const htmlPath = resolve(BUILD_DIR, 'broadsheet_v3.html');
  const rawPng = resolve(BUILD_DIR, 'raw_v3_1024.png');
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

  const optScript = `
from PIL import Image
import pathlib
raw = pathlib.Path(r"${rawPng}")
out_png = pathlib.Path(r"${OUT_PNG}")
prev_300 = pathlib.Path(r"${BUILD_DIR}") / "preview_v3_300.png"
im = Image.open(raw).convert("RGB")
assert im.size == (1024, 1024), f"Unexpected size {im.size}"
im.save(out_png, format="PNG", optimize=True, compress_level=9)
size_rgb = out_png.stat().st_size
if size_rgb > 950_000:
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
  console.log(`Final v3 entry.png size: ${finalSize} bytes (${(finalSize / 1024).toFixed(1)} KiB)`);
}

main();
