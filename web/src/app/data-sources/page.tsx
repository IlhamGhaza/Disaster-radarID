import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Database, Map, ExternalLink, Radio, Wind, Lock } from 'lucide-react';
import { SITE_URL } from '@/config/site';

export const metadata: Metadata = {
  title: 'Sumber Data Resmi Bencana Alam — BMKG, BNPB, & PVMBG | Disaster Radar',
  description:
    'Daftar sumber data resmi terpercaya yang digunakan Disaster Radar Indonesia: BMKG (gempa bumi & cuaca), BNPB (banjir & karhutla), PVMBG (gunung api), dan Darwin VAAC (abu vulkanik).',
  keywords: [
    'sumber data bmkg',
    'portal data bnpb',
    'magma esdm pvmbg',
    'darwin vaac abu vulkanik',
    'api gempa bumi bmkg',
    'inarisk bnpb',
  ],
  alternates: {
    canonical: `${SITE_URL}/data-sources`,
  },
  openGraph: {
    title: 'Sumber Data Resmi Bencana Alam — BMKG, BNPB, & PVMBG | Disaster Radar',
    description:
      'Daftar sumber data resmi terpercaya yang digunakan Disaster Radar Indonesia: BMKG (gempa bumi & cuaca), BNPB (banjir & karhutla), PVMBG (gunung api), dan Darwin VAAC (abu vulkanik).',
    url: `${SITE_URL}/data-sources`,
    siteName: 'Disaster Radar Indonesia',
    type: 'website',
  },
};

