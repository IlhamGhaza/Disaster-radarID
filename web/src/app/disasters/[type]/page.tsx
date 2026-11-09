import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAggregatedDisasters, DISASTER_CATEGORIES } from '@/lib/disasters/aggregator';
import { DisasterType } from '@/lib/disasters/types';
import { DISASTER_SAFETY_GUIDES } from '@/lib/safety-guides';
import { formatWibDateTime } from '@/lib/parser/date-utils';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { SITE_URL } from '@/config/site';
import { DisasterIcon } from '@/components/icons/disaster-icons';
import {
  MapPin,
  ChevronRight,
  ShieldAlert,
  BookOpen,
  Map,
} from 'lucide-react';

interface CategoryPageProps {
  params: Promise<{ type: string }>;
}

const CATEGORY_SEO_META: Record<
  string,
  { title: string; h1: string; description: string }
> = {
  earthquake: {
    title: 'Gempa Terkini Indonesia | Peta Gempa Bumi | Disaster Radar',
    h1: 'Gempa Terkini Indonesia',
    description:
      'Pantau informasi gempa bumi Indonesia melalui peta interaktif dan data yang tersedia dari sumber resmi BMKG. Informasi magnitudo, kedalaman, dan potensi tsunami.',
  },
  flood: {
    title: 'Peta Banjir Indonesia | Monitoring Banjir Terkini | Disaster Radar',
    h1: 'Peta Banjir Indonesia',
    description:
      'Pantau kondisi banjir dan genangan air di Indonesia melalui data resmi BNPB dan BPBD. Informasi ketinggian air dan wilayah terdampak.',
  },
  volcano: {
    title: 'Gunung Api Indonesia | Aktivitas & Peta Gunung Berapi | Disaster Radar',
    h1: 'Aktivitas Gunung Api Indonesia',
    description:
      'Pantau status 4 tingkat aktivitas resmi PVMBG (Normal, Waspada, Siaga, Awas) dari 127+ gunung api aktif di seluruh nusantara.',
  },
  'volcanic-ash': {
    title: 'Peta Sebaran Abu Vulkanik Indonesia | Volcanic Ash | Disaster Radar',
    h1: 'Sebaran Abu Vulkanik Indonesia',
    description:
      'Pantau poligon sebaran abu vulkanik aktif dan prakiraan sebaran ke depan (+6h, +12h, +18h) dari Darwin VAAC untuk keselamatan aviasi dan masyarakat.',
  },
  landslide: {
    title: 'Peta Tanah Longsor Indonesia | Monitoring Longsor Terkini | Disaster Radar',
    h1: 'Peta Tanah Longsor Indonesia',
    description:
      'Informasi titik kejadian tanah longsor, pergerakan tanah di lereng perbukitan, dan zona kerentanan bencana geologi di Indonesia.',
  },
  'forest-fire': {
    title: 'Peta Kebakaran Hutan Indonesia | Karhutla Terkini | Disaster Radar',
    h1: 'Kebakaran Hutan & Lahan Indonesia',
    description:
      'Pantau sebaran titik panas (hotspot) kebakaran hutan dan lahan gambut di Sumatera, Kalimantan, dan wilayah Indonesia lainnya.',
  },
  'extreme-weather': {
    title: 'Peringatan Cuaca Ekstrem Indonesia | Radar Cuaca BMKG | Disaster Radar',
    h1: 'Cuaca Ekstrem & Angin Kencang',
    description:
      'Peringatan dini cuaca ekstrem, hujan lebat disertai petir, dan angin puting beliung di wilayah kepulauan Indonesia.',
  },
  tsunami: {
    title: 'Peringatan Dini Tsunami Indonesia | InaTEWS BMKG | Disaster Radar',
    h1: 'Peringatan Dini Tsunami Indonesia',
    description:
      'Sistem pemantauan potensi gelombang tsunami pasca gempa tektonik kuat dari BMKG InaTEWS untuk keselamatan masyarakat pesisir.',
  },
  drought: {
    title: 'Peta Kekeringan Indonesia | Monitoring Krisis Air | Disaster Radar',
    h1: 'Peta Kekeringan Indonesia',
    description:
      'Pemantauan sebaran wilayah terdampak kekeringan lahan pertanian dan krisis air bersih pada musim kemarau.',
  },
  'coastal-hazard': {
    title: 'Bahaya Pesisir & Banjir Rob Indonesia | Disaster Radar',
    h1: 'Bahaya Pesisir & Banjir Rob',
    description:
      'Pantau ancaman gelombang pasang tinggi, abrasi pantai, dan banjir rob di dataran pesisir Indonesia.',
  },
};

