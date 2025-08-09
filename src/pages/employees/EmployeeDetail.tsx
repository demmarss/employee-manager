import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, X, Camera, Upload } from 'lucide-react';
import { employeeAPI } from '../../services/api';

interface Employee {
  id?: number;
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  address?: string;
  roles?: string[];
  dateOfBirth?: string;
  photoUrl?: string;
}

export const EmployeeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === undefined || id === 'create';
  
  const [employee, setEmployee] = useState<Employee>({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    address: '',
    roles: [],
    dateOfBirth: '',
    photoUrl: ''
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [newRole, setNewRole] = useState('');

  useEffect(() => {
    if (!isNew && id) {
      fetchEmployee();
    }
  }, [id, isNew]);

  const fetchEmployee = async () => {
    try {
      const response = await employeeAPI.getById(id!);
      setEmployee(response.data);
    } catch (error) {
      console.error('Error fetching employee:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isNew) {
        await employeeAPI.create(employee);
      } else {
        await employeeAPI.update(id!, employee);
      }
      navigate('/employees');
    } catch (error) {
      console.error('Error saving employee:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof Employee, value: any) => {
    setEmployee(prev => ({ ...prev, [field]: value }));
  };

  const handleAddRole = () => {
    if (newRole.trim() && !employee.roles?.includes(newRole.trim())) {
      handleChange('roles', [...(employee.roles || []), newRole.trim()]);
      setNewRole('');
    }
  };

  const handleRemoveRole = (roleToRemove: string) => {
    handleChange('roles', employee.roles?.filter(role => role !== roleToRemove) || []);
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real application, you would upload to a storage service
      // For now, we'll create a local URL
      const photoUrl = URL.createObjectURL(file);
      handleChange('photoUrl', photoUrl);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              to="/employees"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Employees
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => navigate('/employees')}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !employee.name || !employee.email}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
        <h1 className="mt-4 text-3xl font-bold text-gray-900">
          {isNew ? 'Create Employee' : 'Edit Employee'}
        </h1>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-6 space-y-6">
          {/* Photo Upload */}
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0">
              {employee.photoUrl ? (
                <img className="h-20 w-20 rounded-full object-cover" src={employee.photoUrl} alt="Employee" />
              ) : (
                <div className="h-20 w-20 rounded-full bg-orange-500 flex items-center justify-center">
                  <Camera className="h-8 w-8 text-white" />
                </div>
              )}
            </div>
            <div className="flex space-x-2">
              <label className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                <Upload className="h-4 w-4 mr-2" />
                Upload Photo
                <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
              </label>
              <input
                type="url"
                placeholder="Or paste photo URL"
                value={employee.photoUrl}
                onChange={(e) => handleChange('photoUrl', e.target.value)}
                className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                value={employee.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                placeholder="Enter full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                value={employee.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                placeholder="Enter email address"
              />
            </div>

            {isNew && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password *
                </label>
                <input
                  type="password"
                  id="password"
                  value={employee.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  placeholder="Enter password"
                />
              </div>
            )}

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                value={employee.phoneNumber}
                onChange={(e) => handleChange('phoneNumber', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <input
                type="date"
                id="dateOfBirth"
                value={employee.dateOfBirth}
                onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <textarea
              id="address"
              rows={3}
              value={employee.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              placeholder="Enter full address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Roles
            </label>
            <div className="flex space-x-2 mb-3">
              <input
                type="text"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                placeholder="Add a role (e.g., Manager, Developer)"
                className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                onKeyPress={(e) => e.key === 'Enter' && handleAddRole()}
              />
              <button
                type="button"
                onClick={handleAddRole}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {employee.roles?.map((role, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800"
                >
                  {role}
                  <button
                    type="button"
                    onClick={() => handleRemoveRole(role)}
                    className="ml-2 inline-flex items-center p-0.5 rounded-full text-orange-400 hover:text-orange-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};