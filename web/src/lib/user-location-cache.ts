import { LatLng, VolcanoAdvisory } from '@/lib/types';
import { DisasterEvent, DisasterType } from '@/lib/disasters/types';
import { haversineDistanceKm, isPointInPolygon } from '@/lib/geo-checker';
import { getAllMonitoredVolcanoes } from '@/lib/magma-status';

export interface CachedUserLocation {
  latitude: number;
  longitude: number;
  label: string;
  updatedAt: string;
  isGps?: boolean;
  accuracyMeters?: number;
}

export type DangerZoneStatus = 'SAFE' | 'NEARBY_WARNING' | 'INSIDE_DANGER_ZONE';

export interface UserDisasterZoneAlert {
  status: DangerZoneStatus;
  dangerLevel: 'none' | 'moderate' | 'high' | 'critical';
  headline: string;
  message: string;
  affectedEvent?: DisasterEvent;
  affectedVolcanoName?: string;
  distanceKm?: number;
  safetyGuideType?: DisasterType;
  recommendedActions: string[];
  lastCheckedAt: string;
}

const STORAGE_KEY = 'disaster_radar_cached_user_location';

/**
 * Save user location to browser localStorage cache
 */
export function saveUserLocation(
  loc: LatLng,
  label: string,
  isGps = false,
  accuracyMeters?: number
): CachedUserLocation {
  const cached: CachedUserLocation = {
    latitude: Number(loc.latitude.toFixed(5)),
    longitude: Number(loc.longitude.toFixed(5)),
    label: label.trim() || `${loc.latitude.toFixed(3)}°, ${loc.longitude.toFixed(3)}°`,
    updatedAt: new Date().toISOString(),
    isGps,
    accuracyMeters,
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cached));
      // Dispatch custom event for cross-component sync
      window.dispatchEvent(new CustomEvent('disaster-radar:location-updated', { detail: cached }));
    } catch (e) {
      console.warn('Failed to save user location to localStorage:', e);
    }
  }

  return cached;
}

/**
 * Retrieve cached user location from browser localStorage
 */
export function getCachedUserLocation(): CachedUserLocation | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.latitude === 'number' && typeof parsed?.longitude === 'number') {
      return parsed as CachedUserLocation;
    }
  } catch (e) {
    console.warn('Failed to parse cached user location:', e);
  }
  return null;
}

/**
 * Clear user location cache from browser localStorage
 */
export function clearCachedUserLocation(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('disaster-radar:location-cleared'));
  } catch (e) {
    console.warn('Failed to clear cached user location:', e);
  }
}

/**
 * Evaluate whether the user's cached location is exposed to active disaster events,
 * volcanic ash clouds, or official hazard zones.
 */
