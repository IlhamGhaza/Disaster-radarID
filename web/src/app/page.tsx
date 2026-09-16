import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getAggregatedDisasters, DISASTER_CATEGORIES } from '@/lib/disasters/aggregator';
import { SITE_URL } from '@/config/site';
import { JsonLd, getFaqJsonLd } from '@/components/json-ld';
import { DisasterIcon } from '@/components/icons/disaster-icons';
import { TacticalRadarHud } from '@/components/home/tactical-radar-hud';
import { AirQualityCard } from '@/components/air-quality-card';
import {
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  BookOpen,
  MapPin,
  Zap,
  ExternalLink,
  Phone,
  Shield,
  Radar,
  Radio,
  Clock,
  Compass,
  Layers,
} from 'lucide-react';

export const revalidate = 180; // 3 min revalidation

export const metadata: Metadata = {
  title: 'Peta Bencana Indonesia Terkini, Info Gempa BMKG & Kualitas Udara',
  description:
    'Pantau info gempa bumi hari ini dari BMKG, peta banjir, kualitas udara ISPU, status gunung meletus PVMBG, dan peringatan cuaca ekstrem terkini di Indonesia.',
  keywords: [
    'gempa hari ini',
    'info gempa bmkg',
    'gempa bumi terkini',
    'kualitas udara hari ini',
    'cek polusi udara',
    'gunung meletus hari ini',
    'peta banjir hari ini',
    'cuaca ekstrem bmkg',
    'peta bencana indonesia',
  ],
  alternates: {
    canonical: `${SITE_URL}`,
  },
  openGraph: {
    title: 'Peta Bencana Indonesia Terkini, Info Gempa BMKG & Kualitas Udara',
    description:
      'Pantau info gempa bumi hari ini dari BMKG, peta banjir, kualitas udara ISPU, status gunung meletus PVMBG, dan peringatan cuaca ekstrem terkini di Indonesia.',
    url: `${SITE_URL}`,
    siteName: 'Disaster Radar Indonesia',
    type: 'website',
    images: [
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'Disaster Radar Indonesia — Peta dan Monitoring Bencana Terkini',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Peta Bencana Indonesia Terkini, Info Gempa BMKG & Kualitas Udara',
    description:
      'Pantau info gempa bumi hari ini dari BMKG, peta banjir, kualitas udara ISPU, status gunung meletus PVMBG, dan cuaca ekstrem.',
    images: [`${SITE_URL}/opengraph-image`],
  },
};

const FAQ_ITEMS = [
  {
    question: 'Bagaimana cara mengecek info gempa bumi terkini hari ini dari BMKG?',
    answer:
      'Anda dapat melihat daftar gempa bumi terbaru langsung di halaman depan atau buka menu Peta Radar. Informasi mencakup magnitudo, kedalaman, koordinat pusat gempa, dan peringatan potensi tsunami yang diperbarui otomatis dari BMKG.',
  },
  {
    question: 'Bagaimana cara melihat peta banjir dan wilayah terdampak di Indonesia?',
    answer:
      'Pilih kategori Peta Banjir atau buka Peta Radar. Anda dapat melihat titik genangan luapan air, ketinggian muka air sungai, serta kawasan rawan banjir berdasarkan laporan BNPB dan BPBD setempat.',
  },
  {
    question: 'Bagaimana cara memantau status gunung api aktif dan arah abu vulkanik?',
    answer:
      'Buka menu Gunung Api untuk memantau 127 gunung berapi di Indonesia dengan status resmi MAGMA PVMBG (Normal, Waspada, Siaga, Awas), lengkap dengan peta prakiraan sebaran abu vulkanik penerbangan dari Darwin VAAC.',
  },
  {
    question: 'Bagaimana cara cek kualitas udara (ISPU) di lokasi saya saat ini?',
    answer:
      'Izinkan akses lokasi atau pilih kota Anda pada kartu Kualitas Udara di halaman utama atau di peta. Sistem akan menampilkan angka indeks ISPU, kadar debu halus PM2.5, riwayat 24 jam, dan panduan kesehatan.',
  },
  {
    question: 'Dari mana sumber data resmi kebencanaan di Disaster Radar Indonesia?',
    answer:
      'Semua data dihimpun langsung dari sumber resmi pemerintah: BMKG untuk gempa tektonik dan cuaca, BNPB untuk banjir dan karhutla, PVMBG untuk aktivitas gunung api, serta Darwin VAAC untuk pergerakan abu vulkanik.',
  },
  {
    question: 'Apakah Disaster Radar Indonesia platform resmi pemerintah?',
    answer:
      'Bukan. Disaster Radar Indonesia adalah inisiatif independen untuk menyajikan informasi publik agar mudah dipahami semua orang. Untuk instruksi evakuasi darurat resmi, selalu ikuti komando dari BNPB, BPBD, dan aparat di lapangan.',
  },
];

function formatTimeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Baru saja';
  if (mins < 60) return `${mins}m lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}j lalu`;
  return `${Math.floor(hours / 24)}h lalu`;
}

