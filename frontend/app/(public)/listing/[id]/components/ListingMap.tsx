import { PropertyWithLocationCoordinates } from '@/types/prismaTypes';
import { Compass, MapPin } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef } from 'react';

if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
  throw new Error('Missing Mapbox access token');
}

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function ListingMap({
  property,
}: {
  property?: PropertyWithLocationCoordinates | null;
}) {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    if (!property) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: 'mapbox://styles/steve-lad/cmtea6ly8004w01qtad8yfbsq',
      center: [property.location.coordinates.longitude, property.location.coordinates.latitude],
      zoom: 9,
    });

    const marker = createPropertyMarker(property, map);
    const markerElement = marker.getElement();
    const path = markerElement.querySelector("path[fill='#3FB1CE']");
    if (path) path.setAttribute('fill', '#000000');

    const resizeMap = () => {
      if (map) setTimeout(() => map.resize(), 700);
    };
    resizeMap();

    return () => map.remove();
  }, [property]);

  if (!property) {
    return (
      <div>
        <h3 className="text-primary-800 dark:text-primary-100 mb-5 text-xl font-semibold">
          Location
        </h3>
        <p className="text-primary-600 dark:text-primary-300 align-center mt-2 gap-3 text-sm">
          <MapPin />
          <span>Address unavailable</span>
        </p>
        <div className="mt-3 max-w-md rounded-xl border border-dashed border-gray-300 p-6 text-sm text-gray-500">
          Map data is not available yet.
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <h3 className="text-primary-800 dark:text-primary-100 mb-5 text-xl font-semibold">
        Location
      </h3>
      <div className="flex-between w-full sm:max-w-lg">
        <span className="text-primary-600 dark:text-primary-300 align-center mt-2 gap-2 text-sm">
          <MapPin size={16} />
          <p>Address: {property.location.address ?? 'Address unavailable'}</p>
        </span>
        <a
          href={`https://maps.google.com/?q=${property.location.address || ''}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-600 dark:text-primary-300 align-center hover:text-primary-800 gap-2 text-sm hover:font-semibold hover:underline"
        >
          <Compass size={16} /> Get Directions
        </a>
      </div>

      <div ref={mapContainerRef} className="mt-3 aspect-square w-full rounded-md sm:max-w-lg" />
    </div>
  );
}

export const createPropertyMarker = (
  property: PropertyWithLocationCoordinates,
  map: mapboxgl.Map,
) => {
  const marker = new mapboxgl.Marker()
    .setLngLat([property.location.coordinates.longitude, property.location.coordinates.latitude])
    .setPopup(
      new mapboxgl.Popup().setHTML(
        `
        <div class="marker-popup">
          <div class="marker-popup-image"></div>
          <div>
            <a href="/search/${property.id}" target="_blank" class="marker-popup-title">${property.name}</a>
            <p class="marker-popup-price">
              $${property.pricePerMonth}
              <span class="marker-popup-price-unit"> / month</span>
            </p>
          </div>
        </div>
        `,
      ),
    )
    .addTo(map);
  return marker;
};
