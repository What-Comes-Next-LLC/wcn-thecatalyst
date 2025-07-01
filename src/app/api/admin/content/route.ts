import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { hasCoachAccess } from '@/lib/auth';

// GET - Fetch all homepage content sections
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
    
    // Fetch all homepage content sections using admin client
    const { data: content, error } = await supabaseAdmin
      .from('homepage_content')
      .select('*')
      .order('sort_order', { ascending: true });
    
    if (error) {
      console.error('Failed to fetch homepage content:', error);
      throw error;
    }
    
    return NextResponse.json({ content });
  } catch (error) {
    console.error('Failed to fetch homepage content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

// PUT - Update a specific content section
export async function PUT(request: NextRequest) {
  try {
    // Extract auth token from request headers
    const authHeader = request.headers.get('Authorization');
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
    
    const body = await request.json();
    const { id, title, subhead, body: contentBody, image_url, cta_text, cta_link } = body;
    
    // Validate required fields
    if (!id) {
      return NextResponse.json({ error: 'Content ID is required' }, { status: 400 });
    }
    
    // Update the content section using admin client
    const { data: updatedContent, error } = await supabaseAdmin
      .from('homepage_content')
      .update({
        title,
        subhead,
        body: contentBody,
        image_url,
        cta_text,
        cta_link,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Failed to update homepage content:', error);
      throw error;
    }
    
    return NextResponse.json({ 
      success: true, 
      content: updatedContent,
      message: 'Content updated successfully'
    });
  } catch (error) {
    console.error('Failed to update homepage content:', error);
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    );
  }
}