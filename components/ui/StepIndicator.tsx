import { motion } from 'framer-motion';
import { stepIndicatorVariants } from '@/lib/animations';

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
  onStepClick: (step: number) => void;
  className?: string;
}

const StepIndicator = ({ steps, currentStep, onStepClick, className = '' }: StepIndicatorProps) => {
  const handleStepClick = (step: number) => {
    if (step < currentStep) {
      onStepClick(step);
    }
  };

  return (
    <div className={`flex justify-center ${className}`}>
      <div className='px-6 py-3 bg-black/30 backdrop-blur-md rounded-full border border-purple-500/20'>
        <div className='flex items-center'>
          {steps.map((_, index) => {
            const step = index + 1;
            const isLastStep = index === steps.length - 1;

            return (
              <div key={step} className='flex items-center'>
                <motion.div
                  variants={stepIndicatorVariants}
                  initial='inactive'
                  animate={currentStep > step ? 'complete' : currentStep === step ? 'active' : 'inactive'}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                    currentStep > step ? 'hover:scale-110 transition-transform cursor-pointer' : ''
                  }`}
                  onClick={() => handleStepClick(step)}
                  role={currentStep > step ? 'button' : undefined}
                  tabIndex={currentStep > step ? 0 : undefined}
                  aria-label={currentStep > step ? `Go back to step ${step}` : undefined}
                >
                  {currentStep > step ? (
                    <svg
                      className='w-5 h-5'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                    </svg>
                  ) : (
                    step
                  )}
                </motion.div>

                {!isLastStep && (
                  <div
                    className={`w-12 h-0.5 mx-1 ${
                      currentStep > step + 1
                        ? 'bg-gradient-to-r from-green-500 to-green-600'
                        : currentStep === step + 1
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600'
                        : 'bg-white/20'
                    }`}
                  ></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;
