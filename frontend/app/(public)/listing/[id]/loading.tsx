import { Skeleton } from '@/components/ui/skeleton';

export default function ListingLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      {/* Top back button skeleton */}
      <Skeleton className="h-6 w-32 rounded-full" />

      {/* Title block skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-9 w-2/3 max-w-md rounded-xl" />
        <div className="flex gap-4">
          <Skeleton className="h-4 w-48 rounded-md" />
          <Skeleton className="h-4 w-32 rounded-md" />
        </div>
      </div>

      {/* Photo Bento Grid skeleton */}
      <div className="hidden h-[420px] grid-cols-4 grid-rows-2 gap-2.5 overflow-hidden rounded-3xl sm:grid md:h-[480px]">
        <Skeleton className="col-span-2 row-span-2 size-full rounded-2xl" />
        <Skeleton className="size-full rounded-2xl" />
        <Skeleton className="size-full rounded-2xl" />
        <Skeleton className="size-full rounded-2xl" />
        <Skeleton className="size-full rounded-2xl" />
      </div>
      <Skeleton className="aspect-[4/3] w-full rounded-2xl sm:hidden" />

      {/* Main Details + Sidebar skeleton */}
      <div className="grid grid-cols-1 gap-10 pt-4 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <Skeleton className="h-20 w-full rounded-2xl" />
          <div className="space-y-3">
            <Skeleton className="h-7 w-48 rounded-lg" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-11/12 rounded" />
            <Skeleton className="h-4 w-4/5 rounded" />
          </div>

          <div className="border-border/60 space-y-3 border-t pt-6">
            <Skeleton className="h-7 w-40 rounded-lg" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-12 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <Skeleton className="h-96 w-full rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
