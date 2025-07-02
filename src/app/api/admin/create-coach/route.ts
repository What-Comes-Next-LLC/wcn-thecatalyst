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
    const { name, email, password } = await req.json();
    
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }
    
    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }
    
    // Create user in Supabase Auth using admin client
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      user_metadata: {
        name: name,
        role: 'coach'
      },
      email_confirm: true // Skip email confirmation for admin-created accounts
    });
    
    if (authError) {
      console.error('Error creating auth user:', authError);
      if (authError.message.includes('already registered')) {
        return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
      }
      return NextResponse.json({ error: 'Failed to create user account' }, { status: 500 });
    }
    
    if (!authData.user) {
      return NextResponse.json({ error: 'Failed to create user account' }, { status: 500 });
    }
    
    // Create corresponding record in spark_users table
    const { error: dbError } = await supabase
      .from('spark_users')
      .insert({
        id: authData.user.id,
        name: name,
        email: email,
        role: 'coach',
        status: 'active',
        created_at: new Date().toISOString()
      });
    
    if (dbError) {
      console.error('Error creating user profile:', dbError);
      
      // Clean up auth user if profile creation fails
      try {
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      } catch (cleanupError) {
        console.error('Error cleaning up auth user:', cleanupError);
      }
      
      return NextResponse.json({ error: 'Failed to create user profile' }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true,
      user: {
        id: authData.user.id,
        email: email,
        name: name,
        role: 'coach'
      }
    });
    
  } catch (error) {
    console.error('Create coach error:', error);
    return NextResponse.json({ error: 'Failed to create coach account' }, { status: 500 });
  }
}