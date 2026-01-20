# PM Philosophy Map - Build Progress

## 🎯 Project Vision

An interactive experience where PMs discover their product philosophy by navigating a dark, sci-fi universe built from 303 episodes of Lenny's Podcast. Think: terminal aesthetic meets space exploration, grounded in real PM wisdom.

---

## ✅ COMPLETED (Sessions 1-2)

### Session 1: Foundation & Landing Page ✓

**Interactive Dark Aesthetic**
- Pure black void background (`#000000`)
- Amber/gold accents (`#ffb347`, `#cc7a00`)
- Crimson highlights (`#dc143c`)
- Terminal/monospace typography
- Custom cursor with spring physics
- Scanlines overlay (5% opacity amber)

**3D Interactive Starfield**
- 10,000 foreground stars (amber, fast parallax)
- 3,000 deep space stars (amber-dark, slow parallax)
- Mouse-reactive with multi-layer parallax
- Red crimson particle trail following cursor
- Stars use additive blending for glow
- Real-time coordinate display (bottom-right corner)

**Landing Page Components**
- `SYSTEM.INIT` / `ONLINE` status indicators
- Glitched title with chromatic aberration (triggers every 5-10s)
- Three-column numbered steps (01, 02, 03)
- `INITIATE` button (amber border, hover fills)
- Stats bar: 8 ZONES | 303 EPISODES | 15 CONTRADICTIONS
- Footer: "Built from Lenny's Podcast transcripts"

**Tech Stack**
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion (animations)
- React Three Fiber + Drei (3D)
- Three.js (rendering)
- Maath (random distributions)

### Session 2: Quiz Flow ✓

**7 Existential Questions**
```typescript
q1: Speed vs Perfection (ship fast vs polish)
q2: Data vs Intuition
q3: User requests vs Vision
q4: Multiple features vs One flagship
q5: Planning vs Execution
q6: Decision-making approaches
q7: Product scope philosophy
```

**Quiz Experience**
- Progress bar at top (amber→crimson gradient)
- Flame icon (🔥) with question counter (Lenny homage)
- Large readable question text (3xl-4xl)
- 3 answer options per question with emoji icons
- Smooth slide transitions (questions slide right→left)
- Hover effects: amber glow, scale 1.02, slide right 10px
- Selection indicators (amber border flash)
- Corner accent on hover (top-right)
- Back button with left-arrow animation
- Transition locking (prevents double-clicks)

**State Management**
- Tracks answers in `QuizAnswers` object
- Navigates to `/map?answers={encoded}` on completion
- Allows backward navigation
- Prevents actions during transitions

**Files Created**
- `/lib/questions.ts` - Question data
- `/lib/types.ts` - TypeScript definitions
- `/app/quiz/page.tsx` - Quiz UI
- `/components/InteractiveSpace.tsx` - 3D starfield

---

### Session 3: Map & Zone Reveal ✓

**Zones Data (`/lib/zones.ts`)** ✅
- 8 cosmic zones with REAL guest quotes from transcripts
- Each zone includes:
  - Name, tagline, description
  - Color, coordinates, icon
  - Associated guests (Brian Chesky, Rahul Vohra, Marty Cagan, etc.)
  - Real quotes from specific episodes
  - Episode counts (33-47 episodes per zone)
- Total episodes tracked: 303

**Scoring Algorithm (`/lib/scoring.ts`)** ✅
- Maps quiz answers → zone scores
- Calculates primary zone (highest score)
- Calculates zone percentages for balance chart
- Complete scoring matrix for all 7 questions
- TypeScript-safe with proper type assertions

**Map Reveal Page (`/app/map/page.tsx`)** ✅
- "YOU ARE HERE" reveal with primary zone
- Zone name, tagline, and full description
- **SURFACES THE 303 EPISODES:**
  - "FROM THE TRANSCRIPTS" section with real guest quote
  - Guest name, episode title attribution
  - "LEADERS WHO THINK LIKE YOU" with guest tags
  - Episode count: "42 episodes = 14% of 303 total"
- Philosophy balance chart (all 8 zones, animated bars)
- Three stat cards: Episode Coverage, Your Strength, Alignment
- CTA button to contradictions page
- Wrapped in Suspense boundary

