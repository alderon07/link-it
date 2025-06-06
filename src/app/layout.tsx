import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReactScan } from "@/components/ReactScan";
import {ClerkProvider} from '@clerk/nextjs'
import { dark, neobrutalism } from '@clerk/themes'
import { SidebarProvider } from "@/components/ui/sidebar";

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
      <html lang="en">
        <body className={`${inter.className} min-h-screen bg-background text-text`}>
          {/* <ReactScan /> */}
          <SidebarProvider>
            <main className="flex-1">
              {children}
            </main>
        </SidebarProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
