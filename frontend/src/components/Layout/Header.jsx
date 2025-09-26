 /////here Navigation header with user info and main actions part start///////

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { CheckSquare, User, LogOut, Users, ListTodo, AlertTriangle } from 'lucide-react';

const Header = ({ currentView, onViewChange }) => {
  const { user, logout } = useAuth();


    /////Handle user logout//////////

  const handleLogout = () => {
    logout();
  };

  
   //////Navigation items with their configurations/////////

  const navItems = [
    { id: 'all-tasks', label: 'All Tasks', icon: ListTodo },
    { id: 'my-tasks', label: 'My Tasks', icon: CheckSquare },
    { id: 'blocked-tasks', label: 'Blocked Tasks', icon: AlertTriangle },
    { id: 'users', label: 'Users', icon: Users },
  ];

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
        
          <div className="flex items-center">
            <CheckSquare className="h-8 w-8 text-indigo-600 mr-3" />
            <h1 className="text-xl font-bold text-gray-900">Smart Task Manager</h1>
          </div>

          {
          ///// Navigation part start  //////
          }
          <nav className="hidden md:flex space-x-8">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    currentView === item.id
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* The User Info and Logout functionality */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <User className="h-4 w-4" />
              <span>{user?.username}</span>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Navigation here  */}
        <div className="md:hidden border-t border-gray-200">
          <div className="flex overflow-x-auto py-2 space-x-1">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                    currentView === item.id
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;