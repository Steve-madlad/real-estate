import { useCallback, useSyncExternalStore } from 'react';

export default function useMediaQuery(query: string, serverFallback: boolean): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const mediaQueryList = matchMedia(query);

      mediaQueryList.addEventListener('change', onStoreChange);

      return () => {
        mediaQueryList.removeEventListener('change', onStoreChange);
      };
    },
    [query],
  );

  const getSnapshot = () => matchMedia(query).matches;

  return useSyncExternalStore(subscribe, getSnapshot, () => serverFallback);
}
