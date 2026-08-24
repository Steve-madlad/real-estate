import { useUpdateFiltersUrl } from '@/hooks/useUpdateUrl';
import { PropertyTypeIcons } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { FilterState, useFiltersStore } from '@/store/filter-store';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

export default function FiltersSidebar() {
  const { filters, setFilters, filtersSidebarOpen, resetFilters } = useFiltersStore();
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  const updateUrl = useUpdateFiltersUrl();

  const handleSubmit = () => {
    setFilters(localFilters);
    updateUrl(localFilters);
  };

  if (!filtersSidebarOpen) return null;

  return (
    <div>
      <div className="h-full overflow-auto rounded-lg bg-white px-4 pb-10">
        <div className="col space-y-6">
          {/* Location */}
          <div>
            <h4 className="mb-2 font-bold">Location</h4>
            <div className="align-center">
              <Input
                placeholder="Enter location"
                value={filters.location}
                onChange={(e) => setLocalFilters((prev) => ({ ...prev, location: e.target.value }))}
                className="rounded-l-xl rounded-r-none border-r-0"
              />
              <Button
                // onClick={handleSearchLocation}
                className="border-l-none rounded-l-none rounded-r-xl border-black shadow-none"
              >
                <Search className="size-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Property Type */}
        <div>
          <h4 className="mb-2 font-bold">Property Type</h4>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(PropertyTypeIcons).map(([type, Icon]) => (
              <div
                key={type}
                onClick={() =>
                  setLocalFilters((prev) => ({ ...prev, propertyType: type as PropertyTypeEnum }))
                }
                className={cn(
                  'col-full-center rounded-xl border p-4',
                  localFilters.propertyType === type ? 'border-black' : 'border-gray-200',
                )}
              >
                <Icon className="mb-2 size-6" />
                <span>{type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
