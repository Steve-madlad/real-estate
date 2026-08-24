import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { NAVBAR_HEIGHT } from '@/lib/constants';
import { ReactNode } from 'react';

export default function layout({ children }: { children: ReactNode }) {
  return (
    <div className="size-full">
      <Navbar />
      <main className={`col size-full pt-${NAVBAR_HEIGHT}px`}>{children}</main>
      <Footer />
    </div>
  );
}
