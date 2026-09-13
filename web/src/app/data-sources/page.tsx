import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Database, Map, ExternalLink, Radio, Wind, Server, Lock } from 'lucide-react';
import { SITE_URL } from '@/config/site';

export const metadata: Metadata = {
  title: 'Sumber Data Resmi Kebencanaan | Disaster Radar Indonesia',
  description:
    'Pelajari sumber data resmi yang digunakan oleh Disaster Radar Indonesia, termasuk BMKG, BNPB, PVMBG / MAGMA Indonesia, Darwin VAAC, dan OpenStreetMap.',
  alternates: {
    canonical: `${SITE_URL}/data-sources`,
  },
  openGraph: {
    title: 'Sumber Data Resmi Kebencanaan | Disaster Radar Indonesia',
    description:
      'Pelajari sumber data resmi yang digunakan oleh Disaster Radar Indonesia, termasuk BMKG, BNPB, PVMBG / MAGMA Indonesia, Darwin VAAC, dan OpenStreetMap.',
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
      color: '#EF4444',
      badgeBorder: 'border-red-500/30',
      badgeBg: 'bg-red-950/40',
      icon: Radio,
      url: 'https://data.bmkg.go.id/',
      urlLabel: 'Portal Data BMKG',
      description:
        'BMKG menyediakan data telemetri kegempaan otomatis real-time (M≥5.0, gempa dirasakan MMI, katalog seismik 60+ kejadian terakhir) serta sistem peringatan dini tsunami nasional (InaTEWS).',
      feeds: ['AutoGempa JSON API', 'Gempa Dirasakan MMI', 'Peringatan Dini Cuaca', 'InaTEWS Tsunami'],
      interval: 'Setiap 2 - 3 Menit',
    },
    {
      id: 'bnpb',
      name: 'BNPB (Badan Nasional Penanggulangan Bencana) & InaRISK',
      category: 'Hidrometeorologi & Peta Kerentanan',
      color: '#3B82F6',
      badgeBorder: 'border-blue-500/30',
      badgeBg: 'bg-blue-950/40',
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
      color: '#F97316',
      badgeBorder: 'border-orange-500/30',
      badgeBg: 'bg-orange-950/40',
      icon: Database,
      url: 'https://magma.esdm.go.id/',
      urlLabel: 'Portal MAGMA ESDM',
      description:
        'PVMBG bertanggung jawab atas penetapan 4 tingkat status resmi aktivitas gunung api (Level I Normal, Level II Waspada, Level III Siaga, Level IV Awas) untuk 127 gunung api aktif di Indonesia.',
      feeds: ['Tingkat Aktivitas MAGMA', 'Laporan Pengamatan Visual', 'Rekomendasi Zona Bahaya Kawah'],
      interval: 'Real-time Perubahan Status',
    },
    {
      id: 'vaac',
      name: 'Darwin VAAC (Bureau of Meteorology Australia)',
      category: 'Sebaran Abu Vulkanik Aviasi (ICAO)',
      color: '#FB923C',
      badgeBorder: 'border-amber-500/30',
      badgeBg: 'bg-amber-950/40',
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
      color: '#10B981',
      badgeBorder: 'border-emerald-500/30',
      badgeBg: 'bg-emerald-950/40',
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
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 bg-[#080C14] text-[#E8ECF1]">
      <Breadcrumbs items={[{ name: 'Sumber Data', url: '/data-sources' }]} />

      {/* Hero Header */}
      <div className="relative mt-4 mb-10 rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#101420] via-[#0D1017] to-[#070A10] p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-blue-600/10 blur-[100px]" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-[#141B26]/80 px-3 py-1 text-[11px] font-mono font-semibold tracking-wider text-blue-400 uppercase mb-3 backdrop-blur-md">
            <Server className="h-3 w-3" />
            <span>TATA KELOLA & INTEGRITAS DATA PUBLIK</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#E8ECF1] leading-[1.1]">
            Sumber Data Resmi
          </h1>

          <p className="mt-3 text-sm sm:text-base text-[#94A3B8] leading-relaxed">
            Disaster Radar Indonesia memetakan dan mengagregasi data buletin resmi dari lembaga pemerintah dan badan meteorologi terverifikasi tanpa mengubah substansi atau parameter informasi aslinya.
          </p>
        </div>
      </div>

      {/* Data Source Cards */}
      <div className="space-y-6">
        {sources.map((src) => {
          const IconComponent = src.icon;
          return (
            <section
              key={src.id}
              className="p-6 sm:p-7 rounded-2xl bg-[#0D1117] border border-white/[0.08] shadow-xl transition-all hover:border-white/[0.16]"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-start gap-3.5">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border mt-0.5"
                    style={{
                      backgroundColor: `${src.color}15`,
                      borderColor: `${src.color}35`,
                      color: src.color,
                    }}
                  >
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider block" style={{ color: src.color }}>
                      {src.category}
                    </span>
                    <h2 className="text-base sm:text-lg font-bold text-[#E8ECF1] mt-0.5">
                      {src.name}
                    </h2>
                  </div>
                </div>

                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.08] text-xs font-mono text-[#94A3B8] hover:text-white transition-all self-start sm:self-auto shrink-0"
                >
                  <span>{src.urlLabel}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                {src.description}
              </p>

              <div className="mt-5 pt-4 border-t border-white/[0.05] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                <div className="flex flex-wrap items-center gap-1.5">
                  {src.feeds.map((feed, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-[#141B26] border border-white/[0.05] text-[#CBD5E1] text-[11px]"
                    >
                      {feed}
                    </span>
                  ))}
                </div>
                <span className="text-[#64748B] text-[11px] shrink-0">
                  Sinkronisasi: {src.interval}
                </span>
              </div>
            </section>
          );
        })}

        {/* Data Integrity Commitment Card */}
        <section className="p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-[#0E1524] to-[#0A0F1A] border border-cyan-500/20 shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-cyan-400">
            <Lock className="h-5 w-5" />
            <h2 className="text-base sm:text-lg font-bold text-[#E8ECF1]">
              Komitmen Integritas & Keaslian Data
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
            Sistem kami tidak pernah memodifikasi skala magnitudo gempa, batas koordinat poligon abu, status level gunung api, atau laporan genangan air. Seluruh algoritma bertindak murni sebagai pengagregasi spasial deterministik guna menyajikan gambaran kebencanaan yang objektif bagi masyarakat.
          </p>
        </section>
      </div>
    </div>
  );
}
