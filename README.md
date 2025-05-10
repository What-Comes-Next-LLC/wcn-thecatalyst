# The Catalyst: What Comes Next?

**A privacy-first AI coaching platform, built from lived experience—not VC hype.**

Welcome to the central repository for The Catalyst, the flagship suite from [What Comes Next? LLC](https://whatcomesnextllc.ai). Originally a landing page, this codebase now powers a modular, AI-augmented coaching platform designed for real people, real trainers, and real transformation. Every commit is a data point in the story of building an entire ecosystem—solo, sober, and from scratch.

---

## Project Scope

The Catalyst is not just an app—it's a full-stack, privacy-respecting coaching infrastructure:

- Trainer Dashboard (`/admin`)
  - Approve client onboarding
  - Generate personalized intake tokens
  - Send broadcast/individual emails

- Onboarding & Intake (`/onboard`)
  - Custom forms with visual theming
  - Airtable-backed submission logging
  - Zod + react-hook-form validation

- Client Submission Portal (`/submit`)
  - Token-based upload flow (no login)
  - Food log/photo collection for AI insights
  - Timestamped behavioral data (seed for CatalystDB)

- Brand-First Presentation Layer
  - Tailwind + custom class names (bg-wcn-primary, wcn-card, etc.)
  - Centralized content structure (deckContent.ts)
  - Responsive watermark logo, frosted glass cards, animation layering

- LLM-Ready Architecture
  - Markdown changelogs structured for AI context retention
  - Local-first inference model planning
  - RAG integration roadmap for dynamic feedback generation

---

## Philosophy & Foundations

“We don’t sell habits. We build catalysts.”

This platform is built with three unshakable pillars:

1. Human-First — Built by someone who had to rebuild everything: health, career, self-worth.
2. Privacy by Design — Your data is yours. We don't touch it unless you say so.
3. LLM-Aware, Not LLM-Dependent — AI augments coaching; it never replaces it.

Read the [expanded brand kit](./docs/BRAND-KIT.expand.md) for our full philosophy.

---

## Repo Structure Highlights

```
/src
├── app/
│   ├── onboard/       # Client intake UI
│   ├── submit/        # Upload interface
│   └── admin/         # Trainer dashboard
├── components/        # Modular UI components
├── content/
│   └── deckContent.ts # Central content store
├── lib/
│   └── email.ts       # Dynamic mailer logic (env-aware)
├── types/             # Shared TS types

/docs
├── BRAND-KIT.md
├── BRAND-KIT.expand.md
├── CHANGELOG.md
├── CHANGELOG-LLM.md
├── CAPTAINS-LOG.md
```

---

## Timeline So Far

The journey—documented in commit logs and coffee-fueled markdowns:

| Milestone | Description |
|----------|-------------|
| Q1 2025  | Initial onboarding forms, Airtable pipeline, admin dashboard prototype |
| Q2 2025  | Tailwind branding system, form rework, email system, /onboard polish |
| Now      | Preparing MVP demos, RAG/local LLM integration, client trial rollout |

Changelog sources:
- [CHANGELOG.md](./docs/CHANGELOG.md)
- [CHANGELOG-LLM.md](./docs/CHANGELOG-LLM.md)

---

## Future-Proofing

The Catalyst isn't designed to scale to millions of users—it's designed to scale to the right ones:

- Local-first LLM deployments
- Task-specific “LLM-in-a-Box” appliances for trainers and clinics
- Self-hosted or hybrid cloud options
- Fully white-labelable for enterprise health systems

---

## Developer Notes

- Built in Next.js App Router
- Uses TailwindCSS with custom theming
- Airtable as interim backend, with future Supabase/Postgres migration planned
- Email dispatch handled via dynamic endpoints (Prod vs Local)
- Markdown-first content + changelog system

---

## Contributing

At this stage, contributions are invitation-only. If you see this and want to help—email [coach@whatcomesnextllc.ai](mailto:coach@whatcomesnextllc.ai) or support our campaign at [whatcomesnextllc.us/product/a-dollar](https://whatcomesnextllc.us/product/a-dollar).

This is not a startup in the typical sense. It’s a survival story, productized.

---

## Built With

- Next.js
- TailwindCSS
- Airtable
- Proton Mail
- Custom LLM stack (DeepSeek + local inference coming soon)

---

## Attribution

**Founder**: Jason Rashaad  
**Company**: What Comes Next? LLC  
**Address**: 535 Griswold Street, Suite 111-132, Detroit, MI 48226  
**Socials**: [@whatcomesnextllc](https://instagram.com/whatcomesnextllc)

---

“We’re not optimizing habits. We’re surviving, thriving, and starting over—for real this time.”