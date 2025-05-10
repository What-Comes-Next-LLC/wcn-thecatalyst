import Airtable from 'airtable';
import { Upload, UploadStatus } from '@/types/uploads';
import crypto from 'crypto';

const base = new Airtable({
  apiKey: process.env.AIRTABLE_TOKEN
}).base(process.env.AIRTABLE_BASE_ID!);

interface UploadData {
  userId: string;
  type: string;
  notes?: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl?: string | null;  // Optional for now, will be required with Supabase
  filePath?: string;        // Optional for now, will be required with Supabase
}

interface IntakeEntry {
  id: string;
  fields: {
    Name: string;
    Email: string;
    Phone: string;
    Message: string;
    Status: string;
  };
}

interface User {
  id: string;
  fields: {
    Name: string;
    Email: string;
    Phone: string;
    authToken: string;
    Status: string;
    'Created At': string;
    Group?: string[];  // Add Group field
  };
}

export async function getUserData(userId: string) {
  try {
    const userRecord = await base('Users').find(userId);
    const groupIds = userRecord.fields['Group ID'] as string[];
    const groupId = groupIds?.[0];
    
    if (!groupId) {
      throw new Error('User has no group assigned');
    }

    const groupRecord = await base('Groups').find(groupId);

    return {
      user: userRecord,
      group: groupRecord
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}

export async function getUserUploads(userId: string): Promise<Upload[]> {
  try {
    const records = await base('Uploads')
      .select({
        filterByFormula: `{userId} = '${userId}'`,
        sort: [{ field: 'uploadDate', direction: 'desc' }],
        maxRecords: 5
      })
      .firstPage();

    return records.map(record => ({
      id: record.id,
      fileName: record.fields.fileName as string,
      fileType: record.fields.fileType as string,
      uploadDate: new Date(record.fields.uploadDate as string),
      status: ((record.fields.status as string) || 'processing') as UploadStatus
    }));
  } catch (error) {
    console.error('Error fetching user uploads:', error);
    return [];
  }
}

export async function createUpload(data: UploadData) {
  try {
    const record = await base('Uploads').create([
      {
        fields: {
          userId: data.userId,
          type: data.type,
          notes: data.notes,
          fileName: data.fileName,
          fileType: data.fileType,
          fileSize: data.fileSize,
          createdAt: new Date().toISOString()
        }
      }
    ]);

    return record[0];
  } catch (error) {
    console.error('Error creating upload:', error);
    throw error;
  }
}

export async function createUser(entryId: string): Promise<{ user: User; authToken: string }> {
  // Generate token
  const authToken = crypto.randomBytes(16).toString('hex');
  
  // Get intake record
  const intakeUrl = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Intake/${entryId}`;
  const intakeRes = await fetch(intakeUrl, {
    headers: {
      'Authorization': `Bearer ${process.env.AIRTABLE_TOKEN}`,
    },
  });

  if (!intakeRes.ok) {
    throw new Error('Failed to fetch intake record');
  }

  const intakeData: IntakeEntry = await intakeRes.json();
  
  // Create user record
  const usersUrl = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Users`;
  const userRes = await fetch(usersUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.AIRTABLE_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fields: {
        Name: intakeData.fields.Name,
        Email: intakeData.fields.Email,
        Phone: intakeData.fields.Phone,
        authToken: authToken,
        Status: 'active',
        'Created At': new Date().toISOString(),
        'Group ID': [process.env.DEFAULT_GROUP_ID],
      },
    }),
  });

  if (!userRes.ok) {
    throw new Error('Failed to create user record');
  }

  const userData: User = await userRes.json();

  // Delete intake record
  const deleteIntakeUrl = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Intake/${entryId}`;
  const deleteRes = await fetch(deleteIntakeUrl, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${process.env.AIRTABLE_TOKEN}`,
    },
  });

  if (!deleteRes.ok) {
    console.error('Failed to delete intake record, but user was created');
  }

  return { user: userData, authToken };
} 