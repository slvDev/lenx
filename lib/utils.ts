/**
 * Utility functions for X OAuth PKCE flow and other common operations.
 */

/**
 * Generates a random string suitable for use as a PKCE code verifier.
 * The code verifier must be between 43 and 128 characters long and
 * can only contain the following characters: [A-Z] / [a-z] / [0-9] / "-" / "." / "_" / "~"
 * @returns {Promise<string>} A random code verifier string or its challenge.
 */
export async function generatePKCEChallenge(codeVerifier?: string): Promise<string> {
  // If a code verifier is provided, generate its challenge
  if (codeVerifier) {
    return generateCodeChallenge(codeVerifier);
  }

  // Otherwise, generate a new random code verifier
  const validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const length = Math.floor(Math.random() * (128 - 43 + 1)) + 43; // Random length between 43 and 128
  let result = '';

  // Use Web Crypto API for better randomness if available
  if (typeof window !== 'undefined' && window.crypto) {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += validChars[array[i] % validChars.length];
    }
  } else {
    // Fallback to Math.random() if Web Crypto API is not available
    for (let i = 0; i < length; i++) {
      result += validChars[Math.floor(Math.random() * validChars.length)];
    }
  }

  return result;
}

/**
 * Generates a code challenge from a code verifier using SHA-256.
 * This implements the S256 PKCE method.
 * @param {string} codeVerifier - The code verifier to generate a challenge from.
 * @returns {Promise<string>} The base64url-encoded code challenge.
 */
async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  // Convert the code verifier to a Uint8Array
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);

  // Hash the data with SHA-256
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);

  // Convert the hash to a base64url string
  return base64URLEncode(hashBuffer);
}

/**
 * Encodes an ArrayBuffer to a base64url string.
 * @param {ArrayBuffer} buffer - The buffer to encode.
 * @returns {string} The base64url-encoded string.
 */
function base64URLEncode(buffer: ArrayBuffer): string {
  // Convert the buffer to a base64 string
  const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));

  // Convert to base64url format
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Generates a random state parameter for CSRF protection in OAuth flows.
 * The state should be a random string that is at least 32 characters long.
 * @returns {string} A random state string.
 */
export function generateRandomState(): string {
  const validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = 32; // Standard length for OAuth state parameter
  let result = '';

  // Use Web Crypto API for better randomness if available
  if (typeof window !== 'undefined' && window.crypto) {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += validChars[array[i] % validChars.length];
    }
  } else {
    // Fallback to Math.random() if Web Crypto API is not available
    for (let i = 0; i < length; i++) {
      result += validChars[Math.floor(Math.random() * validChars.length)];
    }
  }

  return result;
}

/**
 * Safely parses a JSON string, with proper error handling.
 * @param {string} jsonString - The JSON string to parse.
 * @returns {unknown} The parsed JSON value, or null if parsing fails.
 */
export function safeJsonParse(jsonString: string): unknown {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    return null;
  }
}

/**
 * Safely stringifies a value to JSON, with proper error handling.
 * @param {unknown} value - The value to stringify.
 * @returns {string | null} The JSON string, or null if stringification fails.
 */
export function safeJsonStringify(value: unknown): string | null {
  try {
    return JSON.stringify(value);
  } catch (error) {
    console.error('Failed to stringify value:', error);
    return null;
  }
}
