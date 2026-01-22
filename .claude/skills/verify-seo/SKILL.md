---
name: verify-seo
description: Validate SEO metadata across the PM Philosophy Map including meta tags, OpenGraph images, canonical URLs, and domain references. Triggered when asked to verify SEO, check metadata, or audit site SEO.
---

# SEO Verification Skill

## Purpose
Validate and audit all SEO metadata across the PM Philosophy Map to ensure optimal search engine visibility and social media sharing.

## When to Use This Skill
- User asks to "verify SEO"
- User wants to "check metadata" or "audit SEO"
- User requests to "validate OpenGraph tags"
- User asks to "check for SEO issues"
- Before production deployments

## What to Check

### 1. Meta Tags
**Files to verify:**
- `app/layout.tsx` - Root metadata
- `app/episodes/[slug]/layout.tsx` - Episode-specific metadata
- `app/results/page.tsx` - Results page metadata
- `app/quiz/page.tsx` - Quiz page metadata
- `app/explore/page.tsx` - Explore page metadata

**Validate:**
- ✅ Title tags exist and are descriptive (50-60 chars optimal)
- ✅ Meta descriptions exist and compelling (150-160 chars optimal)
- ✅ Keywords are relevant and not stuffed
- ✅ Canonical URLs use correct domain (lenny.productbuilder.net)
- ✅ No localhost references in production

### 2. OpenGraph Metadata
**Check all pages for:**
- ✅ `og:title` - Present and descriptive
- ✅ `og:description` - Present and compelling
- ✅ `og:image` - Valid path, proper dimensions (1200x630)
- ✅ `og:url` - Uses correct domain
- ✅ `og:type` - Appropriate (website/article)
- ✅ `og:site_name` - Consistent branding

### 3. Twitter Card Metadata
**Validate:**
- ✅ `twitter:card` - Set to "summary_large_image"
- ✅ `twitter:title` - Optimized for Twitter
- ✅ `twitter:description` - Under 200 chars
- ✅ `twitter:image` - Valid OG image path
- ✅ `twitter:creator` - Set to @lennysan

### 4. Domain References
**Search codebase for:**
- ❌ `localhost:3000` - Should use lenny.productbuilder.net
- ❌ `http://localhost` - Should use production domain
- ❌ Hardcoded old domains (pmphilosophy.com)
- ✅ All URLs use `process.env.NEXT_PUBLIC_BASE_URL` or correct fallback

### 5. Sitemap & Robots.txt
**Verify:**
- ✅ `app/sitemap.ts` generates valid XML
- ✅ All pages included (home, quiz, explore, results, 303 episodes)
- ✅ Proper lastModified dates
- ✅ Correct priority values (1.0 for home, 0.9 for quiz, etc.)
- ✅ No localhost URLs in sitemap

### 6. Image Assets
**Check:**
- ✅ `/public/og-image.png` exists (1200x630)
- ✅ Episode OG images in `/public/og/[slug].png`
- ✅ Favicon `/public/favicon.svg` exists
- ✅ All images optimized for web

## Verification Process

### Step 1: Scan Metadata Files
```bash
# Read all layout and page files
Read app/layout.tsx
Read app/episodes/[slug]/layout.tsx
# Check for missing or malformed metadata
```

### Step 2: Search for Domain Issues
```bash
# Find localhost references
Grep -r "localhost" in app/, lib/, components/
# Find hardcoded domains
Grep -r "pmphilosophy.com|http://" in codebase
```

### Step 3: Validate OG Images
```bash
# Check if OG images exist
ls public/og-image.png
ls public/og/*.png (episode images)
# Verify dimensions with identify or similar
```

### Step 4: Test Sitemap Generation
```bash
# Build and check sitemap
npm run build
curl http://localhost:3000/sitemap.xml
# Verify no localhost URLs in output
```

### Step 5: Generate Report
**Output format:**
```markdown
# SEO Audit Report - [Date]

## ✅ Passed Checks
- Root metadata properly configured
- OpenGraph tags present on all pages
- Twitter cards configured correctly

## ⚠️ Issues Found
1. **Episode layouts using hardcoded domain**: app/episodes/[slug]/layout.tsx:23
   - Fix: Use process.env.NEXT_PUBLIC_BASE_URL
2. **Missing OG image**: public/og/new-episode.png
   - Fix: Generate OG image for new episode

## 📋 Recommendations
- Add structured data (JSON-LD) for episodes
- Consider adding breadcrumb navigation metadata
- Optimize meta descriptions for better CTR
```

## Quick Commands

### Check for localhost references:
```bash
grep -r "localhost" app/ lib/ components/ --include="*.tsx" --include="*.ts"
```

### Validate metadata exists:
```bash
grep -r "export.*metadata\|generateMetadata" app/ --include="*.tsx"
```

### List OG images:
```bash
ls -lh public/og/ | wc -l  # Count episode OG images
```

## Success Criteria
- ✅ All pages have complete metadata
- ✅ No localhost references in production code
- ✅ All OG images exist and are properly sized
- ✅ Sitemap includes all 303 episodes + static pages
- ✅ Canonical URLs use correct domain
- ✅ Twitter/OG preview cards render correctly

## Related Skills
- `verify-sitemap` - Deep dive into sitemap validation
- `update-og-images` - Batch generate/update OG images
