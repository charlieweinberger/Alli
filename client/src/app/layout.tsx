import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { AuthProvider } from "@/components/AuthProvider";
import Navbar from "../components/Navbar";
import Clouds from "../components/Cloud";
import { Toaster } from "../components/ui/toaster";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Toaster />
          <div className="flex flex-col">
            <Navbar />
            <div className="fixed inset-0 -z-10 overflow-hidden opacity-40 bg-rose-700">
              <Clouds />
            </div>
            <main>{children}</main>
          </div>
        </body>
      </AuthProvider>
    </html>
  );
}
