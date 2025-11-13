import { Modal } from '../../../shared/components/ui/Modal';
import { Button } from '../../../shared/components/ui/Button';

interface CashControlModalProps {
  isOpen: boolean;
  cashValue: string;
  noteValue: string;
  onCashChange: (value: string) => void;
  onNoteChange: (value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  error?: string | null;
  sessionType: 'resume' | 'new';
  storeName?: string;
}

export function CashControlModal({
  isOpen,
  cashValue,
  noteValue,
  onCashChange,
  onNoteChange,
  onConfirm,
  onCancel,
  error,
  sessionType,
  storeName
}: CashControlModalProps): JSX.Element | null {
  return (
    <Modal
      title="Kiểm soát tiền mặt khi mở"
      isOpen={isOpen}
      onClose={onCancel}
      footer={
        <>
          <Button variant="secondary" onClick={onCancel}>
            Quay lại
          </Button>
          <Button onClick={onConfirm}>Mở POS</Button>
        </>
      }
    >
      <p style={{ marginTop: 0, color: 'var(--color-muted)' }}>
        {sessionType === 'resume'
          ? `Tiếp tục phiên bán hàng cho ${storeName ?? 'cửa hàng'}. Vui lòng xác nhận số tiền mặt hiện có tại quầy.`
          : `Bắt đầu phiên bán hàng mới cho ${storeName ?? 'cửa hàng'}. Ghi nhận tiền mặt hiện có để đối soát cuối ca.`}
      </p>

      <label className="modal-field" htmlFor="cash-opening">
        <span>Tiền mặt khi mở</span>
        <input
          id="cash-opening"
          type="number"
          min="0"
          inputMode="numeric"
          value={cashValue}
          onChange={(event) => onCashChange(event.target.value)}
          placeholder="Nhập số tiền mặt tại quầy (₫)"
        />
      </label>
      {error && (
        <span style={{ color: 'var(--color-danger)', fontSize: '0.9rem' }}>
          {error}
        </span>
      )}

      <label className="modal-field" htmlFor="cash-note">
        <span>Ghi chú</span>
        <textarea
          id="cash-note"
          rows={3}
          value={noteValue}
          onChange={(event) => onNoteChange(event.target.value)}
          placeholder="Ghi lại tình trạng két, lý do chênh lệch (nếu có)..."
        />
      </label>
    </Modal>
  );
}
