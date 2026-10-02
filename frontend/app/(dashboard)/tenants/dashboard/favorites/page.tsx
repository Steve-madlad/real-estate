'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, Search, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useGetAuthUser } from '@/api/auth';
import { useGetProperties } from '@/api/properties';
import { useGetTenant, useUnfavoriteProperty } from '@/api/tenant';
import Header from '@/components/Header';
import PropertyCard from '@/components/PropertyCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function TenantFavoritesPage() {
  const { data: user } = useGetAuthUser();
  const { data: tenant } = useGetTenant();

  const {
    data: favoriteProperties,
    isLoading,
    refetch,
  } = useGetProperties({ favoritesOnly: true }, { enabled: false });

  const [likeLoadingProperty, setLikeLoadingProperty] = useState<number>();
  const { mutate: unfavoriteProperty, isPending: unfavoriteLoading } = useUnfavoriteProperty({
    onSuccess: () => setLikeLoadingProperty(undefined),
  });

  const handleFavoriteToggle = (propertyId: number) => {
    if (!tenant) {
      return toast.error('Please sign in to manage favorites');
    }
    if (user?.userRole === 'manager') {
      return toast.error('Only tenants can favorite properties');
    }

    setLikeLoadingProperty(propertyId);
    unfavoriteProperty(propertyId);
  };

  useEffect(() => {
    if (tenant?.data) {
      refetch();
    }
  }, [tenant?.data, refetch]);

  const properties = favoriteProperties?.data || [];

  return (
    <div className="space-y-8">
      <Header
        title="Saved Favorite Homes"
        subtitle="Keep track of listings you love and compare prices across neighborhoods."
      >
        <Link
          href="/search"
          className="border-border bg-card hover:bg-muted text-foreground inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold transition-colors"
        >
          <Search className="text-secondary size-3.5" /> Explore More
        </Link>
      </Header>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border-border bg-card space-y-3 rounded-2xl border p-4">
              <Skeleton className="aspect-[4/3] w-full rounded-xl" />
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : properties.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              isFavorited={true}
              likeToggleLoading={likeLoadingProperty === property.id && unfavoriteLoading}
              onFavoriteToggle={handleFavoriteToggle}
              property={property}
              showFavoriteButton={true}
            />
          ))}
        </div>
      ) : (
        <div className="border-border bg-card/50 flex flex-col items-center justify-center space-y-4 rounded-3xl border border-dashed p-12 text-center">
          <div className="bg-secondary/10 text-secondary flex size-14 items-center justify-center rounded-2xl">
            <Heart className="size-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-foreground text-lg font-bold">No favorites saved yet</h3>
            <p className="text-muted-foreground max-w-sm text-xs">
              Click the heart icon on any property card or listing to save it here for quick access.
            </p>
          </div>
          <Link
            href="/search"
            className="bg-secondary text-secondary-foreground inline-flex items-center justify-center rounded-full px-6 py-2.5 text-xs font-bold shadow-md"
          >
            <Search className="mr-1.5 size-4" /> Start Exploring
          </Link>
        </div>
      )}
    </div>
  );
}
