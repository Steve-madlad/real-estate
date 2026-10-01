'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, Search, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useGetAuthUser } from '@/api/auth';
import {
  useFavoriteProperty,
  useGetResidences,
  useGetTenant,
  useUnfavoriteProperty,
} from '@/api/tenant';
import Header from '@/components/Header';
import PropertyCard from '@/components/PropertyCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function ResidencesPage() {
  const { data: user } = useGetAuthUser();
  const { data: tenant, isLoading: tenantLoading } = useGetTenant();
  const {
    data: residences,
    isLoading: residencesLoading,
    refetch,
  } = useGetResidences({ enabled: false });

  useEffect(() => {
    if (tenant?.data) {
      refetch();
    }
  }, [tenant?.data, refetch]);

  const [likeLoadingProperty, setLikeLoadingProperty] = useState<number>();

  const { mutate: favoriteProperty, isPending: favoriteLoading } = useFavoriteProperty({
    onSuccess: () => setLikeLoadingProperty(undefined),
  });
  const { mutate: unfavoriteProperty, isPending: unfavoriteLoading } = useUnfavoriteProperty({
    onSuccess: () => setLikeLoadingProperty(undefined),
  });

  const isFavorite = (propertyId: number) => {
    if (!user || !tenant?.data || user?.userRole === 'manager') {
      return false;
    }
    return tenant.data.favorites?.some((f) => f.id === propertyId);
  };

  const handleFavoriteToggle = (propertyId: number) => {
    if (!user) {
      return toast.error('Please sign in to manage favorites');
    }
    if (user?.userRole === 'manager') {
      return toast.error('Only tenants can favorite properties');
    }

    setLikeLoadingProperty(propertyId);
    if (isFavorite(propertyId)) unfavoriteProperty(propertyId);
    else favoriteProperty(propertyId);
  };

  const residenceList = residences || [];

  return (
    <div className="space-y-8">
      <Header
        title="Your Current Residences"
        subtitle="Access lease agreements, upcoming payments, and property manager contacts."
      />

      {tenantLoading || residencesLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2].map((i) => (
            <div key={i} className="border-border bg-card space-y-3 rounded-2xl border p-4">
              <Skeleton className="aspect-[4/3] w-full rounded-xl" />
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : residenceList.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {residenceList.map((property) => (
            <PropertyCard
              key={property.id}
              isFavorited={isFavorite(property.id)}
              likeToggleLoading={
                likeLoadingProperty === property.id && (favoriteLoading || unfavoriteLoading)
              }
              onFavoriteToggle={handleFavoriteToggle}
              property={property}
              propertyDetailLink={`/tenants/dashboard/residences/${property.id}`}
              showFavoriteButton={true}
            />
          ))}
        </div>
      ) : (
        <div className="border-border bg-card/50 flex flex-col items-center justify-center space-y-4 rounded-3xl border border-dashed p-12 text-center">
          <div className="bg-secondary/10 text-secondary flex size-14 items-center justify-center rounded-2xl">
            <Home className="size-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-foreground text-lg font-bold">No active residences</h3>
            <p className="text-muted-foreground max-w-sm text-xs">
              Once an application is approved by a property manager and your lease starts, it will
              be listed here.
            </p>
          </div>
          <Link
            href="/search"
            className="bg-secondary text-secondary-foreground inline-flex items-center justify-center rounded-full px-6 py-2.5 text-xs font-bold shadow-md"
          >
            <Search className="mr-1.5 size-4" /> Browse Homes
          </Link>
        </div>
      )}
    </div>
  );
}
