import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUser } from '../mock';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing session
    const savedUser = localStorage.getItem('tutorly_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock login - in real app, this would be an API call
        const loggedInUser = { ...mockUser, email };
        setUser(loggedInUser);
        localStorage.setItem('tutorly_user', JSON.stringify(loggedInUser));
        resolve({ success: true, user: loggedInUser });
      }, 1000);
    });
  };

  const signup = (name, email, password, userType) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock signup - in real app, this would be an API call
        const newUser = {
          id: Date.now().toString(),
          name,
          email,
          type: userType,
          avatar: userType === 'student' ?
            'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face' :
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          rating: userType === 'student' ? null : 5.0,
          completedSessions: 0
        };
        setUser(newUser);
        localStorage.setItem('tutorly_user', JSON.stringify(newUser));
        resolve({ success: true, user: newUser });
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tutorly_user');
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};