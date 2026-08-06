'use client';

import { useGetAuthUser } from '@/api/auth';
import { Loader } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: userData, isLoading } = useGetAuthUser();

  useEffect(() => {
    if (userData) {
      if (userData.userRole === 'manager' && pathname.startsWith('/tenants'))
        router.replace('/managers/dashboard/properties');
      else if (userData.userRole === 'tenant' && pathname.startsWith('/managers'))
        router.replace('/tenants/dashboard/favorites');
    }
  }, [userData, pathname, router]);

  if (isLoading) {
    return (
      <div className="flex-center h-screen gap-4">
        Loading <Loader className="animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
