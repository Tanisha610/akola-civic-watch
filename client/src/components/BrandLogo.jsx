import { useId } from 'react';

export default function BrandLogo({ compact = false }) {
  const gradientId = useId();

  return (
    <div
      className={`inline-flex items-center gap-3 ${compact ? 'rounded-2xl px-0 py-0' : 'rounded-[1.8rem] px-4 py-3'} bg-[#173f39] text-[#d8c08f]`}
    >
      <svg
        viewBox="0 0 220 220"
        aria-hidden="true"
        className={`${compact ? 'h-10 w-10' : 'h-16 w-16'} shrink-0`}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#e0c996" />
            <stop offset="100%" stopColor="#c8aa73" />
          </linearGradient>
        </defs>
        <g fill="none" stroke={`url(#${gradientId})`} strokeLinecap="round" strokeLinejoin="round">
          <path d="M48 126 L88 83 L124 83 L156 116" strokeWidth="6" />
          <path d="M64 126 L64 99 L84 82 L104 99 L104 126" strokeWidth="5" />
          <path d="M110 126 L110 95 L128 79 L146 95 L146 126" strokeWidth="5" />
          <path d="M136 74 L136 50 L146 43 L146 66" strokeWidth="6" />
          <path d="M149 80 L149 44 L162 51 L162 88" strokeWidth="6" />
          <path d="M164 84 L164 56 L177 62 L177 96" strokeWidth="6" />
          <path d="M44 126 H176" strokeWidth="5" />
          <path d="M90 66 H102" strokeWidth="4" />
          <path d="M107 61 H118" strokeWidth="4" />
          <path d="M124 69 H134" strokeWidth="4" />
          <path d="M76 101 H92" strokeWidth="4" />
          <path d="M122 103 H137" strokeWidth="4" />
          <path d="M67 126 C58 121, 49 121, 41 129 C34 136, 36 148, 49 151 C58 153, 67 149, 75 142" strokeWidth="7" />
          <path d="M100 131 C93 124, 85 122, 77 127 C68 133, 67 145, 77 151 C86 156, 97 154, 104 147" strokeWidth="7" />
          <path d="M147 132 C140 124, 131 122, 122 127 C113 133, 113 145, 123 151 C132 156, 143 154, 150 147" strokeWidth="7" />
          <path d="M74 149 H148" strokeWidth="6" />
        </g>
        <text x="110" y="204" textAnchor="middle" fontSize="30" fontWeight="600" fill="#d8c08f" letterSpacing="1">
          AKOLA
        </text>
      </svg>

      {!compact && (
        <div className="leading-tight">
          <div className="text-lg font-semibold tracking-tight text-[#f0e2c0]">अपना Akola</div>
          <div className="text-xs uppercase tracking-[0.28em] text-[#b7c396]">City civic portal</div>
        </div>
      )}
    </div>
  );
}