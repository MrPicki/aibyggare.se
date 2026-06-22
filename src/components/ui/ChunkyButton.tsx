import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "green" | "yellow" | "ink" | "paper";

const variantClass: Record<Variant, string> = {
  green: "bg-build-green text-paper",
  yellow: "bg-hammer-yellow text-ink",
  ink: "bg-ink text-paper",
  paper: "bg-paper text-ink",
};

const sizeClass = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
} as const;

interface BaseProps {
  variant?: Variant;
  size?: keyof typeof sizeClass;
  className?: string;
  children: React.ReactNode;
}

function classes(variant: Variant, size: keyof typeof sizeClass, className?: string) {
  return cn(
    "chunky pressable inline-flex items-center justify-center gap-2 rounded-2xl font-mono font-semibold uppercase tracking-wide select-none",
    variantClass[variant],
    sizeClass[size],
    className,
  );
}

export function ChunkyLink({
  href,
  variant = "green",
  size = "md",
  className,
  children,
}: BaseProps & { href: string }) {
  return (
    <Link href={href} className={classes(variant, size, className)}>
      {children}
    </Link>
  );
}

export function ChunkyButton({
  variant = "green",
  size = "md",
  className,
  children,
  ...props
}: BaseProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={classes(variant, size, className)} {...props}>
      {children}
    </button>
  );
}
