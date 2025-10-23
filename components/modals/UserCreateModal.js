import { useState } from 'react';
import Modal from '../Modal';

export default function UserCreateModal({ show, onClose, form, onChange, onSubmit }) {
  const [showPwd, setShowPwd] = useState(false);
  if (!show) return null;

  return (
    <Modal
      title="Registrar usuario"
      icon="bi-person-plus"
      onClose={onClose}
      footer={
        <div className="d-flex w-100 justify-content-between align-items-center gap-2">
          <button className="btn btn-secondary" type="button" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn btn-primary" type="submit" form="formCreateUser">
            Crear
          </button>
        </div>
      }
      size="md"
    >
      <form id="formCreateUser" onSubmit={onSubmit}>
        <div className="form-floating mb-2">
          <input
            className="form-control"
            id="createName"
            name="name"
            placeholder=" "
            value={form.name}
            onChange={onChange}
            required
          />
          <label htmlFor="createName">Nombre</label>
        </div>

        <div className="form-floating mb-2 input-with-icon">
          <i className="bi bi-envelope icon-left" />
          <input
            type="email"
            className="form-control"
            id="createEmail"
            name="email"
            placeholder=" "
            value={form.email}
            onChange={onChange}
            required
            autoComplete="email"
          />
          <label htmlFor="createEmail">Email</label>
        </div>

        <div className="form-floating mb-2 input-with-icon">
          <i className="bi bi-telephone icon-left" />
          <input
            className="form-control"
            id="createPhone"
            name="phone"
            placeholder=" "
            value={form.phone}
            onChange={onChange}
          />
          <label htmlFor="createPhone">Teléfono</label>
        </div>

        <div className="form-floating mb-2 input-with-icon">
          <i className="bi bi-lock icon-left" />
          <input
            type={showPwd ? 'text' : 'password'}
            className="form-control"
            id="createPassword"
            name="password"
            placeholder=" "
            value={form.password}
            onChange={onChange}
            required
            autoComplete="new-password"
          />
          <label htmlFor="createPassword">Contraseña</label>
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

        <div className="form-floating mb-0">
          <select
            className="form-select"
            id="createRole"
            name="role"
            value={form.role}
            onChange={onChange}
          >
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
          <label htmlFor="createRole">Rol</label>
        </div>
      </form>
    </Modal>
  );
}
