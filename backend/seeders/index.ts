import { sequelize } from '../database/connection.js';
import { Organization } from '../models/Organization.js';
import { Department } from '../models/Department.js';
import { Position } from '../models/Position.js';
import { Employee } from '../models/Employee.js';
import { EmployeePosition } from '../models/EmployeePosition.js';

export class DatabaseSeeder {
  async run() {
    try {
      console.log('🌱 Starting database seeding...');
      
      // Clear existing data
      await this.clearDatabase();
      
      // Seed organizations
      const organizations = await this.seedOrganizations();
      
      // Seed departments
      const departments = await this.seedDepartments(organizations);
      
      // Seed positions with hierarchy
      const positions = await this.seedPositions(organizations, departments);
      
      // Seed employees
      const employees = await this.seedEmployees();
      
      // Assign employees to positions
      await this.seedEmployeePositions(employees, positions, departments);
      
      console.log('✅ Database seeding completed successfully!');
      
      return {
        organizations: organizations.length,
        departments: departments.length,
        positions: positions.length,
        employees: employees.length
      };
    } catch (error) {
      console.error('❌ Error seeding database:', error);
      throw error;
    }
  }

  private async clearDatabase() {
    console.log('🧹 Clearing existing data...');
    await EmployeePosition.destroy({ where: {} });
    await Employee.destroy({ where: {} });
    await Position.destroy({ where: {} });
    await Department.destroy({ where: {} });
    await Organization.destroy({ where: {} });
  }

  private async seedOrganizations() {
    console.log('🏢 Seeding organizations...');
    
    const organizationsData = [
      {
        name: 'TechCorp Solutions',
        logo: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        address: '123 Innovation Drive, Silicon Valley, CA 94025',
        descriptions: 'Leading technology solutions provider specializing in enterprise software development, cloud computing, and digital transformation services.'
      },
      {
        name: 'Global Manufacturing Inc',
        logo: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        address: '456 Industrial Blvd, Detroit, MI 48201',
        descriptions: 'International manufacturing company producing automotive parts, industrial equipment, and consumer electronics with operations across 15 countries.'
      },
      {
        name: 'HealthFirst Medical Group',
        logo: 'https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        address: '789 Medical Center Way, Boston, MA 02115',
        descriptions: 'Comprehensive healthcare provider offering primary care, specialized medical services, and cutting-edge medical research facilities.'
      }
    ];

    const organizations = await Organization.bulkCreate(organizationsData);
    console.log(`✅ Created ${organizations.length} organizations`);
    return organizations;
  }

  private async seedDepartments(organizations: Organization[]) {
    console.log('🏬 Seeding departments...');
    
    const departmentsData = [
      // TechCorp Solutions Departments
      {
        name: 'Executive Office',
        organizationId: organizations[0].id,
        description: 'Executive leadership and strategic planning',
        code: 'EXEC'
      },
      {
        name: 'Engineering',
        organizationId: organizations[0].id,
        description: 'Software development and technical innovation',
        code: 'ENG'
      },
      {
        name: 'Product Management',
        organizationId: organizations[0].id,
        description: 'Product strategy and roadmap planning',
        code: 'PM'
      },
      {
        name: 'Sales & Marketing',
        organizationId: organizations[0].id,
        description: 'Revenue generation and market expansion',
        code: 'SALES'
      },
      {
        name: 'Human Resources',
        organizationId: organizations[0].id,
        description: 'Talent acquisition and employee development',
        code: 'HR'
      },
      {
        name: 'Finance & Operations',
        organizationId: organizations[0].id,
        description: 'Financial planning and operational excellence',
        code: 'FIN'
      },
      
      // Global Manufacturing Inc Departments
      {
        name: 'Corporate Leadership',
        organizationId: organizations[1].id,
        description: 'Corporate governance and strategic direction',
        code: 'CORP'
      },
      {
        name: 'Manufacturing',
        organizationId: organizations[1].id,
        description: 'Production and manufacturing operations',
        code: 'MFG'
      },
      {
        name: 'Quality Assurance',
        organizationId: organizations[1].id,
        description: 'Quality control and compliance',
        code: 'QA'
      },
      {
        name: 'Supply Chain',
        organizationId: organizations[1].id,
        description: 'Procurement and logistics management',
        code: 'SCM'
      },
      
      // HealthFirst Medical Group Departments
      {
        name: 'Administration',
        organizationId: organizations[2].id,
        description: 'Healthcare administration and management',
        code: 'ADMIN'
      },
      {
        name: 'Medical Services',
        organizationId: organizations[2].id,
        description: 'Patient care and medical treatment',
        code: 'MED'
      },
      {
        name: 'Research & Development',
        organizationId: organizations[2].id,
        description: 'Medical research and clinical trials',
        code: 'RND'
      }
    ];

    const departments = await Department.bulkCreate(departmentsData);
    console.log(`✅ Created ${departments.length} departments`);
    return departments;
  }

