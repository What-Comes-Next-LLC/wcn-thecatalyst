import Airtable from 'airtable';

const base = new Airtable({
  apiKey: process.env.AIRTABLE_TOKEN
}).base(process.env.AIRTABLE_BASE_ID!);

export async function validateToken(token: string) {
  try {
    const records = await base('Users')
      .select({
        filterByFormula: `{authToken} = '${token}'`,
        maxRecords: 1
      })
      .firstPage();

    if (records.length === 0) {
      return null;
    }

    return records[0];
  } catch (error) {
    console.error('Token validation error:', error);
    return null;
  }
} 