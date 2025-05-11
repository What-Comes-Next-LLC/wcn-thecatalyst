'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import SectionWrapper from '@/components/SectionWrapper';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ConfirmModal from '@/components/ConfirmModal';
import { dispatchEmail } from '@/lib/email';
import EmailTabs from '@/components/admin/EmailTabs';
import BroadcastForm from '@/components/admin/BroadcastForm';
import IndividualForm from '@/components/admin/IndividualForm';
import { AdminView } from '@/types/admin';
import { supabase } from '../../lib/supabaseClient';
import { uploadContent } from '@/content/uploadContent';
import { SignOutButton } from '@/components/SignOutButton';
import { hasCoachAccess } from '@/lib/auth';

interface Entry {
  user_id: string;
  name: string;
  status: string;
}

export default function AdminDashboard() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [successUrl, setSuccessUrl] = useState<string>('');
  const [activeView, setActiveView] = useState<AdminView>(AdminView.APPROVALS);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace('/signin');
        return;
      }
      
      // Check if user is admin using metadata
      const isCoach = await hasCoachAccess();
      if (!isCoach) {
        setIsAuthorized(false);
      } else {
        setIsAuthorized(true);
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (activeView === AdminView.APPROVALS) {
      fetchData();
    }
  }, [activeView]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch pending users from spark_users
      const { data: pendingUsers, error: pendingError } = await supabase
        .from('spark_users')
        .select('*')
        .eq('status', 'pending');
      
      if (pendingError) throw pendingError;
      
      // Format for display
      const entries = pendingUsers.map(user => ({
        user_id: user.id,
        name: user.name || user.email || 'Unknown',
        email: user.email,
        status: 'pending approval'
      }));

      setEntries(entries);
      setLoading(false);
    } catch (err) {
      setError(uploadContent.admin.approvalError);
      setLoading(false);
    }
  };

  const handleApproveClick = (entry: Entry) => {
    setSelectedEntry(entry);
    setIsSuccess(false);
    setIsModalOpen(true);
  };

  const handleConfirmApproval = async () => {
    if (!selectedEntry) return;
    setLoading(true);
    setError(null);
    try {
      // Update user status in spark_users
      const { error } = await supabase
        .from('spark_users')
        .update({ status: 'active' })
        .eq('id', selectedEntry.user_id);
      
      if (error) throw error;
      
      setIsSuccess(true);
      setTimeout(() => {
        fetchData();
      }, 500);
    } catch (err) {
      setError(uploadContent.admin.approvalError);
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedEntry(null);
    setSuccessUrl('');
    setIsSuccess(false);
  };

  const renderContent = () => {
    switch (activeView) {
      case AdminView.APPROVALS:
        if (loading && !isSuccess) {
          return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
        }

        if (error) {
          return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
        }

        return (
          <div className="space-y-4">
            {entries.map((entry) => (
              <motion.div
                key={entry.user_id}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: 1,
                  scale: 1,
                }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="p-6 bg-black/30 backdrop-blur-lg rounded-lg border border-wcn-mid/20 hover:border-wcn-mid/40 transition-colors shadow-lg"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-grow">
                    <h2 className="text-xl font-semibold text-wcn-text">{entry.name}</h2>
                    <p className="text-wcn-text/80">Status: {entry.status}</p>
                  </div>
                  <div className="ml-4">
                    <motion.button
                      onClick={() => handleApproveClick(entry)}
                      className="w-full px-4 py-2 rounded-lg bg-wcn-accent1 text-wcn-text font-medium shadow-lg hover:bg-wcn-accent1/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      whileTap={{ scale: 0.95 }}
                      disabled={entry.status === 'active'}
                    >
                      Approve
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        );
      case AdminView.BROADCAST:
        return <BroadcastForm />;
      case AdminView.INDIVIDUAL:
        return <IndividualForm />;
      default:
        return null;
    }
  };

  useEffect(() => {
    if (isAuthorized === false) {
      const handleUnauthorized = async () => {
        await supabase.auth.signOut();
        setTimeout(() => {
          router.replace('/');
        }, 2000);
      };
      handleUnauthorized();
    }
  }, [isAuthorized, router]);

  if (isAuthorized === false) {
    return (
      <SectionWrapper bgColor="bg-gradient-to-b from-wcn-primary via-wcn-dark to-black" textColor="text-white">
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-4xl font-bold mb-4">Unauthorized</h1>
          <p className="text-lg">You do not have permission to access this page.</p>
          <p className="text-wcn-text/80 mt-4">Redirecting to home page...</p>
        </div>
      </SectionWrapper>
    );
  }
  if (isAuthorized === null) {
    return null; // Or a loading spinner
  }

  return (
    <SectionWrapper 
      bgColor="bg-gradient-to-b from-wcn-primary via-wcn-dark to-black" 
      textColor="text-white"
      className="min-h-screen relative overflow-hidden"
    >
      {/* Watermark Logo */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="relative w-full h-full opacity-10 mix-blend-overlay">
          <Image
            src="/images/logo.png"
            alt="Company Logo"
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-4xl mx-auto px-4 py-12 z-20">
        <div className="flex justify-end mb-4">
          <SignOutButton />
        </div>
        {/* Hero Text */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-block">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-wcn-text via-wcn-accent2 to-wcn-accent1 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
              Admin Dashboard
            </h1>
          </Link>
          <p className="text-xl text-wcn-text/80 mt-4">
            Manage user submissions and communications
          </p>
        </div>

        {/* Tab Navigation */}
        <EmailTabs activeView={activeView} onViewChange={setActiveView} />

        {/* Content Area */}
        {renderContent()}
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        onConfirm={handleConfirmApproval}
        onClose={handleModalClose}
        userName={selectedEntry?.name || ''}
        successUrl={successUrl}
        isSuccess={isSuccess}
      />
    </SectionWrapper>
  );
} 