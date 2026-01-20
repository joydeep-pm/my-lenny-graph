const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const EPISODES_DIR = path.join(__dirname, '..', 'episodes');
const OUTPUT_FILE = path.join(__dirname, '..', 'lib', 'insightsData.ts');
const PROGRESS_FILE = path.join(__dirname, 'extraction-progress.json');

// The 8 cosmic zones
const ZONES = [
  'velocity',
  'perfection',
  'discovery',
  'data',
  'intuition',
  'alignment',
  'chaos',
  'focus'
];

// Load progress
function loadProgress() {
  if (fs.existsSync(PROGRESS_FILE)) {
    return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
  }
  return {
    processed: [],
    failed: [],
    lastProcessed: null,
    totalProcessed: 0
  };
}

// Save progress
function saveProgress(progress) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

// Get all episode slugs
function getAllEpisodes() {
  return fs.readdirSync(EPISODES_DIR)
    .filter(file => {
      const fullPath = path.join(EPISODES_DIR, file);
      return fs.statSync(fullPath).isDirectory();
    });
}

// Load transcript
function loadTranscript(slug) {
  try {
    const transcriptPath = path.join(EPISODES_DIR, slug, 'transcript.md');
    if (!fs.existsSync(transcriptPath)) {
      return null;
    }
    
    const fileContents = fs.readFileSync(transcriptPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    return {
      slug,
      metadata: data,
      content
    };
  } catch (error) {
    console.error(`Error loading ${slug}:`, error.message);
    return null;
  }
}

// Extract insights from transcript using pattern matching
function extractInsights(transcript) {
  const insights = {
    slug: transcript.slug,
    guest: transcript.metadata.guest,
    contrarianViews: extractContrarianViews(transcript.content),
    quotableMoments: extractQuotableMoments(transcript.content),
    decisions: extractDecisions(transcript.content),
    philosophyAlignment: estimatePhilosophyAlignment(transcript),
    frameworks: extractFrameworks(transcript.content)
  };
  
  return insights;
}

// Extract contrarian views
function extractContrarianViews(content) {
  const contrarianViews = [];
  const contrarianKeywords = [
    'disagree',
    'controversial',
    'unpopular opinion',
    'most people think',
    'contrary to',
    'challenge the',
    'go against',
    'opposite of',
    'most people get wrong',
    'conventional wisdom'
  ];
  
  // Split into dialogue sections
  const dialogueRegex = /^(.+?)\s\((\d{2}:\d{2}:\d{2})\):\s*(.+?)(?=\n\n|\n[A-Z]|$)/gms;
  let match;
  
  while ((match = dialogueRegex.exec(content)) !== null) {
    const [, speaker, timestamp, text] = match;
    const lowerText = text.toLowerCase();
    
    // Check for contrarian keywords
    if (contrarianKeywords.some(keyword => lowerText.includes(keyword))) {
      contrarianViews.push({
        quote: text.substring(0, 500).trim() + (text.length > 500 ? '...' : ''),
        speaker: speaker.trim(),
        timestamp,
        whyControversial: 'Challenges conventional thinking',
        relatedZones: []
      });
    }
  }
  
  return contrarianViews.slice(0, 5); // Top 5
}

// Extract quotable moments
function extractQuotableMoments(content) {
  const quotableMoments = [];
  const dialogueRegex = /^(.+?)\s\((\d{2}:\d{2}:\d{2})\):\s*(.+?)(?=\n\n|\n[A-Z]|$)/gms;
  let match;
  
  while ((match = dialogueRegex.exec(content)) !== null) {
    const [, speaker, timestamp, text] = match;
    
    // Look for short, impactful statements (under 280 chars)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    for (const sentence of sentences) {
      const trimmed = sentence.trim();
      if (trimmed.length > 50 && trimmed.length < 280) {
        // Check for quotable patterns
        if (
          /^(The|A|Every|Most|Great|Best|Never|Always)/i.test(trimmed) ||
          /you (should|must|need to|have to)/i.test(trimmed) ||
          /key|important|critical|essential/i.test(trimmed)
        ) {
          quotableMoments.push({
            quote: trimmed,
            speaker: speaker.trim(),
            timestamp,
            category: 'advice'
          });
        }
      }
    }
  }
  
  return quotableMoments.slice(0, 10); // Top 10
}

