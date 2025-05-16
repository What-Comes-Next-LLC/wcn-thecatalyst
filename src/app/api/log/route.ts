import { NextResponse } from 'next/server';
import { validateToken } from '@/lib/auth';
import { supabase } from '@/lib/supabaseClient';

// Storage abstraction layer
async function storeFile(file: File, userId: string) {
  try {
    // Convert File to buffer for Supabase storage
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Define path within storage
    const folderPath = `user_uploads/${userId}`;
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = `${folderPath}/${fileName}`;
    
    // Upload to Supabase storage
    const { data, error } = await supabase
      .storage
      .from('logs') // Bucket name - must be created in Supabase dashboard
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false
      });
      
    if (error) throw error;
    
    // Get public URL for the file
    const { data: publicUrlData } = supabase
      .storage
      .from('logs')
      .getPublicUrl(filePath);
      
    return {
      url: publicUrlData.publicUrl,
      path: filePath,
      metadata: {
        name: file.name,
        type: file.type,
        size: file.size
      }
    };
  } catch (error) {
    console.error('Error storing file:', error);
    throw error;
  }
}

// Create upload record in Supabase
async function createUpload(data: {
  userId: string;
  type: string;
  notes: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string | null;
  filePath: string;
}) {
  const { error, data: upload } = await supabase
    .from('uploads')
    .insert([{
      user_id: data.userId,
      type: data.type,
      notes: data.notes,
      file_name: data.fileName,
      file_type: data.fileType,
      file_size: data.fileSize,
      file_url: data.fileUrl,
      file_path: data.filePath,
      created_at: new Date().toISOString(),
      status: 'processing'
    }])
    .select()
    .single();

  if (error) throw error;
  return upload;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;
    const notes = formData.get('notes') as string || '';
    const userId = formData.get('userId') as string;

    // Validate inputs
    if (!file || !type || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: file, type, userId' },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed types: JPG, PNG, PDF' },
        { status: 400 }
      );
    }

    // Check if user exists and is active
    const { data: userData, error: userError } = await supabase
      .from('spark_users')
      .select('status')
      .eq('id', userId)
      .single();

    if (userError || !userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (userData.status !== 'active') {
      return NextResponse.json(
        { error: 'User account is not active' },
        { status: 403 }
      );
    }

    // Store file and get metadata
    const fileData = await storeFile(file, userId);

    // Create upload record
    const upload = await createUpload({
      userId,
      type,
      notes,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      fileUrl: fileData.url,
      filePath: fileData.path
    });

    return NextResponse.json({ 
      success: true, 
      upload,
      message: 'File uploaded successfully' 
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Server error' },
      { status: 500 }
    );
  }
} 