### Session 4: Contradictions & Debates ✓

**Contradictions Data (`/lib/contradictions.ts`)** ✅
- 5 PM contradictions with opposing quotes
- Real debates from transcripts:
  1. Leaders in Details vs Empowerment (Brian Chesky)
  2. Ship Fast vs Ship Perfect (Rahul Vohra vs Chesky)
  3. User Research vs Vision (Marty Cagan vs Dylan Field)
  4. Data-Driven vs Intuition-Led
  5. Planning vs Executing (Amjad Masad)
- Each includes: guest name, company, episode title, full quote

**Contradictions UI (`/app/contradictions/page.tsx`)** ✅
- Two-column debate layout (amber vs crimson)
- Side A (left, amber) vs Side B (right, crimson)
- "Both perspectives matter" option for each
- Real quotes with episode attribution
- Progress bar with gradient
- Smooth transitions between contradictions
- Navigates to results with full selections data
- Wrapped in Suspense boundary

### Session 5: Results & Philosophy Profile ✓

**Results Page (`/app/results/page.tsx`)** ✅
- Complete philosophy profile display
- **Primary Zone Card:**
  - Zone icon, name, tagline
  - Full description
  - Three stats: alignment %, episode count, % of catalog
- **Left Column:**
  - Superpower (highest zone)
  - Blind spot (lowest zone)
  - "FROM THE TRANSCRIPTS" with primary zone quote
- **Right Column:**
  - Philosophy Balance chart (all 8 zones, animated)
  - "LEADERS WHO THINK LIKE YOU" with guest tags
  - Episode count details
- **Contradiction Stances:**
  - Shows all selected positions
  - Visual indicators (← amber, → crimson, ⚖️ both)
- **Action Buttons:**
  - Share to Twitter (pre-filled text)
  - View Your Map
  - Retake Quiz
- Footer: "Based on 303 episodes"
- Wrapped in Suspense boundary

---

## 📋 TODO (Session 6: Polish & Deploy)

### Enhancements & Polish

**Optional Improvements:**
- [ ] Add more contradictions (currently 5, could expand to 10-15)
- [ ] Mine additional real quotes from more episodes
- [ ] Add download card as PNG functionality (html2canvas)
- [ ] Add loading skeletons for better perceived performance
- [ ] Add error boundaries for graceful failures
- [ ] Performance optimization (code splitting, lazy loading)
- [ ] Add subtle sound effects (optional, keep it classy)
- [ ] Add keyboard navigation support

**Mobile & Responsiveness:**
- [ ] Test on various screen sizes (mobile, tablet, desktop)
- [ ] Optimize 3D starfield performance on mobile
- [ ] Ensure touch interactions work smoothly
- [ ] Test contradictions two-column layout on mobile

**Deployment:**
- [ ] Set up Vercel project
- [ ] Configure environment variables (if any)
- [ ] Generate OG images for social sharing
- [ ] Add proper meta tags (title, description, og:image)
- [ ] Test production build
- [ ] Deploy to Vercel
- [ ] Test full flow in production
- [ ] Share with Lenny!

**Analytics (Optional):**
- [ ] Track quiz completions
- [ ] Track primary zone distribution
- [ ] Track share button clicks
- [ ] Track contradiction selections

---

## 🎨 Design System

### Colors
```
Void:         #000000 (background)
Void Light:   #0a0a0a (cards)
Amber:        #ffb347 (primary accent)
Amber Dark:   #cc7a00 (secondary)
Crimson:      #dc143c (highlights)
Ash:          #cccccc (text)
Ash Dark:     #666666 (secondary text)
Ash Darker:   #333333 (tertiary)
```

