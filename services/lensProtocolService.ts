import { LENS_GLOBAL_NAMESPACE_ADDRESS } from '@/lib/constants';
import {
  PublicClient,
  SessionClient,
  mainnet,
  type EvmAddress,
  type URI,
  type Account,
  type CreateAccountWithUsernameResult,
  type CanCreateUsernameRequest,
  type CanCreateUsernameResult,
} from '@lens-protocol/client';

import { fetchAccountsBulk, canCreateUsername, createAccountWithUsername } from '@lens-protocol/client/actions';

const publicLensClient = PublicClient.create({
  environment: mainnet,
});

export interface LensProfile {
  id: EvmAddress;
  handle: string;
  ownedBy: EvmAddress;
}

export class LensProtocolService {
  async fetchProfileByOwner(ownerAddress: EvmAddress): Promise<LensProfile | null> {
    try {
      const result = await fetchAccountsBulk(publicLensClient, {
        ownedBy: [ownerAddress],
      });

      if (result.isErr()) {
        console.error('Error fetching Lens profiles by owner:', result.error.message);
        throw new Error(`Failed to fetch Lens profiles by owner: ${result.error.message}`);
      }

      const profiles = result.value;

      if (!profiles.length) {
        return null;
      }

      const sdkProfile: Account = profiles[0];
      return {
        id: sdkProfile.address,
        handle: sdkProfile.username?.value || '', // Or sdkProfile.username.localName if only local name is needed
        ownedBy: sdkProfile.owner as EvmAddress,
      };
    } catch (error) {
      console.error('Error in fetchProfileByOwner:', error);
      if (error instanceof Error) throw error;
      throw new Error('Failed to fetch Lens profile by owner');
    }
  }

  async isHandleAvailable(sessionClient: SessionClient, handle: string): Promise<boolean> {
    try {
      // Use CanCreateUsernameRequest as the type for the request object
      const request: CanCreateUsernameRequest = {
        localName: handle,
        namespace: LENS_GLOBAL_NAMESPACE_ADDRESS as EvmAddress,
      };
      // Corrected type annotation for result to include null
      const result: CanCreateUsernameResult | null = await canCreateUsername(sessionClient, request).then((res) =>
        res.unwrapOr(null)
      );

      if (result === null) {
        console.warn('Handle availability check resulted in null, treating as unavailable or error.');
        return false;
      }

      return result.__typename === 'NamespaceOperationValidationPassed';
    } catch (error) {
      console.error('Error in isHandleAvailable:', error);
      if (error instanceof Error) throw error;
      throw new Error('Failed to check handle availability');
    }
  }

  async prepareCreateProfileTransaction(
    sessionClient: SessionClient,
    handle: string,
    metadataUri: URI
  ): Promise<CreateAccountWithUsernameResult> {
    try {
      const isAvailable = await this.isHandleAvailable(sessionClient, handle);
      if (!isAvailable) {
        throw new Error('Handle is not available or invalid.');
      }

      const usernameInput: CanCreateUsernameRequest = {
        localName: handle,
        namespace: LENS_GLOBAL_NAMESPACE_ADDRESS as EvmAddress,
      };

      const result = await createAccountWithUsername(sessionClient, {
        username: usernameInput,
        metadataUri: metadataUri,
      });

      if (result.isErr()) {
        const errorValue = result.error;
        console.error('Error preparing create profile transaction data:', errorValue);
        const reason =
          typeof errorValue === 'object' && errorValue !== null && 'reason' in errorValue
            ? String(errorValue.reason)
            : 'Unknown error';
        throw new Error(`Failed to prepare profile creation: ${reason}`);
      }

      return result.value;
    } catch (error) {
      console.error('Error in prepareCreateProfileTransaction:', error);
      if (error instanceof Error) throw error;
      throw new Error('Failed to prepare profile creation transaction');
    }
  }
}

export const lensProtocolService = new LensProtocolService();
