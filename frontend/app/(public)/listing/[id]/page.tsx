'use client';

import { useGetPropertyApplications } from '@/api/applications';
import { useGetAuthUser } from '@/api/auth';
import { useGetProperty } from '@/api/properties';
import { useFavoriteProperty, useGetTenant, useUnfavoriteProperty } from '@/api/tenant';
import ApplicationModal from '@/components/ApplicationModal';
import SigninPromptModal from '@/components/SigninPromptModal';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AmenityIcons, HighlightIcons } from '@/lib/constants';
import { formatEnumString } from '@/lib/utils';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building,
  CheckCircle2,
  Compass,
  Heart,
  HelpCircle,
  Info,
  Loader2,
  MapPin,
  PawPrint,
  Phone,
  Share2,
  Sparkles,
  Star,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import ImagePreview from './components/ImagePreview';
import ListingMap from './components/ListingMap';

export default function ListingPage() {
  const router = useRouter();
  const [applicationModalOpen, setApplicationModalOpen] = useState<boolean>(false);
  const { id } = useParams<{ id: string }>();
  const { data: property, isLoading } = useGetProperty(id);

  const { data: user, isLoading: userLoading } = useGetAuthUser();
  const { data: tenant } = useGetTenant({
    enabled: !!user && user.userRole === 'tenant',
  });

  const { data: propertyApplications, isLoading: applicationsLoading } = useGetPropertyApplications(
    id,
    {
      enabled: !!id && !!user && user.userRole === 'tenant',
    },
  );

  const userApplication = propertyApplications?.find(
    (a) => a.tenantCognitoId === user?.userInfo?.cognitoId && Number(a.propertyId) === Number(id),
  );
  const applicationSentAlready = !!userApplication;

  const { mutate: favoriteProperty, isPending: favoriteLoading } = useFavoriteProperty();
  const { mutate: unfavoriteProperty, isPending: unfavoriteLoading } = useUnfavoriteProperty();

  const [promptModalOpen, setPromptModalOpen] = useState(false);

  if (isLoading) {
    return <ListingSkeleton />;
  }

  if (!property) {
    return <PropertyUnavailableState />;
  }

  const hasAmenities = Array.isArray(property.amenities) && property.amenities.length > 0;
  const hasHighlights = Array.isArray(property.highlights) && property.highlights.length > 0;

  const handleContact = () => {
    if (!user) {
      setPromptModalOpen(true);
      return;
    }
    if (user.userRole === 'manager') {
      toast.error('Only tenants can apply for properties');
      return;
    }
    if (applicationSentAlready) {
      toast.error('You have already submitted an application for this property');
      return;
    }
    setApplicationModalOpen(true);
  };

  const isFavorited =
    tenant?.data?.favorites?.some((favorite) => favorite.id === property.id) ?? false;

  const handleFavoriteToggle = () => {
    if (!user) {
      setPromptModalOpen(true);
      return;
    }
    if (user.userRole === 'manager') {
      toast.error('Only tenants can favorite properties');
      return;
    }

    if (isFavorited) {
      unfavoriteProperty(property.id);
    } else {
      favoriteProperty(property.id);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: property.name,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Listing link copied to clipboard!');
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      {/* Top Breadcrumb & Quick Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="text-muted-foreground hover:text-foreground inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold transition-colors"
        >
          <ArrowLeft className="size-4" />
          <span>Back to search</span>
        </button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="border-border/80 gap-1.5 rounded-full text-xs"
          >
            <Share2 className="size-3.5" />
            <span>Share</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleFavoriteToggle}
            disabled={favoriteLoading || unfavoriteLoading}
            className="border-border/80 gap-1.5 rounded-full text-xs"
          >
            <Heart
              className={`size-3.5 ${isFavorited ? 'fill-secondary text-secondary' : 'text-foreground'}`}
            />
            <span>{isFavorited ? 'Saved' : 'Save'}</span>
          </Button>
        </div>
      </div>

      {/* Main Title & Neighborhood Summary */}
      <div className="space-y-2">
        <h1 className="text-foreground text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">
          {property.name}
        </h1>

        <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm">
          <span className="text-foreground flex items-center gap-1 font-medium">
            <MapPin className="text-secondary size-4 shrink-0" />
            <span>
              {property.location.address}, {property.location.city}, {property.location.state}
            </span>
          </span>

          <span className="text-foreground flex items-center gap-1 font-semibold">
            <Star className="size-4 fill-amber-400 text-amber-400" />
            <span>{property.averageRating?.toFixed(1) || '4.9'}</span>
            <span className="text-muted-foreground font-normal">
              ({property.numberOfReviews || 0} reviews)
            </span>
          </span>

          <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
            <BadgeCheck className="size-4" /> Verified Rental
          </span>
        </div>
      </div>

      {/* Photo Bento Gallery */}
      <ImagePreview
        images={property.photoUrls || ['/placeholder.jpg']}
        propertyName={property.name}
      />

      {/* Main Details + Sticky Booking Card */}
      <div className="grid grid-cols-1 gap-10 pt-4 lg:grid-cols-3">
        {/* Left 2 Columns: Description, Amenities, Highlights, Map */}
        <div className="space-y-10 lg:col-span-2">
          {/* Quick Specs Highlight Bar */}
          <div className="divide-border/80 border-border/80 bg-card grid grid-cols-4 divide-x rounded-2xl border p-4 text-center shadow-xs sm:p-5">
            <div className="px-2">
              <span className="text-muted-foreground block text-[11px] font-bold tracking-wider uppercase">
                Rent / Mo
              </span>
              <span className="text-foreground mt-1 block text-base font-black sm:text-lg">
                ${property.pricePerMonth.toLocaleString()}
              </span>
            </div>
            <div className="px-2">
              <span className="text-muted-foreground block text-[11px] font-bold tracking-wider uppercase">
                Bedrooms
              </span>
              <span className="text-foreground mt-1 block text-base font-black sm:text-lg">
                {property.beds} bd
              </span>
            </div>
            <div className="px-2">
              <span className="text-muted-foreground block text-[11px] font-bold tracking-wider uppercase">
                Bathrooms
              </span>
              <span className="text-foreground mt-1 block text-base font-black sm:text-lg">
                {property.baths} ba
              </span>
            </div>
            <div className="px-2">
              <span className="text-muted-foreground block text-[11px] font-bold tracking-wider uppercase">
                Size
              </span>
              <span className="text-foreground mt-1 block text-base font-black sm:text-lg">
                {property.squareFeet.toLocaleString()} sqft
              </span>
            </div>
          </div>

          {/* About Property */}
          <div className="space-y-4">
            <h2 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
              About this property
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line sm:text-base">
              {property.description ||
                'Experience comfortable living in this stylish residence with premium finishes, abundant natural light, and convenient access to local dining and transit.'}
            </p>
          </div>

          {/* Amenities Grid */}
          <div className="border-border/60 space-y-4 border-t pt-8">
            <h2 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
              Amenities & What this place offers
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {hasAmenities ? (
                property.amenities.map((amenity, index) => {
                  const Icon = AmenityIcons[amenity] ?? HelpCircle;
                  return (
                    <div
                      key={index}
                      className="border-border/70 bg-card text-foreground hover:border-secondary/40 flex items-center gap-3 rounded-2xl border p-3.5 text-xs font-medium transition-colors"
                    >
                      <div className="bg-secondary/10 text-secondary flex size-8 shrink-0 items-center justify-center rounded-xl">
                        <Icon className="size-4" />
                      </div>
                      <span className="font-semibold">{formatEnumString(amenity)}</span>
                    </div>
                  );
                })
              ) : (
                <EmptyTile label="Standard residential amenities included." />
              )}
            </div>
          </div>

          {/* Highlights */}
          {hasHighlights && (
            <div className="border-border/60 space-y-4 border-t pt-8">
              <h2 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
                Key Highlights
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {property.highlights.map((highlight, index) => {
                  const Icon = HighlightIcons[highlight] ?? Sparkles;
                  return (
                    <div
                      key={index}
                      className="border-border/70 bg-card text-foreground flex items-center gap-3 rounded-2xl border p-4 text-xs font-semibold"
                    >
                      <div className="bg-secondary/10 text-secondary flex size-8 shrink-0 items-center justify-center rounded-xl">
                        <Icon className="size-4" />
                      </div>
                      <span>{formatEnumString(highlight)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Fees & Policies Tabs */}
          <div className="border-border/60 space-y-4 border-t pt-8">
            <h2 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
              Rental Policies & Fees
            </h2>
            <Tabs defaultValue="fees" className="w-full">
              <TabsList className="bg-muted rounded-xl p-1">
                <TabsTrigger value="fees" className="rounded-lg text-xs font-semibold">
                  Required Fees
                </TabsTrigger>
                <TabsTrigger value="pets" className="rounded-lg text-xs font-semibold">
                  Pets Policy
                </TabsTrigger>
                <TabsTrigger value="parking" className="rounded-lg text-xs font-semibold">
                  Parking Policy
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="fees"
                className="border-border/80 bg-card mt-4 space-y-3 rounded-2xl border p-5"
              >
                <div className="border-border/60 flex items-center justify-between border-b pb-2 text-xs">
                  <span className="text-muted-foreground font-medium">Application Fee</span>
                  <span className="text-foreground font-bold">
                    ${property.applicationFee?.toLocaleString() || '50'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-medium">Security Deposit</span>
                  <span className="text-foreground font-bold">
                    $
                    {property.securityDeposit?.toLocaleString() ||
                      property.pricePerMonth.toLocaleString()}
                  </span>
                </div>
              </TabsContent>

              <TabsContent
                value="pets"
                className="border-border/80 bg-card mt-4 rounded-2xl border p-5"
              >
                <div className="flex items-center gap-3">
                  <PawPrint className="text-secondary size-5" />
                  <p className="text-foreground text-xs font-medium">
                    {property.isPetsAllowed
                      ? 'Pets are welcome in this residence. Pet deposit or breed restrictions may apply.'
                      : 'Pets are not permitted for this listing.'}
                  </p>
                </div>
              </TabsContent>

              <TabsContent
                value="parking"
                className="border-border/80 bg-card mt-4 rounded-2xl border p-5"
              >
                <div className="flex items-center gap-3">
                  <BadgeCheck className="size-5 text-emerald-500" />
                  <p className="text-foreground text-xs font-medium">
                    {property.isParkingIncluded
                      ? 'Assigned on-site parking is included with monthly lease.'
                      : 'Street parking or optional garage space available separately.'}
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Location & Map Section */}
          <div className="border-border/60 space-y-4 border-t pt-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
                  Location & Neighborhood
                </h2>
                <p className="text-muted-foreground mt-1 flex items-center gap-1.5 text-xs">
                  <MapPin className="text-secondary size-3.5 shrink-0" />
                  <span>
                    {property.location.address}, {property.location.city}, {property.location.state}{' '}
                    {property.location.postalCode}
                  </span>
                </p>
              </div>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(
                  `${property.location.address || ''}, ${property.location.city || ''}, ${property.location.state || ''}`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary inline-flex items-center gap-1.5 self-start text-xs font-semibold hover:underline sm:self-auto"
              >
                <Compass className="size-3.5" />
                <span>Get Directions</span>
              </a>
            </div>

            <div className="border-border w-full overflow-hidden rounded-2xl border shadow-xs">
              <ListingMap property={property} />
            </div>
          </div>
        </div>

        {/* Right Sticky Sidebar: Application & Landlord Card */}
        <div className="lg:col-span-1">
          <div className="border-border/80 bg-card sticky top-24 space-y-6 rounded-3xl border p-6 shadow-xl sm:p-7">
            <div className="border-border/60 flex items-baseline justify-between border-b pb-5">
              <div>
                <span className="text-foreground text-2xl font-black sm:text-3xl">
                  ${property.pricePerMonth.toLocaleString()}
                </span>
                <span className="text-muted-foreground text-xs"> / month</span>
              </div>
              <div className="text-foreground flex items-center gap-1 text-xs font-semibold">
                <Star className="size-3.5 fill-amber-400 text-amber-400" />
                <span>{property.averageRating?.toFixed(1) || '4.9'}</span>
              </div>
            </div>

            {/* Direct Contact Phone Box */}
            <div className="bg-muted/60 border-border/60 flex items-center gap-3.5 rounded-2xl border p-3.5">
              <div className="bg-secondary/10 text-secondary flex size-10 shrink-0 items-center justify-center rounded-xl">
                <Phone className="size-4.5" />
              </div>
              <div className="text-xs">
                <p className="text-muted-foreground font-medium">Property Contact</p>
                <p className="text-foreground text-sm font-bold">(424) 340-5574</p>
              </div>
            </div>

            {/* Primary Action Button */}
            <Button
              size="lg"
              onClick={handleContact}
              disabled={userLoading || applicationsLoading || applicationSentAlready}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground w-full cursor-pointer gap-2 rounded-2xl py-6 text-sm font-bold shadow-md transition-transform active:scale-95"
            >
              {userLoading || applicationsLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : user ? (
                applicationSentAlready ? (
                  <>
                    <CheckCircle2 className="size-4" />
                    <span>Application Submitted</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4" />
                    <span>Apply for this Home</span>
                  </>
                )
              ) : (
                'Sign In to Apply'
              )}
            </Button>

            {/* Pending Application Info Box & Direct Link */}
            {applicationSentAlready && (
              <div className="bg-secondary/10 border-secondary/20 space-y-2 rounded-2xl border p-4">
                <div className="flex items-center justify-between">
                  <span className="text-secondary flex items-center gap-1.5 text-xs font-semibold">
                    <CheckCircle2 className="size-3.5" /> Application Status
                  </span>
                  <span className="bg-secondary/20 text-secondary rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wider uppercase">
                    {userApplication?.status || 'Pending'}
                  </span>
                </div>
                <p className="text-muted-foreground text-xs">
                  Your application is on file with the property manager.
                </p>
                <Link
                  href="/tenants/dashboard/applications"
                  className="text-secondary inline-flex items-center gap-1 pt-1 text-xs font-bold hover:underline"
                >
                  <span>View in Applications Dashboard</span>
                  <ArrowRight className="size-3" />
                </Link>
              </div>
            )}

            {/* Manager View Link if current user is owner */}
            {property.managerCognitoId === user?.userInfo?.cognitoId && (
              <Link
                href={`/managers/dashboard/properties/${property.id}`}
                className="border-border/80 text-foreground hover:bg-muted flex items-center justify-center gap-2 rounded-2xl border py-2.5 text-xs font-semibold transition-colors"
              >
                <Building className="text-secondary size-4" />
                <span>Manage this Property</span>
              </Link>
            )}

            <div className="text-muted-foreground border-border/60 space-y-2 border-t pt-2 text-xs">
              <div className="flex items-center justify-between">
                <span>Lease Term</span>
                <span className="text-foreground font-semibold">12 Months (Standard)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Application Response</span>
                <span className="text-foreground font-semibold">Under 24 hours</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Direct Digital Contract</span>
                <span className="text-foreground font-semibold">Included</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Mobile Bottom Booking Bar */}
      <div className="bg-background/95 border-border/80 fixed right-0 bottom-0 left-0 z-40 flex items-center justify-between border-t px-4 py-3 shadow-2xl backdrop-blur-md lg:hidden">
        <div>
          <span className="text-foreground text-lg font-extrabold">
            ${property.pricePerMonth.toLocaleString()}
          </span>
          <span className="text-muted-foreground text-xs"> /mo</span>
        </div>
        {applicationSentAlready ? (
          <Link
            href="/tenants/dashboard/applications"
            className="bg-secondary/20 text-secondary inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold"
          >
            <CheckCircle2 className="size-3.5" />
            <span>Status: {userApplication?.status || 'Submitted'}</span>
          </Link>
        ) : (
          <Button
            size="sm"
            onClick={handleContact}
            disabled={userLoading || applicationsLoading}
            className="bg-secondary text-secondary-foreground rounded-full px-6 font-bold shadow-md"
          >
            Apply Now
          </Button>
        )}
      </div>

      {/* Application Modal */}
      {user && (
        <ApplicationModal
          isOpen={applicationModalOpen}
          onClose={() => setApplicationModalOpen(false)}
          propertyId={property.id}
          description={`Submit direct rental application for ${property.name}`}
        />
      )}

      {/* Guest Signin Prompt */}
      <SigninPromptModal open={promptModalOpen} onOpenChange={setPromptModalOpen} />
    </div>
  );
}

function ListingSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      <Skeleton className="h-6 w-36 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-10 w-2/3 rounded-xl" />
        <Skeleton className="h-5 w-1/3 rounded-lg" />
      </div>
      <Skeleton className="h-[420px] w-full rounded-3xl" />
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-60 w-full rounded-2xl" />
        </div>
        <div className="lg:col-span-1">
          <Skeleton className="h-80 w-full rounded-3xl" />
        </div>
      </div>
    </div>
  );
}

function PropertyUnavailableState() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg items-center justify-center px-4 text-center">
      <div className="border-border bg-card space-y-4 rounded-3xl border p-8 shadow-xl">
        <div className="bg-destructive/10 text-destructive mx-auto flex size-12 items-center justify-center rounded-2xl">
          <Info className="size-6" />
        </div>
        <h2 className="text-foreground text-xl font-bold">Listing Unavailable</h2>
        <p className="text-muted-foreground text-xs leading-relaxed">
          This property may have been leased, unlisted by the manager, or the ID is incorrect.
        </p>
        <Link
          href="/search"
          className="bg-secondary hover:bg-secondary/90 text-secondary-foreground inline-flex items-center justify-center rounded-full px-6 py-2.5 text-xs font-bold shadow-md"
        >
          Browse Other Homes
        </Link>
      </div>
    </div>
  );
}

function EmptyTile({ label }: { label: string }) {
  return (
    <div className="border-border text-muted-foreground col-span-full rounded-2xl border border-dashed p-6 text-center text-xs">
      {label}
    </div>
  );
}
