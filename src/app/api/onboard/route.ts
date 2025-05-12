// src/app/api/onboard/route.ts
import { NextResponse } from 'next/server';
import { onboardSchema } from '@/lib/schemas/onboard';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate incoming data
    const result = onboardSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid form data', 
          details: result.error.errors 
        },
        { status: 400 }
      );
    }

    // In the new flow, we don't create spark_users entries during onboarding
    // This will be handled by the coach when approving the lead in the admin interface
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}