export default function DataSourcesPage() {
  const sources = [
    {
      id: 'bmkg',
      name: 'BMKG (Badan Meteorologi, Klimatologi, dan Geofisika)',
      category: 'Kegempaan, Tsunami & Meteorologi',
      icon: Radio,
      url: 'https://data.bmkg.go.id/',
      urlLabel: 'Portal Data BMKG',
      description:
        'BMKG menyediakan data kegempaan otomatis (M≥5.0, gempa dirasakan MMI, katalog seismik 60+ kejadian terakhir) serta sistem peringatan dini tsunami nasional (InaTEWS).',
      feeds: ['AutoGempa JSON API', 'Gempa Dirasakan MMI', 'Peringatan Dini Cuaca', 'InaTEWS Tsunami'],
      interval: 'Setiap 2 - 3 Menit',
    },
    {
      id: 'bnpb',
      name: 'BNPB (Badan Nasional Penanggulangan Bencana) & InaRISK',
      category: 'Hidrometeorologi & Peta Kerentanan',
      icon: Database,
      url: 'https://gis.bnpb.go.id/',
      urlLabel: 'Geoportal BNPB',
      description:
        'BNPB mengelola basis data kejadian bencana banjir, tanah longsor, karhutla, serta peta zona bahaya spasial InaRISK untuk penilaian kerentanan penduduk dan infrastruktur.',
      feeds: ['InaRISK Spatial Layers', 'Laporan Situasi Harian', 'Pusdalops BNPB Feed'],
      interval: 'Berkala & Harian',
    },
    {
      id: 'pvmbg',
      name: 'PVMBG / MAGMA Indonesia (Badan Geologi ESDM)',
      category: 'Aktivitas Gunung Api & Gerakan Tanah',
      icon: Database,
      url: 'https://magma.esdm.go.id/',
      urlLabel: 'Portal MAGMA ESDM',
      description:
        'PVMBG bertanggung jawab atas penetapan 4 tingkat status resmi aktivitas gunung api (Level I Normal, Level II Waspada, Level III Siaga, Level IV Awas) untuk 127 gunung api aktif di Indonesia.',
      feeds: ['Tingkat Aktivitas MAGMA', 'Laporan Pengamatan Visual', 'Rekomendasi Zona Bahaya Kawah'],
      interval: 'Katalog status di aplikasi, bukan feed langsung',
    },
    {
      id: 'vaac',
      name: 'Darwin VAAC (Bureau of Meteorology Australia)',
      category: 'Sebaran Abu Vulkanik Aviasi (ICAO)',
      icon: Wind,
      url: 'http://www.bom.gov.au/aviation/volcanic-ash/',
      urlLabel: 'Darwin VAAC Portal',
      description:
        'Volcanic Ash Advisory Centre (VAAC) regional Darwin di bawah otoritas ICAO menerbitkan buletin poligon sebaran abu vulkanik aktif teramati dan prakiraan pergerakan angin (+6h, +12h, +18h) untuk wilayah Indonesia.',
      feeds: ['ICAO Volcanic Ash Advisories (VAA)', 'Poligon Koordinat Batas', 'Flight Level (FL) Plume'],
      interval: 'Setiap 3 - 6 Jam / Pasca-Erupsi',
    },
    {
      id: 'osm',
      name: 'OpenStreetMap (OSM) Cartography',
      category: 'Peta Dasar Geospasial Terbuka',
      icon: Map,
      url: 'https://www.openstreetmap.org/',
      urlLabel: 'OpenStreetMap Portal',
      description:
        'Penyedia raster tiles peta dasar dunia yang bebas lisensi proprietary. Disaster Radar Indonesia menerapkan kalibrasi kontras tinggi untuk kenyamanan pemantauan malam dan pusat komando.',
      feeds: ['Standard Raster Map Tiles', 'Kontur Pesisir & Batas Wilayah'],
      interval: 'Continuous CDN',
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-gutter py-stack sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ name: 'Sumber Data', url: '/data-sources' }]} />

      {/* Hero Header */}
      <div className="mb-section pt-4">
        <div className="max-w-2xl">
          <h1 className="text-display text-fg-1 md:text-display-lg">
            Sumber Data <span className="serif-accent text-accent">resmi</span>
          </h1>

          <p className="mt-row text-body text-fg-2">
            Disaster Radar Indonesia menampilkan data langsung dari lembaga resmi pemerintah seperti BMKG, BNPB, dan PVMBG tanpa mengubah isi aslinya. Angka dan status ditampilkan apa adanya dari sumbernya.
          </p>
        </div>
      </div>

      {/* Data Source List */}
      <div className="divide-y divide-line">
        {sources.map((src) => {
          const IconComponent = src.icon;
          return (
            <section key={src.id} className="py-stack first:pt-0">
              <div className="mb-row flex flex-col justify-between gap-row sm:flex-row sm:items-start">
                <div className="flex items-start gap-row">
                  <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-control border border-line text-fg-2">
                    <IconComponent className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="block text-small text-fg-3">
                      {src.category}
                    </span>
                    <h2 className="mt-0.5 text-heading text-fg-1">
                      {src.name}
                    </h2>
                  </div>
                </div>

                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-tap shrink-0 items-center gap-1.5 self-start text-small font-semibold text-accent transition-colors duration-120 hover:text-accent-hover"
                >
                  <span>{src.urlLabel}</span>
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">(membuka tab baru)</span>
                </a>
              </div>

              <p className="text-body text-fg-2">
                {src.description}
              </p>

              <div className="mt-row flex flex-col justify-between gap-cell text-small sm:flex-row sm:items-center">
                <div className="flex flex-wrap items-center gap-1.5">
                  {src.feeds.map((feed, idx) => (
                    <span
                      key={idx}
                      className="rounded-badge border border-line px-1.5 py-0.5 text-fg-2"
                    >
                      {feed}
                    </span>
                  ))}
                </div>
                <span className="shrink-0 text-fg-3">
                  Sinkronisasi: <span className="font-semibold text-fg-1">{src.interval}</span>
                </span>
              </div>
            </section>
          );
        })}

        {/* Apa yang kami ubah dan tidak kami ubah */}
        <section className="space-y-row py-stack">
          <div className="flex items-center gap-cell">
            <Lock className="h-5 w-5 text-fg-2" aria-hidden="true" />
            <h2 className="text-title text-fg-1">
              Apa yang kami ubah dan tidak kami ubah
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-gutter text-body text-fg-2 sm:grid-cols-2">
            <div>
              <h3 className="mb-1 text-body font-semibold text-fg-1">Kami ubah</h3>
              <ul className="list-disc space-y-1 pl-5 marker:text-fg-3">
                <li>Waktu kejadian dikonversi ke WIB.</li>
                <li>Label status ditampilkan dalam bahasa Indonesia.</li>
                <li>Ketinggian abu dalam Flight Level diberi padanan kaki (ft).</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-1 text-body font-semibold text-fg-1">Tidak kami ubah</h3>
              <ul className="list-disc space-y-1 pl-5 marker:text-fg-3">
                <li>Magnitudo dan kedalaman gempa.</li>
                <li>Level aktivitas gunung api.</li>
                <li>Koordinat poligon sebaran abu.</li>
                <li>Isi laporan kejadian BNPB.</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
