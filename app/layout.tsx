import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "POgo - S1 Policy Override Generator",
  description: "POgo — Generate policy override JSON for SentinelOne agent configuration",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-s1-black text-s1-text min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
