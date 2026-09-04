'use client';

import { useGetProperty } from '@/api/properties';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AmenityIcons, HighlightIcons } from '@/lib/constants';
import { formatEnumString } from '@/lib/utils';
import { BadgeCheck, HelpCircle, MapPin, Star } from 'lucide-react';
import { useParams } from 'next/navigation';
import ImagePreview from './components/ImagePreview';

export default function Listing() {
  const { id } = useParams<{ id: string }>();
  const { data: property } = useGetProperty(id);

  return (
    <div>
      <ImagePreview images={['/singlelisting-2.jpg', '/singlelisting-3.jpg']} />
      <div className="col just-center mx-10 my-10 gap-10 md:mx-auto md:w-2/3 md:flex-row!">
        <div className="order-2 md:order-1">
          <div className="mx-auto w-fit">
            <div className="mb-4">
              <div className="mb-1 text-sm text-gray-500">
                {property?.location.country} / {property?.location.state} /
                <span className="font-semibold text-gray-600">{property?.location.city}</span>
              </div>
              <h1 className="my-5 text-3xl font-bold">{property?.name}</h1>
              <div className="flex-center gap-3">
                <span className="align-center text-gray-500">
                  <MapPin size={16} className="mr-1 -translate-y-0.5 text-gray-700" />
                  {property?.location.city} {property?.location.state}, {property?.location.country}
                </span>
                <div className="flex-center gap-3">
                  <span className="align-center text-yellow-500">
                    <Star size={16} className="mr-1 -translate-y-0.5 fill-current" />
                    {property?.averageRating?.toFixed(1)} ({property?.numberOfReviews} reviews)
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
                  <div className="font-semi-bold">{property?.pricePerMonth.toString()}</div>
                </div>
                <div className="h-10 border-l border-gray-300"></div>
                <div>
                  <div className="text-sm text-gray-500">Bedrooms</div>
                  <div className="font-semi-bold">{property?.beds} bd</div>
                </div>
                <div className="h-10 border-l border-gray-300"></div>
                <div>
                  <div className="text-sm text-gray-500">Bathrooms</div>
                  <div className="font-semi-bold">{property?.baths} ba</div>
                </div>
                <div className="h-10 border-l border-gray-300"></div>
                <div>
                  <div className="text-sm text-gray-500">Square Feet</div>
                  <div className="font-semibold">{property?.squareFeet.toLocaleString()} sq ft</div>
                </div>
              </div>
            </div>
          </div>

          <div className="my-16">
            <h2 className="mb-5 text-xl font-semibold">About {property?.name}</h2>
            <p className="leading-7 text-gray-500">
              {property?.description}
              Experience resort style luxury living at Seacrest Homes, where the ocean and city are
              seamlessly intertwined. Our newly built community features sophisticated two and
              three-bedroom residences, each complete with high end designer finishes, quartz
              counter tops, stainless steel whirlpool appliances, office nook, and a full size
              in-unit washer and dryer. Find your personal escape at home beside stunning swiming
              pools and spas with poolside cabanas. Experience your very own oasis surrounded by
              lavish landscaped courtyards, with indoor/outdoor entertainment seating. By day,
              lounge in the BBQ area and experience the breath taking unobstructed views stretching
              from the Palos Verdes Peninsula to Downtown Los Angeles, or watch the beauty of the
              South Bay skyline tight up by night. Start or end your day with a workout in our
              full-size state of the art fitness club and yoga studio. Save the cornute and plan
              your next meeting in the business centers conference room, adjacent to our internet
              and coffee lounge. Conveniently located near beautiful local beaches with easy access
              to the llø, 405 and 91 freeways, exclusive shopping at the largest malt in the Western
              United States &quotThe Del Amo Fashion Center&quot to the hospital of your choice,
              Kaiser Hospital, UCLA Harbor Medical Center, Torrance Memorial Medical Center, and
              Providence Little Company of Mary Hospital Torrance rated one of the top 10 Best in
              Los Angeles. Contact us today to tour and embrace the Seacrest luxury lifestyle as
              your own. Seacrest Homes Apartments is an apartment community located in Los Angeles
              County and the 90501 ZIP Code. This area is served by the LOS Angeles Unified
              attendance zone.
            </p>
          </div>

          <div className="div mb-6">
            <h2 className="my-3 text-xl font-semibold">Property Amenities</h2>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {property &&
                property.amenities.map((amenity, index) => {
                  const Icon = AmenityIcons[amenity] || <HelpCircle />;
                  return (
                    <div key={index} className="col-center rounded-xl border px-4 py-8">
                      <Icon className="mb-2 size-8 text-gray-700"></Icon>
                      <span className="text-center text-sm text-gray-700">
                        {formatEnumString(amenity)}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="mt-12 mb-16">
            <h3 className="text-primary-800 dark:text-primary-100 my-3 text-xl font-semibold">
              Highlights
            </h3>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {property &&
                property.highlights.map((highlight, index) => {
                  const Icon = HighlightIcons[highlight] || <HelpCircle />;
                  return (
                    <div key={index} className="col-center rounded-xl border px-4 py-8">
                      <Icon className="text-primary-600 dark:text-primary-300 mb-2 size-8"></Icon>
                      <span className="text-primary-600 dark:text-primary-300 text-center text-sm">
                        {formatEnumString(highlight)}
                      </span>
                    </div>
                  );
                })}
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
                  <span className="text-primary-700">{property?.applicationFee}</span>
                </div>
                <hr />
                <div className="just-between bg-secondary-50 py-2">
                  <span className="text-primary-700 font-medium">Security Deposit</span>
                  <span className="text-primary-700">{property?.securityDeposit}</span>
                </div>
              </TabsContent>
              <TabsContent value="pets">
                <p className="font-semi-bold mt-5 mb-2">
                  Pets are {property?.isPetsAllowed ? 'allowed' : 'not allowed'}
                </p>
              </TabsContent>
              <TabsContent value="parking">
                <p className="font-semi-bold mt-5 mb-2">
                  Parking is {property?.isParkingIncluded ? 'included' : 'not included'}
                </p>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
// || property?.data?.photoUrls || []
