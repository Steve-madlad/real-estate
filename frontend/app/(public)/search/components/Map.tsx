import { useGetProperties } from '@/api/properties';
import { useFiltersStore } from '@/store/filter-store';
import mapboxgl from 'mapbox-gl';
import { useEffect, useRef } from 'react';

if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
  throw new Error('Missing Mapbox access token');
}

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function Map() {
  const mapboxContainerRef = useRef(null);
  const { filters, filtersSidebarOpen } = useFiltersStore();
  const { data, isLoading, error } = useGetProperties();

  console.log({ properties: data?.properties });

  useEffect(() => {
    if (isLoading || error || !data || !mapboxContainerRef.current) return;

    // const map = new mapboxgl.Map({
    //   container: mapboxContainerRef.current,
    //   style: '',
    // });
  }, []);
  return <div>Map</div>;
}
