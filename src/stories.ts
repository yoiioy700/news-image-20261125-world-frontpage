export type RegionId =
  | 'NA'
  | 'LATAM'
  | 'EUR'
  | 'MENA'
  | 'AFR'
  | 'EASIA'
  | 'SASIA'
  | 'SEASIA'
  | 'OCE';

export type BeatCategory = 'trade' | 'conflict' | 'disaster' | 'science' | 'policy' | 'markets';

export type EpistemicTag = 'CONFIRMED' | 'PROPOSED' | 'REPORTED';

export interface LeadStory {
  id: string;
  pin: number;
  tier: 'flagship' | 'secondary';
  region: RegionId;
  regionLabel: string;
  beat: BeatCategory;
  beatLabel: string;
  utc: string;
  status: EpistemicTag;
  headline: string;
  bullets: string[];
  source: string;
  artFile: string;
  lat: number;
  lon: number;
}

export interface WireStory {
  pin?: number;
  region: RegionId;
  column: 'americas' | 'europe' | 'mena_africa' | 'asia_global';
  kicker: string;
  headline: string;
  detail: string;
  source: string;
  beat: BeatCategory;
  lat?: number;
  lon?: number;
}

export interface TimelineEvent {
  utc: string;
  label: string;
  beat: BeatCategory;
}

export interface MarketMetric {
  label: string;
  value: string;
  delta: string;
  direction: 'up' | 'down' | 'warn';
}

export const EDITION_META = {
  dateLong: 'WEDNESDAY, 25 NOVEMBER 2026',
  dateIso: '2026-11-25',
  utcWindow: '00:00–23:59 UTC',
  storyCount: 36,
  regionCount: 9,
  beatCount: 15,
  dateAudit: 'Every dispatch occurred or was first reported 25 Nov 2026 (UTC). Zero pre-25 Nov events.',
};

