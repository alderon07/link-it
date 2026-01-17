"use client"

import * as React from "react"
import { motion, useSpring, useTransform, useInView } from "framer-motion"

interface CountUpProps {
  /** Target number to count to */
  value: number
  /** Duration of animation in seconds */
  duration?: number
  /** Start counting when element enters viewport */
  startOnView?: boolean
  /** Number of decimal places */
  decimals?: number
  /** Prefix (e.g., "$") */
  prefix?: string
  /** Suffix (e.g., "%", "k") */
  suffix?: string
  /** Custom formatting function */
  formatter?: (value: number) => string
  /** Class name for the container */
  className?: string
}

/**
 * CountUp animates a number from 0 to the target value.
 * Perfect for stats, metrics, and dashboard numbers.
 *
 * @example
 * ```tsx
 * <CountUp value={12500} suffix="+" duration={2} />
 * // Renders: "12,500+"
 *
 * <CountUp value={99.9} decimals={1} suffix="%" />
 * // Renders: "99.9%"
 * ```
 */
export function CountUp({
  value,
  duration = 2,
  startOnView = true,
  decimals = 0,
  prefix = "",
  suffix = "",
  formatter,
  className,
}: CountUpProps) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [hasStarted, setHasStarted] = React.useState(!startOnView)
  const prevValueRef = React.useRef(value)

  // Start animation when in view
  React.useEffect(() => {
    if (isInView && startOnView) {
      setHasStarted(true)
    }
  }, [isInView, startOnView])

  // Spring animation for smooth counting
  // Initialize with current value to avoid starting from 0 when value is already set
  const spring = useSpring(hasStarted ? value : 0, {
    duration: duration * 1000,
    bounce: 0,
  })

  // Transform spring value to display value
  const display = useTransform(spring, (current) => {
    if (formatter) {
      return formatter(current)
    }

    const formatted = current.toFixed(decimals)
    // Add thousand separators
    const parts = formatted.split(".")
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    return `${prefix}${parts.join(".")}${suffix}`
  })

  // Update spring when value changes or hasStarted becomes true
  React.useEffect(() => {
    if (hasStarted) {
      // Animate to new value
      spring.set(value)
      prevValueRef.current = value
    }
  }, [hasStarted, spring, value])

  return (
    <motion.span ref={ref} className={className}>
      {display}
    </motion.span>
  )
}

/**
 * Compact number formatter (e.g., 1.2K, 3.5M)
 */
export function compactFormatter(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`
  }
  return Math.round(value).toString()
}

/**
 * CountUpCompact - Pre-configured for compact number display
 */
export function CountUpCompact({
  value,
  className,
  ...props
}: Omit<CountUpProps, "formatter">) {
  return (
    <CountUp
      value={value}
      formatter={compactFormatter}
      className={className}
      {...props}
    />
  )
}

/**
 * CountUpCurrency - Pre-configured for currency display
 */
export function CountUpCurrency({
  value,
  currency = "$",
  className,
  ...props
}: Omit<CountUpProps, "prefix" | "decimals"> & { currency?: string }) {
  return (
    <CountUp
      value={value}
      prefix={currency}
      decimals={2}
      className={className}
      {...props}
    />
  )
}

/**
 * CountUpPercentage - Pre-configured for percentage display
 */
export function CountUpPercentage({
  value,
  className,
  ...props
}: Omit<CountUpProps, "suffix" | "decimals">) {
  return (
    <CountUp
      value={value}
      suffix="%"
      decimals={1}
      className={className}
      {...props}
    />
  )
}

/**
 * Animated stat card that combines count up with a label
 */
export function AnimatedStat({
  value,
  label,
  prefix,
  suffix,
  trend,
  className,
}: {
  value: number
  label: string
  prefix?: string
  suffix?: string
  trend?: { value: number; positive: boolean }
  className?: string
}) {
  return (
    <div className={className}>
      <div className="text-3xl font-bold">
        <CountUp value={value} prefix={prefix} suffix={suffix} />
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
      {trend && (
        <div
          className={`text-sm ${
            trend.positive ? "text-pixel-green" : "text-pixel-coral"
          }`}
        >
          {trend.positive ? "+" : "-"}
          {Math.abs(trend.value)}%
        </div>
      )}
    </div>
  )
}
