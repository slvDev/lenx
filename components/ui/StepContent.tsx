import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { stepContentVariants, stepContentTransition } from '@/lib/animations';

interface StepContentProps {
  children: ReactNode;
  currentStep: number;
  step: number;
  className?: string;
}

const StepContent: React.FC<StepContentProps> = ({ children, currentStep, step, className = '' }) => {
  if (currentStep !== step) return null;

  return (
    <motion.div
      initial='initial'
      animate='animate'
      exit='exit'
      variants={stepContentVariants}
      transition={stepContentTransition}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default StepContent;
