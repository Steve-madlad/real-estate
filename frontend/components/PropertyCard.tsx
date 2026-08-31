import { cn } from '@/lib/utils';
import { PropertyWithLocation } from '@/types/prismaTypes';
import { Bath, Bed, Heart, House, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from './ui/button';

export default function PropertyCard({
  property,
  isFavorited,
  showFavoriteButton,
  propertyLink,
  onFavoriteToggle,
}: {
  property: PropertyWithLocation;
  isFavorited: boolean;
  showFavoriteButton: boolean;
  propertyLink: string;
  onFavoriteToggle: (propertyId: number) => void;
}) {
  const [imgSrc, setImgSrc] = useState<string>(property.photoUrls[0] || '/placehoder.jpg');

  return (
    <div className="mb-5 w-full overflow-hidden rounded-xl shadow-xl">
      <div className="relative">
        <div className="relative h-48 w-full">
          <Image
            className="object-cover"
            src={imgSrc}
            alt="property.name"
            fill
            sizes="(max-width: 768px) 100vh, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImgSrc('/placeholder.jpg')}
          />
        </div>
        <div className="absolute-bottom-4 left-4 flex gap-2">
          {property.isPetsAllowed && (
            <span className="bg-white-80 rounded-full px-2 py-1 text-xs font-semibold text-black capitalize">
              pets allowed
            </span>
          )}
          {property.isParkingIncluded && (
            <span className="bg-white-80 rounded-full px-2 py-1 text-xs font-semibold text-black capitalize">
              parking included
            </span>
          )}
        </div>

        {showFavoriteButton && (
          <Button
            className="hover:bg-white-90 cursor absolute right-4 bottom-4 rounded-full bg-white p-2"
            onClick={() => onFavoriteToggle(property.id)}
          >
            <Heart
              className={cn('size-5', isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600')}
            />
          </Button>
        )}

        <div className="p-4">
          <h2 className="mb-1 text-xl font-bold">
            {propertyLink ? (
              <Link
                href={propertyLink}
                scroll={false}
                className="hover:text-blue-600 hover:underline"
              >
                {property.name}
              </Link>
            ) : (
              property.name
            )}
          </h2>
          <p className="text-gray 600 mb-2">
            {property?.location?.address} {property?.location?.city}
          </p>
          <div className="flex-center">
            <div className="align-center mb-2">
              <Star className="mr-1 size-4 text-yellow-400" />
              <span className="font-semibold">{property.averageRating?.toFixed(1)}</span>
              <span className="ml-l text-gray-600">{property.pricePerMonth?.toFixed(1)}</span>
            </div>
            <p className="mb-3 text-lg font-bold">
              {property.pricePerMonth.toFixed(0)}
              <span className="text-base font-normal text-gray-600">/month</span>
            </p>
          </div>

          <hr />

          <div className="flex-center mt-5 gap-4 text-gray-600">
            <span className="align-center">
              <Bed className="mr-2 size-5">{property.beds} Beds</Bed>
            </span>
            <span className="align-center">
              <Bath className="mr-2 size-5">{property.baths} Baths</Bath>
            </span>
            <span className="align-center">
              <House className="mr-2 size-5">{property.squareFeet} sq ft</House>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
