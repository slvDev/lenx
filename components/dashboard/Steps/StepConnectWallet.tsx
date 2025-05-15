import React from 'react';
import { motion } from 'framer-motion';
import { ConnectWalletWrapper } from '@/components/auth/ConnectWalletWrapper';
import { useAccount } from 'wagmi';
import { itemVariants } from '@/lib/animations';

interface StepConnectWalletProps {
  onComplete?: () => void;
  xHandle?: string;
}

const StepConnectWallet: React.FC<StepConnectWalletProps> = ({ onComplete, xHandle }) => {
  const { isConnected } = useAccount();

  // Notify parent when wallet is connected
  React.useEffect(() => {
    if (isConnected && onComplete) {
      onComplete();
    }
  }, [isConnected, onComplete]);

  return (
    <div className='flex flex-col items-center text-center'>
      <div className='mb-4 text-center w-full'>
        <h1 className='text-2xl md:text-3xl font-bold text-white mb-2'>LenX Dashboard</h1>
        <p className='text-white/70'>
          Link your X handle <span className='text-purple-400 font-semibold'>@{xHandle}</span> to your Lens profile
        </p>
      </div>

      <motion.div
        variants={itemVariants}
        initial='hidden'
        animate='visible'
        className='w-20 h-20 bg-purple-500/30 rounded-full flex items-center justify-center mb-6'
      >
        <svg className='w-10 h-10 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
          />
        </svg>
      </motion.div>

      <motion.h2 variants={itemVariants} className='text-2xl font-bold text-white mb-4'>
        Connect Your Wallet
      </motion.h2>

      <motion.p variants={itemVariants} className='text-white/70 mb-8 max-w-md'>
        Connect your wallet to view your Lens profiles and claim your X handle.
      </motion.p>

      <motion.div variants={itemVariants} className='w-full max-w-md flex justify-center'>
        <ConnectWalletWrapper className='w-full' />
      </motion.div>
    </div>
  );
};

export default StepConnectWallet;
