import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAggregatedDisasters, DISASTER_CATEGORIES } from '@/lib/disasters/aggregator';
import { DisasterType } from '@/lib/disasters/types';
import { DISASTER_SAFETY_GUIDES } from '@/lib/safety-guides';
import { formatWibDateTime } from '@/lib/parser/date-utils';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { SITE_CONFIG, SITE_URL } from '@/config/site';
import { DisasterIcon } from '@/components/icons/disaster-icons';
import {
  MapPin,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  BookOpen,
  Map,
  Clock,
  Radio,
  AlertTriangle,
  ArrowRight,
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
    <div className="w-full bg-[#080C14] text-[#E8ECF1] overflow-x-hidden min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { name: 'Kategori Bencana', url: '/disasters' },
            { name: categoryMeta.label, url: `/disasters/${type}` },
          ]}
        />

        {/* Hero Header */}
        <div className="relative mt-4 mb-10 rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#140E16] via-[#0D1017] to-[#070A10] p-5 sm:p-8 overflow-hidden shadow-2xl">
          <div
            className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full blur-[120px] opacity-20"
            style={{ backgroundColor: categoryMeta.color }}
          />

          <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="max-w-2xl">
              <div
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-mono font-semibold tracking-wider uppercase mb-3 backdrop-blur-md"
                style={{
                  backgroundColor: categoryMeta.bgRgba,
                  borderColor: categoryMeta.borderRgba,
                  color: categoryMeta.color,
                }}
              >
                <span className="relative flex h-2 w-2">
                  <span
                    className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                    style={{ backgroundColor: categoryMeta.color }}
                  />
                  <span
                    className="relative inline-flex h-2 w-2 rounded-full"
                    style={{ backgroundColor: categoryMeta.color }}
                  />
                </span>
                <span>PEMANTAUAN {categoryMeta.label.toUpperCase()}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#E8ECF1] leading-[1.1]">
                {seo.h1}
              </h1>

              <p className="mt-3 text-sm sm:text-base text-[#94A3B8] leading-relaxed">
                {seo.description}
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <Link
                href="/map"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold text-xs shadow-lg shadow-red-600/25 transition-all hover:from-red-500 hover:to-orange-400 hover:-translate-y-0.5"
              >
                <Map className="h-4 w-4 shrink-0" />
                <span>Buka di Peta Radar</span>
              </Link>
              <a
                href="#panduan"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#0D1117] border border-white/[0.12] text-[#E8ECF1] font-semibold text-xs hover:bg-[#151C28] hover:text-white transition"
              >
                <BookOpen className="h-4 w-4 text-orange-400 shrink-0" />
                <span>Panduan Evakuasi</span>
              </a>
            </div>
          </div>
        </div>

        {/* Active Events List */}
        <section className="mb-14">
          <div className="flex items-center justify-between gap-4 mb-5 border-b border-white/[0.06] pb-3">
            <div className="flex items-center gap-2">
              <Radio className="h-4 w-4 text-red-400 animate-pulse shrink-0" />
              <h2 className="text-sm sm:text-base font-bold text-[#E8ECF1] uppercase tracking-wide">
                Laporan Kejadian Terkini
              </h2>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-mono font-bold text-[#8B95A7] tabular-nums">
                {categoryEvents.length} Aktif
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#64748B] hidden sm:inline">
              Data Resmi Multi-Lembaga
            </span>
          </div>

          {categoryEvents.length === 0 ? (
            <div className="p-8 sm:p-12 rounded-2xl border border-white/[0.08] bg-[#0D1117] text-center">
              <ShieldAlert className="mx-auto h-8 w-8 text-[#64748B]" />
              <h3 className="mt-3 text-sm font-semibold text-[#E8ECF1]">
                Nihil kejadian aktif terpantau saat ini
              </h3>
              <p className="mt-1 text-xs text-[#94A3B8]">
                Kondisi telemetri untuk {categoryMeta.label} berada dalam ambang batas aman.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {categoryEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="rounded-2xl border border-white/[0.08] bg-[#0D1117] p-4 sm:p-5 hover:border-white/[0.18] transition-all duration-200 flex flex-col justify-between min-w-0 shadow-xl"
                >
                  <div>
                    {/* Event Header Status */}
                    <div className="flex items-center justify-between gap-2 mb-2.5 min-w-0">
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border shrink-0"
                        style={{
                          backgroundColor:
                            ev.severity === 'critical'
                              ? 'rgba(239, 68, 68, 0.15)'
                              : ev.severity === 'high'
                              ? 'rgba(249, 115, 22, 0.15)'
                              : 'rgba(245, 158, 11, 0.15)',
                          borderColor:
                            ev.severity === 'critical'
                              ? 'rgba(239, 68, 68, 0.4)'
                              : ev.severity === 'high'
                              ? 'rgba(249, 115, 22, 0.4)'
                              : 'rgba(245, 158, 11, 0.4)',
                          color:
                            ev.severity === 'critical'
                              ? '#EF4444'
                              : ev.severity === 'high'
                              ? '#F97316'
                              : '#EAB308',
                        }}
                      >
                        {ev.severity.toUpperCase()}
                      </span>
                      <span className="text-[11px] font-mono text-[#8B95A7] truncate">
                        {formatWibDateTime(ev.eventTime)}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-[#E8ECF1] leading-snug break-words">
                      {ev.title}
                    </h3>

                    {ev.description && (
                      <p className="mt-2 text-xs text-[#94A3B8] leading-relaxed line-clamp-3">
                        {ev.description}
                      </p>
                    )}

                    {/* Specialized Telemetry Grid */}
                    <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl border border-white/[0.06] bg-[#070A10] p-2.5 text-xs font-mono">
                      {/* Earthquake Specific Telemetry */}
                      {type === 'earthquake' && (
                        <>
                          {ev.metadata?.magnitude !== undefined && (
                            <div className="min-w-0">
                              <span className="text-[10px] text-[#64748B] block">MAGNITUDO</span>
                              <span className="text-red-400 font-bold block text-sm">
                                M {ev.metadata.magnitude.toFixed(1)}
                              </span>
                            </div>
                          )}
                          {ev.metadata?.depth && (
                            <div className="min-w-0">
                              <span className="text-[10px] text-[#64748B] block">KEDALAMAN</span>
                              <span className="text-amber-400 font-bold block">
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
                              <span className="text-[10px] text-[#64748B] block">STATUS PVMBG</span>
                              <span className="text-orange-400 font-bold block">
                                {ev.metadata.magmaLevelName}
                              </span>
                            </div>
                          )}
                          <div className="min-w-0">
                            <span className="text-[10px] text-[#64748B] block">SUMBER DATA</span>
                            <span className="text-[#E8ECF1] truncate block">MAGMA ESDM</span>
                          </div>
                        </>
                      )}

                      {/* Forest Fire Specific Telemetry */}
                      {type === 'forest-fire' && (
                        <>
                          {ev.metadata?.confidence && (
                            <div className="min-w-0">
                              <span className="text-[10px] text-[#64748B] block">KEPERCAYAAN</span>
                              <span className="text-orange-400 font-bold block">
                                {String(ev.metadata.confidence)}
                              </span>
                            </div>
                          )}
                          {ev.metadata?.affectedAreaHa && (
                            <div className="min-w-0">
                              <span className="text-[10px] text-[#64748B] block">LUAS LAHAN</span>
                              <span className="text-amber-400 font-bold block">
                                {ev.metadata.affectedAreaHa} Ha
                              </span>
                            </div>
                          )}
                        </>
                      )}

                      {/* Flood Specific Telemetry */}
                      {type === 'flood' && ev.metadata?.waterLevelCm && (
                        <div className="min-w-0">
                          <span className="text-[10px] text-[#64748B] block">TMA AIR</span>
                          <span className="text-blue-400 font-bold block">
                            {ev.metadata.waterLevelCm} cm
                          </span>
                        </div>
                      )}

                      {/* Coordinates (Common) */}
                      <div className="min-w-0">
                        <span className="text-[10px] text-[#64748B] block">KOORDINAT</span>
                        <span className="text-[#E8ECF1] truncate block tabular-nums">
                          {ev.latitude !== undefined && ev.longitude !== undefined
                            ? `${ev.latitude.toFixed(2)}°, ${ev.longitude.toFixed(2)}°`
                            : 'Terpantau'}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] text-[#64748B] block">STATUS</span>
                        <span className="text-emerald-400 truncate block">
                          {ev.status || 'Aktif'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Action */}
                  <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-1.5 text-[#8B95A7] min-w-0 flex-1">
                      <MapPin className="h-3.5 w-3.5 text-red-400 shrink-0" />
                      <span className="truncate">{ev.locationName || 'Indonesia'}</span>
                    </div>
                    <Link
                      href={`/map?lat=${ev.latitude}&lng=${ev.longitude}&label=${encodeURIComponent(ev.title)}`}
                      className="inline-flex items-center gap-1 text-[#F97316] hover:text-[#FB923C] font-semibold text-xs transition shrink-0"
                    >
                      <span>Pusatkan Peta</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Embedded Evacuation & Safety Guide */}
        <section
          id="panduan"
          className="mb-14 p-5 sm:p-8 rounded-2xl border border-white/[0.08] bg-[#0D1117] shadow-xl"
        >
          <div className="max-w-2xl mb-6">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-orange-400">
              PANDUAN TANGGAP DARURAT
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#E8ECF1] mt-1">
              {guide.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">{guide.tagline}</p>
          </div>

          {/* Action Steps */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {guide.duringAction.map((step) => (
              <div
                key={step.step}
                className="p-4 rounded-xl bg-[#080C14] border border-white/[0.06]"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/20 text-orange-400 font-mono font-bold text-xs mb-2">
                  0{step.step}
                </div>
                <h4 className="text-xs font-bold text-[#E8ECF1]">{step.title}</h4>
                <p className="text-[11px] text-[#8B95A7] mt-1 leading-relaxed">
                  {step.instruction}
                </p>
              </div>
            ))}
          </div>

          {/* Hotlines */}
          <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#8B95A7] uppercase mr-1">
                Hotline Darurat:
              </span>
              {guide.emergencyHotlines.map((hotline) => (
                <a
                  key={hotline.number}
                  href={`tel:${hotline.number}`}
                  className="px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-500/30 text-xs text-red-300 font-mono font-bold hover:bg-red-900/40 transition"
                >
                  {hotline.name}: {hotline.number}
                </a>
              ))}
            </div>
            <Link
              href="/safety-guide"
              className="text-xs font-semibold text-orange-400 hover:text-orange-300 transition shrink-0"
            >
              Lihat Panduan Lengkap Semua Bencana →
            </Link>
          </div>
        </section>

        {/* Official Data Source Attribution */}
        <div className="p-4 sm:p-5 rounded-xl border border-white/[0.06] bg-[#0A0E17] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#8B95A7]">
          <div>
            <span className="font-bold text-[#E8ECF1]">Otoritas Sumber Data Resmi: </span>
            <span>{categoryMeta.officialSources.join(', ')}</span>
          </div>
          <Link
            href="/data-sources"
            className="text-orange-400 hover:text-orange-300 transition shrink-0 font-medium"
          >
            Pelajari Metodologi Sumber Data →
          </Link>
        </div>
      </div>
    </div>
  );
}
