import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get active coach message for the user
    const { data, error } = await supabase
      .rpc('get_active_coach_message', { client_user_id: userId });

    if (error) {
      console.error('Error fetching coach message:', error);
      return NextResponse.json(
        { error: 'Failed to fetch coach message' },
        { status: 500 }
      );
    }

    // Return the message (or null if none exists)
    return NextResponse.json({
      message: data && data.length > 0 ? data[0] : null
    });
  } catch (error) {
    console.error('Coach message API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}