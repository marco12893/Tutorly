import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { toast } from 'sonner';
import { 
  ArrowLeft,
  Clock, 
  Calendar, 
  MapPin,
  DollarSign,
  User,
  Star,
  Send,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const RequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [bidForm, setBidForm] = useState({
    offered_price: '',
    message: '',
    estimated_duration: 1
  });
  const [loading, setLoading] = useState(false);

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

  // Mock request data (in real app, this would be fetched from API)
  const mockRequest = {
    id: id,
    subject: 'Mathematics',
    topic: 'Calculus Integration',
    description: 'I am struggling with integration by parts and u-substitution methods. I understand basic derivatives but I am having trouble with more complex integration techniques. I need someone who can explain the step-by-step process and provide practice problems. My current level is first-year university calculus, and I have an exam coming up next week.',
    duration_hours: 2,
    preferred_price: 150000,
    max_price: 200000,
    session_date: '2024-09-25T14:00:00',
    location: 'online',
    urgency: 'high',
    status: 'active',
    student: {
      id: 'student-1',
      name: 'Ahmad Rizki',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      rating: 4.7,
      completed_sessions: 8,
      bio: 'First-year Engineering student at ITB. Always eager to learn and improve my understanding of complex topics.',
      joined_date: '2024-01-15'
    },
    created_at: '2024-09-24T10:00:00',
    bids: [
      {
        id: 'bid1',
        tutor: {
          id: 'tutor-1',
          name: 'Sarah Chen',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
          rating: 4.9,
          completed_sessions: 25,
          subjects: ['Mathematics', 'Physics'],
          bio: 'Mathematics PhD with 5 years of tutoring experience. Specialized in calculus and linear algebra.'
        },
        offered_price: 175000,
        message: 'I have 5 years of experience teaching calculus to university students. I can help you master integration techniques with clear explanations and practice problems. I use visual aids and step-by-step breakdowns to make complex concepts easy to understand.',
        estimated_duration: 2,
        status: 'pending',
        created_at: '2024-09-24T11:30:00'
      },
      {
        id: 'bid2',
        tutor: {
          id: 'tutor-2',
          name: 'Michael Rodriguez',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          rating: 4.8,
          completed_sessions: 18,
          subjects: ['Mathematics', 'Statistics'],
          bio: 'Former university lecturer with extensive online tutoring experience. Patient and methodical teaching approach.'
        },
        offered_price: 160000,
        message: 'I can help you with integration techniques. As a former university lecturer, I understand the common difficulties students face with calculus. I will provide personalized practice problems and ensure you are ready for your exam.',
        estimated_duration: 2,
        status: 'pending',
        created_at: '2024-09-24T13:15:00'
      },
      {
        id: 'bid3',
        tutor: {
          id: 'tutor-3',
          name: 'Dr. Emma Wilson',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
          rating: 5.0,
          completed_sessions: 32,
          subjects: ['Mathematics', 'Physics', 'Engineering'],
          bio: 'PhD in Applied Mathematics. Expert in calculus, differential equations, and mathematical modeling.'
        },
        offered_price: 190000,
        message: 'I specialize in helping students master calculus concepts. With my PhD background and extensive tutoring experience, I can provide comprehensive support for integration techniques and exam preparation.',
        estimated_duration: 2.5,
        status: 'pending',
        created_at: '2024-09-24T14:45:00'
      }
    ]
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'matched': return 'bg-emerald-100 text-emerald-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const canBid = () => {
    return user.currentRole === 'tutor' && 
           mockRequest.status === 'active' && 
           !mockRequest.bids.some(bid => bid.tutor.id === user.id);
  };

  const canManageBids = () => {
    return user.currentRole === 'student' && 
           mockRequest.student.id === user.id && 
           mockRequest.status === 'active';
  };

  const submitBid = async () => {
    if (!bidForm.message.trim()) {
      toast.error('Please add a message to your bid');
      return;
    }

    if (!bidForm.offered_price || bidForm.offered_price < 50000) {
      toast.error('Please enter a valid price (minimum Rp 50,000)');
      return;
    }

    setLoading(true);

    try {
      console.log('Submitting bid:', {
        request_id: mockRequest.id,
        offered_price: parseInt(bidForm.offered_price),
        message: bidForm.message,
        estimated_duration: bidForm.estimated_duration
      });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Bid submitted successfully!');
      setBidForm({ offered_price: '', message: '', estimated_duration: 1 });
      
    } catch (error) {
      console.error('Error submitting bid:', error);
      toast.error('Failed to submit bid. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const acceptBid = (bidId) => {
    console.log('Accepting bid:', bidId);
    toast.success('Bid accepted! Session has been scheduled.');
  };

  const rejectBid = (bidId) => {
    console.log('Rejecting bid:', bidId);
    toast.success('Bid rejected.');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Request Details</h1>
            <p className="text-slate-600 mt-1">View complete information about this tutoring request</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Request Info */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <CardTitle className="text-2xl">{mockRequest.subject}</CardTitle>
                      <Badge className={getStatusColor(mockRequest.status)}>
                        {mockRequest.status}
                      </Badge>
                    </div>
                    <p className="text-xl font-medium text-slate-700 mb-2">{mockRequest.topic}</p>
                  </div>
                  <Badge className={getUrgencyColor(mockRequest.urgency)}>
                    {mockRequest.urgency} priority
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium text-slate-900 mb-2">Description</h3>
                  <p className="text-slate-700 leading-relaxed">{mockRequest.description}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2 text-slate-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{mockRequest.duration_hours}h session</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{formatDate(mockRequest.session_date)}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm capitalize">{mockRequest.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-600">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm">{formatCurrency(mockRequest.preferred_price)} - {formatCurrency(mockRequest.max_price)}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-sm text-slate-600">
                    Posted on {formatDate(mockRequest.created_at)} • {mockRequest.bids.length} bid{mockRequest.bids.length !== 1 ? 's' : ''} received
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Student Info */}
            <Card>
              <CardHeader>
                <CardTitle>Student Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={mockRequest.student.avatar} />
                    <AvatarFallback className="text-xl">{mockRequest.student.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-slate-900">{mockRequest.student.name}</h3>
                    <div className="flex items-center space-x-4 mb-2">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{mockRequest.student.rating}</span>
                      </div>
                      <span className="text-sm text-slate-500">{mockRequest.student.completed_sessions} sessions completed</span>
                      <span className="text-sm text-slate-500">Member since {formatDate(mockRequest.student.joined_date)}</span>
                    </div>
                    <p className="text-slate-600 text-sm">{mockRequest.student.bio}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bids Section */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Received Bids ({mockRequest.bids.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockRequest.bids.map((bid) => (
                  <div key={bid.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={bid.tutor.avatar} />
                          <AvatarFallback>{bid.tutor.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium text-slate-900">{bid.tutor.name}</h4>
                          <div className="flex items-center space-x-3 text-sm text-slate-500">
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <span>{bid.tutor.rating}</span>
                            </div>
                            <span>{bid.tutor.completed_sessions} sessions</span>
                            <span>{bid.tutor.subjects.join(', ')}</span>
                          </div>
                          <p className="text-sm text-slate-600 mt-1">{bid.tutor.bio}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-lg font-bold text-slate-900">{formatCurrency(bid.offered_price)}</p>
                        <p className="text-sm text-slate-500">{bid.estimated_duration}h estimated</p>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-lg mb-3">
                      <p className="text-sm text-slate-700">{bid.message}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-xs text-slate-500">
                        Submitted {formatDate(bid.created_at)}
                      </p>
                      
                      {canManageBids() && bid.status === 'pending' && (
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => rejectBid(bid.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => acceptBid(bid.id)}
                            className="btn-secondary"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Accept
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {mockRequest.bids.length === 0 && (
                  <div className="text-center py-8">
                    <User className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-500">No bids received yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            {canBid() && (
              <Card>
                <CardHeader>
                  <CardTitle>Submit Your Bid</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="offer-price">Your Offer (IDR)</Label>
                    <Input
                      id="offer-price"
                      type="number"
                      placeholder="Enter your price"
                      value={bidForm.offered_price}
                      onChange={(e) => setBidForm(prev => ({ ...prev, offered_price: e.target.value }))}
                      min="50000"
                      step="25000"
                    />
                    {bidForm.offered_price && (
                      <p className="text-sm text-slate-500 mt-1">
                        {formatCurrency(parseFloat(bidForm.offered_price) || 0)}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="duration">Estimated Duration (hours)</Label>
                    <Select
                      value={bidForm.estimated_duration.toString()}
                      onValueChange={(value) => setBidForm(prev => ({ ...prev, estimated_duration: parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6].map((hour) => (
                          <SelectItem key={hour} value={hour.toString()}>
                            {hour} {hour === 1 ? 'hour' : 'hours'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="bid-message">Your Message</Label>
                    <Textarea
                      id="bid-message"
                      placeholder="Explain your qualifications and how you can help..."
                      rows={4}
                      value={bidForm.message}
                      onChange={(e) => setBidForm(prev => ({ ...prev, message: e.target.value }))}
                    />
                  </div>

                  <Button
                    onClick={submitBid}
                    disabled={loading}
                    className="w-full btn-primary"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Submitting...</span>
                      </div>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit Bid
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Request Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Request Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Subject:</span>
                  <span className="text-sm font-medium">{mockRequest.subject}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Duration:</span>
                  <span className="text-sm font-medium">{mockRequest.duration_hours}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Location:</span>
                  <span className="text-sm font-medium capitalize">{mockRequest.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Budget:</span>
                  <span className="text-sm font-medium">
                    {formatCurrency(mockRequest.preferred_price)} - {formatCurrency(mockRequest.max_price)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Priority:</span>
                  <Badge className={getUrgencyColor(mockRequest.urgency)}>
                    {mockRequest.urgency}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Tips for Tutors */}
            {user.currentRole === 'tutor' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5" />
                    <span>Bidding Tips</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-slate-600 space-y-2">
                    <p>• Highlight your relevant experience and qualifications</p>
                    <p>• Explain your teaching methodology</p>
                    <p>• Be responsive and professional</p>
                    <p>• Offer competitive pricing within the budget range</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetails;