'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BadgeCheck,
  Bath,
  Bed,
  ExternalLink,
  Heart,
  Home as HouseIcon,
  Loader2,
  MapPin,
  PawPrint,
  Sparkles,
  Star,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PropertyWithLocation } from '@/types/prismaTypes';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel';

interface PropertyCardProps {
  property: PropertyWithLocation;
  isFavorited?: boolean;
  showFavoriteButton?: boolean;
  showListingLink?: boolean;
  likeToggleLoading?: boolean;
  onFavoriteToggle?: (propertyId: number) => void;
  propertyDetailLink?: string;
  compactMode?: boolean;
}

const propertyLink = (id: number) => `/listing/${id}`;

export default function PropertyCard({ compactMode, ...props }: PropertyCardProps) {
  if (compactMode) {
    return <CompactCard {...props} />;
  }
  return <FullCard {...props} />;
}

function FullCard({
  property,
  isFavorited,
  showFavoriteButton,
  showListingLink,
  likeToggleLoading,
  onFavoriteToggle,
  propertyDetailLink,
}: PropertyCardProps) {
  const link = propertyDetailLink || propertyLink(property.id);
  const photos =
    property.photoUrls && property.photoUrls.length > 0 ? property.photoUrls : ['/placeholder.jpg'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="group border-border/70 bg-card text-card-foreground hover:border-border relative flex flex-col overflow-hidden rounded-2xl border shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Photo Carousel Area */}
      <div className="bg-muted relative aspect-[4/3] w-full overflow-hidden">
        <Carousel className="size-full">
          <CarouselContent className="size-full">
            {photos.map((photo, index) => (
              <CarouselItem key={index} className="relative size-full">
                <Image
                  src={photo}
                  alt={`${property.name} - image ${index + 1}`}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.jpg';
                  }}
                />
              </CarouselItem>
            ))}
          </CarouselContent>

          {photos.length > 1 && (
            <>
              <CarouselPrevious className="bg-background/80 text-foreground hover:bg-background left-2.5 size-7 rounded-full border-none shadow-md backdrop-blur-xs" />
              <CarouselNext className="bg-background/80 text-foreground hover:bg-background right-2.5 size-7 rounded-full border-none shadow-md backdrop-blur-xs" />
              <CarouselDots className="bottom-2.5" />
            </>
          )}
        </Carousel>

        {/* Top Badges */}
        <div className="pointer-events-none absolute top-3 left-3 z-10 flex flex-wrap gap-1.5">
          {property.isPetsAllowed && (
            <Badge className="bg-background/85 text-foreground border-none px-2 py-0.5 text-[11px] font-semibold shadow-xs backdrop-blur-md">
              <PawPrint className="text-secondary mr-1 size-3" /> Pets
            </Badge>
          )}
          {property.isParkingIncluded && (
            <Badge className="bg-background/85 text-foreground border-none px-2 py-0.5 text-[11px] font-semibold shadow-xs backdrop-blur-md">
              <BadgeCheck className="mr-1 size-3 text-emerald-500" /> Parking
            </Badge>
          )}
        </div>

        {/* Favorite Heart Button */}
        {showFavoriteButton && onFavoriteToggle && (
          <motion.button
            whileTap={{ scale: 0.82 }}
            type="button"
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            className="bg-background/80 text-foreground hover:bg-background absolute top-3 right-3 z-10 flex size-9 cursor-pointer items-center justify-center rounded-full shadow-md backdrop-blur-md transition-all hover:scale-110"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onFavoriteToggle(property.id);
            }}
            disabled={likeToggleLoading}
          >
            {likeToggleLoading ? (
              <Loader2 className="text-muted-foreground size-4 animate-spin" />
            ) : (
              <Heart
                className={cn(
                  'size-4.5 transition-colors',
                  isFavorited
                    ? 'fill-secondary text-secondary'
                    : 'text-foreground/70 hover:text-foreground',
                )}
              />
            )}
          </motion.button>
        )}

        {/* Public Listing Link overlay for manager preview */}
        {showListingLink && (
          <Link
            href={`/listing/${property.id}`}
            target="_blank"
            className="bg-background/90 text-foreground hover:bg-background absolute right-3 bottom-3 z-10 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold opacity-0 shadow-md backdrop-blur-md transition-all duration-200 group-hover:opacity-100"
          >
            <span>Public View</span>
            <ExternalLink className="text-secondary size-3" />
          </Link>
        )}
      </div>

      {/* Card Content & Details */}
      <div className="flex flex-1 flex-col justify-between p-4.5">
        <div>
          {/* Location & Rating Header */}
          <div className="text-muted-foreground flex items-center justify-between gap-2 text-xs">
            <span className="flex items-center gap-1 truncate font-medium">
              <MapPin className="text-secondary size-3.5 shrink-0" />
              <span className="truncate">
                {property.location?.city || 'Location'}, {property.location?.state || ''}
              </span>
            </span>

            <div className="text-foreground flex shrink-0 items-center gap-1 font-semibold">
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
              <span>{property.averageRating?.toFixed(1) || '4.9'}</span>
              <span className="text-muted-foreground text-[11px] font-normal">
                ({property.numberOfReviews || 0})
              </span>
            </div>
          </div>

          {/* Property Name */}
          <h3 className="text-foreground mt-1.5 line-clamp-1 text-base font-bold tracking-tight">
            <Link href={link} scroll={false} className="hover:text-secondary transition-colors">
              {property.name}
            </Link>
          </h3>

          <p className="text-muted-foreground mt-0.5 line-clamp-1 text-xs">
            {property.location?.address || property.propertyType}
          </p>
        </div>

        <div className="border-border/60 mt-3.5 space-y-2.5 border-t pt-3">
          {/* Specs row */}
          <div className="text-muted-foreground flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1">
              <Bed className="text-foreground/70 size-3.5" />
              <span className="text-foreground font-semibold">{property.beds}</span> bd
            </span>
            <span className="flex items-center gap-1">
              <Bath className="text-foreground/70 size-3.5" />
              <span className="text-foreground font-semibold">{property.baths}</span> ba
            </span>
            <span className="flex items-center gap-1">
              <HouseIcon className="text-foreground/70 size-3.5" />
              <span className="text-foreground font-semibold">
                {property.squareFeet?.toLocaleString()}
              </span>{' '}
              sqft
            </span>
          </div>
          {/* Price */}
          <div>
            <span className="text-foreground text-lg font-black tracking-tight">
              ${property.pricePerMonth.toLocaleString()}
            </span>
            <span className="text-muted-foreground text-xs font-normal"> /mo</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function CompactCard({
  property,
  isFavorited,
  showFavoriteButton,
  likeToggleLoading,
  onFavoriteToggle,
  propertyDetailLink,
}: PropertyCardProps) {
  const link = propertyDetailLink || propertyLink(property.id);
  const photos =
    property.photoUrls && property.photoUrls.length > 0 ? property.photoUrls : ['/placeholder.jpg'];

  return (
    <div className="group border-border/70 bg-card text-card-foreground hover:border-border relative flex h-36 w-full overflow-hidden rounded-xl border shadow-xs transition-all duration-200 hover:shadow-md">
      {/* Thumbnail */}
      <div className="bg-muted relative w-40 shrink-0 overflow-hidden">
        <Image
          src={photos[0]}
          alt={property.name}
          fill
          unoptimized
          sizes="160px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.jpg';
          }}
        />

        {showFavoriteButton && onFavoriteToggle && (
          <button
            type="button"
            aria-label={isFavorited ? 'Remove favorite' : 'Save favorite'}
            className="bg-background/80 absolute top-2 left-2 z-10 flex size-7 cursor-pointer items-center justify-center rounded-full shadow-xs backdrop-blur-md transition-transform hover:scale-110"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onFavoriteToggle(property.id);
            }}
            disabled={likeToggleLoading}
          >
            {likeToggleLoading ? (
              <Loader2 className="text-muted-foreground size-3.5 animate-spin" />
            ) : (
              <Heart
                className={cn(
                  'size-3.5',
                  isFavorited ? 'fill-secondary text-secondary' : 'text-foreground/70',
                )}
              />
            )}
          </button>
        )}
      </div>

      {/* Details */}
      <div className="flex min-w-0 flex-1 flex-col justify-between p-3">
        <div>
          <div className="text-muted-foreground flex items-center justify-between gap-1 text-[11px]">
            <span className="truncate">
              {property.location?.city}, {property.location?.state}
            </span>
            <div className="text-foreground flex shrink-0 items-center gap-0.5 font-semibold">
              <Star className="size-3 fill-amber-400 text-amber-400" />
              <span>{property.averageRating?.toFixed(1) || '4.9'}</span>
            </div>
          </div>

          <h4 className="text-foreground mt-1 line-clamp-1 text-sm font-bold tracking-tight">
            <Link href={link} scroll={false} className="hover:text-secondary">
              {property.name}
            </Link>
          </h4>
        </div>

        <div className="border-border/50 flex items-center justify-between gap-1.5 border-t pt-2">
          <div className="text-muted-foreground flex min-w-0 items-center gap-1.5 truncate text-[11px]">
            <span>{property.beds} bd</span>
            <span className="text-muted-foreground/40">•</span>
            <span>{property.baths} ba</span>
            <span className="text-muted-foreground/40">•</span>
            <span className="truncate">{property.squareFeet} sqft</span>
          </div>

          <div className="shrink-0 text-right">
            <span className="text-foreground text-sm font-extrabold">
              ${property.pricePerMonth.toLocaleString()}
            </span>
            <span className="text-muted-foreground text-[10px]">/mo</span>
          </div>
        </div>
      </div>
    </div>
  );
}
