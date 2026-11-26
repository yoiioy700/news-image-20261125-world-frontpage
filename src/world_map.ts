import type { BeatCategory } from './stories.ts';

export interface MapPin {
  pin: number;
  label: string;
  lat: number;
  lon: number;
  beat: BeatCategory;
}

const BEAT_COLORS: Record<BeatCategory, string> = {
  trade: '#1A365D',
  markets: '#9B1C1C',
  policy: '#2B4C7E',
  conflict: '#B42318',
  disaster: '#B45309',
  science: '#1B5E4B',
};

// Clean simplified Natural-Earth-style continent polygons ([lon, lat] degrees)
const CONTINENT_POLYGONS: Array<[number, number][]> = [
  // North America
  [
    [-168, 65], [-162, 70], [-140, 70], [-125, 71], [-108, 68], [-94, 69],
    [-82, 64], [-78, 53], [-64, 60], [-55, 52], [-66, 44], [-70, 41],
    [-76, 35], [-81, 30], [-81, 25], [-84, 30], [-90, 29], [-97, 26],
    [-97, 19], [-90, 21], [-87, 16], [-83, 10], [-78, 8], [-82, 9],
    [-88, 13], [-95, 16], [-105, 20], [-110, 24], [-117, 32], [-124, 40],
    [-124, 48], [-131, 55], [-140, 60], [-152, 59], [-162, 55], [-166, 60],
  ],
  // Greenland
  [
    [-52, 60], [-42, 60], [-32, 68], [-20, 76], [-24, 82], [-44, 83],
    [-60, 78], [-58, 70], [-52, 64],
  ],
  // Cuba / Caribbean hint
  [[-84, 22], [-75, 20], [-76, 22], [-83, 23]],
  // South America
  [
    [-78, 9], [-72, 12], [-62, 10], [-50, 1], [-40, -3], [-35, -8],
    [-39, -15], [-41, -22], [-48, -26], [-54, -34], [-60, -38], [-65, -43],
    [-67, -50], [-69, -55], [-74, -52], [-73, -42], [-71, -30], [-70, -18],
    [-77, -12], [-81, -5], [-79, 2],
  ],
  // UK & Ireland
  [[-6, 50], [1, 51], [1, 53], [-3, 58], [-6, 57], [-5, 52]],
  [[-10, 52], [-6, 52], [-6, 55], [-10, 54]],
  // Europe + Scandinavia + Russia + Asia mainland
  [
    [-9, 37], [-9, 43], [-2, 43], [-4, 48], [2, 51], [8, 54], [10, 57],
    [5, 60], [11, 64], [18, 69], [28, 71], [32, 68], [25, 65], [21, 60],
    [28, 60], [42, 66], [60, 69], [75, 72], [104, 77], [135, 72], [168, 68],
    [176, 65], [162, 60], [156, 52], [142, 54], [135, 44], [129, 35],
    [126, 38], [122, 40], [122, 31], [118, 24], [110, 20], [108, 12],
    [104, 10], [100, 14], [103, 1], [99, 6], [96, 16], [90, 22], [84, 18],
    [80, 8], [75, 12], [72, 22], [66, 25], [58, 25], [56, 23], [60, 22],
    [54, 17], [44, 12], [41, 18], [35, 29], [35, 36], [27, 37], [26, 41],
    [23, 37], [19, 40], [14, 45], [16, 40], [12, 42], [8, 44], [3, 43],
    [-1, 37], [-6, 36],
  ],
  // Africa
  [
    [-17, 15], [-16, 21], [-10, 30], [-6, 36], [4, 37], [11, 37], [12, 33],
    [20, 32], [25, 32], [32, 31], [35, 26], [39, 18], [43, 12], [51, 12],
    [47, 4], [41, -2], [39, -10], [40, -16], [35, -24], [32, -29], [26, -34],
    [18, -34], [14, -22], [12, -12], [9, -2], [9, 4], [2, 6], [-8, 5], [-15, 11],
  ],
  // Madagascar
  [[44, -25], [47, -25], [50, -15], [48, -12], [44, -18]],
  // Japan
  [[130, 31], [136, 34], [141, 36], [142, 41], [145, 44], [140, 42], [137, 37], [131, 34]],
  // Taiwan
  [[120.2, 22], [121.8, 22.5], [122, 25.1], [120.8, 25.1]],
  // Philippines
  [[120, 14], [122.5, 18], [124, 13], [126, 7], [122, 7]],
  // Indonesia (Sumatra, Java, Borneo, Sulawesi)
  [[95, 5], [100, 1], [105, -6], [103, -6], [98, 1]],
  [[105.5, -6], [114.5, -8], [114, -8.8], [105.5, -7]],
  [[109, 1], [117, 6], [118, 0], [115, -3.5], [110, -2.5]],
  [[119, -5], [122, -4], [125, 1], [120, 1]],
  // Papua New Guinea & Solomons
  [[132, -2], [141, -3], [150, -10], [146, -9], [136, -5]],
  [[156, -7], [161, -10], [160, -10.5], [156, -8]],
  // Australia
  [
    [114, -22], [122, -18], [130, -12], [136, -12], [142, -11], [146, -18],
    [153, -27], [150, -37], [141, -38], [135, -34], [126, -32], [115, -34],
    [113, -26],
  ],
  // New Zealand
  [[167, -46], [173, -41], [178, -37], [174, -35], [172, -40], [166, -45]],
];

