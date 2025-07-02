'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

interface Lead {
  id: string;
  name: string;
  email: string;
  goal: string;
  notes?: string;
  created_at: string;
}

interface EditLeadModalProps {
  lead: Lead;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditLeadModal({ lead, onClose, onSuccess }: EditLeadModalProps) {
  const [formData, setFormData] = useState({
    name: lead.name,
    email: lead.email,
    goal: lead.goal,
    notes: lead.notes || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const authToken = session?.access_token;

      if (!authToken) {
        throw new Error('No authentication token available');
      }

      const response = await fetch('/api/admin/update-lead', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: lead.id,
          updates: {
            name: formData.name,
            email: formData.email,
            goal: formData.goal,
            notes: formData.notes
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update lead');
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update lead');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-wcn-primary/90 backdrop-blur-md border border-wcn-accent2/60 rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-admin-heading">Edit Lead</h2>
            <button
              onClick={onClose}
              className="text-admin-muted hover:text-admin-heading transition-colors"
            >
              ✕
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-md text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-admin-muted mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-wcn-primary/20 border border-wcn-accent2/40 rounded-md text-admin-heading placeholder-admin-muted focus:border-wcn-accent2 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-admin-muted mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-wcn-primary/20 border border-wcn-accent2/40 rounded-md text-admin-heading placeholder-admin-muted focus:border-wcn-accent2 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-admin-muted mb-2">
                Goal
              </label>
              <input
                type="text"
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-wcn-primary/20 border border-wcn-accent2/40 rounded-md text-admin-heading placeholder-admin-muted focus:border-wcn-accent2 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-admin-muted mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 bg-wcn-primary/20 border border-wcn-accent2/40 rounded-md text-admin-heading placeholder-admin-muted focus:border-wcn-accent2 focus:outline-none resize-none"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-admin-secondary flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-admin-primary flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Updating...' : 'Update Lead'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}