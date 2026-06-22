// Original SVG-illustrationer för AIbyggare.se — byggbänk-tema (design.md §2).
// Inga externa assets. Allt dekorativt är aria-hidden.

type IconProps = { className?: string; size?: number };

// Blockig hammare + kodklammer — logotyp.
export function PixelHammerLogo({ className, size = 28 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden
    >
      {/* hammarhuvud */}
      <rect x="4" y="5" width="15" height="8" rx="1.5" fill="currentColor" />
      <rect x="16" y="7" width="9" height="4" rx="1" fill="currentColor" />
      {/* skaft */}
      <rect x="9" y="12" width="4" height="14" rx="1.5" fill="currentColor" />
      {/* kod-klammer-prick */}
      <rect x="22" y="20" width="3" height="3" rx="0.8" fill="currentColor" opacity="0.55" />
      <rect x="27" y="23" width="3" height="3" rx="0.8" fill="currentColor" opacity="0.35" />
    </svg>
  );
}

// Liten SVG-bugg (felsökning).
export function BugSticker({ className, size = 28 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
      <ellipse cx="16" cy="18" rx="8" ry="9" fill="currentColor" />
      <circle cx="16" cy="9" r="4" fill="currentColor" />
      <circle cx="14.5" cy="8.5" r="1" fill="var(--paper)" />
      <circle cx="17.5" cy="8.5" r="1" fill="var(--paper)" />
      <line x1="16" y1="13" x2="16" y2="26" stroke="var(--paper)" strokeWidth="1.4" />
      <path d="M8 14l-4-2M8 18h-5M8 22l-4 2M24 14l4-2M24 18h5M24 22l4 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M13 4l-2-2M19 4l2-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

// Kodblock som byggsten.
export function CodeBlocks({ className, size = 72 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" className={className} aria-hidden>
      <rect x="8" y="14" width="64" height="44" rx="6" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2.5" />
      <rect x="8" y="14" width="64" height="12" rx="6" fill="currentColor" />
      <rect x="8" y="20" width="64" height="6" fill="currentColor" />
      <circle cx="16" cy="20" r="2" fill="var(--paper)" />
      <circle cx="23" cy="20" r="2" fill="var(--paper)" />
      <path d="M22 38l-6 5 6 5M58 38l6 5-6 5M44 34l-8 18" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* hammare som vilar mot blocket */}
      <rect x="52" y="56" width="20" height="6" rx="1.5" fill="var(--ink)" transform="rotate(-18 62 59)" />
      <rect x="60" y="58" width="4" height="14" rx="1.5" fill="var(--ink)" transform="rotate(-18 62 65)" />
    </svg>
  );
}

// Databas-cylinder + varningsskylt (Supabase).
export function DatabaseStack({ className, size = 72 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" className={className} aria-hidden>
      <path d="M18 20c0-4 8-7 18-7s18 3 18 7v34c0 4-8 7-18 7s-18-3-18-7V20z" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2.5" />
      <ellipse cx="36" cy="20" rx="18" ry="7" fill="currentColor" stroke="var(--ink)" strokeWidth="2.5" />
      <path d="M18 33c0 4 8 7 18 7s18-3 18-7M18 46c0 4 8 7 18 7s18-3 18-7" stroke="var(--ink)" strokeWidth="2.2" />
      {/* varningsskylt */}
      <path d="M58 44l11 19H47l11-19z" fill="var(--hammer-yellow)" stroke="var(--ink)" strokeWidth="2.2" strokeLinejoin="round" />
      <line x1="58" y1="51" x2="58" y2="57" stroke="var(--ink)" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="58" cy="60" r="1.3" fill="var(--ink)" />
    </svg>
  );
}

// Terminal-fönster + cursor (Cursor).
export function TerminalWindow({ className, size = 72 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" className={className} aria-hidden>
      <rect x="10" y="14" width="60" height="52" rx="6" fill="var(--ink)" stroke="var(--ink)" strokeWidth="2.5" />
      <rect x="10" y="14" width="60" height="12" rx="6" fill="currentColor" />
      <rect x="10" y="20" width="60" height="6" fill="currentColor" />
      <circle cx="18" cy="20" r="2" fill="var(--ink)" />
      <circle cx="25" cy="20" r="2" fill="var(--ink)" />
      <path d="M20 38l7 6-7 6" stroke="var(--paper)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="32" y1="50" x2="48" y2="50" stroke="var(--paper)" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="52" y="44" width="3" height="12" fill="var(--hammer-yellow)" className="animate-pulse" />
    </svg>
  );
}

// Raket (Vercel/deploy).
export function Rocket({ className, size = 72 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" className={className} aria-hidden>
      <path d="M40 8c10 6 15 18 15 30l-8 8H33l-8-8c0-12 5-24 15-30z" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="40" cy="30" r="6" fill="currentColor" stroke="var(--ink)" strokeWidth="2.2" />
      <path d="M25 44l-9 6 4-14M55 44l9 6-4-14" fill="currentColor" stroke="var(--ink)" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M34 54c0 6 3 12 6 14 3-2 6-8 6-14H34z" fill="var(--warning-orange)" stroke="var(--ink)" strokeWidth="2.2" strokeLinejoin="round" />
    </svg>
  );
}

// Browserfönster + pensel (Lovable).
export function BrowserBrush({ className, size = 72 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" className={className} aria-hidden>
      <rect x="10" y="16" width="60" height="44" rx="6" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2.5" />
      <rect x="10" y="16" width="60" height="11" rx="6" fill="currentColor" />
      <rect x="10" y="22" width="60" height="5" fill="currentColor" />
      <circle cx="18" cy="21.5" r="1.8" fill="var(--paper)" />
      <circle cx="24" cy="21.5" r="1.8" fill="var(--paper)" />
      <rect x="18" y="34" width="24" height="5" rx="2.5" fill="var(--ink)" opacity="0.25" />
      <rect x="18" y="44" width="16" height="5" rx="2.5" fill="var(--ink)" opacity="0.25" />
      {/* pensel */}
      <rect x="48" y="46" width="6" height="20" rx="2" fill="var(--ink)" transform="rotate(35 51 56)" />
      <path d="M58 62l8 8" stroke="var(--prompt-purple)" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

// Blixt + block (Bolt).
export function BoltBlock({ className, size = 72 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" className={className} aria-hidden>
      <rect x="14" y="22" width="36" height="36" rx="6" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2.5" />
      <path d="M30 26l-8 14h7l-3 12 12-16h-7l3-10z" fill="currentColor" stroke="var(--ink)" strokeWidth="2" strokeLinejoin="round" />
      <rect x="48" y="40" width="20" height="20" rx="4" fill="var(--hammer-yellow)" stroke="var(--ink)" strokeWidth="2.5" />
    </svg>
  );
}

// Mjuk dekorativ blob.
export function DecorativeBlob({ className, color = "var(--soft-teal)" }: IconProps & { color?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <path
        fill={color}
        d="M44 -58C58 -47 70 -34 74 -19C78 -3 73 16 63 31C53 46 38 57 20 64C2 71 -19 73 -37 66C-55 59 -70 42 -75 23C-80 3 -75 -19 -63 -35C-51 -51 -32 -61 -12 -67C8 -73 30 -69 44 -58Z"
        transform="translate(100 100)"
      />
    </svg>
  );
}
