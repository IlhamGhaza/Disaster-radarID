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
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Panduan Keselamatan & Evakuasi Bencana Alam — Gempa, Banjir, & Gunung Meletus | Disaster Radar',
  description:
    'Panduan praktis cara menghadapi gempa bumi, banjir, letusan gunung api, tsunami, dan kebakaran hutan di Indonesia. Pahami langkah penyelamatan diri dan nomor darurat bebas pulsa 112.',
  keywords: [
    'cara menghadapi gempa bumi',
    'apa yang harus dilakukan saat gempa',
    'cara menyelamatkan diri saat banjir',
    'panduan evakuasi gunung meletus',
    'nomor darurat bencana 112',
    'tas siaga bencana bnpb',
    'mitigasi bencana indonesia',
  ],
  alternates: {
    canonical: `${SITE_URL}/safety-guide`,
  },
  openGraph: {
    title: 'Panduan Keselamatan & Evakuasi Bencana Alam — Gempa, Banjir, & Gunung Meletus | Disaster Radar',
    description:
      'Panduan praktis cara menghadapi gempa bumi, banjir, letusan gunung api, tsunami, dan kebakaran hutan di Indonesia. Pahami langkah penyelamatan diri dan nomor darurat bebas pulsa 112.',
    url: `${SITE_URL}/safety-guide`,
    siteName: 'Disaster Radar Indonesia',
    type: 'article',
  },
};

const HOTLINE_SECONDARY = [
  { tel: '115', name: 'BASARNAS', note: 'Pencarian & SAR' },
  { tel: '117', name: 'BNPB', note: 'Posko Bencana' },
  { tel: '113', name: 'Damkar', note: 'Pemadam Kebakaran' },
  { tel: '119', name: 'Ambulans / PSC', note: 'Medis Darurat' },
  { tel: '110', name: 'Polisi', note: 'Keamanan Publik' },
];

const hotlineClass =
  'group flex min-h-tap-lg items-center gap-row rounded-card border border-line bg-surface px-gutter py-row transition-colors duration-120 hover:border-accent';

