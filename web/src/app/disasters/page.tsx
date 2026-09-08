import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { DISASTER_CATEGORIES, getAggregatedDisasters } from '@/lib/disasters/aggregator';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { SITE_CONFIG, SITE_URL } from '@/config/site';
import { ChevronRight, ArrowRight, ShieldCheck, Map } from 'lucide-react';
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ name: 'Kategori Bencana', url: '/disasters' }]} />

      <div className="max-w-3xl mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-[#EF4444]">
          Direktori Bencana Indonesia
        </span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-1">
          Kategori Pemantauan Bencana
        </h1>
        <p className="mt-3 text-sm text-[#8B95A7] leading-relaxed">
          Pilih salah satu kategori kebencanaan untuk melihat laporan kejadian terkini, zona kerentanan risiko, panduan mitigasi keselamatan, serta peta interaktif khusus.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {DISASTER_CATEGORIES.map((cat) => {
          const count = data.counts.byType[cat.type] || 0;
          return (
            <Link
              key={cat.type}
              href={`/disasters/${cat.type}`}
              className="p-6 rounded-3xl bg-[#111827] border border-white/10 hover:border-white/25 transition-all duration-200 group hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: cat.bgRgba, color: cat.color }}
                  >
                    <DisasterIcon type={cat.type} size={26} color={cat.color} />
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/5 text-[#CBD5E1]">
                    {count} Kejadian Aktif
                  </span>
                </div>

                <h2 className="text-lg font-black text-white group-hover:text-[#EF4444] transition">
                  {cat.label}
                </h2>
                <p className="mt-2 text-xs text-[#8B95A7] leading-relaxed line-clamp-3">
                  {cat.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-[#FF8A3D]">
                <span>Buka Detail & Peta</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Main Map CTA */}
      <div className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-red-950/40 to-orange-950/40 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-black text-white">Ingin Melihat Seluruh Bencana Dalam Satu Peta?</h3>
          <p className="text-xs text-[#8B95A7] mt-1">
            Gunakan Peta Radar Live untuk memvisualisasikan seluruh layer secara bersamaan di wilayah Indonesia.
          </p>
        </div>
        <Link
          href="/map"
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#EF4444] to-[#F97316] text-white font-bold text-xs sm:text-sm shrink-0 shadow-lg shadow-red-600/20"
        >
          <Map className="h-4 w-4" />
          <span>Buka Peta Radar</span>
        </Link>
      </div>
    </div>
  );
}
