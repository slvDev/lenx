import { TargetAndTransition, Transition, Variants } from 'framer-motion';

/**
 * Container animation variants
 */
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.5 },
  },
};

/**
 * Card animation variants
 */
export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
  hover: {
    y: -5,
    boxShadow: '0 10px 25px -5px rgba(124, 58, 237, 0.1)',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 15,
    },
  },
};

/**
 * Item animation variants
 */
export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

/**
 * Button animation variants
 */
export const buttonVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 15,
    },
  },
  hover: {
    scale: 1.05,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 10,
    },
  },
  tap: { scale: 0.95, opacity: 1 },
};

/**
 * Step content animation - for transitions between steps
 */
export const stepContentVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const stepContentTransition: Transition = {
  duration: 0.5,
};

/**
 * Step indicator variants
 */
export const stepIndicatorVariants: Variants = {
  inactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'rgba(255, 255, 255, 0.5)',
    scale: 1,
    boxShadow: '0 0 0 rgba(139, 92, 246, 0)',
    cursor: 'default',
  },
  active: {
    backgroundColor: 'rgba(124, 58, 237, 0.8)',
    color: 'rgba(255, 255, 255, 1)',
    scale: 1.1,
    boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)',
    cursor: 'default',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 15,
    },
  },
  complete: {
    backgroundColor: 'rgba(0, 200, 83, 0.8)',
    color: 'rgba(255, 255, 255, 1)',
    scale: 1,
    boxShadow: '0 0 10px rgba(0, 200, 83, 0.5)',
    cursor: 'pointer',
  },
};

/**
 * Icon animation - for success/complete icon
 */
export const iconAnimation: TargetAndTransition = {
  scale: 1,
  rotateZ: [0, 10, 0, -10, 0],
};

export const iconTransition = {
  scale: {
    type: 'spring',
    stiffness: 260,
    damping: 20,
    delay: 0.3,
  },
  rotateZ: {
    delay: 0.8,
    duration: 1,
    repeat: 0,
  },
};

/**
 * Confetti animation
 */
export const confettiVariants: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { opacity: 1, scale: 1 },
};

export const confettiTransition: Transition = {
  duration: 0.5,
};
