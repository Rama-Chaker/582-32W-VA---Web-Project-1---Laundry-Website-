import React, { useState } from 'react';
import Home from './Home';
import Auth from './Auth';
import AdminDashboard from './AdminDashboard';

export default function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home', 'auth', 'admin'
  const [currentUser, setCurrentUser] = useState(null);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    if (user.role === 'Admin') {
      setCurrentView('admin');
    } else {
      setCurrentView('home');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('home');
  };

  if (currentView === 'auth') {
    return (
      <Auth 
        onLoginSuccess={handleLoginSuccess}
        onNavigateHome={() => setCurrentView('home')}
      />
    );
  }

  if (currentView === 'admin' || (currentUser && currentUser.role === 'Admin')) {
    return (
      <AdminDashboard 
        currentUser={currentUser}
        onLogout={handleLogout}
        onNavigateHome={() => setCurrentView('home')}
      />
    );
  }

  return (
    <Home 
      onNavigateToAuth={() => setCurrentView('auth')}
      currentUser={currentUser}
      onLogout={handleLogout}
    />
  );
}