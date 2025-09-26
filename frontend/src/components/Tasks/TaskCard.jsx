import React, { useState } from 'react';
import { useTask } from '../../context/TaskContext';
import { CreditCard as Edit2, Trash2, Clock, CheckCircle, AlertCircle, User, Link } from 'lucide-react';
import TaskForm from './TaskForm';

const TaskCard = ({ task, users }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { updateTask, deleteTask, tasks } = useTask();

  
   ////here it is Getting priority color classes///

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  
   //////Get status color classes///////

  const getStatusColor = (status) => {
    switch (status) {
      case 'Done':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'In Progress':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'To Do':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  
    ////////Get assigned user name//////////

  const getAssignedUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.username : 'Unassigned';
  };


   //////Get dependency task titles/////////

  const getDependencyTitles = (dependencyIds) => {
    if (!dependencyIds || dependencyIds.length === 0) return [];
    
    return dependencyIds
      .map(id => {
        const depTask = tasks.find(t => t.id === id);
        return depTask ? depTask.title : `Task ${id}`;
      })
      .filter(Boolean);
  };

  
    ///////Handle task status update///////
   
  const handleStatusChange = async (newStatus) => {
    try {
      await updateTask(task.id, { status: newStatus });
    } catch (error) {
      console.log('Error updating task status:', error);
    }
  };

  
   ///////It is handling task deletion///////

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteTask(task.id);
    } catch (error) {
      console.log('Error deleting task:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  
   ////Handle edit completion///////

  const handleEditComplete = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <TaskForm
          task={task}
          users={users}
          availableTasks={tasks.filter(t => t.id !== task.id)}
          onCancel={handleEditComplete}
          onSuccess={handleEditComplete}
        />
      </div>
    );
  }

  const dependencyTitles = getDependencyTitles(task.dependencies);

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="p-6">
        {//////// it is defined that Header with title and actions ///////
        }
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex-1 mr-4">
            {task.title}
          </h3>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
              title="Edit task"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
              title="Delete task"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {//////Description /////
        }
        {task.description && (
          <p className="text-gray-600 mb-4">{task.description}</p>
        )}

        {//// Priority and Status badges */////
        }
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
            {task.priority} Priority
          </span>
          
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
            {task.status}
          </span>

          {task.isBlocked && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-orange-600 bg-orange-50 border border-orange-200">
              <AlertCircle className="h-3 w-3 mr-1" />
              Blocked
            </span>
          )}
        </div>

        {/////// Assigned user is Assigned here //////
        }
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <User className="h-4 w-4 mr-2" />
          <span>Assigned to: <strong>{getAssignedUserName(task.assignedTo)}</strong></span>
        </div>

        {/* Dependencies */}
        {dependencyTitles.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <Link className="h-4 w-4 mr-2" />
              <span>Depends on:</span>
            </div>
            <div className="ml-6 space-y-1">
              {dependencyTitles.map((title, index) => (
                <div key={index} className="text-sm text-gray-500">
                  • {title}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick status actions */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
          {task.status !== 'Done' && !task.isBlocked && (
            <button
              onClick={() => handleStatusChange('Done')}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-md transition-colors"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Mark Complete
            </button>
          )}
          
          {task.status === 'To Do' && (
            <button
              onClick={() => handleStatusChange('In Progress')}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
            >
              <Clock className="h-4 w-4 mr-1" />
              Start Working
            </button>
          )}

          {task.status === 'In Progress' && (
            <button
              onClick={() => handleStatusChange('To Do')}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
            >
              Move to To Do
            </button>
          )}
        </div>

        {/* Created date */}
        <div className="text-xs text-gray-400 mt-4 pt-2 border-t border-gray-100">
          Created: {new Date(task.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;