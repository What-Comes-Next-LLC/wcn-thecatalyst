# CHANGELOG-LLM

> 🤖 **Purpose:** This file contains structured, LLM-optimized metadata about the project.  
>  
> It is intended for:
> - Large Language Models (LLMs) referencing or extending the codebase
> - Internal tooling or automated documentation systems
> - Future agents or copilots trained on The Catalyst ecosystem
>
> ⚠️ This file is *not optimized for humans*. Changes here should be updated alongside the human-readable `CHANGELOG.md` to ensure consistency.  
> 
> Think of this as YAML meets mind palace.

## [Unreleased]

### SYSTEM PHASE: ONBOARDING → MANUAL ACTIVATION → TOKENIZED AUTH FLOW

- Introduced Admin Dashboard (`/admin`) for user approval and management of onboarding records (Airtable source of truth)
  - Displays user `Name`, `Email`, `Status`, `Token`, `Created At`
  - Filters to show only `pending` or `active` records
  - Admin can:
    - Flip `status` from `pending` → `active`
    - Generate secure token via crypto (UUID fallback) once `status = active`
  - Frontend updates after actions; tied to Airtable PATCH API

- Expanded Airtable schema to support:
  - `Status` field (default: `pending`; manual set to `active`)
  - `Token` field (set by server route)
  - Optional: `Approved By`, `Created At` (for audit trail / UI convenience)

- Purpose of token system:
  - Lightweight, zero-login user auth
  - Token embedded in `/submit?token=xyz` URL
  - Used for both existing users (e.g., Jay) and new user flow after approval
  - Tokens persist across submission instances; scoped per-user

- `/submit` page planned:
  - Accepts uploaded food log OR browser-captured meal photo
  - Records submission time, token, file
  - Initial goal: timestamp behavior, not calories
  - Later: cross-reference with food log, plan generator, validation flow

- Submission = seeding both human-driven validation + future DB of repeat meals
- Every manual review now = eventual automation signal

- Strategy justified by: need to preserve user's native habits, reduce friction, while feeding longitudinal dataset that enhances trainer coaching

### TECHNICAL DEBT DECISIONS
- ESLint Configuration Strategy:
  - Context: API route handlers require parameters by type but often don't use them
  - Decision: Relaxed `@typescript-eslint/no-unused-vars` rule
  - Rationale: 
    - Improved developer experience
    - Reduced boilerplate in method-not-allowed handlers
    - Balanced type safety with pragmatic development
  - Future Considerations:
    - May need to revisit when route complexity increases
    - Consider middleware approach for method validation
    - Document pattern for consistency across new routes

### TYPE SYSTEM IMPROVEMENTS
- Enhanced TypeScript strictness:
  - Added `AirtableRecord` interface for API route type safety
  - Defined strict typing for Status field as 'pending' | 'active' union
  - Implemented flexible field typing with `[key: string]: unknown`
  - Optimized error handling patterns in try-catch blocks
  - Purpose: Maintain type safety while allowing for Airtable schema evolution

### NEXT.JS APP ROUTER PATTERNS
- Route Handler Type Signatures:
  - Static Routes:
    - Example: `/api/onboard`
    - Simple signature: `async function POST(request: Request)`
    - No parameter typing needed
    - Used for fixed endpoints without URL parameters
  - Dynamic Routes:
    - Example: `/api/admin/entries/[id]`
    - Complex signature: `async function PATCH(request: Request, props: Props)`
    - Requires explicit parameter typing via Props interface
    - Essential for Next.js route validation and type safety
    - Pattern: `type Props = { params: { [key: string]: string } }`
  - Purpose: 
    - Ensure type safety across different route patterns
    - Enable proper URL parameter validation
    - Maintain consistent typing patterns for future route additions

### API ROUTE OPTIMIZATION
- Standardized route handler patterns:
  - Switched from destructured params to props object pattern
  - Added minimal GET handlers for proper route registration
  - Fixed production build issues with dynamic route parameters
  - Improved error handling and response types
  - Purpose: Ensure consistent behavior across development and production environments

### DATA CONSISTENCY IMPROVEMENTS
- Fixed Airtable field name alignment:
  - Standardized timestamp field to `Created At` across all routes
  - Added missing `Email` field in onboarding POST payload
  - Added explicit `Status: 'pending'` initialization
  - Impact: Resolved field name mismatch between API routes and Airtable schema
  - Purpose: Ensure data consistency and proper record initialization

### LOGIC SHIFT: This repo now represents "the-catalyst-core" and will serve as the basis for:
- All user interactions
- Trainer/Coach workflows
- CatalystDB schema evolution
- Eventual LLM integration + feedback loop via plan generation engine
