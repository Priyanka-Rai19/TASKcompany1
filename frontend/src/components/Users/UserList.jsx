//////////Displays all registered users in the system///////////
 
import React, { useEffect } from 'react';
import { useTask } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Calendar, CheckSquare, AlertCircle } from 'lucide-react';

const UserList = () => {
  const { users, tasks, loading, error, loadUsers, loadTasks, clearError } = useTask();
  const { user: currentUser } = useAuth();

  
   //// Load users and tasks on component mount////

  useEffect(() => {
    const loadData = async () => {
      await loadUsers();
      await loadTasks();
    };
    
    loadData();
  }, [loadUsers, loadTasks]);

  
   ///// Get task statistics for a user//////

  const getUserTaskStats = (userId) => {
    const userTasks = tasks.filter(task => task.assignedTo === userId);
    
    return {
      total: userTasks.length,
      toDo: userTasks.filter(t => t.status === 'To Do').length,
      inProgress: userTasks.filter(t => t.status === 'In Progress').length,
      done: userTasks.filter(t => t.status === 'Done').length,
      blocked: userTasks.filter(t => t.isBlocked).length,
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-3 text-gray-600">Loading users...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Users</h2>
        <p className="text-gray-600 mt-1">All registered users and their task statistics</p>
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

      {
      ////// User Statistics //////
      }
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-indigo-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-indigo-600">{users.length}</div>
          <div className="text-sm text-indigo-800">Total Users</div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">
            {users.filter(user => tasks.some(task => task.assignedTo === user.id)).length}
          </div>
          <div className="text-sm text-green-800">Users with Tasks</div>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">{tasks.length}</div>
          <div className="text-sm text-blue-800">Total Tasks</div>
        </div>
      </div>

      {/* User List */}
      {users.length > 0 ? (
        <div className="grid gap-6">
          {users.map(user => {
            const taskStats = getUserTaskStats(user.id);
            const isCurrentUser = currentUser?.id === user.id;
            
            return (
              <div
                key={user.id}
                className={`bg-white rounded-lg shadow-md border-2 p-6 transition-all ${
                  isCurrentUser 
                    ? 'border-indigo-200 bg-indigo-50' 
                    : 'border-gray-200 hover:shadow-lg'
                }`}
              >
                <div className="flex items-start justify-between">
                  {/* User Information  */}
                  <div className="flex items-start space-x-4">
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                      isCurrentUser ? 'bg-indigo-200' : 'bg-gray-200'
                    }`}>
                      <User className={`h-6 w-6 ${
                        isCurrentUser ? 'text-indigo-700' : 'text-gray-600'
                      }`} />
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {user.username}
                        </h3>
                        {isCurrentUser && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            You
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Mail className="h-4 w-4 mr-1" />
                        {user.email}
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        Joined {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* It will represent the Task Statistics */}
                  <div className="text-right">
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <CheckSquare className="h-4 w-4 mr-1" />
                      Task Summary
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-gray-100 px-3 py-1 rounded text-center">
                        <div className="font-semibold text-gray-900">{taskStats.total}</div>
                        <div className="text-gray-600">Total</div>
                      </div>
                      
                      <div className="bg-green-100 px-3 py-1 rounded text-center">
                        <div className="font-semibold text-green-700">{taskStats.done}</div>
                        <div className="text-green-600">Done</div>
                      </div>
                      
                      <div className="bg-blue-100 px-3 py-1 rounded text-center">
                        <div className="font-semibold text-blue-700">{taskStats.inProgress}</div>
                        <div className="text-blue-600">In Progress</div>
                      </div>
                      
                      <div className="bg-yellow-100 px-3 py-1 rounded text-center">
                        <div className="font-semibold text-yellow-700">{taskStats.toDo}</div>
                        <div className="text-yellow-600">To Do</div>
                      </div>
                    </div>

                    {taskStats.blocked > 0 && (
                      <div className="mt-2 bg-orange-100 px-3 py-1 rounded text-center">
                        <div className="font-semibold text-orange-700">{taskStats.blocked}</div>
                        <div className="text-orange-600 text-xs">Blocked</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                {taskStats.total > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>Task Progress</span>
                      <span>{Math.round((taskStats.done / taskStats.total) * 100)}% Complete</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(taskStats.done / taskStats.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="mx-auto h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <User className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-600">Users will appear here once they register.</p>
        </div>
      )}
    </div>
  );
};

export default UserList;