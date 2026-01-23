const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Import from the built module or parse it properly
const { allEpisodes } = require('../lib/allEpisodes.ts');

// Create output directory
const outputDir = path.join(__dirname, '../public/og');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Function to wrap text for multi-line display
function wrapText(text, maxLength) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + word).length <= maxLength) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);

  return lines.slice(0, 3); // Max 3 lines
}

// Helper to escape XML special characters
function escapeXml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Function to generate OG image
async function generateOGImage(episode) {
  const width = 1200;
  const height = 630;

  // Wrap guest name if too long
  const guestLines = wrapText(episode.guest || 'Guest', 40);
  // Use episode title or first sentence of description
  const titleText = episode.title || (episode.description ? episode.description.split('.')[0] + '.' : `Lenny's Podcast`);
  const titleLines = wrapText(titleText, 50);

  // Calculate vertical positioning
  const guestY = 180;
  const guestLineHeight = 80;
  const titleStartY = guestY + (guestLines.length * guestLineHeight) + 60;
  const titleLineHeight = 50;

  // Create SVG with terminal aesthetic
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#ffb347;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#dc143c;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#ffb347;stop-opacity:1" />
        </linearGradient>
      </defs>

      <!-- Background -->
      <rect width="${width}" height="${height}" fill="#000000"/>

      <!-- Scanlines effect -->
      <pattern id="scanlines" patternUnits="userSpaceOnUse" width="${width}" height="4">
        <rect width="${width}" height="2" fill="#000000"/>
        <rect y="2" width="${width}" height="2" fill="#ffb347" opacity="0.02"/>
      </pattern>
      <rect width="${width}" height="${height}" fill="url(#scanlines)"/>

      <!-- Border -->
      <rect x="40" y="40" width="${width - 80}" height="${height - 80}"
            fill="none" stroke="url(#borderGrad)" stroke-width="3"/>

      <!-- Top badge -->
      <rect x="80" y="60" width="300" height="50" fill="#ffb347" opacity="0.1"/>
      <text x="230" y="95" font-family="monospace" font-size="24"
            fill="#ffb347" text-anchor="middle" font-weight="bold">
        LENNY'S PODCAST
      </text>

      <!-- Guest name (wrapped) -->
      ${guestLines.map((line, i) => `
        <text x="600" y="${guestY + (i * guestLineHeight)}"
              font-family="monospace" font-size="70" font-weight="bold"
              fill="#ffb347" text-anchor="middle">
          ${escapeXml(line.toUpperCase())}
        </text>
      `).join('')}

      <!-- Episode title (wrapped) -->
      ${titleLines.map((line, i) => `
        <text x="600" y="${titleStartY + (i * titleLineHeight)}"
              font-family="monospace" font-size="36"
              fill="#cccccc" text-anchor="middle">
          ${escapeXml(line)}
        </text>
      `).join('')}

      <!-- Bottom branding -->
      <text x="600" y="${height - 80}" font-family="monospace" font-size="28"
            fill="#ffb347" text-anchor="middle" opacity="0.6">
        PM PHILOSOPHY QUIZ
      </text>

      <!-- Decorative stars -->
      <circle cx="140" cy="140" r="3" fill="#ffb347"/>
      <circle cx="1060" cy="140" r="3" fill="#ffb347"/>
      <circle cx="140" cy="490" r="3" fill="#dc143c"/>
      <circle cx="1060" cy="490" r="3" fill="#dc143c"/>
    </svg>
  `;

  // Generate PNG from SVG
  const outputPath = path.join(outputDir, `${episode.slug}.png`);

  try {
    await sharp(Buffer.from(svg))
      .png()
      .toFile(outputPath);
    return true;
  } catch (error) {
    console.error(`Error generating image for ${episode.slug}:`, error.message);
    return false;
  }
}

// Main function
async function main() {
  console.log(`\n🎨 Generating OG images for ${allEpisodes.length} episodes...\n`);

  let generated = 0;
  let skipped = 0;
  let failed = 0;

  for (const episode of allEpisodes) {
    try {
      const outputPath = path.join(outputDir, `${episode.slug}.png`);
      const exists = fs.existsSync(outputPath);

      // Always regenerate to fix "map" reference
      const success = await generateOGImage(episode);
      if (success) {
        generated++;
        if (generated % 50 === 0) {
          console.log(`✓ Generated ${generated}/${allEpisodes.length} images...`);
        }
      } else {
        failed++;
      }
    } catch (error) {
      console.error(`Failed for ${episode.slug}:`, error.message);
      failed++;
    }
  }

  console.log(`\n✅ Generation complete!`);
  console.log(`   Generated: ${generated}`);
  console.log(`   Failed: ${failed}`);
  console.log(`   Total: ${allEpisodes.length}\n`);
}

main();
