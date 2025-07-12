import React from 'react';
import { Car, Bike, Zap } from 'lucide-react';

const VehicleTag = ({ type, size = 'md' }) => {
  const vehicleConfig = {
    car: { icon: Car, color: 'bg-blue-100 text-blue-800', label: 'Car' },
    bike: { icon: Bike, color: 'bg-green-100 text-green-800', label: 'Bike' },
    ev: { icon: Zap, color: 'bg-yellow-100 text-yellow-800', label: 'EV' },
  };

  const config = vehicleConfig[type.toLowerCase()] || vehicleConfig.car;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span className={`inline-flex items-center space-x-1 ${config.color} ${sizeClasses[size]} rounded-full font-medium`}>
      <Icon className="h-3 w-3" />
      <span>{config.label}</span>
    </span>
  );
};

export default VehicleTag;