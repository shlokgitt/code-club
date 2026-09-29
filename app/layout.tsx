import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono, Anton } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import AudioToggle from "@/components/AudioToggle";
import BottomNav from "@/components/BottomNav";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const anton = Anton({ variable: "--font-display", weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CodeClub Events",
  description: "Workshops, hackathons and talks from our student developer community.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${anton.variable} antialiased`}>
        <Navbar />
        <AudioToggle />
        <div className="pb-16 sm:pb-0">
          {children}
        </div>
        <footer className="border-t border-line py-6 text-center font-mono text-xs text-muted sm:block hidden">
          © CodeClub · <Link href="/admin" className="hover:text-ink">admin</Link>
        </footer>
        <BottomNav />
      </body>
    </html>
  );
}