import { useEffect, useState } from 'react';
import { getAuth, isAdmin as hasAdminRole, clearAuth } from '../lib/auth';
import { useRouter } from 'next/router';

export default function ProtectedRoute({ children, onlyAdmin = false }) {
  const router = useRouter();
  const [ok, setOk] = useState(false);
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const a = getAuth();
    if (!a?.token) {
      router.replace('/');
      return;
    }
    if (onlyAdmin && !hasAdminRole(a)) {
      router.replace('/dashboard');
      return;
    }
    setAuth(a);
    setOk(true);
  }, [router, onlyAdmin]);

  const handleLogout = () => {
    clearAuth();
    router.replace('/');
  };

  if (!ok) return null;

  const name = auth?.user?.name || auth?.user?.nombre || auth?.user?.email || 'Usuario';
  const roles = Array.isArray(auth?.user?.roles) ? auth.user.roles : [];
  const isAdmin = roles.includes('admin');

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-neitek sticky-top mb-0">
        <div className="container">
          <span className="navbar-brand">
            <img src="/neitek_avatar.gif" alt="Neitek" className="brand-gif" />
            Neitek
          </span>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navMain"
            aria-controls="navMain"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="d-flex align-items-center gap-3">
            <span className="fw-bold d-none d-md-inline nav-user-name">
              {name}
            </span>
            <button
              className="btn btn-danger btn-sm d-flex align-items-center gap-2 ms-3"
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right" />
              <span>Salir</span>
            </button>

          </div>

        </div>
      </nav>

      <main className="page">
        {children}
      </main>
    </>
  );
}
