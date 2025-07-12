import React, { useState } from "react";
import {
  Search,
  Ticket,
  Clock,
  MapPin,
  CreditCard,
  AlertCircle,
  RefreshCw,
  Timer,
} from "lucide-react";
import VehicleTag from "../../components/VehicleTag";
import QRCodeImage from "../../components/QRCodeImage";
import Loader from "../../components/Loader";

export const BASE_URL = "http://localhost:8080/api";

const TokenLookup = () => {
  const [token, setToken] = useState("");
  const [tokenData, setTokenData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastSearched, setLastSearched] = useState("");

  const handleSearch = async () => {
    if (!token.trim()) {
      setError("Please enter a token");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/parking/${token}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Token not found");
      }
      const result = await response.json();
      setTokenData(result.data);
    } catch (error) {
      setError(
        error.message ||
          "Token not found. Please check your token and try again."
      );
      setTokenData(null);
    } finally {
      setLoading(false);
      setLastSearched(token);
    }
  };

  const handleRefresh = async () => {
    if (lastSearched) {
      setToken(lastSearched);
      await handleSearch();
    }
  };

  const formatTime = (timestamp) => new Date(timestamp).toLocaleString();

  const calculateDuration = (entryTime) => {
    const now = new Date();
    const entry = new Date(entryTime);
    const diffMs = now - entry;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffHours}h ${diffMinutes}m`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "paid":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
          <Ticket className="h-8 w-8 text-blue-600" />
          <span>Token Lookup</span>
        </h1>
        <p className="text-gray-600 mt-2">
          Enter your parking token to view status and make payments
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Token ID
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value.toUpperCase())}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your token (e.g., ABC123)"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
          </div>
          <div className="flex items-end space-x-2">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader size="sm" text="" /> : "Search"}
            </button>
            {tokenData && (
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
                <span>Refresh</span>
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>

      {tokenData && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Parking Details
            </h2>
            <div className="flex items-center space-x-2 mt-2 md:mt-0">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  tokenData.status
                )}`}
              >
                {tokenData.status.charAt(0).toUpperCase() +
                  tokenData.status.slice(1)}
              </span>
              <span className="text-xs text-gray-500">
                Last updated: {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Vehicle and Parking Information */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <Timer className="h-6 w-6 mx-auto text-blue-600 mb-2" />
                  <p className="text-sm font-medium text-blue-900">Duration</p>
                  <p className="text-lg font-bold text-blue-600">
                    {calculateDuration(tokenData.entryTime)}
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <CreditCard className="h-6 w-6 mx-auto text-green-600 mb-2" />
                  <p className="text-sm font-medium text-green-900">
                    Current Fee
                  </p>
                  <p className="text-lg font-bold text-green-600">
                    ₹{tokenData.fees}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Vehicle Information
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Token ID:
                    </span>
                    <span className="text-lg font-bold text-blue-600">
                      {tokenData.token}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Vehicle Type:
                    </span>
                    <VehicleTag type={tokenData.vehicleType} size="sm" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Vehicle Number:
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {tokenData.vehicleNumber}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Location:
                    </span>
                    <span className="text-sm text-gray-900 flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{tokenData.location}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Timing & Fees
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Entry Time:
                    </span>
                    <span className="text-sm text-gray-900 flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatTime(tokenData.entryTime)}</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Duration:
                    </span>
                    <span className="text-sm font-bold text-blue-600">
                      {calculateDuration(tokenData.entryTime)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Parking Fees:
                    </span>
                    <span className="text-lg font-bold text-green-600 flex items-center space-x-1">
                      <CreditCard className="h-4 w-4" />
                      <span>₹{tokenData.fees}</span>
                    </span>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Fee calculation updates every hour</span>
                      <span>Max daily: ₹200</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Payment QR Code
                </h3>
                <div className="text-center">
                  <QRCodeImage qrData={tokenData.qr} size="lg" />
                  <p className="text-sm text-gray-600 mt-3">
                    Scan this QR code with any UPI app to pay
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Amount: ₹{tokenData.fees}
                  </p>
                  <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-700">
                      UPI ID: 9876543210@xyz
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">
                  Payment Instructions
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Scan the QR code with any UPI app</li>
                  <li>• Verify the amount: ₹{tokenData.fees}</li>
                  <li>• Complete the payment</li>
                  <li>• Keep the receipt for exit</li>
                  <li>• Payment is valid for 24 hours</li>
                </ul>
              </div>

          
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenLookup;
