
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  UserPlus, 
  Search, 
  Filter,
  MoreHorizontal,
  Mail,
  Calendar,
  Shield,
  Activity,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');

  const userStats = [
    { label: 'Total Users', value: '2,847', color: 'bg-blue-500' },
    { label: 'Active Today', value: '1,234', color: 'bg-emerald-500' },
    { label: 'Super Admins', value: '3', color: 'bg-purple-500' },
    { label: 'Admins', value: '12', color: 'bg-orange-500' },
  ];

  const roleFilters = [
    { id: 'all', name: 'All Roles', count: 2847 },
    { id: 'super_admin', name: 'Super Admin', count: 3 },
    { id: 'admin', name: 'Admin', count: 12 },
    { id: 'user', name: 'End User', count: 2832 },
  ];

  const users = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'super_admin',
      status: 'active',
      lastLogin: '2024-05-24T10:30:00',
      joinDate: '2024-01-15',
      chatSessions: 145,
      avatar: 'JD'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2024-05-24T09:15:00',
      joinDate: '2024-02-20',
      chatSessions: 89,
      avatar: 'SJ'
    },
    {
      id: 3,
      name: 'Mike Chen',
      email: 'mike.chen@example.com',
      role: 'user',
      status: 'active',
      lastLogin: '2024-05-24T08:45:00',
      joinDate: '2024-03-10',
      chatSessions: 234,
      avatar: 'MC'
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily.davis@example.com',
      role: 'user',
      status: 'inactive',
      lastLogin: '2024-05-20T14:22:00',
      joinDate: '2024-04-05',
      chatSessions: 56,
      avatar: 'ED'
    },
    {
      id: 5,
      name: 'Alex Thompson',
      email: 'alex.thompson@example.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2024-05-24T07:30:00',
      joinDate: '2024-01-30',
      chatSessions: 178,
      avatar: 'AT'
    }
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'admin': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'user': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
      : 'bg-red-100 text-red-700 border-red-200';
  };

  const formatLastLogin = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-8">
      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {userStats.map((stat, index) => (
          <Card key={index} className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-800 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-xl`}>
                  <Shield className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Role Filters Sidebar */}
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-slate-800">
              <span>Filter by Role</span>
              <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600">
                <UserPlus className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {roleFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedRole(filter.id)}
                  className={cn(
                    "w-full flex items-center justify-between p-3 rounded-lg text-left transition-all duration-200",
                    selectedRole === filter.id
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                      : "hover:bg-slate-100/80 text-slate-700"
                  )}
                >
                  <span className="text-sm font-medium">{filter.name}</span>
                  <Badge variant="secondary" className={cn(
                    "text-xs",
                    selectedRole === filter.id ? "bg-white/20 text-white" : ""
                  )}>
                    {filter.count}
                  </Badge>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search and Actions */}
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/80"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" className="flex items-center">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Users Grid */}
          <div className="grid gap-4">
            {users.map((user) => (
              <Card key={user.id} className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">{user.avatar}</span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-slate-800">{user.name}</h3>
                          <Badge className={getRoleColor(user.role)}>
                            {user.role.replace('_', ' ')}
                          </Badge>
                          <Badge className={getStatusColor(user.status)}>
                            {user.status}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-6 text-sm text-slate-600">
                          <span className="flex items-center">
                            <Mail className="w-4 h-4 mr-1" />
                            {user.email}
                          </span>
                          <span className="flex items-center">
                            <Activity className="w-4 h-4 mr-1" />
                            Last: {formatLastLogin(user.lastLogin)}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Joined: {user.joinDate}
                          </span>
                        </div>
                        
                        <div className="mt-2">
                          <span className="text-sm text-slate-500">
                            {user.chatSessions} chat sessions
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">Previous</Button>
              <Button size="sm" className="bg-blue-500 text-white">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
