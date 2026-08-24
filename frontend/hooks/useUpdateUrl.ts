import { cleanParams } from '@/lib/utils';
import { FilterState } from '@/store/filter-store';
import debounce from 'lodash/debounce';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

export function useUpdateFiltersUrl() {
  const router = useRouter();
  const pathname = usePathname();

  const updateUrl = useMemo(
    () =>
      debounce((newFilters: FilterState) => {
        const cleanFilters = cleanParams(newFilters);
        const searchParams = new URLSearchParams();

        Object.entries(cleanFilters).forEach(([key, value]) => {
          searchParams.set(key, Array.isArray(value) ? value.join(',') : String(value));
        });

        router.push(`${pathname}?${searchParams.toString()}`);
      }, 300),
    [router, pathname],
  );

  useEffect(() => {
    return () => {
      updateUrl.cancel();
    };
  }, [updateUrl]);

  return updateUrl;
}
