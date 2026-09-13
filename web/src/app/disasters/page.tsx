import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { DISASTER_CATEGORIES, getAggregatedDisasters } from '@/lib/disasters/aggregator';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { SITE_URL } from '@/config/site';
import { ChevronRight, ArrowRight, Map, Layers, Radio, Shield, Compass } from 'lucide-react';
import { DisasterIcon } from '@/components/icons/disaster-icons';

export const metadata: Metadata = {
  title: 'Kategori Bencana Indonesia | Disaster Radar',
  description:
    'Daftar lengkap kategori bencana yang dipantau di Indonesia: gempa bumi, banjir, gunung api, abu vulkanik, longsor, karhutla, cuaca ekstrem, dan tsunami.',
  alternates: {
    canonical: `${SITE_URL}/disasters`,
  },
  openGraph: {
    title: 'Kategori Bencana Indonesia | Disaster Radar',
    description:
      'Daftar lengkap kategori bencana yang dipantau di Indonesia: gempa bumi, banjir, gunung api, abu vulkanik, longsor, karhutla, cuaca ekstrem, dan tsunami.',
    url: `${SITE_URL}/disasters`,
    siteName: 'Disaster Radar Indonesia',
    type: 'website',
  },
};

export default async function DisastersIndexPage() {
  const data = await getAggregatedDisasters('LIVE');
  const { counts } = data;

  // Group 10 categories into 3 logical clusters
  const geologyTypes = ['earthquake', 'volcano', 'volcanic-ash', 'tsunami'];
  const hydroTypes = ['flood', 'extreme-weather', 'forest-fire', 'landslide', 'drought'];
  const marineTypes = ['coastal-hazard'];

  const geologyCategories = DISASTER_CATEGORIES.filter((c) => geologyTypes.includes(c.type));
  const hydroCategories = DISASTER_CATEGORIES.filter((c) => hydroTypes.includes(c.type));
  const marineCategories = DISASTER_CATEGORIES.filter((c) => marineTypes.includes(c.type));

  const totalActiveIncidents = counts.total || 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-[#080C14] text-[#E8ECF1]">
      <Breadcrumbs items={[{ name: 'Kategori Bencana', url: '/disasters' }]} />

      {/* Hero Header */}
      <div className="relative mt-4 mb-12 rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#0F1420] via-[#0A0E17] to-[#070A10] p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-red-600/10 blur-[100px]" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-[#121824]/80 px-3 py-1 text-[11px] font-mono font-semibold tracking-wider text-red-400 uppercase mb-4 backdrop-blur-md">
            <Radio className="h-3 w-3 animate-pulse" />
            <span>KATALOG MULTI-BAHAYA NASIONAL</span>
            <span className="text-white/20">•</span>
            <span className="text-emerald-400 font-bold tabular-nums">
              {totalActiveIncidents} Kejadian Aktif
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#E8ECF1] leading-[1.1]">
            Kategori Pemantauan Bencana
          </h1>

          <p className="mt-4 text-sm sm:text-base text-[#94A3B8] leading-relaxed max-w-2xl">
            Pilih salah satu kategori kebencanaan untuk melihat laporan kejadian terkini, zona kerentanan risiko, panduan mitigasi keselamatan, serta peta interaktif khusus berdasarkan standarisasi BNPB dan PVMBG.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2.5 text-xs font-mono">
            <div className="flex items-center gap-1.5 rounded-md border border-white/[0.06] bg-[#070A10] px-3 py-1.5 text-[#8B95A7]">
              <Compass className="h-3 w-3 text-red-400" />
              <span>4 Bahaya Geologi</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-md border border-white/[0.06] bg-[#070A10] px-3 py-1.5 text-[#8B95A7]">
              <Layers className="h-3 w-3 text-blue-400" />
              <span>5 Bahaya Hidrometeorologi</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-md border border-white/[0.06] bg-[#070A10] px-3 py-1.5 text-[#8B95A7]">
              <Shield className="h-3 w-3 text-cyan-400" />
              <span>1 Bahaya Oseanografi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Categories by Clusters */}
      <div className="space-y-12">
        {/* Cluster 1: Geologi */}
        <div>
          <div className="flex items-center justify-between gap-4 mb-4 border-b border-white/[0.06] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500 shadow-sm shadow-red-500/50" />
              <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-[#E8ECF1]">
                Klaster Bahaya Geologis & Vulkanik
              </h2>
            </div>
            <span className="text-xs font-mono text-[#64748B] hidden sm:inline">
              BMKG Seismik • PVMBG MAGMA
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {geologyCategories.map((cat) => {
              const count = counts.byType[cat.type] || 0;
              return (
                <Link
                  key={cat.type}
                  href={`/disasters/${cat.type}`}
                  className="group flex flex-col justify-between rounded-xl border border-white/[0.07] bg-[#0D1117] p-5 transition-all duration-200 hover:border-white/[0.2] hover:bg-[#141B26] hover:-translate-y-1 shadow-lg shadow-black/40"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="flex h-11 w-11 items-center justify-center rounded-xl"
                        style={{ backgroundColor: cat.bgRgba, color: cat.color }}
                      >
                        <DisasterIcon type={cat.type} size={22} color={cat.color} />
                      </div>
                      {count > 0 ? (
                        <span
                          className="px-2.5 py-1 rounded-full text-xs font-mono font-bold tracking-wider tabular-nums border"
                          style={{
                            color: cat.color,
                            backgroundColor: cat.bgRgba,
                            borderColor: cat.borderRgba,
                          }}
                        >
                          {count} Aktif
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-[#64748B] bg-white/[0.03]">
                          Nihil
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-[#E8ECF1] group-hover:text-white transition-colors">
                      {cat.label}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-[#94A3B8] line-clamp-3">
                      {cat.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-3.5 border-t border-white/[0.05] flex items-center justify-between text-xs font-semibold" style={{ color: cat.color }}>
                    <span className="truncate text-[11px] text-[#64748B]">{cat.officialSources[0]}</span>
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform shrink-0 ml-2" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Cluster 2: Hidrometeorologi */}
        <div>
          <div className="flex items-center justify-between gap-4 mb-4 border-b border-white/[0.06] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="h-2.5 w-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50" />
              <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-[#E8ECF1]">
                Klaster Bahaya Hidrometeorologis & Iklim
              </h2>
            </div>
            <span className="text-xs font-mono text-[#64748B] hidden sm:inline">
              BNPB InaRISK • BMKG Cuaca
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {hydroCategories.map((cat) => {
              const count = counts.byType[cat.type] || 0;
              return (
                <Link
                  key={cat.type}
                  href={`/disasters/${cat.type}`}
                  className="group flex flex-col justify-between rounded-xl border border-white/[0.07] bg-[#0D1117] p-5 transition-all duration-200 hover:border-white/[0.2] hover:bg-[#141B26] hover:-translate-y-1 shadow-lg shadow-black/40"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="flex h-11 w-11 items-center justify-center rounded-xl"
                        style={{ backgroundColor: cat.bgRgba, color: cat.color }}
                      >
                        <DisasterIcon type={cat.type} size={22} color={cat.color} />
                      </div>
                      {count > 0 ? (
                        <span
                          className="px-2.5 py-1 rounded-full text-xs font-mono font-bold tracking-wider tabular-nums border"
                          style={{
                            color: cat.color,
                            backgroundColor: cat.bgRgba,
                            borderColor: cat.borderRgba,
                          }}
                        >
                          {count} Aktif
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-[#64748B] bg-white/[0.03]">
                          Nihil
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-[#E8ECF1] group-hover:text-white transition-colors">
                      {cat.label}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-[#94A3B8] line-clamp-3">
                      {cat.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-3.5 border-t border-white/[0.05] flex items-center justify-between text-xs font-semibold" style={{ color: cat.color }}>
                    <span className="truncate text-[11px] text-[#64748B]">{cat.officialSources[0]}</span>
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform shrink-0 ml-2" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Cluster 3: Pesisir */}
        <div>
          <div className="flex items-center justify-between gap-4 mb-4 border-b border-white/[0.06] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="h-2.5 w-2.5 rounded-full bg-cyan-500 shadow-sm shadow-cyan-500/50" />
              <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-[#E8ECF1]">
                Klaster Bahaya Pesisir & Oseanografi
              </h2>
            </div>
            <span className="text-xs font-mono text-[#64748B] hidden sm:inline">
              BMKG Maritim • BNPB
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {marineCategories.map((cat) => {
              const count = counts.byType[cat.type] || 0;
              return (
                <Link
                  key={cat.type}
                  href={`/disasters/${cat.type}`}
                  className="group flex flex-col justify-between rounded-xl border border-white/[0.07] bg-[#0D1117] p-5 transition-all duration-200 hover:border-white/[0.2] hover:bg-[#141B26] hover:-translate-y-1 shadow-lg shadow-black/40"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="flex h-11 w-11 items-center justify-center rounded-xl"
                        style={{ backgroundColor: cat.bgRgba, color: cat.color }}
                      >
                        <DisasterIcon type={cat.type} size={22} color={cat.color} />
                      </div>
                      {count > 0 ? (
                        <span
                          className="px-2.5 py-1 rounded-full text-xs font-mono font-bold tracking-wider tabular-nums border"
                          style={{
                            color: cat.color,
                            backgroundColor: cat.bgRgba,
                            borderColor: cat.borderRgba,
                          }}
                        >
                          {count} Aktif
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-[#64748B] bg-white/[0.03]">
                          Nihil
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-[#E8ECF1] group-hover:text-white transition-colors">
                      {cat.label}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-[#94A3B8] line-clamp-3">
                      {cat.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-3.5 border-t border-white/[0.05] flex items-center justify-between text-xs font-semibold" style={{ color: cat.color }}>
                    <span className="truncate text-[11px] text-[#64748B]">{cat.officialSources[0]}</span>
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform shrink-0 ml-2" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Map CTA Tactical Strip */}
      <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-red-950/40 via-[#0D1117] to-[#0A0E17] border border-red-500/20 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold tracking-wider text-red-400 mb-2 uppercase">
            <Map className="h-3.5 w-3.5" />
            VISUALISASI INTEGRAL
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#E8ECF1]">
            Ingin Melihat Seluruh Bencana Dalam Satu Peta?
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1.5 leading-relaxed">
            Akses Peta Radar Interaktif untuk memvisualisasikan seluruh 10 layer bahaya secara simultan di wilayah kepulauan Indonesia.
          </p>
        </div>
        <Link
          href="/map"
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold text-xs sm:text-sm shrink-0 shadow-lg shadow-red-600/30 transition-all hover:from-red-500 hover:to-orange-400 hover:-translate-y-0.5"
        >
          <Map className="h-4 w-4" />
          <span>Buka Peta Radar Live</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
