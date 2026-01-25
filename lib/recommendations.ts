import { QuizAnswers, ZoneId, ZoneScores, Quote, EpisodeEnrichment, ContrarianCandidate } from './types';
import { calculateZoneScores, getZonePercentages } from './scoring';
import { getEpisodeEnrichment, getVerifiedEpisodeSlugs, getQuoteById } from './verifiedQuotes';
import { allEpisodes } from './allEpisodes';

/**
 * User's philosophy profile derived from quiz answers
 */
export interface UserProfile {
  zoneScores: ZoneScores;
  zonePercentages: Record<ZoneId, number>;
  primaryZone: ZoneId;
  secondaryZone: ZoneId;
  blindSpotZone: ZoneId;
  topZones: ZoneId[]; // Top 3-4 zones with >15%
}

/**
 * Enhanced quote with relevance score for matching
 */
interface ScoredQuote extends Quote {
  relevanceScore: number;
  matchedZones: ZoneId[];
}

/**
 * Episode with alignment score and matching quotes
 */
export interface EpisodeAlignment {
  slug: string;
  guest: string;
  title: string;
  alignmentScore: number;        // 0-100
  matchingQuotes: Quote[];       // Best matching quotes for user's philosophy
  matchReason: string;           // Human-readable explanation with quote insight
  episodeZones: Record<ZoneId, number>; // Episode's zone influence
  contrarian?: {                 // For contrarian recommendations
    quote: Quote;
    why: string;
  };
  guestType?: string;            // For diversity: founder, operator, investor
}

/**
 * Complete recommendation set for a user
 */
export interface Recommendations {
  userProfile: UserProfile;
  primary: EpisodeAlignment[];     // Top matching episodes
  contrarian: EpisodeAlignment[];  // Challenging perspectives with provocative quotes
}

const ALL_ZONES: ZoneId[] = [
  'velocity', 'perfection', 'discovery', 'data',
  'intuition', 'alignment', 'chaos', 'focus'
];

/**
 * Calculate user profile from quiz answers
 */
export function calculateUserProfile(answers: QuizAnswers): UserProfile {
  const zoneScores = calculateZoneScores(answers);
  const zonePercentages = getZonePercentages(zoneScores);

  // Get sorted zones
  const sortedZones = Object.entries(zonePercentages)
    .sort((a, b) => b[1] - a[1]);

  const primaryZone = sortedZones[0][0] as ZoneId;
  const secondaryZone = sortedZones[1][0] as ZoneId;
  const blindSpotZone = sortedZones[sortedZones.length - 1][0] as ZoneId;

  // Get top zones (>15%) for matching
  const topZones = sortedZones
    .filter(([_, pct]) => pct > 15)
    .map(([zone]) => zone as ZoneId);

  return {
    zoneScores,
    zonePercentages,
    primaryZone,
    secondaryZone,
    blindSpotZone,
    topZones,
  };
}

/**
 * Calculate quote relevance score based on user's zone profile
 * Higher score = better match with user's philosophy
 */
function scoreQuoteRelevance(
  quote: Quote,
  userProfile: UserProfile
): ScoredQuote {
  let relevanceScore = 0;
  const matchedZones: ZoneId[] = [];

  for (const zone of quote.zones) {
    const userStrength = userProfile.zonePercentages[zone] || 0;

    if (userStrength > 0) {
      matchedZones.push(zone);

      // Weight by how strong this zone is for the user
      if (zone === userProfile.primaryZone) {
        relevanceScore += 3.0 * (userStrength / 100);
      } else if (zone === userProfile.secondaryZone) {
        relevanceScore += 2.0 * (userStrength / 100);
      } else {
        relevanceScore += 1.0 * (userStrength / 100);
      }
    }
  }

  return {
    ...quote,
    relevanceScore,
    matchedZones,
  };
}

/**
 * Find the best matching quotes for a user from an episode
 * Returns quotes sorted by relevance, prioritizing primary/secondary zone matches
 */
function findBestMatchingQuotes(
  userProfile: UserProfile,
  episode: EpisodeEnrichment,
  maxQuotes: number = 2
): Quote[] {
  const quotes = episode.quotes ?? [];

  // Score all quotes
  const scoredQuotes = quotes
    .map(q => scoreQuoteRelevance(q, userProfile))
    .filter(sq => sq.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore);

  // Return top quotes
  return scoredQuotes.slice(0, maxQuotes);
}

