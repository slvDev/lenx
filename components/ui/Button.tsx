'use client';

import { motion } from 'framer-motion';
import { ReactNode, useState } from 'react';
import { buttonVariants as sharedButtonVariants } from '@/lib/animations';

export type ButtonVariant = 'primary' | 'secondary' | 'warning';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  icon?: ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  icon,
  isLoading = false,
  disabled = false,
  onClick,
  children,
}: ButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variantClasses = {
    primary:
      'bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-500/30 border-none focus:ring-purple-500',
    secondary:
      'bg-transparent text-purple-400 border border-purple-500/50 hover:bg-purple-500/10 focus:ring-purple-500/30',
    warning:
      'bg-amber-600 text-white hover:bg-amber-700 shadow-lg shadow-amber-500/30 border-none focus:ring-amber-500',
  };

  const baseClasses =
    'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  // Extend the shared buttonVariants with disabled state
  const extendedButtonVariants = {
    ...sharedButtonVariants,
    disabled: { opacity: 0.6, cursor: 'not-allowed' },
    loading: { opacity: 0.8 },
  };

  return (
    <motion.button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className} ${
        disabled ? 'opacity-60 cursor-not-allowed' : ''
      }`}
      onClick={onClick}
      onHoverStart={() => !disabled && setIsHovered(true)}
      onHoverEnd={() => !disabled && setIsHovered(false)}
      variants={extendedButtonVariants}
      initial='hidden'
      animate={disabled ? 'disabled' : isLoading ? 'loading' : isHovered ? 'hover' : 'visible'}
      whileTap={!disabled && !isLoading ? 'tap' : undefined}
      disabled={disabled || isLoading}
    >
      <div className='flex items-center gap-2'>
        {/* Icon */}
        {icon && <div className='flex-shrink-0 w-4 h-4'>{icon}</div>}

        {/* Button Text */}
        <span className='whitespace-nowrap'>{children}</span>

        {/* Loading State */}
        {isLoading && (
          <motion.div
            className='absolute inset-0 flex items-center justify-center bg-inherit rounded-lg'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className='w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin' />
          </motion.div>
        )}
      </div>
    </motion.button>
  );
}
