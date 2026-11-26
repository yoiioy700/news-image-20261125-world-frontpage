export type RegionId =
  | 'NA'
  | 'LATAM'
  | 'EUR'
  | 'ME'
  | 'NAFR'
  | 'SSAFR'
  | 'EASIA'
  | 'SASIA'
  | 'SEASIA'
  | 'OCE';

export type BeatCategory = 'trade' | 'conflict' | 'disaster' | 'science' | 'policy' | 'markets';

export type EpistemicTag = 'OFFICIAL' | 'REPORTED' | 'CLAIM';

export interface LeadStory {
  id: string;
  pin: number;
  tier: 'flagship' | 'secondary';
  region: RegionId;
  locationLabel: string;
  beat: BeatCategory;
  status: EpistemicTag;
  statTag: string;
  headline: string;
  summary: string;
  source: string;
  artFile: string;
  artPos?: string;
  lat: number;
  lon: number;
}

export interface WireStory {
  num: number;
  region: RegionId;
  place: string;
  text: string;
  source: string;
  status?: EpistemicTag;
  beat: BeatCategory;
}

export interface KpiStat {
  big: string;
  desc: string;
  accent: string;
}

export interface RegionBarItem {
  label: string;
  count: number;
  color: string;
}

export const EDITION_META = {
  dateLong: 'Wednesday 25 November 2026',
  dateIso: '2026-11-25',
  storyCount: 33,
  regionCount: 10,
  beatCount: 16,
  deck: 'AI doubts sink Asian chips (KOSPI −6.16%) · Pakistan’s 1st astronaut docks at Tiangong · US proposes 15%–35% tariffs on 14 economies',
  utcStrip:
    '00:18 Shenzhou-24 launch · 00:30 AU CPI 4.9% · 03:56 Tiangong dock · 06:30 KOSPI −6.16% · 07:00 UK Cap £2,166 · 13:30 US GDP 4.3% · 15:00 US Tariffs · 20:30 Kyiv & UCL',
  dateCheck:
    'Every story occurred or was first reported Wednesday 25 Nov 2026 (UTC). Left out as earlier news: Nvidia CEO Huang reinstated (Mon 23) · Sinner surgery, Hungary PM Magyar in Ukraine, Sarkozy trial & Hodeidah onset (Tue 24).',
};

export const REGION_BAR: RegionBarItem[] = [
  { label: 'N. AMERICA 4', count: 4, color: '#1A365D' },
  { label: 'LATAM 4', count: 4, color: '#2B5B84' },
  { label: 'EUROPE 7', count: 7, color: '#3B5998' },
  { label: 'M. EAST 4', count: 4, color: '#9B1C1C' },
  { label: 'AFRICA 4', count: 4, color: '#C26D1F' },
  { label: 'E. ASIA 4', count: 4, color: '#1B5E4B' },
  { label: 'S. ASIA 2', count: 2, color: '#2E7D62' },
  { label: 'SE ASIA 2', count: 2, color: '#4A7C59' },
  { label: 'OCEANIA 2', count: 2, color: '#5A4A78' },
];

export const KPI_STATS: KpiStat[] = [
  { big: '−6.16%', desc: 'KOSPI close (4,698), Asian AI chip rout', accent: '#B42318' },
  { big: '+26%', desc: 'UK Jan energy cap jumps to £2,166/yr', accent: '#1A365D' },
  { big: '31+ dead', desc: 'Fuel tanker blaze on Cairo Ring Road', accent: '#B45309' },
  { big: '15–35%', desc: 'Proposed US tariffs on 14 economies', accent: '#2B4C7E' },
  { big: '13 dead', desc: 'West Java flooded gold pit; 10+ missing', accent: '#9A5B13' },
  { big: '17,000৳', desc: 'Bangladesh garment wage lifted +36%', accent: '#1B5E4B' },
];

