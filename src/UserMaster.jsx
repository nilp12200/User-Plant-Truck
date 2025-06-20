import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MODULE_RIGHTS = [
  { label: 'Admin', value: 'admin' },
  { label: 'GateKeeper', value: 'gatekeeper' },
  { label: 'Report', value: 'report' },
  { label: 'Dispatch', value: 'dispatch' },
  { label: 'Loader', value: 'loader' },
];

export default function UserMaster() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    contactNumber: '',
    moduleRights: [],
    allowedPlants: [],
  });
  const [plantList, setPlantList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPlants();
  }, []);

  const fetchPlants = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/plants');
      setPlantList(res.data);
    } catch {
      console.error('Error fetching plant list');
    }
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleModuleRightChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      moduleRights: checked
        ? [...prev.moduleRights, value]
        : prev.moduleRights.filter((v) => v !== value),
    }));
  };

  const handlePlantChange = (e) => {
    const value = Number(e.target.value);
    const checked = e.target.checked;
    setFormData((prev) => ({
      ...prev,
      allowedPlants: checked
        ? [...prev.allowedPlants, value]
        : prev.allowedPlants.filter((v) => v !== value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    // Validation: At least one plant must be selected
    if (formData.allowedPlants.length === 0) {
      setMessage('❌ Please select at least one allowed plant.');
      return;
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:3001/api/users', formData);
      setMessage('✅ User created successfully!');
      setFormData({ username: '', password: '', contactNumber: '', moduleRights: [], allowedPlants: [] });
    } catch {
      setMessage('❌ Error creating user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4">
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-2xl transform transition-all duration-300 hover:shadow-3xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          User Master
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="mt-1 block w-full rounded-xl border-2 border-gray-200 shadow-sm p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full rounded-xl border-2 border-gray-200 shadow-sm p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Number</label>
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              className="mt-1 block w-full rounded-xl border-2 border-gray-200 shadow-sm p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Module Rights</label>
            <div className="flex flex-wrap gap-4">
              {MODULE_RIGHTS.map((right) => (
                <label key={right.value} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={right.value}
                    checked={formData.moduleRights.includes(right.value)}
                    onChange={handleModuleRightChange}
                  />
                  {right.label}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Allowed Plants</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto border rounded-xl p-2">
              {[...new Map(plantList.map(plant => [plant.PlantID, plant])).values()].map((plant) => (
                <label key={plant.PlantID}>
                  <input
                    type="checkbox"
                    value={plant.PlantID}
                    checked={formData.allowedPlants.includes(plant.PlantID)}
                    onChange={handlePlantChange}
                  />
                  {plant.PlantName}
                </label>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
            disabled={loading || formData.allowedPlants.length === 0}
          >
            {loading ? 'Saving...' : 'Create User'}
          </button>
          {message && <div className="text-center mt-4 font-semibold text-blue-700">{message}</div>}
        </form>
      </div>
    </div>
  );
} 