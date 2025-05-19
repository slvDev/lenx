'use client';

import { useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useXAuth } from '@/contexts/XAuthProvider';
import Spinner from '@/components/ui/Spinner';
import Threads from '@/components/ui/backgroundThreads';

function XAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { handleXAuthCallback, isLoadingXAuth } = useXAuth();
  const hasHandledCallback = useRef(false);
  const isProcessing = useRef(false);

  useEffect(() => {
    if (hasHandledCallback.current || isProcessing.current) {
      return;
    }

    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code || !state) {
      router.replace('/');
      return;
    }

    isProcessing.current = true;
    hasHandledCallback.current = true;

    handleXAuthCallback()
      .then(() => {
        router.replace('/dashboard');
      })
      .catch(() => {
        router.replace(`/`);
      })
      .finally(() => {
        isProcessing.current = false;
      });
  }, [searchParams, router, handleXAuthCallback]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <div className='min-h-screen bg-black flex items-center justify-center relative overflow-hidden'>
      <div className='absolute inset-0 z-0'>
        <Threads amplitude={1.2} distance={0.5} color={[0.6, 0.3, 0.9]} enableMouseInteraction={true} />
      </div>

      <motion.div
        className='w-full max-w-md p-8 bg-black/20 backdrop-blur-md rounded-2xl border border-purple-500/20 shadow-lg shadow-purple-500/5 text-center z-10'
        initial='hidden'
        animate='visible'
        variants={containerVariants}
      >
        <motion.div
          className='w-20 h-20 mx-auto mb-6 bg-purple-500/30 rounded-full flex items-center justify-center'
          variants={itemVariants}
        >
          <svg viewBox='0 0 24 24' fill='currentColor' className='w-10 h-10 text-white'>
            <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
          </svg>
        </motion.div>

        <motion.h1 className='text-2xl font-bold text-white mb-4' variants={itemVariants}>
          {isLoadingXAuth ? 'Completing X Login...' : 'Processing Callback...'}
        </motion.h1>

        <motion.p className='text-white/70 mb-8' variants={itemVariants}>
          {isLoadingXAuth ? 'Please wait while we complete your X login' : 'Taking you back to the dashboard'}
        </motion.p>

        <motion.div className='flex flex-col items-center' variants={itemVariants}>
          {(isLoadingXAuth || isProcessing.current) && (
            <>
              <Spinner color='purple' size='medium' className='mb-4' />
              <motion.div className='w-full h-1 bg-black/30 rounded-full overflow-hidden mt-6'>
                <motion.div
                  className='h-full bg-gradient-to-r from-purple-500 to-purple-700'
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity, repeatType: 'loop' }}
                />
              </motion.div>
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function XAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen bg-black flex flex-col items-center justify-center text-white'>
          <Spinner color='purple' size='large' />
          <p className='mt-4 text-lg'>Loading X Authentication...</p>
        </div>
      }
    >
      <XAuthCallbackContent />
    </Suspense>
  );
}
