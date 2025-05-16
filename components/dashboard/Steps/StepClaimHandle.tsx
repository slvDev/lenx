import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { itemVariants, iconAnimation, iconTransition } from '@/lib/animations';
import { Account } from '@lens-protocol/client';

interface StepClaimHandleProps {
  xHandle?: string;
  selectedLensAccount: Account | null;
  onClaimHandle: () => void;
}

const StepClaimHandle = ({ xHandle, selectedLensAccount, onClaimHandle }: StepClaimHandleProps) => {
  return (
    <div className='flex flex-col items-center text-center'>
      <div className='mb-4 text-center w-full'>
        <h1 className='text-2xl md:text-3xl font-bold text-white mb-2'>LenX Dashboard</h1>
        <p className='text-white/70'>
          Link your X handle <span className='text-purple-400 font-semibold'>@{xHandle}</span> to your Lens profile
        </p>
      </div>

      <motion.div
        initial={{ scale: 0 }}
        animate={iconAnimation}
        transition={iconTransition}
        className='w-20 h-20 bg-purple-500/30 rounded-full flex items-center justify-center mb-6'
      >
        <svg className='w-10 h-10 text-white' fill='currentColor' viewBox='0 0 24 24'>
          <path d='M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' />
        </svg>
      </motion.div>

      <motion.h2
        variants={itemVariants}
        initial='hidden'
        animate='visible'
        className='text-2xl font-bold text-white mb-4'
      >
        Ready to Claim Your Handle
      </motion.h2>

      <motion.div
        variants={itemVariants}
        initial='hidden'
        animate='visible'
        className='bg-purple-500/10 border border-purple-500/30 rounded-xl p-6 mb-8 max-w-md'
      >
        <p className='text-white mb-4'>You're about to claim:</p>
        <div className='flex items-center justify-between mb-4 p-3 bg-black/30 rounded-lg'>
          <div className='flex items-center'>
            <div className='bg-black/70 p-2 rounded-full mr-3'>
              <svg className='w-4 h-4 text-white' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
              </svg>
            </div>
            <span className='text-white font-medium'>@{xHandle}</span>
          </div>
          <svg className='w-6 h-6 text-purple-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
          </svg>
        </div>
        <div className='p-3 bg-black/30 rounded-lg'>
          <div className='flex items-center'>
            <div className='bg-black/70 p-2 rounded-full mr-3'>
              <svg className='w-4 h-4 text-white' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z' />
              </svg>
            </div>
            <span className='text-white font-medium'>{selectedLensAccount?.username?.value}</span>
          </div>
        </div>
      </motion.div>

      <div className='w-full max-w-md'>
        <Button onClick={onClaimHandle} className='w-full shadow-lg shadow-purple-700/20'>
          Claim Handle
        </Button>
        <p className='text-white/50 text-xs mt-3'>
          This will mint the handle and assign it to your profile in one transaction
        </p>
      </div>
    </div>
  );
};

export default StepClaimHandle;
