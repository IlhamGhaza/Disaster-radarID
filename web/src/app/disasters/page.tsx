import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { DISASTER_CATEGORIES, getAggregatedDisasters } from '@/lib/disasters/aggregator';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { SITE_URL } from '@/config/site';
import { ChevronRight, ArrowRight, Map, Layers, Shield, Compass } from 'lucide-react';
import { DisasterIcon } from '@/components/icons/disaster-icons';

export const metadata: Metadata = {
  title: 'Daftar Bencana Alam di Indonesia Hari Ini — Info Gempa BMKG, Banjir, & Cuaca | Disaster Radar',
  description:
    'Pantau daftar lengkap bencana alam di Indonesia hari ini: gempa bumi BMKG, titik banjir, gunung meletus PVMBG, sebaran abu vulkanik, tanah longsor, karhutla, dan cuaca ekstrem.',
  keywords: [
    'daftar bencana alam indonesia',
    'info bencana hari ini',
    'gempa bumi bmkg hari ini',
    'pantauan banjir hari ini',
    'status gunung meletus',
    'kebakaran hutan sumatera kalimantan',
    'cuaca ekstrem bmkg',
  ],
  alternates: {
    canonical: `${SITE_URL}/disasters`,
  },
  openGraph: {
    title: 'Daftar Bencana Alam di Indonesia Hari Ini — Info Gempa BMKG, Banjir, & Cuaca | Disaster Radar',
    description:
      'Pantau daftar lengkap bencana alam di Indonesia hari ini: gempa bumi BMKG, titik banjir, gunung meletus PVMBG, sebaran abu vulkanik, tanah longsor, karhutla, dan cuaca ekstrem.',
    url: `${SITE_URL}/disasters`,
    siteName: 'Disaster Radar Indonesia',
    type: 'website',
  },
};

