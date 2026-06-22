import { cn } from "@/lib/utils";

interface StickerProps {
  children: React.ReactNode;
  className?: string;
  /** Liten lutning för tejplapp-känsla, i grader. */
  tilt?: number;
}

// Liten tejplapp/sticker-label — mono uppercase med chunky kant.
export function Sticker({ children, className, tilt = 0 }: StickerProps) {
  return (
    <span
      className={cn(
        "sticker inline-flex items-center gap-1.5 bg-paper px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wide text-ink",
        className,
      )}
      style={tilt ? { transform: `rotate(${tilt}deg)` } : undefined}
    >
      {children}
    </span>
  );
}
