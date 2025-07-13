import React, { useState, useEffect } from 'react';
import { Save, CreditCard, Smartphone } from 'lucide-react';
import QRCodeImage from '../../components/QRCodeImage';
import Loader from '../../components/Loader';
import { BASE_URL } from '../../config/baseurl';

// export const BASE_URL = 'http://localhost:8080/api';

const PaymentSettings = () => {
  const [loading, setLoading] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [error, setError] = useState('');

  // Fetch current UPI config
  const fetchPaymentSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/config/payment`);
      const result = await response.json();
      if (response.ok) {
        setUpiId(result.upiId || '');
        setQrCodeUrl(result.qrCodeUrl || '');
      } else {
        setError('Failed to load payment settings');
      }
    } catch (err) {
      setError('Server error while loading payment settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentSettings();
  }, []);

  const handleSave = async () => {
    if (!upiId.trim()) {
      alert('Please enter a valid UPI ID');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${BASE_URL}/config/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ upiId }),
      });

      const result = await response.json();
      if (response.ok && result.success) {
        alert(result.message || 'Payment settings saved successfully!');
        setQrCodeUrl(result.qrCodeUrl);
      } else {
        setError(result.message || 'Failed to save payment settings');
      }
    } catch (err) {
      setError('Server error while saving payment settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
          <CreditCard className="h-8 w-8 text-blue-600" />
          <span>Payment Settings</span>
        </h1>
        <p className="text-gray-600 mt-2">
          Configure UPI and payment options for parking fees
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* UPI Configuration */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Smartphone className="h-5 w-5 text-green-600" />
              <span>UPI Configuration</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  UPI ID
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter UPI ID"
                />
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Payment Methods</h3>
                <div className="space-y-2 text-sm text-blue-700">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" checked readOnly className="text-blue-600" />
                    <span>UPI Payment</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" checked readOnly className="text-blue-600" />
                    <span>QR Code Scan</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" disabled className="text-gray-400" />
                    <span className="text-gray-500">Credit/Debit Card (Coming Soon)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code Preview */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">QR Code Preview</h2>

            <div className="text-center">
              <QRCodeImage qrData={qrCodeUrl} size="lg" />
              <p className="text-sm text-gray-600 mt-2">
                Customers will scan this QR code to make payments
              </p>
              <p className="text-xs text-gray-500 mt-1">UPI ID: {upiId}</p>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-medium text-yellow-900 mb-2">Instructions</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• QR code updates automatically when UPI ID changes</li>
                <li>• Customers can scan with any UPI app</li>
                <li>• Payment verification is manual for now</li>
                <li>• Keep UPI ID active and verified</li>
              </ul>
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
                <span>Save Payment Settings</span>
              </>
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSettings;
