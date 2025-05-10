# The Catalyst Brand Kit

## Color Palette

### Primary Colors
- **Primary Green** (`#216869`)
  - Usage: Primary brand color, main CTAs, key UI elements
  - Tailwind Class: `bg-wcn-primary`, `text-wcn-primary`
  - Location: `tailwind.config.ts` under `theme.extend.colors.wcn.primary`

- **Accent Green 1** (`#49a078`)
  - Usage: Secondary elements, gradients, hover states
  - Tailwind Class: `bg-wcn-accent1`, `text-wcn-accent1`
  - Location: `tailwind.config.ts` under `theme.extend.colors.wcn.accent1`

- **Accent Green 2** (`#9cc5a1`)
  - Usage: Tertiary elements, highlights, subtle accents
  - Tailwind Class: `bg-wcn-accent2`, `text-wcn-accent2`
  - Location: `tailwind.config.ts` under `theme.extend.colors.wcn.accent2`

### Neutral Colors
- **Text** (`#dce1de`)
  - Usage: Primary text color, high contrast elements
  - Tailwind Class: `text-wcn-text`
  - Location: `tailwind.config.ts` under `theme.extend.colors.wcn.text`

- **Dark** (`#000000`)
  - Usage: Backgrounds, dark mode elements
  - Tailwind Class: `bg-wcn-dark`
  - Location: `tailwind.config.ts` under `theme.extend.colors.wcn.dark`

## Configuration Files

### Tailwind Configuration
- Location: `tailwind.config.ts`
- Contains:
  - Color palette definitions
  - Custom utility classes
  - Component-specific styles
  - Gradient definitions

### Custom Utilities
- **Gradients**: `bg-wcn-gradient`
- **Cards**: `bg-wcn-card`, `backdrop-blur-wcn-card`
- **Hover States**: `hover:border-wcn-card-hover`

## Assets

### Logo
- Location: `/public/images/logo-official.png`
- Usage: Watermark and branding elements
- Implementation: Next.js Image component with fill property

## Content Themes

### Brand Voice
The Catalyst's content should reflect:

1. **Behavior-First Approach**
   - Focus on sustainable habit formation
   - Emphasis on long-term transformation
   - Personal journey and growth

2. **Professional but Accessible**
   - Clear, direct communication
   - Technical accuracy without jargon
   - Encouraging and supportive tone

3. **Key Themes**
   - Transformation through behavior change
   - Sustainable fitness practices
   - Personalized coaching experience
   - Technology-enhanced human connection

### Content Structure
All content should be managed through the central content store:
- Location: `src/content/deckContent.ts`
- Structure: Organized by sections with consistent patterns
- Usage: Import and destructure needed content in components

### Writing Guidelines
1. **Headings**
   - Clear, action-oriented
   - Focus on transformation and journey
   - Keep concise and impactful

2. **Body Text**
   - Focus on behavior and habits
   - Avoid financial or technical jargon
   - Use active voice
   - Include clear calls to action

3. **CTAs**
   - Action-oriented
   - Focus on transformation
   - Clear value proposition

## Implementation Notes

### Component Development
- Use Tailwind utility classes for consistent styling
- Follow the established content store pattern
- Maintain responsive design principles
- Implement proper accessibility features

### Content Management
- All text content should be managed through `deckContent.ts`
- Follow the established section structure
- Maintain consistent naming conventions
- Use TypeScript for type safety 