import React, { useState, useEffect } from 'react';

export default function LoginModal({ onLoginSuccess }) {
  const [authMode, setAuthMode] = useState('login'); // 'login' o 'register'
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Cargar usuarios guardados en localStorage al iniciar
  const [usersDb, setUsersDb] = useState(() => {
    const saved = localStorage.getItem('viabihogar_users');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [{ email: 'admin@viabihogar.pe', password: 'Admin123*' }];
  });

  // Guardar en localStorage cada vez que la base de datos cambie
  useEffect(() => {
    localStorage.setItem('viabihogar_users', JSON.stringify(usersDb));
  }, [usersDb]);

  const validatePassword = (pass) => {
    return pass.length >= 8 && /[A-Z]/.test(pass) && /[0-9]/.test(pass) && /[!@#$%^&*(),.?":{}|<>]/.test(pass);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!emailInput.includes('@') || !emailInput.includes('.')) {
      setErrorMsg('Ingresa un correo electrónico válido.');
      return;
    }

    if (authMode === 'register') {
      if (!validatePassword(passwordInput)) {
        setErrorMsg('Contraseña débil: mín. 8 caracteres, una mayúscula, un número y un símbolo.');
        return;
      }

      const exists = usersDb.find(u => u.email === emailInput);
      if (exists) {
        setErrorMsg('Este correo ya está registrado. Inicia sesión.');
        return;
      }

      const updatedUsers = [...usersDb, { email: emailInput, password: passwordInput }];
      setUsersDb(updatedUsers);
      setSuccessMsg('¡Cuenta registrada con éxito en la base de datos! Ahora ingresa.');
      setAuthMode('login');
      setPasswordInput('');
    } else {
      const validUser = usersDb.find(u => u.email === emailInput && u.password === passwordInput);
      if (validUser) {
        onLoginSuccess(validUser);
      } else {
        setErrorMsg('Correo o contraseña incorrectos.');
      }
    }
  };

  return (
    <main className="max-w-md mx-auto px-6 py-16">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        <div className="text-center">
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">Base de Datos Activa</span>
          <h2 className="text-2xl font-black text-slate-900 mt-2">
            {authMode === 'login' ? 'Iniciar Sesión' : 'Registro de Usuario'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">Los registros persisten en el navegador</p>
        </div>

        {errorMsg && <div className="bg-rose-50 text-rose-700 p-3 rounded-xl text-xs font-bold text-center border border-rose-200">⚠️ {errorMsg}</div>}
        {successMsg && <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl text-xs font-bold text-center border border-emerald-200">✅ {successMsg}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Correo electrónico</label>
            <input type="email" value={emailInput} onChange={e => setEmailInput(e.target.value)} placeholder="tu@correo.pe" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700" required />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Contraseña</label>
            <input type="password" value={passwordInput} onChange={e => setPasswordInput(e.target.value)} placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700" required />
          </div>

          <button type="submit" className="w-full bg-emerald-950 hover:bg-emerald-900 text-white font-black py-3.5 rounded-xl shadow-md text-sm transition-all">
            {authMode === 'login' ? 'Ingresar al Sistema' : 'Registrar Cuenta en BD'}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <button onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setErrorMsg(''); setSuccessMsg(''); }} className="text-xs font-bold text-emerald-800 hover:underline">
            {authMode === 'login' ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
          
          {authMode === 'login' && (
            <div className="mt-4 p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 border border-slate-200 text-left">
              <strong>Admin por defecto:</strong><br/>
              <span className="font-mono text-slate-700">admin@viabihogar.pe / Admin123*</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}