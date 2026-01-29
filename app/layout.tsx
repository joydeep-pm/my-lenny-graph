import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import Footer from "@/components/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-brand",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-brand-display",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Joydeep's PM Intelligence Engine | Discover Your Product Philosophy",
  description: "Take a 10-question quiz and get podcast episode recommendations that match how you work as a PM. AI-curated insights from 295 podcast episodes.",
  keywords: ["product management", "PM philosophy", "product strategy", "PM Intelligence Engine", "product thinking", "product leadership", "podcast recommendations"],
  authors: [{ name: "Joydeep Sarkar", url: "https://www.joydeepsarkar.me" }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://lenny.productbuilder.net'),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Joydeep's PM Intelligence Engine",
    description: "Get podcast episode recommendations that match how you work. AI-curated insights from 295 podcast episodes.",
    siteName: "PM Intelligence Engine",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PM Intelligence Engine",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Joydeep's PM Intelligence Engine",
    description: "Discover your product philosophy with AI-curated podcast insights",
    images: ["/og-image.png"],
    creator: "@joydeepsarkar",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="font-brand antialiased bg-brand-background text-brand-text-primary">
        <Suspense fallback={null}>
          {gaId && <GoogleAnalytics gaId={gaId} />}
        </Suspense>
        {children}
        <Footer />
      </body>
    </html>
  );
}
