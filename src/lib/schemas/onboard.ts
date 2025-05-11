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

  age: z.number()
    .int('Age must be a whole number')
    .min(13, 'Must be at least 13 years old')
    .max(120, 'Please enter a valid age')
    .optional(),

  height: z.number()
    .int('Height must be a whole number')
    .min(48, 'Height must be at least 48 inches (4 feet)')
    .max(96, 'Height must be less than 96 inches (8 feet)')
    .optional(),

  weight: z.number()
    .int('Weight must be a whole number')
    .min(50, 'Weight must be at least 50 lbs')
    .max(1000, 'Please enter a valid weight')
    .optional(),

  notes: z.string()
    .max(1000, 'Notes are too long')
    .optional()
    .transform(val => val ? val.trim() : undefined),

  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters'),

  confirmPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Infer the TypeScript type from the schema
export type OnboardFormData = z.infer<typeof onboardSchema>;

// This type represents the data after validation and transformation
export type ValidatedOnboardData = {
  name: string;
  email: string;
  age?: number;
  height?: number;
  weight?: number;
  goal: string;
  notes?: string;
  submittedAt: string; // ISO date string
};

// Helper function to prepare data for storage
export const prepareForStorage = (data: OnboardFormData): ValidatedOnboardData => ({
  ...data,
  submittedAt: new Date().toISOString(),
}); 