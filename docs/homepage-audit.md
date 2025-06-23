# Homepage Structure Audit

**Date:** 2025-06-22  
**Purpose:** Audit current homepage structure and architecture for complete rewrite planning

## 1. Homepage Route and Entry Point Files

- **Main Homepage File:** `src/app/page.tsx`
- **Framework:** Next.js 15 with App Router
- **Client Component:** Uses `'use client'` directive for client-side interactivity
- **Root Layout:** `src/app/layout.tsx` provides the overall application wrapper

## 2. Layout System

- **Layout Type:** Next.js App Router layout system
- **Root Layout:** `src/app/layout.tsx`
  - Loads Inter and Playfair Display fonts from Google Fonts
  - Includes Vercel Analytics
  - No header/navigation in layout - homepage is self-contained
- **Homepage Structure:** Self-contained single-page layout with multiple sections
- **Container Classes:** Uses custom Tailwind utilities:
  - `container-wide` (max-w-6xl mx-auto px-4)
  - `container-narrow` (max-w-2xl mx-auto px-4)

## 3. Hero/Header Section

- **Location:** Lines 12-37 in `src/app/page.tsx`
- **Section Class:** `relative py-24` with `bg-slate-50`
- **Content Structure:**
  - H1 title with responsive typography (`text-4xl md:text-6xl lg:text-7xl`)
  - Subtitle paragraph
  - Description paragraph
  - Single CTA button linking to `/the-spark`
- **Animation:** Framer Motion with fade-in and slide-up effects
- **No traditional navigation/header** - homepage starts directly with hero

## 4. Pricing/Services Blocks

- **Location:** Lines 65-127 in `src/app/page.tsx`
- **Data Source:** Static content from `src/content/siteContent.ts`
- **Structure:** 3-tier pricing grid:
  - Spark (Free)
  - Foundation ($99) - marked as primary
  - Transformation ($299)
- **Features:** Each tier has feature list and CTA button
- **Styling:** Uses `card-interactive` Tailwind utility, primary tier has scale effect

## 5. Dependencies and Utilities

### Core Dependencies:
- **Next.js 15.2.5** - App Router framework
- **React 19.1.0** - UI library
- **Framer Motion 12.10.5** - Animations
- **Tailwind CSS 3.4.1** - Styling framework
- **@vercel/analytics** - Analytics tracking

### Helper Components:
- **Motion components** from Framer Motion for animations
- **Link component** from Next.js for navigation
- **Custom Tailwind utilities** defined in `tailwind.config.ts`

### Content Management:
- **siteContent object** from `src/content/siteContent.ts` - all homepage content

## 6. Navigation/Header Logic

- **No traditional header/nav** on homepage
- **Footer navigation** (lines 166-186) includes:
  - About link (`/about`)
  - Founder's Letter link (`/foundersletter`)
  - Sign In link (`/signin`)
- **CTA Links:** All point to `/the-spark` route
- **Navigation utilities** exist but not used on homepage:
  - `src/components/withNavigation.tsx` - HOC for scroll navigation
  - `src/utils/scrollNavigation.ts` - keyboard/scroll navigation (used on other pages)

## 7. Data Sources

- **Static Content:** All homepage content sourced from `src/content/siteContent.ts`
- **No CMS Integration:** Content is hardcoded in TypeScript object
- **No Dynamic Data:** No API calls or database queries
- **Content Structure:**
  - `homepage.hero` - Hero section content
  - `homepage.howItWorks` - 3-step process
  - `homepage.pricing` - 3 pricing tiers
  - `homepage.testimonials` - 3 testimonials
  - `homepage.finalCta` - Final call-to-action
  - `siteContent.footer` - Footer content
  - `siteContent.navigation` - Navigation labels

## 8. Tailwind Styling Tokens

### Custom Design System (from `tailwind.config.ts`):
- **Color Palette:**
  - `wcn-primary`: #216869 (Deep green for CTAs)
  - `wcn-accent1`: #49a078 (Mid green for highlights)
  - `wcn-accent2`: #9cc5a1 (Light green accents)
  - `wcn-text`: #dce1de (Light text for dark backgrounds)
  - Slate scale for grays (50-900)

- **Component Utilities:**
  - `.card`, `.card-elevated`, `.card-interactive`
  - `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-ghost`
  - `.input`, `.input-error`
  - `.container-narrow`, `.container-wide`
  - `.text-heading`, `.text-body`, `.text-muted`

- **Custom Shadows:**
  - `shadow-card`, `shadow-card-hover`
  - `shadow-button`, `shadow-button-hover`

### Typography:
- **System Fonts:** Uses system font stack (no external fonts beyond Google Fonts)
- **Font Variables:** `--font-inter`, `--font-playfair` (though Playfair not used on homepage)

## 9. Reusable Components Across Routes

### Homepage-Specific:
- No shared components - homepage is self-contained

### Shared Components Available:
- `src/components/ui/LoadingState.tsx` - Loading spinner
- `src/components/ui/FounderNote.tsx` - Founder note component
- Custom Tailwind utilities used across all routes
- Layout system (`src/app/layout.tsx`) shared across all pages

### Components Not Used on Homepage:
- `src/components/withNavigation.tsx` - HOC for scroll navigation (used on investor deck)
- Various investor deck components (Hero, Problem, Solution, etc.)
- Form components (admin, upload, auth)

## Key Findings for Rewrite:

1. **Self-Contained Structure:** Homepage doesn't rely on shared navigation components
2. **Static Content:** All content comes from single TypeScript file
3. **Clean Tailwind System:** Well-organized custom utilities and design tokens
4. **Animation System:** Framer Motion used throughout for smooth interactions
5. **Mobile-First:** Responsive design with Tailwind breakpoints
6. **No CMS:** Content updates require code changes
7. **Single CTA Flow:** All actions funnel to `/the-spark` route
8. **Modern Stack:** Next.js 15 App Router with latest React