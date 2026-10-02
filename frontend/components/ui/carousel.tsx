'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import * as React from 'react';

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

const EMPTY_CAROUSEL_SNAPSHOT = JSON.stringify({
  canScrollPrev: false,
  canScrollNext: false,
  selectedIndex: 0,
  scrollSnaps: [],
});

interface CarouselProps {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: 'horizontal' | 'vertical';
  setApi?: (api: CarouselApi) => void;
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  selectedIndex: number;
  scrollSnaps: number[];
  scrollTo: (index: number) => void;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);
  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />');
  }
  return context;
}

function Carousel({
  orientation = 'horizontal',
  opts,
  setApi,
  plugins,
  className,
  children,
  ...props
}: React.ComponentProps<'div'> & CarouselProps) {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === 'horizontal' ? 'x' : 'y',
    },
    plugins,
  );
  const subscribe = React.useCallback(
    (onStoreChange: () => void) => {
      if (!api) return () => {};
      api.on('reInit', onStoreChange);
      api.on('select', onStoreChange);
      return () => {
        api.off('reInit', onStoreChange);
        api.off('select', onStoreChange);
      };
    },
    [api],
  );
  const getSnapshot = React.useCallback(
    () =>
      api
        ? JSON.stringify({
            canScrollPrev: api.canScrollPrev(),
            canScrollNext: api.canScrollNext(),
            selectedIndex: api.selectedScrollSnap(),
            scrollSnaps: api.scrollSnapList(),
          })
        : EMPTY_CAROUSEL_SNAPSHOT,
    [api],
  );
  const snapshot = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => EMPTY_CAROUSEL_SNAPSHOT,
  );
  const { canScrollPrev, canScrollNext, selectedIndex, scrollSnaps } = JSON.parse(snapshot) as {
    canScrollPrev: boolean;
    canScrollNext: boolean;
    selectedIndex: number;
    scrollSnaps: number[];
  };

  const scrollTo = React.useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api],
  );

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = React.useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext],
  );

  React.useEffect(() => {
    if (!api || !setApi) return;
    setApi(api);
  }, [api, setApi]);

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api,
        opts,
        orientation: orientation || (opts?.axis === 'y' ? 'vertical' : 'horizontal'),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
        selectedIndex,
        scrollSnaps,
        scrollTo,
      }}
    >
      <div
        onKeyDownCapture={handleKeyDown}
        className={cn('relative', className)}
        role="region"
        aria-roledescription="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

function CarouselContent({ className, ...props }: React.ComponentProps<'div'>) {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div ref={carouselRef} className="h-full w-full overflow-hidden">
      <div
        className={cn(
          'flex h-full',
          orientation === 'horizontal' ? 'ml-0' : 'mt-0 flex-col',
          className,
        )}
        {...props}
      />
    </div>
  );
}

function CarouselItem({ className, ...props }: React.ComponentProps<'div'>) {
  const { orientation } = useCarousel();

  return (
    <div
      role="group"
      aria-roledescription="slide"
      className={cn(
        'min-w-0 shrink-0 grow-0 basis-full',
        orientation === 'horizontal' ? 'pl-0' : 'pt-0',
        className,
      )}
      {...props}
    />
  );
}

function CarouselPrevious({
  className,
  variant = 'outline',
  size = 'icon',
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();

  if (!canScrollPrev) return null;

  return (
    <Button
      type="button"
      aria-haspopup="true"
      variant={variant}
      size={size}
      className={cn(
        'bg-background/90 hover:bg-background absolute z-10 size-7 rounded-full opacity-0 shadow-md backdrop-blur-xs transition-all group-hover:opacity-100 active:scale-95 disabled:hidden',
        orientation === 'horizontal'
          ? 'top-1/2 left-2 -translate-y-1/2'
          : '-top-12 left-1/2 -translate-x-1/2 rotate-90',
        className,
      )}
      disabled={!canScrollPrev}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        scrollPrev();
      }}
      {...props}
    >
      <ChevronLeft className="size-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  );
}

function CarouselNext({
  className,
  variant = 'outline',
  size = 'icon',
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollNext, canScrollNext } = useCarousel();

  if (!canScrollNext) return null;

  return (
    <Button
      type="button"
      aria-haspopup="true"
      variant={variant}
      size={size}
      className={cn(
        'bg-background/90 hover:bg-background absolute z-10 size-7 rounded-full opacity-0 shadow-md backdrop-blur-xs transition-all group-hover:opacity-100 active:scale-95 disabled:hidden',
        orientation === 'horizontal'
          ? 'top-1/2 right-2 -translate-y-1/2'
          : '-bottom-12 left-1/2 -translate-x-1/2 rotate-90',
        className,
      )}
      disabled={!canScrollNext}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        scrollNext();
      }}
      {...props}
    >
      <ChevronRight className="size-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  );
}

function CarouselDots({ className, ...props }: React.ComponentProps<'div'>) {
  const { scrollSnaps, selectedIndex, scrollTo } = useCarousel();

  if (scrollSnaps.length <= 1) return null;

  return (
    <div
      className={cn(
        'pointer-events-auto absolute bottom-2.5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5',
        className,
      )}
      {...props}
    >
      {scrollSnaps.map((_, index) => (
        <button
          key={index}
          type="button"
          aria-label={`Go to slide ${index + 1}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            scrollTo(index);
          }}
          className={cn(
            'size-1.5 cursor-pointer rounded-full transition-all duration-200',
            selectedIndex === index ? 'w-4 bg-white shadow-sm' : 'bg-white/60 hover:bg-white/90',
          )}
        />
      ))}
    </div>
  );
}

export {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useCarousel,
  type CarouselApi,
};
