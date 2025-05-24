
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  FileText, 
  MessageSquare, 
  TrendingUp, 
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

const DashboardOverview = () => {
  const stats = [
    {
      title: 'Total Users',
      value: '2,847',
      change: '+12.3%',
      trend: 'up',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Knowledge Base Docs',
      value: '1,234',
      change: '+5.2%',
      trend: 'up',
      icon: FileText,
      color: 'bg-emerald-500'
    },
    {
      title: 'Chat Sessions Today',
      value: '456',
      change: '+8.1%',
      trend: 'up',
      icon: MessageSquare,
      color: 'bg-purple-500'
    },
    {
      title: 'Avg Response Time',
      value: '1.2s',
      change: '-15.5%',
      trend: 'down',
      icon: Clock,
      color: 'bg-orange-500'
    }
  ];

  const recentActivity = [
    { action: 'New document uploaded', user: 'Admin User', time: '2 minutes ago', status: 'success' },
    { action: 'User John Doe created', user: 'Super Admin', time: '5 minutes ago', status: 'success' },
    { action: 'Knowledge base updated', user: 'Admin User', time: '10 minutes ago', status: 'success' },
    { action: 'Chat session started', user: 'User Alice Smith', time: '15 minutes ago', status: 'info' },
    { action: 'Document processing failed', user: 'System', time: '20 minutes ago', status: 'error' },
  ];

  const systemHealth = [
    { service: 'AI Chat Service', status: 'healthy', uptime: '99.9%' },
    { service: 'Vector Database', status: 'healthy', uptime: '99.8%' },
    { service: 'File Processing', status: 'degraded', uptime: '97.2%' },
    { service: 'Authentication', status: 'healthy', uptime: '100%' },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-slate-800 mt-2">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className={`w-4 h-4 mr-1 ${stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`} />
                      <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                        {stat.change}
                      </span>
                      <span className="text-sm text-slate-500 ml-1">vs last month</span>
                    </div>
                  </div>
                  <div className={`${stat.color} p-3 rounded-xl`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-slate-800">
              <Activity className="w-5 h-5 mr-2 text-blue-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50/50">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.status === 'success' ? 'bg-emerald-500' :
                      activity.status === 'error' ? 'bg-red-500' : 'bg-blue-500'
                    }`} />
                    <div>
                      <p className="text-sm font-medium text-slate-800">{activity.action}</p>
                      <p className="text-xs text-slate-500">by {activity.user}</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500">{activity.time}</span>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Activity
            </Button>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-slate-800">
              <CheckCircle className="w-5 h-5 mr-2 text-emerald-500" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemHealth.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50/50">
                  <div className="flex items-center space-x-3">
                    {service.status === 'healthy' ? (
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-orange-500" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-slate-800">{service.service}</p>
                      <p className="text-xs text-slate-500">Uptime: {service.uptime}</p>
                    </div>
                  </div>
                  <Badge variant={service.status === 'healthy' ? 'default' : 'secondary'}>
                    {service.status}
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View System Logs
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-slate-800">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white h-16">
              <div className="flex flex-col items-center">
                <FileText className="w-5 h-5 mb-1" />
                <span>Upload Documents</span>
              </div>
            </Button>
            <Button variant="outline" className="h-16 border-blue-200 hover:bg-blue-50">
              <div className="flex flex-col items-center">
                <Users className="w-5 h-5 mb-1 text-blue-600" />
                <span>Add New User</span>
              </div>
            </Button>
            <Button variant="outline" className="h-16 border-purple-200 hover:bg-purple-50">
              <div className="flex flex-col items-center">
                <MessageSquare className="w-5 h-5 mb-1 text-purple-600" />
                <span>Monitor Chats</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
