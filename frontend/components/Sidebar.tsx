'use client';

import { NAVBAR_HEIGHT } from '@/asset-download/asset-download/client/lib/constants';
import { cn } from '@/lib/utils';
import { Building, FileText, Home, Menu, Settings, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from './ui/sidebar';

const navLinks = (userType: string) =>
  userType === 'manager'
    ? [
        { icon: Building, label: 'Properties', href: '/managers/dashboard/properties' },
        { icon: FileText, label: 'Applications', href: '/managers/dashboard/applications' },
        { icon: Settings, label: 'settings', href: '/managers/dashboard/settings' },
      ]
    : [
        { icon: Building, label: 'Favorites', href: '/tenants/dashboard/favorites' },
        { icon: FileText, label: 'Applications', href: '/tenants/dashboard/applications' },
        { icon: Home, label: 'Residences', href: '/tenants/dashboard/residences' },
        { icon: Settings, label: 'settings', href: '/managers/dashboard/settings' },
      ];

export default function Sidebar() {
  const pathname = usePathname();
  const { toggleSidebar, open } = useSidebar();

  const userType = pathname.startsWith('/managers') ? 'manager' : 'tenant';

  return (
    <SidebarComponent
      collapsible="icon"
      className="fixed left-0 bg-white shadow-lg"
      style={{
        top: `${NAVBAR_HEIGHT}px`,
        height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
      }}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div
              className={cn('flex-center mb-3 min-h-14 w-full pt-3', {
                'justify-between! px-6': open,
              })}
            >
              {open ? (
                <>
                  <h1 className="text-xl font-bold text-gray-800">
                    {userType === 'manager' ? 'Manager View' : 'Renter View'}
                  </h1>
                  <button
                    onClick={() => toggleSidebar()}
                    className="rounded-md p-2 hover:bg-gray-100"
                  >
                    <X className="size-6 text-gray-600"></X>
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="rounded-md p-2 hover:bg-gray-100"
                    onClick={() => toggleSidebar()}
                  >
                    <Menu className="size-6 text-gray-600" />
                  </button>
                </>
              )}
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {navLinks(userType).map((link) => {
            const isActive = pathname === link.href;

            return (
              <SidebarMenuItem key={link.href}>
                <SidebarMenuButton
                  className={cn(
                    'align-center px-7 py-7',
                    isActive ? 'bg-gray-100' : 'text-gray-600 hover:bg-gray-100',
                    open ? 'text-blue-600' : 'ml-1.25',
                  )}
                >
                  <Link href={link.href} scroll={false} className="w-full">
                    <div className="align-center gap-3">
                      <link.icon
                        className={cn('size-5', isActive ? 'text-blue-600' : 'text-gray-600')}
                      ></link.icon>
                      <span
                        className={cn('font-medium', isActive ? 'text-blue-600' : 'text-gray-600')}
                      >
                        {link.label}
                      </span>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </SidebarComponent>
  );
}
