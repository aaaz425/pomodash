import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: 32,
        height: 32,
        background: '#0f172a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg
        viewBox="0 0 24 24"
        width="28"
        height="28"
        fill="none"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* P stem + top bar */}
        <path d="M5 21 L5 3 L13 3" strokeWidth="2.5" />
        {/* Clock face / P bowl */}
        <circle cx="13" cy="10" r="7" strokeWidth="2" />
        {/* P bottom bar */}
        <line x1="5" y1="17" x2="13" y2="17" strokeWidth="2.5" />
        {/* Hour hand */}
        <line x1="13" y1="7.5" x2="13" y2="10" strokeWidth="1.8" />
        {/* Minute hand */}
        <line x1="13" y1="10" x2="15.5" y2="11.5" strokeWidth="1.8" />
        {/* Red accent dot */}
        <circle cx="15.5" cy="11.5" r="1.2" fill="#ef4444" stroke="none" />
      </svg>
    </div>,
    { ...size },
  );
}
