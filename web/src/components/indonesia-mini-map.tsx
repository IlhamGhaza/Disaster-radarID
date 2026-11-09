'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { Map as LeafletMap } from 'leaflet';
import { VolcanoAdvisory } from '@/lib/types';
import { LAYER_COLORS } from '@/lib/palette';
import { getMagmaVolcanoStatus } from '@/lib/magma-status';
import { Map, ArrowRight, Loader2 } from 'lucide-react';

interface IndonesiaMiniMapProps {
  advisories: VolcanoAdvisory[];
}

export function IndonesiaMiniMap({ advisories }: IndonesiaMiniMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !mapContainerRef.current || mapInstanceRef.current) return;

    let isCancelled = false;

    async function initMiniMap() {
      const L = (await import('leaflet')).default;
      if (isCancelled || !mapContainerRef.current) return;

      // Initialize non-interactive preview map focused on Indonesia
      const map = L.map(mapContainerRef.current, {
        center: [-2.5, 118.0],
        zoom: 4.8,
        minZoom: 3,
        maxZoom: 6,
        zoomControl: false,
        dragging: false,
        touchZoom: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        attributionControl: false,
      });

      // Genuine OpenStreetMap tiles with dark transformation
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        className: 'osm-tile-img',
      }).addTo(map);

      const polyGroup = L.layerGroup().addTo(map);
      const markerGroup = L.layerGroup().addTo(map);

      // Render actual polygons and volcano markers
      advisories.forEach((adv) => {
        // Volcano marker
        if (adv.position) {
          const lat = adv.position.latitude;
          const lng = adv.position.longitude;
          const magmaStatus = getMagmaVolcanoStatus(adv.volcanoName);

          const markerHtml = `
            <div class="flex flex-col items-center select-none" style="transform: translate(-50%, -50%);">
              <div class="relative flex h-5 w-5 items-center justify-center rounded-full border" style="background-color: var(--raised); border-color: ${magmaStatus.color};">
                <span class="pulse-marker-ring" style="background-color: ${magmaStatus.ringColor}; border: 1px solid ${magmaStatus.color};"></span>
                <div class="h-2 w-2 rounded-full" style="background-color: ${magmaStatus.color};"></div>
              </div>
              <div class="mt-0.5 whitespace-nowrap px-1.5 py-0.5 text-center" style="background-color: var(--raised); border: 1px solid var(--line-strong); border-radius: 2px;">
                <span style="color: var(--fg-1); font-size: 12px; font-weight: 600; display: block; line-height: 1.2;">
                  ${adv.volcanoName}
                </span>
              </div>
            </div>
          `;

          const marker = L.marker([lat, lng], {
            icon: L.divIcon({
              html: markerHtml,
              className: 'mini-volcano-marker',
              iconSize: [0, 0],
            }),
            interactive: false,
          });
          markerGroup.addLayer(marker);
        }

        // Ash Polygons
        adv.polygons.forEach((poly) => {
          if (poly.coordinates.length < 3) return;
          const latLngs: [number, number][] = poly.coordinates.map((c) => [c.latitude, c.longitude]);
          const style = LAYER_COLORS[poly.type] || LAYER_COLORS.observed;

          const polygon = L.polygon(latLngs, {
            color: style.stroke,
            weight: poly.type === 'observed' ? 1.5 : 1.0,
            opacity: poly.type === 'observed' ? 0.9 : 0.5,
            fillColor: style.fill,
            fillOpacity: style.opacity,
            interactive: false,
          });
          polyGroup.addLayer(polygon);
        });
      });

      mapInstanceRef.current = map;
    }

    initMiniMap();

    return () => {
      isCancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mounted, advisories]);

  return (
    <Link
      href="/map"
      className="group relative block w-full overflow-hidden rounded-card border border-line bg-surface p-gutter transition-colors duration-120 hover:border-line-strong"
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-small text-fg-2">
          <span className="font-semibold text-fg-1">Live Volcanic Ash Map Preview</span>
          <span className="hidden sm:inline">· OpenStreetMap Indonesia</span>
        </p>

        <span className="flex items-center gap-1 text-small font-semibold text-accent group-hover:text-accent-hover">
          <span>Open Live Map</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>

      <div className="osm-dark-tiles relative aspect-[16/8] w-full overflow-hidden rounded-control border border-line bg-bg sm:aspect-[21/9]">
        {mounted ? (
          <div ref={mapContainerRef} className="pointer-events-none h-full w-full" />
        ) : (
          <div role="status" className="flex h-full w-full items-center justify-center gap-2 text-small text-fg-3">
            <Loader2 className="h-5 w-5 animate-spin motion-reduce:animate-none" aria-hidden="true" />
            <span>Loading map…</span>
          </div>
        )}

        {/* Empty state: peta tetap tampil, tapi dijelaskan bahwa tidak ada poligon */}
        {mounted && advisories.length === 0 && (
          <p className="pointer-events-none absolute left-3 top-3 rounded-control border border-line-strong bg-raised px-2 py-1 text-small text-fg-2">
            No active volcanic ash advisories.
          </p>
        )}

        {/* Bottom CTA bar (solid, tanpa gradient) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 border-t border-line bg-bg/85 p-2 sm:p-3">
          <span className="hidden text-small text-fg-2 sm:inline">
            Click anywhere on preview to launch full interactive map
          </span>
          <span className="ml-auto flex min-h-10 items-center gap-1.5 rounded-control bg-accent px-3 text-small font-semibold text-fg-inverse group-hover:bg-accent-hover">
            <Map className="h-4 w-4" aria-hidden="true" />
            <span>Launch Full Map</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
