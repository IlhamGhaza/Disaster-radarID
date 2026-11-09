import { ImageResponse } from 'next/og';
import { BRAND_COLORS } from '@/lib/palette';

export const runtime = 'nodejs';
export const alt = 'Disaster Radar Indonesia — Peta & Monitoring Bencana Indonesia';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

// ImageResponse tidak membaca CSS variable; warna diambil dari cermin token di palette.ts.
const C = {
  bg: BRAND_COLORS.background,
  surface: BRAND_COLORS.surfaceSecondary,
  fg1: BRAND_COLORS.textPrimary,
  fg2: BRAND_COLORS.textSecondary,
  accent: BRAND_COLORS.primaryAccent,
};

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: C.bg,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '80px',
          fontFamily: 'sans-serif',
          color: C.fg1,
          position: 'relative',
          borderLeft: `16px solid ${C.accent}`,
        }}
      >
        {/* Brand header */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '40px', fontWeight: 700 }}>Disaster Radar</span>
          <span style={{ fontSize: '22px', color: C.fg2 }}>Monitoring Bencana Indonesia</span>
        </div>

        {/* Main Title & Subtitle */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '980px' }}>
          <h1
            style={{
              fontSize: '64px',
              fontWeight: 700,
              lineHeight: 1.1,
              margin: 0,
              color: C.fg1,
            }}
          >
            Peta & Monitoring Bencana Indonesia
          </h1>
          <p style={{ fontSize: '28px', color: C.fg2, lineHeight: 1.4, margin: 0 }}>
            Pantau gempa, banjir, longsor, kebakaran, cuaca ekstrem, tsunami, gunung api, dan abu vulkanik dari sumber resmi BMKG, BNPB, dan PVMBG.
          </p>
        </div>

        {/* Sumber data */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <div
            style={{
              padding: '12px 20px',
              borderRadius: '6px',
              background: C.surface,
              border: `1px solid ${C.accent}`,
              color: C.accent,
              fontSize: '22px',
              fontWeight: 700,
            }}
          >
            BMKG · BNPB · PVMBG · Darwin VAAC
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
