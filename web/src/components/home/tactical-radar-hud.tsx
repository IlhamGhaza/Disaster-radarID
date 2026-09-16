import React from 'react';
import Link from 'next/link';
import { DisasterEvent } from '@/lib/disasters/types';
import { Radar, ArrowUpRight, ShieldAlert } from 'lucide-react';

interface TacticalRadarHudProps {
  events: DisasterEvent[];
  criticalCount: number;
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

  // Select up to 12 most critical or recent events with valid coords
  const plottedEvents = events
    .filter((e) => e.latitude !== undefined && e.longitude !== undefined)
    .slice(0, 12);

  return (
    <div
      role="region"
      aria-label="Visualisasi Radar Geospasial Nusantara"
      className="relative w-full max-w-full min-w-0 rounded-2xl border border-white/[0.08] bg-[#0A0E17]/90 p-3.5 sm:p-5 shadow-2xl shadow-black/60 overflow-hidden backdrop-blur-xl group"
    >
      {/* Subtle top border accent glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />

      {/* Header telemetry HUD strip */}
      <div className="flex items-center justify-between gap-2 border-b border-white/[0.06] pb-3 text-[10px] sm:text-[11px] font-mono tracking-wider text-[#8B95A7] min-w-0">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-80" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
          </span>
          <span className="font-semibold text-[#E8ECF1] truncate">WILAYAH INDONESIA</span>
          <span className="hidden sm:inline text-white/30">•</span>
          <span className="hidden sm:inline text-emerald-400">PANTAUAN LANGSUNG</span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <span className="text-[9px] sm:text-[10px] text-[#8B95A7] tabular-nums">0.78°S 113.92°E</span>
          <div className="h-1.5 w-1.5 rounded-full bg-cyan-400/80 animate-pulse" />
        </div>
      </div>

      {/* Main Radar Screen Viewport */}
      <div className="relative mt-3 h-[240px] sm:h-[270px] w-full rounded-xl bg-[#060910] overflow-hidden border border-white/[0.04]">
        {/* Radar concentric distance circles */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[100px] h-[100px] rounded-full border border-cyan-500/10" />
          <div className="absolute w-[200px] h-[200px] rounded-full border border-cyan-500/10 border-dashed" />
          <div className="absolute w-[300px] h-[300px] rounded-full border border-cyan-500/10" />
          <div className="absolute w-[400px] h-[400px] rounded-full border border-cyan-500/5" />
          {/* Crosshairs */}
          <div className="absolute w-full h-px bg-cyan-500/10" />
          <div className="absolute h-full w-px bg-cyan-500/10" />
        </div>

        {/* 360 degree sweep beam */}
        <div
          className="pointer-events-none absolute inset-0 origin-center opacity-40 animate-[spin_8s_linear_infinite]"
          style={{
            background: 'conic-gradient(from 0deg at 50% 50%, rgba(6, 182, 212, 0.22) 0deg, rgba(6, 182, 212, 0.05) 35deg, transparent 60deg, transparent 360deg)',
          }}
        />

        {/* SVG Tactical Vector Map of Indonesia Archipelago */}
        <svg
          viewBox="0 0 480 260"
          className="absolute inset-0 h-full w-full select-none"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="radarCenterGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width="480" height="260" fill="url(#radarCenterGlow)" />

          {/* Stylized Archipelago Silhouette Paths */}
          {/* Sumatra */}
          <path
            d="M 32 78 L 48 55 L 75 88 L 105 130 L 120 155 L 105 168 L 78 142 L 52 108 Z"
            fill="rgba(6, 182, 212, 0.06)"
            stroke="rgba(6, 182, 212, 0.28)"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          {/* Java */}
          <path
            d="M 125 174 L 160 172 L 205 176 L 245 180 L 240 188 L 195 186 L 150 184 L 122 181 Z"
            fill="rgba(6, 182, 212, 0.06)"
            stroke="rgba(6, 182, 212, 0.28)"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          {/* Bali, Lombok, Sumbawa, Flores, Timor */}
          <path
            d="M 252 182 L 264 182 L 285 184 L 320 185 L 340 187 L 338 193 L 305 191 L 270 190 L 250 188 Z"
            fill="rgba(6, 182, 212, 0.06)"
            stroke="rgba(6, 182, 212, 0.28)"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          {/* Kalimantan */}
          <path
            d="M 148 78 L 175 62 L 210 70 L 228 92 L 220 128 L 195 142 L 165 140 L 148 118 Z"
            fill="rgba(6, 182, 212, 0.06)"
            stroke="rgba(6, 182, 212, 0.28)"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          {/* Sulawesi */}
          <path
            d="M 245 88 L 265 82 L 280 94 L 270 110 L 285 125 L 280 148 L 268 152 L 262 128 L 248 122 Z"
            fill="rgba(6, 182, 212, 0.06)"
            stroke="rgba(6, 182, 212, 0.28)"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          {/* Maluku */}
          <path
            d="M 310 102 L 325 96 L 332 112 L 320 128 L 308 118 Z"
            fill="rgba(6, 182, 212, 0.06)"
            stroke="rgba(6, 182, 212, 0.25)"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          {/* Papua */}
          <path
            d="M 360 115 L 390 105 L 430 112 L 460 118 L 458 175 L 425 178 L 395 162 L 375 140 Z"
            fill="rgba(6, 182, 212, 0.06)"
            stroke="rgba(6, 182, 212, 0.28)"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />

          {/* Real Plotted Disaster Incident Blips */}
          {plottedEvents.map((ev) => {
            const pt = mapCoords(ev.latitude, ev.longitude);
            if (!pt) return null;

            const isCrit = ev.severity === 'critical';
            const isHigh = ev.severity === 'high';
            const blipColor = isCrit ? '#EF4444' : isHigh ? '#F97316' : '#EAB308';

            return (
              <g key={ev.id} className="transition-transform duration-300 hover:scale-125">
                {/* Ping pulse ring for critical or high */}
                {(isCrit || isHigh) && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isCrit ? 12 : 8}
                    fill="none"
                    stroke={blipColor}
                    strokeWidth="1"
                    strokeOpacity="0.8"
                    className="animate-ping origin-center"
                  />
                )}
                {/* Static outer aura */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isCrit ? 6 : 4.5}
                  fill={blipColor}
                  fillOpacity="0.3"
                />
                {/* Solid core blip */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isCrit ? 3.5 : 2.5}
                  fill={blipColor}
                  stroke="#FFFFFF"
                  strokeWidth="0.8"
                />
              </g>
            );
          })}
        </svg>

        {/* Live HUD Floating Overlay Card (Top Left) */}
        <div className="absolute top-3 left-3 rounded-lg border border-white/[0.08] bg-[#0A0E17]/85 p-2 px-2.5 backdrop-blur-md">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#E8ECF1]">
            <Radar className="h-3 w-3 text-cyan-400" />
            <span className="font-semibold">{events.length} Kejadian</span>
            <span className="text-white/40">|</span>
            <span className="text-red-400 font-bold">{criticalCount} Kritis</span>
          </div>
        </div>

        {/* Floating Quick CTA on Radar (Bottom Right) */}
        <div className="absolute bottom-3 right-3">
          <Link
            href="/map"
            className="flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-[#080C14]/90 px-3 py-1.5 text-[11px] font-semibold text-cyan-300 backdrop-blur-md transition-all hover:border-cyan-400 hover:bg-cyan-950/40 hover:text-white shadow-lg"
          >
            <span>Buka Peta Lengkap</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Footer ticker info */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-1.5 text-[10px] text-[#8B95A7]">
        <span className="flex items-center gap-1 min-w-0">
          <ShieldAlert className="h-3 w-3 text-red-400/80 shrink-0" />
          <span className="truncate">Data Terkini BMKG • PVMBG • BNPB</span>
        </span>
        <span className="font-mono text-white/50 hidden sm:inline">Pembaruan Real-Time</span>
      </div>
    </div>
  );
}
