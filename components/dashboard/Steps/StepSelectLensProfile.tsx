import React from 'react';
import { motion } from 'framer-motion';
import { cardVariants, iconAnimation, iconTransition } from '@/lib/animations';
import Spinner from '@/components/ui/Spinner';

interface LensAccount {
  id: string;
  handle: string;
  avatar: string | null;
  selected: boolean;
}

interface StepSelectLensProfileProps {
  xHandle?: string;
  lensAccounts: LensAccount[];
  isLoadingLensAccounts: boolean;
  selectedLensAccount: string | null;
  onSelectLensAccount: (accountId: string) => void;
  onComplete?: () => void;
}

const StepSelectLensProfile: React.FC<StepSelectLensProfileProps> = ({
  xHandle,
  lensAccounts,
  isLoadingLensAccounts,
  selectedLensAccount,
  onSelectLensAccount,
  onComplete,
}) => {
  const accountsRef = React.useRef<HTMLDivElement>(null);

  // Notify parent when an account is selected
  React.useEffect(() => {
    if (selectedLensAccount && onComplete) {
      onComplete();
    }
  }, [selectedLensAccount, onComplete]);

  // Auto-scroll to accounts section
  React.useEffect(() => {
    if (accountsRef.current && !isLoadingLensAccounts) {
      setTimeout(() => {
        accountsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, [isLoadingLensAccounts]);

  return (
    <div className='space-y-8'>
      <div className='text-center w-full mb-2'>
        <h1 className='text-2xl md:text-3xl font-bold text-white mb-2'>LenX Dashboard</h1>
        <p className='text-white/70 mb-4'>
          Link your X handle <span className='text-purple-400 font-semibold'>@{xHandle}</span> to your Lens profile
        </p>

        <motion.div
          initial={{ scale: 0 }}
          animate={iconAnimation}
          transition={iconTransition}
          className='w-20 h-20 bg-purple-500/30 rounded-full flex items-center justify-center mb-6 mx-auto'
        >
          <svg className='w-10 h-10 text-white' fill='currentColor' viewBox='0 0 24 24'>
            <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z' />
          </svg>
        </motion.div>
        <motion.h2
          className='text-2xl font-bold text-white mb-4'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Select a Lens Profile
        </motion.h2>
        <motion.p
          className='text-white/70 mb-8 max-w-md mx-auto'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Choose which Lens profile you want to claim your X handle for
        </motion.p>
      </div>

      <div ref={accountsRef}>
        {isLoadingLensAccounts ? (
          <div className='flex flex-col items-center space-y-4'>
            <Spinner color='purple' />
            <p className='text-white/70'>Loading your Lens profiles...</p>
          </div>
        ) : lensAccounts.length > 0 ? (
          <motion.div
            className='grid grid-cols-1 md:grid-cols-2 gap-4'
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            initial='hidden'
            animate='visible'
          >
            {lensAccounts.map((account) => (
              <motion.div
                key={account.id}
                onClick={() => onSelectLensAccount(account.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  account.selected
                    ? 'bg-purple-500/20 border-purple-500/50 shadow-lg shadow-purple-500/10'
                    : 'bg-black/30 border-white/10 hover:border-purple-500/30'
                }`}
                variants={cardVariants}
                whileHover='hover'
                whileTap={{ scale: 0.98 }}
              >
                <div className='flex items-center space-x-4'>
                  {account.avatar ? (
                    <img src={account.avatar} alt={account.handle} className='w-12 h-12 rounded-full' />
                  ) : (
                    <div className='w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center'>
                      <span className='text-white text-lg font-bold'>{account.handle.charAt(0).toUpperCase()}</span>
                    </div>
                  )}
                  <div className='flex-1'>
                    <p className='text-white font-medium'>{account.handle}</p>
                    <p className='text-white/50 text-sm truncate'>{account.id}</p>
                  </div>
                  {account.selected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className='bg-purple-500 text-white p-1 rounded-full'
                    >
                      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                      </svg>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className='bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 p-4 rounded-lg text-center'>
            <p className='font-medium mb-2'>No Lens Profiles Found</p>
            <p className='text-sm'>You need to have a Lens profile to claim a handle.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StepSelectLensProfile;
