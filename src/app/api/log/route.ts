import { NextResponse } from 'next/server';
import { validateToken } from '@/lib/auth';
import { createUpload } from '@/lib/airtable';

// Storage abstraction layer
async function storeFile(file: File, userId: string) {
  // TODO: Replace with Supabase storage
  // For now, just return metadata
  return {
    url: null, // Will be populated with Supabase URL
    path: `uploads/${userId}/${file.name}`,
    metadata: {
      name: file.name,
      type: file.type,
      size: file.size
    }
  };
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const token = formData.get('token');
    const file = formData.get('file') as File;
    const type = formData.get('type');
    const notes = formData.get('notes');
    const userId = formData.get('userId');

    // Validate token
    const userData = await validateToken(token as string);
    if (!userData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate file
    if (!file || !type) {
      return NextResponse.json(
        { error: 'File and type are required' },
        { status: 400 }
      );
    }

    // Store file and get metadata
    const fileData = await storeFile(file, userId as string);

    // Create upload record
    const upload = await createUpload({
      userId: userId as string,
      type: type as string,
      notes: notes as string,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      fileUrl: fileData.url, // Will be null for now, populated with Supabase URL later
      filePath: fileData.path // Store the path for future reference
    });

    return NextResponse.json({ success: true, upload });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
} 