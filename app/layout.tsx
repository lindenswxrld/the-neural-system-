import type { Metadata } from "next";
import { Syne, DM_Mono } from "next/font/google";
import "./globals.css";

const syne = Syne({ subsets: ["latin"], weight: ["700", "800"], variable: "--font-syne" });
const dmMono = DM_Mono({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "The Neural System | Institutional Intelligence",
  description: "Quantify psychological certainty. Eliminate workplace toxicity.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${syne.variable} ${dmMono.variable} antialiased bg-[#0a0b0d] cursor-crosshair selection:bg-[#00e5a0] selection:text-black`}>
        {/* GLOBAL EFFECTS */}
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.04)_50%,transparent_50%)] bg-[size:100%_4px]" />
        </div>
        {children}
      </body>
    </html>
  );
}