'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Building, Plus, Search, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CallToActionSection() {
  return (
    <section className="relative overflow-hidden py-20">
      {/* Background with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/landing-call-to-action.jpg"
          alt="Rentiful CTA Background"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/95 via-zinc-950/85 to-zinc-950/90" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          {/* Renter Action Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6 rounded-3xl border border-white/15 bg-white/10 p-8 text-white shadow-2xl backdrop-blur-xl sm:p-10"
          >
            <div className="bg-secondary/20 text-secondary inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-bold backdrop-blur-md">
              <Search className="size-3.5" /> For Renters
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                Ready to Find Your Next Sanctuary?
              </h3>
              <p className="text-sm leading-relaxed text-zinc-300 sm:text-base">
                Browse through hundreds of verified apartments and homes with zero broker
                commissions and direct landlord communication.
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 pt-2 sm:flex-row">
              <Link
                href="/search"
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold shadow-lg transition-transform active:scale-95 sm:w-auto"
              >
                <Search className="size-4" /> Start Searching Now
              </Link>
              <Link
                href="/signup"
                className="inline-flex w-full items-center justify-center rounded-2xl border border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/15 sm:w-auto"
              >
                Create Tenant Profile
              </Link>
            </div>
          </motion.div>

          {/* Manager Action Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="space-y-6 rounded-3xl border border-white/15 bg-white/5 p-8 text-white shadow-2xl backdrop-blur-xl sm:p-10"
          >
            <div className="bg-primary/30 inline-flex items-center gap-2 rounded-full border border-white/20 px-3.5 py-1 text-xs font-bold text-white backdrop-blur-md">
              <Building className="size-3.5" /> For Property Managers
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                Fill Vacancies Fast with Qualified Tenants
              </h3>
              <p className="text-sm leading-relaxed text-zinc-300 sm:text-base">
                List your residential properties, manage tenant applications, review credit
                credentials, and sign leases seamlessly online.
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 pt-2 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-bold text-zinc-950 shadow-lg transition-transform hover:bg-zinc-200 active:scale-95 sm:w-auto"
              >
                <Plus className="size-4" /> List Your Property
              </Link>
              <Link
                href="/signin"
                className="inline-flex w-full items-center justify-center rounded-2xl border border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/15 sm:w-auto"
              >
                Manager Login
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
