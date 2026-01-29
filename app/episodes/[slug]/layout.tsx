import { Metadata } from 'next';
import { getEpisodeBySlug } from '@/lib/allEpisodes';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const episode = getEpisodeBySlug(params.slug);
  
  if (!episode) {
    return {
      title: 'Episode Not Found - PM Intelligence Engine',
    };
  }

  const title = `${episode.guest} | PM Intelligence Engine`;
  const description = episode.description || `AI-curated insights from ${episode.guest}`;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://lenny.productbuilder.net';
  const ogImageUrl = `${baseUrl}/og/${episode.slug}.png`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/episodes/${episode.slug}`,
      siteName: 'PM Intelligence Engine',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${episode.guest} - PM Intelligence Engine`,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
      creator: '@joydeepsarkar',
    },
  };
}

export default function EpisodeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
