# CHANGELOG

> 🧾 **Purpose:** This file is for human-readable updates and release tracking.
>  
> ✅ Summarizes changes made to the project in a way that developers, collaborators, and future team members can quickly understand.  
>  
> 🧠 A parallel file, `CHANGELOG-LLM.md`, contains detailed context intended for LLMs and internal documentation systems.  
> If you're adding a change here, consider updating both files to preserve alignment.

## [Unreleased]

### Added
- Admin Dashboard at `/admin` for onboarding approvals and token generation
  - Displays onboarding records pulled from Airtable
  - Allows flipping `pending` users to `active`
  - Generates secure token to enable user access to `/submit`
- Token-based lightweight auth system for client submissions
  - Generated tokens saved to Airtable
  - Used to link clients to their personalized intake page
- ESLint configuration for pragmatic development 🥂
  - Relaxed unused parameter rules for API routes
  - Our first tech debt! (Cheers to many more)
  - Finally disabled build-time linting (should have done this 10 commits ago 🤦‍♂️)

### Enhanced
- Updated Airtable schema:
  - Added `Status`, `Token`, `Created At`, and `Approved By` fields
- Improved data structure for future migration to Supabase
- Finalized onboarding UX flow with real-time validation using Zod + `react-hook-form`
- Fixed TypeScript linting issues:
  - Added proper typing for Airtable records
  - Improved error handling patterns
- Fixed API route handling:
  - Standardized route handler types across all endpoints
  - Added consistent GET handlers for better Next.js route detection
  - Resolved production build issues with dynamic routes
  - Implemented proper typing for dynamic vs static routes
- Fixed Airtable field name consistency:
  - Aligned `Created At` field name across all API routes
  - Added missing `Email` field to onboarding submission
  - Ensured proper `Status` initialization for new entries

### Technical Notes
- Next.js App Router route types:
  - Static routes (e.g., `/api/onboard`) use simple request typing
  - Dynamic routes (e.g., `/api/admin/entries/[id]`) require parameter typing
  - Important for proper type safety and route validation

### Prepared
- Planned `/submit` page for accepting food logs or meal photos
  - Timestamped, token-authenticated submissions
  - Lays groundwork for future food DB and Day in the Life generation

### Renamed
- Project renamed to `the-catalyst-core` to reflect purpose as platform engine
