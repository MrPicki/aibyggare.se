import { CardGridSkeleton, PageHeaderSkeleton } from "@/components/ui/Skeletons";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
      <PageHeaderSkeleton />
      <CardGridSkeleton count={4} className="grid gap-4 sm:grid-cols-2" />
    </div>
  );
}
