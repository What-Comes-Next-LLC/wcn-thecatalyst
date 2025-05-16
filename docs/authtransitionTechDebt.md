# Authentication Transition Technical Debt

## Overview
This document tracks technical debt related to the transition from Airtable to Supabase authentication and user management.

## Current Status
- ✅ Supabase authentication is implemented
- ✅ `user_profiles` table is created and in use
- ✅ Admin approval flow is updated to use Supabase
- ✅ Onboarding flow is updated to use Supabase
- ✅ Supabase storage integration for file uploads is implemented

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

## Implementation Plan (June 10, 2024)

### Phase 1: Clean Up Legacy References

#### API Routes Refactoring
- `src/app/api/admin/users/route.ts`
  - Replace Airtable fetch with Supabase query to `user_profiles` table
  - Update return data structure to match frontend expectations

- `src/app/api/admin/approve/route.ts`
  - Replace with Supabase user approval flow
  - Implement role-based access control using Supabase's JWT claims

- `src/app/api/admin/entries/route.ts`
  - Audit and refactor to use Supabase queries
  - Update data structures for Supabase compatibility

#### Utility Files Replacement
- `src/lib/auth.ts`
  - Create new Supabase-based token validation functions
  - Implement middleware for route protection based on roles
  - Add session management utilities

- `src/lib/airtable.ts`
  - Create `src/lib/supabaseUtils.ts` to replace Airtable functionality
  - Deprecate after all references are removed

#### Types and Components Updates
- `src/types/admin.ts`
  - Update type definitions to match Supabase schema
  - Add appropriate interfaces for role-based access control

- `src/components/admin/IndividualForm.tsx`
  - Update to use Supabase endpoints
  - Implement proper error handling for Supabase responses

### Phase 2: Role-Based Authentication Enhancement

#### Database Schema Updates
- Create `user_roles` table with Row Level Security policies
- Implement role assignment in user registration flow
- Add appropriate triggers for role changes

#### Authentication Flow Improvements
- Implement consistent authentication checks across the application
- Create React Context for auth state management
- Add protected route HOCs based on role requirements

#### Admin Tools
- Update admin dashboard for Supabase-based user management
- Add role assignment interface for coaches
- Create audit logging for authentication events

### Phase 3: Testing and Documentation

#### Testing
- Create comprehensive test suite for authentication flows
- Test role-based access control for all routes
- Validate security of authentication implementation

#### Documentation
- Update all authentication-related documentation
- Create developer guide for authentication patterns
- Document security best practices for future development

### Final Steps
- Remove all Airtable dependencies from package.json
- Revoke Airtable API keys
- Perform final security audit

## Timeline
- Phase 1: 2 weeks
- Phase 2: 1 week  
- Phase 3: 1 week
- Final review and security audit: 3 days

## Risks and Mitigations
- Risk: Data inconsistency during migration
  - Mitigation: Create validation scripts to ensure data integrity

- Risk: Broken authentication flows
  - Mitigation: Implement extensive testing before deployment

- Risk: Unforeseen edge cases in role-based access
  - Mitigation: Document all possible authentication paths and test each one

## Success Criteria
- All references to Airtable removed
- All authentication flows working with Supabase
- Role-based access properly controlling all protected routes
- Clean, documented authentication API for future development

## Implementation Progress Update (June 10, 2024)

We have completed the following implementation steps:

1. ✅ Database schema updates:
   - Added RLS policies to spark_users table
   - Created role-based access control using JWT claims

2. ✅ Updated Authentication Flow:
   - Modified onboarding to store roles in user metadata
   - Updated onboarding to use spark_users table instead of user_profiles
   - Updated admin dashboard to fetch users from spark_users

3. ✅ API Route Updates:
   - Updated all admin API routes to check for coach role in metadata
   - Updated user fetching to use spark_users table
   - Updated user approval to use spark_users table

4. ✅ Role-based Access Control:
   - Added utility functions for role checks using metadata
   - Implemented coach access check for admin routes
   - Created functions to validate user roles

### Testing Instructions

1. **Testing Onboarding Flow:**
   - Register a new user at /onboard
   - Check Supabase for the new user with role='client' in metadata
   - Verify a record was created in spark_users with status='pending'

2. **Testing Admin Access:**
   - Log in as a coach user (use SQL to set role='coach' in metadata if needed)
   - Visit /admin dashboard
   - Verify you can see pending users

3. **Testing Approval Flow:**
   - Approve a pending user in the admin dashboard
   - Verify the user's status is updated to 'active' in spark_users table

