import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getDarwinAdvisories } from '@/lib/advisories';
import { formatAltitudeCompact, formatMovementHuman } from '@/lib/aviation-format';
import { getMagmaVolcanoStatus, getAllMonitoredVolcanoes } from '@/lib/magma-status';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { ChevronRight, Map, ShieldAlert, Mountain, Compass, Wind } from 'lucide-react';
import { SITE_URL } from '@/config/site';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Status Gunung Api Aktif & Sebaran Abu Vulkanik Hari Ini | Disaster Radar',
  description:
    'Pantau status gunung api aktif dan sebaran abu vulkanik di Indonesia hari ini. Data resmi MAGMA ESDM / PVMBG level aktivitas (Normal, Waspada, Siaga, Awas) serta peringatan abu vulkanik Darwin VAAC.',
  keywords: [
    'gunung api meletus hari ini',
    'status gunung api aktif',
    'status gunung merapi hari ini',
    'gunung lewotobi meletus',
    'gunung semeru hari ini',
    'abu vulkanik hari ini',
    'magma indonesia esdm',
  ],
  alternates: {
    canonical: `${SITE_URL}/volcanoes`,
  },
  openGraph: {
    title: 'Status Gunung Api Aktif & Sebaran Abu Vulkanik Hari Ini | Disaster Radar',
    description:
      'Pantau status gunung api aktif dan sebaran abu vulkanik di Indonesia hari ini. Data resmi MAGMA ESDM / PVMBG dan buletin penerbangan Darwin VAAC.',
    url: `${SITE_URL}/volcanoes`,
    siteName: 'Disaster Radar Indonesia',
    type: 'website',
    images: [
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'Gunung Api Indonesia — Disaster Radar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Status Gunung Api Aktif & Sebaran Abu Vulkanik Hari Ini | Disaster Radar',
    description:
      'Pantau status gunung api aktif dan sebaran abu vulkanik di Indonesia hari ini dengan status MAGMA PVMBG.',
    images: [`${SITE_URL}/opengraph-image`],
  },
};

// Level PVMBG → token severity. Warna selalu didampingi nama level (Awas/Siaga/…) dan angka romawi.
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

