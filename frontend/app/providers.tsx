'use client';

import { TooltipProvider } from '@/components/ui/tooltip';
import { Authenticator } from '@aws-amplify/ui-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import Auth from './(auth)/authProvider';

const queryClient = new QueryClient();
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Authenticator.Provider>
          <Auth>{children}</Auth>
        </Authenticator.Provider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
