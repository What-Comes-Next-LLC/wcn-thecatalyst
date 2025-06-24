# User Journey Flows - The Catalyst Platform

**Date:** 2025-06-24  
**Purpose:** Comprehensive user journey documentation for aesthetic redesign  
**Status:** Production-Ready Flows  

## Overview

This document maps every step of user journeys across The Catalyst platform, providing detailed flow information for aesthetic redesign sessions. Each journey includes UI touchpoints, decision points, and aesthetic considerations.

## User Types & Definitions

### 1. **Lead** (Prospective Customer)
- **Description:** New user who has shown interest but not yet approved
- **Access Level:** Limited to pending page
- **Journey Goal:** Get approved by coach to become active client

### 2. **Client** (Active Customer)  
- **Description:** Approved user with full platform access
- **Access Level:** Habit tracker, logging, full app features
- **Journey Goal:** Achieve personal transformation goals

### 3. **Coach** (Administrator)
- **Description:** Platform administrator who manages leads and clients
- **Access Level:** Admin dashboard, user management, all features
- **Journey Goal:** Efficiently manage and support users

---

## Journey Flow 1: New User (Lead) Acquisition

### **Entry Points:**
- Homepage (`/`) 
- Direct link to signup (`/the-spark`)
- Social media/referral links

### **Step-by-Step Journey:**

#### **Step 1: Homepage Landing (`/`)**
**Page:** Homepage  
**User State:** Anonymous visitor  
**UI Elements:**
- Hero section with value proposition
- "Start With Spark" call-to-action button
- Navigation with "Sign In" option
- Service tier cards (Spark, Foundation, Transformation)
- Testimonials section
- Footer with additional navigation

**User Actions:**
- Click "Start With Spark" → Navigate to `/the-spark`
- Click "Sign In" → Navigate to `/signin`
- Browse content to learn more

**Aesthetic Considerations:**
- Strong visual hierarchy guiding to CTA
- Trust indicators and social proof
- Clear value proposition above fold
- Mobile-responsive design

---

#### **Step 2: Interest Expression (`/the-spark`)**
**Page:** Signup/Interest Form  
**User State:** Interested prospect  
**UI Elements:**
- Page title: "Express Your Interest"
- Subtitle explaining the process
- Form fields:
  - Name (required)
  - Email (required)  
  - Goal (required)
  - Additional Notes (optional)
- Submit button: "Submit Interest"
- Loading state during submission
- "Already have an account? Sign In" link

**User Actions:**
- Fill out intake form
- Submit interest → Triggers magic link email
- Navigate to sign in if returning user

**Backend Process:**
- Creates Supabase auth user with `role: 'lead'`
- Stores form data in `user_metadata`
- Sends email verification link

**Aesthetic Considerations:**
- Clean, trustworthy form design
- Clear progress indication
- Reassuring messaging about next steps
- Error handling with helpful messages

---

#### **Step 3: Email Verification (`/auth/callback`)**
**Page:** Email Verification Confirmation  
**User State:** Verifying email from magic link  
**UI Elements:**
- **Loading State:**
  - Animated loading indicator
  - "Verifying your email..." message
- **Success State:**
  - Checkmark icon
  - "Email Verified!" confirmation
  - "Redirecting..." message
- **Error State:**
  - Error icon
  - Error message
  - "Back to Sign In" button

**User Actions:**
- Lands on page from email link
- Waits for verification process
- Automatically redirected based on role

**Backend Process:**
- Verifies OTP token
- Determines user role from metadata
- Redirects to appropriate destination:
  - `lead` → `/pending`
  - `client` → `/log`
  - `coach` → `/admin`

**Aesthetic Considerations:**
- Professional loading animations
- Clear status indicators
- Consistent branding
- Error states that don't alarm users

---

#### **Step 4: Pending Approval (`/pending`)**
**Page:** Awaiting Coach Review  
**User State:** Lead waiting for approval  
**UI Elements:**
- Welcome message: "Welcome to The Catalyst!"
- Status: "Your application is under review"
- Explanation of what happens next
- "What happens next?" information box:
  - Our team reviews your application
  - You'll receive email confirmation when approved
  - Access to The Spark habit tracker will be activated
  - Your coaching journey begins!
- "Return to Homepage" button
- "Sign out" link

**User Actions:**
- Read information about next steps
- Return to homepage
- Sign out if desired

**Backend Process:**
- Verifies user has `role: 'lead'`
- Prevents access to protected routes
- Maintains session until approval

**Aesthetic Considerations:**
- Positive, encouraging messaging
- Clear timeline expectations
- Professional holding page design
- Easy way to return or sign out

