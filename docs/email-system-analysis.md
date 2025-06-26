# Email System Analysis & Customization Assessment

**Created:** 2025-06-25  
**Purpose:** Document current Supabase email templates and assess customization opportunities for user onboarding journey

---

## Current Email Architecture

### **Two Separate Email Systems**

#### **1. Supabase Auth Emails (Magic Links)**
- **Purpose**: Email verification, magic link signin, password reset
- **Templates**: Supabase default templates (not customized)
- **Trigger**: Automatic via Supabase Auth system
- **Customization**: Limited to Supabase dashboard configuration

#### **2. Custom Coach Email System**
- **Purpose**: Welcome emails, coach communications, broadcasts
- **Templates**: Fully branded custom HTML templates (`src/lib/email.ts`)
- **Trigger**: Manual via admin interface or API calls
- **Customization**: Complete control

---

## Supabase Default Email Templates (Currently Used)

### **Magic Link Signup Email**
**Triggered by:** `sendMagicLinkSignup()` in `/the-spark` form submission

**Current Content (Supabase Default):**
```
Subject: Confirm your signup
Body: Follow this link to confirm your signup:
[Confirmation Link]
```

**User Experience:**
- Generic Supabase branding
- Basic text-only format
- No WCN brand consistency
- Functional but not premium

### **Magic Link Signin Email**
**Triggered by:** `sendMagicLinkSignin()` in `/signin` page

**Current Content (Supabase Default):**
```
Subject: Your magic link
Body: Follow this link to sign in:
[Magic Link]
```

**User Experience:**
- Same generic styling as signup
- No coaching context
- Minimal user guidance

### **Password Reset Email** 
**Triggered by:** Password reset requests

**Current Content (Supabase Default):**
```
Subject: Reset your password
Body: Follow this link to reset your password:
[Reset Link]
```

---

## Custom Email Templates (Available)

### **Welcome Email Template**
**File:** `src/lib/email.ts` - `welcome` template
- **Design**: Dark theme matching app aesthetic
- **Branding**: "What Comes Next? LLC" header
- **Colors**: WCN brand palette (#216869, #dce1de)
- **Features**: 
  - Branded button styling
  - Watermark tracking system
  - Professional coaching tone
  - Responsive design

### **Coach Communication Templates**
**Available Templates:**
- **Broadcast**: Mass communication to multiple users
- **Individual**: One-on-one coach messages
- **Custom**: Flexible content with coach signatures

---

## Email Customization Assessment

### **High-Impact Opportunities**

#### **1. Custom Magic Link Signup Email ⭐ HIGH PRIORITY**
**Current Gap:** Generic Supabase template doesn't set coaching expectations
**Opportunity:** 
- Welcome new users with coaching-focused messaging
- Set proper expectations for approval process
- Include timeline (24-48 hours) and next steps
- Match premium brand aesthetic

#### **2. Custom Magic Link Signin Email ⭐ MEDIUM PRIORITY**
**Current Gap:** No differentiation between returning users and coaches
**Opportunity:**
- Personalized messaging based on user role
- Coaching context for clients
- Professional tone for coaches

#### **3. Enhanced Approval Notification Email ⭐ HIGH PRIORITY**
**Current Gap:** No branded email when coaches approve users
**Opportunity:**
- Custom welcome email using existing template
- Immediate Spark access instructions
- Coach introduction and expectations

### **Implementation Options**

#### **Option 1: Supabase Email Template Customization**
**Pros:**
- Preserves automatic triggering
- No code changes required
- Simple configuration in Supabase dashboard

**Cons:**
- Limited customization options
- Basic HTML/CSS support
- No dynamic content based on user role
- No watermark/tracking capabilities

#### **Option 2: Custom Email Service Integration**
**Pros:**
- Complete brand control using existing templates
- Role-based customization
- Watermark tracking system
- Professional coaching aesthetic

**Cons:**
- Requires webhook/trigger system setup
- More complex implementation
- Need to replace automatic Supabase emails

#### **Option 3: Hybrid Approach (RECOMMENDED)**
**Strategy:**
- Keep Supabase magic links for reliability
- Enhance Supabase templates with basic branding
- Add custom follow-up emails using existing system
- Use custom emails for approval notifications

---

## Current Email Flow Analysis

### **New User Journey**
1. **Form Submission** → Supabase magic link email (generic)
2. **Email Verification** → Redirect to pending page
3. **Coach Approval** → No email notification currently
4. **Manual Welcome** → Coaches can send custom emails via admin

### **Enhanced Email Flow Opportunity**
1. **Form Submission** → Enhanced magic link email with coaching context
2. **Email Verification** → Improved messaging in callback
3. **Coach Approval** → Automatic welcome email with Spark access
4. **Ongoing Communication** → Existing coach messaging system

---

## Recommendations

### **Phase 1: Quick Wins (Supabase Template Enhancement)**
- Update magic link email templates in Supabase dashboard
- Add basic WCN branding and coaching context
- Include timeline expectations and next steps

### **Phase 2: Custom Approval Emails**
- Implement automatic welcome email when coaches approve users
- Use existing branded template system
- Include Spark access instructions and coach introduction

### **Phase 3: Advanced Customization**
- Consider full custom email service for magic links
- Implement role-based email customization
- Add Calendly integration for consultation scheduling

---

## Technical Implementation Notes

### **Existing Email Infrastructure**
- **Mailer Endpoint**: `https://mail.whatcomesnextllc.ai/send`
- **Template System**: HTML-based with variable substitution
- **Tracking**: Watermark system with email/timestamp
- **Styling**: Dark theme matching app aesthetic

### **Supabase Configuration Access**
- Email templates customizable in Supabase Dashboard → Authentication → Email Templates
- Variables available: `{{ .ConfirmationURL }}`, `{{ .SiteURL }}`, `{{ .RedirectTo }}`
- Basic HTML/CSS styling supported

### **Integration Points**
- **Form Submission**: `/the-spark` page calls `sendMagicLinkSignup()`
- **Coach Approval**: `/api/admin/approve` currently only updates user role
- **Custom Emails**: `dispatchEmail()` function ready for use

---

**Status:** Ready for implementation. Existing infrastructure supports both quick wins via Supabase customization and advanced features via custom email system.

**Priority:** Focus on Phase 1 (Supabase enhancement) for immediate brand consistency improvement.