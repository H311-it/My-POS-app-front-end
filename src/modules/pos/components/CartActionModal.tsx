import { Modal } from '../../../shared/components/ui/Modal'
import { Button } from '../../../shared/components/ui/Button'
import { formatCurrency } from '../../../shared/utils/format'

export type CartActionModalState =
  | { type: 'none' }
  | {
      type: 'info'
      totals: {
        lines: number
        items: number
        amount: number
      }
    }
  | { type: 'message'; title: string; description: string }
  | { type: 'note'; noteDraft: string }
  | { type: 'scan'; code: string }

interface CartActionModalProps {
  state: CartActionModalState
  onClose: () => void
  onUpdate: (state: CartActionModalState) => void
  onApply: (state: CartActionModalState) => void
}

export function CartActionModal ({
  state,
  onClose,
  onUpdate,
  onApply
}: CartActionModalProps): JSX.Element | null {
  if (state.type === 'none') {
    return null
  }

  switch (state.type) {
    case 'info':
      return (
        <Modal
          title='Thông tin đơn hàng'
          isOpen
          onClose={onClose}
          footer={
            <Button onClick={onClose} variant='primary'>
              Đóng
            </Button>
          }
        >
          <div className='modal-summary'>
            <p>
              <strong>Số dòng sản phẩm:</strong> {state.totals.lines}
            </p>
            <p>
              <strong>Tổng số lượng:</strong> {state.totals.items}
            </p>
            <p>
              <strong>Giá trị tạm tính:</strong>{' '}
              {formatCurrency(state.totals.amount)}
            </p>
          </div>
        </Modal>
      )

    case 'message':
      return (
        <Modal
          title={state.title}
          isOpen
          onClose={onClose}
          footer={
            <Button onClick={onClose} variant='primary'>
              Đồng ý
            </Button>
          }
        >
          <p style={{ margin: 0, color: 'var(--color-muted)', lineHeight: 1.5 }}>
            {state.description}
          </p>
        </Modal>
      )

    case 'note':
      return (
        <Modal
          title='Ghi chú đơn hàng'
          isOpen
          onClose={onClose}
          footer={
            <>
              <Button variant='secondary' onClick={onClose}>
                Hủy
              </Button>
              <Button
                onClick={() => {
                  onApply(state)
                }}
              >
                Lưu ghi chú
              </Button>
            </>
          }
        >
          <label className='modal-field'>
            <span>Ghi chú</span>
            <textarea
              rows={4}
              value={state.noteDraft}
              onChange={event =>
                onUpdate({ type: 'note', noteDraft: event.target.value })
              }
            />
          </label>
        </Modal>
      )

    case 'scan':
      return (
        <Modal
          title='Nhập mã'
          isOpen
          onClose={onClose}
          footer={
            <>
              <Button variant='secondary' onClick={onClose}>
                Hủy
              </Button>
              <Button
                onClick={() => {
                  onApply(state)
                }}
              >
                Áp dụng
              </Button>
            </>
          }
        >
          <label className='modal-field'>
            <span>Mã voucher / sản phẩm</span>
            <input
              value={state.code}
              onChange={event =>
                onUpdate({ type: 'scan', code: event.target.value })
              }
              placeholder='Nhập mã cần áp dụng'
            />
          </label>
        </Modal>
      )
  }
}
