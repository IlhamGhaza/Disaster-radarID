import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getDarwinAdvisories } from '@/lib/advisories';
import { formatWibDateTime } from '@/lib/parser/date-utils';
import { formatAltitudeCompact, formatMovementHuman } from '@/lib/aviation-format';
import { getMagmaVolcanoStatus } from '@/lib/magma-status';
import { Breadcrumbs } from '@/components/breadcrumbs';
import {
  MapPin,
  Map,
  ExternalLink,
  Mountain,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';
import { SITE_URL } from '@/config/site';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getDarwinAdvisories();
  const advisory = data.deduplicated.find(
    (a) => a.volcanoName.toLowerCase() === slug.toLowerCase() || a.id.toLowerCase() === slug.toLowerCase()
  );

  const volcanoName = advisory ? advisory.volcanoName : slug.toUpperCase();
  const title = `Gunung ${volcanoName} — Aktivitas & Peta Sebaran Abu | Disaster Radar Indonesia`;
  const description = advisory
    ? `Pemantauan aktivitas dan sebaran abu vulkanik Gunung ${advisory.volcanoName}, Indonesia. Ketinggian abu: ${formatAltitudeCompact(
        advisory.primaryFlightLevel
      )}, arah pergerakan: ${formatMovementHuman(advisory.primaryMovement)}.`
    : `Pemantauan aktivitas vulkanik dan status PVMBG Gunung ${volcanoName} di Indonesia.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/volcanoes/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/volcanoes/${slug}`,
      siteName: 'Disaster Radar Indonesia',
      images: [
        {
          url: `${SITE_URL}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `Gunung ${volcanoName} — Disaster Radar Indonesia`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_URL}/opengraph-image`],
    },
  };
}

// Level PVMBG → token severity; selalu disertai nama level dan angka romawi.
const LEVEL_BADGE: Record<number, string> = {
  4: 'border-sev-critical bg-sev-critical-soft text-sev-critical',
  3: 'border-sev-high bg-sev-high-soft text-sev-high',
  2: 'border-sev-warning bg-sev-warning-soft text-sev-warning',
  1: 'border-sev-normal bg-sev-normal-soft text-sev-normal',
};
const LEVEL_EDGE: Record<number, string> = {
  4: 'border-l-sev-critical',
  3: 'border-l-sev-high',
  2: 'border-l-sev-warning',
  1: 'border-l-sev-normal',
};
const LEVEL_TEXT: Record<number, string> = {
  4: 'text-sev-critical',
  3: 'text-sev-high',
  2: 'text-sev-warning',
  1: 'text-sev-normal',
};

