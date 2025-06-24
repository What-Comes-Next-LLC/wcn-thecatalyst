import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { hasCoachAccess } from '@/lib/auth';
import { User } from '@supabase/supabase-js';

export async function GET(req: Request) {
  try {
    // Extract auth token from request headers
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'No authorization token provided' }, { status: 401 });
    }
    
    // Set the session on supabase client for this request
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }
    
    // Check if user has coach role using metadata directly (since we have user object)
    const isCoach = user.user_metadata?.role === 'coach';
    if (!isCoach) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Fetch all users with role 'lead' from auth system using admin client
    const { data: leadUsers, error } = await supabaseAdmin.auth.admin.listUsers();
    
    if (error) throw error;
    
    // Filter users with role 'lead' in user_metadata
    const leads = leadUsers.users.filter((user: User) => 
      user.user_metadata?.role === 'lead'
    ).map((user: User) => ({
      id: user.id,
      fields: {
        Name: user.user_metadata?.name || 'Unknown',
        Email: user.email,
        Goal: user.user_metadata?.goal || 'Not specified',
        Notes: user.user_metadata?.notes || '',
        Status: 'pending',
        'Created At': user.created_at,
      }
    }));

    return NextResponse.json({ leads: leads });
  } catch (error) {
    console.error('Failed to fetch entries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch entries' },
      { status: 500 }
    );
  }
} 