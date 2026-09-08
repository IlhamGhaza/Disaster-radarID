import React from 'react';
import type { DisasterType } from '@/lib/disasters/types';

interface DisasterIconProps extends React.SVGProps<SVGSVGElement> {
  type: DisasterType | string;
  size?: number;
  color?: string;
  className?: string;
}

/**
 * Returns raw inner SVG markup string for a disaster type.
 * Used both by React component and Leaflet map markers.
 */
export function getDisasterSvgInner(type: string): string {
  switch (type) {
    case 'earthquake':
      // Seismograph pulse & epicenter shockwave
      return `
        <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.2" stroke-dasharray="2 2" opacity="0.45" fill="none"/>
        <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="1" opacity="0.3" fill="none"/>
        <path d="M3 12h3.5l2-5 3 10 3-8 2 5 2-2h3.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      `;

    case 'volcano':
      // Volcano cone with crater depression & eruption plume
      return `
        <path d="M3 20L9 9h6l6 11H3z" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
        <path d="M9 9c1.5 1.5 4.5 1.5 6 0" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
        <path d="M12 9V3M9.5 4.5L12 3l2.5 1.5M7 6c1-2 3-3 5-3s4 1 5 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" fill="none"/>
        <circle cx="12" cy="2" r="1" fill="currentColor"/>
      `;

    case 'volcanic-ash':
      // Billowing ash cloud with wind trails & fallout dots
      return `
        <path d="M6 15.5a4.5 4.5 0 0 1-.5-8.97 6 6 0 0 1 11.5-1.53A4 4 0 0 1 18 13H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="currentColor" fill-opacity="0.15"/>
        <path d="M4 18h13M7 20.5h9M18.5 10l3-1M18.5 7.5l2-1.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" fill="none"/>
        <circle cx="9" cy="18" r="0.8" fill="currentColor"/>
        <circle cx="14" cy="18" r="0.8" fill="currentColor"/>
      `;

    case 'flood':
      // Submerged house roof with dual flood wave currents
      return `
        <path d="M8 8.5l4-3 4 3v2H8v-2z" fill="currentColor" fill-opacity="0.3" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="M2 13.5c2.5-1.5 5.5 1.5 8 0s5.5-1.5 8 0 4-1 4-1" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" fill="none"/>
        <path d="M2 18c2.5-1.5 5.5 1.5 8 0s5.5-1.5 8 0 4-1 4-1" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" fill="none"/>
      `;

    case 'landslide':
      // Mountain slope fault with tumbling debris boulders
      return `
        <path d="M3 20L11 4v16H3z" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
        <path d="M12.5 5.5l7 14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="1.5 2.5" fill="none"/>
        <rect x="14" y="8" width="3.2" height="3.2" rx="0.8" transform="rotate(25 15.6 9.6)" fill="currentColor"/>
        <rect x="17.5" y="12.5" width="3.5" height="3.5" rx="0.8" transform="rotate(40 19.2 14.2)" fill="currentColor"/>
        <rect x="13.5" y="15.5" width="2.6" height="2.6" rx="0.6" transform="rotate(15 14.8 16.8)" fill="currentColor"/>
      `;

    case 'forest-fire':
      // High energy multi-tongue flame with inner core
      return `
        <path d="M12 2c0 3.5-3 5.5-3 9 0 3.3 2.7 6 6 6s6-2.7 6-6c0-4-3-6-3-9-1 2-2 3-3 3s-2-1-3-3z" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
        <path d="M12 17c-1.3 0-2.2-.9-2.2-2.2 0-1.3.9-2.2 1.3-3.1.4.9.9 1.3 1.8 1.8.4.4.9.9.9 1.3 0 1.2-.9 2.2-1.8 2.2z" fill="currentColor"/>
      `;

    case 'extreme-weather':
      // Thunderstorm cloud with lightning bolt
      return `
        <path d="M17.5 12A4.5 4.5 0 0 0 18 3.5 6 6 0 0 0 6.5 5.5 4.5 4.5 0 0 0 6 12h11.5z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" fill="currentColor" fill-opacity="0.15"/>
        <path d="M13 10.5l-3 4.5h3l-1.5 5 4.5-5.5h-3.5l2.5-4h-2z" fill="currentColor" stroke="currentColor" stroke-width="0.8" stroke-linejoin="round"/>
      `;

    case 'tsunami':
      // Towering curled tsunami wave
      return `
        <path d="M2 18.5c4 0 6-2 8-5 1.5-2.5 3-5 6-5 4 0 5 3 3 5-1.5 1.5-3 1-3.5 0" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" fill="none"/>
        <path d="M2 18.5c6-1 9-4 11-7" stroke="currentColor" stroke-width="1.5" stroke-dasharray="1.5 2" fill="none"/>
        <path d="M2 21c6 0 9-1.5 12-1.5s5 1.5 8 1.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
        <circle cx="16" cy="9.5" r="1.5" fill="currentColor"/>
      `;

    case 'coastal-hazard':
      // Coastal warning triangle over heavy swell
      return `
        <path d="M12 3l7 10H5L12 3z" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="M12 7v2.8M12 11.5v.3" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
        <path d="M2 17c3-1.5 6 1.5 9 0s6-1.5 9 0 2-.5 2-.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
        <path d="M2 20.5c3-1.5 6 1.5 9 0s6-1.5 9 0 2-.5 2-.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
      `;

    case 'drought':
      // Sun over cracked soil
      return `
        <circle cx="12" cy="7" r="3.2" fill="currentColor" fill-opacity="0.25" stroke="currentColor" stroke-width="1.8"/>
        <path d="M12 1.5v1.8M12 10.7v1.8M6.5 7h-1.8M19.3 7h-1.8M8 3.5L6.8 2.3M16 10.7l1.2 1.2M16 3.5l1.2-1.2M8 10.7L6.8 11.9" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" fill="none"/>
        <path d="M3 17.5l4-1.8 5 1.8 4-1.8 5 1.8M7 15.7v3.5M12 17.5v3.2M16 15.7v3.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none"/>
      `;

    default:
      // Generic alert shield
      return `
        <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" fill="currentColor" fill-opacity="0.2"/>
        <path d="M12 8v4M12 15v.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
      `;
  }
}

