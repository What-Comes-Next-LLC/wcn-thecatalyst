# Authentication Transition Technical Debt

## Overview
This document tracks technical debt related to the transition from Airtable to Supabase authentication and user management.

## Current Status
- ✅ Supabase authentication is implemented
- ✅ `user_profiles` table is created and in use
- ✅ Admin approval flow is updated to use Supabase
- ✅ Onboarding flow is updated to use Supabase

## Technical Debt Items

### 1. Legacy Airtable References
Several files still contain references to Airtable that need to be cleaned up:

#### API Routes
- `src/app/api/admin/users/route.ts`
  - Still fetches users from Airtable
  - Should be updated to use Supabase `user_profiles` table

- `src/app/api/admin/approve/route.ts`
  - Contains Airtable user creation logic
  - Should be removed or updated to use Supabase

- `src/app/api/admin/entries/route.ts`
  - May contain Airtable references
  - Needs audit for Airtable usage

#### Utility Files
- `src/lib/airtable.ts`
  - Contains all Airtable logic
  - Can be deprecated once migration is complete

- `src/lib/auth.ts`
  - Uses Airtable for token validation
  - Should be updated to use Supabase auth

#### Types and Components
- `src/types/admin.ts`
  - Contains Airtable-style type definitions
  - Should be updated to match Supabase schema

- `src/components/admin/IndividualForm.tsx`
  - Uses Airtable-backed API routes
  - Should be updated to use Supabase endpoints

## Impact
- These legacy references don't affect current functionality
- They represent potential confusion for future development
- May cause issues if Airtable access is removed

## Priority
- Low priority for immediate action
- Should be addressed during future cleanup sprints
- No impact on current user experience

## Notes
- This technical debt was identified during the Supabase authentication implementation
- The code appears to be from a previous implementation attempt
- Current functionality works correctly with Supabase
- Cleanup can be scheduled for future maintenance
