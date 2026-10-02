'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Grid, LayoutGrid, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface ImagePreviewProps {
  images: string[];
  propertyName?: string;
}

export default function ImagePreview({ images, propertyName = 'Property' }: ImagePreviewProps) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  const photoList = images && images.length > 0 ? images : ['/placeholder.jpg'];

  const openLightbox = (index: number) => {
    setSelectedPhotoIndex(index);
    setGalleryOpen(true);
  };

  return (
    <div className="w-full">
      {/* Desktop Airbnb-style Bento Grid (Hidden on small mobile, visible sm+) */}
      <div className="relative hidden h-[420px] grid-cols-4 grid-rows-2 gap-2.5 overflow-hidden rounded-3xl sm:grid md:h-[480px]">
        {/* Main Big Feature Image */}
        <div
          onClick={() => openLightbox(0)}
          className="group bg-muted relative col-span-2 row-span-2 cursor-pointer overflow-hidden"
        >
          <Image
            src={photoList[0]}
            alt={`${propertyName} primary photo`}
            fill
            priority
            unoptimized
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.jpg';
            }}
          />
          <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-transparent" />
        </div>

        {/* 4 Supporting Photos */}
        {[1, 2, 3, 4].map((idx) => {
          const photoUrl = photoList[idx] || photoList[0];
          return (
            <div
              key={idx}
              onClick={() => openLightbox(idx % photoList.length)}
              className="group bg-muted relative cursor-pointer overflow-hidden"
            >
              <Image
                src={photoUrl}
                alt={`${propertyName} photo ${idx + 1}`}
                fill
                unoptimized
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.jpg';
                }}
              />
              <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-transparent" />
            </div>
          );
        })}

        {/* Floating "Show All Photos" Pill */}
        <Button
          onClick={() => openLightbox(0)}
          size="sm"
          className="bg-background/90 text-foreground hover:bg-background border-border/60 absolute right-4 bottom-4 z-10 gap-2 rounded-xl border text-xs font-bold shadow-xl backdrop-blur-md"
        >
          <LayoutGrid className="text-secondary size-3.5" />
          <span>Show all {photoList.length} photos</span>
        </Button>
      </div>

      {/* Mobile Swipe Carousel */}
      <div className="bg-muted relative aspect-[4/3] w-full overflow-hidden rounded-2xl sm:hidden">
        <Carousel className="size-full">
          <CarouselContent className="size-full">
            {photoList.map((photo, i) => (
              <CarouselItem key={i} className="relative size-full">
                <Image
                  src={photo}
                  alt={`${propertyName} photo ${i + 1}`}
                  fill
                  priority={i === 0}
                  unoptimized
                  className="object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.jpg';
                  }}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          {photoList.length > 1 && (
            <>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
              <CarouselDots className="bottom-2" />
            </>
          )}
        </Carousel>
      </div>

      {/* Fullscreen Lightbox Modal Dialog */}
      <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
        <DialogContent className="max-w-5xl overflow-hidden rounded-3xl border-none bg-black/95 p-0 text-white">
          <DialogTitle className="sr-only">Photo Gallery for {propertyName}</DialogTitle>
          <div className="relative flex h-[80vh] flex-col items-center justify-center p-4">
            <Carousel
              opts={{ startIndex: selectedPhotoIndex }}
              className="flex size-full flex-col items-center justify-center"
            >
              <CarouselContent className="size-full">
                {photoList.map((photo, index) => (
                  <CarouselItem
                    key={index}
                    className="relative flex size-full items-center justify-center"
                  >
                    <div className="relative flex size-full max-h-[70vh] items-center justify-center">
                      <Image
                        src={photo}
                        alt={`${propertyName} full photo ${index + 1}`}
                        fill
                        unoptimized
                        className="object-contain"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4 border-none bg-white/20 text-white hover:bg-white/40" />
              <CarouselNext className="right-4 border-none bg-white/20 text-white hover:bg-white/40" />
              <CarouselDots className="bottom-4" />
            </Carousel>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
