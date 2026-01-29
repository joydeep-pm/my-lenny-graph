import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://lenny.productbuilder.net';

export const metadata: Metadata = {
  title: 'Curated Quotes & Insights | PM Intelligence Engine',
  description: 'Search and explore AI-curated quotes from podcast episodes. Filter by philosophy zone, save favorites, and discover insights from top product leaders.',
  keywords: [
    'product management quotes',
    'PM Intelligence Engine',
    'product leadership insights',
    'startup wisdom',
    'growth quotes',
    'PM philosophy',
    'curated insights',
    'AI-curated'
  ],
  openGraph: {
    title: 'Curated Quotes & Insights | PM Intelligence Engine',
    description: 'Search and explore curated quotes from top product leaders. Filter by philosophy zone and save your favorites.',
    url: `${baseUrl}/explore/insights`,
    siteName: 'PM Intelligence Engine',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Curated Quotes & Insights | PM Intelligence Engine',
    description: 'Search and explore curated quotes from top product leaders.'
  },
  alternates: {
    canonical: `${baseUrl}/explore/insights`
  }
};

export default function InsightsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
