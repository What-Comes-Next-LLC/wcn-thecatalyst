# CHANGELOG

> 🧾 **Purpose:** This file is for human-readable updates and release tracking.
>  
> ✅ Summarizes changes made to the project in a way that developers, collaborators, and future team members can quickly understand.  
>  
> 📝 **Update Guidelines:**
> - Each change should include a "Files Changed" section listing modified files
> - Group changes under appropriate headers (Added, Enhanced, Fixed, etc.)
> - Keep descriptions concise and human-readable
> - Focus on what changed and why, not technical details
> - Always wait for approval before implementing changes
> - Update both changelogs to maintain consistency
>
> 🧠 A parallel file, `CHANGELOG-LLM.md`, contains detailed context intended for LLMs and internal documentation systems.  
> If you're adding a change here, consider updating both files to preserve alignment.

## [Unreleased]

### Added
- Configured custom Tailwind color palette for What Comes Next? brand identity
  - Added to `tailwind.config.ts` under `theme.extend.colors.wcn`
  - Primary: `#216869` (logo core), Text: `#dce1de`, Accents: `#49a078`, `#9cc5a1`, Black
  - Enables `bg-wcn-primary`, `text-wcn-text`, `bg-wcn-accent1`, etc. classes in UI components
  - Establishes design consistency across all WCN frontend elements

### Enhanced
- Redesigned landing page with modern UI elements
  - Created responsive watermark logo that scales with viewport
  - Implemented frosted glass effect cards for navigation
  - Added subtle hover animations and transitions
  - Maintained brand consistency with new color system
  - Improved visual hierarchy and user focus

- Redesigned onboarding page with consistent brand identity
  - Added watermark logo with unique styling for visual differentiation
  - Updated gradient colors for better visual separation from other pages
  - Improved hero text styling and messaging
  - Added card-style form container with backdrop blur
  - Enhanced success message animation
  - Files Changed: `src/app/onboard/page.tsx`

### About Page Implementation
- Added centralized about page content to deckContent.ts
- Implemented responsive about page with company and founder sections
- Created reusable content structure for future scalability
- Maintained consistent styling with brand guidelines
- Added support for hero images and metrics display
- Files Changed: 
  - `src/content/deckContent.ts`
  - `src/app/about/page.tsx`

### Technical Debt
- Content store fragmentation
  - Files affected: `src/content/deckContent.ts`, `src/content/uploadContent.ts`
  - Current: Separate content stores for deck and upload flows
  - Future: Consolidate into organized content hierarchy
  - Rationale: Maintaining velocity while acknowledging need for future organization
