import React from 'react';
import { useAuth } from '../auth/AuthProvider';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Car, User, Settings } from 'lucide-react';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <header className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">
              Vehicle Parking System
            </h1>
          </div>

          <nav className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {user?.username}
                  </span>
                </div>
                
                {isAdminRoute ? (
                  <button
                    onClick={() => navigate('/')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Back to Client
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/admin/dashboard')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium flex items-center space-x-1"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Admin Panel</span>
                  </button>
                )}
                
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm font-medium flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/admin/login')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Admin Login
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;