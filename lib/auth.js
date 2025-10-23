const KEY = 'neitek_auth';

export function saveAuth({ token, user }) {
  const payload = { token, user };
  localStorage.setItem(KEY, JSON.stringify(payload));
}

export function getAuth() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearAuth() {
  localStorage.removeItem(KEY);
}

export function isAdmin(auth) {
  const roles = auth?.user?.roles || [];
  return roles.includes('admin');
}
