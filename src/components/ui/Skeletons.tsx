// Delade laddnings-skelett. Matchar kortens form (chunky, rounded-3xl) så att
// övergången till riktig data inte hoppar.

export function CardSkeleton() {
  return (
    <div className="chunky overflow-hidden rounded-3xl bg-paper">
      <div className="h-10 border-b-2 border-ink bg-cream" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-2/3 animate-pulse rounded-lg bg-cream" />
        <div className="h-4 w-full animate-pulse rounded bg-cream" />
        <div className="h-4 w-4/5 animate-pulse rounded bg-cream" />
        <div className="flex gap-1.5 pt-1">
          <div className="h-5 w-14 animate-pulse rounded-md bg-cream" />
          <div className="h-5 w-14 animate-pulse rounded-md bg-cream" />
        </div>
      </div>
    </div>
  );
}

export function CardGridSkeleton({
  count = 6,
  className = "grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={className} aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function PageHeaderSkeleton() {
  return (
    <div className="mb-10 space-y-3">
      <div className="h-7 w-28 animate-pulse rounded-lg bg-cream" />
      <div className="h-9 w-72 max-w-full animate-pulse rounded-lg bg-cream" />
      <div className="h-4 w-96 max-w-full animate-pulse rounded bg-cream" />
    </div>
  );
}
