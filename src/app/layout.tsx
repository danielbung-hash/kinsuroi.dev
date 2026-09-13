import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://kinsuroi.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "KINSUROI — Kecantikanmu, Ritualmu. | Situs Resmi",
    template: "%s | KINSUROI",
  },
  description:
    "Situs resmi KINSUROI. Temukan ritual kecantikan yang sederhana dan elegan — pembersih, serum, perawatan bibir dan tubuh, dibuat dengan penuh pertimbangan. Bersih. Tenang. Elegan. Terpercaya.",
  keywords: [
    "KINSUROI",
    "skincare",
    "clean beauty",
    "perawatan wajah",
    "serum",
    "pembersih wajah",
    "lip balm",
    "perawatan tubuh",
  ],
  applicationName: "KINSUROI",
  authors: [{ name: "KINSUROI" }],
  alternates: { canonical: "/" },
  openGraph: {
    title: "KINSUROI — Kecantikanmu, Ritualmu.",
    description:
      "Temukan ritual kecantikan yang sederhana dan elegan bersama KINSUROI. Jelajahi koleksi lengkap di situs resmi kami.",
    url: SITE_URL,
    siteName: "KINSUROI",
    type: "website",
    locale: "id_ID",
    images: [{ url: "/images/hero.jpg", width: 864, height: 1152, alt: "KINSUROI — ritual kecantikan yang elegan" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "KINSUROI — Kecantikanmu, Ritualmu.",
    description: "Temukan ritual kecantikan yang sederhana dan elegan bersama KINSUROI.",
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
    <html lang="id" suppressHydrationWarning>
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
