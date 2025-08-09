import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import { positionAPI, organizationAPI, departmentAPI } from '../../services/api';

interface Position {
  id?: number;
  title: string;
  departmentId: number | '';
  organizationId: number | '';
  description?: string;
  parentPositionId?: number | '';
  hierarchyLevel?: number;
}

interface Organization {
  id: number;
  name: string;
}

interface Department {
  id: number;
  name: string;
  organizationId: number;
}

export const PositionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === undefined || id === 'create';
  
  const [position, setPosition] = useState<Position>({
    title: '',
    departmentId: '',
    organizationId: '',
    description: '',
    parentPositionId: '',
    hierarchyLevel: 1
  });
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>([]);
  const [availableParentPositions, setAvailableParentPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchOrganizations();
    fetchDepartments();
    if (!isNew && id) {
      fetchPosition();
    }
  }, [id, isNew]);

  useEffect(() => {
    if (position.organizationId) {
      const filtered = departments.filter(dept => dept.organizationId === Number(position.organizationId));
      setFilteredDepartments(filtered);
      fetchAvailableParentPositions();
    } else {
      setFilteredDepartments([]);
      setAvailableParentPositions([]);
    }
  }, [position.organizationId, departments]);

  const fetchAvailableParentPositions = async () => {
    try {
      const response = await positionAPI.getAll();
      const positions = response.data.filter((pos: any) => 
        pos.organizationId === Number(position.organizationId) && 
        pos.id !== Number(id)
      );
      setAvailableParentPositions(positions);
    } catch (error) {
      console.error('Error fetching parent positions:', error);
    }
  };
  const fetchOrganizations = async () => {
    try {
      const response = await organizationAPI.getAll();
      setOrganizations(response.data);
    } catch (error) {
      console.error('Error fetching organizations:', error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await departmentAPI.getAll();
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchPosition = async () => {
    try {
      const response = await positionAPI.getById(id!);
      setPosition(response.data);
    } catch (error) {
      console.error('Error fetching position:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isNew) {
        await positionAPI.create(position);
      } else {
        await positionAPI.update(id!, position);
      }
      navigate('/positions');
    } catch (error) {
      console.error('Error saving position:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof Position, value: string | number) => {
    setPosition(prev => ({ 
      ...prev, 
      [field]: value,
      // Reset department when organization changes
      ...(field === 'organizationId' ? { departmentId: '', parentPositionId: '' } : {}),
      // Update hierarchy level when parent changes
      ...(field === 'parentPositionId' ? { 
        hierarchyLevel: value ? getParentHierarchyLevel(Number(value)) + 1 : 1 
      } : {})
    }));
  };

  const getParentHierarchyLevel = (parentId: number): number => {
    const parent = availableParentPositions.find(pos => pos.id === parentId);
    return parent?.hierarchyLevel || 0;
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              to="/positions"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Positions
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => navigate('/positions')}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !position.title || !position.departmentId || !position.organizationId}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
        <h1 className="mt-4 text-3xl font-bold text-gray-900">
          {isNew ? 'Create Position' : 'Edit Position'}
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
              value={position.organizationId}
              onChange={(e) => handleChange('organizationId', Number(e.target.value))}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            >
              <option value="">Select an organization</option>
              {organizations.map(org => (
                <option key={org.id} value={org.id}>{org.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="departmentId" className="block text-sm font-medium text-gray-700">
              Department *
            </label>
            <select
              id="departmentId"
              value={position.departmentId}
              onChange={(e) => handleChange('departmentId', Number(e.target.value))}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              disabled={!position.organizationId}
            >
              <option value="">Select a department</option>
              {filteredDepartments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="parentPositionId" className="block text-sm font-medium text-gray-700">
              Reports To (Parent Position)
            </label>
            <select
              id="parentPositionId"
              value={position.parentPositionId}
              onChange={(e) => handleChange('parentPositionId', e.target.value ? Number(e.target.value) : '')}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              disabled={!position.organizationId}
            >
              <option value="">No parent (Top level position)</option>
              {availableParentPositions.map(pos => (
                <option key={pos.id} value={pos.id}>
                  {pos.title} (Level {pos.hierarchyLevel})
                </option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">
              Select the position this role reports to in the organizational hierarchy
            </p>
          </div>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Position Title *
            </label>
            <input
              type="text"
              id="title"
              value={position.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              placeholder="Enter position title"
            />
          </div>

          <div>
            <label htmlFor="hierarchyLevel" className="block text-sm font-medium text-gray-700">
              Hierarchy Level
            </label>
            <input
              type="number"
              id="hierarchyLevel"
              value={position.hierarchyLevel}
              onChange={(e) => handleChange('hierarchyLevel', Number(e.target.value))}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              min="1"
              max="10"
              disabled={!!position.parentPositionId}
            />
            <p className="mt-1 text-sm text-gray-500">
              {position.parentPositionId 
                ? 'Automatically calculated based on parent position' 
                : 'Level 1 = Executive, Level 2 = Director, Level 3 = Manager, etc.'
              }
            </p>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Job Description
            </label>
            <textarea
              id="description"
              rows={4}
              value={position.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              placeholder="Enter job description and requirements"
            />
          </div>
        </div>
      </div>
    </div>
  );
};