import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { hasCoachAccess } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    // Verify the current user has coach access
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const isCoach = await hasCoachAccess();
    
    if (!isCoach) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Get request data
    const { userId, updates } = await req.json();
    
    if (!userId || !updates) {
      return NextResponse.json({ error: 'Missing user ID or updates' }, { status: 400 });
    }
    
    // Validate email format if email is being updated
    if (updates.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updates.email)) {
        return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
      }
    }
    
    // First, check if this is a lead from Supabase auth (not spark_users table)
    try {
      const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserById(userId);
      
      if (authError || !authUser.user) {
        return NextResponse.json({ error: 'User not found in auth system' }, { status: 404 });
      }
      
      // Check if user has role 'lead' in metadata
      const userRole = authUser.user.user_metadata?.role;
      if (userRole !== 'lead') {
        return NextResponse.json({ error: 'Can only edit lead users' }, { status: 400 });
      }
      
      // Update user metadata in auth system
      const updateData: {
        user_metadata: Record<string, unknown>;
        email?: string;
      } = {
        user_metadata: {
          ...authUser.user.user_metadata,
          name: updates.name || authUser.user.user_metadata.name,
          goal: updates.goal || authUser.user.user_metadata.goal,
          notes: updates.notes !== undefined ? updates.notes : authUser.user.user_metadata.notes
        }
      };
      
      // Update email in auth system if provided
      if (updates.email && updates.email !== authUser.user.email) {
        updateData.email = updates.email;
      }
      
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        userId,
        updateData
      );
      
      if (updateError) {
        console.error('Error updating user in auth system:', updateError);
        if (updateError.message.includes('email')) {
          return NextResponse.json({ error: 'Email already in use by another user' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to update user information' }, { status: 500 });
      }
      
      return NextResponse.json({ success: true });
      
    } catch (error) {
      console.error('Error accessing auth system:', error);
      return NextResponse.json({ error: 'Failed to access user data' }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Update lead error:', error);
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}