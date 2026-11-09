import { PolygonType } from './types';

/**
 * Visual tokens for ash map layers. Values mirror globals.css (Arah A "Buletin"):
 * ash = --sev-ash (#C9B79C), a grey-tan that is distinct from Siaga orange.
 * Observed/Estimated: denser fill with a light (--fg-1) outline.
 * Forecast horizons (+6h, +12h, +18h): same ash hue, outline in ash, fading opacity.
 */
export const LAYER_COLORS: Record<PolygonType, { fill: string; stroke: string; opacity: number }> = {
  observed: {
    fill: '#C9B79C', // --sev-ash
    stroke: '#F2EEE6', // --fg-1
    opacity: 0.45,
  },
  estimated: {
    fill: '#C9B79C',
    stroke: '#F2EEE6',
    opacity: 0.45,
  },
  forecast6h: {
    fill: '#C9B79C',
    stroke: '#C9B79C',
    opacity: 0.3,
  },
  forecast12h: {
    fill: '#C9B79C',
    stroke: '#C9B79C',
    opacity: 0.2,
  },
  forecast18h: {
    fill: '#C9B79C',
    stroke: '#C9B79C',
    opacity: 0.12,
  },
};

/**
 * Brand colors, mirrored from globals.css tokens.
 */
export const BRAND_COLORS = {
  primaryAccent: '#FF5B36', // --accent (Signal)
  secondaryAccent: '#FF7A5A', // --accent-hover
  background: '#0A0B0D', // --bg
  surfaceSecondary: '#121316', // --surface
  surfaceElevated: '#1A1B1F', // --raised
  textPrimary: '#F2EEE6', // --fg-1
  textSecondary: '#BEB9AF', // --fg-2
};

/**
 * Hex mirror of the severity tokens in globals.css, for places that cannot use var():
 * SVG presentation attributes and hex-alpha concatenation in Leaflet marker HTML.
 */
export const SEVERITY_HEX = {
  critical: '#FF5B36', // --sev-critical (= Signal)
  high: '#FFA23A', // --sev-high
  warning: '#EFD24A', // --sev-warning
  normal: '#52C98E', // --sev-normal
  tsunami: '#4FC3E8', // --sev-tsunami
  ash: '#C9B79C', // --sev-ash
  on: '#0A0B0D', // --sev-on
};

/**
 * Marker outline colors per disaster category (Arah A: icon = type, warm color = danger only).
 * Categories without their own semantic token use neutral --fg-2 so they never read as a severity.
 */
export const CATEGORY_MARKER_COLORS: Record<string, string> = {
  earthquake: '#BEB9AF', // --fg-2
  flood: '#BEB9AF',
  volcano: '#BEB9AF',
  'volcanic-ash': SEVERITY_HEX.ash,
  landslide: '#BEB9AF',
  'forest-fire': '#BEB9AF',
  'extreme-weather': '#BEB9AF',
  tsunami: SEVERITY_HEX.tsunami,
  drought: '#BEB9AF',
  'coastal-hazard': SEVERITY_HEX.tsunami,
};

/**
 * Clean volcano marker accent color
 */
export function getVolcanoColor(_volcanoName?: string): string {
  // Single brand accent instead of random rainbow colors
  return BRAND_COLORS.primaryAccent;
}

export function getPolygonStyle(type: PolygonType) {
  return LAYER_COLORS[type] || LAYER_COLORS.observed;
}

export function getPolygonOpacity(type: PolygonType): number {
  return LAYER_COLORS[type]?.opacity ?? 0.3;
}
