import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { NAVBAR_HEIGHT } from '@/lib/constants';
import { ReactNode } from 'react';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col transition-colors">
      <Navbar />
      <main className="w-full flex-1" style={{ paddingTop: `${NAVBAR_HEIGHT}px` }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
