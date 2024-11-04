// src/App.tsx
import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { Board } from './components/Board';
import LoginForm from './components/Auth/LoginForm';
import { useAuth } from './context/AuthContext';
import './App.css';

const AppContent = () => {
  const { currentUser, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (currentUser) {
    return (
      <div>
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={signOut}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Se déconnecter
          </button>
        </div>
        <Board />
      </div>
    );
  }

  return <LoginForm />;
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;