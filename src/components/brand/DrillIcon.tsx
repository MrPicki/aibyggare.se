interface DrillIconProps {
  className?: string;
}

export function DrillIcon({ className }: DrillIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      {/* Bit */}
      <rect x="19" y="11" width="5" height="2" rx="0.5" />
      {/* Chuck */}
      <rect x="14" y="9.5" width="6" height="5" rx="1" />
      {/* Body */}
      <rect x="2" y="7" width="13" height="10" rx="2" />
      {/* Handle */}
      <rect x="4" y="16" width="8" height="6" rx="2" />
      {/* Trigger */}
      <rect x="6" y="13.5" width="3" height="5" rx="1" fillOpacity="0.45" />
    </svg>
  );
}
