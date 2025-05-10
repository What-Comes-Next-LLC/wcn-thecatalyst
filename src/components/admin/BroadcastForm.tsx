import { useState } from 'react';
import { motion } from 'framer-motion';
import { EmailFormState } from '@/types/admin';
import { processCsvFile, processMarkdownFile, convertMarkdownToHtml } from '@/lib/markdown';
import { dispatchEmail } from '@/lib/email';
import PreviewModal from './PreviewModal';

const initialState: EmailFormState = {
  recipients: [],
  content: '',
  subject: '',
  isProcessing: false,
  error: null
};

export default function BroadcastForm() {
  const [formState, setFormState] = useState<EmailFormState>(initialState);
  const [preview, setPreview] = useState<string>('');
  const [manualEmail, setManualEmail] = useState('');
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const handleRecipientsUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setFormState(prev => ({ ...prev, isProcessing: true, error: null }));
      const emails = await processCsvFile(file);
      setFormState(prev => ({ ...prev, recipients: emails, isProcessing: false }));
    } catch (error) {
      setFormState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        error: 'Failed to process recipient list' 
      }));
    }
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

  const handleManualEmailAdd = () => {
    if (!manualEmail) return;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(manualEmail)) {
      setFormState(prev => ({ ...prev, error: 'Please enter a valid email address' }));
      return;
    }

    setFormState(prev => ({
      ...prev,
      recipients: [...prev.recipients, manualEmail],
      error: null
    }));
    setManualEmail('');
  };

  const handleContentChange = (content: string) => {
    setFormState(prev => ({ ...prev, content }));
    setPreview(convertMarkdownToHtml(content));
  };

  const handleSend = async () => {
    if (!formState.recipients.length || !formState.content || !formState.subject) {
      setFormState(prev => ({ ...prev, error: 'Please fill in all fields' }));
      return;
    }

    try {
      setFormState(prev => ({ ...prev, isProcessing: true, error: null }));
      
      // Send to each recipient
      const results = await Promise.all(
        formState.recipients.map(email =>
          dispatchEmail('broadcast', email, {
            subject: formState.subject,
            content: formState.content
          })
        )
      );

      if (results.every(Boolean)) {
        setFormState(initialState);
        setPreview('');
        setManualEmail('');
      } else {
        throw new Error('Some emails failed to send');
      }
    } catch (error) {
      setFormState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        error: 'Failed to send emails' 
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
          <label className="block text-wcn-text mb-2">Add Recipient Email</label>
          <div className="flex gap-2">
            <input
              type="email"
              value={manualEmail}
              onChange={(e) => setManualEmail(e.target.value)}
              placeholder="Enter email address"
              className="flex-1 p-2 rounded-lg border-2 border-wcn-mid/20 bg-black/30 text-wcn-text/80"
              disabled={formState.isProcessing}
              onKeyPress={(e) => e.key === 'Enter' && handleManualEmailAdd()}
            />
            <button
              onClick={handleManualEmailAdd}
              disabled={formState.isProcessing || !manualEmail}
              className="px-4 py-2 rounded-lg bg-wcn-accent1 text-wcn-text font-medium shadow-lg hover:bg-wcn-accent1/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
        </div>

        <div>
          <label className="block text-wcn-text mb-2">
            Or Upload Recipient List (CSV)
            <span className="text-sm text-wcn-text/60 ml-2">One email per line</span>
          </label>
          <input
            type="file"
            accept=".csv"
            onChange={handleRecipientsUpload}
            className="w-full p-2 rounded-lg border-2 border-wcn-mid/20 bg-black/30 text-wcn-text/80"
            disabled={formState.isProcessing}
          />
          {formState.recipients.length > 0 && (
            <div className="mt-2">
              <p className="text-wcn-text/60">Recipients:</p>
              <div className="max-h-24 overflow-y-auto mt-1">
                {formState.recipients.map((email, index) => (
                  <div key={index} className="text-wcn-text/80 flex items-center gap-2">
                    <span>{email}</span>
                    <button
                      onClick={() => setFormState(prev => ({
                        ...prev,
                        recipients: prev.recipients.filter((_, i) => i !== index)
                      }))}
                      className="text-red-500 hover:text-red-400"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
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
          <label className="block text-wcn-text mb-2">Content</label>
          <div className="space-y-2">
            <textarea
              value={formState.content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="Write your content in Markdown format..."
              className="w-full h-48 p-2 rounded-lg border-2 border-wcn-mid/20 bg-black/30 text-wcn-text/80 resize-y"
              disabled={formState.isProcessing}
            />
            <div className="flex items-center gap-2">
              <span className="text-wcn-text/60">or</span>
              <input
                type="file"
                accept=".md,.txt"
                onChange={handleContentUpload}
                className="flex-1 p-2 rounded-lg border-2 border-wcn-mid/20 bg-black/30 text-wcn-text/80"
                disabled={formState.isProcessing}
              />
            </div>
          </div>
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

      <div className="flex gap-4">
        <button
          onClick={() => setShowPreviewModal(true)}
          disabled={formState.isProcessing || !formState.recipients.length || !formState.content || !formState.subject}
          className="flex-1 px-4 py-2 rounded-lg border-2 border-wcn-mid/20 text-wcn-text font-medium hover:bg-wcn-mid/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          Preview Email
        </button>
        <button
          onClick={handleSend}
          disabled={formState.isProcessing || !formState.recipients.length || !formState.content || !formState.subject}
          className="flex-1 px-4 py-2 rounded-lg bg-wcn-accent1 text-wcn-text font-medium shadow-lg hover:bg-wcn-accent1/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {formState.isProcessing ? 'Sending...' : 'Send Update'}
        </button>
      </div>

      <PreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        onConfirm={() => {
          setShowPreviewModal(false);
          handleSend();
        }}
        subject={formState.subject}
        content={preview}
        recipients={formState.recipients}
      />
    </motion.div>
  );
} 