/**
 * Generate a specific, actionable match reason that references quote insights
 */
function generateEnhancedMatchReason(
  userProfile: UserProfile,
  episode: EpisodeEnrichment,
  episodeZones: Record<ZoneId, number>,
  bestQuote?: Quote
): string {
  // Find the strongest shared zone
  const sharedZones = Object.entries(episodeZones)
    .filter(([zone, influence]) => {
      const userStrength = userProfile.zonePercentages[zone as ZoneId];
      return influence > 0.15 && userStrength > 20;
    })
    .sort((a, b) => b[1] - a[1]);

  // Get episode guest name
  const episodeData = allEpisodes.find(ep => ep.slug === episode.slug || ep.slug === (episode as any).episode_slug);
  const guestName = episodeData?.guest?.split(' ')[0] || 'This guest'; // First name only

  // If we have a good quote, reference it in the match reason
  if (bestQuote && bestQuote.text.length > 50) {
    // Extract a key phrase from the quote (first meaningful sentence or clause)
    const snippet = bestQuote.text.split(/[.!?]/)[0];
    const shortSnippet = snippet.length > 80
      ? snippet.substring(0, 77) + '...'
      : snippet;

    if (sharedZones.length > 0) {
      const zoneName = formatZoneName(sharedZones[0][0] as ZoneId);
      return `${guestName} on ${zoneName.toLowerCase()}: "${shortSnippet}"`;
    }
    return `${guestName}'s insight: "${shortSnippet}"`;
  }

  // Fallback to zone-based reason
  if (sharedZones.length === 0) {
    return `Aligns with your overall product philosophy`;
  } else if (sharedZones.length === 1) {
    return `${guestName} shares your emphasis on ${formatZoneName(sharedZones[0][0] as ZoneId).toLowerCase()}`;
  } else {
    return `${guestName} shares your focus on ${formatZoneName(sharedZones[0][0] as ZoneId).toLowerCase()} and ${formatZoneName(sharedZones[1][0] as ZoneId).toLowerCase()}`;
  }
}

/**
 * Format zone name for display
 */
function formatZoneName(zone: ZoneId): string {
  const names: Record<ZoneId, string> = {
    velocity: 'Speed',
    perfection: 'Craft',
    discovery: 'Discovery',
    data: 'Data',
    intuition: 'Intuition',
    alignment: 'Alignment',
    chaos: 'Adaptability',
    focus: 'Focus',
  };
  return names[zone] || zone;
}

/**
 * Calculate enhanced alignment score with depth bonuses
 */
function calculateEnhancedAlignmentScore(
  userProfile: UserProfile,
  episodeZones: Record<ZoneId, number>
): number {
  let baseScore = 0;
  let depthBonus = 0;
  let zonesMatched = 0;

  // Calculate base alignment (dot product)
  for (const zone of ALL_ZONES) {
    const userStrength = userProfile.zonePercentages[zone] / 100;
    const episodeStrength = episodeZones[zone] || 0;

    if (userStrength > 0.1 && episodeStrength > 0.1) {
      zonesMatched++;
    }

    baseScore += userStrength * episodeStrength;
  }

  // Primary zone depth bonus (episode very strong in user's #1 zone)
  const primaryStrength = episodeZones[userProfile.primaryZone] || 0;
  if (primaryStrength > 0.25) {
    depthBonus += 0.3; // Big bonus for depth
  } else if (primaryStrength > 0.15) {
    depthBonus += 0.15;
  }

  // Secondary zone bonus
  const secondaryStrength = episodeZones[userProfile.secondaryZone] || 0;
  if (secondaryStrength > 0.15) {
    depthBonus += 0.1;
  }

  // Breadth bonus: reward episodes that match multiple user zones
  if (zonesMatched >= 3) {
    depthBonus += 0.05;
  }

  // Combine and normalize to 0-100
  const rawScore = baseScore + depthBonus;

  // Better normalization: scale to use more of the 0-100 range
  // Max theoretical raw score ~0.75, we want 70-95 for top matches
  const normalizedScore = Math.min(100, Math.round(rawScore * 120));

  return normalizedScore;
}

/**
 * Find best contrarian quote from episode's contrarian_candidates
 * Prioritizes quotes that challenge the user's PRIMARY zone
 */
