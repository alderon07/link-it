"use client";

import { ReactNode, createContext, useContext } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth } from "@clerk/nextjs";

// Check if Convex is configured
const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;
const isConvexConfigured = Boolean(CONVEX_URL);

// Only create client if configured
const convex = isConvexConfigured ? new ConvexReactClient(CONVEX_URL!) : null;

// Context to check if Convex is available
const ConvexAvailableContext = createContext<boolean>(false);

export function useConvexAvailable() {
  return useContext(ConvexAvailableContext);
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  // If Convex is not configured, just render children without the provider
  if (!isConvexConfigured || !convex) {
    console.warn(
      "Convex is not configured. Set NEXT_PUBLIC_CONVEX_URL to enable real-time features."
    );
    return (
      <ConvexAvailableContext.Provider value={false}>
        {children}
      </ConvexAvailableContext.Provider>
    );
  }

  return (
    <ConvexAvailableContext.Provider value={true}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ConvexAvailableContext.Provider>
  );
}
