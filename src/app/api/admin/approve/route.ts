import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
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
    
    // Get the user ID to approve
    const { userId } = await req.json();
    
    if (!userId) {
      return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
    }
    
    // Approve the user by updating status in spark_users
    const { error } = await supabase
      .from('spark_users')
      .update({ status: 'active' })
      .eq('id', userId);
    
    if (error) {
      console.error('Error approving user:', error);
      return NextResponse.json({ error: 'Approval failed' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      userId
    });
  } catch (error) {
    console.error('Approval error:', error);
    return NextResponse.json({ error: 'Approval failed' }, { status: 500 });
  }
} 