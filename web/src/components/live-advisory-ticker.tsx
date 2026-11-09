'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { VolcanoAdvisory } from '@/lib/types';
import { formatWibDateTime } from '@/lib/parser/date-utils';
import { ArrowRight, RefreshCw } from 'lucide-react';

interface LiveAdvisoryTickerProps {
  initialAdvisories: VolcanoAdvisory[];
  initialUpdatedAt: string;
  totalActiveVolcanoes: number;
}

function getRelativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return 'just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  return `${diffHr}h ${diffMin % 60}m ago`;
}

export function LiveAdvisoryTicker({
  initialAdvisories,
  initialUpdatedAt,
  totalActiveVolcanoes: initialTotal,
}: LiveAdvisoryTickerProps) {
  const [advisories, setAdvisories] = useState<VolcanoAdvisory[]>(initialAdvisories);
  const [updatedAt, setUpdatedAt] = useState(initialUpdatedAt);
  const [totalActive, setTotalActive] = useState(initialTotal);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [relativeTime, setRelativeTime] = useState('');
  const [hasNewData, setHasNewData] = useState(false);

  useEffect(() => {
    setMounted(true);
    setRelativeTime(getRelativeTime(initialUpdatedAt));
  }, [initialUpdatedAt]);

  // Update relative time every 30 seconds
  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      setRelativeTime(getRelativeTime(updatedAt));
    }, 30_000);
    return () => clearInterval(interval);
  }, [mounted, updatedAt]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch(`/api/advisories?fresh=1&t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.deduplicated && data.deduplicated.length > 0) {
          // Check if data actually changed
          const newIds = data.deduplicated.map((a: VolcanoAdvisory) => a.id).join(',');
          const oldIds = advisories.map((a) => a.id).join(',');
          if (newIds !== oldIds) {
            setHasNewData(true);
            setTimeout(() => setHasNewData(false), 2000);
          }
          setAdvisories(data.deduplicated);
          setTotalActive(data.totalActiveVolcanoes);
        }
        setUpdatedAt(data.updatedAt || new Date().toISOString());
        setRelativeTime(getRelativeTime(data.updatedAt || new Date().toISOString()));
      }
    } catch (err) {
      console.warn('Advisory ticker refresh failed:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, [advisories]);

  // Auto-poll every 3 minutes
  useEffect(() => {
    const interval = setInterval(handleRefresh, 3 * 60 * 1000);
    return () => clearInterval(interval);
  }, [handleRefresh]);

  return (
    <section className="mt-section" aria-labelledby="ticker-heading">
      {/* Status bar: satu-satunya indikator "data live" (polling 3 menit) */}
      <div className="mb-stack flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-card border border-line bg-surface px-gutter py-2">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-small">
          <span className="inline-flex items-center gap-2 font-semibold text-fg-1">
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full bg-sev-normal animate-pulse motion-reduce:animate-none"
            />
            LIVE
          </span>
          <span className="text-fg-1">
            <span className="font-mono tabular-nums">{totalActive}</span> Active Advisories
          </span>
          <span className="hidden text-fg-3 sm:inline">Source: Darwin VAAC</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-small text-fg-3" suppressHydrationWarning>
            Synced {mounted ? relativeTime : 'just now'}
          </span>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex size-tap items-center justify-center rounded-control border border-line text-fg-2 transition-colors duration-120 hover:bg-raised hover:text-fg-1 disabled:opacity-50"
            aria-label="Refresh advisory data"
          >
            <RefreshCw
              aria-hidden="true"
              className={`h-4 w-4 ${isRefreshing ? 'animate-spin motion-reduce:animate-none' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* Ringkasan perubahan untuk pembaca layar */}
      <p role="status" aria-atomic="true" className="sr-only" suppressHydrationWarning>
        {totalActive} active advisories, updated {formatWibDateTime(updatedAt)}.
      </p>

      {/* Section Header */}
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="ticker-heading" className="text-title text-fg-1 md:text-title-lg">
          Current Active Volcano Plumes
        </h2>
        <span className="font-mono text-small tabular-nums text-fg-3" suppressHydrationWarning>
          Updated: {formatWibDateTime(updatedAt)}
        </span>
      </div>

      {/* Advisory Cards Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {advisories.slice(0, 4).map((adv) => (
          <Link
            key={adv.id}
            href={`/advisories/${adv.id}`}
            className={`group flex flex-col rounded-card border border-l-4 border-l-sev-ash p-gutter transition-colors duration-120 ${
              hasNewData
                ? 'border-sev-ash bg-sev-ash-soft'
                : 'border-line bg-surface hover:border-line-strong hover:bg-raised'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-label text-sev-ash">Ash</p>
                <h3 className="mt-0.5 text-heading text-fg-1">{adv.volcanoName}</h3>
                <p className="text-small text-fg-3">{adv.area}</p>
              </div>
              <span className="shrink-0 rounded-badge border border-line px-1.5 py-0.5 font-mono text-label font-normal tabular-nums text-fg-2">
                #{adv.advisoryNumber}
              </span>
            </div>

            <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-small">
              <dt className="text-fg-3">Flight Level</dt>
              <dd className="text-right font-mono font-semibold tabular-nums text-fg-1">
                {adv.primaryFlightLevel}
              </dd>
              <dt className="text-fg-3">Movement</dt>
              <dd className="text-right font-mono tabular-nums text-fg-1">{adv.primaryMovement}</dd>
            </dl>

            <div className="mt-auto flex items-center justify-between border-t border-line pt-2 text-small">
              <span className="text-fg-3">{adv.polygons.length} polygon layers</span>
              <span className="inline-flex items-center gap-1 font-semibold text-accent group-hover:text-accent-hover">
                Details
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Show all link if more than 4 */}
      {advisories.length > 4 && (
        <div className="mt-stack">
          <Link
            href="/advisories"
            className="inline-flex min-h-tap items-center gap-2 rounded-control border border-line px-4 text-body font-semibold text-accent transition-colors duration-120 hover:border-line-strong hover:text-accent-hover"
          >
            View All {advisories.length} Advisories
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      )}
    </section>
  );
}
