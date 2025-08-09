import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { OrganizationList } from './pages/organizations/OrganizationList';
import { OrganizationDetail } from './pages/organizations/OrganizationDetail';
import { DepartmentList } from './pages/departments/DepartmentList';
import { DepartmentDetail } from './pages/departments/DepartmentDetail';
import { PositionList } from './pages/positions/PositionList';
import { PositionDetail } from './pages/positions/PositionDetail';
import { EmployeeList } from './pages/employees/EmployeeList';
import { EmployeeDetail } from './pages/employees/EmployeeDetail';
import { ChatProvider } from './context/ChatContext';
import { OrganogramView } from './pages/organogram/OrganogramView';

function App() {
  return (
    <ChatProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/organizations" element={<OrganizationList />} />
            <Route path="/organizations/:id" element={<OrganizationDetail />} />
            <Route path="/organizations/create" element={<OrganizationDetail />} />
            <Route path="/organogram/organization/:id" element={<OrganogramView />} />
            <Route path="/departments" element={<DepartmentList />} />
            <Route path="/departments/:id" element={<DepartmentDetail />} />
            <Route path="/departments/create" element={<DepartmentDetail />} />
            <Route path="/organogram/department/:id" element={<OrganogramView />} />
            <Route path="/positions" element={<PositionList />} />
            <Route path="/positions/:id" element={<PositionDetail />} />
            <Route path="/positions/create" element={<PositionDetail />} />
            <Route path="/employees" element={<EmployeeList />} />
            <Route path="/employees/:id" element={<EmployeeDetail />} />
            <Route path="/employees/create" element={<EmployeeDetail />} />
          </Routes>
        </Layout>
      </Router>
    </ChatProvider>
  );
}

export default App;