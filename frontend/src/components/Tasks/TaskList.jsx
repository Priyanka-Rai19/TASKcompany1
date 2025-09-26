 ////////Task List Component/////////
 ////// Displays a list of tasks with filtering and management capabilities//////


import React, { useState, useEffect } from 'react';
import { useTask } from '../../context/TaskContext';
import { Plus, AlertCircle } from 'lucide-react';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import TaskFilters from './TaskFilters';

const TaskList = ({ viewType = 'all-tasks' }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { 
    tasks, 
    users, 
    loading, 
    error, 
    loadTasks, 
    loadMyTasks, 
    loadBlockedTasks, 
    loadUsers,
    clearError 
  } = useTask();

  
  useEffect(() => {
    const loadData = async () => {
      // Always load users for task assignments
      await loadUsers();
      
      // Load tasks based on view type
      switch (viewType) {
        case 'my-tasks':
          await loadMyTasks();
          break;
        case 'blocked-tasks':
          await loadBlockedTasks();
          break;
        case 'all-tasks':
        default:
          await loadTasks();
          break;
      }
    };

    loadData();
  }, [viewType, loadTasks, loadMyTasks, loadBlockedTasks, loadUsers]);

  /**
   * Refresh tasks when filters change (for all-tasks view)
   */
  useEffect(() => {
    if (viewType === 'all-tasks') {
      loadTasks();
    }
  }, [viewType, loadTasks]);

  //////Get view title and description/////

  const getViewInfo = () => {
    switch (viewType) {
      case 'my-tasks':
        return {
          title: 'My Tasks',
          description: 'Tasks assigned to you',
          showFilters: false,
        };
      case 'blocked-tasks':
        return {
          title: 'Blocked Tasks',
          description: 'Tasks that cannot be completed due to pending dependencies',
          showFilters: false,
        };
      case 'all-tasks':
      default:
        return {
          title: 'All Tasks',
          description: 'Complete task overview with filtering options',
          showFilters: true,
        };
    }
  };

  
    //////Handle create task success///////

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    // Reload tasks based on current view/////
    switch (viewType) {
      case 'my-tasks':
        loadMyTasks();
        break;
      case 'blocked-tasks':
        loadBlockedTasks();
        break;
      default:
        loadTasks();
        break;
    }
  };

  const viewInfo = getViewInfo();

  if (loading && tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-3 text-gray-600">Loading tasks...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{viewInfo.title}</h2>
          <p className="text-gray-600 mt-1">{viewInfo.description}</p>
        </div>
        
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{error}</span>
          <button
            onClick={clearError}
            className="ml-auto text-red-600 hover:text-red-800"
          >
            ×
          </button>
        </div>
      )}

      {////It Filters only for all-tasks view///// 
      }
      {viewInfo.showFilters && <TaskFilters users={users} />}

      {/* Create Task Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <TaskForm
            users={users}
            availableTasks={tasks}
            onCancel={() => setShowCreateForm(false)}
            onSuccess={handleCreateSuccess}
          />
        </div>
      )}

    
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">{tasks.length}</div>
          <div className="text-sm text-blue-800">Total Tasks</div>
        </div>
        
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {tasks.filter(t => t.status === 'To Do').length}
          </div>
          <div className="text-sm text-yellow-800">To Do</div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600">
            {tasks.filter(t => t.status === 'In Progress').length}
          </div>
          <div className="text-sm text-purple-800">In Progress</div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">
            {tasks.filter(t => t.status === 'Done').length}
          </div>
          <div className="text-sm text-green-800">Done</div>
        </div>
        
        <div className="bg-orange-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-orange-600">
            {tasks.filter(t => t.isBlocked).length}
          </div>
          <div className="text-sm text-orange-800">Blocked</div>
        </div>
      </div>

      {/* Task List are here */}
      {tasks.length > 0 ? (
        <div className="grid gap-6">
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              users={users}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="mx-auto h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {viewType === 'my-tasks' ? 'No tasks assigned to you' : 
             viewType === 'blocked-tasks' ? 'No blocked tasks found' : 
             'No tasks found'}
          </h3>
          <p className="text-gray-600">
            {viewType === 'my-tasks' ? 'Tasks assigned to you will appear here.' :
             viewType === 'blocked-tasks' ? 'Tasks with unmet dependencies will appear here.' :
             'Get started by creating your first task.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskList;