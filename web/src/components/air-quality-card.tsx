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
  const [selectedHourIndex, setSelectedHourIndex] = useState<number | null>(null);
  const [timeRange, setTimeRange] = useState<'1d' | '7d' | '30d'>('1d');
  const [rangeCache, setRangeCache] = useState<Record<string, AirQualityReading>>({});
  const [rangeLoading, setRangeLoading] = useState(false);
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>('default');

  // Check initial notification status
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotifPermission(Notification.permission);
    }
  }, []);

  // Fetch AQI from backend API
  const fetchAqi = useCallback(
    async (
      lat: number,
      lng: number,
      labelName?: string,
      range: '1d' | '7d' | '30d' = '1d'
    ) => {
      setLoading(true);
      try {
        const res = await fetch(`/api/air-quality?lat=${lat}&lng=${lng}&range=${range}`);
        if (res.ok) {
          const json: AirQualityReading = await res.json();
          setData(json);
          setSelectedHourIndex(null);
          setTimeRange(range);
          const cacheKey = `${lat.toFixed(3)}_${lng.toFixed(3)}_${range}`;
          setRangeCache((prev) => ({ ...prev, [cacheKey]: json }));

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
    },
    []
  );

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

  // Determine effective coordinates & label
  const effectiveLat = initialLat ?? userLoc?.latitude ?? -6.2088;
  const effectiveLng = initialLng ?? userLoc?.longitude ?? 106.8456;
  const effectiveLabel = locationLabel ?? userLoc?.label ?? 'Lokasi Terpilih';

  // Handler: Switch time range (1d, 7d, 30d)
  const handleRangeChange = async (newRange: '1d' | '7d' | '30d') => {
    if (newRange === timeRange || rangeLoading) return;
    setTimeRange(newRange);
    setSelectedHourIndex(null);

    const cacheKey = `${effectiveLat.toFixed(3)}_${effectiveLng.toFixed(3)}_${newRange}`;
    if (rangeCache[cacheKey]) {
      setData(rangeCache[cacheKey]);
      return;
    }

    setRangeLoading(true);
    try {
      const res = await fetch(
        `/api/air-quality?lat=${effectiveLat}&lng=${effectiveLng}&range=${newRange}`
      );
      if (res.ok) {
        const json: AirQualityReading = await res.json();
        setRangeCache((prev) => ({ ...prev, [cacheKey]: json }));
        setData(json);
      }
    } catch (e) {
      console.warn('Failed to switch air quality range:', e);
    } finally {
      setRangeLoading(false);
    }
  };

  // Handler: User explicitly requests GPS activation
  const handleRequestGps = async () => {
    setLocating(true);
    const res = await resolveUserLocation({ timeoutMs: 8000, enableHighAccuracy: true });
    setLocating(false);

    if (res.location) {
      setUserLoc(res.location);
      setNeedsGpsPrompt(false);
      fetchAqi(res.location.latitude, res.location.longitude, res.location.label, timeRange);
    } else {
      alert(
        res.error ||
          'GPS belum aktif atau izin akses lokasi belum diberikan. Silakan aktifkan GPS atau pilih salah satu kota di bawah.'
      );
    }
  };

  // Handler: User picks a popular city preset
  const handleSelectCity = (city: { label: string; latitude: number; longitude: number }) => {
    const saved = saveUserLocation({ latitude: city.latitude, longitude: city.longitude }, city.label, false);
    setUserLoc(saved);
    setNeedsGpsPrompt(false);
    fetchAqi(saved.latitude, saved.longitude, saved.label, timeRange);
  };

  // Handler: Toggle browser notification permission
  const handleToggleNotification = async () => {
    const perm = await requestDisasterNotificationPermission();
    setNotifPermission(perm);
    if (perm === 'granted' && data && isAirQualityUnhealthy(data.ispu)) {
      dispatchAirQualityNotification(data, effectiveLabel);
    }
  };

  // -------------------------------------------------------------
  // STATE 1: Prompt to turn on GPS if GPS is off and no cache exists
  // -------------------------------------------------------------
  if (needsGpsPrompt && !userLoc && initialLat === undefined) {
    return (
      <div
        role="region"
        aria-label="Cek Kualitas Udara di Lokasi Anda"
        className="bezel-core p-gutter sm:p-6"
      >
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Compass
            className={`h-6 w-6 shrink-0 text-fg-2 ${locating ? 'animate-spin motion-reduce:animate-none' : ''}`}
            aria-hidden="true"
          />

          <div className="min-w-0 flex-1">
            <p className="text-label text-fg-3">Lokasi belum diketahui</p>
            <h3 className="mt-0.5 text-heading text-fg-1">Cek Kualitas Udara di Sekitar Anda</h3>
            <p className="mt-1 max-w-[65ch] text-small text-fg-2">
              Nyalakan GPS atau pilih kota Anda untuk mengetahui seberapa bersih udara hari ini dan menerima
              peringatan otomatis bila udara sedang tidak sehat.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRequestGps}
            disabled={locating}
            className="flex min-h-tap w-full shrink-0 items-center justify-center gap-2 rounded-control bg-accent px-4 text-body font-semibold text-fg-inverse transition-colors duration-120 hover:bg-accent-hover disabled:opacity-60 sm:w-auto"
          >
            <Navigation className="h-4 w-4" aria-hidden="true" />
            <span>{locating ? 'Mencari Lokasi...' : 'Nyalakan GPS'}</span>
          </button>
        </div>

        {/* Quick-pick city presets if GPS is off */}
        <div className="mt-4 border-t border-line pt-3">
          <p className="mb-1.5 flex items-center gap-1 text-small text-fg-3">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            Atau pilih kota:
          </p>
          <div className="flex flex-wrap gap-2">
            {POPULAR_CITIES.map((city) => (
              <button
                key={city.label}
                type="button"
                onClick={() => handleSelectCity(city)}
                className="min-h-tap rounded-control border border-line-strong px-3 text-small text-fg-1 transition-colors duration-120 hover:border-accent hover:text-accent md:min-h-10"
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
  // STATE 2: Loading skeleton (statis; tidak berdenyut)
  // -------------------------------------------------------------
  if (loading && !data) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="bezel-core p-gutter sm:p-5"
      >
        <p className="text-small text-fg-3">
          {locating ? 'Mencari lokasi Anda...' : 'Memuat data kualitas udara...'}
        </p>
        <div className="mt-3 flex items-center gap-4" aria-hidden="true">
          <div className="h-12 w-20 rounded-control bg-raised" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 rounded-badge bg-raised" />
            <div className="h-3 w-1/2 rounded-badge bg-raised" />
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STATE 2b: Error — fetch selesai tapi tidak ada data
  // -------------------------------------------------------------
  if (!data) {
    return (
      <div
        role="status"
        className="flex flex-col items-start gap-3 bezel-core p-gutter sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-start gap-2">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-sev-warning" aria-hidden="true" />
          <p className="text-small text-fg-2">
            <strong className="font-semibold text-fg-1">Data kualitas udara gagal dimuat.</strong> Periksa koneksi
            internet, lalu coba lagi.
          </p>
        </div>
        <button
          type="button"
          onClick={() => runLocationDetection()}
          className="flex min-h-tap shrink-0 items-center gap-2 rounded-control border border-line-strong px-4 text-small font-semibold text-fg-1 transition-colors duration-120 hover:bg-raised"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Coba lagi
        </button>
      </div>
    );
  }

  const isUnhealthy = isAirQualityUnhealthy(data.ispu);
  const historyList = data.history || data.hourlyHistory || [];
  const selectedPoint =
    selectedHourIndex !== null && historyList[selectedHourIndex]
      ? historyList[selectedHourIndex]
      : null;

  // Kategori dari lib berupa huruf kapital ("TIDAK SEHAT"); tampilkan sebagai kalimat biasa.
  const sentenceCase = (s: string) => (s ? s.charAt(0) + s.slice(1).toLowerCase() : s);
  // Warna batang dipetakan ke token severity (Baik → normal, Sedang → tsunami/biru, Tidak sehat → warning, lebih buruk → critical).
  const barToken = (ispu: number) =>
    ispu <= 50
      ? 'var(--sev-normal)'
      : ispu <= 100
      ? 'var(--sev-tsunami)'
      : ispu <= 200
      ? 'var(--sev-warning)'
      : 'var(--sev-critical)';

  const rangeLabel = timeRange === '1d' ? '24 Jam' : timeRange === '7d' ? '7 Hari' : '30 Hari';

  // -------------------------------------------------------------
  // STATE 3: Ready with ISPU Telemetry, Clickable 24h Trend & Notification
  // -------------------------------------------------------------
  return (
    <div
      role="region"
      aria-label="Pemantauan Kualitas Udara ISPU"
      className="bezel-core"
      style={{ borderLeft: `4px solid ${data.color}` }}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between gap-2 border-b border-line py-1 pl-gutter pr-1">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-small font-semibold text-fg-1">
            <Wind className="h-4 w-4 shrink-0 text-fg-2" aria-hidden="true" />
            Kualitas udara
            <span className="hidden font-normal text-fg-3 sm:inline">(Indeks ISPU)</span>
          </p>
          <p className="flex min-w-0 items-center gap-1 text-small text-fg-2">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-fg-3" aria-hidden="true" />
            <span className="truncate">{effectiveLabel}</span>
            {userLoc?.isGps && (
              <span className="shrink-0 rounded-badge border border-line-strong px-1 text-label font-normal text-fg-2">
                GPS
              </span>
            )}
          </p>
        </div>

        <div className="flex shrink-0 items-center">
          {/* Web Notification Toggle */}
          <button
            type="button"
            onClick={handleToggleNotification}
            className={`flex size-tap items-center justify-center rounded-control transition-colors duration-120 hover:bg-raised ${
              notifPermission === 'granted' ? 'text-sev-normal' : 'text-fg-2 hover:text-fg-1'
            }`}
            title={
              notifPermission === 'granted'
                ? 'Notifikasi Udara Tidak Sehat Sudah Aktif'
                : 'Nyalakan Notifikasi Jika Udara Tidak Sehat'
            }
            aria-label={
              notifPermission === 'granted'
                ? 'Notifikasi Udara Tidak Sehat Sudah Aktif'
                : 'Nyalakan Notifikasi Jika Udara Tidak Sehat'
            }
          >
            {notifPermission === 'granted' ? (
              <BellRing className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Bell className="h-4 w-4" aria-hidden="true" />
            )}
          </button>

          {/* Refresh button */}
          <button
            type="button"
            onClick={() => fetchAqi(effectiveLat, effectiveLng, effectiveLabel)}
            disabled={loading}
            className="flex size-tap items-center justify-center rounded-control text-fg-2 transition-colors duration-120 hover:bg-raised hover:text-fg-1"
            title="Perbarui Data Kualitas Udara"
            aria-label="Perbarui Data Kualitas Udara"
          >
            <RefreshCw
              className={`h-4 w-4 ${loading ? 'animate-spin motion-reduce:animate-none' : ''}`}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      <div className="p-gutter">
        {/* Unhealthy Warning Strip with Notification Opt-In Prompt */}
        {isUnhealthy && notifPermission !== 'granted' && (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-control border border-line border-l-4 border-l-sev-warning bg-sev-warning-soft py-1 pl-3 pr-1">
            <p className="flex min-w-0 items-center gap-2 text-small text-fg-1">
              <AlertTriangle className="h-4 w-4 shrink-0 text-sev-warning" aria-hidden="true" />
              <span>Perhatian: udara sedang kurang sehat ({sentenceCase(data.category)}).</span>
            </p>
            <button
              type="button"
              onClick={handleToggleNotification}
              className="flex min-h-tap shrink-0 items-center gap-1.5 rounded-control px-3 text-small font-semibold text-accent transition-colors duration-120 hover:bg-surface hover:text-accent-hover md:min-h-10"
            >
              <Bell className="h-4 w-4" aria-hidden="true" />
              <span>Nyalakan Peringatan</span>
            </button>
          </div>
        )}

        {/* Angka utama: ISPU besar + kategori + saran */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <p className="shrink-0 leading-none">
              <span className="font-mono text-num-xl font-semibold tabular-nums text-fg-1">{data.ispu}</span>
              <span className="mt-1 block text-label font-normal text-fg-3">ISPU</span>
            </p>
            <div className="min-w-0">
              <p className="flex items-center gap-2 text-heading text-fg-1">
                <span
                  aria-hidden="true"
                  className="h-3 w-3 shrink-0 rounded-badge"
                  style={{ backgroundColor: data.color }}
                />
                {sentenceCase(data.category)}
              </p>
              <p className="mt-1 line-clamp-2 max-w-[60ch] text-small text-fg-2">{data.advice}</p>
            </div>
          </div>

          {/* Polutan: angka mono + satuan */}
          <dl className="grid shrink-0 grid-cols-3 gap-x-5 border-t border-line pt-3 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
            <div>
              <dt className="text-label font-normal text-fg-3">Debu PM2.5</dt>
              <dd className="font-mono text-num tabular-nums text-fg-1">
                {data.pm25.toFixed(1)} <span className="text-label font-normal text-fg-3">µg/m³</span>
              </dd>
            </div>
            <div>
              <dt className="text-label font-normal text-fg-3">Debu PM10</dt>
              <dd className="font-mono text-num tabular-nums text-fg-1">
                {data.pm10.toFixed(1)} <span className="text-label font-normal text-fg-3">µg/m³</span>
              </dd>
            </div>
            <div>
              <dt className="text-label font-normal text-fg-3">Standar AQI</dt>
              <dd className="font-mono text-num tabular-nums text-fg-1">
                {data.usAqi} <span className="text-label font-normal text-fg-3">US AQI</span>
              </dd>
            </div>
          </dl>
        </div>

        {/* History Toggle & Interactive Clickable Bar Graph with 1D, 7D, 30D Selector */}
        {historyList && historyList.length > 0 && (
          <div className="mt-4 border-t border-line pt-3">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1.5 text-small font-semibold text-fg-1">
                  <Activity className="h-4 w-4 text-fg-2" aria-hidden="true" />
                  Riwayat ISPU
                </span>

                {/* Time Range Selector */}
                <div role="group" aria-label="Rentang riwayat" className="flex rounded-control border border-line-strong p-0.5">
                  {(
                    [
                      { id: '1d', label: '24 Jam', title: 'Riwayat 24 jam terakhir (per jam)' },
                      { id: '7d', label: '7 Hari', title: 'Riwayat 7 hari terakhir (1 minggu)' },
                      { id: '30d', label: '30 Hari', title: 'Riwayat 30 hari terakhir (1 bulan)' },
                    ] as const
                  ).map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => handleRangeChange(r.id)}
                      disabled={rangeLoading}
                      aria-pressed={timeRange === r.id}
                      title={r.title}
                      className={`min-h-10 rounded-badge px-3 text-small transition-colors duration-120 ${
                        timeRange === r.id
                          ? 'bg-accent font-semibold text-fg-inverse'
                          : 'text-fg-2 hover:text-fg-1'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowHistory(!showHistory)}
                aria-expanded={showHistory}
                className="flex min-h-tap items-center gap-1 text-small font-semibold text-accent hover:text-accent-hover md:min-h-10"
              >
                <span>{showHistory ? 'Tutup' : 'Buka Grafik'}</span>
                {showHistory ? (
                  <ChevronUp className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <ChevronDown className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>

            {showHistory && (
              <div className="space-y-2">
                {/* Bars container */}
                <div
                  className={`flex h-16 items-end justify-between gap-1 rounded-control border border-line bg-bg px-1 pt-2 transition-opacity duration-120 ${
                    rangeLoading ? 'opacity-50' : 'opacity-100'
                  }`}
                  role="group"
                  aria-label={`Grafik Kualitas Udara ${rangeLabel}`}
                  aria-busy={rangeLoading}
                >
                  {historyList.map((h, i) => {
                    const maxIspu = 250;
                    const heightPercent = Math.min(100, Math.max(14, (h.ispu / maxIspu) * 100));
                    const isSelected = selectedHourIndex === i;
                    const isCurrent = i === historyList.length - 1;

                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedHourIndex(isSelected ? null : i)}
                        className="group/bar relative flex h-full flex-1 cursor-pointer flex-col items-center justify-end"
                        title={`${h.label} — ISPU ${h.ispu} (${h.category})`}
                        aria-label={`${h.label}, ISPU ${h.ispu}, ${sentenceCase(h.category)}`}
                        aria-pressed={isSelected}
                      >
                        <div
                          className={`w-full rounded-t-[2px] ${isSelected ? 'outline-2 outline-offset-1 outline-fg-1' : ''}`}
                          style={{
                            height: `${heightPercent}%`,
                            backgroundColor: barToken(h.ispu),
                            opacity: isSelected || isCurrent ? 1 : 0.7,
                          }}
                        />

                        {/* Penanda "saat ini" */}
                        {isCurrent && !isSelected && (
                          <span aria-hidden="true" className="absolute -bottom-1 h-1 w-1 rounded-full bg-fg-1" />
                        )}

                        {/* Hover Tooltip for desktop */}
                        <div className="pointer-events-none absolute bottom-full z-30 mb-1 hidden flex-col items-center group-hover/bar:flex">
                          <div className="whitespace-nowrap rounded-badge border border-line-strong bg-raised px-1.5 py-0.5 font-mono text-label font-normal text-fg-1">
                            <span className="font-semibold">{h.label}</span> — {h.ispu}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Ticker labels below chart */}
                <div className="flex items-center justify-between px-1 text-label font-normal text-fg-3">
                  <span>{timeRange === '1d' ? '24 jam lalu' : timeRange === '7d' ? '7 hari lalu' : '30 hari lalu'}</span>
                  <span>{timeRange === '1d' ? '12 jam lalu' : timeRange === '7d' ? '3 hari lalu' : '15 hari lalu'}</span>
                  <span className="font-semibold text-fg-1">{timeRange === '1d' ? 'Saat ini' : 'Hari ini'}</span>
                </div>

                {/* Click Detail Callout: Displays the exact number when clicked */}
                {selectedPoint ? (
                  <div
                    role="status"
                    className="flex flex-wrap items-center justify-between gap-2 rounded-control border border-line-strong bg-raised py-1 pl-3 pr-1 text-small"
                  >
                    <p className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-0.5">
                      <span className="font-mono font-semibold tabular-nums text-fg-1">
                        {timeRange === '1d' ? `Jam ${selectedPoint.label}` : selectedPoint.label}
                      </span>
                      <span className="text-fg-2">
                        ISPU <strong className="font-mono font-semibold tabular-nums text-fg-1">{selectedPoint.ispu}</strong>{' '}
                        ({sentenceCase(selectedPoint.category)})
                      </span>
                      <span className="text-fg-2">
                        PM2.5{' '}
                        <strong className="font-mono font-semibold tabular-nums text-fg-1">
                          {selectedPoint.pm25.toFixed(1)}
                        </strong>{' '}
                        µg/m³
                      </span>
                    </p>
                    <button
                      type="button"
                      onClick={() => setSelectedHourIndex(null)}
                      className="flex min-h-tap shrink-0 items-center rounded-control px-3 font-semibold text-accent hover:bg-surface hover:text-accent-hover md:min-h-10"
                    >
                      Tutup
                    </button>
                  </div>
                ) : (
                  <p className="py-0.5 text-center text-label font-normal text-fg-3">
                    Sentuh atau klik batang mana saja untuk melihat angka detail {timeRange === '1d' ? 'jam' : 'hari'} tersebut
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