export const LEAD_STORIES: LeadStory[] = [
  // TOP 3 FLAGSHIP HEROES
  {
    id: 'kospi-chips',
    pin: 1,
    tier: 'flagship',
    region: 'EASIA',
    locationLabel: 'SEOUL · TAIPEI · TOKYO · MARKETS',
    beat: 'markets',
    status: 'OFFICIAL',
    statTag: 'KOSPI −6.16% · TAIEX −5%',
    headline: 'AI doubts sink Asian chips: KOSPI plunges\u00A06.16%',
    summary:
      'Seoul closes at 4,697.51 after sidecar halt as Samsung & SK Hynix fall >9%; Taiex drops ~5% (TSMC) and Nikkei hits 5-month low (−2.8%).',
    source: 'KRX · Reuters',
    artFile: '03_chips.png',
    artPos: 'center 48%',
    lat: 37.56,
    lon: 126.97,
  },
  {
    id: 'shenzhou-24',
    pin: 2,
    tier: 'flagship',
    region: 'EASIA',
    locationLabel: 'JIUQUAN, CHINA · SPACE',
    beat: 'science',
    status: 'OFFICIAL',
    statTag: 'FIRST FOREIGNER · 03:56 UTC',
    headline: 'Pakistan’s 1st astronaut docks at\u00A0Tiangong',
    summary:
      'PAF pilot Muhammad Zeeshan Ali launches aboard Shenzhou-24 (00:18 UTC) and docks (03:56 UTC), becoming first foreigner on China’s station.',
    source: 'CNSA · Al Jazeera',
    artFile: '02_tiangong.png',
    artPos: 'center 42%',
    lat: 40.96,
    lon: 100.29,
  },
  {
    id: 'us-tariffs',
    pin: 3,
    tier: 'flagship',
    region: 'NA',
    locationLabel: 'WASHINGTON · GLOBAL TRADE',
    beat: 'trade',
    status: 'OFFICIAL',
    statTag: '14 ECONOMIES · 15%–35%',
    headline: 'US proposes Section 301 tariffs on 14\u00A0economies',
    summary:
      'USTR proposes up to 15% (EU, Japan, S. Korea, Taiwan), 20% (China), 25% (India), 35% (Vietnam); EU rejects overcapacity claim, Beijing urges talks.',
    source: 'USTR · Guardian',
    artFile: '01_tariffs.png',
    artPos: 'center 52%',
    lat: 38.9,
    lon: -77.0,
  },

  // 8 ILLUSTRATED SECONDARY CARDS (2 ROWS x 4 COLUMNS)
  {
    id: 'uk-energy-cap',
    pin: 4,
    tier: 'secondary',
    region: 'EUR',
    locationLabel: 'LONDON · ENERGY',
    beat: 'policy',
    status: 'OFFICIAL',
    statTag: '+26% · £2,166',
    headline: 'UK energy cap jumps 26% to\u00A0£2,166',
    summary: 'Ofgem lifts annual bill +£443 from Jan 2027, topping £2k on Mideast gas shock.',
    source: 'Ofgem',
    artFile: '04_uk_energy.png',
    artPos: 'center 68%',
    lat: 51.5,
    lon: -0.12,
  },
  {
    id: 'cairo-tanker',
    pin: 5,
    tier: 'secondary',
    region: 'NAFR',
    locationLabel: 'GIZA, EGYPT · DISASTER',
    beat: 'disaster',
    status: 'REPORTED',
    statTag: '31+ DEAD',
    headline: 'Cairo Ring Road tanker fire kills\u00A031+',
    summary: 'Overturned fuel & gas truck explodes in Al-Warraq, engulfing vehicles; 20+ hurt.',
    source: 'AP · Guardian',
    artFile: '05_cairo.png',
    artPos: 'center 64%',
    lat: 30.09,
    lon: 31.21,
  },
  {
    id: 'ras-tanura',
    pin: 6,
    tier: 'secondary',
    region: 'ME',
    locationLabel: 'RAS TANURA · CONFLICT',
    beat: 'conflict',
    status: 'REPORTED',
    statTag: '4 DRONES DOWNED',
    headline: 'Saudis down 4 drones over Ras\u00A0Tanura',
    summary: 'Coalition intercepts Houthi drones after overnight Hodeidah strikes; Hormuz alerts.',
    source: 'CNA · Argus',
    artFile: '06_redsea.png',
    artPos: 'center 62%',
    lat: 26.64,
    lon: 50.16,
  },
  {
    id: 'west-java-mine',
    pin: 7,
    tier: 'secondary',
    region: 'SEASIA',
    locationLabel: 'BOGOR, INDONESIA · DISASTER',
    beat: 'disaster',
    status: 'REPORTED',
    statTag: '13 DEAD · 100m PIT',
    headline: 'Flooded West Java gold mine toll hits\u00A013',
    summary: 'Basarnas recovers more miners from flooded Nanggung shaft; 11 escaped, 10+ trapped.',
    source: 'Basarnas · AP',
    artFile: '07_westjava.png',
    artPos: 'center 52%',
    lat: -6.59,
    lon: 106.56,
  },
  {
    id: 'ukraine-grid',
    pin: 8,
    tier: 'secondary',
    region: 'EUR',
    locationLabel: 'UKRAINE · WAR & NUCLEAR',
    beat: 'conflict',
    status: 'REPORTED',
    statTag: 'ZNPP ON DIESEL',
    headline: 'Zaporizhzhia on diesel; Kyiv mall\u00A0struck',
    summary: 'Russian strikes cut external nuclear power (17th loss in 2026); Ukraine hits refineries.',
    source: 'Kyiv Post · ISW',
    artFile: '09_ukraine_grid.png',
    artPos: 'center 76%',
    lat: 47.51,
    lon: 34.58,
  },
  {
    id: 'eu-quantum',
    pin: 9,
    tier: 'secondary',
    region: 'EUR',
    locationLabel: 'BRUSSELS · TECH POLICY',
    beat: 'science',
    status: 'OFFICIAL',
    statTag: '€50B TECH FUND',
    headline: 'EU unveils Quantum Act & €50B\u00A0fund',
    summary: 'Commission proposes Sovereign Tech Equity Fund to scale EU quantum, chips & AI.',
    source: 'European Comm.',
    artFile: '08_eu_quantum.png',
    artPos: 'center 50%',
    lat: 50.85,
    lon: 4.35,
  },
  {
    id: 'solomon-pact',
    pin: 10,
    tier: 'secondary',
    region: 'OCE',
    locationLabel: 'CANBERRA · DIPLOMACY',
    beat: 'policy',
    status: 'OFFICIAL',
    statTag: 'NO FOREIGN BASES',
    headline: 'Australia & Solomons sign security\u00A0pact',
    summary: 'PMs Albanese & Wale name Australia primary security partner, barring foreign bases.',
    source: 'DFAT · Al Jazeera',
    artFile: '10_solomon_pact.png',
    artPos: 'center 40%',
    lat: -9.44,
    lon: 159.97,
  },
  {
    id: 'dhaka-wage',
    pin: 11,
    tier: 'secondary',
    region: 'SASIA',
    locationLabel: 'DHAKA · LABOUR',
    beat: 'policy',
    status: 'OFFICIAL',
    statTag: '17,000৳ (+36%)',
    headline: 'Bangladesh lifts garment wage to\u00A017,000৳',
    summary: 'Wage board votes 4–2 ($136/mo, up from 12,500৳) effective 1 Dec after strikes.',
    source: 'WashPost · CNA',
    artFile: '11_dhaka_wage.png',
    artPos: 'center 50%',
    lat: 23.81,
    lon: 90.41,
  },
];

