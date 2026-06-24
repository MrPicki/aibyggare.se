import { CardGridSkeleton } from "@/components/ui/Skeletons";

export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-14">
      {/* Profilkort */}
      <div className="chunky overflow-hidden rounded-3xl bg-paper">
        <div className="h-11 border-b-2 border-ink bg-build-green" />
        <div className="flex flex-col items-center gap-5 p-6 sm:flex-row sm:items-start sm:gap-6 sm:p-8">
          <div className="h-24 w-24 shrink-0 animate-pulse rounded-full border-4 border-ink bg-cream" />
          <div className="w-full space-y-3">
            <div className="h-7 w-40 animate-pulse rounded-lg bg-cream" />
            <div className="h-4 w-24 animate-pulse rounded bg-cream" />
            <div className="h-4 w-full animate-pulse rounded bg-cream" />
          </div>
        </div>
      </div>

      {/* Innehåll */}
      <div className="mt-10">
        <div className="mb-4 h-7 w-28 animate-pulse rounded-lg bg-cream" />
        <CardGridSkeleton count={2} className="grid grid-cols-1 gap-4 sm:grid-cols-2" />
      </div>
    </div>
  );
}
