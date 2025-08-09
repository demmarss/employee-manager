import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import { organizationAPI } from '../../services/api';

interface Organization {
  id?: number;
  name: string;
  logo?: string;
  address?: string;
  descriptions?: string;
}

export const OrganizationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === undefined || id === 'create';
  
  const [organization, setOrganization] = useState<Organization>({
    name: '',
    logo: '',
    address: '',
    descriptions: ''
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew && id) {
      fetchOrganization();
    }
  }, [id, isNew]);

  const fetchOrganization = async () => {
    try {
      const response = await organizationAPI.getById(id!);
      setOrganization(response.data);
    } catch (error) {
      console.error('Error fetching organization:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isNew) {
        await organizationAPI.create(organization);
      } else {
        await organizationAPI.update(id!, organization);
      }
      navigate('/organizations');
    } catch (error) {
      console.error('Error saving organization:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof Organization, value: string) => {
    setOrganization(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              to="/organizations"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Organizations
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => navigate('/organizations')}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !organization.name}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
        <h1 className="mt-4 text-3xl font-bold text-gray-900">
          {isNew ? 'Create Organization' : 'Edit Organization'}
        </h1>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-6 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Organization Name *
            </label>
            <input
              type="text"
              id="name"
              value={organization.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter organization name"
            />
          </div>

          <div>
            <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
              Logo URL
            </label>
            <input
              type="url"
              id="logo"
              value={organization.logo}
              onChange={(e) => handleChange('logo', e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="https://example.com/logo.png"
            />
            {organization.logo && (
              <div className="mt-2">
                <img src={organization.logo} alt="Logo preview" className="h-16 w-16 rounded-lg object-cover" />
              </div>
            )}
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <textarea
              id="address"
              rows={3}
              value={organization.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter organization address"
            />
          </div>

          <div>
            <label htmlFor="descriptions" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="descriptions"
              rows={4}
              value={organization.descriptions}
              onChange={(e) => handleChange('descriptions', e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter organization description"
            />
          </div>
        </div>
      </div>
    </div>
  );
};