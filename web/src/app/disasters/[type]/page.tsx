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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { name: 'Kategori Bencana', url: '/disasters' },
          { name: categoryMeta.label, url: `/disasters/${type}` },
        ]}
      />

      {/* Header */}
      <div className="max-w-3xl mb-10">
        <div className="flex items-center gap-2 mb-2">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10"
            style={{ backgroundColor: `${categoryMeta.color}25` }}
          >
            <DisasterIcon type={type} size={16} color={categoryMeta.color} />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#8B95A7]">
            Pemantauan Resmi
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
          {seo.h1}
        </h1>
        <p className="mt-3 text-sm text-[#8B95A7] leading-relaxed">
          {seo.description}
        </p>

        {/* CTA to Map */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href={`/map`}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#EF4444] to-[#F97316] text-white font-bold text-xs shadow-lg shadow-red-600/20 hover:brightness-110 transition"
          >
            <Map className="h-4 w-4" />
            <span>Buka Peta Interaktif {categoryMeta.shortLabel}</span>
          </Link>
          <a
            href="#panduan"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs transition"
          >
            <BookOpen className="h-4 w-4 text-red-400" />
            <span>Panduan Keselamatan</span>
          </a>
        </div>
      </div>

      {/* Active Events List */}
      <section className="mb-14">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Radio className="h-4 w-4 text-red-500 animate-pulse" />
            <span>Laporan & Titik Kejadian Terkini ({categoryEvents.length})</span>
          </h2>
          <span className="text-xs text-[#8B95A7]">Diperbarui secara berkala</span>
        </div>

        {categoryEvents.length === 0 ? (
          <div className="p-8 rounded-3xl bg-[#111827] border border-white/10 text-center">
            <p className="text-sm text-[#8B95A7]">
              Saat ini tidak ada laporan kejadian kritis untuk kategori {categoryMeta.label}.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {categoryEvents.map((ev) => (
              <div
                key={ev.id}
                className="p-5 rounded-2xl bg-[#111827] border border-white/10 hover:border-white/20 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                      style={{
                        backgroundColor:
                          ev.severity === 'critical'
                            ? 'rgba(239, 68, 68, 0.2)'
                            : ev.severity === 'high'
                            ? 'rgba(249, 115, 22, 0.2)'
                            : 'rgba(245, 158, 11, 0.2)',
                        color:
                          ev.severity === 'critical'
                            ? '#F87171'
                            : ev.severity === 'high'
                            ? '#FB923C'
                            : '#FCD34D',
                      }}
                    >
                      {ev.severity.toUpperCase()}
                    </span>
                    <span className="text-[11px] text-[#8B95A7]">
                      {formatWibDateTime(ev.eventTime)}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white leading-snug">{ev.title}</h3>
                  <p className="text-xs text-[#8B95A7] mt-1.5 leading-relaxed">
                    {ev.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-[#CBD5E1]">
                    <MapPin className="h-3.5 w-3.5 text-[#3B82F6]" />
                    <span className="truncate">{ev.locationName || 'Indonesia'}</span>
                  </div>
                  <Link
                    href={`/map?lat=${ev.latitude}&lng=${ev.longitude}&label=${encodeURIComponent(ev.title)}`}
                    className="text-[#FF8A3D] hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>Pusatkan Peta</span>
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Embedded Evacuation & Safety Guide */}
      <section id="panduan" className="mb-14 p-6 sm:p-8 rounded-3xl bg-[#111827] border border-white/10">
        <div className="max-w-2xl mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-red-400">
            Panduan Tanggap Darurat
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            {guide.title}
          </h2>
          <p className="text-xs sm:text-sm text-[#8B95A7] mt-1">{guide.tagline}</p>
        </div>

        {/* Action Steps */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {guide.duringAction.map((step) => (
            <div key={step.step} className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-red-500/20 text-red-400 font-black text-xs mb-2">
                {step.step}
              </div>
              <h4 className="text-xs font-bold text-white">{step.title}</h4>
              <p className="text-[11px] text-[#8B95A7] mt-1 leading-relaxed">
                {step.instruction}
              </p>
            </div>
          ))}
        </div>

        {/* Hotlines */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-white">Nomor Darurat:</span>
            {guide.emergencyHotlines.map((hotline) => (
              <a
                key={hotline.number}
                href={`tel:${hotline.number}`}
                className="px-3 py-1 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300 font-bold hover:bg-red-900/40 transition"
              >
                {hotline.name}: {hotline.number}
              </a>
            ))}
          </div>
          <Link
            href="/safety-guide"
            className="text-xs font-bold text-[#FF8A3D] hover:underline"
          >
            Lihat Panduan Lengkap Semua Bencana →
          </Link>
        </div>
      </section>

      {/* Official Data Source Attribution */}
      <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#8B95A7]">
        <div>
          <span className="font-bold text-white">Otoritas Sumber Data Resmi: </span>
          <span>{categoryMeta.officialSources.join(', ')}</span>
        </div>
        <Link href="/data-sources" className="text-[#FF8A3D] hover:underline font-semibold shrink-0">
          Pelajari Metodologi Sumber Data →
        </Link>
      </div>
    </div>
  );
}
