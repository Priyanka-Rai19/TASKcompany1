/////Task Form Component////////
  /////Handles task creation and editing/////
import React, { useState, useEffect } from 'react';
import { useTask } from '../../context/TaskContext';
import { X, Plus, CreditCard as Edit2 } from 'lucide-react';

const TaskForm = ({ task = null, users = [], availableTasks = [], onCancel, onSuccess }) => {
  const { createTask, updateTask } = useTask();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form data state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Low',
    status: 'To Do',
    assignedTo: null,
    dependencies: [],
  });

  // Initialize form data when task prop changes/////
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'Low',
        status: task.status || 'To Do',
        assignedTo: task.assignedTo || null,
        dependencies: task.dependencies || [],
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'Low',
        status: 'To Do',
        assignedTo: null,
        dependencies: [],
      });
    }
  }, [task]);

  /////It Handle input changes/////
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    if (type === 'select-one' && name === 'assignedTo') {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? null : parseInt(value),
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  /////Handle dependency selection////
  const handleDependencyToggle = (taskId) => {
    setFormData(prev => ({
      ...prev,
      dependencies: prev.dependencies.includes(taskId)
        ? prev.dependencies.filter(id => id !== taskId)
        : [...prev.dependencies, taskId],
    }));
  };

  ////Handle form submission/////
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const taskData = {
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
      };

      if (task) {
        // Update existing task
        await updateTask(task.id, taskData);
      } else {
        // Creating new task
        await createTask(taskData);
      }

      onSuccess?.();
    } catch (error) {
      console.error('Error saving task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEditing = !!task;

  return (
    <div className="space-y-6">
      {/* Form header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          {isEditing ? (
            <>
              <Edit2 className="h-5 w-5 mr-2 text-indigo-600" />
              Edit Task
            </>
          ) : (
            <>
              <Plus className="h-5 w-5 mr-2 text-green-600" />
              Create New Task
            </>
          )}
        </h3>
        
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Task Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Enter task title"
            required
          />
        </div>

        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Enter task description"
          />
        </div>

        {/* Priority and Status row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>
        </div>

        {/* Assigned user */}
        <div>
          <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-1">
            Assign to User
          </label>
          <select
            id="assignedTo"
            name="assignedTo"
            value={formData.assignedTo || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Unassigned</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.username} ({user.email})
              </option>
            ))}
          </select>
        </div>

        {/* Dependencies */}
        {availableTasks.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Dependencies
            </label>
            <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2 space-y-1">
              {availableTasks.map(availableTask => (
                <label key={availableTask.id} className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={formData.dependencies.includes(availableTask.id)}
                    onChange={() => handleDependencyToggle(availableTask.id)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="flex-1 truncate">{availableTask.title}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    availableTask.status === 'Done' 
                      ? 'text-green-600 bg-green-100' 
                      : 'text-gray-600 bg-gray-100'
                  }`}>
                    {availableTask.status}
                  </span>
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Select tasks that must be completed before this task can be marked as done.
            </p>
          </div>
        )}

        {/* Form actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
          )}
          
          <button
            type="submit"
            disabled={isSubmitting || !formData.title.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                {isEditing ? 'Update Task' : 'Create Task'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;