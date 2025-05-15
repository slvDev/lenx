'use client';

import { createContext, useContext } from 'react';
import type {
  // CreateAccountWithUsernameResult, // Not used for now
  // EvmAddress, // Not used for now
  SessionClient as LensSessionClientType, // Might be needed by consumers later
  // URI, // Not used for now
} from '@lens-protocol/client';

// Minimal context type for now
interface LensProfileContextType {
  // Placeholder for future properties
  // profile: null; // Example
  // isLoadingProfile: boolean;
  // clearProfileError: () => void;
  // prepareCreateProfile: (sessionClient: LensSessionClientType, handle: string, metadataUri: URI) => Promise<any>;
}

const LensProfileContext = createContext<LensProfileContextType | undefined>(undefined);

export function LensProfileProvider({ children }: { children: React.ReactNode }) {
  // No state or effects for now

  // Minimal context value
  const value: LensProfileContextType = {
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
