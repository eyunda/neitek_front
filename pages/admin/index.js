import { useEffect, useState } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import api from '../../lib/api';

import UserCreateModal from '../../components/modals/UserCreateModal';
import PasswordResetModal from '../../components/modals/PasswordResetModal';
import TimedAlert from '../../components/TimedAlert';
import Typography from '../../components/ui/Typography';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  // Modal Crear
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '', email: '', phone: '', password: '', role: 'user'
  });
  const onChangeCreate = e => setCreateForm({ ...createForm, [e.target.name]: e.target.value });

  // Modal Cambiar Password
  const [showPwd, setShowPwd] = useState(false);
  const [pwdForm, setPwdForm] = useState({ email: '', newPassword: '' });
  const onChangePwd = e => setPwdForm({ ...pwdForm, [e.target.name]: e.target.value });

  const loadUsers = async () => {
    setLoading(true); setMsg('');
    try {
      const { data } = await api.get('/admin/users');
      setUsers(Array.isArray(data) ? data : (data.users || []));
    } catch (e) {
      setMsg(e?.response?.data?.message || 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const submitCreate = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      await api.post('/admin/users', createForm);
      setShowCreate(false);
      setCreateForm({ name: '', email: '', phone: '', password: '', role: 'user' });
      await loadUsers();
      setMsg('Usuario creado correctamente.');
    } catch (e) {
      setMsg(e?.response?.data?.message || 'Error al crear usuario');
    }
  };

  const openPwdModal = (u) => {
    setPwdForm({ email: u.email, newPassword: '' });
    setShowPwd(true);
  };

  const submitPwd = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      await api.post('/password/admin-reset', pwdForm);
      setShowPwd(false);
      setPwdForm({ email: '', newPassword: '' });
      setMsg('Contraseña actualizada correctamente.');
    } catch (e) {
      setMsg(e?.response?.data?.message || 'Error al actualizar contraseña');
    }
  };

  return (
    <ProtectedRoute onlyAdmin>
      <div className="container1">
        <div className="d-flex align-items-center justify-content-between mt-2 mb-3">
          <Typography
            as="h1"
            variant="h3"
            weight="700"
            color="gradient"          // o "default" si prefieres
            icon="bi-people"
            subtitle="Gestión de cuentas y roles"
          >
            Usuarios
          </Typography>

          <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
            <i className="bi bi-person-plus me-2" /> Registrar usuario
          </button>
        </div>

        <TimedAlert show={!!msg} type="info" onClose={() => setMsg('')} duration={2500}>
          {msg}
        </TimedAlert>

        <div className="card shadow-sm">
          <div className="card-body">
            {loading ? (
              <p className="text-muted mb-0">Cargando...</p>
            ) : users.length === 0 ? (
              <p className="text-muted mb-0">No hay usuarios.</p>
            ) : (
              <div className="table-wrap">
                <div className="table-responsive">
                  <table className="table table-modern align-middle mb-0">
                    <thead>
                      <tr>
                        <th style={{width: 56}}>#</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                        <th>Roles</th>
                        <th style={{ width: 96 }} className="text-end">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u, idx) => (
                        <tr key={u.id}>
                          <td className="text-muted">{idx + 1}</td>
                          <td>{u.name || u.nombre}</td>
                          <td>{u.email}</td>
                          <td>{u.phone || '-'}</td>
                          <td>{u.roles}</td>
                          <td className="text-end">
                            {/* Icono de lápiz en vez de botón "Editar" */}
                            <button
                              className="btn-icon"
                              title="Editar contraseña"
                              aria-label={`Editar contraseña de ${u.email}`}
                              onClick={() => openPwdModal(u)}
                            >
                              <i className="bi bi-pencil-square"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MODALES */}
        <UserCreateModal
          show={showCreate}
          onClose={() => setShowCreate(false)}
          form={createForm}
          onChange={onChangeCreate}
          onSubmit={submitCreate}
        />

        <PasswordResetModal
          show={showPwd}
          onClose={() => setShowPwd(false)}
          form={pwdForm}
          onChange={onChangePwd}
          onSubmit={submitPwd}
        />
      </div>
    </ProtectedRoute>
  );
}
