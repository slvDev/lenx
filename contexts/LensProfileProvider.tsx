'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { mainnet, PublicClient, SessionClient } from '@lens-protocol/client';
import { useAccount, useWalletClient } from 'wagmi';
import { signMessageWith } from '@lens-protocol/client/viem';
import { LENX_APP_ADDRESS } from '@/lib/constants';

interface LensProfileContextType {
  publicClient: PublicClient;
  sessionClient: SessionClient | null;
  isLensAuthenticated: boolean;
  isLoadingLensAuth: boolean;
  loginWithLens: (lensAccount: string) => Promise<void>;
  logoutLens: () => void;
}

const LensProfileContext = createContext<LensProfileContextType | undefined>(undefined);

export function LensProfileProvider({ children }: { children: React.ReactNode }) {
  const publicClient = PublicClient.create({
    environment: mainnet,
    // storage: typeof window !== 'undefined' ? window.localStorage : undefined, // Conditional storage
  });

  const [sessionClient, setSessionClient] = useState<SessionClient | null>(null);
  const [isLensAuthenticated, setIsLensAuthenticated] = useState(false);
  const [isLoadingLensAuth, setIsLoadingLensAuth] = useState(false);
  const { address: walletAddress, isConnected: isWalletConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  const loginWithLens = useCallback(
    async (lensAccount: string) => {
      if (!isWalletConnected || !walletAddress || !walletClient) {
        console.error('Wallet not connected');
        return;
      }

      setIsLoadingLensAuth(true);
      try {
        const authenticated = await publicClient.login({
          accountOwner: {
            account: lensAccount,
            app: LENX_APP_ADDRESS,
            owner: walletAddress,
          },
          signMessage: signMessageWith(walletClient),
        });

        if (authenticated.isErr()) {
          setIsLensAuthenticated(false);
          setSessionClient(null);
          alert(`Lens Login Failed: ${authenticated.error.message}`);
          return;
        }

        const newSessionClient = authenticated.value;
        setSessionClient(newSessionClient);
        setIsLensAuthenticated(true);
      } catch (error: any) {
        setIsLensAuthenticated(false);
        setSessionClient(null);
        alert(`Lens Login Error: ${error.message || 'Unknown error'}`);
      } finally {
        setIsLoadingLensAuth(false);
      }
    },
    [publicClient, walletAddress, isWalletConnected]
  );

  const logoutLens = useCallback(async () => {
    if (sessionClient) {
      await sessionClient.logout();
      setSessionClient(null);
      setIsLensAuthenticated(false);
    }
  }, [sessionClient]);

  const value: LensProfileContextType = {
    publicClient,
    sessionClient,
    isLensAuthenticated,
    loginWithLens,
    logoutLens,
    isLoadingLensAuth,
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