export const LEAD_STORIES: LeadStory[] = [
  {
    id: 'us-tariffs',
    pin: 1,
    tier: 'flagship',
    region: 'NA',
    regionLabel: 'GLOBAL TRADE',
    beat: 'trade',
    beatLabel: 'TARIFFS',
    utc: '15:00 UTC',
    status: 'PROPOSED',
    headline: 'US proposes 15%–35% tariffs on 14 economies',
    bullets: [
      'USTR Section 301 targets EU, Japan, S. Korea, Taiwan & Switzerland (up to 15%), China & Singapore (20%), India (25%), Vietnam (35%) over "excess capacity".',
      'EU formally rejects overcapacity claim; Beijing urges equal talks; Brazil protests Embraer & sugar levy threat.',
      'Comments open through 5 Jan 2027; earliest effect Jan 2027.',
    ],
    source: 'USTR · Guardian',
    artFile: '01_tariffs.png',
    lat: 38.9,
    lon: -77.0,
  },
  {
    id: 'shenzhou-24',
    pin: 2,
    tier: 'flagship',
    region: 'EASIA',
    regionLabel: 'SPACE · CHINA / PAKISTAN',
    beat: 'science',
    beatLabel: 'SPACEFLIGHT',
    utc: '03:56 UTC',
    status: 'CONFIRMED',
    headline: 'Pakistan’s 1st astronaut docks at Tiangong',
    bullets: [
      'PAF pilot Muhammad Zeeshan Ali aboard Shenzhou-24 becomes the first foreign visitor on China’s space station.',
      'Launched 00:18 UTC from Jiuquan; automated rapid rendezvous & docking completed at 03:56 UTC.',
      'Presidents Xi Jinping and Asif Ali Zardari hail historic bilateral spaceflight milestone.',
    ],
    source: 'CNSA · Al Jazeera',
    artFile: '02_tiangong.png',
    lat: 40.96,
    lon: 100.29,
  },
  {
    id: 'kospi-chips',
    pin: 3,
    tier: 'secondary',
    region: 'EASIA',
    regionLabel: 'EAST ASIA',
    beat: 'markets',
    beatLabel: 'MARKETS',
    utc: '06:30 UTC',
    status: 'CONFIRMED',
    headline: 'AI doubts sink Asian chips; KOSPI −6.16%',
    bullets: [
      'Seoul’s KOSPI closes at 4,697.51 after sidecar halt; Samsung & SK Hynix tumble >9%.',
      'Taiwan’s Taiex slides ~5% (TSMC hit); Nikkei drops 2.8% to 5-mo low.',
    ],
    source: 'KRX · Chosun',
    artFile: '03_chips.png',
    lat: 37.56,
    lon: 126.97,
  },
  {
    id: 'uk-energy-cap',
    pin: 4,
    tier: 'secondary',
    region: 'EUR',
    regionLabel: 'UK · EUROPE',
    beat: 'policy',
    beatLabel: 'ENERGY',
    utc: '07:00 UTC',
    status: 'CONFIRMED',
    headline: 'UK energy cap jumps 26% to\u00A0£2,166',
    bullets: [
      'Ofgem hikes typical annual bill +£443 from Jan 2027, topping £2k for 1st time since 2023.',
      'Regulator cites surging wholesale gas driven by Middle East conflict.',
    ],
    source: 'Ofgem · Guardian',
    artFile: '04_uk_energy.png',
    lat: 51.5,
    lon: -0.12,
  },
  {
    id: 'cairo-tanker',
    pin: 5,
    tier: 'secondary',
    region: 'MENA',
    regionLabel: 'EGYPT · MENA',
    beat: 'disaster',
    beatLabel: 'DISASTER',
    utc: '08:30 UTC',
    status: 'REPORTED',
    headline: 'Cairo Ring Road tanker fire kills\u00A031+',
    bullets: [
      'Fuel & gas-cylinder tanker overturns and explodes in Al-Warraq, Giza, engulfing vehicles.',
      'At least 31 dead and 20+ injured in one of Egypt’s deadliest road blazes.',
    ],
    source: 'AP · Guardian',
    artFile: '05_cairo.png',
    lat: 30.09,
    lon: 31.21,
  },
  {
    id: 'hodeidah-hormuz',
    pin: 6,
    tier: 'secondary',
    region: 'MENA',
    regionLabel: 'YEMEN / GULF',
    beat: 'conflict',
    beatLabel: 'CONFLICT',
    utc: '11:00 UTC',
    status: 'REPORTED',
    headline: 'Coalition hits Hodeidah; Hormuz mines',
    bullets: [
      'Saudi-led strikes hit Yemen’s port after Riyadh drone hit; 4 drones downed near Ras Tanura.',
      'IRGC claims 2 tankers hit mines near Hormuz; UKMTO logs blast off Dubai.',
    ],
    source: 'CNA · UKMTO',
    artFile: '06_redsea.png',
    lat: 14.8,
    lon: 42.95,
  },
  {
    id: 'west-java-mine',
    pin: 7,
    tier: 'secondary',
    region: 'SEASIA',
    regionLabel: 'INDONESIA',
    beat: 'disaster',
    beatLabel: 'DISASTER',
    utc: '09:00 UTC',
    status: 'REPORTED',
    headline: 'West Java flooded gold mine toll\u00A0hits\u00A013',
    bullets: [
      'Rescuers pull more victims from 100m flooded pit in Nanggung, Bogor (25 Nov update).',
      '11 miners escaped earlier; 10+ remain trapped as Basarnas pumps shafts.',
    ],
    source: 'Basarnas · AJ',
    artFile: '07_westjava.png',
    lat: -6.59,
    lon: 106.56,
  },
  {
    id: 'starmind-quantum',
    pin: 8,
    tier: 'secondary',
    region: 'EUR',
    regionLabel: 'US / EU TECH',
    beat: 'science',
    beatLabel: 'AI & QUANTUM',
    utc: '16:30 UTC',
    status: 'CONFIRMED',
    headline: 'FCC clears SpaceX 1M AI sats; EU\u00A0€50B',
    bullets: [
      'FCC conditionally approves SpaceX “Starmind” orbital solar AI compute constellation.',
      'EU proposes Quantum Act & €50B Sovereign Tech Equity Fund for chips & AI.',
    ],
    source: 'FCC · EC',
    artFile: '08_starmind_quantum.png',
    lat: 50.85,
    lon: 4.35,
  },
];

export const MARKET_METRICS: MarketMetric[] = [
  { label: 'KOSPI', value: '4,698', delta: '−6.16%', direction: 'down' },
  { label: 'TAIEX', value: 'TSMC', delta: '−5.0%', direction: 'down' },
  { label: 'NIKKEI', value: '5-mo low', delta: '−2.8%', direction: 'down' },
  { label: 'US GDP', value: '4.3%', delta: 'PCE 3.8%', direction: 'up' },
  { label: 'BRENT', value: '$91/bbl', delta: '+1.7%', direction: 'warn' },
  { label: 'AU CPI', value: '4.9%', delta: 'Core 3.8%', direction: 'warn' },
];

