export const calculateParkingFee = (vehicleType, entryTime, exitTime = new Date()) => {
  const hourlyRates = {
    car: 20,
    bike: 10,
    ev: 15,
  };

  const maxDailyRates = {
    car: 200,
    bike: 100,
    ev: 150,
  };

  const entry = new Date(entryTime);
  const exit = new Date(exitTime);
  const diffMs = exit - entry;
  const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));

  const baseRate = hourlyRates[vehicleType] || hourlyRates.car;
  const maxRate = maxDailyRates[vehicleType] || maxDailyRates.car;

  const totalFee = Math.min(diffHours * baseRate, maxRate);

  return {
    hours: diffHours,
    hourlyRate: baseRate,
    totalFee: totalFee,
    maxDaily: maxRate,
    isMaxReached: totalFee >= maxRate,
  };
};

export const getVehicleTypeRate = (vehicleType) => {
  const rates = {
    car: 20,
    bike: 10,
    ev: 15,
  };
  return rates[vehicleType] || rates.car;
};