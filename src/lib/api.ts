import axios from 'axios';

const API_BASE = '/api';

export const api = {
  getStats: async () => {
    const response = await axios.get(`${API_BASE}/stats`);
    return response.data;
  },
  getTasks: async () => {
    const response = await axios.get(`${API_BASE}/tasks`);
    return response.data;
  },
  createTask: async (task: any) => {
    const response = await axios.post(`${API_BASE}/tasks`, task);
    return response.data;
  },
  updateTask: async (id: number, updates: any) => {
    const response = await axios.patch(`${API_BASE}/tasks/${id}`, updates);
    return response.data;
  },
  deleteTask: async (id: number) => {
    const response = await axios.delete(`${API_BASE}/tasks/${id}`);
    return response.data;
  },
  getProjects: async () => {
    const response = await axios.get(`${API_BASE}/projects`);
    return response.data;
  },
  createProject: async (project: any) => {
    const response = await axios.post(`${API_BASE}/projects`, project);
    return response.data;
  },
  updateProject: async (id: number, updates: any) => {
    const response = await axios.patch(`${API_BASE}/projects/${id}`, updates);
    return response.data;
  },
  deleteProject: async (id: number) => {
    const response = await axios.delete(`${API_BASE}/projects/${id}`);
    return response.data;
  },
  getAnalytics: async () => {
    const response = await axios.get(`${API_BASE}/analytics`);
    return response.data;
  }
};
