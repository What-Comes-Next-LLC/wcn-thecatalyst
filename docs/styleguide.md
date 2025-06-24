# The Catalyst Design System & Style Guide

**Version:** 1.0  
**Last Updated:** 2025-06-24  
**Purpose:** Comprehensive style guide for consistent branding across The Catalyst platform

---

## Color Palette

### Primary WCN Brand Colors

| Color | Hex Code | Usage | CSS Class |
|-------|----------|-------|-----------|
| **WCN Primary** | `#216869` | Main brand color, primary CTAs, active states | `bg-wcn-primary`, `text-wcn-primary`, `border-wcn-primary` |
| **WCN Accent 1** | `#49a078` | Success states, highlights, secondary CTAs | `bg-wcn-accent1`, `text-wcn-accent1`, `border-wcn-accent1` |
| **WCN Accent 2** | `#9cc5a1` | Light accents, subtle highlights | `bg-wcn-accent2`, `text-wcn-accent2`, `border-wcn-accent2` |
| **WCN Text** | `#dce1de` | Light text for dark backgrounds | `text-wcn-text` |
| **WCN Dark** | `#000000` | Dark backgrounds, high contrast | `bg-wcn-dark`, `text-wcn-dark` |

### Semantic Slate Colors

| Color | Hex Code | Usage | CSS Class |
|-------|----------|-------|-----------|
| **Slate 50** | `#f8fafc` | Light backgrounds, cards | `bg-slate-50`, `text-slate-50` |
| **Slate 200** | `#e2e8f0` | Borders, dividers | `bg-slate-200`, `border-slate-200` |
| **Slate 500** | `#64748b` | Muted text | `text-slate-500` |
| **Slate 700** | `#334155` | Body text | `text-slate-700` |
| **Slate 900** | `#0f172a` | Headings, high contrast text | `text-slate-900` |

---

## Typography

### Text Utility Classes

| Class | Usage | Properties |
|-------|-------|------------|
| `.text-heading` | Page/section headings | `font-semibold text-slate-900` |
| `.text-body` | Standard body text | `text-slate-700` |
| `.text-muted` | Secondary/muted text | `text-slate-500` |
| `.text-wcn-text` | Light text on dark backgrounds | `color: #dce1de` |

