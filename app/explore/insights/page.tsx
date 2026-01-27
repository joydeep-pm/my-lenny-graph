'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Quote, ArrowRight, Shuffle, ChevronLeft, Filter } from 'lucide-react';
import InteractiveSpace from '@/components/InteractiveSpace';
import TopNav from '@/components/TopNav';
import { zones } from '@/lib/zones';
import { ZoneId } from '@/lib/types';
import { getAllVerifiedQuotes, getRegistryInfo, getEpisodeEnrichment } from '@/lib/verifiedQuotes';
import { allEpisodes } from '@/lib/allEpisodes';
import {
  getFavoriteQuotes,
  toggleFavoriteQuote,
  isQuoteFavorited,
  getFavoriteEpisodes,
  toggleFavoriteEpisode,
  isEpisodeFavorited,
  FavoriteQuote
} from '@/lib/favorites';

const ZONE_IDS: ZoneId[] = ['velocity', 'perfection', 'discovery', 'data', 'intuition', 'alignment', 'chaos', 'focus'];

export default function InsightsPage() {
  const [selectedZone, setSelectedZone] = useState<ZoneId | 'all' | 'favorites' | 'fav-episodes'>('all');
  const [favoriteQuoteIds, setFavoriteQuoteIds] = useState<Set<string>>(new Set());
  const [favoriteEpisodeSlugs, setFavoriteEpisodeSlugs] = useState<Set<string>>(new Set());
  const [randomQuote, setRandomQuote] = useState<typeof allQuotes[0] | null>(null);

  const allQuotes = useMemo(() => getAllVerifiedQuotes(), []);
  const registryInfo = useMemo(() => getRegistryInfo(), []);

  // Load favorites on mount
  useEffect(() => {
    const loadFavorites = () => {
      const quoteIds = new Set(getFavoriteQuotes().map(f => f.quoteId));
      const episodeSlugs = new Set(getFavoriteEpisodes().map(f => f.slug));
      setFavoriteQuoteIds(quoteIds);
      setFavoriteEpisodeSlugs(episodeSlugs);
    };
    loadFavorites();

    // Listen for storage changes from other tabs
    window.addEventListener('storage', loadFavorites);
    return () => window.removeEventListener('storage', loadFavorites);
  }, []);

  // Set random quote on mount
  useEffect(() => {
    if (allQuotes.length > 0) {
      const idx = Math.floor(Math.random() * allQuotes.length);
      setRandomQuote(allQuotes[idx]);
    }
  }, [allQuotes]);

  const shuffleQuote = useCallback(() => {
    if (allQuotes.length <= 1) return;

    // Ensure we pick a different quote
    let newIdx: number;
    let attempts = 0;
    do {
      newIdx = Math.floor(Math.random() * allQuotes.length);
      attempts++;
    } while (randomQuote && allQuotes[newIdx].id === randomQuote.id && attempts < 10);

    setRandomQuote(allQuotes[newIdx]);
  }, [allQuotes, randomQuote]);

  // Filter quotes by zone
  const filteredQuotes = useMemo(() => {
    if (selectedZone === 'all' || selectedZone === 'fav-episodes') return allQuotes;
    if (selectedZone === 'favorites') {
      return allQuotes.filter(q => favoriteQuoteIds.has(q.id));
    }
    return allQuotes.filter(q => q.zones.includes(selectedZone));
  }, [allQuotes, selectedZone, favoriteQuoteIds]);

  // Group quotes by episode
  const episodeGroups = useMemo(() => {
    const groups: Record<string, typeof allQuotes> = {};
    filteredQuotes.forEach(quote => {
      const slug = quote.source.slug;
      if (!groups[slug]) groups[slug] = [];
      groups[slug].push(quote);
    });

    // Sort by number of quotes (most first)
    let entries = Object.entries(groups).sort((a, b) => b[1].length - a[1].length);

    // Filter by favorite episodes if that filter is active
    if (selectedZone === 'fav-episodes') {
      entries = entries.filter(([slug]) => favoriteEpisodeSlugs.has(slug));
    }

    return entries.map(([slug, quotes]) => {
      const episode = allEpisodes.find(ep => ep.slug === slug);
      const enrichment = getEpisodeEnrichment(slug);
      return {
        slug,
        guest: episode?.guest || slug,
        quotes,
        zoneInfluence: enrichment?.zone_influence || {},
        takeaways: enrichment?.takeaways || []
      };
    });
  }, [filteredQuotes, selectedZone, favoriteEpisodeSlugs]);

  const handleToggleQuoteFavorite = (quote: typeof allQuotes[0]) => {
    const isFavorited = toggleFavoriteQuote({
      quoteId: quote.id,
      text: quote.text,
      speaker: quote.speaker,
      episodeSlug: quote.source.slug,
      timestamp: quote.timestamp
    });

    setFavoriteQuoteIds(prev => {
      const next = new Set(prev);
      if (isFavorited) {
        next.add(quote.id);
      } else {
        next.delete(quote.id);
      }
      return next;
    });
  };

  const handleToggleEpisodeFavorite = (slug: string, guest: string) => {
    const isFavorited = toggleFavoriteEpisode({ slug, guest });

    setFavoriteEpisodeSlugs(prev => {
      const next = new Set(prev);
      if (isFavorited) {
        next.add(slug);
      } else {
        next.delete(slug);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-void text-ash font-mono">
      <InteractiveSpace />
      <TopNav />

      {/* Scanlines */}
      <div className="fixed inset-0 pointer-events-none z-20 opacity-5">
        <div className="w-full h-full bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#ffb347_2px,#ffb347_4px)]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen px-4 pt-20 pb-12 md:pt-24 md:pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Back Link */}
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 text-ash-dark hover:text-amber transition-colors mb-6 text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Explore
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2 text-amber text-xs tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>CURATED INSIGHTS</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-amber mb-4">
              {registryInfo.quoteCount.toLocaleString()} VERIFIED QUOTES
            </h1>
            <p className="text-ash text-lg max-w-2xl leading-relaxed">
              Hand-curated insights from {registryInfo.episodeCount} episodes.
              Filter by philosophy zone, save your favorites, or get inspired.
            </p>
          </motion.div>

          {/* Random Quote Card */}
          {randomQuote && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-10 p-6 border-2 border-amber/30 bg-gradient-to-br from-amber/10 to-transparent relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber/5 rounded-full blur-3xl" />
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-2 text-amber text-xs tracking-wider">
                  <Quote className="w-4 h-4" />
                  <span>INSPIRE ME</span>
                </div>
                <button
                  onClick={shuffleQuote}
                  className="flex items-center gap-2 px-3 py-1.5 border border-amber/50 text-amber text-xs hover:bg-amber hover:text-void transition-all"
                >
                  <Shuffle className="w-3 h-3" />
                  SHUFFLE
                </button>
              </div>
              <blockquote className="text-xl md:text-2xl text-ash leading-relaxed mb-4 relative z-10">
                "{randomQuote.text}"
              </blockquote>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-amber font-bold">{randomQuote.speaker}</div>
                  <Link
                    href={`/episodes/${randomQuote.source.slug}`}
                    className="text-xs text-ash-dark hover:text-amber transition-colors"
                  >
                    View Episode →
                  </Link>
                </div>
                <button
                  onClick={() => handleToggleQuoteFavorite(randomQuote)}
                  className={`p-2 border-2 transition-all ${
                    favoriteQuoteIds.has(randomQuote.id)
                      ? 'border-rose-400 bg-rose-400/20 text-rose-400'
                      : 'border-ash-darker text-ash-dark hover:border-rose-400 hover:text-rose-400'
                  }`}
                  title={favoriteQuoteIds.has(randomQuote.id) ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart className={`w-5 h-5 ${favoriteQuoteIds.has(randomQuote.id) ? 'fill-current' : ''}`} />
                </button>
              </div>
            </motion.div>
          )}

          {/* Zone Filter Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-3 text-xs text-ash-dark">
              <Filter className="w-3 h-3" />
              <span>FILTER BY ZONE</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedZone('all')}
                className={`px-4 py-2 border-2 text-sm font-bold transition-all ${
                  selectedZone === 'all'
                    ? 'border-amber bg-amber text-void'
                    : 'border-ash-darker text-ash hover:border-amber hover:text-amber'
                }`}
              >
                ALL ({allQuotes.length})
              </button>
              <button
                onClick={() => setSelectedZone('favorites')}
                className={`px-4 py-2 border-2 text-sm font-bold transition-all flex items-center gap-2 ${
                  selectedZone === 'favorites'
                    ? 'border-rose-400 bg-rose-400 text-void'
                    : 'border-ash-darker text-ash hover:border-rose-400 hover:text-rose-400'
                }`}
              >
                <Heart className="w-3 h-3" />
                <span className="hidden sm:inline">SAVED</span> QUOTES ({favoriteQuoteIds.size})
              </button>
              <button
                onClick={() => setSelectedZone('fav-episodes')}
                className={`px-4 py-2 border-2 text-sm font-bold transition-all flex items-center gap-2 ${
                  selectedZone === 'fav-episodes'
                    ? 'border-rose-400 bg-rose-400 text-void'
                    : 'border-ash-darker text-ash hover:border-rose-400 hover:text-rose-400'
                }`}
              >
                <Heart className="w-3 h-3" />
                <span className="hidden sm:inline">SAVED</span> EPISODES ({favoriteEpisodeSlugs.size})
              </button>
              {ZONE_IDS.map(zoneId => {
                const zone = zones[zoneId];
                const count = allQuotes.filter(q => q.zones.includes(zoneId)).length;
                return (
                  <button
                    key={zoneId}
                    onClick={() => setSelectedZone(zoneId)}
                    className={`px-4 py-2 border-2 text-sm font-bold transition-all flex items-center gap-2 ${
                      selectedZone === zoneId
                        ? 'border-amber bg-amber text-void'
                        : 'border-ash-darker text-ash hover:border-amber hover:text-amber'
                    }`}
                    style={{
                      borderColor: selectedZone === zoneId ? zone.color : undefined,
                      backgroundColor: selectedZone === zoneId ? zone.color : undefined
                    }}
                  >
                    <span>{zone.icon}</span>
                    <span className="hidden sm:inline">{zone.name.toUpperCase()}</span>
                    <span className="text-xs opacity-75">({count})</span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Results Count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6 text-amber text-sm font-bold"
          >
            {episodeGroups.length} episode{episodeGroups.length !== 1 ? 's' : ''} •{' '}
            {filteredQuotes.length} quote{filteredQuotes.length !== 1 ? 's' : ''}
          </motion.div>

          {/* Episode Cards with Quotes */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <AnimatePresence mode="popLayout">
              {episodeGroups.map((group, idx) => (
                <motion.div
                  key={group.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: idx * 0.05 }}
                  className="border-2 border-ash-darker bg-void-light hover:border-amber/50 transition-all"
                >
                  {/* Episode Header */}
                  <div className="p-4 border-b border-ash-darker flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Link
                        href={`/episodes/${group.slug}`}
                        className="text-xl font-bold text-amber hover:text-amber-dark transition-colors"
                      >
                        {group.guest}
                      </Link>
                      <span className="text-xs text-ash-dark font-mono">
                        {group.quotes.length} quotes
                      </span>
                      {/* Zone badges */}
                      <div className="hidden md:flex gap-1">
                        {Object.entries(group.zoneInfluence)
                          .sort((a, b) => (b[1] as number) - (a[1] as number))
                          .slice(0, 3)
                          .map(([zoneId]) => {
                            const zone = zones[zoneId as ZoneId];
                            if (!zone) return null;
                            return (
                              <span
                                key={zoneId}
                                className="px-2 py-0.5 text-xs border"
                                style={{ borderColor: zone.color, color: zone.color }}
                                title={zone.name}
                              >
                                {zone.icon}
                              </span>
                            );
                          })}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleEpisodeFavorite(group.slug, group.guest)}
                        className={`p-2 border transition-all ${
                          favoriteEpisodeSlugs.has(group.slug)
                            ? 'border-rose-400 bg-rose-400/20 text-rose-400'
                            : 'border-ash-darker text-ash-dark hover:border-rose-400 hover:text-rose-400'
                        }`}
                        title={favoriteEpisodeSlugs.has(group.slug) ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <Heart className={`w-4 h-4 ${favoriteEpisodeSlugs.has(group.slug) ? 'fill-current' : ''}`} />
                      </button>
                      <Link
                        href={`/episodes/${group.slug}`}
                        className="px-3 py-2 border border-amber/50 text-amber text-xs hover:bg-amber hover:text-void transition-all flex items-center gap-1"
                      >
                        VIEW <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>

                  {/* Quotes List */}
                  <div className="divide-y divide-ash-darker/50">
                    {group.quotes.slice(0, 3).map(quote => (
                      <div
                        key={quote.id}
                        className="p-4 hover:bg-amber/5 transition-colors group"
                      >
                        <div className="flex items-start gap-3">
                          <Quote className="w-4 h-4 text-amber/50 mt-1 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-ash leading-relaxed mb-2">
                              "{quote.text}"
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex flex-wrap gap-1">
                                {quote.themes.slice(0, 3).map(theme => (
                                  <span
                                    key={theme}
                                    className="px-2 py-0.5 text-xs border border-ash-darker text-ash-dark"
                                  >
                                    {theme}
                                  </span>
                                ))}
                              </div>
                              <button
                                onClick={() => handleToggleQuoteFavorite(quote)}
                                className={`p-1.5 opacity-0 group-hover:opacity-100 transition-all ${
                                  favoriteQuoteIds.has(quote.id)
                                    ? 'opacity-100 text-rose-400'
                                    : 'text-ash-dark hover:text-rose-400'
                                }`}
                                title={favoriteQuoteIds.has(quote.id) ? 'Remove from favorites' : 'Add to favorites'}
                              >
                                <Heart className={`w-4 h-4 ${favoriteQuoteIds.has(quote.id) ? 'fill-current' : ''}`} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {group.quotes.length > 3 && (
                      <Link
                        href={`/episodes/${group.slug}`}
                        className="block p-4 text-center text-sm text-amber hover:bg-amber/10 transition-colors"
                      >
                        + {group.quotes.length - 3} more quotes →
                      </Link>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty State for Favorite Quotes */}
          {selectedZone === 'favorites' && favoriteQuoteIds.size === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Heart className="w-12 h-12 text-ash-dark mx-auto mb-4" />
              <div className="text-xl text-ash mb-2">No favorite quotes yet</div>
              <div className="text-sm text-ash-dark mb-6">
                Click the heart icon on any quote to save it here
              </div>
              <button
                onClick={() => setSelectedZone('all')}
                className="px-6 py-3 border-2 border-amber text-amber hover:bg-amber hover:text-void transition-all font-bold"
              >
                BROWSE ALL QUOTES
              </button>
            </motion.div>
          )}

          {/* Empty State for Favorite Episodes */}
          {selectedZone === 'fav-episodes' && favoriteEpisodeSlugs.size === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Heart className="w-12 h-12 text-ash-dark mx-auto mb-4" />
              <div className="text-xl text-ash mb-2">No favorite episodes yet</div>
              <div className="text-sm text-ash-dark mb-6">
                Click the heart icon on any episode card to save it here
              </div>
              <button
                onClick={() => setSelectedZone('all')}
                className="px-6 py-3 border-2 border-amber text-amber hover:bg-amber hover:text-void transition-all font-bold"
              >
                BROWSE ALL EPISODES
              </button>
            </motion.div>
          )}

          {/* Footer Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-16 pt-8 border-t-2 border-ash-darker text-center"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div>
                <div className="text-3xl font-bold text-amber mb-1">{registryInfo.episodeCount}</div>
                <div className="text-xs text-ash tracking-wider">CURATED EPISODES</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-amber mb-1">{registryInfo.quoteCount.toLocaleString()}</div>
                <div className="text-xs text-ash tracking-wider">VERIFIED QUOTES</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-rose-400 mb-1">{favoriteQuoteIds.size}</div>
                <div className="text-xs text-ash tracking-wider">SAVED QUOTES</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-rose-400 mb-1">{favoriteEpisodeSlugs.size}</div>
                <div className="text-xs text-ash tracking-wider">SAVED EPISODES</div>
              </div>
            </div>
            <Link
              href="/explore"
              className="text-sm text-ash-dark hover:text-amber transition-colors"
            >
              ← Back to all 295 episodes
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
