import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { hasCoachAccess } from '@/lib/auth';
import { User } from '@supabase/supabase-js';

export async function GET() {
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
    
    // Fetch all users with role 'client' from auth system using admin client
    const { data: allUsers, error } = await supabaseAdmin.auth.admin.listUsers();
    
    if (error) {
      console.error('Admin API error:', error);
      throw error;
    }
    
    // Filter users with role 'client' in user_metadata
    const clients = allUsers.users.filter((user: User) => 
      user.user_metadata?.role === 'client'
    ).map((user: User) => ({
      id: user.id,
      fields: {
        Name: user.user_metadata?.name || 'Client',
        Email: user.email,
        Goal: user.user_metadata?.goal || 'Not specified',
        Notes: user.user_metadata?.notes || '',
        Status: 'active',
        'Created At': user.created_at,
      }
    }));

    return NextResponse.json({ users: clients });
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
} 