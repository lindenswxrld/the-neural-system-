import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Neural System | Precision Human Intelligence",
  description: "Stop betting on resumes. Quantify psychological certainty and eliminate workplace toxicity with AI-driven performance analytics.",
  penGraph: {
    title: "The Neural System",
    description: "Institutional Grade Human Capital Intelligence.",
    images: ["/og-image.png"], // You'll create this later
  }
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