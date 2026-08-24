import Navbar from '@/components/Navbar';
import Siderbar from '@/components/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { NAVBAR_HEIGHT } from '@/lib/constants';
import DashboardGuard from './DashboardGuard';

export default async function layout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardGuard>
      <SidebarProvider>
        <div className="bg-primary-100 min-h-screen w-full">
          <Navbar />
          <div style={{ paddingTop: `${NAVBAR_HEIGHT}px` }}>
            <main className="flex">
              <Siderbar />
              <div className="duriation-300 grow transition-all">{children}</div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </DashboardGuard>
  );
}
