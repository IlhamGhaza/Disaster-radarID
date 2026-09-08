import {
  DisasterEvent,
  DisasterType,
  TimelinePeriod,
  AggregatedDisastersResponse,
  DisasterSourceHealth,
  DisasterCategoryMeta,
} from './types';
import { fetchBmkgEarthquakes } from './bmkg-adapter';
import { fetchBnpbDisasters } from './bnpb-adapter';
import { getPvmbgVolcanoEvents } from './pvmbg-adapter';
import { getAshwatchAdvisoryEvents } from './ashwatch-adapter';

export const DISASTER_CATEGORIES: DisasterCategoryMeta[] = [
  {
    type: 'earthquake',
    label: 'Gempa Bumi',
    shortLabel: 'Gempa',
    iconName: 'Activity',
    color: '#EF4444',
    bgRgba: 'rgba(239, 68, 68, 0.15)',
    borderRgba: 'rgba(239, 68, 68, 0.35)',
    description: 'Aktivitas kegempaan tektonik dan vulkanik di seluruh wilayah Indonesia.',
    officialSources: ['BMKG (Badan Meteorologi, Klimatologi, dan Geofisika)'],
  },
  {
    type: 'flood',
    label: 'Banjir',
    shortLabel: 'Banjir',
    iconName: 'Droplets',
    color: '#3B82F6',
    bgRgba: 'rgba(59, 130, 246, 0.15)',
    borderRgba: 'rgba(59, 130, 246, 0.35)',
    description: 'Genangan air akibat luapan sungai, curah hujan tinggi, dan pasang air laut (rob).',
    officialSources: ['BNPB (Badan Nasional Penanggulangan Bencana)', 'BPBD Daerah'],
  },
  {
    type: 'volcano',
    label: 'Gunung Api',
    shortLabel: 'Gunung',
    iconName: 'Mountain',
    color: '#F97316',
    bgRgba: 'rgba(249, 115, 22, 0.15)',
    borderRgba: 'rgba(249, 115, 22, 0.35)',
    description: 'Tingkat aktivitas gunung api aktif: Level IV (Awas), III (Siaga), II (Waspada), I (Normal).',
    officialSources: ['PVMBG / MAGMA Indonesia (Badan Geologi ESDM)'],
  },
  {
    type: 'volcanic-ash',
    label: 'Sebaran Abu Vulkanik',
    shortLabel: 'Abu Vulkanik',
    iconName: 'Wind',
    color: '#FB923C',
    bgRgba: 'rgba(251, 146, 60, 0.15)',
    borderRgba: 'rgba(251, 146, 60, 0.35)',
    description: 'Poligon sebaran abu vulkanik aktif dan prakiraan sebaran ke depan (+6h, +12h, +18h).',
    officialSources: ['Darwin VAAC (Bureau of Meteorology Australia)', 'BMKG Penerbangan'],
  },
  {
    type: 'landslide',
    label: 'Tanah Longsor',
    shortLabel: 'Longsor',
    iconName: 'Layers',
    color: '#D97706',
    bgRgba: 'rgba(217, 119, 6, 0.15)',
    borderRgba: 'rgba(217, 119, 6, 0.35)',
    description: 'Pergerakan massa tanah dan batuan pada lereng perbukitan dan tebing curam.',
    officialSources: ['BNPB', 'PVMBG Gerakan Tanah'],
  },
  {
    type: 'forest-fire',
    label: 'Kebakaran Hutan & Lahan',
    shortLabel: 'Karhutla',
    iconName: 'Flame',
    color: '#DC2626',
    bgRgba: 'rgba(220, 38, 38, 0.15)',
    borderRgba: 'rgba(220, 38, 38, 0.35)',
    description: 'Titik panas (hotspot) dan kebakaran lahan gambut serta hutan.',
    officialSources: ['KLHK SiPongi', 'BNPB'],
  },
  {
    type: 'extreme-weather',
    label: 'Cuaca Ekstrem',
    shortLabel: 'Cuaca',
    iconName: 'CloudLightning',
    color: '#8B5CF6',
    bgRgba: 'rgba(139, 92, 246, 0.15)',
    borderRgba: 'rgba(139, 92, 246, 0.35)',
    description: 'Hujan lebat, angin kencang, puting beliung, dan fenomena meteorologis ekstrem.',
    officialSources: ['BMKG Cuaca'],
  },
  {
    type: 'tsunami',
    label: 'Tsunami',
    shortLabel: 'Tsunami',
    iconName: 'Waves',
    color: '#06B6D4',
    bgRgba: 'rgba(6, 182, 212, 0.15)',
    borderRgba: 'rgba(6, 182, 212, 0.35)',
    description: 'Peringatan dini gelombang tsunami pasca-gempa kuat di wilayah perairan Indonesia.',
    officialSources: ['InaTEWS BMKG'],
  },
  {
    type: 'drought',
    label: 'Kekeringan',
    shortLabel: 'Kekeringan',
    iconName: 'Sun',
    color: '#EAB308',
    bgRgba: 'rgba(234, 179, 8, 0.15)',
    borderRgba: 'rgba(234, 179, 8, 0.35)',
    description: 'Krisis air bersih dan kekeringan lahan pertanian pada musim kemarau panjang.',
    officialSources: ['BNPB', 'BMKG Iklim'],
  },
  {
    type: 'coastal-hazard',
    label: 'Bahaya Pesisir & Rob',
    shortLabel: 'Rob / Pesisir',
    iconName: 'Anchor',
    color: '#0284C7',
    bgRgba: 'rgba(2, 132, 199, 0.15)',
    borderRgba: 'rgba(2, 132, 199, 0.35)',
    description: 'Limpasan banjir rob pasang surut astronomis dan abrasi pesisir pantai.',
    officialSources: ['BMKG Maritim', 'BIG'],
  },
];

