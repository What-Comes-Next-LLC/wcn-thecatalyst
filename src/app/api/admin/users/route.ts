import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const airtableUrl = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Users`;
    const res = await fetch(airtableUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.AIRTABLE_TOKEN}`,
      },
    });

    if (!res.ok) throw new Error('Failed to fetch from Airtable');
    
    const data = await res.json();
    
    // Filter for active users only
    const activeUsers = data.records.filter(
      (record: any) => record.fields.Status === 'active'
    );

    return NextResponse.json({ users: activeUsers });
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
} 