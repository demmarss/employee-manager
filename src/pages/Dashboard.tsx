import React, { useState, useEffect } from 'react';
import { Building, Users, MapPin, Briefcase, Database, Play } from 'lucide-react';
import { organizationAPI, departmentAPI, positionAPI, employeeAPI } from '../services/api';
import api from '../services/api';

interface DashboardStats {
  organizations: number;
  departments: number;
  positions: number;
  employees: number;
}

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    organizations: 0,
    departments: 0,
    positions: 0,
    employees: 0
  });
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [orgsResponse, deptsResponse, positionsResponse, employeesResponse] = await Promise.all([
          organizationAPI.getAll(),
          departmentAPI.getAll(),
          positionAPI.getAll(),
          employeeAPI.getAll()
        ]);

        setStats({
          organizations: orgsResponse.data.length,
          departments: deptsResponse.data.length,
          positions: positionsResponse.data.length,
          employees: employeesResponse.data.length
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleRunSeeders = async () => {
    if (!window.confirm('This will clear existing data and populate the database with sample data. Continue?')) {
      return;
    }

    setSeeding(true);
    try {
      const response = await api.post('/seeders/run');
      if (response.data.success) {
        alert('Database seeded successfully! Refreshing data...');
        fetchStats(); // Refresh the stats
      }
    } catch (error) {
      console.error('Error running seeders:', error);
      alert('Failed to seed database. Check console for details.');
    } finally {
      setSeeding(false);
    }
  };
  const statCards = [
    {
      name: 'Organizations',
      value: stats.organizations,
      icon: Building,
      color: 'bg-blue-500',
      href: '/organizations'
    },
    {
      name: 'Departments',
      value: stats.departments,
      icon: MapPin,
      color: 'bg-green-500',
      href: '/departments'
    },
    {
      name: 'Positions',
      value: stats.positions,
      icon: Briefcase,
      color: 'bg-purple-500',
      href: '/positions'
    },
    {
      name: 'Employees',
      value: stats.employees,
      icon: Users,
      color: 'bg-orange-500',
      href: '/employees'
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome to Employee Manager. Here's an overview of your organization.</p>
      </div>

      {/* Seeder Section */}
      <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Database className="h-8 w-8 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Sample Data</h3>
              <p className="text-sm text-gray-600">
                Populate your database with realistic organizational data including 3 organizations, 
                13 departments, 25+ positions with hierarchy, and 16 employees with assignments.
              </p>
            </div>
          </div>
          <button
            onClick={handleRunSeeders}
            disabled={seeding}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {seeding ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Seeding...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Run Sample Data
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.name}
            className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => window.location.href = card.href}
          >
            <dt>
              <div className={`absolute rounded-md p-3 ${card.color}`}>
                <card.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 text-sm font-medium text-gray-500 truncate">{card.name}</p>
            </dt>
            <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
            </dd>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Getting Started</h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Use the AI assistant to help you manage your organization. Try saying:</p>
          </div>
          <div className="mt-4 space-y-2">
            <div className="bg-gray-50 p-3 rounded">
              <code className="text-sm text-blue-600">"Show me all employees"</code>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <code className="text-sm text-blue-600">"Create a new organization"</code>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <code className="text-sm text-blue-600">"Add a new department"</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};