import React, { useState } from 'react';
import { calculateIAU } from './utils/iauCalculator';
import { realProjects, urbanServicesCoords } from './data/excelData';
import { calculateDistanceInMeters } from './utils/geoCalculator';

function App() {
  const [currentView, setCurrentView] = useState('home'); 
  const [selectedProjectKey, setSelectedProjectKey] = useState("Residencial Alameda (Lima Centro)");
  
  // Modo de cálculo: 'preset' (proyectos reales predefinidos) o 'mapCoord' (ingresando lat/lng de Google Maps)
  const [calcMode, setCalcMode] = useState('preset');
  
  // Coordenadas manuales para probar Google Maps
  const [customCoords, setCustomCoords] = useState({
    lat: -12.0553,
    lng: -77.0382,
    nombre: "Proyecto Personalizado"
  });

  // Autenticación simulada/validada
  const [currentUser, setCurrentUser] = useState({ email: 'urbanista@viabihogar.pe', role: 'Urbanista Evaluador' });
  const [authEmail, setAuthEmail] = useState('');
  const [authPass, setAuthPass] = useState('');
  const [authError, setAuthError] = useState('');

  // Pesos del IVU
  const [weights, setWeights] = useState({
    transporte: 20,
    educacion: 20,
    salud: 20,
    comercio: 20,
    areasVerdes: 20
  });

  // Calcular distancias reales mediante Haversine si estamos en modo coordenadas
  let activeDistances = {};
  if (calcMode === 'preset') {
    const proj = realProjects[selectedProjectKey];
    // Calculamos la distancia real en metros desde las coordenadas del proyecto hacia cada servicio urbano
    for (const [service, coords] of Object.entries(urbanServicesCoords)) {
      activeDistances[service] = calculateDistanceInMeters(proj.lat, proj.lng, coords.lat, coords.lng);
    }
  } else {
    for (const [service, coords] of Object.entries(urbanServicesCoords)) {
      activeDistances[service] = calculateDistanceInMeters(customCoords.lat, customCoords.lng, coords.lat, coords.lng);
    }
  }

  const result = calculateIAU(activeDistances, weights);
  const totalWeightSum = Object.values(weights).reduce((a, b) => a + b, 0);

  const handleLogin = (e) => {
    e.preventDefault();
    if (authEmail && authPass.length >= 6) {
      setCurrentUser({ email: authEmail, role: 'Urbanista' });
      setCurrentView('dashboard');
      setAuthError('');
    } else {
      setAuthError('Correo válido y contraseña de mín. 6 caracteres requeridos.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1A2E22] font-sans antialiased">
      
      {/* NAVBAR */}
      <header className="bg-white/95 backdrop-blur-md border-b border-emerald-950/10 px-6 lg:px-12 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <button onClick={() => setCurrentView('home')} className="flex items-center gap-2 font-black text-xl tracking-tight text-emerald-950">
            <span className="bg-emerald-900 text-white p-2 rounded-xl text-sm shadow-sm">🏡</span> ViabiHogar
          </button>
          
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <button onClick={() => setCurrentView('home')} className="hover:text-emerald-900 transition-colors">Inicio</button>
            <button onClick={() => setCurrentView('dashboard')} className="hover:text-emerald-900 transition-colors">Comparador IVU & Mapas</button>
            <span className="text-emerald-950/20">|</span>
            <span className="text-xs bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full font-extrabold">Geolocalización Activa</span>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setCurrentView('admin')} className="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl transition-all border border-slate-200">
            ⚙️ Backoffice
          </button>
          {currentUser ? (
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              <span className="text-xs font-bold text-emerald-950">{currentUser.email}</span>
              <button onClick={() => setCurrentUser(null)} className="text-xs text-rose-600 font-extrabold ml-2 hover:underline">Salir</button>
            </div>
          ) : (
            <button onClick={() => setCurrentView('auth')} className="bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm">
              Iniciar sesión
            </button>
          )}
        </div>
      </header>

      {/* HOME */}
      {currentView === 'home' && (
        <main className="bg-emerald-950 text-white py-20 px-6 md:px-12 lg:px-24">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="bg-emerald-900 text-emerald-300 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider border border-emerald-800">
                Geolocalización con Google Maps & OpenStreetMap
              </span>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1]">
                Evaluación urbana con <br/><span className="text-emerald-400">coordenadas reales.</span>
              </h1>
              <p className="text-emerald-100/80 text-base md:text-lg max-w-xl">
                Calcula automáticamente las distancias reales a hospitales, escuelas y transporte público usando latitud y longitud.
              </p>
              <button onClick={() => setCurrentView('dashboard')} className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-7 py-4 rounded-2xl shadow-xl transition-all">
                🗺️ Ir al Comparador Geográfico →
              </button>
            </div>
          </div>
        </main>
      )}

      {/* AUTH */}
      {currentView === 'auth' && (
        <main className="max-w-md mx-auto px-6 py-16">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
            <h2 className="text-2xl font-black text-slate-900 text-center">Acceso al Sistema</h2>
            {authError && <div className="bg-rose-50 text-rose-700 p-3 rounded-xl text-xs font-bold">{authError}</div>}
            <form onSubmit={handleLogin} className="space-y-4">
              <input type="email" value={authEmail} onChange={e=>setAuthEmail(e.target.value)} placeholder="correo@viabihogar.pe" className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm" required />
              <input type="password" value={authPass} onChange={e=>setAuthPass(e.target.value)} placeholder="Contraseña (mín 6)" className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm" required />
              <button type="submit" className="w-full bg-emerald-950 text-white font-black py-3.5 rounded-xl">Ingresar</button>
            </form>
          </div>
        </main>
      )}

      {/* DASHBOARD CON GEOLOCALIZACIÓN */}
      {currentView === 'dashboard' && (
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <span className="text-xs font-bold text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full">Motor Geográfico Activo</span>
              <h1 className="text-3xl font-black text-slate-900 mt-2">Comparador de Proyectos & Coordenadas</h1>
              <p className="text-slate-600 text-sm">Distancias calculadas matemáticamente desde latitud y longitud.</p>
            </div>
            
            <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-slate-200">
              <button onClick={() => setCalcMode('preset')} className={`px-4 py-2 rounded-xl text-xs font-bold ${calcMode === 'preset' ? 'bg-emerald-950 text-white' : 'text-slate-600'}`}>
                Proyectos Reales (Lima)
              </button>
              <button onClick={() => setCalcMode('mapCoord')} className={`px-4 py-2 rounded-xl text-xs font-bold ${calcMode === 'mapCoord' ? 'bg-emerald-950 text-white' : 'text-slate-600'}`}>
                📍 Ingresar Coordenadas Google Maps
              </button>
            </div>
          </div>

          {/* Selectores según el modo */}
          {calcMode === 'preset' ? (
            <div className="mb-8 flex flex-wrap gap-3 items-center bg-white p-4 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase">Seleccionar Inmobiliaria:</span>
              {Object.keys(realProjects).map(key => (
                <button
                  key={key}
                  onClick={() => setSelectedProjectKey(key)}
                  className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                    selectedProjectKey === key ? 'bg-emerald-950 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>
          ) : (
            <div className="mb-8 bg-emerald-50 border border-emerald-200 p-6 rounded-3xl space-y-4">
              <h3 className="font-black text-emerald-950 text-base">📍 Pegar Coordenadas de Google Maps</h3>
              <p className="text-xs text-emerald-800">Haz clic derecho en cualquier punto de Google Maps, copia la latitud y longitud (ej. -12.0464, -77.0428) y pégalas aquí para calcular el IVU al instante:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Latitud</label>
                  <input type="number" step="0.0001" value={customCoords.lat} onChange={e => setCustomCoords({...customCoords, lat: parseFloat(e.target.value)})} className="w-full bg-white border rounded-xl px-3 py-2 text-sm font-bold" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Longitud</label>
                  <input type="number" step="0.0001" value={customCoords.lng} onChange={e => setCustomCoords({...customCoords, lng: parseFloat(e.target.value)})} className="w-full bg-white border rounded-xl px-3 py-2 text-sm font-bold" />
                </div>
                <div className="flex items-end">
                  <span className="text-xs font-bold text-emerald-900 bg-emerald-200/60 p-2.5 rounded-xl w-full text-center">
                    ✨ Distancias calculadas en vivo
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-col justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase">Ubicación Activa</span>
              <p className="text-xl font-black text-slate-900 my-2">{calcMode === 'preset' ? selectedProjectKey : "Coordenadas Personalizadas"}</p>
              <span className="text-xs text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg w-fit">Lat: {calcMode === 'preset' ? realProjects[selectedProjectKey].lat : customCoords.lat}</span>
            </div>

            <div className={`p-6 rounded-3xl border border-slate-200 flex flex-col justify-between ${result.iauInterpretation.bg}`}>
              <span className="text-xs font-bold uppercase tracking-wider opacity-70">IVU Calculado (Geolocalizado)</span>
              <div className="flex items-baseline gap-2 my-1">
                <p className={`text-5xl font-black ${result.iauInterpretation.color}`}>{result.iauScore}</p>
                <span className="text-sm font-bold opacity-60">/ 100</span>
              </div>
              <p className={`text-xs font-bold ${result.iauInterpretation.color}`}>{result.iauInterpretation.level}</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-col justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase">Factor Más Cercano</span>
              <p className="text-lg font-extrabold text-emerald-800 my-1">{result.highestFactor.name}</p>
              <span className="text-xs font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded w-fit">{result.highestFactor.score} pts (Normalizado)</span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-col justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase">Factor Más Lejano</span>
              <p className="text-lg font-extrabold text-rose-600 my-1">{result.lowestFactor.name}</p>
              <span className="text-xs font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded w-fit">{result.lowestFactor.score} pts (Normalizado)</span>
            </div>
          </div>

          {/* Desglose de Factores con Distancias Reales en Metros */}
          <h2 className="text-xl font-extrabold text-slate-900 mb-4">Desglose de Distancias Geográficas Reales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(result.factorDetails).map(factor => (
              <div key={factor.name} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex justify-between items-start">
                  <h4 className="font-extrabold text-slate-900 text-base">{factor.name}</h4>
                  <span className="bg-emerald-50 text-emerald-900 font-black text-xs px-3 py-1 rounded-xl border border-emerald-200">
                    ~{factor.distance} metros
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1 text-slate-500">
                    <span>Puntaje Escala Normalizada</span>
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
                  <strong>Rango Aplicado:</strong> {factor.range} ({factor.level})
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* ADMIN */}
      {currentView === 'admin' && (
        <main className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-8">
            <h2 className="text-2xl font-black text-slate-900">Backoffice • Ponderaciones IVU</h2>
            <div className="space-y-4 bg-slate-50 p-6 rounded-2xl">
              {Object.keys(weights).map(factor => (
                <div key={factor} className="space-y-2 bg-white p-4 rounded-2xl border">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="capitalize">{factor}</span>
                    <span>{weights[factor]}%</span>
                  </div>
                  <input type="range" min="0" max="100" value={weights[factor]} onChange={e => setWeights({...weights, [factor]: parseFloat(e.target.value)||0})} className="w-full accent-emerald-900" />
                </div>
              ))}
              <div className="p-4 rounded-2xl font-bold text-sm bg-emerald-50 text-emerald-900 flex justify-between">
                <span>Suma total:</span><span>{totalWeightSum}%</span>
              </div>
            </div>
          </div>
        </main>
      )}

    </div>
  );
}

export default App;