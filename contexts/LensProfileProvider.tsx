'use client';

import { createContext, useContext } from 'react';
import { mainnet, PublicClient } from '@lens-protocol/client';

interface LensProfileContextType {
  publicClient: PublicClient;
  // profile: null; // Example
  // isLoadingProfile: boolean;
  // clearProfileError: () => void;
  // prepareCreateProfile: (sessionClient: LensSessionClientType, handle: string, metadataUri: URI) => Promise<any>;
}

const LensProfileContext = createContext<LensProfileContextType | undefined>(undefined);

export function LensProfileProvider({ children }: { children: React.ReactNode }) {
  const publicClient = PublicClient.create({
    environment: mainnet,
    // storage: window.localStorage,
  });

  const value: LensProfileContextType = {
    publicClient,
    // Initialize with placeholder values or functions if needed
    // profile: null,
    // isLoadingProfile: false,
    // clearProfileError: () => {},
    // prepareCreateProfile: async () => { throw new Error('Not implemented'); },
  };

  return <LensProfileContext.Provider value={value}>{children}</LensProfileContext.Provider>;
}

export function useLensProfile(): LensProfileContextType {
  const context = useContext(LensProfileContext);
  if (context === undefined) {
    throw new Error('useLensProfile must be used within a LensProfileProvider');
  }
  return context;
}
