
import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import DashboardOverview from '@/components/DashboardOverview';
import KnowledgeBaseManager from '@/components/KnowledgeBaseManager';
import UserManagement from '@/components/UserManagement';
import SystemConfig from '@/components/SystemConfig';
import ChatInterface from '@/components/ChatInterface';

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
        return <ChatInterface />;
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
