import { cleanParams } from '@/lib/utils';
import { FilterState } from '@/store/filter-store';
import debounce from 'lodash/debounce';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

type UpdateFiltersUrlOptions = {
  mode?: 'merge' | 'replace';
};

export function useUpdateFiltersUrl() {
  const router = useRouter();

  const updateUrl = useMemo(
    () =>
      debounce(
        (
          newFilters: Partial<FilterState> & { priceMin?: number | null; priceMax?: number | null },
          options: UpdateFiltersUrlOptions = {},
        ) => {
          const { mode = 'merge' } = options;
          const currentUrl = new URL(window.location.href);
          const searchParams =
            mode === 'merge' ? new URLSearchParams(currentUrl.searchParams) : new URLSearchParams();

          const cleanFilters = cleanParams(newFilters);

          Object.entries(cleanFilters).forEach(([key, value]) => {
            searchParams.set(key, Array.isArray(value) ? value.join(',') : String(value));
          });

          router.push(`${currentUrl.pathname}?${searchParams.toString()}`);
        },
        300,
      ),
    [router],
  );

  useEffect(() => {
    return () => {
      updateUrl.cancel();
    };
  }, [updateUrl]);

  return updateUrl;
}
