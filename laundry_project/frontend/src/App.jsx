import React, { useState } from 'react';
import Home from './Home';
import Services from './Services';
import AdminDashboard from './AdminDashboard';
import Auth from './Auth';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentUser, setCurrentUser] = useState(null);

  // Function to navigate between pages
  function handleNavigate(page) {
  setCurrentPage(page);
  // Clear any hash (#services, #home, etc.) from the URL bar
  window.history.pushState('', document.title, window.location.pathname);
  window.scrollTo(0, 0);
}

  function handleLogout() {
    setCurrentUser(null);
    setCurrentPage('home');
  }

  return (
    <div className="app-container">
      {currentPage === 'home' && (
        <Home 
          onNavigateToServices={() => handleNavigate('services')}
          onNavigateToAuth={() => handleNavigate('auth')}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      )}

      {currentPage === 'services' && (
        <Services 
          onNavigateHome={() => handleNavigate('home')}
          onNavigateToAuth={() => handleNavigate('auth')}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      )}

      {currentPage === 'admin' && (
        <AdminDashboard 
          currentUser={currentUser}
          onLogout={handleLogout}
          onNavigateHome={() => handleNavigate('home')}
        />
      )}
    </div>
  );
}