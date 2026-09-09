import React from 'react';
import type { Metadata } from 'next';
import { getAggregatedDisasters } from '@/lib/disasters/aggregator';
import { MapWrapper } from '@/components/map/map-wrapper';
import { SITE_CONFIG, SITE_URL } from '@/config/site';
import { ShieldAlert, Database, Map as MapIcon, Layers, Info } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 120; // 2 min revalidation

export const metadata: Metadata = {
  title: 'Peta Bencana Indonesia Terkini | Disaster Radar',
  description:
    'Jelajahi peta interaktif bencana Indonesia dan pantau gempa, banjir, longsor, kebakaran, cuaca ekstrem, tsunami, gunung api, serta abu vulkanik.',
  alternates: {
    canonical: `${SITE_URL}/map`,
  },
  openGraph: {
    title: 'Peta Bencana Indonesia Terkini | Disaster Radar',
    description:
      'Jelajahi peta interaktif bencana Indonesia dan pantau gempa, banjir, longsor, kebakaran, cuaca ekstrem, tsunami, gunung api, serta abu vulkanik.',
    url: `${SITE_URL}/map`,
    siteName: 'Disaster Radar Indonesia',
    type: 'website',
    images: [
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'Peta Bencana Indonesia — Disaster Radar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Peta Bencana Indonesia Terkini | Disaster Radar',
    description:
      'Jelajahi peta interaktif bencana Indonesia dan pantau gempa, banjir, longsor, kebakaran, cuaca ekstrem, tsunami, gunung api, serta abu vulkanik.',
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
            Informasi Geospasial Bencana
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Tentang Peta Bencana Indonesia
          </h2>
          <p className="text-sm text-[#8B95A7] mt-3 leading-relaxed">
            Disaster Radar Indonesia menyediakan platform visualisasi geospasial satu pintu untuk memantau beragam jenis ancaman bencana alam di seluruh nusantara. Informasi dihimpun secara objektif dari badan resmi nasional dan regional.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1: Multi-Kategori */}
          <div className="p-6 rounded-2xl bg-[#111827] border border-white/10 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">Kategori Bencana Terintegrasi</h3>
            <p className="text-xs text-[#8B95A7] leading-relaxed">
              Memantau gempa tektonik terkini, banjir dan genangan luapan air, tanah longsor, kebakaran hutan & lahan (karhutla), cuaca ekstrem, tsunami, aktivitas kawah gunung api, hingga pemodelan sebaran abu vulkanik di ruang udara Indonesia.
            </p>
          </div>

          {/* Card 2: Perbedaan Kejadian vs Risiko */}
          <div className="p-6 rounded-2xl bg-[#111827] border border-white/10 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <Info className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">Kejadian, Peringatan & Risiko</h3>
            <p className="text-xs text-[#8B95A7] leading-relaxed">
              Platform secara tegas membedakan antara <strong>Kejadian Nyata (Live Events)</strong>, <strong>Peringatan Dini Resmi (Official Warnings)</strong>, serta <strong>Zona Bahaya / Kerentanan Jangka Panjang (Hazard & Risk Zones)</strong> agar masyarakat tidak salah memahami tingkat kedaruratan.
            </p>
          </div>

          {/* Card 3: Sumber & Transparansi */}
          <div className="p-6 rounded-2xl bg-[#111827] border border-white/10 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <Database className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">Transparansi Sumber Resmi</h3>
            <p className="text-xs text-[#8B95A7] leading-relaxed">
              Semua data terhubung langsung ke sumber aslinya: <strong>BMKG</strong> untuk gempa dan cuaca, <strong>BNPB & InaRISK</strong> untuk bencana hidrometeorologi, <strong>PVMBG</strong> untuk status gunung api, dan <strong>Darwin VAAC</strong> untuk advisori abu vulkanik.
            </p>
          </div>
        </div>

        {/* Disclaimer Alert */}
        <div className="mt-8 p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex items-start gap-3 text-xs text-[#CBD5E1]">
          <ShieldAlert className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-white">Penafian Keselamatan Penting:</span>
            <p className="leading-relaxed">
              Disaster Radar Indonesia adalah platform independen untuk tujuan agregasi dan visualisasi informasi publik. Platform ini <strong>bukan</strong> badan pemerintah penanggulangan darurat. Untuk tindakan evakuasi dan keputusan darurat bencana, selalu ikuti komando resmi dari <strong>BNPB, BPBD setempat, BMKG, dan PVMBG</strong>.
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
