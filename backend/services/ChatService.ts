import { Organization, Department, Position, Employee, EmployeePosition } from '../models/index.js';

interface ChatResponse {
  message: string;
  action?: {
    type: 'navigate' | 'create' | 'update' | 'delete' | 'list';
    route?: string;
    data?: any;
  };
  nextSteps?: string[];
}

export class ChatService {
  async processMessage(message: string, context?: any): Promise<ChatResponse> {
    const lowerMessage = message.toLowerCase().trim();

    // Handle employee-related queries
    if (this.isEmployeeQuery(lowerMessage)) {
      return this.handleEmployeeQuery(lowerMessage, context);
    }

    // Handle organization-related queries
    if (this.isOrganizationQuery(lowerMessage)) {
      return this.handleOrganizationQuery(lowerMessage, context);
    }

    // Handle department-related queries
    if (this.isDepartmentQuery(lowerMessage)) {
      return this.handleDepartmentQuery(lowerMessage, context);
    }

    // Handle position-related queries
    if (this.isPositionQuery(lowerMessage)) {
      return this.handlePositionQuery(lowerMessage, context);
    }

    // Handle organogram-related queries
    if (this.isOrganogramQuery(lowerMessage)) {
      return this.handleOrganogramQuery(lowerMessage, context);
    }
    // Default response
    return {
      message: "I can help you manage employees, organizations, departments, positions, and generate organograms. Try saying something like 'show me employees', 'create a new organization', or 'show organogram for organization'.",
      nextSteps: [
        "View employee list",
        "Create new employee",
        "Manage departments",
        "View organizations",
        "Generate organogram"
      ]
    };
  }

  private isEmployeeQuery(message: string): boolean {
    return message.includes('employee') || message.includes('staff') || message.includes('worker');
  }

  private isOrganizationQuery(message: string): boolean {
    return message.includes('organization') || message.includes('company') || message.includes('org');
  }

  private isDepartmentQuery(message: string): boolean {
    return message.includes('department') || message.includes('dept') || message.includes('division');
  }

  private isPositionQuery(message: string): boolean {
    return message.includes('position') || message.includes('job') || message.includes('role');
  }

  private isOrganogramQuery(message: string): boolean {
    return message.includes('organogram') || message.includes('org chart') || 
           message.includes('organizational chart') || message.includes('hierarchy') ||
           (message.includes('chart') && (message.includes('organization') || message.includes('department')));
  }
  private async handleEmployeeQuery(message: string, context?: any): Promise<ChatResponse> {
    if (message.includes('show') || message.includes('list') || message.includes('view')) {
      return {
        message: "Here are all the employees in the system. I'm navigating to the employee list for you.",
        action: {
          type: 'navigate',
          route: '/employees'
        },
        nextSteps: [
          "View employee details",
          "Create new employee",
          "Assign employee to position",
          "Update employee information"
        ]
      };
    }

    if (message.includes('create') || message.includes('add') || message.includes('new')) {
      return {
        message: "I'll help you create a new employee. Let's start with the basic information.",
        action: {
          type: 'navigate',
          route: '/employees/create'
        },
        nextSteps: [
          "Enter employee name",
          "Provide email address",
          "Set employee role",
          "Upload photo",
          "Assign to department and position"
        ]
      };
    }

    return {
      message: "I can help you with employee management. What would you like to do?",
      nextSteps: [
        "View all employees",
        "Create new employee",
        "Search for specific employee",
        "Assign employee to position"
      ]
    };
  }

  private async handleOrganizationQuery(message: string, context?: any): Promise<ChatResponse> {
    if (message.includes('show') || message.includes('list') || message.includes('view')) {
      return {
        message: "Displaying all organizations. I'm taking you to the organizations page.",
        action: {
          type: 'navigate',
          route: '/organizations'
        },
        nextSteps: [
          "View organization details",
          "Create new organization",
          "Edit organization info",
          "Manage departments",
          "View organization chart"
        ]
      };
    }

    if (message.includes('create') || message.includes('add') || message.includes('new')) {
      return {
        message: "Let's create a new organization. I'll need some basic information to get started.",
        action: {
          type: 'navigate',
          route: '/organizations/create'
        },
        nextSteps: [
          "Enter organization name",
          "Add organization address",
          "Upload company logo",
          "Add description",
          "Create departments"
        ]
      };
    }

    return {
      message: "I can help you manage organizations. What would you like to do?",
      nextSteps: [
        "View all organizations",
        "Create new organization",
        "Edit existing organization",
        "Manage organization departments",
        "View organizational chart"
      ]
    };
  }

