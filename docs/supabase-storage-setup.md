# Supabase Storage Setup for The Spark

This document outlines the steps required to set up Supabase storage for file uploads in The Spark application.

## Prerequisites

- A Supabase project already set up with authentication
- Access to the Supabase SQL Editor
- Admin access to the Supabase dashboard

## Setup Steps

### 1. Create Storage Bucket

1. Log in to your Supabase dashboard
2. Navigate to Storage in the left sidebar
3. Create a new bucket called `logs`
4. Make sure the bucket is private (not public)

### 2. Configure Row Level Security Policies

Run the SQL script located at `supabase/migrations/storage_setup.sql` in the Supabase SQL Editor. This script will:

- Create the logs storage bucket (if it doesn't exist)
- Set up Row Level Security (RLS) policies for the storage bucket
- Create the uploads table in the database
- Set up RLS policies for the uploads table

### 3. Test the Storage Bucket

After setting up the storage bucket and RLS policies:

1. Log in to the application as a user
2. Navigate to `/log`
3. Try uploading a file using the upload form
4. Verify that the file appears in the recent uploads list
5. Verify that you can view the uploaded file

## File Structure

The application uses the following file structure in the storage bucket:

```
logs/
└── user_uploads/
    └── {user_id}/
        ├── {timestamp}_{filename}
        └── ...
```

This structure ensures that:
- Each user's files are stored in their own folder
- Files are named with a timestamp to prevent collisions
- RLS policies can restrict access to only the user's own files

## Security Considerations

1. **Access Control**: The RLS policies ensure that users can only access their own files.
2. **File Size Limits**: The API enforces a 10MB file size limit.
3. **File Type Restrictions**: Only images (JPEG, PNG) and PDFs are allowed.
4. **Storage Management**: Consider implementing a storage cleanup process for deleted files.

## Troubleshooting

If file uploads are not working:

1. Check the browser console for errors
2. Verify that the `logs` bucket exists in Supabase
3. Check that RLS policies are properly set up
4. Verify the user is authenticated
5. Check server logs for more detailed error messages

## Additional Resources

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security) 