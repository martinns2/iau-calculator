import React, { useState } from 'react';
import { realProjects, urbanServicesCoords } from '../data/excelData';
import { calculateDistanceInMeters } from '../utils/geoCalculator';
import { calculateIAU } from '../utils/iauCalculator';

export default function DashboardIAU({ weights }) {
  // Estado para el proyecto real seleccionado de la lista
  const [selectedProjectKey, setSelectedProjectKey] = useState("Residencial Alameda (Lima Centro)");

  // Obtenemos las coordenadas del proyecto elegido
  const currentProj = realProjects[selectedProjectKey];

  // Calculamos automáticamente la distancia real en metros a cada servicio urbano
  let activeDistances = {};
  for (const [service, coords] of Object.entries(urbanServicesCoords)) {
    activeDistances[service] = calculateDistanceInMeters(currentProj.lat, currentProj.lng, coords.lat, coords.lng);
  }

  // Calculamos el IVU final basado en los pesos configurados
  const result = calculateIAU(activeDistances, weights);

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      
      {/* Cabecera del Módulo */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full">Catálogo Oficial Inmobiliario</span>
          <h1 className="text-3xl font-black text-slate-900 mt-2">Selecciona un Proyecto para Evaluar</h1>
          <p className="text-slate-600 text-sm">El sistema calcula de forma automática la viabilidad urbana (IVU) basada en su ubicación geográfica real.</p>
        </div>
      </div>

      {/* Selector de Proyectos Reales en Tarjetas o Botones */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Proyectos Disponibles para Comparación</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(realProjects).map(([key, proj]) => (
            <button
              key={key}
              onClick={() => setSelectedProjectKey(key)}
              className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                selectedProjectKey === key 
                  ? 'bg-emerald-950 text-white border-emerald-950 shadow-lg scale-[1.02]' 
                  : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase ${selectedProjectKey === key ? 'bg-emerald-900 text-emerald-200' : 'bg-slate-200 text-slate-700'}`}>
                  Verificado Mivivienda
                </span>
                <h4 className="font-extrabold text-base mt-3">{key}</h4>
                <p className={`text-xs mt-1 ${selectedProjectKey === key ? 'text-emerald-300' : 'text-slate-500'}`}>{proj.direccion}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center text-xs font-bold">
                <span>Ver evaluación →</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tarjetas KPI de Resultados del Proyecto Seleccionado */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase">Proyecto Activo</span>
          <p className="text-lg font-black text-slate-900 my-2">{selectedProjectKey}</p>
          <span className="text-xs text-emerald-800 font-bold bg-emerald-50 px-2 py-1 rounded w-fit">Inscrito en BBP</span>
        </div>

        <div className={`p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between ${result.iauInterpretation.bg}`}>
          <span className="text-xs font-bold uppercase tracking-wider opacity-70">Índice IVU Final</span>
          <div className="flex items-baseline gap-2 my-1">
            <p className={`text-5xl font-black ${result.iauInterpretation.color}`}>{result.iauScore}</p>
            <span className="text-sm font-bold opacity-60">/ 100</span>
          </div>
          <p className={`text-xs font-bold ${result.iauInterpretation.color}`}>{result.iauInterpretation.level}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase">Factor Más Favorable</span>
          <p className="text-lg font-extrabold text-emerald-800 my-1">{result.highestFactor.name}</p>
          <span className="text-xs font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded w-fit">{result.highestFactor.score} pts Normalizados</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase">Factor Crítico (A mejorar)</span>
          <p className="text-lg font-extrabold text-rose-600 my-1">{result.lowestFactor.name}</p>
          <span className="text-xs font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded w-fit">{result.lowestFactor.score} pts Normalizados</span>
        </div>
      </div>

      {/* Desglose Metodológico de Factores y Distancias */}
      <h2 className="text-xl font-extrabold text-slate-900">Desglose de Servicios Urbanos Cercanos</h2>
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
              <strong>Rango Aplicado:</strong> {factor.range} ({factor.level})
            </div>
          </div>
        ))}
      </div>

    </main>
  );
}