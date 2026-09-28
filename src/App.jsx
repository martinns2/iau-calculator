import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HomeLanding from './components/HomeLanding';
import LoginModal from './components/LoginModal';
import DashboardIAU from './components/DashboardIAU';
import AdminBackoffice from './components/AdminBackoffice';

function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home', 'auth', 'dashboard', 'admin'
  const [currentUser, setCurrentUser] = useState(null); // Empezamos sin sesión iniciada
  
  // Estado global de pesos ponderados
  const [weights, setWeights] = useState({
    transporte: 20,
    educacion: 20,
    salud: 20,
    comercio: 20,
    areasVerdes: 20
  });

  // CONTROLADOR DE NAVEGACIÓN SEGURO (Rutas Protegidas)
  const handleNavChange = (view) => {
    // Si intenta entrar a dashboard o admin sin estar logueado, redirigir a auth
    if ((view === 'dashboard' || view === 'admin') && !currentUser) {
      alert('⚠️ Acceso restringido. Debes iniciar sesión para ingresar al comparador o al backoffice.');
      setCurrentView('auth');
      return;
    }
    setCurrentView(view);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1A2E22] font-sans antialiased">
      
      <Navbar 
        currentView={currentView} 
        setCurrentView={handleNavChange} 
        currentUser={currentUser} 
        onLogout={() => { setCurrentUser(null); setCurrentView('home'); }} 
      />

      {currentView === 'home' && (
        <HomeLanding onExplore={() => handleNavChange('dashboard')} />
      )}

      {currentView === 'auth' && (
        <LoginModal onLoginSuccess={(user) => { setCurrentUser(user); setCurrentView('dashboard'); }} />
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