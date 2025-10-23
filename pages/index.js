import { useState, useEffect } from 'react';
import api from '../lib/api';
import { saveAuth, isAdmin } from '../lib/auth';
import { useRouter } from 'next/router';
import TimedAlert from '../components/TimedAlert';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  const [info, setInfo] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  // Estados para "Olvidé mi contraseña"
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  // Estados para reset vía token público
  const [showReset, setShowReset] = useState(false);
  const [resetPassword, setResetPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [resetEmail, setResetEmail] = useState('');

  useEffect(() => {
    const { resetToken: rt, email } = router.query || {};
    if (rt && email) {
      setResetToken(String(rt));
      setResetEmail(String(email));
      setShowReset(true);
    }
  }, [router.query]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(''); setInfo('');
    try {
      const { data } = await api.post('/login', { email: form.email.trim(), password: String(form.password) });
      const token = data.accessToken || data.token;
      const user  = data.user || data;
      if (!token || !user) return setErr('Respuesta inesperada del servidor.');
      saveAuth({ token, user });
      if (isAdmin({ user })) router.push('/admin'); else router.push('/dashboard');
    } catch (e) {
      setErr(e?.response?.data?.message || 'Error de autenticación');
    }
  };

  const submitForgot = async (e) => {
    e.preventDefault();
    setErr(''); setInfo('');
    try {
      await api.post('/password/forgot', { email: forgotEmail.trim() });
      setInfo('Si el correo existe, se ha enviado un email con instrucciones.');
      setShowForgot(false);
      setForgotEmail('');
    } catch (e) {
      setErr(e?.response?.data?.message || 'Error en la solicitud');
    }
  };

  const submitPublicReset = async (e) => {
    e.preventDefault();
    setErr(''); setInfo('');
    try {
      await api.post('/password/public-reset', { token: resetToken, newPassword: resetPassword });
      setInfo('Contraseña actualizada. Ahora puedes iniciar sesión.');
      setShowReset(false);
      setResetPassword('');
      setForm((f) => ({ ...f, email: resetEmail }));
      const { pathname } = router;
      router.replace({ pathname }, undefined, { shallow: true });
    } catch (e) {
      setErr(e?.response?.data?.message || 'No se pudo actualizar la contraseña');
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-bg" />
      <div className="auth-panel">
        <div className="auth-card">
          <div className="auth-avatar img" style={{ background:'transparent', border:'2px solid #0d6efd' }}>
            <img src="/neitek_avatar.gif" alt="Neitek" />
          </div>

          <h2 className="mb-3 text-center">Iniciar sesión</h2>

          <TimedAlert show={!!err} type="danger" onClose={() => setErr('')} duration={3000}>{err}</TimedAlert>
          <TimedAlert show={!!info} type="info" onClose={() => setInfo('')} duration={3000}>{info}</TimedAlert>
          <form onSubmit={onSubmit}>
            <div className="mb-3 input-with-icon">
              <i className="bi bi-envelope icon-left" />
              <input
                type="email"
                className="form-control"
                name="email"
                placeholder="Correo electrónico"
                value={form.email}
                onChange={onChange}
                required
                autoComplete="email"
              />
            </div>
            <div className="mb-2 input-with-icon">
              <i className="bi bi-lock icon-left" />
              <input
                type={showPwd ? 'text' : 'password'}
                className="form-control"
                name="password"
                placeholder="Contraseña"
                value={form.password}
                onChange={onChange}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle-eye-inside"
                onClick={() => setShowPwd(s => !s)}
                title={showPwd ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                aria-label={showPwd ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                <i className={`bi ${showPwd ? 'bi-eye-slash' : 'bi-eye'}`} />
              </button>
            </div>
            <div className="auth-actions">
              <button
                type="button"
                className="btn btn-link align-self-start p-0"
                onClick={() => setShowForgot(true)}
              >
                Olvidé la contraseña
              </button>
              <button className="btn btn-primary btn-lg w-100 btn-login-lg" type="submit">
                Iniciar sesión
              </button>
            </div>
          </form>
        </div>
      </div>
      {showForgot && (
        <div className="modal fade show" style={{ display:'block', background:'rgba(0,0,0,.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Olvidé la contraseña</h5>
                <button type="button" className="btn-close" onClick={() => setShowForgot(false)}></button>
              </div>
              <form onSubmit={submitForgot}>
                <div className="modal-body">
                  <label className="form-label">Correo del usuario</label>
                  <input
                    type="email"
                    className="form-control"
                    value={forgotEmail}
                    onChange={e=>setForgotEmail(e.target.value)}
                    required
                  />
                  <small className="text-muted">Si existe una cuenta con ese correo, recibirás un enlace para actualizar la contraseña.</small>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowForgot(false)}>Cerrar</button>
                  <button type="submit" className="btn btn-primary">Enviar enlace</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {showReset && (
        <div className="modal fade show" style={{ display:'block', background:'rgba(0,0,0,.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Actualizar contraseña</h5>
                <button type="button" className="btn-close" onClick={() => setShowReset(false)}></button>
              </div>
              <form onSubmit={submitPublicReset}>
                <div className="modal-body">
                  <div className="mb-2">
                    <label className="form-label">Correo</label>
                    <input className="form-control" value={resetEmail} disabled />
                  </div>
                  <div className="mb-0 input-with-icon">
                    <i className="bi bi-lock icon-left" />
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Nueva contraseña"
                      value={resetPassword}
                      onChange={e=>setResetPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                    />
                  </div>
                  <small className="text-muted">No necesitas tu contraseña actual.</small>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowReset(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-warning">Actualizar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
