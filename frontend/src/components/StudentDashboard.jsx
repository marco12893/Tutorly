import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../App';
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  XCircle,
  Eye,
  Plus,
  Users,
  DollarSign,
  Calendar
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('active');

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

  // Mock data for student requests
  const mockRequests = [
    {
      id: '1',
      subject: 'Mathematics',
      topic: 'Calculus Integration',
      description: 'Need help with integration by parts and u-substitution methods',
      duration_hours: 2,
      preferred_price: 150000,
      max_price: 200000,
      session_date: '2024-09-25T14:00:00',
      location: 'online',
      urgency: 'high',
      status: 'active',
      bids_count: 5,
      bids: [
        {
          id: 'bid1',
          tutor: {
            name: 'Sarah Chen',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
            rating: 4.9
          },
          offered_price: 175000,
          message: 'I have 5 years of experience teaching calculus. Can help with integration techniques.',
          status: 'pending'
        },
        {
          id: 'bid2',
          tutor: {
            name: 'Michael Rodriguez',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
            rating: 4.8
          },
          offered_price: 160000,
          message: 'Math PhD with extensive tutoring experience. Available for your session.',
          status: 'pending'
        }
      ]
    },
    {
      id: '2',
      subject: 'Physics',
      topic: 'Quantum Mechanics',
      description: 'Struggling with wave functions and uncertainty principle',
      duration_hours: 3,
      preferred_price: 200000,
      max_price: 250000,
      session_date: '2024-09-26T10:00:00',
      location: 'online',
      urgency: 'medium',
      status: 'matched',
      matched_tutor: {
        name: 'Dr. Emma Wilson',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        rating: 5.0
      },
      bids_count: 3
    },
    {
      id: '3',
      subject: 'Chemistry',
      topic: 'Organic Chemistry',
      description: 'Need help with reaction mechanisms and stereochemistry',
      duration_hours: 2,
      preferred_price: 180000,
      max_price: 220000,
      session_date: '2024-09-20T16:00:00',
      location: 'online',
      urgency: 'low',
      status: 'completed',
      matched_tutor: {
        name: 'Prof. James Park',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        rating: 4.7
      },
      final_price: 200000,
      rating_given: 5
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'matched': return 'bg-emerald-100 text-emerald-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
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

  const filteredRequests = mockRequests.filter(request => {
    if (activeTab === 'active') return request.status === 'active';
    if (activeTab === 'matched') return request.status === 'matched';
    if (activeTab === 'completed') return request.status === 'completed';
    return true;
  });

  const acceptBid = (requestId, bidId) => {
    console.log('Accepting bid:', bidId, 'for request:', requestId);
    // TODO: API call to accept bid
  };

  const rejectBid = (requestId, bidId) => {
    console.log('Rejecting bid:', bidId, 'for request:', requestId);
    // TODO: API call to reject bid
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Requests</h1>
            <p className="text-slate-600 mt-2">Manage your tutoring requests and bids</p>
          </div>
          <Link to="/create-request">
            <Button className="btn-primary flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>New Request</span>
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="card-hover">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Active Requests</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {mockRequests.filter(r => r.status === 'active').length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Bids</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {mockRequests.reduce((total, r) => total + (r.bids_count || 0), 0)}
                  </p>
                </div>
                <Users className="w-8 h-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Completed</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {mockRequests.filter(r => r.status === 'completed').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Spent</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {formatCurrency(mockRequests
                      .filter(r => r.status === 'completed')
                      .reduce((total, r) => total + (r.final_price || 0), 0)
                    )}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-slate-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'active', label: 'Active', count: mockRequests.filter(r => r.status === 'active').length },
                { id: 'matched', label: 'Matched', count: mockRequests.filter(r => r.status === 'matched').length },
                { id: 'completed', label: 'Completed', count: mockRequests.filter(r => r.status === 'completed').length }
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

        {/* Requests List */}
        <div className="space-y-6">
          {filteredRequests.map((request) => (
            <Card key={request.id} className="card-hover">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <CardTitle className="text-xl">{request.subject}</CardTitle>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                      <Badge className={getUrgencyColor(request.urgency)}>
                        {request.urgency} priority
                      </Badge>
                    </div>
                    <p className="text-lg font-medium text-slate-700 mb-1">{request.topic}</p>
                    <p className="text-slate-600 mb-3">{request.description}</p>
                    
                    <div className="flex items-center space-x-6 text-sm text-slate-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{request.duration_hours}h</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(request.session_date)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4" />
                        <span>{formatCurrency(request.preferred_price)} - {formatCurrency(request.max_price)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {request.status === 'active' && (
                      <Badge variant="outline" className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>{request.bids_count} bids</span>
                      </Badge>
                    )}
                    <Link to={`/request/${request.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>

              {/* Show bids for active requests */}
              {request.status === 'active' && request.bids && request.bids.length > 0 && (
                <CardContent className="pt-0">
                  <div className="border-t border-slate-200 pt-4">
                    <h4 className="font-medium text-slate-900 mb-3">Recent Bids</h4>
                    <div className="space-y-3">
                      {request.bids.slice(0, 2).map((bid) => (
                        <div key={bid.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={bid.tutor.avatar} />
                              <AvatarFallback>{bid.tutor.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-slate-900">{bid.tutor.name}</p>
                              <p className="text-sm text-slate-600">{bid.message}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="outline">{formatCurrency(bid.offered_price)}</Badge>
                                <div className="flex items-center space-x-1">
                                  <span className="text-xs text-slate-500">Rating:</span>
                                  <span className="text-xs font-medium">{bid.tutor.rating}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => rejectBid(request.id, bid.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => acceptBid(request.id, bid.id)}
                              className="btn-secondary"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Accept
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              )}

              {/* Show matched tutor */}
              {request.status === 'matched' && request.matched_tutor && (
                <CardContent className="pt-0">
                  <div className="border-t border-slate-200 pt-4">
                    <h4 className="font-medium text-slate-900 mb-3">Matched Tutor</h4>
                    <div className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-lg">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={request.matched_tutor.avatar} />
                        <AvatarFallback>{request.matched_tutor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{request.matched_tutor.name}</p>
                        <p className="text-sm text-emerald-600">Ready for your session</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <span className="text-xs text-slate-500">Rating:</span>
                          <span className="text-xs font-medium">{request.matched_tutor.rating}</span>
                        </div>
                      </div>
                      <Button size="sm" className="btn-primary">
                        Start Session
                      </Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}

          {filteredRequests.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  No {activeTab} requests
                </h3>
                <p className="text-slate-500 mb-4">
                  {activeTab === 'active' 
                    ? "You don't have any active requests. Create one to get started!"
                    : `You don't have any ${activeTab} requests yet.`
                  }
                </p>
                {activeTab === 'active' && (
                  <Link to="/create-request">
                    <Button className="btn-primary">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Request
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

export default StudentDashboard;