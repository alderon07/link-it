"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const pixelCornerVariants = cva(
  "absolute pointer-events-none",
  {
    variants: {
      position: {
        "top-left": "top-0 left-0",
        "top-right": "top-0 right-0 -scale-x-100",
        "bottom-left": "bottom-0 left-0 -scale-y-100",
        "bottom-right": "bottom-0 right-0 -scale-x-100 -scale-y-100",
        all: "", // Special case - renders all corners
      },
      size: {
        sm: "w-3 h-3",
        default: "w-4 h-4",
        lg: "w-6 h-6",
        xl: "w-8 h-8",
      },
      color: {
        default: "text-foreground",
        primary: "text-primary",
        pink: "text-pixel-pink",
        teal: "text-pixel-teal",
        yellow: "text-pixel-yellow",
        purple: "text-pixel-purple",
      },
    },
    defaultVariants: {
      position: "top-left",
      size: "default",
      color: "default",
    },
  }
)

// Corner decoration SVG
const CornerSvg = () => (
  <svg viewBox="0 0 8 8" fill="currentColor" className="w-full h-full">
    <path d="M0 0h8v2H2v6H0V0z" />
  </svg>
)

// Fancy corner with bracket style
const BracketSvg = () => (
  <svg viewBox="0 0 12 12" fill="currentColor" className="w-full h-full">
    <path d="M0 0h12v2H4v2H2v8H0V0z" />
  </svg>
)

// Pixel dot corner
const DotCornerSvg = () => (
  <svg viewBox="0 0 8 8" fill="currentColor" className="w-full h-full">
    <path d="M0 0h4v4H0V0z" />
  </svg>
)

export interface PixelCornerProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children' | 'color'>,
    VariantProps<typeof pixelCornerVariants> {
  variant?: "default" | "bracket" | "dot"
}

const PixelCorner = React.forwardRef<HTMLSpanElement, PixelCornerProps>(
  ({ className, position, size, color, variant = "default", ...props }, ref) => {
    const CornerComponent =
      variant === "bracket" ? BracketSvg :
      variant === "dot" ? DotCornerSvg :
      CornerSvg

    // Render all four corners
    if (position === "all") {
      return (
        <>
          <span
            className={cn(
              pixelCornerVariants({ position: "top-left", size, color }),
              className
            )}
            {...props}
          >
            <CornerComponent />
          </span>
          <span
            className={cn(
              pixelCornerVariants({ position: "top-right", size, color }),
              className
            )}
            {...props}
          >
            <CornerComponent />
          </span>
          <span
            className={cn(
              pixelCornerVariants({ position: "bottom-left", size, color }),
              className
            )}
            {...props}
          >
            <CornerComponent />
          </span>
          <span
            className={cn(
              pixelCornerVariants({ position: "bottom-right", size, color }),
              className
            )}
            {...props}
          >
            <CornerComponent />
          </span>
        </>
      )
    }

    return (
      <span
        ref={ref}
        className={cn(pixelCornerVariants({ position, size, color }), className)}
        {...props}
      >
        <CornerComponent />
      </span>
    )
  }
)
PixelCorner.displayName = "PixelCorner"

// Wrapper component that adds corners to children
export interface WithPixelCornersProps extends React.HTMLAttributes<HTMLDivElement> {
  cornerSize?: PixelCornerProps["size"]
  cornerColor?: PixelCornerProps["color"]
  cornerVariant?: PixelCornerProps["variant"]
}

const WithPixelCorners = React.forwardRef<HTMLDivElement, WithPixelCornersProps>(
  ({ className, children, cornerSize, cornerColor, cornerVariant, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("relative", className)} {...props}>
        {children}
        <PixelCorner position="all" size={cornerSize} color={cornerColor} variant={cornerVariant} />
      </div>
    )
  }
)
WithPixelCorners.displayName = "WithPixelCorners"

export { PixelCorner, WithPixelCorners, pixelCornerVariants }
