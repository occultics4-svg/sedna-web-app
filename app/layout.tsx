import type { Metadata, Viewport } from "next";
import "./globals.css";
import { copy } from "@/lib/copy";

export const metadata: Metadata = {
  title: copy.site.title,
  description: copy.site.description,
  metadataBase: new URL("https://sedna.occultics.ai"),
  // PWA + iOS install meta. Next emits <link rel="apple-touch-icon"> for each.
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180" },
      { url: "/icons/apple-touch-icon-167.png", sizes: "167x167" },
      { url: "/icons/apple-touch-icon-152.png", sizes: "152x152" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SEDNA",
  },
  // Hint to social cards (iMessage / WhatsApp link previews) that this is an app.
  applicationName: "SEDNA",
};

export const viewport: Viewport = {
  themeColor: "#0d2540",
  width: "device-width",
  initialScale: 1,
  // Prevent users from accidentally zooming the wizard layout on iOS.
  maximumScale: 1,
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
