// src/types/uploads.ts

export type UploadStatus = 'pending' | 'completed' | 'failed';

export interface Upload {
  id: string;
  fileName: string;
  fileType: string;
//  uploadDate: string; // You can change this to `Date` if needed
  uploadDate: Date; // You can change this to `Date` if needed
  status: UploadStatus;
}