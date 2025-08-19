# Active Application Route Analysis - whatcomesnextllc.ai

## Executive Summary

This document provides a comprehensive analysis of the active routes and dependencies in the What Comes Next customer-facing application hosted at whatcomesnextllc.ai. The application is a Next.js-based platform with a mix of static HTML and React components, designed to support a coaching platform with habit tracking, authentication, and administrative functions.

## Active Route Map

### Primary Customer Routes

#### 1. **Root Route "/" - Product Showcase**
- **Implementation**: Static HTML file via Next.js rewrite
- **File**: `/public/showcase.html`
- **Purpose**: Main product showcase introducing The Spark, Coach's Clipboard, and Day in the Life
- **Navigation Links**: 
  - `/ditl` (Day in the Life sample)
  - `/about` (About page)
  - `/donate` (Investment page)
  - `/the-spark` (Main CTA - Get The Spark)

#### 2. **"/ditl" - Day in the Life Sample**
- **Implementation**: Static HTML file via Next.js rewrite
- **File**: `/public/ditl.html`
- **Purpose**: Detailed sample of Day in the Life plans with interactive gallery
- **Features**: SVG samples, FAQ, pricing information

#### 3. **"/the-spark" - Onboarding & Habit Tracker Entry**
- **Implementation**: React component
- **File**: `/src/app/the-spark/page.tsx`
- **Purpose**: User onboarding form and authenticated user hub for habit tracking
- **Authentication Flow**: Redirects based on user role (coach → admin, client → log)

#### 4. **"/about" - Company & Founder Information**
- **Implementation**: React component
- **File**: `/src/app/about/page.tsx`
- **Purpose**: Company vision, founder story, metrics, and contact information

#### 5. **"/donate" - Investment Platform**
- **Implementation**: React component
- **File**: `/src/app/donate/page.tsx`
- **Purpose**: Pre-seed funding interface with Stripe integration
- **Features**: Multiple investment levels, promotional video, founder information

### Authentication & User Management Routes

#### 6. **"/signin" - User Authentication**
- **Implementation**: React component
- **File**: `/src/app/signin/page.tsx`
- **Purpose**: Magic link and password authentication
- **Role-based Routing**: coach → /admin, client → /log, lead → /pending

#### 7. **"/signout" - Session Termination**
- **Implementation**: React component
- **File**: `/src/app/signout/page.tsx`
- **Purpose**: User sign-out with redirect to homepage

#### 8. **"/auth/callback" - Email Verification**
- **Implementation**: React component
- **File**: `/src/app/auth/callback/page.tsx`
- **Purpose**: Handle email verification and PKCE code exchange
- **Role-based Routing**: Redirects based on user role after verification

#### 9. **"/pending" - Lead Status Page**
- **Implementation**: React component
- **File**: `/src/app/pending/page.tsx`
- **Purpose**: Status page for leads awaiting coach approval
- **Features**: Next steps information, coach consultation process

### Application Features

#### 10. **"/log" - Habit Tracking Interface**
- **Implementation**: React component
- **File**: `/src/app/log/page.tsx`
- **Purpose**: Main habit tracking interface (The Spark) for active clients
- **Features**: Camera capture, file upload, progress constellation, coach messages
- **Role Restrictions**: Only accessible to users with 'client' role

#### 11. **"/admin" - Coach Dashboard**
- **Implementation**: React component
- **File**: `/src/app/admin/page.tsx`
- **Purpose**: Administrative interface for coaches
- **Features**: Lead management, client overview, content management, user management
- **Role Restrictions**: Only accessible to users with 'coach' role

### Additional Content Routes

#### 12. **"/foundersletter" - Executive Introduction**
- **Implementation**: React component
- **File**: `/src/app/foundersletter/page.tsx`
- **Purpose**: Formal founder introduction and platform overview
- **Features**: Links to other platform sections, investor information

#### 13. **"/investors" - Password-Protected Documents**
- **Implementation**: React component
- **File**: `/src/app/investors/page.tsx`
- **Purpose**: Password-protected access to investor materials
- **Features**: PDF download functionality

