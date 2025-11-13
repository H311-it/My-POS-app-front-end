import { useState } from 'react';
import { Modal } from '../../../shared/components/ui/Modal';
import { Button } from '../../../shared/components/ui/Button';
import { formatCurrency } from '../../../shared/utils/format';

type PaymentMethod = 'cash' | 'card' | 'transfer';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  onConfirm: (method: PaymentMethod) => void;
}

const methods: Array<{ id: PaymentMethod; label: string; description: string }> = [
  { id: 'cash', label: 'Tiền mặt', description: 'Thanh toán trực tiếp tại quầy' },
  { id: 'card', label: 'Thẻ', description: 'POS / Visa / MasterCard' },
  { id: 'transfer', label: 'Chuyển khoản', description: 'Ngân hàng / ví điện tử' }
];

export function CheckoutModal({
  isOpen,
  onClose,
  totalAmount,
  onConfirm
}: CheckoutModalProps): JSX.Element {
  const [selected, setSelected] = useState<PaymentMethod>('cash');

  return (
    <Modal
      title="Hoàn tất thanh toán"
      isOpen={isOpen}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Hủy
          </Button>
          <Button
            onClick={() => {
              onConfirm(selected);
              onClose();
            }}
          >
            Xác nhận &amp; In hóa đơn
          </Button>
        </>
      }
    >
      <div className="summary-row" style={{ marginBottom: '1rem' }}>
        <span>Tổng tiền</span>
        <strong>{formatCurrency(totalAmount)}</strong>
      </div>
      <div className="payment-methods">
        {methods.map((method) => (
          <button
            type="button"
            key={method.id}
            className={`payment-card ${selected === method.id ? 'active' : ''}`}
            onClick={() => setSelected(method.id)}
          >
            <strong>{method.label}</strong>
            <p style={{ margin: '0.25rem 0 0', color: 'var(--color-muted)' }}>
              {method.description}
            </p>
          </button>
        ))}
      </div>
    </Modal>
  );
}
