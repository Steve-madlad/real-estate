import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { NAVBAR_HEIGHT } from '@/lib/constants';
import DashboardGuard from './DashboardGuard';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardGuard>
      <SidebarProvider>
        <div className="bg-muted/20 text-foreground flex min-h-screen w-full flex-col transition-colors">
          <Navbar />
          <div style={{ paddingTop: `${NAVBAR_HEIGHT}px` }} className="flex w-full flex-1">
            <main className="flex w-full flex-1">
              <Sidebar />
              <div className="mx-auto w-full max-w-7xl flex-1 p-4 transition-all duration-300 sm:p-6 lg:p-8">
                {children}
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </DashboardGuard>
  );
}
