import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { DISASTER_SAFETY_GUIDES } from '@/lib/safety-guides';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { SITE_URL } from '@/config/site';
import { DisasterIcon } from '@/components/icons/disaster-icons';
import {
  PhoneCall,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Package,
  Zap,
  Radio,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Panduan Keselamatan & Evakuasi Bencana | Disaster Radar Indonesia',
  description:
    'Panduan resmi tanggap darurat, penyelamatan mandiri, dan prosedur evakuasi saat menghadapi gempa bumi, banjir, letusan gunung api, abu vulkanik, tsunami, dan karhutla di Indonesia.',
  alternates: {
    canonical: `${SITE_URL}/safety-guide`,
  },
  openGraph: {
    title: 'Panduan Keselamatan & Evakuasi Bencana | Disaster Radar Indonesia',
    description:
      'Panduan resmi tanggap darurat, penyelamatan mandiri, dan prosedur evakuasi saat menghadapi gempa bumi, banjir, letusan gunung api, abu vulkanik, tsunami, dan karhutla di Indonesia.',
    url: `${SITE_URL}/safety-guide`,
    siteName: 'Disaster Radar Indonesia',
    type: 'article',
  },
};

export default function SafetyGuidePage() {
  const guides = Object.values(DISASTER_SAFETY_GUIDES);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-[#080C14] text-[#E8ECF1]">
      <Breadcrumbs items={[{ name: 'Panduan Keselamatan & Evakuasi', url: '/safety-guide' }]} />

      {/* Hero Header */}
      <div className="relative mt-4 mb-12 rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#180E14] via-[#0E121B] to-[#070A10] p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-red-600/10 blur-[120px]" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-950/40 px-3 py-1 text-[11px] font-mono font-semibold tracking-wider text-red-400 uppercase mb-4 backdrop-blur-md">
            <Radio className="h-3 w-3 animate-pulse" />
            <span>PROTOKOL EVAKUASI & MITIGASI MANDIRI</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#E8ECF1] leading-[1.1]">
            Panduan Keselamatan & Evakuasi Bencana
          </h1>

          <p className="mt-4 text-sm sm:text-base text-[#94A3B8] leading-relaxed">
            Ketahui langkah cepat penyelamatan mandiri saat Anda berada di dalam atau dekat zona bahaya bencana alam di Indonesia. Pahami tindakan sebelum, saat kejadian (Golden Time), dan sesudah bencana sesuai pedoman standar BNPB.
          </p>
        </div>
      </div>

      {/* National Emergency Numbers Bar (Tactical Hotline Grid) */}
      <section className="mb-14 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-red-950/40 via-[#0D1117] to-[#0A0E17] border border-red-500/25 shadow-2xl">
        <div className="flex items-center gap-2 mb-2">
          <PhoneCall className="h-5 w-5 text-red-400" />
          <h2 className="text-lg sm:text-xl font-bold text-[#E8ECF1]">
            Nomor Telepon Darurat Nasional Indonesia
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[#94A3B8] mb-6 leading-relaxed">
          Simpan nomor-nomor darurat berikut di ponsel Anda. Seluruh panggilan layanan darurat 112 dapat dihubungi bebas pulsa dari seluruh operator di Indonesia.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <a
            href="tel:112"
            className="group p-4 rounded-xl bg-[#140E14] border border-red-500/30 hover:border-red-500 hover:bg-red-950/40 transition-all text-center shadow-lg"
          >
            <div className="text-3xl font-extrabold text-[#E8ECF1] tabular-nums group-hover:text-red-400 transition-colors">112</div>
            <div className="text-xs font-bold text-red-300 mt-1">Panggilan Darurat</div>
            <div className="text-[10px] text-[#8B95A7] mt-0.5">Bebas Pulsa Terpadu</div>
          </a>

          <a
            href="tel:115"
            className="group p-4 rounded-xl bg-[#140E14] border border-red-500/30 hover:border-red-500 hover:bg-red-950/40 transition-all text-center shadow-lg"
          >
            <div className="text-3xl font-extrabold text-[#E8ECF1] tabular-nums group-hover:text-red-400 transition-colors">115</div>
            <div className="text-xs font-bold text-red-300 mt-1">BASARNAS</div>
            <div className="text-[10px] text-[#8B95A7] mt-0.5">Pencarian & SAR</div>
          </a>

          <a
            href="tel:117"
            className="group p-4 rounded-xl bg-[#140E14] border border-red-500/30 hover:border-red-500 hover:bg-red-950/40 transition-all text-center shadow-lg"
          >
            <div className="text-3xl font-extrabold text-[#E8ECF1] tabular-nums group-hover:text-red-400 transition-colors">117</div>
            <div className="text-xs font-bold text-red-300 mt-1">BNPB</div>
            <div className="text-[10px] text-[#8B95A7] mt-0.5">Posko Bencana</div>
          </a>

          <a
            href="tel:113"
            className="group p-4 rounded-xl bg-[#140E14] border border-red-500/30 hover:border-red-500 hover:bg-red-950/40 transition-all text-center shadow-lg"
          >
            <div className="text-3xl font-extrabold text-[#E8ECF1] tabular-nums group-hover:text-red-400 transition-colors">113</div>
            <div className="text-xs font-bold text-red-300 mt-1">Damkar</div>
            <div className="text-[10px] text-[#8B95A7] mt-0.5">Pemadam Kebakaran</div>
          </a>

          <a
            href="tel:119"
            className="group p-4 rounded-xl bg-[#140E14] border border-red-500/30 hover:border-red-500 hover:bg-red-950/40 transition-all text-center shadow-lg"
          >
            <div className="text-3xl font-extrabold text-[#E8ECF1] tabular-nums group-hover:text-red-400 transition-colors">119</div>
            <div className="text-xs font-bold text-red-300 mt-1">Ambulans / PSC</div>
            <div className="text-[10px] text-[#8B95A7] mt-0.5">Medis Darurat</div>
          </a>

          <a
            href="tel:110"
            className="group p-4 rounded-xl bg-[#140E14] border border-red-500/30 hover:border-red-500 hover:bg-red-950/40 transition-all text-center shadow-lg"
          >
            <div className="text-3xl font-extrabold text-[#E8ECF1] tabular-nums group-hover:text-red-400 transition-colors">110</div>
            <div className="text-xs font-bold text-red-300 mt-1">Polisi</div>
            <div className="text-[10px] text-[#8B95A7] mt-0.5">Keamanan Publik</div>
          </a>
        </div>
      </section>

      {/* Emergency Preparedness Kit (Tas Siaga Bencana 72 Jam) */}
      <section className="mb-14 p-6 sm:p-8 rounded-2xl bg-[#0D1117] border border-white/[0.08] shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <Package className="h-5 w-5 text-amber-400" />
          <h2 className="text-xl font-bold text-[#E8ECF1]">
            Panduan Tas Siaga Bencana (TSB 72 Jam)
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[#94A3B8] mb-6 leading-relaxed">
          Siapkan tas ransel tahan air di dekat pintu keluar rumah yang berisi perlengkapan bertahan hidup mandiri minimal untuk 3 hari pertama (72 jam) sebelum bantuan logistik tiba.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#141B26] border border-white/[0.06]">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300 mb-2.5">
              1. Dokumen & Finansial
            </h3>
            <ul className="text-xs text-[#CBD5E1] space-y-1.5 leading-relaxed">
              <li>• Surat nikah / Akta lahir</li>
              <li>• KTP / KK / Paspor</li>
              <li>• Sertifikat tanah / ijazah</li>
              <li>• Uang tunai pecahan kecil</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-[#141B26] border border-white/[0.06]">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300 mb-2.5">
              2. Pangan & Nutrisi
            </h3>
            <ul className="text-xs text-[#CBD5E1] space-y-1.5 leading-relaxed">
              <li>• Air mineral (minimal 3 liter)</li>
              <li>• Biskuit kalori tinggi / kurma</li>
              <li>• Makanan kaleng siap santap</li>
              <li>• Sendok & pembuka kaleng</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-[#141B26] border border-white/[0.06]">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300 mb-2.5">
              3. Kesehatan & Sanitasi
            </h3>
            <ul className="text-xs text-[#CBD5E1] space-y-1.5 leading-relaxed">
              <li>• Obat resep harian pribadi</li>
              <li>• Kotak P3K standar & kasa</li>
              <li>• Masker N95 / medis</li>
              <li>• Hand sanitizer & tisu basah</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-[#141B26] border border-white/[0.06]">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300 mb-2.5">
              4. Alat Bertahan Hidup
            </h3>
            <ul className="text-xs text-[#CBD5E1] space-y-1.5 leading-relaxed">
              <li>• Senter LED & baterai cadang</li>
              <li>• Peluit nyaring (minta tolong)</li>
              <li>• Power bank terisi penuh</li>
              <li>• Pakaian ganti & jas hujan</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Detailed Guides per Disaster Category */}
      <section className="space-y-10 mb-16">
        <div className="border-b border-white/[0.06] pb-4">
          <h2 className="text-2xl font-bold text-[#E8ECF1]">
            Prosedur Evakuasi Khusus Berdasarkan Jenis Bencana
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            Instruksi keselamatan 3 fase dari para ahli tanggap darurat nasional.
          </p>
        </div>

        {guides.map((guide) => (
          <article
            key={guide.id}
            id={guide.id}
            className="p-6 sm:p-8 rounded-2xl bg-[#0D1117] border border-white/[0.08] shadow-xl"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.06] mb-6">
              <div className="flex items-start gap-4">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border mt-1"
                  style={{
                    backgroundColor: `${guide.color}15`,
                    borderColor: `${guide.color}35`,
                  }}
                >
                  <DisasterIcon type={guide.disasterType} size={24} color={guide.color} />
                </div>
                <div>
                  <span
                    className="text-xs font-mono font-bold uppercase tracking-wider"
                    style={{ color: guide.color }}
                  >
                    {guide.subtitle}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#E8ECF1] mt-1">
                    {guide.title}
                  </h3>
                  <p className="text-xs text-[#94A3B8] mt-1">{guide.tagline}</p>
                </div>
              </div>

              <Link
                href={`/disasters/${guide.disasterType}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15] text-xs font-semibold text-[#E8ECF1] transition-all self-start sm:self-auto"
              >
                <span>Lihat Peta Kejadian</span>
                <ChevronRight className="h-4 w-4 text-[#8B95A7]" />
              </Link>
            </div>

            {/* During Action (Tindakan Cepat Golden Time) */}
            <div className="mb-6">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#E8ECF1] mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-400" />
                <span>Langkah Penyelamatan Saat Terjadi (Golden Time)</span>
              </h4>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {guide.duringAction.map((step) => (
                  <div
                    key={step.step}
                    className="p-4 rounded-xl bg-[#141B26] border border-white/[0.05]"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/20 text-red-400 text-xs font-mono font-bold mb-2">
                      {step.step}
                    </div>
                    <div className="text-xs font-bold text-[#E8ECF1]">{step.title}</div>
                    <p className="text-[11px] text-[#94A3B8] mt-1 leading-relaxed">
                      {step.instruction}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Dos and Don'ts */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
                <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 mb-2.5 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Yang Dianjurkan (Harus Dilakukan)</span>
                </h5>
                <ul className="space-y-1.5 text-xs text-[#CBD5E1]">
                  {guide.dos.map((d, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold shrink-0">✓</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30">
                <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-red-400 mb-2.5 flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>Yang Dilarang (Hindari Risiko Bahaya)</span>
                </h5>
                <ul className="space-y-1.5 text-xs text-[#CBD5E1]">
                  {guide.donts.map((d, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-red-400 font-bold shrink-0">✕</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
