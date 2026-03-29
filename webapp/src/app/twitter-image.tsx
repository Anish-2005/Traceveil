import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';
export const alt = 'Traceveil Fraud Detection Platform';

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px',
          color: '#f8fafc',
          background:
            'radial-gradient(900px 420px at 16% 0%, rgba(37,99,235,0.44), transparent 58%), radial-gradient(840px 360px at 100% 100%, rgba(79,70,229,0.4), transparent 62%), linear-gradient(160deg, #030712 0%, #0b1221 100%)',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '14px',
            fontSize: '30px',
            fontWeight: 700,
            letterSpacing: '-0.02em',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
            }}
          />
          Traceveil
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '920px' }}>
          <div style={{ fontSize: '58px', lineHeight: 1.05, fontWeight: 800, letterSpacing: '-0.03em' }}>
            Security Intelligence in Real Time
          </div>
          <div style={{ fontSize: '28px', lineHeight: 1.35, color: '#cbd5e1' }}>
            Detect, score, and stop fraud before impact with enterprise-grade AI risk controls.
          </div>
        </div>
      </div>
    ),
    size,
  );
}