export const WIRE_STORIES: WireStory[] = [
  // LEFT COLUMN (12–22: Americas & Europe)
  {
    num: 12,
    region: 'NA',
    place: 'Washington',
    text: 'US Q3 GDP revised up to 4.3% on AI spend; Oct PCE hits 3.8%, lifting Fed hike odds (Dow >50k).',
    source: 'BEA · CNN',
    beat: 'markets',
  },
  {
    num: 13,
    region: 'NA',
    place: 'US Coasts',
    text: 'Thanksgiving Nor’easter disrupts travel (60 mph gusts); CA king tides collapse Pacifica Pier.',
    source: 'Fox · KQED',
    beat: 'disaster',
  },
  {
    num: 14,
    region: 'NA',
    place: 'New York',
    text: 'Brooklyn federal jury convicts Huawei on 10 of 12 trade-secret & bank-fraud counts; no RICO.',
    source: 'Evertiq · Time',
    beat: 'policy',
  },
  {
    num: 15,
    region: 'LATAM',
    place: 'Caracas',
    text: 'Venezuela discloses $237.5B public debt (~242% of GDP) to open sovereign restructuring.',
    source: 'BondBlox',
    beat: 'markets',
  },
  {
    num: 16,
    region: 'LATAM',
    place: 'Brasília',
    text: 'Brazil rejects US 10% Embraer jet tariff threat & curbs card debt; Paraná floods kill 6.',
    source: 'Guardian · Xinhua',
    beat: 'trade',
  },
  {
    num: 17,
    region: 'LATAM',
    place: 'Cartagena',
    text: 'Colombian forces storm supermarket in dawn raid freeing all hostages; one captor killed.',
    source: 'CBS · AP',
    beat: 'conflict',
  },
  {
    num: 18,
    region: 'LATAM',
    place: 'Mexico / Cuba',
    text: 'Sheinbaum marks 25 Nov anti-GBV day; WHO chief urges lifting US fuel blockade on Cuba.',
    source: 'MX Daily · AJ',
    beat: 'policy',
  },
  {
    num: 19,
    region: 'EUR',
    place: 'London',
    text: 'Poundland enters administration risking 11,000 jobs; BoE warns UK food inflation may hit 3–5%.',
    source: 'Indep. · BoE',
    beat: 'markets',
  },
  {
    num: 20,
    region: 'EUR',
    place: 'Paris',
    text: 'Surprise Eurostar staff strike over pay cancels high-speed London–Paris–Brussels trains.',
    source: 'AA · CTV',
    beat: 'policy',
  },
  {
    num: 21,
    region: 'EUR',
    place: 'Warsaw / Hague',
    text: 'Poland plans Ukraine-border no-fly zone; 34 nations at OPCW press Russia over frontline tear gas.',
    source: 'RBC · Guardian',
    beat: 'conflict',
  },
  {
    num: 22,
    region: 'EUR',
    place: 'Europe · UCL',
    text: 'Lille deal Bayern 1st loss (2–1); Sporting 2–2 Man Utd; Roma hold PSG 2–2; Barça beat Sabah 4–1.',
    source: 'UEFA · Guardian',
    beat: 'science',
  },

  // RIGHT COLUMN (23–33: Middle East, Africa, Asia-Pacific & Science/Health)
  {
    num: 23,
    region: 'ME',
    place: 'Jerusalem',
    text: 'Court judges urge dropping Netanyahu Case 4000 bribery counts; PM calls for trial’s end.',
    source: 'Al-Monitor · ToI',
    beat: 'policy',
  },
  {
    num: 24,
    region: 'ME',
    place: 'Gaza / UN',
    text: 'Strike near Shati kills Hamas security chief Abu al-Awf; UN tribunal faults 2024 UNRWA firings.',
    source: 'New Arab · Guardian',
    beat: 'conflict',
  },
  {
    num: 25,
    region: 'ME',
    place: 'Hormuz / Beirut',
    text: 'IRGC says 2 tankers hit mines near Hormuz; Brent ~$91; Lebanon plans Kleiat 2nd airport.',
    source: 'UKMTO · AA',
    status: 'CLAIM',
    beat: 'conflict',
  },
  {
    num: 26,
    region: 'SSAFR',
    place: 'Pretoria',
    text: 'South African high court voids 2022 “Farmgate” panel report, lifting Ramaphosa impeachment cloud.',
    source: 'Courthouse News',
    beat: 'policy',
  },
  {
    num: 27,
    region: 'SSAFR',
    place: 'Ed Damazin',
    text: '40+ RSF-attributed drone strikes kill 14–19 civilians in Sudan’s Blue Nile, displacing thousands.',
    source: 'Sudan Tribune',
    beat: 'conflict',
  },
  {
    num: 28,
    region: 'SSAFR',
    place: 'Lagos / Lusaka',
    text: 'Lagos launches AI “Bioshield” Ebola/Lassa tracker; Zambia cholera reaches 3,730 cases (83 dead).',
    source: 'Lagos · ZNPHI',
    beat: 'science',
  },
  {
    num: 29,
    region: 'OCE',
    place: 'Sydney / NZ',
    text: 'Australia Oct CPI accelerates to 4.9% (core 3.8%) curbing RBA cut hopes; M5.2 quake off NZ.',
    source: 'ABS · QNA',
    beat: 'markets',
  },
  {
    num: 30,
    region: 'SEASIA',
    place: 'Kuala Lumpur',
    text: 'Malaysia’s MCMC files RM600M ($146M) civil suits against Google over YouTube gambling & scams.',
    source: 'SCMP · NST',
    beat: 'policy',
  },
  {
    num: 31,
    region: 'EASIA',
    place: 'Pyongyang / Seoul',
    text: 'N. Korea gives Swiss envoy 48h to leave; Kim inspects nuclear sites; S. Korea drafts bank stablecoins.',
    source: 'AA · CNN · FDD',
    beat: 'conflict',
  },
  {
    num: 32,
    region: 'EASIA',
    place: 'Taipei / Delhi',
    text: 'M5.5 quake shakes southern Taiwan; World Bank backs India bonds; Pakistan logs 10th polio case.',
    source: 'TW News · WB',
    beat: 'disaster',
  },
  {
    num: 33,
    region: 'EUR',
    place: 'Space / WHO',
    text: 'ESA’s Hera images stadium-sized DART crater on Dimorphos; WHO backs oral zoliflodacin for gonorrhoea.',
    source: 'ESA · WHO',
    beat: 'science',
  },
];
