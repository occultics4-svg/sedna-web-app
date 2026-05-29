import type { Metadata, Viewport } from "next";
import "./globals.css";
import { copy } from "@/lib/copy";

export const metadata: Metadata = {
  title: copy.site.title,
  description: copy.site.description,
  metadataBase: new URL("https://sedna.occultics.ai"),
};

export const viewport: Viewport = {
  themeColor: "#0d2540",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg text-text">{children}</body>
    </html>
  );
}
