import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://lenny.productbuilder.net';

export const metadata: Metadata = {
  title: 'Explore 295 Episodes | PM Intelligence Engine',
  description: 'Browse 295 AI-curated podcast episodes featuring product leaders, growth experts, and innovators. Searchable transcripts, verified quotes, and insights.',
  keywords: [
    'product management',
    'growth',
    'leadership',
    'podcasts',
    'transcripts',
    'PM Intelligence Engine',
    'product leaders',
    'startup advice'
  ],
  openGraph: {
    title: 'Explore 295 Episodes | PM Intelligence Engine',
    description: 'Browse 295 episodes with searchable transcripts, verified quotes, and insights from product and growth leaders.',
    url: `${baseUrl}/explore`,
    siteName: 'PM Intelligence Engine',
    images: [
      {
        url: `${baseUrl}/explore-og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Explore PM Intelligence Engine Episodes'
      }
    ],
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Explore 295 Episodes | PM Intelligence Engine',
    description: 'Browse 295 episodes with searchable transcripts, verified quotes, and insights from product and growth leaders.',
    images: [`${baseUrl}/explore-og-image.png`]
  }
};

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
