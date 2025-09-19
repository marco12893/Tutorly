import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../App';
import { toast } from 'sonner';
import { 
  Search, 
  Filter,
  Clock, 
  DollarSign, 
  Calendar, 
  MapPin,
  BookOpen,
  Send,
  Eye,
  AlertCircle
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

const BrowseRequests = () => {
  const { user } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedUrgency, setSelectedUrgency] = useState('all');
  const [maxPrice, setMaxPrice] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
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

  // Mock data for available requests
  const mockRequests = [
    {
      id: '1',
      subject: 'Mathematics',
      topic: 'Calculus Integration',
      description: 'Need help with integration by parts and u-substitution methods. I understand basic derivatives but struggling with more complex integration techniques.',
      duration_hours: 2,
      preferred_price: 150000,
      max_price: 200000,
      session_date: '2024-09-25T14:00:00',
      location: 'online',
      urgency: 'high',
      student: {
        name: 'Ahmad Rizki',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        rating: 4.7,
        completed_sessions: 8
      },
      created_at: '2024-09-24T10:00:00',
      bids_count: 5
    },
    {
      id: '2',
      subject: 'Physics',
      topic: 'Quantum Mechanics',
      description: 'Struggling with wave functions and uncertainty principle. Need someone who can explain these concepts with practical examples.',
      duration_hours: 3,
      preferred_price: 200000,
      max_price: 250000,
      session_date: '2024-09-26T10:00:00',
      location: 'online',
      urgency: 'medium',
      student: {
        name: 'Sari Indah',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        rating: 4.9,
        completed_sessions: 12
      },
      created_at: '2024-09-23T15:30:00',
      bids_count: 3
    },
    {
      id: '3',
      subject: 'Computer Science',
      topic: 'Data Structures & Algorithms',
      description: 'Need help with binary trees, graph algorithms, and dynamic programming. Preparing for coding interviews.',
      duration_hours: 4,
      preferred_price: 300000,
      max_price: 400000,
      session_date: '2024-09-27T09:00:00',
      location: 'online',
      urgency: 'high',
      student: {
        name: 'Budi Santoso',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        rating: 4.5,
        completed_sessions: 6
      },
      created_at: '2024-09-23T12:00:00',
      bids_count: 8
    },
    {
      id: '4',
      subject: 'Chemistry',
      topic: 'Organic Chemistry Reactions',
      description: 'Need comprehensive help with reaction mechanisms, stereochemistry, and synthesis pathways.',
      duration_hours: 2,
      preferred_price: 180000,
      max_price: 220000,
      session_date: '2024-09-28T16:00:00',
      location: 'online',
      urgency: 'low',
      student: {
        name: 'Lisa Chen',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        rating: 4.8,
        completed_sessions: 15
      },
      created_at: '2024-09-22T14:20:00',
      bids_count: 2
    },
    {
      id: '5',
      subject: 'English',
      topic: 'Academic Writing',
      description: 'Need help with essay structure, academic writing style, and grammar improvement for university applications.',
      duration_hours: 2,
      preferred_price: 120000,
      max_price: 160000,
      session_date: '2024-09-29T13:00:00',
      location: 'online',
      urgency: 'medium',
      student: {
        name: 'Maya Putri',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
        rating: 4.6,
        completed_sessions: 4
      },
      created_at: '2024-09-22T09:15:00',
      bids_count: 4
    }
  ];

  const subjects = ['all', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'English', 'Indonesian'];

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimeUntilSession = (sessionDate) => {
    const now = new Date();
    const session = new Date(sessionDate);
    const diffInHours = (session - now) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h`;
    } else {
      return `${Math.floor(diffInHours / 24)}d`;
    }
  };

  // Filter requests
  const filteredRequests = mockRequests.filter(request => {
    const matchesSearch = searchQuery === '' || 
      request.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSubject = selectedSubject === 'all' || request.subject === selectedSubject;
    const matchesUrgency = selectedUrgency === 'all' || request.urgency === selectedUrgency;
    const matchesPrice = maxPrice === '' || request.max_price <= parseInt(maxPrice);
    
    return matchesSearch && matchesSubject && matchesUrgency && matchesPrice;
  });

  const openBidDialog = (request) => {
    setSelectedRequest(request);
    setBidForm({
      offered_price: request.preferred_price.toString(),
      message: '',
      estimated_duration: request.duration_hours
    });
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
      // TODO: API call to submit bid
      console.log('Submitting bid:', {
        request_id: selectedRequest.id,
        offered_price: parseInt(bidForm.offered_price),
        message: bidForm.message,
        estimated_duration: bidForm.estimated_duration
      });
      
      // Mock success
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Bid submitted successfully!');
      setSelectedRequest(null);
      setBidForm({ offered_price: '', message: '', estimated_duration: 1 });
      
    } catch (error) {
      console.error('Error submitting bid:', error);
      toast.error('Failed to submit bid. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Browse Requests</h1>
            <p className="text-slate-600 mt-2">Find tutoring opportunities that match your expertise</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-slate-600">
              {filteredRequests.length} request{filteredRequests.length !== 1 ? 's' : ''} available
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search by subject, topic, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Quick Filters */}
              <div className="flex items-center space-x-4">
                <Button
                  variant={showFilters ? "default" : "outline"}
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                </Button>
                
                {(selectedSubject !== 'all' || selectedUrgency !== 'all' || maxPrice) && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSelectedSubject('all');
                      setSelectedUrgency('all');
                      setMaxPrice('');
                    }}
                    className="text-slate-600"
                  >
                    Clear filters
                  </Button>
                )}
              </div>

              {/* Expanded Filters */}
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-200">
                  <div>
                    <Label htmlFor="subject-filter">Subject</Label>
                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject === 'all' ? 'All Subjects' : subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="urgency-filter">Urgency</Label>
                    <Select value={selectedUrgency} onValueChange={setSelectedUrgency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Urgency Levels</SelectItem>
                        <SelectItem value="high">High Priority</SelectItem>
                        <SelectItem value="medium">Medium Priority</SelectItem>
                        <SelectItem value="low">Low Priority</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="price-filter">Max Budget (IDR)</Label>
                    <Input
                      id="price-filter"
                      type="number"
                      placeholder="e.g., 200000"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      min="50000"
                      step="25000"
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Requests List */}
        <div className="space-y-6">
          {filteredRequests.map((request) => (
            <Card key={request.id} className="card-hover">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <CardTitle className="text-xl">{request.subject}</CardTitle>
                      <Badge className={getUrgencyColor(request.urgency)}>
                        {request.urgency} priority
                      </Badge>
                      <Badge variant="outline" className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{getTimeUntilSession(request.session_date)}</span>
                      </Badge>
                    </div>
                    
                    <p className="text-lg font-medium text-slate-700 mb-1">{request.topic}</p>
                    <p className="text-slate-600 mb-4 line-clamp-2">{request.description}</p>
                    
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
                        <MapPin className="w-4 h-4" />
                        <span className="capitalize">{request.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4" />
                        <span>{formatCurrency(request.preferred_price)} - {formatCurrency(request.max_price)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-slate-600">
                      {request.bids_count} bid{request.bids_count !== 1 ? 's' : ''}
                    </Badge>
                    <Link to={`/request/${request.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </Link>
                    <Button
                      onClick={() => openBidDialog(request)}
                      className="btn-primary"
                      size="sm"
                    >
                      <Send className="w-4 h-4 mr-1" />
                      Submit Bid
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="border-t border-slate-200 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={request.student.avatar} />
                        <AvatarFallback>{request.student.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-slate-900">{request.student.name}</p>
                        <div className="flex items-center space-x-2 text-xs text-slate-500">
                          <span>Rating: {request.student.rating}</span>
                          <span>•</span>
                          <span>{request.student.completed_sessions} sessions completed</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right text-sm text-slate-500">
                      Posted {new Date(request.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredRequests.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  No requests found
                </h3>
                <p className="text-slate-500 mb-4">
                  Try adjusting your search terms or filters to find more opportunities.
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedSubject('all');
                    setSelectedUrgency('all');
                    setMaxPrice('');
                  }}
                  variant="outline"
                >
                  Clear all filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Bid Submission Dialog */}
        <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Submit Your Bid</DialogTitle>
            </DialogHeader>
            
            {selectedRequest && (
              <div className="space-y-4">
                {/* Request Summary */}
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-medium text-slate-900">{selectedRequest.subject}</h4>
                  <p className="text-sm text-slate-600">{selectedRequest.topic}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500">
                    <span>{selectedRequest.duration_hours}h</span>
                    <span>{formatCurrency(selectedRequest.preferred_price)} - {formatCurrency(selectedRequest.max_price)}</span>
                  </div>
                </div>

                {/* Bid Form */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="bid-price">Your Offer (IDR) *</Label>
                    <Input
                      id="bid-price"
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
                    <Label htmlFor="estimated-duration">Estimated Duration (hours)</Label>
                    <Select
                      value={bidForm.estimated_duration.toString()}
                      onValueChange={(value) => setBidForm(prev => ({ ...prev, estimated_duration: parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6].map((hour) => (
                          <SelectItem key={hour} value={hour.toString()}>
                            {hour} {hour === 1 ? 'hour' : 'hours'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="bid-message">Your Message *</Label>
                    <Textarea
                      id="bid-message"
                      placeholder="Explain your qualifications, experience, and how you can help the student..."
                      rows={4}
                      value={bidForm.message}
                      onChange={(e) => setBidForm(prev => ({ ...prev, message: e.target.value }))}
                    />
                    <p className="text-sm text-slate-500 mt-1">
                      {bidForm.message.length}/500 characters
                    </p>
                  </div>

                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-yellow-800">
                        Make your bid stand out by highlighting your relevant experience and explaining how you'll help the student succeed.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-3 pt-4">
                  <Button
                    onClick={() => setSelectedRequest(null)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={submitBid}
                    disabled={loading}
                    className="btn-primary flex-1"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Submitting...</span>
                      </div>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-1" />
                        Submit Bid
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default BrowseRequests;