import { PublicClient, SessionClient, mainnet, type CanCreateUsernameResult } from '@lens-protocol/client';
import { canCreateUsername, createUsername } from '@lens-protocol/client/actions';
import { handleOperationWith } from '@lens-protocol/client/viem';

// Create public client for Lens using the standard mainnet environment
export const publicLensClient = PublicClient.create({
  environment: mainnet,
});

// Create a more specific type for checkUsernameAvailability return values
export type UsernameAvailabilityResult =
  | { available: true; data: CanCreateUsernameResult }
  | { available: false; reason: string; data: CanCreateUsernameResult };

/**
 * Checks if a username is available for creation
 *
 * @param sessionClient - The authenticated session client
 * @param localName - The username to check
 * @returns A Promise resolving to the availability result or error
 */
export async function checkUsernameAvailability(
  sessionClient: SessionClient,
  localName: string
): Promise<UsernameAvailabilityResult | Error> {
  const result = await canCreateUsername(sessionClient, {
    localName,
  });

  if (result.isErr()) {
    console.error('Error checking username availability:', result.error);
    return result.error;
  }

  const data = result.value;

  // Helper to interpret the result
  switch (data.__typename) {
    case 'NamespaceOperationValidationPassed':
      // Username is available
      return { available: true, data };

    case 'NamespaceOperationValidationFailed':
      // Creating username not allowed
      return { available: false, reason: data.reason, data };

    case 'NamespaceOperationValidationUnknown':
      // Validation outcome unknown
      return { available: false, reason: 'Unknown validation rules', data };

    case 'UsernameTaken':
      // Username not available
      return { available: false, reason: 'Username already taken', data };

    default:
      return { available: false, reason: 'Unknown error', data };
  }
}

/**
 * Creates a new username on Lens Protocol
 *
 * This implements the example from the guide with proper error handling.
 *
 * @param sessionClient - The authenticated session client
 * @param localName - The username to create
 * @param walletClient - The wallet client for signing
 * @returns A Promise resolving to success or error information
 */
export async function createLensUsername(
  sessionClient: SessionClient,
  localName: string,
  walletClient: any
): Promise<{ success: boolean; error?: string }> {
  try {
    // First, check if the username is available
    const availabilityCheck = await checkUsernameAvailability(sessionClient, localName);
    if (availabilityCheck instanceof Error || !availabilityCheck.available) {
      return {
        success: false,
        error: availabilityCheck instanceof Error ? availabilityCheck.message : availabilityCheck.reason,
      };
    }

    // 1. Prepare the username creation
    const prepareResult = await createUsername(sessionClient, {
      username: { localName },
    });

    if (prepareResult.isErr()) {
      return {
        success: false,
        error: `Failed to prepare username creation: ${prepareResult.error.message}`,
      };
    }

    // 2. Sign and send the transaction using handleOperationWith
    // Using any here to bypass the TypeScript issues
    const signResult = await (handleOperationWith(walletClient) as any)(prepareResult.value);

    if (signResult.isErr()) {
      return {
        success: false,
        error: `Failed to sign/broadcast transaction: ${signResult.error.message}`,
      };
    }

    // 3. Wait for transaction to be indexed
    const indexResult = await sessionClient.waitForTransaction(signResult.value);

    if (indexResult.isErr()) {
      return {
        success: false,
        error: `Transaction submitted but indexing failed: ${indexResult.error.message}`,
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Unexpected error creating username:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
