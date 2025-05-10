import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { EmailFormState, User } from '@/types/admin';
import { processMarkdownFile, convertMarkdownToHtml } from '@/lib/markdown';
import { dispatchEmail } from '@/lib/email';

const initialState: EmailFormState = {
  recipients: [],
  content: '',
  subject: '',
  isProcessing: false,
  error: null
};

export default function IndividualForm() {
  const [formState, setFormState] = useState<EmailFormState>(initialState);
  const [preview, setPreview] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      setFormState(prev => ({ ...prev, error: 'Failed to load users' }));
    }
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setFormState(prev => ({ ...prev, recipients: [user.fields.Email] }));
  };

  const handleContentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setFormState(prev => ({ ...prev, isProcessing: true, error: null }));
      const markdown = await processMarkdownFile(file);
      const html = convertMarkdownToHtml(markdown);
      setFormState(prev => ({ ...prev, content: markdown, isProcessing: false }));
      setPreview(html);
    } catch (error) {
      setFormState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        error: 'Failed to process content file' 
      }));
    }
  };

  const handleSend = async () => {
    if (!selectedUser || !formState.content || !formState.subject) {
      setFormState(prev => ({ ...prev, error: 'Please fill in all fields' }));
      return;
    }

    try {
      setFormState(prev => ({ ...prev, isProcessing: true, error: null }));
      
      const success = await dispatchEmail('individual', selectedUser.fields.Email, {
        subject: formState.subject,
        content: formState.content,
        name: selectedUser.fields.Name
      });

      if (success) {
        setFormState(initialState);
        setPreview('');
        setSelectedUser(null);
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      setFormState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        error: 'Failed to send email' 
      }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-wcn-text mb-2">Select Recipient</label>
          <select
            value={selectedUser?.id || ''}
            onChange={(e) => {
              const user = users.find(u => u.id === e.target.value);
              if (user) handleUserSelect(user);
            }}
            className="w-full p-2 rounded-lg border-2 border-wcn-mid/20 bg-black/30 text-wcn-text/80"
            disabled={formState.isProcessing}
          >
            <option value="">Select a user...</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.fields.Name} ({user.fields.Email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-wcn-text mb-2">Subject</label>
          <input
            type="text"
            value={formState.subject}
            onChange={(e) => setFormState(prev => ({ ...prev, subject: e.target.value }))}
            className="w-full p-2 rounded-lg border-2 border-wcn-mid/20 bg-black/30 text-wcn-text/80"
            disabled={formState.isProcessing}
          />
        </div>

        <div>
          <label className="block text-wcn-text mb-2">Content (Markdown)</label>
          <input
            type="file"
            accept=".md,.txt"
            onChange={handleContentUpload}
            className="w-full p-2 rounded-lg border-2 border-wcn-mid/20 bg-black/30 text-wcn-text/80"
            disabled={formState.isProcessing}
          />
        </div>
      </div>

      {preview && (
        <div className="mt-6 p-4 rounded-lg border-2 border-wcn-mid/20 bg-black/30">
          <h3 className="text-wcn-text mb-4">Preview</h3>
          <div 
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: preview }}
          />
        </div>
      )}

      {formState.error && (
        <p className="text-red-500">{formState.error}</p>
      )}

      <button
        onClick={handleSend}
        disabled={formState.isProcessing || !selectedUser || !formState.content || !formState.subject}
        className="w-full px-4 py-2 rounded-lg bg-wcn-accent1 text-wcn-text font-medium shadow-lg hover:bg-wcn-accent1/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        {formState.isProcessing ? 'Sending...' : 'Send Message'}
      </button>
    </motion.div>
  );
} 