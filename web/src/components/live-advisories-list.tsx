'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { VolcanoAdvisory } from '@/lib/types';
import { formatWibDateTime } from '@/lib/parser/date-utils';
import { formatAltitudeCompact, formatMovementHuman } from '@/lib/aviation-format';
import {
  Clock,
  ArrowRight,
  RefreshCw,
  Search,
  ChevronDown,
  ChevronUp,
  FileText,
} from 'lucide-react';

interface LiveAdvisoriesListProps {
  initialAdvisories: VolcanoAdvisory[];
  initialUpdatedAt: string;
}

function getRelativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return 'baru saja';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} mnt lalu`;
  const diffHr = Math.floor(diffMin / 60);
  return `${diffHr} j ${diffMin % 60} mnt lalu`;
}

export function LiveAdvisoriesList({
  initialAdvisories,
  initialUpdatedAt,
}: LiveAdvisoriesListProps) {
  const [advisories, setAdvisories] = useState<VolcanoAdvisory[]>(initialAdvisories);
  const [updatedAt, setUpdatedAt] = useState(initialUpdatedAt);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshFailed, setRefreshFailed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [relativeTime, setRelativeTime] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRawId, setExpandedRawId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    setRelativeTime(getRelativeTime(initialUpdatedAt));
  }, [initialUpdatedAt]);

  // Update relative time every 30s
  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      setRelativeTime(getRelativeTime(updatedAt));
    }, 30_000);
    return () => clearInterval(interval);
  }, [mounted, updatedAt]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setRefreshFailed(false);
    try {
      const res = await fetch(`/api/advisories?fresh=1&t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.advisories && data.advisories.length > 0) {
          setAdvisories(data.advisories);
        }
        setUpdatedAt(data.updatedAt || new Date().toISOString());
        setRelativeTime(getRelativeTime(data.updatedAt || new Date().toISOString()));
      } else {
        setRefreshFailed(true);
      }
    } catch (err) {
      console.warn('Advisories refresh failed:', err);
      setRefreshFailed(true);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Auto-poll every 3 minutes
  useEffect(() => {
    const interval = setInterval(handleRefresh, 3 * 60 * 1000);
    return () => clearInterval(interval);
  }, [handleRefresh]);

  const filteredAdvisories = useMemo(() => {
    if (!searchQuery.trim()) return advisories;
    const q = searchQuery.toLowerCase();
    return advisories.filter(
      (a) =>
        a.volcanoName.toLowerCase().includes(q) ||
        a.area.toLowerCase().includes(q) ||
        a.advisoryNumber.toLowerCase().includes(q) ||
        a.primaryFlightLevel.toLowerCase().includes(q)
    );
  }, [advisories, searchQuery]);

  return (
    <div className="space-y-gutter">
      {/* Live Status & Search Bar */}
      <div className="flex flex-col gap-row sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-3" aria-hidden="true" />
          <input
            type="search"
            aria-label="Cari advisori"
            placeholder="Cari nama gunung atau flight level…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="min-h-tap w-full rounded-control border border-line-strong bg-surface pl-9 pr-gutter text-body text-fg-1 placeholder:text-fg-3 focus:border-accent"
          />
        </div>

        <div className="flex items-center justify-between gap-row sm:justify-end">
          <div className="flex items-center gap-cell text-small">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="relative inline-flex h-2 w-2 animate-pulse rounded-full bg-sev-normal motion-reduce:animate-none" />
            </span>
            <span className="text-fg-2" suppressHydrationWarning>
              Diperbarui {mounted ? relativeTime : 'baru saja'}
            </span>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex min-h-tap items-center gap-1.5 rounded-control border border-line-strong px-row text-small font-semibold text-fg-1 transition-colors duration-120 hover:border-accent hover:text-accent disabled:opacity-60"
            title="Muat ulang buletin Darwin VAAC"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-accent motion-reduce:animate-none' : ''}`}
              aria-hidden="true"
            />
            <span>{isRefreshing ? 'Memuat…' : 'Muat ulang'}</span>
          </button>
        </div>
      </div>

      {refreshFailed && (
        <p
          role="alert"
          className="rounded-card border border-line border-l-4 border-l-sev-warning bg-surface px-gutter py-row text-small text-fg-2"
        >
          <strong className="font-semibold text-fg-1">Gagal memuat ulang.</strong> Daftar di bawah adalah buletin terakhir yang berhasil dimuat; coba lagi beberapa saat lagi.
        </p>
      )}

      {/* Advisories Count */}
      <div
        className="flex flex-wrap items-center justify-between gap-x-gutter gap-y-1 border-b border-line pb-cell text-small text-fg-3"
        role="status"
        aria-atomic="true"
      >
        <span>
          Menampilkan <strong className="font-mono font-semibold text-fg-1 tabular-nums">{filteredAdvisories.length}</strong> dari{' '}
          <strong className="font-mono font-semibold text-fg-1 tabular-nums">{advisories.length}</strong> buletin
        </span>
        <span className="font-mono tabular-nums" suppressHydrationWarning>
          Buletin per {formatWibDateTime(updatedAt)}
        </span>
      </div>

      {/* Advisories Grid (Human-readable format per tugas.md) */}
      <div
        className={`space-y-4 transition-opacity duration-120 ${isRefreshing ? 'opacity-60' : ''}`}
        aria-busy={isRefreshing}
      >
        {filteredAdvisories.map((adv) => {
          const isRawExpanded = expandedRawId === adv.id;

          return (
            <div
              key={adv.id}
              className="rounded-card border border-line bg-surface p-gutter transition-colors duration-120 hover:border-line-strong"
            >
              <div className="flex flex-col gap-gutter sm:flex-row sm:items-start sm:justify-between">
                {/* Advisory Information Header */}
                <div className="flex-1 space-y-row">
                  <div className="flex flex-wrap items-baseline gap-x-row gap-y-1">
                    <h2 className="text-title text-fg-1">{adv.volcanoName}</h2>
                    <span className="font-mono text-small text-fg-3 tabular-nums">
                      Advisori abu · {formatWibDateTime(adv.dtg)}
                    </span>
                    <span className="font-mono text-small text-fg-3 tabular-nums">
                      #{adv.advisoryNumber}
                    </span>
                  </div>

                  {/* Human readable parameters */}
                  <div className="grid max-w-xl grid-cols-1 gap-x-stack gap-y-row sm:grid-cols-2">
                    <div>
                      <span className="block text-label text-fg-3">Ketinggian abu</span>
                      <strong className="font-mono text-num font-semibold text-fg-1 tabular-nums">
                        {formatAltitudeCompact(adv.primaryFlightLevel)}
                      </strong>
                    </div>

                    <div>
                      <span className="block text-label text-fg-3">Arah sebaran</span>
                      <strong className="text-body font-semibold text-fg-1">
                        {formatMovementHuman(adv.primaryMovement)}
                      </strong>
                    </div>
                  </div>

                  {/* Expandable Technical Raw Bulletin (Hidden by default per tugas.md) */}
                  <div>
                    <button
                      onClick={() => setExpandedRawId(isRawExpanded ? null : adv.id)}
                      aria-expanded={isRawExpanded}
                      className="inline-flex min-h-tap items-center gap-1.5 text-small text-fg-2 transition-colors duration-120 hover:text-fg-1"
                    >
                      <FileText className="h-4 w-4" aria-hidden="true" />
                      <span>{isRawExpanded ? 'Sembunyikan buletin mentah' : 'Lihat buletin mentah'}</span>
                      {isRawExpanded ? (
                        <ChevronUp className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <ChevronDown className="h-4 w-4" aria-hidden="true" />
                      )}
                    </button>

                    {isRawExpanded && (
                      <div className="mt-1 space-y-1 break-words rounded-control border border-line bg-bg p-row font-mono text-small text-fg-2">
                        <p><span className="text-fg-3">DTG:</span> {adv.dtgRaw}</p>
                        <p><span className="text-fg-3">VAAC:</span> DARWIN</p>
                        <p><span className="text-fg-3">VOLCANO:</span> {adv.volcanoName}</p>
                        <p><span className="text-fg-3">AREA:</span> {adv.area}</p>
                        <p><span className="text-fg-3">INFO SOURCE:</span> {adv.infoSource || 'HIMAWARI-9'}</p>
                        {adv.eruptionDetails && (
                          <p><span className="text-fg-3">ERUPTION DETAILS:</span> {adv.eruptionDetails}</p>
                        )}
                        {adv.remarks && (
                          <p><span className="text-fg-3">RMK:</span> {adv.remarks}</p>
                        )}
                        <p><span className="text-fg-3">NEXT ADVISORY:</span> {adv.nextAdvisory || 'AS REQUIRED'}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* CTA */}
                <div className="flex shrink-0 items-center justify-between gap-row sm:flex-col sm:items-end">
                  <Link
                    href={`/advisories/${adv.id}`}
                    className="flex min-h-tap items-center gap-1.5 rounded-control bg-accent px-gutter text-small font-semibold text-fg-inverse transition-colors duration-120 hover:bg-accent-hover"
                  >
                    <span>Baca advisori</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>

                  <Link
                    href={`/map?lat=${adv.position?.latitude || -6}&lng=${adv.position?.longitude || 106}&label=${encodeURIComponent(
                      adv.volcanoName
                    )}`}
                    className="inline-flex min-h-tap items-center text-small font-semibold text-accent transition-colors duration-120 hover:text-accent-hover"
                  >
                    Lihat di peta
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        {filteredAdvisories.length === 0 && (
          <div className="rounded-card border border-line bg-surface p-gutter text-center">
            <p className="text-body font-semibold text-fg-1">
              {searchQuery.trim()
                ? <>Tidak ada advisori yang cocok dengan &ldquo;{searchQuery}&rdquo;</>
                : 'Tidak ada advisori abu aktif di buletin Darwin VAAC terakhir.'}
            </p>
            {searchQuery.trim() && (
              <p className="mt-1 text-small text-fg-2">
                Coba nama gunung, mis. Semeru, Ibu, Krakatau.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
