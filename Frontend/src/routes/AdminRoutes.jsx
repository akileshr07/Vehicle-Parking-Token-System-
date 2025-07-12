import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import Dashboard from '../pages/admin/Dashboard';
import ParkingConfig from '../pages/admin/ParkingConfig';
import PaymentSettings from '../pages/admin/PaymentSettings';
import VehicleManager from '../pages/admin/VehicleManager';
import TokenManager from '../pages/admin/TokenManager';

const AdminRoutes = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/parking-config" element={<ParkingConfig />} />
      <Route path="/payment-settings" element={<PaymentSettings />} />
      <Route path="/vehicle-manager" element={<VehicleManager />} />
      <Route path="/token-manager" element={<TokenManager />} />
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
};

export default AdminRoutes;