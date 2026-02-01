import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ScrollObserver } from "@/components/ui/ScrollObserver";

// Premium font configuration with performance optimization
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

// Comprehensive SEO metadata
export const metadata: Metadata = {
  metadataBase: new URL("https://traceveil.io"),
  title: {
    default: "Traceveil | AI-Powered Fraud Detection & Threat Intelligence",
    template: "%s | Traceveil",
  },
  description:
    "Enterprise-grade AI fraud detection platform. Real-time threat intelligence, behavioral analysis, and automated risk assessment for financial institutions and digital platforms.",
  keywords: [
    "fraud detection",
    "AI security",
    "threat intelligence",
    "behavioral analysis",
    "machine learning security",
    "financial fraud prevention",
    "real-time monitoring",
    "risk assessment",
    "cybersecurity",
    "anomaly detection",
  ],
  authors: [{ name: "Traceveil Team" }],
  creator: "Traceveil",
  publisher: "Traceveil",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://traceveil.io",
    siteName: "Traceveil",
    title: "Traceveil | AI-Powered Fraud Detection & Threat Intelligence",
    description:
      "Enterprise-grade AI fraud detection platform with real-time threat intelligence and behavioral analysis.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Traceveil - AI Fraud Detection Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Traceveil | AI-Powered Fraud Detection",
    description:
      "Enterprise-grade AI fraud detection with real-time threat intelligence.",
    images: ["/twitter-image.png"],
    creator: "@traceveil",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#3b82f6" },
    ],
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "https://traceveil.io",
  },
  category: "technology",
};

// Viewport configuration for optimal mobile experience
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#030712" },
    { media: "(prefers-color-scheme: light)", color: "#030712" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS prefetch for API */}
        <link rel="dns-prefetch" href="https://api.traceveil.io" />

        {/* PWA meta tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Traceveil" />

        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Traceveil",
              applicationCategory: "SecurityApplication",
              operatingSystem: "Web",
              description: "AI-powered fraud detection and threat intelligence platform",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.9",
                ratingCount: "2847",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <ScrollObserver />

        {/* Skip to main content for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:font-semibold"
        >
          Skip to main content
        </a>

        {children}

        {/* Performance: Preload critical resources */}
        <link
          rel="preload"
          href="/traceveil-logo.svg"
          as="image"
          type="image/svg+xml"
        />
      </body>
    </html>
  );
}
