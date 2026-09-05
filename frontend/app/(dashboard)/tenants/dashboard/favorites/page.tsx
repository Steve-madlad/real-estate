'use client';

import { useGetAuthUser } from '@/api/auth';
import { useGetProperties } from '@/api/properties';
import { useGetTenant, useUnfavoriteProperty } from '@/api/tenant';
import Header from '@/components/Header';
import PropertyCard from '@/components/PropertyCard';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function Favorites() {
  const { data: user } = useGetAuthUser();
  const { data: tenant } = useGetTenant();

  const { data: favoriteProperties, refetch } = useGetProperties(
    { favoriteIds: tenant?.data?.favorites.map((property) => property.id) },
    { enabled: false },
  );

  const [likeLoadingProperty, setLikeLoadingProperty] = useState<number>();
  const { mutate: unfavoriteProperty, isPending: unfavoriteLoading } = useUnfavoriteProperty({
    onSuccess: () => setLikeLoadingProperty(undefined),
  });

  const handleFavoriteToggle = (propertyId: number) => {
    if (!tenant) {
      return toast.error('Please sign in to favorite a property');
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
  }, [tenant?.data]);

  console.log({ tenant, favoriteProperties });
  return (
    <div>
      <Header title="Favorite Properties" subTitle="Broswe and manage you saved listings" />
      <div className="grid grid-cols-1 gap-x-10 gap-y-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {favoriteProperties?.data.map((property) => (
          <PropertyCard
            key={property.id}
            isFavorited
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
