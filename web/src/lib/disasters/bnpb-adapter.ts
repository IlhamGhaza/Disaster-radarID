import { DisasterEvent, DisasterHazardZone, DisasterType, DisasterSeverity } from './types';

// ---------------------------------------------------------------------------
// BNPB Geoportal ArcGIS REST API — Kejadian Bencana Mingguan
// Endpoint: FeatureServer layer 25 (polygon geometry with centroids)
// Source: https://gis.bnpb.go.id/server/rest/services/Kejadian_Bencana_Mingguan
// ---------------------------------------------------------------------------

const BNPB_FEATURE_URL =
  'https://gis.bnpb.go.id/server/rest/services/Kejadian_Bencana_Mingguan/FeatureServer/25/query';

// Map BNPB's Indonesian category names to our DisasterType enum
const BNPB_TYPE_MAP: Record<string, DisasterType> = {
  'Banjir': 'flood',
  'Banjir Bandang': 'flood',
  'Banjir dan Tanah Longsor': 'flood',
  'Longsor': 'landslide',
  'Tanah Longsor': 'landslide',
  'Kebakaran hutan dan lahan': 'forest-fire',
  'Kebakaran Hutan dan Lahan': 'forest-fire',
  'Karhutla': 'forest-fire',
  'Cuaca ekstrem': 'extreme-weather',
  'Cuaca Ekstrem': 'extreme-weather',
  'Puting Beliung': 'extreme-weather',
  'Angin Puting Beliung': 'extreme-weather',
  'Erupsi gunung api': 'volcano',
  'Gempabumi': 'earthquake',
  'Gempa bumi': 'earthquake',
  'Gelombang pasang / Abrasi': 'coastal-hazard',
  'Gelombang Pasang/Abrasi': 'coastal-hazard',
  'Gelombang pasang': 'coastal-hazard',
  'Abrasi': 'coastal-hazard',
  'Tsunami': 'tsunami',
  'Kekeringan': 'drought',
};

// Estimate severity from BNPB damage data
function estimateSeverity(attrs: BnpbAttributes): DisasterSeverity {
  const dead = attrs.meninggal || 0;
  const missing = attrs.hilang || 0;
  const evacuated = attrs.mengungsi || 0;
  const heavyDamage = attrs.rumah_rusak_berat || 0;

  if (dead > 0 || missing > 0 || heavyDamage > 5) return 'critical';
  if (evacuated > 100 || heavyDamage > 0) return 'high';
  if (evacuated > 0 || (attrs.rumah_terendam || 0) > 5) return 'moderate';
  return 'low';
}

interface BnpbAttributes {
  dt: number; // epoch ms
  kabupaten: string;
  kategori_bencana: string;
  jumlah_kejadian: number;
  meninggal: number;
  hilang: number;
  luka_sakit: number;
  menderita: number;
  mengungsi: number;
  menderita_mengungsi: number;
  rumah_rusak_berat: number;
  rumah_rusak_sedang: number;
  rumah_rusak_ringan: number;
  rumah_terendam: number;
  lahan_hektar: number | null;
  rumah_rusak: number;
  kronologis: string;
  penyebab: string;
  deskripsi: string;
  kondisi_mutakhir: string;
  upaya_: string;
  id: string;
  id_kab_sdi: string;
  tgl: number;
  bulan: number;
  tahun: number;
  minggu: number;
  objectid: number;
  [key: string]: unknown;
}

interface BnpbFeature {
  attributes: BnpbAttributes;
  centroid?: { x: number; y: number };
}

interface BnpbQueryResponse {
  features: BnpbFeature[];
  exceededTransferLimit?: boolean;
}

