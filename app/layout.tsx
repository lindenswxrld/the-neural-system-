import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Neural System | Precision Human Intelligence",
  description: "Institutional Grade Human Capital Analytics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-black text-white">
        {children}
      </body>
    </html>
  );
}