export default function SafetyGuidePage() {
  const guides = Object.values(DISASTER_SAFETY_GUIDES);

  return (
    <div className="mx-auto max-w-7xl px-gutter py-stack sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ name: 'Panduan Keselamatan & Evakuasi', url: '/safety-guide' }]} />

      {/* Hero Header */}
      <div className="mb-section pt-4">
        <div className="max-w-3xl">
          <h1 className="text-display text-fg-1 text-balance md:text-display-lg">
            Panduan <span className="serif-accent text-accent">keselamatan</span> & Evakuasi Bencana
          </h1>

          <p className="mt-row text-body text-fg-2">
            Langkah cepat dan praktis untuk menyelamatkan diri dan keluarga saat terjadi gempa bumi, banjir, letusan gunung api, atau cuaca ekstrem di sekitar Anda. Berdasarkan pedoman resmi BNPB dan BPBD.
          </p>
        </div>
      </div>

      {/* Nomor telepon darurat */}
      <section className="mb-section" aria-labelledby="hotline-heading">
        <div className="mb-cell flex items-center gap-cell">
          <PhoneCall className="h-5 w-5 text-fg-2" aria-hidden="true" />
          <h2 id="hotline-heading" className="text-title text-fg-1 md:text-title-lg">
            Nomor Telepon Darurat Nasional Indonesia
          </h2>
        </div>
        <p className="mb-gutter max-w-3xl text-body text-fg-2">
          Simpan nomor-nomor darurat berikut di ponsel Anda. Seluruh panggilan layanan darurat 112 dapat dihubungi bebas pulsa dari seluruh operator di Indonesia.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(5,1fr)]">
          {/* 112 = nomor utama: isian accent, angka paling besar */}
          <a
            href="tel:112"
            className="flex min-h-tap-lg items-center gap-row rounded-card bg-accent px-gutter py-row text-fg-inverse transition-colors duration-120 hover:bg-accent-hover sm:col-span-2 lg:col-span-1 lg:flex-col lg:items-start lg:justify-center lg:gap-1"
          >
            <span className="font-mono text-num-xl font-bold tabular-nums">112</span>
            <span>
              <span className="block text-body font-bold">Panggilan Darurat</span>
              <span className="block text-small">Bebas Pulsa Terpadu</span>
            </span>
          </a>

          {HOTLINE_SECONDARY.map((h) => (
            <a key={h.tel} href={`tel:${h.tel}`} className={hotlineClass}>
              <span className="font-mono text-num-lg font-bold text-fg-1 tabular-nums group-hover:text-accent">{h.tel}</span>
              <span>
                <span className="block text-small font-semibold text-fg-1">{h.name}</span>
                <span className="block text-small text-fg-3">{h.note}</span>
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Emergency Preparedness Kit (Tas Siaga Bencana 72 Jam) */}
      <section className="mb-section border-t border-line pt-stack">
        <div className="mb-cell flex items-center gap-cell">
          <Package className="h-5 w-5 text-fg-2" aria-hidden="true" />
          <h2 className="text-title text-fg-1 md:text-title-lg">
            Panduan Tas Siaga Bencana (TSB 72 Jam)
          </h2>
        </div>
        <p className="mb-stack max-w-3xl text-body text-fg-2">
          Siapkan tas ransel tahan air di dekat pintu keluar rumah yang berisi perlengkapan bertahan hidup mandiri minimal untuk 3 hari pertama (72 jam) sebelum bantuan logistik tiba.
        </p>

        <div className="grid grid-cols-1 gap-x-stack gap-y-gutter sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-cell text-heading text-fg-1">
              1. Dokumen & Finansial
            </h3>
            <ul className="list-disc space-y-1 pl-5 text-body text-fg-2 marker:text-fg-3">
              <li>Surat nikah / Akta lahir</li>
              <li>KTP / KK / Paspor</li>
              <li>Sertifikat tanah / ijazah</li>
              <li>Uang tunai pecahan kecil</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-cell text-heading text-fg-1">
              2. Pangan & Nutrisi
            </h3>
            <ul className="list-disc space-y-1 pl-5 text-body text-fg-2 marker:text-fg-3">
              <li>Air mineral (minimal 3 liter)</li>
              <li>Biskuit kalori tinggi / kurma</li>
              <li>Makanan kaleng siap santap</li>
              <li>Sendok & pembuka kaleng</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-cell text-heading text-fg-1">
              3. Kesehatan & Sanitasi
            </h3>
            <ul className="list-disc space-y-1 pl-5 text-body text-fg-2 marker:text-fg-3">
              <li>Obat resep harian pribadi</li>
              <li>Kotak P3K standar & kasa</li>
              <li>Masker N95 / medis</li>
              <li>Hand sanitizer & tisu basah</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-cell text-heading text-fg-1">
              4. Alat Bertahan Hidup
            </h3>
            <ul className="list-disc space-y-1 pl-5 text-body text-fg-2 marker:text-fg-3">
              <li>Senter LED & baterai cadang</li>
              <li>Peluit nyaring (minta tolong)</li>
              <li>Power bank terisi penuh</li>
              <li>Pakaian ganti & jas hujan</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Detailed Guides per Disaster Category */}
      <section className="space-y-section">
        <div className="border-t border-line pt-stack">
          <h2 className="text-title text-fg-1 md:text-title-lg">
            Prosedur Evakuasi Khusus Berdasarkan Jenis Bencana
          </h2>
          <p className="mt-1 text-body text-fg-2">
            Langkah saat kejadian, serta yang dianjurkan dan dilarang, untuk tiap jenis bencana.
          </p>
        </div>

        {guides.map((guide) => (
          <article key={guide.id} id={guide.id} className="scroll-mt-20">
            <div className="mb-gutter flex flex-col justify-between gap-gutter border-b border-line pb-gutter sm:flex-row sm:items-end">
              <div className="flex items-start gap-row">
                <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-control border border-line">
                  <DisasterIcon type={guide.disasterType} size={24} color="var(--fg-1)" />
                </div>
                <div>
                  <span className="block text-small text-fg-3">
                    {guide.subtitle}
                  </span>
                  <h3 className="mt-0.5 text-title text-fg-1">
                    {guide.title}
                  </h3>
                  <p className="mt-0.5 text-small text-fg-3">{guide.tagline}</p>
                </div>
              </div>

              <Link
                href={`/disasters/${guide.disasterType}`}
                className="inline-flex min-h-tap shrink-0 items-center gap-1.5 self-start text-small font-semibold text-accent transition-colors duration-120 hover:text-accent-hover sm:self-auto"
              >
                <span>Lihat Peta Kejadian</span>
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            {/* Yang dilakukan saat kejadian */}
            <div className="mb-stack">
              <h4 className="mb-row flex items-center gap-cell text-heading text-fg-1">
                <Zap className="h-4 w-4 text-sev-warning" aria-hidden="true" />
                <span>Yang dilakukan saat kejadian</span>
              </h4>
              <ol className="grid grid-cols-1 gap-x-stack gap-y-gutter sm:grid-cols-2 lg:grid-cols-4">
                {guide.duringAction.map((step) => (
                  <li key={step.step} className="border-t-2 border-line-strong pt-row">
                    <div className="font-mono text-num font-bold text-fg-1 tabular-nums">
                      {step.step}
                    </div>
                    <div className="mt-1 text-body font-bold text-fg-1">{step.title}</div>
                    <p className="mt-1 text-small text-fg-2">
                      {step.instruction}
                    </p>
                  </li>
                ))}
              </ol>
            </div>

            {/* Dos and Don'ts */}
            <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2">
              <div className="border-l-4 border-sev-normal pl-gutter">
                <h5 className="mb-cell flex items-center gap-1.5 text-body font-bold text-fg-1">
                  <CheckCircle2 className="h-4 w-4 text-sev-normal" aria-hidden="true" />
                  <span>Yang Dianjurkan (Harus Dilakukan)</span>
                </h5>
                <ul className="space-y-1.5 text-body text-fg-2">
                  {guide.dos.map((d, idx) => (
                    <li key={idx} className="flex items-start gap-cell">
                      <span className="shrink-0 font-bold text-sev-normal" aria-hidden="true">✓</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-l-4 border-sev-critical pl-gutter">
                <h5 className="mb-cell flex items-center gap-1.5 text-body font-bold text-fg-1">
                  <AlertTriangle className="h-4 w-4 text-sev-critical" aria-hidden="true" />
                  <span>Yang Dilarang (Hindari Risiko Bahaya)</span>
                </h5>
                <ul className="space-y-1.5 text-body text-fg-2">
                  {guide.donts.map((d, idx) => (
                    <li key={idx} className="flex items-start gap-cell">
                      <span className="shrink-0 font-bold text-sev-critical" aria-hidden="true">✕</span>
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
