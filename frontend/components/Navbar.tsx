'use client';

import { useGetAuthUser } from '@/api/auth';
import { NAVBAR_HEIGHT } from '@/lib/constants';
import { signOut } from 'aws-amplify/auth';
import {
  Bell,
  Building,
  Heart,
  Home,
  LogOut,
  Menu,
  MessageCircle,
  Plus,
  Search,
  Settings,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { SidebarTrigger } from './ui/sidebar';
import { ThemeToggle } from './ThemeToggle';
import { Badge } from './ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';

export default function Navbar() {
  const { data: user } = useGetAuthUser();
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isUserManager = user?.userRole === 'manager';
  const isDashboardRoute = pathname.startsWith('/managers') || pathname.startsWith('/tenants');
  const isHomePage = pathname === '/';

  const handleSignout = async () => {
    await signOut();
    queryClient.clear();
    window.location.href = '/';
  };

  return (
    <header
      className="border-border/70 bg-background/80 fixed top-0 left-0 z-50 w-full border-b backdrop-blur-md transition-colors"
      style={{ height: `${NAVBAR_HEIGHT}px` }}
    >
      <div className="mx-auto flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand & Dashboard Trigger */}
        <div className="flex items-center gap-3 md:gap-5">
          {isDashboardRoute && (
            <div className="flex items-center md:hidden">
              <SidebarTrigger iconClassname="size-5 text-foreground" />
            </div>
          )}

          <Link
            href="/"
            className="group flex items-center gap-2.5 transition-transform hover:scale-[1.02] active:scale-[0.98]"
            scroll={false}
          >
            <div className="bg-secondary group-hover:bg-primary/10 relative flex size-9 items-center justify-center rounded-xl p-1.5 transition-colors">
              <Image
                src="/logo.svg"
                alt="Rentiful Logo"
                width={26}
                height={26}
                className="size-6 transition-transform group-hover:rotate-6"
              />
            </div>
            <div className="text-foreground text-xl font-extrabold tracking-tight">
              RENT<span className="text-secondary font-light">IFUL</span>
            </div>
          </Link>

          {/* Quick Context Action for Logged in Users */}
          {user && (
            <div className="ml-2 hidden lg:block">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(isUserManager ? '/managers/create-property' : '/search')}
                className="border-border/80 bg-background/50 hover:bg-accent h-9 cursor-pointer gap-2 rounded-full text-xs font-semibold shadow-xs"
              >
                {isUserManager ? (
                  <>
                    <Plus className="text-secondary size-3.5" />
                    <span>List a Property</span>
                  </>
                ) : (
                  <>
                    <Search className="text-secondary size-3.5" />
                    <span>Find Rentals</span>
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Center: Search pill for public routes */}
        {!isDashboardRoute && !isHomePage && (
          <div className="hidden items-center md:flex">
            <button
              onClick={() => router.push('/search')}
              className="border-border/80 bg-background/60 hover:border-secondary/50 flex cursor-pointer items-center gap-3 rounded-full border py-1.5 pr-2 pl-4 text-xs shadow-xs transition-all hover:shadow-md"
            >
              <span className="text-foreground font-semibold">Anywhere</span>
              <span className="bg-border h-4 w-[1px]" />
              <span className="text-muted-foreground font-medium">Any Type</span>
              <span className="bg-border h-4 w-[1px]" />
              <span className="text-muted-foreground font-medium">Any Price</span>
              <div className="bg-secondary text-secondary-foreground flex size-7 items-center justify-center rounded-full">
                <Search className="size-3.5" />
              </div>
            </button>
          </div>
        )}

        {isHomePage && (
          <nav className="text-muted-foreground hidden items-center gap-6 text-sm font-medium md:flex">
            <Link href="/search" className="hover:text-foreground transition-colors">
              Explore Homes
            </Link>
            <Link
              href="/search?propertyType=Apartment"
              className="hover:text-foreground transition-colors"
            >
              Apartments
            </Link>
            <Link
              href="/search?propertyType=Villa"
              className="hover:text-foreground transition-colors"
            >
              Villas & Houses
            </Link>
          </nav>
        )}

        {/* Right Section: Themes & User Account */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme switcher */}
          <ThemeToggle />

          {user ? (
            <>
              {/* Notifications */}
              <div className="hidden items-center gap-1 sm:flex">
                <button
                  type="button"
                  aria-label="Messages"
                  className="text-muted-foreground hover:bg-muted hover:text-foreground relative flex size-9 cursor-pointer items-center justify-center rounded-full transition-colors"
                >
                  <MessageCircle className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label="Notifications"
                  className="text-muted-foreground hover:bg-muted hover:text-foreground relative flex size-9 cursor-pointer items-center justify-center rounded-full transition-colors"
                >
                  <Bell className="size-4" />
                  <span className="bg-secondary ring-background absolute top-2 right-2 size-2 rounded-full ring-2" />
                </button>
              </div>

              {/* User Avatar & Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="border-border/80 bg-background/50 hover:border-secondary/40 flex cursor-pointer items-center gap-2 rounded-full border p-1 pr-3 shadow-xs transition-all hover:shadow-md">
                  <Avatar className="size-7">
                    <AvatarFallback className="bg-primary text-primary-foreground text-[11px] font-bold">
                      {user.userInfo.name
                        ? user.userInfo.name[0].toUpperCase()
                        : user.userRole[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-left">
                    <span className="text-foreground hidden max-w-[100px] truncate text-xs font-semibold sm:inline-block">
                      {user.userInfo.name || 'Account'}
                    </span>
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56 rounded-2xl p-1.5 shadow-xl">
                  <DropdownMenuLabel className="px-3 py-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-foreground text-sm leading-none font-semibold">
                        {user.userInfo.name}
                      </p>
                      <p className="text-muted-foreground text-xs leading-none">
                        {user.userInfo.email}
                      </p>
                      <Badge
                        variant="secondary"
                        className="mt-1.5 w-fit text-[10px] font-bold tracking-wider uppercase"
                      >
                        {user.userRole}
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => {
                        router.push(
                          `/${user.userRole}s/dashboard/${user.userRole === 'manager' ? 'properties' : 'favorites'}`,
                          { scroll: false },
                        );
                      }}
                      className="cursor-pointer gap-2.5 rounded-lg px-3 py-2 text-xs font-medium"
                    >
                      <Building className="text-muted-foreground size-4" />
                      <span>{isUserManager ? 'Manage Properties' : 'Saved Favorites'}</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => {
                        router.push(`/${user.userRole}s/dashboard/applications`, { scroll: false });
                      }}
                      className="cursor-pointer gap-2.5 rounded-lg px-3 py-2 text-xs font-medium"
                    >
                      <Home className="text-muted-foreground size-4" />
                      <span>Applications</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => {
                        router.push(`/${user.userRole}s/dashboard/settings`, { scroll: false });
                      }}
                      className="cursor-pointer gap-2.5 rounded-lg px-3 py-2 text-xs font-medium"
                    >
                      <Settings className="text-muted-foreground size-4" />
                      <span>Settings & Profile</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignout}
                    className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer gap-2.5 rounded-lg px-3 py-2 text-xs font-medium"
                  >
                    <LogOut className="size-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            /* Unauthenticated guest controls */
            <div className="flex items-center gap-2">
              <Link
                href="/signin"
                className="hover:bg-muted text-foreground inline-flex h-9 items-center justify-center rounded-full px-4 text-xs font-semibold transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground inline-flex h-9 items-center justify-center rounded-full px-4 text-xs font-semibold shadow-sm transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Navigation Sheet Trigger */}
          <div className="flex md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger className="text-foreground hover:bg-muted flex size-9 cursor-pointer items-center justify-center rounded-full">
                <Menu className="size-5" />
                <span className="sr-only">Open menu</span>
              </SheetTrigger>
              <SheetContent side="right" className="flex w-[300px] flex-col justify-between p-6">
                <div className="space-y-6">
                  <SheetHeader className="text-left">
                    <SheetTitle className="flex items-center gap-2">
                      <Image
                        src="/logo.svg"
                        alt="Rentiful"
                        width={22}
                        height={22}
                        className="size-5"
                      />
                      <span className="font-bold tracking-tight">RENTIFUL</span>
                    </SheetTitle>
                  </SheetHeader>

                  <div className="flex flex-col gap-2">
                    <Link
                      href="/"
                      onClick={() => setMobileMenuOpen(false)}
                      className="hover:bg-muted text-foreground flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium"
                    >
                      <Home className="text-muted-foreground size-4" />
                      Home
                    </Link>
                    <Link
                      href="/search"
                      onClick={() => setMobileMenuOpen(false)}
                      className="hover:bg-muted text-foreground flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium"
                    >
                      <Search className="text-muted-foreground size-4" />
                      Explore Listings
                    </Link>
                    {user && (
                      <>
                        <Link
                          href={`/${user.userRole}s/dashboard/${isUserManager ? 'properties' : 'favorites'}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="hover:bg-muted text-foreground flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium"
                        >
                          <Building className="text-muted-foreground size-4" />
                          Dashboard
                        </Link>
                        <Link
                          href={`/${user.userRole}s/dashboard/applications`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="hover:bg-muted text-foreground flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium"
                        >
                          <Sparkles className="text-muted-foreground size-4" />
                          Applications
                        </Link>
                      </>
                    )}
                  </div>
                </div>

                <div className="border-border space-y-3 border-t pt-6">
                  {user ? (
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleSignout();
                      }}
                      className="w-full gap-2 rounded-full text-xs"
                    >
                      <LogOut className="size-4" /> Sign out
                    </Button>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Link
                        href="/signin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="border-border/80 text-foreground hover:bg-muted inline-flex h-9 items-center justify-center rounded-full border text-xs font-semibold"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/signup"
                        onClick={() => setMobileMenuOpen(false)}
                        className="bg-secondary text-secondary-foreground hover:bg-secondary/90 inline-flex h-9 items-center justify-center rounded-full text-xs font-semibold"
                      >
                        Create Account
                      </Link>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
