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
  className,
}: {
  property?: PropertyWithLocationCoordinates | null;
  className?: string;
}) {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!property || !mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/steve-lad/cmtea6ly8004w01qtad8yfbsq',
      center: [property.location.coordinates.longitude, property.location.coordinates.latitude],
      zoom: 12,
    });

    // Add navigation controls (zoom in / zoom out)
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');

    const marker = createPropertyMarker(property, map);
    const markerElement = marker.getElement();
    const path = markerElement.querySelector("path[fill='#3FB1CE']");
    if (path) path.setAttribute('fill', '#000000');

    map.on('load', () => {
      map.resize();
    });

    const resizeTimer = setTimeout(() => {
      map.resize();
    }, 300);

    const handleWindowResize = () => map.resize();
    window.addEventListener('resize', handleWindowResize);

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleWindowResize);
      map.remove();
    };
  }, [property]);

  if (!property) {
    return (
      <div className="border-border bg-muted/30 text-muted-foreground flex h-72 w-full items-center justify-center rounded-2xl border border-dashed p-6 text-sm">
        <MapPin className="text-muted-foreground mr-2 size-4" />
        Map data is not available for this listing.
      </div>
    );
  }

  return (
    <div
      ref={mapContainerRef}
      className={className || 'h-[360px] w-full overflow-hidden rounded-2xl sm:h-[420px]'}
    />
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
