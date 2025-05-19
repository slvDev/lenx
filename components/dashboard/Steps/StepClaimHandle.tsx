import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { containerVariants, itemVariants, cardVariants } from '@/lib/animations';
import { Account } from '@lens-protocol/client';
import { useLensProfile } from '@/contexts/LensProfileProvider';

interface StepClaimHandleProps {
  xHandle?: string;
  selectedLensAccount: Account | null;
  onClaimHandle: () => void;
  isProcessing?: boolean;
}

const StepClaimHandle = ({ xHandle, selectedLensAccount, onClaimHandle, isProcessing }: StepClaimHandleProps) => {
  const { isLensAuthenticated, loginWithLens, logoutLens, isLoadingLensAuth } = useLensProfile();

  return (
    <motion.div variants={containerVariants} initial='hidden' animate='visible' className='w-full max-w-3xl mx-auto'>
      <motion.div
        variants={itemVariants}
        className='bg-purple-900/20 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 mb-8 max-w-md mx-auto'
      >
        <div className='space-y-4'>
          <div>
            <p className='text-sm text-white/70 mb-1'>X Handle to Claim:</p>
            <div className='flex items-center p-3 bg-black/30 rounded-lg'>
              <div className='bg-black/70 p-2 rounded-full mr-3'>
                <svg className='w-5 h-5 text-white' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
                </svg>
              </div>
              <span className='text-white font-medium text-lg'>@lenx/{xHandle?.toLowerCase()}</span>
            </div>
          </div>

          <div className='flex items-center justify-center my-4'>
            <svg className='w-8 h-8 text-purple-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 14l-7 7m0 0l-7-7m7 7V3' />
            </svg>
          </div>

          <div>
            <p className='text-sm text-white/70 mb-1'>Target Lens Profile:</p>
            <div className='flex items-center p-3 bg-black/30 rounded-lg'>
              {selectedLensAccount?.metadata?.picture ? (
                <img
                  src={selectedLensAccount.metadata.picture}
                  alt={selectedLensAccount.username?.value}
                  className='w-10 h-10 rounded-full mr-3'
                />
              ) : (
                <div className='w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mr-3'>
                  <span className='text-white text-lg font-bold'>
                    {selectedLensAccount?.username?.value.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <p className='text-white font-medium text-lg'>@{selectedLensAccount?.username?.value}</p>
                <p className='text-white/50 text-xs truncate'>
                  {selectedLensAccount?.address.slice(0, 6)}...{selectedLensAccount?.address.slice(-4)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className='w-full max-w-md mx-auto text-center space-y-4'>
        <div className='flex flex-col sm:flex-row gap-4 w-full'>
          {/* Left Button Area */}
          <div className='w-full sm:w-1/2'>
            {!isLensAuthenticated ? (
              <Button
                onClick={() => loginWithLens(selectedLensAccount?.address)}
                className='w-full shadow-lg shadow-green-700/20 bg-green-500 hover:bg-green-600 text-white rounded-md py-2 px-4'
                disabled={isLoadingLensAuth}
              >
                {isLoadingLensAuth ? 'Connecting...' : 'Login with Lens'}
              </Button>
            ) : (
              <Button
                onClick={logoutLens}
                className='w-full shadow-lg shadow-green-700/20 bg-green-500 hover:bg-green-600 text-white rounded-md py-2 px-4'
                disabled={isLoadingLensAuth}
              >
                {isLoadingLensAuth ? 'Logging out...' : 'Logout from Lens'}
              </Button>
            )}
          </div>

          {/* Right Button: Claim Handle */}
          <Button
            onClick={onClaimHandle}
            className='w-full sm:w-1/2 shadow-lg shadow-purple-700/20 disabled:opacity-50 disabled:cursor-not-allowed'
            disabled={!isLensAuthenticated || isProcessing || isLoadingLensAuth || !selectedLensAccount}
          >
            {isProcessing ? 'Processing Linking...' : 'Link Handle'}
          </Button>
        </div>

        {isLensAuthenticated && selectedLensAccount && (
          <p className='text-white/70 text-sm pt-2'>Connected to Lens as @{selectedLensAccount?.username?.value}</p>
        )}

        <p className='text-white/50 text-xs pt-2'>
          {isLensAuthenticated
            ? 'Ensure the correct Lens profile is selected above before claiming.'
            : 'You need to login with your Lens account to enable claiming the handle.'}
        </p>
        <p className='text-white/50 text-xs mt-1'>
          Claiming links @lenx/{xHandle} to @{selectedLensAccount?.username?.value || 'your selected Lens profile'}.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default StepClaimHandle;
