import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { DISASTER_SAFETY_GUIDES } from '@/lib/safety-guides';
import { DISASTER_CATEGORIES } from '@/lib/disasters/aggregator';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { SITE_CONFIG, SITE_URL } from '@/config/site';
import { DisasterIcon } from '@/components/icons/disaster-icons';
import {
  BookOpen,
  PhoneCall,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  ShieldAlert,
  ArrowRight,
  ChevronRight,
  Package,
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ name: 'Panduan Keselamatan & Evakuasi', url: '/safety-guide' }]} />

      {/* Hero Header */}
      <div className="max-w-3xl mb-12">
        <span className="text-xs font-bold uppercase tracking-wider text-[#EF4444]">
          Kesiapsiagaan & Tanggap Darurat
        </span>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mt-1">
          Panduan Keselamatan & Evakuasi Bencana
        </h1>
        <p className="mt-4 text-sm sm:text-base text-[#8B95A7] leading-relaxed">
          Ketahui langkah cepat penyelamatan mandiri saat Anda berada di dalam atau dekat zona bahaya bencana alam di Indonesia. Pahami tindakan sebelum, saat kejadian (Golden Time), dan sesudah bencana.
        </p>
      </div>

      {/* National Emergency Numbers Bar */}
      <section className="mb-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-red-950/70 via-[#151C28] to-orange-950/70 border border-red-500/30 shadow-2xl">
        <div className="flex items-center gap-2 mb-4">
          <PhoneCall className="h-5 w-5 text-red-400" />
          <h2 className="text-lg font-black text-white">Nomor Telepon Darurat Nasional Indonesia</h2>
        </div>
        <p className="text-xs text-[#CBD5E1] mb-6 leading-relaxed">
          Simpan nomor-nomor darurat berikut di ponsel Anda. Seluruh panggilan layanan darurat 112 dapat dihubungi tanpa pulsa (bebas pulsa) dari operator mana pun di Indonesia.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <a
            href="tel:112"
            className="p-3.5 rounded-2xl bg-red-900/30 border border-red-500/40 hover:bg-red-800/40 transition text-center"
          >
            <div className="text-2xl font-black text-white">112</div>
            <div className="text-xs font-bold text-red-300 mt-0.5">Panggilan Darurat</div>
            <div className="text-[10px] text-[#94A3B8]">Layanan Terpadu</div>
          </a>

          <a
            href="tel:115"
            className="p-3.5 rounded-2xl bg-red-900/30 border border-red-500/40 hover:bg-red-800/40 transition text-center"
          >
            <div className="text-2xl font-black text-white">115</div>
            <div className="text-xs font-bold text-red-300 mt-0.5">Basarnas</div>
            <div className="text-[10px] text-[#94A3B8]">Pencarian & SAR</div>
          </a>

          <a
            href="tel:117"
            className="p-3.5 rounded-2xl bg-red-900/30 border border-red-500/40 hover:bg-red-800/40 transition text-center"
          >
            <div className="text-2xl font-black text-white">117</div>
            <div className="text-xs font-bold text-red-300 mt-0.5">BNPB</div>
            <div className="text-[10px] text-[#94A3B8]">Posko Bencana</div>
          </a>

          <a
            href="tel:113"
            className="p-3.5 rounded-2xl bg-red-900/30 border border-red-500/40 hover:bg-red-800/40 transition text-center"
          >
            <div className="text-2xl font-black text-white">113</div>
            <div className="text-xs font-bold text-red-300 mt-0.5">Damkar</div>
            <div className="text-[10px] text-[#94A3B8]">Pemadam Kebakaran</div>
          </a>

          <a
            href="tel:119"
            className="p-3.5 rounded-2xl bg-red-900/30 border border-red-500/40 hover:bg-red-800/40 transition text-center"
          >
            <div className="text-2xl font-black text-white">119</div>
            <div className="text-xs font-bold text-red-300 mt-0.5">Ambulans / PSC</div>
            <div className="text-[10px] text-[#94A3B8]">Medis Darurat</div>
          </a>

          <a
            href="tel:110"
            className="p-3.5 rounded-2xl bg-red-900/30 border border-red-500/40 hover:bg-red-800/40 transition text-center"
          >
            <div className="text-2xl font-black text-white">110</div>
            <div className="text-xs font-bold text-red-300 mt-0.5">Polisi</div>
            <div className="text-[10px] text-[#94A3B8]">Pengamanan</div>
          </a>
        </div>
      </section>

      {/* Emergency Preparedness Kit (Tas Siaga Bencana) */}
      <section className="mb-14 p-6 sm:p-8 rounded-3xl bg-[#111827] border border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <Package className="h-5 w-5 text-amber-400" />
          <h2 className="text-xl font-black text-white">Panduan Tas Siaga Bencana (TSB)</h2>
        </div>
        <p className="text-xs text-[#8B95A7] mb-6 leading-relaxed">
          Siapkan tas ransel tahan air di dekat pintu keluar rumah yang berisi perlengkapan bertahan hidup minimal untuk 3 hari pertama (72 jam) saat terjadi evakuasi mendadak.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
            <h3 className="text-xs font-bold text-white mb-2">1. Dokumen & Finansial</h3>
            <ul className="text-xs text-[#94A3B8] space-y-1">
              <li>• Surat nikah / Akta lahir</li>
              <li>• KTP / KK / Paspor</li>
              <li>• Sertifikat tanah / ijazah</li>
              <li>• Uang tunai pecahan kecil</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
            <h3 className="text-xs font-bold text-white mb-2">2. Pangan & Nutrisi</h3>
            <ul className="text-xs text-[#94A3B8] space-y-1">
              <li>• Air mineral (minimal 3 liter)</li>
              <li>• Biskuit kalori tinggi / kurma</li>
              <li>• Makanan kaleng siap santap</li>
              <li>• Sendok & pembuka kaleng</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
            <h3 className="text-xs font-bold text-white mb-2">3. Kesehatan & Sanitasi</h3>
            <ul className="text-xs text-[#94A3B8] space-y-1">
              <li>• Obat resep harian pribadi</li>
              <li>• Kotak P3K standar & kasa</li>
              <li>• Masker N95 / medis</li>
              <li>• Hand sanitizer & tisu basah</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
            <h3 className="text-xs font-bold text-white mb-2">4. Alat Bertahan Hidup</h3>
            <ul className="text-xs text-[#94A3B8] space-y-1">
              <li>• Senter LED & baterai cadang</li>
              <li>• Peluit nyaring (minta tolong)</li>
              <li>• Power bank terisi penuh</li>
              <li>• Pakaian ganti & jas hujan</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Detailed Guides per Disaster Category */}
      <section className="space-y-12 mb-16">
        <h2 className="text-2xl font-black text-white">
          Prosedur Evakuasi Khusus Berdasarkan Jenis Bencana
        </h2>

        {guides.map((guide) => (
          <article
            key={guide.id}
            id={guide.id}
            className="p-6 sm:p-8 rounded-3xl bg-[#111827] border border-white/10"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-white/10 mb-6">
              <div className="flex items-start gap-4">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 mt-1"
                  style={{ backgroundColor: `${guide.color}20` }}
                >
                  <DisasterIcon type={guide.disasterType} size={26} color={guide.color} />
                </div>
                <div>
                  <span
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: guide.color }}
                  >
                    {guide.subtitle}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                    {guide.title}
                  </h3>
                  <p className="text-xs text-[#8B95A7] mt-1">{guide.tagline}</p>
                </div>
              </div>
              <Link
                href={`/disasters/${guide.disasterType}`}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition self-start sm:self-auto"
              >
                <span>Lihat Peta Kejadian</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {/* During Action (Tindakan Cepat) */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                <span>Langkah Penyelamatan Saat Terjadi (Golden Time)</span>
              </h4>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {guide.duringAction.map((step) => (
                  <div
                    key={step.step}
                    className="p-4 rounded-2xl bg-[#151C28] border border-white/5"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/20 text-red-400 text-xs font-black mb-2">
                      {step.step}
                    </div>
                    <div className="text-xs font-bold text-white">{step.title}</div>
                    <p className="text-[11px] text-[#8B95A7] mt-1 leading-relaxed">
                      {step.instruction}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Dos and Don'ts */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
                <h5 className="text-xs font-bold uppercase text-emerald-400 mb-2">
                  ✓ Yang Dianjurkan
                </h5>
                <ul className="space-y-1.5 text-xs text-[#CBD5E1]">
                  {guide.dos.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-400">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/30">
                <h5 className="text-xs font-bold uppercase text-red-400 mb-2">
                  ✕ Yang Dilarang Keras
                </h5>
                <ul className="space-y-1.5 text-xs text-[#CBD5E1]">
                  {guide.donts.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-red-400">•</span>
                      <span>{item}</span>
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
