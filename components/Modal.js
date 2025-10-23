export default function Modal({ title, icon, children, onClose, footer, size = 'md' }) {
  const sizeClass =
    size === 'lg' ? 'modal-lg' :
    size === 'sm' ? 'modal-sm' : '';

  return (
    <div className="modal modal-neo fade show" role="dialog" aria-modal="true">
      <div className={`modal-dialog modal-dialog-centered ${sizeClass}`}>
        <div className="modal-content">
          <div className="modal-header modal-header-centered">
            <h5 className="modal-title modal-title-center">
              {icon && <i className={`bi ${icon} me-2`} aria-hidden="true" />}
              {title}
            </h5>
            <button
              type="button"
              className="btn-close-ghost modal-close-right"
              onClick={onClose}
              aria-label="Cerrar"
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
          <div className="modal-body">{children}</div>
          {footer && <div className="modal-footer">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
