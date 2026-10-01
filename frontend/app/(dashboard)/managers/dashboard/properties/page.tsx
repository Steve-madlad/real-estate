'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Building, Plus, Sparkles, TrendingUp, Users } from 'lucide-react';
import { useGetAuthUser } from '@/api/auth';
import { useGetManagerProperties } from '@/api/manager';
import Header from '@/components/Header';
import PropertyCard from '@/components/PropertyCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function PropertiesPage() {
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
  }, [user?.userRole, refetch]);

  const propertyList = properties?.data || [];
  const totalRentPotential = propertyList.reduce((acc, p) => acc + (p.pricePerMonth || 0), 0);

  return (
    <div className="space-y-8">
      <Header
        title="Your Managed Properties"
        subtitle="Monitor portfolio performance, active listings, and occupancy rates."
      >
        <Link
          href="/managers/create-property"
          className="bg-secondary hover:bg-secondary/90 text-secondary-foreground inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs font-bold shadow-xs transition-colors"
        >
          <Plus className="size-4" /> Add New Property
        </Link>
      </Header>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="border-border/80 bg-card rounded-2xl border p-5 shadow-xs">
          <div className="text-muted-foreground mb-2 flex items-center justify-between text-xs">
            <span className="font-semibold tracking-wider uppercase">Total Listings</span>
            <Building className="text-secondary size-4" />
          </div>
          <div className="text-foreground text-2xl font-black sm:text-3xl">
            {propertiesLoading ? <Skeleton className="h-8 w-16" /> : propertyList.length}
          </div>
        </div>

        <div className="border-border/80 bg-card rounded-2xl border p-5 shadow-xs">
          <div className="text-muted-foreground mb-2 flex items-center justify-between text-xs">
            <span className="font-semibold tracking-wider uppercase">Monthly Potential</span>
            <TrendingUp className="size-4 text-emerald-500" />
          </div>
          <div className="text-foreground text-2xl font-black sm:text-3xl">
            {propertiesLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              `$${totalRentPotential.toLocaleString()}`
            )}
          </div>
        </div>

        <div className="border-border/80 bg-card rounded-2xl border p-5 shadow-xs">
          <div className="text-muted-foreground mb-2 flex items-center justify-between text-xs">
            <span className="font-semibold tracking-wider uppercase">Status</span>
            <Sparkles className="size-4 text-amber-500" />
          </div>
          <div className="text-foreground text-2xl font-black sm:text-3xl">
            {propertiesLoading ? <Skeleton className="h-8 w-20" /> : 'Active'}
          </div>
        </div>
      </div>

      {/* Property Cards Grid */}
      {propertiesLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border-border bg-card space-y-3 rounded-2xl border p-4">
              <Skeleton className="aspect-[4/3] w-full rounded-xl" />
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : propertyList.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {propertyList.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              showFavoriteButton={false}
              showListingLink={true}
              propertyDetailLink={`/managers/dashboard/properties/${property.id}`}
            />
          ))}
        </div>
      ) : (
        <div className="border-border bg-card/50 flex flex-col items-center justify-center space-y-4 rounded-3xl border border-dashed p-12 text-center">
          <div className="bg-secondary/10 text-secondary flex size-14 items-center justify-center rounded-2xl">
            <Building className="size-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-foreground text-lg font-bold">No properties listed yet</h3>
            <p className="text-muted-foreground max-w-sm text-xs">
              List your first residential unit to start receiving rental applications and inquiries.
            </p>
          </div>
          <Link
            href="/managers/create-property"
            className="bg-secondary text-secondary-foreground inline-flex items-center justify-center rounded-full px-6 py-2.5 text-xs font-bold shadow-md"
          >
            <Plus className="mr-1.5 size-4" /> Create Property
          </Link>
        </div>
      )}
    </div>
  );
}
