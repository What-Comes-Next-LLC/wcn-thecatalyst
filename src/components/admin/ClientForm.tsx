import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

// Define validation schema for client data
const clientSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  age: z.number().int().min(13).max(120),
  height: z.number().int().min(48).max(96),
  weight: z.number().int().min(50).max(1000),
  goal: z.string().min(10),
  notes: z.string().optional()
});

type ClientFormData = z.infer<typeof clientSchema>;

interface ClientFormProps {
  leadData: {
    id: string;
    name: string;
    email: string;
    goal: string;
    notes?: string;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ClientForm({ leadData, onSuccess, onCancel }: ClientFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: leadData.name,
      email: leadData.email,
      goal: leadData.goal,
      notes: leadData.notes || ''
    }
  });
  
  const onSubmit = async (data: ClientFormData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // 1. Update the user in the spark_users table
      const { error: dbError } = await supabase
        .from('spark_users')
        .update({
          name: data.name,
          email: data.email,
          age: data.age,
          height: data.height,
          weight: data.weight,
          goal: data.goal,
          notes: data.notes || null,
          status: 'active',
          role: 'client'
        })
        .eq('id', leadData.id);
      
      if (dbError) throw new Error(dbError.message);
      
      // Success
      onSuccess();
    } catch (err) {
      setError(`Failed to create client: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const inputStyles = "w-full p-3 border-2 border-wcn-gray rounded-lg bg-white/5 text-white placeholder-gray-400 focus:border-wcn-mid focus:ring-2 focus:ring-wcn-mid/50 focus:outline-none transition-all duration-200";
  const labelStyles = "block text-wcn-gray text-sm font-medium mb-1";
  const errorStyles = "text-red-400 text-sm mt-1";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/40 backdrop-blur-lg rounded-2xl p-8 border-2 border-wcn-mid/30 max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-wcn-text mb-6">Create Client Profile</h2>
      
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-lg mb-6">
          <p>{error}</p>
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
            <label htmlFor="age" className={labelStyles}>Age</label>
            <input
              id="age"
              type="number"
              {...register('age', { valueAsNumber: true })}
              className={`${inputStyles} ${errors.age ? 'border-red-500' : ''}`}
            />
            {errors.age && <p className={errorStyles}>{errors.age.message}</p>}
          </div>
          
          <div>
            <label htmlFor="height" className={labelStyles}>Height (inches)</label>
            <input
              id="height"
              type="number"
              {...register('height', { valueAsNumber: true })}
              placeholder="72 for 6 feet"
              className={`${inputStyles} ${errors.height ? 'border-red-500' : ''}`}
            />
            {errors.height && <p className={errorStyles}>{errors.height.message}</p>}
          </div>
          
          <div>
            <label htmlFor="weight" className={labelStyles}>Weight (lbs)</label>
            <input
              id="weight"
              type="number"
              {...register('weight', { valueAsNumber: true })}
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
            className="px-4 py-2 rounded-lg border-2 border-wcn-mid/20 text-wcn-text/80 hover:border-wcn-mid/40 hover:text-wcn-text transition-all duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 rounded-lg bg-wcn-accent1 text-wcn-text font-medium shadow-lg hover:bg-wcn-accent1/90 transition-all duration-200 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Creating...' : 'Create Client'}
          </button>
        </div>
      </form>
    </motion.div>
  );
} 