function formatWibTime(isoString: string): string {
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return '-';
  return new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

// Kategori dengan laporan diberi bobot (latar surface, ikon terang); yang kosong surut ke latar halaman.
function categoryRowClass(count: number): string {
  return `group flex flex-col justify-between rounded-card border p-gutter transition-colors duration-120 hover:border-line-strong hover:bg-raised ${
    count > 0 ? 'border-line-strong bg-surface' : 'border-line bg-bg'
  }`;
}

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
  const updatedWib = formatWibTime(data.lastUpdated);

  return (
    <div className="mx-auto max-w-7xl px-gutter py-stack sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ name: 'Kategori Bencana', url: '/disasters' }]} />

      {/* Hero Header */}
      <div className="mb-section pt-4">
        <div className="max-w-3xl">
          <h1 className="text-display text-fg-1 text-balance md:text-display-lg">
            Daftar <span className="serif-accent text-accent">bencana</span> yang Dipantau di Indonesia
          </h1>

          <p className="mt-cell font-mono text-small text-fg-2 tabular-nums">
            <span className="font-semibold text-fg-1">{totalActiveIncidents}</span> Laporan Terkini
            <span className="text-fg-3"> · data {updatedWib} WIB</span>
          </p>

          <p className="mt-gutter max-w-2xl text-body text-fg-2">
            Pilih jenis bencana di bawah untuk melihat laporan kejadian hari ini, peta wilayah yang terdampak, serta langkah penyelamatan diri sesuai panduan BPBD dan BMKG.
          </p>

          <div className="mt-gutter flex flex-wrap items-center gap-x-gutter gap-y-cell text-small text-fg-2">
            <div className="flex items-center gap-1.5">
              <Compass className="h-4 w-4 text-fg-3" aria-hidden="true" />
              <span>4 Bencana Gempa & Bumi</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-fg-3" aria-hidden="true" />
              <span>5 Bencana Cuaca & Air</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-fg-3" aria-hidden="true" />
              <span>1 Bencana Laut</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Categories by Clusters */}
      <div className="space-y-section">
        {/* Cluster 1: Geologi */}
        <div>
          <div className="mb-gutter flex flex-wrap items-baseline justify-between gap-x-gutter gap-y-1 border-b border-line pb-row">
            <div className="flex items-center gap-cell">
              <div className="h-4 w-1 rounded-badge bg-line-strong" aria-hidden="true" />
              <h2 className="text-title text-fg-1 md:text-title-lg">
                Bencana Gempa & Gunung Api (Geologi)
              </h2>
            </div>
            <span className="text-small text-fg-3">
              Data Resmi BMKG & PVMBG MAGMA
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {geologyCategories.map((cat) => {
              const count = counts.byType[cat.type] || 0;
              return (
                <Link key={cat.type} href={`/disasters/${cat.type}`} className={categoryRowClass(count)}>
                  <div>
                    <div className="mb-row flex items-center justify-between gap-cell">
                      <div className="flex h-11 w-11 items-center justify-center rounded-control border border-line">
                        <DisasterIcon type={cat.type} size={22} color={count > 0 ? 'var(--fg-1)' : 'var(--fg-3)'} />
                      </div>
                      {count > 0 ? (
                        <span className="font-mono text-num font-semibold text-fg-1 tabular-nums">
                          {count} Aktif
                        </span>
                      ) : (
                        <span className="text-small text-fg-3">
                          Tidak ada laporan
                        </span>
                      )}
                    </div>

                    <h3 className="text-heading text-fg-1">
                      {cat.label}
                    </h3>
                    <p className="mt-1 line-clamp-3 text-small text-fg-2">
                      {cat.description}
                    </p>
                  </div>

                  <div className="mt-gutter flex items-center justify-between border-t border-line pt-row text-small">
                    <span className="truncate text-fg-3">{cat.officialSources[0]}</span>
                    <ChevronRight className="ml-2 h-4 w-4 shrink-0 text-fg-3 group-hover:text-accent" aria-hidden="true" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Cluster 2: Hidrometeorologi */}
        <div>
          <div className="mb-gutter flex flex-wrap items-baseline justify-between gap-x-gutter gap-y-1 border-b border-line pb-row">
            <div className="flex items-center gap-cell">
              <div className="h-4 w-1 rounded-badge bg-line-strong" aria-hidden="true" />
              <h2 className="text-title text-fg-1 md:text-title-lg">
                Bencana Cuaca, Banjir, & Air (Hidrometeorologi)
              </h2>
            </div>
            <span className="text-small text-fg-3">
              Data Resmi BMKG Cuaca & BNPB
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {hydroCategories.map((cat) => {
              const count = counts.byType[cat.type] || 0;
              return (
                <Link key={cat.type} href={`/disasters/${cat.type}`} className={categoryRowClass(count)}>
                  <div>
                    <div className="mb-row flex items-center justify-between gap-cell">
                      <div className="flex h-11 w-11 items-center justify-center rounded-control border border-line">
                        <DisasterIcon type={cat.type} size={22} color={count > 0 ? 'var(--fg-1)' : 'var(--fg-3)'} />
                      </div>
                      {count > 0 ? (
                        <span className="font-mono text-num font-semibold text-fg-1 tabular-nums">
                          {count} Aktif
                        </span>
                      ) : (
                        <span className="text-small text-fg-3">
                          Tidak ada laporan
                        </span>
                      )}
                    </div>

                    <h3 className="text-heading text-fg-1">
                      {cat.label}
                    </h3>
                    <p className="mt-1 line-clamp-3 text-small text-fg-2">
                      {cat.description}
                    </p>
                  </div>

                  <div className="mt-gutter flex items-center justify-between border-t border-line pt-row text-small">
                    <span className="truncate text-fg-3">{cat.officialSources[0]}</span>
                    <ChevronRight className="ml-2 h-4 w-4 shrink-0 text-fg-3 group-hover:text-accent" aria-hidden="true" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Cluster 3: Pesisir */}
        <div>
          <div className="mb-gutter flex flex-wrap items-baseline justify-between gap-x-gutter gap-y-1 border-b border-line pb-row">
            <div className="flex items-center gap-cell">
              <div className="h-4 w-1 rounded-badge bg-line-strong" aria-hidden="true" />
              <h2 className="text-title text-fg-1 md:text-title-lg">
                Bencana Gelombang & Pesisir Laut
              </h2>
            </div>
            <span className="text-small text-fg-3">
              Data Resmi BMKG Maritim & BNPB
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {marineCategories.map((cat) => {
              const count = counts.byType[cat.type] || 0;
              return (
                <Link key={cat.type} href={`/disasters/${cat.type}`} className={categoryRowClass(count)}>
                  <div>
                    <div className="mb-row flex items-center justify-between gap-cell">
                      <div className="flex h-11 w-11 items-center justify-center rounded-control border border-line">
                        <DisasterIcon type={cat.type} size={22} color={count > 0 ? 'var(--fg-1)' : 'var(--fg-3)'} />
                      </div>
                      {count > 0 ? (
                        <span className="font-mono text-num font-semibold text-fg-1 tabular-nums">
                          {count} Aktif
                        </span>
                      ) : (
                        <span className="text-small text-fg-3">
                          Tidak ada laporan
                        </span>
                      )}
                    </div>

                    <h3 className="text-heading text-fg-1">
                      {cat.label}
                    </h3>
                    <p className="mt-1 line-clamp-3 text-small text-fg-2">
                      {cat.description}
                    </p>
                  </div>

                  <div className="mt-gutter flex items-center justify-between border-t border-line pt-row text-small">
                    <span className="truncate text-fg-3">{cat.officialSources[0]}</span>
                    <ChevronRight className="ml-2 h-4 w-4 shrink-0 text-fg-3 group-hover:text-accent" aria-hidden="true" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Strip CTA peta */}
      <div className="mt-section flex flex-col justify-between gap-gutter border-t border-line pt-stack sm:flex-row sm:items-center">
        <div className="max-w-xl">
          <h2 className="text-title text-fg-1 md:text-title-lg">
            Semua jenis bencana di satu peta
          </h2>
          <p className="mt-1 text-body text-fg-2">
            {DISASTER_CATEGORIES.length} jenis bencana di atas tampil bersama di peta Indonesia.
          </p>
        </div>
        <Link
          href="/map"
          className="inline-flex min-h-tap shrink-0 items-center justify-center gap-2 rounded-control bg-accent px-5 text-body font-semibold text-fg-inverse transition-colors duration-120 hover:bg-accent-hover"
        >
          <Map className="h-4 w-4" aria-hidden="true" />
          <span>Buka peta</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
