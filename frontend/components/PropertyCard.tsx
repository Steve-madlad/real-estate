import { cn } from '@/lib/utils';
import { PropertyWithLocation } from '@/types/prismaTypes';
import { BadgeCheck, Bath, Bed, Heart, House, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface PropertyCardProps {
  property: PropertyWithLocation;
  isFavorited?: boolean;
  showFavoriteButton?: boolean;
  likeToggleLoading?: boolean;
  onFavoriteToggle?: (propertyId: number) => void;
}

const propertyLink = (id: number) => `/listing/${id}`;

export default function PropertyCard({
  compactMode,
  ...props
}: PropertyCardProps & { compactMode?: boolean }) {
  const [imgSrc, setImgSrc] = useState<string>(props.property.photoUrls[0] || '/placehoder.jpg');

  if (compactMode) {
    return <CompactCard {...props} imgSrc={imgSrc} setImgSrc={setImgSrc} />;
  } else {
    return <FullCard {...props} imgSrc={imgSrc} setImgSrc={setImgSrc} />;
  }
}

function FullCard({
  property,
  isFavorited,
  showFavoriteButton,
  likeToggleLoading,
  onFavoriteToggle,
  imgSrc,
  setImgSrc,
}: PropertyCardProps & { imgSrc: string; setImgSrc: (src: string) => void }) {
  const link = propertyLink(property.id);

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
        <div className="mt-2 ml-2 flex gap-2">
          {property.isPetsAllowed && (
            <Badge className="bg-primary text-white">
              <BadgeCheck data-icon="inline-start" />
              pets allowed
            </Badge>
          )}
          {property.isParkingIncluded && (
            <Badge className="bg-primary text-white">
              <BadgeCheck data-icon="inline-start" /> parking included
            </Badge>
          )}
        </div>

        {showFavoriteButton && onFavoriteToggle && (
          <Button
            className="hover:bg-white-90 cursor absolute top-3 right-3 size-7 rounded-full bg-white p-4 shadow-sm"
            onClick={() => onFavoriteToggle(property.id)}
            disabled={likeToggleLoading}
          >
            <Heart
              className={cn('size-5', isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-500')}
            />
          </Button>
        )}

        <div className="p-4">
          <h2 className="mb-1 text-xl font-bold">
            {link ? (
              <Link href={link} scroll={false} className="hover:text-blue-600 hover:underline">
                {property.name}
              </Link>
            ) : (
              property.name
            )}
          </h2>
          <p className="mb-2 text-gray-600">
            {property?.location?.address} {property?.location?.city}
          </p>
          <div className="flex-between">
            <div className="align-center mb-2">
              <Star className="mr-1 size-4 text-yellow-400" />
              <span className="font-semibold">{property.averageRating?.toFixed(1)}</span>
              <span className="font-semibold">({property.numberOfReviews} Reviews)</span>
            </div>
            <p className="mb-3 text-lg font-bold">
              ${property.pricePerMonth.toFixed(0)}
              <span className="text-base font-normal text-gray-600">/month</span>
            </p>
          </div>

          <hr />

          <div className="flex-between mt-5 gap-4 text-gray-600">
            <span className="align-center">
              <Bed className="mr-2 size-5 -translate-y-0.5" />
              {property.beds} Beds
            </span>
            <span className="align-center">
              <Bath className="mr-2 size-5 -translate-y-0.5" />
              {property.baths} Baths
            </span>
            <span className="align-center">
              <House className="mr-2 size-5 -translate-y-0.5" />
              {property.squareFeet} sq ft
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CompactCard({
  property,
  isFavorited,
  showFavoriteButton,
  likeToggleLoading,
  onFavoriteToggle,
  imgSrc,
  setImgSrc,
}: PropertyCardProps & { imgSrc: string; setImgSrc: (src: string) => void }) {
  const link = propertyLink(property.id);

  return (
    <div className="mb-5 flex h-40 w-full overflow-hidden rounded-xl shadow-xl">
      <div className="relative w-1/3">
        <Image
          className="object-cover"
          src={imgSrc}
          alt="property.name"
          fill
          sizes="(max-width: 768px) 100vh, (max-width: 1200px) 50vw, 33vw"
          onError={() => setImgSrc('/placeholder.jpg')}
        />
        <div className="col absolute bottom-2 left-2 gap-1">
          {property.isPetsAllowed && (
            <Badge className="bg-primary text-white">
              <BadgeCheck data-icon="inline-start" />
              pets
            </Badge>
          )}
          {property.isParkingIncluded && (
            <Badge className="bg-primary text-white">
              <BadgeCheck data-icon="inline-start" /> parking
            </Badge>
          )}
        </div>

        {showFavoriteButton && onFavoriteToggle && (
          <Button
            className="hover:bg-white-90 cursor absolute top-2 left-2 size-5 rounded-full bg-white p-4 shadow-sm"
            onClick={() => onFavoriteToggle(property.id)}
            disabled={likeToggleLoading}
          >
            <Heart
              className={cn('size-4', isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-500')}
            />
          </Button>
        )}
      </div>

      <div className="col-between w-2/3 p-4">
        <div>
          <div className="just-between items-start">
            <h2 className="mb-1 text-xl font-bold">
              {link ? (
                <Link href={link} scroll={false} className="hover:text-blue-600 hover:underline">
                  {property.name}
                </Link>
              ) : (
                property.name
              )}
            </h2>
          </div>
          <p className="mb-2 text-sm text-gray-600">
            {property?.location?.address} {property?.location?.city}
          </p>
          <div className="align-center text-sm">
            <Star className="mr-1 size-3 text-yellow-400" />
            <span className="font-semibold">{property.averageRating?.toFixed(1)}</span>
            <span className="font-semibold">({property.numberOfReviews})</span>
          </div>
        </div>

        <div className="flex-between text-sm">
          <div className="flex gap-2 text-gray-600">
            <span className="align-center">
              <Bed className="mr-1 size-4 -translate-y-0.5" />
              {property.beds}
            </span>
            <span className="align-center">
              <Bath className="mr-1 size-4 -translate-y-0.5" />
              {property.baths}
            </span>
            <span className="align-center">
              <House className="mr-1 size-4 -translate-y-0.5" />
              {property.squareFeet}
            </span>
          </div>

          <p className="text-base font-bold">
            ${property.pricePerMonth.toFixed(0)}
            <span className="text-xs font-normal text-gray-600">/mo</span>
          </p>
        </div>
      </div>
    </div>
  );
}
