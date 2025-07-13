import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Trash2,
  Calendar,
  Clock,
  Plus,
  Car,
  Bike,
  Zap,
  MapPin,
  CheckCircle,
} from "lucide-react";
import VehicleTag from "../../components/VehicleTag";
import Loader from "../../components/Loader";
import { BASE_URL } from '../../config/baseurl';

const VehicleManager = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  // Add Vehicle Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [addVehicleForm, setAddVehicleForm] = useState({
    number: "",
    type: "car",
    location: "Lot A",
  });
  const [addingVehicle, setAddingVehicle] = useState(false);
  const [addSuccess, setAddSuccess] = useState(null);

  // // Mock data - replace with API call
  // const mockVehicles = [
  //   {
  //     id: 1,
  //     type: "car",
  //     number: "TN01AB1234",
  //     entryTime: "2024-01-15T10:00:00Z",
  //     token: "ABC123",
  //   },
  //   {
  //     id: 2,
  //     type: "bike",
  //     number: "TN02CD5678",
  //     entryTime: "2024-01-15T11:30:00Z",
  //     token: "DEF456",
  //   },
  //   {
  //     id: 3,
  //     type: "ev",
  //     number: "TN03EF9012",
  //     entryTime: "2024-01-15T09:15:00Z",
  //     token: "GHI789",
  //   },
  //   {
  //     id: 4,
  //     type: "car",
  //     number: "TN04GH3456",
  //     entryTime: "2024-01-15T12:00:00Z",
  //     token: "JKL012",
  //   },
  //   {
  //     id: 5,
  //     type: "bike",
  //     number: "TN05IJ7890",
  //     entryTime: "2024-01-15T08:45:00Z",
  //     token: "MNO345",
  //   },
  // ];

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    filterAndSortVehicles();
  }, [vehicles, searchTerm, filterType, sortOrder]);

  // const BASE_URL = "http://localhost:8080/api";

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/vehicles`);
      const data = await response.json();
      setVehicles(data.vehicles || []);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortVehicles = () => {
    let filtered = vehicles;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (vehicle) =>
          vehicle.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehicle.token.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply type filter
    if (filterType !== "all") {
      filtered = filtered.filter((vehicle) => vehicle.type === filterType);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.entryTime) - new Date(a.entryTime);
      } else {
        return new Date(a.entryTime) - new Date(b.entryTime);
      }
    });

    setFilteredVehicles(filtered);
  };

  const handleDelete = async (vehicleId) => {
  if (window.confirm('Are you sure you want to delete this vehicle?')) {
    try {
      const response = await fetch(`${BASE_URL}/vehicles/${vehicleId}`, {
        method: 'DELETE'
      });
      const result = await response.json();

      if (result.success) {
        setVehicles(vehicles.filter(v => v.id !== vehicleId));
      } else {
        alert(result.message || 'Failed to delete vehicle.');
      }
    } catch (error) {
      alert('Error deleting vehicle');
    }
  }
};


  const handleAddVehicle = async (e) => {
  e.preventDefault();

  if (!addVehicleForm.number.trim()) {
    alert('Please enter vehicle number');
    return;
  }

  setAddingVehicle(true);
  setAddSuccess(null);

  try {
    const response = await fetch(`${BASE_URL}/vehicles/entry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: addVehicleForm.type,
        number: addVehicleForm.number.toUpperCase(),
        location: addVehicleForm.location
      })
    });

    const result = await response.json();
    const newVehicle = result.vehicle;
    setVehicles([newVehicle, ...vehicles]);
    setAddSuccess({
      token: newVehicle.token,
      entryTime: newVehicle.entryTime,
      location: newVehicle.location
    });

    setAddVehicleForm({ number: '', type: 'car', location: 'Lot A' });
  } catch (error) {
    alert('Error adding vehicle. Please try again.');
  } finally {
    setAddingVehicle(false);
  }
};
;

  // const generateMockToken = () => {
  //   const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  //   let token = "";
  //   for (let i = 0; i < 6; i++) {
  //     token += chars.charAt(Math.floor(Math.random() * chars.length));
  //   }
  //   return token;
  // };

  const handleFormChange = (field, value) => {
    setAddVehicleForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const vehicleTypeOptions = [
    { value: "car", label: "Car", icon: Car, color: "text-blue-600" },
    { value: "bike", label: "Bike", icon: Bike, color: "text-green-600" },
    {
      value: "ev",
      label: "Electric Vehicle",
      icon: Zap,
      color: "text-yellow-600",
    },
  ];

  const locationOptions = [
    "Lot A",
    "Lot B",
    "Lot C",
    "Ground Floor",
    "First Floor",
  ];

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Loader text="Loading vehicles..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
          <Calendar className="h-8 w-8 text-blue-600" />
          <span>Vehicle Manager</span>
        </h1>
        <p className="text-gray-600 mt-2">
          View and manage all parked vehicles
        </p>
      </div>

      {/* Add Vehicle Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
            <Plus className="h-5 w-5 text-blue-600" />
            <span>Add New Vehicle</span>
          </h2>
          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              setAddSuccess(null);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>{showAddForm ? "Hide Form" : "Add Vehicle"}</span>
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddVehicle} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Number *
                </label>
                <input
                  type="text"
                  value={addVehicleForm.number}
                  onChange={(e) =>
                    handleFormChange("number", e.target.value.toUpperCase())
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="TN01AB1234"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Type
                </label>
                <select
                  value={addVehicleForm.type}
                  onChange={(e) => handleFormChange("type", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {vehicleTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parking Location
                </label>
                <select
                  value={addVehicleForm.location}
                  onChange={(e) => handleFormChange("location", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {locationOptions.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={addingVehicle}
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addingVehicle ? (
                  <Loader size="sm" text="Adding..." />
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    <span>Add Vehicle</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Success Message */}
        {addSuccess && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <h3 className="font-medium text-green-900">
                Vehicle Added Successfully!
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-green-700">
                  Token Generated:
                </span>
                <p className="text-lg font-bold text-green-800">
                  {addSuccess.token}
                </p>
              </div>
              <div>
                <span className="font-medium text-green-700">Entry Time:</span>
                <p className="text-green-800">
                  {formatTime(addSuccess.entryTime)}
                </p>
              </div>
              <div>
                <span className="font-medium text-green-700">Location:</span>
                <p className="text-green-800 flex items-center space-x-1">
                  <MapPin className="h-3 w-3" />
                  <span>{addSuccess.location}</span>
                </p>
              </div>
            </div>
            <p className="text-xs text-green-600 mt-2">
              Please provide this token to the vehicle owner for future
              reference.
            </p>
          </div>
        )}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search by number or token..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vehicle Type
            </label>
            <div className="relative">
              <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="car">Car</option>
                <option value="bike">Bike</option>
                <option value="ev">Electric Vehicle</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort Order
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicles Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Token
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entry Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <VehicleTag type={vehicle.type} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {vehicle.number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {vehicle.token}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatTime(vehicle.entryTime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDelete(vehicle.id)}
                        className="text-red-600 hover:text-red-900 flex items-center space-x-1 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredVehicles.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-500">
              <Car className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No vehicles found</p>
              <p className="text-sm">
                Try adjusting your search criteria or add a new vehicle.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleManager;