  private async seedPositions(organizations: Organization[], departments: Department[]) {
    console.log('💼 Seeding positions with hierarchy...');
    
    // Helper function to find department by code
    const findDept = (code: string) => departments.find(d => d.code === code);
    
    const positionsData = [
      // TechCorp Solutions Positions
      // Level 1 - Executive
      {
        title: 'Chief Executive Officer',
        departmentId: findDept('EXEC')!.id,
        organizationId: organizations[0].id,
        description: 'Overall strategic leadership and company vision',
        parentPositionId: null,
        hierarchyLevel: 1,
        hierarchyPath: 'Chief Executive Officer'
      },
      
      // Level 2 - VPs/Directors
      {
        title: 'VP of Engineering',
        departmentId: findDept('ENG')!.id,
        organizationId: organizations[0].id,
        description: 'Lead engineering strategy and technical innovation',
        hierarchyLevel: 2
      },
      {
        title: 'VP of Sales & Marketing',
        departmentId: findDept('SALES')!.id,
        organizationId: organizations[0].id,
        description: 'Drive revenue growth and market expansion',
        hierarchyLevel: 2
      },
      {
        title: 'VP of Product',
        departmentId: findDept('PM')!.id,
        organizationId: organizations[0].id,
        description: 'Product strategy and roadmap execution',
        hierarchyLevel: 2
      },
      {
        title: 'Director of HR',
        departmentId: findDept('HR')!.id,
        organizationId: organizations[0].id,
        description: 'Human resources strategy and talent management',
        hierarchyLevel: 2
      },
      {
        title: 'CFO',
        departmentId: findDept('FIN')!.id,
        organizationId: organizations[0].id,
        description: 'Financial strategy and operations oversight',
        hierarchyLevel: 2
      },
      
      // Level 3 - Managers
      {
        title: 'Engineering Manager - Frontend',
        departmentId: findDept('ENG')!.id,
        organizationId: organizations[0].id,
        description: 'Lead frontend development team and architecture',
        hierarchyLevel: 3
      },
      {
        title: 'Engineering Manager - Backend',
        departmentId: findDept('ENG')!.id,
        organizationId: organizations[0].id,
        description: 'Lead backend development and infrastructure',
        hierarchyLevel: 3
      },
      {
        title: 'Product Manager - Core Platform',
        departmentId: findDept('PM')!.id,
        organizationId: organizations[0].id,
        description: 'Manage core platform features and roadmap',
        hierarchyLevel: 3
      },
      {
        title: 'Sales Manager - Enterprise',
        departmentId: findDept('SALES')!.id,
        organizationId: organizations[0].id,
        description: 'Manage enterprise sales team and accounts',
        hierarchyLevel: 3
      },
      {
        title: 'Marketing Manager',
        departmentId: findDept('SALES')!.id,
        organizationId: organizations[0].id,
        description: 'Lead marketing campaigns and brand strategy',
        hierarchyLevel: 3
      },
      
      // Level 4 - Senior Staff
      {
        title: 'Senior Frontend Developer',
        departmentId: findDept('ENG')!.id,
        organizationId: organizations[0].id,
        description: 'Develop and maintain frontend applications',
        hierarchyLevel: 4
      },
      {
        title: 'Senior Backend Developer',
        departmentId: findDept('ENG')!.id,
        organizationId: organizations[0].id,
        description: 'Develop and maintain backend services',
        hierarchyLevel: 4
      },
      {
        title: 'DevOps Engineer',
        departmentId: findDept('ENG')!.id,
        organizationId: organizations[0].id,
        description: 'Manage infrastructure and deployment pipelines',
        hierarchyLevel: 4
      },
      {
        title: 'Senior Product Analyst',
        departmentId: findDept('PM')!.id,
        organizationId: organizations[0].id,
        description: 'Analyze product metrics and user behavior',
        hierarchyLevel: 4
      },
      {
        title: 'Account Executive',
        departmentId: findDept('SALES')!.id,
        organizationId: organizations[0].id,
        description: 'Manage client relationships and sales pipeline',
        hierarchyLevel: 4
      },
      
      // Global Manufacturing Inc Positions
      {
        title: 'President & CEO',
        departmentId: findDept('CORP')!.id,
        organizationId: organizations[1].id,
        description: 'Corporate leadership and strategic direction',
        parentPositionId: null,
        hierarchyLevel: 1
      },
      {
        title: 'VP of Manufacturing',
        departmentId: findDept('MFG')!.id,
        organizationId: organizations[1].id,
        description: 'Oversee all manufacturing operations',
        hierarchyLevel: 2
      },
      {
        title: 'Quality Director',
        departmentId: findDept('QA')!.id,
        organizationId: organizations[1].id,
        description: 'Ensure quality standards and compliance',
        hierarchyLevel: 2
      },
      {
        title: 'Supply Chain Manager',
        departmentId: findDept('SCM')!.id,
        organizationId: organizations[1].id,
        description: 'Manage procurement and logistics',
        hierarchyLevel: 3
      },
      {
        title: 'Production Supervisor',
        departmentId: findDept('MFG')!.id,
        organizationId: organizations[1].id,
        description: 'Supervise daily production activities',
        hierarchyLevel: 3
      },
      
      // HealthFirst Medical Group Positions
      {
        title: 'Chief Medical Officer',
        departmentId: findDept('ADMIN')!.id,
        organizationId: organizations[2].id,
        description: 'Medical leadership and clinical oversight',
        parentPositionId: null,
        hierarchyLevel: 1
      },
      {
        title: 'Director of Medical Services',
        departmentId: findDept('MED')!.id,
        organizationId: organizations[2].id,
        description: 'Oversee patient care and medical services',
        hierarchyLevel: 2
      },
      {
        title: 'Research Director',
        departmentId: findDept('RND')!.id,
        organizationId: organizations[2].id,
        description: 'Lead medical research initiatives',
        hierarchyLevel: 2
      },
      {
        title: 'Senior Physician',
        departmentId: findDept('MED')!.id,
        organizationId: organizations[2].id,
        description: 'Provide specialized medical care',
        hierarchyLevel: 3
      },
      {
        title: 'Research Scientist',
        departmentId: findDept('RND')!.id,
        organizationId: organizations[2].id,
        description: 'Conduct medical research and clinical trials',
        hierarchyLevel: 3
      }
    ];

    // Create positions in batches to handle hierarchy relationships
    const positions = await Position.bulkCreate(positionsData);
    
    // Update parent relationships after all positions are created
    await this.updatePositionHierarchy(positions);
    
    console.log(`✅ Created ${positions.length} positions with hierarchy`);
    return positions;
  }

