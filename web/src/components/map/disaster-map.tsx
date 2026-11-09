'use client';

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import type { Map as LeafletMap, LayerGroup } from 'leaflet';
import Link from 'next/link';
import { DisasterEvent, DisasterType, TimelinePeriod, DisasterSourceHealth, DisasterHazardZone } from '@/lib/disasters/types';
import { VolcanoAdvisory, LatLng } from '@/lib/types';
import { LAYER_COLORS, CATEGORY_MARKER_COLORS } from '@/lib/palette';
import { formatWibDateTime } from '@/lib/parser/date-utils';
import { searchIndonesiaPlaces, IndonesiaPlace } from '@/lib/indonesia-places';
import { getAllMonitoredVolcanoes, MonitoredVolcanoItem } from '@/lib/magma-status';
import { DISASTER_SAFETY_GUIDES } from '@/lib/safety-guides';
import { haversineDistanceKm } from '@/lib/geo-checker';
import {
  getCachedUserLocation,
  saveUserLocation,
  resolveUserLocation,
  CachedUserLocation,
} from '@/lib/user-location-cache';
import { LocationAlertBanner } from '@/components/location-alert-banner';
import { AirQualityCard } from '@/components/air-quality-card';
import {
  Crosshair,
  X,
  ExternalLink,
  ChevronRight,
  Layers,
  Search,
  MapPin,
  Clock,
  Plus,
  Minus,
  Mountain,
  Flame,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Radio,
  AlertTriangle,
  Wind,
  Compass,
} from 'lucide-react';

import { DisasterIcon, createDisasterMarkerHtml } from '@/components/icons/disaster-icons';

interface DisasterMapProps {
  initialEvents: DisasterEvent[];
  advisories: VolcanoAdvisory[];
  sources: DisasterSourceHealth[];
  hazardZones: DisasterHazardZone[];
  initialUpdatedAt?: string;
  initialLat?: number | null;
  initialLng?: number | null;
  initialLabel?: string | null;
  onRefresh?: () => void;
  isLoading?: boolean;
}

