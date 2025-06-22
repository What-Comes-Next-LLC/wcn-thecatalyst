import { supabase } from './supabaseClient';

export async function validateToken(token: string) {
  try {
    // Set the session using the token
    const { data, error } = await supabase.auth.setSession({
      access_token: token,
      refresh_token: token,
    });
    
    if (error || !data.user) {
      return null;
    }

    // Get user profile from spark_users table
    const { data: profile, error: profileError } = await supabase
      .from('spark_users')
      .select('*')
      .eq('id', data.user.id)
      .single();
    
    if (profileError) {
      return null;
    }
    
    return {
      id: data.user.id,
      fields: {
        Name: profile.name,
        Email: data.user.email,
        Status: profile.status,
        "Created At": profile.created_at,
      }
    };
  } catch (error) {
    console.error('Token validation error:', error);
    return null;
  }
}

/**
 * Check if a user has a specific role based on their metadata
 */
export async function hasRole(userId: string, role: string): Promise<boolean> {
  try {
    // Import inside the function to avoid circular dependencies
    const { supabaseAdmin } = await import('./supabaseAdmin');
    
    const { data } = await supabaseAdmin.auth.admin.getUserById(userId);
    
    if (!data?.user) return false;
    
    return data.user.user_metadata?.role === role;
  } catch (error) {
    console.error('Role check error:', error);
    return false;
  }
}

/**
 * Check if the current user has coach/admin role
 */
export async function hasCoachAccess(): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return false;
    
    // Only check metadata role, not the spark_users table
    return user.user_metadata?.role === 'coach';
  } catch (error) {
    console.error('Coach access check error:', error);
    return false;
  }
}

/**
 * Get the current user's role from their session
 * Can be used in client components without async/await
 * export function getCurrentUserRole(): string | null {
 *   const session = supabase.auth.session();
 *   return session?.user?.user_metadata?.role || null;
 * }
*/

/**
 * Get the current user's role from their session
 * This is now an async function due to Supabase API changes
 */
export async function getCurrentUserRole(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user?.user_metadata?.role || null;
}

/**
 * Get the current authenticated user and profile in one call
 */
export async function getCurrentUser() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { user: null, profile: null };
    }
    
    const { data: profile } = await supabase
      .from('spark_users')
      .select('*')
      .eq('id', user.id)
      .single();
    
    return { user, profile };
  } catch (error) {
    console.error('Get current user error:', error);
    return { user: null, profile: null };
  }
}

/**
 * Send magic link for new user signup
 */
export async function sendMagicLinkSignup(email: string, userData: { name: string; goal: string; notes?: string }) {
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          role: 'lead',
          name: userData.name,
          goal: userData.goal,
          notes: userData.notes
        }
      }
    });
    
    return { data, error };
  } catch (error) {
    console.error('Magic link signup error:', error);
    return { data: null, error: error instanceof Error ? error : new Error('Unknown error occurred') };
  }
}

/**
 * Send magic link for returning user signin
 */
export async function sendMagicLinkSignin(email: string) {
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });
    
    return { data, error };
  } catch (error) {
    console.error('Magic link signin error:', error);
    return { data: null, error: error instanceof Error ? error : new Error('Unknown error occurred') };
  }
} 
