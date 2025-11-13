import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './Button';

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  width?: string;
}

const modalRoot =
  typeof document !== 'undefined'
    ? document.getElementById('modal-root') ?? createModalRoot()
    : null;

function createModalRoot(): HTMLElement {
  const node = document.createElement('div');
  node.id = 'modal-root';
  document.body.appendChild(node);
  return node;
}

export function Modal({
  title,
  isOpen,
  onClose,
  children,
  footer,
  width = '520px'
}: ModalProps): JSX.Element | null {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || modalRoot == null) {
    return null;
  }

  return createPortal(
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal" style={{ width }}>
        <header className="modal-header">
          <h2>{title}</h2>
          <Button variant="ghost" onClick={onClose} aria-label="Đóng">
            ×
          </Button>
        </header>
        <div className="modal-body">{children}</div>
        {footer && <footer className="modal-footer">{footer}</footer>}
      </div>
    </div>,
    modalRoot
  );
}
