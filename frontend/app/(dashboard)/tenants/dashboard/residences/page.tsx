'use client';

import { useGetAuthUser } from '@/api/auth';
import {
  useFavoriteProperty,
  useGetResidences,
  useGetTenant,
  useUnfavoriteProperty,
} from '@/api/tenant';
import Header from '@/components/Header';
import PropertyCard from '@/components/PropertyCard';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function Favorites() {
  const { data: user } = useGetAuthUser();
  const { data: tenant } = useGetTenant();

  const { data: residences, refetch } = useGetResidences({ enabled: false });

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
    return tenant.data.favorites.some((f) => f.id === propertyId);
  };

  const handleFavoriteToggle = (propertyId: number) => {
    if (!tenant) {
      return toast.error('Please sign in to favorite a property');
    }
    if (user?.userRole === 'manager') {
      return toast.error('Only tenants can favorite properties');
    }

    setLikeLoadingProperty(propertyId);
    if (isFavorite(propertyId)) unfavoriteProperty(propertyId);
    else favoriteProperty(propertyId);
  };

  useEffect(() => {
    if (tenant?.data) {
      refetch();
    }
  }, [tenant?.data]);

  return (
    <div>
      <Header title="Current Residences" subTitle="View and manage your current living spaces" />
      <div className="grid grid-cols-1 gap-x-10 gap-y-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {residences?.data.map((property) => (
          <PropertyCard
            key={property.id}
            isFavorited={isFavorite(property.id)}
            likeToggleLoading={likeLoadingProperty === property.id}
            onFavoriteToggle={handleFavoriteToggle}
            property={property}
            showFavoriteButton
          />
        ))}
      </div>
    </div>
  );
}
