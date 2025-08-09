import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import { departmentAPI, organizationAPI } from '../../services/api';

interface Department {
  id?: number;
  name: string;
  organizationId: number | '';
  description?: string;
  code?: string;
}

interface Organization {
  id: number;
  name: string;
}

export const DepartmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === undefined || id === 'create';
  
  const [department, setDepartment] = useState<Department>({
    name: '',
    organizationId: '',
    description: '',
    code: ''
  });
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchOrganizations();
    if (!isNew && id) {
      fetchDepartment();
    }
  }, [id, isNew]);

  const fetchOrganizations = async () => {
    try {
      const response = await organizationAPI.getAll();
      setOrganizations(response.data);
    } catch (error) {
      console.error('Error fetching organizations:', error);
    }
  };

  const fetchDepartment = async () => {
    try {
      const response = await departmentAPI.getById(id!);
      setDepartment(response.data);
    } catch (error) {
      console.error('Error fetching department:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isNew) {
        await departmentAPI.create(department);
      } else {
        await departmentAPI.update(id!, department);
      }
      navigate('/departments');
    } catch (error) {
      console.error('Error saving department:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof Department, value: string | number) => {
    setDepartment(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              to="/departments"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Departments
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => navigate('/departments')}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !department.name || !department.organizationId}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
        <h1 className="mt-4 text-3xl font-bold text-gray-900">
          {isNew ? 'Create Department' : 'Edit Department'}
        </h1>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-6 space-y-6">
          <div>
            <label htmlFor="organizationId" className="block text-sm font-medium text-gray-700">
              Organization *
            </label>
            <select
              id="organizationId"
              value={department.organizationId}
              onChange={(e) => handleChange('organizationId', Number(e.target.value))}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
            >
              <option value="">Select an organization</option>
              {organizations.map(org => (
                <option key={org.id} value={org.id}>{org.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Department Name *
            </label>
            <input
              type="text"
              id="name"
              value={department.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
              placeholder="Enter department name"
            />
          </div>

          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700">
              Department Code
            </label>
            <input
              type="text"
              id="code"
              value={department.code}
              onChange={(e) => handleChange('code', e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
              placeholder="e.g., HR, IT, FINANCE"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              value={department.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
              placeholder="Enter department description"
            />
          </div>
        </div>
      </div>
    </div>
  );
};