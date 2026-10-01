'use client';

import { TooltipProvider } from '@/components/ui/tooltip';
import { Authenticator } from '@aws-amplify/ui-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';
import Auth from './(auth)/authProvider';

const queryClient = new QueryClient();

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        themes={['light', 'theme-warm', 'dark']}
        enableSystem={false}
      >
        <TooltipProvider>
          <Authenticator.Provider>
            <Auth>{children}</Auth>
          </Authenticator.Provider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
