import { motion, AnimatePresence } from 'framer-motion';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  subject: string;
  content: string;
  recipients: string[];
}

export default function PreviewModal({
  isOpen,
  onClose,
  onConfirm,
  subject,
  content,
  recipients
}: PreviewModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-wcn-primary/40 backdrop-blur-lg rounded-2xl p-8 max-w-2xl w-full border-2 border-wcn-mid/20"
          >
            <h2 className="text-2xl font-bold text-wcn-text mb-6">Preview Email</h2>
            
            {/* Recipients Summary */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-wcn-text mb-2">Recipients</h3>
              <div className="max-h-24 overflow-y-auto p-2 bg-black/20 rounded">
                {recipients.map((email, i) => (
                  <div key={i} className="text-wcn-text/80">{email}</div>
                ))}
              </div>
              <p className="mt-1 text-sm text-wcn-text/60">
                Total recipients: {recipients.length}
              </p>
            </div>

            {/* Email Preview */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-wcn-text mb-2">Email Preview</h3>
              <div className="bg-white rounded-lg p-4 shadow-lg">
                <div className="text-black">
                  <h4 className="font-bold mb-4">{subject}</h4>
                  <div 
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg border-2 border-wcn-mid/20 text-wcn-text/80 hover:border-wcn-mid/40 hover:text-wcn-text"
              >
                Edit
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 rounded-lg bg-wcn-accent1 text-wcn-text font-medium shadow-lg hover:bg-wcn-accent1/90"
              >
                Send Email
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 