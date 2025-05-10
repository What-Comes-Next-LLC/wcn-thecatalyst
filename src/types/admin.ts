export enum AdminView {
  APPROVALS = 'approvals',
  BROADCAST = 'broadcast',
  INDIVIDUAL = 'individual'
}

export interface EmailContent {
  markdown: string;
  html: string;
  recipients: string[];
  subject: string;
}

export interface FileProcessors {
  csv: (file: File) => Promise<string[]>;
  markdown: (file: File) => Promise<string>;
}

export interface EmailFormState {
  recipients: string[];
  content: string;
  subject: string;
  isProcessing: boolean;
  error: string | null;
}

export interface User {
  id: string;
  fields: {
    Name: string;
    Email: string;
    Status: string;
  };
} 