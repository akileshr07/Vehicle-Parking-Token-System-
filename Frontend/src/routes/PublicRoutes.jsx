import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ParkingInfo from '../pages/client/ParkingInfo';
import TokenLookup from '../pages/client/TokenLookup';

const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ParkingInfo />} />
      <Route path="/token-lookup" element={<TokenLookup />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default PublicRoutes;