import { supabase } from './supabaseClient';
import { Upload, UploadStatus } from '@/types/uploads';

/**
 * Role-based authentication utility functions for Supabase
 */

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'active';
  role: 'client' | 'coach';
  created_at: string;
}

/**
 * Get a user's profile data including role and status
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('spark_users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

/**
 * Validate if a user has coach access
 */
export async function validateCoachAccess(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('spark_users')
      .select('role')
      .eq('id', userId)
      .single();
    
    if (error) return false;
    return data?.role === 'coach';
  } catch (error) {
    console.error('Error validating coach access:', error);
    return false;
  }
}

/**
 * Get all active users (replaces Airtable user fetching)
 */
export async function getActiveUsers(): Promise<UserProfile[]> {
  try {
    const { data, error } = await supabase
      .from('spark_users')
      .select('*')
      .eq('status', 'active');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching active users:', error);
    return [];
  }
}

/**
 * Get all pending users awaiting approval
 */
export async function getPendingUsers(): Promise<UserProfile[]> {
  try {
    const { data, error } = await supabase
      .from('spark_users')
      .select('*')
      .eq('status', 'pending');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching pending users:', error);
    return [];
  }
}

/**
 * Approve a pending user
 */
export async function approveUser(userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('spark_users')
      .update({ status: 'active' })
      .eq('id', userId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error approving user:', error);
    return false;
  }
}

/**
 * Get user uploads (replaces Airtable upload fetching)
 */
export async function getUserUploads(userId: string): Promise<Upload[]> {
  try {
    const { data, error } = await supabase
      .from('uploads')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (error) throw error;
    
    return data.map(item => ({
      id: item.id,
      fileName: item.file_name,
      fileType: item.file_type,
      uploadDate: new Date(item.created_at),
      status: item.status as UploadStatus
    }));
  } catch (error) {
    console.error('Error fetching user uploads:', error);
    return [];
  }
}

/**
 * Create a new upload record
 */
export async function createUpload(data: {
  userId: string;
  type: string;
  notes?: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl?: string | null;
  filePath?: string;
}) {
  try {
    const { data: uploadData, error } = await supabase
      .from('uploads')
      .insert({
        user_id: data.userId,
        type: data.type,
        notes: data.notes,
        file_name: data.fileName,
        file_type: data.fileType,
        file_size: data.fileSize,
        file_url: data.fileUrl,
        file_path: data.filePath,
        status: 'processing',
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return uploadData;
  } catch (error) {
    console.error('Error creating upload:', error);
    throw error;
  }
}

/**
 * Get user data including their role and profile
 */
export async function getUserData(userId: string) {
  try {
    // Get user auth data
    const { data: authData, error: authError } = await supabase.auth.admin.getUserById(userId);
    
    if (authError || !authData.user) {
      throw new Error('User not found');
    }
    
    // Get user profile data
    const { data: profile, error: profileError } = await supabase
      .from('spark_users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (profileError) {
      throw new Error('User profile not found');
    }
    
    return {
      user: authData.user,
      profile: profile
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
} 