---

## Journey Flow 2: Coach Approval Process

### **Entry Points:**
- Direct admin access (`/admin`)
- Magic link from coach sign-in
- Password-based login

### **Step-by-Step Journey:**

#### **Step 1: Coach Authentication (`/signin`)**
**Page:** Enhanced Sign In  
**User State:** Coach accessing admin dashboard  
**UI Elements:**
- Page title: "Sign In to Your Log"
- Email input field
- **Enhanced Features:**
  - Auto-detection of coach emails
  - Radio button selection:
    - Magic Link (default)
    - Password (for coach emails)
  - Password field (conditional)
- Submit button (dynamic text):
  - "Send Magic Link" (magic link mode)
  - "Sign In" (password mode)
- Success confirmation for magic link
- Error messages

**User Actions:**
- Enter email → Auto-detects coach email patterns
- Choose authentication method
- Complete sign-in process

**Backend Process:**
- Email pattern detection using `isCoachEmail()`
- Magic link: `sendMagicLinkSignin()` 
- Password: `signInWithPassword()` with immediate redirect

**Aesthetic Considerations:**
- Smart progressive enhancement (password option appears)
- Clear method selection UI
- Consistent with existing brand
- Professional coach experience

---

#### **Step 2: Admin Dashboard Access (`/admin`)**
**Page:** Admin Dashboard  
**User State:** Authenticated coach  
**UI Elements:**
- **Header:**
  - Dashboard title: "Admin Dashboard"
  - Sign out button (top right)
- **Navigation Tabs:**
  - Leads (default active)
  - Clients
  - Communication (placeholder)
- **Leads View:**
  - Lead cards showing:
    - Name and email
    - Goal description
    - Additional notes
    - Created date
    - "Create Client" button
- **Loading/Error States:**
  - Loading spinner during data fetch
  - Error messages for failed requests
  - Empty state: "No new leads available"

**User Actions:**
- View pending leads list
- Review lead information
- Click "Create Client" to approve leads
- Navigate between tabs
- Sign out when finished

**Backend Process:**
- Header authentication with session token
- Fetch leads with `role: 'lead'` from Supabase Auth
- Role verification for all actions

**Aesthetic Considerations:**
- Clean administrative interface
- Clear data hierarchy
- Efficient workflow design
- Professional coaching platform look

---

#### **Step 3: Lead Approval Interface**
**Page:** Client Creation Form (overlays dashboard)  
**User State:** Coach approving a lead  
**UI Elements:**
- **Client Form Modal/Page:**
  - Pre-filled information from lead data
  - Additional fields for coach input:
    - Age, height, weight (optional)
    - Updated goals/notes
  - Action buttons:
    - "Create Client" (approve)
    - "Cancel" (return to dashboard)
- **Success State:**
  - Confirmation message
  - Return to updated dashboard

**User Actions:**
- Review and potentially edit lead information
- Add additional client details
- Approve by creating client profile
- Cancel if needed

**Backend Process:**
- Create `spark_users` database record
- Update user metadata: `role: 'lead'` → `role: 'client'`
- Remove from leads list
- Add to clients list

**Aesthetic Considerations:**
- Clear form design with logical flow
- Pre-filled data to reduce coach workload
- Confirmation feedback
- Easy cancellation option

---

## Journey Flow 3: Returning User Authentication

### **Entry Points:**
- Homepage "Sign In" link
- Direct navigation to `/signin`
- Expired session redirects

### **Step-by-Step Journey:**

#### **Step 1: Sign In Method Selection (`/signin`)**
**Page:** Enhanced Sign In Interface  
**User State:** Returning user (any role)  
**UI Elements:**
- Same as Coach Authentication (Step 1 above)
- **Adaptive Behavior:**
  - Regular emails: Magic link only
  - Coach emails: Choice of magic link or password
  - Password field appears conditionally

**User Actions:**
- Enter email
- Select authentication method (if coach)
- Complete authentication

**Backend Process:**
- Role-based redirection after authentication:
  - `lead` → `/pending`
  - `client` → `/log`  
  - `coach` → `/admin`

---

#### **Step 2A: Client Landing (`/log`)**
**Page:** Habit Tracker Dashboard  
**User State:** Authenticated client  
**UI Elements:**
- Full application interface
- Habit tracking features
- Upload functionality
- User profile access

**Aesthetic Considerations:**
- Main application UI/UX
- Focus on user engagement
- Personal progress visualization

---

#### **Step 2B: Coach Landing (`/admin`)**
**Page:** Admin Dashboard  
**User State:** Authenticated coach  
**UI Elements:**
- Same as Journey Flow 2, Step 2
- Direct access to admin functions

