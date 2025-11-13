interface ComingSoonProps {
  title: string;
  description?: string;
}

export function ComingSoon({ title, description }: ComingSoonProps): JSX.Element {
  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        textAlign: 'center'
      }}
    >
      <h2 style={{ margin: 0 }}>{title}</h2>
      <p style={{ color: 'var(--color-muted)', margin: 0 }}>
        {description ?? 'Tính năng này đang được phát triển.'}
      </p>
    </div>
  );
}
