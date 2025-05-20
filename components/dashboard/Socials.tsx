import React from 'react';
import { Button } from '@/components/ui/Button';
import { FaGithub, FaLeaf } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const Socials = () => {
  const githubUrl = 'https://github.com/slvDev/lenx';
  const xProfileUrl = 'https://x.com/slvDev';
  const lensProfileUrl = 'https://hey.xyz/u/slvdev';

  return (
    <div className='px-4 py-2 bg-black/30 backdrop-blur-md rounded-full border border-purple-500/20 flex items-center'>
      <div className='flex flex-row items-center justify-center space-x-2'>
        <Button
          variant='secondary'
          size='sm'
          onClick={() => window.open(githubUrl, '_blank')}
          className='flex items-center justify-center !p-2 !border-gray-600 hover:!bg-gray-700/30 hover:!border-gray-500 !rounded-full'
          aria-label='GitHub'
        >
          <FaGithub className='w-5 h-5 text-gray-300' />
        </Button>
        <Button
          variant='secondary'
          size='sm'
          onClick={() => window.open(xProfileUrl, '_blank')}
          className='flex items-center justify-center !p-2 !border-gray-600 hover:!bg-gray-700/30 hover:!border-gray-500 !rounded-full'
          aria-label='X Profile'
        >
          <FaXTwitter className='w-5 h-5 text-gray-300' />
        </Button>
        <Button
          variant='secondary'
          size='sm'
          onClick={() => window.open(lensProfileUrl, '_blank')}
          className='flex items-center justify-center !p-2 !border-gray-400 hover:!bg-gray-700/30 hover:!border-gray-500 !rounded-full'
          aria-label='hey.xyz'
        >
          <svg width='20' height='20' viewBox='0 2.5 31 15' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <rect mask='url(#lens-logo-mask)' width='80' height='20' fill='lightgray'></rect>
            <defs>
              <mask id='lens-logo-mask'>
                <g fill='white'>
                  <path
                    fill-rule='evenodd'
                    clip-rule='evenodd'
                    d='M21.1625 5.66312C22.1496 4.74966 23.4447 4.18348 24.8881 4.18298C28.0955 4.18405 30.6939 6.78463 30.6939 9.9942C30.6939 12.7709 27.9461 15.1454 27.2592 15.6922C24.0469 18.2502 19.8628 19.746 15.3469 19.746C10.8311 19.746 6.64696 18.2502 3.43472 15.6922C2.75168 15.1454 0 12.767 0 9.9942C0 6.78397 2.59946 4.18298 5.80389 4.18298C7.24803 4.18298 8.54386 4.74926 9.53134 5.66312L9.63282 5.61235C9.8592 2.61691 12.2947 0.25415 15.3469 0.25415C18.3992 0.25415 20.8347 2.61691 21.0611 5.61235L21.1625 5.66312ZM22.3218 11.4404C22.7628 11.8817 23.079 12.4128 23.2546 12.9947H23.2585C23.3405 13.2603 23.157 13.5376 22.8838 13.5844C22.6535 13.6235 22.4311 13.479 22.3608 13.2525C22.2281 12.8229 21.9939 12.4284 21.666 12.1004C21.1352 11.5693 20.4288 11.2763 19.6755 11.2763C19.6462 11.2763 19.6179 11.2783 19.5896 11.2803C19.5613 11.2822 19.533 11.2842 19.5037 11.2842C19.9253 11.4794 20.2219 11.9051 20.2219 12.4011C20.2219 13.0845 19.6716 13.6352 18.9885 13.6352C18.3055 13.6352 17.7552 13.0806 17.7552 12.4011C17.7552 12.2449 17.7864 12.0926 17.841 11.9559C17.7864 12.0028 17.7317 12.0496 17.681 12.1004C17.3531 12.4284 17.119 12.8229 16.9862 13.2525C16.9199 13.479 16.6974 13.6235 16.4632 13.5844C16.19 13.5376 16.0066 13.2603 16.0885 12.9947C16.2642 12.4128 16.5803 11.8817 17.0214 11.4404C17.7278 10.7335 18.6724 10.343 19.6716 10.343C20.6708 10.343 21.6153 10.7335 22.3218 11.4404ZM10.9405 11.2803L10.9405 11.2803L10.9405 11.2803C10.9688 11.2784 10.9971 11.2764 11.0264 11.2764C11.7797 11.2764 12.4861 11.5693 13.0169 12.1005C13.3448 12.4285 13.579 12.823 13.7117 13.2526C13.7819 13.4791 14.0044 13.6236 14.2347 13.5845C14.5079 13.5377 14.6914 13.2604 14.6094 12.9948C14.4338 12.4129 14.1176 11.8818 13.6766 11.4405C12.9701 10.7336 12.0256 10.3431 11.0264 10.3431C10.0272 10.3431 9.08263 10.7336 8.37617 11.4405C7.93512 11.8818 7.61897 12.4129 7.44333 12.9948C7.36136 13.2604 7.54481 13.5377 7.81803 13.5845C8.05221 13.6236 8.27469 13.4791 8.34104 13.2526C8.47374 12.823 8.70793 12.4285 9.03579 12.1005C9.08653 12.0497 9.14117 12.0028 9.19582 11.956C9.14117 12.0927 9.10995 12.245 9.10995 12.4012C9.10995 13.0807 9.66028 13.6353 10.3433 13.6353C11.0264 13.6353 11.5767 13.0846 11.5767 12.4012C11.5767 11.9052 11.2801 11.4795 10.8585 11.2843H10.8546C10.8839 11.2843 10.9122 11.2823 10.9405 11.2803ZM15.3512 15.7909C16.0694 15.7909 16.7251 15.5176 17.2247 15.0723C17.4082 14.9122 17.6775 14.9044 17.857 15.0645C18.06 15.2442 18.0717 15.5683 17.8687 15.7519C17.2052 16.3572 16.3192 16.7282 15.3512 16.7282C14.3833 16.7282 13.5012 16.3572 12.8337 15.7519C12.6308 15.5683 12.6425 15.2481 12.8454 15.0645C13.0289 14.9005 13.2982 14.9122 13.4777 15.0723C13.9734 15.5176 14.6331 15.7909 15.3512 15.7909Z'
                  ></path>
                </g>
              </mask>
            </defs>
          </svg>
        </Button>
      </div>
    </div>
  );
};

export default Socials;
