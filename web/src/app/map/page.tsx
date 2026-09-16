import React from 'react';
import type { Metadata } from 'next';
import { getAggregatedDisasters } from '@/lib/disasters/aggregator';
import { MapWrapper } from '@/components/map/map-wrapper';
import { SITE_CONFIG, SITE_URL } from '@/config/site';
import { ShieldAlert, Database, Map as MapIcon, Layers, Info } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 120; // 2 min revalidation

export const metadata: Metadata = {
  title: 'Peta Bencana Alam Indonesia Hari Ini — Gempa BMKG, Banjir, & Gunung Api | Disaster Radar',
  description:
    'Peta interaktif pantauan bencana alam Indonesia hari ini secara langsung. Cek info gempa bumi BMKG terkini, peta banjir, status gunung api meletus PVMBG, titik api karhutla, dan cuaca ekstrem BMKG.',
  keywords: [
    'peta bencana indonesia',
    'peta gempa hari ini',
    'info gempa bmkg',
    'peta banjir hari ini',
    'status gunung api meletus',
    'titik api karhutla',
    'cuaca ekstrem bmkg',
    'pantauan bencana terkini',
    'peringatan dini tsunami',
  ],
  alternates: {
    canonical: `${SITE_URL}/map`,
  },
  openGraph: {
    title: 'Peta Bencana Alam Indonesia Hari Ini — Gempa BMKG, Banjir, & Gunung Api | Disaster Radar',
    description:
      'Peta interaktif pantauan bencana alam Indonesia hari ini secara langsung. Cek info gempa bumi BMKG terkini, peta banjir, status gunung api meletus PVMBG, titik api karhutla, dan cuaca ekstrem BMKG.',
    url: `${SITE_URL}/map`,
    siteName: 'Disaster Radar Indonesia',
    type: 'website',
    images: [
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'Peta Bencana Alam Indonesia Hari Ini — Disaster Radar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Peta Bencana Alam Indonesia Hari Ini — Gempa BMKG, Banjir, & Gunung Api | Disaster Radar',
    description:
      'Peta interaktif pantauan bencana alam Indonesia hari ini secara langsung. Cek info gempa bumi BMKG terkini, peta banjir, status gunung api meletus PVMBG, titik api karhutla, dan cuaca ekstrem BMKG.',
    images: [`${SITE_URL}/opengraph-image`],
  },
};

export default async function MapPage() {
  const data = await getAggregatedDisasters('LIVE');

  return (
    <div className="flex flex-col w-full bg-[#0B0F17]">
      {/* Interactive Map Section */}
      <div className="relative h-[calc(100svh-60px)] sm:h-[calc(100dvh-60px)] w-full overflow-hidden bg-[#0B0F17]">
        <h1 className="sr-only">Peta Bencana Indonesia</h1>
        <p className="sr-only">
          Peta interaktif pemantauan bencana Indonesia. Pantau sebaran gempa terkini BMKG, banjir BNPB, aktivitas gunung api PVMBG, dan sebaran abu vulkanik Darwin VAAC.
        </p>
        <MapWrapper
          initialEvents={data.events}
          advisories={data.volcanoAdvisories}
          sources={data.sources}
          hazardZones={data.hazardZones}
          initialUpdatedAt={data.lastUpdated}
        />
      </div>

      {/* SEO Explanatory Content Section (Crawlable & Informative) */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#EF4444]">
            Pantauan Bencana Langsung
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Cara Membaca Peta Bencana Indonesia
          </h2>
          <p className="text-sm text-[#8B95A7] mt-3 leading-relaxed">
            Peta ini mengumpulkan laporan resmi dari BMKG, BNPB, dan PVMBG ke dalam satu tampilan. Anda bisa melihat lokasi kejadian bencana yang sedang berlangsung, wilayah yang berisiko, serta peringatan cuaca di sekitar Anda.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1: Multi-Kategori */}
          <div className="p-6 rounded-2xl bg-[#111827] border border-white/10 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">Semua Jenis Bencana Terpantau</h3>
            <p className="text-xs text-[#8B95A7] leading-relaxed">
              Mulai dari gempa bumi terkini BMKG, lokasi genangan banjir, tanah longsor, titik api kebakaran hutan (karhutla), cuaca ekstrem, peringatan tsunami, hingga status gunung api aktif dan abu vulkanik.
            </p>
          </div>

          {/* Card 2: Perbedaan Kejadian vs Risiko */}
          <div className="p-6 rounded-2xl bg-[#111827] border border-white/10 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <Info className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">Kejadian Nyata vs Wilayah Berisiko</h3>
            <p className="text-xs text-[#8B95A7] leading-relaxed">
              Titik berwarna merah menunjukkan <strong>kejadian yang baru saja terjadi</strong>. Garis atau arsiran warna menunjukkan <strong>wilayah potensi rawan bencana</strong> agar warga sekitar tetap waspada.
            </p>
          </div>

          {/* Card 3: Sumber & Transparansi */}
          <div className="p-6 rounded-2xl bg-[#111827] border border-white/10 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <Database className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">Langsung dari Sumber Resmi</h3>
            <p className="text-xs text-[#8B95A7] leading-relaxed">
              Data terhubung otomatis dengan <strong>BMKG</strong> (gempa & cuaca), <strong>BNPB</strong> (bencana hidrometeorologi), <strong>PVMBG</strong> (gunung api), dan <strong>VAAC</strong> (abu vulkanik penerbangan).
            </p>
          </div>
        </div>

        {/* Disclaimer Alert */}
        <div className="mt-8 p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex items-start gap-3 text-xs text-[#CBD5E1]">
          <ShieldAlert className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-white">Penting untuk Diketahui:</span>
            <p className="leading-relaxed">
              Peta ini bertujuan membantu masyarakat memantau kondisi lingkungan secara cepat dan mudah. Jika terjadi kondisi darurat atau instruksi evakuasi, selalu ikuti arahan resmi dari <strong>BPBD, SAR, aparat desa setempat, dan BMKG/PVMBG</strong>.
            </p>
          </div>
        </div>

        {/* Category Quick Links */}
        <div className="mt-8 pt-8 border-t border-white/10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8B95A7]">
            Jelajahi Berdasarkan Jenis Bencana
          </span>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href="/disasters/earthquake"
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white transition"
            >
              Peta Gempa Bumi
            </Link>
            <Link
              href="/disasters/flood"
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white transition"
            >
              Peta Banjir
            </Link>
            <Link
              href="/disasters/volcano"
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white transition"
            >
              Aktivitas Gunung Api
            </Link>
            <Link
              href="/disasters/volcanic-ash"
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white transition"
            >
              Sebaran Abu Vulkanik
            </Link>
            <Link
              href="/disasters/landslide"
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white transition"
            >
              Tanah Longsor
            </Link>
            <Link
              href="/disasters/forest-fire"
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white transition"
            >
              Kebakaran Hutan & Lahan
            </Link>
            <Link
              href="/disasters/extreme-weather"
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white transition"
            >
              Cuaca Ekstrem
            </Link>
            <Link
              href="/disasters/tsunami"
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white transition"
            >
              Peringatan Dini Tsunami
            </Link>
            <Link
              href="/safety-guide"
              className="px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-xs text-red-300 font-bold transition"
            >
              Panduan Evakuasi & Keselamatan →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
