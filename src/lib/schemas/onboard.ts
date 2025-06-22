import { z } from 'zod';

// This schema defines the shape and validation rules for the onboarding form
export const onboardSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z\s-']+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes')
    .transform(val => val.trim()),

  email: z.string()
    .email('Please enter a valid email address')
    .transform(val => val.trim().toLowerCase()),

  goal: z.string()
    .min(10, 'Please provide more detail about your goal')
    .max(500, 'Goal description is too long')
    .transform(val => val.trim()),

  notes: z.string()
    .max(1000, 'Notes are too long')
    .optional()
    .transform(val => val ? val.trim() : undefined),
});

// Infer the TypeScript type from the schema
export type OnboardFormData = z.infer<typeof onboardSchema>;

// This type represents the data after validation and transformation
export type ValidatedOnboardData = {
  name: string;
  email: string;
  goal: string;
  notes?: string;
  submittedAt: string; // ISO date string
};

// Helper function to prepare data for storage
export const prepareForStorage = (data: OnboardFormData): ValidatedOnboardData => ({
  ...data,
  submittedAt: new Date().toISOString(),
}); 