## Active File Dependencies

### Core Application Architecture

#### Next.js Framework Files
```
/src/app/layout.tsx                    # Root layout wrapper
/src/app/globals.css                   # Global styling
/next.config.ts                        # Next.js configuration with rewrites
/tailwind.config.ts                    # Tailwind CSS configuration
/package.json                          # Dependencies and scripts
```

#### Authentication & State Management
```
/src/contexts/AuthContext.tsx          # Authentication context provider
/src/lib/auth.ts                       # Authentication utilities
/src/lib/supabaseClient.ts             # Supabase client configuration
/src/lib/supabaseAdmin.ts              # Supabase admin operations
```

#### Content & Configuration
```
/src/content/siteContent.ts            # Site-wide content configuration
/src/content/deckContent.ts            # About page content
/src/content/uploadContent.ts          # Upload/log interface content
/src/lib/schemas/onboard.ts            # Form validation schemas
```

### Component Libraries

#### UI Components
```
/src/components/SectionWrapper.tsx     # Layout wrapper component
/src/components/SignOutButton.tsx      # Authentication component
/src/components/ui/LoadingState.tsx    # Loading indicator
/src/components/ui/FounderNote.tsx     # Founder message component
```

#### Admin Interface Components
```
/src/components/admin/EmailTabs.tsx           # Admin navigation tabs
/src/components/admin/ClientForm.tsx          # Client creation form
/src/components/admin/ContentManagement.tsx  # Content management interface
/src/components/admin/EditLeadModal.tsx      # Lead editing modal
/src/components/admin/CreateCoachForm.tsx    # Coach creation form
```

#### Habit Tracking Components
```
/src/components/spark/ConstellationDisplay.tsx  # Progress visualization
/src/components/spark/CaptureButton.tsx         # Main capture interface
/src/components/spark/CameraInterface.tsx       # Camera capture
/src/components/spark/FileUploadInterface.tsx   # File upload
/src/components/spark/CoachMessage.tsx          # Coach communication
/src/components/spark/SuccessFeedback.tsx       # Success celebration
```

#### Upload Interface Components
```
/src/components/log/UploadForm.tsx        # Upload form component
/src/components/log/UploadInterface.tsx   # Upload interface wrapper
/src/app/log/LogPageContent.tsx           # Log page content component
```

### API Routes (Backend)

#### Authentication APIs
```
/src/app/api/auth-admin/route.ts          # Admin authentication
/src/app/api/onboard/route.ts             # User onboarding
```

#### Admin Management APIs
```
/src/app/api/admin/entries/route.ts       # Lead entries management
/src/app/api/admin/users/route.ts         # User management
/src/app/api/admin/approve/route.ts       # User approval
/src/app/api/admin/content/route.ts       # Content management
/src/app/api/admin/create-coach/route.ts  # Coach creation
/src/app/api/admin/update-lead/route.ts   # Lead updates
/src/app/api/admin/update-role/route.ts   # Role management
```

#### Application APIs
```
/src/app/api/log/route.ts                 # Habit logging
/src/app/api/investor-pdf/route.ts        # Investor document access
/src/app/api/spark/coach-message/route.ts # Coach messaging
```

### Static Assets

#### Images
```
/public/images/logo-official.png          # Primary logo (used as watermark)
/public/images/logo.png                   # Secondary logo
/public/logo.svg                          # SVG logo (HTML routes)
/public/images/about-hero.jpg             # About page hero image
/public/images/founder.jpg                # Founder portrait
/public/avatar.png                        # Coach avatar
/public/og-image.png                      # Open Graph image
```

#### Videos
```
/public/videos/newpromo.mp4               # Promotional video (donate page)
/public/videos/promo.mp4                  # Referenced promotional content
```

#### Favicons & Metadata
```
/public/favicon.ico                       # Primary favicon
/public/favicon-16x16.png                 # 16x16 favicon
/public/favicon-32x32.png                 # 32x32 favicon
/public/apple-touch-icon.png              # Apple touch icon
/public/android-chrome-192x192.png        # Android chrome icon
/public/android-chrome-512x512.png        # Android chrome icon
/public/site.webmanifest                  # Web app manifest
```

