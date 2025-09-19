import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../App';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle,
  Eye,
  Search,
  DollarSign,
  Calendar,
  TrendingUp,
  Award
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';

const TutorDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('pending');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Mock data for tutor bids
  const mockBids = [
    {
      id: 'bid1',
      request: {
        id: 'req1',
        subject: 'Mathematics',
        topic: 'Calculus Integration',
        description: 'Need help with integration by parts and u-substitution methods',
        duration_hours: 2,
        preferred_price: 150000,
        max_price: 200000,
        session_date: '2024-09-25T14:00:00',
        location: 'online',
        urgency: 'high',
        student: {
          name: 'Ahmad Rizki',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          rating: 4.7
        }
      },
      offered_price: 175000,
      message: 'I have 5 years of experience teaching calculus. Can help with integration techniques and provide practice problems.',
      estimated_duration: 2,
      status: 'pending',
      created_at: '2024-09-24T10:00:00'
    },
    {
      id: 'bid2',
      request: {
        id: 'req2',
        subject: 'Physics',
        topic: 'Quantum Mechanics',
        description: 'Struggling with wave functions and uncertainty principle',
        duration_hours: 3,
        preferred_price: 200000,
        max_price: 250000,
        session_date: '2024-09-26T10:00:00',
        location: 'online',
        urgency: 'medium',
        student: {
          name: 'Sari Indah',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
          rating: 4.9
        }
      },
      offered_price: 225000,
      message: 'Physics PhD with specialization in quantum mechanics. Can explain complex concepts clearly.',
      estimated_duration: 3,
      status: 'accepted',
      created_at: '2024-09-23T15:30:00',
      session_scheduled: true
    },
    {
      id: 'bid3',
      request: {
        id: 'req3',
        subject: 'Chemistry',
        topic: 'Organic Chemistry',
        description: 'Need help with reaction mechanisms',
        duration_hours: 2,
        preferred_price: 180000,
        max_price: 220000,
        session_date: '2024-09-20T16:00:00',
        location: 'online',
        urgency: 'low',
        student: {
          name: 'Budi Santoso',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          rating: 4.5
        }
      },
      offered_price: 200000,
      message: 'Experienced chemistry tutor with focus on organic mechanisms.',
      estimated_duration: 2,
      status: 'rejected',
      created_at: '2024-09-19T12:00:00',
      rejection_reason: 'Student selected another tutor'
    },
    {
      id: 'bid4',
      request: {
        id: 'req4',
        subject: 'Computer Science',
        topic: 'Data Structures',
        description: 'Help with linked lists and binary trees',
        duration_hours: 2,
        preferred_price: 160000,
        max_price: 200000,
        session_date: '2024-09-18T14:00:00',
        location: 'online',
        urgency: 'medium',
        student: {
          name: 'Lisa Chen',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
          rating: 4.8
        }
      },
      offered_price: 180000,
      message: 'Software engineer and CS tutor. Great at explaining algorithms.',
      estimated_duration: 2,
      status: 'completed',
      created_at: '2024-09-17T09:00:00',
      completed_at: '2024-09-18T16:00:00',
      final_price: 180000,
      student_rating: 5
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-emerald-100 text-emerald-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredBids = mockBids.filter(bid => {
    if (activeTab === 'pending') return bid.status === 'pending';
    if (activeTab === 'accepted') return bid.status === 'accepted';
    if (activeTab === 'completed') return bid.status === 'completed';
    return true;
  });

  // Mock stats
  const tutorStats = {
    activeBids: mockBids.filter(b => b.status === 'pending').length,
    acceptedBids: mockBids.filter(b => b.status === 'accepted').length,
    completedSessions: mockBids.filter(b => b.status === 'completed').length,
    totalEarnings: mockBids
      .filter(b => b.status === 'completed')
      .reduce((total, b) => total + (b.final_price || 0), 0),
    averageRating: 4.9
  };

  const withdrawBid = (bidId) => {
    console.log('Withdrawing bid:', bidId);
    // TODO: API call to withdraw bid
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Bids</h1>
            <p className="text-slate-600 mt-2">Manage your tutoring bids and sessions</p>
          </div>
          <Link to="/browse-requests">
            <Button className="btn-primary flex items-center space-x-2">
              <Search className="w-4 h-4" />
              <span>Browse Requests</span>
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="card-hover">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Active Bids</p>
                  <p className="text-2xl font-bold text-slate-900">{tutorStats.activeBids}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Accepted</p>
                  <p className="text-2xl font-bold text-slate-900">{tutorStats.acceptedBids}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Completed</p>
                  <p className="text-2xl font-bold text-slate-900">{tutorStats.completedSessions}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Earned</p>
                  <p className="text-lg font-bold text-slate-900">
                    {formatCurrency(tutorStats.totalEarnings)}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Rating</p>
                  <div className="flex items-center space-x-1">
                    <p className="text-2xl font-bold text-slate-900">{tutorStats.averageRating}</p>
                    <Award className="w-5 h-5 text-yellow-400 fill-current" />
                  </div>
                </div>
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-slate-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'pending', label: 'Pending', count: mockBids.filter(b => b.status === 'pending').length },
                { id: 'accepted', label: 'Accepted', count: mockBids.filter(b => b.status === 'accepted').length },
                { id: 'completed', label: 'Completed', count: mockBids.filter(b => b.status === 'completed').length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span>{tab.label}</span>
                  <Badge variant="secondary" className="ml-2">{tab.count}</Badge>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Bids List */}
        <div className="space-y-6">
          {filteredBids.map((bid) => (
            <Card key={bid.id} className="card-hover">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <CardTitle className="text-xl">{bid.request.subject}</CardTitle>
                      <Badge className={getStatusColor(bid.status)}>
                        {bid.status}
                      </Badge>
                      <Badge className={getUrgencyColor(bid.request.urgency)}>
                        {bid.request.urgency} priority
                      </Badge>
                    </div>
                    
                    <p className="text-lg font-medium text-slate-700 mb-1">{bid.request.topic}</p>
                    <p className="text-slate-600 mb-3">{bid.request.description}</p>
                    
                    <div className="flex items-center space-x-6 text-sm text-slate-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{bid.request.duration_hours}h</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(bid.request.session_date)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4" />
                        <span>My bid: {formatCurrency(bid.offered_price)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Link to={`/request/${bid.request.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </Link>
                    {bid.status === 'pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => withdrawBid(bid.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Withdraw
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="border-t border-slate-200 pt-4">
                  {/* Student Info */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={bid.request.student.avatar} />
                        <AvatarFallback>{bid.request.student.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-slate-900">{bid.request.student.name}</p>
                        <div className="flex items-center space-x-1">
                          <span className="text-xs text-slate-500">Student rating:</span>
                          <span className="text-xs font-medium">{bid.request.student.rating}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm text-slate-600">Student's budget</p>
                      <p className="font-medium">
                        {formatCurrency(bid.request.preferred_price)} - {formatCurrency(bid.request.max_price)}
                      </p>
                    </div>
                  </div>

                  {/* My Bid Message */}
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="font-medium text-slate-900 mb-2">My Proposal</h4>
                    <p className="text-slate-700 text-sm mb-2">{bid.message}</p>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="font-medium">Price: {formatCurrency(bid.offered_price)}</span>
                      <span>Duration: {bid.estimated_duration}h</span>
                      <span className="text-slate-500">
                        Submitted {new Date(bid.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Status-specific content */}
                  {bid.status === 'accepted' && bid.session_scheduled && (
                    <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-emerald-900">Session Confirmed!</p>
                          <p className="text-sm text-emerald-700">
                            Scheduled for {formatDate(bid.request.session_date)}
                          </p>
                        </div>
                        <Button size="sm" className="btn-secondary">
                          Join Session
                        </Button>
                      </div>
                    </div>
                  )}

                  {bid.status === 'rejected' && bid.rejection_reason && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="font-medium text-red-900">Bid Not Selected</p>
                      <p className="text-sm text-red-700">{bid.rejection_reason}</p>
                    </div>
                  )}

                  {bid.status === 'completed' && (
                    <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Session Completed</p>
                          <p className="text-sm text-gray-700">
                            Completed on {new Date(bid.completed_at).toLocaleDateString()}
                          </p>
                          <p className="text-sm">
                            Final payment: {formatCurrency(bid.final_price)}
                          </p>
                        </div>
                        {bid.student_rating && (
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Student rating</p>
                            <div className="flex items-center space-x-1">
                              <span className="font-medium">{bid.student_rating}</span>
                              <Award className="w-4 h-4 text-yellow-400 fill-current" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredBids.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  No {activeTab} bids
                </h3>
                <p className="text-slate-500 mb-4">
                  {activeTab === 'pending' 
                    ? "You don't have any pending bids. Browse requests to find new opportunities!"
                    : `You don't have any ${activeTab} bids yet.`
                  }
                </p>
                {activeTab === 'pending' && (
                  <Link to="/browse-requests">
                    <Button className="btn-primary">
                      <Search className="w-4 h-4 mr-2" />
                      Browse Requests
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;