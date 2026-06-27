import { NAVBAR_HEIGHT } from '@/asset-download/asset-download/client/lib/constants';
import Navbar from '@/components/Navbar';
import { ReactNode } from 'react';

export default function layout({ children }: { children: ReactNode }) {
  return (
    <div className="size-full">
      <Navbar />
      <main className={`col size-full pt-${NAVBAR_HEIGHT}px`}>{children}</main>
    </div>
  );
}