### Utility Libraries

#### Helper Utilities
```
/src/lib/accessibility.ts                 # Accessibility announcements
/src/lib/email.ts                         # Email utilities
/src/lib/markdown.ts                      # Markdown processing
/src/lib/supabaseUtils.ts                 # Database utilities
/src/utils/scrollNavigation.ts            # Scroll navigation helpers
```

#### Type Definitions
```
/src/types/admin.ts                       # Admin interface types
/src/types/uploads.ts                     # Upload-related types
```

## Authentication Flow Architecture

### User Journey Map

1. **Anonymous User** → `/` (showcase.html)
2. **Interest** → `/the-spark` (onboarding form)
3. **Email Verification** → `/auth/callback` (role assignment)
4. **Role-based Routing**:
   - **Lead** → `/pending` (awaiting approval)
   - **Client** → `/log` (habit tracking)
   - **Coach** → `/admin` (dashboard)

### Role-based Access Control

- **Public Routes**: `/`, `/ditl`, `/about`, `/donate`, `/foundersletter`, `/signin`
- **Lead Routes**: `/pending`
- **Client Routes**: `/log`
- **Coach Routes**: `/admin`
- **Utility Routes**: `/signout`, `/auth/callback`

## External Dependencies

### Package Dependencies
```json
{
  "next": "^15.2.5",
  "react": "^19.1.0",
  "react-dom": "^19.1.0",
  "framer-motion": "^12.10.5",
  "@heroicons/react": "^2.2.0",
  "react-hook-form": "^7.56.3",
  "@hookform/resolvers": "^5.0.1",
  "zod": "^3.24.4",
  "@supabase/supabase-js": "^2.49.4",
  "@supabase/ssr": "^0.1.0",
  "@vercel/analytics": "^1.5.0",
  "tailwindcss": "^3.4.1"
}
```

### CDN Dependencies (HTML Routes)
- **Fonts**: Inter from Google Fonts
- **CSS**: Tailwind CSS via CDN
- **Icons**: Custom SVG implementations

## Routing Configuration

### Next.js Rewrites (next.config.ts)
```typescript
{
  source: "/", 
  destination: "/showcase.html"
},
{
  source: "/ditl", 
  destination: "/ditl.html"
}
```

## Inactive/Development Routes

The following routes exist in the codebase but are not actively linked or accessible through normal user flows:

- `/auth/reset-password` - Password reset functionality
- `/auth/reset-password-request` - Password reset request
- `/admin/setup` - Administrative setup
- `/onboard` - Alternative onboarding (superseded by /the-spark)
- `/original-homepage` - Previous homepage version
- `/pr` - Public relations content
- `/pr/admin` - PR admin interface
- `/privacy` - Privacy policy (not linked)
- `/promo` - Promotional content

## Recommendations for Archival

Based on this analysis, the following files/routes can be considered for archival as they are not part of the active customer journey:

### Inactive Route Components
- `/src/app/auth/reset-password/page.tsx`
- `/src/app/auth/reset-password-request/page.tsx`
- `/src/app/admin/setup/page.tsx`
- `/src/app/onboard/page.tsx`
- `/src/app/original-homepage/page.tsx`
- `/src/app/pr/page.tsx`
- `/src/app/pr/admin/page.tsx`
- `/src/app/privacy/page.tsx`
- `/src/app/promo/page.tsx`

### Historical/Development Assets
- Documentation files in `/docs/` not related to current functionality
- Backup configuration files (`.bak` extensions)
- Development scripts not used in production

## Conclusion

The active application consists of 13 primary customer-facing routes supported by a robust architecture of 80+ active files. The application successfully implements a complete user journey from discovery through authenticated habit tracking, with role-based access control and comprehensive admin functionality. The mix of static HTML for marketing content and React components for application features provides an optimal balance of performance and functionality.