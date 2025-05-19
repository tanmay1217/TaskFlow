import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// API service
const api = {
  // Get all tasks
  getTasks: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tasks`);
      return { data: response.data.data };
    } catch (error) {
      return { data: [], error: 'Failed to fetch tasks' };
    }
  },

  // Create a new task
  createTask: async (task) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/tasks`, task);
      return { data: response.data.data };
    } catch (error) {
      return { data: {}, error: 'Failed to create task' };
    }
  },

  // Update an existing task
  updateTask: async (updatedTask) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/tasks/${updatedTask.id}`, updatedTask);
      return { data: response.data.data };
    } catch (error) {
      return { data: {}, error: 'Failed to update task' };
    }
  },

  // Delete a task
  deleteTask: async (taskId) => {
    try {
      await axios.delete(`${API_BASE_URL}/tasks/${taskId}`);
      return { data: true };
    } catch (error) {
      return { data: false, error: 'Failed to delete task' };
    }
  },

  // Update task status and position (drag and drop)
  updateTaskStatus: async (taskId, status, position) => {
    try {
      // Get the current task
      const taskRes = await axios.get(`${API_BASE_URL}/tasks`);
      const task = taskRes.data.data.find(t => t.id === taskId);
      if (!task) return { data: {}, error: 'Task not found' };
      const updatedTask = { ...task, status, position };
      const response = await axios.put(`${API_BASE_URL}/tasks/${taskId}`, updatedTask);
      return { data: response.data.data };
    } catch (error) {
      return { data: {}, error: 'Failed to update task status' };
    }
  }
};

export default api; 