function findBestContrarianQuote(
  userProfile: UserProfile,
  episode: EpisodeEnrichment
): { quote: Quote; why: string } | null {
  const candidates = (episode as any).contrarian_candidates as ContrarianCandidate[] | undefined;

  if (!candidates || candidates.length === 0) {
    return null;
  }

  // Score each contrarian candidate
  const scoredCandidates = candidates.map(candidate => {
    let score = 0;

    // Prioritize quotes that challenge user's primary zone
    if (candidate.related_zones.includes(userProfile.primaryZone)) {
      score += 3;
    }

    // Also good if it challenges secondary zone
    if (candidate.related_zones.includes(userProfile.secondaryZone)) {
      score += 2;
    }

    // Boost if related to user's blind spot (offers perspective they lack)
    if (candidate.related_zones.includes(userProfile.blindSpotZone)) {
      score += 1;
    }

    return { candidate, score };
  }).sort((a, b) => b.score - a.score);

  // Get the best candidate
  const best = scoredCandidates[0];
  if (!best) return null;

  // Find the actual quote
  const quote = (episode.quotes ?? []).find(q => q.id === best.candidate.quoteId);
  if (!quote) return null;

  return {
    quote,
    why: best.candidate.why,
  };
}

/**
 * Calculate diversity score to avoid recommending similar episodes
 * Returns penalty (0-1) where higher = more similar to existing recommendations
 */
function calculateSimilarityPenalty(
  episode: EpisodeEnrichment,
  episodeZones: Record<ZoneId, number>,
  existingRecommendations: EpisodeAlignment[]
): number {
  if (existingRecommendations.length === 0) return 0;

  let maxSimilarity = 0;

  for (const existing of existingRecommendations) {
    let similarity = 0;

    // Check zone overlap
    for (const zone of ALL_ZONES) {
      const thisStrength = episodeZones[zone] || 0;
      const existingStrength = existing.episodeZones[zone] || 0;

      // Both strong in same zone = similar
      if (thisStrength > 0.2 && existingStrength > 0.2) {
        similarity += 0.1;
      }
    }

    maxSimilarity = Math.max(maxSimilarity, similarity);
  }

  return Math.min(0.3, maxSimilarity); // Cap at 30% penalty
}

/**
 * Calculate episode alignment with enhanced scoring and diversity
 */
export function calculateEpisodeAlignment(
  userProfile: UserProfile,
  slug: string,
  existingRecommendations: EpisodeAlignment[] = []
): EpisodeAlignment | null {
  const episode = getEpisodeEnrichment(slug);
  if (!episode) return null;

  const episodeMetadata = allEpisodes.find(ep => ep.slug === slug);
  if (!episodeMetadata) return null;

  const episodeZones: Record<ZoneId, number> =
    (episode as any).zoneInfluence || (episode as any).zone_influence || {};

  // Calculate base alignment
  let alignmentScore = calculateEnhancedAlignmentScore(userProfile, episodeZones);

  // Apply diversity penalty
  const similarityPenalty = calculateSimilarityPenalty(episode, episodeZones, existingRecommendations);
  alignmentScore = Math.round(alignmentScore * (1 - similarityPenalty));

  // Find best matching quotes
  const matchingQuotes = findBestMatchingQuotes(userProfile, episode, 2);

  // Generate enhanced match reason with quote insight
  const matchReason = generateEnhancedMatchReason(
    userProfile,
    episode,
    episodeZones,
    matchingQuotes[0]
  );

  return {
    slug,
    guest: episodeMetadata.guest,
    title: episodeMetadata.title,
    alignmentScore,
    matchingQuotes,
    matchReason,
    episodeZones,
  };
}

/**
 * Generate complete recommendations for a user with enhanced matching
 */