export async function generateStaticParams() {
  return DISASTER_CATEGORIES.map((cat) => ({
    type: cat.type,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { type } = await params;
  const seo = CATEGORY_SEO_META[type];

  if (!seo) {
    return { title: 'Bencana Indonesia | Disaster Radar' };
  }

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: `${SITE_URL}/disasters/${type}`,
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${SITE_URL}/disasters/${type}`,
      siteName: 'Disaster Radar Indonesia',
      type: 'website',
    },
  };
}

// Severity → label Indonesia + token. Warna tidak pernah sendirian: selalu ada label teks.
const SEVERITY_LABEL: Record<string, string> = {
  critical: 'Kritis',
  high: 'Tinggi',
  moderate: 'Waspada',
  low: 'Rendah',
};
const SEVERITY_BADGE: Record<string, string> = {
  critical: 'border-sev-critical bg-sev-critical-soft text-sev-critical',
  high: 'border-sev-high bg-sev-high-soft text-sev-high',
  moderate: 'border-sev-warning bg-sev-warning-soft text-sev-warning',
  low: 'border-line-strong bg-surface text-fg-2',
};
const SEVERITY_EDGE: Record<string, string> = {
  critical: 'border-l-sev-critical',
  high: 'border-l-sev-high',
  moderate: 'border-l-sev-warning',
  low: 'border-l-line-strong',
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

export default async function CategoryDetailPage({ params }: CategoryPageProps) {
  const { type } = await params;
  const categoryMeta = DISASTER_CATEGORIES.find((c) => c.type === type);
  const seo = CATEGORY_SEO_META[type];

  if (!categoryMeta || !seo) {
    notFound();
  }

  const data = await getAggregatedDisasters('LIVE');
  const categoryEvents = data.events.filter((e) => e.type === type);
  const guide = DISASTER_SAFETY_GUIDES[type as DisasterType] || DISASTER_SAFETY_GUIDES.earthquake;

  return (
    <div className="w-full overflow-x-hidden">
      <div className="mx-auto max-w-7xl px-gutter py-stack sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { name: 'Kategori Bencana', url: '/disasters' },
            { name: categoryMeta.label, url: `/disasters/${type}` },
          ]}
        />

        {/* Hero Header */}
        <div className="mb-section pt-4">
          <div className="flex flex-col gap-gutter md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <div className="mb-row flex h-11 w-11 items-center justify-center rounded-control border border-line">
                <DisasterIcon type={categoryMeta.type} size={24} color="var(--fg-1)" />
              </div>

              <h1 className="text-display text-fg-1 text-balance md:text-display-lg">
                {seo.h1}
              </h1>

              <p className="mt-row text-body text-fg-2">
                {seo.description}
              </p>
            </div>

            {/* CTAs */}
            <div className="flex shrink-0 flex-col items-stretch gap-row sm:flex-row sm:items-center">
              <Link
                href="/map"
                className="inline-flex min-h-tap items-center justify-center gap-2 rounded-control bg-accent px-gutter text-small font-semibold text-fg-inverse transition-colors duration-120 hover:bg-accent-hover"
              >
                <Map className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Buka peta</span>
              </Link>
              <a
                href="#panduan"
                className="inline-flex min-h-tap items-center justify-center gap-2 rounded-control border border-line-strong px-gutter text-small font-semibold text-fg-1 transition-colors duration-120 hover:border-accent hover:text-accent"
              >
                <BookOpen className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Panduan Evakuasi</span>
              </a>
            </div>
          </div>
        </div>

        {/* Active Events List */}
        <section className="mb-section">
          <div className="mb-gutter flex flex-wrap items-baseline justify-between gap-x-gutter gap-y-1 border-b border-line pb-row">
            <div className="flex items-baseline gap-cell">
              <h2 className="text-title text-fg-1 md:text-title-lg">
                Laporan Kejadian Terkini
              </h2>
              <span className="font-mono text-small text-fg-2 tabular-nums">
                {categoryEvents.length} Aktif
              </span>
            </div>
            <span className="font-mono text-small text-fg-3 tabular-nums">
              Data {formatWibTime(data.lastUpdated)} WIB
            </span>
          </div>

          {categoryEvents.length === 0 ? (
            <div className="rounded-card border border-line bg-surface p-gutter text-center sm:p-stack">
              <ShieldAlert className="mx-auto h-6 w-6 text-fg-3" aria-hidden="true" />
              <h3 className="mt-cell text-heading font-semibold text-fg-1">
                Tidak ada laporan {categoryMeta.label.toLowerCase()} dari {categoryMeta.officialSources[0]}
              </h3>
              <p className="mt-1 text-small text-fg-2">
                Per data {formatWibTime(data.lastUpdated)} WIB. Tetap ikuti arahan BPBD setempat.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {categoryEvents.map((ev) => (
                <div
                  key={ev.id}
                  className={`flex min-w-0 flex-col justify-between rounded-card border border-line border-l-4 bg-surface p-gutter transition-colors duration-120 hover:border-line-strong ${SEVERITY_EDGE[ev.severity] ?? SEVERITY_EDGE.low}`}
                >
                  <div>
                    {/* Event Header Status */}
                    <div className="mb-cell flex min-w-0 items-center justify-between gap-cell">
                      <span
                        className={`shrink-0 rounded-badge border px-1.5 py-0.5 text-label ${SEVERITY_BADGE[ev.severity] ?? SEVERITY_BADGE.low}`}
                      >
                        {SEVERITY_LABEL[ev.severity] ?? ev.severity}
                      </span>
                      <span className="truncate font-mono text-small text-fg-3 tabular-nums">
                        {formatWibDateTime(ev.eventTime)}
                      </span>
                    </div>

                    <h3 className="break-words text-heading text-fg-1">
                      {ev.title}
                    </h3>

                    {ev.description && (
                      <p className="mt-1 line-clamp-3 text-small text-fg-2">
                        {ev.description}
                      </p>
                    )}

                    {/* Specialized Telemetry Grid */}
                    <div className="mt-row grid grid-cols-2 gap-x-gutter gap-y-cell border-t border-line pt-row text-small">
                      {/* Earthquake Specific Telemetry */}
                      {type === 'earthquake' && (
                        <>
                          {ev.metadata?.magnitude !== undefined && (
                            <div className="min-w-0">
                              <span className="block text-label text-fg-3">Magnitudo</span>
                              <span className="block font-mono text-num-lg font-bold text-fg-1 tabular-nums">
                                M {ev.metadata.magnitude.toFixed(1)}
                              </span>
                            </div>
                          )}
                          {ev.metadata?.depth && (
                            <div className="min-w-0">
                              <span className="block text-label text-fg-3">Kedalaman</span>
                              <span className="block font-mono text-num font-semibold text-fg-1 tabular-nums">
                                {ev.metadata.depth}
                              </span>
                            </div>
                          )}
                        </>
                      )}

                      {/* Volcano Specific Telemetry */}
                      {type === 'volcano' && (
                        <>
                          {ev.metadata?.magmaLevelName && (
                            <div className="min-w-0">
                              <span className="block text-label text-fg-3">Status PVMBG</span>
                              <span className="block font-semibold text-fg-1">
                                {ev.metadata.magmaLevelName}
                              </span>
                            </div>
                          )}
                          <div className="min-w-0">
                            <span className="block text-label text-fg-3">Sumber data</span>
                            <span className="block truncate text-fg-1">MAGMA ESDM</span>
                          </div>
                        </>
                      )}

                      {/* Forest Fire Specific Telemetry */}
                      {type === 'forest-fire' && (
                        <>
                          {ev.metadata?.confidence && (
                            <div className="min-w-0">
                              <span className="block text-label text-fg-3">Kepercayaan</span>
                              <span className="block font-mono font-semibold text-fg-1">
                                {String(ev.metadata.confidence)}
                              </span>
                            </div>
                          )}
                          {ev.metadata?.affectedAreaHa && (
                            <div className="min-w-0">
                              <span className="block text-label text-fg-3">Luas lahan</span>
                              <span className="block font-mono font-semibold text-fg-1 tabular-nums">
                                {ev.metadata.affectedAreaHa} ha
                              </span>
                            </div>
                          )}
                        </>
                      )}

                      {/* Flood Specific Telemetry */}
                      {type === 'flood' && ev.metadata?.waterLevelCm && (
                        <div className="min-w-0">
                          <span className="block text-label text-fg-3">Tinggi muka air</span>
                          <span className="block font-mono font-semibold text-fg-1 tabular-nums">
                            {ev.metadata.waterLevelCm} cm
                          </span>
                        </div>
                      )}

                      {/* Coordinates (Common) */}
                      <div className="min-w-0">
                        <span className="block text-label text-fg-3">Koordinat</span>
                        <span className="block truncate font-mono text-fg-1 tabular-nums">
                          {ev.latitude !== undefined && ev.longitude !== undefined
                            ? `${ev.latitude.toFixed(2)}°, ${ev.longitude.toFixed(2)}°`
                            : 'Terpantau'}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <span className="block text-label text-fg-3">Status</span>
                        <span className="block truncate text-fg-1">
                          {ev.status || 'Aktif'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Action */}
                  <div className="mt-row flex items-center justify-between gap-row border-t border-line pt-cell text-small">
                    <div className="flex min-w-0 flex-1 items-center gap-1.5 text-fg-2">
                      <MapPin className="h-4 w-4 shrink-0 text-fg-3" aria-hidden="true" />
                      <span className="truncate">{ev.locationName || 'Indonesia'}</span>
                    </div>
                    <Link
                      href={`/map?lat=${ev.latitude}&lng=${ev.longitude}&label=${encodeURIComponent(ev.title)}`}
                      className="inline-flex min-h-tap shrink-0 items-center gap-1 font-semibold text-accent transition-colors duration-120 hover:text-accent-hover"
                    >
                      <span>Pusatkan Peta</span>
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Embedded Evacuation & Safety Guide */}
        <section id="panduan" className="mb-section scroll-mt-20 border-t border-line pt-stack">
          <div className="mb-stack max-w-2xl">
            <span className="block text-small text-fg-3">
              Panduan tanggap darurat
            </span>
            <h2 className="mt-0.5 text-title text-fg-1 md:text-title-lg">
              {guide.title}
            </h2>
            <p className="mt-1 text-body text-fg-2">{guide.tagline}</p>
          </div>

          {/* Action Steps */}
          <ol className="mb-stack grid grid-cols-1 gap-x-stack gap-y-gutter sm:grid-cols-2 lg:grid-cols-4">
            {guide.duringAction.map((step) => (
              <li key={step.step} className="border-t-2 border-line-strong pt-row">
                <div className="font-mono text-num font-bold text-fg-1 tabular-nums">
                  0{step.step}
                </div>
                <h4 className="mt-1 text-body font-bold text-fg-1">{step.title}</h4>
                <p className="mt-1 text-small text-fg-2">
                  {step.instruction}
                </p>
              </li>
            ))}
          </ol>

          {/* Hotlines */}
          <div className="flex flex-col justify-between gap-gutter border-t border-line pt-gutter sm:flex-row sm:items-center">
            <div className="flex flex-wrap items-center gap-cell">
              <span className="mr-1 text-small font-semibold text-fg-2">
                Hotline Darurat:
              </span>
              {guide.emergencyHotlines.map((hotline) => (
                <a
                  key={hotline.number}
                  href={`tel:${hotline.number}`}
                  className="inline-flex min-h-tap items-center rounded-control border border-line-strong px-row text-small text-fg-1 transition-colors duration-120 hover:border-accent hover:text-accent"
                >
                  {hotline.name}: <span className="ml-1 font-mono font-bold tabular-nums">{hotline.number}</span>
                </a>
              ))}
            </div>
            <Link
              href="/safety-guide"
              className="inline-flex min-h-tap shrink-0 items-center gap-1 text-small font-semibold text-accent transition-colors duration-120 hover:text-accent-hover"
            >
              Lihat Panduan Lengkap Semua Bencana
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>

        {/* Official Data Source Attribution */}
        <div className="flex flex-col justify-between gap-cell border-t border-line pt-gutter text-small text-fg-2 sm:flex-row sm:items-center">
          <div>
            <span className="font-semibold text-fg-1">Otoritas Sumber Data Resmi: </span>
            <span>{categoryMeta.officialSources.join(', ')}</span>
          </div>
          <Link
            href="/data-sources"
            className="inline-flex min-h-tap shrink-0 items-center gap-1 font-semibold text-accent transition-colors duration-120 hover:text-accent-hover"
          >
            Lihat cara data diambil
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
