'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  type CreateAccountWithUsernameResult,
  type EvmAddress,
  type SessionClient as LensSessionClientType,
  type URI,
} from '@lens-protocol/client';
import { lensProtocolService, type LensProfile } from '@/services/lensProtocolService';
import { useAccount, useChainId } from 'wagmi';
import { LENS_CHAIN_ID } from '@/lib/constants';

interface LensProfileContextType {
  profile: LensProfile | null;
  isLoadingProfile: boolean;
  profileError: string | null;
  fetchProfileByOwner: (address: EvmAddress) => Promise<void>;
  prepareCreateProfile: (
    sessionClient: LensSessionClientType,
    handle: string,
    metadataUri: URI
  ) => Promise<CreateAccountWithUsernameResult>;
  clearProfileError: () => void;
}

const LensProfileContext = createContext<LensProfileContextType | undefined>(undefined);

export function LensProfileProvider({ children }: { children: React.ReactNode }) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [profile, setProfile] = useState<LensProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  const clearProfileError = useCallback(() => {
    setProfileError(null);
  }, []);

  const fetchProfileByOwner = useCallback(
    async (ownerAddress: EvmAddress) => {
      if (!ownerAddress) return;

      setIsLoadingProfile(true);
      setProfileError(null);

      try {
        // Ensure we're on Lens Chain
        if (chainId !== LENS_CHAIN_ID) {
          throw new Error('Please switch to Lens Chain to check your profile');
        }

        const fetchedProfile = await lensProtocolService.fetchProfileByOwner(ownerAddress);
        setProfile(fetchedProfile);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch profile';
        setProfileError(errorMessage);
        setProfile(null);
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoadingProfile(false);
      }
    },
    [chainId]
  );

  const prepareCreateProfile = useCallback(
    async (
      sessionClient: LensSessionClientType,
      handle: string,
      metadataUri: URI
    ): Promise<CreateAccountWithUsernameResult> => {
      if (!sessionClient.getAuthenticatedUser().isOk()) {
        const error = 'User is not authenticated in the provided session client.';
        setProfileError(error);
        throw new Error(error);
      }

      // Ensure we're on Lens Chain
      if (chainId !== LENS_CHAIN_ID) {
        const error = 'Please switch to Lens Chain to create your profile';
        setProfileError(error);
        throw new Error(error);
      }

      setProfileError(null);
      try {
        return await lensProtocolService.prepareCreateProfileTransaction(sessionClient, handle, metadataUri);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to prepare profile creation';
        setProfileError(errorMessage);
        throw error;
      }
    },
    [chainId]
  );

  // Effect to fetch profile when wallet is connected and on Lens Chain
  useEffect(() => {
    if (isConnected && address && chainId === LENS_CHAIN_ID) {
      fetchProfileByOwner(address as EvmAddress);
    } else {
      // Reset profile state if not connected or not on Lens Chain
      setProfile(null);
      setIsLoadingProfile(false);
      if (isConnected && chainId !== LENS_CHAIN_ID) {
        setProfileError('Please switch to Lens Chain to manage your profile');
      } else {
        setProfileError(null);
      }
    }
  }, [isConnected, address, chainId, fetchProfileByOwner]);

  const value: LensProfileContextType = {
    profile,
    isLoadingProfile,
    profileError,
    fetchProfileByOwner,
    prepareCreateProfile,
    clearProfileError,
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
