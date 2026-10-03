import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Neural System | Precision Human Intelligence",
  description: "Institutional grade human capital analytics",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
