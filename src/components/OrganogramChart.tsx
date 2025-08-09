import React, { useState, useEffect } from 'react';
import { Users, ChevronDown, ChevronRight, Edit, User } from 'lucide-react';

interface Employee {
  id: number;
  name: string;
  photoUrl?: string;
}

interface Position {
  id: number;
  title: string;
  description?: string;
  hierarchyLevel: number;
  hierarchyPath?: string;
  department: {
    id: number;
    name: string;
    code?: string;
  };
  employeePositions: {
    employee: Employee;
  }[];
  children: Position[];
}

interface OrganogramChartProps {
  data: Position[];
  onEditPosition?: (position: Position) => void;
  onAssignEmployee?: (position: Position) => void;
}

export const OrganogramChart: React.FC<OrganogramChartProps> = ({
  data,
  onEditPosition,
  onAssignEmployee
}) => {
  return (
    <div className="organogram-container">
      {data.map((position) => (
        <PositionNode
          key={position.id}
          position={position}
          onEditPosition={onEditPosition}
          onAssignEmployee={onAssignEmployee}
        />
      ))}
    </div>
  );
};

interface PositionNodeProps {
  position: Position;
  onEditPosition?: (position: Position) => void;
  onAssignEmployee?: (position: Position) => void;
}

const PositionNode: React.FC<PositionNodeProps> = ({
  position,
  onEditPosition,
  onAssignEmployee
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = position.children && position.children.length > 0;
  const currentEmployee = position.employeePositions?.[0]?.employee;

  const getHierarchyColor = (level: number) => {
    const colors = [
      'bg-blue-500',    // Level 1 - CEO/President
      'bg-purple-500',  // Level 2 - VPs/Directors
      'bg-green-500',   // Level 3 - Managers
      'bg-orange-500',  // Level 4 - Supervisors
      'bg-gray-500',    // Level 5+ - Staff
    ];
    return colors[Math.min(level - 1, colors.length - 1)] || 'bg-gray-500';
  };

  return (
    <div className="position-node">
      <div className="flex flex-col items-center">
        {/* Position Card */}
        <div className={`relative bg-white rounded-lg shadow-lg border-2 border-gray-200 p-4 min-w-64 max-w-80 hover:shadow-xl transition-shadow duration-200`}>
          {/* Hierarchy Level Indicator */}
          <div className={`absolute -top-2 -left-2 w-6 h-6 rounded-full ${getHierarchyColor(position.hierarchyLevel)} flex items-center justify-center text-white text-xs font-bold`}>
            {position.hierarchyLevel}
          </div>

          {/* Position Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                {position.title}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {position.department.name}
              </p>
            </div>
            <div className="flex space-x-1">
              {onEditPosition && (
                <button
                  onClick={() => onEditPosition(position)}
                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  title="Edit Position"
                >
                  <Edit className="h-3 w-3" />
                </button>
              )}
              {hasChildren && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  title={isExpanded ? 'Collapse' : 'Expand'}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Employee Information */}
          <div className="border-t pt-3">
            {currentEmployee ? (
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {currentEmployee.photoUrl ? (
                    <img
                      src={currentEmployee.photoUrl}
                      alt={currentEmployee.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {currentEmployee.name}
                  </p>
                  <p className="text-xs text-gray-500">Current Holder</p>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 mb-2">
                  <Users className="h-4 w-4 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500 mb-2">Position Vacant</p>
                {onAssignEmployee && (
                  <button
                    onClick={() => onAssignEmployee(position)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Assign Employee
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Position Description */}
          {position.description && (
            <div className="mt-3 pt-3 border-t">
              <p className="text-xs text-gray-600 line-clamp-2">
                {position.description}
              </p>
            </div>
          )}
        </div>

        {/* Connection Lines and Children */}
        {hasChildren && isExpanded && (
          <div className="mt-4">
            {/* Vertical Line */}
            <div className="w-px h-6 bg-gray-300 mx-auto"></div>
            
            {/* Horizontal Line */}
            <div className="flex items-center">
              <div className="flex-1 h-px bg-gray-300"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full mx-1"></div>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* Children Container */}
            <div className="flex justify-center mt-6">
              <div className="flex space-x-8">
                {position.children.map((child) => (
                  <div key={child.id} className="flex flex-col items-center">
                    {/* Vertical Line to Child */}
                    <div className="w-px h-6 bg-gray-300"></div>
                    <PositionNode
                      position={child}
                      onEditPosition={onEditPosition}
                      onAssignEmployee={onAssignEmployee}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};