---

#### **Step 2C: Lead Landing (`/pending`)**
**Page:** Still Awaiting Approval  
**User State:** Lead checking status  
**UI Elements:**
- Same as Journey Flow 1, Step 4
- Maintains pending status

---

## Journey Flow 4: Coach Password Setup (Optional)

### **Entry Points:**
- Direct navigation to `/admin/setup`
- Link from admin dashboard
- First-time coach setup

### **Step-by-Step Journey:**

#### **Step 1: Password Setup Interface (`/admin/setup`)**
**Page:** Coach Password Configuration  
**User State:** Authenticated coach setting up password  
**UI Elements:**
- **Authorization Check:**
  - Loading state during auth verification
  - Access denied page for non-coaches
- **Setup Form:**
  - Title: "Set Up Your Password"
  - Explanation of password benefits
  - New password field (min 8 characters)
  - Confirm password field
  - "Set Password" button
  - "Skip for now" link
- **Success State:**
  - Automatic redirect to admin dashboard

**User Actions:**
- Enter and confirm new password
- Submit password setup
- Skip to continue with magic link only

**Backend Process:**
- Verify coach role before access
- Configure password authentication
- Maintain existing magic link capability

**Aesthetic Considerations:**
- Secure, professional form design
- Clear benefits explanation
- Optional nature emphasized
- Smooth workflow integration

---

## Journey Flow 5: Client Full Experience

### **Entry Points:**
- Post-approval sign-in
- Direct navigation to `/log`

### **Step-by-Step Journey:**

#### **Step 1: Application Access (`/log`)**
**Page:** Main Application Interface  
**User State:** Active client using platform  
**UI Elements:**
- Habit tracking interface
- Progress visualization
- Upload functionality
- Profile management

**User Actions:**
- Track habits and goals
- Upload content
- Monitor progress
- Update profile

**Aesthetic Considerations:**
- Engaging user experience
- Clear progress indicators
- Motivational design elements
- Easy-to-use interface

---

## Error Flows & Edge Cases

### **Unauthorized Access Attempts**
**Trigger:** Direct navigation to protected routes without authentication  
**Behavior:** Redirect to `/signin` with clear messaging

### **Role Mismatch**
**Trigger:** User with wrong role accessing restricted pages  
**Behavior:** 
- Leads → Redirect to `/pending`
- Clients trying to access admin → Access denied
- Coaches trying to access client features → Redirect to `/admin`

### **Email Verification Failures**
**Trigger:** Expired or invalid verification links  
**Behavior:** Error page with option to request new link

### **API Authentication Failures**
**Trigger:** Token issues or expired sessions  
**Behavior:** 401/403 errors with user-friendly messages

---

## Aesthetic Design Considerations

### **Global Design Principles**
- **Consistency:** Maintain design system across all flows
- **Clarity:** Clear visual hierarchy and messaging
- **Trust:** Professional appearance building user confidence
- **Accessibility:** Proper contrast, keyboard navigation, screen reader support

### **Key UI Components**
- **Loading States:** Consistent animated indicators
- **Error Handling:** User-friendly error messages with actions
- **Forms:** Clean, logical flow with proper validation
- **Navigation:** Clear wayfinding and escape routes
- **Responsive Design:** Mobile-first approach

### **Role-Specific Aesthetics**
- **Lead Experience:** Welcoming, informative, patient
- **Client Experience:** Engaging, motivational, personal  
- **Coach Experience:** Professional, efficient, authoritative

### **Critical Success Factors**
- **First Impressions:** Homepage and signup experience
- **Trust Building:** Security indicators and professional design
- **Clear Expectations:** Users understand what happens next
- **Error Recovery:** Graceful handling of edge cases

---

## Implementation Notes for Redesign

### **High-Impact Redesign Areas**
1. **Homepage CTA Flow** - Critical conversion path
2. **Signup Form** - First user interaction
3. **Pending Page** - User retention during waiting period
4. **Admin Dashboard** - Coach efficiency and satisfaction
5. **Sign In Experience** - Returning user satisfaction

### **Technical Constraints**
- Maintain existing authentication architecture
- Preserve role-based routing logic
- Keep API authentication pattern
- Ensure mobile compatibility

### **Future Considerations**
- Mobile app integration points
- Additional user roles/permissions
- Enhanced onboarding flows
- Progressive web app features

---

**Document Maintainer:** Development Team  
**Last Updated:** 2025-06-24  
**Version:** 1.0 (Post-Authentication Enhancement)  
**Related:** `authentication-final-architecture.md`, `authentication-troubleshooting-2025-06-24.md`