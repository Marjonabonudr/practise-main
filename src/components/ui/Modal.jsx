import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import Icon from './Icon';

/**
 * Modal oyna. Escape bilan yopiladi, fokusni ichkarida ushlab turadi.
 */
const Modal = ({ open = true, title, description, onClose, footer, children, wide = false }) => {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}>
      <div
        className={`modal ${wide ? 'modal--wide' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : undefined}
      >
        <div className="modal__head">
          <div>
            {title && <h3 className="modal__title">{title}</h3>}
            {description && <p className="modal__desc">{description}</p>}
          </div>
          <button type="button" className="modal__close" onClick={onClose} aria-label="Yopish">
            <Icon name="x" size={16} />
          </button>
        </div>
        <div className="modal__body">{children}</div>
        {footer && <div className="modal__foot">{footer}</div>}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