export async function getAggregatedDisasters(
  period: TimelinePeriod = 'LIVE'
): Promise<AggregatedDisastersResponse> {
  const [bmkgData, bnpbData, vaacData] = await Promise.all([
    fetchBmkgEarthquakes(),
    fetchBnpbDisasters(),
    getAshwatchAdvisoryEvents(),
  ]);

  const pvmbgEvents = getPvmbgVolcanoEvents();

  // Combine all normalized events
  const allEvents: DisasterEvent[] = [
    ...bmkgData.events,
    ...bnpbData.events,
    ...pvmbgEvents,
    ...vaacData.events,
  ];

  // Filter by timeline period
  const now = Date.now();
  const filteredEvents = allEvents.filter((ev) => {
    // Volcanic ash and active magma status are always relevant to current LIVE view
    if (ev.type === 'volcanic-ash' || ev.type === 'volcano') return true;

    const evTime = new Date(ev.eventTime).getTime();
    const diffMs = now - evTime;

    switch (period) {
      case 'LIVE':
        return diffMs <= 48 * 3600 * 1000;
      case '24H':
        return diffMs <= 24 * 3600 * 1000;
      case '7D':
        return diffMs <= 7 * 24 * 3600 * 1000;
      case '30D':
        return diffMs <= 30 * 24 * 3600 * 1000;
      case '1Y':
        return diffMs <= 365 * 24 * 3600 * 1000;
      default:
        return true;
    }
  });

  // Calculate severity breakdown
  const counts = {
    total: filteredEvents.length,
    critical: filteredEvents.filter((e) => e.severity === 'critical').length,
    high: filteredEvents.filter((e) => e.severity === 'high').length,
    moderate: filteredEvents.filter((e) => e.severity === 'moderate').length,
    low: filteredEvents.filter((e) => e.severity === 'low').length,
    byType: {} as Record<DisasterType, number>,
  };

  for (const cat of DISASTER_CATEGORIES) {
    counts.byType[cat.type] = filteredEvents.filter((e) => e.type === cat.type).length;
  }

  // Source health status
  const sources: DisasterSourceHealth[] = [
    {
      id: 'bmkg',
      name: 'BMKG Indonesia',
      code: 'BMKG',
      status: bmkgData.isLive ? 'online' : 'degraded',
      lastUpdated: bmkgData.lastUpdated,
      url: 'https://data.bmkg.go.id/',
      description: 'Pusat Gempa Bumi & Tsunami Nasional',
      eventsCount: bmkgData.events.length,
    },
    {
      id: 'bnpb',
      name: 'BNPB / InaRISK',
      code: 'BNPB',
      status: 'online',
      lastUpdated: bnpbData.lastUpdated,
      url: 'https://gis.bnpb.go.id/',
      description: 'Pusdalops & Geoportal Bencana BNPB',
      eventsCount: bnpbData.events.length,
    },
    {
      id: 'pvmbg',
      name: 'PVMBG / MAGMA ESDM',
      code: 'PVMBG',
      status: 'online',
      lastUpdated: new Date().toISOString(),
      url: 'https://magma.esdm.go.id/',
      description: 'Status Aktivitas 127+ Gunung Api Aktif',
      eventsCount: pvmbgEvents.length,
    },
    {
      id: 'vaac',
      name: 'Darwin VAAC',
      code: 'VAAC',
      status: vaacData.events.length > 0 ? 'online' : 'degraded',
      lastUpdated: vaacData.lastUpdated,
      url: 'https://www.bom.gov.au/products/Volc_ash_recent.shtml',
      description: 'Aviation Volcanic Ash Advisory Feed',
      eventsCount: vaacData.events.length,
    },
    {
      id: 'osm',
      name: 'OpenStreetMap (OSM)',
      code: 'OSM',
      status: 'online',
      lastUpdated: new Date().toISOString(),
      url: 'https://www.openstreetmap.org/',
      description: 'Geospatial Base Map Engine',
      eventsCount: 0,
    },
  ];

  return {
    events: filteredEvents,
    counts,
    sources,
    hazardZones: bnpbData.hazardZones,
    volcanoAdvisories: vaacData.advisories,
    lastUpdated: new Date().toISOString(),
    isLive: bmkgData.isLive,
  };
}
