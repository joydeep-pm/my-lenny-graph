'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Quote } from 'lucide-react';
import { EpisodeAlignment } from '@/lib/recommendations';

interface Props {
  episode: EpisodeAlignment;
  index: number;
  variant?: 'primary' | 'contrarian';
}

export default function EpisodeRecommendationCard({ episode, index, variant = 'primary' }: Props) {
  const isPrimary = variant === 'primary';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group"
    >
      <Link
        href={`/episodes/${episode.slug}`}
        className="block p-6 border-2 border-ash-darker bg-void-light hover:border-amber transition-all hover:bg-void"
      >
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xl font-bold text-amber group-hover:text-amber-dark transition-colors">
              {episode.guest}
            </h3>
            {isPrimary && (
              <div className="flex-shrink-0 ml-4 px-3 py-1 bg-amber/10 border border-amber/30 text-amber text-xs font-mono">
                RECOMMENDED
              </div>
            )}
          </div>
          <p className="text-sm text-ash-dark line-clamp-2">
            {episode.title}
          </p>
        </div>

        {/* Match Reason */}
        {episode.matchReason && (
          <p className="text-sm text-ash mb-4">
            {episode.matchReason}
          </p>
        )}

        {/* Matching Quote (if available) */}
        {episode.matchingQuotes && episode.matchingQuotes.length > 0 && (
          <div className="border-l-2 border-amber/30 pl-4 mb-4">
            <div className="flex items-start gap-2">
              <Quote className="w-4 h-4 text-amber flex-shrink-0 mt-1" />
              <p className="text-sm text-ash-dark italic line-clamp-2">
                "{episode.matchingQuotes[0].text}"
              </p>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="flex items-center gap-2 text-sm text-amber font-mono group-hover:gap-3 transition-all">
          <span>{isPrimary ? 'Listen to Episode' : 'Explore Different Perspective'}</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </Link>
    </motion.div>
  );
}
