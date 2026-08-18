import React, { useState } from 'react';
import Home from './Home';
import Services from './Services';
import AdminDashboard from './AdminDashboard';
import ClientDashboard from './ClientDashboard';
import About from './About';
import Auth from './Auth';
import Pricing from './Pricing';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    // Optional: Keep session on page refresh
    const savedUser = localStorage.getItem("violetta_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [currentPage, setCurrentPage] = useState('home');

  // Function to navigate between pages
  function handleNavigate(page) {
    setCurrentPage(page);
    // Clear any hash (#services, #home, etc.) from the URL bar
    window.history.pushState('', document.title, window.location.pathname);
    window.scrollTo(0, 0);
  }

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem("violetta_user", JSON.stringify(userData));

    // Redirect admins to admin dashboard and clients to client dashboard
    const userRole = userData?.role?.toLowerCase();
    if (userRole === 'admin') {
      handleNavigate('admin');
    } else {
      handleNavigate('client-dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("violetta_user");
    handleNavigate('home');
  };

  return (
    <div className="app-container">
      {/* 1. HOME VIEW */}
      {currentPage === 'home' && (
        <Home 
          currentUser={currentUser}
          onLogout={handleLogout}
          onNavigateToServices={() => setCurrentPage('services')}
          onNavigateToAbout={() => setCurrentPage('about')}
          onNavigateToPricing={() => setCurrentPage('pricing')}
          onNavigateToAuth={() => setCurrentPage('auth')}
          onNavigateToAdmin={() => setCurrentPage('admin')} 
          onNavigateToDashboard={() => handleNavigate('client-dashboard')}
        />
      )}

      {/* 2. SERVICES VIEW */}
      {currentPage === 'services' && (
        <Services 
          onNavigateHome={() => handleNavigate('home')}
          onNavigateToAuth={() => handleNavigate('auth')}
          onNavigateToAbout={() => handleNavigate('about')}
          onNavigateToPricing={() => handleNavigate('pricing')}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      )}

      {/* 3. AUTH (SIGN IN / REGISTER) VIEW */}
      {currentPage === 'auth' && (
        <Auth 
          onNavigateHome={() => handleNavigate('home')}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* 4. CLIENT DASHBOARD VIEW */}
      {currentPage === 'client-dashboard' && (
        <ClientDashboard 
          currentUser={currentUser}
          onLogout={handleLogout}
          onNavigateHome={() => handleNavigate('home')}
        />
      )}

      {/* 5. ADMIN DASHBOARD VIEW */}
      {currentPage === 'admin' && (
        <AdminDashboard 
          currentUser={currentUser}
          onLogout={handleLogout}
          onNavigateHome={() => setCurrentPage('home')}
        />
      )}

      {/* 6. ABOUT VIEW */}
      {currentPage === 'about' && (
        <About 
          currentUser={currentUser}
          onNavigate={handleNavigate}
          onNavigateToAuth={() => handleNavigate('auth')}
          onNavigateToAdmin={() => handleNavigate('admin')}
          onNavigateHome={() => handleNavigate('home')}
          onNavigateToServices={() => handleNavigate('services')}
          onNavigateToPricing={() => handleNavigate('pricing')}
        />
      )}

      {/* 7. PRICING VIEW */}
      {currentPage === 'pricing' && (
        <Pricing 
          currentUser={currentUser}
          onLogout={handleLogout}
          onNavigateHome={() => handleNavigate('home')}
          onNavigateToServices={() => handleNavigate('services')}
          onNavigateToAbout={() => handleNavigate('about')}
          onNavigateToAuth={() => handleNavigate('auth')}
          onNavigateToAdmin={() => handleNavigate('admin')} 
        />
      )}
    </div>
  );
}