import React from 'react';

export default function HomeLanding({ onExplore }) {
  return (
    <main>
      {/* Hero Section */}
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
              Analiza la viabilidad urbana real mediante distancias a servicios por coordenadas de mapas, calcula tus bonos y toma la decisión más inteligente.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button onClick={onExplore} className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-7 py-4 rounded-2xl transition-all shadow-xl">
                🔍 Explorar proyectos reales
              </button>
              <button onClick={onExplore} className="bg-emerald-900/60 hover:bg-emerald-900 text-white font-bold px-7 py-4 rounded-2xl transition-all border border-emerald-700/50">
                📊 Verificador IVU por Mapa
              </button>
            </div>
          </div>

          {/* Formulario rápido Home */}
          <div className="lg:col-span-5 bg-white text-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-100">
            <h2 className="text-xl font-black mb-1">Encuentra tu vivienda ideal</h2>
            <p className="text-xs text-slate-500 mb-6">Regístrate para guardar tus comparaciones geográficas.</p>
            
            <form onSubmit={(e) => { e.preventDefault(); onExplore(); }} className="space-y-4">
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

      {/* Características / Beneficios */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-black text-slate-900">Información que transforma decisiones</h2>
          <p className="text-slate-600 text-sm mt-2">Diseñado para que cada familia pueda evaluar con precisión la cercanía a colegios, salud y transporte.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <span className="text-2xl">🛡️</span>
            <h3 className="font-extrabold text-lg text-slate-900">Proyectos Verificados</h3>
            <p className="text-sm text-slate-600">Inscritos formalmente en programas habitacionales del Estado con documentación legal validada.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <span className="text-2xl">📍</span>
            <h3 className="font-extrabold text-lg text-slate-900">Geolocalización Haversine</h3>
            <p className="text-sm text-slate-600">Cálculo matemático exacto de metros lineales desde las coordenadas de mapas hasta los equipamientos urbanos.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <span className="text-2xl">⚙️</span>
            <h3 className="font-extrabold text-lg text-slate-900">Backoffice Dinámico</h3>
            <p className="text-sm text-slate-600">Personaliza los porcentajes de ponderación de cada factor urbano en tiempo real desde el panel de administración.</p>
          </div>
        </div>
      </section>
    </main>
  );
}