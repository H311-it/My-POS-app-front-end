import { ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function Card({
  title,
  subtitle,
  children,
  footer,
  className
}: CardProps): JSX.Element {
  return (
    <div className={clsx('card', className)}>
      {(title ?? subtitle) && (
        <header className="card-header">
          {title && <h3>{title}</h3>}
          {subtitle && <p>{subtitle}</p>}
        </header>
      )}
      <div className="card-body">{children}</div>
      {footer && <footer className="card-footer">{footer}</footer>}
    </div>
  );
}
