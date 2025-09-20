import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { Toaster } from 'sonner';
import './App.css';

// Components
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import StudentDashboard from './components/StudentDashboard';
import TutorDashboard from './components/TutorDashboard';
import Profile from './components/Profile';
import CreateRequest from './components/CreateRequest';
import BrowseRequests from './components/BrowseRequests';
import RequestDetails from './components/RequestDetails';
import Wallet from './components/Wallet';
import Login from "./components/Login";
import Signup from "./components/Signup";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Auth context
const AuthContext = React.createContext();

// Mock user for demo
const mockUser = {
  id: 'user-1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  currentRole: 'student', // student or tutor
  wallet: {
    balance: 250000, // in IDR (Indonesian Rupiah)
    transactions: []
  },
  ratings: {
    student: { average: 4.8, count: 12 },
    tutor: { average: 4.9, count: 8 }
  }
};

function App() {
  const [user, setUser] = useState(mockUser);
  const [requests, setRequests] = useState([]);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  // Test backend connection
  const testConnection = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/`);
      console.log('Backend connected:', response.data);
    } catch (error) {
      console.error('Backend connection failed:', error);
    }
  }, []);

  useEffect(() => {
    testConnection();
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, [testConnection]);

  const switchRole = (newRole) => {
    setUser(prev => ({ ...prev, currentRole: newRole }));
  };

  const updateWallet = (amount, type = 'add') => {
    setUser(prev => ({
      ...prev,
      wallet: {
        ...prev.wallet,
        balance: type === 'add'
          ? prev.wallet.balance + amount
          : prev.wallet.balance - amount
      }
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading Tutorly...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser, switchRole, updateWallet }}>
      <Router>
        <div className="min-h-screen bg-slate-50">
          <Navigation />

          <main className="pt-16">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/student" element={<StudentDashboard />} />
              <Route path="/tutor" element={<TutorDashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/create-request" element={<CreateRequest />} />
              <Route path="/browse-requests" element={<BrowseRequests />} />
              <Route path="/request/:id" element={<RequestDetails />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Toaster
            position="top-right"
            richColors
            closeButton
          />
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export { AuthContext };
export default App;