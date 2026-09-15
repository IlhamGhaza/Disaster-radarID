import { NextRequest, NextResponse } from 'next/server';
import { calculateIspuFromPm25, getIspuCategory, AirQualityReading } from '@/lib/air-quality';

export const revalidate = 600; // Cache for 10 minutes

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const latStr = searchParams.get('lat');
  const lngStr = searchParams.get('lng');

  // Default to Jakarta Monas coordinates if not supplied
  const lat = latStr ? parseFloat(latStr) : -6.1754;
  const lng = lngStr ? parseFloat(lngStr) : 106.8272;

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json(
      { error: 'Koordinat latitude dan longitude tidak valid' },
      { status: 400 }
    );
  }

  try {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat.toFixed(4)}&longitude=${lng.toFixed(4)}&current=european_aqi,us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&hourly=pm2_5,pm10,us_aqi&timezone=Asia%2FJakarta&past_days=1&forecast_days=1`;

    const res = await fetch(url, {
      next: { revalidate: 600 },
      headers: {
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`Open-Meteo responded with status ${res.status}`);
    }

    const data = await res.json();
    const current = data.current || {};
    const hourly = data.hourly || { time: [], pm2_5: [] };

    const pm25 = typeof current.pm2_5 === 'number' ? current.pm2_5 : 25;
    const ispu = calculateIspuFromPm25(pm25);
    const categoryInfo = getIspuCategory(ispu);

    // Build past 24 hours history (taking the last 24 entries up to current hour)
    const times: string[] = hourly.time || [];
    const pm25Values: number[] = hourly.pm2_5 || [];
    const currentTimeIso = current.time || '';

    let currentIndex = times.indexOf(currentTimeIso);
    if (currentIndex === -1) {
      currentIndex = times.length - 1;
    }

    const startIndex = Math.max(0, currentIndex - 23);
    const sliceTimes = times.slice(startIndex, currentIndex + 1);
    const slicePm25 = pm25Values.slice(startIndex, currentIndex + 1);

    const hourlyHistory = sliceTimes.map((t, idx) => {
      const pVal = slicePm25[idx] ?? pm25;
      const hIspu = calculateIspuFromPm25(pVal);
      const hCat = getIspuCategory(hIspu);
      return {
        time: t,
        ispu: hIspu,
        pm25: pVal,
        category: hCat.category,
      };
    });

    const response: AirQualityReading = {
      ispu,
      category: categoryInfo.category,
      color: categoryInfo.color,
      bgColor: categoryInfo.bgColor,
      borderColor: categoryInfo.borderColor,
      pm25,
      pm10: typeof current.pm10 === 'number' ? current.pm10 : 30,
      co: typeof current.carbon_monoxide === 'number' ? current.carbon_monoxide : 500,
      no2: typeof current.nitrogen_dioxide === 'number' ? current.nitrogen_dioxide : 15,
      so2: typeof current.sulphur_dioxide === 'number' ? current.sulphur_dioxide : 10,
      o3: typeof current.ozone === 'number' ? current.ozone : 80,
      usAqi: typeof current.us_aqi === 'number' ? current.us_aqi : 80,
      advice: categoryInfo.advice,
      updatedAt: current.time || new Date().toISOString(),
      hourlyHistory,
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
      },
    });
  } catch (error) {
    console.error('Failed to fetch Air Quality API:', error);
    // Graceful fallback with standard estimate
    const ispu = 65;
    const categoryInfo = getIspuCategory(ispu);
    const fallback: AirQualityReading = {
      ispu,
      category: categoryInfo.category,
      color: categoryInfo.color,
      bgColor: categoryInfo.bgColor,
      borderColor: categoryInfo.borderColor,
      pm25: 19.5,
      pm10: 28.0,
      co: 450,
      no2: 14.0,
      so2: 9.0,
      o3: 65,
      usAqi: 67,
      advice: categoryInfo.advice,
      updatedAt: new Date().toISOString(),
      hourlyHistory: [],
    };
    return NextResponse.json(fallback, { status: 200 });
  }
}
