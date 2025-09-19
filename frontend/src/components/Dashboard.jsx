import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../App';
import { 
  BookOpen, 
  Users, 
  Star, 
  TrendingUp,
  Plus,
  Search,
  Wallet,
  Award,
  Clock,
  CheckCircle
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Mock data for dashboard
  const dashboardStats = {
    student: {
      activeRequests: 3,
      completedSessions: 12,
      totalSpent: 1200000,
      averageRating: 4.8
    },
    tutor: {
      activeBids: 5,
      completedSessions: 8,
      totalEarned: 800000,
      averageRating: 4.9
    }
  };

  const recentActivity = [
    {
      id: 1,
      type: 'request_accepted',
      title: 'Mathematics tutoring request accepted',
      description: 'Sarah accepted your calculus help request',
      time: '2 hours ago',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 2,
      type: 'session_completed',
      title: 'Physics session completed',
      description: 'Successfully completed 2-hour physics session',
      time: '1 day ago',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 3,
      type: 'new_bid',
      title: 'New bid received',
      description: 'Alex submitted a bid for your chemistry request',
      time: '2 days ago',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    }
  ];

  const quickActions = user.currentRole === 'student' 
    ? [
        {
          title: 'Create New Request',
          description: 'Post a new tutoring request',
          icon: Plus,
          path: '/create-request',
          color: 'bg-blue-500 hover:bg-blue-600'
        },
        {
          title: 'My Requests',
          description: 'View and manage your requests',
          icon: BookOpen,
          path: '/student',
          color: 'bg-emerald-500 hover:bg-emerald-600'
        },
        {
          title: 'Wallet',
          description: 'Manage your wallet balance',
          icon: Wallet,
          path: '/wallet',
          color: 'bg-purple-500 hover:bg-purple-600'
        }
      ]
    : [
        {
          title: 'Browse Requests',
          description: 'Find new tutoring opportunities',
          icon: Search,
          path: '/browse-requests',
          color: 'bg-blue-500 hover:bg-blue-600'
        },
        {
          title: 'My Bids',
          description: 'View and manage your bids',
          icon: Users,
          path: '/tutor',
          color: 'bg-emerald-500 hover:bg-emerald-600'
        },
        {
          title: 'Earnings',
          description: 'Check your earnings',
          icon: TrendingUp,
          path: '/wallet',
          color: 'bg-purple-500 hover:bg-purple-600'
        }
      ];

  const currentStats = dashboardStats[user.currentRole];

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center space-x-4 mb-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-xl">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Welcome back, {user.name}!
              </h1>
              <p className="text-slate-600 flex items-center space-x-2">
                <span>Acting as</span>
                <Badge variant={user.currentRole === 'student' ? 'default' : 'secondary'} className="capitalize">
                  {user.currentRole}
                </Badge>
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    {user.currentRole === 'student' ? 'Active Requests' : 'Active Bids'}
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    {user.currentRole === 'student' ? currentStats.activeRequests : currentStats.activeBids}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Completed Sessions</p>
                  <p className="text-2xl font-bold text-slate-900">{currentStats.completedSessions}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    {user.currentRole === 'student' ? 'Total Spent' : 'Total Earned'}
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    {formatCurrency(user.currentRole === 'student' ? currentStats.totalSpent : currentStats.totalEarned)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Average Rating</p>
                  <div className="flex items-center space-x-1">
                    <p className="text-2xl font-bold text-slate-900">{currentStats.averageRating}</p>
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  </div>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card className="animate-slide-in">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {quickActions.map((action, index) => (
                    <Link
                      key={index}
                      to={action.path}
                      className="group block"
                    >
                      <div className={`${action.color} text-white p-6 rounded-xl transition-all duration-200 group-hover:scale-105 group-hover:shadow-lg`}>
                        <action.icon className="w-8 h-8 mb-3" />
                        <h3 className="font-semibold text-lg mb-1">{action.title}</h3>
                        <p className="text-sm opacity-90">{action.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card className="animate-slide-in">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarImage src={activity.avatar} />
                      <AvatarFallback>?</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">{activity.title}</p>
                      <p className="text-sm text-slate-500">{activity.description}</p>
                      <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
                
                <div className="pt-4 border-t border-slate-200">
                  <Link
                    to="/profile"
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View all activity →
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;