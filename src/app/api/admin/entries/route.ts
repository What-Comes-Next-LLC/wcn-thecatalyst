import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
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
    
    // Fetch pending entries from spark_users
    const { data: pendingUsers, error } = await supabase
      .from('spark_users')
      .select('*')
      .eq('status', 'pending');
    
    if (error) throw error;
    
    // Format to maintain compatibility with existing frontend
    const formattedRecords = pendingUsers.map((user: any) => ({
      id: user.id,
      fields: {
        Name: user.name,
        Email: user.email,
        Status: user.status,
        'Created At': user.created_at,
      }
    }));

    return NextResponse.json({ records: formattedRecords });
  } catch (error) {
    console.error('Failed to fetch entries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch entries' },
      { status: 500 }
    );
  }
} 