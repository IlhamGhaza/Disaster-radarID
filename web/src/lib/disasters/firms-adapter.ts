import { DisasterEvent } from './types';

// ---------------------------------------------------------------------------
// NASA FIRMS (Fire Information for Resource Management System)
// Active fire hotspots from VIIRS sensor for Indonesia
// Source: https://firms.modaps.eosdis.nasa.gov/
// ---------------------------------------------------------------------------

// NASA FIRMS API requires a free MAP_KEY — register at:
// https://firms.modaps.eosdis.nasa.gov/api/map_key
// Set env: FIRMS_MAP_KEY=<your-key>
// Uses the area endpoint with Indonesia bounding box: 95,-11,141,6
function getFirmsUrl(source = 'VIIRS_NOAA21_NRT', dayRange = 1): string | null {
  const key = process.env.FIRMS_MAP_KEY;
  if (!key) return null;
  return `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${key}/${source}/95,-11,141,6/${dayRange}`;
}

// Indonesia bounding box for validation
const IDN_BOUNDS = { minLat: -11, maxLat: 6, minLon: 95, maxLon: 141 };

interface FirmsHotspot {
  latitude: number;
  longitude: number;
  bright_ti4: number; // brightness temperature (K)
  scan: number;
  track: number;
  acq_date: string; // YYYY-MM-DD
  acq_time: string; // HHMM
  satellite: string;
  instrument: string;
  confidence: string; // 'low' | 'nominal' | 'high'
  version: string;
  bright_ti5: number;
  frp: number; // fire radiative power (MW)
  daynight: string; // 'D' | 'N'
}

function parseCSVLine(header: string[], line: string): FirmsHotspot | null {
  const values = line.split(',');
  if (values.length < header.length) return null;

  const obj: Record<string, string> = {};
  header.forEach((key, i) => {
    obj[key.trim()] = (values[i] || '').trim();
  });

  const lat = parseFloat(obj.latitude);
  const lon = parseFloat(obj.longitude);

  if (isNaN(lat) || isNaN(lon)) return null;
  if (lat < IDN_BOUNDS.minLat || lat > IDN_BOUNDS.maxLat) return null;
  if (lon < IDN_BOUNDS.minLon || lon > IDN_BOUNDS.maxLon) return null;

  // Normalize single-letter VIIRS confidence ('h' -> 'high', 'n' -> 'nominal', 'l' -> 'low')
  const rawConf = (obj.confidence || '').toLowerCase();
  const confidence =
    rawConf === 'h' ? 'high' : rawConf === 'n' ? 'nominal' : rawConf === 'l' ? 'low' : rawConf || 'nominal';

  // Normalize satellite abbreviations (N21 -> NOAA-21, N20 -> NOAA-20, N -> Suomi NPP)
  const satRaw = (obj.satellite || '').trim();
  const satellite =
    satRaw === 'N21' ? 'NOAA-21' : satRaw === 'N20' ? 'NOAA-20' : satRaw === 'N' ? 'Suomi NPP' : satRaw || 'VIIRS';

  return {
    latitude: lat,
    longitude: lon,
    bright_ti4: parseFloat(obj.bright_ti4) || 0,
    scan: parseFloat(obj.scan) || 0,
    track: parseFloat(obj.track) || 0,
    acq_date: obj.acq_date || '',
    acq_time: obj.acq_time || '',
    satellite,
    instrument: obj.instrument || 'VIIRS',
    confidence,
    version: obj.version || '',
    bright_ti5: parseFloat(obj.bright_ti5) || 0,
    frp: parseFloat(obj.frp) || 0,
    daynight: obj.daynight || 'D',
  };
}


