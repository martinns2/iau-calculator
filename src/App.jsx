import React, { useState } from 'react';
import { calculateIAU } from './utils/iauCalculator';
import { mockProjects } from './data/excelData';

function App() {
  const [mode, setMode] = useState("preset"); // "preset" o "simulator"
  const [selectedProject, setSelectedProject] = useState("Proyecto A");
  
  // Estado para el modo simulador manual
  const [customDistances, setCustomDistances] = useState({
    transporte: 500,
    educacion: 800,
    salud: 1000,
    comercio: 600,
    areasVerdes: 300
  });

  // Datos activos según el modo
  const activeDistances = mode === "preset" 
    ? mockProjects[selectedProject] 
    : customDistances;

  const result = calculateIAU(activeDistances);

  const handleCustomChange = (factor, value) => {
    setCustomDistances({
      ...customDistances,
      [factor]: Math.max(0, parseFloat(value) || 0)
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Urbanismo & Vivienda Social</span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-2">IAU — Índice de Accesibilidad Urbana</h1>
            <p className="text-slate-500 text-sm mt-1">Evaluación, normalización por rangos y comparación multicriterio.</p>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button 
              onClick={() => setMode("preset")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === "preset" ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Proyectos Excel (A, B, C)
            </button>
            <button 
              onClick={() => setMode("simulator")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === "simulator" ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              🎛️ Simulador Manual
            </button>
          </div>
        </header>

        {/* Controles de selección */}
        {mode === "preset" ? (
          <div className="mb-8 flex flex-wrap gap-3 items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-sm font-bold text-slate-600 mr-2">Seleccionar Proyecto base:</span>
            {Object.keys(mockProjects).map(proj => (
              <button 
                key={proj}
                onClick={() => setSelectedProject(proj)}
                className={`px-5 py-2 rounded-xl font-bold transition-all ${
                  selectedProject === proj 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {proj}
              </button>
            ))}
          </div>
        ) : (
          <div className="mb-8 bg-indigo-50 border border-indigo-200 p-5 rounded-2xl">
            <h3 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
              <span>🎛️ Panel de Simulación de Distancias (en metros)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
              {Object.keys(customDistances).map(factor => (
                <div key={factor} className="bg-white p-3 rounded-xl border border-indigo-100 shadow-sm">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    {factor === 'transporte' ? 'Transporte' : factor === 'educacion' ? 'Educación' : factor === 'salud' ? 'Salud' : factor === 'comercio' ? 'Comercio' : 'Áreas Verdes'}
                  </label>
                  <div className="flex items-center gap-1">
                    <input 
                      type="number" 
                      value={customDistances[factor]}
                      onChange={(e) => handleCustomChange(factor, e.target.value)}
                      className="w-full font-bold text-slate-800 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center"
                      step="50"
                      min="0"
                    />
                    <span className="text-xs font-bold text-slate-400">m</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resumen Superior KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Evaluando</h3>
            <p className="text-2xl font-black text-slate-900">
              {mode === "preset" ? selectedProject : "Proyecto Personalizado"}
            </p>
            <span className="text-xs text-indigo-600 font-semibold mt-2">✨ Ponderación 20% c/u</span>
          </div>
          
          <div className={`p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between ${result.iauInterpretation.bg}`}>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-2 opacity-70">Resultado IAU Final</h3>
            <div className="flex items-baseline gap-2">
               <p className={`text-5xl font-black ${result.iauInterpretation.color}`}>{result.iauScore}</p>
               <span className="text-sm font-bold opacity-60">/ 100</span>
            </div>
            <p className={`text-sm font-bold mt-2 ${result.iauInterpretation.color}`}>{result.iauInterpretation.level}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Factor Más Favorable</h3>
            <p className="text-lg font-extrabold text-emerald-600">{result.highestFactor.name}</p>
            <p className="text-xs font-bold text-slate-500 mt-2 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg inline-block w-fit">
              {result.highestFactor.score} pts (Normalizado)
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Factor Crítico (A mejorar)</h3>
            <p className="text-lg font-extrabold text-red-600">{result.lowestFactor.name}</p>
            <p className="text-xs font-bold text-slate-500 mt-2 bg-red-50 text-red-700 px-2.5 py-1 rounded-lg inline-block w-fit">
              {result.lowestFactor.score} pts (Normalizado)
            </p>
          </div>
        </div>

        {/* Desglose de Factores */}
        <h2 className="text-xl font-bold text-slate-900 mb-4">Desglose Metodológico de Factores</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.values(result.factorDetails).map(factor => (
            <div key={factor.name} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-bold text-slate-900 text-lg">{factor.name}</h4>
                <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-xl text-sm font-black border border-indigo-100">
                  {factor.distance} m
                </span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-slate-500 font-medium">Puntaje Escala (0-100)</span>
                    <span className="font-extrabold text-slate-800">{factor.score} pts</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5">
                    <div className="bg-indigo-600 h-full rounded-full transition-all duration-500" style={{ width: `${factor.score}%` }}></div>
                  </div>
                </div>
                
                <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-sm">
                   <span className="text-slate-500">Peso: <strong>{factor.weightPercent}%</strong></span>
                   <div className="text-right">
                     <span className="text-xs text-slate-400 block">Aporte Ponderado</span>
                     <strong className="text-indigo-600 text-base">{factor.ponderado} pts</strong>
                   </div>
                </div>

                <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="font-bold text-slate-700 mb-0.5">Rango Aplicado:</div>
                  {factor.range} → <span className="font-semibold text-indigo-600">{factor.level}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default App;