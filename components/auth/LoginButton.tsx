'use client';

import { ReactNode } from 'react';
import { Button, ButtonSize, ButtonVariant } from '@/components/ui/Button';

export type LoginButtonVariant = ButtonVariant;
export type LoginButtonSize = ButtonSize;

interface LoginButtonProps {
  variant?: LoginButtonVariant;
  size?: LoginButtonSize;
  className?: string;
  icon?: ReactNode;
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
  const buttonLabel = isLoading ? 'Connecting...' : isAuthenticated ? authenticatedLabel : defaultLabel;

  return (
    <Button variant={variant} size={size} className={className} icon={icon} isLoading={isLoading} onClick={onClick}>
      {buttonLabel}
    </Button>
  );
}
