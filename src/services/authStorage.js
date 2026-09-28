const USERS_KEY = 'viabihogar_registered_users';
const ATTEMPTS_KEY = 'viabihogar_login_attempts';

export function getUsers() {
  try {
    const saved = localStorage.getItem(USERS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Error leyendo localStorage", e);
  }
  // Retorna el admin por defecto si está vacío
  return [{ email: 'admin@viabihogar.pe', password: 'Admin123*' }];
}

export function saveUser(newUser) {
  try {
    const users = getUsers();
    const exists = users.some(u => u.email === newUser.email);
    if (!exists) {
      users.push(newUser);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
  } catch (e) {
    console.error("Error guardando en localStorage", e);
  }
}

export function getLoginAttempts(email) {
  try {
    const data = JSON.parse(localStorage.getItem(ATTEMPTS_KEY) || '{}');
    return data[email] || { count: 0, lockedUntil: 0 };
  } catch (e) {
    return { count: 0, lockedUntil: 0 };
  }
}

export function registerFailedAttempt(email) {
  try {
    const data = JSON.parse(localStorage.getItem(ATTEMPTS_KEY) || '{}');
    const current = data[email] || { count: 0, lockedUntil: 0 };
    
    const newCount = current.count + 1;
    let lockedUntil = 0;

    if (newCount >= 3) {
      lockedUntil = Date.now() + 60000; // Bloqueo de 1 minuto
    }

    data[email] = { count: newCount, lockedUntil };
    localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(data));
    return newCount;
  } catch (e) {
    return 1;
  }
}

export function resetAttempts(email) {
  try {
    const data = JSON.parse(localStorage.getItem(ATTEMPTS_KEY) || '{}');
    delete data[email];
    localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(data));
  } catch (e) {}
}