---
name: verify-sitemap
description: Validate sitemap.xml generation, ensure all URLs are reachable, check for localhost references, and verify proper lastmod dates. Triggered when asked to verify sitemap, check sitemap URLs, or audit sitemap generation.
---

# Sitemap Verification Skill

## Purpose
Validate the dynamic sitemap generation for the PM Philosophy Map, ensuring all 303 episodes and static pages are properly indexed with correct URLs and metadata.

## When to Use This Skill
- User asks to "verify sitemap"
- User wants to "check sitemap URLs"
- User requests to "validate sitemap.xml"
- User asks to "audit sitemap generation"
- Before production deployments or after adding new episodes

## Context
- **Sitemap file**: `app/sitemap.ts`
- **Dynamic generation**: Next.js MetadataRoute.Sitemap
- **Expected entries**: 306 total (3 static pages + 303 episodes)
- **Domain**: https://lenny.productbuilder.net

## What to Check

### 1. Sitemap Configuration
**File**: `app/sitemap.ts`

**Validate:**
- ✅ Uses correct baseUrl (process.env.NEXT_PUBLIC_BASE_URL || 'https://lenny.productbuilder.net')
- ✅ No localhost fallback
- ✅ Imports allEpisodes correctly
- ✅ Generates MetadataRoute.Sitemap type

### 2. Static Pages
**Expected entries:**
```typescript
[
  { url: '/', priority: 1, changeFrequency: 'weekly' },
  { url: '/quiz', priority: 0.9, changeFrequency: 'weekly' },
  { url: '/explore', priority: 0.8, changeFrequency: 'daily' }
]
```

**Validate:**
- ✅ All static pages included
- ✅ Correct priority values (1.0 for home is highest)
- ✅ Appropriate changeFrequency
- ✅ lastModified dates present

### 3. Episode Pages
**Expected**: 303 episode URLs

**Validate:**
- ✅ All episodes from allEpisodes.ts included
- ✅ URL format: `{baseUrl}/episodes/{slug}`
- ✅ No duplicate slugs
- ✅ Valid slugs (no spaces, special chars)
- ✅ lastModified uses episode.publishDate or fallback to new Date()
- ✅ Appropriate priority (0.6 for episodes)
- ✅ changeFrequency set to 'monthly'

### 4. URL Validation
**Check for issues:**
- ❌ localhost URLs (http://localhost:3000)
- ❌ Malformed URLs (missing protocol, trailing slashes inconsistency)
- ❌ 404s (episodes that don't have pages)
- ❌ Redirects (old slugs, renamed episodes)
- ❌ Duplicate URLs

### 5. XML Output
**After build, validate:**
- ✅ Valid XML structure
- ✅ Proper `<urlset>` namespace
- ✅ All `<url>` entries have `<loc>`, `<lastmod>`, `<changefreq>`, `<priority>`
- ✅ Dates in ISO 8601 format (YYYY-MM-DD)
- ✅ Proper escaping of special characters

## Verification Process

### Step 1: Read Sitemap Source
```bash
# Read the sitemap generator
Read app/sitemap.ts
# Check for localhost references
Grep "localhost" in app/sitemap.ts
```

### Step 2: Validate Episode Count
```bash
# Count episodes in allEpisodes
Read lib/allEpisodes.ts
# Verify count matches 303 episodes
```

### Step 3: Build and Generate Sitemap
```bash
# Build the app to generate sitemap
npm run build
# Access sitemap (dev or production)
curl http://localhost:3000/sitemap.xml
# Or check .next/server/app/sitemap.xml
```

### Step 4: Validate XML Structure
```bash
# Check XML is valid
xmllint --noout sitemap.xml 2>&1 || echo "Valid XML"
# Count URL entries
grep -c "<loc>" sitemap.xml
# Should be 306 (3 static + 303 episodes)
```

### Step 5: Check for Issues
```bash
# Find localhost URLs
grep "localhost" sitemap.xml
# Find duplicate URLs
grep "<loc>" sitemap.xml | sort | uniq -d
# Check for malformed URLs
grep -E "<loc>.*[^/]</loc>" sitemap.xml
```

## Quick Commands

### Generate and view sitemap:
```bash
npm run build && curl http://localhost:3000/sitemap.xml | head -50
```

### Count sitemap entries:
```bash
grep -c "<url>" sitemap.xml
# Expected: 306
```

### Find localhost references:
```bash
grep -i "localhost" app/sitemap.ts
```

### Validate all episode pages exist:
```bash
# Check if all episodes have transcript files
ls episodes/*/transcript.md | wc -l
# Should be 303
```

## Sample Output Format

### Healthy Sitemap Entry:
```xml
<url>
  <loc>https://lenny.productbuilder.net/episodes/brian-chesky</loc>
  <lastmod>2024-01-15T00:00:00.000Z</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.6</priority>
</url>
```

### Issue - Localhost URL:
```xml
<url>
  <loc>http://localhost:3000/episodes/brian-chesky</loc> <!-- ❌ BAD -->
  ...
</url>
```

## Verification Report

**Output format:**
```markdown
# Sitemap Verification Report - [Date]

## Summary
- **Total URLs**: 306 / 306 ✅
- **Static Pages**: 3 / 3 ✅
- **Episode Pages**: 303 / 303 ✅
- **Domain Issues**: 0 ✅

## ✅ Passed Checks
- All 303 episodes included
- Correct domain (lenny.productbuilder.net)
- Valid XML structure
- No duplicate URLs
- Proper lastModified dates

## ⚠️ Issues Found
None

## 📋 Details
- Home page priority: 1.0 ✅
- Quiz page priority: 0.9 ✅
- Explore page priority: 0.8 ✅
- Episode pages priority: 0.6 ✅
- All URLs use HTTPS ✅

## Testing
Test sitemap submission:
1. Google Search Console: https://search.google.com/search-console
2. Bing Webmaster Tools: https://www.bing.com/webmasters
3. Sitemap validator: https://www.xml-sitemaps.com/validate-xml-sitemap.html
```

## Common Issues & Fixes

### Issue: Localhost URLs in sitemap
**Fix:**
```typescript
// app/sitemap.ts
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://lenny.productbuilder.net';
// Remove 'http://localhost:3000' fallback
```

### Issue: Missing episodes
**Fix:**
Check `lib/allEpisodes.ts` and ensure all episode folders are scanned:
```bash
ls episodes/ | wc -l  # Should be 303
```

### Issue: Duplicate slugs
**Fix:**
```bash
# Find duplicate slugs in allEpisodes.ts
grep "slug:" lib/allEpisodes.ts | sort | uniq -d
```

### Issue: Invalid lastModified dates
**Fix:**
```typescript
// Use valid ISO date or new Date()
lastModified: episode.publishDate ? new Date(episode.publishDate) : new Date()
```

## Success Criteria
- ✅ 306 total URLs (3 static + 303 episodes)
- ✅ All URLs use production domain (lenny.productbuilder.net)
- ✅ No localhost references
- ✅ Valid XML structure
- ✅ Proper priority and changeFrequency values
- ✅ All lastModified dates valid
- ✅ No 404s or broken links

## Related Skills
- `verify-seo` - Full SEO audit including metadata
- `update-og-images` - Ensure all episodes have OG images
