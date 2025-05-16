'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { useXAuth } from '@/contexts/XAuthProvider';
import Threads from '@/components/ui/backgroundThreads';
import Spinner from '@/components/ui/Spinner';
import StepIndicator from '@/components/ui/StepIndicator';
import StepContent from '@/components/ui/StepContent';
import { StepXLogin, StepConnectWallet, StepClaimHandle } from '@/components/dashboard/Steps';
import { containerVariants, cardVariants, confettiVariants, confettiTransition } from '@/lib/animations';
import { Account } from '@lens-protocol/client';

const STEPS = ['X Login', 'Connect Wallet', 'Claim Handle'];

export default function DashboardPage() {
  const router = useRouter();
  const { isXAuthenticated, xHandle, isLoadingXAuth } = useXAuth();

  const [lensAccounts, setLensAccounts] = useState<Account[]>([]);
  const [selectedLensAccount, setSelectedLensAccount] = useState<Account | null>(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!isLoadingXAuth && !isXAuthenticated) {
      router.push('/');
    }
  }, [isXAuthenticated, isLoadingXAuth, router]);

  const handleClaimHandle = () => {
    console.log(`Claiming handle @${xHandle} for Lens account ${selectedLensAccount}`);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
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
      <div className='absolute inset-0 z-0'>
        <Threads amplitude={1.2} distance={0.5} color={[0.6, 0.3, 0.9]} enableMouseInteraction={true} />
      </div>

      {/* Confetti effect hen claiming is successful */}
      {showConfetti && (
        <div className='fixed inset-0 z-50 pointer-events-none'>
          <div className='absolute inset-0 flex items-center justify-center'>
            <motion.div
              variants={confettiVariants}
              initial='hidden'
              animate='visible'
              transition={confettiTransition}
              className='text-8xl'
            >
              🎉
            </motion.div>
          </div>
        </div>
      )}

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
              <StepContent key='step-1' currentStep={currentStep} step={1}>
                <StepXLogin onComplete={() => setCurrentStep(2)} />
              </StepContent>
            )}

            {currentStep === 2 && (
              <StepContent key='step-2' currentStep={currentStep} step={2}>
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
              <StepContent key='step-3' currentStep={currentStep} step={4}>
                <StepClaimHandle
                  xHandle={xHandle || ''}
                  selectedLensAccount={selectedLensAccount}
                  onClaimHandle={handleClaimHandle}
                />
              </StepContent>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