  private async handleDepartmentQuery(message: string, context?: any): Promise<ChatResponse> {
    if (message.includes('show') || message.includes('list') || message.includes('view')) {
      return {
        message: "Here are all departments across all organizations. Navigating to the departments page.",
        action: {
          type: 'navigate',
          route: '/departments'
        },
        nextSteps: [
          "View department details",
          "Create new department",
          "Assign employees",
          "Create positions",
          "View department organogram"
        ]
      };
    }

    if (message.includes('create') || message.includes('add') || message.includes('new')) {
      return {
        message: "I'll help you create a new department. First, let me know which organization this department belongs to.",
        action: {
          type: 'navigate',
          route: '/departments/create'
        },
        nextSteps: [
          "Select organization",
          "Enter department name",
          "Set department code",
          "Add description",
          "Create positions"
        ]
      };
    }

    return {
      message: "I can help you with department management. What would you like to do?",
      nextSteps: [
        "View all departments",
        "Create new department",
        "Assign employees to departments",
        "Manage department positions",
        "View department organogram"
      ]
    };
  }

  private async handlePositionQuery(message: string, context?: any): Promise<ChatResponse> {
    if (message.includes('show') || message.includes('list') || message.includes('view')) {
      return {
        message: "Showing all available positions. I'm navigating to the positions page.",
        action: {
          type: 'navigate',
          route: '/positions'
        },
        nextSteps: [
          "View position details",
          "Create new position",
          "Assign employees",
          "Edit position requirements",
          "Set position hierarchy"
        ]
      };
    }

    if (message.includes('create') || message.includes('add') || message.includes('new')) {
      return {
        message: "Let's create a new position. I'll need to know which department and organization this position belongs to.",
        action: {
          type: 'navigate',
          route: '/positions/create'
        },
        nextSteps: [
          "Select organization",
          "Choose department",
          "Enter position title",
          "Set reporting hierarchy",
          "Add job description",
          "Assign employees"
        ]
      };
    }

    return {
      message: "I can help you manage positions. What would you like to do?",
      nextSteps: [
        "View all positions",
        "Create new position",
        "Assign employees to positions",
        "Update position descriptions",
        "Manage position hierarchy"
      ]
    };
  }

  private async handleOrganogramQuery(message: string, context?: any): Promise<ChatResponse> {
    // Extract organization or department ID from context if available
    const orgMatch = message.match(/organization\s+(\d+)|org\s+(\d+)/i);
    const deptMatch = message.match(/department\s+(\d+)|dept\s+(\d+)/i);

    if (orgMatch) {
      const orgId = orgMatch[1] || orgMatch[2];
      return {
        message: `Displaying the organizational chart for organization ${orgId}. This shows the complete hierarchy and reporting structure.`,
        action: {
          type: 'navigate',
          route: `/organogram/organization/${orgId}`
        },
        nextSteps: [
          "View position details",
          "Edit position hierarchy",
          "Assign employees to positions",
          "Create new positions",
          "Export organogram"
        ]
      };
    }

    if (deptMatch) {
      const deptId = deptMatch[1] || deptMatch[2];
      return {
        message: `Showing the organizational chart for department ${deptId}. This displays the hierarchy within this specific department.`,
        action: {
          type: 'navigate',
          route: `/organogram/department/${deptId}`
        },
        nextSteps: [
          "View position details",
          "Edit position hierarchy",
          "Assign employees to positions",
          "Create new positions",
          "Export organogram"
        ]
      };
    }

    // If no specific ID mentioned, guide user to select
    if (message.includes('organization') || message.includes('company')) {
      return {
        message: "I can show you organizational charts for any organization. Let me take you to the organizations page where you can select which one to view.",
        action: {
          type: 'navigate',
          route: '/organizations'
        },
        nextSteps: [
          "Select an organization",
          "Click the organogram icon",
          "View hierarchical structure",
          "Edit position relationships",
          "Export the chart"
        ]
      };
    }

    if (message.includes('department')) {
      return {
        message: "I can display department-specific organizational charts. Let me navigate to the departments page where you can choose which department's structure to view.",
        action: {
          type: 'navigate',
          route: '/departments'
        },
        nextSteps: [
          "Select a department",
          "Click the organogram icon",
          "View department hierarchy",
          "Manage position relationships",
          "Export the chart"
        ]
      };
    }

    return {
      message: "I can help you generate and view organizational charts (organograms) that show the hierarchy and reporting structure of positions. What would you like to see?",
      nextSteps: [
        "View organization chart",
        "View department chart",
        "Create position hierarchy",
        "Manage reporting relationships",
        "Export organogram"
      ]
    };
  }
}