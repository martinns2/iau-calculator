import React from 'react';

export default function Navbar({ currentView, setCurrentView, currentUser, onLogout }) {
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-emerald-950/10 px-6 lg:px-12 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <button onClick={() => setCurrentView('home')} className="flex items-center gap-2 font-black text-xl tracking-tight text-emerald-950">
          <span className="bg-emerald-900 text-white p-2 rounded-xl text-sm shadow-sm">🏡</span> ViabiHogar
        </button>
        
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
          <button onClick={() => setCurrentView('home')} className="hover:text-emerald-900 transition-colors">Inicio</button>
          <button onClick={() => setCurrentView('dashboard')} className="hover:text-emerald-900 transition-colors">Comparador IVU & Mapas</button>
          <span className="text-emerald-950/20">|</span>
          <span className="text-xs bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full font-extrabold">Modular v2</span>
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
            <button onClick={onLogout} className="text-xs text-rose-600 font-extrabold ml-2 hover:underline">Salir</button>
          </div>
        ) : (
          <button onClick={() => setCurrentView('auth')} className="bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm">
            Iniciar sesión
          </button>
        )}
      </div>
    </header>
  );
}