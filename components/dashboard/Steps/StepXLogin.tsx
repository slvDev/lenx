import { motion } from 'framer-motion';
import { useXAuth } from '@/contexts/XAuthProvider';
import { XLoginButton } from '@/components/auth/XLoginButton';
import { useReadContract } from 'wagmi';
import { LENS_GLOBAL_NAMESPACE_ADDRESS, LENS_GLOBAL_NAMESPACE_ABI } from '@/lib/constants';
import { useEffect } from 'react';
import Spinner from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { containerVariants, itemVariants } from '@/lib/animations';

interface StepXLoginProps {
  onComplete?: () => void;
}

const StepXLogin = ({ onComplete }: StepXLoginProps) => {
  const { xHandle, isXAuthenticated, logoutFromX } = useXAuth();

  const {
    data: usernameExists,
    isLoading: isLoadingUsernameCheck,
    refetch,
  } = useReadContract({
    address: LENS_GLOBAL_NAMESPACE_ADDRESS,
    abi: LENS_GLOBAL_NAMESPACE_ABI,
    functionName: 'exists',
    args: xHandle ? [xHandle.toLowerCase()] : undefined,
    query: {
      enabled: false,
    },
  });

  useEffect(() => {
    if (xHandle && !isLoadingUsernameCheck) {
      refetch();
    }
  }, [xHandle, refetch, isLoadingUsernameCheck]);

  return (
    <motion.div variants={containerVariants} initial='hidden' animate='visible' className='w-full max-w-3xl mx-auto'>
      {/* Header Section with Handle Status */}
      <motion.div variants={itemVariants} className='mb-8 text-center'>
        <h2 className='text-3xl font-bold text-white bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent'>
          {isXAuthenticated && xHandle ? `Ready to claim @${xHandle} on Lens?` : 'Connect your X account'}
        </h2>
        <p className='mt-2 text-white/70'>
          {isXAuthenticated && xHandle
            ? "Let's check if your handle is available to claim"
            : "We'll use your X handle to create your Lens profile"}
        </p>
      </motion.div>

      {/* Status Messages */}
      {!xHandle && isXAuthenticated && (
        <motion.div
          variants={itemVariants}
          className='mb-6 p-4 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-lg'
        >
          <div className='flex items-start'>
            <div className='mr-3 mt-1'>
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                />
              </svg>
            </div>
            <div>
              <p className='font-medium mb-1'>No X handle detected</p>
              <p className='text-sm'>Make sure your X account has a valid handle and try connecting again.</p>
            </div>
          </div>
        </motion.div>
      )}

      {isLoadingUsernameCheck && xHandle ? (
        <motion.div variants={itemVariants} className='mb-6 p-6 flex flex-col items-center'>
          <Spinner color='purple' size='large' />
          <p className='mt-4 text-white/70'>Checking handle availability...</p>
        </motion.div>
      ) : (
        <>
          {isXAuthenticated && xHandle && usernameExists === false && (
            <motion.div
              variants={itemVariants}
              className='mb-6 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-400 rounded-lg'
            >
              <div className='flex items-start'>
                <div className='mr-3 mt-1'>
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                </div>
                <div>
                  <p className='font-medium mb-1'>Handle Available!</p>
                  <p className='text-sm'>Great news! Your X handle @{xHandle} is available to claim on Lens.</p>
                </div>
              </div>
            </motion.div>
          )}

          {isXAuthenticated && xHandle && usernameExists === true && (
            <motion.div
              variants={itemVariants}
              className='mb-6 p-4 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 text-amber-400 rounded-lg'
            >
              <div className='flex items-start'>
                <div className='mr-3 mt-1'>
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                </div>
                <div>
                  <p className='font-medium mb-1'>Handle Already Claimed</p>
                  <p className='text-sm'>
                    @{xHandle} is already taken on Lens. Connect with the wallet that owns it to proceed.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </>
      )}

      {/* Info Section */}
      <motion.div
        variants={itemVariants}
        className='mb-8 bg-purple-900/20 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6'
      >
        <div className='grid md:grid-cols-2 gap-6'>
          <div>
            <h3 className='text-xl font-semibold text-white mb-3 flex items-center'>
              <span className='w-8 h-8 bg-purple-500/30 rounded-full flex items-center justify-center mr-2 text-sm'>
                1
              </span>
              What you're doing
            </h3>
            <p className='text-white/70 text-sm leading-relaxed'>
              This app helps you join Lens Protocol. We'll use your X handle to create your Lens username and send it to
              your Lens account.
            </p>
          </div>

          <div>
            <h3 className='text-xl font-semibold text-white mb-3 flex items-center'>
              <span className='w-8 h-8 bg-purple-500/30 rounded-full flex items-center justify-center mr-2 text-sm'>
                2
              </span>
              How it works
            </h3>
            <ul className='space-y-2 text-white/70 text-sm'>
              <li className='flex items-start'>
                <span className='text-purple-400 mr-2'>•</span>
                <span>Connect X to get your handle</span>
              </li>
              <li className='flex items-start'>
                <span className='text-purple-400 mr-2'>•</span>
                <span>Connect your wallet and fetch your Lens account</span>
              </li>
              <li className='flex items-start'>
                <span className='text-purple-400 mr-2'>•</span>
                <span>Send your X handle to selected Lens account</span>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div variants={itemVariants} className='flex flex-wrap justify-center items-center gap-4'>
        <XLoginButton />

        {isXAuthenticated && xHandle && <Button onClick={onComplete}>Continue</Button>}
      </motion.div>
    </motion.div>
  );
};

export default StepXLogin;