export function generateRecommendations(answers: QuizAnswers): Recommendations {
  const userProfile = calculateUserProfile(answers);
  const verifiedSlugs = getVerifiedEpisodeSlugs();

  // Calculate initial alignments for all episodes (no diversity penalty yet)
  const initialAlignments = verifiedSlugs
    .map(slug => {
      const episode = getEpisodeEnrichment(slug);
      if (!episode) return null;

      const episodeMetadata = allEpisodes.find(ep => ep.slug === slug);
      if (!episodeMetadata) return null;

      const episodeZones: Record<ZoneId, number> =
        (episode as any).zoneInfluence || (episode as any).zone_influence || {};

      const alignmentScore = calculateEnhancedAlignmentScore(userProfile, episodeZones);
      const matchingQuotes = findBestMatchingQuotes(userProfile, episode, 2);
      const matchReason = generateEnhancedMatchReason(
        userProfile,
        episode,
        episodeZones,
        matchingQuotes[0]
      );

      return {
        slug,
        guest: episodeMetadata.guest,
        title: episodeMetadata.title,
        alignmentScore,
        matchingQuotes,
        matchReason,
        episodeZones,
        episode, // Keep reference for diversity calculation
      };
    })
    .filter((a): a is NonNullable<typeof a> => a !== null);

  // Build primary recommendations with diversity
  const primary: EpisodeAlignment[] = [];
  const sortedAlignments = [...initialAlignments].sort((a, b) => b.alignmentScore - a.alignmentScore);

  for (const alignment of sortedAlignments) {
    if (primary.length >= 5) break;

    // Apply diversity penalty based on already-selected recommendations
    const penalty = calculateSimilarityPenalty(
      alignment.episode,
      alignment.episodeZones,
      primary
    );
    const adjustedScore = Math.round(alignment.alignmentScore * (1 - penalty));

    // Only skip if penalty makes it much worse than current cutoff
    if (primary.length >= 3 && adjustedScore < primary[primary.length - 1].alignmentScore * 0.7) {
      continue;
    }

    const { episode, ...rest } = alignment;
    primary.push({ ...rest, alignmentScore: adjustedScore });
  }

  // Sort by adjusted score
  primary.sort((a, b) => b.alignmentScore - a.alignmentScore);

  // Build contrarian recommendations using contrarian_candidates
  const primarySlugs = new Set(primary.map(ep => ep.slug));

  const contrarian: EpisodeAlignment[] = [];

  for (const alignment of initialAlignments) {
    if (primarySlugs.has(alignment.slug)) continue;
    if (contrarian.length >= 3) break;

    const episode = getEpisodeEnrichment(alignment.slug);
    if (!episode) continue;

    // Find the best contrarian quote for this user
    const contrarianData = findBestContrarianQuote(userProfile, episode);
    if (!contrarianData) continue;

    // Check if episode is strong in user's blind spot
    const blindSpotStrength = alignment.episodeZones[userProfile.blindSpotZone] || 0;

    // Prioritize episodes with both:
    // 1. Good contrarian quotes
    // 2. Strong in user's blind spot
    const contrarianScore = (blindSpotStrength > 0.15 ? 2 : 1) +
                           (contrarianData.quote.zones.includes(userProfile.primaryZone) ? 1 : 0);

    const { episode: _, ...rest } = alignment;
    contrarian.push({
      ...rest,
      matchingQuotes: [contrarianData.quote], // Use contrarian quote instead
      matchReason: `Challenges your thinking: "${contrarianData.why}"`,
      contrarian: contrarianData,
    });
  }

  // Sort contrarian by how relevant they are to challenging user's views
  contrarian.sort((a, b) => {
    const aBlindSpot = a.episodeZones[userProfile.blindSpotZone] || 0;
    const bBlindSpot = b.episodeZones[userProfile.blindSpotZone] || 0;
    return bBlindSpot - aBlindSpot;
  });

  return {
    userProfile,
    primary: primary.slice(0, 5),
    contrarian: contrarian.slice(0, 3),
  };
}

/**
 * Get a description of user's blind spot for contrarian section header
 */
export function getBlindSpotDescription(zoneId: ZoneId): string {
  const descriptions: Record<ZoneId, string> = {
    velocity: 'These perspectives challenge you to embrace speed and iteration',
    perfection: 'These perspectives highlight the power of craft and attention to detail',
    discovery: 'These perspectives emphasize user research and validation you might skip',
    data: 'These perspectives show how metrics and experimentation can guide decisions',
    intuition: 'These perspectives celebrate vision and taste over pure analysis',
    alignment: 'These perspectives demonstrate the value of consensus and buy-in',
    chaos: 'These perspectives embrace uncertainty and radical adaptability',
    focus: 'These perspectives advocate ruthless prioritization you might resist',
  };

  return descriptions[zoneId];
}
