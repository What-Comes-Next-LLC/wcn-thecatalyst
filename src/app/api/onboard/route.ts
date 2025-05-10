// src/app/api/onboard/route.ts
import { NextResponse } from 'next/server';
import { onboardSchema, prepareForStorage } from '@/lib/schemas/onboard';

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

    // Current Airtable implementation
    const airtableUrl = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_NAME}`;

    const res = await fetch(airtableUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          Name: validatedData.name,
          Email: validatedData.email,
          Age: validatedData.age,
          Height: validatedData.height,
          Weight: validatedData.weight,
          Goal: validatedData.goal,
          Notes: validatedData.notes,
          'Created At': validatedData.submittedAt,
          Status: 'pending'
        },
      }),
    });

    if (!res.ok) {
      console.error('❌ Storage error:', await res.text());
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