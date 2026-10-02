'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Check, Moon, Sun, Sparkles } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

function subscribeToNothing() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const mounted = React.useSyncExternalStore(
    subscribeToNothing,
    getClientSnapshot,
    getServerSnapshot,
  );

  if (!mounted) {
    return (
      <div
        className={`text-muted-foreground flex size-9 items-center justify-center rounded-full ${className || ''}`}
      >
        <Sun className="size-4 opacity-50" />
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Select theme"
        className={`border-border/80 bg-background/50 hover:bg-muted text-foreground relative flex size-9 cursor-pointer items-center justify-center rounded-full border transition-colors ${className || ''}`}
      >
        {theme === 'dark' ? (
          <Moon className="size-4 text-slate-200 transition-transform" />
        ) : theme === 'theme-warm' ? (
          <Sparkles className="size-4 text-amber-600 transition-transform dark:text-amber-400" />
        ) : (
          <Sun className="size-4 text-amber-500 transition-transform" />
        )}
        <span className="sr-only">Toggle theme</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 rounded-xl p-1.5 shadow-xl">
        <DropdownMenuItem
          onClick={() => setTheme('light')}
          className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-xs font-medium"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex size-4 items-center justify-center rounded-full border border-slate-300 bg-slate-100">
              <Sun className="size-2.5 text-slate-700" />
            </div>
            <span>Minimalist Slate</span>
          </div>
          {theme === 'light' && <Check className="text-primary size-3.5" />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme('theme-warm')}
          className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-xs font-medium"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex size-4 items-center justify-center rounded-full border border-amber-300 bg-[#faf7f2]">
              <Sparkles className="size-2.5 text-amber-700" />
            </div>
            <span>Warm Sandstone</span>
          </div>
          {theme === 'theme-warm' && <Check className="size-3.5 text-amber-600" />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme('dark')}
          className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-xs font-medium"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex size-4 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900">
              <Moon className="size-2.5 text-zinc-300" />
            </div>
            <span>Obsidian Luxe (Dark)</span>
          </div>
          {theme === 'dark' && <Check className="text-primary size-3.5" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
