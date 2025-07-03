# Authentication Architecture Analysis
*Created: 2025-01-03*

## Executive Summary

This document provides a comprehensive analysis of the current authentication system to inform a holistic discussion about creating a single, durable authentication architecture. The current system uses Supabase Auth with role-based access control but has evolved multiple patterns that create complexity and maintenance challenges.

## Table of Contents
1. [System Overview](#system-overview)
2. [User Journey Flows](#user-journey-flows)
3. [Filesystem Structure](#filesystem-structure)
4. [Database Architecture](#database-architecture)
5. [Authentication Patterns](#authentication-patterns)
6. [Inconsistencies and Technical Debt](#inconsistencies-and-technical-debt)
7. [Recommendations](#recommendations)

---

## System Overview

### Primary Components
- **Identity Provider**: Supabase Auth (JWT-based)
- **State Management**: React Context Provider (`/src/contexts/AuthContext.tsx`)
- **Authorization**: User metadata roles (`lead`, `client`, `coach`)
- **Database Integration**: Multiple tables with role-based access

### Authentication Methods
1. **Magic Link (Primary)**: For all users via email
2. **Password Auth (Secondary)**: For coaches and admin users
3. **PKCE Flow**: Secure OAuth-like flow for email verification

---

## User Journey Flows

### 1. New User Journey (First-Time Visitors)

#### Entry Points
- **Homepage** (`/`) → Redirect to `/onboard` → `/the-spark`
- **Direct Link** → `/the-spark`

#### Flow Breakdown
```
Landing Page (/) 
  ↓
Onboard Check (/onboard)
  ↓
The Spark Form (/the-spark)
  ↓ [Form Submission]
Magic Link Signup (sendMagicLinkSignup)
  ↓ [Email Verification]
Auth Callback (/auth/callback)
  ↓ [Role Assignment: 'lead']
Pending Page (/pending)
```

#### Code Implementation
**Entry Component**: `/src/app/the-spark/page.tsx`
```typescript
// Form submission triggers magic link signup
const { data, error } = await sendMagicLinkSignup(email, { name, goal, notes });
```

**Auth Function**: `/src/lib/auth.ts`
```typescript
export async function sendMagicLinkSignup(email: string, userData: { name: string; goal: string; notes?: string }) {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
      shouldCreateUser: true,
      data: {
        role: 'lead',           // Initial role assignment
        name: userData.name,
        goal: userData.goal,
        notes: userData.notes
      }
    }
  });
}
```

**Callback Handler**: `/src/app/auth/callback/page.tsx`
```typescript
// Processes the auth callback and redirects based on role
const { data, error } = await supabase.auth.exchangeCodeForSession(code);
// Redirects to /pending for 'lead' role
```

### 2. Returning User Journey (Existing Users)

#### Entry Points
- **Sign In Page** (`/signin`)
- **Log Page** (`/log`) - Client dashboard
- **Admin Page** (`/admin`) - Coach dashboard

#### Flow Breakdown
```
Sign In Page (/signin)
  ↓ [Email Input]
Magic Link OR Password Auth
  ↓ [Verification]
Auth Callback (/auth/callback)
  ↓ [Role-Based Routing]
Destination:
  - 'lead' → /pending
  - 'client' → /log  
  - 'coach' → /admin
```

#### Code Implementation
**Sign In Component**: `/src/app/signin/page.tsx`
```typescript
// Smart routing based on email patterns
const isCoach = isCoachEmail(email);
if (isCoach) {
  // Password authentication for coaches
  await signInWithPassword(email, password);
} else {
  // Magic link for clients
  await sendMagicLinkSignin(email);
}
```

**Role-Based Routing**: `/src/app/auth/callback/page.tsx`
```typescript
const userRole = session?.user?.user_metadata?.role;
switch (userRole) {
  case 'lead':
    router.replace('/pending');
    break;
  case 'client':
    router.replace('/log');
    break;
  case 'coach':
    router.replace('/admin');
    break;
}
```

### 3. Coach Admin Journey

#### Access Control
**Admin Page**: `/src/app/admin/page.tsx`
```typescript
const isCoach = await hasCoachAccess();
if (!isCoach) {
  setIsAuthorized(false);
  // Shows unauthorized message
}
```

**Authorization Function**: `/src/lib/auth.ts`
```typescript
export async function hasCoachAccess(): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  return user.user_metadata?.role === 'coach';
}
```

---

## Filesystem Structure

### Authentication-Related Files

#### Core Authentication
```
src/
├── lib/
│   ├── auth.ts                 # Primary auth utilities
│   ├── supabaseClient.ts       # Client-side Supabase instance
│   ├── supabaseAdmin.ts        # Server-side admin instance
│   └── supabaseUtils.ts        # Database utility functions
├── contexts/
│   └── AuthContext.tsx         # React auth context provider
└── components/
    └── SignOutButton.tsx       # Logout functionality
```

#### Authentication Pages
```
src/app/
├── auth/
│   ├── callback/page.tsx       # OAuth callback handler
│   ├── reset-password/page.tsx # Password reset
│   └── reset-password-request/page.tsx
├── signin/page.tsx             # Sign in page
├── the-spark/page.tsx          # New user registration
├── pending/page.tsx            # Awaiting approval
├── log/page.tsx                # Client dashboard
└── admin/page.tsx              # Coach dashboard
```

#### API Authentication Routes
```
src/app/api/
├── auth-admin/route.ts         # Legacy admin auth (?)
├── admin/
│   ├── approve/route.ts        # Convert lead to client
│   ├── create-coach/route.ts   # Create coach accounts
│   ├── update-role/route.ts    # Role management
│   ├── entries/route.ts        # Lead data
│   ├── users/route.ts          # User management
│   └── content/route.ts        # Content management
└── spark/
    └── coach-message/route.ts  # Coach messaging
```

#### Components with Auth Logic
```
src/components/
├── admin/
│   ├── ClientForm.tsx          # Lead → Client conversion
│   ├── CreateCoachForm.tsx     # Coach creation
│   ├── EditLeadModal.tsx       # Lead editing
│   └── ContentManagement.tsx   # Admin content tools
├── log/
│   └── UploadInterface.tsx     # Client uploads
└── spark/
    ├── CoachMessage.tsx        # Coach messaging display
    └── CameraInterface.tsx     # Progress photos
```

---

## Database Architecture

### Supabase Tables

#### 1. `auth.users` (Supabase Managed)
- **Purpose**: Primary identity store
- **Key Fields**:
  - `id` (UUID, Primary Key)
  - `email` (Unique)
  - `user_metadata` (JSONB) - Contains role and profile data
  - `created_at`, `last_sign_in_at`

#### 2. `public.spark_users` (Application Managed)
- **Purpose**: User profiles and application data
- **Schema**:
```sql
CREATE TABLE spark_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT CHECK (role IN ('lead', 'client', 'coach')),
  status TEXT CHECK (status IN ('pending', 'active')),
  age INTEGER,
  height INTEGER,  -- cm
  weight INTEGER,  -- kg
  goal TEXT,
  notes TEXT,
  assigned_coach_id UUID REFERENCES coaches(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 3. `public.coaches` (Enhanced Coach Profiles)
- **Purpose**: Coach-specific profile information
- **Schema**:
```sql
CREATE TABLE coaches (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  bio TEXT,
  specialties TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 4. Supporting Tables
- `uploads` - File uploads and progress tracking
- `coaches_messages` - Dynamic coach messaging
- `content` - Admin-managed site content

### Row Level Security (RLS) Policies

**spark_users policies**:
- Coaches can create/delete client profiles
- Coaches can update and view all profiles  
- Users can update own profile and preferences
- Users can view own profile

**coaches policies**:
- Authenticated users can view coach profiles
- Coaches can update and view own profiles

---

## Authentication Patterns

### Pattern 1: Client-Side Auth Context (Primary)
**Implementation**: `/src/contexts/AuthContext.tsx`
```typescript
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );
    return () => subscription.unsubscribe();
  }, []);
}
```

**Usage Pattern**:
```typescript
const { user, loading } = useAuth();
if (!user) return <SignInPrompt />;
```

### Pattern 2: API Route Authentication (Server-Side)
**Bearer Token Pattern** (Newer Routes):
```typescript
// Extract auth token from request headers
const authHeader = req.headers.get('Authorization');
const token = authHeader?.replace('Bearer ', '');
const { data: { user }, error } = await supabase.auth.getUser(token);
```

**Session-Based Pattern** (Some Routes):
```typescript
// Use current session context
const { data: { user } } = await supabase.auth.getUser();
```

### Pattern 3: Role-Based Authorization
**Metadata-Based** (Primary):
```typescript
const userRole = user.user_metadata?.role;
const isCoach = userRole === 'coach';
```

**Database-Based** (Some Functions):
```typescript
const { data: profile } = await supabase
  .from('spark_users')
  .select('role')
  .eq('id', userId)
  .single();
```

### Pattern 4: Magic Link vs Password Auth
**Magic Link** (Default):
```typescript
await supabase.auth.signInWithOtp({
  email,
  options: { emailRedirectTo: `${origin}/auth/callback` }
});
```

**Password Auth** (Coaches):
```typescript
await supabase.auth.signInWithPassword({ email, password });
```

---

## Inconsistencies and Technical Debt

### 1. Authentication Token Handling
**Problem**: Inconsistent token passing between client and server
- Some API routes expect `Authorization: Bearer {token}` headers
- Others use `supabase.auth.getUser()` without session context
- Client components extract tokens differently

**Examples**:
```typescript
// Pattern A: Manual token extraction
const { data: { session } } = await supabase.auth.getSession();
const authToken = session?.access_token;

// Pattern B: Direct auth call
const { data: { user } } = await supabase.auth.getUser();
```

### 2. Role Storage and Validation
**Problem**: Roles stored in multiple places
- `auth.users.user_metadata.role` (Primary)
- `spark_users.role` (Secondary)
- Sometimes inconsistent

**Risk**: Role changes may not propagate properly

### 3. Coach Creation Architecture
**Problem**: Coach data split across tables
- Basic user info in `spark_users` 
- Enhanced coach info in `coaches`
- Current implementation only uses `spark_users`

### 4. API Route Patterns
**Problem**: Mixed authentication patterns
- `/api/admin/approve` uses Bearer token pattern
- `/api/admin/create-coach` uses session-based pattern
- Different error handling approaches

### 5. Legacy Components
**Problem**: Potential dead code
- `/api/auth-admin/route.ts` - Purpose unclear
- Mixed usage of direct Supabase calls vs AuthContext

---

## Current Pain Points

### 1. Authentication Flow Fragility
- Token handling inconsistencies cause "Unauthorized" errors
- Different components expect different auth patterns
- Hard to debug auth failures

### 2. Role Management Complexity  
- Multiple sources of truth for user roles
- Role updates require multiple database operations
- Risk of data inconsistency

### 3. Coach Management Split
- Coach creation doesn't utilize full database schema
- Enhanced coach features not implemented
- Table relationships not fully leveraged

### 4. Developer Experience
- No clear patterns for new API routes
- Auth debugging is difficult
- Documentation scattered across files

---

## Recommendations for Discussion

### Option A: Standardize on Client Context + Bearer Tokens
- All API routes use `Authorization: Bearer {token}` pattern
- Client components always pass tokens to API calls
- Single source of truth for authentication state

### Option B: Server-Side Session Management
- Move to server-side session handling
- Reduce client-side auth complexity
- Centralized token validation

### Option C: Hybrid Approach with Clear Boundaries
- Client-side auth for UI state management
- Standardized token passing for API calls
- Clear documentation of patterns

### Option D: Complete Architecture Redesign
- Evaluate if current Supabase patterns are optimal
- Consider alternatives (NextAuth.js, etc.)
- Fresh start with lessons learned

---

## Questions for Architectural Discussion

1. **Primary Pattern**: Should we standardize on client context + bearer tokens, or move to server-side session management?

2. **Role Management**: Should roles be stored only in user metadata, or maintain sync with database tables?

3. **Coach Architecture**: Should we fully implement the coaches table design, or simplify to single-table approach?

4. **API Consistency**: What should be the standard pattern for all new API routes?

5. **Error Handling**: How should authentication failures be handled consistently across the app?

6. **Testing Strategy**: How can we make authentication testing more reliable?

---

## Files Requiring Updates (Any Approach)

### High Priority
- `/src/lib/auth.ts` - Core auth utilities
- `/src/contexts/AuthContext.tsx` - React context
- `/src/app/api/admin/*` - Admin API routes
- `/src/components/admin/*` - Admin components

### Medium Priority  
- `/src/app/auth/callback/page.tsx` - Callback handling
- `/src/app/signin/page.tsx` - Sign in flow
- `/src/lib/supabaseUtils.ts` - Database utilities

### Low Priority
- Individual page components that use auth
- Legacy routes (if keeping)
- Documentation updates

---

*This document serves as the foundation for architectural decision-making and should be updated as the authentication system evolves.*