import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Organization API
export const organizationAPI = {
  getAll: () => api.get('/organizations'),
  getById: (id: string) => api.get(`/organizations/${id}`),
  create: (data: any) => api.post('/organizations', data),
  update: (id: string, data: any) => api.put(`/organizations/${id}`, data),
  delete: (id: string) => api.delete(`/organizations/${id}`),
};

// Department API
export const departmentAPI = {
  getAll: () => api.get('/departments'),
  getById: (id: string) => api.get(`/departments/${id}`),
  create: (data: any) => api.post('/departments', data),
  update: (id: string, data: any) => api.put(`/departments/${id}`, data),
  delete: (id: string) => api.delete(`/departments/${id}`),
};

// Position API
export const positionAPI = {
  getAll: () => api.get('/positions'),
  getById: (id: string) => api.get(`/positions/${id}`),
  create: (data: any) => api.post('/positions', data),
  update: (id: string, data: any) => api.put(`/positions/${id}`, data),
  delete: (id: string) => api.delete(`/positions/${id}`),
};

// Employee API
export const employeeAPI = {
  getAll: () => api.get('/employees'),
  getById: (id: string) => api.get(`/employees/${id}`),
  create: (data: any) => api.post('/employees', data),
  update: (id: string, data: any) => api.put(`/employees/${id}`, data),
  delete: (id: string) => api.delete(`/employees/${id}`),
};

// Employee Position API
export const employeePositionAPI = {
  getAll: () => api.get('/employee-positions'),
  getById: (id: string) => api.get(`/employee-positions/${id}`),
  create: (data: any) => api.post('/employee-positions', data),
  update: (id: string, data: any) => api.put(`/employee-positions/${id}`, data),
  delete: (id: string) => api.delete(`/employee-positions/${id}`),
};

// Chat API
export const chatService = {
  sendMessage: async (message: string, context?: any) => {
    const response = await api.post('/chat/message', { message, context });
    return response.data;
  },
  getHistory: () => api.get('/chat/history'),
};

// Organogram API
export const organogramAPI = {
  getOrganizationChart: (organizationId: string) => api.get(`/organogram/organization/${organizationId}`),
  getDepartmentChart: (departmentId: string) => api.get(`/organogram/department/${departmentId}`),
  updatePositionHierarchy: (positionId: string, data: any) => api.put(`/organogram/position/${positionId}/hierarchy`, data),
  getHierarchyPath: (positionId: string) => api.get(`/organogram/position/${positionId}/hierarchy-path`),
};

export default api;