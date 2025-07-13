import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings, CreditCard, Car, Ticket, BarChart3, Users
} from 'lucide-react';
import { BASE_URL } from '../../config/baseurl';

const StatCard = ({ label, value, icon: Icon }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <Icon className="h-8 w-8 text-blue-600" />
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  const dashboardItems = [
    {
      title: 'Parking Configuration',
      description: 'Configure parking slots and fees',
      icon: Settings,
      color: 'bg-blue-500',
      path: '/admin/parking-config',
    },
    {
      title: 'Payment Settings',
      description: 'Manage UPI and payment options',
      icon: CreditCard,
      color: 'bg-green-500',
      path: '/admin/payment-settings',
    },
    {
      title: 'Vehicle Manager',
      description: 'View and manage all vehicles',
      icon: Car,
      color: 'bg-purple-500',
      path: '/admin/vehicle-manager',
    },
    {
      title: 'Token Manager',
      description: 'Search and manage parking tokens',
      icon: Ticket,
      color: 'bg-orange-500',
      path: '/admin/token-manager',
    },
  ];

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch(`${BASE_URL}/dashboard/stats`);
      const result = await response.json();
      if (response.ok) {
        setStats(result);
      } else {
        setError('Failed to load dashboard stats');
      }
    } catch (err) {
      setError('Server error while fetching stats');
    }
  };

  const pingBackend = () => {
    fetch(`${BASE_URL}/ping`).catch(() => {}); // ping silently
  };

  useEffect(() => {
    fetchDashboardStats();

    // Heartbeat interval every 4 minutes
    const interval = setInterval(() => {
      pingBackend();
    }, 240000); // 4 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your parking system efficiently</p>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 text-sm text-red-700 rounded-md">
          {error}
        </div>
      )}

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard label="Total Vehicles" value={stats.totalVehicles} icon={Car} />
          <StatCard label="Active Tokens" value={stats.activeTokens} icon={Ticket} />
          <StatCard label="Available Slots" value={stats.availableSlots} icon={BarChart3} />
          <StatCard label="Today's Revenue" value={`₹${stats.todayRevenue}`} icon={Users} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dashboardItems.map(({ title, description, icon: Icon, color, path }, index) => (
          <div
            key={index}
            onClick={() => navigate(path)}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 hover:border-blue-300"
          >
            <div className="flex items-center space-x-4">
              <div className={`${color} p-3 rounded-lg`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                <p className="text-gray-600 text-sm">{description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