function getSeverityBadge(severity: string) {
  switch (severity) {
    case 'critical':
      return {
        label: 'KRITIS',
        badgeClass: 'border-red-500/40 bg-red-950/40 text-red-400',
        pulseColor: '#EF4444',
      };
    case 'high':
      return {
        label: 'TINGGI',
        badgeClass: 'border-orange-500/40 bg-orange-950/40 text-orange-400',
        pulseColor: '#F97316',
      };
    case 'moderate':
      return {
        label: 'WASPADA',
        badgeClass: 'border-amber-500/40 bg-amber-950/40 text-amber-300',
        pulseColor: '#EAB308',
      };
    default:
      return {
        label: 'NORMAL',
        badgeClass: 'border-emerald-500/40 bg-emerald-950/40 text-emerald-400',
        pulseColor: '#10B981',
      };
  }
}

export default async function HomePage() {
  const data = await getAggregatedDisasters('LIVE');
  const { counts, events, sources, lastUpdated } = data;

  // Filter out non-disaster data providers (e.g. OSM base map)
  const disasterSources = sources.filter((s) => s.code !== 'OSM');
  const activeSources = disasterSources.filter((s) => s.status === 'online').length;

  // Sort events by severity then recency
  const sortedEvents = [...events].sort((a, b) => {
    const sevOrder: Record<string, number> = { critical: 0, high: 1, moderate: 2, low: 3 };
    const sevDiff = (sevOrder[a.severity] ?? 3) - (sevOrder[b.severity] ?? 3);
    if (sevDiff !== 0) return sevDiff;
    return new Date(b.eventTime).getTime() - new Date(a.eventTime).getTime();
  });

  // Top priority incident spotlight and top 5 recent feed
  const priorityEvent = sortedEvents[0] || null;
  const recentEvents = sortedEvents.slice(0, 6);

  // Categorize 10 disaster categories into 3 logical clusters
  const geologyTypes = ['earthquake', 'volcano', 'volcanic-ash', 'tsunami'];
  const hydroTypes = ['flood', 'extreme-weather', 'forest-fire', 'landslide', 'drought'];
  const marineTypes = ['coastal-hazard'];

  const geologyCategories = DISASTER_CATEGORIES.filter((c) => geologyTypes.includes(c.type));
  const hydroCategories = DISASTER_CATEGORIES.filter((c) => hydroTypes.includes(c.type));
  const marineCategories = DISASTER_CATEGORIES.filter((c) => marineTypes.includes(c.type));

  return (
    <div className="flex flex-col w-full bg-[#080C14] text-[#E8ECF1] overflow-x-hidden">
      <JsonLd data={getFaqJsonLd(FAQ_ITEMS)} />

      {/* ════════════════════════════════════════════════════════
          SECTION 1 — HERO: Command Center & Tactical Radar HUD
          ════════════════════════════════════════════════════════ */}
      <section className="relative border-b border-white/[0.06] overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16 lg:pt-16 lg:pb-20">
        {/* Background tactical grid and subtle radial glow */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)`,
              backgroundSize: '48px 48px',
            }}
          />
          <div className="absolute -top-32 left-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-red-600/10 blur-[130px]" />
          <div className="absolute top-10 right-10 h-[400px] w-[400px] rounded-full bg-cyan-600/10 blur-[140px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: Heading & Telemetry Meta */}
            <div className="lg:col-span-7 flex flex-col items-start">
              {/* Telemetry status badge */}
              <div className="inline-flex max-w-full flex-wrap items-center gap-2 sm:gap-2.5 rounded-full border border-white/[0.1] bg-[#0E1420]/80 px-3 py-1.5 sm:px-3.5 sm:py-1.5 backdrop-blur-md mb-6 shadow-sm">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="text-[10px] sm:text-[11px] font-mono font-semibold tracking-wider text-emerald-400 uppercase">
                  PANTAUAN LANGSUNG (LIVE)
                </span>
                <span className="text-white/20">•</span>
                <span className="text-[10px] sm:text-[11px] font-mono text-[#94A3B8] tabular-nums">
                  {activeSources} Sumber Resmi Terhubung
                </span>
                <span className="text-white/20 hidden sm:inline">•</span>
                <span className="text-[10px] sm:text-[11px] font-mono text-[#94A3B8] hidden sm:inline">
                  {formatTimeAgo(lastUpdated)}
                </span>
              </div>

              {/* Main Heading (Exact H1 for SEO) */}
              <h1 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-extrabold tracking-tight leading-[1.08] text-[#E8ECF1]">
                Pusat Monitoring <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-amber-400">
                  Bencana Indonesia
                </span>
              </h1>

              {/* Subheading */}
              <p className="mt-5 max-w-2xl text-sm sm:text-base leading-relaxed text-[#94A3B8]">
                Pantau info gempa bumi hari ini dari <span className="text-[#E8ECF1] font-semibold">BMKG</span>, titik banjir dari <span className="text-[#E8ECF1] font-semibold">BNPB</span>, status gunung berapi <span className="text-[#E8ECF1] font-semibold">PVMBG</span>, serta kualitas udara real-time dalam satu peta interaktif yang mudah dipahami.
              </p>

              {/* Tactical Quick Stats Pills */}
              <div className="mt-6 flex flex-wrap items-center gap-2 text-xs font-mono">
                <div className="flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-[#0D121D] px-2.5 py-1 text-[#94A3B8]">
                  <Compass className="h-3 w-3 text-red-400" />
                  <span>127 Gunung Api Terpantau</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-[#0D121D] px-2.5 py-1 text-[#94A3B8]">
                  <Zap className="h-3 w-3 text-amber-400" />
                  <span>Gempa Bumi BMKG</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-[#0D121D] px-2.5 py-1 text-[#94A3B8]">
                  <Layers className="h-3 w-3 text-cyan-400" />
                  <span>10 Jenis Peringatan Bahaya</span>
                </div>
              </div>

              {/* High-volume SEO Quick Search Strip (Topik Paling Dicari) */}
              <div className="mt-5 flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-[11px] text-[#64748B] flex items-center gap-1 font-mono">
                  <Zap className="h-3 w-3 text-amber-400" />
                  Paling Dicari:
                </span>
                <Link
                  href="/disasters/earthquake"
                  className="px-2.5 py-1 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.08] hover:border-red-500/40 text-[11px] text-[#CBD5E1] hover:text-white transition"
                >
                  Gempa Hari Ini BMKG
                </Link>
                <Link
                  href="/disasters/flood"
                  className="px-2.5 py-1 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.08] hover:border-blue-500/40 text-[11px] text-[#CBD5E1] hover:text-white transition"
                >
                  Peta Titik Banjir
                </Link>
                <Link
                  href="/volcanoes"
                  className="px-2.5 py-1 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.08] hover:border-orange-500/40 text-[11px] text-[#CBD5E1] hover:text-white transition"
                >
                  Status Gunung Meletus
                </Link>
                <Link
                  href="/map"
                  className="px-2.5 py-1 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.08] hover:border-cyan-500/40 text-[11px] text-[#CBD5E1] hover:text-white transition"
                >
                  Kualitas Udara ISPU
                </Link>
                <Link
                  href="/disasters/extreme-weather"
                  className="px-2.5 py-1 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.08] hover:border-yellow-500/40 text-[11px] text-[#CBD5E1] hover:text-white transition"
                >
                  Peringatan Cuaca Ekstrem
                </Link>
              </div>

              {/* CTAs */}
              <div className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <Link
                  href="/map"
                  className="group relative inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-5 sm:px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-600/25 transition-all duration-200 hover:from-red-500 hover:to-orange-400 hover:shadow-red-500/40 hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Radar className="h-4 w-4 transition-transform group-hover:rotate-45 shrink-0" />
                  <span className="truncate">Buka Peta Bencana Live</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 shrink-0" />
                </Link>

                <div className="flex items-center gap-2.5 sm:gap-3">
                  <Link
                    href="/safety-guide"
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.12] bg-[#0D1117]/90 px-4 sm:px-5 py-3.5 text-sm font-semibold text-[#E8ECF1] backdrop-blur-md transition-all duration-200 hover:border-white/[0.25] hover:bg-[#151C28] hover:text-white"
                  >
                    <Shield className="h-4 w-4 text-orange-400 shrink-0" />
                    <span>Panduan Keselamatan</span>
                  </Link>

                  <a
                    href="tel:112"
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-500/30 bg-red-950/30 px-3.5 sm:px-4 py-3.5 text-sm font-bold text-red-300 transition-all hover:border-red-500/60 hover:bg-red-900/40 hover:text-white shrink-0"
                    title="Panggil Nomor Darurat Nasional Bebas Pulsa"
                  >
                    <Phone className="h-4 w-4 text-red-400 shrink-0" />
                    <span>Darurat 112</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Tactical Radar HUD */}
            <div className="lg:col-span-5 w-full min-w-0">
              <TacticalRadarHud events={events} criticalCount={counts.critical} />
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 2 — EMERGENCY THREAT LEVEL MATRIX (LIVE STATS)
          ════════════════════════════════════════════════════════ */}
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 z-10">
        <h2 className="sr-only">Ringkasan Tingkat Bahaya Bencana Indonesia Hari Ini</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {/* Critical */}
          <div className="relative rounded-xl border border-red-500/25 bg-[#0D1117]/95 p-3.5 sm:p-5 shadow-lg shadow-black/40 backdrop-blur-md transition-all hover:border-red-500/50 hover:bg-[#121722] group min-w-0">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-red-500 to-transparent rounded-t-xl" />
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-wider text-red-400 uppercase truncate">
                Bahaya Kritis
              </span>
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-80" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
              </span>
            </div>
            <div className="mt-2 text-2xl sm:text-4xl font-extrabold text-[#E8ECF1] tabular-nums tracking-tight">
              {counts.critical}
            </div>
            <p className="mt-1 text-[11px] sm:text-xs text-[#94A3B8] truncate">Status Awas / Gempa M≥6.0</p>
          </div>

          {/* High */}
          <div className="relative rounded-xl border border-orange-500/25 bg-[#0D1117]/95 p-3.5 sm:p-5 shadow-lg shadow-black/40 backdrop-blur-md transition-all hover:border-orange-500/50 hover:bg-[#121722] group min-w-0">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-transparent rounded-t-xl" />
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-wider text-orange-400 uppercase truncate">
                Status Siaga
              </span>
              <div className="h-2 w-2 rounded-full bg-orange-400 shrink-0" />
            </div>
            <div className="mt-2 text-2xl sm:text-4xl font-extrabold text-[#E8ECF1] tabular-nums tracking-tight">
              {counts.high}
            </div>
            <p className="mt-1 text-[11px] sm:text-xs text-[#94A3B8] truncate">Siaga Erupsi / Banjir</p>
          </div>

          {/* Moderate / Warning */}
          <div className="relative rounded-xl border border-amber-500/25 bg-[#0D1117]/95 p-3.5 sm:p-5 shadow-lg shadow-black/40 backdrop-blur-md transition-all hover:border-amber-500/50 hover:bg-[#121722] group min-w-0">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-500 to-transparent rounded-t-xl" />
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-wider text-amber-400 uppercase truncate">
                Status Waspada
              </span>
              <div className="h-2 w-2 rounded-full bg-amber-400 shrink-0" />
            </div>
            <div className="mt-2 text-2xl sm:text-4xl font-extrabold text-[#E8ECF1] tabular-nums tracking-tight">
              {counts.moderate}
            </div>
            <p className="mt-1 text-[11px] sm:text-xs text-[#94A3B8] truncate">Getaran Terasa / Waspada</p>
          </div>

          {/* Total Monitored */}
          <div className="relative rounded-xl border border-cyan-500/25 bg-[#0D1117]/95 p-3.5 sm:p-5 shadow-lg shadow-black/40 backdrop-blur-md transition-all hover:border-cyan-500/50 hover:bg-[#121722] group min-w-0">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-transparent rounded-t-xl" />
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-wider text-cyan-400 uppercase truncate">
                Laporan Aktif
              </span>
              <div className="h-2 w-2 rounded-full bg-cyan-400 shrink-0" />
            </div>
            <div className="mt-2 text-2xl sm:text-4xl font-extrabold text-[#E8ECF1] tabular-nums tracking-tight">
              {counts.total}
            </div>
            <p className="mt-1 text-[11px] sm:text-xs text-[#94A3B8] truncate">Data Resmi Terverifikasi</p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 2.5 — KUALITAS UDARA (ISPU KLHK) REAL-TIME
          ════════════════════════════════════════════════════════ */}
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6 z-10">
        <AirQualityCard />
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 3 — PRIORITY INCIDENT SPOTLIGHT & LIVE STREAM
          ════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Radio className="h-4 w-4 text-red-400 animate-pulse shrink-0" />
              <span className="text-xs font-mono font-bold tracking-widest text-red-400 uppercase">
                UPDATE BENCANA HARI INI
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#E8ECF1]">
              Laporan Bencana Terbaru
            </h2>
            <p className="text-sm text-[#94A3B8] mt-1">
              Pantauan gempa bumi, banjir, dan aktivitas bencana alam terbaru yang dihimpun langsung dari BMKG & BNPB.
            </p>
          </div>

          <Link
            href="/map"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors self-start sm:self-auto"
          >
            <span>Lihat Semua Titik di Peta</span>
            <ArrowRight className="h-3.5 w-3.5 shrink-0" />
          </Link>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 items-start">
          
          {/* Priority Event Spotlight Card (5 cols) */}
          <div className="lg:col-span-5 w-full min-w-0">
            {priorityEvent ? (
              <div className="rounded-2xl border border-red-500/30 bg-gradient-to-b from-[#16121E] via-[#0E131F] to-[#0A0E17] p-4 sm:p-6 shadow-xl shadow-red-950/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-bl-xl border-l border-b border-red-500/30 bg-red-950/70 text-[9px] sm:text-[10px] font-mono font-bold text-red-300 uppercase tracking-wider">
                  PERLU PERHATIAN
                </div>

                <div className="flex items-center gap-2.5 mb-4 pr-24 sm:pr-28">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
                    <DisasterIcon type={priorityEvent.type} size={22} color="#EF4444" />
                  </div>
                  <div className="min-w-0">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-red-500/40 bg-red-950/60 text-red-300">
                      {priorityEvent.severity.toUpperCase()}
                    </span>
                    <span className="ml-2 text-xs text-[#94A3B8] font-mono">
                      {formatTimeAgo(priorityEvent.eventTime)}
                    </span>
                  </div>
                </div>

                <h3 className="text-base sm:text-xl font-bold text-[#E8ECF1] leading-snug break-words">
                  {priorityEvent.title}
                </h3>

                {priorityEvent.description && (
                  <p className="mt-2 text-xs leading-relaxed text-[#94A3B8] line-clamp-3">
                    {priorityEvent.description}
                  </p>
                )}

                {/* Spatial coordinates & metadata */}
                <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl border border-white/[0.06] bg-[#070A10] p-3 text-xs font-mono">
                  <div className="min-w-0">
                    <span className="text-[10px] text-[#64748B] block">LOKASI</span>
                    <span className="text-[#E8ECF1] font-semibold truncate block">
                      {priorityEvent.locationName || priorityEvent.province || 'Indonesia'}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-[#64748B] block">KOORDINAT</span>
                    <span className="text-[#E8ECF1] font-semibold tabular-nums truncate block">
                      {priorityEvent.latitude !== undefined && priorityEvent.longitude !== undefined
                        ? `${priorityEvent.latitude.toFixed(2)}°, ${priorityEvent.longitude.toFixed(2)}°`
                        : 'Koordinat Wilayah'}
                    </span>
                  </div>
                  {priorityEvent.metadata?.magnitude !== undefined && (
                    <div className="min-w-0">
                      <span className="text-[10px] text-[#64748B] block">MAGNITUDO</span>
                      <span className="text-red-400 font-bold block">
                        M {priorityEvent.metadata.magnitude.toFixed(1)}
                      </span>
                    </div>
                  )}
                  {priorityEvent.metadata?.depth && (
                    <div className="min-w-0">
                      <span className="text-[10px] text-[#64748B] block">KEDALAMAN</span>
                      <span className="text-amber-400 font-bold truncate block">
                        {priorityEvent.metadata.depth}
                      </span>
                    </div>
                  )}
                  {priorityEvent.metadata?.magmaLevelName && (
                    <div className="min-w-0">
                      <span className="text-[10px] text-[#64748B] block">STATUS PVMBG</span>
                      <span className="text-orange-400 font-bold truncate block">
                        {priorityEvent.metadata.magmaLevelName}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <Link
                    href={`/map?lat=${priorityEvent.latitude || -0.78}&lng=${priorityEvent.longitude || 113.92}&zoom=9`}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-red-500 shadow-md shadow-red-600/30"
                  >
                    <Compass className="h-3.5 w-3.5 shrink-0" />
                    <span>Lihat di Peta</span>
                  </Link>
                  <Link
                    href={`/disasters/${priorityEvent.type}`}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/[0.12] bg-white/[0.04] px-3.5 py-2.5 text-xs font-medium text-[#E8ECF1] transition-all hover:bg-white/[0.08]"
                  >
                    <span>Info Lengkap</span>
                    <ArrowRight className="h-3 w-3 shrink-0" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-white/[0.08] bg-[#0D1117] p-8 text-center">
                <ShieldAlert className="mx-auto h-8 w-8 text-[#64748B]" />
                <h3 className="mt-3 text-sm font-semibold text-[#E8ECF1]">
                  Tidak ada laporan bencana besar saat ini
                </h3>
                <p className="mt-1 text-xs text-[#94A3B8]">
                  Situasi di seluruh wilayah Indonesia saat ini terpantau aman dan terkendali.
                </p>
              </div>
            )}
          </div>

          {/* Chronological Telemetry Feed (7 cols) */}
          <div className="lg:col-span-7 space-y-2.5 w-full min-w-0">
            {recentEvents.map((event) => {
              const badge = getSeverityBadge(event.severity);
              const catMeta = DISASTER_CATEGORIES.find((c) => c.type === event.type);

              return (
                <Link
                  key={event.id}
                  href={`/disasters/${event.type}`}
                  className="group flex items-start gap-3 rounded-xl border border-white/[0.06] bg-[#0D1117]/80 p-3 sm:p-3.5 transition-all hover:border-white/[0.16] hover:bg-[#131926] hover:-translate-y-0.5 min-w-0"
                >
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg mt-0.5"
                    style={{
                      backgroundColor: catMeta?.bgRgba || 'rgba(255,255,255,0.06)',
                      color: catMeta?.color || '#94A3B8',
                    }}
                  >
                    <DisasterIcon type={event.type} size={18} color={catMeta?.color || '#94A3B8'} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1 min-w-0">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider border ${badge.badgeClass} shrink-0`}
                      >
                        {badge.label}
                      </span>
                      <span className="text-[11px] font-mono text-[#64748B] flex items-center gap-1 shrink-0">
                        <Clock className="h-3 w-3" />
                        {formatTimeAgo(event.eventTime)}
                      </span>
                      <span className="text-white/20 text-[10px] shrink-0">•</span>
                      <span className="text-[11px] font-mono text-[#8B95A7] truncate max-w-[140px] sm:max-w-[220px] lg:max-w-none">
                        {event.source.name}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-semibold text-[#E8ECF1] group-hover:text-white transition-colors truncate">
                      {event.title}
                    </h4>

                    {event.locationName && (
                      <p className="mt-1 text-[11px] text-[#94A3B8] flex items-center gap-1.5 truncate">
                        <MapPin className="h-3 w-3 text-[#64748B] shrink-0" />
                        <span className="truncate">{event.locationName}</span>
                        {event.province ? <span className="text-[#64748B] truncate">, {event.province}</span> : null}
                      </p>
                    )}
                  </div>

                  <ChevronRight className="h-4 w-4 text-[#64748B] group-hover:text-white transition-colors mt-2 shrink-0 group-hover:translate-x-0.5" />
                </Link>
              );
            })}
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 4 — 10 DISASTER CATEGORIES (CLUSTERED MATRIX)
          ════════════════════════════════════════════════════════ */}
      <section className="border-t border-white/[0.06] bg-[#060910] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Layers className="h-4 w-4 text-orange-400" />
                <span className="text-xs font-mono font-bold tracking-widest text-orange-400 uppercase">
                  PILIH JENIS BENCANA
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#E8ECF1]">
                10 Jenis Bencana yang Dipantau
              </h2>
              <p className="text-sm text-[#94A3B8] mt-1">
                Pilih jenis bencana untuk melihat titik lokasi kejadian terkini dan tips keselamatan.
              </p>
            </div>

            <Link
              href="/disasters"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-400 hover:text-orange-300 transition-colors"
            >
              <span>Lihat Semua Jenis Bencana</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-8">
            {/* Cluster 1: Bahaya Geologis */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2 w-2 rounded-full bg-red-400" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#E8ECF1]">
                  Gempa Bumi & Gunung Berapi
                </h3>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {geologyCategories.map((cat) => {
                  const activeCount = counts.byType[cat.type] || 0;
                  return (
                    <Link
                      key={cat.type}
                      href={`/disasters/${cat.type}`}
                      className="group flex flex-col justify-between rounded-xl border border-white/[0.07] bg-[#0D1117] p-4 transition-all hover:border-white/[0.18] hover:bg-[#141B26] hover:-translate-y-0.5"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <div
                            className="flex h-9 w-9 items-center justify-center rounded-lg"
                            style={{ backgroundColor: cat.bgRgba, color: cat.color }}
                          >
                            <DisasterIcon type={cat.type} size={18} color={cat.color} />
                          </div>
                          {activeCount > 0 ? (
                            <span
                              className="rounded-full px-2 py-0.5 text-[10px] font-mono font-bold tabular-nums"
                              style={{ color: cat.color, backgroundColor: cat.bgRgba }}
                            >
                              {activeCount} Aktif
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono text-[#64748B]">Aman</span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-[#E8ECF1] group-hover:text-white transition-colors">
                          {cat.label}
                        </h4>
                        <p className="mt-1 text-[11px] leading-relaxed text-[#94A3B8] line-clamp-2">
                          {cat.description}
                        </p>
                      </div>
                      <div className="mt-3 pt-3 border-t border-white/[0.04] flex items-center justify-between text-[10px] text-[#64748B]">
                        <span className="truncate">{cat.officialSources[0]}</span>
                        <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 group-hover:text-white transition-all shrink-0" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Cluster 2: Bahaya Hidrometeorologis */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2 w-2 rounded-full bg-blue-400" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#E8ECF1]">
                  Banjir, Cuaca & Kebakaran Hutan
                </h3>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {hydroCategories.map((cat) => {
                  const activeCount = counts.byType[cat.type] || 0;
                  return (
                    <Link
                      key={cat.type}
                      href={`/disasters/${cat.type}`}
                      className="group flex flex-col justify-between rounded-xl border border-white/[0.07] bg-[#0D1117] p-4 transition-all hover:border-white/[0.18] hover:bg-[#141B26] hover:-translate-y-0.5"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <div
                            className="flex h-9 w-9 items-center justify-center rounded-lg"
                            style={{ backgroundColor: cat.bgRgba, color: cat.color }}
                          >
                            <DisasterIcon type={cat.type} size={18} color={cat.color} />
                          </div>
                          {activeCount > 0 ? (
                            <span
                              className="rounded-full px-2 py-0.5 text-[10px] font-mono font-bold tabular-nums"
                              style={{ color: cat.color, backgroundColor: cat.bgRgba }}
                            >
                              {activeCount} Aktif
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono text-[#64748B]">Aman</span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-[#E8ECF1] group-hover:text-white transition-colors">
                          {cat.label}
                        </h4>
                        <p className="mt-1 text-[11px] leading-relaxed text-[#94A3B8] line-clamp-2">
                          {cat.description}
                        </p>
                      </div>
                      <div className="mt-3 pt-3 border-t border-white/[0.04] flex items-center justify-between text-[10px] text-[#64748B]">
                        <span className="truncate">{cat.officialSources[0]}</span>
                        <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 group-hover:text-white transition-all shrink-0" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Cluster 3: Bahaya Pesisir & Oseanografi */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2 w-2 rounded-full bg-cyan-400" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#E8ECF1]">
                  Gelombang Laut & Pesisir Pantai
                </h3>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {marineCategories.map((cat) => {
                  const activeCount = counts.byType[cat.type] || 0;
                  return (
                    <Link
                      key={cat.type}
                      href={`/disasters/${cat.type}`}
                      className="group flex flex-col justify-between rounded-xl border border-white/[0.07] bg-[#0D1117] p-4 transition-all hover:border-white/[0.18] hover:bg-[#141B26] hover:-translate-y-0.5"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <div
                            className="flex h-9 w-9 items-center justify-center rounded-lg"
                            style={{ backgroundColor: cat.bgRgba, color: cat.color }}
                          >
                            <DisasterIcon type={cat.type} size={18} color={cat.color} />
                          </div>
                          {activeCount > 0 ? (
                            <span
                              className="rounded-full px-2 py-0.5 text-[10px] font-mono font-bold tabular-nums"
                              style={{ color: cat.color, backgroundColor: cat.bgRgba }}
                            >
                              {activeCount} Aktif
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono text-[#64748B]">Aman</span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-[#E8ECF1] group-hover:text-white transition-colors">
                          {cat.label}
                        </h4>
                        <p className="mt-1 text-[11px] leading-relaxed text-[#94A3B8] line-clamp-2">
                          {cat.description}
                        </p>
                      </div>
                      <div className="mt-3 pt-3 border-t border-white/[0.04] flex items-center justify-between text-[10px] text-[#64748B]">
                        <span className="truncate">{cat.officialSources[0]}</span>
                        <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 group-hover:text-white transition-all shrink-0" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 5 — NATIONAL EMERGENCY ACTION & HOTLINE STRIP
          ════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-red-500/20 bg-gradient-to-r from-red-950/40 via-[#0D1117] to-[#0A0E17] p-6 sm:p-8 relative overflow-hidden shadow-2xl shadow-red-950/20">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold tracking-wider text-red-400 mb-2 uppercase">
                <Phone className="h-3.5 w-3.5" />
                NOMOR TELEPON DARURAT
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#E8ECF1]">
                Sedang Mengalami Keadaan Darurat?
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                Segera hubungi nomor darurat bebas pulsa di bawah ini atau baca panduan praktis untuk menyelamatkan diri dan keluarga.
              </p>

              {/* Action Buttons for hotlines */}
              <div className="mt-5 flex flex-wrap items-center gap-2 sm:gap-3">
                <a
                  href="tel:112"
                  className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3.5 py-2 text-xs font-bold text-white transition-all hover:bg-red-500 shadow-md shadow-red-600/30"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>112 Darurat Bebas Pulsa</span>
                </a>
                <a
                  href="tel:115"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/[0.12] bg-[#121824] px-3.5 py-2 text-xs font-semibold text-[#E8ECF1] transition-all hover:border-white/[0.2] hover:bg-[#182030]"
                >
                  <span>115 Basarnas (SAR)</span>
                </a>
                <a
                  href="tel:117"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/[0.12] bg-[#121824] px-3.5 py-2 text-xs font-semibold text-[#E8ECF1] transition-all hover:border-white/[0.2] hover:bg-[#182030]"
                >
                  <span>117 BNPB Logistik</span>
                </a>
                <a
                  href="tel:119"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/[0.12] bg-[#121824] px-3.5 py-2 text-xs font-semibold text-[#E8ECF1] transition-all hover:border-white/[0.2] hover:bg-[#182030]"
                >
                  <span>119 Ambulans Medis</span>
                </a>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <Link
                href="/safety-guide"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-xs font-bold text-[#080C14] transition-all hover:bg-white/90 shadow-lg"
              >
                <BookOpen className="h-4 w-4 text-red-600" />
                <span>Baca Panduan Keselamatan</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 6 — OFFICIAL DATA SOURCES & TRUST
          ════════════════════════════════════════════════════════ */}
      <section className="border-t border-white/[0.06] bg-[#070A10] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-xl sm:text-2xl font-bold text-[#E8ECF1]">
              Data Resmi Langsung dari Lembaga Pemerintah
            </h2>
            <p className="text-xs sm:text-sm text-[#94A3B8] mt-1.5 max-w-2xl">
              Semua informasi diambil langsung dari sistem resmi BMKG, BNPB, dan PVMBG tanpa rekayasa, sehingga Anda selalu mendapatkan data yang valid dan terpercaya.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {disasterSources.map((src) => {
              const colorMap: Record<string, string> = {
                BMKG: '#EF4444',
                BNPB: '#3B82F6',
                PVMBG: '#F97316',
                VAAC: '#FB923C',
              };
              const color = colorMap[src.code] || '#94A3B8';

              return (
                <div
                  key={src.id}
                  className="rounded-xl border border-white/[0.07] bg-[#0D1117] p-5 relative flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono font-bold tracking-wider" style={{ color }}>
                        {src.code}
                      </span>
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>AKTIF</span>
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-[#E8ECF1] mb-1">{src.name}</h3>
                    <p className="text-xs text-[#94A3B8] leading-relaxed mb-4">{src.description}</p>
                  </div>

                  <div className="pt-3 border-t border-white/[0.05] flex items-center justify-between text-xs">
                    <span className="text-[#64748B] font-mono text-[11px] tabular-nums">
                      {src.eventsCount} data terpetakan
                    </span>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#94A3B8] hover:text-white transition-colors flex items-center gap-1 text-[11px]"
                      aria-label={`Buka portal resmi ${src.name}`}
                    >
                      <span>Situs Resmi</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Transparency Disclaimer */}
          <div className="mt-8 flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-950/20 p-4 text-xs text-[#94A3B8]">
            <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-[#E8ECF1]">Catatan Keselamatan:</strong> Platform Disaster Radar Indonesia adalah inisiatif independen yang merangkum data resmi pemerintah agar mudah dipahami semua orang. Jika terjadi bencana di wilayah Anda, selalu utamakan arahan resmi dari petugas BPBD, aparat desa/kelurahan, dan tim penyelamat di lapangan.
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 7 — PERTANYAAN UMUM (FAQ) & JSON-LD
          ════════════════════════════════════════════════════════ */}
      <section className="border-t border-white/[0.06] py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#E8ECF1]">
              Pertanyaan Umum (FAQ)
            </h2>
            <p className="text-sm text-[#94A3B8] mt-2">
              Jawaban seputar fungsi platform, metodologi agregasi data, dan panduan penggunaan peta.
            </p>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-white/[0.06] bg-[#0D1117] p-5 sm:p-6 transition-colors hover:border-white/[0.12]"
              >
                <h3 className="text-sm sm:text-base font-bold text-[#E8ECF1] mb-2">
                  {item.question}
                </h3>
                <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
