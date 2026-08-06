import React, { useState } from 'react';
import Home from './Home';
import Auth from './Auth';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home' | 'auth'
  const [currentUser, setCurrentUser] = useState(null);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    alert(`Welcome back, ${user.username}! You are logged in as ${user.role}.`);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('home');
  };

  return (
    <div className="app-container">
      {currentPage === 'auth' ? (
        <div className="auth-view-wrapper">
          <div className="auth-top-bar">
            <button className="nav-btn" onClick={() => setCurrentPage('home')}>
              ← Back to Home
            </button>
          </div>
          <Auth onLoginSuccess={handleLoginSuccess} />
        </div>
      ) : (
        <Home 
          onNavigateToAuth={() => setCurrentPage('auth')} 
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}