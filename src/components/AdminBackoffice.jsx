import React from 'react';

export default function AdminBackoffice({ weights, setWeights }) {
  const totalWeightSum = Object.values(weights).reduce((a, b) => a + b, 0);

  return (
    <main className="max-w-4xl mx-auto px-6 py-8">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-8">
        <div>
          <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">Panel Admin</span>
          <h1 className="text-2xl font-black text-slate-900 mt-2">Backoffice • Ponderaciones IVU</h1>
          <p className="text-slate-600 text-xs">Ajusta los factores de peso para recalcular dinámicamente.</p>
        </div>

        <div className="space-y-4 bg-slate-50 p-6 rounded-2xl">
          {Object.keys(weights).map(factor => (
            <div key={factor} className="space-y-2 bg-white p-4 rounded-2xl border">
              <div className="flex justify-between text-sm font-bold">
                <span className="capitalize">{factor}</span>
                <span>{weights[factor]}%</span>
              </div>
              <input 
                type="range" min="0" max="100" 
                value={weights[factor]} 
                onChange={e => setWeights({...weights, [factor]: parseFloat(e.target.value)||0})} 
                className="w-full accent-emerald-900 cursor-pointer" 
              />
            </div>
          ))}

          <div className={`p-4 rounded-2xl font-bold text-sm flex justify-between ${Math.abs(totalWeightSum - 100) < 0.01 ? 'bg-emerald-50 text-emerald-900' : 'bg-rose-50 text-rose-700'}`}>
            <span>Suma total:</span><span>{totalWeightSum}% {Math.abs(totalWeightSum - 100) >= 0.01 && '(Debe sumar 100%)'}</span>
          </div>
        </div>

        <button onClick={() => alert("¡Configuración guardada exitosamente!")} className="bg-emerald-950 text-white font-bold px-6 py-3 rounded-xl">
          Guardar cambios
        </button>
      </div>
    </main>
  );
}