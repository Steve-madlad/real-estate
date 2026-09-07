'use client';

import { useGetAuthUser } from '@/api/auth';
import { useGetManagerProperties } from '@/api/manager';
import Header from '@/components/Header';
import PropertyCard from '@/components/PropertyCard';
import { useEffect } from 'react';

export default function Properties() {
  const { data: user } = useGetAuthUser();
  const {
    data: properties,
    isLoading: propertiesLoading,
    refetch,
  } = useGetManagerProperties({ enabled: false });

  useEffect(() => {
    if (user?.userRole === 'manager') {
      refetch();
    }
  }, [user?.userRole]);

  return (
    <div>
      <Header title="Your Properties" subTitle="View and manage your properties and tenants" />
      <div className="grid grid-cols-1 gap-x-10 gap-y-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {propertiesLoading ? (
          <div className="animate-pulse bg-gray-300"></div>
        ) : !properties?.data ? (
          <div>No Properties found</div>
        ) : (
          properties?.data.map((property) => (
            <PropertyCard key={property.id} property={property} showFavoriteButton={false} />
          ))
        )}
      </div>
    </div>
  );
}
