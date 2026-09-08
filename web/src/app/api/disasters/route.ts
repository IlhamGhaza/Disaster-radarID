import { NextRequest, NextResponse } from 'next/server';
import { getAggregatedDisasters } from '@/lib/disasters/aggregator';
import { TimelinePeriod } from '@/lib/disasters/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const periodParam = (searchParams.get('period') as TimelinePeriod) || 'LIVE';
    const isFresh = searchParams.has('fresh') || searchParams.has('t');

    const data = await getAggregatedDisasters(periodParam);

    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': isFresh
          ? 'no-store, max-age=0'
          : 'public, s-maxage=120, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to retrieve disaster data', details: String(error) },
      { status: 500 }
    );
  }
}
