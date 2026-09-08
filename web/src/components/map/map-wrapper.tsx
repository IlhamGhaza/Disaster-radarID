'use client';

import dynamic from 'next/dynamic';
import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { DisasterEvent, DisasterSourceHealth, DisasterHazardZone } from '@/lib/disasters/types';
import { VolcanoAdvisory } from '@/lib/types';
import { Loader2 } from 'lucide-react';

const DynamicDisasterMap = dynamic(() => import('./disaster-map'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[#0B0F17] text-[#8B95A7]">
      <Loader2 className="h-8 w-8 animate-spin text-[#EF4444] mb-3" />
      <p className="text-sm font-semibold text-[#F5F7FA]">Memuat Peta Bencana Indonesia...</p>
      <p className="text-xs text-[#8B95A7] mt-1">Menginisialisasi OpenStreetMap & layer data BMKG, BNPB, PVMBG</p>
    </div>
  ),
});

interface MapWrapperProps {
  initialEvents?: DisasterEvent[];
  advisories?: VolcanoAdvisory[];
  sources?: DisasterSourceHealth[];
  hazardZones?: DisasterHazardZone[];
  initialUpdatedAt?: string;
}

function MapWrapperInner({
  initialEvents = [],
  advisories = [],
  sources = [],
  hazardZones = [],
  initialUpdatedAt,
}: MapWrapperProps) {
  const [events, setEvents] = useState<DisasterEvent[]>(initialEvents);
  const [activeAdvisories, setActiveAdvisories] = useState<VolcanoAdvisory[]>(advisories);
  const [activeSources, setActiveSources] = useState<DisasterSourceHealth[]>(sources);
  const [activeHazardZones, setActiveHazardZones] = useState<DisasterHazardZone[]>(hazardZones);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string>(initialUpdatedAt || '');

  const searchParams = useSearchParams();
  const latParam = searchParams.get('lat');
  const lngParam = searchParams.get('lng');
  const labelParam = searchParams.get('label');

  const initialLat = latParam ? parseFloat(latParam) : null;
  const initialLng = lngParam ? parseFloat(lngParam) : null;
  const initialLabel = labelParam || null;

  // Real-time client-side refresh function
  const handleRefresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/disasters?fresh=1&t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.events) {
          setEvents(data.events);
        }
        if (data.volcanoAdvisories) {
          setActiveAdvisories(data.volcanoAdvisories);
        }
        if (data.sources) {
          setActiveSources(data.sources);
        }
        if (data.hazardZones) {
          setActiveHazardZones(data.hazardZones);
        }
        setLastRefreshedAt(data.lastUpdated || new Date().toISOString());
      }
    } catch (err) {
      console.warn('Real-time disaster data update failed:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Background auto-polling every 3 minutes for live updates
  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh();
    }, 3 * 60 * 1000);

    return () => clearInterval(interval);
  }, [handleRefresh]);

  return (
    <DynamicDisasterMap
      initialEvents={events}
      advisories={activeAdvisories}
      sources={activeSources}
      hazardZones={activeHazardZones}
      initialUpdatedAt={lastRefreshedAt}
      initialLat={initialLat}
      initialLng={initialLng}
      initialLabel={initialLabel}
      onRefresh={handleRefresh}
      isLoading={isLoading}
    />
  );
}

export function MapWrapper(props: MapWrapperProps) {
  return (
    <Suspense
      fallback={
        <div className="flex h-full w-full flex-col items-center justify-center bg-[#0B0F17] text-[#8B95A7]">
          <Loader2 className="h-8 w-8 animate-spin text-[#EF4444] mb-3" />
          <p className="text-sm font-semibold text-[#F5F7FA]">Memuat Peta Bencana Indonesia...</p>
        </div>
      }
    >
      <MapWrapperInner {...props} />
    </Suspense>
  );
}
