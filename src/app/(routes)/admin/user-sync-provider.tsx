"use client";

import type React from "react";
import { useSyncUser } from "@/hooks/convex";

/**
 * Provider component that ensures the current authenticated user
 * is synced from Clerk to Convex when they access the admin area.
 */
export function UserSyncProvider({ children }: { children: React.ReactNode }) {
  // This hook will automatically sync the user to Convex on mount
  useSyncUser();

  return <>{children}</>;
}
