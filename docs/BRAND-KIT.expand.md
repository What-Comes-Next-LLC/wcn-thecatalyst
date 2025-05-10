# What Comes Next? LLC – Brand Kit

> 🧭 This document is your north star. It defines who we are, why we build, and how we communicate. Every asset—from landing pages to investor decks—should reflect this DNA.

---

## 💡 Brand Essence

### Name: **What Comes Next?**
- **Type:** LLC
- **Tagline:** *Founder | Builder | Rebuilder*

### Mission:
To build radically personalized tools that restore human agency in health, wellness, and behavior—by putting **privacy**, **adaptation**, and **real-life lived experience** at the center of everything we create.

### Philosophy:
We don’t sell habits. We build catalysts.

The world doesn't need another app. It needs **tools that meet people where they are** and grow with them. Tools built with a deep understanding of how real people live, fall apart, get back up, and try again.

This isn’t about optimizing metrics. This is about building for **grit, change, and survival**.

---

## 🎯 Brand Pillars

### 1. **Human First**
- Built by someone who lived it.
- Every product starts with a person, not a persona.
- We believe in trust, coaching, and consistency.

### 2. **Privacy by Design**
- Local-first data architecture
- No data selling, no third-party surveillance
- Customers are **clients**, not **products**

### 3. **LLM-Aware, Not LLM-Dependent**
- AI enhances, not replaces, human coaching
- Our tools adapt over time, not overstep
- LLMs are modular, explainable, and localizable

### 4. **Unapologetically Real**
- Fitness is messy, life is messier
- We show the work
- No filters, no gimmicks—just growth

---

## 🎨 Visual Identity

### Color Palette (Tailwind classes provided)
| Purpose | Color | Class Name |
|--------|--------|------------|
| Primary Brand | `#216869` | `bg-wcn-primary` |
| Accent 1 | `#49a078` | `bg-wcn-accent1` |
| Accent 2 | `#9cc5a1` | `bg-wcn-accent2` |
| Text | `#dce1de` | `text-wcn-text` |
| Black/Contrast | `#000000` | `text-black` |

> Use the primary color for major UI elements (headers, calls to action), accents for depth and variation, and text color for all neutral-readable areas. Cards should use frosted glass effect + opacity overlays.

### Typography & UI
- Strong preference for **clean, bold sans-serif** (e.g., Inter, Helvetica Neue)
- Layouts should use **grid systems** with high whitespace
- Components must feel modular, minimal, and fast
- Animations should be **subtle and signal clarity** (not flashiness)

---

## ✍️ Tone & Voice

### Voice Attributes
| Attribute | Description |
|----------|-------------|
| Honest | We speak plainly, even when it’s hard |
| Relatable | We write like a coach, not a corporation |
| Strategic | We are focused, efficient, and visionary |
| Gritty | We’ve been through it, and it shows |
| Unfiltered | We don’t pretend to have it all together—we just keep moving |

### Style Examples:
- **Before:** “Optimize your fitness journey with the power of AI.”  
  **After:** “You don’t need another app. You need a plan that finally sticks.”

- **Before:** “Empowering users with data privacy.”  
  **After:** “We don’t sell your data. Period.”

- **Before:** “Get started in 3 easy steps.”  
  **After:** “Let’s start with where you’re at. We’ll figure the rest out together.”

---

## 🔧 Technical Philosophy (for Designers, Devs & LLMs)

### Content Strategy
- All content (homepages, pitch decks, feature pages) pulls from a **centralized content store** (`deckContent.ts`) for consistency
- Markdown changelogs (`CHANGELOG.md`, `CHANGELOG-LLM.md`) represent **intentionality across human + machine audiences**

### Component Design
- Use Tailwind utilities with brand class names (e.g., `bg-wcn-primary`, `wcn-card`)
- Maintain **semantic HTML** and accessibility guidelines
- Prioritize **modularity** (everything should be component-first)

### LLM & AI
- Internal language models should be able to:
  - Digest structured memory files (`CHANGELOG-LLM.md`, client data logs)
  - Use brand tone when generating responses or summaries
  - Respect user privacy context boundaries
- Local-first LLM deployment is not optional—it’s foundational

---

## 📢 Campaign Direction

### You’re Building For:
- Men 40+ who want to rebuild their health
- Trainers who are tired of bad software
- Founders and fighters who’ve fallen but got back up
- Anyone who’s ever asked, *“What comes next?”*

### Content Anchors
- “Road to 1000” campaign
- “Big Mac to Go” tailored scenarios
- “Coach’s Clipboard” admin view
- “Can I Get a Dollar?” support campaign

### Brand Summary (Use for social bios, slide footers, link previews)
> **What Comes Next?** is a privacy-first platform for rebuilding health and fitness, built by someone who’s lived it. We combine real coaching, local AI, and zero bullshit. This isn’t about optimizing habits. It’s about surviving, thriving, and starting over—for real this time.

---

*Last updated: 2025-04-21 – Aligned with Tailwind color config and current MVP branding.*
