#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const verifiedDir = path.join(__dirname, '../data/verified');

// Get all JSON files except verified-content.json
const files = fs.readdirSync(verifiedDir)
  .filter(f => f.endsWith('.json') && f !== 'verified-content.json');

let fixedCount = 0;

files.forEach(filename => {
  const filepath = path.join(verifiedDir, filename);
  const content = JSON.parse(fs.readFileSync(filepath, 'utf8'));
  const slug = content.slug || filename.replace('.json', '');

  let needsFix = false;

  // Check if any quote has legacy format (timestamp/speaker inside source)
  if (content.quotes && content.quotes.length > 0) {
    const firstQuote = content.quotes[0];
    if (firstQuote.source && (firstQuote.source.timestamp || firstQuote.source.speaker || firstQuote.source.line_start)) {
      needsFix = true;
    }
  }

  if (!needsFix) {
    return;
  }

  console.log(`Fixing: ${filename}`);

  // Transform quotes
  content.quotes = content.quotes.map((quote, index) => {
    const newQuote = {
      id: quote.id.includes('-q') ? quote.id : quote.id.replace(/-(\d+)$/, '-q$1'),
      speaker: quote.speaker || quote.source?.speaker || content.guest || 'Unknown',
      text: quote.text,
      timestamp: quote.timestamp || quote.source?.timestamp || '00:00:00',
      source: {
        slug: slug,
        path: `episodes/${slug}/transcript.md`,
        lineStart: quote.source?.lineStart || quote.source?.line_start || 1,
        lineEnd: quote.source?.lineEnd || quote.source?.line_end || 1
      },
      themes: quote.themes || [],
      zones: quote.zones || []
    };

    return newQuote;
  });

  // Ensure top-level structure matches expected format
  const newContent = {
    slug: slug,
    quotes: content.quotes,
    themes: content.themes || [...new Set(content.quotes.flatMap(q => q.themes))],
    takeaways: content.takeaways || [],
    zone_influence: content.zone_influence || {
      velocity: 0.125,
      perfection: 0.125,
      discovery: 0.125,
      data: 0.125,
      intuition: 0.125,
      alignment: 0.125,
      chaos: 0.125,
      focus: 0.125
    },
    contrarian_candidates: content.contrarian_candidates || [],
    guest_metadata: content.guest_metadata || {
      guest_type: 'expert',
      company_stage: 'growth',
      primary_topics: []
    }
  };

  // Write back
  fs.writeFileSync(filepath, JSON.stringify(newContent, null, 2) + '\n');
  fixedCount++;
  console.log(`  ✓ Fixed ${content.quotes.length} quotes`);
});

console.log(`\nDone! Fixed ${fixedCount} files.`);
