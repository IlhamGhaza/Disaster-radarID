import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getDarwinAdvisories } from '@/lib/advisories';
import { formatWibDateTime } from '@/lib/parser/date-utils';
import { formatAltitudeCompact, formatMovementHuman, formatFlightLevelHuman } from '@/lib/aviation-format';
import { Breadcrumbs } from '@/components/breadcrumbs';
import {
  Flame,
  Map,
  Layers,
  FileText,
} from 'lucide-react';
import { SITE_URL } from '@/config/site';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getDarwinAdvisories();
  const advisory = data.advisories.find((a) => a.id === id);

  if (!advisory) {
    return { title: 'Advisory Not Found' };
  }

  const title = `${advisory.volcanoName} Advisory #${advisory.advisoryNumber}`;
  const description = `Volcanic Ash Advisory #${advisory.advisoryNumber} for ${advisory.volcanoName}, Indonesia. Altitude: ${advisory.primaryFlightLevel}, movement: ${advisory.primaryMovement}.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/advisories/${id}`,
    },
    openGraph: {
      title: `${title} | Disaster Radar Indonesia`,
      description,
      url: `${SITE_URL}/advisories/${id}`,
      siteName: 'Disaster Radar Indonesia',
      images: [
        {
          url: `${SITE_URL}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `${title} — Disaster Radar Indonesia`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Disaster Radar Indonesia`,
      description,
      images: [`${SITE_URL}/opengraph-image`],
    },
  };
}

