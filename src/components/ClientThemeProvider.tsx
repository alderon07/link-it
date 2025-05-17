'use client';

import { useEffect, useState } from 'react';
import { ThemeProvider } from './ThemeProvider';

export function ClientThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering after component is mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder with the same structure to avoid layout shift
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return <ThemeProvider>{children}</ThemeProvider>;
} 