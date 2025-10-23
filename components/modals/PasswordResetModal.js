import { useState } from 'react';
import Modal from '../Modal';

export default function PasswordResetModal({ show, onClose, form, onChange, onSubmit }) {
  const [showPwd, setShowPwd] = useState(false);
  if (!show) return null;

  return (
     <Modal
      title="Cambiar contraseña"
      icon="bi-shield-lock"
      onClose={onClose}
      footer={
        <div className="d-flex w-100 justify-content-between align-items-center gap-2">
          <button className="btn btn-secondary" type="button" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn btn-warning" type="submit" form="formResetPwd">
            Actualizar
          </button>
        </div>
      }
      size="md"
    >
      <form id="formResetPwd" onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input className="form-control" value={form.email} disabled />
        </div>
        <div className="form-floating mb-1 input-with-icon">
          <i className="bi bi-lock icon-left" />
          <input
            type={showPwd ? 'text' : 'password'}
            className="form-control form-control-tall"
            id="resetNewPassword"
            name="newPassword"
            placeholder=" "
            value={form.newPassword}
            onChange={onChange}
            required
            autoComplete="new-password"
          />
          <label htmlFor="resetNewPassword">Nueva contraseña</label>
          <button
            type="button"
            className="toggle-eye-inside"
            onClick={() => setShowPwd(s => !s)}
            aria-label={showPwd ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            title={showPwd ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            <i className={`bi ${showPwd ? 'bi-eye-slash' : 'bi-eye'}`} />
          </button>
        </div>
      </form>
    </Modal>
  );
}
