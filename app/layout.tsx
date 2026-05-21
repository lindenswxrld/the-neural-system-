import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Neural System | Precision Human Intelligence",
  description: "Quantify psychological certainty and eliminate workplace toxicity with AI-driven performance analytics.",
  openGraph: {
    title: "The Neural System",
    description: "Institutional Grade Human Capital Intelligence.",
    url: "https://theneuralsystem.vercel.app",
    siteName: "The Neural System",
    images: [
      {
        url: "https://theneuralsystem.vercel.app/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-black">
        {children}
      </body>
    </html>
  );
}