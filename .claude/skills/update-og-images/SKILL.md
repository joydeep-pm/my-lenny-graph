---
name: update-og-images
description: Generate and update OpenGraph social media preview images for the PM Philosophy Map. Batch create episode OG images, validate dimensions, and ensure all pages have proper social sharing previews.
---

# Update OpenGraph Images Skill

## Purpose
Generate, update, and validate OpenGraph (OG) images for optimal social media sharing across Twitter, LinkedIn, and Facebook for the PM Philosophy Map.

## When to Use This Skill
- User asks to "update OG images"
- User wants to "generate social preview images"
- User requests to "create episode OG images"
- User asks to "batch generate OpenGraph images"
- After adding new episodes or updating branding

## Context
- **Image dimensions**: 1200x630px (optimal for all platforms)
- **Format**: PNG (best quality and compatibility)
- **Location**: `/public/og/` for episodes, `/public/og-image.png` for site-wide
- **Usage**: Displayed when URLs are shared on social media

## OG Image Strategy

### Site-Wide Image
**File**: `/public/og-image.png`

**Content:**
- PM Philosophy Map branding
- Tagline: "Discover Your Product Philosophy"
- Visual: Space/constellation theme matching site design
- Text: "303 Episodes of Lenny's Podcast"

**Used on:**
- Home page (/)
- Quiz page (/quiz)
- Explore page (/explore)
- Results page (/results)
- Any page without specific OG image

### Episode-Specific Images
**File**: `/public/og/[slug].png`

**Content template:**
- Guest name (large, prominent)
- Episode title/tagline
- Lenny's Podcast branding
- PM Philosophy Map logo/mention
- Visual element (guest photo if available, or icon)

**Used on:**
- Individual episode pages (/episodes/[slug])

## Image Requirements

### Technical Specs
- ✅ Dimensions: 1200x630px (exact)
- ✅ Format: PNG (lossless, supports transparency)
- ✅ File size: < 1MB (ideally < 300KB)
- ✅ Color space: RGB
- ✅ Aspect ratio: 1.91:1

### Design Guidelines
- ✅ Important content in "safe zone" (center 1200x600px)
- ✅ Avoid small text (min 32px font size)
- ✅ High contrast for readability
- ✅ Consistent branding (fonts, colors, logo placement)
- ✅ No text cutoff at edges

### Platform-Specific Considerations
**Twitter:**
- Crops to 800x418px preview
- Keep key content centered

**Facebook/LinkedIn:**
- Uses full 1200x630px
- Preview may be slightly cropped on mobile

**Slack/Discord:**
- Similar to Twitter (smaller preview)
- Text legibility crucial

## Generation Methods

### Method 1: Design Tool Export (Recommended)
**Tools:** Figma, Canva, Photoshop

**Process:**
1. Create template at 1200x630px
2. Add guest name, episode info, branding
3. Export as PNG at 1x resolution
4. Save to `/public/og/[slug].png`
5. Optimize with ImageOptim or similar

**Pros:**
- Full design control
- Consistent quality
- Easy to iterate

**Cons:**
- Manual for each episode
- Time-consuming at scale

### Method 2: Programmatic Generation
**Tools:** Canvas API, Puppeteer, Satori

**Example with Satori (Vercel OG):**
```typescript
// app/api/og/[slug]/route.tsx
import { ImageResponse } from '@vercel/og';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const guest = searchParams.get('guest');

  return new ImageResponse(
    (
      <div style={{ /* design */ }}>
        <h1>{guest}</h1>
        <p>Lenny's Podcast | PM Philosophy Map</p>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
```

**Pros:**
- Automated generation
- Consistent design
- Easy to update in bulk

**Cons:**
- Requires setup
- Less design flexibility

### Method 3: Template-Based (Recommended for Scale)
**Tools:** Puppeteer, Playwright

**Process:**
1. Create HTML template with dynamic data
2. Use headless browser to render at 1200x630px
3. Take screenshot as PNG
4. Save to `/public/og/[slug].png`

**Pros:**
- Scales well
- Uses web tech (CSS, HTML)
- Can leverage existing components

**Cons:**
- Initial setup complexity

## Validation Process

### Step 1: Check Existing Images
```bash
# List all episode OG images
ls -lh public/og/

# Count episodes with OG images
ls public/og/*.png | wc -l
# Should be 303 for all episodes

# Check file sizes
du -sh public/og/*.png | sort -rh | head -10
```

### Step 2: Validate Dimensions
```bash
# Check image dimensions (requires imagemagick)
identify public/og/*.png | grep -v "1200x630"
# Should return empty (all images correct size)

# Or for specific image:
identify public/og/brian-chesky.png
# Should output: brian-chesky.png PNG 1200x630 ...
```

