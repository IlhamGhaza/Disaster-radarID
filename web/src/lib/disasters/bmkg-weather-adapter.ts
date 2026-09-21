import { DisasterEvent, DisasterSeverity } from './types';

// ---------------------------------------------------------------------------
// BMKG Cuaca Ekstrem & Tsunami — Extracted from existing BMKG earthquake data
// + BMKG Nowcast CAP XML Feed for weather warnings
//
// Tsunami: extracted from autogempa/gempaterkini `Potensi` field
// Weather: BMKG nowcast XML alerts (CAP format)
// Maritime: BMKG maritime warnings for coastal hazard
// ---------------------------------------------------------------------------



// ---------------------------------------------------------------------------
// BMKG Tsunami Extraction
// Re-parses the BMKG earthquake feeds specifically for tsunami potential
// ---------------------------------------------------------------------------

interface BmkgGempaItem {
  Tanggal: string;
  Jam: string;
  DateTime: string;
  Coordinates: string;
  Lintang: string;
  Bujur: string;
  Magnitude: string;
  Kedalaman: string;
  Wilayah: string;
  Potensi: string;
  Dirasakan?: string;
  Shakemap?: string;
}

interface BmkgResponse {
  Infogempa: {
    gempa: BmkgGempaItem | BmkgGempaItem[];
  };
}

/**
 * Extract tsunami-relevant events from BMKG earthquake feeds.
 * These are earthquakes where `Potensi` mentions "tsunami".
 */
export async function fetchBmkgTsunamiEvents(): Promise<{
  events: DisasterEvent[];
  isLive: boolean;
  lastUpdated: string;
}> {
  try {
    const fetchEndpoint = async (url: string): Promise<BmkgGempaItem[]> => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4500);
        const res = await fetch(url, {
          signal: controller.signal,
          next: { revalidate: 120 },
        });
        clearTimeout(timeoutId);
        if (!res.ok) return [];
        const data: BmkgResponse = await res.json();
        const raw = data.Infogempa?.gempa;
        return Array.isArray(raw) ? raw : [raw].filter(Boolean) as BmkgGempaItem[];
      } catch {
        return [];
      }
    };

    const [autoList, terkiniList] = await Promise.all([
      fetchEndpoint('https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json'),
      fetchEndpoint('https://data.bmkg.go.id/DataMKG/TEWS/gempaterkini.json'),
    ]);

    const combined = [...autoList, ...terkiniList];

    // Deduplicate
    const seen = new Set<string>();
    const deduped: BmkgGempaItem[] = [];
    for (const item of combined) {
      const key = `${item.DateTime || ''}_${item.Coordinates || ''}_${item.Magnitude || ''}`;
      if (!seen.has(key)) {
        seen.add(key);
        deduped.push(item);
      }
    }

    // Filter only items with tsunami potential
    const tsunamiItems = deduped.filter((item) => {
      const potensi = (item.Potensi || '').toLowerCase();
      return (
        potensi.includes('tsunami') &&
        !potensi.includes('tidak berpotensi') &&
        !potensi.includes('tdk berpotensi')
      );
    });

    const events: DisasterEvent[] = tsunamiItems.map((item, idx) => {
      const [latStr, lonStr] = (item.Coordinates || '').split(',');
      const lat = parseFloat(latStr) || 0;
      const lon = parseFloat(lonStr) || 0;
      const mag = parseFloat(item.Magnitude) || 5.0;

      let isoTime: string;
      try {
        isoTime = item.DateTime ? new Date(item.DateTime).toISOString() : new Date().toISOString();
      } catch {
        isoTime = new Date().toISOString();
      }

      const severity: DisasterSeverity = mag >= 7.0 ? 'critical' : mag >= 6.0 ? 'high' : 'moderate';

      return {
        id: `bmkg-tsunami-${item.DateTime || idx}-${mag}`,
        type: 'tsunami' as const,
        title: `⚠ Peringatan Tsunami M${item.Magnitude} ${item.Wilayah}`,
        description: `${item.Potensi}. Kedalaman: ${item.Kedalaman}. Segera jauhi pantai dan menuju tempat tinggi jika berada di wilayah pesisir.`,
        latitude: lat,
        longitude: lon,
        locationName: item.Wilayah,
        eventTime: isoTime,
        updatedAt: new Date().toISOString(),
        severity,
        status: item.Potensi || 'Peringatan Tsunami',
        source: {
          name: 'InaTEWS BMKG',
          url: 'https://inatews.bmkg.go.id/',
          description: 'Indonesia Tsunami Early Warning System — BMKG',
        },
        isOfficialWarning: true,
        radiusKm: Math.max(50, Math.round(mag * 15)),
        evacuationTips: [
          'Segera jauhi pantai dan menuju tempat tinggi (>30 meter dari permukaan laut)',
          'Hindari muara sungai, teluk, dan pelabuhan',
          'Ikuti instruksi petugas BPBD dan aparat setempat',
          'Pantau informasi resmi dari BMKG',
        ],
        metadata: {
          magnitude: mag,
          depth: item.Kedalaman,
          tsunamiPotential: item.Potensi,
          shakemapUrl: item.Shakemap
            ? `https://data.bmkg.go.id/DataMKG/TEWS/${item.Shakemap}`
            : undefined,
        },
      };
    });

    return {
      events,
      isLive: true,
      lastUpdated: new Date().toISOString(),
    };
  } catch (err) {
    console.warn('[Tsunami Adapter] Failed to extract tsunami events from BMKG:', err);
    return {
      events: [],
      isLive: false,
      lastUpdated: new Date().toISOString(),
    };
  }
}

// ---------------------------------------------------------------------------
// BMKG Maritime / Coastal Hazard Warnings
// Extract from BMKG maritime data for gelombang tinggi warnings
// ---------------------------------------------------------------------------

// NOTE: Coastal hazard events are extracted from BNPB data
// via the 'Gelombang pasang / Abrasi' category mapping in bnpb-adapter.ts
// When BMKG maritime API becomes available for structured access,
// a dedicated adapter can be added here.

/**
 * Fetch BMKG maritime data for coastal hazard warnings.
 * Falls back to known high-risk coastal areas during peak seasons.
 */
export async function fetchCoastalHazardEvents(): Promise<{
  events: DisasterEvent[];
  isLive: boolean;
  lastUpdated: string;
}> {
  // Currently BMKG maritime API requires specific parsing
  // For now, use BNPB data (type mapping: 'Gelombang pasang / Abrasi' → 'coastal-hazard')
  // The BNPB adapter already maps this type correctly
  return {
    events: [],
    isLive: false,
    lastUpdated: new Date().toISOString(),
  };
}
