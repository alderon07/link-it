import type { Variants } from "framer-motion"

// Page transition variants
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

// Fade in variants
export const fadeInVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.4 },
  },
  exit: { opacity: 0 },
}

// Slide up variants
export const slideUpVariants: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
  },
}

// Scale variants with bounce
export const scaleVariants: Variants = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
  exit: {
    scale: 0,
    opacity: 0,
  },
}

// Stagger container variants
export const staggerContainerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
}

// Stagger children variants
export const staggerItemVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    y: -10,
  },
}

// Card hover variants (for pixel cards)
export const cardHoverVariants: Variants = {
  initial: {
    y: 0,
    boxShadow: "4px 4px 0 0 var(--shadow-color)",
  },
  hover: {
    y: -4,
    boxShadow: "8px 8px 0 0 var(--shadow-color)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
  tap: {
    y: 2,
    boxShadow: "2px 2px 0 0 var(--shadow-color)",
    transition: {
      duration: 0.1,
    },
  },
}

// Button press variants
export const buttonPressVariants: Variants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
    },
  },
}

// Bounce animation
export const bounceVariants: Variants = {
  initial: { y: 0 },
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatType: "loop",
      ease: "easeInOut",
    },
  },
}

// Shake animation
export const shakeVariants: Variants = {
  initial: { x: 0 },
  animate: {
    x: [0, -3, 3, -3, 3, 0],
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
}

// Pulse animation
export const pulseVariants: Variants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      repeatType: "loop",
      ease: "easeInOut",
    },
  },
}

// Notification/toast slide variants
export const toastVariants: Variants = {
  initial: {
    opacity: 0,
    y: 50,
    scale: 0.9,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.9,
    transition: {
      duration: 0.2,
    },
  },
}

// Modal/dialog variants
export const modalVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.95,
    y: 10,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: {
      duration: 0.2,
    },
  },
}

// Backdrop variants
export const backdropVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
}

// List item variants for reordering
export const listItemVariants: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.2,
    },
  },
}

// Confetti particle variants
export const confettiVariants: Variants = {
  initial: {
    opacity: 1,
    y: 0,
    x: 0,
    rotate: 0,
    scale: 1,
  },
  animate: (custom: { x: number; y: number; rotate: number }) => ({
    opacity: [1, 1, 0],
    y: custom.y,
    x: custom.x,
    rotate: custom.rotate,
    scale: [1, 1.2, 0.5],
    transition: {
      duration: 1.5,
      ease: "easeOut",
    },
  }),
}

// Number counter spring config
export const counterSpring = {
  type: "spring" as const,
  stiffness: 100,
  damping: 30,
}

// Typing/typewriter effect helper
export const typewriterConfig = {
  duration: 0.05, // per character
  ease: "linear" as const,
}
