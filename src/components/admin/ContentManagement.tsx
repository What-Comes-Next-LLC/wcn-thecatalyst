'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

interface ContentSection {
  id: number;
  section_id: string;
  title: string | null;
  subhead: string | null;
  body: string | null;
  image_url: string | null;
  cta_text: string | null;
  cta_link: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface ContentSectionFormProps {
  section: ContentSection;
  onSave: (sectionId: number, data: Partial<ContentSection>) => Promise<void>;
  saving: boolean;
  saveStatus: { [key: number]: 'idle' | 'saving' | 'success' | 'error' };
}

function ContentSectionForm({ section, onSave, saving, saveStatus }: ContentSectionFormProps) {
  const [formData, setFormData] = useState({
    title: section.title || '',
    subhead: section.subhead || '',
    body: section.body || '',
    image_url: section.image_url || '',
    cta_text: section.cta_text || '',
    cta_link: section.cta_link || ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    await onSave(section.id, formData);
  };

  const status = saveStatus[section.id] || 'idle';
  const isCurrentlySaving = saving && status === 'saving';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="card-admin-interactive p-6 mb-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-admin-heading">{section.section_id}</h3>
        <div className="flex items-center space-x-3">
          {status === 'success' && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-green-600 text-sm font-medium"
            >
              Saved!
            </motion.span>
          )}
          {status === 'error' && (
            <span className="text-red-600 text-sm font-medium">
              Error saving
            </span>
          )}
          <motion.button
            onClick={handleSave}
            disabled={isCurrentlySaving}
            className={`btn-admin-primary ${isCurrentlySaving ? 'opacity-50 cursor-not-allowed' : ''}`}
            whileTap={!isCurrentlySaving ? { scale: 0.95 } : {}}
          >
            {isCurrentlySaving ? 'Saving...' : 'Save'}
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-admin-muted mb-1">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="input-field"
              placeholder="Enter title..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-admin-muted mb-1">
              Subhead
            </label>
            <input
              type="text"
              value={formData.subhead}
              onChange={(e) => handleInputChange('subhead', e.target.value)}
              className="input-field"
              placeholder="Enter subhead..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-admin-muted mb-1">
              CTA Text
            </label>
            <input
              type="text"
              value={formData.cta_text}
              onChange={(e) => handleInputChange('cta_text', e.target.value)}
              className="input-field"
              placeholder="Enter CTA text..."
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-admin-muted mb-1">
              Body
            </label>
            <textarea
              value={formData.body}
              onChange={(e) => handleInputChange('body', e.target.value)}
              rows={4}
              className="input-field"
              placeholder="Enter body content..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-admin-muted mb-1">
              Image URL
            </label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) => handleInputChange('image_url', e.target.value)}
              className="input-field"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-admin-muted mb-1">
              CTA Link
            </label>
            <input
              type="url"
              value={formData.cta_link}
              onChange={(e) => handleInputChange('cta_link', e.target.value)}
              className="input-field"
              placeholder="https://example.com/page"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ContentManagement() {
  const [content, setContent] = useState<ContentSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ [key: number]: 'idle' | 'saving' | 'success' | 'error' }>({});

  // Fetch content sections on component mount
  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get current user's session token for API auth
      const { data: { session } } = await supabase.auth.getSession();
      const authToken = session?.access_token;

      const response = await fetch('/api/admin/content', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch content');
      }

      const data = await response.json();
      setContent(data.content || []);
    } catch (err) {
      setError('Failed to fetch content. Please try again.');
      console.error('Content fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSection = async (sectionId: number, formData: Partial<ContentSection>) => {
    setSaving(true);
    setSaveStatus(prev => ({ ...prev, [sectionId]: 'saving' }));

    try {
      // Get current user's session token for API auth
      const { data: { session } } = await supabase.auth.getSession();
      const authToken = session?.access_token;

      const response = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: sectionId,
          ...formData
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save content');
      }

      const result = await response.json();
      
      // Update the local content state
      setContent(prev => prev.map(section => 
        section.id === sectionId 
          ? { ...section, ...formData, updated_at: new Date().toISOString() }
          : section
      ));

      setSaveStatus(prev => ({ ...prev, [sectionId]: 'success' }));
      
      // Clear success message after 2 seconds
      setTimeout(() => {
        setSaveStatus(prev => ({ ...prev, [sectionId]: 'idle' }));
      }, 2000);

    } catch (err) {
      setSaveStatus(prev => ({ ...prev, [sectionId]: 'error' }));
      console.error('Content save error:', err);
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setSaveStatus(prev => ({ ...prev, [sectionId]: 'idle' }));
      }, 3000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-admin-body">Loading content sections...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 mb-4">{error}</div>
        <motion.button
          onClick={fetchContent}
          className="btn-admin-primary"
          whileTap={{ scale: 0.95 }}
        >
          Try Again
        </motion.button>
      </div>
    );
  }

  if (content.length === 0) {
    return (
      <div className="text-center text-admin-muted py-12">
        No content sections found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-admin-heading mb-2">Homepage Content Management</h2>
        <p className="text-admin-body">
          Edit the content sections that appear on your homepage. Changes will be live immediately after saving.
        </p>
      </div>

      {content.map((section) => (
        <ContentSectionForm
          key={section.id}
          section={section}
          onSave={handleSaveSection}
          saving={saving}
          saveStatus={saveStatus}
        />
      ))}
    </div>
  );
}