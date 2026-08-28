'use client';

import FiltersBar from '@/components/FiltersBar';
import FiltersSidebar from '@/components/FiltersSidebar';
import { NAVBAR_HEIGHT } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useFiltersStore } from '@/store/filter-store';
import Map from './components/Map';

export default function SearchPage() {
  // const searchParams = useSearchParams();
  const { filtersSidebarOpen } = useFiltersStore();

  return (
    <div
      className="col mx-auto w-full px-5"
      style={{ height: `calc(100vh - ${NAVBAR_HEIGHT}px)`, marginTop: `${NAVBAR_HEIGHT}px` }}
    >
      <FiltersBar />
      <div className="just-between mb-5 flex-1 gap-3 overflow-hidden">
        <div
          className={cn(
            'h-full overflow-auto transition-all duration-300 ease-in-out',
            filtersSidebarOpen ? 'visible w-3/12 opacity-100' : 'invisible w-0 opacity-0',
          )}
        >
          <FiltersSidebar />
        </div>
        <Map />
        <div className="basis-4/12 overflow-y-auto">{/* <Listings/> */}</div>
      </div>
    </div>
  );
}
