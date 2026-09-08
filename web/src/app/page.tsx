import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getAggregatedDisasters, DISASTER_CATEGORIES } from '@/lib/disasters/aggregator';
import { SITE_CONFIG, SITE_URL } from '@/config/site';
import { JsonLd, getFaqJsonLd } from '@/components/json-ld';
import { DisasterIcon } from '@/components/icons/disaster-icons';
import {
  Map,
  MapPin,
  Flame,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  Search,
  CheckCircle2,
  AlertTriangle,
  Radio,
  BookOpen,
  Activity,
  Layers,
  Droplets,
  Mountain,
  Wind,
  Waves,
  CloudLightning,
  Sun,
  Database,
  ExternalLink,
} from 'lucide-react';

export const revalidate = 180; // 3 min revalidation

export const metadata: Metadata = {
  title: 'Peta Bencana Indonesia Terkini | Disaster Radar Indonesia',
  description:
    'Pantau kondisi bencana Indonesia melalui peta interaktif. Lihat gempa, banjir, longsor, kebakaran, cuaca ekstrem, tsunami, gunung api, dan abu vulkanik terkini.',
  alternates: {
    canonical: `${SITE_URL}`,
  },
  openGraph: {
    title: 'Peta Bencana Indonesia Terkini | Disaster Radar Indonesia',
    description:
      'Pantau kondisi bencana Indonesia melalui peta interaktif. Lihat gempa, banjir, longsor, kebakaran, cuaca ekstrem, tsunami, gunung api, dan abu vulkanik.',
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
    title: 'Peta Bencana Indonesia Terkini | Disaster Radar Indonesia',
    description:
      'Pantau kondisi bencana Indonesia melalui peta interaktif dan data dari berbagai sumber resmi.',
    images: [`${SITE_URL}/opengraph-image`],
  },
};

const FAQ_ITEMS = [
  {
    question: 'Apa itu Disaster Radar Indonesia?',
    answer:
      'Disaster Radar Indonesia adalah platform independen agregasi dan visualisasi geospasial yang menyatukan data kebencanaan dari berbagai otoritas resmi Indonesia (seperti BMKG, BNPB, dan PVMBG) ke dalam satu peta interaktif real-time.',
  },
  {
    question: 'Bagaimana cara melihat peta bencana Indonesia?',
    answer:
      'Buka menu Peta Radar di bagian atas navigasi. Anda dapat melihat titik gempa, banjir, kawah gunung api aktif, sebaran abu vulkanik, serta mengaktifkan atau menonaktifkan layer bencana sesuai kebutuhan.',
  },
  {
    question: 'Dari mana sumber data kebencanaan berasal?',
    answer:
      'Informasi dihimpun dari feed terbuka resmi: BMKG untuk data gempa tektonik dan peringatan tsunami, BNPB & InaRISK untuk banjir, longsor, dan karhutla, PVMBG / MAGMA ESDM untuk status aktivitas gunung api, serta Darwin VAAC untuk advisori sebaran abu vulkanik penerbangan.',
  },
  {
    question: 'Apakah Disaster Radar Indonesia merupakan instansi resmi pemerintah?',
    answer:
      'Bukan. Disaster Radar Indonesia adalah platform independen untuk penyebaran informasi publik. Platform ini tidak menggantikan fungsi atau instruksi dari BNPB, BPBD, atau BMKG.',
  },
  {
    question: 'Bagaimana cara mengetahui apakah lokasi saya berada di zona bahaya bencana?',
    answer:
      'Gunakan fitur deteksi lokasi atau simpan kota Anda. Sistem kami secara otomatis menghitung jarak koordinat Anda terhadap poligon sebaran abu vulkanik, kawah gunung api berstatus Waspada/Siaga/Awas, serta radius pusat gempa bumi dan banjir.',
  },
  {
    question: 'Apa perbedaan antara kejadian bencana, peringatan dini, hazard, dan risiko?',
    answer:
      'Kejadian (Event) adalah peristiwa fisik yang telah atau sedang berlangsung saat ini. Peringatan Dini (Warning) adalah maklumat resmi BMKG/PVMBG tentang ancaman yang akan terjadi. Hazard adalah potensi ancaman alamiah suatu wilayah, sedangkan Risiko (Risk) adalah kombinasi hazard dengan kerentanan dan kepadatan penduduk.',
  },
];

