'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useXAuth } from '@/contexts/XAuthProvider';
import Threads from '@/components/ui/backgroundThreads';
import Spinner from '@/components/ui/Spinner';
import StepIndicator from '@/components/ui/StepIndicator';
import StepContent from '@/components/ui/StepContent';
import { StepXLogin, StepConnectWallet, StepClaimHandle } from '@/components/dashboard/Steps';
import { containerVariants, cardVariants, confettiVariants, confettiTransition } from '@/lib/animations';
import { Account, evmAddress } from '@lens-protocol/client';
import { canCreateUsername, createUsername } from '@lens-protocol/client/actions';
import { useLensProfile } from '@/contexts/LensProfileProvider';
import { handleOperationWith } from '@lens-protocol/client/viem';
import { useWalletClient } from 'wagmi';
import { LENX_NAMESPACE_ADDRESS } from '@/lib/constants';
import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/solid';
import Socials from '@/components/dashboard/Socials';

const STEPS = ['X Login', 'Connect Wallet', 'Claim Handle'];

const roadmapItems = [
  {
    text: "Login with X and link '@x/username' to a Lens Account.",
    implemented: true,
  },
  {
    text: 'Creation of Lens Profile if User does not have one.',
    implemented: false,
  },
  {
    text: "Sync user's X posts with their Lens Account feed.",
    implemented: false,
  },
  {
    text: 'Discover which of your X friends are on Lens.',
    implemented: false,
  },
];

const ClaimingHandlePopup = () => (
  <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
    <motion.div
      variants={cardVariants}
      initial='hidden'
      animate='visible'
      exit='exit'
      className='bg-purple-900/30 border border-purple-500/50 p-8 rounded-xl shadow-xl text-center'
    >
      <h3 className='text-xl font-semibold text-white mb-4'>Processing Your Claim</h3>
      <p className='text-white/70 mb-6'>Waiting for transaction confirmation...</p>
    </motion.div>
  </div>
);

