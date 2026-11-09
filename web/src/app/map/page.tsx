import React from 'react';
import type { Metadata } from 'next';
import { getAggregatedDisasters } from '@/lib/disasters/aggregator';
import { MapWrapper } from '@/components/map/map-wrapper';
import { SITE_CONFIG, SITE_URL } from '@/config/site';
import { ShieldAlert, ArrowRight } from 'lucide-react';
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
    <div className="flex w-full flex-col bg-bg">
      {/* Interactive Map Section — tinggi = layar dikurangi navbar (52px) */}
      <div className="relative h-[calc(100svh-var(--navbar-height))] w-full overflow-hidden bg-bg sm:h-[calc(100dvh-var(--navbar-height))]">
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
      <section className="mx-auto w-full max-w-6xl border-t border-line px-gutter py-section sm:px-6 lg:px-8">
        <div className="mb-stack max-w-3xl">
          <h2 className="text-title text-fg-1 md:text-title-lg">Cara <span className="serif-accent text-accent">membaca</span> Peta Bencana Indonesia</h2>
          <p className="mt-2 max-w-[65ch] text-body text-fg-2">
            Peta ini mengumpulkan laporan resmi dari BMKG, BNPB, dan PVMBG ke dalam satu tampilan. Anda bisa melihat lokasi kejadian bencana yang sedang berlangsung, wilayah yang berisiko, serta peringatan cuaca di sekitar Anda.
          </p>
        </div>

        {/* Tiga kolom tetap, bobot berbeda: "membaca penanda" adalah informasi utama */}
        <div className="grid gap-stack md:grid-cols-[1fr_1.35fr_1fr] md:gap-8">
          {/* Card 1: Multi-Kategori */}
          <div className="border-t border-line pt-4">
            <h3 className="text-heading text-fg-1">Semua Jenis Bencana Terpantau</h3>
            <p className="mt-1.5 text-small text-fg-2">
              Mulai dari gempa bumi terkini BMKG, lokasi genangan banjir, tanah longsor, titik api kebakaran hutan (karhutla), cuaca ekstrem, peringatan tsunami, hingga status gunung api aktif dan abu vulkanik.
            </p>
          </div>

          {/* Card 2: Perbedaan Kejadian vs Risiko — item utama */}
          <div className="rounded-card border border-line border-l-4 border-l-accent bg-surface p-gutter">
            <h3 className="text-heading text-fg-1">Kejadian Nyata vs Wilayah Berisiko</h3>
            <p className="mt-1.5 text-body text-fg-2">
              Penanda merah berisi penuh dengan cincin menandai <strong className="font-semibold text-fg-1">kejadian berstatus kritis</strong>. Penanda lain bergaris tepi, dengan ikon yang menunjukkan jenis bencana. Garis atau arsiran warna menunjukkan <strong className="font-semibold text-fg-1">wilayah potensi rawan bencana</strong> agar warga sekitar tetap waspada.
            </p>
            {/* Legenda penanda: bentuk + label, tidak hanya warna */}
            <ul aria-label="Legenda peta" className="mt-row grid grid-cols-1 gap-y-cell gap-x-gutter text-small text-fg-2 sm:grid-cols-2">
              <li className="flex items-center gap-cell">
                <span className="h-4 w-4 shrink-0 rounded-full bg-sev-critical ring-2 ring-sev-critical ring-offset-2 ring-offset-surface" aria-hidden="true" />
                Kejadian berstatus kritis
              </li>
              <li className="flex items-center gap-cell">
                <span className="h-4 w-4 shrink-0 rounded-full border-2 border-fg-2 bg-surface" aria-hidden="true" />
                Kejadian lain (ikon = jenis)
              </li>
              <li className="flex items-center gap-cell">
                <span className="h-4 w-4 shrink-0 rounded-full border-2 border-sev-tsunami bg-surface" aria-hidden="true" />
                Tsunami dan bahaya pesisir
              </li>
              <li className="flex items-center gap-cell">
                <span className="h-4 w-5 shrink-0 rounded-badge border border-fg-1 bg-sev-ash/45" aria-hidden="true" />
                Sebaran abu vulkanik
              </li>
              <li className="flex items-center gap-cell">
                <span className="h-4 w-5 shrink-0 rounded-badge border-2 border-dashed border-fg-3" aria-hidden="true" />
                Wilayah rawan bencana
              </li>
            </ul>
          </div>

          {/* Card 3: Sumber & Transparansi */}
          <div className="border-t border-line pt-4">
            <h3 className="text-heading text-fg-1">Langsung dari Sumber Resmi</h3>
            <p className="mt-1.5 text-small text-fg-2">
              Data terhubung otomatis dengan <strong className="font-semibold text-fg-1">BMKG</strong> (gempa &amp; cuaca), <strong className="font-semibold text-fg-1">BNPB</strong> (bencana hidrometeorologi), <strong className="font-semibold text-fg-1">PVMBG</strong> (gunung api), dan <strong className="font-semibold text-fg-1">VAAC</strong> (abu vulkanik penerbangan).
            </p>
          </div>
        </div>

        {/* Disclaimer Alert */}
        <div className="mt-stack flex items-start gap-3 rounded-card border border-line border-l-4 border-l-sev-warning bg-surface p-gutter">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-sev-warning" aria-hidden="true" />
          <div className="space-y-1 text-small text-fg-2">
            <p className="font-semibold text-fg-1">Penting untuk Diketahui:</p>
            <p className="max-w-[75ch]">
              Peta ini bertujuan membantu masyarakat memantau kondisi lingkungan secara cepat dan mudah. Jika terjadi kondisi darurat atau instruksi evakuasi, selalu ikuti arahan resmi dari <strong className="font-semibold text-fg-1">BPBD, SAR, aparat desa setempat, dan BMKG/PVMBG</strong>.
            </p>
          </div>
        </div>

        {/* Category Quick Links */}
        <nav aria-labelledby="map-per-jenis" className="mt-stack border-t border-line pt-stack">
          <h2 id="map-per-jenis" className="text-heading text-fg-1">
            Peta per jenis bencana
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {[
              { href: '/disasters/earthquake', label: 'Peta Gempa Bumi' },
              { href: '/disasters/flood', label: 'Peta Banjir' },
              { href: '/disasters/volcano', label: 'Aktivitas Gunung Api' },
              { href: '/disasters/volcanic-ash', label: 'Sebaran Abu Vulkanik' },
              { href: '/disasters/landslide', label: 'Tanah Longsor' },
              { href: '/disasters/forest-fire', label: 'Kebakaran Hutan & Lahan' },
              { href: '/disasters/extreme-weather', label: 'Cuaca Ekstrem' },
              { href: '/disasters/tsunami', label: 'Peringatan Dini Tsunami' },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="flex min-h-tap items-center rounded-control border border-line-strong px-3 text-small text-fg-1 transition-colors duration-120 hover:border-accent hover:text-accent md:min-h-10"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/safety-guide"
                className="flex min-h-tap items-center gap-1.5 rounded-control bg-accent px-3 text-small font-semibold text-fg-inverse transition-colors duration-120 hover:bg-accent-hover md:min-h-10"
              >
                Panduan Evakuasi &amp; Keselamatan
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </li>
          </ul>
        </nav>
      </section>
    </div>
  );
}