function parseBnpbFeature(feature: BnpbFeature): DisasterEvent | null {
  const attrs = feature.attributes;
  const centroid = feature.centroid;

  // Must have centroid for map placement
  if (!centroid || centroid.x === 0 || centroid.y === 0) return null;

  const disasterType = BNPB_TYPE_MAP[attrs.kategori_bencana];
  // Skip types we already get from dedicated adapters (earthquake, volcano)
  if (!disasterType || disasterType === 'earthquake' || disasterType === 'volcano') return null;

  const severity = estimateSeverity(attrs);

  // Build description from kronologis (most useful field from BNPB)
  const kronologis = (attrs.kronologis || '').replace(/●\s*/g, '').trim();
  const kondisi = (attrs.kondisi_mutakhir || '').replace(/●\s*/g, '').trim();

  // Build a human-readable impact summary
  const impactParts: string[] = [];
  if (attrs.meninggal) impactParts.push(`${attrs.meninggal} meninggal`);
  if (attrs.hilang) impactParts.push(`${attrs.hilang} hilang`);
  if (attrs.luka_sakit) impactParts.push(`${attrs.luka_sakit} luka/sakit`);
  if (attrs.mengungsi) impactParts.push(`${attrs.mengungsi} mengungsi`);
  if (attrs.rumah_terendam) impactParts.push(`${attrs.rumah_terendam} rumah terendam`);
  if (attrs.rumah_rusak_berat) impactParts.push(`${attrs.rumah_rusak_berat} rumah rusak berat`);
  if (attrs.lahan_hektar) impactParts.push(`${attrs.lahan_hektar} ha terdampak`);

  const impactText = impactParts.length > 0 ? `Dampak: ${impactParts.join(', ')}.` : '';

  // Build title
  const typeLabel = attrs.kategori_bencana;
  const title = `${typeLabel} ${attrs.kabupaten}`;

  // Parse date from tgl/bulan/tahun (more reliable than dt epoch)
  let eventTime: string;
  try {
    if (attrs.dt && attrs.dt > 0) {
      eventTime = new Date(attrs.dt).toISOString();
    } else {
      eventTime = new Date(attrs.tahun, attrs.bulan - 1, attrs.tgl).toISOString();
    }
  } catch {
    eventTime = new Date().toISOString();
  }

  return {
    id: `bnpb-${attrs.id || attrs.objectid}`,
    type: disasterType,
    title,
    description: [kronologis, impactText, kondisi].filter(Boolean).join(' ').slice(0, 500),
    latitude: centroid.y,
    longitude: centroid.x,
    locationName: `Kab/Kota ${attrs.kabupaten}`,
    regency: attrs.kabupaten,
    eventTime,
    updatedAt: new Date().toISOString(),
    severity,
    status: kondisi ? 'Penanganan BNPB/BPBD' : 'Dilaporkan',
    source: {
      name: 'BNPB Geoportal',
      url: 'https://gis.bnpb.go.id/',
      description: 'Pusdalops Penanggulangan Bencana — Kejadian Bencana Mingguan',
    },
    isOfficialWarning: severity === 'critical' || severity === 'high',
    radiusKm: disasterType === 'forest-fire' ? 10 : 5,
    metadata: {
      affectedAreaHa: attrs.lahan_hektar || undefined,
      waterLevelCm: attrs.rumah_terendam ? attrs.rumah_terendam * 10 : undefined,
      bnpbId: attrs.id,
      evacuated: attrs.mengungsi || undefined,
      casualties: (attrs.meninggal || 0) + (attrs.hilang || 0) || undefined,
    },
  };
}

// Official InaRISK hazard zones across Indonesia (static reference data)
export const INARISK_HAZARD_ZONES: DisasterHazardZone[] = [
  {
    id: 'inarisk-flood-pantura',
    name: 'Zona Rawan Banjir Dataran Rendah Pantura',
    hazardType: 'flood',
    riskLevel: 'Tinggi',
    color: '#3B82F6',
    province: 'Jawa Tengah & Jawa Barat',
    description: 'Kawasan dataran aluvial rawan luapan sungai musiman dan genangan pasang air laut (rob).',
    source: 'InaRISK BNPB',
    centerCoordinates: { latitude: -6.9, longitude: 110.5 },
  },
  {
    id: 'inarisk-landslide-westjava',
    name: 'Zona Kerentanan Gerakan Tanah Perbukitan Selatan Jawa',
    hazardType: 'landslide',
    riskLevel: 'Sangat Tinggi',
    color: '#D97706',
    province: 'Jawa Barat & Jawa Tengah',
    description: 'Kemiringan lereng curam dengan tanah lapukan tebal rentan longsor saat hujan lebat berdurasi lama.',
    source: 'PVMBG & InaRISK BNPB',
    centerCoordinates: { latitude: -7.1, longitude: 107.5 },
  },
  {
    id: 'inarisk-eq-megathrust-sunda',
    name: 'Zona Bahaya Seismik Megathrust Selat Sunda',
    hazardType: 'earthquake',
    riskLevel: 'Tinggi',
    color: '#EF4444',
    province: 'Banten & Lampung',
    description: 'Pertemuan lempeng Indo-Australia dan Eurasia dengan potensi goncangan kuat dan tsunami pesisir.',
    source: 'Pusgen / BMKG / BNPB',
    centerCoordinates: { latitude: -6.5, longitude: 105.2 },
  },
  {
    id: 'inarisk-fire-sumsel-kalteng',
    name: 'Zona Rawan Karhutla Kubah Gambut',
    hazardType: 'flood',
    riskLevel: 'Tinggi',
    color: '#DC2626',
    province: 'Sumatera Selatan & Kalimantan Tengah',
    description: 'Lahan gambut kering rentan mengalami kebakaran bawah permukaan (smoldering) pada musim kemarau.',
    source: 'KLHK SiPongi & InaRISK',
    centerCoordinates: { latitude: -2.8, longitude: 113.5 },
  },
];

