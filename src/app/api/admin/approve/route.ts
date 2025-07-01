import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { hasCoachAccess } from '@/lib/auth';

export async function POST(req: NextRequest) {
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
    
    // Get the lead information to approve
    const { leadData } = await req.json();
    
    if (!leadData || !leadData.id || !leadData.email) {
      return NextResponse.json({ error: 'Missing lead data (id, email required)' }, { status: 400 });
    }
    
    // Create spark_users entry for this lead
    const { error: insertError } = await supabase
      .from('spark_users')
      .insert({
        id: leadData.id, // Auth user ID
        name: leadData.name || 'Client', // Default name if not provided
        email: leadData.email,
        goal: leadData.goal || '',
        notes: leadData.notes || '',
        age: leadData.age,
        height: leadData.height, // Already converted to string in ClientForm
        weight: leadData.weight, // Already converted to string in ClientForm
        assigned_coach_id: leadData.assigned_coach_id,
        status: 'active',
        role: 'client'
      });
    
    if (insertError) {
      console.error('Error creating user profile:', insertError);
      return NextResponse.json({ error: 'Failed to create user profile' }, { status: 500 });
    }
    
    // Update user's metadata role from 'lead' to 'client' using admin client
    try {
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        leadData.id,
        { user_metadata: { role: 'client' } }
      );
      
      if (updateError) {
        console.error('Error updating user metadata:', updateError);
        return NextResponse.json({ error: 'Failed to update user role' }, { status: 500 });
      }
    } catch (metadataError) {
      console.error('Error accessing admin API:', metadataError);
      return NextResponse.json({ 
        error: 'Admin API access error. Make sure server has proper permissions.',
        details: metadataError instanceof Error ? metadataError.message : 'Unknown error' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      userId: leadData.id
    });
  } catch (error) {
    console.error('Approval error:', error);
    return NextResponse.json({ error: 'Approval failed' }, { status: 500 });
  }
} 