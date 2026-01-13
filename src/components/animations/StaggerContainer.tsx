"use client"

import * as React from "react"
import { motion, type Variants } from "framer-motion"
import { staggerContainerVariants, staggerItemVariants } from "@/lib/animations/variants"

interface StaggerContainerProps {
  children: React.ReactNode
  className?: string
  /** Delay between each child animation in seconds */
  staggerDelay?: number
  /** Initial delay before animations start */
  delayChildren?: number
  /** Custom container variants */
  variants?: Variants
}

/**
 * StaggerContainer animates children with a staggered delay effect.
 * Wrap list items or cards with this for a cascading animation.
 *
 * @example
 * ```tsx
 * <StaggerContainer>
 *   {items.map(item => (
 *     <StaggerItem key={item.id}>
 *       <Card>{item.name}</Card>
 *     </StaggerItem>
 *   ))}
 * </StaggerContainer>
 * ```
 */
export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.1,
  delayChildren = 0.1,
  variants,
}: StaggerContainerProps) {
  const containerVariants: Variants = variants || {
    initial: {},
    animate: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delayChildren,
      },
    },
    exit: {
      transition: {
        staggerChildren: staggerDelay / 2,
        staggerDirection: -1,
      },
    },
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface StaggerItemProps {
  children: React.ReactNode
  className?: string
  /** Custom item variants */
  variants?: Variants
}

/**
 * StaggerItem is a child component for StaggerContainer.
 * Each item will animate with the staggered delay.
 */
export function StaggerItem({
  children,
  className,
  variants = staggerItemVariants,
}: StaggerItemProps) {
  return (
    <motion.div variants={variants} className={className}>
      {children}
    </motion.div>
  )
}

/**
 * StaggerList combines container and item for convenience.
 * Automatically wraps each child in a StaggerItem.
 */
export function StaggerList({
  children,
  className,
  itemClassName,
  staggerDelay = 0.1,
  delayChildren = 0.1,
}: StaggerContainerProps & { itemClassName?: string }) {
  return (
    <StaggerContainer
      className={className}
      staggerDelay={staggerDelay}
      delayChildren={delayChildren}
    >
      {React.Children.map(children, (child) => (
        <StaggerItem className={itemClassName}>{child}</StaggerItem>
      ))}
    </StaggerContainer>
  )
}

/**
 * Grid-specific stagger container with optimized defaults for grid layouts.
 */
export function StaggerGrid({
  children,
  className,
  columns = 3,
  staggerDelay = 0.08,
}: {
  children: React.ReactNode
  className?: string
  columns?: number
  staggerDelay?: number
}) {
  return (
    <StaggerContainer staggerDelay={staggerDelay} className={className}>
      {React.Children.map(children, (child, index) => (
        <StaggerItem
          variants={{
            initial: { opacity: 0, y: 20, scale: 0.95 },
            animate: {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94],
              },
            },
            exit: { opacity: 0, scale: 0.95 },
          }}
        >
          {child}
        </StaggerItem>
      ))}
    </StaggerContainer>
  )
}
