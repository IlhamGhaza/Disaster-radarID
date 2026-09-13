import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getDarwinAdvisories } from '@/lib/advisories';
import { formatAltitudeCompact, formatMovementHuman } from '@/lib/aviation-format';
import { getMagmaVolcanoStatus, getAllMonitoredVolcanoes } from '@/lib/magma-status';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { ChevronRight, Map, ShieldAlert, Mountain, Compass, Wind } from 'lucide-react';
import { SITE_URL } from '@/config/site';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Gunung Api Indonesia | Aktivitas & Wilayah Abu Aktif | Disaster Radar',
  description:
    'Pantau gunung api aktif dan sebaran abu vulkanik di Indonesia dengan status MAGMA PVMBG, ketinggian plume, dan arah pergerakan.',
  alternates: {
    canonical: `${SITE_URL}/volcanoes`,
  },
  openGraph: {
    title: 'Gunung Api Indonesia | Aktivitas & Wilayah Abu Aktif | Disaster Radar',
    description:
      'Pantau gunung api aktif dan sebaran abu vulkanik di Indonesia dengan status MAGMA PVMBG, ketinggian plume, dan arah pergerakan.',
    url: `${SITE_URL}/volcanoes`,
    siteName: 'Disaster Radar Indonesia',
    type: 'website',
    images: [
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'Gunung Api Indonesia — Disaster Radar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gunung Api Indonesia | Aktivitas & Wilayah Abu Aktif | Disaster Radar',
    description:
      'Pantau gunung api aktif dan sebaran abu vulkanik di Indonesia dengan status MAGMA PVMBG.',
    images: [`${SITE_URL}/opengraph-image`],
  },
};

