# Database Seeders Documentation

## Overview
The Employee Manager system includes comprehensive database seeders that populate your database with realistic organizational data. This is perfect for development, testing, and demonstration purposes.

## What Gets Seeded

### 🏢 Organizations (3)
1. **TechCorp Solutions**
   - Technology company specializing in enterprise software
   - Logo: Professional tech company image
   - Address: Silicon Valley, CA
   - 6 departments, 15+ positions

2. **Global Manufacturing Inc**
   - International manufacturing company
   - Logo: Industrial company image  
   - Address: Detroit, MI
   - 4 departments, 5+ positions

3. **HealthFirst Medical Group**
   - Healthcare provider and research facility
   - Logo: Medical company image
   - Address: Boston, MA
   - 3 departments, 5+ positions

### 🏬 Departments (13 total)
**TechCorp Solutions:**
- Executive Office (EXEC)
- Engineering (ENG) 
- Product Management (PM)
- Sales & Marketing (SALES)
- Human Resources (HR)
- Finance & Operations (FIN)

**Global Manufacturing Inc:**
- Corporate Leadership (CORP)
- Manufacturing (MFG)
- Quality Assurance (QA)
- Supply Chain (SCM)

**HealthFirst Medical Group:**
- Administration (ADMIN)
- Medical Services (MED)
- Research & Development (RND)

### 💼 Positions (25+ with Hierarchy)
Complete organizational hierarchy with 5 levels:

**Level 1 (Executive)** - Blue indicators
- Chief Executive Officer
- President & CEO  
- Chief Medical Officer

**Level 2 (Directors/VPs)** - Purple indicators
- VP of Engineering
- VP of Sales & Marketing
- VP of Product
- Director of HR
- CFO
- VP of Manufacturing
- Quality Director
- Director of Medical Services
- Research Director

**Level 3 (Managers)** - Green indicators
- Engineering Manager - Frontend
- Engineering Manager - Backend
- Product Manager - Core Platform
- Sales Manager - Enterprise
- Marketing Manager
- Supply Chain Manager
- Production Supervisor
- Senior Physician
- Research Scientist

**Level 4+ (Senior Staff)** - Orange/Gray indicators
- Senior Frontend Developer
- Senior Backend Developer
- DevOps Engineer
- Senior Product Analyst
- Account Executive

### 👥 Employees (16 total)
Realistic employee profiles with:
- Professional headshot photos from Pexels
- Complete contact information
- Role assignments matching their positions
- Proper organizational assignments
- Date of birth and address information

**Sample Employees:**
- **Sarah Johnson** - CEO of TechCorp Solutions
- **Michael Chen** - VP of Engineering
- **Emily Rodriguez** - VP of Sales & Marketing
- **Dr. Patricia White** - Chief Medical Officer
- **William Anderson** - President & CEO of Global Manufacturing
- And 11 more employees across all organizations...

### 🔗 Employee Position Assignments
- All key positions have assigned employees
- Proper start dates (no end dates for current positions)
- Correct department and position relationships
- Realistic assignment timeline

## How to Use Seeders

### Method 1: Dashboard UI (Recommended)
1. Start the application: `npm run dev`
2. Navigate to the Dashboard
3. Look for the "Sample Data" section
4. Click "Run Sample Data" button
5. Confirm the action (this will clear existing data)
6. Wait for completion and data refresh

### Method 2: API Endpoint
```bash
# Run seeders via API
curl -X POST http://localhost:3001/api/seeders/run

# Check seeder status
curl http://localhost:3001/api/seeders/status
```

### Method 3: Direct Script (Future)
```bash
# Run seeders directly
npm run seed
```

## Seeder Features

### 🧹 Data Cleanup
- Automatically clears existing data before seeding
- Maintains referential integrity during cleanup
- Safe deletion order (child records first)

### 🔗 Relationship Management
- Proper foreign key relationships
- Hierarchical position structures
- Employee-position assignments with date tracking

### 📊 Realistic Data
- Professional employee photos
- Realistic company information
- Proper organizational structures
- Industry-appropriate job titles and descriptions

### 🎯 Hierarchy Building
- Automatic parent-child position relationships
- Calculated hierarchy levels
- Generated hierarchy paths
- Visual hierarchy indicators

## Data Structure

### Position Hierarchy Example (TechCorp Solutions)
```
CEO (Level 1)
├── VP of Engineering (Level 2)
│   ├── Engineering Manager - Frontend (Level 3)
│   │   └── Senior Frontend Developer (Level 4)
│   └── Engineering Manager - Backend (Level 3)
│       ├── Senior Backend Developer (Level 4)
│       └── DevOps Engineer (Level 4)
├── VP of Sales & Marketing (Level 2)
│   ├── Sales Manager - Enterprise (Level 3)
│   │   └── Account Executive (Level 4)
│   └── Marketing Manager (Level 3)
└── VP of Product (Level 2)
    └── Product Manager - Core Platform (Level 3)
        └── Senior Product Analyst (Level 4)
```

## Testing the Seeders

After running seeders, verify:

1. **Organizations**: Check `/organizations` - should show 3 companies
2. **Departments**: Check `/departments` - should show 13 departments
3. **Positions**: Check `/positions` - should show 25+ positions
4. **Employees**: Check `/employees` - should show 16 employees
5. **Organograms**: Check organization charts for hierarchy visualization

## Chat Commands to Test

Try these commands with the seeded data:
- "Show me all employees"
- "List organizations" 
- "Show organogram for TechCorp Solutions"
- "Display department structure"
- "Create new employee for Engineering department"

## Customizing Seeders

To modify the seeded data:

1. Edit `backend/seeders/index.ts`
2. Modify the data arrays in each seeding method
3. Update hierarchy relationships in `updatePositionHierarchy()`
4. Add new organizations, departments, or positions as needed
5. Restart the application and re-run seeders

## Production Considerations

⚠️ **Important**: Seeders are designed for development and testing only.

- Never run seeders in production
- Always backup data before running seeders
- Seeders will delete existing data
- Use environment checks to prevent accidental production seeding

## Troubleshooting

### Common Issues:
1. **Foreign Key Errors**: Ensure proper relationship order in seeding
2. **Duplicate Data**: Seeders clear data first, but check for unique constraints
3. **Photo URLs**: Pexels URLs may change; update if images don't load
4. **Hierarchy Issues**: Verify parent-child relationships are correct

### Debug Mode:
Enable detailed logging by setting `NODE_ENV=development` in your `.env` file.

---

The seeders provide a complete, realistic dataset that demonstrates all system capabilities including CRUD operations, hierarchical relationships, and organogram generation. Perfect for development, testing, and client demonstrations!