export function evaluateUserDisasterExposure(
  userLoc: LatLng,
  events: DisasterEvent[],
  advisories?: VolcanoAdvisory[]
): UserDisasterZoneAlert {
  const now = new Date().toISOString();

  // 1. Check Volcanic Ash Polygons (Darwin VAAC)
  if (advisories && advisories.length > 0) {
    for (const adv of advisories) {
      for (const poly of adv.polygons || []) {
        if (poly.coordinates && poly.coordinates.length >= 3) {
          const isInside = isPointInPolygon(userLoc, poly.coordinates);
          if (isInside) {
            const isObserved = poly.type === 'observed' || poly.type === 'estimated';
            return {
              status: 'INSIDE_DANGER_ZONE',
              dangerLevel: isObserved ? 'critical' : 'high',
              headline: isObserved
                ? `⚠️ PERINGATAN: Lokasi Anda Berada di Dalam Sebaran Abu Vulkanik Aktif!`
                : `⚠️ PERINGATAN: Lokasi Anda Diprediksi Dilintasi Awan Abu Vulkanik (+${poly.type.replace('forecast', '')})`,
              message: `Awan abu vulkanik dari ${adv.volcanoName} terdeteksi di atas area Anda. Partikel abu berpotensi mengganggu saluran pernapasan dan jarak pandang.`,
              affectedVolcanoName: adv.volcanoName,
              safetyGuideType: 'volcanic-ash',
              recommendedActions: [
                'Gunakan masker N95 atau kain basah untuk menutup hidung dan mulut',
                'Tutup rapat seluruh ventilasi rumah dan tempat penampungan air bersih',
                'Kenakan kacamata pelindung (jangan memakai lensa kontak)',
                'Tetap berada di dalam ruangan hingga debu mereda',
              ],
              lastCheckedAt: now,
            };
          }
        }
      }
    }
  }

  // 2. Check Active Volcano KRB / Proximity (PVMBG Alert Levels)
  const monitoredVolcanoes = getAllMonitoredVolcanoes();
  for (const volcano of monitoredVolcanoes) {
    // Only check level 2 (Waspada), 3 (Siaga), and 4 (Awas)
    if (volcano.level >= 2) {
      const distKm = haversineDistanceKm(userLoc, volcano.position);
      // Threat radius by MAGMA alert level:
      // Level 4 (Awas): 10km danger, 20km warning
      // Level 3 (Siaga): 5km danger, 12km warning
      // Level 2 (Waspada): 3km danger, 7km warning
      const dangerRadius = volcano.level === 4 ? 10 : volcano.level === 3 ? 5 : 3;
      const warningRadius = volcano.level === 4 ? 20 : volcano.level === 3 ? 12 : 7;

      if (distKm <= dangerRadius) {
        return {
          status: 'INSIDE_DANGER_ZONE',
          dangerLevel: volcano.level === 4 ? 'critical' : 'high',
          headline: `🔴 EVAKUASI SEGERA: Di Dalam Radius Bahaya ${volcano.volcanoName}!`,
          message: `Posisi Anda berjarak hanya ${distKm.toFixed(1)} km dari kawah aktif ${volcano.volcanoName} dengan status ${volcano.levelRoman} (${volcano.levelName.toUpperCase()}).`,
          affectedVolcanoName: volcano.volcanoName,
          distanceKm: distKm,
          safetyGuideType: 'volcano',
          recommendedActions: [
            volcano.recommendation || 'Segera tinggalkan kawasan dan ikuti arahan petugas BPBD',
            'Jauhi lembah sungai yang berhulu di puncak gunung untuk menghindari lahar',
            'Pakai masker dan pelindung kepala',
          ],
          lastCheckedAt: now,
        };
      } else if (distKm <= warningRadius) {
        return {
          status: 'NEARBY_WARNING',
          dangerLevel: volcano.level === 4 ? 'high' : 'moderate',
          headline: `🟠 WASPADA: Anda Berada di Dekat Kawasan Gunung Api ${volcano.volcanoName}`,
          message: `Jarak Anda ${distKm.toFixed(1)} km dari ${volcano.volcanoName} (Status: ${volcano.levelName}). Waspadai lontaran material pijar dan hujan abu jika terjadi erupsi.`,
          affectedVolcanoName: volcano.volcanoName,
          distanceKm: distKm,
          safetyGuideType: 'volcano',
          recommendedActions: [
            'Pantau arahan PVMBG dan informasi resmi BPBD setempat',
            'Ketahui titik kumpul dan jalur evakuasi terdekat',
            'Siapkan tas siaga bencana keluarga',
          ],
          lastCheckedAt: now,
        };
      }
    }
  }

  // 3. Check Live Disaster Events (Earthquakes, Floods, Landslides, etc.)
  let closestCriticalEvent: { event: DisasterEvent; distKm: number; isInside: boolean } | null = null;
  let closestWarningEvent: { event: DisasterEvent; distKm: number } | null = null;

  for (const ev of events) {
    const distKm = haversineDistanceKm(userLoc, { latitude: ev.latitude, longitude: ev.longitude });

    // Realistic calibrated impact radius per disaster category
    const defaultRadius =
      ev.type === 'earthquake'
        ? (ev.metadata?.magnitude ? Number(ev.metadata.magnitude) * 7 : 35)
        : ev.type === 'tsunami'
        ? 30
        : ev.type === 'volcano'
        ? 5
        : ev.type === 'flood'
        ? 3.5
        : ev.type === 'landslide'
        ? 2.5
        : ev.type === 'forest-fire'
        ? 4
        : 5;

    const impactRadius = ev.radiusKm || defaultRadius;

    if (distKm <= impactRadius) {
      if (!closestCriticalEvent || distKm < closestCriticalEvent.distKm) {
        closestCriticalEvent = { event: ev, distKm, isInside: true };
      }
    } else if (distKm <= impactRadius * 2.5) {
      if (!closestWarningEvent || distKm < closestWarningEvent.distKm) {
        closestWarningEvent = { event: ev, distKm };
      }
    }
  }

  if (closestCriticalEvent) {
    const ev = closestCriticalEvent.event;
    const dist = closestCriticalEvent.distKm;
    return {
      status: 'INSIDE_DANGER_ZONE',
      dangerLevel: ev.severity === 'critical' ? 'critical' : 'high',
      headline: `⚠️ PERHATIAN: Anda Berada di Zona Bahaya ${ev.title}`,
      message: `Titik kejadian terdeteksi sangat dekat (${dist.toFixed(1)} km) dari koordinat Anda. Sumber informasi resmi: ${ev.source.name}.`,
      affectedEvent: ev,
      distanceKm: dist,
      safetyGuideType: ev.type,
      recommendedActions: ev.evacuationTips || [
        'Tetap tenang dan amankan diri sesuai panduan evakuasi',
        'Ikuti instruksi petugas BPBD / aparat penegak hukum di lapangan',
        'Pantau informasi resmi dari BMKG atau BNPB',
      ],
      lastCheckedAt: now,
    };
  }

  if (closestWarningEvent) {
    const ev = closestWarningEvent.event;
    const dist = closestWarningEvent.distKm;
    return {
      status: 'NEARBY_WARNING',
      dangerLevel: 'moderate',
      headline: `ℹ️ Waspada Sekitar: ${ev.title} (${dist.toFixed(1)} km)`,
      message: `Aktivitas kebencanaan dilaporkan berjarak ${dist.toFixed(1)} km dari lokasi Anda. Waspadai potensi dampak susulan.`,
      affectedEvent: ev,
      distanceKm: dist,
      safetyGuideType: ev.type,
      recommendedActions: [
        'Pastikan jalur komunikasi dan baterai ponsel Anda tetap siaga',
        'Periksa kondisi lingkungan sekitar dan amankan barang berharga',
      ],
      lastCheckedAt: now,
    };
  }

  // 4. All Clear / Safe
  return {
    status: 'SAFE',
    dangerLevel: 'none',
    headline: '✅ Lokasi Anda Aman dari Zona Bencana Aktif',
    message: 'Tidak ada laporan kejadian bencana kritis, awan abu vulkanik, atau zona bahaya gunung api aktif di sekitar koordinat Anda saat ini.',
    recommendedActions: [
      'Simpan nomor darurat 112 dan pasang aplikasi pemantauan bencana',
      'Tetap periksa berkala peta kebencanaan untuk perkembangan terkini',
    ],
    lastCheckedAt: now,
  };
}

/**
 * Request browser Notification permission
 */
export async function requestDisasterNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }
  try {
    return await Notification.requestPermission();
  } catch {
    return 'denied';
  }
}

/**
 * Dispatch native browser Web Notification for danger / warning zone
 */
export function dispatchWebDisasterNotification(alert: UserDisasterZoneAlert): boolean {
  if (typeof window === 'undefined' || !('Notification' in window)) return false;
  if (Notification.permission !== 'granted') return false;
  if (alert.status === 'SAFE') return false;

  const notifyKey = `notif_${alert.status}_${alert.headline}_${alert.distanceKm?.toFixed(1) || '0'}`;
  const alreadyNotified = sessionStorage.getItem(notifyKey);
  if (alreadyNotified) return false;

  try {
    sessionStorage.setItem(notifyKey, Date.now().toString());
    const n = new Notification(alert.headline, {
      body: alert.message,
      icon: '/icon.png',
      badge: '/icon.png',
      tag: 'disaster-radar-alert',
    });
    n.onclick = () => {
      window.focus();
      n.close();
    };
    return true;
  } catch (e) {
    console.warn('Web notification dispatch failed:', e);
    return false;
  }
}
