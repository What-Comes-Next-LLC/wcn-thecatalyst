'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import SectionWrapper from '@/components/SectionWrapper';
import EmailTabs from '@/components/admin/EmailTabs';
import { AdminView } from '@/types/admin';
import { supabase } from '@/lib/supabaseClient';
import { hasCoachAccess } from '@/lib/auth';
import { SignOutButton } from '@/components/SignOutButton';
import Link from 'next/link';
import { uploadContent } from '@/content/uploadContent';
import ClientForm from '@/components/admin/ClientForm';

interface Lead {
  id: string;
  name: string;
  email: string;
  goal: string;
  notes?: string;
  created_at: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
  age?: number;
  height?: number;
  weight?: number;
  goal: string;
  notes?: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showClientForm, setShowClientForm] = useState(false);
  
  const [activeView, setActiveView] = useState<AdminView>(AdminView.LEADS);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const router = useRouter();

  // Check user authorization on load
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace('/signin');
        return;
      }
      
      // Check if user is coach using metadata
      const isCoach = await hasCoachAccess();
      if (!isCoach) {
        setIsAuthorized(false);
      } else {
        setIsAuthorized(true);
      }
    };
    checkAuth();
  }, [router]);

  // Fetch data when view changes
  useEffect(() => {
    if (isAuthorized) {
      if (activeView === AdminView.LEADS) {
        fetchLeads();
      } else if (activeView === AdminView.CLIENTS) {
        fetchClients();
      }
    }
  }, [activeView, isAuthorized]);

  // Fetch leads (users with role 'lead' in metadata)
  const fetchLeads = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use the updated API endpoint to get all users with role 'lead'
      const response = await fetch('/api/admin/entries');
      if (!response.ok) {
        throw new Error('Failed to fetch leads');
      }
      
      const data = await response.json();
      
      // Format leads from API response
      const formattedLeads = data.records.map((record: any) => ({
        id: record.id,
        name: record.fields.Name,
        email: record.fields.Email,
        goal: record.fields.Goal || 'Not specified',
        notes: record.fields.Notes || '',
        created_at: record.fields['Created At']
      }));
      
      setLeads(formattedLeads);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch leads. Please try again.');
      setLoading(false);
    }
  };

  // Fetch active clients
  const fetchClients = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use the admin users endpoint to get clients
      const response = await fetch('/api/admin/users');
      if (!response.ok) {
        throw new Error('Failed to fetch clients');
      }
      
      const data = await response.json();
      
      // Format clients from API response
      const formattedClients = data.users.map((userRecord: any) => ({
        id: userRecord.id,
        name: userRecord.fields.Name,
        email: userRecord.fields.Email,
        goal: userRecord.fields.Goal || 'Not specified',
        notes: userRecord.fields.Notes || '',
        created_at: userRecord.fields['Created At']
      }));
      
      setClients(formattedClients);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch clients. Please try again.');
      setLoading(false);
    }
  };

  // Handle converting a lead to a client
  const handleConvertToClient = (lead: Lead) => {
    setSelectedLead(lead);
    setShowClientForm(true);
  };

  // Handle successful client creation
  const handleClientCreated = () => {
    setShowClientForm(false);
    setSelectedLead(null);
    fetchLeads(); // Refresh the leads list
  };

  // Handle cancelling client creation
  const handleCancelClientForm = () => {
    setShowClientForm(false);
    setSelectedLead(null);
  };

  // Render leads list
  const renderLeads = () => {
    if (loading) {
      return <div className="flex justify-center items-center py-12">Loading...</div>;
    }

    if (error) {
      return <div className="text-red-500 py-8">{error}</div>;
    }

    if (leads.length === 0) {
      return <div className="text-center text-wcn-text/60 py-12">No new leads available.</div>;
    }

    return (
      <div className="space-y-4">
        {leads.map((lead) => (
          <motion.div
            key={lead.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 bg-black/30 backdrop-blur-lg rounded-lg border border-wcn-mid/20 hover:border-wcn-mid/40 transition-colors shadow-lg"
          >
            <div className="flex justify-between items-start">
              <div className="flex-grow">
                <h2 className="text-xl font-semibold text-wcn-text">{lead.name}</h2>
                <p className="text-wcn-text/80">{lead.email}</p>
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-wcn-gray">Goal:</h3>
                  <p className="text-wcn-text/90">{lead.goal}</p>
                </div>
                {lead.notes && (
                  <div className="mt-2">
                    <h3 className="text-sm font-medium text-wcn-gray">Notes:</h3>
                    <p className="text-wcn-text/90">{lead.notes}</p>
                  </div>
                )}
                <p className="text-xs text-wcn-gray mt-4">
                  Created: {new Date(lead.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="ml-4">
                <motion.button
                  onClick={() => handleConvertToClient(lead)}
                  className="px-4 py-2 rounded-lg bg-wcn-accent1 text-wcn-text font-medium shadow-lg hover:bg-wcn-accent1/90 transition-all duration-200"
                  whileTap={{ scale: 0.95 }}
                >
                  Create Client
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  // Render clients list
  const renderClients = () => {
    if (loading) {
      return <div className="flex justify-center items-center py-12">Loading...</div>;
    }

    if (error) {
      return <div className="text-red-500 py-8">{error}</div>;
    }

    if (clients.length === 0) {
      return <div className="text-center text-wcn-text/60 py-12">No active clients found.</div>;
    }

    return (
      <div className="space-y-6">
        {clients.map((client) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 bg-black/30 backdrop-blur-lg rounded-lg border border-wcn-mid/20 hover:border-wcn-mid/40 transition-colors shadow-lg"
          >
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold text-wcn-text">{client.name}</h2>
              <span className="text-sm px-3 py-1 bg-green-500/20 text-green-400 rounded-full">
                Active
              </span>
            </div>
            
            <p className="text-wcn-text/80 mb-4">{client.email}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <h3 className="text-sm font-medium text-wcn-gray">Age:</h3>
                <p className="text-wcn-text">{client.age || 'Not specified'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-wcn-gray">Height:</h3>
                <p className="text-wcn-text">{client.height ? `${client.height} inches` : 'Not specified'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-wcn-gray">Weight:</h3>
                <p className="text-wcn-text">{client.weight ? `${client.weight} lbs` : 'Not specified'}</p>
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="text-sm font-medium text-wcn-gray">Goal:</h3>
              <p className="text-wcn-text/90">{client.goal}</p>
            </div>
            
            {client.notes && (
              <div className="mt-2">
                <h3 className="text-sm font-medium text-wcn-gray">Notes:</h3>
                <p className="text-wcn-text/90">{client.notes}</p>
              </div>
            )}
            
            <p className="text-xs text-wcn-gray mt-4">
              Created: {new Date(client.created_at).toLocaleDateString()}
            </p>
          </motion.div>
        ))}
      </div>
    );
  };

  // Render communication view (placeholder for now)
  const renderCommunication = () => (
    <div className="text-center text-wcn-text py-12">
      Communication features coming soon...
    </div>
  );

  // Main render content function
  const renderContent = () => {
    if (!isAuthorized) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-red-400 text-xl mb-4">You are not authorized to access this area.</p>
          <p className="text-wcn-text/80">This dashboard is only available to coach accounts.</p>
          <Link href="/" className="mt-6 px-4 py-2 bg-wcn-accent2 text-white rounded-lg">
            Return Home
          </Link>
        </div>
      );
    }

    if (showClientForm && selectedLead) {
      return (
        <ClientForm 
          leadData={selectedLead}
          onSuccess={handleClientCreated}
          onCancel={handleCancelClientForm}
        />
      );
    }

    switch (activeView) {
      case AdminView.LEADS:
        return renderLeads();
      case AdminView.CLIENTS:
        return renderClients();
      case AdminView.COMMUNICATION:
        return renderCommunication();
      default:
        return null;
    }
  };

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
            Manage leads, clients, and communications
          </p>
        </div>

        {/* Tab Navigation */}
        <EmailTabs activeView={activeView} onViewChange={setActiveView} />

        {/* Content Area */}
        {renderContent()}
      </div>
    </SectionWrapper>
  );
} 