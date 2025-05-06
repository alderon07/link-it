import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { ReactScan } from "@/components/ReactScan";

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
    <html lang="en" className="min-h-screen">
      <body className={`${inter.className} min-h-screen pt-14 bg-background text-text`}>
        <ReactScan />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
