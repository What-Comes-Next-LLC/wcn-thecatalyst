import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { getActiveUsers } from '@/lib/supabaseUtils';
import { hasCoachAccess } from '@/lib/auth';

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
    
    // Fetch active users using the Supabase utility
    const { data: activeUsers, error } = await supabase
      .from('spark_users')
      .select('*')
      .eq('status', 'active');
    
    if (error) throw error;
    
    // Format to maintain compatibility with existing frontend
    const formattedUsers = activeUsers.map((user: any) => ({
      id: user.id,
      fields: {
        Name: user.name,
        Email: user.email,
        Status: user.status,
        'Created At': user.created_at,
      }
    }));

    return NextResponse.json({ users: formattedUsers });
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
} 