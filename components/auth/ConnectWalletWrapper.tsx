'use client';

import { ConnectKitButton, useModal } from 'connectkit';
import { LoginButton } from './LoginButton';
import { useAccount } from 'wagmi';

interface ConnectWalletWrapperProps {
  className?: string;
  variant?: 'primary' | 'secondary';
}

export function ConnectWalletWrapper({ className = '', variant = 'primary' }: ConnectWalletWrapperProps) {
  const { isConnected, address } = useAccount();
  const { setOpen } = useModal();

  // Wallet Icon
  const WalletIcon = (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' className='w-full h-full'>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
      />
    </svg>
  );

  return (
    <ConnectKitButton.Custom>
      {({ isConnecting, show, address: kitAddress, truncatedAddress }) => {
        return (
          <LoginButton
            className={className}
            variant={variant}
            icon={WalletIcon}
            isLoading={isConnecting}
            isAuthenticated={isConnected}
            authenticatedLabel={truncatedAddress}
            defaultLabel='Connect Wallet'
            onClick={() => setOpen(true)}
          />
        );
      }}
    </ConnectKitButton.Custom>
  );
}
