import React, { useEffect, useState } from 'react';
import { Save, Car, Bike, Zap, MapPin } from 'lucide-react';
import Loader from '../../components/Loader';

export const BASE_URL = 'http://localhost:8080/api';

const ParkingConfig = () => {
  const [loading, setLoading] = useState(false);
  const [parkingSlots, setParkingSlots] = useState({ car: 0, bike: 0, ev: 0 });
  const [fees, setFees] = useState({ car: 0, bike: 0, ev: 0 });
  const [error, setError] = useState('');

  const vehicleTypes = [
    { key: 'car', label: 'Car', icon: Car, color: 'text-blue-600' },
    { key: 'bike', label: 'Bike', icon: Bike, color: 'text-green-600' },
    { key: 'ev', label: 'Electric Vehicle', icon: Zap, color: 'text-yellow-600' },
  ];

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/config/parking`);
      const result = await response.json();
      if (response.ok) {
        setParkingSlots(result.slots);
        setFees(result.fees);
      } else {
        setError('Failed to load parking config');
      }
    } catch (err) {
      setError('Server error while fetching configuration');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleSlotChange = (type, value) => {
    setParkingSlots(prev => ({
      ...prev,
      [type]: parseInt(value) || 0,
    }));
  };

  const handleFeeChange = (type, value) => {
    setFees(prev => ({
      ...prev,
      [type]: parseInt(value) || 0,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      const res1 = await fetch(`${BASE_URL}/config/parking/slots`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parkingSlots),
      });

      const res2 = await fetch(`${BASE_URL}/config/parking/fees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fees),
      });

      const r1 = await res1.json();
      const r2 = await res2.json();

      if (r1.success && r2.success) {
        alert('Configuration saved successfully!');
      } else {
        alert(r1.message || r2.message || 'Failed to update configuration');
      }
    } catch (err) {
      alert('Error saving configuration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
          <MapPin className="h-8 w-8 text-blue-600" />
          <span>Parking Configuration</span>
        </h1>
        <p className="text-gray-600 mt-2">
          Configure parking slots and hourly fees for different vehicle types
        </p>
      </div>

      {/* Configuration Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-sm text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Parking Slots */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Parking Slots</h2>
            <div className="space-y-4">
              {vehicleTypes.map(({ key, label, icon: Icon, color }) => (
                <div key={key} className="flex items-center space-x-3">
                  <Icon className={`h-5 w-5 ${color}`} />
                  <label className="flex-1 text-sm font-medium text-gray-700">{label}</label>
                  <input
                    type="number"
                    min="0"
                    value={parkingSlots[key]}
                    onChange={(e) => handleSlotChange(key, e.target.value)}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Parking Fees */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Hourly Fees (₹)</h2>
            <div className="space-y-4">
              {vehicleTypes.map(({ key, label, icon: Icon, color }) => (
                <div key={key} className="flex items-center space-x-3">
                  <Icon className={`h-5 w-5 ${color}`} />
                  <label className="flex-1 text-sm font-medium text-gray-700">{label}</label>
                  <input
                    type="number"
                    min="0"
                    value={fees[key]}
                    onChange={(e) => handleFeeChange(key, e.target.value)}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-medium text-gray-700">Total Slots</p>
              <p className="text-2xl font-bold text-blue-600">
                {parkingSlots.car + parkingSlots.bike + parkingSlots.ev}
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Average Fee</p>
              <p className="text-2xl font-bold text-green-600">
                ₹{Math.round((fees.car + fees.bike + fees.ev) / 3)}
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Max Capacity</p>
              <p className="text-2xl font-bold text-purple-600">
                {Math.max(parkingSlots.car, parkingSlots.bike, parkingSlots.ev)}
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader size="sm" text="Saving..." /> : (
              <>
                <Save className="h-5 w-5" />
                <span>Save Configuration</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParkingConfig;
