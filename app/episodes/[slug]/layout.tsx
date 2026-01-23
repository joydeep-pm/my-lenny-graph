import { Metadata } from 'next';
import { getEpisodeBySlug } from '@/lib/allEpisodes';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const episode = getEpisodeBySlug(params.slug);
  
  if (!episode) {
    return {
      title: 'Episode Not Found - Lenny\'s Podcast Philosophy',
    };
  }

  const title = `${episode.guest} - Lenny's Podcast | PM Philosophy`;
  const description = episode.description || `Listen to ${episode.guest} on Lenny's Podcast`;
  const ogImageUrl = `/og/${episode.slug}.png`;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://lenny.productbuilder.net';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/episodes/${episode.slug}`,
      siteName: 'PM Philosophy Quiz',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${episode.guest} on Lenny's Podcast`,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
      creator: '@lennysan',
    },
  };
}

export default function EpisodeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
