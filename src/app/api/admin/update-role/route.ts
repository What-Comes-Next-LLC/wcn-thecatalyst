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
    const { userId, newRole } = await req.json();
    
    if (!userId || !newRole) {
      return NextResponse.json({ error: 'Missing user ID or role' }, { status: 400 });
    }
    
    // Update role in spark_users table
    const { error: dbError } = await supabase
      .from('spark_users')
      .update({ role: newRole })
      .eq('id', userId);
    
    if (dbError) {
      console.error('Error updating user role in database:', dbError);
      return NextResponse.json({ error: 'Failed to update role in database' }, { status: 500 });
    }
    
    // Update role in user metadata using admin client
    try {
      const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
        userId,
        { user_metadata: { role: newRole } }
      );
      
      if (authError) {
        console.error('Error updating user metadata:', authError);
        return NextResponse.json({ error: 'Failed to update auth metadata' }, { status: 500 });
      }
    } catch (metadataError) {
      console.error('Error accessing admin API:', metadataError);
      return NextResponse.json({ 
        error: 'Admin API access error. Make sure server has proper permissions.',
        details: metadataError instanceof Error ? metadataError.message : 'Unknown error' 
      }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update role error:', error);
    return NextResponse.json({ error: 'Failed to update role' }, { status: 500 });
  }
} 