export default async function AdvisoryDetailPage({ params }: PageProps) {
  const { id } = await params;
  const data = await getDarwinAdvisories();
  const advisory = data.advisories.find((a) => a.id === id);

  if (!advisory) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-gutter py-stack sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { name: 'Advisori Abu Vulkanik', url: '/advisories' },
          { name: `${advisory.volcanoName} #${advisory.advisoryNumber}`, url: `/advisories/${advisory.id}` },
        ]}
      />

      {/* Advisory Structure directly matching tugas.md */}
      <div className="space-y-stack">
        {/* Header */}
        <div className="flex flex-col gap-gutter border-b border-line pb-stack sm:flex-row sm:items-start sm:justify-between">
          <div>
            <span className="mb-1 block text-small text-fg-3">
              Gunung api
            </span>
            <h1 className="text-display text-fg-1 md:text-display-lg">
              {advisory.volcanoName}
            </h1>
            <p className="mt-1 font-mono text-small text-fg-2 tabular-nums">
              Advisori #{advisory.advisoryNumber} · {advisory.area}
            </p>
          </div>

          <div className="flex flex-col gap-cell sm:items-end">
            <span className="inline-flex items-center gap-1.5 self-start rounded-badge border border-sev-ash bg-sev-ash-soft px-2 py-0.5 text-label text-sev-ash sm:self-auto">
              <Flame className="h-4 w-4" aria-hidden="true" />
              <span>Abu terdeteksi</span>
            </span>

            <Link
              href={`/map?lat=${advisory.position?.latitude || -6}&lng=${advisory.position?.longitude || 106}&label=${encodeURIComponent(
                advisory.volcanoName
              )}`}
              className="inline-flex min-h-tap items-center gap-1.5 rounded-control bg-accent px-gutter text-small font-semibold text-fg-inverse transition-colors duration-120 hover:bg-accent-hover"
            >
              <Map className="h-4 w-4" aria-hidden="true" />
              <span>Lihat di peta</span>
            </Link>
          </div>
        </div>

        {/* Current Ash Area & Movement */}
        <div className="grid grid-cols-1 gap-x-stack gap-y-gutter sm:grid-cols-2">
          <div className="border-l-4 border-sev-ash pl-gutter">
            <span className="mb-1 block text-label text-fg-3">Ketinggian abu saat ini</span>
            <span className="block font-mono text-num-lg font-bold text-fg-1 tabular-nums">
              {formatAltitudeCompact(advisory.primaryFlightLevel)}
            </span>
            <span className="mt-1 block text-small text-fg-2">
              {formatFlightLevelHuman(advisory.primaryFlightLevel)}
            </span>
          </div>

          <div className="border-l-4 border-line-strong pl-gutter">
            <span className="mb-1 block text-label text-fg-3">Pergerakan</span>
            <span className="block font-mono text-num-lg font-bold text-fg-1">
              {advisory.primaryMovement}
            </span>
            <span className="mt-1 block text-small text-fg-2">
              {formatMovementHuman(advisory.primaryMovement)}
            </span>
          </div>
        </div>

        {/* Observed & Forecast Layers Breakdown */}
        <div>
          <h2 className="mb-row flex items-center gap-cell text-heading text-fg-1">
            <Layers className="h-5 w-5 text-fg-3" aria-hidden="true" />
            <span>Area teramati & prakiraan ({advisory.polygons.length} lapisan)</span>
          </h2>

          <div className="divide-y divide-line border-y border-line">
            {advisory.polygons.map((poly, idx) => (
              <div
                key={idx}
                className="flex flex-wrap items-baseline justify-between gap-x-gutter gap-y-1 py-row text-small"
              >
                <span className="font-semibold text-fg-1">
                  {poly.type === 'observed' ? 'Awan abu teramati' : poly.type.replace('forecast', 'Prakiraan +').replace('h', ' jam')}
                </span>
                <span className="font-mono text-fg-1 tabular-nums">
                  {poly.baseFlightLevel || 'SFC'} → {poly.topFlightLevel || '?'}
                </span>
                {poly.movementDirection && (
                  <span className="w-full font-mono text-fg-2">
                    {poly.movementDirection} {poly.movementSpeed || ''}
                  </span>
                )}
                <span className="font-mono text-fg-3 tabular-nums">
                  {poly.coordinates.length} titik koordinat
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Source Attribution */}
        <div className="flex flex-col gap-1 border-t border-line pt-gutter text-small sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="block text-label text-fg-3">Sumber data</span>
            <span className="font-semibold text-fg-1">Darwin VAAC · Bureau of Meteorology (Australia)</span>
          </div>
          <span className="font-mono text-fg-2 tabular-nums">Terbit {formatWibDateTime(advisory.dtg)}</span>
        </div>

        {/* Raw Bulletin Expandable Section (per tugas.md) */}
        <details className="group rounded-card border border-line bg-surface">
          <summary className="flex min-h-tap cursor-pointer items-center justify-between px-gutter text-small font-semibold text-fg-2 group-open:text-fg-1">
            <span className="flex items-center gap-cell">
              <FileText className="h-4 w-4" aria-hidden="true" />
              <span>Buletin mentah</span>
            </span>
            <span className="text-small text-fg-3 group-open:hidden">
              Buka
            </span>
          </summary>
          <div className="space-y-1 overflow-x-auto border-t border-line px-gutter py-row font-mono text-small text-fg-2">
            <p><span className="text-fg-3">DTG:</span> {advisory.dtgRaw}</p>
            <p><span className="text-fg-3">VAAC:</span> DARWIN</p>
            <p><span className="text-fg-3">VOLCANO:</span> {advisory.volcanoName} {advisory.volcanoCode ? `[${advisory.volcanoCode}]` : ''}</p>
            <p><span className="text-fg-3">AREA:</span> {advisory.area}</p>
            <p><span className="text-fg-3">INFO SOURCE:</span> {advisory.infoSource || 'HIMAWARI-9 / GROUND'}</p>
            {advisory.sourceElevation && (
              <p><span className="text-fg-3">SUMMIT ELEV:</span> {advisory.sourceElevation}</p>
            )}
            {advisory.eruptionDetails && (
              <p><span className="text-fg-3">ERUPTION DETAILS:</span> {advisory.eruptionDetails}</p>
            )}
            {advisory.remarks && (
              <p><span className="text-fg-3">RMK:</span> {advisory.remarks}</p>
            )}
            <p><span className="text-fg-3">NEXT ADVISORY:</span> {advisory.nextAdvisory || 'AS REQUIRED'}</p>
          </div>
        </details>
      </div>
    </div>
  );
}
