'use client';

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import type { Map as LeafletMap, LayerGroup } from 'leaflet';
import Link from 'next/link';
import { DisasterEvent, DisasterType, TimelinePeriod, DisasterSourceHealth, DisasterHazardZone } from '@/lib/disasters/types';
import { VolcanoAdvisory, LatLng } from '@/lib/types';
import { LAYER_COLORS } from '@/lib/palette';
import { formatWibDateTime } from '@/lib/parser/date-utils';
import { searchIndonesiaPlaces, IndonesiaPlace } from '@/lib/indonesia-places';
import { getAllMonitoredVolcanoes, MonitoredVolcanoItem } from '@/lib/magma-status';
import { DISASTER_SAFETY_GUIDES } from '@/lib/safety-guides';
import { haversineDistanceKm } from '@/lib/geo-checker';
import {
  getCachedUserLocation,
  saveUserLocation,
  CachedUserLocation,
} from '@/lib/user-location-cache';
import { LocationAlertBanner } from '@/components/location-alert-banner';
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
const DISASTER_VISUALS: Record<DisasterType, { color: string; label: string }> = {
  earthquake: { color: '#EF4444', label: 'Gempa Bumi' },
  flood: { color: '#3B82F6', label: 'Banjir' },
  volcano: { color: '#F97316', label: 'Gunung Api' },
  'volcanic-ash': { color: '#FB923C', label: 'Abu Vulkanik' },
  landslide: { color: '#D97706', label: 'Tanah Longsor' },
  'forest-fire': { color: '#EA580C', label: 'Karhutla' },
  'extreme-weather': { color: '#8B5CF6', label: 'Cuaca Ekstrem' },
  tsunami: { color: '#06B6D4', label: 'Tsunami' },
  drought: { color: '#EAB308', label: 'Kekeringan' },
  'coastal-hazard': { color: '#0284C7', label: 'Bahaya Pesisir' },
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
          <span class="user-gps-ring" style="background-color: rgba(59, 130, 246, 0.35); border: 1.5px solid #3B82F6;"></span>
          <div class="relative flex h-4 w-4 items-center justify-center rounded-full bg-white shadow-lg border-2 border-[#3B82F6]">
            <div class="h-2 w-2 rounded-full bg-[#3B82F6]"></div>
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

      userMarker.bindTooltip(`📍 ${label}`, {
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

  // GPS Locate Action
  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      alert('Geolokasi tidak didukung oleh peramban Anda.');
      return;
    }
    setIsLocatingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocatingGps(false);
        const loc: LatLng = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
        const label = 'Lokasi Saya (GPS)';
        setSearchQuery(label);
        const saved = saveUserLocation(loc, label, true, pos.coords.accuracy);
        setCachedUserLoc(saved);

        const map = mapInstanceRef.current;
        if (map) {
          map.flyTo([loc.latitude, loc.longitude], 8.5, { duration: 1.2 });
          renderUserMarker(loc, label);
        }
      },
      (err) => {
        setIsLocatingGps(false);
        alert(
          err.code === 1
            ? 'Izin akses lokasi ditolak oleh browser. Silakan cari kota/daerah Anda.'
            : 'Gagal mendeteksi lokasi GPS.'
        );
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
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

      // Initial props or cached location
      if (initialLat && initialLng) {
        map.setView([initialLat, initialLng], 8.5);
        renderUserMarker({ latitude: initialLat, longitude: initialLng }, initialLabel || 'Area Terpilih');
      } else {
        const cached = getCachedUserLocation();
        if (cached) {
          // Immediately center and zoom in on user's saved location
          map.setView([cached.latitude, cached.longitude], 11);
          renderUserMarker({ latitude: cached.latitude, longitude: cached.longitude }, cached.label);
        }
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
          <div class="text-xs">
            <span class="font-bold text-white">${ev.title}</span>
            <div class="text-[10px] text-[#8B95A7] mt-0.5">${ev.locationName || ''} • ${getRelativeTime(ev.eventTime)}</div>
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
            <div class="text-xs">
              <span class="font-bold text-[#FF8A3D]">Abu Vulkanik ${adv.volcanoName}</span>
              <div class="text-[10px] text-white/80">${poly.type.toUpperCase()} • FL ${poly.topFlightLevel || adv.primaryFlightLevel}</div>
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
          <div class="text-xs">
            <span class="font-bold text-white">${hz.name}</span>
            <div class="text-[10px] text-amber-400 font-semibold mt-0.5">Tingkat Risiko: ${hz.riskLevel} (${hz.source})</div>
            <div class="text-[10px] text-[#8B95A7] mt-0.5">${hz.description}</div>
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
    <div className="relative h-full w-full overflow-hidden bg-[#0B0F17]">
      {/* 1. Map Canvas with OpenStreetMap dark mode transformation */}
      <div ref={mapContainerRef} className="h-full w-full osm-dark-tiles" />

      {/* 2. Top Search Bar & Suggestions (Topmost on mobile) */}
      <div
        ref={searchContainerRef}
        className="absolute top-3 left-3 right-3 sm:top-4 sm:left-auto sm:right-4 sm:w-80 z-[1010] pointer-events-auto"
      >
        <div className="relative flex items-center rounded-2xl border border-white/15 bg-[#0B0F17]/90 backdrop-blur-xl shadow-2xl">
          <Search className="ml-3.5 h-4 w-4 text-[#8B95A7] shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Cari kota, kabupaten, gunung api..."
            className="w-full bg-transparent px-3 py-2.5 text-xs text-white placeholder-[#8B95A7] focus:outline-none"
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
              className="mr-2 text-[#8B95A7] hover:text-white p-1"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={handleLocateUser}
            disabled={isLocatingGps}
            title="Deteksi Lokasi Saya (GPS)"
            className="mr-2.5 flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-[#8B95A7] hover:text-white transition"
          >
            <Crosshair className={`h-3.5 w-3.5 ${isLocatingGps ? 'animate-spin text-[#FF6B1A]' : ''}`} />
          </button>
        </div>

        {/* Autocomplete Dropdown */}
        {showSuggestions && (suggestions.length > 0 || volcanoSuggestions.length > 0) && (
          <div className="absolute top-full mt-2 w-full max-h-72 overflow-y-auto rounded-2xl border border-white/15 bg-[#0B0F17]/95 p-2 shadow-2xl backdrop-blur-2xl z-[1020]">
            {suggestions.length > 0 && (
              <div className="mb-2">
                <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-[#8B95A7]">
                  Kota / Wilayah
                </span>
                {suggestions.map((p) => (
                  <button
                    key={`${p.name}-${p.coordinates.latitude}`}
                    type="button"
                    onClick={() => handleSelectPlace(p)}
                    className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-xs text-[#CBD5E1] hover:bg-white/10 transition"
                  >
                    <MapPin className="h-3.5 w-3.5 text-[#3B82F6] shrink-0" />
                    <span className="truncate">{p.name}</span>
                  </button>
                ))}
              </div>
            )}

            {volcanoSuggestions.length > 0 && (
              <div>
                <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-[#FF6B1A]">
                  Gunung Api (PVMBG)
                </span>
                {volcanoSuggestions.map((v) => (
                  <button
                    key={v.volcanoSlug}
                    type="button"
                    onClick={() => handleSelectVolcano(v)}
                    className="flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-left text-xs text-[#CBD5E1] hover:bg-white/10 transition"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Mountain className="h-3.5 w-3.5 text-[#FF6B1A] shrink-0" />
                      <span className="truncate font-semibold">{v.volcanoName}</span>
                    </div>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase"
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
        <div className="flex items-center gap-1 rounded-2xl border border-white/15 bg-[#0B0F17]/90 px-1.5 sm:px-2 py-1.5 backdrop-blur-xl shadow-2xl">
          <span className="flex items-center gap-1 px-2 text-[10px] font-bold uppercase tracking-wider text-[#8B95A7] hidden sm:flex">
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
              className={`rounded-xl px-2.5 sm:px-3 py-1 text-xs font-bold transition whitespace-nowrap ${
                selectedTimeline === item.id
                  ? 'bg-gradient-to-r from-[#EF4444] to-[#F97316] text-white shadow-md shadow-red-500/20'
                  : 'text-[#8B95A7] hover:text-white hover:bg-white/5'
              }`}
            >
              {item.id === 'LIVE' && (
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 mr-1 sm:mr-1.5 animate-pulse" />
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
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/15 bg-[#0B0F17]/90 text-[#CBD5E1] hover:text-white hover:bg-[#151C28] backdrop-blur-xl shadow-xl transition"
            title="Kelola Layer Peta"
          >
            <Layers className="h-4 w-4" />
          </button>

          {/* Layer Controls Popover */}
          {showLayersMenu && (
            <div className="absolute bottom-12 left-0 w-64 max-h-[75vh] overflow-y-auto rounded-3xl border border-white/15 bg-[#0B0F17]/95 p-4 shadow-2xl backdrop-blur-2xl z-[1001] animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Layer Kebencanaan
                </span>
                <button
                  type="button"
                  onClick={() => setShowLayersMenu(false)}
                  className="text-[#8B95A7] hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Live Event Categories */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase text-[#8B95A7]">
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
                      className={`flex w-full items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition ${
                        isActive ? 'bg-white/10 text-white font-bold' : 'text-[#8B95A7] hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <DisasterIcon type={cat} size={15} color={visual.color} />
                        <span className="truncate">{visual.label}</span>
                      </div>
                      <span className="text-[10px] text-[#8B95A7]">{count}</span>
                    </button>
                  );
                })}
              </div>

              {/* Hazard & Forecast Sublayers */}
              <div className="pt-3 mt-3 border-t border-white/10 space-y-2">
                <span className="text-[10px] font-bold uppercase text-[#8B95A7]">
                  Zona Bahaya & Prakiraan
                </span>

                <label className="flex items-center justify-between text-xs text-[#CBD5E1] cursor-pointer">
                  <span>Prakiraan Abu (+6h/+12h/+18h)</span>
                  <input
                    type="checkbox"
                    checked={showAshForecast}
                    onChange={(e) => setShowAshForecast(e.target.checked)}
                    className="rounded accent-[#FF6B1A]"
                  />
                </label>

                <label className="flex items-center justify-between text-xs text-[#CBD5E1] cursor-pointer">
                  <span>Zona Risiko InaRISK BNPB</span>
                  <input
                    type="checkbox"
                    checked={showHazardZones}
                    onChange={(e) => setShowHazardZones(e.target.checked)}
                    className="rounded accent-[#3B82F6]"
                  />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Source Health Indicator Trigger */}
        <button
          type="button"
          onClick={() => setShowSourceStatus(!showSourceStatus)}
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/15 bg-[#0B0F17]/90 text-[#CBD5E1] hover:text-white hover:bg-[#151C28] backdrop-blur-xl shadow-xl transition"
          title="Status Sumber Data Resmi"
        >
          <Radio className="h-4 w-4" />
        </button>

        {/* Zoom Controls */}
        <div className="flex flex-col rounded-2xl border border-white/15 bg-[#0B0F17]/90 backdrop-blur-xl shadow-xl overflow-hidden">
          <button
            type="button"
            onClick={() => mapInstanceRef.current?.zoomIn()}
            className="flex h-8 w-10 items-center justify-center text-[#8B95A7] hover:text-white hover:bg-white/5 transition"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
          <div className="h-px w-full bg-white/10" />
          <button
            type="button"
            onClick={() => mapInstanceRef.current?.zoomOut()}
            className="flex h-8 w-10 items-center justify-center text-[#8B95A7] hover:text-white hover:bg-white/5 transition"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* 6. Source Health Dialog */}
      {showSourceStatus && (
        <div className="absolute bottom-20 left-16 w-72 rounded-3xl border border-white/15 bg-[#0B0F17]/95 p-4 shadow-2xl backdrop-blur-2xl z-[1001] animate-in fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              Status Sumber Data
            </span>
            <button
              type="button"
              onClick={() => setShowSourceStatus(false)}
              className="text-[#8B95A7] hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-2">
            {(sources || []).map((src) => (
              <div
                key={src.id}
                className="flex items-center justify-between p-2 rounded-xl bg-white/5 text-xs"
              >
                <div>
                  <div className="font-semibold text-white">{src.name}</div>
                  <div className="text-[10px] text-[#8B95A7]">{src.description}</div>
                </div>
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    src.status === 'online'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}
                >
                  ● {src.status === 'online' ? 'Online' : 'Degraded'}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-2 border-t border-white/10 flex justify-between items-center text-[10px] text-[#8B95A7]">
            <span>Diperbarui: {relativeTime}</span>
            <button
              type="button"
              onClick={onRefresh}
              className="text-[#FF6B1A] hover:underline font-semibold"
            >
              Sinkronkan Sekarang
            </button>
          </div>
        </div>
      )}

      {/* 7. Mobile Floating Button for Aktivitas Terkini */}
      <button
        type="button"
        onClick={() => setShowMobileActivitySheet(true)}
        className="sm:hidden absolute bottom-16 right-3 z-[1000] flex items-center gap-2 px-3 py-2 rounded-2xl border border-white/20 bg-[#0B0F17]/95 text-white shadow-2xl backdrop-blur-xl active:scale-95 transition pointer-events-auto"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
        </span>
        <span className="text-xs font-black tracking-wide">Aktivitas</span>
        <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] font-bold text-[#CBD5E1]">
          {filteredEvents.length}
        </span>
      </button>

      {/* 7b. Mobile Aktivitas Terkini Bottom Sheet Drawer */}
      {showMobileActivitySheet && (
        <div className="sm:hidden fixed inset-0 z-[1050] flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-in fade-in">
          {/* Backdrop dismiss */}
          <div className="flex-1" onClick={() => setShowMobileActivitySheet(false)} />

          <div className="relative max-h-[75vh] w-full rounded-t-3xl border-t border-x border-white/20 bg-[#0B0F17]/98 backdrop-blur-2xl p-4 shadow-2xl flex flex-col animate-in slide-in-from-bottom-5 pointer-events-auto">
            {/* Drag Handle */}
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-white/20" />

            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-2">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
                <h3 className="text-sm font-black text-white uppercase tracking-wider">
                  Aktivitas Bencana Terkini
                </h3>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-bold text-[#8B95A7]">
                  {filteredEvents.length}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowMobileActivitySheet(false)}
                className="rounded-xl p-1.5 text-[#8B95A7] hover:bg-white/10 hover:text-white"
                aria-label="Tutup aktivitas"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Event list */}
            <div className="overflow-y-auto space-y-2 py-1 flex-1 pr-1">
              {filteredEvents.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#8B95A7]">
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
                      className="flex w-full items-start gap-3 p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] active:bg-white/[0.12] border border-white/5 text-left transition"
                    >
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10"
                        style={{ backgroundColor: `${visual.color}25`, color: visual.color }}
                      >
                        <DisasterIcon type={ev.type} size={18} color={visual.color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-xs font-bold text-white">
                            {ev.title}
                          </span>
                          <span
                            className="shrink-0 text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded"
                            style={{
                              backgroundColor:
                                ev.severity === 'critical'
                                  ? '#EF444430'
                                  : ev.severity === 'high'
                                  ? '#F9731630'
                                  : '#EAB30830',
                              color:
                                ev.severity === 'critical'
                                  ? '#F87171'
                                  : ev.severity === 'high'
                                  ? '#FB923C'
                                  : '#FDE047',
                            }}
                          >
                            {ev.severity}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-[#8B95A7] mt-1">
                          <span>{ev.locationName || 'Indonesia'}</span>
                          <span>•</span>
                          <span>{getRelativeTime(ev.eventTime)}</span>
                          {distFromUser !== null && (
                            <>
                              <span>•</span>
                              <span className="text-[#38BDF8] font-bold">
                                📍 {distFromUser.toFixed(1)} km
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
        <div className="rounded-3xl border border-white/15 bg-[#0B0F17]/90 backdrop-blur-xl shadow-2xl overflow-hidden">
          <div
            onClick={() => setShowRecentActivity(!showRecentActivity)}
            className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-white/5 transition"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-red-500 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Aktivitas Terkini
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#8B95A7]">
              <span>{filteredEvents.length}</span>
              {showRecentActivity ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </div>

          {showRecentActivity && (
            <div className="max-h-80 overflow-y-auto p-2 space-y-1.5 border-t border-white/10">
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
                    className="flex w-full items-start gap-2.5 p-2 rounded-2xl text-left hover:bg-white/10 transition group"
                  >
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10"
                      style={{ backgroundColor: `${visual.color}25`, color: visual.color }}
                    >
                      <DisasterIcon type={ev.type} size={18} color={visual.color} />
                    </div>
                    <div className="truncate flex-1 min-w-0">
                      <div className="truncate text-xs font-bold text-white group-hover:text-[#FF8A3D] transition">
                        {ev.title}
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-[#8B95A7] mt-0.5">
                        <span>{ev.locationName || 'Indonesia'}</span>
                        <span>•</span>
                        <span>{getRelativeTime(ev.eventTime)}</span>
                        {distFromUser !== null && (
                          <span className="text-[#38BDF8] font-semibold">
                            • 📍 {distFromUser.toFixed(1)} km
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
        <div className="absolute top-24 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 max-h-[80vh] overflow-y-auto z-[1001] rounded-3xl border border-white/15 bg-[#0B0F17]/95 p-5 shadow-2xl backdrop-blur-2xl text-white animate-in fade-in slide-in-from-right-4 pointer-events-auto">
          <div className="flex items-start justify-between gap-2 pb-3 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <div
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-white/10"
                  style={{
                    backgroundColor: `${DISASTER_VISUALS[selectedEvent.type]?.color || '#EF4444'}25`,
                    color: DISASTER_VISUALS[selectedEvent.type]?.color || '#EF4444',
                  }}
                >
                  <DisasterIcon
                    type={selectedEvent.type}
                    size={14}
                    color={DISASTER_VISUALS[selectedEvent.type]?.color || '#EF4444'}
                  />
                </div>
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider"
                  style={{
                    backgroundColor:
                      selectedEvent.severity === 'critical'
                        ? 'rgba(239, 68, 68, 0.2)'
                        : selectedEvent.severity === 'high'
                        ? 'rgba(249, 115, 22, 0.2)'
                        : 'rgba(245, 158, 11, 0.2)',
                    color:
                      selectedEvent.severity === 'critical'
                        ? '#F87171'
                        : selectedEvent.severity === 'high'
                        ? '#FB923C'
                        : '#FCD34D',
                  }}
                >
                  {selectedEvent.severity.toUpperCase()}
                </span>
                <span className="text-[11px] text-[#8B95A7]">
                  {formatWibDateTime(selectedEvent.eventTime)}
                </span>
              </div>
              <h2 className="text-base font-black text-white mt-1.5 leading-snug">
                {selectedEvent.title}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setSelectedEvent(null)}
              className="p-1.5 text-[#8B95A7] hover:text-white rounded-lg hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 space-y-3 text-xs">
            <p className="text-[#CBD5E1] leading-relaxed">{selectedEvent.description}</p>

            {/* Location */}
            <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-[10px] font-bold uppercase text-[#8B95A7]">Lokasi Kejadian</span>
              <div className="text-white font-semibold mt-0.5">
                {selectedEvent.locationName || 'Indonesia'}
              </div>
              <div className="text-[10px] text-[#8B95A7] mt-0.5">
                Koordinat: {selectedEvent.latitude.toFixed(4)}°, {selectedEvent.longitude.toFixed(4)}°
              </div>
            </div>

            {/* Safety & Evacuation CTA Button */}
            <button
              type="button"
              onClick={() => setShowSafetyGuide(!showSafetyGuide)}
              className="flex w-full items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-500/40 text-left hover:brightness-110 transition shadow-lg shadow-red-950/20"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-red-400 shrink-0" />
                <div>
                  <div className="font-bold text-white">Panduan Evakuasi & Keselamatan</div>
                  <div className="text-[10px] text-red-300">
                    Langkah penyelamatan mandiri saat di zona bencana
                  </div>
                </div>
              </div>
              {showSafetyGuide ? (
                <ChevronUp className="h-4 w-4 text-red-300" />
              ) : (
                <ChevronDown className="h-4 w-4 text-red-300" />
              )}
            </button>

            {/* Expandable Safety Steps */}
            {showSafetyGuide && activeGuide && (
              <div className="p-3 rounded-2xl bg-[#151C28] border border-white/10 space-y-2.5 animate-in fade-in">
                <div className="font-bold text-white text-xs flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                  <span>{activeGuide.subtitle}</span>
                </div>
                {activeGuide.duringAction.slice(0, 3).map((step) => (
                  <div key={step.step} className="flex items-start gap-2 text-[11px]">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-red-500/30 text-red-300 text-[10px] font-bold">
                      {step.step}
                    </span>
                    <span className="text-[#CBD5E1]">{step.instruction}</span>
                  </div>
                ))}
                <Link
                  href="/safety-guide"
                  className="block text-center text-[10px] font-bold text-[#FF8A3D] hover:underline pt-1"
                >
                  Buka Panduan Lengkap Seluruh Bencana →
                </Link>
              </div>
            )}

            {/* Deep link for Volcanoes to AshWatch Volcano Detail */}
            {selectedEvent.type === 'volcano' && selectedEvent.metadata?.volcanoSlug && (
              <Link
                href={`/volcanoes/${selectedEvent.metadata.volcanoSlug}`}
                className="flex items-center justify-between p-3 rounded-2xl bg-orange-950/30 border border-orange-500/30 hover:bg-orange-900/40 text-orange-200 transition"
              >
                <div className="flex items-center gap-2">
                  <Mountain className="h-4 w-4 text-orange-400" />
                  <span>Lihat Detail & Riwayat Erupsi Gunung</span>
                </div>
                <ChevronRight className="h-4 w-4 text-orange-400" />
              </Link>
            )}

            {/* Deep link for Volcanic Ash Advisories */}
            {selectedEvent.type === 'volcanic-ash' && selectedEvent.metadata?.advisoryId && (
              <Link
                href={`/advisories/${selectedEvent.metadata.advisoryId}`}
                className="flex items-center justify-between p-3 rounded-2xl bg-amber-950/30 border border-amber-500/30 hover:bg-amber-900/40 text-amber-200 transition"
              >
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-amber-400" />
                  <span>Buka Advisori Darwin VAAC Lengkap</span>
                </div>
                <ChevronRight className="h-4 w-4 text-amber-400" />
              </Link>
            )}

            {/* Official Source Attribution */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-[#8B95A7]">
              <span>Sumber: {selectedEvent.source.name}</span>
              <a
                href={selectedEvent.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[#FF8A3D] hover:underline font-semibold"
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
