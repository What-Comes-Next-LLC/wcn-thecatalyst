# WCN-TheCatalyst Codebase Discovery Report

*Generated on: 2025-06-22*

## Project Overview

**Project Name**: The Catalyst - AI-Powered Coaching Platform  
**Technology Stack**: Next.js 15, React 19, TypeScript, Tailwind CSS, Supabase  
**Architecture**: Full-stack Next.js application with App Router  
**Purpose**: Privacy-first coaching platform for personal trainers and men over 40

---

## 1. Complete Directory Structure

```
wcn-thecatalyst/
├── docs/                          # Documentation and guides
├── public/                        # Static assets
│   ├── images/                   # Company and presentation images
│   └── videos/                   # Promotional content
├── private/                       # Protected files (investor.pdf)
├── scripts/                       # Python data generation scripts
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── about/               # Company information page
│   │   ├── admin/               # Coach dashboard
│   │   ├── api/                 # Backend API routes
│   │   ├── auth/                # Authentication pages
│   │   ├── donate/              # Donation page
│   │   ├── foundersletter/      # Founder's letter content
│   │   ├── investors/           # Password-protected investor access
│   │   ├── log/                 # Client upload interface
│   │   ├── onboard/             # User registration
│   │   ├── pr/                  # PR admin tools
│   │   ├── privacy/             # Privacy policy
│   │   ├── promo/               # Product demonstration
│   │   ├── signin/              # Authentication
│   │   ├── signout/             # Sign out
│   │   └── the-spark/           # Main product pitch deck
│   ├── components/              # React components
│   │   ├── admin/              # Admin interface components
│   │   ├── log/                # Upload system components
│   │   └── ui/                 # Reusable UI components
│   ├── content/                 # Content management files
│   ├── lib/                     # Utility libraries
│   │   └── schemas/            # Zod validation schemas
│   ├── types/                   # TypeScript type definitions
│   └── utils/                   # Helper utilities
└── supabase/                     # Database migrations
```

---

## 2. Pages and Routing Structure

