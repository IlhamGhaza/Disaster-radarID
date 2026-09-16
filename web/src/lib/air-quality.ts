/**
 * Indonesian Air Quality (ISPU) & AQI Calculation Service
 * Standard based on Permen LHK No. 14 Tahun 2020
 */

export interface AirQualityHistoryPoint {
  time: string;
  label: string;
  ispu: number;
  pm25: number;
  category: string;
}

export interface AirQualityReading {
  ispu: number;
  category: 'BAIK' | 'SEDANG' | 'TIDAK SEHAT' | 'SANGAT TIDAK SEHAT' | 'BERBAHAYA';
  color: string;
  bgColor: string;
  borderColor: string;
  pm25: number;
  pm10: number;
  co: number;
  no2: number;
  so2: number;
  o3: number;
  usAqi: number;
  advice: string;
  updatedAt: string;
  range?: '1d' | '7d' | '30d';
  history: AirQualityHistoryPoint[];
  hourlyHistory: AirQualityHistoryPoint[];
}

export function calculateIspuFromPm25(pm25: number): number {
  if (pm25 <= 0) return 0;
  if (pm25 <= 15.5) {
    // 0 - 50
    return Math.round((50 / 15.5) * pm25);
  }
  if (pm25 <= 55.4) {
    // 51 - 100
    return Math.round(((100 - 51) / (55.4 - 15.6)) * (pm25 - 15.6) + 51);
  }
  if (pm25 <= 150.4) {
    // 101 - 200
    return Math.round(((200 - 101) / (150.4 - 55.5)) * (pm25 - 55.5) + 101);
  }
  if (pm25 <= 250.4) {
    // 201 - 300
    return Math.round(((300 - 201) / (250.4 - 150.5)) * (pm25 - 150.5) + 201);
  }
  // > 250.4 -> 300+
  return Math.min(500, Math.round(((500 - 301) / (500 - 250.5)) * (pm25 - 250.5) + 301));
}

export function getIspuCategory(ispu: number): {
  category: AirQualityReading['category'];
  color: string;
  bgColor: string;
  borderColor: string;
  advice: string;
} {
  if (ispu <= 50) {
    return {
      category: 'BAIK',
      color: '#10B981',
      bgColor: 'rgba(16, 185, 129, 0.15)',
      borderColor: 'rgba(16, 185, 129, 0.35)',
      advice: 'Udara sangat bersih dan segar. Sangat aman untuk olahraga dan aktivitas luar ruangan.',
    };
  }
  if (ispu <= 100) {
    return {
      category: 'SEDANG',
      color: '#3B82F6',
      bgColor: 'rgba(59, 130, 246, 0.15)',
      borderColor: 'rgba(59, 130, 246, 0.35)',
      advice: 'Kualitas udara tergolong lumayan. Aman untuk sebagian besar orang beraktivitas normal.',
    };
  }
  if (ispu <= 200) {
    return {
      category: 'TIDAK SEHAT',
      color: '#F59E0B',
      bgColor: 'rgba(245, 158, 11, 0.15)',
      borderColor: 'rgba(245, 158, 11, 0.35)',
      advice: 'Udara mulai kotor. Anak-anak, lansia, dan penderita pernapasan disarankan kurangi kegiatan di luar.',
    };
  }
  if (ispu <= 300) {
    return {
      category: 'SANGAT TIDAK SEHAT',
      color: '#EF4444',
      bgColor: 'rgba(239, 68, 68, 0.15)',
      borderColor: 'rgba(239, 68, 68, 0.35)',
      advice: 'Kondisi udara buruk bagi kesehatan. Sebaiknya kenakan masker dan kurangi bepergian keluar rumah.',
    };
  }
  return {
    category: 'BERBAHAYA',
    color: '#8B5CF6',
    bgColor: 'rgba(139, 92, 246, 0.15)',
    borderColor: 'rgba(139, 92, 246, 0.35)',
    advice: 'Udara sangat berbahaya! Tetaplah berada di dalam ruangan dan tutup ventilasi rumah rapat-rapat.',
  };
}

/**
 * Check whether air quality is in unhealthy/dangerous categories (ISPU > 100)
 */
export function isAirQualityUnhealthy(ispu: number): boolean {
  return ispu > 100;
}

/**
 * Dispatch native browser Web Notification if air quality is unhealthy
 */
export function dispatchAirQualityNotification(
  reading: AirQualityReading,
  locationLabel: string
): boolean {
  if (typeof window === 'undefined' || !('Notification' in window)) return false;
  if (Notification.permission !== 'granted') return false;
  if (!isAirQualityUnhealthy(reading.ispu)) return false;

  // Rate limit: once every hour per location to avoid alert spamming
  const hourBucket = new Date().toISOString().slice(0, 13);
  const notifyKey = `notif_aqi_${locationLabel}_${reading.category}_${hourBucket}`;
  if (sessionStorage.getItem(notifyKey)) return false;

  try {
    sessionStorage.setItem(notifyKey, Date.now().toString());
    const n = new Notification(`⚠️ Kualitas Udara ${reading.category}: ${locationLabel}`, {
      body: `Indeks ISPU mencapai ${reading.ispu} (${reading.category}). ${reading.advice}`,
      icon: '/icon.png',
      badge: '/icon.png',
      tag: 'air-quality-alert',
    });
    n.onclick = () => {
      window.focus();
      n.close();
    };
    return true;
  } catch (e) {
    console.warn('Air quality notification error:', e);
    return false;
  }
}

