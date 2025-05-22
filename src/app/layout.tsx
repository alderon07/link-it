import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/ui/navbar/Navbar";
import { ReactScan } from "@/components/ReactScan";
import {ClerkProvider} from '@clerk/nextjs'

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
      <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} min-h-screen pt-14 bg-background text-text`}>
          <ReactScan />
          <Navbar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
