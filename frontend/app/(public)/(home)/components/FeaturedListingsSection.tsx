'use client';

import { useGetAuthUser } from '@/api/auth';
import { useGetProperties } from '@/api/properties';
import { useFavoriteProperty, useGetTenant, useUnfavoriteProperty } from '@/api/tenant';
import PropertyCard from '@/components/PropertyCard';
import SigninPromptModal from '@/components/SigninPromptModal';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

export default function FeaturedListingsSection() {
  const { data: propertiesResponse, isLoading } = useGetProperties();
  const { data: user } = useGetAuthUser();
  const { data: tenant } = useGetTenant({ enabled: user?.userRole === 'tenant' });
  const [promptModalOpen, setPromptModalOpen] = useState(false);

  const { mutate: favoriteProperty, isPending: favoriteLoading } = useFavoriteProperty();
  const { mutate: unfavoriteProperty, isPending: unfavoriteLoading } = useUnfavoriteProperty();

  const handleFavoriteToggle = (propertyId: number) => {
    if (!user) {
      return setPromptModalOpen(true);
    }
    if (user.userRole === 'manager') {
      return toast.error('Only tenants can favorite properties');
    }

    const isFavorited = tenant?.data?.favorites?.some((f) => f.id === propertyId);
    if (isFavorited) {
      unfavoriteProperty(propertyId);
    } else {
      favoriteProperty(propertyId);
    }
  };

  const properties = (propertiesResponse?.data || []).slice(0, 6);

  return (
    <section className="bg-background py-20 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="space-y-2">
            <div className="bg-secondary/10 text-secondary inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold tracking-wide uppercase">
              <Sparkles className="size-3.5" /> Featured Residences
            </div>
            <h2 className="text-foreground text-3xl font-extrabold tracking-tight sm:text-4xl">
              Trending Rentals This Week
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Handpicked homes and premium apartments with verified amenities.
            </p>
          </div>

          <Link
            href="/search"
            className="text-secondary hover:text-secondary/80 inline-flex items-center gap-2 text-sm font-bold transition-colors"
          >
            <span>Explore all properties</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="border-border bg-card space-y-3 rounded-2xl border p-4">
                <Skeleton className="aspect-[4/3] w-full rounded-xl" />
                <div className="space-y-2 pt-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => {
              const isFavorited = tenant?.data?.favorites?.some((f) => f.id === property.id);
              return (
                <PropertyCard
                  key={property.id}
                  property={property}
                  isFavorited={isFavorited}
                  showFavoriteButton={true}
                  onFavoriteToggle={handleFavoriteToggle}
                  likeToggleLoading={favoriteLoading || unfavoriteLoading}
                />
              );
            })}
          </div>
        ) : null}

        <SigninPromptModal open={promptModalOpen} onOpenChange={setPromptModalOpen} />
      </div>
    </section>
  );
}
