import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://kinsuroi.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "KINSUROI — Your Beauty, Your Ritual. | Official Website",
    template: "%s | KINSUROI",
  },
  description:
    "Official KINSUROI website. Discover a simple and elegant beauty ritual — cleansers, serums, lip care and body care, thoughtfully made. Clean. Quiet. Elegant. Trustworthy.",
  keywords: [
    "KINSUROI",
    "skincare",
    "clean beauty",
    "luxury skincare",
    "serum",
    "cleanser",
    "lip balm",
    "body care",
  ],
  applicationName: "KINSUROI",
  authors: [{ name: "KINSUROI" }],
  alternates: { canonical: "/" },
  openGraph: {
    title: "KINSUROI — Your Beauty, Your Ritual.",
    description:
      "Discover a simple and elegant beauty ritual with KINSUROI. Explore the full collection on the official website.",
    url: SITE_URL,
    siteName: "KINSUROI",
    type: "website",
    locale: "en_US",
    images: [{ url: "/images/hero.jpg", width: 864, height: 1152, alt: "KINSUROI — elegant beauty ritual" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "KINSUROI — Your Beauty, Your Ritual.",
    description: "Discover a simple and elegant beauty ritual with KINSUROI.",
    images: ["/images/hero.jpg"],
  },
  robots: { index: true, follow: true },
  icons: { icon: "/logo.svg" },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "KINSUROI",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.svg`,
  address: {
    "@type": "PostalAddress",
    streetAddress:
      "Komp. Sentra Niaga Surya Kadu Blok F No.9, Kadujaya RT 001/001, Kec. Curug, Jl. Raya Telesonik No.10",
    addressLocality: "Kota Tangerang",
    addressRegion: "Banten",
    postalCode: "15810",
    addressCountry: "ID",
  },
  telephone: ["+62 21 29437988", "+62 21 29437987"],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "KINSUROI",
  url: SITE_URL,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Brand typography: elegant luxury serif + modern readable sans (loaded client-side) */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Jost:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="antialiased bg-background text-foreground">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
