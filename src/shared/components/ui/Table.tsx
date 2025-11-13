import { ReactNode } from 'react';
import clsx from 'clsx';

interface TableColumn<T> {
  key: keyof T | string;
  header: ReactNode;
  width?: string;
  render?: (row: T) => ReactNode;
  align?: 'left' | 'right' | 'center';
}

interface TableProps<T> {
  columns: Array<TableColumn<T>>;
  data: T[];
  emptyState?: ReactNode;
  className?: string;
  getRowKey?: (row: T, index: number) => string | number;
}

export function Table<T>({
  columns,
  data,
  emptyState,
  className,
  getRowKey
}: TableProps<T>): JSX.Element {
  if (data.length === 0 && emptyState) {
    return <div className="table-empty">{emptyState}</div>;
  }

  return (
    <div className={clsx('table-wrapper', className)}>
      <table className="table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                style={{ width: column.width }}
                className={column.align ? `align-${column.align}` : undefined}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={getRowKey?.(row, index) ?? index}>
              {columns.map((column) => (
                <td
                  key={String(column.key)}
                  className={
                    column.align ? `align-${column.align}` : undefined
                  }
                >
                  {column.render
                    ? column.render(row)
                    : (row as Record<string, unknown>)[column.key as string]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