  private async updatePositionHierarchy(positions: Position[]) {
    console.log('🔗 Updating position hierarchy relationships...');
    
    // Define parent-child relationships
    const hierarchyMap = [
      // TechCorp Solutions
      { child: 'VP of Engineering', parent: 'Chief Executive Officer' },
      { child: 'VP of Sales & Marketing', parent: 'Chief Executive Officer' },
      { child: 'VP of Product', parent: 'Chief Executive Officer' },
      { child: 'Director of HR', parent: 'Chief Executive Officer' },
      { child: 'CFO', parent: 'Chief Executive Officer' },
      
      { child: 'Engineering Manager - Frontend', parent: 'VP of Engineering' },
      { child: 'Engineering Manager - Backend', parent: 'VP of Engineering' },
      { child: 'Product Manager - Core Platform', parent: 'VP of Product' },
      { child: 'Sales Manager - Enterprise', parent: 'VP of Sales & Marketing' },
      { child: 'Marketing Manager', parent: 'VP of Sales & Marketing' },
      
      { child: 'Senior Frontend Developer', parent: 'Engineering Manager - Frontend' },
      { child: 'Senior Backend Developer', parent: 'Engineering Manager - Backend' },
      { child: 'DevOps Engineer', parent: 'Engineering Manager - Backend' },
      { child: 'Senior Product Analyst', parent: 'Product Manager - Core Platform' },
      { child: 'Account Executive', parent: 'Sales Manager - Enterprise' },
      
      // Global Manufacturing Inc
      { child: 'VP of Manufacturing', parent: 'President & CEO' },
      { child: 'Quality Director', parent: 'President & CEO' },
      { child: 'Supply Chain Manager', parent: 'VP of Manufacturing' },
      { child: 'Production Supervisor', parent: 'VP of Manufacturing' },
      
      // HealthFirst Medical Group
      { child: 'Director of Medical Services', parent: 'Chief Medical Officer' },
      { child: 'Research Director', parent: 'Chief Medical Officer' },
      { child: 'Senior Physician', parent: 'Director of Medical Services' },
      { child: 'Research Scientist', parent: 'Research Director' }
    ];

    for (const relation of hierarchyMap) {
      const childPosition = positions.find(p => p.title === relation.child);
      const parentPosition = positions.find(p => p.title === relation.parent);
      
      if (childPosition && parentPosition) {
        await childPosition.update({
          parentPositionId: parentPosition.id,
          hierarchyPath: `${parentPosition.hierarchyPath || parentPosition.title} > ${childPosition.title}`
        });
      }
    }
  }

