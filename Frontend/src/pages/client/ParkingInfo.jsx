import React, { useState, useEffect } from 'react';
import { Car, Bike, Zap, MapPin, Clock, RefreshCw, Eye, X } from 'lucide-react';
import Loader from '../../components/Loader';
import TokenLookup from './TokenLookup';
import { BASE_URL } from '../../config/baseurl';

// export const BASE_URL = 'http://localhost:8080/api';

const ParkingInfo = () => {
  const [parkingData, setParkingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showTokenLookup, setShowTokenLookup] = useState(false);

  const fetchParkingStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/config/parking`);
      const data = await response.json();

      const mockOccupied = {
        car: 12,
        bike: 12,
        ev: 2
      };

      setParkingData({
        car: {
          available: data.slots.car - mockOccupied.car,
          total: data.slots.car,
          fee: data.fees.car
        },
        bike: {
          available: data.slots.bike - mockOccupied.bike,
          total: data.slots.bike,
          fee: data.fees.bike
        },
        ev: {
          available: data.slots.ev - mockOccupied.ev,
          total: data.slots.ev,
          fee: data.fees.ev
        },
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error fetching parking status:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParkingStatus();
  }, []);

  const vehicleTypes = [
    {
      key: 'car',
      label: 'Car',
      icon: Car,
      color: 'bg-blue-500',
    },
    {
      key: 'bike',
      label: 'Bike',
      icon: Bike,
      color: 'bg-green-500',
    },
    {
      key: 'ev',
      label: 'Electric Vehicle',
      icon: Zap,
      color: 'bg-yellow-500',
    },
  ];

  const getAvailabilityColor = (available, total) => {
    const percentage = (available / total) * 100;
    if (percentage > 50) return 'text-green-600';
    if (percentage > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
            <MapPin className="h-8 w-8 text-blue-600" />
            <span>Parking Information</span>
          </h1>
          <p className="text-gray-600 mt-2">
            Real-time parking availability
          </p>
        </div>

        <button
          onClick={() => setShowTokenLookup(true)}
          className="bg-gray-100 hover:bg-gray-200 text-blue-600 border border-gray-300 px-4 py-2 rounded-md flex items-center space-x-2 transition-all"
        >
          <Eye className="h-4 w-4" />
          <span>Token Lookup</span>
        </button>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={fetchParkingStatus}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {loading && !parkingData ? (
        <div className="text-center py-8">
          <Loader text="Loading parking information..." />
        </div>
      ) : (
        <>
          {/* Parking Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {vehicleTypes.map((type) => {
              const data = parkingData?.[type.key];
              const Icon = type.icon;

              return (
                <div key={type.key} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`${type.color} p-3 rounded-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {type.label}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Available:</span>
                      <span className={`text-lg font-bold ${getAvailabilityColor(data?.available, data?.total)}`}>
                        {data?.available} / {data?.total}
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${type.color} h-2 rounded-full`}
                        style={{ width: `${((data?.available || 0) / (data?.total || 1)) * 100}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Hourly Fee:</span>
                      <span className="text-lg font-bold text-green-600">₹{data?.fee}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Show Token Lookup Modal or Inline Component */}
      {showTokenLookup && (
        <div className="mt-10 relative border rounded-lg p-4 bg-white shadow-md">
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
            onClick={() => setShowTokenLookup(false)}
          >
            <X className="h-5 w-5" />
          </button>
          <TokenLookup />
        </div>
      )}
    </div>
  );
};

export default ParkingInfo;
