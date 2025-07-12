import React, { useState } from 'react';
import { Search, Ticket, Clock, MapPin, CreditCard, LogOut } from 'lucide-react';
import VehicleTag from '../../components/VehicleTag';
import QRCodeImage from '../../components/QRCodeImage';
import Loader from '../../components/Loader';

export const BASE_URL = 'http://localhost:8080/api';

const TokenManager = () => {
  const [searchToken, setSearchToken] = useState('');
  const [tokenData, setTokenData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!searchToken.trim()) {
      setError('Please enter a token');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${BASE_URL}/parking/${searchToken}`);
      const result = await response.json();

      if (result.success) {
        setTokenData(result.data);
      } else {
        setError(result.message || 'Token not found or invalid');
        setTokenData(null);
      }
    } catch (err) {
      setError('Failed to fetch token details');
      setTokenData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleExitVehicle = async () => {
    if (!tokenData) return;

    if (window.confirm('Are you sure you want to exit this vehicle?')) {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/parking/exit/${tokenData.token}`, {
          method: 'POST',
        });
        const result = await response.json();

        if (result.success) {
          alert('Vehicle exited successfully!');
          setTokenData(null);
          setSearchToken('');
        } else {
          alert(result.message || 'Failed to exit vehicle');
        }
      } catch (error) {
        alert('Error exiting vehicle');
      } finally {
        setLoading(false);
      }
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const calculateDuration = (entryTime) => {
    const now = new Date();
    const entry = new Date(entryTime);
    const diffMs = now - entry;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffHours}h ${diffMinutes}m`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
          <Ticket className="h-8 w-8 text-blue-600" />
          <span>Token Manager</span>
        </h1>
        <p className="text-gray-600 mt-2">
          Search and manage parking tokens
        </p>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Token</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchToken}
                onChange={(e) => setSearchToken(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter token ID (e.g., ABC123)"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader size="sm" text="" /> : 'Search'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>

      {/* Token Details */}
      {tokenData && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Token Details</h2>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-sm font-medium text-green-700">Active</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Vehicle Information */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Vehicle Information</h3>
                <div className="space-y-3">
                  <InfoRow label="Token ID" value={tokenData.token} />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Vehicle Type:</span>
                    <VehicleTag type={tokenData.vehicleType} size="sm" />
                  </div>
                  <InfoRow label="Vehicle Number" value={tokenData.vehicleNumber} />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Location:</span>
                    <span className="text-sm text-gray-900 flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{tokenData.location}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Timing Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Entry Time:</span>
                    <span className="text-sm text-gray-900 flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatTime(tokenData.entryTime)}</span>
                    </span>
                  </div>
                  <InfoRow label="Duration" value={calculateDuration(tokenData.entryTime)} color="text-blue-600" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Total Fees:</span>
                    <span className="text-sm font-bold text-green-600 flex items-center space-x-1">
                      <CreditCard className="h-3 w-3" />
                      <span>₹{tokenData.fees}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* QR and Exit */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Payment QR Code</h3>
                <div className="text-center">
                  <QRCodeImage qrData={tokenData.qr || tokenData.token} size="md" />
                  <p className="text-sm text-gray-600 mt-2">Scan to pay parking fees</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={handleExitVehicle}
                    disabled={loading}
                    className="w-full bg-red-600 text-white px-4 py-3 rounded-md hover:bg-red-700 transition-colors font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Exit Vehicle</span>
                  </button>
                  <p className="text-xs text-gray-500 text-center">
                    This will mark the vehicle as exited and clear the parking slot
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InfoRow = ({ label, value, color = 'text-gray-900' }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm font-medium text-gray-600">{label}:</span>
    <span className={`text-sm font-bold ${color}`}>{value}</span>
  </div>
);

export default TokenManager;