/**
 * Generates an SVG string for Leaflet HTML divIcon markers.
 */
export function getDisasterSvgString(
  type: string,
  options: { size?: number; color?: string; className?: string } = {}
): string {
  const size = options.size || 18;
  const color = options.color || 'currentColor';
  const className = options.className || '';
  const innerSvg = getDisasterSvgInner(type);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" class="${className}" style="color: ${color}; display: block;">${innerSvg}</svg>`;
}

/**
 * Creates the complete modern GIS Teardrop Pin HTML for Leaflet maps.
 * Pin anchors cleanly at the bottom point [16, 38].
 */
export function createDisasterMarkerHtml(params: {
  type: string;
  color: string;
  isCritical: boolean;
  title: string;
}): string {
  const { type, color, isCritical } = params;
  const iconSvg = getDisasterSvgString(type, { size: 18, color: '#FFFFFF' });

  return `
    <div class="disaster-pin-container group" style="position: relative; width: 32px; height: 40px; cursor: pointer;">
      ${
        isCritical
          ? `<span class="pulse-marker-ring" style="position: absolute; bottom: 0; left: 16px; transform: translate(-50%, 50%); background-color: ${color}35; border: 2px solid ${color}; width: 36px; height: 36px; border-radius: 9999px;"></span>`
          : ''
      }
      <div class="disaster-pin-body" style="
        width: 32px;
        height: 40px;
        position: relative;
        filter: drop-shadow(0 4px 8px ${color}70);
        transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
      ">
        <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Outer Teardrop Pin Silhouette -->
          <path d="M16 0C7.163 0 0 7.163 0 16C0 26.5 14.2 38.8 15.4 39.8C15.75 40.1 16.25 40.1 16.6 39.8C17.8 38.8 32 26.5 32 16C32 7.163 24.837 0 16 0Z" fill="#0B0F17" stroke="${color}" stroke-width="2.2"/>
          <!-- Inner Colored Head Disc -->
          <circle cx="16" cy="16" r="11.5" fill="${color}" fill-opacity="${isCritical ? '0.9' : '0.4'}"/>
          <circle cx="16" cy="16" r="11.5" stroke="${color}" stroke-width="1"/>
        </svg>
        <div style="
          position: absolute;
          top: 7px;
          left: 7px;
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          ${iconSvg}
        </div>
      </div>
    </div>
  `;
}

/**
 * Reusable React component for disaster category icons across web pages.
 */
export function DisasterIcon({
  type,
  size = 24,
  color,
  className = '',
  ...props
}: DisasterIconProps) {
  const inner = getDisasterSvgInner(type);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={color ? { color } : undefined}
      dangerouslySetInnerHTML={{ __html: inner }}
      {...props}
    />
  );
}
