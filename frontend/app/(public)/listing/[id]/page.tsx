'use client';

import { useGetProperty } from '@/api/properties';
import { MapPin, Star } from 'lucide-react';
import { useParams } from 'next/navigation';
import ImagePreview from './components/ImagePreview';

export default function Listing() {
  const { id } = useParams<{ id: string }>();
  const { data: property } = useGetProperty(id);

  return (
    <div>
      <ImagePreview images={['/singlelisting-2.jpg', '/singlelisting-3.jpg']} />
      <div className="mb-4">
        <div className="mb-1 text-sm text-gray-500">
          {property?.data?.location.country} / {property?.data?.location.state}
          <span className="font-semibold text-gray-600">South Kuta</span>
        </div>
        <h1 className="my-5 text-3xl font-bold">property?.data?.name</h1>
        <div className="flex-center">
          <span className="align-center text-gray-500">
            <MapPin size="4" className="mr-1 text-gray-700" />
            {property?.data?.location.city} {property?.data?.location.state},{' '}
            {property?.data?.location.country}
          </span>
          <div className="flex-center gap-3">
            <span className="align-center text-yellow-500">
              <Star size="4" className="mr-1 fill-current" />
              {property?.data?.averageRating?.toFixed(1)} ({property?.data?.numberOfReviews}{' '}
              reviews)
            </span>
            <span className="text-green-600">Verified Listing</span>
          </div>
        </div>
      </div>
    </div>
  );
}
// || property?.data?.photoUrls || []
