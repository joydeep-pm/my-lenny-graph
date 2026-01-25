'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Quote, Lightbulb } from 'lucide-react';
import { EpisodeAlignment } from '@/lib/recommendations';

interface Props {
  episode: EpisodeAlignment;
  index: number;
  variant?: 'primary' | 'contrarian';
}

export default function EpisodeRecommendationCard({ episode, index, variant = 'primary' }: Props) {
  const isPrimary = variant === 'primary';
  const isContrarian = variant === 'contrarian';

  // Get the most relevant quote to display
  const displayQuote = episode.matchingQuotes?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group"
    >
      <Link
        href={`/episodes/${episode.slug}`}
        className={`block p-6 border-2 transition-all hover:bg-void ${
          isContrarian
            ? 'border-crimson/30 bg-crimson/5 hover:border-crimson'
            : 'border-ash-darker bg-void-light hover:border-amber'
        }`}
      >
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className={`text-xl font-bold transition-colors ${
              isContrarian
                ? 'text-crimson group-hover:text-crimson/80'
                : 'text-amber group-hover:text-amber-dark'
            }`}>
              {episode.guest}
            </h3>
            {isPrimary && (
              <div className="flex-shrink-0 ml-4 px-3 py-1 bg-amber/10 border border-amber/30 text-amber text-xs font-mono">
                RECOMMENDED
              </div>
            )}
            {isContrarian && (
              <div className="flex-shrink-0 ml-4 px-3 py-1 bg-crimson/10 border border-crimson/30 text-crimson text-xs font-mono">
                PERSPECTIVE
              </div>
            )}
          </div>
          <p className="text-sm text-ash-dark line-clamp-2">
            {episode.title}
          </p>
        </div>

        {/* Match Reason - Enhanced with quote snippets */}
        {episode.matchReason && (
          <div className={`mb-4 flex items-start gap-2 ${
            isContrarian ? 'text-crimson/80' : 'text-ash'
          }`}>
            {isContrarian && (
              <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5" />
            )}
            <p className="text-sm leading-relaxed">
              {episode.matchReason}
            </p>
          </div>
        )}

        {/* Matching Quote Preview */}
        {displayQuote && displayQuote.text && (
          <div className={`border-l-2 pl-4 mb-4 ${
            isContrarian ? 'border-crimson/30' : 'border-amber/30'
          }`}>
            <div className="flex items-start gap-2">
              <Quote className={`w-4 h-4 flex-shrink-0 mt-1 ${
                isContrarian ? 'text-crimson' : 'text-amber'
              }`} />
              <p className="text-sm text-ash-dark italic line-clamp-3">
                "{displayQuote.text.length > 200
                  ? displayQuote.text.substring(0, 197) + '...'
                  : displayQuote.text}"
              </p>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className={`flex items-center gap-2 text-sm font-mono group-hover:gap-3 transition-all ${
          isContrarian ? 'text-crimson' : 'text-amber'
        }`}>
          <span>{isPrimary ? 'Listen to Episode' : 'Explore This Perspective'}</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </Link>
    </motion.div>
  );
}
