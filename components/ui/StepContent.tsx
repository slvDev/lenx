import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { stepContentVariants, stepContentTransition } from '@/lib/animations';

interface StepContentProps {
  children: ReactNode;
  className?: string;
}

const StepContent = ({ children, className = '' }: StepContentProps) => {
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
