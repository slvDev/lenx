import { CheckCircleIcon, WalletIcon } from '@heroicons/react/24/outline';
import { FaXTwitter } from 'react-icons/fa6';

type IconName = 'check' | 'wallet' | 'x';

interface IconProps {
  name: IconName;
  className?: string;
}

export function Icon({ name, className = '' }: IconProps) {
  switch (name) {
    case 'check':
      return <CheckCircleIcon className={`h-5 w-5 ${className}`} />;
    case 'wallet':
      return <WalletIcon className={`h-6 w-6 ${className}`} />;
    case 'x':
      return <FaXTwitter className={`h-6 w-6 ${className}`} />;
    default:
      return null;
  }
}