// Fallback curated events (only used when BNPB API is unreachable)
const FALLBACK_BNPB_EVENTS: DisasterEvent[] = [
  {
    id: 'bnpb-fallback-flood-1',
    type: 'flood',
    title: 'Banjir (Data Cadangan — API BNPB tidak tersedia)',
    description: 'Data cadangan ditampilkan karena API BNPB Geoportal tidak dapat dijangkau. Silakan cek gis.bnpb.go.id untuk data terkini.',
    latitude: -6.595,
    longitude: 106.816,
    locationName: 'Data cadangan',
    eventTime: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    severity: 'moderate',
    status: 'Data Cadangan (Offline)',
    source: {
      name: 'BNPB Geoportal (Offline)',
      url: 'https://gis.bnpb.go.id/',
      description: 'Pusdalops BNPB — Fallback',
    },
    isOfficialWarning: false,
    radiusKm: 3,
  },
];

export async function fetchBnpbDisasters(): Promise<{
  events: DisasterEvent[];
  hazardZones: DisasterHazardZone[];
  isLive: boolean;
  lastUpdated: string;
}> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    // Query the BNPB FeatureServer for recent disaster events
    // orderByFields=dt DESC → newest first
    // returnCentroid=true → polygon centroid for map marker placement
    // resultRecordCount=50 → sensible limit for recent disasters
    const queryParams = new URLSearchParams({
      where: '1=1',
      outFields: [
        'dt', 'kabupaten', 'kategori_bencana', 'jumlah_kejadian',
        'meninggal', 'hilang', 'luka_sakit', 'menderita', 'mengungsi',
        'menderita_mengungsi', 'rumah_rusak_berat', 'rumah_rusak_sedang',
        'rumah_rusak_ringan', 'rumah_terendam', 'lahan_hektar', 'rumah_rusak',
        'kronologis', 'penyebab', 'deskripsi', 'kondisi_mutakhir', 'upaya_',
        'id', 'id_kab_sdi', 'tgl', 'bulan', 'tahun', 'minggu', 'objectid',
      ].join(','),
      returnGeometry: 'false',
      returnCentroid: 'true',
      resultRecordCount: '50',
      orderByFields: 'dt DESC',
      f: 'json',
    });

    const res = await fetch(`${BNPB_FEATURE_URL}?${queryParams.toString()}`, {
      signal: controller.signal,
      next: { revalidate: 300 }, // 5 min server-side cache
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`BNPB GIS returned ${res.status}`);
    }

    const data: BnpbQueryResponse = await res.json();

    if (!data.features || data.features.length === 0) {
      throw new Error('BNPB GIS returned empty features array');
    }

    const events = data.features
      .map(parseBnpbFeature)
      .filter((ev): ev is DisasterEvent => ev !== null);

    console.log(`[BNPB Adapter] Fetched ${events.length} live events from BNPB Geoportal`);

    return {
      events,
      hazardZones: INARISK_HAZARD_ZONES,
      isLive: true,
      lastUpdated: new Date().toISOString(),
    };
  } catch (err) {
    console.warn('[BNPB Adapter] Using fallback data (BNPB Geoportal API offline or timed out):', err);
    return {
      events: FALLBACK_BNPB_EVENTS,
      hazardZones: INARISK_HAZARD_ZONES,
      isLive: false,
      lastUpdated: new Date().toISOString(),
    };
  }
}
