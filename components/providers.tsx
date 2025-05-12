'use client';

import * as React from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider } from 'connectkit';
import { config } from '@/lib/wagmi';
import { XAuthProvider } from '@/contexts/XAuthProvider';
import { LensProfileProvider } from '@/contexts/LensProfileProvider';

const queryClient = new QueryClient();

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>
          <XAuthProvider>
            <LensProfileProvider>{children}</LensProfileProvider>
          </XAuthProvider>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
