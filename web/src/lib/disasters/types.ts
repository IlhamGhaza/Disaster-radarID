import { LatLng, AshPolygon, VolcanoAdvisory } from '@/lib/types';

export type DisasterType =
  | 'earthquake'
  | 'tsunami'
  | 'flood'
  | 'landslide'
  | 'forest-fire'
  | 'extreme-weather'
  | 'volcano'
  | 'volcanic-ash'
  | 'drought'
  | 'coastal-hazard';

export type DisasterSeverity = 'low' | 'moderate' | 'high' | 'critical';

export interface DisasterSource {
  name: string;
  url: string;
  description?: string;
  lastUpdated?: string;
}

export interface DisasterEvent {
  id: string;
  type: DisasterType;
  title: string;
  description?: string;
  latitude: number;
  longitude: number;
  locationName?: string;
  village?: string;
  district?: string;
  regency?: string;
  province?: string;
  eventTime: string; // ISO string
  updatedAt?: string;
  severity: DisasterSeverity;
  status?: string;
  source: DisasterSource;
  isOfficialWarning?: boolean;
  radiusKm?: number;
  evacuationTips?: string[];
  metadata?: {
    magnitude?: number;
    depth?: string;
    shakemapUrl?: string;
    feltReport?: string;
    tsunamiPotential?: string;
    magmaLevel?: 1 | 2 | 3 | 4;
    magmaLevelName?: string;
    volcanoSlug?: string;
    advisoryId?: string;
    flightLevel?: string;
    affectedAreaHa?: number;
    waterLevelCm?: number;
    [key: string]: unknown;
  };
}

export type TimelinePeriod = 'LIVE' | '24H' | '7D' | '30D' | '1Y';

export interface DisasterCategoryMeta {
  type: DisasterType;
  label: string;
  shortLabel: string;
  iconName: string;
  color: string;
  bgRgba: string;
  borderRgba: string;
  description: string;
  officialSources: string[];
}

export interface DisasterSourceHealth {
  id: string;
  name: string;
  code: 'BMKG' | 'BNPB' | 'PVMBG' | 'VAAC' | 'OSM';
  status: 'online' | 'degraded' | 'offline';
  lastUpdated: string;
  url: string;
  description: string;
  eventsCount: number;
}

export interface DisasterHazardZone {
  id: string;
  name: string;
  hazardType: 'flood' | 'landslide' | 'earthquake' | 'volcano' | 'tsunami';
  riskLevel: 'Rendah' | 'Sedang' | 'Tinggi' | 'Sangat Tinggi';
  color: string;
  province: string;
  description: string;
  source: string;
  centerCoordinates: LatLng;
  polygon?: LatLng[];
}

export interface AggregatedDisastersResponse {
  events: DisasterEvent[];
  counts: {
    total: number;
    critical: number;
    high: number;
    moderate: number;
    low: number;
    byType: Record<DisasterType, number>;
  };
  sources: DisasterSourceHealth[];
  hazardZones: DisasterHazardZone[];
  volcanoAdvisories: VolcanoAdvisory[];
  lastUpdated: string;
  isLive: boolean;
}
