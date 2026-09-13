import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { ShieldAlert, Globe, Radio, Code2, ExternalLink, Radar } from 'lucide-react';
import Link from 'next/link';
import { SITE_URL } from '@/config/site';

export const metadata: Metadata = {
  title: 'Tentang Disaster Radar Indonesia | Visi & Metodologi',
  description:
    'Disaster Radar Indonesia adalah platform independen agregasi dan visualisasi informasi kebencanaan di Indonesia. Dibangun untuk memberikan kesadaran dini dan akses cepat ke data resmi.',
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  openGraph: {
    title: 'Tentang Disaster Radar Indonesia | Visi & Metodologi',
    description:
      'Disaster Radar Indonesia adalah platform independen agregasi dan visualisasi informasi kebencanaan di Indonesia.',
    url: `${SITE_URL}/about`,
    siteName: 'Disaster Radar Indonesia',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 bg-[#080C14] text-[#E8ECF1]">
      <Breadcrumbs items={[{ name: 'Tentang Proyek', url: '/about' }]} />

      {/* Hero Header */}
      <div className="relative mt-4 mb-10 rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#101420] via-[#0D1017] to-[#070A10] p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-cyan-600/10 blur-[100px]" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-[#141B26]/80 px-3 py-1 text-[11px] font-mono font-semibold tracking-wider text-cyan-400 uppercase mb-3 backdrop-blur-md">
            <Radar className="h-3 w-3 animate-pulse" />
            <span>PROFIL PLATFORM INTELIJEN GEOSPASIAL</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#E8ECF1] leading-[1.1]">
            Tentang Disaster Radar Indonesia
          </h1>

          <p className="mt-3 text-sm sm:text-base text-[#94A3B8] leading-relaxed">
            Platform agregasi geospasial publik independen untuk memantau ancaman multi-bencana di seluruh kepulauan Indonesia secara real-time.
          </p>
        </div>
      </div>

      <div className="space-y-6 text-sm text-[#CBD5E1] leading-relaxed">
        {/* Mission */}
        <section className="p-6 sm:p-8 rounded-2xl bg-[#0D1117] border border-white/[0.08] shadow-xl space-y-3.5">
          <div className="flex items-center gap-2.5 text-[#EF4444]">
            <Globe className="h-5 w-5" />
            <h2 className="text-lg sm:text-xl font-bold text-[#E8ECF1]">Misi & Latar Belakang</h2>
          </div>
          <p className="text-[#94A3B8] leading-relaxed">
            Indonesia terletak di kawasan Cincin Api Pasifik (*Ring of Fire*) dan pertemuan tiga lempeng tektonik utama dunia, menjadikannya salah satu wilayah paling rentan terhadap bencana alam seperti gempa bumi tektonik, tsunami, letusan gunung api, banjir bandang, tanah longsor, dan cuaca ekstrem.
          </p>
          <p className="text-[#94A3B8] leading-relaxed">
            Tantangan utama yang dihadapi masyarakat adalah fragmentasi informasi: data gempa berada di portal BMKG, data banjir dan bencana hidrometeorologi di BNPB, status kawah gunung api di PVMBG, dan buletin sebaran abu vulkanik aviasi di Darwin VAAC. <strong className="text-[#E8ECF1]">Disaster Radar Indonesia</strong> hadir untuk menyatukan potongan-potongan informasi penting tersebut ke dalam satu kanvas peta geospasial interaktif real-time yang mudah dipahami oleh publik.
          </p>
        </section>

        {/* Foundation & AshWatch Heritage */}
        <section className="p-6 sm:p-8 rounded-2xl bg-[#0D1117] border border-white/[0.08] shadow-xl space-y-3.5">
          <div className="flex items-center gap-2.5 text-orange-400">
            <Radio className="h-5 w-5" />
            <h2 className="text-lg sm:text-xl font-bold text-[#E8ECF1]">Fondasi & Warisan AshWatch</h2>
          </div>
          <p className="text-[#94A3B8] leading-relaxed">
            Platform ini berakar dan berevolusi dari proyek <strong className="text-[#E8ECF1]">AshWatch Web</strong>, sebuah modul pemantau sebaran abu vulkanik aviasi berpresisi tinggi. Teknologi penguraian poligon koordinat batas buletin ICAO Darwin VAAC dan pemantauan 127+ gunung api aktif PVMBG dari AshWatch tetap dipertahankan seutuhnya dan kini menjadi salah satu pilar inti dalam Disaster Radar Indonesia.
          </p>
        </section>

        {/* Technology Architecture */}
        <section className="p-6 sm:p-8 rounded-2xl bg-[#0D1117] border border-white/[0.08] shadow-xl space-y-3.5">
          <div className="flex items-center gap-2.5 text-blue-400">
            <Code2 className="h-5 w-5" />
            <h2 className="text-lg sm:text-xl font-bold text-[#E8ECF1]">Arsitektur & Rekayasa Teknologi</h2>
          </div>
          <p className="text-[#94A3B8] leading-relaxed">
            Platform ini dibangun dengan standar arsitektur web modern berkinerja tinggi:
          </p>
          <ul className="grid sm:grid-cols-2 gap-3 pt-1 text-xs">
            <li className="p-3 rounded-xl bg-[#141B26] border border-white/[0.05]">
              <strong className="text-[#E8ECF1] block mb-1">Next.js App Router & React 19</strong>
              <span className="text-[#94A3B8]">Server-side rendering (SSR) kilat, nol hydration waterfall, dan performa tinggi di Edge serverless.</span>
            </li>
            <li className="p-3 rounded-xl bg-[#141B26] border border-white/[0.05]">
              <strong className="text-[#E8ECF1] block mb-1">Leaflet & OpenStreetMap (OSM)</strong>
              <span className="text-[#94A3B8]">Mesin kartografi geospasial interaktif bebas lisensi proprietary dengan filter dark theme terkalibrasi.</span>
            </li>
            <li className="p-3 rounded-xl bg-[#141B26] border border-white/[0.05]">
              <strong className="text-[#E8ECF1] block mb-1">Unified Multi-Source Aggregator</strong>
              <span className="text-[#94A3B8]">Mengintegrasikan feed BMKG (AutoGempa), BNPB InaRISK, PVMBG MAGMA, dan bulletin ICAO Darwin VAAC.</span>
            </li>
            <li className="p-3 rounded-xl bg-[#141B26] border border-white/[0.05]">
              <strong className="text-[#E8ECF1] block mb-1">Spatial Proximity & Ray-Casting</strong>
              <span className="text-[#94A3B8]">Kalkulasi jarak Haversine dan deteksi deterministik Point-in-Polygon langsung di browser pengguna.</span>
            </li>
          </ul>
        </section>

        {/* Independence & Safety Disclaimer */}
        <section className="p-6 sm:p-8 rounded-2xl bg-amber-950/20 border border-amber-500/30 shadow-xl space-y-3">
          <div className="flex items-center gap-2.5 text-amber-400">
            <ShieldAlert className="h-5 w-5" />
            <h2 className="text-lg sm:text-xl font-bold text-[#E8ECF1]">Penafian Independensi & Keselamatan</h2>
          </div>
          <p className="text-xs leading-relaxed text-[#CBD5E1]">
            Disaster Radar Indonesia adalah proyek independen untuk edukasi publik dan penyebaran informasi kebencanaan. Kami <strong className="text-white">bukan</strong> lembaga resmi pemerintah Republik Indonesia. Seluruh informasi disajikan &quot;apa adanya&quot; dari sumber terbuka lembaga penanggung jawab terkait.
          </p>
          <p className="text-xs leading-relaxed text-[#CBD5E1]">
            Dalam kondisi darurat atau saat bencana terjadi di wilayah Anda, <strong className="text-white">selalu patuhi komando resmi dan instruksi evakuasi</strong> yang dikeluarkan oleh BNPB, BPBD setempat, aparat kepolisian, TNI, atau Basarnas.
          </p>
        </section>

        {/* Quick Links Footer */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#8B95A7]">
          <Link href="/data-sources" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
            <span>Periksa Sumber Data Resmi</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
          <Link href="/safety-guide" className="hover:text-red-400 transition-colors flex items-center gap-1">
            <span>Pelajari Panduan Evakuasi</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
