import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getAggregatedDisasters, DISASTER_CATEGORIES } from '@/lib/disasters/aggregator';
import { SITE_URL } from '@/config/site';
import { JsonLd, getFaqJsonLd } from '@/components/json-ld';
import { DisasterIcon } from '@/components/icons/disaster-icons';
import { TacticalRadarHud } from '@/components/home/tactical-radar-hud';
import { AirQualityCard } from '@/components/air-quality-card';
import { getAllMonitoredVolcanoes } from '@/lib/magma-status';
import {
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  BookOpen,
  ExternalLink,
  Phone,
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
      'Anda dapat melihat daftar gempa bumi terbaru langsung di halaman depan atau buka menu Peta. Informasi mencakup magnitudo, kedalaman, koordinat pusat gempa, dan peringatan potensi tsunami yang diperbarui otomatis dari BMKG.',
  },
  {
    question: 'Bagaimana cara melihat peta banjir dan wilayah terdampak di Indonesia?',
    answer:
      'Pilih kategori Peta Banjir atau buka menu Peta. Anda dapat melihat titik genangan luapan air, ketinggian muka air sungai, serta kawasan rawan banjir berdasarkan laporan BNPB dan BPBD setempat.',
  },
  {
    question: 'Bagaimana cara memantau status gunung api aktif dan arah abu vulkanik?',
    answer:
      'Buka menu Gunung Api untuk memantau gunung api di Indonesia dengan status resmi MAGMA PVMBG (Normal, Waspada, Siaga, Awas), lengkap dengan peta prakiraan sebaran abu vulkanik penerbangan dari Darwin VAAC.',
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

/** Jam absolut WIB, dirender di server saat ISR (tidak basi seperti "4m lalu"). */
function formatWib(isoString: string): string {
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return '-';
  const parts = new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  return `${get('day')} ${get('month')}, ${get('hour')}.${get('minute')} WIB`;
}

function formatMagnitude(m: number): string {
  return `M ${m.toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}`;
}

/** Severity selalu = label teks + warna token. Satu sumber untuk seluruh halaman. */
function getSeverityBadge(severity: string) {
  switch (severity) {
    case 'critical':
      return { label: 'Kritis', text: 'text-sev-critical', soft: 'bg-sev-critical-soft', edge: 'border-l-sev-critical' };
    case 'high':
      return { label: 'Tinggi', text: 'text-sev-high', soft: 'bg-sev-high-soft', edge: 'border-l-sev-high' };
    case 'moderate':
      return { label: 'Waspada', text: 'text-sev-warning', soft: 'bg-sev-warning-soft', edge: 'border-l-sev-warning' };
    default:
      return { label: 'Normal', text: 'text-sev-normal', soft: 'bg-sev-normal-soft', edge: 'border-l-sev-normal' };
  }
}

const SOURCE_STATUS: Record<string, { label: string; text: string }> = {
  online: { label: 'Merespons', text: 'text-sev-normal' },
  degraded: { label: 'Data cadangan', text: 'text-sev-warning' },
  offline: { label: 'Gagal dimuat', text: 'text-sev-critical' },
};

export default async function HomePage() {
  const data = await getAggregatedDisasters('LIVE');
  const { counts, events, sources, lastUpdated } = data;

  // Filter out non-disaster data providers (e.g. OSM base map)
  const disasterSources = sources.filter((s) => s.code !== 'OSM');
  const activeSources = disasterSources.filter((s) => s.status === 'online').length;
  const monitoredVolcanoCount = getAllMonitoredVolcanoes().length;
  const updatedWib = formatWib(lastUpdated);

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

  const clusters = [
    { title: 'Gempa Bumi & Gunung Berapi', items: geologyCategories, cols: 'sm:grid-cols-2 lg:grid-cols-4' },
    { title: 'Banjir, Cuaca & Kebakaran Hutan', items: hydroCategories, cols: 'sm:grid-cols-2 lg:grid-cols-3' },
    { title: 'Gelombang Laut & Pesisir Pantai', items: marineCategories, cols: 'sm:grid-cols-2 lg:grid-cols-3' },
  ];

  const prioritySev = priorityEvent ? getSeverityBadge(priorityEvent.severity) : null;

  const statCells = [
    { label: 'Bahaya Kritis', hint: 'Status Awas / Gempa M≥6.0', value: counts.critical, text: 'text-sev-critical', edge: 'border-l-sev-critical', primary: true },
    { label: 'Status Siaga', hint: 'Siaga Erupsi / Banjir', value: counts.high, text: 'text-sev-high', edge: 'border-l-sev-high', primary: false },
    { label: 'Status Waspada', hint: 'Getaran Terasa / Waspada', value: counts.moderate, text: 'text-sev-warning', edge: 'border-l-sev-warning', primary: false },
    { label: 'Laporan Aktif', hint: `Semua laporan dari ${disasterSources.length} sumber`, value: counts.total, text: 'text-fg-1', edge: 'border-l-line-strong', primary: false },
  ];

  return (
    <div className="flex w-full flex-col overflow-x-hidden text-fg-1">
      <JsonLd data={getFaqJsonLd(FAQ_ITEMS)} />

      {/* ════════════════════════════════════════════════════════
          SECTION 1 — HERO: judul, status data, aksi utama + plot kejadian
          ════════════════════════════════════════════════════════ */}
      <section className="pb-section pt-10 sm:pt-16">
        <div className="mx-auto max-w-7xl px-gutter sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Left Column: Heading & status */}
            <div className="flex flex-col items-start lg:col-span-7">
              {/* Status data: jam nyata + jumlah sumber yang merespons */}
              <p className="eyebrow">
                <span
                  aria-hidden="true"
                  className={`h-1.5 w-1.5 rounded-full ${activeSources === disasterSources.length ? 'bg-accent' : 'bg-sev-warning'}`}
                />
                <span className="whitespace-nowrap">
                  Diperbarui <span className="font-mono tracking-normal tabular-nums text-fg-1">{updatedWib}</span>
                </span>
                <span className="hidden text-fg-3 sm:inline" aria-hidden="true">/</span>
                <span className="hidden whitespace-nowrap sm:inline">
                  <span className="font-mono tabular-nums text-fg-1">{activeSources}</span>/
                  <span className="font-mono tabular-nums">{disasterSources.length}</span> sumber
                </span>
              </p>

              {/* Main Heading */}
              <h1 className="mt-6 max-w-[14ch] text-display text-balance text-fg-1">
                Peta <span className="serif-accent text-accent">gempa</span>, gunung api, dan banjir di Indonesia
              </h1>

              {/* Subheading */}
              <p className="mt-6 max-w-[54ch] text-[1.125rem] leading-relaxed text-fg-2">
                Gempa dari <strong className="font-medium text-fg-1">BMKG</strong>, status gunung api dari{' '}
                <strong className="font-medium text-fg-1">PVMBG</strong>, laporan banjir dari{' '}
                <strong className="font-medium text-fg-1">BNPB</strong>, dan sebaran abu dari Darwin VAAC di
                satu peta. Halaman ini memuat data baru tiap 3 menit.
              </p>

              {/* CTAs */}
              <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
                <Link
                  href="/map"
                  className="group inline-flex min-h-tap-lg items-center justify-between gap-4 rounded-full bg-accent py-2 pl-6 pr-2 text-body font-semibold text-fg-inverse transition-colors duration-160 ease-data hover:bg-accent-hover active:scale-[0.98]"
                >
                  <span>Buka peta bencana</span>
                  <span className="pill-icon bg-fg-inverse/15">
                    <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                  </span>
                </Link>

                <div className="grid grid-cols-2 gap-3 sm:flex sm:items-stretch">
                  <Link
                    href="/safety-guide"
                    className="inline-flex min-h-tap-lg items-center justify-center gap-2 whitespace-nowrap rounded-full bg-shell px-4 text-[15px] sm:px-6 sm:text-body font-medium text-fg-1 shadow-core transition-colors duration-160 ease-data hover:bg-surface sm:flex-none"
                  >
                    <span>Panduan Keselamatan</span>
                  </Link>

                  <a
                    href="tel:112"
                    className="inline-flex min-h-tap-lg shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full px-4 text-[15px] sm:px-5 sm:text-body font-medium text-fg-1 ring-1 ring-line-strong transition-colors duration-160 ease-data hover:ring-accent"
                  >
                    <Phone className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                    <span>
                      Telepon <span className="font-mono tabular-nums">112</span>
                    </span>
                  </a>
                </div>
              </div>

              {/* Fakta cakupan (dari data, bukan angka tulisan tangan) */}
              <ul className="mt-12 grid w-full max-w-xl grid-cols-3 gap-6 border-t border-line pt-6">
                <li>
                  <span className="block font-mono text-num-lg tabular-nums text-fg-1">{monitoredVolcanoCount}</span>
                  <span className="mt-1 block text-small text-fg-3">gunung api dengan status PVMBG</span>
                </li>
                <li>
                  <span className="block font-mono text-num-lg tabular-nums text-fg-1">BMKG</span>
                  <span className="mt-1 block text-small text-fg-3">Gempa bumi</span>
                </li>
                <li>
                  <span className="block font-mono text-num-lg tabular-nums text-fg-1">{DISASTER_CATEGORIES.length}</span>
                  <span className="mt-1 block text-small text-fg-3">jenis peringatan bahaya</span>
                </li>
              </ul>

              {/* Topik yang sering dicari: tautan teks biasa, bobot di bawah CTA */}
              <nav aria-label="Paling dicari" className="mt-8 flex flex-wrap items-baseline gap-x-4 text-small text-fg-3">
                <span>Paling dicari:</span>
                <ul className="contents">
                  {[
                    { href: '/disasters/earthquake', label: 'Gempa Hari Ini BMKG' },
                    { href: '/disasters/flood', label: 'Peta Titik Banjir' },
                    { href: '/volcanoes', label: 'Status Gunung Meletus' },
                    { href: '/map', label: 'Kualitas Udara ISPU' },
                    { href: '/disasters/extreme-weather', label: 'Peringatan Cuaca Ekstrem' },
                  ].map((t) => (
                    <li key={t.href + t.label}>
                      <Link
                        href={t.href}
                        className="inline-flex min-h-tap items-center text-fg-2 underline decoration-line-strong underline-offset-4 transition-colors duration-160 ease-data hover:text-fg-1 hover:decoration-accent md:min-h-0"
                      >
                        {t.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Right Column: plot kejadian, dalam bingkai double-bezel */}
            <div className="w-full min-w-0 lg:col-span-5">
              <div className="bezel">
                <TacticalRadarHud events={events} criticalCount={counts.critical} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 2 — RINGKASAN TINGKAT BAHAYA (bento)
          Kritis = sel utama (2 baris), Siaga & Waspada pendukung, total melebar.
          ════════════════════════════════════════════════════════ */}
      <section className="reveal mx-auto w-full max-w-7xl px-gutter sm:px-6 lg:px-8">
        <h2 className="sr-only">Ringkasan Tingkat Bahaya Bencana Indonesia Hari Ini</h2>
        <dl className="grid grid-cols-2 gap-3 lg:grid-cols-[1.6fr_1fr_1fr] lg:grid-rows-2">
          {statCells.map((c, i) => (
            <div
              key={c.label}
              className={`bezel min-w-0 ${c.primary ? 'bezel-signal col-span-2 lg:col-span-1 lg:row-span-2' : ''} ${i === 3 ? 'col-span-2' : ''}`}
            >
              <div className={`bezel-core flex h-full flex-col justify-between p-6 ${c.primary ? 'min-h-[13rem] lg:min-h-[17rem]' : ''}`}>
                <dt className="flex items-center gap-2 text-small font-medium text-fg-2">
                  <span aria-hidden="true" className={`h-2 w-2 rounded-full ${c.primary ? 'bg-accent' : i === 1 ? 'bg-sev-high' : i === 2 ? 'bg-sev-warning' : 'bg-fg-3'}`} />
                  {c.label}
                </dt>
                <div className="mt-6">
                  <dd className={`font-mono font-medium tabular-nums ${c.primary ? 'text-num-xl text-accent' : 'text-num-lg text-fg-1'}`}>
                    {c.value}
                  </dd>
                  <dd className="mt-2 text-small text-fg-3">{c.hint}</dd>
                </div>
              </div>
            </div>
          ))}
        </dl>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 2.5 — KUALITAS UDARA (ISPU)
          ════════════════════════════════════════════════════════ */}
      <section className="reveal mx-auto mt-3 w-full max-w-7xl px-gutter sm:px-6 lg:px-8">
        <div className="bezel">
          <AirQualityCard />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 3 — KEJADIAN PRIORITAS & DAFTAR TERBARU
          ════════════════════════════════════════════════════════ */}
      <section className="reveal mx-auto w-full max-w-7xl px-gutter py-section sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Laporan terkini</p>
            <h2 className="mt-4 text-title text-fg-1">Laporan Bencana Terbaru</h2>
            <p className="mt-3 max-w-[56ch] text-body text-fg-2">
              Pantauan gempa bumi, banjir, dan aktivitas bencana alam terbaru yang dihimpun langsung dari BMKG &amp;
              BNPB.
            </p>
          </div>

          <Link
            href="/map"
            className="group inline-flex min-h-tap items-center gap-3 self-start rounded-full bg-shell py-1.5 pl-5 pr-1.5 text-body font-medium text-fg-1 shadow-core transition-colors duration-160 ease-data hover:bg-surface sm:self-auto"
          >
            <span>Lihat Semua Titik di Peta</span>
            <span className="pill-icon bg-fg-1/10">
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            </span>
          </Link>
        </div>

        <div className="grid items-start gap-3 lg:grid-cols-12">
          {/* Kejadian prioritas */}
          <div className="w-full min-w-0 lg:col-span-5">
            {priorityEvent && prioritySev ? (
              <article className={`bezel ${priorityEvent.severity === 'critical' ? 'bezel-signal' : ''}`}>
                <div className="bezel-core p-6 sm:p-8">
                  <p className="flex flex-wrap items-center gap-x-3 gap-y-2 text-small">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium ${prioritySev.text} ${prioritySev.soft}`}>
                      <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                      {prioritySev.label}
                    </span>
                    <span className="text-fg-2">Perlu perhatian</span>
                    <time dateTime={priorityEvent.eventTime} className="font-mono tabular-nums text-fg-3">
                      {formatWib(priorityEvent.eventTime)}
                    </time>
                  </p>

                  <h3 className="mt-6 flex items-start gap-3 text-title text-fg-1">
                    <DisasterIcon type={priorityEvent.type} size={28} className="mt-1 shrink-0 text-fg-2" />
                    <span className="break-words">{priorityEvent.title}</span>
                  </h3>

                  {priorityEvent.description && (
                    <p className="mt-3 line-clamp-3 max-w-[65ch] text-body text-fg-2">{priorityEvent.description}</p>
                  )}

                  {/* Data utama: angka mono + satuan */}
                  <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-6">
                    {priorityEvent.metadata?.magnitude !== undefined && (
                      <div>
                        <dt className="text-label text-fg-3">Magnitudo</dt>
                        <dd className="mt-1 font-mono text-num-lg tabular-nums text-fg-1">
                          {formatMagnitude(priorityEvent.metadata.magnitude)}
                        </dd>
                      </div>
                    )}
                    {priorityEvent.metadata?.depth && (
                      <div>
                        <dt className="text-label text-fg-3">Kedalaman</dt>
                        <dd className="mt-1 font-mono text-num-lg tabular-nums text-fg-1">
                          {priorityEvent.metadata.depth}
                        </dd>
                      </div>
                    )}
                    {priorityEvent.metadata?.magmaLevelName && (
                      <div className="col-span-2">
                        <dt className="text-label text-fg-3">Status PVMBG</dt>
                        <dd className={`mt-1 text-heading ${prioritySev.text}`}>
                          {priorityEvent.metadata.magmaLevelName}
                        </dd>
                      </div>
                    )}
                    <div className="min-w-0">
                      <dt className="text-label text-fg-3">Lokasi</dt>
                      <dd className="mt-1 truncate text-small text-fg-1">
                        {priorityEvent.locationName || priorityEvent.province || 'Indonesia'}
                      </dd>
                    </div>
                    <div className="min-w-0">
                      <dt className="text-label text-fg-3">Koordinat</dt>
                      <dd className="mt-1 truncate font-mono text-small tabular-nums text-fg-1">
                        {priorityEvent.latitude !== undefined && priorityEvent.longitude !== undefined
                          ? `${priorityEvent.latitude.toFixed(2)}°, ${priorityEvent.longitude.toFixed(2)}°`
                          : 'Koordinat Wilayah'}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <Link
                      href={`/map?lat=${priorityEvent.latitude || -0.78}&lng=${priorityEvent.longitude || 113.92}&zoom=9`}
                      className="group inline-flex min-h-tap flex-1 items-center justify-between gap-3 rounded-full bg-accent py-1.5 pl-5 pr-1.5 text-body font-semibold text-fg-inverse transition-colors duration-160 ease-data hover:bg-accent-hover active:scale-[0.98]"
                    >
                      <span>Lihat di Peta</span>
                      <span className="pill-icon bg-fg-inverse/15">
                        <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                      </span>
                    </Link>
                    <Link
                      href={`/disasters/${priorityEvent.type}`}
                      className="inline-flex min-h-tap items-center justify-center gap-1.5 rounded-full px-5 text-body font-medium text-fg-1 ring-1 ring-line-strong transition-colors duration-160 ease-data hover:ring-fg-3"
                    >
                      <span>Baca laporan</span>
                    </Link>
                  </div>
                </div>
              </article>
            ) : (
              <div className="bezel">
                <div className="bezel-core p-6 sm:p-8">
                  <ShieldAlert className="h-6 w-6 text-fg-3" aria-hidden="true" />
                  <h3 className="mt-3 text-heading text-fg-1">Belum ada laporan kejadian</h3>
                  <p className="mt-1 max-w-[60ch] text-small text-fg-2">
                    Sumber resmi tidak mengirim laporan kejadian pada data{' '}
                    <span className="font-mono tabular-nums">{updatedWib}</span>. Bila ada kejadian di wilayah Anda,
                    ikuti arahan BPBD setempat.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Daftar kejadian: satu list bergaris di dalam satu bingkai */}
          <div className="w-full min-w-0 lg:col-span-7">
            {recentEvents.length > 0 ? (
              <div className="bezel">
                <ul className="bezel-core divide-y divide-line overflow-hidden">
                  {recentEvents.map((event) => {
                    const badge = getSeverityBadge(event.severity);
                    const catMeta = DISASTER_CATEGORIES.find((c) => c.type === event.type);

                    return (
                      <li key={event.id}>
                        <Link
                          href={`/disasters/${event.type}`}
                          className="group flex min-w-0 items-center gap-4 px-5 py-4 transition-colors duration-160 ease-data hover:bg-raised sm:px-6"
                        >
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-shell shadow-core">
                            <DisasterIcon type={event.type} size={20} className="text-fg-2" />
                          </span>

                          <div className="min-w-0 flex-1">
                            <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-label">
                              <span className={`inline-flex items-center gap-1.5 font-medium ${badge.text}`}>
                                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
                                {badge.label}
                              </span>
                              {catMeta && <span className="text-fg-2">{catMeta.label}</span>}
                              <time dateTime={event.eventTime} className="font-mono tabular-nums text-fg-3">
                                {formatWib(event.eventTime)}
                              </time>
                            </p>

                            <h4 className="mt-1 truncate text-body font-medium text-fg-1">{event.title}</h4>

                            <p className="mt-0.5 flex min-w-0 items-center gap-1.5 text-small text-fg-3">
                              {event.metadata?.magnitude !== undefined && (
                                <span className="shrink-0 font-mono tabular-nums text-fg-1">
                                  {formatMagnitude(event.metadata.magnitude)}
                                </span>
                              )}
                              {event.locationName && (
                                <span className="truncate">
                                  {event.locationName}
                                  {event.province ? `, ${event.province}` : ''}
                                </span>
                              )}
                              <span className="hidden shrink-0 sm:inline">· {event.source.name}</span>
                            </p>
                          </div>

                          <ChevronRight className="h-4 w-4 shrink-0 text-fg-3 transition-transform duration-160 ease-data group-hover:translate-x-0.5 group-hover:text-fg-1" aria-hidden="true" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : (
              <div className="bezel">
                <p className="bezel-core p-6 text-small text-fg-2">
                  Daftar kosong: belum ada laporan pada data <span className="font-mono tabular-nums">{updatedWib}</span>.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 4 — 10 JENIS BENCANA (3 KELOMPOK)
          ════════════════════════════════════════════════════════ */}
      <section className="reveal py-section">
        <div className="mx-auto max-w-7xl px-gutter sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">Jenis bencana</p>
              <h2 className="mt-4 text-title text-fg-1">
                <span className="font-mono tabular-nums">{DISASTER_CATEGORIES.length}</span> Jenis Bencana yang
                Dipantau
              </h2>
              <p className="mt-3 max-w-[56ch] text-body text-fg-2">
                Pilih jenis bencana untuk melihat titik lokasi kejadian terkini dan tips keselamatan.
              </p>
            </div>

            <Link
              href="/disasters"
              className="group inline-flex min-h-tap items-center gap-3 self-start rounded-full bg-shell py-1.5 pl-5 pr-1.5 text-body font-medium text-fg-1 shadow-core transition-colors duration-160 ease-data hover:bg-surface sm:self-auto"
            >
              <span>Lihat Semua Jenis Bencana</span>
              <span className="pill-icon bg-fg-1/10">
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </Link>
          </div>

          <div className="space-y-10">
            {clusters.map((cluster) => (
              <div key={cluster.title}>
                <h3 className="mb-4 text-heading text-fg-1">{cluster.title}</h3>
                <ul className={`grid grid-cols-1 gap-3 ${cluster.cols}`}>
                  {cluster.items.map((cat) => {
                    const activeCount = counts.byType[cat.type] || 0;
                    const isActive = activeCount > 0;
                    return (
                      <li key={cat.type} className={isActive ? 'bezel' : 'rounded-[var(--radius-bezel)] ring-1 ring-line'}>
                        <Link
                          href={`/disasters/${cat.type}`}
                          className={`group flex h-full flex-col p-6 transition-colors duration-160 ease-data ${
                            isActive ? 'bezel-core hover:bg-raised' : 'rounded-[var(--radius-bezel)] hover:bg-surface'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className={`flex h-11 w-11 items-center justify-center rounded-full ${isActive ? 'bg-shell shadow-core' : ''}`}>
                              <DisasterIcon
                                type={cat.type}
                                size={22}
                                className={isActive ? 'text-fg-1' : 'text-fg-3'}
                              />
                            </span>
                            {isActive ? (
                              <span className="text-small text-fg-2">
                                <span className="font-mono text-num tabular-nums text-accent">{activeCount}</span> Aktif
                              </span>
                            ) : (
                              <span className="text-small text-fg-3">Tidak ada laporan</span>
                            )}
                          </div>
                          <h4 className={`mt-6 text-heading ${isActive ? 'text-fg-1' : 'text-fg-2'}`}>
                            {cat.label}
                          </h4>
                          <p className="mt-1.5 line-clamp-2 text-small text-fg-3">{cat.description}</p>
                          <p className="mt-auto pt-4 text-label text-fg-3">{cat.officialSources[0]}</p>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 5 — NOMOR DARURAT
          ════════════════════════════════════════════════════════ */}
      <section className="reveal mx-auto w-full max-w-7xl px-gutter sm:px-6 lg:px-8">
        <div className="bezel bezel-signal">
          <div className="bezel-core p-6 sm:p-10">
            <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
              <div className="max-w-2xl">
                <h2 className="text-title text-fg-1">
                  Nomor darurat <span className="serif-accent text-accent">bebas pulsa</span>
                </h2>
                <p className="mt-3 text-body text-fg-2">
                  Segera hubungi nomor darurat bebas pulsa di bawah ini atau baca panduan praktis untuk menyelamatkan
                  diri dan keluarga.
                </p>

                <ul className="mt-8 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
                  {[
                    { n: '112', label: 'Darurat Bebas Pulsa', primary: true },
                    { n: '115', label: 'Basarnas (SAR)', primary: false },
                    { n: '117', label: 'BNPB Logistik', primary: false },
                    { n: '119', label: 'Ambulans Medis', primary: false },
                  ].map((h) => (
                    <li key={h.n} className={h.primary ? 'col-span-2 sm:col-span-1' : ''}>
                      <a
                        href={`tel:${h.n}`}
                        className={`flex min-h-tap-lg items-center gap-3 rounded-full py-2 pl-2 pr-5 transition-colors duration-160 ease-data ${
                          h.primary
                            ? 'bg-accent text-fg-inverse hover:bg-accent-hover'
                            : 'bg-shell text-fg-1 shadow-core hover:bg-raised'
                        }`}
                      >
                        <span className={`pill-icon ${h.primary ? 'bg-fg-inverse/15' : 'bg-fg-1/10'}`}>
                          <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                        </span>
                        <span className="font-mono text-num font-semibold tabular-nums">{h.n}</span>
                        <span className="text-small">{h.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href="/safety-guide"
                className="inline-flex min-h-tap items-center justify-center gap-2 self-start rounded-full px-5 text-body font-medium text-fg-1 ring-1 ring-line-strong transition-colors duration-160 ease-data hover:ring-fg-3 lg:self-auto"
              >
                <BookOpen className="h-4 w-4" aria-hidden="true" />
                <span>Baca Panduan Keselamatan</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 6 — SUMBER DATA RESMI (status nyata per sumber)
          ════════════════════════════════════════════════════════ */}
      <section className="reveal py-section">
        <div className="mx-auto max-w-7xl px-gutter sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="eyebrow">Sumber data</p>
            <h2 className="mt-4 max-w-[22ch] text-title text-fg-1">Data Resmi Langsung dari Lembaga Pemerintah</h2>
            <p className="mt-3 max-w-[60ch] text-body text-fg-2">
              Magnitudo, level gunung api, dan poligon abu ditampilkan apa adanya dari sumbernya.
            </p>
          </div>

          <div className="bezel">
            <ul className="bezel-core divide-y divide-line overflow-hidden">
              {disasterSources.map((src) => {
                const st = SOURCE_STATUS[src.status] ?? SOURCE_STATUS.offline;
                return (
                  <li key={src.id} className="grid gap-x-8 gap-y-1 px-6 py-5 sm:grid-cols-[6rem_1fr_auto] sm:items-center">
                    <span className="font-mono text-small font-medium text-fg-1">{src.code}</span>
                    <div className="min-w-0">
                      <h3 className="text-body font-medium text-fg-1">{src.name}</h3>
                      <p className="text-small text-fg-2">{src.description}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-small sm:justify-end">
                      <span className={`inline-flex items-center gap-1.5 font-medium ${st.text}`}>
                        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
                        {st.label}
                      </span>
                      <span className="text-fg-3">
                        <span className="font-mono tabular-nums text-fg-2">{src.eventsCount}</span> data terpetakan
                      </span>
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-tap items-center gap-1 text-fg-1 underline decoration-line-strong underline-offset-4 hover:decoration-accent md:min-h-0"
                        aria-label={`Buka portal resmi ${src.name} (tab baru)`}
                      >
                        <span>Situs Resmi</span>
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Transparency Disclaimer */}
          <div className="mt-3 flex items-start gap-3 rounded-[var(--radius-bezel)] px-6 py-5 ring-1 ring-line">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-sev-warning" aria-hidden="true" />
            <p className="max-w-[80ch] text-small text-fg-2">
              <strong className="font-medium text-fg-1">Catatan Keselamatan:</strong> Platform Disaster Radar
              Indonesia adalah inisiatif independen yang merangkum data resmi pemerintah agar mudah dipahami semua
              orang. Jika terjadi bencana di wilayah Anda, selalu utamakan arahan resmi dari petugas BPBD, aparat
              desa/kelurahan, dan tim penyelamat di lapangan.
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 7 — PERTANYAAN UMUM (FAQ) & JSON-LD
          ════════════════════════════════════════════════════════ */}
      <section className="reveal pb-section">
        <div className="mx-auto grid max-w-7xl gap-10 px-gutter sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-4">
            <p className="eyebrow">Tanya jawab</p>
            <h2 className="mt-4 text-title text-fg-1">Pertanyaan Umum (FAQ)</h2>
            <p className="mt-3 text-body text-fg-2">
              Jawaban seputar fungsi platform, metodologi agregasi data, dan panduan penggunaan peta.
            </p>
          </div>

          <dl className="divide-y divide-line border-y border-line lg:col-span-8">
            {FAQ_ITEMS.map((item, idx) => (
              <div key={idx} className="py-6">
                <dt className="text-heading text-fg-1">{item.question}</dt>
                <dd className="mt-2 max-w-[70ch] text-body text-fg-2">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </div>
  );
}
