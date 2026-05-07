import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: '#050505',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #C9A455',
        }}
      >
        <span
          style={{
            color: '#C9A455',
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: '-0.5px',
            fontFamily: 'sans-serif',
          }}
        >
          NF
        </span>
      </div>
    ),
    { ...size }
  );
}
