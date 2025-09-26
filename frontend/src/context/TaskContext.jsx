import React, { createContext, useContext, useState, useCallback } from 'react';
import { taskAPI, userAPI } from '../services/api';

const TaskContext = createContext();
///here creating custom hook to use task content////

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

////// creating task provider component here/////

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // here are Filter states//////
  const [filters, setFilters] = useState({
    priority: '',
    status: '',
    assignedTo: '',
    blocked: false,
  });

  //// Clear error messages/////
   
  const clearError = useCallback(() => {
    setError(null);
  }, []);

   ///// It will Load all tasks with current filters////

  const loadTasks = useCallback(async (customFilters = null) => {
    try {
      setLoading(true);
      setError(null);
      
      const filterParams = customFilters || filters;
      const cleanFilters = Object.fromEntries(
        Object.entries(filterParams).filter(([_, value]) => value && value !== '')
      );
      
      const data = await taskAPI.getAll(cleanFilters);
      setTasks(data);
    } catch (err) {
      setError(err.message);
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);


   //////It will load users assigned task//////
  const loadMyTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await taskAPI.getMyTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message);
      console.error('Error loading my tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);


   //////It will Load blocked tasks/////

  const loadBlockedTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await taskAPI.getBlocked();
      setTasks(data);
    } catch (err) {
      setError(err.message);
      console.error('Error loading blocked tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  
   /// It will Load all users/////
   
  const loadUsers = useCallback(async () => {
    try {
      const data = await userAPI.getAll();
      setUsers(data);
    } catch (err) {
      console.error('Error loading users:', err);
    }
  }, []);

  /**
   * Create a new task
   * @param {object} taskData - Task creation data
   */
  const createTask = useCallback(async (taskData) => {
    try {
      setLoading(true);
      setError(null);
      
      const newTask = await taskAPI.create(taskData);
      setTasks(prev => [...prev, newTask]);
      
      return newTask;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update an existing task
   * @param {number} taskId - Task ID
   * @param {object} taskData - Updated task data
   */
  const updateTask = useCallback(async (taskId, taskData) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedTask = await taskAPI.update(taskId, taskData);
      
      setTasks(prev => 
        prev.map(task => task.id === taskId ? updatedTask : task)
      );
      
      return updatedTask;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Delete a task
   * @param {number} taskId - Task ID
   */
  const deleteTask = useCallback(async (taskId) => {
    try {
      setLoading(true);
      setError(null);
      
      await taskAPI.delete(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update filter settings
   * @param {object} newFilters - New filter values
   */
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  
    ////Clear all filters/////

  const clearFilters = useCallback(() => {
    setFilters({
      priority: '',
      status: '',
      assignedTo: '',
      blocked: false,
    });
  }, []);

  const value = {
    // States are present /////
    tasks,
    users,
    loading,
    error,
    filters,
    
    // Methods are here ////
    loadTasks,
    loadMyTasks,
    loadBlockedTasks,
    loadUsers,
    createTask,
    updateTask,
    deleteTask,
    updateFilters,
    clearFilters,
    clearError,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};