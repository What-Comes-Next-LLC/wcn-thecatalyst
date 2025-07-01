import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { hasCoachAccess } from '@/lib/auth';

// GET - Fetch all homepage content sections
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
    // Verify the current user has coach access
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const isCoach = await hasCoachAccess();
    
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