export default async function VolcanoesPage() {
  const data = await getDarwinAdvisories();
  const volcanoes = data.deduplicated;
  const monitored = getAllMonitoredVolcanoes();

  // Highlighted high status volcanoes from PVMBG catalog
  const criticalVolcanoes = monitored.filter(
    (m) => m.level === 4 || m.level === 3
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-[#080C14] text-[#E8ECF1]">
      <Breadcrumbs items={[{ name: 'Wilayah Abu Aktif', url: '/volcanoes' }]} />

      {/* Hero Header */}
      <div className="relative mt-4 mb-10 rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#140E16] via-[#0D1017] to-[#070A10] p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-orange-600/10 blur-[120px]" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-950/40 px-3 py-1 text-[11px] font-mono font-semibold tracking-wider text-orange-400 uppercase mb-3 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
              </span>
              <span>TELEMETRI ABU VULKANIK & PVMBG</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#E8ECF1] leading-[1.1]">
              Active Ash Areas
            </h1>

            <p className="mt-3 text-sm sm:text-base text-[#94A3B8] leading-relaxed">
              Monitoring sebaran abu vulkanik aviasi aktif teramati dari buletin resmi <span className="text-[#E8ECF1] font-semibold">Darwin VAAC</span> dan status aktivitas 127 gunung api dari <span className="text-[#E8ECF1] font-semibold">MAGMA ESDM / PVMBG</span>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="rounded-xl border border-white/[0.1] bg-[#0D1117] px-4 py-2.5 text-xs font-mono text-[#94A3B8]">
              <span className="text-[#E8ECF1] font-bold text-sm mr-1 tabular-nums">{volcanoes.length}</span> Sebaran Abu Aktif
            </div>
            <Link
              href="/map"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-orange-600/25 transition-all hover:from-orange-500 hover:to-amber-400 hover:-translate-y-0.5"
            >
              <Map className="h-4 w-4" />
              <span>Lihat di Peta Radar</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Active Ash Volcanoes Section */}
      <div className="mb-14">
        <div className="flex items-center justify-between gap-4 mb-5 border-b border-white/[0.06] pb-3">
          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4 text-orange-400" />
            <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-[#E8ECF1]">
              Gunung Api dengan Sebaran Abu Aktif
            </h2>
          </div>
          <span className="text-xs font-mono text-[#64748B]">Darwin VAAC Feed</span>
        </div>

        {volcanoes.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {volcanoes.map((v) => {
              const slug = v.volcanoName.toLowerCase();
              const magmaStatus = getMagmaVolcanoStatus(v.volcanoName);

              return (
                <div
                  key={v.id}
                  className="rounded-2xl border border-white/[0.08] bg-[#0D1117] p-5 flex flex-col justify-between shadow-xl shadow-black/40 transition-all duration-200 hover:border-orange-500/40 hover:bg-[#131924] hover:-translate-y-1 group"
                >
                  <div>
                    {/* Header card */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-[#E8ECF1] group-hover:text-orange-400 transition-colors">
                          {v.volcanoName}
                        </h3>
                        <span className="text-xs text-[#8B95A7] flex items-center gap-1 mt-0.5">
                          <Compass className="h-3 w-3 text-[#64748B]" />
                          {v.area}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap justify-end">
                        <span
                          className="rounded-full px-2 py-0.5 text-[10px] font-mono font-bold tracking-wider uppercase border"
                          style={{
                            backgroundColor: magmaStatus.badgeBg,
                            color: magmaStatus.badgeText,
                            borderColor: magmaStatus.badgeBorder,
                          }}
                        >
                          {magmaStatus.levelName}
                        </span>
                        <span className="rounded-full bg-orange-950/40 px-2 py-0.5 text-[10px] font-mono font-bold text-orange-400 border border-orange-500/30">
                          Abu Aktif
                        </span>
                      </div>
                    </div>

                    {/* MAGMA Status Box */}
                    <div
                      className="mt-3 rounded-xl p-3 border text-xs"
                      style={{ backgroundColor: magmaStatus.badgeBg, borderColor: magmaStatus.badgeBorder }}
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono font-bold">
                        <span style={{ color: magmaStatus.badgeText }}>MAGMA INDONESIA</span>
                        <span className="text-slate-200 font-semibold">{magmaStatus.levelRoman}</span>
                      </div>
                      <p className="mt-1 text-[11px] text-[#CBD5E1] line-clamp-2 leading-relaxed">
                        {magmaStatus.description}
                      </p>
                    </div>

                    {/* Flight Level & Movement Specs */}
                    <div className="mt-4 space-y-2 text-xs font-mono">
                      <div className="flex justify-between py-1.5 border-b border-white/[0.05]">
                        <span className="text-[#8B95A7]">Ketinggian Abu:</span>
                        <span className="font-bold text-[#E8ECF1] tabular-nums">
                          {formatAltitudeCompact(v.primaryFlightLevel)}
                        </span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-white/[0.05]">
                        <span className="text-[#8B95A7]">Arah Sebaran:</span>
                        <span className="text-amber-300 font-semibold">
                          {formatMovementHuman(v.primaryMovement)}
                        </span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-white/[0.05]">
                        <span className="text-[#8B95A7]">Observasi:</span>
                        <span className="text-[#94A3B8] tabular-nums">
                          {new Date(v.dtg).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
                    <Link
                      href={`/volcanoes/${slug}`}
                      className="text-xs font-bold text-[#94A3B8] hover:text-white flex items-center gap-1 transition-colors"
                    >
                      <span>Profil Lengkap</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>

                    <Link
                      href={`/map?lat=${v.position?.latitude || -7.9}&lng=${v.position?.longitude || 112.9}&zoom=10`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-orange-500/30 bg-orange-950/20 px-3 py-1.5 text-xs font-bold text-orange-300 transition-all hover:border-orange-500/60 hover:bg-orange-900/30 hover:text-white"
                    >
                      <Map className="h-3 w-3" />
                      <span>Poligon Peta</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/[0.08] bg-[#0D1117] p-8 text-center">
            <ShieldAlert className="mx-auto h-8 w-8 text-[#64748B]" />
            <h3 className="mt-3 text-sm font-semibold text-[#E8ECF1]">
              Tidak Ada Sebaran Abu Vulkanik Aktif Saat Ini
            </h3>
            <p className="mt-1 text-xs text-[#94A3B8] max-w-md mx-auto">
              Seluruh jalur penerbangan terpantau bersih dari abu vulkanik menurut buletin Darwin VAAC terbaru.
            </p>
          </div>
        )}
      </div>

      {/* PVMBG Monitored Volcanoes Status (Critical / Warning) */}
      <div className="mt-12">
        <div className="flex items-center justify-between gap-4 mb-5 border-b border-white/[0.06] pb-3">
          <div className="flex items-center gap-2">
            <Mountain className="h-4 w-4 text-red-400" />
            <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-[#E8ECF1]">
              Katalog Status Siaga & Awas PVMBG
            </h2>
          </div>
          <span className="text-xs font-mono text-[#64748B]">127 Gunung Api Terpantau</span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {criticalVolcanoes.slice(0, 8).map((mv) => (
            <Link
              key={mv.volcanoSlug}
              href={`/volcanoes/${mv.volcanoSlug}`}
              className="group rounded-xl border border-white/[0.06] bg-[#0D1117] p-4 transition-all duration-200 hover:border-white/[0.18] hover:bg-[#131924] hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className="rounded-full px-2 py-0.5 text-[9px] font-mono font-bold tracking-wider uppercase border"
                  style={{
                    backgroundColor: mv.badgeBg,
                    color: mv.badgeText,
                    borderColor: mv.badgeBorder,
                  }}
                >
                  {mv.levelName}
                </span>
                <span className="text-[10px] font-mono text-[#64748B] tabular-nums">
                  {mv.elevation}
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#E8ECF1] group-hover:text-white transition-colors">
                G. {mv.volcanoName}
              </h3>
              <p className="mt-1 text-[11px] text-[#8B95A7] truncate">
                {mv.area}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
