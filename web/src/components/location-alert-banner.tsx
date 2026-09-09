'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { DisasterEvent, DisasterType } from '@/lib/disasters/types';
import { VolcanoAdvisory } from '@/lib/types';
import {
  getCachedUserLocation,
  saveUserLocation,
  clearCachedUserLocation,
  evaluateUserDisasterExposure,
  requestDisasterNotificationPermission,
  dispatchWebDisasterNotification,
  CachedUserLocation,
  UserDisasterZoneAlert,
} from '@/lib/user-location-cache';
import { DISASTER_SAFETY_GUIDES } from '@/lib/safety-guides';
import {
  AlertTriangle,
  ShieldCheck,
  MapPin,
  X,
  ChevronRight,
  RefreshCw,
  PhoneCall,
  BookOpen,
  Info,
  Radio,
  Bell,
} from 'lucide-react';

interface LocationAlertBannerProps {
  events: DisasterEvent[];
  advisories?: VolcanoAdvisory[];
  onSelectEvent?: (event: DisasterEvent) => void;
  className?: string;
}

export function LocationAlertBanner({
  events,
  advisories,
  onSelectEvent,
  className = '',
}: LocationAlertBannerProps) {
  const [cachedLoc, setCachedLoc] = useState<CachedUserLocation | null>(null);
  const [alertInfo, setAlertInfo] = useState<UserDisasterZoneAlert | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // Sync with localStorage
  const refreshLocation = () => {
    const loc = getCachedUserLocation();
    setCachedLoc(loc);
    if (loc && events.length > 0) {
      const evaluation = evaluateUserDisasterExposure(
        { latitude: loc.latitude, longitude: loc.longitude },
        events,
        advisories
      );
      setAlertInfo(evaluation);
      if (evaluation.status !== 'SAFE') {
        dispatchWebDisasterNotification(evaluation);
      }
    } else {
      setAlertInfo(null);
    }
  };

  const handleEnableNotification = async () => {
    const perm = await requestDisasterNotificationPermission();
    setNotificationPermission(perm);
    if (perm === 'granted' && alertInfo && alertInfo.status !== 'SAFE') {
      dispatchWebDisasterNotification(alertInfo);
    }
  };

  useEffect(() => {
    refreshLocation();

    const handleUpdate = () => refreshLocation();
    const handleClear = () => {
      setCachedLoc(null);
      setAlertInfo(null);
    };

    window.addEventListener('disaster-radar:location-updated', handleUpdate);
    window.addEventListener('disaster-radar:location-cleared', handleClear);

    return () => {
      window.removeEventListener('disaster-radar:location-updated', handleUpdate);
      window.removeEventListener('disaster-radar:location-cleared', handleClear);
    };
  }, [events, advisories]);

  // Request GPS to save or update location
  const handleGetGpsLocation = () => {
    if (!navigator.geolocation) {
      alert('Perangkat Anda tidak mendukung geolokasi GPS.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const newLoc = saveUserLocation(
          { latitude: pos.coords.latitude, longitude: pos.coords.longitude },
          'Lokasi Saya (GPS)',
          true,
          pos.coords.accuracy
        );
        setCachedLoc(newLoc);
        setIsDismissed(false);
      },
      (err) => {
        setIsLocating(false);
        alert(
          err.code === 1
            ? 'Izin akses lokasi ditolak oleh browser. Anda dapat mencari kota/kabupaten Anda di kotak pencarian.'
            : 'Gagal mendeteksi koordinat GPS saat ini.'
        );
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // If dismissed or no location cached, show a minimal prompt pill
  if (!cachedLoc) {
    return (
      <div className={`flex items-center justify-between gap-3 px-3 py-2 rounded-xl bg-[#111827]/90 border border-white/10 text-xs text-[#8B95A7] backdrop-blur-md ${className}`}>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-[#FF6B1A] shrink-0" />
          <span>Simpan lokasi Anda untuk mengaktifkan notifikasi zona bahaya otomatis</span>
        </div>
        <button
          type="button"
          onClick={handleGetGpsLocation}
          disabled={isLocating}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FF6B1A]/20 text-[#FF8A3D] hover:bg-[#FF6B1A]/30 font-semibold transition shrink-0"
        >
          {isLocating ? (
            <RefreshCw className="h-3 w-3 animate-spin" />
          ) : (
            <Radio className="h-3 w-3" />
          )}
          <span>{isLocating ? 'Mendeteksi...' : 'Deteksi GPS'}</span>
        </button>
      </div>
    );
  }

  if (isDismissed || !alertInfo) return null;

  const isDanger = alertInfo.status === 'INSIDE_DANGER_ZONE';
  const isWarning = alertInfo.status === 'NEARBY_WARNING';
  const isSafe = alertInfo.status === 'SAFE';

  const guide = alertInfo.safetyGuideType
    ? DISASTER_SAFETY_GUIDES[alertInfo.safetyGuideType]
    : DISASTER_SAFETY_GUIDES.earthquake;

  return (
    <>
      <div
        className={`relative overflow-hidden rounded-2xl border transition-all duration-300 backdrop-blur-xl shadow-2xl ${
          isDanger
            ? 'bg-red-950/80 border-red-500/40 text-red-100 shadow-red-950/50'
            : isWarning
            ? 'bg-amber-950/70 border-amber-500/40 text-amber-100 shadow-amber-950/40'
            : 'bg-[#111827]/90 border-emerald-500/30 text-emerald-100'
        } ${className}`}
      >
        {/* Pulsing indicator edge */}
        {isDanger && (
          <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-red-500 to-rose-600 animate-pulse" />
        )}
        {isWarning && (
          <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-amber-500 to-orange-500" />
        )}

        <div className="p-3 sm:p-4 pl-4 sm:pl-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                  isDanger
                    ? 'bg-red-500/25 text-red-400 ring-2 ring-red-500/40 animate-pulse'
                    : isWarning
                    ? 'bg-amber-500/25 text-amber-400'
                    : 'bg-emerald-500/20 text-emerald-400'
                }`}
              >
                {isDanger ? (
                  <AlertTriangle className="h-5 w-5" />
                ) : isWarning ? (
                  <Radio className="h-5 w-5" />
                ) : (
                  <ShieldCheck className="h-5 w-5" />
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    {alertInfo.headline}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/10 text-[#CBD5E1]">
                    <MapPin className="h-2.5 w-2.5" />
                    {cachedLoc.label}
                  </span>
                </div>

                <p className="mt-1 text-xs text-[#CBD5E1] leading-relaxed">
                  {alertInfo.message}
                </p>

                {/* Action Buttons */}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {(isDanger || isWarning) && (
                    <button
                      type="button"
                      onClick={() => setShowGuideModal(true)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-md ${
                        isDanger
                          ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/40'
                          : 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/30'
                      }`}
                    >
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>Lihat Panduan Evakuasi</span>
                    </button>
                  )}

                  {alertInfo.affectedEvent && onSelectEvent && (
                    <button
                      type="button"
                      onClick={() => onSelectEvent(alertInfo.affectedEvent!)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-white transition"
                    >
                      <span>Fokus ke Kejadian</span>
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  )}

                  {/* Notification Permission Prompt if not granted */}
                  {notificationPermission !== 'granted' && typeof window !== 'undefined' && 'Notification' in window && (
                    <button
                      type="button"
                      onClick={handleEnableNotification}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-xs font-bold text-red-300 border border-red-500/40 transition"
                      title="Aktifkan notifikasi bahaya di browser"
                    >
                      <Bell className="h-3.5 w-3.5 animate-bounce" />
                      <span>Aktifkan Notifikasi</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleGetGpsLocation}
                    disabled={isLocating}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-[#94A3B8] hover:text-white transition"
                    title="Perbarui koordinat dengan GPS"
                  >
                    <RefreshCw className={`h-3 w-3 ${isLocating ? 'animate-spin text-white' : ''}`} />
                    <span>Perbarui Lokasi</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Dismiss button */}
            <button
              type="button"
              onClick={() => setIsDismissed(true)}
              className="p-1 text-[#94A3B8] hover:text-white rounded-lg hover:bg-white/10 transition"
              aria-label="Tutup notifikasi"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Safety & Evacuation Modal */}
      {showGuideModal && guide && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/15 bg-[#0B0F17] p-6 shadow-2xl text-white">
            <div className="flex items-start justify-between pb-4 border-b border-white/10">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#EF4444]">
                  Panduan Tanggap Darurat Resmi
                </span>
                <h2 className="text-xl font-black text-white mt-0.5">{guide.title}</h2>
                <p className="text-xs text-[#8B95A7] mt-1">{guide.tagline}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="rounded-xl p-2 text-[#8B95A7] hover:bg-white/10 hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Emergency hotlines banner */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
              {guide.emergencyHotlines.map((hotline) => (
                <a
                  key={hotline.number}
                  href={`tel:${hotline.number}`}
                  className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-red-950/40 border border-red-500/30 hover:bg-red-900/40 transition group"
                >
                  <span className="text-[10px] text-[#FCA5A5]">{hotline.name}</span>
                  <span className="text-lg font-black text-white group-hover:text-red-300">
                    {hotline.number}
                  </span>
                  <span className="text-[9px] text-[#94A3B8] text-center line-clamp-1">
                    {hotline.role}
                  </span>
                </a>
              ))}
            </div>

            {/* Step-by-step immediate actions */}
            <div className="mt-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                <span>Tindakan Cepat Saat Ini (Golden Time)</span>
              </h3>
              <div className="space-y-2.5">
                {guide.duringAction.map((step) => (
                  <div
                    key={step.step}
                    className="flex items-start gap-3 p-3 rounded-xl bg-[#151C28] border border-white/5"
                  >
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-red-400 font-black text-xs">
                      {step.step}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{step.title}</h4>
                      <p className="text-xs text-[#94A3B8] mt-0.5 leading-relaxed">
                        {step.instruction}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dos and Don'ts */}
            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
                  ✓ Hal Yang Harus Dilakukan
                </h4>
                <ul className="space-y-1.5 text-xs text-[#CBD5E1]">
                  {guide.dos.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/30">
                <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 mb-2">
                  ✕ Hal Yang Dilarang Keras
                </h4>
                <ul className="space-y-1.5 text-xs text-[#CBD5E1]">
                  {guide.donts.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-red-400 shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition"
              >
                Tutup Panduan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
