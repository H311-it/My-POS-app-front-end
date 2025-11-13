import { useMemo } from 'react'
import type { CartItem, Product } from '../../../shared/types'
import { formatCurrency } from '../../../shared/utils/format'
import { Button } from '../../../shared/components/ui/Button'
import { Keypad } from './Keypad'

export type PosCartAction =
  | 'info'
  | 'unit'
  | 'price-list'
  | 'refund'
  | 'hold'
  | 'split'
  | 'scan'
  | 'reset-promo'
  | 'reward'
  | 'note'

interface CartPanelProps {
  items: CartItem[]
  products: Product[]
  paymentValue: string
  orderNote?: string
  onIncrease: (productId: string) => void
  onDecrease: (productId: string) => void
  onRemove: (productId: string) => void
  onCheckout: () => void
  onClear: () => void
  onPaymentInput: (value: string) => void
  onPaymentClear: () => void
  onAction: (action: PosCartAction) => void
}

const quickActions: Array<{ id: PosCartAction, label: string, tooltip: string }> = [
  { id: 'info', label: 'Thông tin', tooltip: 'Xem thông tin chi tiết đơn hàng hiện tại' },
  { id: 'unit', label: 'Đơn vị tính', tooltip: 'Đổi đơn vị tính cho sản phẩm' },
  { id: 'price-list', label: 'Bảng giá (VND)', tooltip: 'Áp dụng bảng giá khác' },
  { id: 'refund', label: 'Refund', tooltip: 'Thực hiện hoàn tiền cho đơn hàng' },
  { id: 'hold', label: 'Tạm tính', tooltip: 'Lưu tạm đơn hàng cho bàn khác' },
  { id: 'split', label: 'Tách', tooltip: 'Tách món hoặc hóa đơn cho khách' },
  { id: 'scan', label: 'Nhập mã', tooltip: 'Quét/nhập mã voucher hoặc sản phẩm' },
  { id: 'reset-promo', label: 'Đặt lại CT', tooltip: 'Đặt lại chương trình khuyến mãi' },
  { id: 'reward', label: 'Reward', tooltip: 'Áp dụng điểm thưởng/ưu đãi' },
  { id: 'note', label: 'Ghi chú đơn hàng', tooltip: 'Thêm ghi chú cho thu ngân/bếp' }
]

export function CartPanel ({
  items,
  products,
  paymentValue,
  orderNote,
  onIncrease,
  onDecrease,
  onRemove,
  onCheckout,
  onClear,
  onPaymentInput,
  onPaymentClear,
  onAction
}: CartPanelProps): JSX.Element {
  const enriched = items.map(item => {
    const product = products.find(p => p.id === item.productId)
    return {
      ...item,
      product,
      lineTotal: product ? product.price * item.quantity : 0
    }
  })

  const totals = useMemo(() => {
    const subtotal = enriched.reduce((sum, item) => sum + item.lineTotal, 0)
    const discount = 0
    const tax = Math.round(subtotal * 0.08)
    const total = subtotal - discount + tax
    return { subtotal, discount, tax, total }
  }, [enriched])

  const cash = Number(paymentValue || 0)
  const change = Math.max(cash - totals.total, 0)

  return (
    <div className='pos-cart'>
      <div className='cart-header'>
        <div>
          <h2>Giỏ hàng</h2>
          <p className='product-stock'>
            {items.length} sản phẩm • {formatCurrency(totals.subtotal)}
          </p>
        </div>
        <Button
          variant='ghost'
          onClick={onClear}
          disabled={items.length === 0}
        >
          Xóa tất cả
        </Button>
      </div>

      <div className='cart-quick-actions'>
        {quickActions.map(action => (
          <button
            key={action.id}
            type='button'
            className='quick-action-btn'
            title={action.tooltip}
            onClick={() => onAction(action.id)}
          >
            {action.label}
          </button>
        ))}
      </div>

      <div className='cart-items'>
        {enriched.length === 0 && (
          <div className='table-empty'>
            Chưa có sản phẩm nào, hãy chọn từ danh sách bên trái.
          </div>
        )}
        {enriched.map(item => (
          <div className='cart-item' key={item.productId}>
            <div>
              <h4>{item.product?.name ?? 'Sản phẩm đã xóa'}</h4>
              <div className='meta'>
                {formatCurrency(item.product?.price ?? 0)} • {item.product?.sku}
              </div>
            </div>
            <div className='actions'>
              <Button variant='ghost' onClick={() => onDecrease(item.productId)}>
                −
              </Button>
              <strong>{item.quantity}</strong>
              <Button variant='ghost' onClick={() => onIncrease(item.productId)}>
                +
              </Button>
              <Button
                variant='ghost'
                onClick={() => onRemove(item.productId)}
                aria-label='Xóa khỏi giỏ'
              >
                ×
              </Button>
            </div>
            <div className='summary-row' style={{ gridColumn: '1 / -1' }}>
              <span>Thành tiền</span>
              <strong>{formatCurrency(item.lineTotal)}</strong>
            </div>
          </div>
        ))}
      </div>

      <div className='cart-summary'>
        <div className='summary-row'>
          <span>Tạm tính</span>
          <span>{formatCurrency(totals.subtotal)}</span>
        </div>
        <div className='summary-row'>
          <span>Giảm giá</span>
          <span>{formatCurrency(totals.discount)}</span>
        </div>
        <div className='summary-row'>
          <span>Thuế (8%)</span>
          <span>{formatCurrency(totals.tax)}</span>
        </div>
        <div className='summary-row total'>
          <span>Tổng thanh toán</span>
          <span>{formatCurrency(totals.total)}</span>
        </div>

        <div className='summary-row' style={{ marginTop: '0.75rem' }}>
          <span>Tiền khách đưa</span>
          <strong>{paymentValue ? formatCurrency(cash) : '0 ₫'}</strong>
        </div>
        <div className='summary-row'>
          <span>Tiền thừa</span>
          <strong>{formatCurrency(change)}</strong>
        </div>

        <Keypad
          onInput={value => onPaymentInput(value)}
          onClear={onPaymentClear}
        />

        {orderNote != null && orderNote.trim().length > 0 && (
          <div className='order-note'>
            <strong>Ghi chú đơn hàng</strong>
            <p>{orderNote}</p>
          </div>
        )}

        <Button
          size='lg'
          onClick={onCheckout}
          disabled={enriched.length === 0}
          style={{ marginTop: '1rem' }}
        >
          Thanh toán
        </Button>
      </div>
    </div>
  )
}
