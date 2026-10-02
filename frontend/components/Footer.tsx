'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AiFillInstagram, AiFillLinkedin, AiFillYoutube } from 'react-icons/ai';
import { FaFacebook } from 'react-icons/fa6';
import { GrTwitter } from 'react-icons/gr';
import { ArrowRight, Globe, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

export default function Footer() {
  return (
    <footer className="border-border/80 bg-background text-foreground border-t pt-16 pb-12 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border-border/60 grid grid-cols-1 gap-10 border-b pb-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand & Mission */}
          <div className="space-y-4 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5" scroll={false}>
              <div className="bg-secondary flex size-8 items-center justify-center rounded-xl p-1.5">
                <Image src="/logo.svg" alt="Rentiful" width={22} height={22} className="size-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight">
                RENT<span className="text-secondary font-light">IFUL</span>
              </span>
            </Link>
            <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
              Discover verified rental properties, stylish apartments, and premium homes with
              flexible terms and transparent applications.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="bg-secondary/10 text-secondary inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold">
                <ShieldCheck className="size-3.5" /> 100% Verified Listings
              </span>
              <span className="bg-primary/5 text-muted-foreground inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold">
                <Sparkles className="size-3.5 text-amber-500" /> Instant Apply
              </span>
            </div>
          </div>

          {/* Quick Discover Links */}
          <div className="space-y-3">
            <h4 className="text-foreground text-xs font-bold tracking-wider uppercase">Explore</h4>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>
                <Link
                  href="/search?propertyType=Apartment"
                  className="hover:text-foreground transition-colors"
                >
                  Apartments for Rent
                </Link>
              </li>
              <li>
                <Link
                  href="/search?propertyType=Villa"
                  className="hover:text-foreground transition-colors"
                >
                  Luxury Villas & Houses
                </Link>
              </li>
              <li>
                <Link
                  href="/search?propertyType=Townhouse"
                  className="hover:text-foreground transition-colors"
                >
                  Townhouses
                </Link>
              </li>
              <li>
                <Link
                  href="/search?isPetsAllowed=true"
                  className="hover:text-foreground transition-colors"
                >
                  Pet-Friendly Homes
                </Link>
              </li>
            </ul>
          </div>

          {/* Company / Portal Links */}
          <div className="space-y-3">
            <h4 className="text-foreground text-xs font-bold tracking-wider uppercase">Portals</h4>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>
                <Link href="/signin" className="hover:text-foreground transition-colors">
                  Tenant Portal
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-foreground transition-colors">
                  Property Manager Sign Up
                </Link>
              </li>
              <li>
                <Link
                  href="/managers/create-property"
                  className="hover:text-foreground transition-colors"
                >
                  Post a Property
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  Rental Agreement Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="space-y-3">
            <h4 className="text-foreground text-xs font-bold tracking-wider uppercase">
              Stay Updated
            </h4>
            <p className="text-muted-foreground text-xs">
              Get notified when new listings and price drops occur in your favorite areas.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <div className="relative">
                <Input
                  placeholder="Enter your email"
                  type="email"
                  className="bg-background border-border/80 h-10 rounded-xl pr-10 text-xs"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90 absolute top-1 right-1 size-8 rounded-lg"
                >
                  <ArrowRight className="size-3.5" />
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Socials & Copyright */}
        <div className="text-muted-foreground flex flex-col items-center justify-between gap-4 pt-8 text-xs sm:flex-row">
          <div className="flex items-center gap-4">
            <span>© {new Date().getFullYear()} Rentiful Inc. All rights reserved.</span>
            <span>•</span>
            <Link href="/privacy" className="hover:underline">
              Privacy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:underline">
              Terms
            </Link>
            <span>•</span>
            <Link href="/sitemap.xml" className="hover:underline">
              Sitemap
            </Link>
          </div>

          <div className="text-muted-foreground flex items-center space-x-3">
            <a
              href="#"
              className="hover:bg-muted hover:text-foreground rounded-full p-2 transition-colors"
              aria-label="Facebook"
            >
              <FaFacebook size={18} />
            </a>
            <a
              href="#"
              className="hover:bg-muted hover:text-foreground rounded-full p-2 transition-colors"
              aria-label="Twitter"
            >
              <GrTwitter size={18} />
            </a>
            <a
              href="#"
              className="hover:bg-muted hover:text-foreground rounded-full p-2 transition-colors"
              aria-label="YouTube"
            >
              <AiFillYoutube size={20} />
            </a>
            <a
              href="#"
              className="hover:bg-muted hover:text-foreground rounded-full p-2 transition-colors"
              aria-label="Instagram"
            >
              <AiFillInstagram size={20} />
            </a>
            <a
              href="#"
              className="hover:bg-muted hover:text-foreground rounded-full p-2 transition-colors"
              aria-label="LinkedIn"
            >
              <AiFillLinkedin size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
