import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReactScan } from "@/components/ReactScan";
import { ClerkProvider } from '@clerk/nextjs'
import { neobrutalism } from '@clerk/themes'
import { SidebarProvider } from "@/components/ui/sidebar";
import { PostHogProvider } from "@/components/providers/PostHogProvider";
import { ConvexClientProvider } from "@/components/providers/ConvexClientProvider";
import { Toaster } from "sonner";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Link-It - Your Digital Identity",
  description: "Connect all your online presence in one place",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider appearance={{
        baseTheme: [neobrutalism],
      }
    }>
      <html lang="en" className="overflow-x-hidden">
        <body className={`${inter.className} min-h-screen bg-background text-text overflow-x-hidden max-w-full`}>
          {/* <ReactScan /> */}
          <ConvexClientProvider>
            <Suspense fallback={null}>
              <PostHogProvider>
                <SidebarProvider>
                  <main className="flex-1">
                    {children}
                  </main>
                </SidebarProvider>
                <Toaster
                  position="bottom-right"
                  toastOptions={{
                    classNames: {
                      toast: "pixel-shadow pixel-border bg-card",
                      title: "font-bold",
                      description: "text-muted-foreground",
                      success: "bg-[--pixel-mint] text-foreground",
                      error: "bg-[--pixel-coral] text-foreground",
                    },
                  }}
                />
              </PostHogProvider>
            </Suspense>
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
