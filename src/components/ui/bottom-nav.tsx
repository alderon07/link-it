"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { PixelIcon } from "@/components/pixel-art/PixelIcon"
import { useIsMobile } from "@/hooks/use-mobile"

interface BottomNavItem {
  title: string
  url: string
  pixelIcon: "star" | "cursor" | "link" | "heart" | "arrow" | "check"
  color: string
}

interface BottomNavProps {
  items: BottomNavItem[]
  className?: string
}

export function BottomNav({ items, className }: BottomNavProps) {
  const pathname = usePathname()
  const isMobile = useIsMobile()
  const [isVisible, setIsVisible] = React.useState(true)

  React.useEffect(() => {
    // Only set up scroll listeners on mobile
    if (!isMobile) {
      return
    }

    let scrollTimer: NodeJS.Timeout | null = null
    let hasScrolled = false
    let lastScrollY = 0

    const getScrollY = () => {
      // Check if main element is scrollable
      const mainElement = document.querySelector('main')
      if (mainElement && mainElement.scrollHeight > mainElement.clientHeight) {
        return mainElement.scrollTop
      }
      return window.scrollY || window.pageYOffset || document.documentElement.scrollTop
    }

    // Initialize last scroll position
    lastScrollY = getScrollY()

    const handleScroll = () => {
      const currentScrollY = getScrollY()
      const scrollDelta = Math.abs(currentScrollY - lastScrollY)

      // Only hide if there's actual scrolling movement (threshold to prevent jitter)
      if (scrollDelta > 2) {
        hasScrolled = true
        // Hide nav immediately when scrolling starts
        setIsVisible(false)
      }

      lastScrollY = currentScrollY

      // Clear existing timeout
      if (scrollTimer) {
        clearTimeout(scrollTimer)
      }

      // Show nav after scrolling stops (500ms delay)
      scrollTimer = setTimeout(() => {
        if (hasScrolled) {
          setIsVisible(true)
        }
      }, 500)
    }

    // Listen to scroll on both window and main element
    window.addEventListener("scroll", handleScroll, { passive: true })
    
    const mainElement = document.querySelector('main')
    if (mainElement) {
      mainElement.addEventListener("scroll", handleScroll, { passive: true })
    }
    
    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (mainElement) {
        mainElement.removeEventListener("scroll", handleScroll)
      }
      if (scrollTimer) {
        clearTimeout(scrollTimer)
      }
    }
  }, [isMobile])

  // Only render on mobile
  if (!isMobile) {
    return null
  }

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 bg-card pixel-border border-x-0 border-b-0 pixel-shadow-lg",
        "transition-transform duration-300 ease-in-out",
        isVisible ? "translate-y-0" : "translate-y-full",
        className
      )}
      style={{ 
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        left: 0,
        right: 0
      }}
    >
      <div 
        className="flex items-center justify-around py-2 overflow-x-hidden"
        style={{ 
          paddingLeft: '0.25rem',
          paddingRight: '0.25rem',
          paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))',
          boxSizing: 'border-box',
          width: '100%',
          maxWidth: '100%'
        }}
      >
        {items.map((item) => {
          const isActive = pathname === item.url
          return (
            <Button
              key={item.url}
              asChild
              variant="ghost"
              size="sm"
              className={cn(
                "flex flex-col items-center gap-1 h-auto py-2 min-w-0 flex-1",
                "rounded-none pixel-border border-2 border-transparent",
                "transition-all duration-150",
                isActive
                  ? "bg-pixel-pink/20 border-foreground text-pixel-pink font-bold"
                  : "hover:bg-pixel-pink/10 hover:border-foreground/50"
              )}
              style={{ 
                paddingLeft: '0.125rem',
                paddingRight: '0.125rem',
                boxSizing: 'border-box',
                flex: '1 1 0%',
                minWidth: 0,
                maxWidth: '100%'
              }}
            >
              <a href={item.url} className="flex flex-col items-center gap-1 w-full">
                <div
                  className={cn(
                    "w-6 h-6 pixel-border flex items-center justify-center transition-all",
                    isActive ? item.color : "bg-muted"
                  )}
                >
                  <PixelIcon
                    icon={item.pixelIcon}
                    size="xs"
                    color={isActive ? "default" : "default"}
                  />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider leading-tight text-center truncate w-full">
                  {item.title}
                </span>
              </a>
            </Button>
          )
        })}
      </div>
    </nav>
  )
}
