import { useCallback, useSyncExternalStore } from 'react';

export default function useMediaQuery(query: string, serverFallback: boolean): boolean {
  const getMediaQueryList = () => matchMedia(query);

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const mediaQueryList = getMediaQueryList();

      mediaQueryList.addEventListener('change', onStoreChange);

      return () => {
        mediaQueryList.removeEventListener('change', onStoreChange);
      };
    },
    [query],
  );

  const getSnapshot = () => getMediaQueryList().matches;

  return useSyncExternalStore(subscribe, getSnapshot, () => serverFallback);
}
