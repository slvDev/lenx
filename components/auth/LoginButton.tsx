'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export type LoginButtonVariant = 'primary' | 'secondary' | 'purple';
export type LoginButtonSize = 'sm' | 'md' | 'lg';

interface LoginButtonProps {
  variant?: LoginButtonVariant;
  size?: LoginButtonSize;
  className?: string;
  icon?: React.ReactNode;
  isLoading?: boolean;
  isAuthenticated?: boolean;
  authenticatedLabel?: string;
  defaultLabel: string;
  onClick: () => void;
}

export function LoginButton({
  variant = 'primary',
  size = 'md',
  className = '',
  icon,
  isLoading = false,
  isAuthenticated = false,
  authenticatedLabel,
  defaultLabel,
  onClick,
}: LoginButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Size classes
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  // Variant classes
  const variantClasses = {
    primary: 'bg-black text-white hover:bg-gray-800 focus:ring-black',
    secondary: 'bg-white text-black border border-gray-200 hover:bg-gray-50 focus:ring-gray-200',
    purple:
      'bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-500/30 border-none focus:ring-purple-500',
  };

  // Base classes
  const baseClasses =
    'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  // Animation variants
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
    loading: { opacity: 0.8 },
  };

  return (
    <motion.button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      variants={buttonVariants}
      initial='initial'
      animate={isLoading ? 'loading' : isHovered ? 'hover' : 'initial'}
      whileTap='tap'
      disabled={isLoading}
    >
      <div className='flex items-center gap-2'>
        {/* Icon */}
        {icon && <div className='flex-shrink-0 w-4 h-4'>{icon}</div>}

        {/* Button Text */}
        <span className='whitespace-nowrap'>
          {isLoading ? 'Connecting...' : isAuthenticated ? authenticatedLabel : defaultLabel}
        </span>

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
