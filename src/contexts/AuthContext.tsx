'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      setSession(initialSession);
      setUser(initialSession?.user || null);
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth state changes - this eliminates race conditions
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign out function
  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    // State will be updated automatically via onAuthStateChange
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Helper functions for common auth checks
export function useAuthRedirect(allowedRoles?: string[], redirectTo: string = '/signin') {
  const { user, loading } = useAuth();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        setShouldRedirect(true);
        return;
      }

      if (allowedRoles && allowedRoles.length > 0) {
        const userRole = user.user_metadata?.role;
        if (!allowedRoles.includes(userRole)) {
          setShouldRedirect(true);
          return;
        }
      }

      setShouldRedirect(false);
    }
  }, [user, loading, allowedRoles]);

  return { shouldRedirect, redirectTo, loading };
}