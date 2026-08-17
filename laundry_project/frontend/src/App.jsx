import React, { useState } from 'react';
import Home from './Home';
import Services from './Services';
import AdminDashboard from './AdminDashboard';
import About from './About';
import Auth from './Auth';
import Pricing from './Pricing';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');

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

  // Handle successful login
  function handleLoginSuccess(user) {
    setCurrentUser(user);
    
    // If the logged in user is an admin, go directly to admin dashboard!
    if (user && user.role === 'admin') {
      handleNavigate('admin');
    } else {
      handleNavigate('home');
    }
  }

  return (
    <div className="app-container">
      {/* 1. HOME VIEW */}
      {currentPage === 'home' && (
        <Home 
         currentUser={currentUser}
          onLogout={handleLogout}
          onNavigateToServices={() => setCurrentPage('services')}
          onNavigateToAbout={() => setCurrentPage('about')}
          onNavigateToPricing={()=> setCurrentPage('pricing')}
          onNavigateToAuth={() => setCurrentPage('auth')}
          onNavigateToAdmin={() => setCurrentPage('admin')} 
        />
      )}

      {/* 2. SERVICES VIEW */}
      {currentPage === 'services' && (
        <Services 
          onNavigateHome={() => handleNavigate('home')}
          onNavigateToAuth={() => handleNavigate('auth')}
          onNavigateToAbout={() => handleNavigate('about')}
          onNavigateToPricing={()=> handleNavigate('pricing')}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      )}

      {/* 3. AUTH (SIGN IN / REGISTER) VIEW - THIS WAS MISSING */}
      {currentPage === 'auth' && (
        <Auth 
          onNavigateHome={() => handleNavigate('home')}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* 4. ADMIN DASHBOARD VIEW */}
      {currentPage === 'admin' && (
        <AdminDashboard 
          currentUser={currentUser}
          onLogout={handleLogout}
          onNavigateHome={() => setCurrentPage('home')}
        />
      )}

      {/* 5. ABOUT VIEW */}
      {currentPage === 'about' && (
        <About 
          currentUser={currentUser}
          onNavigate={handleNavigate}
          onNavigateToAuth={() => handleNavigate('auth')}
          onNavigateToAdmin={() => handleNavigate('admin')}
          onNavigateHome={() => handleNavigate('home')}
          onNavigateToServices={() => handleNavigate('services')}
          onNavigateToPricing={()=> handleNavigate('pricing')}
        />
      )}

      {/*6. Pricing View */}
      {currentPage === 'pricing' && (
  <Pricing 
    currentUser={currentUser}
    onLogout={handleLogout}
    onNavigateToHome={() => handleNavigate('home')}
    onNavigateToServices={() => handleNavigate('services')}
    onNavigateToAbout={() => handleNavigate('about')}
    onNavigateToAuth={() => handleNavigate('auth')}
    onNavigateToAdmin={() => handleNavigate('admin')} 
  />
)}
    </div>
  );
}