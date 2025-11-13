import { useMemo, useState } from 'react';
import { Card } from '../../../shared/components/ui/Card';
import { Table } from '../../../shared/components/ui/Table';
import { StatusPill } from '../../../shared/components/ui/StatusPill';
import { Order } from '../../../shared/types';
import { formatCurrency, formatDateTime } from '../../../shared/utils/format';
import { mockOrders } from '../data/mock';
import '../orders.css';

const statusLabels: Record<Order['status'], string> = {
  completed: 'Hoàn tất',
  pending: 'Chờ xử lý',
  cancelled: 'Đã hủy',
  refunded: 'Hoàn tiền'
};

const statusColor: Record<Order['status'], Parameters<typeof StatusPill>[0]['status']> = {
  completed: 'success',
  pending: 'warning',
  cancelled: 'danger',
  refunded: 'info'
};

export function OrdersPage(): JSX.Element {
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState<'all' | Order['status']>('all');

  const filtered = useMemo(() => {
    return mockOrders.filter((order) => {
      const matchKeyword =
        order.code.toLowerCase().includes(keyword.toLowerCase()) ||
        (order.customerName ?? '').toLowerCase().includes(keyword.toLowerCase());
      const matchStatus = status === 'all' || order.status === status;
      return matchKeyword && matchStatus;
    });
  }, [keyword, status]);

  return (
    <div className="orders-page">
      <Card
        title="Bộ lọc đơn hàng"
        subtitle="Tìm kiếm nhanh theo mã, khách hàng hoặc trạng thái"
      >
        <div className="orders-filters">
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Nhập mã đơn / tên khách hàng..."
          />
          <select value={status} onChange={(event) => setStatus(event.target.value as typeof status)}>
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xử lý</option>
            <option value="completed">Hoàn tất</option>
            <option value="cancelled">Đã hủy</option>
            <option value="refunded">Hoàn tiền</option>
          </select>
        </div>
      </Card>

      <Card className="orders-table-card" title="Danh sách đơn hàng">
        <Table
          columns={[
            { key: 'code', header: 'Mã đơn' },
            {
              key: 'createdAt',
              header: 'Thời gian',
              render: (row) => formatDateTime(row.createdAt)
            },
            {
              key: 'customerName',
              header: 'Khách hàng',
              render: (row) => row.customerName ?? 'Khách lẻ'
            },
            {
              key: 'status',
              header: 'Trạng thái',
              render: (row) => (
                <StatusPill status={statusColor[row.status]}>{statusLabels[row.status]}</StatusPill>
              )
            },
            {
              key: 'totalAmount',
              header: 'Giá trị',
              align: 'right',
              render: (row) => formatCurrency(row.totalAmount)
            },
            {
              key: 'paymentMethod',
              header: 'Thanh toán',
              render: (row) => {
                switch (row.paymentMethod) {
                  case 'cash':
                    return 'Tiền mặt';
                  case 'card':
                    return 'Thẻ';
                  case 'transfer':
                    return 'Chuyển khoản';
                }
              }
            },
            { key: 'channel', header: 'Kênh' }
          ]}
          data={filtered}
          getRowKey={(row) => row.id}
          emptyState="Chưa có đơn hàng nào khớp bộ lọc."
        />
      </Card>
    </div>
  );
}
