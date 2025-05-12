# Authentication and Onboarding Cleanup

## Current State Assessment

The current system has inconsistencies between authentication metadata and the `spark_users` table:

1. User authentication is managed through Supabase Auth
2. User roles are stored in both:
   - `user_metadata.role` in the Supabase Auth system
   - `role` field in the `spark_users` table
3. User approval status is stored in the `status` field of the `spark_users` table
4. The onboarding process creates records in both systems with inconsistent roles

## Implementation Plan

### Phase 1: Update Onboarding Process
1. Modify `/onboard` or `/the-spark` form submission:
   - Change `user_metadata.role` from 'client' to 'lead'
   - Remove the creation of `spark_users` entry during onboarding
   - Keep the email verification process intact

### Phase 2: Update Authentication Checks
1. Modify auth checks in `/log` page:
   - Base access control on `user_metadata.role` instead of `spark_users.status`
   - Show pending approval message for users with role 'lead'
   - Show content for users with role 'client'
   - Redirect users with role 'coach'

2. Ensure `/admin` page access remains limited to coaches:
   - Continue using `hasCoachAccess()` function which checks for role 'coach'

### Phase 3: Update Admin Interface
1. Modify Admin dashboard:
   - Show users with `user_metadata.role = 'lead'` (instead of checking `spark_users` table)
   - Add functionality for coaches to approve leads
   - When approving, create `spark_users` entry linking to user's email
   - Update `user_metadata.role` from 'lead' to 'client'

### Phase 4: Cleanup and Testing
1. Remove redundant status checks in the codebase
2. Test all user flows:
   - New user onboards (becomes 'lead')
   - Coach approves lead (becomes 'client')
   - Coach logs in (accesses `/admin`)
   - Client logs in (accesses `/log`)
   - Redirect behaviors work correctly

## New Customer Onboarding Flow

### Step 1: Customer Submits Onboarding Form
- Customer fills out and submits the onboarding form at `/the-spark` or `/onboard`
- System creates a Supabase Auth record with `user_metadata.role = 'lead'`
- No `spark_users` entry is created at this stage
- Customer receives email verification link

### Step 2: Customer Verifies Email
- Customer clicks verification link in email
- Auth status becomes verified
- Customer can now log in but will see a "pending approval" message when accessing `/log`

### Step 3: Coach Review and Approval
- Coach logs into admin dashboard (`/admin`)
- Coach sees a list of users with `user_metadata.role = 'lead'`
- Coach reviews lead information and decides to approve
- When approving:
  - Coach creates a new `spark_users` entry for the lead, linked via email
  - System updates user's `user_metadata.role` from 'lead' to 'client'

### Step 4: Client Access
- Client can now log in and access `/log` with full functionality
- The role 'client' in `user_metadata` serves as the source of truth for access control

## Access Control Rules

1. `user_metadata.role === 'coach'`:
   - Can access `/admin`
   - Redirected from `/log`

2. `user_metadata.role === 'lead'`:
   - Cannot access `/admin`
   - Sees pending approval message in `/log`

3. `user_metadata.role === 'client'`:
   - Cannot access `/admin`
   - Can access `/log` with full functionality

This approach simplifies the authentication flow, makes role management more straightforward, and eliminates the need to check both auth metadata and the `spark_users` table for access control.