export default async function HomePage() {
  const data = await getAggregatedDisasters('LIVE');
  const counts = data.counts;

  return (
    <div className="flex flex-col w-full bg-[#0B0F17] text-[#F5F7FA]">
      <JsonLd data={getFaqJsonLd(FAQ_ITEMS)} />

      {/* 1. Hero Section */}
      <section className="relative overflow-hidden border-b border-white/10 pt-16 pb-20 sm:pt-24 sm:pb-28">
        {/* Glow backdrop effects */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-96 w-full max-w-7xl">
          <div className="absolute top-10 left-1/4 h-72 w-72 rounded-full bg-red-600/15 blur-[120px]" />
          <div className="absolute top-20 right-1/4 h-80 w-80 rounded-full bg-amber-500/10 blur-[130px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            {/* Live Indicator Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-950/40 px-3.5 py-1 text-xs font-semibold text-red-300 backdrop-blur-md shadow-lg shadow-red-950/30">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
              </span>
              <span>SISTEM RADAR BENCANA TERPADU INDONESIA</span>
            </div>

            {/* H1 Primary SEO Heading */}
            <h1 className="mt-6 max-w-4xl text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
              Peta dan Monitoring <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-red-500 via-orange-400 to-amber-400 bg-clip-text text-transparent">
                Bencana Indonesia
              </span>
            </h1>

            {/* Supporting natural SEO copy */}
            <p className="mt-5 max-w-2xl text-sm sm:text-base text-[#8B95A7] leading-relaxed">
              Disaster Radar Indonesia adalah platform pemantauan dan visualisasi informasi bencana di Indonesia. Jelajahi kejadian bencana, peringatan dini resmi BMKG, aktivitas gunung api PVMBG, sebaran abu vulkanik, dan zona risiko melalui peta geospasial interaktif.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/map"
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#EF4444] to-[#F97316] px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-red-600/25 transition-all hover:brightness-110 hover:-translate-y-0.5"
              >
                <Map className="h-4 w-4" />
                <span>Buka Peta Radar Live</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/safety-guide"
                className="flex items-center gap-2 rounded-2xl border border-white/15 bg-[#151C28]/80 px-6 py-3.5 text-sm font-semibold text-white hover:bg-[#151C28] transition backdrop-blur-md"
              >
                <BookOpen className="h-4 w-4 text-red-400" />
                <span>Panduan Evakuasi & Keselamatan</span>
              </Link>
            </div>
          </div>

          {/* 2. Situation Summary Stats Card */}
          <div className="mt-14 mx-auto max-w-4xl rounded-3xl border border-white/10 bg-[#111827]/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B95A7]">
                  Ringkasan Situasi Bencana
                </span>
                <h2 className="text-lg font-black text-white mt-0.5">
                  Kondisi Kebencanaan Nasional Saat Ini
                </h2>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#8B95A7]">
                <Radio className="h-3.5 w-3.5 text-emerald-400" />
                <span>Sumber Terintegrasi BMKG • BNPB • PVMBG</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Critical */}
              <div className="p-4 rounded-2xl bg-red-950/30 border border-red-500/30">
                <span className="text-xs font-bold uppercase text-red-400">Kritis (Awas / M≥6.0)</span>
                <div className="text-3xl font-black text-white mt-1">{counts.critical}</div>
                <span className="text-[11px] text-[#94A3B8]">Evakuasi & peringatan tinggi</span>
              </div>

              {/* High */}
              <div className="p-4 rounded-2xl bg-orange-950/30 border border-orange-500/30">
                <span className="text-xs font-bold uppercase text-orange-400">Tinggi (Siaga / Luapan)</span>
                <div className="text-3xl font-black text-white mt-1">{counts.high}</div>
                <span className="text-[11px] text-[#94A3B8]">Radius bahaya aktif</span>
              </div>

              {/* Moderate */}
              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30">
                <span className="text-xs font-bold uppercase text-amber-400">Waspada</span>
                <div className="text-3xl font-black text-white mt-1">{counts.moderate}</div>
                <span className="text-[11px] text-[#94A3B8]">Pengawasan intensif</span>
              </div>

              {/* Total Active */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-xs font-bold uppercase text-[#8B95A7]">Total Terpantau</span>
                <div className="text-3xl font-black text-white mt-1">{counts.total}</div>
                <span className="text-[11px] text-[#94A3B8]">Kejadian & titik pantau</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Active Disaster Categories Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#EF4444]">
              Multi-Hazard Monitoring
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Kategori Bencana yang Dipantau
            </h2>
            <p className="text-xs sm:text-sm text-[#8B95A7] mt-1">
              Data dikelompokkan secara terstruktur berdasarkan jenis bencana dan otoritas terkait.
            </p>
          </div>
          <Link
            href="/disasters"
            className="flex items-center gap-1.5 text-xs font-bold text-[#FF8A3D] hover:underline self-start sm:self-auto"
          >
            <span>Lihat Semua Kategori</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DISASTER_CATEGORIES.map((cat) => {
            const activeCount = counts.byType[cat.type] || 0;
            return (
              <Link
                key={cat.type}
                href={`/disasters/${cat.type}`}
                className="p-5 rounded-2xl bg-[#111827] border border-white/10 hover:border-white/20 transition-all duration-200 group hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ backgroundColor: cat.bgRgba, color: cat.color }}
                  >
                    <DisasterIcon type={cat.type} size={22} color={cat.color} />
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-[#8B95A7]">
                    {activeCount} Aktif
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-[#EF4444] transition">
                  {cat.label}
                </h3>
                <p className="text-xs text-[#8B95A7] mt-1.5 leading-relaxed line-clamp-2">
                  {cat.description}
                </p>
                <div className="mt-4 flex items-center justify-between text-[11px] text-[#64748B] pt-3 border-t border-white/5">
                  <span className="truncate">{cat.officialSources[0]}</span>
                  <ChevronRight className="h-3 w-3 text-[#8B95A7] group-hover:translate-x-1 transition" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. Safety & Evacuation CTA Banner */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-950/60 via-[#151C28] to-orange-950/60 p-8 border border-red-500/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-red-400">
                Penyelamatan Mandiri & Mitigasi
              </span>
              <h2 className="text-2xl font-black text-white">
                Ketahui Tindakan Saat Anda Berada di Zona Bahaya
              </h2>
              <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
                Pelajari langkah cepat tanggap gempa (Drop, Cover, Hold On), jalur evakuasi banjir, pemakaian masker abu vulkanik, hingga nomor telepon darurat nasional (112, 115 Basarnas, 117 BNPB).
              </p>
            </div>
            <Link
              href="/safety-guide"
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-red-950/50 transition self-start md:self-auto shrink-0"
            >
              <BookOpen className="h-4 w-4" />
              <span>Buka Panduan Keselamatan</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Data Sources Transparency & Trust */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-3xl mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#EF4444]">
            Integritas & Kepercayaan
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Sumber Data Resmi Terintegrasi
          </h2>
          <p className="text-xs sm:text-sm text-[#8B95A7] mt-2">
            Disaster Radar Indonesia tidak memalsukan ataupun memanipulasi informasi bencana. Seluruh data dipetakan secara objektif langsung dari lembaga penanggung jawab resmi.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#111827] border border-white/10">
            <div className="font-bold text-white text-sm">BMKG Indonesia</div>
            <div className="text-[11px] text-[#EF4444] mt-0.5">Pusat Gempa Bumi & Tsunami</div>
            <p className="text-xs text-[#8B95A7] mt-2 leading-relaxed">
              Penyedia data gempa bumi real-time M≥5.0, gempa dirasakan, dan sistem peringatan dini tsunami InaTEWS.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#111827] border border-white/10">
            <div className="font-bold text-white text-sm">BNPB & InaRISK</div>
            <div className="text-[11px] text-[#3B82F6] mt-0.5">Penanggulangan Bencana</div>
            <p className="text-xs text-[#8B95A7] mt-2 leading-relaxed">
              Laporan kejadian banjir, longsor, kebakaran hutan, dan peta spasial risiko bencana multi-bahaya di seluruh Indonesia.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#111827] border border-white/10">
            <div className="font-bold text-white text-sm">PVMBG / MAGMA ESDM</div>
            <div className="text-[11px] text-[#F97316] mt-0.5">Vulkanologi & Mitigasi Geologi</div>
            <p className="text-xs text-[#8B95A7] mt-2 leading-relaxed">
              Status 4 tingkat aktivitas (Normal, Waspada, Siaga, Awas) dari 127+ gunung api aktif di Indonesia.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#111827] border border-white/10">
            <div className="font-bold text-white text-sm">Darwin VAAC & OSM</div>
            <div className="text-[11px] text-[#FB923C] mt-0.5">Aviasi & Pemetaan Geospasial</div>
            <p className="text-xs text-[#8B95A7] mt-2 leading-relaxed">
              Advisori sebaran awan abu vulkanik internasional dan mesin peta geospasial bebas OpenStreetMap.
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3 text-xs text-[#94A3B8]">
          <ShieldAlert className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
          <p>
            <strong>Penafian:</strong> Platform ini adalah alat agregasi independen. Jangan gunakan data visualisasi ini sebagai pengganti komando evakuasi darurat resmi dari BPBD atau instansi berwenang di tempat Anda.
          </p>
        </div>
      </section>

      {/* 6. FAQ Section */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#EF4444]">
            Pertanyaan Umum
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Tanya Jawab Seputar Disaster Radar
          </h2>
        </div>

        <div className="space-y-4">
          {FAQ_ITEMS.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#111827] border border-white/10 space-y-2"
            >
              <h3 className="text-sm font-bold text-white">{item.question}</h3>
              <p className="text-xs text-[#8B95A7] leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
