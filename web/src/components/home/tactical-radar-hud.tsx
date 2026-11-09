import React from 'react';
import Link from 'next/link';
import { DisasterEvent } from '@/lib/disasters/types';
import { ArrowUpRight } from 'lucide-react';

interface TacticalRadarHudProps {
  events: DisasterEvent[];
  criticalCount: number;
}

/** Urutan tampil: yang paling berbahaya digambar terakhir (di atas) dan tidak pernah terpotong. */
const SEVERITY_RANK: Record<string, number> = { critical: 0, high: 1, moderate: 2, low: 3 };

/** Island silhouettes (viewBox 480 x 260). Bentuk tidak diubah dari versi sebelumnya. */
const ISLANDS = [
  'M 32 78 L 48 55 L 75 88 L 105 130 L 120 155 L 105 168 L 78 142 L 52 108 Z', // Sumatra
  'M 125 174 L 160 172 L 205 176 L 245 180 L 240 188 L 195 186 L 150 184 L 122 181 Z', // Java
  'M 252 182 L 264 182 L 285 184 L 320 185 L 340 187 L 338 193 L 305 191 L 270 190 L 250 188 Z', // Nusa Tenggara
  'M 148 78 L 175 62 L 210 70 L 228 92 L 220 128 L 195 142 L 165 140 L 148 118 Z', // Kalimantan
  'M 245 88 L 265 82 L 280 94 L 270 110 L 285 125 L 280 148 L 268 152 L 262 128 L 248 122 Z', // Sulawesi
  'M 310 102 L 325 96 L 332 112 L 320 128 L 308 118 Z', // Maluku
  'M 360 115 L 390 105 L 430 112 L 460 118 L 458 175 L 425 178 L 395 162 L 375 140 Z', // Papua
];

/**
 * Severity marker: bentuk + warna, supaya terbaca tanpa membedakan warna.
 * critical = titik penuh + cincin, high = belah ketupat penuh, moderate = lingkaran kosong, low = titik kecil.
 */
function SeverityMark({ severity, x, y }: { severity: string; x: number; y: number }) {
  switch (severity) {
    case 'critical':
      return (
        <>
          <circle cx={x} cy={y} r={9} fill="none" strokeWidth={1.5} style={{ stroke: 'var(--sev-critical)' }} />
          <circle cx={x} cy={y} r={5} strokeWidth={1.5} style={{ fill: 'var(--sev-critical)', stroke: 'var(--bg)' }} />
        </>
      );
    case 'high':
      return (
        <rect
          x={x - 4.5}
          y={y - 4.5}
          width={9}
          height={9}
          transform={`rotate(45 ${x} ${y})`}
          strokeWidth={1.5}
          style={{ fill: 'var(--sev-high)', stroke: 'var(--bg)' }}
        />
      );
    case 'moderate':
      return <circle cx={x} cy={y} r={4.5} fill="none" strokeWidth={2} style={{ stroke: 'var(--sev-warning)' }} />;
    default:
      return <circle cx={x} cy={y} r={2.5} style={{ fill: 'var(--fg-3)' }} />;
  }
}

function LegendMark({ severity }: { severity: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" className="shrink-0">
      <SeverityMark severity={severity} x={10} y={10} />
    </svg>
  );
}

export function TacticalRadarHud({ events, criticalCount }: TacticalRadarHudProps) {
  // Map lat/lon to SVG viewBox (480 x 260)
  // Indonesia bounds: lon 95 to 141 (span 46), lat -11 to 6 (span 17)
  const mapCoords = (lat?: number, lon?: number) => {
    if (lat === undefined || lon === undefined) return null;
    const clampedLon = Math.max(95, Math.min(141, lon));
    const clampedLat = Math.max(-11, Math.min(6, lat));

    const x = ((clampedLon - 95) / 46) * 440 + 20;
    const y = ((6 - clampedLat) / 17) * 220 + 20;
    return { x, y };
  };

  // Up to 12 events with coordinates, most severe first; drawn in reverse so the most severe sit on top.
  const plottedEvents = events
    .filter((e) => e.latitude !== undefined && e.longitude !== undefined)
    .sort((a, b) => (SEVERITY_RANK[a.severity] ?? 3) - (SEVERITY_RANK[b.severity] ?? 3))
    .slice(0, 12);

  return (
    <figure
      role="region"
      aria-label="Visualisasi Radar Geospasial Nusantara"
      className="relative w-full min-w-0 max-w-full bezel-core"
    >
      {/* Ringkasan angka */}
      <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1 border-b border-line px-gutter py-3">
        <p className="text-small text-fg-2">
          <span className="font-mono text-num-lg font-semibold tabular-nums text-fg-1">{events.length}</span>{' '}
          Kejadian
        </p>
        <p className="text-small text-fg-2">
          <span className="font-mono text-num-lg font-semibold tabular-nums text-sev-critical">{criticalCount}</span>{' '}
          Kritis
        </p>
      </div>

      {/* Plot */}
      <div className="relative bg-bg">
        <svg viewBox="0 0 480 260" className="block h-auto w-full select-none" role="img" aria-label={`${plottedEvents.length} kejadian teratas menurut tingkat bahaya, digambar di peta Indonesia`}>
          {ISLANDS.map((d) => (
            <path
              key={d}
              d={d}
              strokeWidth={1}
              strokeLinejoin="round"
              style={{ fill: 'var(--surface)', stroke: 'var(--line-strong)' }}
            />
          ))}

          {[...plottedEvents].reverse().map((ev) => {
            const pt = mapCoords(ev.latitude, ev.longitude);
            if (!pt) return null;
            return (
              <g key={ev.id}>
                <title>{ev.title}</title>
                <SeverityMark severity={ev.severity} x={pt.x} y={pt.y} />
              </g>
            );
          })}
        </svg>

        <Link
          href="/map"
          className="absolute bottom-2 right-2 flex min-h-tap items-center gap-1.5 rounded-control border border-line-strong bg-raised px-3 text-small font-semibold text-accent transition-colors duration-120 hover:text-accent-hover md:min-h-10"
        >
          <span>Buka Peta Lengkap</span>
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      {/* Legenda: bentuk + teks, tidak bergantung pada warna */}
      <figcaption className="border-t border-line px-gutter py-3">
        <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-small text-fg-2">
          <li className="flex items-center gap-1.5"><LegendMark severity="critical" />Kritis</li>
          <li className="flex items-center gap-1.5"><LegendMark severity="high" />Tinggi</li>
          <li className="flex items-center gap-1.5"><LegendMark severity="moderate" />Waspada</li>
          <li className="flex items-center gap-1.5"><LegendMark severity="low" />Lainnya</li>
        </ul>
        <p className="mt-2 text-label font-normal text-fg-3">Data Terkini BMKG • PVMBG • BNPB</p>
      </figcaption>
    </figure>
  );
}
