'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled app error:', error);
  }, [error]);

  return (
    <div className="bg-background text-foreground flex min-h-screen items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border-border w-full max-w-md space-y-6 rounded-3xl border p-8 text-center shadow-xl"
      >
        <div className="bg-destructive/10 text-destructive mx-auto flex size-16 items-center justify-center rounded-2xl">
          <AlertTriangle className="size-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Something went wrong</h2>
          <p className="text-muted-foreground text-sm">
            {error?.message ||
              'An unexpected error occurred while loading this page. Please try again.'}
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
          <Button
            onClick={() => reset()}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 w-full gap-2 rounded-full font-bold shadow-md sm:w-auto"
          >
            <RefreshCw className="size-4" /> Try Again
          </Button>
          <button
            type="button"
            onClick={() => {
              window.location.href = '/';
            }}
            className="border-border hover:bg-muted text-foreground inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-xs font-semibold transition-colors sm:w-auto"
          >
            <Home className="size-4" /> Go to Homepage
          </button>
        </div>
      </motion.div>
    </div>
  );
}
