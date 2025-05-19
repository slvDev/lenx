import React from 'react';
import { Button } from '@/components/ui/Button';
import { FaGithub, FaLeaf } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const Socials = () => {
  const githubUrl = 'https://github.com/your-repo';
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
          <FaLeaf className='w-5 h-5 text-gray-400' />
        </Button>
      </div>
    </div>
  );
};

export default Socials;
