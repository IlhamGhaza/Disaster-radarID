import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Database, Globe, Map, ExternalLink, Radio, ShieldAlert } from 'lucide-react';
import { SITE_CONFIG, SITE_URL } from '@/config/site';

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
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ name: 'Sumber Data', url: '/data-sources' }]} />

      <div className="max-w-2xl mb-8">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
          Sumber Data Resmi
        </h1>
        <p className="mt-3 text-sm text-[#8B95A7] leading-relaxed">
          Disaster Radar Indonesia memvisualisasikan data dan buletin resmi dari lembaga pemerintah dan badan meteorologi terverifikasi tanpa mengubah substansi informasi aslinya.
        </p>
      </div>

      <div className="space-y-6">
        {/* Source 1: BMKG */}
        <div className="p-6 rounded-2xl bg-[#111827] border border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/20 text-red-400">
                <Radio className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">
                  Kegempaan & Cuaca
                </span>
                <h2 className="text-lg font-bold text-white">BMKG (Badan Meteorologi, Klimatologi, dan Geofisika)</h2>
              </div>
            </div>

            <a
              href="https://data.bmkg.go.id/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-semibold text-red-400 hover:underline transition self-start sm:self-auto"
            >
              <span>Portal Data BMKG</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <p className="text-xs text-[#CBD5E1] leading-relaxed">
            BMKG menyediakan feed publik data kegempaan otomatis (M≥5.0, gempa dirasakan, dan katalog seismik) serta sistem peringatan dini tsunami nasional (InaTEWS).
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-[10px] text-[#8B95A7]">
            <span className="px-2 py-0.5 rounded-md bg-white/5">AutoGempa API</span>
            <span className="px-2 py-0.5 rounded-md bg-white/5">Gempa Terkini</span>
            <span className="px-2 py-0.5 rounded-md bg-white/5">Peringatan Dini Cuaca</span>
          </div>
        </div>

        {/* Source 2: BNPB */}
        <div className="p-6 rounded-2xl bg-[#111827] border border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
                <Database className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                  Hidrometeorologi & Kebencanaan
                </span>
                <h2 className="text-lg font-bold text-white">BNPB & Portal InaRISK</h2>
              </div>
            </div>

            <a
              href="https://gis.bnpb.go.id/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-semibold text-blue-400 hover:underline transition self-start sm:self-auto"
            >
              <span>Geoportal BNPB</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <p className="text-xs text-[#CBD5E1] leading-relaxed">
            Badan Nasional Penanggulangan Bencana melalui Pusdalops dan geoportal InaRISK menyajikan peta indeks risiko multi-bencana, sebaran banjir, tanah longsor, dan kejadian bencana daerah.
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-[10px] text-[#8B95A7]">
            <span className="px-2 py-0.5 rounded-md bg-white/5">InaRISK Multi-Hazard</span>
            <span className="px-2 py-0.5 rounded-md bg-white/5">Pusdalops BNPB</span>
            <span className="px-2 py-0.5 rounded-md bg-white/5">Laporan Bencana Harian</span>
          </div>
        </div>

        {/* Source 3: PVMBG / MAGMA */}
        <div className="p-6 rounded-2xl bg-[#111827] border border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/20 text-orange-400">
                <Globe className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400">
                  Vulkanologi & Gerakan Tanah
                </span>
                <h2 className="text-lg font-bold text-white">PVMBG / MAGMA Indonesia (Badan Geologi ESDM)</h2>
              </div>
            </div>

            <a
              href="https://magma.esdm.go.id/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-semibold text-orange-400 hover:underline transition self-start sm:self-auto"
            >
              <span>Portal MAGMA ESDM</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <p className="text-xs text-[#CBD5E1] leading-relaxed">
            Pusat Vulkanologi dan Mitigasi Bencana Geologi (PVMBG) menetapkan 4 tingkat aktivitas gunung api (Level I Normal, Level II Waspada, Level III Siaga, Level IV Awas) dan rekomendasi zona bahaya KRB.
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-[10px] text-[#8B95A7]">
            <span className="px-2 py-0.5 rounded-md bg-white/5">127+ Gunung Api Aktif</span>
            <span className="px-2 py-0.5 rounded-md bg-white/5">Rekomendasi KRB</span>
            <span className="px-2 py-0.5 rounded-md bg-white/5">Status Vulkanik</span>
          </div>
        </div>

        {/* Source 4: Darwin VAAC */}
        <div className="p-6 rounded-2xl bg-[#111827] border border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
                <Radio className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  Aviasi & Abu Vulkanik
                </span>
                <h2 className="text-lg font-bold text-white">Darwin VAAC (Bureau of Meteorology Australia)</h2>
              </div>
            </div>

            <a
              href="https://www.bom.gov.au/products/Volc_ash_recent.shtml"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-semibold text-amber-400 hover:underline transition self-start sm:self-auto"
            >
              <span>Feed Resmi BoM</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <p className="text-xs text-[#CBD5E1] leading-relaxed">
            Volcanic Ash Advisory Centre (VAAC) Darwin di bawah koordinasi ICAO menerbitkan buletin sebaran abu vulkanik di ruang udara Asia Tenggara dan Indonesia berdasarkan citra satelit cuaca Himawari.
          </p>
        </div>

        {/* Source 5: OpenStreetMap */}
        <div className="p-6 rounded-2xl bg-[#111827] border border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                <Map className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Mesin Peta Geospasial
                </span>
                <h2 className="text-lg font-bold text-white">OpenStreetMap (OSM) Contributors</h2>
              </div>
            </div>

            <a
              href="https://www.openstreetmap.org/copyright"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:underline transition self-start sm:self-auto"
            >
              <span>Lisensi ODbL OSM</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <p className="text-xs text-[#CBD5E1] leading-relaxed">
            Lapisan peta dasar (base tiles) disajikan menggunakan data kartografi terbuka OpenStreetMap yang dimodifikasi dengan visual bertema gelap ramah mata untuk kejelasan data kebencanaan.
          </p>
        </div>
      </div>

      {/* Safety Disclaimer */}
      <div className="mt-8 p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex items-start gap-3 text-xs text-[#CBD5E1]">
        <ShieldAlert className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white">Pemberitahuan Transparansi: </span>
          <span>
            Disaster Radar Indonesia tidak mengklaim kepemilikan atas data yang dipublikasikan oleh BMKG, BNPB, PVMBG, atau Darwin VAAC. Kami menghormati hak cipta dan atribusi dari setiap institusi penerbit data.
          </span>
        </div>
      </div>
    </div>
  );
}
