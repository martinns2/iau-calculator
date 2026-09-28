import React, { useState } from 'react';
import { realProjects, urbanServicesCoords } from '../data/excelData';
import { calculateDistanceInMeters } from '../utils/geoCalculator';
import { calculateIAU } from '../utils/iauCalculator';

export default function DashboardIAU({ weights }) {
  const [calcMode, setCalcMode] = useState('preset');
  const [selectedProjectKey, setSelectedProjectKey] = useState("Residencial Alameda (Lima Centro)");
  const [customCoords, setCustomCoords] = useState({ lat: -12.0553, lng: -77.0382 });

  let activeDistances = {};
  if (calcMode === 'preset') {
    const proj = realProjects[selectedProjectKey];
    for (const [service, coords] of Object.entries(urbanServicesCoords)) {
      activeDistances[service] = calculateDistanceInMeters(proj.lat, proj.lng, coords.lat, coords.lng);
    }
  } else {
    for (const [service, coords] of Object.entries(urbanServicesCoords)) {
      activeDistances[service] = calculateDistanceInMeters(customCoords.lat, customCoords.lng, coords.lat, coords.lng);
    }
  }

  const result = calculateIAU(activeDistances, weights);

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <span className="text-xs font-bold text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full">Geolocalización Activa</span>
          <h1 className="text-3xl font-black text-slate-900 mt-2">Comparador Geográfico IVU</h1>
          <p className="text-slate-600 text-sm">Cálculo de distancias mediante Haversine y coordenadas de mapas.</p>
        </div>
        
        <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-slate-200">
          <button onClick={() => setCalcMode('preset')} className={`px-4 py-2 rounded-xl text-xs font-bold ${calcMode === 'preset' ? 'bg-emerald-950 text-white' : 'text-slate-600'}`}>
            Proyectos Reales
          </button>
          <button onClick={() => setCalcMode('mapCoord')} className={`px-4 py-2 rounded-xl text-xs font-bold ${calcMode === 'mapCoord' ? 'bg-emerald-950 text-white' : 'text-slate-600'}`}>
            📍 Coordenadas Libres
          </button>
        </div>
      </div>

      {calcMode === 'preset' ? (
        <div className="mb-8 flex flex-wrap gap-3 items-center bg-white p-4 rounded-2xl border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase">Seleccionar Inmobiliaria:</span>
          {Object.keys(realProjects).map(key => (
            <button key={key} onClick={() => setSelectedProjectKey(key)} className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${selectedProjectKey === key ? 'bg-emerald-950 text-white shadow-md' : 'bg-slate-100 text-slate-700'}`}>
              {key}
            </button>
          ))}
        </div>
      ) : (
        <div className="mb-8 bg-emerald-50 border border-emerald-200 p-6 rounded-3xl space-y-4">
          <h3 className="font-black text-emerald-950 text-base">📍 Ingresar Latitud y Longitud</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Latitud</label>
              <input type="number" step="0.0001" value={customCoords.lat} onChange={e => setCustomCoords({...customCoords, lat: parseFloat(e.target.value)||0})} className="w-full bg-white border rounded-xl px-3 py-2 text-sm font-bold" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Longitud</label>
              <input type="number" step="0.0001" value={customCoords.lng} onChange={e => setCustomCoords({...customCoords, lng: parseFloat(e.target.value)||0})} className="w-full bg-white border rounded-xl px-3 py-2 text-sm font-bold" />
            </div>
          </div>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase">Ubicación</span>
          <p className="text-xl font-black text-slate-900 my-2">{calcMode === 'preset' ? selectedProjectKey : "Personalizado"}</p>
        </div>
        <div className={`p-6 rounded-3xl border border-slate-200 flex flex-col justify-between ${result.iauInterpretation.bg}`}>
          <span className="text-xs font-bold uppercase tracking-wider opacity-70">IVU Final</span>
          <p className={`text-5xl font-black ${result.iauInterpretation.color}`}>{result.iauScore} <span className="text-sm">/100</span></p>
          <p className={`text-xs font-bold ${result.iauInterpretation.color}`}>{result.iauInterpretation.level}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase">Factor Cercano</span>
          <p className="text-lg font-extrabold text-emerald-800 my-1">{result.highestFactor.name}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase">Factor Lejano</span>
          <p className="text-lg font-extrabold text-rose-600 my-1">{result.lowestFactor.name}</p>
        </div>
      </div>

      {/* Desglose */}
      <h2 className="text-xl font-extrabold text-slate-900 mb-4">Desglose de Distancias Geográficas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.values(result.factorDetails).map(factor => (
          <div key={factor.name} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex justify-between items-start">
              <h4 className="font-extrabold text-slate-900">{factor.name}</h4>
              <span className="bg-emerald-50 text-emerald-900 font-black text-xs px-3 py-1 rounded-xl border">~{factor.distance} m</span>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1 text-slate-500">
                <span>Puntaje Escala</span>
                <span className="font-bold text-slate-800">{factor.score} / 100</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-800 h-full rounded-full" style={{ width: `${factor.score}%` }}></div>
              </div>
            </div>
            <div className="pt-2 border-t flex justify-between text-xs">
              <span className="text-slate-500">Peso: {factor.weightPercent}%</span>
              <span className="text-emerald-900 font-black">Aporte: {factor.ponderado} pts</span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}