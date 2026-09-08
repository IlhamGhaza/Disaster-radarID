import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const alt = 'Disaster Radar Indonesia — Peta & Monitoring Bencana Indonesia';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'radial-gradient(circle at top right, #1B2436 0%, #0B0F17 65%, #070A0F 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '80px',
          fontFamily: 'sans-serif',
          color: '#ffffff',
          position: 'relative',
        }}
      >
        {/* Decorative radar beacon glow */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(239, 68, 68, 0.22) 0%, rgba(11, 15, 23, 0) 70%)',
          }}
        />

        {/* Brand header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #EF4444, #F97316)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              boxShadow: '0 8px 24px rgba(239, 68, 68, 0.35)',
            }}
          >
            📡
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '40px', fontWeight: 900, letterSpacing: '-1px' }}>
              DISASTER <span style={{ color: '#EF4444' }}>RADAR</span>
            </span>
            <span style={{ fontSize: '15px', color: '#8B95A7', letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 600 }}>
              Indonesia Disaster Monitoring
            </span>
          </div>
        </div>

        {/* Main Title & Subtitle */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '980px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#EF4444',
              fontSize: '18px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            ● Live Disaster Intelligence Platform
          </div>
          <h1
            style={{
              fontSize: '56px',
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-2px',
              margin: 0,
              color: '#F5F7FA',
            }}
          >
            Peta & Monitoring Bencana Indonesia
          </h1>
          <p style={{ fontSize: '22px', color: '#8B95A7', lineHeight: 1.4, margin: 0 }}>
            Pantau gempa, banjir, longsor, kebakaran, cuaca ekstrem, tsunami, gunung api, dan abu vulkanik dari sumber resmi BMKG, BNPB, dan PVMBG.
          </p>
        </div>

        {/* Feature Badges */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <div
            style={{
              padding: '12px 24px',
              borderRadius: '9999px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#F87171',
              fontSize: '16px',
              fontWeight: 700,
            }}
          >
            Peringatan Dini & Zona Bahaya
          </div>
          <div
            style={{
              padding: '12px 24px',
              borderRadius: '9999px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#F5F7FA',
              fontSize: '16px',
              fontWeight: 600,
            }}
          >
            OpenStreetMap Engine
          </div>
          <div
            style={{
              padding: '12px 24px',
              borderRadius: '9999px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              color: '#34D399',
              fontSize: '16px',
              fontWeight: 600,
            }}
          >
            BMKG • BNPB • PVMBG • VAAC
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
