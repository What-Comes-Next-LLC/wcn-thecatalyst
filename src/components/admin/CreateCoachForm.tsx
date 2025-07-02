'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

interface CreateCoachFormProps {
  onSuccess: () => void;
}

export default function CreateCoachForm({ onSuccess }: CreateCoachFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const authToken = session?.access_token;

      if (!authToken) {
        throw new Error('No authentication token available');
      }

      const response = await fetch('/api/admin/create-coach', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create coach account');
      }

      setSuccess('Coach account created successfully! The coach can now sign in with their credentials.');
      setFormData({ name: '', email: '', password: '' });
      
      setTimeout(() => {
        setSuccess(null);
        onSuccess();
      }, 3000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create coach account');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, password }));
  };

  return (
    <div className="card-admin-base p-6">
      <h2 className="text-2xl font-semibold text-admin-heading mb-6">Create Coach Account</h2>
      <p className="text-admin-body mb-6">Add new coach users to the system with admin privileges</p>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-md text-red-400"
        >
          {error}
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-green-500/20 border border-green-500/40 rounded-md text-green-400"
        >
          {success}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-admin-muted mb-2">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-wcn-primary/20 border border-wcn-accent2/40 rounded-md text-admin-heading placeholder-admin-muted focus:border-wcn-accent2 focus:outline-none"
            placeholder="Coach full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-admin-muted mb-2">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-wcn-primary/20 border border-wcn-accent2/40 rounded-md text-admin-heading placeholder-admin-muted focus:border-wcn-accent2 focus:outline-none"
            placeholder="coach@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-admin-muted mb-2">
            Temporary Password
          </label>
          <div className="flex gap-2">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
              className="flex-1 px-3 py-2 bg-wcn-primary/20 border border-wcn-accent2/40 rounded-md text-admin-heading placeholder-admin-muted focus:border-wcn-accent2 focus:outline-none"
              placeholder="Coach will change on first login"
            />
            <button
              type="button"
              onClick={generatePassword}
              className="btn-admin-secondary px-4 py-2 whitespace-nowrap"
            >
              Generate
            </button>
          </div>
          <p className="text-xs text-admin-muted mt-1">
            Minimum 8 characters. Coach must change password on first login.
          </p>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="btn-admin-primary w-full"
            disabled={isSubmitting || !formData.name || !formData.email || !formData.password}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                />
                Creating Account...
              </span>
            ) : (
              'Create Coach Account'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}