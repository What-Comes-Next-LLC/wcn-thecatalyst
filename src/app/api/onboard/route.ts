// src/app/api/onboard/route.ts
import { NextResponse } from 'next/server';
import { onboardSchema, prepareForStorage } from '@/lib/schemas/onboard';
import { supabase } from '@/lib/supabaseClient';

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

    // Prepare validated data for storage
    const validatedData = prepareForStorage(result.data);

    // Store data in Supabase spark_users table
    const { error } = await supabase
      .from('spark_users')
      .insert([{
        name: validatedData.name,
        email: validatedData.email,
        age: validatedData.age,
        height: validatedData.height,
        weight: validatedData.weight,
        goal: validatedData.goal,
        notes: validatedData.notes,
        created_at: validatedData.submittedAt,
        status: 'pending'
      }]);

    if (error) {
      console.error('❌ Storage error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to store data' },
        { status: 500 }
      );
    }

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