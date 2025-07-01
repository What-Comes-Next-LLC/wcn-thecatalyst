import { AdminView } from '@/types/admin';
import { motion } from 'framer-motion';

interface EmailTabsProps {
  activeView: AdminView;
  onViewChange: (view: AdminView) => void;
}

export default function EmailTabs({ activeView, onViewChange }: EmailTabsProps) {
  const tabs = [
    { id: AdminView.LEADS, label: 'New Leads' },
    { id: AdminView.CLIENTS, label: 'Active Clients' },
    { id: AdminView.COMMUNICATION, label: 'Communication' },
    { id: AdminView.CONTENT, label: 'Content' }
  ];

  return (
    <div className="flex space-x-4 mb-8 border-b border-wcn-mid/20">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onViewChange(tab.id)}
          className={`relative px-4 py-2 text-wcn-text/80 hover:text-wcn-text transition-colors ${
            activeView === tab.id ? 'text-wcn-text' : ''
          }`}
        >
          {tab.label}
          {activeView === tab.id && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-wcn-accent1"
              initial={false}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
        </button>
      ))}
    </div>
  );
} 