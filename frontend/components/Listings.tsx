'use client';

import { useGetAuthUser } from '@/api/auth';
import { useGetProperties } from '@/api/properties';
import { useFavoriteProperty, useGetTenant, useUnfavoriteProperty } from '@/api/tenant';
import { cn } from '@/lib/utils';
import { useFiltersStore } from '@/store/filter-store';
import { Sparkles, MapPin, SearchX } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import PropertyCard from './PropertyCard';
import SigninPromptModal from './SigninPromptModal';
import { Skeleton } from './ui/skeleton';
import { Button } from './ui/button';

export default function Listings() {
  const [likeLoadingProperty, setLikeLoadingProperty] = useState<number>();
  const { mutate: favoriteProperty, isPending: favoriteLoading } = useFavoriteProperty();
  const { mutate: unfavoriteProperty, isPending: unfavoriteLoading } = useUnfavoriteProperty({
    onSuccess: () => setLikeLoadingProperty(undefined),
  });
  const { filters, viewMode, resetFilters } = useFiltersStore();

  const { data: user } = useGetAuthUser();
  const { data: tenant } = useGetTenant({ enabled: user?.userRole === 'tenant' });

  const params = Object.fromEntries(
    Object.entries(filters)
      .flatMap(([key, value]) => {
        if (value == null) return [];

        if (key === 'priceRange') {
          return [
            ['priceMin', value[0]],
            ['priceMax', value[1]],
          ];
        }
        if (key === 'squareFeet') {
          return [
            ['squareFeetMin', value[0]],
            ['squareFeetMax', value[1]],
          ];
        }
        if (key === 'coordinates') {
          return [
            ['latitude', value[0]],
            ['longitude', value[1]],
          ];
        }

        return [[key, value]];
      })
      .filter(([_, v]) => {
        return !(v == null || v === 'any' || (Array.isArray(v) && !v.length));
      }),
  );

  const { data: properties, isLoading: propertiesLoading } = useGetProperties(params);
  const [promptModalOpen, setPromptModalOpen] = useState(false);

  const isFavorite = (propertyId: number) => {
    if (!user || !tenant?.data || user?.userRole === 'manager') {
      return false;
    }
    return tenant.data.favorites?.some((f) => f.id === propertyId);
  };

  const handleFavoriteToggle = (propertyId: number) => {
    if (!user) {
      return setPromptModalOpen(true);
    }
    if (user?.userRole === 'manager') {
      return toast.error('Only tenants can favorite properties');
    }

    setLikeLoadingProperty(propertyId);

    const isFavorited = isFavorite(propertyId);
    if (isFavorited) {
      unfavoriteProperty(propertyId);
    } else {
      favoriteProperty(propertyId);
    }
  };

  return (
    <div className="flex h-full w-full flex-col">
      {/* Search Header counter */}
      {!propertiesLoading && properties?.data !== undefined && (
        <div className="border-border/60 flex items-center justify-between border-b px-3 py-2 text-xs">
          <div className="text-foreground flex items-center gap-1.5 font-bold">
            <span>{properties.data.length}</span>
            <span className="text-muted-foreground font-normal">
              {properties.data.length === 1 ? 'property' : 'properties'}{' '}
              {filters.location ? `in ${filters.location}` : 'available'}
            </span>
          </div>
          {filters.propertyType && filters.propertyType !== 'any' && (
            <span className="bg-secondary/10 text-secondary rounded-full px-2.5 py-0.5 text-[10px] font-bold">
              {filters.propertyType}
            </span>
          )}
        </div>
      )}

      {/* Listings Stream */}
      <div className="flex-1 space-y-4 overflow-y-auto p-3">
        {propertiesLoading ? (
          <div
            className={cn(
              'grid gap-4',
              viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1',
            )}
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="border-border bg-card space-y-3 rounded-2xl border p-3">
                <Skeleton className="aspect-[4/3] w-full rounded-xl" />
                <div className="space-y-2 pt-1">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : properties?.data && properties.data.length > 0 ? (
          <div
            className={cn(
              'grid gap-4',
              viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1',
            )}
          >
            {properties.data.map((property) => (
              <PropertyCard
                key={property.id}
                isFavorited={isFavorite(property.id)}
                property={property}
                onFavoriteToggle={handleFavoriteToggle}
                likeToggleLoading={
                  likeLoadingProperty === property.id && (favoriteLoading || unfavoriteLoading)
                }
                showFavoriteButton={user?.userRole !== 'manager'}
                compactMode={viewMode === 'list'}
              />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="border-border bg-card/50 flex flex-col items-center justify-center space-y-4 rounded-2xl border border-dashed px-4 py-16 text-center">
            <div className="bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-2xl">
              <SearchX className="size-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-foreground text-base font-bold">No matches found</h4>
              <p className="text-muted-foreground max-w-xs text-xs">
                Try widening your price range, clearing filters, or exploring a different
                neighborhood.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => resetFilters()}
              className="rounded-full text-xs"
            >
              Reset all filters
            </Button>
          </div>
        )}
      </div>

      <SigninPromptModal open={promptModalOpen} onOpenChange={setPromptModalOpen} />
    </div>
  );
}
