'use client';

import { motion } from 'framer-motion';
import {
  Building,
  CheckCircle2,
  Eye,
  FileCheck,
  Heart,
  Home,
  Key,
  MapPin,
  Search,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

const steps = [
  {
    step: '01',
    icon: Search,
    title: 'Browse & Discover',
    description:
      'Filter by neighborhood, price range, bedrooms, pet allowances, and luxury amenities to find your ideal match.',
    tag: 'Custom Filters',
  },
  {
    step: '02',
    icon: FileCheck,
    title: 'Instant Online Apply',
    description:
      'Submit your application with verified credentials directly to property managers in seconds.',
    tag: 'Digital Lease',
  },
  {
    step: '03',
    icon: Key,
    title: 'Get Keys & Move In',
    description:
      'Track real-time application status, sign agreements digitally, and step into your brand new home.',
    tag: 'Hassle-Free',
  },
];

const categories = [
  { label: 'Modern Apartments', count: '1,420+ listings', type: 'Apartment', icon: Building },
  { label: 'Luxury Villas', count: '380+ listings', type: 'Villa', icon: Home },
  { label: 'Spacious Townhouses', count: '640+ listings', type: 'Townhouse', icon: Building },
  { label: 'Cozy Cottages', count: '210+ listings', type: 'Cottage', icon: Home },
];

export default function DiscoverSection() {
  return (
    <section className="bg-muted/40 border-border/50 relative border-y py-24 transition-colors">
      <div className="mx-auto max-w-7xl space-y-20 px-4 sm:px-6 lg:px-8">
        {/* Step Flow Section */}
        <div>
          <div className="mx-auto mb-16 max-w-3xl space-y-3 text-center">
            <div className="bg-primary/5 text-foreground inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold tracking-wide uppercase">
              <Sparkles className="size-3.5 text-amber-500" /> Three Simple Steps
            </div>
            <h2 className="text-foreground text-3xl font-extrabold tracking-tight sm:text-4xl">
              How Rentiful Works
            </h2>
            <p className="text-muted-foreground text-base">
              Renting a new home has never been this streamlined and secure.
            </p>
          </div>

          <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="border-border bg-card relative flex flex-col rounded-3xl border p-8 shadow-xs"
              >
                <div className="mb-6 flex items-center justify-between">
                  <div className="bg-secondary/10 text-secondary flex size-12 items-center justify-center rounded-2xl font-bold">
                    <step.icon className="size-6" />
                  </div>
                  <span className="text-muted-foreground/30 text-3xl font-black">{step.step}</span>
                </div>

                <span className="text-secondary mb-1 text-xs font-bold tracking-wider uppercase">
                  {step.tag}
                </span>
                <h3 className="text-foreground mb-2 text-xl font-bold tracking-tight">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Curated Categories Bar */}
        <div>
          <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-foreground text-2xl font-bold tracking-tight">
                Browse by Property Type
              </h3>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Explore popular residential categories curated for every lifestyle.
              </p>
            </div>
            <Link
              href="/search"
              className="text-secondary inline-flex items-center gap-1 text-xs font-bold hover:underline"
            >
              <span>View all categories</span>
              <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {categories.map((cat, idx) => (
              <Link
                key={idx}
                href={`/search?propertyType=${cat.type}`}
                className="group border-border/80 bg-card hover:border-secondary/40 flex flex-col items-start rounded-2xl border p-5 transition-all duration-200 hover:shadow-md"
              >
                <div className="bg-primary/5 text-foreground group-hover:bg-secondary group-hover:text-secondary-foreground mb-3 flex size-10 items-center justify-center rounded-xl transition-colors">
                  <cat.icon className="size-5" />
                </div>
                <h4 className="text-foreground group-hover:text-secondary text-sm font-bold transition-colors">
                  {cat.label}
                </h4>
                <span className="text-muted-foreground mt-0.5 text-xs">{cat.count}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
