import { createClient } from '@supabase/supabase-js';

// Use environment variables for the URL and service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("Service key available:", !!supabaseServiceKey);
// Ensure these are defined
if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase URL or Service Role Key');
}

// Create a Supabase client with the service role key for admin operations
// This client bypasses RLS and has admin privileges
export const supabaseAdmin = createClient(supabaseUrl!, supabaseServiceKey!); 
