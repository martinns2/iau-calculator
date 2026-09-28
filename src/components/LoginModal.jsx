import React, { useState } from 'react';

export default function LoginModal({ onLoginSuccess }) {
  const [authMode, setAuthMode] = useState('login'); // 'login' o 'register'
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Base de datos simulada en memoria local
  const [usersDb, setUsersDb] = useState([
    { email: 'admin@viabihogar.pe', password: 'Admin123*' }
  ]);

  // Validación robusta de contraseña
  const validatePassword = (pass) => {
    const minLength = pass.length >= 8;
    const hasUppercase = /[A-Z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    return minLength && hasUppercase && hasNumber && hasSpecial;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!emailInput.includes('@') || !emailInput.includes('.')) {
      setErrorMsg('Ingresa un correo electrónico corporativo o personal válido.');
      return;
    }

    if (authMode === 'register') {
      if (!validatePassword(passwordInput)) {
        setErrorMsg('La contraseña es muy débil. Debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial.');
        return;
      }

      const exists = usersDb.find(u => u.email === emailInput);
      if (exists) {
        setErrorMsg('Este correo ya se encuentra registrado.');
        return;
      }

      setUsersDb([...usersDb, { email: emailInput, password: passwordInput }]);
      setSuccessMsg('¡Cuenta creada correctamente! Ahora ingresa tus credenciales.');
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
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">Acceso Restringido</span>
          <h2 className="text-2xl font-black text-slate-900 mt-2">
            {authMode === 'login' ? 'Iniciar Sesión' : 'Registro de Usuario'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">Control de acceso seguro para evaluación urbana</p>
        </div>

        {errorMsg && <div className="bg-rose-50 text-rose-700 p-3 rounded-xl text-xs font-bold text-center border border-rose-200">⚠️ {errorMsg}</div>}
        {successMsg && <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl text-xs font-bold text-center border border-emerald-200">✅ {successMsg}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Correo electrónico</label>
            <input type="email" value={emailInput} onChange={e => setEmailInput(e.target.value)} placeholder="ejemplo@viabihogar.pe" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700" required />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Contraseña</label>
            <input type="password" value={passwordInput} onChange={e => setPasswordInput(e.target.value)} placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700" required />
            {authMode === 'register' && (
              <p className="text-[10px] text-slate-400 mt-1">Mín. 8 caracteres, 1 mayúscula, 1 número y 1 símbolo.</p>
            )}
          </div>

          <button type="submit" className="w-full bg-emerald-950 hover:bg-emerald-900 text-white font-black py-3.5 rounded-xl shadow-md text-sm transition-all">
            {authMode === 'login' ? 'Ingresar al Sistema' : 'Registrar Cuenta'}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <button onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setErrorMsg(''); setSuccessMsg(''); }} className="text-xs font-bold text-emerald-800 hover:underline">
            {authMode === 'login' ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
          
          {authMode === 'login' && (
            <div className="mt-4 p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 border border-slate-200 text-left">
              <strong>Credencial de prueba:</strong><br/>
              Correo: <span className="font-mono text-slate-700">admin@viabihogar.pe</span><br/>
              Contraseña: <span className="font-mono text-slate-700">Admin123*</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}