function getRelativeTime(dateStr?: string): string {
  if (!dateStr) return 'baru saja';
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return 'baru saja';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m lalu`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}j lalu`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}h lalu`;
}

// Visual styling and labels for each disaster category
const SEVERITY_LABEL: Record<string, string> = {
  critical: 'Kritis',
  high: 'Tinggi',
  moderate: 'Waspada',
  low: 'Rendah',
};

const DISASTER_VISUALS: Record<DisasterType, { color: string; label: string }> = {
  earthquake: { color: CATEGORY_MARKER_COLORS.earthquake, label: 'Gempa Bumi' },
  flood: { color: CATEGORY_MARKER_COLORS.flood, label: 'Banjir' },
  volcano: { color: CATEGORY_MARKER_COLORS.volcano, label: 'Gunung Api' },
  'volcanic-ash': { color: CATEGORY_MARKER_COLORS['volcanic-ash'], label: 'Abu Vulkanik' },
  landslide: { color: CATEGORY_MARKER_COLORS.landslide, label: 'Tanah Longsor' },
  'forest-fire': { color: CATEGORY_MARKER_COLORS['forest-fire'], label: 'Karhutla' },
  'extreme-weather': { color: CATEGORY_MARKER_COLORS['extreme-weather'], label: 'Cuaca Ekstrem' },
  tsunami: { color: CATEGORY_MARKER_COLORS.tsunami, label: 'Tsunami' },
  drought: { color: CATEGORY_MARKER_COLORS.drought, label: 'Kekeringan' },
  'coastal-hazard': { color: CATEGORY_MARKER_COLORS['coastal-hazard'], label: 'Bahaya Pesisir' },
};

export default function DisasterMap({
  initialEvents,
  advisories,
  sources,
  hazardZones,
  initialUpdatedAt,
  initialLat,
  initialLng,
  initialLabel,
  onRefresh,
  isLoading,
}: DisasterMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);

  // Layer groups for precise visibility control
  const eventLayerGroupRef = useRef<LayerGroup | null>(null);
  const ashPolygonLayerGroupRef = useRef<LayerGroup | null>(null);
  const hazardLayerGroupRef = useRef<LayerGroup | null>(null);
  const userLocationLayerRef = useRef<LayerGroup | null>(null);

  const [mounted, setMounted] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const [events, setEvents] = useState<DisasterEvent[]>(initialEvents || []);
  const [selectedTimeline, setSelectedTimeline] = useState<TimelinePeriod>('LIVE');
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string>(initialUpdatedAt || '');
  const [relativeTime, setRelativeTime] = useState('');

  // Selected event or volcano
  const [selectedEvent, setSelectedEvent] = useState<DisasterEvent | null>(null);
  const [selectedAdvisory, setSelectedAdvisory] = useState<VolcanoAdvisory | null>(null);
  const [showSafetyGuide, setShowSafetyGuide] = useState(false);

  // User location cache & status
  const [cachedUserLoc, setCachedUserLoc] = useState<CachedUserLocation | null>(null);
  const [isLocatingGps, setIsLocatingGps] = useState(false);

  // Active layer filter toggles
  const [activeCategories, setActiveCategories] = useState<Record<DisasterType, boolean>>({
    earthquake: true,
    flood: true,
    volcano: true,
    'volcanic-ash': true,
    landslide: true,
    'forest-fire': true,
    'extreme-weather': true,
    tsunami: true,
    drought: true,
    'coastal-hazard': true,
  });

  const [showAshForecast, setShowAshForecast] = useState(true);
  const [showHazardZones, setShowHazardZones] = useState(true);
  const [showRecentActivity, setShowRecentActivity] = useState(true);
  const [showMobileActivitySheet, setShowMobileActivitySheet] = useState(false);
  const [showLayersMenu, setShowLayersMenu] = useState(false);
  const [showSourceStatus, setShowSourceStatus] = useState(false);
  const [showAirQualityModal, setShowAirQualityModal] = useState(false);

  // Search & Autocomplete state
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<IndonesiaPlace[]>([]);
  const [volcanoSuggestions, setVolcanoSuggestions] = useState<MonitoredVolcanoItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const allMonitoredVolcanoes = useMemo(() => getAllMonitoredVolcanoes(), []);

  // Update relative time
  useEffect(() => {
    setMounted(true);
    setRelativeTime(getRelativeTime(lastRefreshedAt));
    const interval = setInterval(() => {
      setRelativeTime(getRelativeTime(lastRefreshedAt));
    }, 30_000);
    return () => clearInterval(interval);
  }, [lastRefreshedAt]);

  // Client-side initial sync or fetch if initialEvents is empty
  useEffect(() => {
    if (initialEvents && initialEvents.length > 0) {
      setEvents(initialEvents);
    } else {
      fetch('/api/disasters?period=LIVE')
        .then((res) => res.json())
        .then((data) => {
          if (data?.events?.length) {
            setEvents(data.events);
            setLastRefreshedAt(data.lastUpdated || new Date().toISOString());
          }
        })
        .catch((e) => console.warn('Disaster data initial client fetch fallback:', e));
    }
  }, [initialEvents]);

  // Sync cached location
  useEffect(() => {
    const loc = getCachedUserLocation();
    setCachedUserLoc(loc);

    const handleUpdate = () => {
      setCachedUserLoc(getCachedUserLocation());
    };
    const handleClear = () => {
      setCachedUserLoc(null);
    };

    window.addEventListener('disaster-radar:location-updated', handleUpdate);
    window.addEventListener('disaster-radar:location-cleared', handleClear);

    return () => {
      window.removeEventListener('disaster-radar:location-updated', handleUpdate);
      window.removeEventListener('disaster-radar:location-cleared', handleClear);
    };
  }, []);

  // Filter events based on active category toggles and explicitly sort newest first
  const filteredEvents = useMemo(() => {
    const now = Date.now();
    return events
      .filter((ev) => {
        if (!activeCategories[ev.type]) return false;
        // Strict requirement: Gempa yang ditampilkan hanya 24 jam kebelakang
        if (ev.type === 'earthquake') {
          const evTime = new Date(ev.eventTime || ev.updatedAt || 0).getTime();
          if (now - evTime > 24 * 3600 * 1000) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.eventTime || a.updatedAt || 0).getTime();
        const timeB = new Date(b.eventTime || b.updatedAt || 0).getTime();
        return timeB - timeA;
      });
  }, [events, activeCategories]);

  // Autocomplete outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Timeline selector changes
  const handleTimelineChange = async (period: TimelinePeriod) => {
    setSelectedTimeline(period);
    try {
      const res = await fetch(`/api/disasters?period=${period}&t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.events) {
          setEvents(data.events);
          setLastRefreshedAt(data.lastUpdated);
        }
      }
    } catch (e) {
      console.warn('Failed to switch timeline period:', e);
    }
  };

  // Toggle category
  const toggleCategory = (cat: DisasterType) => {
    setActiveCategories((prev) => ({
      ...prev,
      [cat]: !prev[cat],
    }));
  };

  // Autocomplete search change
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    if (text.trim().length >= 2) {
      const q = text.trim().toLowerCase();
      const placeMatches = searchIndonesiaPlaces(text);
      setSuggestions(placeMatches);

      const vMatches = allMonitoredVolcanoes.filter(
        (v) =>
          v.volcanoName.toLowerCase().includes(q) ||
          v.area.toLowerCase().includes(q) ||
          v.island.toLowerCase().includes(q)
      );
      setVolcanoSuggestions(vMatches.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setVolcanoSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Render User Location Pin on Map
  const renderUserMarker = useCallback((loc: LatLng, label: string) => {
    const map = mapInstanceRef.current;
    const userGroup = userLocationLayerRef.current;
    if (!map || !userGroup) return;

    userGroup.clearLayers();
    import('leaflet').then((LModule) => {
      const L = LModule.default;
      const markerHtml = `
        <div class="relative flex h-8 w-8 items-center justify-center select-none" style="transform: translate(-50%, -50%);">
          <span class="user-gps-ring" style="background-color: color-mix(in srgb, var(--accent) 35%, transparent); border: 1.5px solid var(--accent);"></span>
          <div class="relative flex h-4 w-4 items-center justify-center rounded-full bg-fg-1 border-2 border-accent">
            <div class="h-2 w-2 rounded-full bg-accent"></div>
          </div>
        </div>
      `;

      const userMarker = L.marker([loc.latitude, loc.longitude], {
        icon: L.divIcon({
          html: markerHtml,
          className: 'user-location-pin',
          iconSize: [0, 0],
        }),
      });

      userMarker.bindTooltip(`${label}`, {
        permanent: false,
        direction: 'top',
        className: 'user-tooltip',
      });

      userGroup.addLayer(userMarker);
    });
  }, []);

  // Fly to location and save as cached location
  const handleSelectPlace = (place: IndonesiaPlace) => {
    setSearchQuery(place.name);
    setShowSuggestions(false);

    const saved = saveUserLocation(place.coordinates, place.name, false);
    setCachedUserLoc(saved);

    const map = mapInstanceRef.current;
    if (map) {
      map.flyTo([place.coordinates.latitude, place.coordinates.longitude], 8.5, { duration: 1.2 });
      renderUserMarker(place.coordinates, place.name);
    }
  };

  const handleSelectVolcano = (volcano: MonitoredVolcanoItem) => {
    setSearchQuery(volcano.volcanoName);
    setShowSuggestions(false);

    const matchedEv = events.find(
      (ev) => ev.type === 'volcano' && ev.metadata?.volcanoSlug === volcano.volcanoSlug
    );
    if (matchedEv) {
      setSelectedEvent(matchedEv);
    }

    const map = mapInstanceRef.current;
    if (map) {
      map.flyTo([volcano.position.latitude, volcano.position.longitude], 8.5, { duration: 1.2 });
    }
  };

  // GPS Locate Action or Fly to Saved Location
  const handleLocateUser = () => {
    setIsLocatingGps(true);
    resolveUserLocation({ timeoutMs: 8000, enableHighAccuracy: true }).then((res) => {
      setIsLocatingGps(false);
      if (res.location && mapInstanceRef.current) {
        setCachedUserLoc(res.location);
        setSearchQuery(res.location.label);
        mapInstanceRef.current.flyTo([res.location.latitude, res.location.longitude], 12, { duration: 1.2 });
        renderUserMarker({ latitude: res.location.latitude, longitude: res.location.longitude }, res.location.label);
      } else {
        const cached = getCachedUserLocation();
        if (cached && mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([cached.latitude, cached.longitude], 12, { duration: 1.2 });
          renderUserMarker({ latitude: cached.latitude, longitude: cached.longitude }, cached.label);
        } else {
          alert(
            res.error ||
              'GPS tidak aktif atau izin lokasi belum diberikan. Silakan aktifkan GPS atau gunakan kotak pencarian untuk memilih kota Anda.'
          );
        }
      }
    });
  };

  // Initialize Leaflet Map with OpenStreetMap (OSM) Provider
  useEffect(() => {
    let isSubscribed = true;

    async function initLeaflet() {
      if (!mapContainerRef.current || mapInstanceRef.current) return;
      const L = (await import('leaflet')).default;
      if (!isSubscribed || !mapContainerRef.current) return;

      // Center comfortably on Indonesian archipelago [-2.5, 118.0]
      const map = L.map(mapContainerRef.current, {
        center: [-2.5, 118.0],
        zoom: 5,
        minZoom: 3,
        maxZoom: 18,
        zoomControl: false,
      });

      // STRICT USER REQUIREMENT: Base map must use OpenStreetMap (OSM)
      const osmTileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
        maxZoom: 19,
        className: 'osm-tile-img',
      });
      osmTileLayer.addTo(map);

      // Layer groups
      const evGroup = L.layerGroup().addTo(map);
      const ashGroup = L.layerGroup().addTo(map);
      const hazardGroup = L.layerGroup().addTo(map);
      const userGroup = L.layerGroup().addTo(map);

      eventLayerGroupRef.current = evGroup;
      ashPolygonLayerGroupRef.current = ashGroup;
      hazardLayerGroupRef.current = hazardGroup;
      userLocationLayerRef.current = userGroup;
      mapInstanceRef.current = map;

      // Map click handler to inspect or set location
      map.on('click', (e) => {
        const clickedLoc: LatLng = {
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
        };
        renderUserMarker(clickedLoc, `${clickedLoc.latitude.toFixed(3)}°, ${clickedLoc.longitude.toFixed(3)}°`);
      });

      // Initial props or cached location with auto GPS detection
      if (initialLat && initialLng) {
        map.setView([initialLat, initialLng], 8.5);
        renderUserMarker({ latitude: initialLat, longitude: initialLng }, initialLabel || 'Area Terpilih');
      } else {
        const cached = getCachedUserLocation();
        if (cached) {
          // Immediately center on cached location with zero delay
          map.setView([cached.latitude, cached.longitude], 11);
          renderUserMarker({ latitude: cached.latitude, longitude: cached.longitude }, cached.label);
        }

        // Auto-detect GPS silently; if active, smoothly flies to GPS position and updates cache
        resolveUserLocation({ timeoutMs: 6000 }).then((res) => {
          if (!isSubscribed) return;
          if (res.source === 'gps' && res.location) {
            setCachedUserLoc(res.location);
            map.flyTo([res.location.latitude, res.location.longitude], 12, { duration: 1.2 });
            renderUserMarker({ latitude: res.location.latitude, longitude: res.location.longitude }, res.location.label);
          }
        });
      }

      setIsMapReady(true);
    }

    initLeaflet();

    return () => {
      isSubscribed = false;
    };
  }, [initialLat, initialLng, initialLabel, renderUserMarker]);

  // Render Disaster Event Markers whenever map is ready or filteredEvents updates
  useEffect(() => {
    if (!isMapReady) return;
    const map = mapInstanceRef.current;
    const group = eventLayerGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    import('leaflet').then((LModule) => {
      const L = LModule.default;

      filteredEvents.forEach((ev) => {
        const visual = DISASTER_VISUALS[ev.type] || DISASTER_VISUALS.earthquake;
        const isCritical = ev.severity === 'critical';

        const markerHtml = createDisasterMarkerHtml({
          type: ev.type,
          color: visual.color,
          isCritical,
          title: ev.title,
        });

        const marker = L.marker([ev.latitude, ev.longitude], {
          icon: L.divIcon({
            html: markerHtml,
            className: 'disaster-map-marker-pin',
            iconSize: [32, 40],
            iconAnchor: [16, 40],
            popupAnchor: [0, -38],
            tooltipAnchor: [0, -38],
          }),
        });

        // Hover tooltip
        marker.bindTooltip(
          `
          <div class="text-small">
            <span class="font-bold text-fg-1">${ev.title}</span>
            <div class="text-label text-fg-2 mt-0.5">${ev.locationName || ''} • ${getRelativeTime(ev.eventTime)}</div>
          </div>
          `,
          { direction: 'top', className: 'disaster-tooltip' }
        );

        // Click handler opens detail panel
        marker.on('click', () => {
          setSelectedEvent(ev);
          map.flyTo([ev.latitude, ev.longitude], Math.max(map.getZoom(), 7.5), { duration: 0.8 });
        });

        group.addLayer(marker);
      });
    });
  }, [isMapReady, filteredEvents]);

  // Render AshWatch Darwin VAAC Polygons
  useEffect(() => {
    if (!isMapReady) return;
    const map = mapInstanceRef.current;
    const group = ashPolygonLayerGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    if (!activeCategories['volcanic-ash']) return;

    import('leaflet').then((LModule) => {
      const L = LModule.default;

      (advisories || []).forEach((adv) => {
        (adv.polygons || []).forEach((poly) => {
          if (!poly.coordinates || poly.coordinates.length < 3) return;

          const isObserved = poly.type === 'observed' || poly.type === 'estimated';
          if (!isObserved && !showAshForecast) return;

          const style = LAYER_COLORS[poly.type] || LAYER_COLORS.observed;
          const latLngPairs = poly.coordinates.map((c) => [c.latitude, c.longitude] as [number, number]);

          const polygon = L.polygon(latLngPairs, {
            color: style.stroke,
            weight: isObserved ? 2 : 1.5,
            fillColor: style.fill,
            fillOpacity: style.opacity,
            dashArray: isObserved ? undefined : '5, 5',
          });

          polygon.bindTooltip(
            `
            <div class="text-small">
              <span class="font-bold text-accent">Abu Vulkanik ${adv.volcanoName}</span>
              <div class="text-label text-fg-2">${poly.type.toUpperCase()} • FL ${poly.topFlightLevel || adv.primaryFlightLevel}</div>
            </div>
            `,
            { sticky: true, className: 'ash-tooltip' }
          );

          polygon.on('click', () => {
            const matchedEv = events.find(
              (ev) => ev.type === 'volcanic-ash' && ev.metadata?.advisoryId === adv.id
            );
            if (matchedEv) {
              setSelectedEvent(matchedEv);
            }
            setSelectedAdvisory(adv);
          });

          group.addLayer(polygon);
        });
      });
    });
  }, [isMapReady, advisories, activeCategories, showAshForecast, events]);

  // Render InaRISK Hazard Zones
  useEffect(() => {
    if (!isMapReady) return;
    const map = mapInstanceRef.current;
    const group = hazardLayerGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    if (!showHazardZones) return;

    import('leaflet').then((LModule) => {
      const L = LModule.default;

      (hazardZones || []).forEach((hz) => {
        const circle = L.circle([hz.centerCoordinates.latitude, hz.centerCoordinates.longitude], {
          radius: 35000,
          color: hz.color,
          fillColor: hz.color,
          fillOpacity: 0.12,
          weight: 1.5,
          dashArray: '4, 6',
        });

        circle.bindTooltip(
          `
          <div class="text-small">
            <span class="font-bold text-fg-1">${hz.name}</span>
            <div class="text-label text-sev-warning font-semibold mt-0.5">Tingkat Risiko: ${hz.riskLevel} (${hz.source})</div>
            <div class="text-label text-fg-2 mt-0.5">${hz.description}</div>
          </div>
          `,
          { sticky: true }
        );

        group.addLayer(circle);
      });
    });
  }, [isMapReady, hazardZones, showHazardZones]);

  // Focus event on click from activity feed or alert banner
  const handleFocusEvent = (ev: DisasterEvent) => {
    setSelectedEvent(ev);
    const map = mapInstanceRef.current;
    if (map) {
      map.flyTo([ev.latitude, ev.longitude], 8, { duration: 1 });
    }
  };

  const activeGuide = selectedEvent
    ? DISASTER_SAFETY_GUIDES[selectedEvent.type] || DISASTER_SAFETY_GUIDES.earthquake
    : null;

  return (
    <div className="relative h-full w-full overflow-hidden bg-raised">
      {/* 1. Map Canvas with OpenStreetMap dark mode transformation */}
      <div ref={mapContainerRef} className="h-full w-full osm-dark-tiles" />

      {/* 2. Top Search Bar & Suggestions (Topmost on mobile) */}
      <div
        ref={searchContainerRef}
        className="absolute top-3 left-3 right-3 sm:top-4 sm:left-auto sm:right-4 sm:w-80 z-[1010] pointer-events-auto"
      >
        <div className="relative flex items-center rounded-card border border-line-strong bg-raised shadow-float">
          <Search className="ml-3.5 h-4 w-4 text-fg-2 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Cari kota, kabupaten, gunung api..."
            className="min-h-tap w-full bg-transparent px-3 text-body text-fg-1 placeholder:text-fg-3"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSuggestions([]);
                setVolcanoSuggestions([]);
                setShowSuggestions(false);
              }}
              className="mr-2 text-fg-2 hover:text-fg-1 p-1"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={handleLocateUser}
            disabled={isLocatingGps}
            title="Deteksi Lokasi Saya (GPS)"
                aria-label="Deteksi lokasi saya (GPS)"
            className="mr-0.5 flex size-tap items-center justify-center rounded-lg bg-surface hover:bg-surface text-fg-2 hover:text-fg-1 transition"
          >
            <Crosshair className={`h-3.5 w-3.5 ${isLocatingGps ? 'animate-spin text-accent' : ''}`} />
          </button>
        </div>

        {/* Autocomplete Dropdown */}
        {showSuggestions && (suggestions.length > 0 || volcanoSuggestions.length > 0) && (
          <div className="absolute top-full mt-2 w-full max-h-72 overflow-y-auto rounded-card border border-line-strong bg-raised p-2 shadow-float z-[1020]">
            {suggestions.length > 0 && (
              <div className="mb-2">
                <span className="px-2 text-label font-bold text-fg-2">
                  Kota / Wilayah
                </span>
                {suggestions.map((p) => (
                  <button
                    key={`${p.name}-${p.coordinates.latitude}`}
                    type="button"
                    onClick={() => handleSelectPlace(p)}
                    className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-small text-fg-2 hover:bg-surface transition"
                  >
                    <MapPin className="h-3.5 w-3.5 text-accent shrink-0" />
                    <span className="truncate">{p.name}</span>
                  </button>
                ))}
              </div>
            )}

            {volcanoSuggestions.length > 0 && (
              <div>
                <span className="px-2 text-label font-bold text-accent">
                  Gunung Api (PVMBG)
                </span>
                {volcanoSuggestions.map((v) => (
                  <button
                    key={v.volcanoSlug}
                    type="button"
                    onClick={() => handleSelectVolcano(v)}
                    className="flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-left text-small text-fg-2 hover:bg-surface transition"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Mountain className="h-3.5 w-3.5 text-accent shrink-0" />
                      <span className="truncate font-semibold">{v.volcanoName}</span>
                    </div>
                    <span
                      className="text-label px-2 py-0.5 rounded-full font-bold"
                      style={{ backgroundColor: v.badgeBg, color: v.badgeText }}
                    >
                      {v.levelName}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. Top Location Alert Banner (Placed safely below search on mobile, top-left on desktop) */}
      <div className="absolute top-[62px] left-3 right-3 sm:top-4 sm:left-4 sm:right-auto sm:max-w-xl z-[1000] pointer-events-auto">
        <LocationAlertBanner
          events={events}
          advisories={advisories}
          onSelectEvent={handleFocusEvent}
        />
      </div>

      {/* 4. Timeline Bar (LIVE / 1H / 6H / 24H / 30D) */}
      <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-[1000] pointer-events-auto max-w-[calc(100vw-1rem)]">
        <div className="flex items-center gap-1 rounded-card border border-line-strong bg-raised px-1.5 sm:px-2 py-1.5 shadow-float">
          <span className="flex items-center gap-1 px-2 text-label font-bold text-fg-2 hidden sm:flex">
            <Clock className="h-3 w-3" />
            <span>Periode:</span>
          </span>
          {(
            [
              { id: 'LIVE', label: 'LIVE', shortLabel: 'LIVE' },
              { id: '6H', label: '6 Jam', shortLabel: '6h' },
              { id: '12H', label: '12 Jam', shortLabel: '12h' },
              { id: '24H', label: '24 Jam', shortLabel: '24h' },
              { id: '30D', label: '30 Hari', shortLabel: '30d' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleTimelineChange(item.id as TimelinePeriod)}
              aria-pressed={selectedTimeline === item.id}
              className={`min-h-tap sm:min-h-9 rounded-control px-2.5 sm:px-3 text-small font-semibold transition-colors duration-120 whitespace-nowrap ${
                selectedTimeline === item.id
                  ? 'bg-accent text-fg-inverse'
                  : 'text-fg-2 hover:text-fg-1 hover:bg-surface'
              }`}
            >
              {item.id === 'LIVE' && (
                <span aria-hidden="true" className="inline-block h-1.5 w-1.5 rounded-full bg-sev-normal mr-1 sm:mr-1.5 animate-pulse motion-reduce:animate-none" />
              )}
              <span className="sm:hidden">{item.shortLabel}</span>
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 5. Left Floating Controls (Layer Toggles & Map Controls) */}
      <div className="absolute bottom-16 left-3 sm:bottom-6 sm:left-4 z-[1000] flex flex-col gap-2 pointer-events-auto">
        {/* Layer Selector Trigger */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowLayersMenu(!showLayersMenu)}
            className="flex size-tap items-center justify-center rounded-control border border-line-strong bg-raised text-fg-2 hover:text-fg-1 hover:bg-surface shadow-float transition-colors duration-120"
            title="Kelola Layer Peta"
            aria-label="Kelola Layer Peta"
            aria-expanded={showLayersMenu}
          >
            <Layers className="h-4 w-4" />
          </button>

          {/* Layer Controls Popover */}
          {showLayersMenu && (
            <div className="absolute bottom-12 left-0 w-64 max-h-[50svh] sm:max-h-[75vh] overflow-y-auto rounded-card border border-line-strong bg-raised p-4 shadow-float z-[1001]">
              <div className="flex items-center justify-between pb-3 border-b border-line mb-3">
                <span className="text-small font-bold text-fg-1">
                  Layer Kebencanaan
                </span>
                <button
                  type="button"
                  onClick={() => setShowLayersMenu(false)}
                  className="text-fg-2 hover:text-fg-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Live Event Categories */}
              <div className="space-y-1.5">
                <span className="text-label font-bold text-fg-2">
                  Kejadian Terkini (Live)
                </span>
                {(Object.keys(activeCategories) as DisasterType[]).map((cat) => {
                  const visual = DISASTER_VISUALS[cat];
                  const count = events.filter((e) => e.type === cat).length;
                  const isActive = activeCategories[cat];

                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`flex w-full items-center justify-between px-2.5 py-1.5 rounded-xl text-small font-medium transition ${
                        isActive ? 'bg-surface text-fg-1 font-bold' : 'text-fg-2 hover:bg-surface'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <DisasterIcon type={cat} size={15} color={visual.color} />
                        <span className="truncate">{visual.label}</span>
                      </div>
                      <span className="text-label text-fg-2">{count}</span>
                    </button>
                  );
                })}
              </div>

              {/* Hazard & Forecast Sublayers */}
              <div className="pt-3 mt-3 border-t border-line space-y-2">
                <span className="text-label font-bold text-fg-2">
                  Zona Bahaya & Prakiraan
                </span>

                <label className="flex items-center justify-between text-small text-fg-2 cursor-pointer">
                  <span>Prakiraan Abu (+6h/+12h/+18h)</span>
                  <input
                    type="checkbox"
                    checked={showAshForecast}
                    onChange={(e) => setShowAshForecast(e.target.checked)}
                    className="rounded accent-accent"
                  />
                </label>

                <label className="flex items-center justify-between text-small text-fg-2 cursor-pointer">
                  <span>Zona Risiko InaRISK BNPB</span>
                  <input
                    type="checkbox"
                    checked={showHazardZones}
                    onChange={(e) => setShowHazardZones(e.target.checked)}
                    className="rounded accent-accent"
                  />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Air Quality (ISPU) Trigger */}
        <button
          type="button"
          onClick={() => setShowAirQualityModal(!showAirQualityModal)}
          className={`flex size-tap items-center justify-center rounded-card border shadow-float transition ${
            showAirQualityModal
              ? 'border-accent bg-accent/15 text-accent'
              : 'border-line-strong bg-raised text-fg-2 hover:text-fg-1 hover:bg-surface'
          }`}
          title="Kualitas Udara & ISPU"
          aria-label="Kualitas Udara & ISPU"
        >
          <Wind className="h-4 w-4" />
        </button>

        {/* Source Health Indicator Trigger */}
        <button
          type="button"
          onClick={() => setShowSourceStatus(!showSourceStatus)}
          className="flex size-tap items-center justify-center rounded-control border border-line-strong bg-raised text-fg-2 hover:text-fg-1 hover:bg-surface shadow-float transition-colors duration-120"
          title="Status Sumber Data Resmi"
          aria-label="Status Sumber Data Resmi"
        >
          <Radio className="h-4 w-4" />
        </button>

        {/* Zoom Controls */}
        <div className="flex flex-col rounded-card border border-line-strong bg-raised shadow-float overflow-hidden">
          <button
            type="button"
            onClick={() => mapInstanceRef.current?.zoomIn()}
            aria-label="Perbesar peta"
            className="flex size-tap items-center justify-center text-fg-2 hover:text-fg-1 hover:bg-surface transition-colors duration-120"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
          <div className="h-px w-full bg-surface" />
          <button
            type="button"
            onClick={() => mapInstanceRef.current?.zoomOut()}
            aria-label="Perkecil peta"
            className="flex size-tap items-center justify-center text-fg-2 hover:text-fg-1 hover:bg-surface transition-colors duration-120"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* 6. Source Health Dialog */}
      {showSourceStatus && (
        <div className="absolute bottom-20 left-16 w-72 rounded-card border border-line-strong bg-raised p-4 shadow-float z-[1001]">
          <div className="flex items-center justify-between pb-2 border-b border-line mb-3">
            <span className="text-small font-bold text-fg-1">
              Status Sumber Data
            </span>
            <button
              type="button"
              onClick={() => setShowSourceStatus(false)}
              aria-label="Tutup status sumber data"
              className="-mr-2 -my-2 flex size-tap items-center justify-center rounded-control text-fg-2 hover:bg-surface hover:text-fg-1"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <div className="space-y-2">
            {(sources || []).map((src) => (
              <div
                key={src.id}
                className="flex items-center justify-between gap-2 p-2 rounded-control bg-surface text-small"
              >
                <div>
                  <div className="font-semibold text-fg-1">{src.name}</div>
                  <div className="text-label text-fg-2">{src.description}</div>
                </div>
                <span
                  className={`inline-flex items-center gap-1 text-label font-bold px-2 py-0.5 rounded-full ${
                    src.status === 'online'
                      ? 'bg-sev-normal-soft text-sev-normal'
                      : src.status === 'degraded'
                      ? 'bg-sev-warning-soft text-sev-warning'
                      : 'bg-sev-critical-soft text-sev-critical'
                  } shrink-0`}
                >
                  {src.status === 'online' ? 'Merespons' : src.status === 'degraded' ? 'Data cadangan' : 'Gagal dimuat'}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-2 border-t border-line flex justify-between items-center text-label text-fg-2">
            <span>Diperbarui: {relativeTime}</span>
            <button
              type="button"
              onClick={onRefresh}
              className={`-mr-2 flex min-h-tap items-center rounded-control px-2 font-semibold text-accent hover:bg-surface ${isLoading ? 'opacity-60' : ''}`}
            >
              {isLoading ? 'Menyinkronkan…' : 'Sinkronkan Sekarang'}
            </button>
          </div>
        </div>
      )}

      {/* 6b. Air Quality (ISPU) Floating Panel */}
      {showAirQualityModal && (
        <div className="absolute top-16 left-3 right-3 sm:left-16 sm:right-auto sm:top-20 z-[1001] sm:w-96 max-w-md pointer-events-auto">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowAirQualityModal(false)}
              className="absolute top-3 right-3 z-30 rounded-lg p-1 text-fg-2 hover:text-fg-1 hover:bg-surface"
              aria-label="Tutup Panel Kualitas Udara"
            >
              <X className="h-4 w-4" />
            </button>
            <AirQualityCard
              initialLat={cachedUserLoc?.latitude}
              initialLng={cachedUserLoc?.longitude}
              locationLabel={cachedUserLoc?.label}
              compact={true}
            />
          </div>
        </div>
      )}

      {/* 7. Google Maps-style Round Location FAB (Pusatkan ke Lokasi Saya / Tersimpan) */}
      <button
        type="button"
        onClick={handleLocateUser}
        disabled={isLocatingGps}
        className={`absolute bottom-28 right-3 sm:bottom-6 sm:right-4 z-[1000] flex h-11 w-11 items-center justify-center rounded-full border border-line-strong bg-raised text-fg-1 shadow-float transition-colors duration-120 hover:bg-surface hover:border-accent hover:text-accent group pointer-events-auto ${
          isLocatingGps ? 'text-accent border-accent' : ''
        }`}
        title="Pusatkan ke Lokasi Saya / Tersimpan (GPS)"
        aria-label="Pusatkan ke Lokasi Saya"
      >
        <Crosshair
          className={`h-5 w-5 transition-transform duration-120 ${
            isLocatingGps ? 'animate-spin motion-reduce:animate-none text-accent' : ''
          }`}
        />
        {cachedUserLoc && (
          <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
            
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent border border-fg-1" />
          </span>
        )}
      </button>

      {/* 7b. Mobile Floating Button for Aktivitas Terkini */}
      <button
        type="button"
        onClick={() => setShowMobileActivitySheet(true)}
        className="sm:hidden absolute bottom-16 right-3 z-[1000] flex min-h-tap items-center gap-2 px-3 rounded-card border border-line-strong bg-raised text-fg-1 shadow-float transition pointer-events-auto"
      >
        <span className="relative flex h-2 w-2">
          
          <span className="relative inline-flex rounded-full h-2 w-2 bg-sev-critical" />
        </span>
        <span className="text-small font-bold">Aktivitas</span>
        <span className="rounded-full bg-surface px-1.5 py-0.5 text-label font-bold text-fg-2">
          {filteredEvents.length}
        </span>
      </button>

      {/* 7b. Mobile Aktivitas Terkini Bottom Sheet Drawer */}
      {showMobileActivitySheet && (
        <div className="sm:hidden fixed inset-0 z-[1050] flex flex-col justify-end bg-bg/85">
          {/* Backdrop dismiss */}
          <div className="flex-1" onClick={() => setShowMobileActivitySheet(false)} />

          <div className="relative max-h-[75vh] w-full rounded-t-card border-t border-x border-line-strong bg-raised p-4 shadow-float flex flex-col pointer-events-auto">
            {/* Drag Handle */}
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-surface" />

            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-line mb-2">
              <div className="flex items-center gap-2">
                <span aria-hidden="true" className="flex h-2.5 w-2.5 rounded-full bg-sev-critical" />
                <h3 className="text-sm font-bold text-fg-1">
                  Aktivitas Bencana Terkini
                </h3>
                <span className="rounded-full bg-surface px-2 py-0.5 text-label font-bold text-fg-2">
                  {filteredEvents.length}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowMobileActivitySheet(false)}
                className="flex size-tap items-center justify-center rounded-control text-fg-2 hover:bg-surface hover:text-fg-1"
                aria-label="Tutup aktivitas"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Event list */}
            <div className="overflow-y-auto space-y-2 py-1 flex-1 pr-1">
              {filteredEvents.length === 0 ? (
                <div className="py-8 text-center text-small text-fg-2">
                  Tidak ada laporan bencana pada rentang waktu ini.
                </div>
              ) : (
                filteredEvents.map((ev) => {
                  const visual = DISASTER_VISUALS[ev.type] || DISASTER_VISUALS.earthquake;
                  const distFromUser = cachedUserLoc
                    ? haversineDistanceKm(
                        { latitude: cachedUserLoc.latitude, longitude: cachedUserLoc.longitude },
                        { latitude: ev.latitude, longitude: ev.longitude }
                      )
                    : null;

                  return (
                    <button
                      key={ev.id}
                      type="button"
                      onClick={() => {
                        handleFocusEvent(ev);
                        setShowMobileActivitySheet(false);
                      }}
                      className="flex w-full items-start gap-3 p-3 rounded-card bg-surface hover:bg-surface active:bg-surface border border-line text-left transition"
                    >
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-line"
                        style={{ backgroundColor: `${visual.color}25`, color: visual.color }}
                      >
                        <DisasterIcon type={ev.type} size={18} color={visual.color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-small font-bold text-fg-1">
                            {ev.title}
                          </span>
                          <span
                            className="shrink-0 text-label font-bold px-1.5 py-0.5 rounded"
                            style={{
                              backgroundColor:
                                ev.severity === 'critical'
                                  ? 'var(--sev-critical-soft)'
                                  : ev.severity === 'high'
                                  ? 'var(--sev-high-soft)'
                                  : ev.severity === 'moderate'
                        ? 'var(--sev-warning-soft)'
                        : 'var(--surface)',
                              color:
                                ev.severity === 'critical'
                                  ? 'var(--sev-critical)'
                                  : ev.severity === 'high'
                                  ? 'var(--sev-high)'
                                  : ev.severity === 'moderate'
                        ? 'var(--sev-warning)'
                        : 'var(--fg-2)',
                            }}
                          >
                            {SEVERITY_LABEL[ev.severity] ?? ev.severity}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 text-label text-fg-2 mt-1">
                          <span>{ev.locationName || 'Indonesia'}</span>
                          <span>•</span>
                          <span>{getRelativeTime(ev.eventTime)}</span>
                          {distFromUser !== null && (
                            <>
                              <span>•</span>
                              <span className="text-accent font-bold">
                                {distFromUser.toFixed(1)} km dari Anda
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* 7c. Collapsible Recent Activity Panel (Desktop right side) */}
      <div className="hidden lg:block absolute top-20 right-4 w-72 z-[1000] pointer-events-auto">
        <div className="rounded-card border border-line-strong bg-raised shadow-float overflow-hidden">
          <button
            type="button"
            onClick={() => setShowRecentActivity(!showRecentActivity)}
            aria-expanded={showRecentActivity}
            className="flex w-full min-h-tap items-center justify-between p-3.5 text-left cursor-pointer hover:bg-surface transition"
          >
            <span className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-fg-3" aria-hidden="true" />
              <span className="text-small font-bold text-fg-1">
                Aktivitas Terkini
              </span>
            </span>
            <span className="flex items-center gap-1.5 text-small text-fg-2">
              <span className="font-mono tabular-nums">{filteredEvents.length}</span>
              {showRecentActivity ? <ChevronUp className="h-4 w-4" aria-hidden="true" /> : <ChevronDown className="h-4 w-4" aria-hidden="true" />}
            </span>
          </button>

          {showRecentActivity && (
            <div className={`max-h-80 overflow-y-auto p-2 space-y-1.5 border-t border-line empty:before:block empty:before:p-2 empty:before:text-small empty:before:text-fg-2 empty:before:content-['Tidak_ada_laporan_bencana_pada_rentang_waktu_ini.'] ${isLoading ? 'opacity-60' : ''}`}>
              {filteredEvents.slice(0, 10).map((ev) => {
                const visual = DISASTER_VISUALS[ev.type] || DISASTER_VISUALS.earthquake;
                const distFromUser = cachedUserLoc
                  ? haversineDistanceKm(
                      { latitude: cachedUserLoc.latitude, longitude: cachedUserLoc.longitude },
                      { latitude: ev.latitude, longitude: ev.longitude }
                    )
                  : null;

                return (
                  <button
                    key={ev.id}
                    type="button"
                    onClick={() => handleFocusEvent(ev)}
                    className="flex w-full items-start gap-2.5 p-2 rounded-card text-left hover:bg-surface transition group"
                  >
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-line"
                      style={{ backgroundColor: `${visual.color}25`, color: visual.color }}
                    >
                      <DisasterIcon type={ev.type} size={18} color={visual.color} />
                    </div>
                    <div className="truncate flex-1 min-w-0">
                      <div className="truncate text-small font-bold text-fg-1 group-hover:text-accent transition">
                        {ev.title}
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 text-label text-fg-2 mt-0.5">
                        <span>{ev.locationName || 'Indonesia'}</span>
                        <span>•</span>
                        <span>{getRelativeTime(ev.eventTime)}</span>
                        {distFromUser !== null && (
                          <span className="text-accent font-semibold">
                            • {distFromUser.toFixed(1)} km dari Anda
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 8. Floating Event Detail Panel & Safety Guide */}
      {selectedEvent && (
        <div role="region" aria-label="Detail kejadian" className="absolute top-24 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 max-h-[80vh] overflow-y-auto z-[1001] rounded-card border border-line-strong bg-raised p-5 shadow-float text-fg-1 pointer-events-auto">
          <div className="flex items-start justify-between gap-2 pb-3 border-b border-line">
            <div>
              <div className="flex items-center gap-2">
                <div
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-line"
                  style={{
                    backgroundColor: 'var(--surface)',
                    color: 'var(--fg-1)',
                  }}
                >
                  <DisasterIcon
                    type={selectedEvent.type}
                    size={14}
                    color="var(--fg-1)"
                  />
                </div>
                <span
                  className="px-2 py-0.5 rounded-full text-label font-bold"
                  style={{
                    backgroundColor:
                      selectedEvent.severity === 'critical'
                        ? 'var(--sev-critical-soft)'
                        : selectedEvent.severity === 'high'
                        ? 'var(--sev-high-soft)'
                        : selectedEvent.severity === 'moderate'
                        ? 'var(--sev-warning-soft)'
                        : 'var(--surface)',
                    color:
                      selectedEvent.severity === 'critical'
                        ? 'var(--sev-critical)'
                        : selectedEvent.severity === 'high'
                        ? 'var(--sev-high)'
                        : selectedEvent.severity === 'moderate'
                        ? 'var(--sev-warning)'
                        : 'var(--fg-2)',
                  }}
                >
                  {SEVERITY_LABEL[selectedEvent.severity] ?? selectedEvent.severity}
                </span>
                <span className="text-label text-fg-2">
                  {formatWibDateTime(selectedEvent.eventTime)}
                </span>
              </div>
              <h2 className="text-base font-bold text-fg-1 mt-1.5 leading-snug">
                {selectedEvent.title}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setSelectedEvent(null)}
              className="p-1.5 text-fg-2 hover:text-fg-1 rounded-lg hover:bg-surface"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 space-y-3 text-small">
            <p className="text-fg-2 leading-relaxed">{selectedEvent.description}</p>

            {/* Location */}
            <div className="p-3 rounded-card bg-surface border border-line">
              <span className="text-label font-bold text-fg-2">Lokasi Kejadian</span>
              <div className="text-fg-1 font-semibold mt-0.5">
                {selectedEvent.locationName || 'Indonesia'}
              </div>
              <div className="text-label text-fg-2 mt-0.5">
                Koordinat: {selectedEvent.latitude.toFixed(4)}°, {selectedEvent.longitude.toFixed(4)}°
              </div>
            </div>

            {/* Safety & Evacuation CTA Button */}
            <button
              type="button"
              onClick={() => setShowSafetyGuide(!showSafetyGuide)}
              className="flex min-h-tap w-full items-center justify-between gap-2 p-3 rounded-card border border-line-strong text-left hover:border-accent transition-colors duration-120"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-accent shrink-0" aria-hidden="true" />
                <div>
                  <div className="font-bold text-fg-1">Panduan Evakuasi & Keselamatan</div>
                  <div className="text-label text-fg-2">
                    Langkah penyelamatan mandiri saat di zona bencana
                  </div>
                </div>
              </div>
              {showSafetyGuide ? (
                <ChevronUp className="h-4 w-4 text-fg-2" aria-hidden="true" />
              ) : (
                <ChevronDown className="h-4 w-4 text-fg-2" aria-hidden="true" />
              )}
            </button>

            {/* Expandable Safety Steps */}
            {showSafetyGuide && activeGuide && (
              <div className="p-3 rounded-card bg-surface border border-line space-y-2.5">
                <div className="font-bold text-fg-1 text-small flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-sev-warning" />
                  <span>{activeGuide.subtitle}</span>
                </div>
                {activeGuide.duringAction.slice(0, 3).map((step) => (
                  <div key={step.step} className="flex items-start gap-2 text-label">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-badge border border-line-strong text-fg-1 text-label font-bold">
                      {step.step}
                    </span>
                    <span className="text-fg-2">{step.instruction}</span>
                  </div>
                ))}
                <Link
                  href="/safety-guide"
                  className="block text-center text-label font-bold text-accent hover:underline pt-1"
                >
                  Buka Panduan Lengkap Seluruh Bencana →
                </Link>
              </div>
            )}

            {/* Deep link for Volcanoes to AshWatch Volcano Detail */}
            {selectedEvent.type === 'volcano' && selectedEvent.metadata?.volcanoSlug && (
              <Link
                href={`/volcanoes/${selectedEvent.metadata.volcanoSlug}`}
                className="flex items-center justify-between p-3 rounded-card bg-sev-high-soft border border-sev-high hover:bg-sev-high-soft text-sev-high transition"
              >
                <div className="flex items-center gap-2">
                  <Mountain className="h-4 w-4 text-sev-high" />
                  <span>Lihat Detail & Riwayat Erupsi Gunung</span>
                </div>
                <ChevronRight className="h-4 w-4 text-sev-high" />
              </Link>
            )}

            {/* Deep link for Volcanic Ash Advisories */}
            {selectedEvent.type === 'volcanic-ash' && selectedEvent.metadata?.advisoryId && (
              <Link
                href={`/advisories/${selectedEvent.metadata.advisoryId}`}
                className="flex items-center justify-between p-3 rounded-card bg-sev-warning-soft border border-sev-warning hover:bg-sev-warning-soft text-sev-warning transition"
              >
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-sev-warning" />
                  <span>Buka Advisori Darwin VAAC Lengkap</span>
                </div>
                <ChevronRight className="h-4 w-4 text-sev-warning" />
              </Link>
            )}

            {/* Official Source Attribution */}
            <div className="pt-2 border-t border-line flex items-center justify-between text-label text-fg-2">
              <span>Sumber: {selectedEvent.source.name}</span>
              <a
                href={selectedEvent.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-accent hover:underline font-semibold"
              >
                <span>Portal Resmi</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