export default async function VolcanoDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getDarwinAdvisories();

  const latestAdvisory = data.deduplicated.find(
    (a) => a.volcanoName.toLowerCase() === slug.toLowerCase() || a.id.toLowerCase() === slug.toLowerCase()
  );

  if (!latestAdvisory) {
    return (
      <div className="mx-auto max-w-4xl px-gutter py-stack sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { name: 'Gunung Api & Abu Vulkanik', url: '/volcanoes' },
            { name: slug.toUpperCase(), url: `/volcanoes/${slug}` },
          ]}
        />
        <div className="mt-stack rounded-card border border-line bg-surface p-gutter text-center sm:p-stack">
          <div className="mx-auto mb-row flex h-11 w-11 items-center justify-center rounded-control border border-line text-fg-3">
            <Mountain className="h-6 w-6" aria-hidden="true" />
          </div>
          <h1 className="text-title text-fg-1 md:text-title-lg">
            {slug.toUpperCase()}
          </h1>
          <p className="mx-auto mt-cell max-w-md text-body text-fg-2">
            Tidak ada advisori abu aktif untuk gunung ini di buletin terakhir Darwin VAAC.
          </p>
          <div className="mt-stack flex flex-wrap justify-center gap-row">
            <Link
              href="/volcanoes"
              className="inline-flex min-h-tap items-center rounded-control border border-line-strong px-gutter text-small font-semibold text-fg-1 transition-colors duration-120 hover:border-accent hover:text-accent"
            >
              Lihat sebaran abu aktif
            </Link>
            <Link
              href="/map"
              className="inline-flex min-h-tap items-center rounded-control bg-accent px-gutter text-small font-semibold text-fg-inverse transition-colors duration-120 hover:bg-accent-hover"
            >
              Buka peta
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const history = data.advisories.filter(
    (a) => a.volcanoName.toUpperCase() === latestAdvisory.volcanoName.toUpperCase()
  );

  const magmaStatus = getMagmaVolcanoStatus(latestAdvisory.volcanoName);

  return (
    <div className="mx-auto max-w-4xl px-gutter py-stack sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { name: 'Gunung Api & Abu Vulkanik', url: '/volcanoes' },
          { name: latestAdvisory.volcanoName, url: `/volcanoes/${slug}` },
        ]}
      />

      {/* Header Banner */}
      <div className="border-b border-line pb-stack">
        <div className="flex flex-col gap-gutter sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-cell text-small text-fg-2">
              <MapPin className="h-4 w-4 text-fg-3" aria-hidden="true" />
              <span>{latestAdvisory.area}</span>
              {latestAdvisory.volcanoCode && <span className="font-mono">· #{latestAdvisory.volcanoCode}</span>}
              <span
                className={`rounded-badge border px-1.5 py-0.5 text-label ${LEVEL_BADGE[magmaStatus.level] ?? LEVEL_BADGE[1]}`}
              >
                {magmaStatus.levelRoman} · {magmaStatus.levelName}
              </span>
            </div>
            <h1 className="mt-cell text-display text-fg-1 md:text-display-lg">
<span className="serif-accent text-accent">Gunung</span> {latestAdvisory.volcanoName}
            </h1>
            <p className="mt-1 font-mono text-small text-fg-2 tabular-nums">
              {latestAdvisory.position
                ? `Koordinat: ${latestAdvisory.position.latitude.toFixed(2)}°, ${latestAdvisory.position.longitude.toFixed(2)}°`
                : ''}
              {latestAdvisory.sourceElevation ? ` · Ketinggian Puncak: ${latestAdvisory.sourceElevation}` : ''}
            </p>
          </div>

          <div className="flex items-center gap-cell">
            <Link
              href={`/map?lat=${latestAdvisory.position?.latitude || -6}&lng=${latestAdvisory.position?.longitude || 106}&label=${encodeURIComponent(
                latestAdvisory.volcanoName
              )}`}
              className="inline-flex min-h-tap items-center gap-1.5 rounded-control bg-accent px-gutter text-small font-semibold text-fg-inverse transition-colors duration-120 hover:bg-accent-hover"
            >
              <Map className="h-4 w-4" aria-hidden="true" />
              <span>Periksa di Peta</span>
            </Link>
          </div>
        </div>

        {/* MAGMA ESDM Activity Status Card */}
        <div
          className={`mt-stack rounded-card border border-line border-l-4 bg-surface p-gutter ${LEVEL_EDGE[magmaStatus.level] ?? LEVEL_EDGE[1]}`}
        >
          <div className="flex flex-wrap items-center justify-between gap-cell">
            <span className="text-small font-semibold text-fg-1">
              Status Aktivitas MAGMA ESDM (PVMBG)
            </span>
            <span
              className={`rounded-badge border px-1.5 py-0.5 text-label ${LEVEL_BADGE[magmaStatus.level] ?? LEVEL_BADGE[1]}`}
            >
              {magmaStatus.levelName} ({magmaStatus.levelRoman})
            </span>
          </div>

          <p className="mt-cell text-body text-fg-1">
            {magmaStatus.description}
          </p>

          <div className="mt-row flex flex-col gap-cell border-t border-line pt-row text-small sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-1.5 text-fg-2">
              <AlertTriangle className={`mt-0.5 h-4 w-4 shrink-0 ${LEVEL_TEXT[magmaStatus.level] ?? LEVEL_TEXT[1]}`} aria-hidden="true" />
              <span>
                <strong className="font-semibold text-fg-1">Rekomendasi / Radius Bahaya:</strong> {magmaStatus.recommendation}
              </span>
            </div>

            <a
              href={magmaStatus.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-tap shrink-0 items-center gap-1 font-semibold text-accent transition-colors duration-120 hover:text-accent-hover"
            >
              <span>Portal MAGMA ESDM</span>
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">(membuka tab baru)</span>
            </a>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="mt-gutter grid grid-cols-1 gap-x-stack gap-y-row sm:grid-cols-3">
          <div>
            <span className="block text-label text-fg-3">Ketinggian Abu</span>
            <span className="font-mono text-num font-bold text-fg-1 tabular-nums">
              {formatAltitudeCompact(latestAdvisory.primaryFlightLevel)}
            </span>
          </div>
          <div>
            <span className="block text-label text-fg-3">Arah Pergerakan</span>
            <span className="text-body font-semibold text-fg-1">
              {formatMovementHuman(latestAdvisory.primaryMovement)}
            </span>
          </div>
          <div>
            <span className="block text-label text-fg-3">Pembaruan Terakhir</span>
            <span className="font-mono text-body text-fg-1 tabular-nums">
              {formatWibDateTime(latestAdvisory.dtg)}
            </span>
          </div>
        </div>
      </div>

      {/* Advisory History Section */}
      <div className="mt-stack">
        <h2 className="mb-row text-title text-fg-1">
          Riwayat Buletin {latestAdvisory.volcanoName} <span className="font-mono text-fg-3 tabular-nums">({history.length})</span>
        </h2>

        <div className="divide-y divide-line border-y border-line">
          {history.map((h) => (
            <div
              key={h.id}
              className="flex flex-col gap-cell py-row sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="flex flex-wrap items-baseline gap-x-cell">
                  <span className="text-body font-bold text-fg-1">
                    Buletin #{h.advisoryNumber}
                  </span>
                  <span className="font-mono text-small text-fg-3 tabular-nums">
                    {formatWibDateTime(h.dtg)}
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-row font-mono text-small text-fg-2">
                  <span>Alt: <strong className="font-semibold text-fg-1">{h.primaryFlightLevel}</strong></span>
                  <span>Arah: <strong className="font-semibold text-fg-1">{h.primaryMovement}</strong></span>
                </div>
              </div>

              <Link
                href={`/advisories/${h.id}`}
                className="inline-flex min-h-tap items-center gap-1 self-start text-small font-semibold text-accent transition-colors duration-120 hover:text-accent-hover sm:self-auto"
              >
                <span>Lihat Buletin</span>
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
