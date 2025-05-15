'use client';

import { useXAuth } from '@/contexts/XAuthProvider';
import { LoginButton, LoginButtonVariant } from './LoginButton';

interface XLoginButtonProps {
  className?: string;
  variant?: LoginButtonVariant;
}

export function XLoginButton({ className = '', variant = 'primary' }: XLoginButtonProps) {
  const { loginWithX, logoutFromX, isXAuthenticated, xHandle, isLoadingXAuth } = useXAuth();

  const handleClick = async () => {
    if (isXAuthenticated) {
      await logoutFromX();
    } else {
      await loginWithX();
    }
  };

  // X Logo Icon
  const XIcon = (
    <svg viewBox='0 0 24 24' fill='currentColor' className='w-full h-full'>
      <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
    </svg>
  );

  return (
    <LoginButton
      className={className}
      variant={variant}
      icon={XIcon}
      isLoading={isLoadingXAuth}
      isAuthenticated={isXAuthenticated}
      authenticatedLabel={xHandle ? `@${xHandle}` : undefined}
      defaultLabel='Login with X'
      onClick={handleClick}
    />
  );
}
