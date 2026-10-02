import { FilterState } from '@/store/filter-store';
import debounce from 'lodash/debounce';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

type UpdateFiltersUrlOptions = {
  mode?: 'merge' | 'replace';
};

export type FilterUpdateParams = Partial<{
  [K in keyof FilterState]: FilterState[K] | null | 'any';
}> & {
  priceMin?: number | string | null;
  priceMax?: number | string | null;
  [key: string]: unknown;
};

export function useUpdateFiltersUrl() {
  const router = useRouter();

  const updateUrl = useMemo(
    () =>
      debounce((newFilters: FilterUpdateParams, options: UpdateFiltersUrlOptions = {}) => {
        const { mode = 'merge' } = options;
        const currentUrl = new URL(window.location.href);
        const searchParams =
          mode === 'merge' ? new URLSearchParams(currentUrl.searchParams) : new URLSearchParams();

        Object.entries(newFilters).forEach(([key, value]) => {
          if (key === 'priceMin') {
            if (value !== null && value !== undefined && value !== 'any' && value !== '') {
              searchParams.set('priceMin', String(value));
            } else {
              searchParams.delete('priceMin');
            }
            return;
          }

          if (key === 'priceMax') {
            if (value !== null && value !== undefined && value !== 'any' && value !== '') {
              searchParams.set('priceMax', String(value));
            } else {
              searchParams.delete('priceMax');
            }
            return;
          }

          if (key === 'priceRange') {
            searchParams.delete('priceRange');
            if (Array.isArray(value)) {
              if (value[0] !== null && value[0] !== undefined) {
                searchParams.set('priceMin', String(value[0]));
              } else {
                searchParams.delete('priceMin');
              }
              if (value[1] !== null && value[1] !== undefined) {
                searchParams.set('priceMax', String(value[1]));
              } else {
                searchParams.delete('priceMax');
              }
            }
            return;
          }

          if (
            value === undefined ||
            value === null ||
            value === 'any' ||
            value === '' ||
            (Array.isArray(value) &&
              (value.length === 0 || value.every((item) => item === null || item === undefined)))
          ) {
            searchParams.delete(key);
          } else {
            searchParams.set(key, Array.isArray(value) ? value.join(',') : String(value));
          }
        });

        const queryString = searchParams.toString();
        router.push(queryString ? `${currentUrl.pathname}?${queryString}` : currentUrl.pathname);
      }, 300),
    [router],
  );

  useEffect(() => {
    return () => {
      updateUrl.cancel();
    };
  }, [updateUrl]);

  return updateUrl;
}
