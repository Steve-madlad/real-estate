'use client';

import { useGetAuthUser } from '@/api/auth';
import { NAVBAR_HEIGHT } from '@/asset-download/asset-download/client/lib/constants';
import { signOut } from 'aws-amplify/auth';
import { Bell, MessageCircle, Plus, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { SidebarTrigger } from './ui/sidebar';

export default function Navbar() {
  const { data: user } = useGetAuthUser();
  const router = useRouter();
  const pathname = usePathname();

  console.log({ user });

  const isUserManager = user?.userRole === 'manager';
  const isDashboardRoute = pathname.startsWith('/managers') || pathname.startsWith('/tenants');

  const handlSignout = async () => {
    await signOut();
    window.location.href = '/';
  };

  return (
    <div className={`fixed top-0 left-0 z-50 w-full shadow-xl h-${NAVBAR_HEIGHT}`}>
      <div className="flex-between bg-primary-700 w-full px-4 md:px-8 py-3 text-white">
        <div className="align-center gap-4 md:gap-6">
          {isDashboardRoute && (
            <div className="md:hidden! flex-center mr-5">
              <SidebarTrigger iconClassname="size-6"/>
            </div>
          )}
          <Link href="/" className="hover:text-primary-300! cursor-pointer" scroll={false}>
            <div className="align-center gap-3">
              <Image
                src="/logo.svg"
                alt="Rentiful Logo"
                width={24}
                height={24}
                className="size-6"
              />
              <div className="text-xl font-bold">
                RENT
                <span className="text-secondary-500 hover:text-primary-300! font-light">IFUL</span>
              </div>
            </div>
          </Link>

          {isDashboardRoute && user && (
            <Button
              variant="secondary"
              onClick={() => router.push(isUserManager ? '/managers/newproperty' : '/search')}
              className="bg-primary-50 text-primary-700 hover:bg-secondary-500 hover:text-primary-50 md:ml-4"
            >
              {isUserManager ? (
                <>
                  <Plus className="size-4"></Plus>
                  <span className="ml-2 hidden md:block">Add New Property</span>
                </>
              ) : (
                <>
                  <Search className="size-4"></Search>
                  <span className="ml-2 hidden md:block">Search Properties</span>
                </>
              )}
            </Button>
          )}
        </div>

        {!isDashboardRoute && (
          <p className="text-primary-200 hidden md:block">
            Discover your perfect rental parartment with our advanced search
          </p>
        )}

        <div className="align-center gap-5">
          {user ? (
            <>
              <div className="relative hidden md:block">
                <MessageCircle className="text-primary-200 hover-text-primary-400 size-6 cursor-pointer" />
                <span className="bg-secondary-700 absolute top-0 right-0 size-2 rounded-full"></span>
              </div>
              <div className="relative hidden md:block">
                <Bell className="text-primary-200 hover-text-primary-400 size-6 cursor-pointer" />
                <span className="bg-secondary-700 absolute top-0 right-0 size-2 rounded-full"></span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger className="flex-center gap-2">
                  <Avatar>
                    <AvatarFallback className="bg-primary-600 text-white">
                      {user.userRole[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-primary-200 hidden md:block">{user.userInfo.name}</p>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      className="hover:bg-primary-700! font-semibold hover:text-white!"
                      onClick={() => {
                        router.push(`/${user.userRole}s/dashboard`, { scroll: false });
                      }}
                    >
                      Go To Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="hover:bg-primary-700! hover:text-white!"
                      onClick={() => {
                        router.push(`/${user.userRole}s/settings`, { scroll: false });
                      }}
                    >
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="hover:bg-primary-700! hover:text-white!"
                      onClick={handlSignout}
                    >
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/signin">
                <Button
                  variant="outline"
                  className="hover:text-primary-700 rounded-lg border-white bg-transparent text-white hover:bg-white"
                >
                  Sign In
                </Button>
              </Link>

              <Link href="/signup">
                <Button
                  variant="outline"
                  className="bg-secondary-600 hover:text-primary-700 rounded-lg text-white hover:bg-white"
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
