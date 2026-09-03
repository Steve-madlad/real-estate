import { useGetProperties } from '@/api/properties';
import { useFiltersStore } from '@/store/filter-store';
import { PropertyWithLocationCoordinates } from '@/types/prismaTypes';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
  throw new Error('Missing Mapbox access token');
}

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function Map() {
  const mapContainerRef = useRef(null);
  const { filters, filtersSidebarOpen } = useFiltersStore();
  const { data: properties, isLoading, error } = useGetProperties();

  useEffect(() => {
    if (isLoading || error || !properties) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: 'mapbox://styles/steve-lad/cmtea6ly8004w01qtad8yfbsq',
      center: [-74.5, 40],
      zoom: 9,
    });

    properties.data.forEach((property) => {
      const marker = createPropertyMarker(property, map);
      const markerElement = marker.getElement();
      const path = markerElement.querySelector("path[fill='#3FB1CE']");
      if (path) path.setAttribute('fill', '#000000');
    });

    const resizeMap = () => {
      if (map) setTimeout(() => map.resize(), 700);
    };
    resizeMap();

    return () => map.remove();
  }, [isLoading, error, properties, filters.coordinates]);

  if (error || !properties) toast.error('Failed to show listings. Please refresh the page.');

  return (
    <div className="relative grow basis-5/12 rounded-xl">
      {isLoading ? (
        <div className="size-full animate-pulse rounded-xl bg-gray-200"></div>
      ) : (
        <div
          className="map-container rounded-xl"
          ref={mapContainerRef}
          style={{
            height: '100%',
            width: '100%',
          }}
        />
      )}
    </div>
  );
}

const createPropertyMarker = (property: PropertyWithLocationCoordinates, map: mapboxgl.Map) => {
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
