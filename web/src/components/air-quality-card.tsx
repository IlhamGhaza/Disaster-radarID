'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  AirQualityReading,
  isAirQualityUnhealthy,
  dispatchAirQualityNotification,
} from '@/lib/air-quality';
import {
  getCachedUserLocation,
  saveUserLocation,
  resolveUserLocation,
  CachedUserLocation,
  POPULAR_CITIES,
  requestDisasterNotificationPermission,
} from '@/lib/user-location-cache';
import {
  Wind,
  Activity,
  RefreshCw,
  MapPin,
  ChevronDown,
  ChevronUp,
  Navigation,
  Bell,
  BellRing,
  AlertTriangle,
  Compass,
} from 'lucide-react';

interface AirQualityCardProps {
  initialLat?: number;
  initialLng?: number;
  locationLabel?: string;
  compact?: boolean;
}

export function AirQualityCard({
  initialLat,
  initialLng,
  locationLabel,
  compact = false,
}: AirQualityCardProps) {
  const [data, setData] = useState<AirQualityReading | null>(null);
  const [loading, setLoading] = useState(true);
  const [locating, setLocating] = useState(false);
  const [needsGpsPrompt, setNeedsGpsPrompt] = useState(false);
  const [userLoc, setUserLoc] = useState<CachedUserLocation | null>(null);
  const [showHistory, setShowHistory] = useState(!compact);
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>('default');

  // Check initial notification status
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotifPermission(Notification.permission);
    }
  }, []);

  // Fetch AQI from backend API
  const fetchAqi = useCallback(async (lat: number, lng: number, labelName?: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/air-quality?lat=${lat}&lng=${lng}`);
      if (res.ok) {
        const json: AirQualityReading = await res.json();
        setData(json);

        // If unhealthy and notification granted, fire web notification
        if (isAirQualityUnhealthy(json.ispu)) {
          dispatchAirQualityNotification(json, labelName || 'Lokasi Anda');
        }
      }
    } catch (e) {
      console.warn('Failed to fetch air quality:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Unified location resolution flow
  const runLocationDetection = useCallback(async () => {
    // 1. If explicit coordinates provided via props, use them
    if (initialLat !== undefined && initialLng !== undefined) {
      setUserLoc({
        latitude: initialLat,
        longitude: initialLng,
        label: locationLabel || 'Area Pilihan',
        updatedAt: new Date().toISOString(),
      });
      setNeedsGpsPrompt(false);
      fetchAqi(initialLat, initialLng, locationLabel || 'Area Pilihan');
      return;
    }

    // 2. Check if cache exists
    const cached = getCachedUserLocation();
    if (cached) {
      setUserLoc(cached);
      setNeedsGpsPrompt(false);
      // Immediately render cached location for zero perceived latency
      fetchAqi(cached.latitude, cached.longitude, cached.label);

      // Silently verify GPS in background if browser has geolocation
      if (typeof navigator !== 'undefined' && navigator.geolocation) {
        resolveUserLocation({ timeoutMs: 5000 }).then((res) => {
          if (res.source === 'gps' && res.location) {
            setUserLoc(res.location);
            fetchAqi(res.location.latitude, res.location.longitude, res.location.label);
          }
        });
      }
      return;
    }

    // 3. Neither props nor cache available -> attempt GPS first
    setLocating(true);
    const res = await resolveUserLocation({ timeoutMs: 6000 });
    setLocating(false);

    if (res.location) {
      setUserLoc(res.location);
      setNeedsGpsPrompt(false);
      fetchAqi(res.location.latitude, res.location.longitude, res.location.label);
    } else {
      // GPS not active or denied AND no cache -> Prompt user to turn on GPS or pick a city
      setNeedsGpsPrompt(true);
      setLoading(false);
    }
  }, [initialLat, initialLng, locationLabel, fetchAqi]);

  useEffect(() => {
    runLocationDetection();

    const handleLocUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<CachedUserLocation>;
      if (customEvent.detail) {
        setUserLoc(customEvent.detail);
        setNeedsGpsPrompt(false);
        fetchAqi(customEvent.detail.latitude, customEvent.detail.longitude, customEvent.detail.label);
      }
    };

    const handleLocClear = () => {
      setUserLoc(null);
      if (initialLat === undefined) {
        setNeedsGpsPrompt(true);
        setData(null);
      }
    };

    window.addEventListener('disaster-radar:location-updated', handleLocUpdate);
    window.addEventListener('disaster-radar:location-cleared', handleLocClear);
    return () => {
      window.removeEventListener('disaster-radar:location-updated', handleLocUpdate);
      window.removeEventListener('disaster-radar:location-cleared', handleLocClear);
    };
  }, [runLocationDetection, initialLat]);

  // Handler: User explicitly requests GPS activation
  const handleRequestGps = async () => {
    setLocating(true);
    const res = await resolveUserLocation({ timeoutMs: 8000, enableHighAccuracy: true });
    setLocating(false);

    if (res.location) {
      setUserLoc(res.location);
      setNeedsGpsPrompt(false);
      fetchAqi(res.location.latitude, res.location.longitude, res.location.label);
    } else {
      alert(
        res.error ||
          'GPS tidak aktif atau izin akses lokasi belum diberikan. Silakan aktifkan GPS atau pilih salah satu kota di bawah.'
      );
    }
  };

  // Handler: User picks a popular city preset
  const handleSelectCity = (city: { label: string; latitude: number; longitude: number }) => {
    const saved = saveUserLocation({ latitude: city.latitude, longitude: city.longitude }, city.label, false);
    setUserLoc(saved);
    setNeedsGpsPrompt(false);
    fetchAqi(saved.latitude, saved.longitude, saved.label);
  };

  // Handler: Toggle browser notification permission
  const handleToggleNotification = async () => {
    const perm = await requestDisasterNotificationPermission();
    setNotifPermission(perm);
    if (perm === 'granted' && data && isAirQualityUnhealthy(data.ispu)) {
      dispatchAirQualityNotification(data, effectiveLabel);
    }
  };

  // Determine effective coordinates & label
  const effectiveLat = initialLat ?? userLoc?.latitude ?? -6.2088;
  const effectiveLng = initialLng ?? userLoc?.longitude ?? 106.8456;
  const effectiveLabel = locationLabel ?? userLoc?.label ?? 'Lokasi Terpilih';

  // -------------------------------------------------------------
  // STATE 1: Prompt to turn on GPS if GPS is off and no cache exists
  // -------------------------------------------------------------
  if (needsGpsPrompt && !userLoc && initialLat === undefined) {
    return (
      <div
        role="region"
        aria-label="Aktivasi Lokasi Kualitas Udara"
        className="relative rounded-2xl border border-white/[0.12] bg-gradient-to-b from-[#111726] via-[#0D121F] to-[#080C14] p-5 sm:p-6 shadow-2xl shadow-black/80 backdrop-blur-xl overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 shadow-lg shadow-cyan-500/10">
            <Compass className={`h-6 w-6 ${locating ? 'animate-spin' : ''}`} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-400">
                LOKASI BELUM TERDETEKSI
              </span>
            </div>
            <h3 className="text-base font-bold text-white mt-0.5">
              Pantau Kualitas Udara di Sekitar Anda
            </h3>
            <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed max-w-xl">
              Nyalakan GPS perangkat Anda atau izinkan akses lokasi agar sistem dapat menampilkan data ISPU & partikulat udara real-time serta mengirimkan notifikasi saat udara tidak sehat.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRequestGps}
            disabled={locating}
            className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-cyan-500/50 bg-cyan-500/20 hover:bg-cyan-500/30 active:scale-95 text-cyan-300 font-bold text-xs tracking-wide transition shadow-lg shadow-cyan-950/50"
          >
            <Navigation className={`h-4 w-4 ${locating ? 'animate-spin' : ''}`} />
            <span>{locating ? 'Mendeteksi GPS...' : 'Aktifkan GPS'}</span>
          </button>
        </div>

        {/* Quick-pick city presets if GPS is off */}
        <div className="mt-4 pt-3 border-t border-white/[0.08]">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[11px] font-mono text-[#64748B] flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              Atau pilih kota:
            </span>
            {POPULAR_CITIES.map((city) => (
              <button
                key={city.label}
                type="button"
                onClick={() => handleSelectCity(city)}
                className="px-2.5 py-1 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.08] hover:border-cyan-500/40 text-[11px] font-mono text-[#CBD5E1] transition active:scale-95"
              >
                {city.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STATE 2: Loading skeleton
  // -------------------------------------------------------------
  if (loading && !data) {
    return (
      <div className="rounded-2xl border border-white/[0.08] bg-[#0D1117]/90 p-4 sm:p-5 backdrop-blur-xl animate-pulse">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="h-4 w-32 bg-white/10 rounded" />
          <div className="h-4 w-16 bg-white/10 rounded-full" />
        </div>
        <div className="mt-4 flex items-center gap-4">
          <div className="h-12 w-16 bg-white/10 rounded-xl" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 bg-white/10 rounded" />
            <div className="h-3 w-1/2 bg-white/10 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const isUnhealthy = isAirQualityUnhealthy(data.ispu);

  // -------------------------------------------------------------
  // STATE 3: Ready with ISPU Telemetry, 24h Trend & Notification
  // -------------------------------------------------------------
  return (
    <div
      role="region"
      aria-label="Pemantauan Kualitas Udara ISPU"
      className="relative rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#0F1420] via-[#0D1117] to-[#090D15] p-4 sm:p-5 shadow-2xl shadow-black/60 backdrop-blur-xl overflow-hidden group"
    >
      {/* Top ambient color glow based on ISPU status */}
      <div
        className="pointer-events-none absolute -top-12 right-0 h-36 w-36 rounded-full blur-[80px] opacity-25"
        style={{ backgroundColor: data.color }}
      />

      {/* Header bar */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-white/[0.06] text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border"
            style={{
              backgroundColor: data.bgColor,
              borderColor: data.borderColor,
              color: data.color,
            }}
          >
            <Wind className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-bold tracking-wider text-[#E8ECF1] uppercase text-[11px]">
                KUALITAS UDARA
              </span>
              <span className="text-[10px] font-mono text-[#64748B] hidden sm:inline">(ISPU KLHK)</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-[#8B95A7] truncate">
              <MapPin className="h-3 w-3 shrink-0 text-[#64748B]" />
              <span className="truncate">{effectiveLabel}</span>
              {userLoc?.isGps && (
                <span className="text-[9px] font-mono text-cyan-400 bg-cyan-500/10 px-1 py-0.2 rounded border border-cyan-500/20 shrink-0">
                  GPS
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Web Notification Toggle */}
          <button
            type="button"
            onClick={handleToggleNotification}
            className={`p-1.5 rounded-lg border transition ${
              notifPermission === 'granted'
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                : 'border-white/[0.08] text-[#8B95A7] hover:text-white hover:bg-white/[0.04]'
            }`}
            title={
              notifPermission === 'granted'
                ? 'Notifikasi Udara Tidak Sehat Aktif'
                : 'Aktifkan Notifikasi Udara Tidak Sehat'
            }
            aria-label="Pengaturan Notifikasi Kualitas Udara"
          >
            {notifPermission === 'granted' ? (
              <BellRing className="h-3.5 w-3.5" />
            ) : (
              <Bell className="h-3.5 w-3.5" />
            )}
          </button>

          {/* Refresh button */}
          <button
            type="button"
            onClick={() => fetchAqi(effectiveLat, effectiveLng, effectiveLabel)}
            disabled={loading}
            className="p-1.5 rounded-lg border border-white/[0.08] text-[#8B95A7] hover:text-white hover:bg-white/[0.04] transition"
            title="Muat Ulang Kualitas Udara"
            aria-label="Refresh Kualitas Udara"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Unhealthy Warning Strip with Notification Opt-In Prompt */}
      {isUnhealthy && notifPermission !== 'granted' && (
        <div className="mt-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
            <span className="text-[11px] text-amber-200 truncate">
              Kualitas udara melewati batas aman ({data.category})!
            </span>
          </div>
          <button
            type="button"
            onClick={handleToggleNotification}
            className="shrink-0 px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-[10px] border border-amber-500/40 transition active:scale-95 flex items-center gap-1"
          >
            <Bell className="h-3 w-3" />
            <span>Aktifkan Notif</span>
          </button>
        </div>
      )}

      {/* Main ISPU Gauge & Status */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div
            className="flex flex-col items-center justify-center px-3.5 py-2 rounded-xl border font-mono tabular-nums shadow-lg"
            style={{
              backgroundColor: data.bgColor,
              borderColor: data.borderColor,
            }}
          >
            <span className="text-2xl sm:text-3xl font-black leading-none" style={{ color: data.color }}>
              {data.ispu}
            </span>
            <span className="text-[9px] font-bold tracking-widest uppercase mt-0.5 text-[#8B95A7]">
              ISPU
            </span>
          </div>

          <div>
            <span
              className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border font-mono"
              style={{
                backgroundColor: data.bgColor,
                borderColor: data.borderColor,
                color: data.color,
              }}
            >
              {data.category}
            </span>
            <p className="text-xs text-[#94A3B8] mt-1 line-clamp-2 max-w-md leading-relaxed">
              {data.advice}
            </p>
          </div>
        </div>

        {/* Quick pollutant pills */}
        <div className="grid grid-cols-3 sm:grid-cols-3 gap-2 rounded-xl border border-white/[0.06] bg-[#070A10]/70 p-2 text-center text-xs font-mono shrink-0">
          <div>
            <span className="text-[9px] text-[#64748B] block">PM2.5</span>
            <span className="font-bold text-[#E8ECF1] tabular-nums">
              {data.pm25.toFixed(1)} <span className="text-[9px] text-[#64748B] font-normal">µg</span>
            </span>
          </div>
          <div>
            <span className="text-[9px] text-[#64748B] block">PM10</span>
            <span className="font-bold text-[#E8ECF1] tabular-nums">
              {data.pm10.toFixed(1)} <span className="text-[9px] text-[#64748B] font-normal">µg</span>
            </span>
          </div>
          <div>
            <span className="text-[9px] text-[#64748B] block">US AQI</span>
            <span className="font-bold text-amber-400 tabular-nums">
              {data.usAqi}
            </span>
          </div>
        </div>
      </div>

      {/* 24-Hour History Toggle & Interactive Visual Bar Graph */}
      {data.hourlyHistory && data.hourlyHistory.length > 0 && (
        <div className="mt-4 pt-3 border-t border-white/[0.06]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono tracking-wider text-[#8B95A7] uppercase flex items-center gap-1.5">
              <Activity className="h-3 w-3 text-cyan-400" />
              <span>Tren 24 Jam Terakhir</span>
            </span>

            <button
              type="button"
              onClick={() => setShowHistory(!showHistory)}
              className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>{showHistory ? 'Sembunyikan' : 'Lihat Detail'}</span>
              {showHistory ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
          </div>

          {showHistory && (
            <div className="space-y-2 animate-in fade-in duration-200">
              {/* Hourly Bars */}
              <div className="flex items-end justify-between gap-1 h-14 pt-2 px-1 rounded-lg bg-[#060910] border border-white/[0.04]">
                {data.hourlyHistory.map((h, i) => {
                  const maxIspu = 250;
                  const heightPercent = Math.min(100, Math.max(12, (h.ispu / maxIspu) * 100));
                  const hourLabel = new Date(h.time).getHours().toString().padStart(2, '0');
                  const barColor =
                    h.ispu <= 50
                      ? '#10B981'
                      : h.ispu <= 100
                      ? '#3B82F6'
                      : h.ispu <= 200
                      ? '#F59E0B'
                      : '#EF4444';

                  return (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center justify-end h-full group/bar relative"
                    >
                      <div
                        className="w-full rounded-t transition-all duration-200 group-hover/bar:brightness-125"
                        style={{
                          height: `${heightPercent}%`,
                          backgroundColor: barColor,
                          opacity: i === data.hourlyHistory.length - 1 ? 1 : 0.75,
                        }}
                      />
                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full mb-1 hidden group-hover/bar:flex flex-col items-center pointer-events-none z-30">
                        <div className="rounded bg-[#0A0E17] border border-white/20 p-1 px-1.5 text-[9px] font-mono whitespace-nowrap shadow-xl">
                          <span className="font-bold text-white">{hourLabel}:00</span> — ISPU {h.ispu}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Ticker labels below chart */}
              <div className="flex items-center justify-between text-[9px] font-mono text-[#5A6478] px-1">
                <span>24j lalu</span>
                <span>12j lalu</span>
                <span className="text-cyan-400 font-bold">Saat ini</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
