# Employee Manager System with Organogram Generation

A comprehensive full-stack employee management system built with React, TypeScript, Node.js, and MySQL. Features intelligent chat integration, complete CRUD operations, and advanced organogram generation capabilities.

## 🚀 Features

### Core Functionality
- **Complete CRUD Operations** for Organizations, Departments, Positions, Employees, and Employee Positions
- **Intelligent Chat Interface** with natural language processing for system operations
- **Organogram Generation** with hierarchical position visualization
- **Position Hierarchy Management** with parent-child relationships
- **Employee Assignment** to positions with date tracking
- **Responsive Design** optimized for all device sizes

### Advanced Features
- **Real-time Chat Navigation** - Commands like "show me employees" automatically navigate to relevant pages
- **Contextual Conversations** - Multi-step processes guided by AI assistant
- **Visual Organogram Charts** - Interactive hierarchical organization charts
- **Photo Upload/Capture** - Employee photo management with URL and file upload support
- **Smart Form Validation** - Real-time validation with helpful error messages
- **Export Capabilities** - Export organograms and data (planned feature)

## 🏗️ Architecture

### Backend (Node.js + TypeScript)
```
backend/
├── server.ts                 # Express server setup
├── database/
│   └── connection.ts         # Sequelize database connection
├── models/                   # Sequelize TypeScript models
│   ├── Organization.ts
│   ├── Department.ts
│   ├── Position.ts          # Enhanced with hierarchy fields
│   ├── Employee.ts
│   └── EmployeePosition.ts
├── routes/                   # API route handlers
│   ├── organizationRoutes.ts
│   ├── departmentRoutes.ts
│   ├── positionRoutes.ts
│   ├── employeeRoutes.ts
│   ├── employeePositionRoutes.ts
│   ├── chatRoutes.ts
│   └── organogramRoutes.ts   # New: Organogram generation
└── services/
    └── ChatService.ts        # Enhanced with organogram support
```

### Frontend (React + TypeScript)
```
src/
├── components/
│   ├── Layout.tsx            # Main application layout
│   ├── ChatWidget.tsx        # Floating chat interface
│   └── OrganogramChart.tsx   # New: Interactive org chart component
├── context/
│   └── ChatContext.tsx       # Chat state management
├── pages/
│   ├── Dashboard.tsx
│   ├── organizations/        # Organization management
│   ├── departments/          # Department management
│   ├── positions/            # Position management (enhanced)
│   ├── employees/            # Employee management
│   └── organogram/           # New: Organogram views
│       └── OrganogramView.tsx
├── services/
│   └── api.ts               # API client with organogram endpoints
└── App.tsx                  # Enhanced with organogram routes
```

## 📊 Database Schema

### Enhanced Position Model
```sql
positions:
- id (Primary Key)
- title (VARCHAR)
- description (TEXT)
- departmentId (Foreign Key)
- organizationId (Foreign Key)
- parentPositionId (Foreign Key) -- NEW: Self-referencing for hierarchy
- hierarchyLevel (INTEGER)       -- NEW: Position level (1=Executive, 2=Director, etc.)
- hierarchyPath (VARCHAR)        -- NEW: Full path like "CEO > VP Sales > Sales Manager"
- createdAt, updatedAt
```

### Relationships
- **Organizations** → **Departments** (1:Many)
- **Organizations** → **Positions** (1:Many)
- **Departments** → **Positions** (1:Many)
- **Positions** → **Positions** (Self-referencing for hierarchy)
- **Employees** ↔ **Positions** (Many:Many through EmployeePosition)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- MySQL 8.0+
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd employee-manager-system
```

2. **Install dependencies**
```bash
npm install
```

3. **Database Setup**
```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE employee_manager;
```

4. **Environment Configuration**
Create `.env` file in the root directory:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=employee_manager

# Server Configuration
PORT=3001
NODE_ENV=development
```

5. **Start the Application**
```bash
# Development mode (starts both frontend and backend)
npm run dev

# Or start individually
npm run dev:frontend  # Frontend only (port 5173)
npm run dev:backend   # Backend only (port 3001)
```

6. **Access the Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- Health Check: http://localhost:3001/health

## 💬 Chat Commands

The AI assistant understands natural language commands:

### Employee Management
- "Show me all employees"
- "Create a new employee"
- "Add employee John Doe"
- "Assign employee to position"

### Organization Management
- "List organizations"
- "Create new organization"
- "Show organization chart for [org name/id]"

### Department Management
- "Show departments"
- "Create department for [organization]"
- "View department organogram"

### Position Management
- "List all positions"
- "Create new position"
- "Set position hierarchy"
- "Show reporting structure"

