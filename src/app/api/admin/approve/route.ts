import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/airtable';

export async function POST(req: NextRequest) {
  try {
    const { entryId } = await req.json();
    
    // Get intake data and create user
    const { user, authToken } = await createUser(entryId);
    
    if (!user || !authToken) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      authToken,
      userId: user.id
    });
  } catch (error) {
    console.error('Approval error:', error);
    return NextResponse.json({ error: 'Approval failed' }, { status: 500 });
  }
} 