const API_BASE_URL = 'http://localhost:3001/api';

/**
 * Generic API request handler with error handling
 * @param {string} endpoint - API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise} Response data or throws error
 * 
 */
const apiRequest = async (endpoint, options = {}) => {
    const token = localStorage.getItem('authToken');

    const defaultHeaders = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: defaultHeaders,
            ...options,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'API request failed');
        }

        return data;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
};

/////User API Methods/////

export const userAPI = {
    // Register a new user/////
    register: async (userData) => {
        return apiRequest('/users/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    },

    // Login user
    login: async (credentials) => {
        return apiRequest('/users/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    },

    // Get all users
    getAll: async () => {
        return apiRequest('/users');
    },
};


//// Task API Methods//////

export const taskAPI = {
    // Create a new task here //////
    create: async (taskData) => {
        return apiRequest('/tasks', {
            method: 'POST',
            body: JSON.stringify(taskData),
        });
    },

    // Get all tasks based on  optional filtering
    getAll: async (filters = {}) => {
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value) queryParams.append(key, value);
        });

        const queryString = queryParams.toString();
        const endpoint = queryString ? `/tasks?${queryString}` : '/tasks';

        return apiRequest(endpoint);
    },

    // Get current user's tasks
    getMyTasks: async () => {
        return apiRequest('/tasks/my-tasks');
    },

    // Get blocked tasks
    getBlocked: async () => {
        return apiRequest('/tasks/blocked');
    },

    // Update a task
    update: async (taskId, taskData) => {
        return apiRequest(`/tasks/${taskId}`, {
            method: 'PUT',
            body: JSON.stringify(taskData),
        });
    },

    // Delete a task
    delete: async (taskId) => {
        return apiRequest(`/tasks/${taskId}`, {
            method: 'DELETE',
        });
    },
};