"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { pageVariants, fadeInVariants, slideUpVariants } from "@/lib/animations/variants"

type TransitionVariant = "default" | "fade" | "slide"

interface PageTransitionProps {
  children: React.ReactNode
  variant?: TransitionVariant
  className?: string
}

const variants = {
  default: pageVariants,
  fade: fadeInVariants,
  slide: slideUpVariants,
}

/**
 * PageTransition wraps page content with animated transitions.
 * Use at the layout level for route transitions.
 *
 * @example
 * ```tsx
 * <PageTransition>
 *   {children}
 * </PageTransition>
 * ```
 */
export function PageTransition({
  children,
  variant = "default",
  className,
}: PageTransitionProps) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants[variant]}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

/**
 * Simple fade-in wrapper for components that should fade in on mount.
 */
export function FadeIn({
  children,
  delay = 0,
  duration = 0.4,
  className,
}: {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * Slide up animation wrapper.
 */
export function SlideUp({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay,
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * Scale in animation wrapper with bounce effect.
 */
export function ScaleIn({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        delay,
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
