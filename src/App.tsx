import React from 'react';
import { useAuth } from './context/AuthContext';
import { Board } from './components/Board';
import { LoginForm } from './components/Auth/LoginForm';

function App() {
  const { currentUser } = useAuth();

  return (
    <div className="w-full h-screen">
      {currentUser?.emailVerified ? <Board /> : <LoginForm />}
    </div>
  );
}

export default App;