### Public Pages
- **`/`** - Landing page with three-card navigation (The Spark, What is The Catalyst?, Coach's Clipboard)
- **`/about`** - Company and founder information with contact details
- **`/privacy`** - Privacy policy
- **`/donate`** - Donation page
- **`/foundersletter`** - Markdown-rendered founder's letter

### Product Pages
- **`/the-spark`** - Interactive investor pitch deck with scrollable sections
- **`/promo`** - Product demonstration and overview

### Authentication Flow
- **`/onboard`** - User registration with profile data collection
- **`/signin`** - Email/password authentication with role-based routing
- **`/signout`** - Session termination
- **`/auth/callback`** - Email verification handler
- **`/auth/reset-password-request`** - Password reset request
- **`/auth/reset-password`** - Password reset form

### Protected User Areas
- **`/log`** - Client file upload interface for progress tracking
- **`/admin`** - Coach dashboard for user management and communication
- **`/pr/admin`** - PR admin tools

### Special Access
- **`/investors`** - Password-protected PDF download for investors

---

## 3. React Components Catalog

### UI Components (Reusable)
- **`LoadingState.tsx`** - Standard loading spinner
- **`FounderNote.tsx`** - Interactive sticky note widget with animations
- **`ConfirmModal.tsx`** - Reusable confirmation dialog with success states
- **`Footer.tsx`** - Site-wide footer
- **`SignOutButton.tsx`** - Navigation sign-out link

### Page Section Components (Pitch Deck)
- **`Hero.tsx`** - Landing hero with video teaser
- **`Problem.tsx`** - Problem statement section
- **`Solution.tsx`** - Solution overview
- **`ProductBreakdown.tsx`** - Feature breakdown with visuals
- **`Market.tsx`** - Market opportunity presentation
- **`Competitive.tsx`** - Competitive landscape analysis
- **`BusinessModel.tsx`** - Revenue model and strategy
- **`WhyNow.tsx`** - Market timing messaging
- **`GoToMarket.tsx`** - Go-to-market strategy
- **`WhoBenefits.tsx`** - Target audience overview
- **`OurAsk.tsx`** - Investment ask and funding requirements
- **`CtaPromo.tsx`** - Simple promotional CTA with video
- **`CombinedCta.tsx`** - Comprehensive final CTA with animations

### Business Logic Components
- **`log/UploadForm.tsx`** - Multi-type file upload with drag-and-drop
- **`log/UploadInterface.tsx`** - Alternative upload interface using react-dropzone
- **`ScrollTrigger.tsx`** - Section navigation with smooth scrolling
- **`SectionWrapper.tsx`** - Consistent section layout wrapper
- **`withNavigation.tsx`** - HOC for adding navigation to sections

### Admin/Dashboard Components
- **`admin/EmailTabs.tsx`** - Tab navigation for admin dashboard
- **`admin/ClientForm.tsx`** - Lead-to-client conversion form
- **`admin/BroadcastForm.tsx`** - Mass email communication tool
- **`admin/IndividualForm.tsx`** - Individual client email interface
- **`admin/PreviewModal.tsx`** - Email preview and confirmation modal

---

## 4. Authentication and User Flow

### Authentication System
- **Provider**: Supabase Auth (email/password)
- **Session Management**: Client-side sessions with server-side validation
- **Database**: PostgreSQL via Supabase with Row Level Security (RLS)

### User Roles and Flow
1. **Lead** - New registrants awaiting coach approval
2. **Client** - Approved users who can upload logs and access client features
3. **Coach** - Admin users with full access to user management

### Authentication Flow
1. **Registration** (`/onboard`) → Email verification → Lead status
2. **Coach Approval** → Lead converted to Client with profile creation
3. **Role-based routing**: Coaches → `/admin`, Clients → `/log`

### Security Features
- Row Level Security (RLS) policies
- Role-based authorization with `hasCoachAccess()`
- File upload validation and size limits
- Separate admin authentication system
- Token validation for protected routes

---

## 5. Content Management Approach

### Centralized Content Files
- **`deckContent.ts`** - Complete investor pitch deck content including:
  - Hero content and navigation configurations
  - Problem/solution narratives
  - Business model and market data
  - Company information and founder details
  - Social media links and contact information

- **`uploadContent.ts`** - UI text and messaging for:
  - Upload interface labels and instructions
  - Error and success messages
  - Form validation text
  - Admin interface content

### Content Architecture
- **Content-driven components** that consume structured data
- **Separation of content and presentation** for maintainability
- **Hierarchical content organization** with nested objects
- **Type-safe content** with TypeScript interfaces

---

## 6. Database and Backend Integration

### Supabase Integration
- **Client Configuration** (`supabaseClient.ts`) - Public operations with RLS
- **Admin Configuration** (`supabaseAdmin.ts`) - Service role for admin operations
- **Storage** - File uploads in `'logs'` bucket with user-specific folders

### Database Schema
1. **`spark_users`** - User profiles with roles, status, and personal data
2. **`uploads`** - File upload tracking with metadata and status

### API Endpoints

#### Authentication & User Management
- `POST /api/auth-admin` - Password-based admin authentication
- `GET /api/admin/users` - Fetch all client users (coach access required)
- `POST /api/admin/approve` - Convert lead to client with profile creation
- `POST /api/admin/update-role` - Update user role in auth and database
- `GET /api/admin/entries` - Fetch all leads for approval workflow

#### File Upload & Management
- `POST /api/log` - File upload for clients (JPG, PNG, PDF, 10MB limit)

#### Business Features
- `POST /api/onboard` - Onboarding form validation
- `POST /api/investor-pdf` - Password-protected PDF download

### Data Flow
1. **User Registration** → Supabase Auth with metadata
2. **Coach Approval** → Profile creation in `spark_users` table
3. **File Uploads** → Supabase Storage with database tracking
4. **Admin Operations** → Service role bypassing RLS

---

## 7. Key Technologies and Dependencies

### Core Technologies
- **Next.js 15** with App Router for routing and API routes
- **React 19** for UI components
- **TypeScript** for type safety
- **Tailwind CSS** for styling with custom WCN theme
- **Supabase** for authentication, database, and file storage

### Notable Libraries
- **Framer Motion** - Animations and page transitions
- **react-hook-form + Zod** - Form validation
- **react-dropzone** - File upload interface
- **marked + react-markdown** - Markdown processing
- **@heroicons/react** - Icon system
- **@vercel/analytics** - Analytics integration

### Development Tools
- **ESLint** with Next.js configuration
- **PostCSS + Autoprefixer** for CSS processing
- **Capacitor** configuration (mobile app preparation)

---

## 8. Architecture Strengths

### Security
- Comprehensive authentication with role-based access
- Row Level Security (RLS) for data protection
- File upload validation and organization
- Separate admin authentication layer

### User Experience
- Smooth animations with Framer Motion
- Progressive disclosure patterns
- Responsive design throughout
- Interactive pitch deck with scroll-triggered navigation

### Development
- Clean separation of concerns
- Type-safe development with TypeScript
- Centralized content management
- Modular component architecture
- Consistent styling with custom theme

### Scalability
- Next.js App Router for performance
- Supabase for managed backend services
- Component-based architecture for reusability
- API-first approach for future expansion

---

## 9. Business Logic Summary

This codebase implements a **coaching platform with investor pitch functionality**:

1. **Investor Presentation** - Interactive pitch deck (`/the-spark`) showcasing The Catalyst platform
2. **Lead Generation** - User onboarding system for potential clients
3. **Client Management** - Coach approval workflow and client communication tools
4. **Progress Tracking** - File upload system for client progress logs
5. **Content Management** - Centralized content system for easy updates
6. **Admin Dashboard** - Comprehensive coach tools for user and communication management

The platform serves as both a **product demonstration** for investors and a **functional MVP** for the coaching workflow, with emphasis on privacy, user experience, and scalable architecture.