import React, { useState } from 'react';
import { calculateIAU } from './utils/iauCalculator';
import { mockProjects } from './data/excelData';

function App() {
  const [currentView, setCurrentView] = useState('home'); 
  const [selectedProject, setSelectedProject] = useState("Proyecto A");
  
  // Base de datos simulada en memoria para usuarios registrados
  const [registeredUsers, setRegisteredUsers] = useState([
    { email: 'admin@viabihogar.pe', password: 'password123', role: 'Administrador' }
  ]);

  // Estados de Autenticación
  const [authMode, setAuthMode] = useState('login'); // 'login', 'register'
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // Pesos configurables (Ponderaciones del IVU)
  const [weights, setWeights] = useState({
    transporte: 20,
    educacion: 20,
    salud: 20,
    comercio: 20,
    areasVerdes: 20
  });

  const result = calculateIAU(mockProjects[selectedProject], weights);

  const handleWeightChange = (factor, val) => {
    setWeights({
      ...weights,
      [factor]: parseFloat(val) || 0
    });
  };

  const totalWeightSum = Object.values(weights).reduce((a, b) => a + b, 0);

  // VALIDACIÓN REAL DE CREDENCIALES
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    // Validar formato de correo básico
    if (!emailInput.includes('@') || !emailInput.includes('.')) {
      setAuthError('Por favor ingresa un correo electrónico válido.');
      return;
    }

    // Validar longitud de contraseña
    if (passwordInput.length < 6) {
      setAuthError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (authMode === 'register') {
      // Verificar si el usuario ya existe
      const existingUser = registeredUsers.find(u => u.email === emailInput);
      if (existingUser) {
        setAuthError('Este correo ya está registrado. Inicia sesión.');
        return;
      }

      // Registrar nuevo usuario
      const newUser = { email: emailInput, password: passwordInput, role: 'Urbanista' };
      setRegisteredUsers([...registeredUsers, newUser]);
      setAuthSuccess('¡Cuenta creada con éxito! Ahora puedes iniciar sesión.');
      setAuthMode('login');
      setPasswordInput('');
    } else {
      // Validar Login
      const validUser = registeredUsers.find(
        u => u.email === emailInput && u.password === passwordInput
      );

      if (validUser) {
        setCurrentUser(validUser);
        setEmailInput('');
        setPasswordInput('');
        setCurrentView('dashboard');
      } else {
        setAuthError('Correo o contraseña incorrectos. Verifica tus datos.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1A2E22] font-sans antialiased selection:bg-emerald-200">
      
      {/* NAVBAR SUPERIOR INSTITUCIONAL */}
      <header className="bg-white/95 backdrop-blur-md border-b border-emerald-950/10 px-6 lg:px-12 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <button onClick={() => setCurrentView('home')} className="flex items-center gap-2 font-black text-xl tracking-tight text-emerald-950">
            <span className="bg-emerald-900 text-white p-2 rounded-xl text-sm shadow-sm">🏡</span> ViabiHogar
          </button>
          
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <button onClick={() => setCurrentView('home')} className="hover:text-emerald-900 transition-colors">Buscar Proyectos</button>
            <button onClick={() => setCurrentView('dashboard')} className="hover:text-emerald-900 transition-colors">Comparador IVU</button>
            <span className="text-emerald-950/20">|</span>
            <span className="text-xs bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full font-extrabold">Perú 2026</span>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setCurrentView('admin')}
            className="flex items-center gap-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl transition-all border border-slate-200 shadow-xs"
          >
            ⚙️ Backoffice
          </button>
          
          {currentUser ? (
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
              <span className="text-xs font-bold text-emerald-950">{currentUser.email}</span>
              <button onClick={() => { setCurrentUser(null); setCurrentView('home'); }} className="text-xs text-rose-600 font-extrabold ml-2 hover:underline">Salir</button>
            </div>
          ) : (
            <button onClick={() => setCurrentView('auth')} className="bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm">
              Iniciar sesión
            </button>
          )}
        </div>
      </header>

      {/* VISTA 1: HOME */}
      {currentView === 'home' && (
        <main>
          <section className="bg-emerald-950 text-white py-20 px-6 md:px-12 lg:px-24 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>
            
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
              <div className="lg:col-span-7 space-y-6">
                <span className="bg-emerald-900/80 text-emerald-300 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider border border-emerald-800">
                  Plataforma Verificada • Fondo Mivivienda
                </span>
                <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1]">
                  Tu primera vivienda, <br/><span className="text-emerald-400">sin letra pequeña.</span>
                </h1>
                <p className="text-emerald-100/80 text-base md:text-lg max-w-xl font-normal leading-relaxed">
                  Analiza la viabilidad urbana real mediante distancias a servicios, calcula tus bonos habitacionales y toma la decisión más inteligente.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <button onClick={() => setCurrentView('dashboard')} className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-7 py-4 rounded-2xl transition-all shadow-xl">
                    🔍 Explorar proyectos
                  </button>
                  <button onClick={() => setCurrentView('dashboard')} className="bg-emerald-900/60 hover:bg-emerald-900 text-white font-bold px-7 py-4 rounded-2xl transition-all border border-emerald-700/50">
                    📊 Verificador IVU
                  </button>
                </div>
              </div>

              {/* Formulario rápido Home */}
              <div className="lg:col-span-5 bg-white text-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-100">
                <h2 className="text-xl font-black mb-1">Encuentra tu vivienda ideal</h2>
                <p className="text-xs text-slate-500 mb-6">Regístrate para guardar tus comparaciones de proyectos.</p>
                
                <form onSubmit={(e) => { e.preventDefault(); setCurrentView('auth'); }} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Correo electrónico</label>
                    <input type="email" placeholder="tucorreo@gmail.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Teléfono / WhatsApp</label>
                    <input type="text" placeholder="987 654 321" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium" required />
                  </div>
                  <button type="submit" className="w-full bg-emerald-950 hover:bg-emerald-900 text-white font-black py-4 rounded-xl transition-all shadow-lg text-sm mt-2">
                    Continuar al sistema →
                  </button>
                </form>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* VISTA AUTH: LOGIN REAL CON VALIDACIÓN */}
      {currentView === 'auth' && (
        <main className="max-w-md mx-auto px-6 py-16">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
            <div className="text-center">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">Seguridad Verificada</span>
              <h2 className="text-2xl font-black text-slate-900 mt-2">
                {authMode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta Nueva'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {authMode === 'login' ? 'Ingresa tus credenciales autorizadas.' : 'Regístrate con un correo y contraseña segura.'}
              </p>
            </div>

            {/* Mensajes de error o éxito */}
            {authError && (
              <div className="bg-rose-50 text-rose-700 p-3.5 rounded-2xl text-xs font-bold border border-rose-200 text-center">
                ⚠️ {authError}
              </div>
            )}
            {authSuccess && (
              <div className="bg-emerald-50 text-emerald-800 p-3.5 rounded-2xl text-xs font-bold border border-emerald-200 text-center">
                ✅ {authSuccess}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Correo electrónico</label>
                <input 
                  type="email" 
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="ejemplo@viabihogar.pe" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700" 
                  required 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Contraseña (mín. 6 caracteres)</label>
                <input 
                  type="password" 
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700" 
                  required 
                />
              </div>

              <button type="submit" className="w-full bg-emerald-950 hover:bg-emerald-900 text-white font-black py-3.5 rounded-xl transition-all shadow-md text-sm mt-2">
                {authMode === 'login' ? 'Ingresar al Sistema' : 'Registrar Cuenta'}
              </button>
            </form>

            <div className="text-center pt-2 border-t border-slate-100">
              <button 
                onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setAuthError(''); setAuthSuccess(''); }}
                className="text-xs font-bold text-emerald-800 hover:underline"
              >
                {authMode === 'login' ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia sesión'}
              </button>
              
              {authMode === 'login' && (
                <p className="text-[11px] text-slate-400 mt-3">
                  💡 Credencial de prueba por defecto:<br/>
                  <strong className="text-slate-600">admin@viabihogar.pe</strong> / <strong className="text-slate-600">password123</strong>
                </p>
              )}
            </div>
          </div>
        </main>
      )}

      {/* VISTA 2: DASHBOARD COMPARADOR IVU */}
      {currentView === 'dashboard' && (
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <span className="text-xs font-bold text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full">Módulo Analítico IVU</span>
              <h1 className="text-3xl font-black text-slate-900 mt-2">Comparador de Proyectos Inmobiliarios</h1>
              <p className="text-slate-600 text-sm">Normalización algorítmica por rangos urbanos oficiales.</p>
            </div>
            <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs">
              {Object.keys(mockProjects).map(proj => (
                <button
                  key={proj}
                  onClick={() => setSelectedProject(proj)}
                  className={`px-5 py-2 rounded-xl font-bold text-sm transition-all ${
                    selectedProject === proj 
                      ? 'bg-emerald-950 text-white shadow-md' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {proj}
                </button>
              ))}
            </div>
          </div>

          {/* Tarjetas KPI */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Proyecto Activo</span>
              <p className="text-2xl font-black text-slate-900 my-2">{selectedProject}</p>
              <span className="text-xs text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg w-fit">Verificado Mivivienda</span>
            </div>

            <div className={`p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between ${result.iauInterpretation.bg}`}>
              <span className="text-xs font-bold uppercase tracking-wider opacity-70">IVU Final Calculado</span>
              <div className="flex items-baseline gap-2 my-1">
                <p className={`text-5xl font-black ${result.iauInterpretation.color}`}>{result.iauScore}</p>
                <span className="text-sm font-bold opacity-60">/ 100</span>
              </div>
              <p className={`text-xs font-bold ${result.iauInterpretation.color}`}>{result.iauInterpretation.level}</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Factor Destacado</span>
              <p className="text-lg font-extrabold text-emerald-800 my-1">{result.highestFactor.name}</p>
              <span className="text-xs font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded w-fit">{result.highestFactor.score} pts Normalizados</span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Factor Crítico</span>
              <p className="text-lg font-extrabold text-rose-600 my-1">{result.lowestFactor.name}</p>
              <span className="text-xs font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded w-fit">{result.lowestFactor.score} pts Normalizados</span>
            </div>
          </div>

          {/* Desglose */}
          <h2 className="text-xl font-extrabold text-slate-900 mb-4">Desglose Metodológico de Factores</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(result.factorDetails).map(factor => (
              <div key={factor.name} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex justify-between items-start">
                  <h4 className="font-extrabold text-slate-900 text-base">{factor.name}</h4>
                  <span className="bg-slate-100 text-slate-800 font-black text-xs px-3 py-1 rounded-xl">
                    {factor.distance} m
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1 text-slate-500">
                    <span>Puntaje Escala</span>
                    <span className="text-slate-800 font-bold">{factor.score} / 100</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-800 h-full rounded-full transition-all duration-500" style={{ width: `${factor.score}%` }}></div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-between text-xs">
                  <span className="text-slate-500">Peso: <strong>{factor.weightPercent}%</strong></span>
                  <span className="text-emerald-900 font-black text-sm">Aporte: {factor.ponderado} pts</span>
                </div>

                <div className="text-xs bg-[#F9F8F6] p-3 rounded-2xl border border-slate-100 text-slate-600">
                  <strong>Rango:</strong> {factor.range} ({factor.level})
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* VISTA 3: BACKOFFICE / ADMIN */}
      {currentView === 'admin' && (
        <main className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-8">
            <div>
              <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">Panel de Administración</span>
              <h1 className="text-2xl font-black text-slate-900 mt-2">Backoffice ViabiHogar • Ponderaciones IVU</h1>
              <p className="text-slate-600 text-xs">Ajusta los factores de peso para recalcular dinámicamente la viabilidad.</p>
            </div>

            <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
              {Object.keys(weights).map(factor => (
                <div key={factor} className="space-y-2 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex justify-between items-center text-sm font-bold text-slate-800">
                    <span className="capitalize">{factor === 'transporte' ? 'Transporte y movilidad' : factor === 'areasVerdes' ? 'Áreas verdes' : factor}</span>
                    <span className="text-emerald-900 bg-emerald-50 px-3 py-1 rounded-xl text-xs">{weights[factor]}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={weights[factor]}
                    onChange={(e) => handleWeightChange(factor, e.target.value)}
                    className="w-full accent-emerald-900 cursor-pointer"
                  />
                </div>
              ))}

              <div className={`p-4 rounded-2xl font-bold text-sm flex justify-between items-center ${Math.abs(totalWeightSum - 100) < 0.01 ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                <span>Suma total:</span>
                <span className="text-base font-black">{totalWeightSum}% {Math.abs(totalWeightSum - 100) >= 0.01 && '(Debe sumar 100%)'}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => alert("¡Configuración guardada con éxito!")} className="bg-emerald-950 hover:bg-emerald-900 text-white font-bold px-6 py-3.5 rounded-xl transition-all shadow-md text-sm">
                Guardar cambios
              </button>
              <button onClick={() => setWeights({ transporte: 20, educacion: 20, salud: 20, comercio: 20, areasVerdes: 20 })} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-3.5 rounded-xl transition-all text-sm">
                Restaurar 20%
              </button>
            </div>
          </div>
        </main>
      )}

    </div>
  );
}

export default App;