// Cluster nearby hotspots within ~10km to reduce marker noise
function clusterHotspots(hotspots: FirmsHotspot[], radiusDeg = 0.1): FirmsHotspot[][] {
  const clusters: FirmsHotspot[][] = [];
  const used = new Set<number>();

  for (let i = 0; i < hotspots.length; i++) {
    if (used.has(i)) continue;
    const cluster: FirmsHotspot[] = [hotspots[i]];
    used.add(i);

    for (let j = i + 1; j < hotspots.length; j++) {
      if (used.has(j)) continue;
      const dLat = Math.abs(hotspots[i].latitude - hotspots[j].latitude);
      const dLon = Math.abs(hotspots[i].longitude - hotspots[j].longitude);
      if (dLat < radiusDeg && dLon < radiusDeg) {
        cluster.push(hotspots[j]);
        used.add(j);
      }
    }
    clusters.push(cluster);
  }
  return clusters;
}

// Known province lookup by rough longitude+latitude range
function guessProvince(lat: number, lon: number): string {
  if (lon < 100 && lat > 0) return 'Sumatera Utara / Aceh';
  if (lon >= 100 && lon < 105 && lat > -2) return 'Riau / Jambi / Sumatera Selatan';
  if (lon >= 103 && lon < 106 && lat < -2) return 'Sumatera Selatan / Lampung';
  if (lon >= 108 && lon < 115 && lat > -8 && lat < -5) return 'Jawa';
  if (lon >= 108 && lon < 118 && lat < -2) return 'Kalimantan';
  if (lon >= 114 && lon < 117 && lat > -5) return 'Kalimantan Selatan / Timur';
  if (lon >= 119 && lon < 125) return 'Sulawesi';
  if (lon >= 125) return 'Maluku / Papua';
  return 'Indonesia';
}

// In-memory cache to guarantee maximum 1 request per 10 minutes to NASA FIRMS
// and prevent hitting NASA's rate limit (5,000 transactions per 10-min block)
interface CachedFirmsResult {
  events: DisasterEvent[];
  isLive: boolean;
  lastUpdated: string;
  cachedAt: number;
}
let memoryCache: CachedFirmsResult | null = null;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

