
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  FileText, 
  Settings, 
  MessageSquare, 
  BarChart3, 
  Menu,
  X,
  Database,
  Shield,
  Bell
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const AdminLayout = ({ children, currentPage, onPageChange }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigation = [
    { name: 'Dashboard', href: 'dashboard', icon: BarChart3 },
    { name: 'Knowledge Base', href: 'knowledge', icon: Database },
    { name: 'User Management', href: 'users', icon: Users },
    { name: 'Chat Sessions', href: 'chats', icon: MessageSquare },
    { name: 'System Config', href: 'settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex">
      {/* Sidebar */}
      <div className={cn(
        "bg-white/80 backdrop-blur-sm border-r border-slate-200/60 transition-all duration-300 flex flex-col shadow-xl",
        sidebarOpen ? "w-64" : "w-16"
      )}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-200/60">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-800">AI Q&A Admin</h1>
                  <p className="text-xs text-slate-500">Management Console</p>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-slate-600 hover:text-slate-800"
            >
              {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.href;
            
            return (
              <button
                key={item.name}
                onClick={() => onPageChange(item.href)}
                className={cn(
                  "w-full flex items-center space-x-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                  isActive 
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25" 
                    : "text-slate-600 hover:text-slate-800 hover:bg-slate-100/80"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-500")} />
                {sidebarOpen && <span>{item.name}</span>}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-200/60">
          {sidebarOpen ? (
            <div className="flex items-center space-x-3 px-3 py-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">SA</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">Super Admin</p>
                <p className="text-xs text-slate-500 truncate">admin@qachatbot.com</p>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center mx-auto">
              <span className="text-white text-sm font-semibold">SA</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 shadow-sm">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 capitalize">
                  {currentPage === 'dashboard' ? 'Dashboard Overview' : 
                   currentPage === 'knowledge' ? 'Knowledge Base Management' :
                   currentPage === 'users' ? 'User Management' :
                   currentPage === 'chats' ? 'Chat Sessions' : 'System Configuration'}
                </h2>
                <p className="text-slate-600 mt-1">
                  {currentPage === 'dashboard' ? 'Monitor your AI chatbot system performance' :
                   currentPage === 'knowledge' ? 'Manage documents and knowledge categories' :
                   currentPage === 'users' ? 'Manage user accounts and permissions' :
                   currentPage === 'chats' ? 'Monitor chat sessions and conversations' : 'Configure system settings and preferences'}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm" className="text-slate-600">
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
