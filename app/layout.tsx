import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Neural System",
  description: "Performance Analytics v1.5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}