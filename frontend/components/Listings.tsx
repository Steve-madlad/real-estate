'use client';

import { useGetAuthUser } from '@/api/auth';
import { useGetProperties } from '@/api/properties';
import { useFavoriteProperty, useUnfavoriteProperty } from '@/api/tenant';
import { useFiltersStore } from '@/store/filter-store';
import { useState } from 'react';
import { toast } from 'sonner';
import PropertyCard from './PropertyCard';

export default function Listings() {
  const { mutate: favoriteProperty, isPending: favoriteLoading } = useFavoriteProperty();
  const { mutate: unfavoriteProperty, isPending: unfavoriteLoading } = useUnfavoriteProperty();
  const { filters, viewMode } = useFiltersStore();

  const { data: user, isLoading: userLoading } = useGetAuthUser();
  const { data: properties, isLoading: propertiesLoading } = useGetProperties();

  const [likeLoadingProperty, setLikeLoadingProperty] = useState<number>();

  const isFavorite = (propertyId: number) => {
    if (!user || user?.userRole === 'manager') {
      return false;
    }
    return user.userInfo.favorites.some((f) => f.id === propertyId);
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

    setLikeLoadingProperty(undefined);
  };

  return (
    <div className="w-full">
      <h3 className="px-4 text-sm font-bold">
        {properties?.data.length}
        <span className="font-normal text-gray-700">Places in {filters.location}</span>
      </h3>
      <div className="flex">
        <div className="w-full p-4">
          {properties?.data.map((property) =>
            viewMode === 'grid' ? (
              <PropertyCard
                key={property.id}
                isFavorited={isFavorite(property.id)}
                property={property}
                propertyLink={`/properties/${property.id}`}
                onFavoriteToggle={handleFavoriteToggle}
                showFavoriteButton
              />
            ) : (
              <></>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
