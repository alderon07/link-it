"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const pixelIconVariants = cva(
  "inline-block",
  {
    variants: {
      size: {
        xs: "w-3 h-3",
        sm: "w-4 h-4",
        default: "w-5 h-5",
        lg: "w-6 h-6",
        xl: "w-8 h-8",
      },
      color: {
        default: "text-foreground",
        primary: "text-primary",
        pink: "text-pixel-pink",
        teal: "text-pixel-teal",
        yellow: "text-pixel-yellow",
        mint: "text-pixel-mint",
        coral: "text-pixel-coral",
        purple: "text-pixel-purple",
      },
      animate: {
        none: "",
        bounce: "pixel-bounce",
        shake: "pixel-shake",
        glow: "pixel-glow",
      },
    },
    defaultVariants: {
      size: "default",
      color: "default",
      animate: "none",
    },
  }
)

// Pixel Art SVG Icons
const icons = {
  star: (
    <svg viewBox="0 0 16 16" fill="currentColor">
      <path d="M7 0h2v2h2v2h2v2h2v2h-2v2h-2v2h-2v2H7v-2H5v-2H3v-2H1V8h2V6h2V4h2V2h2V0z" />
    </svg>
  ),
  heart: (
    <svg viewBox="0 0 16 16" fill="currentColor">
      <path d="M1 5h2V3h2V1h4v2h2V1h4v2h2v4h-2v2h-2v2h-2v2H9v2H7v-2H5v-2H3V9H1V7h2V5H1z" />
    </svg>
  ),
  arrow: (
    <svg viewBox="0 0 16 16" fill="currentColor">
      <path d="M6 0h4v6h4v4h-4v-2H8v2H6v2H4v2H2v-4h2V8h2V0z" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 16 16" fill="currentColor">
      <path d="M14 2h2v2h-2v2h-2v2h-2v2H8v2H6v-2H4v-2H2V6h2v2h2v2h2V8h2V6h2V4h2V2z" />
    </svg>
  ),
  cross: (
    <svg viewBox="0 0 16 16" fill="currentColor">
      <path d="M2 2h2v2h2v2h4V4h2V2h2v2h-2v2h-2v4h2v2h2v2h-2v-2h-2v-2H6v2H4v2H2v-2h2v-2h2V8H4V6H2V2z" />
    </svg>
  ),
  plus: (
    <svg viewBox="0 0 16 16" fill="currentColor">
      <path d="M6 0h4v6h6v4h-6v6H6v-6H0V6h6V0z" />
    </svg>
  ),
  minus: (
    <svg viewBox="0 0 16 16" fill="currentColor">
      <path d="M0 6h16v4H0V6z" />
    </svg>
  ),
  sparkle: (
    <svg viewBox="0 0 16 16" fill="currentColor">
      <path d="M7 0h2v3h3v2h-3v3h3v2h-3v3H7v-3H4V8h3V5H4V3h3V0z" />
    </svg>
  ),
  diamond: (
    <svg viewBox="0 0 16 16" fill="currentColor">
      <path d="M6 0h4v2h2v2h2v4h-2v2h-2v2h-2v2H6v-2H4v-2H2V8h2V4h2V2h2V0z" />
    </svg>
  ),
  coin: (
    <svg viewBox="0 0 16 16" fill="currentColor">
      <path d="M4 0h8v2h2v2h2v8h-2v2h-2v2H4v-2H2v-2H0V4h2V2h2V0zm2 4v2h2v4h2V6h-2V4H6z" />
    </svg>
  ),
  lightning: (
    <svg viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0h4v2h-2v2h-2v2h4v2H8v2h2v2h2v2H6v-2h2v-2h2V8H6V6h2V4H6V2h2V0z" />
    </svg>
  ),
  fire: (
    <svg viewBox="0 0 16 16" fill="currentColor">
      <path d="M6 0h2v2h2v2h2v4h2v4h-2v2h-2v2H6v-2H4v-2H2v-4h2V6h2V4h2V0H6z" />
    </svg>
  ),
  link: (
    <svg viewBox="0 0 16 16" fill="currentColor">
      <path d="M0 4h2V2h4v2h2v2h2v2h2v2h2v4h-2v2H8v-2H6v-2H4V8H2V6H0V4zm10 6h2v2h-2v-2z" />
    </svg>
  ),
  cursor: (
    <svg viewBox="0 0 16 16" fill="currentColor">
      <path d="M0 0h2v2h2v2h2v2h2v2h2v-2h2v6h-2v-2H8v-2H6v2H4v2H2v-2H0V0z" />
    </svg>
  ),
} as const

type IconName = keyof typeof icons

export interface PixelIconProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'>,
    VariantProps<typeof pixelIconVariants> {
  icon: IconName
}

const PixelIcon = React.forwardRef<HTMLSpanElement, PixelIconProps>(
  ({ className, icon, size, color, animate, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(pixelIconVariants({ size, color, animate }), className)}
        {...props}
      >
        {icons[icon]}
      </span>
    )
  }
)
PixelIcon.displayName = "PixelIcon"

// Export available icon names for type safety
export type { IconName }
export { PixelIcon, pixelIconVariants, icons }
