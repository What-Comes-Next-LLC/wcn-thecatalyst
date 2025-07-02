import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

// Define validation schema for client data
const clientSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  goal: z.string().min(10, 'Goal must be at least 10 characters'),
  notes: z.string().optional(),
  // Make these fields optional with reasonable defaults
  age: z.number().int().min(13).max(120).optional(),
  height: z.number().int().min(120).max(250).optional(), // Height in centimeters (4ft - 8.2ft)
  weight: z.number().int().min(30).max(300).optional(), // Weight in kilograms (66lb - 661lb)
  assigned_coach_id: z.string().uuid().optional()
});

type ClientFormData = z.infer<typeof clientSchema>;

interface ClientFormProps {
  leadData: {
    id: string;
    name?: string;
    email: string;
    goal?: string;
    notes?: string;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

interface Coach {
  id: string;
  name: string;
  email: string;
}

export default function ClientForm({ leadData, onSuccess, onCancel }: ClientFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loadingCoaches, setLoadingCoaches] = useState(true);
  const [coachError, setCoachError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: leadData.name || '',
      email: leadData.email,
      goal: leadData.goal || '',
      notes: leadData.notes || ''
    }
  });
  
  // Load available coaches
  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const { data, error } = await supabase
          .from('coaches')
          .select('id, name, email')
          .eq('is_active', true)
          .order('name');
          
        if (error) {
          console.error('Error fetching coaches:', error);
          setCoachError('Failed to load coaches. Coach assignment will not be available.');
        } else {
          setCoaches(data || []);
          setCoachError(null);
        }
      } catch (err) {
        console.error('Failed to load coaches:', err);
        setCoachError('Failed to load coaches. Coach assignment will not be available.');
      } finally {
        setLoadingCoaches(false);
      }
    };
    
    fetchCoaches();
  }, []);
  
  const onSubmit = async (data: ClientFormData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Get current user's session token for API auth
      const { data: { session } } = await supabase.auth.getSession();
      const authToken = session?.access_token;
      
      if (!authToken) {
        throw new Error('No authentication token available');
      }
      
      // Call the updated approve API endpoint to:
      // 1. Create spark_users entry for the lead
      // 2. Update user_metadata.role from 'lead' to 'client'
      const response = await fetch('/api/admin/approve', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          leadData: {
            id: leadData.id,
            name: data.name,
            email: data.email,
            goal: data.goal,
            notes: data.notes,
            age: data.age,
            height: data.height, // Already in centimeters from form
            weight: data.weight, // Already in kilograms from form
            assigned_coach_id: data.assigned_coach_id
          }
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to approve lead');
      }
      
      // Success
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 1500); // Show success message briefly before closing
    } catch (err) {
      setError(`Failed to create client: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const inputStyles = "input w-full bg-wcn-primary/20 border-wcn-accent2/40 text-wcn-text placeholder-wcn-text/50 focus:border-wcn-accent2 focus:ring-wcn-accent2/50";
  const labelStyles = "block text-admin-muted text-sm font-medium mb-1";
  const errorStyles = "text-red-400 text-sm mt-1";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-admin-elevated p-8 max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-admin-heading mb-6">Coach's Clipboard</h2>
      
      {error && (
        <div className="bg-red-500/20 border border-red-400 text-red-300 p-4 rounded-lg mb-6">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-500/20 border border-green-400 text-green-300 p-4 rounded-lg mb-6">
          <p className="text-sm font-medium">✅ Client created successfully! Returning to dashboard...</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className={labelStyles}>Name</label>
            <input
              id="name"
              {...register('name')}
              className={`${inputStyles} ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && <p className={errorStyles}>{errors.name.message}</p>}
          </div>
          
          <div>
            <label htmlFor="email" className={labelStyles}>Email</label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className={`${inputStyles} ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && <p className={errorStyles}>{errors.email.message}</p>}
          </div>
          
          <div>
            <label htmlFor="age" className={labelStyles}>Age (optional)</label>
            <input
              id="age"
              type="number"
              {...register('age', { valueAsNumber: true })}
              className={`${inputStyles} ${errors.age ? 'border-red-500' : ''}`}
            />
            {errors.age && <p className={errorStyles}>{errors.age.message}</p>}
          </div>
          
          <div>
            <label htmlFor="height" className={labelStyles}>Height in centimeters (optional)</label>
            <input
              id="height"
              type="number"
              {...register('height', { valueAsNumber: true })}
              placeholder="175 cm (5'9&quot;)"
              className={`${inputStyles} ${errors.height ? 'border-red-500' : ''}`}
            />
            {errors.height && <p className={errorStyles}>{errors.height.message}</p>}
          </div>
          
          <div>
            <label htmlFor="weight" className={labelStyles}>Weight in kilograms (optional)</label>
            <input
              id="weight"
              type="number"
              {...register('weight', { valueAsNumber: true })}
              placeholder="70 kg (154 lbs)"
              className={`${inputStyles} ${errors.weight ? 'border-red-500' : ''}`}
            />
            {errors.weight && <p className={errorStyles}>{errors.weight.message}</p>}
          </div>
        </div>
        
        <div>
          <label htmlFor="goal" className={labelStyles}>Fitness Goal</label>
          <textarea
            id="goal"
            {...register('goal')}
            rows={3}
            className={`${inputStyles} ${errors.goal ? 'border-red-500' : ''}`}
          ></textarea>
          {errors.goal && <p className={errorStyles}>{errors.goal.message}</p>}
        </div>
        
        <div>
          <label htmlFor="assigned_coach_id" className={labelStyles}>Assign Coach (optional)</label>
          {loadingCoaches ? (
            <div className={`${inputStyles} flex items-center`}>
              <span className="text-admin-muted">Loading coaches...</span>
            </div>
          ) : coachError ? (
            <div className="text-sm text-red-400 mb-2">
              {coachError}
            </div>
          ) : (
            <select
              id="assigned_coach_id"
              {...register('assigned_coach_id')}
              className={`${inputStyles} ${errors.assigned_coach_id ? 'border-red-500' : ''}`}
            >
              <option value="">No coach assigned</option>
              {coaches.map((coach) => (
                <option key={coach.id} value={coach.id}>
                  {coach.name} ({coach.email})
                </option>
              ))}
            </select>
          )}
          {errors.assigned_coach_id && <p className={errorStyles}>{errors.assigned_coach_id.message}</p>}
        </div>
        
        <div>
          <label htmlFor="notes" className={labelStyles}>Additional Notes</label>
          <textarea
            id="notes"
            {...register('notes')}
            rows={3}
            className={inputStyles}
          ></textarea>
        </div>
        
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="btn-admin-ghost"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`btn-admin-primary ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Creating...' : 'Create Client'}
          </button>
        </div>
      </form>
    </motion.div>
  );
} 