4. **Testing Role Protection:**
   - Try accessing /admin as a non-coach user
   - Verify you are redirected away

### Known Issues

- Need to implement mechanism to update role in metadata for existing users
- Need to clean up legacy Airtable references from other parts of the codebase
- Should add comprehensive test coverage for authentication flows

### Next Steps

- Complete Phase 3 (Testing & Documentation)
- Remove all remaining Airtable dependencies
- Create additional utility functions for role management

## Authentication Callback Pages Implementation (June 10, 2024)

We have implemented the following authentication callback pages to complete the Supabase authentication flow:

1. **Email Verification Callback** (`/auth/callback`):
   - Handles email verification links sent by Supabase
   - Verifies the token using supabase.auth.verifyOtp()
   - Shows success/error states with appropriate messaging
   - Redirects to sign-in page after successful verification

2. **Password Reset Request** (`/auth/reset-password-request`):
   - Provides a form for users to request password reset emails
   - Uses Supabase's resetPasswordForEmail() function
   - Includes security-focused messaging that doesn't reveal if an email exists
   - Styled to match the site's aesthetic with watermark and frosted glass effects

3. **Password Reset Handler** (`/auth/reset-password`):
   - Processes password reset tokens from email links
   - Allows users to set a new password with confirmation
   - Enforces password strength requirements (uppercase, lowercase, number)
   - Provides clear success/error states with appropriate UI feedback

### Supabase Configuration

For these pages to work correctly, the Supabase project has been configured with:

- Site URL set to `whatcomesnextllc.ai`
- The following redirect URLs added:
  - `capacitor://localhost`
  - `http://localhost`
  - `com.whatcomesnext.spark://`
  - `com.whatcomesnext.spark://*`
  - `file://android_asset/public/*`
  - `https://whatcomesnextllc.ai/*`

### Dependencies

These pages require the following dependencies:
- framer-motion (for animations)
- react-hook-form (for form handling)
- zod (for form validation)
- @hookform/resolvers/zod (for integrating zod with react-hook-form)

These dependencies may need to be installed if not already present in the project.

### Testing Instructions

To test the complete authentication flow:

1. **Email Verification**:
   - Register a new user
   - Check email for verification link
   - Click the link to verify (should go to /auth/callback)
   - Verify you're redirected to sign in

2. **Password Reset**:
   - Go to /auth/reset-password-request
   - Enter an email address
   - Check email for reset link
   - Click the link (should go to /auth/reset-password)
   - Set a new password
   - Verify you can sign in with the new password

## Database Schema Reference

### spark_users Table Structure

The `spark_users` table stores user profile information and is essential to the authentication system:

| Field      | Type      | Description                                        | Example Values                          |
|------------|-----------|----------------------------------------------------|-----------------------------------------|
| id         | UUID      | Primary key, matches Supabase Auth user ID         | "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"  |
| name       | String    | User's full name                                   | "John Smith"                            |
| email      | String    | User's email address                               | "user@example.com"                      |
| age        | Number    | User's age                                         | 32                                      |
| height     | String    | User's height                                      | "5'11"                                  |
| weight     | String    | User's weight                                      | "185 lbs"                               |
| goal       | String    | User's fitness/health goal                         | "Weight loss", "Muscle gain"            |
| notes      | String    | Additional information (nullable)                  | "Prefer morning workouts"               |
| status     | String    | User approval status                               | "pending", "active"                     |
| role       | String    | User role in the system                            | "client", "coach"                       |
| created_at | Timestamp | Record creation timestamp                          | "2023-05-12T14:32:09.123Z"              |

**Authentication Process**:
1. When a user signs up, a record is created in Supabase Auth
2. User metadata includes `role` field set to "client" by default
3. A corresponding record is created in `spark_users` with `status` set to "pending"
4. Admin/coach must approve the user by setting `status` to "active"
5. Only users with "active" status can access protected routes

**Note**: This table replaces the previous Airtable-based user management system. All user management operations should use this table instead of any legacy Airtable references.

## Known Issues and Fixes

### Role-based Redirect in Signin Flow

**Issue (Fixed)**: There was an inconsistent role name check in the signin flow where the code was checking for `'admin'` while the rest of the application used `'coach'` as the admin role name. This caused coach users to be redirected to `/log` instead of `/admin` after signing in.

**Fix**: Updated the signin redirect logic in `src/app/signin/page.tsx` to check for the `'coach'` role instead of `'admin'`, ensuring consistent role naming throughout the application.

**Date Fixed**: June 11, 2024