### Organogram Commands
- "Show organogram for organization 1"
- "Display org chart"
- "View organizational hierarchy"
- "Show department structure"

## 📈 Organogram Features

### Hierarchy Management
- **Parent-Child Relationships**: Positions can report to other positions
- **Automatic Level Calculation**: Hierarchy levels calculated based on reporting structure
- **Visual Hierarchy Indicators**: Color-coded levels (Blue=Executive, Purple=Director, etc.)
- **Path Tracking**: Full hierarchical path stored and displayed

### Interactive Charts
- **Expandable/Collapsible Nodes**: Click to expand or collapse position branches
- **Employee Assignment Display**: Shows current position holders with photos
- **Vacant Position Indicators**: Clearly marks unfilled positions
- **Edit Capabilities**: Direct links to edit positions and assign employees

### Export Options (Planned)
- PDF export of organograms
- Image export (PNG/SVG)
- Excel export of hierarchy data

## 🔧 API Endpoints

### Organogram Endpoints
```
GET    /api/organogram/organization/:id    # Get org chart for organization
GET    /api/organogram/department/:id      # Get org chart for department
PUT    /api/organogram/position/:id/hierarchy  # Update position hierarchy
GET    /api/organogram/position/:id/hierarchy-path  # Get position path
```

### Standard CRUD Endpoints
```
# Organizations
GET    /api/organizations
POST   /api/organizations
GET    /api/organizations/:id
PUT    /api/organizations/:id
DELETE /api/organizations/:id

# Departments
GET    /api/departments
POST   /api/departments
GET    /api/departments/:id
PUT    /api/departments/:id
DELETE /api/departments/:id

# Positions (Enhanced)
GET    /api/positions
POST   /api/positions
GET    /api/positions/:id
PUT    /api/positions/:id
DELETE /api/positions/:id

# Employees
GET    /api/employees
POST   /api/employees
GET    /api/employees/:id
PUT    /api/employees/:id
DELETE /api/employees/:id

# Employee Positions
GET    /api/employee-positions
POST   /api/employee-positions
GET    /api/employee-positions/:id
PUT    /api/employee-positions/:id
DELETE /api/employee-positions/:id

# Chat
POST   /api/chat/message
GET    /api/chat/history
```

## 🎨 Design System

### Color Palette
- **Primary Blue**: #3B82F6 (Organizations)
- **Secondary Green**: #10B981 (Departments)
- **Accent Purple**: #8B5CF6 (Positions)
- **Warm Orange**: #F59E0B (Employees)
- **Success Green**: #059669
- **Warning Yellow**: #D97706
- **Error Red**: #DC2626

### Hierarchy Colors
- **Level 1 (Executive)**: Blue (#3B82F6)
- **Level 2 (Director)**: Purple (#8B5CF6)
- **Level 3 (Manager)**: Green (#10B981)
- **Level 4 (Supervisor)**: Orange (#F59E0B)
- **Level 5+ (Staff)**: Gray (#6B7280)

### Typography
- **Headings**: Inter font family, weights 400-700
- **Body Text**: 150% line height for readability
- **Code/Monospace**: 'Monaco', 'Menlo', monospace

## 🔒 Security Features

- Input validation and sanitization
- SQL injection prevention through Sequelize ORM
- CORS configuration
- Helmet.js security headers
- Environment variable protection

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run linting
npm run lint

# Type checking
npx tsc --noEmit
```

## 📱 Mobile Responsiveness

- **Mobile First**: Optimized for mobile devices (320px+)
- **Tablet Support**: Enhanced layouts for tablets (768px+)
- **Desktop Experience**: Full-featured desktop interface (1024px+)
- **Touch-Friendly**: Large touch targets and intuitive gestures

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables (Production)
```env
NODE_ENV=production
DB_HOST=your_production_db_host
DB_USER=your_production_db_user
DB_PASSWORD=your_production_db_password
DB_NAME=your_production_db_name
PORT=3001
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation in the `/docs` folder
- Review the API documentation at `/api/docs` (when available)

## 🔮 Roadmap

### Upcoming Features
- [ ] Advanced organogram export (PDF, PNG, SVG)
- [ ] Drag-and-drop position hierarchy editing
- [ ] Employee performance tracking
- [ ] Department budget management
- [ ] Advanced reporting and analytics
- [ ] Mobile app (React Native)
- [ ] SSO integration
- [ ] Multi-tenant support
- [ ] Advanced chat commands with AI/ML
- [ ] Real-time notifications
- [ ] Audit logging
- [ ] Advanced search and filtering
- [ ] Bulk operations
- [ ] Data import/export (CSV, Excel)
- [ ] Custom fields and forms

---

Built with ❤️ using React, TypeScript, Node.js, and MySQL