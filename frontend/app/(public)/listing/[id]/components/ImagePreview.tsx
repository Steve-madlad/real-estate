'use client';

import { Button } from '@/components/ui/button';
import { NAVBAR_HEIGHT } from '@/lib/constants';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export default function ImagePreview({ images }: ImagePreviewsProps) {
  const [currentImageInex, setCurrentImageIndex] = useState<number>(0);

  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };
  return (
    <div className="relative h-112.5 w-full" style={{ marginTop: `${NAVBAR_HEIGHT - 1}px` }}>
      {images.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${index === currentImageInex ? 'opacity-100' : 'opacity-0'} `}
        >
          <Image
            src={image}
            alt={`Property Image ${index + 1}`}
            fill
            priority={index === 0}
            className="cursor-pointer object-cover transition-transform duration-500 ease-in-out"
          />
        </div>
      ))}

      <button
        onClick={handlePrev}
        aria-label="Previous Image"
        className="bg-primary-700 cursor bg-opacity-50 focus:ring-secondary-300 abs-y-center left-10 transform rounded-full p-2 text-white focus:ring focus:outline-none"
      >
        <ChevronLeft />
      </button>

      <button
        onClick={handleNext}
        aria-label="Next Image"
        className="bg-primary-700 cursor bg-opacity-50 focus:ring-secondary-300 abs-y-center right-10 transform rounded-full p-2 text-white focus:ring focus:outline-none"
      >
        <ChevronRight />
      </button>
    </div>
  );
}