### Typography
- Monospace: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas`
- All caps for labels: `SYSTEM.INIT`, `QUESTION 1 OF 7`
- Title: 5xl-8xl, bold, tight tracking
- Body: lg-xl, relaxed leading

### Animations
```
Glitch:       Chromatic aberration on title
Float:        Gentle y-axis movement
Pulse:        Opacity 1→0.7→1
Slide:        x/y translations
Scale:        1.0→1.02→0.98
```

### Interactions
- Hover: amber glow, scale, translate
- Click: scale down, quick transition
- Selection: amber border flash
- Parallax: 3-layer depth

---

## 🗂️ File Structure

```
/lenny
├── app/
│   ├── page.tsx                 ✅ Landing page with 3D starfield
│   ├── quiz/page.tsx            ✅ 7-question quiz flow
│   ├── map/page.tsx             ✅ Map reveal with zone details
│   ├── contradictions/page.tsx  ✅ PM debates with real quotes
│   ├── results/page.tsx         ✅ Full philosophy profile
│   ├── layout.tsx               ✅ Root layout
│   └── globals.css              ✅ Global styles
├── components/
│   └── InteractiveSpace.tsx     ✅ 3D starfield (used across pages)
├── lib/
│   ├── types.ts                 ✅ TypeScript types (ZoneId, QuizAnswers, etc.)
│   ├── questions.ts             ✅ 7 quiz questions with 3 answers each
│   ├── zones.ts                 ✅ 8 zones with real guest data & quotes
│   ├── scoring.ts               ✅ Quiz → zone scoring algorithm
│   └── contradictions.ts        ✅ 5 PM debates with opposing quotes
├── episodes/                    ✅ 303 episode transcripts
├── index/                       ✅ Topic indices
├── scripts/                     ✅ Build scripts
└── BUILD_PROGRESS.md            ✅ This file
```

---

## 🔥 Key Differentiators

### What Makes This Special

1. **Dark Sci-Fi Aesthetic**
   - Not another beige SaaS page
   - Terminal vibes, space exploration
   - Custom cursor, glitch effects
   - Interactive 3D starfield

2. **Real Data, Real Quotes**
   - Built from 303 actual episodes
   - Guest quotes in every zone
   - Episode references throughout
   - Contradictions from real debates

3. **Delightful Interactions**
   - Mouse-reactive particles
   - Smooth animations everywhere
   - Satisfying hover states
   - Engaging transitions

4. **Philosophical Depth**
   - No "right answers"
   - Celebrates contradictions
   - Nuanced zone descriptions
   - Shows trade-offs

---

## 🚀 Next Steps

**Core Experience: COMPLETE ✅**
- ✅ Landing page with 3D starfield
- ✅ 7-question quiz flow
- ✅ Map reveal with zone details
- ✅ 5 PM contradictions with real debates
- ✅ Full philosophy profile results page
- ✅ Twitter sharing functionality
- ✅ All 303 episodes surfaced throughout

**Ready For:**
1. Final testing (mobile, desktop, full user flow)
2. Polish pass (animations, loading states, error handling)
3. Deployment to Vercel
4. Sharing with Lenny & PM community! 🔥

**Optional Enhancements:**
- Add more contradictions (5→10-15)
- Download card as PNG
- Analytics tracking
- Performance optimizations

---

## 📝 Notes

- **Design philosophy:** Dark, mysterious, engaging, not typical SV aesthetic ✅
- **Data philosophy:** Ground everything in real transcript insights ✅
- **UX philosophy:** Smooth, delightful, outside-the-box ✅
- **No marketing fluff:** No "inspired by" or unnecessary copy ✅
- **Flame homage:** Subtle 🔥 icon as nod to Lenny's campfire brand ✅

---

## 📊 Current Status

**Last Updated:** Session 5 Complete - Results Page Built
**Current Branch:** `claude/interactive-redesign-heCSY`
**Build Status:** ✅ All pages building successfully
**Status:** Core experience complete, ready for polish & deploy

**Commits:**
- feat: Add contradictions page with real PM debates
- feat: Build complete PM Philosophy results page
- fix: Correct contradictions navigation parameter name

**Pages Live:**
- `/` - Landing (3D starfield, terminal aesthetic)
- `/quiz` - 7 questions
- `/map` - Zone reveal with transcript data
- `/contradictions` - 5 PM debates
- `/results` - Full philosophy profile

**Data Surfaced:**
- 303 episodes referenced throughout
- 8 zones with real guest quotes
- 5 contradictions with opposing viewpoints
- Guest attributions (Brian Chesky, Rahul Vohra, Marty Cagan, Dylan Field, Amjad Masad, etc.)
- Episode titles and counts per zone
