"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const pixelDividerVariants = cva(
  "w-full flex items-center justify-center",
  {
    variants: {
      variant: {
        // Solid line
        solid: "",
        // Dashed line
        dashed: "",
        // Dotted pattern
        dotted: "",
        // Star pattern
        stars: "",
        // Diamond pattern
        diamonds: "",
        // Heart pattern
        hearts: "",
        // Zigzag pattern
        zigzag: "",
      },
      spacing: {
        sm: "my-2",
        default: "my-4",
        lg: "my-6",
        xl: "my-8",
      },
      color: {
        default: "text-foreground",
        muted: "text-muted-foreground",
        primary: "text-primary",
        pink: "text-pixel-pink",
        teal: "text-pixel-teal",
        yellow: "text-pixel-yellow",
        rainbow: "",
      },
    },
    defaultVariants: {
      variant: "solid",
      spacing: "default",
      color: "default",
    },
  }
)

// Pattern SVGs
const patterns = {
  solid: (
    <svg viewBox="0 0 100 4" preserveAspectRatio="none" className="w-full h-1">
      <rect fill="currentColor" width="100" height="4" />
    </svg>
  ),
  dashed: (
    <svg viewBox="0 0 100 4" preserveAspectRatio="none" className="w-full h-1">
      <pattern id="dash" width="10" height="4" patternUnits="userSpaceOnUse">
        <rect fill="currentColor" width="6" height="4" />
      </pattern>
      <rect fill="url(#dash)" width="100" height="4" />
    </svg>
  ),
  dotted: (
    <svg viewBox="0 0 100 4" preserveAspectRatio="none" className="w-full h-1">
      <pattern id="dots" width="8" height="4" patternUnits="userSpaceOnUse">
        <rect fill="currentColor" x="1" y="0" width="4" height="4" />
      </pattern>
      <rect fill="url(#dots)" width="100" height="4" />
    </svg>
  ),
  stars: (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 h-0.5 bg-current opacity-30" />
      <span className="text-xs">*</span>
      <span className="text-xs">*</span>
      <span className="text-xs">*</span>
      <div className="flex-1 h-0.5 bg-current opacity-30" />
    </div>
  ),
  diamonds: (
    <div className="flex items-center gap-1 w-full">
      <div className="flex-1 h-0.5 bg-current opacity-30" />
      {[...Array(5)].map((_, i) => (
        <span key={i} className="text-[10px] rotate-45">&#9632;</span>
      ))}
      <div className="flex-1 h-0.5 bg-current opacity-30" />
    </div>
  ),
  hearts: (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 h-0.5 bg-current opacity-30" />
      <span className="text-pixel-pink text-xs">&hearts;</span>
      <span className="text-pixel-pink text-xs">&hearts;</span>
      <span className="text-pixel-pink text-xs">&hearts;</span>
      <div className="flex-1 h-0.5 bg-current opacity-30" />
    </div>
  ),
  zigzag: (
    <svg viewBox="0 0 100 8" preserveAspectRatio="none" className="w-full h-2">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        d="M0,4 L5,0 L10,4 L15,0 L20,4 L25,0 L30,4 L35,0 L40,4 L45,0 L50,4 L55,0 L60,4 L65,0 L70,4 L75,0 L80,4 L85,0 L90,4 L95,0 L100,4"
      />
    </svg>
  ),
}

// Rainbow divider - special case with gradient
const RainbowDivider = ({ spacing }: { spacing?: string }) => (
  <div className={cn("w-full h-1 pixel-rainbow", spacing)} />
)

export interface PixelDividerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'color'>,
    VariantProps<typeof pixelDividerVariants> {}

const PixelDivider = React.forwardRef<HTMLDivElement, PixelDividerProps>(
  ({ className, variant = "solid", spacing, color, ...props }, ref) => {
    // Handle rainbow special case
    if (color === "rainbow") {
      return (
        <div
          ref={ref}
          className={cn(
            pixelDividerVariants({ spacing }),
            className
          )}
          {...props}
        >
          <RainbowDivider />
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          pixelDividerVariants({ variant, spacing, color }),
          className
        )}
        {...props}
      >
        {patterns[variant || "solid"]}
      </div>
    )
  }
)
PixelDivider.displayName = "PixelDivider"

export { PixelDivider, pixelDividerVariants }
