"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const pixelBorderVariants = cva(
  "relative",
  {
    variants: {
      variant: {
        // Stepped corners using clip-path
        stepped: "pixel-corners",
        // Simple solid border
        solid: "pixel-border rounded-none",
        // Dashed border
        dashed: "pixel-border-dashed rounded-none",
        // Double border effect
        double: "border-4 border-double border-foreground rounded-none",
        // Dotted pattern border
        dotted: "rounded-none border-[3px] border-dotted border-foreground",
      },
      shadow: {
        none: "",
        sm: "pixel-shadow-sm",
        default: "pixel-shadow",
        lg: "pixel-shadow-lg",
      },
      color: {
        default: "",
        pink: "pixel-shadow-pink border-pixel-pink",
        teal: "pixel-shadow-teal border-pixel-teal",
        yellow: "pixel-shadow-yellow border-pixel-yellow",
        purple: "pixel-shadow-purple border-pixel-purple",
      },
    },
    defaultVariants: {
      variant: "solid",
      shadow: "default",
      color: "default",
    },
  }
)

export interface PixelBorderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'>,
    VariantProps<typeof pixelBorderVariants> {
  asChild?: boolean
}

const PixelBorder = React.forwardRef<HTMLDivElement, PixelBorderProps>(
  ({ className, variant, shadow, color, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(pixelBorderVariants({ variant, shadow, color }), className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
PixelBorder.displayName = "PixelBorder"

export { PixelBorder, pixelBorderVariants }
