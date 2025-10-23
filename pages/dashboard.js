import ProtectedRoute from '../components/ProtectedRoute';
import { getAuth, isAdmin } from '../lib/auth';
import Link from 'next/link';

export default function Dashboard() {
  const auth = getAuth();
  const nombre = auth?.user?.nombre || auth?.user?.name || 'Usuario';

  return (
    <ProtectedRoute>
      <div className="container">
        <div className="p-4 bg-light rounded border">
          <h3>hola {nombre}</h3>
          <p className="text-muted mb-0">
            Has iniciado sesión correctamente.
          </p>
          {isAdmin(auth) && (
            <div className="mt-3">
              <Link href="/admin" className="btn btn-outline-primary">Ir al panel de admin</Link>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
