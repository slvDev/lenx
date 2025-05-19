'use client';

import { X_AUTH_CODE_VERIFIER_KEY, X_AUTH_STORAGE_KEY } from '@/lib/constants';
import { generatePKCEChallenge, generateRandomState } from '@/lib/utils';

// --- Types ---
interface AuthUrlParams {
  authUrl: string;
  codeVerifier: string;
  state: string;
}

interface TokenResponse {
  accessToken: string;
  handle: string;
}

// --- Constants ---
const X_AUTH_BASE_URL = 'https://twitter.com/i/oauth2/authorize';
const X_TOKEN_URL = '/api/auth/x/token'; // Our Next.js API route for token exchange
const X_USER_INFO_URL = '/api/auth/x/user'; // Our Next.js API route for user info
const REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL + '/api/auth/x/callback';

// --- Main Service Functions ---

/**
 * Initiates the X OAuth flow by generating PKCE challenge and state,
 * then constructing the authorization URL.
 * @returns {Promise<AuthUrlParams>} The auth URL, code verifier, and state.
 */
export async function initiateLogin(): Promise<AuthUrlParams> {
  // Generate PKCE challenge and verifier
  const codeVerifier = await generatePKCEChallenge();
  const codeChallenge = await generatePKCEChallenge(codeVerifier);

  // Generate random state for CSRF protection
  const state = generateRandomState();

  // Store code_verifier and state in sessionStorage
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(X_AUTH_CODE_VERIFIER_KEY, codeVerifier);
    sessionStorage.setItem(X_AUTH_STORAGE_KEY, state);
  }

  // Construct the authorization URL
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.NEXT_PUBLIC_X_CLIENT_ID!,
    redirect_uri: REDIRECT_URI,
    scope: 'tweet.read users.read offline.access',
    state: state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });

  const authUrl = `${X_AUTH_BASE_URL}?${params.toString()}`;

  return { authUrl, codeVerifier, state };
}

/**
 * Exchanges the authorization code for an access token.
 * This function calls our Next.js API route to securely exchange the code,
 * as the client secret should not be exposed in the browser.
 * @param {string} code - The authorization code received from X.
 * @param {string} codeVerifier - The PKCE code verifier generated during login initiation.
 * @param {string} state - The state parameter received from X, to be verified.
 * @returns {Promise<TokenResponse>} The access token and user handle.
 * @throws {Error} If the exchange fails, state is invalid, or handle cannot be fetched.
 */
export async function exchangeCodeForToken(code: string, codeVerifier: string, state: string): Promise<TokenResponse> {
  // Verify state
  const storedState = typeof window !== 'undefined' ? sessionStorage.getItem(X_AUTH_STORAGE_KEY) : null;

  if (!storedState || storedState !== state) {
    console.error('State mismatch:', { storedState, receivedState: state });
    throw new Error('Invalid state parameter. Potential CSRF attack.');
  }

  const tokenResponse = await fetch(X_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code,
      code_verifier: codeVerifier,
      redirect_uri: REDIRECT_URI,
    }),
  });

  if (!tokenResponse.ok) {
    const errorBody = await tokenResponse.text().catch(() => 'Unknown error');
    console.error('Token exchange failed:', {
      status: tokenResponse.status,
      statusText: tokenResponse.statusText,
      error: errorBody,
    });
    throw new Error(`Failed to exchange code for token: ${tokenResponse.status} ${errorBody}`);
  }

  const tokenData = await tokenResponse.json();

  if (!tokenData.access_token) {
    console.error('No access token in response:', tokenData);
    throw new Error('Access token not received from token exchange.');
  }

  // Fetch the user's handle
  const handle = await fetchXHandle(tokenData.access_token);

  // Clean up sessionStorage
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(X_AUTH_CODE_VERIFIER_KEY);
    sessionStorage.removeItem(X_AUTH_STORAGE_KEY);
  }

  return { accessToken: tokenData.access_token, handle };
}

/**
 * Fetches the user's X handle using the provided access token.
 * @param {string} accessToken - The X access token.
 * @returns {Promise<string>} The user's X handle.
 * @throws {Error} If fetching the handle fails.
 */
async function fetchXHandle(accessToken: string): Promise<string> {
  const userInfoResponse = await fetch(X_USER_INFO_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!userInfoResponse.ok) {
    const errorText = await userInfoResponse.text().catch(() => 'Unknown error fetching user info');
    console.error('Failed to fetch user handle:', {
      status: userInfoResponse.status,
      statusText: userInfoResponse.statusText,
      error: errorText,
    });
    throw new Error(`Failed to fetch X handle: ${userInfoResponse.status} ${errorText}`);
  }

  const userData = await userInfoResponse.json();

  const handle = userData?.data?.username;
  if (!handle) {
    console.error('No handle in user data:', userData);
    throw new Error('Could not retrieve X handle from API response.');
  }

  return handle;
}

/**
 * Logs the user out from X (client-side).
 * This primarily involves clearing any stored tokens or session data.
 * A full logout might require revoking the token on the server if you have that capability.
 */
export async function logout(): Promise<void> {
  // Clear any client-side storage related to X auth (e.g., sessionStorage, localStorage)
  if (typeof window !== 'undefined') {
    // sessionStorage is cleared in exchangeCodeForToken, but clear it here too for safety
    sessionStorage.removeItem(X_AUTH_CODE_VERIFIER_KEY);
    sessionStorage.removeItem(X_AUTH_STORAGE_KEY);
  }
}