### Step 3: Find Missing Images
```bash
# Get all episode slugs
grep "slug:" lib/allEpisodes.ts | cut -d'"' -f2 > all-slugs.txt

# Compare with existing OG images
ls public/og/ | sed 's/.png$//' > existing-og.txt
diff all-slugs.txt existing-og.txt
```

### Step 4: Validate in Metadata
```bash
# Check episode layouts reference OG images correctly
grep "og-image\|og/" app/episodes/[slug]/layout.tsx
# Should show: url: `/og/${episode.slug}.png`
```

### Step 5: Test Social Previews
**Tools:**
- Twitter Card Validator: https://cards-dev.twitter.com/validator
- Facebook Debugger: https://developers.facebook.com/tools/debug/
- LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/
- Open Graph Check: https://opengraphcheck.com/

**Test URLs:**
```
https://lenny.productbuilder.net/
https://lenny.productbuilder.net/quiz
https://lenny.productbuilder.net/episodes/brian-chesky
```

## Batch Generation Script

### Example Script: Generate Missing OG Images
```typescript
// scripts/generate-og-images.ts
import { allEpisodes } from '@/lib/allEpisodes';
import fs from 'fs';
import path from 'path';

async function generateOGImages() {
  const ogDir = path.join(process.cwd(), 'public', 'og');

  for (const episode of allEpisodes) {
    const imagePath = path.join(ogDir, `${episode.slug}.png`);

    // Skip if exists
    if (fs.existsSync(imagePath)) {
      console.log(`✓ ${episode.slug}.png exists`);
      continue;
    }

    // Generate image here (using Satori, Puppeteer, etc.)
    console.log(`✗ Missing: ${episode.slug}.png`);
  }
}

generateOGImages();
```

## Optimization

### Compress Images
```bash
# Using imagemagick
mogrify -strip -quality 85 public/og/*.png

# Using pngquant (better compression)
pngquant --quality=80-90 public/og/*.png --ext .png --force

# Using ImageOptim (Mac)
# Drag and drop public/og/ folder into ImageOptim
```

### Verify Compression
```bash
# Before
du -sh public/og/

# After optimization
du -sh public/og/
# Should be significantly smaller
```

## Verification Report

**Output format:**
```markdown
# OG Images Audit Report - [Date]

## Summary
- **Total Episodes**: 303
- **OG Images Present**: 285 / 303
- **Missing Images**: 18 episodes
- **Invalid Dimensions**: 2 images
- **Oversized Files**: 5 images (> 500KB)

## ✅ Correct Images (285)
All images have:
- Correct dimensions (1200x630px)
- Reasonable file size (< 500KB)
- Valid PNG format

## ❌ Missing OG Images (18)
Episodes without OG images:
1. /episodes/new-guest-1 → Need og/new-guest-1.png
2. /episodes/new-guest-2 → Need og/new-guest-2.png
...

## ⚠️ Issues Found

### Invalid Dimensions (2)
1. public/og/old-episode.png → 1000x525px (should be 1200x630)
2. public/og/another.png → 1920x1080px (should be 1200x630)

### Oversized Files (5)
1. public/og/heavy-image.png → 1.2MB (optimize)
2. public/og/large-file.png → 850KB (optimize)
...

## 📋 Action Items
1. Generate 18 missing OG images
2. Resize 2 images to correct dimensions
3. Compress 5 oversized images
4. Test social previews on Twitter/Facebook
5. Update episode layouts if needed
```

## Common Issues & Fixes

### Issue: Missing OG image
**Fix:**
```bash
# Generate using template or design tool
# Save to public/og/[slug].png
```

### Issue: Wrong dimensions
**Fix:**
```bash
# Resize with imagemagick
convert public/og/image.png -resize 1200x630! -quality 90 public/og/image-resized.png
```

### Issue: Large file size
**Fix:**
```bash
# Compress with pngquant
pngquant --quality=80-90 public/og/image.png --output public/og/image.png --force
```

### Issue: OG image not updating on social media
**Fix:**
- Clear social media cache (Facebook Debugger, Twitter Card Validator)
- Verify URL is publicly accessible
- Check CDN cache if using one
- Ensure no-cache headers are not set for images

## Success Criteria
- ✅ All 303 episodes have OG images
- ✅ Site-wide og-image.png exists
- ✅ All images are exactly 1200x630px
- ✅ File sizes under 500KB (ideally < 300KB)
- ✅ Images display correctly in social media previews
- ✅ Metadata references correct image paths
- ✅ No broken image links

## Related Skills
- `verify-seo` - Validate OG metadata tags
- `verify-sitemap` - Ensure all episodes are indexed
