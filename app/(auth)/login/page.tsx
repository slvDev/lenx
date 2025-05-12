'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';
import { XLoginButton } from '@/components/auth/XLoginButton';
import { ConnectWalletWrapper } from '@/components/auth/ConnectWalletWrapper';
import { Icon } from '@/components/ui/Icon';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
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

// Base card animation for both sides
const cardVariants = {
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

// Hover effect for left side cards only
const leftCardHover = {
  scale: 1.02,
  transition: {
    type: 'spring',
    stiffness: 400,
    damping: 10,
  },
};

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isConnected } = useAccount();
  const [error, setError] = useState<string | null>(null);

  // Handle error states from callback
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      switch (errorParam) {
        case 'invalid_callback':
          setError('Invalid login attempt. Please try again.');
          break;
        case 'auth_failed':
          setError('Failed to complete X login. Please try again.');
          break;
        default:
          setError('An unexpected error occurred. Please try again.');
      }
      // Clear the error from URL
      router.replace('/login');
    }
  }, [searchParams, router]);

  // Redirect to dashboard if wallet is connected
  useEffect(() => {
    if (isConnected) {
      router.push('/dashboard');
    }
  }, [isConnected, router]);

  const handleCloseError = () => {
    setError(null);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black'>
      <div className='min-h-screen flex flex-col md:flex-row'>
        {/* Left side - Welcome and Explanation */}
        <div className='w-full md:w-1/2 bg-black p-8 md:p-12 flex flex-col justify-center relative overflow-hidden'>
          {/* Subtle gradient overlay */}
          <div className='absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-indigo-900/20' />

          <motion.div
            initial='hidden'
            animate='visible'
            variants={containerVariants}
            className='max-w-lg mx-auto text-white relative z-10'
          >
            <motion.h1
              variants={itemVariants}
              className='text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200'
            >
              Welcome to HugLens
            </motion.h1>
            <motion.p variants={itemVariants} className='text-lg mb-8 text-purple-100'>
              Create your Lens Profile and manage it as a smart account. Choose your preferred way to get started:
            </motion.p>

            {/* Login Options Explanation */}
            <motion.div variants={containerVariants} className='space-y-6'>
              {/* X Login Path */}
              <motion.div
                variants={cardVariants}
                whileHover={leftCardHover}
                className='bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-shadow duration-300'
              >
                <h2 className='text-xl font-semibold mb-3 flex items-center'>
                  <Icon name='x' className='mr-2 text-purple-200' />
                  <span className='bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200'>
                    Start with X
                  </span>
                </h2>
                <div className='space-y-3 text-purple-100'>
                  <motion.p variants={itemVariants} className='flex items-start'>
                    <Icon name='check' className='text-purple-300 mr-2 mt-0.5 flex-shrink-0' />
                    Connect your X account to use your X handle as a suggestion for your Lens Profile
                  </motion.p>
                  <motion.p variants={itemVariants} className='flex items-start'>
                    <Icon name='check' className='text-purple-300 mr-2 mt-0.5 flex-shrink-0' />
                    Connect your wallet to mint your Lens Profile with the suggested handle
                  </motion.p>
                  <motion.p variants={itemVariants} className='flex items-start'>
                    <Icon name='check' className='text-purple-300 mr-2 mt-0.5 flex-shrink-0' />
                    Start using your Lens Profile as a smart account on the Lens Protocol
                  </motion.p>
                </div>
              </motion.div>

              {/* Wallet Login Path */}
              <motion.div
                variants={cardVariants}
                whileHover={leftCardHover}
                className='bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-shadow duration-300'
              >
                <h2 className='text-xl font-semibold mb-3 flex items-center'>
                  <Icon name='wallet' className='mr-2 text-purple-200' />
                  <span className='bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200'>
                    Start with Wallet
                  </span>
                </h2>
                <div className='space-y-3 text-purple-100'>
                  <motion.p variants={itemVariants} className='flex items-start'>
                    <Icon name='check' className='text-purple-300 mr-2 mt-0.5 flex-shrink-0' />
                    Connect your wallet to access the Lens Protocol
                  </motion.p>
                  <motion.p variants={itemVariants} className='flex items-start'>
                    <Icon name='check' className='text-purple-300 mr-2 mt-0.5 flex-shrink-0' />
                    Optionally connect your X account to use your X handle as a suggestion
                  </motion.p>
                  <motion.p variants={itemVariants} className='flex items-start'>
                    <Icon name='check' className='text-purple-300 mr-2 mt-0.5 flex-shrink-0' />
                    Create your Lens Profile and start using it as a smart account
                  </motion.p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Right side - Login Options */}
        <div className='w-full md:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-white to-gray-50'>
          <motion.div
            initial='hidden'
            animate='visible'
            variants={containerVariants}
            className='w-full max-w-md space-y-8'
          >
            <motion.div variants={itemVariants} className='text-center'>
              <h2 className='text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700'>
                Get Started
              </h2>
              <p className='mt-2 text-gray-600'>Choose your preferred login method</p>
            </motion.div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  className='p-4 bg-red-50 border border-red-200 rounded-lg shadow-sm'
                >
                  <div className='flex items-center justify-between'>
                    <p className='text-sm text-red-700'>{error}</p>
                    <button
                      onClick={handleCloseError}
                      className='ml-4 p-1 rounded-full hover:bg-red-100 transition-colors duration-200 flex items-center justify-center'
                      aria-label='Close error message'
                    >
                      <svg className='h-4 w-4 text-red-400' viewBox='0 0 20 20' fill='currentColor'>
                        <path
                          fillRule='evenodd'
                          d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Login Options */}
            <motion.div variants={containerVariants} className='space-y-6'>
              {/* X Login */}
              <motion.div
                variants={cardVariants}
                className='bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-shadow duration-300'
              >
                <h3 className='text-lg font-medium text-gray-900 mb-2 flex items-center'>
                  <Icon name='x' className='mr-2 text-gray-600' />
                  Login with X
                </h3>
                <p className='text-sm text-gray-600 mb-4'>
                  Connect your X account to use your X handle as a suggestion for your Lens Profile
                </p>
                <div className='flex justify-center'>
                  <XLoginButton />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className='relative'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t border-gray-200'></div>
                </div>
                <div className='relative flex justify-center text-sm'>
                  <span className='px-2 bg-white text-gray-500'>or</span>
                </div>
              </motion.div>

              {/* Wallet Login */}
              <motion.div
                variants={cardVariants}
                className='bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-shadow duration-300'
              >
                <h3 className='text-lg font-medium text-gray-900 mb-2 flex items-center'>
                  <Icon name='wallet' className='mr-2 text-gray-600' />
                  Connect Wallet
                </h3>
                <p className='text-sm text-gray-600 mb-4'>
                  Connect your wallet to access the Lens Protocol and manage your profile
                </p>
                <div className='flex justify-center'>
                  <ConnectWalletWrapper />
                </div>
              </motion.div>
            </motion.div>

            {/* Additional Info */}
            <motion.div variants={itemVariants} className='mt-8 text-center'>
              <p className='text-sm text-gray-600'>
                Don't have a wallet?{' '}
                <a
                  href='https://ethereum.org/en/wallets/'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200'
                >
                  Learn how to get one
                </a>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
