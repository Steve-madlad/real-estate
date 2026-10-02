'use client';

import { NAVBAR_HEIGHT } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Building, ChevronLeft, FileText, Heart, Home, Menu, Plus, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from './ui/sidebar';
import { Button } from './ui/button';

const navLinks = (userType: string) =>
  userType === 'manager'
    ? [
        { icon: Building, label: 'Properties', href: '/managers/dashboard/properties' },
        { icon: FileText, label: 'Applications', href: '/managers/dashboard/applications' },
        { icon: Settings, label: 'Settings', href: '/managers/dashboard/settings' },
      ]
    : [
        { icon: Heart, label: 'Saved Favorites', href: '/tenants/dashboard/favorites' },
        { icon: FileText, label: 'Applications', href: '/tenants/dashboard/applications' },
        { icon: Home, label: 'My Residences', href: '/tenants/dashboard/residences' },
        { icon: Settings, label: 'Settings', href: '/tenants/dashboard/settings' },
      ];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { toggleSidebar, open } = useSidebar();

  const userType = pathname.startsWith('/managers') ? 'manager' : 'tenant';

  return (
    <SidebarComponent
      collapsible="icon"
      className="border-border/80 bg-card text-card-foreground fixed left-0 border-r shadow-xs transition-colors"
      style={{
        top: `${NAVBAR_HEIGHT}px`,
        height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
      }}
    >
      <SidebarHeader className="border-border/60 border-b p-3">
        <div
          className={cn('flex w-full items-center', {
            'justify-between px-2': open,
            'justify-center': !open,
          })}
        >
          {open ? (
            <>
              <div className="flex items-center gap-2">
                <span className="bg-secondary size-2 rounded-full" />
                <h2 className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                  {userType === 'manager' ? 'Manager Portal' : 'Tenant Portal'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => toggleSidebar()}
                className="text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer rounded-lg p-1.5 transition-colors"
              >
                <ChevronLeft className="size-4" />
              </button>
            </>
          ) : (
            <button
              type="button"
              className="text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer rounded-lg p-1.5 transition-colors"
              onClick={() => toggleSidebar()}
            >
              <Menu className="size-5" />
            </button>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="space-y-1 p-2">
        {open && userType === 'manager' && (
          <div className="mb-2 p-2">
            <Button
              onClick={() => router.push('/managers/create-property')}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground w-full cursor-pointer gap-2 rounded-xl text-xs font-bold shadow-xs"
            >
              <Plus className="size-4" />
              <span>Add Property</span>
            </Button>
          </div>
        )}

        <SidebarMenu className="space-y-1">
          {navLinks(userType).map((link) => {
            const isActive = pathname.startsWith(link.href);

            return (
              <SidebarMenuItem key={link.href}>
                <Link
                  href={link.href}
                  scroll={false}
                  className={cn(
                    'flex h-11 cursor-pointer items-center gap-3 rounded-xl px-3 transition-all duration-200',
                    isActive
                      ? 'bg-secondary/10 text-secondary font-bold shadow-xs'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground font-medium',
                    !open && 'justify-center px-0',
                  )}
                >
                  <link.icon
                    className={cn(
                      'size-4.5 shrink-0 transition-colors',
                      isActive ? 'text-secondary' : 'text-muted-foreground',
                    )}
                  />
                  {open && <span className="text-xs tracking-tight">{link.label}</span>}
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </SidebarComponent>
  );
}
