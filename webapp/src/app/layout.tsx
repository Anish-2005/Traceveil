import type { Metadata, Viewport } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ScrollObserver } from "@/components/ui/ScrollObserver";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { APIStatus } from '@/components/shared/APIStatus';
import { RouteTransitionOverlay } from '@/components/shared/RouteTransitionOverlay';
import { seoConfig } from '@/lib/seo';

// Premium font configuration with performance optimization
const outfit = Outfit({
  variable: "--font-outfit",
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
  metadataBase: seoConfig.metadataBase,
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
  applicationName: "Traceveil",
  referrer: "origin-when-cross-origin",
  robots: {
    index: seoConfig.shouldIndex,
    follow: seoConfig.shouldIndex,
    googleBot: {
      index: seoConfig.shouldIndex,
      follow: seoConfig.shouldIndex,
      "max-video-preview": seoConfig.shouldIndex ? -1 : 0,
      "max-image-preview": seoConfig.shouldIndex ? "large" : "none",
      "max-snippet": seoConfig.shouldIndex ? -1 : 0,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: seoConfig.siteUrl,
    siteName: "Traceveil",
    title: "Traceveil | AI-Powered Fraud Detection & Threat Intelligence",
    description:
      "Enterprise-grade AI fraud detection platform with real-time threat intelligence and behavioral analysis.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Traceveil | AI-Powered Fraud Detection",
    description:
      "Enterprise-grade AI fraud detection with real-time threat intelligence.",
    creator: "@traceveil",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "/",
  },
  category: "technology",
};

// Viewport configuration for optimal mobile experience
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#030712" },
    { media: "(prefers-color-scheme: light)", color: "#f6f9ff" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: "dark light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const apiOrigin = process.env.NEXT_PUBLIC_API_URL
    ? (() => {
        try {
          return new URL(process.env.NEXT_PUBLIC_API_URL).origin;
        } catch {
          return null;
        }
      })()
    : null;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {
  try {
    const key = 'traceveil.theme';
    const stored = localStorage.getItem(key);
    const theme =
      stored === 'light' || stored === 'dark'
        ? stored
        : (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
  } catch {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.style.colorScheme = 'dark';
  }
})();`,
          }}
        />
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS prefetch for API */}
        {apiOrigin && <link rel="dns-prefetch" href={apiOrigin} />}

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
        className={`${outfit.variable} ${jetbrainsMono.variable} font-sans antialiased`}
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

        <ThemeProvider>
          <AuthProvider>
            <RouteTransitionOverlay />
            {children}
            <APIStatus />
          </AuthProvider>
        </ThemeProvider>

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
