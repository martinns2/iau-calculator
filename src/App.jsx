import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HomeLanding from './components/HomeLanding';
import LoginModal from './components/LoginModal';
import DashboardIAU from './components/DashboardIAU';
import AdminBackoffice from './components/AdminBackoffice';

function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home', 'auth', 'dashboard', 'admin'
  
  // Mantenemos la sesión activa leyendo de localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('viabihogar_current_session');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  
  // Estado global de pesos ponderados
  const [weights, setWeights] = useState({
    transporte: 20,
    educacion: 20,
    salud: 20,
    comercio: 20,
    areasVerdes: 20
  });

  // CONTROLADOR DE NAVEGACIÓN SEGURO
  const handleNavChange = (view) => {
    if ((view === 'dashboard' || view === 'admin') && !currentUser) {
      alert('⚠️ Acceso restringido. Debes iniciar sesión para ingresar.');
      setCurrentView('auth');
      return;
    }
    setCurrentView(view);
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem('viabihogar_current_session', JSON.stringify(user));
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('viabihogar_current_session');
    setCurrentView('home');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1A2E22] font-sans antialiased">
      
      <Navbar 
        currentView={currentView} 
        setCurrentView={handleNavChange} 
        currentUser={currentUser} 
        onLogout={handleLogout} 
      />

      {currentView === 'home' && (
        <HomeLanding 
          onExplore={() => handleNavChange('dashboard')} 
          onLoginClick={() => setCurrentView('auth')} 
        />
      )}

      {currentView === 'auth' && (
        <LoginModal onLoginSuccess={handleLoginSuccess} />
      )}

      {currentView === 'dashboard' && currentUser && (
        <DashboardIAU weights={weights} />
      )}

      {currentView === 'admin' && currentUser && (
        <AdminBackoffice weights={weights} setWeights={setWeights} />
      )}

    </div>
  );
}

export default App;