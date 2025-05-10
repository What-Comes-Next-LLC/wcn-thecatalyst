import React from 'react';

export default function PRAdminPage() {
  // TODO: Fetch current user and check for 'majordomo' role
  // TODO: Redirect to /signin if not authorized
  // TODO: Implement CRUD UI for stories (list, add, edit, delete)
  return (
    <main className="min-h-screen bg-[#216869] text-[#dce1de] font-sans">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Mojoverse Wall Admin</h1>
        <div className="bg-[#49a078] rounded-lg shadow-lg p-6 mb-6">
          <p className="text-lg">Welcome, Majordomo! Here you can manage Mojoverse Wall stories.</p>
        </div>
        {/* TODO: CRUD UI for stories (list, add, edit, delete) */}
        <div className="bg-[#9cc5a1] rounded-lg shadow-lg p-6">
          <p>Story management UI coming soon...</p>
        </div>
      </div>
    </main>
  );
} 