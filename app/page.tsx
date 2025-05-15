'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { XLoginButton } from '@/components/auth/XLoginButton';
import { useEffect } from 'react';
import { useXAuth } from '@/contexts/XAuthProvider';
import Threads from '@/components/ui/backgroundThreads';

export default function HomePage() {
  const router = useRouter();
  const { isXAuthenticated } = useXAuth();

  useEffect(() => {
    if (isXAuthenticated) {
      router.push('/dashboard');
    }
  }, [isXAuthenticated, router]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.3,
        delayChildren: 0.3,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 120,
        damping: 12,
        duration: 0.7,
      },
    },
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 0.7,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        delay: 0.1,
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 15,
        delay: 0.2,
      },
    },
  };

  return (
    <div className='min-h-screen bg-black flex items-center justify-center relative overflow-hidden'>
      <div className='absolute inset-0 z-0'>
        <Threads amplitude={1.5} distance={0} color={[0.6, 0.3, 0.9]} enableMouseInteraction={true} />
      </div>

      <motion.div className='relative z-10' initial='hidden' animate='visible' variants={containerVariants}>
        <motion.div
          className='bg-black/30 backdrop-blur-md rounded-xl border border-purple-500/30 shadow-2xl p-10 w-[340px] md:w-[400px]'
          variants={cardVariants}
        >
          <div className='text-center space-y-2'>
            <motion.h1
              className='text-4xl md:text-5xl font-bold text-white tracking-tight'
              variants={titleVariants}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
            >
              LenX
            </motion.h1>

            <motion.p className='text-lg text-white/70 pb-2' variants={subtitleVariants}>
              Sync your Lens with X
            </motion.p>

            <motion.div className='pt-8 space-y-4' variants={buttonVariants}>
              <XLoginButton className='w-full' />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
