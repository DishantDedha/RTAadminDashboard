import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import { Home } from "lucide-react";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Indus | Admin Dashboard",
  description: "Indus - Unified Platform For Equity Investment Monitoring",
  icons: {
    icon: "/logo.jpeg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-dynamic`}>
        {/* Minimal Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-dynamic/95 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.jpeg"
                alt="KFINTCH Logo"
                width={140}
                height={40}
                className="h-9 w-auto"
                priority
              />
            </div>

            <Link
              href="https://kfintech.com"
              target="_blank"
              className="flex items-center justify-center w-10 h-10 hover:bg-white/10 rounded-xl transition-colors"
            >
              <Home className="w-5 h-5" />
            </Link>
          </div>
        </nav>

        <main className="pt-16 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}