function project(lon: number, lat: number, w: number, h: number): [number, number] {
  const x = ((lon + 180) / 360) * w;
  // Crop Antarctic below -58 and far Arctic above 78 for clean editorial framing
  const latMin = -56;
  const latMax = 78;
  const clamped = Math.max(latMin, Math.min(latMax, lat));
  const y = ((latMax - clamped) / (latMax - latMin)) * h;
  return [x, y];
}

export function renderWorldMapSvg(pins: MapPin[], width = 296, height = 178): string {
  const graticules: string[] = [];
  for (const lat of [-30, 0, 30, 60]) {
    const [, y] = project(0, lat, width, height);
    graticules.push(
      `<line x1="0" y1="${y.toFixed(1)}" x2="${width}" y2="${y.toFixed(1)}" stroke="#CBD5DF" stroke-width="${lat === 0 ? '0.8' : '0.45'}" ${lat === 0 ? 'stroke-dasharray="3,2"' : ''} />`,
    );
  }
  for (const lon of [-120, -60, 0, 60, 120]) {
    const [x] = project(lon, 0, width, height);
    graticules.push(
      `<line x1="${x.toFixed(1)}" y1="0" x2="${x.toFixed(1)}" y2="${height}" stroke="#CBD5DF" stroke-width="0.45" />`,
    );
  }

  const paths = CONTINENT_POLYGONS.map((poly) => {
    const pts = poly
      .map(([lon, lat]) => {
        const [x, y] = project(lon, lat, width, height);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
    return `<polygon points="${pts}" fill="#DDD6C5" stroke="#8C8473" stroke-width="0.7" stroke-linejoin="round" />`;
  }).join('\n');

  // Clean separation for the 11 illustrated hero pins (zero overlap, 300px legible!)
  const manualNudge: Record<number, [number, number]> = {
    1: [3, 0],
    2: [-2, -3],
    3: [0, 0],
    4: [-8, -6],
    5: [-4, 2],
    6: [6, 3],
    7: [0, 2],
    8: [8, -2],
    9: [5, -1],
    10: [0, 2],
    11: [-2, 1],
  };

  const pinMarkup = pins
    .map((p) => {
      const [bx, by] = project(p.lon, p.lat, width, height);
      const [dx, dy] = manualNudge[p.pin] ?? [0, 0];
      const x = Math.max(9, Math.min(width - 9, bx + dx));
      const y = Math.max(9, Math.min(height - 9, by + dy));
      const fill = BEAT_COLORS[p.beat];
      return `
        <g>
          <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7.4" fill="${fill}" stroke="#F6F3EB" stroke-width="1.5" />
          <text x="${x.toFixed(1)}" y="${(y + 2.9).toFixed(1)}" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="8.4" font-weight="800" fill="#FFFFFF">${p.pin}</text>
        </g>
      `;
    })
    .join('\n');

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="display:block;width:100%;height:${height}px;">
      <rect width="${width}" height="${height}" fill="#E8EFF4" />
      ${graticules.join('\n')}
      ${paths}
      ${pinMarkup}
    </svg>
  `;
}
