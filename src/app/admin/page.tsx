'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import EmailTabs from '@/components/admin/EmailTabs';
import { AdminView } from '@/types/admin';
import { supabase } from '@/lib/supabaseClient';
import { hasCoachAccess } from '@/lib/auth';
import { useAuth } from '@/contexts/AuthContext';
import { SignOutButton } from '@/components/SignOutButton';
import Link from 'next/link';
import Image from 'next/image';
import ClientForm from '@/components/admin/ClientForm';
import ContentManagement from '@/components/admin/ContentManagement';
import EditLeadModal from '@/components/admin/EditLeadModal';
import CreateCoachForm from '@/components/admin/CreateCoachForm';

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
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  
  const [activeView, setActiveView] = useState<AdminView>(AdminView.LEADS);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Check user authorization on load
  useEffect(() => {
    const checkAuth = async () => {
      if (!authLoading) {
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
      }
    };
    checkAuth();
  }, [user, authLoading, router]);

  // Fetch data when view changes
  useEffect(() => {
    if (isAuthorized) {
      if (activeView === AdminView.LEADS || activeView === AdminView.USER_MANAGEMENT) {
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
      // Get current user's session token for API auth
      const { data: { session } } = await supabase.auth.getSession();
      const authToken = session?.access_token;
      
      // Use the existing entries endpoint (now fixed for Supabase)
      const response = await fetch('/api/admin/entries', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch leads');
      }
      
      const data = await response.json();
      
      // Format leads from API response
      const formattedLeads = data.leads.map((lead: {
        id: string;
        fields: {
          Name: string;
          Email: string;
          Goal?: string;
          Notes?: string;
          'Created At': string;
        };
      }) => ({
        id: lead.id,
        name: lead.fields.Name,
        email: lead.fields.Email,
        goal: lead.fields.Goal || 'Not specified',
        notes: lead.fields.Notes || '',
        created_at: lead.fields['Created At']
      }));
      
      setLeads(formattedLeads);
      setLoading(false);
    } catch {
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
      const formattedClients = data.users.map((userRecord: {
        id: string;
        fields: {
          Name: string;
          Email: string;
          Goal?: string;
          Notes?: string;
          'Created At': string;
        };
      }) => ({
        id: userRecord.id,
        name: userRecord.fields.Name,
        email: userRecord.fields.Email,
        goal: userRecord.fields.Goal || 'Not specified',
        notes: userRecord.fields.Notes || '',
        created_at: userRecord.fields['Created At']
      }));
      
      setClients(formattedClients);
      setLoading(false);
    } catch {
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
      return <div className="flex justify-center items-center py-12 text-admin-body">Loading...</div>;
    }

    if (error) {
      return <div className="text-red-400 py-8">{error}</div>;
    }

    if (leads.length === 0) {
      return <div className="text-center text-admin-muted py-12">No new leads available.</div>;
    }

    return (
      <div className="space-y-4">
        {leads.map((lead) => (
          <motion.div
            key={lead.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card-admin-interactive p-6"
          >
            <div className="flex justify-between items-start">
              <div className="flex-grow">
                <h2 className="text-xl font-semibold text-admin-heading">{lead.name}</h2>
                <p className="text-admin-body">{lead.email}</p>
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-admin-muted">Goal:</h3>
                  <p className="text-admin-body">{lead.goal}</p>
                </div>
                {lead.notes && (
                  <div className="mt-2">
                    <h3 className="text-sm font-medium text-admin-muted">Notes:</h3>
                    <p className="text-admin-body">{lead.notes}</p>
                  </div>
                )}
                <p className="text-xs text-admin-muted mt-4">
                  Created: {new Date(lead.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="ml-4">
                <motion.button
                  onClick={() => handleConvertToClient(lead)}
                  className="btn-admin-primary"
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
      return <div className="flex justify-center items-center py-12 text-admin-body">Loading...</div>;
    }

    if (error) {
      return <div className="text-red-400 py-8">{error}</div>;
    }

    if (clients.length === 0) {
      return <div className="text-center text-admin-muted py-12">No active clients found.</div>;
    }

    return (
      <div className="space-y-6">
        {clients.map((client) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card-admin-interactive p-6"
          >
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold text-admin-heading">{client.name}</h2>
              <span className="text-sm px-3 py-1 bg-wcn-accent2/30 text-wcn-text rounded-full border border-wcn-accent2/60">
                Active
              </span>
            </div>
            
            <p className="text-admin-body mb-4">{client.email}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <h3 className="text-sm font-medium text-admin-muted">Age:</h3>
                <p className="text-admin-body">{client.age || 'Not specified'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-admin-muted">Height:</h3>
                <p className="text-admin-body">{client.height ? `${client.height} inches` : 'Not specified'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-admin-muted">Weight:</h3>
                <p className="text-admin-body">{client.weight ? `${client.weight} lbs` : 'Not specified'}</p>
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="text-sm font-medium text-admin-muted">Goal:</h3>
              <p className="text-admin-body">{client.goal}</p>
            </div>
            
            {client.notes && (
              <div className="mt-2">
                <h3 className="text-sm font-medium text-admin-muted">Notes:</h3>
                <p className="text-admin-body">{client.notes}</p>
              </div>
            )}
            
            <p className="text-xs text-admin-muted mt-4">
              Created: {new Date(client.created_at).toLocaleDateString()}
            </p>
          </motion.div>
        ))}
      </div>
    );
  };

  // Render communication view (placeholder for now)
  const renderCommunication = () => (
    <div className="text-center text-admin-body py-12">
      Communication features coming soon...
    </div>
  );

  // Render user management view
  const renderUserManagement = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Edit Leads Section */}
        <div className="card-admin-base p-6">
          <h2 className="text-2xl font-semibold text-admin-heading mb-6">Edit Leads</h2>
          <p className="text-admin-body mb-4">Modify existing lead information before conversion</p>
          
          {loading ? (
            <div className="text-center text-admin-muted py-8">Loading leads...</div>
          ) : leads.length === 0 ? (
            <div className="text-center text-admin-muted py-8">No leads available to edit</div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {leads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between p-3 bg-wcn-primary/40 rounded-lg border border-wcn-accent2/30">
                  <div>
                    <p className="font-medium text-admin-heading">{lead.name}</p>
                    <p className="text-sm text-admin-body">{lead.email}</p>
                  </div>
                  <button 
                    className="btn-admin-secondary text-sm px-3 py-1"
                    onClick={() => setEditingLead(lead)}
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Coach Section */}
        <CreateCoachForm onSuccess={() => {
          // Refresh leads if needed
          if (activeView === AdminView.LEADS) {
            fetchLeads();
          }
        }} />
      </div>
    </div>
  );

  // Main render content function
  const renderContent = () => {
    if (!isAuthorized) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-red-400 text-xl mb-4">You are not authorized to access this area.</p>
          <p className="text-admin-body">This dashboard is only available to coach accounts.</p>
          <Link href="/" className="btn-admin-primary mt-6">
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
      case AdminView.CONTENT:
        return <ContentManagement />;
      case AdminView.USER_MANAGEMENT:
        return renderUserManagement();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-wcn-gradient from-wcn-dark to-wcn-primary relative overflow-hidden">
      {/* Admin Watermark Logo */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <div className="absolute inset-0 bg-wcn-primary/10"></div>
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/images/logo-official.png"
            alt="What Comes Next Logo"
            fill
            className="object-contain opacity-[0.08] mix-blend-overlay"
            priority
          />
        </div>
      </div>
      
      <div className="container-wide py-12 relative">
        <div className="flex justify-end mb-4">
          <SignOutButton />
        </div>
        {/* Hero Text */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-block">
            <h1 className="text-5xl font-bold text-admin-heading hover:text-wcn-accent2 transition-colors duration-200">
              Admin Dashboard
            </h1>
          </Link>
          <p className="text-xl text-admin-body mt-4">
            Manage leads, clients, and communications
          </p>
        </div>

        {/* Tab Navigation */}
        <EmailTabs activeView={activeView} onViewChange={setActiveView} />

        {/* Content Area */}
        {renderContent()}
        
        {/* Modals */}
        {editingLead && (
          <EditLeadModal
            lead={editingLead}
            onClose={() => setEditingLead(null)}
            onSuccess={() => {
              setEditingLead(null);
              if (activeView === AdminView.LEADS || activeView === AdminView.USER_MANAGEMENT) {
                fetchLeads();
              }
            }}
          />
        )}
      </div>
    </div>
  );
} 