import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Settings, Users, Building, MapPin } from 'lucide-react';
import { OrganogramChart } from '../../components/OrganogramChart';
import { organogramAPI, organizationAPI, departmentAPI } from '../../services/api';

interface Organization {
  id: number;
  name: string;
  logo?: string;
}

interface Department {
  id: number;
  name: string;
  code?: string;
}

export const OrganogramView: React.FC = () => {
  const { type, id } = useParams<{ type: 'organization' | 'department'; id: string }>();
  const [organogramData, setOrganogramData] = useState([]);
  const [entityData, setEntityData] = useState<Organization | Department | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (type && id) {
      fetchOrganogramData();
      fetchEntityData();
    }
  }, [type, id]);

  const fetchOrganogramData = async () => {
    try {
      let response;
      if (type === 'organization') {
        response = await organogramAPI.getOrganizationChart(id!);
      } else {
        response = await organogramAPI.getDepartmentChart(id!);
      }
      setOrganogramData(response.data);
    } catch (error) {
      console.error('Error fetching organogram data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEntityData = async () => {
    try {
      let response;
      if (type === 'organization') {
        response = await organizationAPI.getById(id!);
      } else {
        response = await departmentAPI.getById(id!);
      }
      setEntityData(response.data);
    } catch (error) {
      console.error('Error fetching entity data:', error);
    }
  };

  const handleEditPosition = (position: any) => {
    // Navigate to position edit page
    window.location.href = `/positions/${position.id}`;
  };

  const handleAssignEmployee = (position: any) => {
    // Open employee assignment modal or navigate to assignment page
    console.log('Assign employee to position:', position);
  };

  const handleExportOrganogram = () => {
    // Export organogram as PDF or image
    console.log('Export organogram');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getBackLink = () => {
    return type === 'organization' ? '/organizations' : '/departments';
  };

  const getIcon = () => {
    return type === 'organization' ? Building : MapPin;
  };

  const Icon = getIcon();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                to={getBackLink()}
                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to {type === 'organization' ? 'Organizations' : 'Departments'}
              </Link>
              <div className="flex items-center space-x-3">
                <Icon className="h-6 w-6 text-gray-400" />
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    {entityData?.name} Organogram
                  </h1>
                  <p className="text-sm text-gray-500">
                    Organizational structure and hierarchy
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleExportOrganogram}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
              <Link
                to={`/positions/create`}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Users className="h-4 w-4 mr-2" />
                Add Position
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Organogram Content */}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {organogramData.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 overflow-x-auto">
            <OrganogramChart
              data={organogramData}
              onEditPosition={handleEditPosition}
              onAssignEmployee={handleAssignEmployee}
            />
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No positions found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating positions for this {type}.
            </p>
            <div className="mt-6">
              <Link
                to="/positions/create"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Users className="h-4 w-4 mr-2" />
                Create First Position
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Hierarchy Legend</h3>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-700">Level 1 - Executive</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-purple-500"></div>
              <span className="text-sm text-gray-700">Level 2 - Director</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-700">Level 3 - Manager</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-orange-500"></div>
              <span className="text-sm text-gray-700">Level 4 - Supervisor</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-gray-500"></div>
              <span className="text-sm text-gray-700">Level 5+ - Staff</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};