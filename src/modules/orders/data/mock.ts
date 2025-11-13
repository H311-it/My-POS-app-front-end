import { Order } from '../../../shared/types';

export const mockOrders: Order[] = [
  {
    id: 'ord-1001',
    code: 'DH-1001',
    customerName: 'Nguyễn Thị Mai',
    totalAmount: 325000,
    status: 'completed',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    paymentMethod: 'cash',
    channel: 'POS'
  },
  {
    id: 'ord-1002',
    code: 'DH-1002',
    customerName: 'Phạm Văn Hùng',
    totalAmount: 210000,
    status: 'pending',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    paymentMethod: 'card',
    channel: 'POS'
  },
  {
    id: 'ord-1003',
    code: 'DH-1003',
    customerName: 'Trần Thị Thu',
    totalAmount: 1450000,
    status: 'completed',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    paymentMethod: 'transfer',
    channel: 'Online'
  },
  {
    id: 'ord-1004',
    code: 'DH-1004',
    customerName: 'Đinh Công Tín',
    totalAmount: 455000,
    status: 'cancelled',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    paymentMethod: 'cash',
    channel: 'POS'
  }
];