export const TIMELINE_EVENTS: TimelineEvent[] = [
  { utc: '00:18', label: 'Shenzhou-24', beat: 'science' },
  { utc: '00:30', label: 'AU CPI 4.9%', beat: 'markets' },
  { utc: '03:56', label: 'Tiangong Dock', beat: 'science' },
  { utc: '06:30', label: 'KOSPI −6.16%', beat: 'markets' },
  { utc: '07:00', label: 'UK £2,166', beat: 'policy' },
  { utc: '10:30', label: 'EU Quantum', beat: 'policy' },
  { utc: '13:30', label: 'US GDP/PCE', beat: 'markets' },
  { utc: '15:00', label: 'USTR Tariffs', beat: 'trade' },
  { utc: '17:30', label: 'FCC Starmind', beat: 'science' },
  { utc: '20:30', label: 'Kyiv & UCL', beat: 'conflict' },
];

export const WIRE_STORIES: WireStory[] = [
  // COLUMN 1: AMERICAS (7 crisp stories — zero clipping)
  {
    pin: 9,
    region: 'NA',
    column: 'americas',
    kicker: 'US MACRO',
    headline: 'US Q3 GDP revised to 4.3%; Oct PCE\u00A03.8%',
    detail: 'AI capex lifts growth as sticky inflation raises Dec Fed hike odds; Dow >50k (+0.85%), S&P −0.5%, Gold ~$3,520.',
    source: 'BEA · CNN',
    beat: 'markets',
    lat: 40.71,
    lon: -74.0,
  },
  {
    pin: 10,
    region: 'NA',
    column: 'americas',
    kicker: 'US WEATHER',
    headline: 'Thanksgiving Nor’easter & CA Pacifica Pier collapse',
    detail: 'East Coast storm disrupts holiday travel with 60 mph gusts; 20–30 ft king tides collapse part of Pacifica Pier.',
    source: 'Fox · KQED',
    beat: 'disaster',
    lat: 37.61,
    lon: -122.49,
  },
  {
    region: 'NA',
    column: 'americas',
    kicker: 'US COURTS',
    headline: 'Brooklyn jury convicts Huawei on 10 of 12 counts',
    detail: 'Guilty of trade-secret theft conspiracy & bank fraud/Iran sanction breaches; acquitted on racketeering.',
    source: 'Evertiq · Time',
    beat: 'policy',
  },
  {
    pin: 11,
    region: 'LATAM',
    column: 'americas',
    kicker: 'VENEZUELA',
    headline: 'Caracas discloses $237.5B public debt (242% GDP)',
    detail: 'New macroeconomic framework initiates major sovereign debt restructuring talks.',
    source: 'BondBlox',
    beat: 'markets',
    lat: 10.48,
    lon: -66.9,
  },
  {
    pin: 12,
    region: 'LATAM',
    column: 'americas',
    kicker: 'BRAZIL',
    headline: 'Brazil rejects Embraer/sugar tariffs; CMN curbs debt',
    detail: 'Brasília refuses to yield to USTR; Central Bank tightens revolving credit-card debt rules.',
    source: 'Guardian · CMN',
    beat: 'trade',
    lat: -15.79,
    lon: -47.88,
  },
  {
    region: 'LATAM',
    column: 'americas',
    kicker: 'COLOMBIA',
    headline: 'Cartagena store hostages freed in dawn raid',
    detail: 'Forces storm supermarket early Wed ending 17-hr siege; all hostages safe, one captor killed.',
    source: 'CBS · Guardian',
    beat: 'conflict',
  },
  {
    region: 'LATAM',
    column: 'americas',
    kicker: 'MX · CA · CUBA',
    headline: 'Sheinbaum 25 Nov safety drive; WHO on Cuba; Canada +23%',
    detail: 'Mexico backs Chiapas coffee growers; WHO chief urges ending US Cuba fuel blockade; Canada canola crush +23%; PAHO mpox alert.',
    source: 'MX · AJ · PAHO',
    beat: 'policy',
  },

  // COLUMN 2: EUROPE & EURASIA (7 crisp stories)
  {
    pin: 13,
    region: 'EUR',
    column: 'europe',
    kicker: 'UKRAINE WAR',
    headline: 'Russian evening missiles hit Kyiv shopping center',
    detail: 'Desnianskyi district struck after Ukrainian strikes hit Savasleyka air base (5 jets reportedly damaged) & Syzran refinery.',
    source: 'Kyiv Ind. · ISW',
    beat: 'conflict',
    lat: 50.45,
    lon: 30.52,
  },
  {
    region: 'EUR',
    column: 'europe',
    kicker: 'EU SANCTIONS',
    headline: 'EU blacklists 15 Russian defense firms on tech curbs',
    detail: 'Council tightens dual-use export controls; Brussels hosts EU–Western Balkans integration summit.',
    source: 'EU Council',
    beat: 'policy',
  },
  {
    region: 'EUR',
    column: 'europe',
    kicker: 'GERMANY',
    headline: 'Merz warns Bundestag Russian aims go beyond Ukraine',
    detail: 'Chancellor uses 2027 budget debate to press for sustained European defense readiness and Kyiv support.',
    source: 'CNA · JustSec',
    beat: 'policy',
  },
  {
    region: 'EUR',
    column: 'europe',
    kicker: 'UK FINANCE',
    headline: 'BoE warns UK food inflation may climb to 3%–5%',
    detail: 'Deputy Gov. Lombardelli cites cost & El Niño risks; PRA/FCA unveil growth-friendly securitisation rules.',
    source: 'Guardian · BoE',
    beat: 'markets',
  },
  {
    region: 'EUR',
    column: 'europe',
    kicker: 'UK POLITICS',
    headline: 'UK rules out home fees for EU students; XR acquittal',
    detail: 'PMQs signals higher EU tuition under reset talks; London jury clears Extinction Rebellion activists.',
    source: 'Guardian',
    beat: 'policy',
  },
  {
    region: 'EUR',
    column: 'europe',
    kicker: 'UEFA UCL',
    headline: 'Lille hand Bayern 1st loss (2–1); Sporting 2–2 Man Utd',
    detail: 'Matchday 5: Roma hold defending champs PSG 2–2 ending 100% run; Barcelona cruise 4–1 at Sabah.',
    source: 'UEFA · Guardian',
    beat: 'science',
  },
  {
    region: 'EUR',
    column: 'europe',
    kicker: 'AI & SYSTEMS',
    headline: 'OpenAI Private Inference alpha; Anthropic Rust shift',
    detail: 'OpenAI starts confidential-compute enterprise trials; Anthropic details 70% CPU cut migrating API to Rust.',
    source: 'TC · Anthropic',
    beat: 'science',
  },

  // COLUMN 3: MIDDLE EAST & AFRICA (7 crisp stories)
  {
    pin: 14,
    region: 'AFR',
    column: 'mena_africa',
    kicker: 'SUDAN',
    headline: '40+ RSF-attributed drones kill 14–19 in Blue Nile',
    detail: 'Strikes hit Ed Damazin & Roseires homes and infrastructure, displacing thousands without shelter or medicine.',
    source: 'Sudan Tribune',
    beat: 'conflict',
    lat: 11.79,
    lon: 34.35,
  },
  {
    pin: 15,
    region: 'AFR',
    column: 'mena_africa',
    kicker: 'SOUTH AFRICA',
    headline: 'High court voids Ramaphosa “Farmgate” panel report',
    detail: 'Declares 2022 Phala Phala parliamentary report unlawful, lifting major impeachment threat.',
    source: 'Courthouse News',
    beat: 'policy',
    lat: -25.75,
    lon: 28.22,
  },
  {
    pin: 16,
    region: 'AFR',
    column: 'mena_africa',
    kicker: 'NIGERIA',
    headline: 'Lagos launches AI “Bioshield” pathogen network',
    detail: 'Digital biosecurity & telemedicine system tracks Ebola, Lassa & Marburg while keeping commerce open.',
    source: 'Lagos Govt',
    beat: 'science',
    lat: 6.52,
    lon: 3.38,
  },
  {
    region: 'MENA',
    column: 'mena_africa',
    kicker: 'GAZA & UN',
    headline: 'UN tribunal faults UNRWA firings; meningitis alert',
    detail: 'Ruling cites unproven grounds for 2024 dismissals; Gaza flags infant meningitis surge; IDF kills K. Abu Nada.',
    source: 'Guardian · IDF',
    beat: 'conflict',
  },
  {
    region: 'MENA',
    column: 'mena_africa',
    kicker: 'LEBANON',
    headline: '5 Western allies back exclusive state arms; 2nd airport',
    detail: 'US/UK/CA/AU/JP urge transparent Dahr al-Baydar probe; Beirut plans Kleiat international airport next month.',
    source: 'ANews · Intz.',
    beat: 'policy',
  },
  {
    region: 'AFR',
    column: 'mena_africa',
    kicker: 'ZAMBIA & UN',
    headline: 'Zambia cholera hits 3,730 cases (83 dead); UN GBV day',
    detail: 'ZNPHI speeds oral vaccines across 8 provinces; UN marks 25 Nov noting 86k Gaza homes are female-headed.',
    source: 'ZNPHI · UN',
    beat: 'disaster',
  },
  {
    region: 'MENA',
    column: 'mena_africa',
    kicker: 'ISRAEL / IRAN',
    headline: 'Israel alleges Iran chemical arms push; Tehran denies',
    detail: 'Defense Min. Katz issues warning amid Gulf tanker mine alerts and Brent crude rising to ~$91/bbl.',
    source: 'CBS · AA',
    beat: 'conflict',
  },

  // COLUMN 4: ASIA-PACIFIC, HEALTH & SCIENCE (7 crisp stories — zero clipping)
  {
    pin: 17,
    region: 'OCE',
    column: 'asia_global',
    kicker: 'OCEANIA PACT',
    headline: 'Australia & Solomon Islands sign security treaty',
    detail: 'PMs Albanese & Wale sign Canberra pact making Australia primary security partner and barring foreign bases.',
    source: 'DFAT · AJ',
    beat: 'policy',
    lat: -9.44,
    lon: 159.97,
  },
  {
    pin: 18,
    region: 'OCE',
    column: 'asia_global',
    kicker: 'AUSTRALIA & NZ',
    headline: 'Australia Oct CPI accelerates to 4.9%; NZ M5.2 quake',
    detail: 'ABS reports housing & fuel lift core CPI to 3.8%, dimming RBA cut hopes; M5.2 tremor off Hicks Bay, NZ.',
    source: 'ABS · QNA',
    beat: 'markets',
    lat: -33.86,
    lon: 151.21,
  },
  {
    region: 'SASIA',
    column: 'asia_global',
    kicker: 'BANGLADESH',
    headline: 'Garment minimum wage hiked 36% to 17,000 taka',
    detail: 'Wage Board approves $136/mo floor after weeks of factory protests; workers cite cost-of-living strain.',
    source: 'WashPost · TBS',
    beat: 'policy',
  },
  {
    region: 'EASIA',
    column: 'asia_global',
    kicker: 'KOREAS',
    headline: 'Kim Jong Un inspects nuclear sites; Seoul stablecoins',
    detail: 'Pyongyang urges expanded nuclear output; S. Korea drafts bank stablecoin rules & opens $7B Shaheen plant.',
    source: 'KCNA · FDD',
    beat: 'conflict',
  },
  {
    region: 'EASIA',
    column: 'asia_global',
    kicker: 'TAIWAN & S. ASIA',
    headline: 'Taiwan M5.5 quake; WB India bonds; Pakistan polio',
    detail: 'Taitung tremor (intensity 4) spares major damage; World Bank backs India bonds; Pakistan logs 10th polio case.',
    source: 'TW News · WB',
    beat: 'disaster',
  },
  {
    region: 'EUR',
    column: 'asia_global',
    kicker: 'WHO HEALTH',
    headline: 'WHO backs single-dose oral zoliflodacin for gonorrhoea',
    detail: 'New global guideline counters drug-resistant strains as oral alternative to ceftriaxone with AMR data.',
    source: 'WHO · BioSpace',
    beat: 'science',
  },
  {
    region: 'NA',
    column: 'asia_global',
    kicker: 'SPACE SCIENCE',
    headline: 'ISS brain organoids illuminate Alzheimer’s pathways',
    detail: 'Science Advances study (25 Nov) finds 40 days in microgravity alters disease biology by genetic profile.',
    source: 'Science Adv.',
    beat: 'science',
  },
];
