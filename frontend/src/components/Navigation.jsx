import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { 
  User, 
  BookOpen, 
  Users, 
  Wallet, 
  ToggleLeft,
  Menu,
  X,
  Home,
  Plus,
  Search
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';

const Navigation = () => {
  const { user, switchRole } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleRoleSwitch = () => {
    const newRole = user.currentRole === 'student' ? 'tutor' : 'student';
    switchRole(newRole);
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const navigationItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    ...(user.currentRole === 'student' 
      ? [
          { path: '/create-request', icon: Plus, label: 'New Request' },
          { path: '/student', icon: BookOpen, label: 'My Requests' }
        ]
      : [
          { path: '/browse-requests', icon: Search, label: 'Browse Requests' },
          { path: '/tutor', icon: Users, label: 'My Bids' }
        ]
    ),
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/wallet', icon: Wallet, label: 'Wallet' }
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">Tutorly</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            {/* User Info & Role Switch */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Wallet Balance */}
              <div className="text-sm text-slate-600">
                {formatCurrency(user.wallet.balance)}
              </div>

              {/* Role Switch */}
              <Button
                onClick={handleRoleSwitch}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <Switch className="w-4 h-4" />
                <span className="capitalize">{user.currentRole}</span>
                <Badge 
                  variant={user.currentRole === 'student' ? 'default' : 'secondary'}
                  className="ml-1"
                >
                  Switch to {user.currentRole === 'student' ? 'Tutor' : 'Student'}
                </Badge>
              </Button>

              {/* User Avatar */}
              <Avatar className="w-8 h-8">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed top-16 left-0 right-0 bg-white border-b border-slate-200 shadow-lg">
            <div className="px-4 py-4 space-y-2">
              {/* User Info */}
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-200">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-slate-900">{user.name}</p>
                  <p className="text-sm text-slate-500">{formatCurrency(user.wallet.balance)}</p>
                </div>
              </div>

              {/* Role Switch */}
              <Button
                onClick={handleRoleSwitch}
                variant="outline"
                className="w-full justify-start space-x-2"
              >
                <Switch className="w-4 h-4" />
                <span>Switch to {user.currentRole === 'student' ? 'Tutor' : 'Student'}</span>
                <Badge 
                  variant={user.currentRole === 'student' ? 'default' : 'secondary'}
                  className="ml-auto"
                >
                  {user.currentRole === 'student' ? 'Student' : 'Tutor'}
                </Badge>
              </Button>

              {/* Navigation Items */}
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;