// Extract decisions
function extractDecisions(content) {
  const decisions = [];
  const decisionKeywords = [
    'we decided',
    'we chose',
    'decision to',
    'made the call',
    'decided to',
    'chose to',
    'made a decision'
  ];
  
  const dialogueRegex = /^(.+?)\s\((\d{2}:\d{2}:\d{2})\):\s*(.+?)(?=\n\n|\n[A-Z]|$)/gms;
  let match;
  
  while ((match = dialogueRegex.exec(content)) !== null) {
    const [, speaker, timestamp, text] = match;
    const lowerText = text.toLowerCase();
    
    if (decisionKeywords.some(keyword => lowerText.includes(keyword))) {
      decisions.push({
        decision: text.substring(0, 300).trim() + (text.length > 300 ? '...' : ''),
        context: '',
        rationale: '',
        outcome: '',
        timestamp
      });
    }
  }
  
  return decisions.slice(0, 5); // Top 5
}

// Estimate philosophy alignment based on keywords
function estimatePhilosophyAlignment(transcript) {
  const content = transcript.content.toLowerCase();
  const alignment = {};
  
  // Keyword mappings for each zone
  const zoneKeywords = {
    velocity: ['fast', 'speed', 'quick', 'iterate', 'ship', 'mvp', 'rapid'],
    perfection: ['detail', 'perfect', 'craft', 'polish', 'quality', 'beautiful', 'design'],
    discovery: ['user', 'research', 'customer', 'feedback', 'interview', 'validate'],
    data: ['metric', 'data', 'analytics', 'measure', 'experiment', 'test', 'ab test'],
    intuition: ['gut', 'intuition', 'instinct', 'feel', 'vision', 'believe'],
    alignment: ['stakeholder', 'consensus', 'alignment', 'communicate', 'buy-in'],
    chaos: ['adapt', 'pivot', 'change', 'flexible', 'uncertain', 'chaos'],
    focus: ['focus', 'priority', 'prioritize', 'say no', 'essential', 'core']
  };
  
  for (const zone of ZONES) {
    const keywords = zoneKeywords[zone] || [];
    let score = 0;
    
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\w*\\b`, 'gi');
      const matches = content.match(regex);
      if (matches) {
        score += matches.length;
      }
    });
    
    // Normalize to 0-10 scale
    alignment[zone] = Math.min(10, Math.round(score / 5));
  }
  
  return alignment;
}

// Extract frameworks
function extractFrameworks(content) {
  const frameworks = [];
  const frameworkPatterns = [
    /\b([A-Z][A-Za-z]+\s+){0,3}[Ff]ramework\b/g,
    /\b([A-Z][A-Za-z]+\s+){0,3}[Mm]odel\b/g,
    /\b([A-Z][A-Za-z]+\s+){0,3}[Mm]ethod\b/g,
    /\bOKRs?\b/gi,
    /\bNorth [Ss]tar\b/gi
  ];
  
  const dialogueRegex = /^(.+?)\s\((\d{2}:\d{2}:\d{2})\):\s*(.+?)(?=\n\n|\n[A-Z]|$)/gms;
  let match;
  
  while ((match = dialogueRegex.exec(content)) !== null) {
    const [, speaker, timestamp, text] = match;
    
    for (const pattern of frameworkPatterns) {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(frameworkName => {
          if (!frameworks.some(f => f.name === frameworkName)) {
            frameworks.push({
              name: frameworkName.trim(),
              description: '',
              timestamp
            });
          }
        });
      }
    }
  }
  
  return frameworks.slice(0, 10); // Top 10
}

// Generate TypeScript output
function generateTypeScriptOutput(allInsights) {
  let output = `// Auto-generated episode insights
// Generated: ${new Date().toISOString()}
// Total episodes analyzed: ${allInsights.length}

export interface EpisodeInsights {
  slug: string;
  guest: string;
  contrarianViews: Array<{
    quote: string;
    speaker: string;
    timestamp: string;
    whyControversial: string;
    relatedZones: string[];
  }>;
  quotableMoments: Array<{
    quote: string;
    speaker: string;
    timestamp: string;
    category: string;
  }>;
  decisions: Array<{
    decision: string;
    context: string;
    rationale: string;
    outcome?: string;
    timestamp: string;
  }>;
  philosophyAlignment: Record<string, number>;
  frameworks: Array<{
    name: string;
    description: string;
    timestamp: string;
  }>;
}

export const episodeInsights: EpisodeInsights[] = ${JSON.stringify(allInsights, null, 2)};

export function getInsightsBySlug(slug: string): EpisodeInsights | undefined {
  return episodeInsights.find(e => e.slug === slug);
}

export const insightsStats = {
  totalEpisodes: ${allInsights.length},
  totalContrarianViews: ${allInsights.reduce((sum, e) => sum + e.contrarianViews.length, 0)},
  totalQuotableMoments: ${allInsights.reduce((sum, e) => sum + e.quotableMoments.length, 0)},
  totalDecisions: ${allInsights.reduce((sum, e) => sum + e.decisions.length, 0)},
  totalFrameworks: ${allInsights.reduce((sum, e) => sum + e.frameworks.length, 0)}
};
`;
  
  return output;
}

// Main execution
async function main() {
  console.log('🚀 Starting episode insights extraction...\n');
  
  const progress = loadProgress();
  const allSlugs = getAllEpisodes();
  const remaining = allSlugs.filter(slug => !progress.processed.includes(slug));
  
  console.log(`📊 Progress: ${progress.processed.length}/${allSlugs.length} episodes processed`);
  console.log(`⏳ Remaining: ${remaining.length} episodes\n`);
  
  const allInsights = [];
  
  // Process remaining episodes
  for (let i = 0; i < remaining.length; i++) {
    const slug = remaining[i];
    console.log(`[${i + 1}/${remaining.length}] Processing: ${slug}`);
    
    try {
      const transcript = loadTranscript(slug);
      if (!transcript) {
        console.log(`  ❌ Failed to load transcript`);
        progress.failed.push(slug);
        continue;
      }
      
      const insights = extractInsights(transcript);
      allInsights.push(insights);
      
      console.log(`  ✅ Extracted:`);
      console.log(`     - ${insights.contrarianViews.length} contrarian views`);
      console.log(`     - ${insights.quotableMoments.length} quotable moments`);
      console.log(`     - ${insights.decisions.length} decisions`);
      console.log(`     - ${insights.frameworks.length} frameworks`);
      
      progress.processed.push(slug);
      progress.totalProcessed++;
      progress.lastProcessed = slug;
      
      // Save progress every 10 episodes
      if ((i + 1) % 10 === 0) {
        saveProgress(progress);
        console.log(`\n💾 Progress saved (${progress.processed.length} total)\n`);
      }
      
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
      progress.failed.push(slug);
    }
  }
  
  // Load previously processed insights
  if (fs.existsSync(OUTPUT_FILE)) {
    console.log('\n📂 Loading previously extracted insights...');
    const existingContent = fs.readFileSync(OUTPUT_FILE, 'utf8');
    const match = existingContent.match(/export const episodeInsights: EpisodeInsights\[\] = (\[[\s\S]*?\]);/);
    if (match) {
      const existingInsights = JSON.parse(match[1]);
      allInsights.unshift(...existingInsights);
    }
  }
  
  // Remove duplicates
  const uniqueInsights = Array.from(
    new Map(allInsights.map(item => [item.slug, item])).values()
  );
  
  // Generate output
  console.log('\n📝 Generating TypeScript output...');
  const output = generateTypeScriptOutput(uniqueInsights);
  fs.writeFileSync(OUTPUT_FILE, output);
  
  // Save final progress
  saveProgress(progress);
  
  console.log('\n✨ Extraction complete!');
  console.log(`📊 Final stats:`);
  console.log(`   - Total episodes: ${uniqueInsights.length}`);
  console.log(`   - Successfully processed: ${progress.processed.length}`);
  console.log(`   - Failed: ${progress.failed.length}`);
  console.log(`\n💾 Output saved to: ${OUTPUT_FILE}`);
}

// Run
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
