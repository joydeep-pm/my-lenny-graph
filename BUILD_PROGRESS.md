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

## 🚧 IN PROGRESS (Session 3)

### Session 3: Cosmic Map & Zone Placement

**Need to Build:**

1. **Zones Data (`/lib/zones.ts`)**
   ```typescript
   - 8 cosmic zones with real guest quotes
   - Each zone has:
     * name, tagline, description
     * color, coordinates
     * icon
     * Associated guests from transcripts
     * Real quotes from episodes
   ```

2. **Scoring Algorithm (`/lib/scoring.ts`)**
   ```typescript
   - Map quiz answers → zone scores
   - Calculate primary zone
   - Calculate zone percentages (balance)
   - Scoring matrix for all 7 questions
   ```

3. **Interactive 3D Map (`/components/MapCanvas.tsx`)**
   - 8 zones positioned in 3D space
   - Zoom animation to primary zone
   - Hoverable zone nodes
   - Connection lines between zones
   - Particle effects around zones
   - Pan/zoom controls

4. **Map Reveal Page (`/app/map/page.tsx`)**
   - "YOU ARE HERE" reveal
   - Zone name + tagline
   - Zone description
   - Show balance across all zones
   - Guest quotes from that zone
   - Episode references (SURFACE THE DATA!)
   - CTA to contradictions page

**Key Feature: Surface the 303 Episodes**
- Show which guests align with each zone
- Display real quotes from transcripts
- Reference specific episode insights
- "Leaders who think like you" section
- Episode count per zone
- Clickable to see more insights

---

## 📋 TODO (Sessions 4-6)

### Session 4: Contradictions

**Build:**
- 15 PM debates from transcripts
- Real conflicting quotes from guests
- Side-by-side debate cards
- "Both matter" option
- Refine philosophy based on selections
- Navigate to results with full profile

**Data Source:**
- Mine `/episodes/` for conflicting viewpoints
- Find quotes about:
  - Speed vs Perfection (Rahul Vohra vs Brian Chesky)
  - Data vs Intuition
  - User-driven vs Vision-driven
  - Planning vs Chaos
  - Focus vs Platform
  - etc.

### Session 5: Philosophy Card & Results

**Build:**
- Final philosophy profile
- Shareable card design
- Shows:
  - Primary zone
  - Philosophy name
  - Balance chart
  - Superpower
  - Blind spot
  - Aligned guests
  - Top contradictions
- Twitter share button
- Download as PNG (html2canvas)
- "Explore Full Map" button

### Session 6: Polish & Deploy

**Tasks:**
- Add loading states
- Error boundaries
- Performance optimization
- Mobile responsive testing
- Analytics (optional)
- Deploy to Vercel
- OG image generation
- Meta tags

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
│   ├── page.tsx                 ✅ Landing page
│   ├── quiz/page.tsx            ✅ Quiz flow
│   ├── map/page.tsx             🚧 Map reveal (in progress)
│   ├── contradictions/page.tsx  ❌ Debates (todo)
│   ├── results/page.tsx         ❌ Philosophy card (todo)
│   ├── layout.tsx               ✅ Root layout
│   └── globals.css              ✅ Global styles
├── components/
│   ├── InteractiveSpace.tsx     ✅ 3D starfield
│   ├── MapCanvas.tsx            ❌ (todo)
│   └── ...                      ❌ (more todo)
├── lib/
│   ├── types.ts                 ✅ TypeScript types
│   ├── questions.ts             ✅ Quiz questions
│   ├── zones.ts                 🚧 (in progress)
│   ├── scoring.ts               ❌ (todo)
│   └── contradictions.ts        ❌ (todo)
├── episodes/                    ✅ 303 transcripts
├── index/                       ✅ Topic indices
└── scripts/                     ✅ Build scripts
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

**Immediate (Session 3):**
1. Create zones with real guest data
2. Build scoring algorithm
3. Create 3D map visualization
4. Build map reveal page
5. **SURFACE THE 303 EPISODES** - show guest quotes, episode references

**After Session 3:**
- Mine contradictions from transcripts
- Build debate UI
- Create shareable results card
- Polish and deploy

---

## 📝 Notes

- **Design philosophy:** Dark, mysterious, engaging, not typical SV aesthetic
- **Data philosophy:** Ground everything in real transcript insights
- **UX philosophy:** Smooth, delightful, outside-the-box
- **No marketing fluff:** No "inspired by" or unnecessary copy
- **Flame homage:** Subtle 🔥 icon as nod to Lenny's campfire brand

---

**Last Updated:** Session 2 Complete
**Current Branch:** `claude/interactive-redesign-heCSY`
**Status:** Building Session 3 - Map & Zones