## Authentication Migration Completion (June 12, 2024)

### Current State

We have successfully completed the migration from Airtable to Supabase authentication with the following achievements:

1. ✅ **Airtable Dependencies Removed**:
   - Deleted `/api/admin/groups/route.ts` with direct Airtable usage
   - Updated `/api/log/route.ts` and `/api/onboard/route.ts` to use Supabase
   - Created Supabase utility functions in `supabaseUtils.ts`
   - Removed `airtable.ts` and Airtable package dependencies

2. ✅ **Next.js Compliance**:
   - Fixed all production build errors related to authentication
   - Updated `useSearchParams()` usage in authentication pages with proper Suspense boundaries
   - Ensured all authentication routes follow Next.js best practices

3. ✅ **Authentication Flows**:
   - Email verification works correctly with proper redirect URLs
   - Password reset functionality is fully operational
   - Sign-up and sign-in flows complete successfully

4. ✅ **Role-Based Authentication**:
   - Established `user_metadata.role` as the source of truth for user roles
   - Updated existing users to include role="coach" in user metadata
   - Fixed role check inconsistency (changed 'admin' to 'coach' in signin flow)
   - Consistent role checking throughout the application

### Database Structure

The authentication system now relies on:

1. **Supabase Auth** - Core user identity and credentials
2. **spark_users table** - User profile information and status
3. **user_metadata** - Contains role information (accessible via JWT)

### Outstanding Issues

1. **Role Management UI**:
   - No interface exists for promoting users to coach role
   - Admin dashboard needs enhancement to support role management

2. **Admin Tool Separation**:
   - Admin functionality should eventually be moved to a separate project
   - Current implementation is integrated with the main application

3. **Test Coverage**:
   - Need comprehensive test coverage for authentication flows
   - Should include end-to-end tests for signup, verification, and password reset

4. **Documentation**:
   - Could improve developer documentation for authentication patterns
   - More detailed instructions needed for managing roles via SQL

### Next Steps

1. **Short-term (1-2 weeks)**:
   - Create coach role management interface in admin dashboard
   - Implement role promotion function with proper security checks
   - Add comprehensive test coverage for auth flows

2. **Medium-term (1-2 months)**:
   - Start planning separation of admin tool into its own project
   - Enhance logging for authentication events
   - Create comprehensive documentation for developers

3. **Long-term (3+ months)**:
   - Complete admin tool separation
   - Consider implementing more granular permissions within roles
   - Evaluate adding additional authentication methods (OAuth, SSO)

## Supabase Storage Integration (June 15, 2024)

We have successfully implemented Supabase Storage integration for file uploads with the following achievements:

1. ✅ **Storage Infrastructure**:
   - Created a secure `logs` storage bucket in Supabase
   - Implemented Row Level Security (RLS) policies to ensure users can only access their own files
   - Set up a file structure that organizes uploads by user ID

2. ✅ **Upload Functionality**:
   - Updated `/api/log/route.ts` to upload files to Supabase storage
   - Implemented proper error handling and validation
   - Added support for file metadata and tracking

3. ✅ **User Interface**:
   - Enhanced the upload form with progress indicators and better error handling
   - Added a "Recent Uploads" section to the `/log` page
   - Implemented file type icons and improved UX for viewing uploaded files

4. ✅ **Database Integration**:
   - Created an `uploads` table to track user uploads
   - Set up RLS policies to secure the uploads table
   - Added database indexes for performance optimization

### Storage Structure

The implemented storage solution follows this structure:
```
logs/
└── user_uploads/
    └── {user_id}/
        ├── {timestamp}_{filename}
        └── ...
```

### Security Considerations

The storage implementation includes the following security measures:
- RLS policies that restrict access to user-specific folders
- File size limits (10MB maximum)
- File type restrictions (only images and PDFs)
- Secure URL generation for accessing files
- Database record tracking for all uploads

### Documentation

Complete storage setup documentation is available at `docs/supabase-storage-setup.md`, including:
- Setup instructions for Supabase storage
- SQL scripts for creating storage buckets and RLS policies
- Troubleshooting tips
- Security considerations

### Outstanding Storage Tasks

1. **Cleanup Process**:
   - Implement a process to clean up storage when uploads are deleted
   - Consider setting up a Supabase Edge Function for this purpose

2. **Image Processing**:
   - Add thumbnail generation for image uploads
   - Consider implementing image compression for large photos

3. **Admin Interface**:
   - Create an admin interface for viewing all user uploads
   - Add moderation capabilities for inappropriate content