  private async seedEmployees() {
    console.log('👥 Seeding employees...');
    
    const employeesData = [
      {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@techcorp.com',
        password: 'password123',
        phoneNumber: '+1-555-0101',
        address: '123 Tech Street, San Francisco, CA 94105',
        roles: ['Executive', 'Leadership'],
        dateOfBirth: new Date('1975-03-15'),
        photoUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
      },
      {
        name: 'Michael Chen',
        email: 'michael.chen@techcorp.com',
        password: 'password123',
        phoneNumber: '+1-555-0102',
        address: '456 Innovation Ave, Palo Alto, CA 94301',
        roles: ['Engineering', 'Leadership'],
        dateOfBirth: new Date('1980-07-22'),
        photoUrl: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
      },
      {
        name: 'Emily Rodriguez',
        email: 'emily.rodriguez@techcorp.com',
        password: 'password123',
        phoneNumber: '+1-555-0103',
        address: '789 Market St, San Jose, CA 95113',
        roles: ['Sales', 'Marketing', 'Leadership'],
        dateOfBirth: new Date('1982-11-08'),
        photoUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
      },
      {
        name: 'David Kim',
        email: 'david.kim@techcorp.com',
        password: 'password123',
        phoneNumber: '+1-555-0104',
        address: '321 Product Lane, Mountain View, CA 94041',
        roles: ['Product', 'Strategy'],
        dateOfBirth: new Date('1978-05-12'),
        photoUrl: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
      },
      {
        name: 'Lisa Thompson',
        email: 'lisa.thompson@techcorp.com',
        password: 'password123',
        phoneNumber: '+1-555-0105',
        address: '654 HR Boulevard, Sunnyvale, CA 94086',
        roles: ['HR', 'People Operations'],
        dateOfBirth: new Date('1979-09-25'),
        photoUrl: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
      },
      {
        name: 'Robert Wilson',
        email: 'robert.wilson@techcorp.com',
        password: 'password123',
        phoneNumber: '+1-555-0106',
        address: '987 Finance St, Fremont, CA 94538',
        roles: ['Finance', 'Operations'],
        dateOfBirth: new Date('1976-12-03'),
        photoUrl: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
      },
      {
        name: 'Jennifer Lee',
        email: 'jennifer.lee@techcorp.com',
        password: 'password123',
        phoneNumber: '+1-555-0107',
        address: '147 Frontend Ave, Cupertino, CA 95014',
        roles: ['Engineering', 'Frontend'],
        dateOfBirth: new Date('1985-04-18'),
        photoUrl: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
      },
      {
        name: 'Alex Martinez',
        email: 'alex.martinez@techcorp.com',
        password: 'password123',
        phoneNumber: '+1-555-0108',
        address: '258 Backend Blvd, Santa Clara, CA 95051',
        roles: ['Engineering', 'Backend'],
        dateOfBirth: new Date('1983-08-30'),
        photoUrl: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
      },
      {
        name: 'Amanda Davis',
        email: 'amanda.davis@techcorp.com',
        password: 'password123',
        phoneNumber: '+1-555-0109',
        address: '369 Product Way, Redwood City, CA 94063',
        roles: ['Product', 'Analytics'],
        dateOfBirth: new Date('1987-01-14'),
        photoUrl: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
      },
      {
        name: 'James Brown',
        email: 'james.brown@techcorp.com',
        password: 'password123',
        phoneNumber: '+1-555-0110',
        address: '741 Sales Street, Foster City, CA 94404',
        roles: ['Sales', 'Enterprise'],
        dateOfBirth: new Date('1981-06-27'),
        photoUrl: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
      },
      
      // Global Manufacturing Inc Employees
      {
        name: 'William Anderson',
        email: 'william.anderson@globalmfg.com',
        password: 'password123',
        phoneNumber: '+1-555-0201',
        address: '100 Corporate Plaza, Detroit, MI 48226',
        roles: ['Executive', 'Manufacturing'],
        dateOfBirth: new Date('1970-02-10'),
        photoUrl: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
      },
      {
        name: 'Maria Garcia',
        email: 'maria.garcia@globalmfg.com',
        password: 'password123',
        phoneNumber: '+1-555-0202',
        address: '200 Manufacturing Dr, Warren, MI 48089',
        roles: ['Manufacturing', 'Operations'],
        dateOfBirth: new Date('1977-10-05'),
        photoUrl: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
      },
      {
        name: 'Thomas Miller',
        email: 'thomas.miller@globalmfg.com',
        password: 'password123',
        phoneNumber: '+1-555-0203',
        address: '300 Quality Lane, Dearborn, MI 48124',
        roles: ['Quality', 'Compliance'],
        dateOfBirth: new Date('1974-12-20'),
        photoUrl: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
      },
      
      // HealthFirst Medical Group Employees
      {
        name: 'Dr. Patricia White',
        email: 'patricia.white@healthfirst.com',
        password: 'password123',
        phoneNumber: '+1-555-0301',
        address: '400 Medical Center Dr, Boston, MA 02118',
        roles: ['Medical', 'Leadership'],
        dateOfBirth: new Date('1972-04-08'),
        photoUrl: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
      },
      {
        name: 'Dr. Kevin Taylor',
        email: 'kevin.taylor@healthfirst.com',
        password: 'password123',
        phoneNumber: '+1-555-0302',
        address: '500 Healthcare Ave, Cambridge, MA 02139',
        roles: ['Medical', 'Patient Care'],
        dateOfBirth: new Date('1979-07-16'),
        photoUrl: 'https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
      },
      {
        name: 'Dr. Rachel Green',
        email: 'rachel.green@healthfirst.com',
        password: 'password123',
        phoneNumber: '+1-555-0303',
        address: '600 Research Blvd, Brookline, MA 02445',
        roles: ['Research', 'Clinical Trials'],
        dateOfBirth: new Date('1981-11-22'),
        photoUrl: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
      }
    ];

    const employees = await Employee.bulkCreate(employeesData);
    console.log(`✅ Created ${employees.length} employees`);
    return employees;
  }

