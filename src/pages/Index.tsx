
import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import DashboardOverview from '@/components/DashboardOverview';
import KnowledgeBaseManager from '@/components/KnowledgeBaseManager';
import UserManagement from '@/components/UserManagement';
import SystemConfig from '@/components/SystemConfig';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'knowledge':
        return <KnowledgeBaseManager />;
      case 'users':
        return <UserManagement />;
      case 'chats':
        return (
          <div className="flex items-center justify-center h-64 bg-white/60 backdrop-blur-sm rounded-lg border-0 shadow-lg">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Chat Sessions</h3>
              <p className="text-slate-600">Chat session monitoring coming soon...</p>
            </div>
          </div>
        );
      case 'settings':
        return <SystemConfig />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <AdminLayout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderCurrentPage()}
    </AdminLayout>
  );
};

export default Index;
