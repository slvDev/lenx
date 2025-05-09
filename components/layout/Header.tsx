'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ConnectKitButton } from 'connectkit';

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className='py-4 px-6 bg-gray-800 text-white flex justify-between items-center shadow-md'
    >
      <div className='text-xl font-semibold'>Lens Smart Account Manager</div>
      <div>
        <ConnectKitButton />
      </div>
    </motion.header>
  );
}
