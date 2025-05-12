'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { initiateLogin, exchangeCodeForToken, logout as xAuthLogout } from '@/services/xAuthService';
import { X_AUTH_CODE_VERIFIER_KEY, X_AUTH_STORAGE_KEY } from '@/lib/constants';

// --- Types ---
interface XAuthState {
  isAuthenticated: boolean;
  handle: string | null;
}

// --- Define the shape of the X Auth Context State ---
interface XAuthContextState {
  isXAuthenticated: boolean;
  xHandle: string | null;
  isLoadingXAuth: boolean;
  loginWithX: () => Promise<void>;
  logoutFromX: () => Promise<void>;
  handleXAuthCallback: () => Promise<void>;
}

// --- Create the Context ---
const XAuthContext = createContext<XAuthContextState | undefined>(undefined);

// --- Provider Props ---
interface XAuthProviderProps {
  children: React.ReactNode;
}

// --- Provider Component ---
export function XAuthProvider({ children }: XAuthProviderProps) {
  const router = useRouter();
  const [isXAuthenticated, setIsXAuthenticated] = useState<boolean>(false);
  const [xHandle, setXHandle] = useState<string | null>(null);
  const [isLoadingXAuth, setIsLoadingXAuth] = useState<boolean>(false);

  useEffect(() => {
    try {
      const storedState = localStorage.getItem(X_AUTH_STORAGE_KEY);
      if (storedState) {
        const { isAuthenticated, handle } = JSON.parse(storedState) as XAuthState;
        setIsXAuthenticated(isAuthenticated);
        setXHandle(handle);
      }
    } catch (error) {
      console.error('[XAuthProvider] Error loading persisted auth state:', error);
      localStorage.removeItem(X_AUTH_STORAGE_KEY);
    }
  }, []);

  // Helper to persist auth state
  const persistAuthState = useCallback((isAuthenticated: boolean, handle: string | null) => {
    const state: XAuthState = { isAuthenticated, handle };
    localStorage.setItem(X_AUTH_STORAGE_KEY, JSON.stringify(state));
  }, []);

  const loginWithX = useCallback(async () => {
    try {
      setIsLoadingXAuth(true);
      const { authUrl } = await initiateLogin();
      // Redirect to X auth page
      window.location.href = authUrl;
    } catch (error) {
      console.error('[XAuthProvider] Failed to initiate X login:', error);
      setIsLoadingXAuth(false);
      throw error;
    }
  }, []);

  const handleXAuthCallback = useCallback(async () => {
    // Get code and state from URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const codeVerifier = sessionStorage.getItem(X_AUTH_CODE_VERIFIER_KEY);

    if (!code || !state || !codeVerifier) {
      console.error('[XAuthProvider] Missing required parameters for X auth callback');
      setIsLoadingXAuth(false);
      return;
    }

    try {
      setIsLoadingXAuth(true);
      const { handle } = await exchangeCodeForToken(code, codeVerifier, state);

      // Store auth state
      setIsXAuthenticated(true);
      setXHandle(handle);
      persistAuthState(true, handle);

      // handle this in then block
      // router.replace('/login');
    } catch (error) {
      console.error('[XAuthProvider] Failed to complete X auth:', error);
      setIsXAuthenticated(false);
      setXHandle(null);
      persistAuthState(false, null);
      throw error;
    } finally {
      setIsLoadingXAuth(false);
    }
  }, [router, persistAuthState]);

  const logoutFromX = useCallback(async () => {
    try {
      setIsLoadingXAuth(true);
      await xAuthLogout();
      setIsXAuthenticated(false);
      setXHandle(null);
      persistAuthState(false, null);
    } catch (error) {
      console.error('[XAuthProvider] Failed to logout from X:', error);
      throw error;
    } finally {
      setIsLoadingXAuth(false);
    }
  }, [persistAuthState]);

  // --- Value provided by the context ---
  const contextValue: XAuthContextState = {
    isXAuthenticated,
    xHandle,
    isLoadingXAuth,
    loginWithX,
    logoutFromX,
    handleXAuthCallback,
  };

  return <XAuthContext.Provider value={contextValue}>{children}</XAuthContext.Provider>;
}

// --- Custom Hook for using the context ---
export function useXAuth(): XAuthContextState {
  const context = useContext(XAuthContext);
  if (context === undefined) {
    throw new Error('useXAuth must be used within an XAuthProvider');
  }
  return context;
}
