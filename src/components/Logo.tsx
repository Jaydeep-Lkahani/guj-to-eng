import { useId } from "react";

// The site's mark: two speech bubbles, Gujarati "અ" in front and English "A" behind.
// Used in the header, the footer and (as a copy) public/favicon.svg.
export function LogoMark({ size = 40, className }: { size?: number; className?: string }) {
  const id = useId();
  const bg = `${id}-bg`;
  const shine = `${id}-shine`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={bg} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6366F1" />
          <stop offset="1" stopColor="#7C3AED" />
        </linearGradient>
        <radialGradient id={shine} cx="0.2" cy="0.1" r="0.8">
          <stop offset="0" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="48" height="48" rx="14" fill={`url(#${bg})`} />
      <rect width="48" height="48" rx="14" fill={`url(#${shine})`} />

      <g className="logo-back">
        <rect x="21" y="7" width="20" height="18" rx="6" fill="#FBBF24" />
        <path d="M34 24 L40 30 L38.5 23 Z" fill="#FBBF24" />
        <text
          x="35"
          y="20.5"
          textAnchor="middle"
          fontFamily="'Plus Jakarta Sans Variable', system-ui, sans-serif"
          fontSize="12"
          fontWeight="800"
          fill="#3B1F00"
        >
          A
        </text>
      </g>

      <g className="logo-front">
        <rect x="7" y="17" width="24" height="20" rx="7" fill="#fff" />
        <path d="M11 35 L8.5 42 L18 36 Z" fill="#fff" />
        <text
          x="19"
          y="32.5"
          textAnchor="middle"
          fontFamily="'Baloo Bhai 2', 'Noto Sans Gujarati', sans-serif"
          fontSize="15"
          fontWeight="700"
          fill="#4338CA"
        >
          અ
        </text>
      </g>
    </svg>
  );
}

export const siteName = "ચાલો અંગ્રેજી શીખીએ";
