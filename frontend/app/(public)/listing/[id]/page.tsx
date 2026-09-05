'use client';

import { useGetAuthUser } from '@/api/auth';
import { useGetProperty } from '@/api/properties';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AmenityIcons, HighlightIcons } from '@/lib/constants';
import { formatEnumString } from '@/lib/utils';
import { BadgeCheck, HelpCircle, MapPin, Phone, Star } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import ImagePreview from './components/ImagePreview';
import ListingMap from './components/ListingMap';

export default function Listing() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { data: property, isLoading } = useGetProperty(id);

  const { data: user } = useGetAuthUser();

  if (isLoading) {
    return <ListingSkeleton />;
  }

  if (!property) {
    return <PropertyUnavailableState />;
  }

  const hasAmenities = Array.isArray(property.amenities) && property.amenities.length > 0;
  const hasHighlights = Array.isArray(property.highlights) && property.highlights.length > 0;

  const handleContact = () => {
    if (!user) router.push('/signin');
  };

  return (
    <div>
      <ImagePreview images={['/singlelisting-2.jpg', '/singlelisting-3.jpg']} />
      <div className="col just-center mx-10 my-10 gap-10 md:mx-auto md:w-2/3 md:flex-row!">
        <div className="order-2 flex-1 md:order-1">
          <div className="md:w-fit">
            <div className="mb-4">
              <div className="mb-1 text-sm text-gray-500">
                {property.location.country ?? 'Country unavailable'} /{' '}
                {property.location.state ?? 'State unavailable'} /{' '}
                <span className="font-semibold text-gray-600">
                  {property.location.city ?? 'City unavailable'}
                </span>
              </div>
              <h1 className="my-5 text-3xl font-bold">{property.name ?? 'Property unavailable'}</h1>
              <div className="flex-center gap-3">
                <span className="align-center text-gray-500">
                  <MapPin size={16} className="mr-1 -translate-y-0.5 text-gray-700" />
                  {property.location.city ?? 'City unavailable'}{' '}
                  {property.location.state ?? 'State unavailable'},{' '}
                  {property.location.country ?? 'Country unavailable'}
                </span>
                <div className="flex-center gap-3">
                  <span className="align-center text-yellow-500">
                    <Star size={16} className="mr-1 -translate-y-0.5 fill-current" />
                    {property.averageRating != null ? property.averageRating.toFixed(1) : 'N/A'} (
                    {property.numberOfReviews != null ? `${property.numberOfReviews}` : 'No'}{' '}
                    reviews)
                  </span>
                  <span className="align-center gap-1 text-green-600">
                    <BadgeCheck size={18} className="-translate-y-0.5" /> Verified Listing
                  </span>
                </div>
              </div>
            </div>

            <div className="border-primary-200 mb-6 rounded-xl border p-6">
              <div className="flex-center gap-4 px-5">
                <div>
                  <div className="text-sm text-gray-500">Monthly Rent</div>
                  <div className="font-semi-bold">
                    {property.pricePerMonth != null
                      ? `$${property.pricePerMonth.toLocaleString()}`
                      : 'N/A'}
                  </div>
                </div>
                <div className="h-10 border-l border-gray-300"></div>
                <div>
                  <div className="text-sm text-gray-500">Bedrooms</div>
                  <div className="font-semi-bold">
                    {property.beds != null ? `${property.beds} bd` : 'N/A'}
                  </div>
                </div>
                <div className="h-10 border-l border-gray-300"></div>
                <div>
                  <div className="text-sm text-gray-500">Bathrooms</div>
                  <div className="font-semi-bold">
                    {property.baths != null ? `${property.baths} ba` : 'N/A'}
                  </div>
                </div>
                <div className="h-10 border-l border-gray-300"></div>
                <div>
                  <div className="text-sm text-gray-500">Square Feet</div>
                  <div className="font-semibold">
                    {property.squareFeet != null
                      ? `${property.squareFeet.toLocaleString()} sq ft`
                      : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="my-16">
            <h2 className="mb-5 text-xl font-semibold">About {property.name}</h2>
            <p className="leading-7 text-gray-500">
              {property.description ?? 'Description is not available for this property yet.'}
            </p>
          </div>

          <div className="div mb-6">
            <h2 className="my-3 text-xl font-semibold">Property Amenities</h2>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {hasAmenities ? (
                property.amenities.map((amenity, index) => {
                  const Icon = AmenityIcons[amenity] ?? HelpCircle;
                  return (
                    <div key={index} className="col-center rounded-xl border px-4 py-8">
                      <Icon className="mb-2 size-8 text-gray-700" />
                      <span className="text-center text-sm text-gray-700">
                        {formatEnumString(amenity)}
                      </span>
                    </div>
                  );
                })
              ) : (
                <EmptyTile label="No amenities listed" />
              )}
            </div>
          </div>

          <div className="mt-12 mb-16">
            <h3 className="text-primary-800 dark:text-primary-100 my-3 text-xl font-semibold">
              Highlights
            </h3>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {hasHighlights ? (
                property.highlights.map((highlight, index) => {
                  const Icon = HighlightIcons[highlight] ?? HelpCircle;
                  return (
                    <div key={index} className="col-center rounded-xl border px-4 py-8">
                      <Icon className="text-primary-600 dark:text-primary-300 mb-2 size-8" />
                      <span className="text-primary-600 dark:text-primary-300 text-center text-sm">
                        {formatEnumString(highlight)}
                      </span>
                    </div>
                  );
                })
              ) : (
                <EmptyTile label="No highlights available" />
              )}
            </div>
          </div>

          <div>
            <h3 className="text-primary-800 dark:text-primary-100 mb-5 text-xl font-semibold">
              Fees and Policies
            </h3>
            <p className="text-primary-600 dark:text-primary-300 mt-2 text-sm">
              The fees below are based on community-supplied data and may exclude fees and
              utilities.
            </p>

            <Tabs>
              <TabsList>
                <TabsTrigger value="required-fees">Required Fees</TabsTrigger>
                <TabsTrigger value="pets">Pets</TabsTrigger>
                <TabsTrigger value="parking">Parking</TabsTrigger>
              </TabsList>
              <TabsContent value="required-fees" className="w-1/3">
                <p className="mt-5 mb-2 font-semibold">One time move in fees</p>
                <hr />
                <div className="just-between bg-secnodary-50 py-2">
                  <span className="text-primary-700 font-medium">Application Fee</span>
                  <span className="text-primary-700">{property.applicationFee ?? 'N/A'}</span>
                </div>
                <hr />
                <div className="just-between bg-secondary-50 py-2">
                  <span className="text-primary-700 font-medium">Security Deposit</span>
                  <span className="text-primary-700">{property.securityDeposit ?? 'N/A'}</span>
                </div>
              </TabsContent>
              <TabsContent value="pets">
                <p className="font-semi-bold mt-5 mb-2">
                  Pets are{' '}
                  {property.isPetsAllowed == null
                    ? 'unknown'
                    : property.isPetsAllowed
                      ? 'allowed'
                      : 'not allowed'}
                </p>
              </TabsContent>
              <TabsContent value="parking">
                <p className="font-semi-bold mt-5 mb-2">
                  Parking is{' '}
                  {property.isParkingIncluded == null
                    ? 'unknown'
                    : property.isParkingIncluded
                      ? 'included'
                      : 'not included'}
                </p>
              </TabsContent>
            </Tabs>
          </div>

          <ListingMap property={property} />
        </div>

        <div className="order-1 min-w-80 flex-1 md:order-2 md:max-w-100">
          <div className="border-primary-200 h-fit rounded-2xl border bg-white p-7">
            <div className="align-center border-primary-200 mb-4 gap-5 rounded-xl border p-4">
              <div className="align-center bg-primary-900 rounded-full p-4">
                <Phone className="text-primary-50" size={15} />
              </div>
              <div>
                <p>Contact This Property</p>
                <div className="text-primary-800 text-lg font-bold">(424) 340-5574</div>
              </div>
            </div>
            <Button
              onClick={handleContact}
              className="bg-primary-700 hover:bg-primary-600 w-full text-white"
            >
              {user ? 'Submit Application' : 'Sign In to Apply'}
            </Button>
            <hr className="my-4" />
            <div className="text-sm">
              <div className="text-primary600 mb-1">Language: English</div>
              <div className="text-primary600">Open by appointment on Monday - Sunday</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ListingSkeleton() {
  return (
    <div>
      <Skeleton className="h-112.5 w-full" />
      <div className="col just-center mx-10 my-10 gap-10 md:mx-auto md:w-2/3 md:flex-row!">
        <div className="order-2 md:order-1">
          <div className="mx-auto w-full max-w-4xl">
            <div className="mb-4 space-y-4">
              <Skeleton className="h-4 w-56" />
              <Skeleton className="h-10 w-3/4" />
              <div className="flex flex-wrap gap-3">
                <Skeleton className="h-6 w-72" />
                <Skeleton className="h-6 w-48" />
              </div>
            </div>

            <div className="border-primary-200 mb-6 rounded-xl border p-6">
              <div className="flex flex-wrap items-center gap-4 px-5">
                <Skeleton className="h-14 w-24" />
                <Skeleton className="h-10 w-px" />
                <Skeleton className="h-14 w-24" />
                <Skeleton className="h-10 w-px" />
                <Skeleton className="h-14 w-24" />
                <Skeleton className="h-10 w-px" />
                <Skeleton className="h-14 w-28" />
              </div>
            </div>

            <div className="my-16 space-y-4">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-10/12" />
            </div>

            <div className="mb-6 space-y-4">
              <Skeleton className="h-8 w-48" />
              <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <Skeleton key={index} className="h-28 rounded-xl" />
                ))}
              </div>
            </div>

            <div className="mt-12 mb-16 space-y-4">
              <Skeleton className="h-8 w-40" />
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className="h-28 rounded-xl" />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Skeleton className="h-8 w-56" />
              <Skeleton className="h-4 w-96" />
              <Skeleton className="h-12 w-80" />
              <Skeleton className="h-24 w-full" />
            </div>

            <div className="mt-12 space-y-4">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-64 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PropertyUnavailableState() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center px-6 text-center">
      <div className="space-y-4 rounded-2xl border border-dashed border-gray-300 bg-white/70 p-8 shadow-sm">
        <p className="text-sm font-semibold tracking-[0.2em] text-gray-500 uppercase">
          Listing unavailable
        </p>
        <h1 className="text-2xl font-bold text-gray-900">We could not load this property.</h1>
        <p className="text-sm leading-6 text-gray-600">
          The listing may have been removed, the ID may be invalid, or the property data is still
          loading from the source.
        </p>
      </div>
    </div>
  );
}

function EmptyTile({ label }: { label: string }) {
  return (
    <div className="col-center rounded-xl border border-dashed px-4 py-8 text-center text-sm text-gray-500">
      {label}
    </div>
  );
}