export default function DashboardPage() {
  const router = useRouter();
  const { isXAuthenticated, xHandle, isLoadingXAuth } = useXAuth();
  const { sessionClient } = useLensProfile();
  const { data: walletClient } = useWalletClient();

  const [lensAccounts, setLensAccounts] = useState<Account[]>([]);
  const [selectedLensAccount, setSelectedLensAccount] = useState<Account | null>(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isClaimingHandle, setIsClaimingHandle] = useState(false);

  useEffect(() => {
    if (!isLoadingXAuth && !isXAuthenticated) {
      router.push('/');
    }
  }, [isXAuthenticated, isLoadingXAuth, router]);

  const handleClaimHandle = async () => {
    if (!xHandle || !sessionClient || !walletClient) {
      return;
    }

    setIsClaimingHandle(true);
    const canCreateResult = await canCreateUsername(sessionClient, {
      localName: `${xHandle.toLowerCase()}`,
      namespace: evmAddress(LENX_NAMESPACE_ADDRESS),
    });

    if (canCreateResult.isErr()) {
      alert(`Error claiming handle: ${canCreateResult.error.message}`);
      setIsClaimingHandle(false);
      return;
    }

    switch (canCreateResult.value.__typename) {
      case 'NamespaceOperationValidationPassed':
        break;

      case 'NamespaceOperationValidationFailed':
        alert(`Cannot create handle: ${canCreateResult.value.reason}`);
        setIsClaimingHandle(false);
        return;

      case 'NamespaceOperationValidationUnknown':
        alert('Validation outcome is unknown');
        setIsClaimingHandle(false);
        return;

      case 'UsernameTaken':
        alert(`Username ${xHandle.toLowerCase()} is already taken`);
        setIsClaimingHandle(false);
        return;
    }

    const result = await createUsername(sessionClient, {
      username: {
        localName: `${xHandle.toLowerCase()}`,
        namespace: evmAddress(LENX_NAMESPACE_ADDRESS),
      },
      autoAssign: true,
    })
      // @ts-ignore
      .andThen(handleOperationWith(walletClient))
      // @ts-ignore
      .andThen(sessionClient.waitForTransaction);

    if (result.isErr()) {
      alert(`Error claiming handle`);
      setIsClaimingHandle(false);
      return;
    }

    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
    setIsClaimingHandle(false);
    window.location.reload();
  };

  if (isLoadingXAuth || !isXAuthenticated) {
    return (
      <div className='min-h-screen bg-black flex items-center justify-center'>
        <Spinner size='large' color='purple' />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-black flex flex-col items-center pt-8 pb-20 relative overflow-hidden'>
      <div className='fixed top-3 right-3 z-50'>
        <Socials />
      </div>

      <div className='absolute inset-0 z-0'>
        <Threads amplitude={1.2} distance={0} color={[0.6, 0.3, 0.9]} enableMouseInteraction={true} />
      </div>

      <AnimatePresence>
        {showConfetti && (
          <div className='fixed inset-0 z-[60] pointer-events-none'>
            {' '}
            <div className='absolute inset-0 flex items-center justify-center'>
              <motion.div
                variants={confettiVariants}
                initial='hidden'
                animate='visible'
                exit='exit'
                transition={confettiTransition}
                className='text-8xl'
              >
                🎉
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>{isClaimingHandle && <ClaimingHandlePopup />}</AnimatePresence>

      <motion.div
        className='w-full max-w-5xl z-10 px-4'
        initial='hidden'
        animate='visible'
        exit='exit'
        variants={containerVariants}
      >
        <motion.div variants={cardVariants} className='mb-8'>
          <StepIndicator steps={STEPS} currentStep={currentStep} onStepClick={setCurrentStep} />
        </motion.div>

        <div className='bg-black/20 backdrop-blur-md p-8 rounded-2xl border border-purple-500/20 shadow-lg shadow-purple-500/5'>
          <AnimatePresence mode='wait'>
            {currentStep === 1 && (
              <StepContent key='step-1'>
                <StepXLogin onComplete={() => setCurrentStep(2)} />
              </StepContent>
            )}

            {currentStep === 2 && (
              <StepContent key='step-2'>
                <StepConnectWallet
                  xHandle={xHandle || ''}
                  selectedLensAccount={selectedLensAccount}
                  setSelectedLensAccount={setSelectedLensAccount}
                  lensAccounts={lensAccounts}
                  setLensAccounts={setLensAccounts}
                  onComplete={() => setCurrentStep(3)}
                />
              </StepContent>
            )}

            {currentStep === 3 && (
              <StepContent key='step-3'>
                <StepClaimHandle
                  xHandle={xHandle || ''}
                  selectedLensAccount={selectedLensAccount}
                  onClaimHandle={handleClaimHandle}
                  isProcessing={isClaimingHandle}
                />
              </StepContent>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {currentStep == 1 && (
        <motion.div
          className='w-full max-w-5xl z-10 px-4 mt-12'
          initial='hidden'
          animate='visible'
          variants={containerVariants}
        >
          <motion.div
            variants={cardVariants}
            className='bg-black/20 backdrop-blur-md p-8 rounded-2xl border border-purple-500/20 shadow-lg shadow-purple-500/5'
          >
            <h2 className='text-2xl font-bold text-white mb-6 text-center bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent'>
              Roadmap
            </h2>
            <ul className='space-y-4'>
              {roadmapItems.map((item, index) => (
                <li
                  key={index}
                  className='flex items-center p-4 bg-purple-500/10 rounded-lg border border-purple-500/30'
                >
                  <div className='flex-shrink-0 mr-3'>
                    {item.implemented ? (
                      <CheckCircleIcon className='w-6 h-6 text-green-400' />
                    ) : (
                      <ClockIcon className='w-6 h-6 text-gray-500' />
                    )}
                  </div>
                  <span className={`text-sm ${item.implemented ? 'text-white' : 'text-white/70'}`}>{item.text}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
