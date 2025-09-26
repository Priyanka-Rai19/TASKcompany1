import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/Register';
import Header from './components/Layout/Header';
import TaskList from './components/Tasks/TaskList';
import UserList from './components/Users/UserList';


const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const [authView, setAuthView] = useState('login'); // 'login' or 'register'
  const [currentView, setCurrentView] = useState('all-tasks'); // 'all-tasks', 'my-tasks', 'blocked-tasks', 'users'

  
    /////Handle authentication form toggle/////
  
  const handleToggleAuthForm = () => {
    setAuthView(prev => prev === 'login' ? 'register' : 'login');
  };

  
    /////Handle main view changes////
  
  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  // Show authentication forms if user is not authenticated
  if (!isAuthenticated) {
    return authView === 'login' ? (
      <LoginForm onToggleForm={handleToggleAuthForm} />
    ) : (
      <RegisterForm onToggleForm={handleToggleAuthForm} />
    );
  }

  // Main application interface
  return (
    <TaskProvider>
      <div className="min-h-screen bg-gray-50">
        <Header currentView={currentView} onViewChange={handleViewChange} />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {currentView === 'users' ? (
            <UserList />
          ) : (
            <TaskList viewType={currentView} />
          )}
        </main>
      </div>
    </TaskProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;