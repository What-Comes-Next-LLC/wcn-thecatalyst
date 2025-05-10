import { NextResponse } from 'next/server';

interface AirtableRecord {
  fields: {
    Status: 'pending' | 'active';
    [key: string]: unknown;
  };
}

export async function GET() {
  try {
    const airtableUrl = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_NAME}`;
    const res = await fetch(airtableUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.AIRTABLE_TOKEN}`,
      },
    });

    if (!res.ok) throw new Error('Failed to fetch from Airtable');
    
    const data = await res.json();
    
    // Filter for pending or active entries
    const filteredRecords = data.records.filter(
      (record: AirtableRecord) => record.fields.Status === 'pending' || record.fields.Status === 'active'
    );

    return NextResponse.json({ records: filteredRecords });
  } catch (error) {
    console.error('Failed to fetch entries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch entries' },
      { status: 500 }
    );
  }
} 