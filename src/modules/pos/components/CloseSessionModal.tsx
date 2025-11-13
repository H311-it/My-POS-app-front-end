import { Modal } from '../../../shared/components/ui/Modal';
import { Button } from '../../../shared/components/ui/Button';
import { formatCurrency } from '../../../shared/utils/format';

interface CloseSessionModalProps {
  isOpen: boolean;
  totals: {
    totalAmount: number;
    totalItems: number;
    totalLines: number;
  };
  countedCash: string;
  note: string;
  onCountedCashChange: (value: string) => void;
  onNoteChange: (value: string) => void;
  onCloseSession: () => void;
  onKeepSession: () => void;
  onContinueSelling: () => void;
  onRequestClose: () => void;
}

export function CloseSessionModal({
  isOpen,
  totals,
  countedCash,
  note,
  onCountedCashChange,
  onNoteChange,
  onCloseSession,
  onKeepSession,
  onContinueSelling,
  onRequestClose
}: CloseSessionModalProps): JSX.Element | null {
  return (
    <Modal
      title="Kiểm soát đóng"
      isOpen={isOpen}
      onClose={onRequestClose}
      footer={
        <>
          <Button variant="danger" onClick={onCloseSession}>
            Đóng phiên
          </Button>
          <Button variant="secondary" onClick={onKeepSession}>
            Tiếp tục mở phiên
          </Button>
          <Button onClick={onContinueSelling}>Tiếp tục bán</Button>
        </>
      }
      width="640px"
    >
      <div className="close-session-grid">
        <div>
          <p className="close-session-title">Tổng kết phiên</p>
          <ul>
            <li>Đơn hàng trong phiên: {totals.totalLines}</li>
            <li>Tổng sản phẩm: {totals.totalItems}</li>
            <li>Doanh thu tạm tính: {formatCurrency(totals.totalAmount)}</li>
          </ul>
        </div>
        <div>
          <p className="close-session-title">Tiền mặt</p>
          <div className="close-session-row">
            <span>Dự kiến</span>
            <strong>{formatCurrency(totals.totalAmount)}</strong>
          </div>
          <label className="close-session-input">
            Đã đếm
            <input
              type="number"
              min="0"
              inputMode="numeric"
              value={countedCash}
              onChange={(event) => onCountedCashChange(event.target.value)}
              placeholder="Nhập số tiền mặt đã kiểm"
            />
          </label>
          <div className="close-session-row">
            <span>Chênh lệch</span>
            <strong>
              {formatCurrency(Number(countedCash || 0) - totals.totalAmount)}
            </strong>
          </div>
        </div>
      </div>

      <label className="close-session-textarea">
        Ghi chú
        <textarea
          rows={3}
          value={note}
          onChange={(event) => onNoteChange(event.target.value)}
          placeholder="Ghi chú cho ca này (lý do chênh lệch, chuyển ca...)"
        />
      </label>
    </Modal>
  );
}
