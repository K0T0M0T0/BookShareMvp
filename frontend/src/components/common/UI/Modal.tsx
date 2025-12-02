import type { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  title?: string;
  onClose?: () => void;
  children: ReactNode;
}

export default function Modal({ open, title, onClose, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="ui-modal__backdrop" role="dialog" aria-modal="true">
      <div className="ui-modal__content">
        {title && <h3>{title}</h3>}
        <div className="ui-modal__body">{children}</div>
        {onClose && (
          <button className="ui-btn ui-btn--ghost" onClick={onClose}>
            Close
          </button>
        )}
      </div>
    </div>
  );
}

