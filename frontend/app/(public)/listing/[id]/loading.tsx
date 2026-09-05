import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div>
      <Skeleton className="h-112.5 w-full" />
      <div className="col just-center mx-10 my-10 gap-10 md:mx-auto md:w-2/3 md:flex-row!">
        <div className="order-2 md:order-1">
          <div className="mx-auto w-full max-w-4xl">
            <div className="mb-4 space-y-4">
              <Skeleton className="h-4 w-56" />
              <Skeleton className="h-10 w-3/4" />
              <div className="flex flex-wrap gap-3">
                <Skeleton className="h-6 w-72" />
                <Skeleton className="h-6 w-48" />
              </div>
            </div>

            <div className="border-primary-200 mb-6 rounded-xl border p-6">
              <div className="flex flex-wrap items-center gap-4 px-5">
                <Skeleton className="h-14 w-24" />
                <Skeleton className="h-10 w-px" />
                <Skeleton className="h-14 w-24" />
                <Skeleton className="h-10 w-px" />
                <Skeleton className="h-14 w-24" />
                <Skeleton className="h-10 w-px" />
                <Skeleton className="h-14 w-28" />
              </div>
            </div>

            <div className="my-16 space-y-4">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-10/12" />
            </div>

            <div className="mb-6 space-y-4">
              <Skeleton className="h-8 w-48" />
              <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <Skeleton key={index} className="h-28 rounded-xl" />
                ))}
              </div>
            </div>

            <div className="mt-12 mb-16 space-y-4">
              <Skeleton className="h-8 w-40" />
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className="h-28 rounded-xl" />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Skeleton className="h-8 w-56" />
              <Skeleton className="h-4 w-96" />
              <Skeleton className="h-12 w-80" />
              <Skeleton className="h-24 w-full" />
            </div>

            <div className="mt-12 space-y-4">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-64 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
