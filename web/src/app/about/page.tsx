import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { ShieldAlert, Globe, Radio, Code2, MapPin, ExternalLink, Heart } from 'lucide-react';
import Link from 'next/link';
import { SITE_CONFIG, SITE_URL } from '@/config/site';

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
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ name: 'Tentang Proyek', url: '/about' }]} />

      <div className="max-w-2xl mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-[#EF4444]">
          Profil Proyek Independen
        </span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-1">
          Tentang Disaster Radar Indonesia
        </h1>
        <p className="mt-3 text-sm text-[#8B95A7] leading-relaxed">
          Platform intelijen geospasial publik untuk memantau ancaman multi-bencana di seluruh kepulauan Indonesia secara real-time.
        </p>
      </div>

      <div className="space-y-8 text-sm text-[#CBD5E1] leading-relaxed">
        {/* Mission */}
        <section className="p-6 rounded-3xl bg-[#111827] border border-white/10 space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Globe className="h-5 w-5 text-[#EF4444]" />
            <span>Misi & Latar Belakang</span>
          </h2>
          <p>
            Indonesia terletak di kawasan Cincin Api Pasifik (Ring of Fire) dan pertemuan tiga lempeng tektonik utama dunia, menjadikannya salah satu wilayah paling rentan terhadap bencana alam seperti gempa bumi, tsunami, letusan gunung api, banjir bandang, tanah longsor, dan cuaca ekstrem.
          </p>
          <p>
            Tantangan utama yang dihadapi masyarakat sering kali adalah fragmentasi informasi: data gempa berada di portal BMKG, data banjir di BNPB, status kawah di PVMBG, dan sebaran abu vulkanik aviasi di Darwin VAAC. <strong>Disaster Radar Indonesia</strong> lahir untuk menyatukan potongan-potongan informasi penting tersebut ke dalam satu kanvas peta geospasial interaktif yang mudah dipahami oleh masyarakat umum.
          </p>
        </section>

        {/* Foundation & AshWatch Heritage */}
        <section className="p-6 rounded-3xl bg-[#111827] border border-white/10 space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Radio className="h-5 w-5 text-[#FF8A3D]" />
            <span>Fondasi & Warisan AshWatch</span>
          </h2>
          <p>
            Platform ini berakar dan berevolusi dari proyek <strong>AshWatch Web</strong>, sebuah modul pemantau sebaran abu vulkanik aviasi yang akurat. Teknologi penguraian poligon koordinat Darwin VAAC dan pemantauan 127+ gunung api PVMBG dari AshWatch tetap dipertahankan seutuhnya dan kini menjadi salah satu pilar utama di dalam Disaster Radar Indonesia.
          </p>
        </section>

        {/* Technology */}
        <section className="p-6 rounded-3xl bg-[#111827] border border-white/10 space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Code2 className="h-5 w-5 text-[#3B82F6]" />
            <span>Arsitektur & Teknologi</span>
          </h2>
          <p>
            Aplikasi dibangun menggunakan teknologi web modern:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-[#94A3B8]">
            <li><strong>Next.js App Router & React:</strong> Server-side rendering dan serverless route handlers yang ringan dan cepat di Vercel.</li>
            <li><strong>Leaflet & OpenStreetMap (OSM):</strong> Peta geospasial interaktif berpresisi tinggi dengan tema gelap kontras tinggi.</li>
            <li><strong>Data Normalization Layer:</strong> Menggabungkan format JSON BMKG, InaRISK BNPB, dan bulletin ICAO Darwin VAAC ke dalam model data terpadu.</li>
            <li><strong>Client-side Proximity Cache:</strong> Algoritma ray-casting point-in-polygon dan formula Haversine untuk deteksi keterpaparan zona bahaya pengguna di browser.</li>
          </ul>
        </section>

        {/* Independence & Safety Disclaimer */}
        <section className="p-6 rounded-3xl bg-amber-950/20 border border-amber-500/30 space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-amber-400" />
            <span>Penafian Independensi & Keselamatan</span>
          </h2>
          <p className="text-xs leading-relaxed text-[#CBD5E1]">
            Disaster Radar Indonesia adalah proyek nirlaba independen. Kami <strong>bukan</strong> badan resmi pemerintah Republik Indonesia. Seluruh informasi disajikan &quot;apa adanya&quot; untuk tujuan edukasi dan peningkatan kesadaran bencana.
          </p>
          <p className="text-xs leading-relaxed text-[#CBD5E1]">
            Dalam kondisi genting atau terjadi bencana di wilayah Anda, <strong>selalu patuhi komando resmi dan instruksi evakuasi</strong> yang diumumkan oleh BNPB, BPBD setempat, aparat kepolisian, atau Basarnas.
          </p>
        </section>

        {/* Creator credit */}
        <div className="pt-4 flex items-center justify-between text-xs text-[#8B95A7]">
          <span>Dikembangkan oleh Ilham Ghazali</span>
          <a
            href="https://github.com/IlhamGhaza/Disaster-radarID"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[#FF8A3D] hover:underline font-semibold"
          >
            <span>Repositori GitHub</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
