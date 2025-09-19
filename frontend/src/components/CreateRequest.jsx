import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { toast } from 'sonner';
import { 
  BookOpen, 
  Clock, 
  DollarSign, 
  Calendar, 
  MapPin,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';

const CreateRequest = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    subject: '',
    topic: '',
    description: '',
    duration_hours: 1,
    preferred_price: '',
    max_price: '',
    session_date: '',
    session_time: '',
    location: 'online',
    urgency: 'medium'
  });

  const [errors, setErrors] = useState({});

  const subjects = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science',
    'English',
    'Indonesian',
    'History',
    'Geography',
    'Economics',
    'Psychology',
    'Art',
    'Music'
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.subject) newErrors.subject = 'Subject is required';
    if (!formData.topic) newErrors.topic = 'Topic is required';
    if (!formData.description || formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    if (!formData.preferred_price || formData.preferred_price < 50000) {
      newErrors.preferred_price = 'Preferred price must be at least Rp 50,000';
    }
    if (!formData.max_price || formData.max_price < formData.preferred_price) {
      newErrors.max_price = 'Max price must be greater than preferred price';
    }
    if (!formData.session_date) newErrors.session_date = 'Session date is required';
    if (!formData.session_time) newErrors.session_time = 'Session time is required';

    // Check if session date is in the future
    const sessionDateTime = new Date(`${formData.session_date}T${formData.session_time}`);
    if (sessionDateTime <= new Date()) {
      newErrors.session_date = 'Session must be scheduled for a future date and time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      // Combine date and time
      const sessionDateTime = new Date(`${formData.session_date}T${formData.session_time}`);
      
      const requestData = {
        ...formData,
        session_date: sessionDateTime.toISOString(),
        preferred_price: parseFloat(formData.preferred_price),
        max_price: parseFloat(formData.max_price),
        duration_hours: parseInt(formData.duration_hours)
      };

      // TODO: API call to create request
      console.log('Creating request:', requestData);
      
      // Mock success
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Request created successfully!');
      navigate('/student');
      
    } catch (error) {
      console.error('Error creating request:', error);
      toast.error('Failed to create request. Please try again.');
    } finally {
      setLoading(false);
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

  const getUrgencyDescription = (urgency) => {
    switch (urgency) {
      case 'high': return 'Urgent (within 24 hours)';
      case 'medium': return 'Moderate (within a week)';
      case 'low': return 'Flexible (anytime)';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <h1 className="text-3xl font-bold text-slate-900">Create Tutoring Request</h1>
            <p className="text-slate-600 mt-2">Post a request and get bids from qualified tutors</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Subject & Topic */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5" />
                    <span>Subject & Topic</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Select
                      value={formData.subject}
                      onValueChange={(value) => handleInputChange('subject', value)}
                    >
                      <SelectTrigger className={errors.subject ? 'error-border' : ''}>
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.subject && (
                      <p className="text-sm text-red-600 mt-1">{errors.subject}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="topic">Specific Topic *</Label>
                    <Input
                      id="topic"
                      placeholder="e.g., Calculus Integration, Quantum Mechanics"
                      value={formData.topic}
                      onChange={(e) => handleInputChange('topic', e.target.value)}
                      className={errors.topic ? 'error-border' : ''}
                    />
                    {errors.topic && (
                      <p className="text-sm text-red-600 mt-1">{errors.topic}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe what you need help with, your current level, specific areas of difficulty..."
                      rows={4}
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className={errors.description ? 'error-border' : ''}
                    />
                    <p className="text-sm text-slate-500 mt-1">
                      {formData.description.length}/500 characters
                    </p>
                    {errors.description && (
                      <p className="text-sm text-red-600 mt-1">{errors.description}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Session Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>Session Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="session_date">Session Date *</Label>
                      <Input
                        id="session_date"
                        type="date"
                        value={formData.session_date}
                        onChange={(e) => handleInputChange('session_date', e.target.value)}
                        className={errors.session_date ? 'error-border' : ''}
                        min={new Date().toISOString().split('T')[0]}
                      />
                      {errors.session_date && (
                        <p className="text-sm text-red-600 mt-1">{errors.session_date}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="session_time">Session Time *</Label>
                      <Input
                        id="session_time"
                        type="time"
                        value={formData.session_time}
                        onChange={(e) => handleInputChange('session_time', e.target.value)}
                        className={errors.session_time ? 'error-border' : ''}
                      />
                      {errors.session_time && (
                        <p className="text-sm text-red-600 mt-1">{errors.session_time}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="duration">Duration (hours)</Label>
                      <Select
                        value={formData.duration_hours.toString()}
                        onValueChange={(value) => handleInputChange('duration_hours', parseInt(value))}
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
                      <Label htmlFor="location">Location</Label>
                      <Select
                        value={formData.location}
                        onValueChange={(value) => handleInputChange('location', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="online">Online</SelectItem>
                          <SelectItem value="student_home">Student's Home</SelectItem>
                          <SelectItem value="tutor_home">Tutor's Home</SelectItem>
                          <SelectItem value="public_place">Public Place</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pricing */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5" />
                    <span>Pricing</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="preferred_price">Preferred Price (IDR) *</Label>
                      <Input
                        id="preferred_price"
                        type="number"
                        placeholder="150000"
                        value={formData.preferred_price}
                        onChange={(e) => handleInputChange('preferred_price', e.target.value)}
                        className={errors.preferred_price ? 'error-border' : ''}
                        min="50000"
                        step="25000"
                      />
                      {formData.preferred_price && (
                        <p className="text-sm text-slate-500 mt-1">
                          {formatCurrency(parseFloat(formData.preferred_price) || 0)}
                        </p>
                      )}
                      {errors.preferred_price && (
                        <p className="text-sm text-red-600 mt-1">{errors.preferred_price}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="max_price">Maximum Price (IDR) *</Label>
                      <Input
                        id="max_price"
                        type="number"
                        placeholder="200000"
                        value={formData.max_price}
                        onChange={(e) => handleInputChange('max_price', e.target.value)}
                        className={errors.max_price ? 'error-border' : ''}
                        min="50000"
                        step="25000"
                      />
                      {formData.max_price && (
                        <p className="text-sm text-slate-500 mt-1">
                          {formatCurrency(parseFloat(formData.max_price) || 0)}
                        </p>
                      )}
                      {errors.max_price && (
                        <p className="text-sm text-red-600 mt-1">{errors.max_price}</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">Pricing Tips</p>
                        <p className="text-sm text-blue-700 mt-1">
                          Set a competitive preferred price to attract more tutors. Your maximum price gives you flexibility to accept higher bids if needed.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Urgency */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>Urgency Level</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['low', 'medium', 'high'].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => handleInputChange('urgency', level)}
                        className={`p-4 border-2 rounded-lg text-left transition-all ${
                          formData.urgency === level
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <Badge className={`${getUrgencyColor(level)} mb-2`}>
                          {level.toUpperCase()}
                        </Badge>
                        <p className="text-sm font-medium">{getUrgencyDescription(level)}</p>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Request Summary */}
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Request Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Subject:</span>
                      <span className="text-sm font-medium">
                        {formData.subject || 'Not selected'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Duration:</span>
                      <span className="text-sm font-medium">
                        {formData.duration_hours}h
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Location:</span>
                      <span className="text-sm font-medium capitalize">
                        {formData.location.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Price Range:</span>
                      <div className="text-sm font-medium">
                        {formData.preferred_price && formData.max_price ? (
                          <span>
                            {formatCurrency(formData.preferred_price)} - {formatCurrency(formData.max_price)}
                          </span>
                        ) : (
                          'Not set'
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Urgency:</span>
                      <Badge className={getUrgencyColor(formData.urgency)}>
                        {formData.urgency}
                      </Badge>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full btn-primary"
                    >
                      {loading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Creating Request...</span>
                        </div>
                      ) : (
                        'Create Request'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRequest;