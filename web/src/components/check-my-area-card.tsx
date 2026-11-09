'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { VolcanoAdvisory, LatLng } from '@/lib/types';
import { checkLocationAshStatus, LocationCheckResult } from '@/lib/geo-checker';
import { searchIndonesiaPlaces, IndonesiaPlace } from '@/lib/indonesia-places';
import { getMagmaVolcanoStatus } from '@/lib/magma-status';
import {
  MapPin,
  Crosshair,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  ChevronRight,
  Loader2,
  X,
} from 'lucide-react';

interface CheckMyAreaCardProps {
  advisories: VolcanoAdvisory[];
  initialLocation?: LatLng | null;
  initialLocationName?: string;
  onLocationSelected?: (loc: LatLng, name: string) => void;
  compact?: boolean;
}

export function CheckMyAreaCard({
  advisories,
  initialLocation,
  initialLocationName,
  onLocationSelected,
  compact = false,
}: CheckMyAreaCardProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialLocationName || '');
  const [suggestions, setSuggestions] = useState<IndonesiaPlace[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [result, setResult] = useState<LocationCheckResult | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // If initial location provided, evaluate it
  useEffect(() => {
    if (initialLocation && advisories.length > 0) {
      const res = checkLocationAshStatus(initialLocation, advisories, initialLocationName);
      setResult(res);
    }
  }, [initialLocation, initialLocationName, advisories]);

  // Click outside listener for suggestions
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleQueryChange = (text: string) => {
    setQuery(text);
    setGeoError(null);
    if (text.trim().length >= 2) {
      const matches = searchIndonesiaPlaces(text);
      setSuggestions(matches);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectPlace = (place: IndonesiaPlace) => {
    setQuery(place.name);
    setShowSuggestions(false);
    const res = checkLocationAshStatus(place.coordinates, advisories, place.name);
    setResult(res);
    if (onLocationSelected) {
      onLocationSelected(place.coordinates, place.name);
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const userLoc: LatLng = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        const label = 'My Location (GPS)';
        setQuery(label);
        const res = checkLocationAshStatus(userLoc, advisories, label);
        setResult(res);

        if (onLocationSelected) {
          onLocationSelected(userLoc, label);
        }
      },
      (error) => {
        setIsLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setGeoError('Location permission denied. You can search your city above.');
        } else {
          setGeoError('Unable to retrieve your location. Please search manually.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleReset = () => {
    setQuery('');
    setResult(null);
    setGeoError(null);
  };

  const mapHref = (label: string) =>
    result
      ? `/map?lat=${result.coordinates.latitude}&lng=${result.coordinates.longitude}&label=${encodeURIComponent(
          result.locationName || label
        )}`
      : '/map';

  const row = 'flex items-baseline justify-between gap-3 border-b border-line py-1.5 last:border-b-0';

  return (
    <div className={`rounded-card border border-line bg-surface ${compact ? 'p-gutter' : 'p-gutter sm:p-6'}`}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          <MapPin className="mt-1 h-4 w-4 shrink-0 text-fg-2" aria-hidden="true" />
          <div>
            <h2 className="text-heading text-fg-1">Check My Area</h2>
            <p className="text-small text-fg-2">
              Determine if your location overlaps active or forecast volcanic ash
            </p>
          </div>
        </div>

        {result && (
          <button
            type="button"
            onClick={handleReset}
            className="flex min-h-tap shrink-0 items-center gap-1 rounded-control px-2 text-small text-fg-2 transition-colors duration-120 hover:bg-raised hover:text-fg-1 md:min-h-10"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Search and GPS controls */}
      <div className="relative mt-3" ref={dropdownRef}>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-3" aria-hidden="true" />
            <input
              type="text"
              aria-label="Search city, airport, or place"
              placeholder="Search city, airport, or place (e.g. Jakarta, Bali, Surabaya)..."
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              onFocus={() => {
                if (query.trim().length >= 2) setShowSuggestions(true);
              }}
              className="min-h-tap w-full rounded-control border border-line-strong bg-bg pl-9 pr-3 text-body text-fg-1 placeholder:text-fg-3 transition-colors duration-120 focus:border-accent"
            />
          </div>

          <button
            type="button"
            onClick={handleUseMyLocation}
            disabled={isLocating}
            className="flex min-h-tap shrink-0 items-center justify-center gap-2 rounded-control border border-line-strong px-4 text-small font-semibold text-fg-1 transition-colors duration-120 hover:bg-raised disabled:opacity-60"
            title="Locate via GPS"
          >
            {isLocating ? (
              <Loader2 className="h-4 w-4 animate-spin text-accent motion-reduce:animate-none" aria-hidden="true" />
            ) : (
              <Crosshair className="h-4 w-4 text-accent" aria-hidden="true" />
            )}
            <span>Use My Location</span>
          </button>
        </div>

        {/* Autocomplete Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-y-auto rounded-card border border-line-strong bg-raised p-1 shadow-float">
            {suggestions.map((place, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPlace(place)}
                className="flex min-h-tap w-full items-center justify-between gap-3 rounded-control px-3 text-left transition-colors duration-120 hover:bg-surface"
              >
                <span className="flex items-center gap-2 text-body font-semibold text-fg-1">
                  <MapPin className="h-4 w-4 text-fg-3" aria-hidden="true" />
                  {place.name}
                </span>
                <span className="text-small text-fg-3">{place.province}</span>
              </button>
            ))}
          </div>
        )}

        {/* Empty state pencarian */}
        {showSuggestions && suggestions.length === 0 && query.trim().length >= 2 && (
          <p className="mt-2 text-small text-fg-3" role="status">
            No matching place for “{query.trim()}”.
          </p>
        )}
      </div>

      {geoError && (
        <p className="mt-2 flex items-center gap-1.5 text-small text-sev-warning" role="alert">
          <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{geoError}</span>
        </p>
      )}

      {/* RESULT CARD - CASE 1, CASE 2, CASE 3 */}
      {result && (
        <div className="mt-4 border-t border-line pt-4" role="status">
          {/* CASE 1: CLEAR */}
          {result.status === 'CLEAR' && (
            <div className="rounded-card border border-line border-l-4 border-l-sev-normal bg-bg p-gutter">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-small font-semibold text-sev-normal">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  Clear
                </span>
                <span className="text-small text-fg-2">{result.locationName || 'Selected Location'}</span>
              </div>

              <h3 className="mt-2 text-heading text-fg-1">No active volcanic ash detected in this area.</h3>

              <dl className="mt-3 text-small">
                <div className={row}>
                  <dt className="text-fg-3">Nearest Ash Area</dt>
                  <dd className="font-mono tabular-nums text-fg-1">
                    {result.nearestAshDistanceKm > 0 ? `~${result.nearestAshDistanceKm} km away` : 'None within range'}
                  </dd>
                </div>
                <div className={row}>
                  <dt className="text-fg-3">Nearest Volcano</dt>
                  <dd className="font-semibold text-fg-1">{result.nearestVolcanoName}</dd>
                </div>
                <div className={row}>
                  <dt className="text-fg-3">Forecast</dt>
                  <dd className="text-right text-fg-2">No intersection with your selected location.</dd>
                </div>
              </dl>

              <div className="mt-3 flex justify-end">
                <Link
                  href={mapHref('Selected Area')}
                  className="inline-flex min-h-tap items-center gap-1 text-small font-semibold text-accent transition-colors duration-120 hover:text-accent-hover md:min-h-10"
                >
                  <span>View on Map</span>
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          )}

          {/* CASE 2: ASH AREA */}
          {result.status === 'ASH_AREA' && (
            <div className="rounded-card border border-line border-l-4 border-l-sev-critical bg-sev-critical-soft p-gutter">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-badge bg-sev-critical px-2 py-0.5 text-small font-semibold text-sev-on">
                  <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                  Ash area
                </span>
                <span className="text-small font-semibold text-fg-1">{result.locationName || 'Selected Location'}</span>
              </div>

              <h3 className="mt-2 text-heading text-fg-1">
                This location is currently inside an active volcanic ash area.
              </h3>

              {(() => {
                const magmaStatus = result.affectedVolcano ? getMagmaVolcanoStatus(result.affectedVolcano) : null;
                return (
                  <dl className="mt-3 text-small">
                    <div className={row}>
                      <dt className="text-fg-3">Gunung Api</dt>
                      <dd className="font-semibold text-fg-1">{result.affectedVolcano}</dd>
                    </div>
                    {magmaStatus && (
                      <div className={row}>
                        <dt className="text-fg-3">Status MAGMA ESDM</dt>
                        <dd className="flex items-center gap-1.5 font-semibold text-fg-1">
                          <span
                            aria-hidden="true"
                            className="h-2.5 w-2.5 rounded-badge"
                            style={{ backgroundColor: magmaStatus.color }}
                          />
                          {magmaStatus.levelRoman} ({magmaStatus.levelName})
                        </dd>
                      </div>
                    )}
                    <div className={row}>
                      <dt className="text-fg-3">Status Abu</dt>
                      <dd className="font-semibold text-sev-ash">Teramati (Observed)</dd>
                    </div>
                    <div className={row}>
                      <dt className="text-fg-3">Ketinggian Abu</dt>
                      <dd className="font-mono tabular-nums text-fg-1">
                        {result.flightLevel} ({result.humanAltitude})
                      </dd>
                    </div>
                    <div className={row}>
                      <dt className="text-fg-3">Arah Pergerakan</dt>
                      <dd className="text-fg-1">{result.humanMovement}</dd>
                    </div>
                    <div className={row}>
                      <dt className="text-fg-3">Masa Berlaku</dt>
                      <dd className="text-fg-2">Buletin Terkini</dd>
                    </div>
                  </dl>
                );
              })()}

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <span className="text-small text-fg-2">Consult official local authorities for safety actions.</span>
                <Link
                  href={mapHref('Ash Area')}
                  className="inline-flex min-h-tap items-center gap-1.5 rounded-control bg-accent px-4 text-small font-semibold text-fg-inverse transition-colors duration-120 hover:bg-accent-hover"
                >
                  <span>Inspect on Live Map</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          )}

          {/* CASE 3: FORECAST ASH */}
          {result.status === 'FORECAST_OVERLAP' && (
            <div className="rounded-card border border-line border-l-4 border-l-sev-warning bg-sev-warning-soft p-gutter">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-small font-semibold text-sev-warning">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                  Forecast ash
                </span>
                <span className="text-small text-fg-2">{result.locationName || 'Selected Location'}</span>
              </div>

              <h3 className="mt-2 text-heading text-fg-1">
                This location is currently outside observed ash, but a forecast ash area overlaps this location.
              </h3>

              <dl className="mt-3 text-small">
                <div className={row}>
                  <dt className="text-fg-3">Forecast Horizon</dt>
                  <dd className="font-mono font-semibold tabular-nums text-fg-1">{result.forecastHorizon}</dd>
                </div>
                <div className={row}>
                  <dt className="text-fg-3">Volcano</dt>
                  <dd className="font-semibold text-fg-1">{result.affectedVolcano}</dd>
                </div>
                <div className={row}>
                  <dt className="text-fg-3">Ash Altitude</dt>
                  <dd className="font-mono tabular-nums text-fg-1">{result.humanAltitude}</dd>
                </div>
                <div className={row}>
                  <dt className="text-fg-3">Movement</dt>
                  <dd className="text-fg-1">{result.humanMovement}</dd>
                </div>
              </dl>

              <div className="mt-3 flex justify-end">
                <Link
                  href={mapHref('Forecast Ash')}
                  className="inline-flex min-h-tap items-center gap-1 text-small font-semibold text-accent transition-colors duration-120 hover:text-accent-hover md:min-h-10"
                >
                  <span>View Forecast on Map</span>
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
