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
  CheckCircle2,
  XCircle,
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
      <div
        className={`flex items-center justify-between gap-3 rounded-card border border-line-strong bg-raised py-1 pl-3 pr-1 text-small text-fg-2 shadow-float ${className}`}
      >
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
          <span>Simpan lokasi Anda untuk mengaktifkan notifikasi zona bahaya otomatis</span>
        </div>
        <button
          type="button"
          onClick={handleGetGpsLocation}
          disabled={isLocating}
          className="flex min-h-tap shrink-0 items-center gap-1.5 rounded-control px-3 font-semibold text-accent transition-colors duration-120 hover:bg-surface hover:text-accent-hover disabled:opacity-60"
        >
          {isLocating ? (
            <RefreshCw className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
          ) : (
            <Radio className="h-4 w-4" aria-hidden="true" />
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

  // Status selalu punya label teks + ikon, bukan warna saja.
  const tone = isDanger
    ? { label: 'Di dalam zona bahaya', text: 'text-sev-critical', edge: 'border-l-sev-critical', soft: 'bg-sev-critical-soft' }
    : isWarning
    ? { label: 'Dekat zona bahaya', text: 'text-sev-warning', edge: 'border-l-sev-warning', soft: 'bg-sev-warning-soft' }
    : { label: isSafe ? 'Di luar zona terpantau' : 'Status lokasi', text: 'text-sev-normal', edge: 'border-l-sev-normal', soft: 'bg-raised' };

  const guide = alertInfo.safetyGuideType
    ? DISASTER_SAFETY_GUIDES[alertInfo.safetyGuideType]
    : DISASTER_SAFETY_GUIDES.earthquake;

  const secondaryBtn =
    'flex min-h-tap items-center gap-1.5 rounded-control border border-line-strong px-3 text-small font-semibold text-fg-1 transition-colors duration-120 hover:bg-surface md:min-h-10';

  return (
    <>
      <div
        role="status"
        className={`relative rounded-card border border-line-strong border-l-4 ${tone.edge} ${tone.soft} text-fg-1 shadow-float ${className}`}
      >
        <div className="p-3 sm:p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 shrink-0 ${tone.text}`}>
                {isDanger ? (
                  <AlertTriangle className="h-5 w-5" aria-hidden="true" />
                ) : isWarning ? (
                  <Radio className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                )}
              </div>

              <div>
                <p className={`text-label ${tone.text}`}>{tone.label}</p>
                <p className="mt-0.5 text-heading text-fg-1">{alertInfo.headline}</p>
                <p className="mt-0.5 inline-flex items-center gap-1 text-small text-fg-2">
                  <MapPin className="h-3.5 w-3.5 text-fg-3" aria-hidden="true" />
                  {cachedLoc.label}
                </p>

                <p className="mt-1.5 max-w-[68ch] text-small text-fg-2">{alertInfo.message}</p>

                {/* Action Buttons */}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {(isDanger || isWarning) && (
                    <button
                      type="button"
                      onClick={() => setShowGuideModal(true)}
                      className="flex min-h-tap items-center gap-1.5 rounded-control bg-accent px-3 text-small font-semibold text-fg-inverse transition-colors duration-120 hover:bg-accent-hover md:min-h-10"
                    >
                      <BookOpen className="h-4 w-4" aria-hidden="true" />
                      <span>Lihat Panduan Evakuasi</span>
                    </button>
                  )}

                  {alertInfo.affectedEvent && onSelectEvent && (
                    <button
                      type="button"
                      onClick={() => onSelectEvent(alertInfo.affectedEvent!)}
                      className={secondaryBtn}
                    >
                      <span>Fokus ke Kejadian</span>
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  )}

                  {/* Notification Permission Prompt if not granted */}
                  {notificationPermission !== 'granted' && typeof window !== 'undefined' && 'Notification' in window && (
                    <button type="button" onClick={handleEnableNotification} className={secondaryBtn}>
                      <Bell className="h-4 w-4" aria-hidden="true" />
                      <span>Aktifkan Notifikasi</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleGetGpsLocation}
                    disabled={isLocating}
                    className={`${secondaryBtn} font-normal text-fg-2`}
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${isLocating ? 'animate-spin motion-reduce:animate-none' : ''}`}
                      aria-hidden="true"
                    />
                    <span>{isLocating ? 'Mendeteksi...' : 'Perbarui Lokasi'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Dismiss button */}
            <button
              type="button"
              onClick={() => setIsDismissed(true)}
              className="-mr-1 -mt-1 flex size-tap shrink-0 items-center justify-center rounded-control text-fg-2 transition-colors duration-120 hover:bg-surface hover:text-fg-1"
              aria-label="Tutup pemberitahuan lokasi"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Safety & Evacuation Modal */}
      {showGuideModal && guide && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-bg/85 p-gutter"
          onKeyDown={(e) => {
            if (e.key === 'Escape') setShowGuideModal(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="guide-modal-title"
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-card border border-line-strong bg-raised text-fg-1 shadow-float"
          >
            <div className="sticky top-0 flex items-start justify-between gap-3 border-b border-line bg-raised p-gutter">
              <div>
                <p className="text-label text-fg-3">Panduan Tanggap Darurat Resmi</p>
                <h2 id="guide-modal-title" className="mt-0.5 text-title text-fg-1">
                  {guide.title}
                </h2>
                <p className="mt-1 text-small text-fg-2">{guide.tagline}</p>
              </div>
              <button
                type="button"
                autoFocus
                onClick={() => setShowGuideModal(false)}
                className="flex size-tap shrink-0 items-center justify-center rounded-control text-fg-2 transition-colors duration-120 hover:bg-surface hover:text-fg-1"
                aria-label="Tutup panduan"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="p-gutter">
              {/* Emergency hotlines banner */}
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {guide.emergencyHotlines.map((hotline) => (
                  <a
                    key={hotline.number}
                    href={`tel:${hotline.number}`}
                    className="flex min-h-tap-lg flex-col justify-center rounded-control border border-line-strong bg-surface px-3 py-2 transition-colors duration-120 hover:border-accent"
                  >
                    <span className="text-label font-normal text-fg-2">{hotline.name}</span>
                    <span className="font-mono text-num-lg font-semibold tabular-nums text-fg-1">
                      {hotline.number}
                    </span>
                    <span className="text-label font-normal text-fg-3 line-clamp-1">{hotline.role}</span>
                  </a>
                ))}
              </div>

              {/* Step-by-step immediate actions */}
              <section className="mt-stack" aria-labelledby="guide-during">
                <h3 id="guide-during" className="mb-2 flex items-center gap-2 text-heading text-fg-1">
                  <AlertTriangle className="h-5 w-5 text-sev-warning" aria-hidden="true" />
                  <span>Yang dilakukan saat kejadian</span>
                </h3>
                <ol className="divide-y divide-line rounded-card border border-line">
                  {guide.duringAction.map((step) => (
                    <li key={step.step} className="flex items-start gap-3 bg-surface p-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-badge border border-line-strong font-mono text-small font-semibold tabular-nums text-fg-1">
                        {step.step}
                      </span>
                      <div>
                        <h4 className="text-body font-semibold text-fg-1">{step.title}</h4>
                        <p className="mt-0.5 text-small text-fg-2">{step.instruction}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              {/* Dos and Don'ts */}
              <div className="mt-stack grid gap-3 sm:grid-cols-2">
                <div className="rounded-card border border-line border-l-4 border-l-sev-normal bg-surface p-gutter">
                  <h4 className="mb-2 flex items-center gap-2 text-body font-semibold text-fg-1">
                    <CheckCircle2 className="h-4 w-4 text-sev-normal" aria-hidden="true" />
                    Hal Yang Harus Dilakukan
                  </h4>
                  <ul className="space-y-1.5 text-small text-fg-2">
                    {guide.dos.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sev-normal" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-card border border-line border-l-4 border-l-sev-critical bg-surface p-gutter">
                  <h4 className="mb-2 flex items-center gap-2 text-body font-semibold text-fg-1">
                    <XCircle className="h-4 w-4 text-sev-critical" aria-hidden="true" />
                    Hal Yang Dilarang Keras
                  </h4>
                  <ul className="space-y-1.5 text-small text-fg-2">
                    {guide.donts.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-sev-critical" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-stack flex justify-end border-t border-line pt-3">
                <button
                  type="button"
                  onClick={() => setShowGuideModal(false)}
                  className="flex min-h-tap items-center rounded-control border border-line-strong px-4 text-body font-semibold text-fg-1 transition-colors duration-120 hover:bg-surface"
                >
                  Tutup Panduan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
