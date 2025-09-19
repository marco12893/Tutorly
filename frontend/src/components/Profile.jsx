import React, { useState, useContext } from 'react';
import { AuthContext } from '../App';
import { toast } from 'sonner';
import { 
  User, 
  Mail, 
  Phone, 
  BookOpen, 
  Star,
  Award,
  Calendar,
  TrendingUp,
  Edit,
  Save,
  X,
  Camera
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    bio: user.bio || '',
    subjects: user.subjects || []
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Mock data for user activity
  const mockActivity = {
    student: {
      totalRequests: 15,
      completedSessions: 12,
      totalSpent: 1200000,
      averageRating: 4.8,
      recentSessions: [
        {
          id: '1',
          subject: 'Mathematics',
          topic: 'Calculus',
          tutor: 'Sarah Chen',
          date: '2024-09-20T14:00:00',
          rating: 5,
          price: 200000
        },
        {
          id: '2',
          subject: 'Physics',
          topic: 'Quantum Mechanics',
          tutor: 'Dr. Emma Wilson',
          date: '2024-09-18T10:00:00',
          rating: 5,
          price: 250000
        },
        {
          id: '3',
          subject: 'Chemistry',
          topic: 'Organic Chemistry',
          tutor: 'Prof. James Park',
          date: '2024-09-15T16:00:00',
          rating: 4,
          price: 180000
        }
      ]
    },
    tutor: {
      totalBids: 28,
      acceptedBids: 8,
      completedSessions: 8,
      totalEarned: 800000,
      averageRating: 4.9,
      recentSessions: [
        {
          id: '1',
          subject: 'Computer Science',
          topic: 'Data Structures',
          student: 'Lisa Chen',
          date: '2024-09-18T14:00:00',
          rating: 5,
          earned: 180000
        },
        {
          id: '2',
          subject: 'Mathematics',
          topic: 'Linear Algebra',
          student: 'Ahmad Rizki',
          date: '2024-09-16T11:00:00',
          rating: 5,
          earned: 200000
        }
      ]
    }
  };

  const handleSave = async () => {
    setLoading(true);
    
    try {
      // TODO: API call to update profile
      console.log('Updating profile:', editForm);
      
      // Mock success
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setUser(prev => ({
        ...prev,
        ...editForm
      }));
      
      toast.success('Profile updated successfully!');
      setIsEditing(false);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditForm({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      bio: user.bio || '',
      subjects: user.subjects || []
    });
    setIsEditing(false);
  };

  const addSubject = (subject) => {
    if (subject && !editForm.subjects.includes(subject)) {
      setEditForm(prev => ({
        ...prev,
        subjects: [...prev.subjects, subject]
      }));
    }
  };

  const removeSubject = (subject) => {
    setEditForm(prev => ({
      ...prev,
      subjects: prev.subjects.filter(s => s !== subject)
    }));
  };

  const availableSubjects = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
    'English', 'Indonesian', 'History', 'Geography', 'Economics'
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Profile</h1>
            <p className="text-slate-600 mt-2">Manage your personal information and activity</p>
          </div>
          
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} className="btn-primary flex items-center space-x-2">
              <Edit className="w-4 h-4" />
              <span>Edit Profile</span>
            </Button>
          ) : (
            <div className="flex items-center space-x-2">
              <Button onClick={handleCancel} variant="outline" className="flex items-center space-x-2">
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </Button>
              <Button onClick={handleSave} disabled={loading} className="btn-secondary flex items-center space-x-2">
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>Save</span>
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <Avatar className="w-24 h-24 mx-auto">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                        <Camera className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  {!isEditing ? (
                    <>
                      <h2 className="text-xl font-bold text-slate-900 mt-4">{user.name}</h2>
                      <p className="text-slate-600">{user.email}</p>
                      {user.phone && <p className="text-slate-600">{user.phone}</p>}
                      <Badge variant={user.currentRole === 'student' ? 'default' : 'secondary'} className="mt-2 capitalize">
                        {user.currentRole}
                      </Badge>
                    </>
                  ) : (
                    <div className="space-y-4 mt-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={editForm.name}
                          onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={editForm.phone}
                          onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="e.g., +62 812 3456 7890"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Bio Section */}
                <div className="border-t border-slate-200 pt-6">
                  <h3 className="font-medium text-slate-900 mb-3">About Me</h3>
                  {!isEditing ? (
                    <p className="text-slate-600 text-sm">
                      {user.bio || 'No bio added yet.'}
                    </p>
                  ) : (
                    <Textarea
                      placeholder="Tell others about yourself, your experience, and teaching style..."
                      rows={4}
                      value={editForm.bio}
                      onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                    />
                  )}
                </div>

                {/* Subjects */}
                <div className="border-t border-slate-200 pt-6 mt-6">
                  <h3 className="font-medium text-slate-900 mb-3">Subjects</h3>
                  
                  {!isEditing ? (
                    <div className="flex flex-wrap gap-2">
                      {(user.subjects || []).length > 0 ? (
                        user.subjects.map((subject) => (
                          <Badge key={subject} variant="outline">{subject}</Badge>
                        ))
                      ) : (
                        <p className="text-slate-500 text-sm">No subjects added yet.</p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {editForm.subjects.map((subject) => (
                          <Badge
                            key={subject}
                            variant="default"
                            className="cursor-pointer"
                            onClick={() => removeSubject(subject)}
                          >
                            {subject} <X className="w-3 h-3 ml-1" />
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {availableSubjects
                          .filter(subject => !editForm.subjects.includes(subject))
                          .map((subject) => (
                            <Badge
                              key={subject}
                              variant="outline"
                              className="cursor-pointer hover:bg-slate-100"
                              onClick={() => addSubject(subject)}
                            >
                              + {subject}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity & Stats */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="student">As Student</TabsTrigger>
                <TabsTrigger value="tutor">As Tutor</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Student Stats */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <BookOpen className="w-5 h-5" />
                        <span>Student Activity</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Total Requests</span>
                        <span className="font-medium">{mockActivity.student.totalRequests}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Completed Sessions</span>
                        <span className="font-medium">{mockActivity.student.completedSessions}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Total Spent</span>
                        <span className="font-medium">{formatCurrency(mockActivity.student.totalSpent)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Average Rating</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-medium">{mockActivity.student.averageRating}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Tutor Stats */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Award className="w-5 h-5" />
                        <span>Tutor Activity</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Total Bids</span>
                        <span className="font-medium">{mockActivity.tutor.totalBids}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Accepted Bids</span>
                        <span className="font-medium">{mockActivity.tutor.acceptedBids}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Total Earned</span>
                        <span className="font-medium">{formatCurrency(mockActivity.tutor.totalEarned)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Average Rating</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-medium">{mockActivity.tutor.averageRating}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Wallet Balance */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5" />
                      <span>Wallet Summary</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <p className="text-sm text-slate-600">Current Balance</p>
                        <p className="text-2xl font-bold text-emerald-600">{formatCurrency(user.wallet.balance)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-slate-600">Total Spent</p>
                        <p className="text-2xl font-bold text-red-600">{formatCurrency(mockActivity.student.totalSpent)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-slate-600">Total Earned</p>
                        <p className="text-2xl font-bold text-blue-600">{formatCurrency(mockActivity.tutor.totalEarned)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Student Tab */}
              <TabsContent value="student" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Sessions as Student</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockActivity.student.recentSessions.map((session) => (
                        <div key={session.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                          <div>
                            <h4 className="font-medium text-slate-900">{session.subject}</h4>
                            <p className="text-sm text-slate-600">{session.topic}</p>
                            <p className="text-sm text-slate-500">with {session.tutor}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{formatCurrency(session.price)}</p>
                            <p className="text-sm text-slate-500">{formatDate(session.date)}</p>
                            <div className="flex items-center space-x-1 mt-1">
                              {[...Array(session.rating)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tutor Tab */}
              <TabsContent value="tutor" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Sessions as Tutor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockActivity.tutor.recentSessions.map((session) => (
                        <div key={session.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                          <div>
                            <h4 className="font-medium text-slate-900">{session.subject}</h4>
                            <p className="text-sm text-slate-600">{session.topic}</p>
                            <p className="text-sm text-slate-500">for {session.student}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-emerald-600">+{formatCurrency(session.earned)}</p>
                            <p className="text-sm text-slate-500">{formatDate(session.date)}</p>
                            <div className="flex items-center space-x-1 mt-1">
                              {[...Array(session.rating)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;