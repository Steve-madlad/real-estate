'use client';

import { useGetAuthUser } from '@/api/auth';
import { useGetProperties } from '@/api/properties';
import { useFavoriteProperty, useGetTenant, useUnfavoriteProperty } from '@/api/tenant';
import { useFiltersStore } from '@/store/filter-store';
import { useState } from 'react';
import { toast } from 'sonner';
import PropertyCard from './PropertyCard';

export default function Listings() {
  const [likeLoadingProperty, setLikeLoadingProperty] = useState<number>();
  const { mutate: favoriteProperty, isPending: favoriteLoading } = useFavoriteProperty();
  const { mutate: unfavoriteProperty, isPending: unfavoriteLoading } = useUnfavoriteProperty({
    onSuccess: () => setLikeLoadingProperty(undefined),
  });
  const { filters, viewMode } = useFiltersStore();

  const { data: user } = useGetAuthUser();
  const { data: tenant } = useGetTenant();
  const { data: properties, isLoading: propertiesLoading } = useGetProperties();

  const isFavorite = (propertyId: number) => {
    if (!user || !tenant?.data || user?.userRole === 'manager') {
      return false;
    }
    return tenant.data.favorites.some((f) => f.id === propertyId);
  };

  const handleFavoriteToggle = (propertyId: number) => {
    if (!user) {
      return toast.error('Please sign in to favorite a property');
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
    <div className="w-full">
      {properties && (
        <h3 className="flex gap-2 px-4 text-sm font-bold">
          {properties?.data.length}
          <span className="font-normal text-gray-700">Places in {filters.location}</span>
        </h3>
      )}
      <div className="flex">
        <div className="w-full p-4">
          {propertiesLoading
            ? [...Array(10)].map((_, i) => (
                <div key={i} className="mb-5 h-88 animate-pulse rounded-xl bg-gray-200 shadow-sm" />
              ))
            : properties?.data.map((property) => (
                <PropertyCard
                  key={property.id}
                  isFavorited={isFavorite(property.id)}
                  property={property}
                  onFavoriteToggle={handleFavoriteToggle}
                  likeToggleLoading={
                    likeLoadingProperty === property.id && (favoriteLoading || unfavoriteLoading)
                  }
                  showFavoriteButton
                  compactMode={viewMode === 'list'}
                />
              ))}
        </div>
      </div>
    </div>
  );
}
