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
import { StepXLogin, StepConnectWallet, StepSelectLensProfile, StepClaimHandle } from '@/components/dashboard/Steps';
import { containerVariants, cardVariants, confettiVariants, confettiTransition } from '@/lib/animations';

// Mock data for Lens accounts - Replace with actual API call when implemented
const mockLensAccounts = [
  { id: '0x01', handle: 'user1.lens', avatar: null, selected: false },
  { id: '0x02', handle: 'creator.lens', avatar: null, selected: false },
  { id: '0x03', handle: 'nftcollector.lens', avatar: null, selected: false },
];

// Step labels
const STEPS = ['X Login', 'Connect Wallet', 'Select Profile', 'Claim Handle'];

export default function DashboardPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { isXAuthenticated, xHandle, logoutFromX, isLoadingXAuth } = useXAuth();
  const accountsRef = useRef<HTMLDivElement>(null);

  // State to manage the user's Lens accounts
  const [lensAccounts, setLensAccounts] = useState<
    { id: string; handle: string; avatar: string | null; selected: boolean }[]
  >([]);
  const [selectedLensAccount, setSelectedLensAccount] = useState<string | null>(null);
  const [isLoadingLensAccounts, setIsLoadingLensAccounts] = useState(false);

  // Animation and UI states
  const [currentStep, setCurrentStep] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);

  // Redirect to main page if not X authenticated
  useEffect(() => {
    if (!isLoadingXAuth && !isXAuthenticated) {
      router.push('/');
    }
  }, [isXAuthenticated, isLoadingXAuth, router]);

  // Fetch Lens accounts when wallet is connected
  useEffect(() => {
    if (isConnected && address) {
      // Simulate API call to get Lens accounts
      setIsLoadingLensAccounts(true);

      // Replace with actual API call
      setTimeout(() => {
        setLensAccounts(mockLensAccounts);
        setIsLoadingLensAccounts(false);
      }, 1000);
    } else {
      // Reset accounts when wallet is disconnected
      setLensAccounts([]);
      setSelectedLensAccount(null);
      if (currentStep > 2) {
        setCurrentStep(2);
      }
    }
  }, [isConnected, address, currentStep]);

  // Advance to next step when lens account is selected
  useEffect(() => {
    if (selectedLensAccount) {
      setCurrentStep(4);
    }
  }, [selectedLensAccount]);

  // Auto-scroll to accounts section when on step 3
  useEffect(() => {
    if (currentStep === 3 && accountsRef.current && !isLoadingLensAccounts) {
      setTimeout(() => {
        accountsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, [currentStep, isLoadingLensAccounts]);

  const handleSelectLensAccount = (accountId: string) => {
    setLensAccounts((prevAccounts) =>
      prevAccounts.map((account) => ({
        ...account,
        selected: account.id === accountId,
      }))
    );
    setSelectedLensAccount(accountId);
  };

  const handleClaimHandle = () => {
    // This will be implemented to mint the handle and assign it to the selected Lens account
    console.log(`Claiming handle @${xHandle} for Lens account ${selectedLensAccount}`);
    // Show confetti effect when claiming
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
    // The actual implementation will call the smart contract to mint and assign in one transaction
  };

  // Loading or not authenticated state
  if (isLoadingXAuth || !isXAuthenticated) {
    return (
      <div className='min-h-screen bg-black flex items-center justify-center'>
        <Spinner size='large' color='purple' />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-black flex flex-col items-center pt-8 pb-20 relative overflow-hidden'>
      {/* Background */}
      <div className='absolute inset-0 z-0'>
        <Threads amplitude={1.2} distance={0.5} color={[0.6, 0.3, 0.9]} enableMouseInteraction={true} />
      </div>

      {/* Confetti effect when claiming is successful */}
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
        {/* Step Indicator */}
        <motion.div variants={cardVariants} className='mb-8'>
          <StepIndicator steps={STEPS} currentStep={currentStep} onStepClick={setCurrentStep} />
        </motion.div>

        {/* Main content area */}
        <div className='bg-black/20 backdrop-blur-md p-8 rounded-2xl border border-purple-500/20 shadow-lg shadow-purple-500/5'>
          <AnimatePresence mode='wait'>
            {currentStep === 1 && (
              <StepContent key='step-1' currentStep={currentStep} step={1}>
                <StepXLogin onComplete={() => setCurrentStep(2)} />
              </StepContent>
            )}

            {currentStep === 2 && (
              <StepContent key='step-2' currentStep={currentStep} step={2}>
                <StepConnectWallet xHandle={xHandle || ''} onComplete={() => setCurrentStep(3)} />
              </StepContent>
            )}

            {currentStep === 3 && (
              <StepContent key='step-3' currentStep={currentStep} step={3}>
                <div ref={accountsRef}>
                  <StepSelectLensProfile
                    xHandle={xHandle || ''}
                    lensAccounts={lensAccounts}
                    isLoadingLensAccounts={isLoadingLensAccounts}
                    selectedLensAccount={selectedLensAccount}
                    onSelectLensAccount={handleSelectLensAccount}
                  />
                </div>
              </StepContent>
            )}

            {currentStep === 4 && (
              <StepContent key='step-4' currentStep={currentStep} step={4}>
                <StepClaimHandle
                  xHandle={xHandle || ''}
                  selectedLensAccount={selectedLensAccount || ''}
                  lensAccounts={lensAccounts}
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
