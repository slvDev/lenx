import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ConnectWalletWrapper } from '@/components/auth/ConnectWalletWrapper';
import { useAccount } from 'wagmi';
import { containerVariants, itemVariants, cardVariants } from '@/lib/animations';
import { Account, evmAddress } from '@lens-protocol/client';
import { fetchAccountsAvailable } from '@lens-protocol/client/actions';
import { useLensProfile } from '@/contexts/LensProfileProvider';
import Spinner from '@/components/ui/Spinner';

interface StepConnectWalletProps {
  xHandle?: string;
  lensAccounts: Account[];
  selectedLensAccount: Account | null;
  setSelectedLensAccount: (account: Account | null) => void;
  setLensAccounts: (accounts: Account[]) => void;
  onComplete: () => void;
}

const StepConnectWallet = ({
  xHandle,
  lensAccounts,
  selectedLensAccount,
  setSelectedLensAccount,
  setLensAccounts,
  onComplete,
}: StepConnectWalletProps) => {
  const { publicClient } = useLensProfile();
  const { isConnected, address } = useAccount();
  const [isLoadingLensAccounts, setIsLoadingLensAccounts] = useState(false);

  const accountsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // when the component mounts selectedLensAccount should be null
    setSelectedLensAccount(null);

    const fetchLensAccounts = async () => {
      if (isConnected && address && xHandle) {
        try {
          const lensAccounts = await getLensAccountsFromAddress(address);
          setLensAccounts(lensAccounts);
        } catch (error) {
          setLensAccounts([]);
        } finally {
          setIsLoadingLensAccounts(false);
        }
      } else {
        setLensAccounts([]);
      }
    };

    fetchLensAccounts();
  }, [isConnected, xHandle, address, setLensAccounts, setSelectedLensAccount]);

  async function getLensAccountsFromAddress(walletAddress: string): Promise<Account[]> {
    const result = await fetchAccountsAvailable(publicClient, {
      managedBy: evmAddress(walletAddress),
    });

    if (result.isErr()) {
      return [];
    }

    const lensAccounts = result.value.items.map((item) => item.account);
    return lensAccounts;
  }

  return (
    <motion.div variants={containerVariants} initial='hidden' animate='visible' className='w-full max-w-3xl mx-auto'>
      <motion.div variants={itemVariants} className='mb-8 text-center'>
        <h2 className='text-3xl font-bold text-white bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent'>
          Connect Wallet & Select Lens Account
        </h2>
        {!isConnected && <p className='mt-2 text-white/70'>Connect your wallet where you have a Lens accounts.</p>}

        {isConnected && xHandle && (isLoadingLensAccounts || lensAccounts.length > 0) && (
          <p className='mt-2 text-white/70'>
            {`Select which Lens account you want to associate with your X handle @${xHandle}.`}
          </p>
        )}
      </motion.div>

      <motion.div variants={itemVariants} className='flex flex-col items-center justify-center gap-4 mb-12'>
        <ConnectWalletWrapper />
      </motion.div>

      {isConnected && xHandle && (
        <div ref={accountsRef} className='mt-8 space-y-8'>
          {isLoadingLensAccounts ? (
            <motion.div variants={itemVariants} className='flex flex-col items-center space-y-4 py-8'>
              <Spinner color='purple' size='large' />
              <p className='text-white/70'>Loading your Lens accounts...</p>
            </motion.div>
          ) : lensAccounts.length > 0 ? (
            <motion.div
              className='grid grid-cols-1 md:grid-cols-2 gap-4'
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 },
                },
              }}
              initial='hidden'
              animate='visible'
            >
              {lensAccounts.map((account) => (
                <motion.div
                  key={account.address}
                  onClick={() => {
                    setSelectedLensAccount(account);
                    onComplete();
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedLensAccount && account.address === selectedLensAccount.address
                      ? 'bg-purple-500/20 border-purple-500/50 shadow-lg shadow-purple-500/10'
                      : 'bg-black/30 border-white/10 hover:border-purple-500/30'
                  }`}
                  variants={cardVariants}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className='flex items-center space-x-4'>
                    {account.metadata?.picture ? (
                      <img
                        src={account.metadata?.picture}
                        alt={account.username?.value}
                        className='w-12 h-12 rounded-full'
                      />
                    ) : (
                      <div className='w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center'>
                        <span className='text-white text-lg font-bold'>
                          {account.username?.value.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className='flex-1 min-w-0'>
                      {' '}
                      {/* Added min-w-0 for better truncation */}
                      <p className='text-white font-medium truncate'>@{account.username?.value}</p>
                      <p className='text-white/50 text-sm truncate'>
                        {account.address.slice(0, 6)}...{account.address.slice(-4)}
                      </p>
                    </div>
                    {selectedLensAccount && account.address === selectedLensAccount.address && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className='bg-purple-500 text-white p-1 rounded-full flex-shrink-0' // Added flex-shrink-0
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
            <motion.div
              variants={itemVariants}
              className='bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 p-6 rounded-lg text-center my-8'
            >
              <p className='font-medium mb-2 text-lg'>No Lens Profiles Found</p>
              <p className='text-sm'>
                Your connected wallet does not own any Lens profiles. You might need to create one first or connect a
                different wallet.
              </p>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default StepConnectWallet;
