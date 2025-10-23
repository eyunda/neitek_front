import { useEffect } from 'react';

export default function TimedAlert({ show, type='info', children, onClose, duration=3000 }) {
  useEffect(() => {
    if (!show) return;
    const id = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(id);
  }, [show, duration, onClose]);

  if (!show) return null;
  return (
    <div className={`alert alert-${type} py-2`} role="alert">
      {children}
    </div>
  );
}
