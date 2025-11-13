import clsx from 'clsx';

type Status = 'success' | 'warning' | 'danger' | 'info' | 'default';

interface StatusPillProps {
  status?: Status;
  children: string;
}

export function StatusPill({
  status = 'default',
  children
}: StatusPillProps): JSX.Element {
  return <span className={clsx('status-pill', `status-pill-${status}`)}>{children}</span>;
}