export async function fetchFirmsHotspots(): Promise<{
  events: DisasterEvent[];
  isLive: boolean;
  lastUpdated: string;
}> {
  // Return in-memory cached data if still fresh (< 10 minutes)
  if (memoryCache && Date.now() - memoryCache.cachedAt < CACHE_TTL_MS) {
    return {
      events: memoryCache.events,
      isLive: memoryCache.isLive,
      lastUpdated: memoryCache.lastUpdated,
    };
  }

  try {
    const firmsUrl = getFirmsUrl();
    if (!firmsUrl) {
      // No FIRMS_MAP_KEY set — skip silently (register free at firms.modaps.eosdis.nasa.gov/api/map_key)
      return {
        events: [],
        isLive: false,
        lastUpdated: new Date().toISOString(),
      };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(firmsUrl, {
      signal: controller.signal,
      next: { revalidate: 600 }, // 10 min cache
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`NASA FIRMS returned ${res.status}`);
    }

    const csvText = await res.text();
    let lines = csvText.trim().split('\n');

    // If primary source returned only the CSV header (0 active fires right now),
    // try fallback source (Suomi-NPP 2 days) to ensure active recent hotspots
    if (lines.length < 2) {
      const backupUrl = getFirmsUrl('VIIRS_SNPP_NRT', 2);
      if (backupUrl) {
        try {
          const backupRes = await fetch(backupUrl, {
            signal: controller.signal,
            next: { revalidate: 600 },
          });
          if (backupRes.ok) {
            const backupText = await backupRes.text();
            const backupLines = backupText.trim().split('\n');
            if (backupLines.length >= 2) {
              lines = backupLines;
            }
          }
        } catch {
          // Ignore backup fetch failure
        }
      }
    }

    // If still empty after backup check, it's valid: Indonesia currently has 0 detected hotspots
    if (lines.length < 2) {
      return {
        events: [],
        isLive: true,
        lastUpdated: new Date().toISOString(),
      };
    }

    const header = lines[0].split(',').map((h) => h.trim());
    const hotspots: FirmsHotspot[] = [];

    for (let i = 1; i < lines.length; i++) {
      const parsed = parseCSVLine(header, lines[i]);
      if (parsed) hotspots.push(parsed);
    }

    // Only high-confidence hotspots (filter out low confidence to reduce noise)
    const filtered = hotspots.filter(
      (h) => h.confidence === 'high' || h.confidence === 'nominal'
    );

    // Cluster nearby hotspots into single events
    const clusters = clusterHotspots(filtered);

    const events: DisasterEvent[] = clusters.slice(0, 30).map((cluster, idx) => {
      // Use the highest-FRP hotspot as the cluster center
      const primary = cluster.reduce((a, b) => (a.frp > b.frp ? a : b));
      const avgLat = cluster.reduce((s, h) => s + h.latitude, 0) / cluster.length;
      const avgLon = cluster.reduce((s, h) => s + h.longitude, 0) / cluster.length;
      const maxFrp = Math.max(...cluster.map((h) => h.frp));
      const hasHighConf = cluster.some((h) => h.confidence === 'high');
      const severity = hasHighConf && maxFrp > 50
        ? 'critical'
        : hasHighConf || maxFrp > 30
        ? 'high'
        : maxFrp > 10
        ? 'moderate'
        : 'low';

      const province = guessProvince(avgLat, avgLon);

      // Parse acquisition datetime
      let eventTime: string;
      try {
        const dateStr = primary.acq_date;
        const timeStr = primary.acq_time.padStart(4, '0');
        const hour = timeStr.slice(0, 2);
        const minute = timeStr.slice(2, 4);
        eventTime = new Date(`${dateStr}T${hour}:${minute}:00Z`).toISOString();
      } catch {
        eventTime = new Date().toISOString();
      }

      return {
        id: `firms-cluster-${idx}-${primary.acq_date}`,
        type: 'forest-fire' as const,
        title: `Titik Panas Satelit ${province} (${cluster.length} titik)`,
        description: `Klaster ${cluster.length} titik panas terdeteksi sensor ${primary.instrument} satelit ${primary.satellite}. FRP maks: ${maxFrp.toFixed(1)} MW. Confidence: ${hasHighConf ? 'Tinggi' : 'Sedang'}.`,
        latitude: avgLat,
        longitude: avgLon,
        locationName: province,
        province,
        eventTime,
        updatedAt: new Date().toISOString(),
        severity,
        status: hasHighConf ? 'Hotspot Confidence Tinggi' : 'Hotspot Terdeteksi',
        source: {
          name: 'NASA FIRMS / VIIRS',
          url: 'https://firms.modaps.eosdis.nasa.gov/',
          description: 'Fire Information for Resource Management System — VIIRS Active Fire',
        },
        isOfficialWarning: false,
        radiusKm: Math.max(5, cluster.length * 2),
        metadata: {
          confidence: hasHighConf ? 'Tinggi' : 'Sedang',
          satelliteSensor: `${primary.satellite} / ${primary.instrument}`,
          frp: maxFrp,
          hotspotCount: cluster.length,
        },
      };
    });

    console.log(
      `[FIRMS Adapter] Fetched ${hotspots.length} raw hotspots → ${filtered.length} filtered → ${clusters.length} clusters → ${events.length} events`
    );

    const result = {
      events,
      isLive: true,
      lastUpdated: new Date().toISOString(),
    };

    // Cache in memory for 10 minutes
    memoryCache = {
      ...result,
      cachedAt: Date.now(),
    };

    return result;
  } catch (err) {
    console.warn('[FIRMS Adapter] NASA FIRMS data unavailable:', err);

    // If we have stale cache, serve it instead of completely empty data
    if (memoryCache && memoryCache.events.length > 0) {
      return {
        events: memoryCache.events,
        isLive: true,
        lastUpdated: memoryCache.lastUpdated,
      };
    }

    return {
      events: [],
      isLive: false,
      lastUpdated: new Date().toISOString(),
    };
  }
}