function formatWibTime(isoString: string): string {
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return '-';
  return new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export default async function VolcanoesPage() {
  const data = await getDarwinAdvisories();
  const volcanoes = data.deduplicated;
  const monitored = getAllMonitoredVolcanoes();

  // Highlighted high status volcanoes from PVMBG catalog
  const criticalVolcanoes = monitored.filter(
    (m) => m.level === 4 || m.level === 3
  );

  return (
    <div className="mx-auto max-w-7xl px-gutter py-stack sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ name: 'Gunung Api & Abu Vulkanik', url: '/volcanoes' }]} />

      {/* Hero Header */}
      <div className="mb-section pt-4">
        <div className="flex flex-col gap-gutter md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-display text-fg-1 text-balance md:text-display-lg">
              Gunung Api & Sebaran <span className="serif-accent text-accent">abu</span> Vulkanik
            </h1>

            <p className="mt-row text-body text-fg-2">
              Pantau sebaran abu vulkanik yang sedang aktif teramati dari buletin resmi <span className="font-semibold text-fg-1">Darwin VAAC</span> serta status aktivitas {monitored.length} gunung api dari <span className="font-semibold text-fg-1">MAGMA ESDM / PVMBG</span>.
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-gutter">
            <div className="text-small text-fg-2">
              <span className="mr-1 font-mono text-num-lg font-semibold text-fg-1 tabular-nums">{volcanoes.length}</span> Sebaran Abu Aktif
            </div>
            <Link
              href="/map"
              className="inline-flex min-h-tap items-center gap-2 rounded-control bg-accent px-4 text-body font-semibold text-fg-inverse transition-colors duration-120 hover:bg-accent-hover"
            >
              <Map className="h-4 w-4" aria-hidden="true" />
              <span>Lihat di peta</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Active Ash Volcanoes Section */}
      <div className="mb-section">
        <div className="mb-gutter flex flex-wrap items-baseline justify-between gap-x-gutter gap-y-1 border-b border-line pb-row">
          <div className="flex items-center gap-cell">
            <Wind className="h-5 w-5 text-sev-ash" aria-hidden="true" />
            <h2 className="text-title text-fg-1 md:text-title-lg">
              Gunung Api dengan Sebaran Abu Aktif
            </h2>
          </div>
          <span className="text-small text-fg-3">Buletin Darwin VAAC</span>
        </div>

        {volcanoes.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {volcanoes.map((v) => {
              const slug = v.volcanoName.toLowerCase();
              const magmaStatus = getMagmaVolcanoStatus(v.volcanoName);

              return (
                <div
                  key={v.id}
                  className="flex flex-col justify-between rounded-card border border-line bg-surface p-gutter"
                >
                  <div>
                    {/* Header card */}
                    <div className="mb-row flex items-start justify-between gap-cell">
                      <div>
                        <h3 className="text-heading text-fg-1">
                          {v.volcanoName}
                        </h3>
                        <span className="mt-0.5 flex items-center gap-1 text-small text-fg-3">
                          <Compass className="h-3.5 w-3.5" aria-hidden="true" />
                          {v.area}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center justify-end gap-1.5">
                        <span
                          className={`rounded-badge border px-1.5 py-0.5 text-label ${LEVEL_BADGE[magmaStatus.level] ?? LEVEL_BADGE[1]}`}
                        >
                          {magmaStatus.levelName}
                        </span>
                        <span className="rounded-badge border border-sev-ash bg-sev-ash-soft px-1.5 py-0.5 text-label text-sev-ash">
                          Abu Aktif
                        </span>
                      </div>
                    </div>

                    {/* MAGMA Status Box */}
                    <div
                      className={`border-l-4 pl-row ${LEVEL_EDGE[magmaStatus.level] ?? LEVEL_EDGE[1]}`}
                    >
                      <div className="flex items-center justify-between text-small">
                        <span className="text-fg-3">MAGMA Indonesia</span>
                        <span className="font-mono font-semibold text-fg-1">{magmaStatus.levelRoman}</span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-small text-fg-2">
                        {magmaStatus.description}
                      </p>
                    </div>

                    {/* Flight Level & Movement Specs */}
                    <div className="mt-gutter divide-y divide-line border-y border-line text-small">
                      <div className="flex items-baseline justify-between gap-cell py-cell">
                        <span className="shrink-0 text-fg-3">Ketinggian Abu:</span>
                        <span className="text-right font-mono font-semibold text-fg-1 tabular-nums">
                          {formatAltitudeCompact(v.primaryFlightLevel)}
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between gap-cell py-cell">
                        <span className="shrink-0 text-fg-3">Arah Sebaran:</span>
                        <span className="text-right text-fg-1">
                          {formatMovementHuman(v.primaryMovement)}
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between gap-cell py-cell">
                        <span className="shrink-0 text-fg-3">Observasi:</span>
                        <span className="font-mono text-fg-1 tabular-nums">
                          {formatWibTime(v.dtg)} WIB
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-row flex items-center justify-between gap-cell">
                    <Link
                      href={`/volcanoes/${slug}`}
                      className="inline-flex min-h-tap items-center gap-1 text-small font-semibold text-accent transition-colors duration-120 hover:text-accent-hover"
                    >
                      <span>Profil Lengkap</span>
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </Link>

                    <Link
                      href={`/map?lat=${v.position?.latitude || -7.9}&lng=${v.position?.longitude || 112.9}&zoom=10`}
                      className="inline-flex min-h-tap items-center gap-1.5 rounded-control border border-line-strong px-3 text-small font-semibold text-fg-1 transition-colors duration-120 hover:border-accent hover:text-accent"
                    >
                      <Map className="h-4 w-4" aria-hidden="true" />
                      <span>Poligon Peta</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-card border border-line bg-surface p-gutter text-center">
            <ShieldAlert className="mx-auto h-6 w-6 text-fg-3" aria-hidden="true" />
            <h3 className="mt-cell text-heading font-semibold text-fg-1">
              Tidak Ada Sebaran Abu Vulkanik Aktif Saat Ini
            </h3>
            <p className="mx-auto mt-1 max-w-md text-small text-fg-2">
              Seluruh jalur penerbangan terpantau bersih dari abu vulkanik menurut buletin Darwin VAAC terbaru.
            </p>
          </div>
        )}
      </div>

      {/* PVMBG Monitored Volcanoes Status (Critical / Warning) */}
      <div>
        <div className="mb-gutter flex flex-wrap items-baseline justify-between gap-x-gutter gap-y-1 border-b border-line pb-row">
          <div className="flex items-center gap-cell">
            <Mountain className="h-5 w-5 text-fg-3" aria-hidden="true" />
            <h2 className="text-title text-fg-1 md:text-title-lg">
              Katalog Status Siaga & Awas PVMBG
            </h2>
          </div>
          <span className="font-mono text-small text-fg-3 tabular-nums">{monitored.length} Gunung Api Terpantau</span>
        </div>

        {criticalVolcanoes.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {criticalVolcanoes.slice(0, 8).map((mv) => (
              <Link
                key={mv.volcanoSlug}
                href={`/volcanoes/${mv.volcanoSlug}`}
                className={`group rounded-card border border-line border-l-4 bg-surface p-row transition-colors duration-120 hover:border-line-strong hover:bg-raised ${LEVEL_EDGE[mv.level] ?? LEVEL_EDGE[1]}`}
              >
                <div className="mb-cell flex items-center justify-between gap-cell">
                  <span
                    className={`rounded-badge border px-1.5 py-0.5 text-label ${LEVEL_BADGE[mv.level] ?? LEVEL_BADGE[1]}`}
                  >
                    {mv.levelName}
                  </span>
                  <span className="font-mono text-small text-fg-3 tabular-nums">
                    {mv.elevation}
                  </span>
                </div>
                <h3 className="text-heading text-fg-1 group-hover:text-accent">
                  G. {mv.volcanoName}
                </h3>
                <p className="mt-0.5 truncate text-small text-fg-3">
                  {mv.area}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="rounded-card border border-line bg-surface p-gutter text-small text-fg-2">
            Tidak ada gunung api berstatus Siaga atau Awas dalam katalog PVMBG saat ini.
          </p>
        )}
      </div>
    </div>
  );
}
