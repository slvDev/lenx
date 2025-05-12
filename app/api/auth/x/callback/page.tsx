'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useXAuth } from '@/contexts/XAuthProvider';

export default function XAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { handleXAuthCallback, isLoadingXAuth } = useXAuth();
  const hasHandledCallback = useRef(false);
  const isProcessing = useRef(false);

  useEffect(() => {
    // Prevent duplicate callback handling
    if (hasHandledCallback.current || isProcessing.current) {
      return;
    }

    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code || !state) {
      router.replace('/login?error=invalid_callback');
      return;
    }
    isProcessing.current = true;
    hasHandledCallback.current = true;

    // Handle the callback
    handleXAuthCallback()
      .then(() => {
        // Clear the URL parameters after successful handling
        router.replace('/login');
      })
      .catch((error) => {
        router.replace('/login?error=auth_failed');
      })
      .finally(() => {
        isProcessing.current = false;
      });

    // Cleanup function
    return () => {
      // Only reset if we're not in the middle of processing
      if (!isProcessing.current) {
        hasHandledCallback.current = false;
      }
    };
  }, [searchParams, router, handleXAuthCallback]);

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100'>
      <motion.div
        className='w-full max-w-md p-8 bg-white rounded-2xl shadow-xl text-center'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* X Logo */}
        <div className='w-12 h-12 mx-auto mb-6'>
          <svg viewBox='0 0 24 24' fill='currentColor' className='w-full h-full text-black'>
            <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
          </svg>
        </div>

        {/* Status Message */}
        <h1 className='text-2xl font-bold text-gray-900 mb-4'>
          {isLoadingXAuth ? 'Completing X Login...' : 'Redirecting...'}
        </h1>
        <p className='text-gray-600'>
          {isLoadingXAuth ? 'Please wait while we complete your X login' : 'Taking you back to the login page'}
        </p>

        {/* Loading State */}
        {isLoadingXAuth && (
          <motion.div
            className='mt-6 h-1 bg-gray-200 rounded-full overflow-hidden'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className='h-full bg-black'
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2, ease: 'easeInOut' }}
            />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
