'use client';

import { motion } from 'framer-motion';
import {
  BadgeCheck,
  CheckCircle2,
  Compass,
  FileText,
  Key,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

export default function FeaturesSection() {
  const features = [
    {
      icon: ShieldCheck,
      badge: 'Verified Landlords',
      title: '100% Verified Listings',
      description:
        'Every home is authenticated by our team. Enjoy scam-free rentals with accurate photos and up-to-date availability.',
      cta: 'Explore Verified',
      href: '/search',
      color: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
    },
    {
      icon: Zap,
      badge: 'Fast & Seamless',
      title: 'Instant Online Applications',
      description:
        'Apply to multiple properties with a single digital profile. Receive fast approvals from property managers in real time.',
      cta: 'How It Works',
      href: '/search',
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    },
    {
      icon: Compass,
      badge: 'Smart Discovery',
      title: 'Interactive Map & Filters',
      description:
        'Pinpoint neighborhoods, transit proximity, pet policies, and price ranges with precision using our advanced map search.',
      cta: 'Open Map Search',
      href: '/search',
      color: 'text-sky-500 bg-sky-500/10 border-sky-500/20',
    },
  ];

  return (
    <section className="bg-background relative py-24 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-3xl space-y-3 text-center">
          <div className="bg-secondary/10 text-secondary inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold tracking-wide uppercase">
            <Sparkles className="size-3.5" /> Built for modern renters
          </div>
          <h2 className="text-foreground text-3xl font-extrabold tracking-tight sm:text-4xl">
            A Better Way to Find & Rent Your Home
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            Say goodbye to paper leases, hidden fees, and sketchy listings. Rentiful makes renting
            transparent and simple.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              whileHover={{ y: -6 }}
              className="group border-border/70 bg-card hover:border-secondary/40 relative flex flex-col justify-between rounded-3xl border p-8 shadow-xs transition-all duration-300 hover:shadow-xl"
            >
              <div className="space-y-4">
                <div
                  className={`flex size-14 items-center justify-center rounded-2xl border ${feature.color} transition-transform duration-300 group-hover:scale-110`}
                >
                  <feature.icon className="size-7" />
                </div>

                <div className="space-y-2">
                  <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                    {feature.badge}
                  </span>
                  <h3 className="text-foreground text-xl font-bold tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>

              <div className="border-border/50 mt-6 border-t pt-6">
                <Link
                  href={feature.href}
                  className="text-secondary hover:text-secondary/80 inline-flex items-center gap-1.5 text-xs font-bold transition-colors"
                >
                  <span>{feature.cta}</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
