import React from 'react';
import { motion } from 'framer-motion';

type ConfirmModalProps = {
  isOpen: boolean;
  onConfirm: () => void;
  onClose: () => void;
  userName: string;
  successUrl?: string;
  isSuccess: boolean;
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onConfirm,
  onClose,
  userName,
  successUrl,
  isSuccess
}) => {
  if (!isOpen) return null;

  return (
    <motion.div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-wcn-primary/40 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full border-2 border-wcn-mid/20"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        {!isSuccess ? (
          // Confirmation View
          <>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-wcn-text via-wcn-accent2 to-wcn-accent1 bg-clip-text text-transparent">
              Confirm Approval
            </h3>
            <p className="mb-6 text-wcn-text/80">
              Are you sure you want to approve {userName}?
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={onClose}
                className="px-4 py-2 rounded-lg border-2 border-wcn-mid/20 text-wcn-text/80 hover:border-wcn-mid/40 hover:text-wcn-text transition-all duration-200"
              >
                Cancel
              </button>
              <button 
                onClick={onConfirm}
                className="px-4 py-2 rounded-lg bg-wcn-accent1 text-wcn-text font-medium shadow-lg hover:bg-wcn-accent1/90 transition-all duration-200"
              >
                Approve
              </button>
            </div>
          </>
        ) : (
          // Success View with Copy URL
          <>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-wcn-text via-wcn-accent2 to-wcn-accent1 bg-clip-text text-transparent">
              User Approved Successfully
            </h3>
            <p className="mb-2 text-wcn-text/80">Customer Access URL:</p>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                readOnly
                value={successUrl}
                className="w-full p-2 rounded-lg border-2 border-wcn-mid/20 bg-black/30 text-wcn-text/80 focus:border-wcn-mid/40 focus:ring-2 focus:ring-wcn-mid/20 focus:outline-none transition-all"
                onClick={(e) => e.currentTarget.select()}
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(successUrl || '');
                }}
                className="px-4 py-2 rounded-lg bg-wcn-accent1 text-wcn-text font-medium shadow-lg hover:bg-wcn-accent1/90 transition-all duration-200"
              >
                Copy
              </button>
            </div>
            <p className="text-sm text-wcn-text/60 mb-6">
              This URL contains their unique access token. Make sure to save or share it now.
            </p>
            <div className="flex justify-end">
              <button 
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-wcn-accent1 text-wcn-text font-medium shadow-lg hover:bg-wcn-accent1/90 transition-all duration-200"
              >
                Done
              </button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ConfirmModal; 