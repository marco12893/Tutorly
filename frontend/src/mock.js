// Mock data for Tutorly tutoring marketplace

export const mockUser = {
  id: '1',
  name: 'Sarah Chen',
  email: 'sarah.chen@email.com',
  type: 'student', // 'student' or 'tutor'
  avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
  rating: 4.8,
  completedSessions: 12
};

export const mockRequests = [
  {
    id: '1',
    studentId: '1',
    subject: 'Mathematics',
    level: 'High School',
    description: 'Need help with calculus, specifically derivatives and integration. Have an exam tomorrow!',
    duration: 2,
    preferredPrice: 300000,
    urgency: 'urgent',
    sessionType: 'online',
    createdAt: new Date('2025-01-21T10:00:00'),
    status: 'open',
    bidsCount: 3
  },
  {
    id: '2',
    studentId: '1',
    subject: 'Physics',
    level: 'University',
    description: 'Quantum mechanics concepts for upcoming midterm exam',
    duration: 3,
    preferredPrice: 450000,
    urgency: 'flexible',
    sessionType: 'in-person',
    createdAt: new Date('2025-01-20T14:30:00'),
    status: 'accepted',
    bidsCount: 5
  }
];

export const mockBids = [
  {
    id: '1',
    requestId: '1',
    tutorId: '101',
    tutorName: 'Dr. Ahmad Rahman',
    tutorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    tutorRating: 4.9,
    tutorExperience: '5 years',
    proposedPrice: 280000,
    message: 'Hi Sarah! I specialize in calculus and have helped many students with last-minute exam prep. I can start immediately.',
    estimatedDuration: 2,
    availability: 'Available now',
    status: 'pending'
  },
  {
    id: '2',
    requestId: '1',
    tutorId: '102',
    tutorName: 'Maria Santos',
    tutorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    tutorRating: 4.7,
    tutorExperience: '3 years',
    proposedPrice: 320000,
    message: 'I have extensive experience with high school calculus. Can provide practice problems and step-by-step guidance.',
    estimatedDuration: 2.5,
    availability: 'Available in 1 hour',
    status: 'pending'
  },
  {
    id: '3',
    requestId: '1',
    tutorId: '103',
    tutorName: 'David Kim',
    tutorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    tutorRating: 4.8,
    tutorExperience: '7 years',
    proposedPrice: 350000,
    message: 'Math PhD with experience in urgent exam prep. I can guarantee you will understand derivatives and integration by tomorrow.',
    estimatedDuration: 2,
    availability: 'Available now',
    status: 'pending'
  }
];

export const mockSubjects = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Indonesian',
  'History', 'Geography', 'Economics', 'Accounting', 'Computer Science',
  'Statistics', 'Psychology', 'Sociology', 'Art', 'Music'
];

export const mockLevels = [
  'Elementary School', 'Middle School', 'High School', 'University', 'Graduate'
];

export const mockNotifications = [
  {
    id: '1',
    type: 'new_bid',
    title: 'New bid received',
    message: 'Dr. Ahmad Rahman sent a bid for your Mathematics request',
    timestamp: new Date('2025-01-21T11:30:00'),
    read: false
  },
  {
    id: '2',
    type: 'session_reminder',
    title: 'Session starting soon',
    message: 'Your Physics session with Maria Santos starts in 30 minutes',
    timestamp: new Date('2025-01-21T09:00:00'),
    read: true
  }
];