  private async seedEmployeePositions(employees: Employee[], positions: Position[], departments: Department[]) {
    console.log('🔗 Assigning employees to positions...');
    
    // Helper function to find position by title
    const findPosition = (title: string) => positions.find(p => p.title === title);
    const findEmployee = (email: string) => employees.find(e => e.email === email);
    const findDept = (code: string) => departments.find(d => d.code === code);
    
    const employeePositionsData = [
      // TechCorp Solutions Assignments
      {
        employeeId: findEmployee('sarah.johnson@techcorp.com')!.id,
        positionId: findPosition('Chief Executive Officer')!.id,
        departmentId: findDept('EXEC')!.id,
        startDate: new Date('2020-01-15'),
        endDate: null
      },
      {
        employeeId: findEmployee('michael.chen@techcorp.com')!.id,
        positionId: findPosition('VP of Engineering')!.id,
        departmentId: findDept('ENG')!.id,
        startDate: new Date('2020-03-01'),
        endDate: null
      },
      {
        employeeId: findEmployee('emily.rodriguez@techcorp.com')!.id,
        positionId: findPosition('VP of Sales & Marketing')!.id,
        departmentId: findDept('SALES')!.id,
        startDate: new Date('2020-02-15'),
        endDate: null
      },
      {
        employeeId: findEmployee('david.kim@techcorp.com')!.id,
        positionId: findPosition('VP of Product')!.id,
        departmentId: findDept('PM')!.id,
        startDate: new Date('2020-04-01'),
        endDate: null
      },
      {
        employeeId: findEmployee('lisa.thompson@techcorp.com')!.id,
        positionId: findPosition('Director of HR')!.id,
        departmentId: findDept('HR')!.id,
        startDate: new Date('2020-05-15'),
        endDate: null
      },
      {
        employeeId: findEmployee('robert.wilson@techcorp.com')!.id,
        positionId: findPosition('CFO')!.id,
        departmentId: findDept('FIN')!.id,
        startDate: new Date('2020-06-01'),
        endDate: null
      },
      {
        employeeId: findEmployee('jennifer.lee@techcorp.com')!.id,
        positionId: findPosition('Engineering Manager - Frontend')!.id,
        departmentId: findDept('ENG')!.id,
        startDate: new Date('2021-01-15'),
        endDate: null
      },
      {
        employeeId: findEmployee('alex.martinez@techcorp.com')!.id,
        positionId: findPosition('Engineering Manager - Backend')!.id,
        departmentId: findDept('ENG')!.id,
        startDate: new Date('2021-02-01'),
        endDate: null
      },
      {
        employeeId: findEmployee('amanda.davis@techcorp.com')!.id,
        positionId: findPosition('Product Manager - Core Platform')!.id,
        departmentId: findDept('PM')!.id,
        startDate: new Date('2021-03-15'),
        endDate: null
      },
      {
        employeeId: findEmployee('james.brown@techcorp.com')!.id,
        positionId: findPosition('Sales Manager - Enterprise')!.id,
        departmentId: findDept('SALES')!.id,
        startDate: new Date('2021-04-01'),
        endDate: null
      },
      
      // Global Manufacturing Inc Assignments
      {
        employeeId: findEmployee('william.anderson@globalmfg.com')!.id,
        positionId: findPosition('President & CEO')!.id,
        departmentId: findDept('CORP')!.id,
        startDate: new Date('2019-01-01'),
        endDate: null
      },
      {
        employeeId: findEmployee('maria.garcia@globalmfg.com')!.id,
        positionId: findPosition('VP of Manufacturing')!.id,
        departmentId: findDept('MFG')!.id,
        startDate: new Date('2019-06-15'),
        endDate: null
      },
      {
        employeeId: findEmployee('thomas.miller@globalmfg.com')!.id,
        positionId: findPosition('Quality Director')!.id,
        departmentId: findDept('QA')!.id,
        startDate: new Date('2019-08-01'),
        endDate: null
      },
      
      // HealthFirst Medical Group Assignments
      {
        employeeId: findEmployee('patricia.white@healthfirst.com')!.id,
        positionId: findPosition('Chief Medical Officer')!.id,
        departmentId: findDept('ADMIN')!.id,
        startDate: new Date('2018-03-01'),
        endDate: null
      },
      {
        employeeId: findEmployee('kevin.taylor@healthfirst.com')!.id,
        positionId: findPosition('Director of Medical Services')!.id,
        departmentId: findDept('MED')!.id,
        startDate: new Date('2018-09-15'),
        endDate: null
      },
      {
        employeeId: findEmployee('rachel.green@healthfirst.com')!.id,
        positionId: findPosition('Research Director')!.id,
        departmentId: findDept('RND')!.id,
        startDate: new Date('2019-01-15'),
        endDate: null
      }
    ];

    const employeePositions = await EmployeePosition.bulkCreate(employeePositionsData);
    console.log(`✅ Created ${employeePositions.length} employee position assignments`);
    return employeePositions;
  }
}