### Font System
- **Primary Font:** System UI stack (`system-ui`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`)
- **Monospace:** UI monospace stack (`ui-monospace`, `SFMono-Regular`, `Monaco`, `Consolas`)

---

## Layout Components

### Container Classes

| Class | Usage | Properties |
|-------|-------|------------|
| `.container-narrow` | Centered content, narrow width | `max-w-2xl mx-auto px-4` |
| `.container-wide` | Centered content, wide width | `max-w-6xl mx-auto px-4` |

---

## Card Components

### Card Variants

| Class | Usage | Properties |
|-------|-------|------------|
| `.card` | Basic card | `bg-white border border-slate-200 rounded-card shadow-card` |
| `.card-elevated` | Enhanced shadow card | `bg-white border border-slate-200 rounded-card shadow-card-hover` |
| `.card-interactive` | Hover-enabled card | `card + hover:shadow-card-hover transition-shadow duration-200 cursor-pointer` |

### Watermark Cards (Dark Theme)
For interstitial pages with watermark backgrounds:
- Background: `bg-wcn-primary/80 backdrop-blur-sm`
- Border: `border-2 border-wcn-card`
- Shadow: `shadow-2xl`

---

## Button Components

### Button Base
All buttons inherit: `.btn`
- Properties: `inline-flex items-center px-4 py-2 rounded-button font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2`

### Button Variants

| Class | Usage | Appearance |
|-------|-------|------------|
| `.btn-primary` | Primary CTAs, main actions | Green background (`bg-wcn-primary`), white text, hover to `bg-wcn-accent1` |
| `.btn-secondary` | Secondary actions | Light gray background (`bg-slate-100`), dark text (`text-slate-800`) |
| `.btn-ghost` | Minimal actions | Transparent background, WCN primary text, hover background |

### Button Sizes

| Class | Usage | Properties |
|-------|-------|------------|
| `.btn-sm` | Small buttons, inline actions | `px-3 py-1.5 text-sm` |
| Default | Standard buttons | `px-4 py-2` (from `.btn` base) |
| `.btn-lg` | Large buttons, important CTAs | `px-6 py-3 text-lg` |
| `.btn-xl` | Extra large buttons, hero CTAs | `px-8 py-4 text-xl` |

### Button Examples
```html
<!-- Small button -->
<button class="btn-secondary btn-sm">Cancel</button>

<!-- Standard button -->
<button class="btn-primary">Start Logging</button>

<!-- Large button -->
<button class="btn-primary btn-lg">Get Started</button>

<!-- Extra large button (hero CTA) -->
<button class="btn-primary btn-xl">Transform Your Life</button>

<!-- Custom width (pricing cards) -->
<button class="btn-primary btn-lg w-full">Buy Now</button>
```

---

## Form Components

### Input Fields

| Class | Usage | Properties |
|-------|-------|------------|
| `.input` | Standard form inputs | `block w-full px-3 py-2 border border-slate-300 rounded-input focus:ring-wcn-primary focus:border-wcn-primary` |
| `.input-error` | Error state inputs | `.input` + red border and focus states |

### Form Labels
- Standard: `block text-heading text-base font-semibold mb-2`
- Dark theme: `block text-wcn-text text-base font-semibold mb-2`

---

## Background Patterns

### Gradient Backgrounds

| Pattern | Usage | CSS Classes |
|---------|-------|-------------|
| **WCN Gradient** | Main brand gradient | `bg-wcn-gradient from-wcn-primary to-wcn-accent1` |
| **Dark Gradient** | High contrast, app interfaces | `bg-gradient-to-b from-wcn-primary via-wcn-dark to-black` |

### Watermark Pattern
For interstitial pages (Sign In, Sign Out, The Spark, Pending):

```jsx
<main className="min-h-screen bg-wcn-gradient from-wcn-primary to-wcn-accent1 relative overflow-hidden">
  {/* Watermark Logo */}
  <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
    <div className="absolute inset-0 bg-wcn-primary/5"></div>
    <div className="absolute inset-0 w-full h-full">
      <Image
        src="/images/logo-official.png"
        alt="What Comes Next Logo"
        fill
        className="object-contain opacity-[0.15] mix-blend-overlay"
        priority
      />
    </div>
  </div>
  {/* Content */}
</main>
```

---

## Page-Specific Patterns

### Homepage
- Background: Layered sections with `bg-wcn-gradient` and section-specific overlays
- Cards: Interactive cards with hover animations
- Buttons: Primary CTAs use `btn-primary`

### Interstitial Pages (Sign In, Sign Out, The Spark, Pending)
- Background: WCN gradient with watermark logo
- Cards: Dark theme cards with `bg-wcn-primary/80`
- Text: Light colors using `text-wcn-text`
- Buttons: Standard `btn-primary` styling

### Application Pages (/log, /admin)
- Background: Dark gradients for focused work environments
- Text: High contrast for readability

---

## Animations & Transitions

### CSS Animations (Homepage)
- `.animate-fade-in-up` - Fade in with upward motion
- `.animate-fade-in` - Simple fade in
- `.animate-stagger` - Staggered delays (`.stagger-1` through `.stagger-5`)

### Hover Effects
- Cards: `hover:shadow-card-hover transition-shadow duration-200`
- Buttons: Built into button utilities
- Interactive elements: `transition-all duration-200`

---

## Accessibility

### Focus States
- All interactive elements have proper focus rings
- Focus color: WCN Primary (`#216869`)
- Focus ring: `focus:ring-2 focus:ring-wcn-primary focus:ring-offset-2`

### Color Contrast
- Light text on dark backgrounds: Use `text-wcn-text` (#dce1de)
- Dark text on light backgrounds: Use `text-slate-900` or `text-slate-700`
- Error states: Red variants with sufficient contrast

---

## Implementation Notes

### Tailwind Configuration
- Active config: `tailwind.config.ts`
- Legacy config removed: `tailwind.config.mjs`
- Component utilities defined in config plugins

### Component Organization
- Reusable watermark: `WatermarkBackground.tsx`
- Section wrapper: `SectionWrapper.tsx`
- All custom animations in `globals.css`

---

## Usage Guidelines

### Do's
- ✅ Use `btn-primary` for all primary CTAs
- ✅ Apply watermark pattern to interstitial pages
- ✅ Use `text-wcn-text` on dark backgrounds
- ✅ Follow container patterns for consistent spacing
- ✅ Use WCN gradient for brand-heavy pages

### Don'ts
- ❌ Mix light and dark themes within same page
- ❌ Override button styles without updating design system
- ❌ Use arbitrary colors outside the defined palette
- ❌ Apply watermark to functional app pages (/log, /admin)

---

**Maintained by:** Development Team  
**For questions:** Reference this guide first, then consult with design team