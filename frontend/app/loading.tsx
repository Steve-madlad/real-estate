'use client';

import { Loader2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';

export default function Loading() {
  const { theme } = useTheme();
  return (
    <div className="bg-background/80 fixed inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-md">
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex items-center justify-center">
          <div className="border-secondary/30 border-t-secondary absolute size-17.5 animate-spin rounded-full border-2" />
          <div className="bg-secondary rounded-full border-white p-4">
            <Image
              src="/logo.svg"
              alt="Loading Rentiful"
              width={28}
              height={28}
              className="size-7 animate-pulse"
            />
          </div>
        </div>
        <p className="text-secondary mt-3.5 animate-pulse text-base font-medium tracking-wider uppercase">
          Loading Rentiful...
        </p>
      </div>
    </div>
  );
}
