import React from 'react';

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
}

const Spinner = ({ size = 'medium', color = 'purple', className = '' }: SpinnerProps) => {
  const sizeMap = {
    small: 'w-6 h-6 border-2',
    medium: 'w-10 h-10 border-4',
    large: 'w-20 h-20 border-t-4',
  };

  const colorMap = {
    purple: 'border-purple-500/30 border-t-purple-500',
    white: 'border-white/30 border-t-white',
    black: 'border-black/30 border-t-black',
  };

  const sizeClass = sizeMap[size];
  const colorClass = colorMap[color as keyof typeof colorMap] || 'border-purple-500/30 border-t-purple-500';

  return <div className={`${sizeClass} ${colorClass} rounded-full animate-spin ${className}`} aria-label='Loading' />;
};

export default Spinner;
