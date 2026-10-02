'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Search, Compass, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="bg-background text-foreground flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-8 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="bg-secondary/10 border-secondary/20 relative mx-auto flex h-36 w-36 items-center justify-center rounded-3xl border shadow-2xl"
        >
          <Compass className="text-secondary size-18 animate-pulse" />
          <div className="bg-primary text-primary-foreground absolute -right-2 -bottom-2 rounded-full px-2.5 py-1 text-xs font-bold shadow-md">
            404
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-3"
        >
          <h1 className="text-4xl font-black tracking-tight md:text-5xl">
            Lost in the Neighborhood?
          </h1>
          <p className="text-muted-foreground mx-auto max-w-md text-base md:text-lg">
            We couldn&apos;t find the page or property you are looking for. It might have been
            leased or moved.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row"
        >
          <Link
            href="/"
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold shadow-lg transition-transform active:scale-95 sm:w-auto"
          >
            <Home className="size-4" /> Return to Home
          </Link>
          <Link
            href="/search"
            className="border-border bg-background hover:bg-muted text-foreground inline-flex w-full items-center justify-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition-colors sm:w-auto"
          >
            <Search className="size-4" /> Explore Properties <ArrowRight className="ml-1 size-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
