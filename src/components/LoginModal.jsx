import React, { useState } from 'react';

export default function LoginModal({ onLoginSuccess }) {
  const [authMode, setAuthMode] = useState('login'); // 'login' o 'register'
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Normalizamos el correo a minúsculas y sin espacios
    const email = emailInput.trim().toLowerCase();

    let users = [];
    try {
      const saved = localStorage.getItem('viabihogar_users');
      users = saved ? JSON.parse(saved) : [{ email: 'admin@viabihogar.pe', password: 'Admin123*' }];
    } catch (err) {
      users = [{ email: 'admin@viabihogar.pe', password: 'Admin123*' }];
    }

    if (!email.includes('@') || !email.includes('.')) {
      setErrorMsg('Por favor ingresa un correo electrónico válido.');
      return;
    }

    if (authMode === 'register') {
      if (passwordInput.length < 6) {
        setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
        return;
      }

      const exists = users.find(u => u.email === email);
      if (exists) {
        setErrorMsg('Este correo ya está registrado. Inicia sesión.');
        return;
      }

      // Guardamos el nuevo usuario en minúsculas
      users.push({ email, password: passwordInput });
      try {
        localStorage.setItem('viabihogar_users', JSON.stringify(users));
        setSuccessMsg('¡Cuenta registrada con éxito! Ahora puedes iniciar sesión.');
        setAuthMode('login');
        setPasswordInput('');
      } catch (err) {
        setErrorMsg('No se pudo guardar en el almacenamiento local.');
      }
    } else {
      const validUser = users.find(u => u.email === email && u.password === passwordInput);
      
      if (validUser) {
        onLoginSuccess(validUser);
      } else {
        setErrorMsg('Correo o contraseña incorrectos. Verifica tus datos.');
      }
    }
  };

  return (
    <main className="max-w-md mx-auto px-6 py-16">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        <div className="text-center">
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">Base de Datos Local</span>
          <h2 className="text-2xl font-black text-slate-900 mt-2">
            {authMode === 'login' ? 'Iniciar Sesión' : 'Registro de Usuario'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">Acceso seguro y persistente</p>
        </div>

        {errorMsg && (
          <div className="bg-rose-50 text-rose-700 p-3 rounded-xl text-xs font-bold text-center border border-rose-200">
            ⚠️ {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl text-xs font-bold text-center border border-emerald-200">
            ✅ {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Correo electrónico</label>
            <input 
              type="email" 
              value={emailInput} 
              onChange={e => setEmailInput(e.target.value)} 
              placeholder="tu@correo.pe" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium" 
              required 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Contraseña</label>
            <input 
              type="password" 
              value={passwordInput} 
              onChange={e => setPasswordInput(e.target.value)} 
              placeholder="••••••••" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium" 
              required 
            />
          </div>

          <button type="submit" className="w-full bg-emerald-950 hover:bg-emerald-900 text-white font-black py-3.5 rounded-xl shadow-md text-sm transition-all">
            {authMode === 'login' ? 'Ingresar al Sistema' : 'Registrar Cuenta'}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <button 
            onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setErrorMsg(''); setSuccessMsg(''); }} 
            className="text-xs font-bold text-emerald-800 hover:underline"
          >
            {authMode === 'login' ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
          
          {authMode === 'login' && (
            <div className="mt-4 p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 border border-slate-200 text-left">
              <strong>Acceso de prueba por defecto:</strong><br/>
              <span className="font-mono text-slate-700">admin@viabihogar.pe / Admin123*</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}