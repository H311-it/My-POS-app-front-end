import { Button } from '../../../shared/components/ui/Button'
import '../restaurant.css'

interface RestaurantLoginProps {
  storeName: string
  onScanCard: () => void
  onSelectCashier: () => void
}

export function RestaurantLogin ({
  storeName,
  onScanCard,
  onSelectCashier
}: RestaurantLoginProps): JSX.Element {
  return (
    <div className='restaurant-login'>
      <h2>Đăng nhập {storeName}</h2>
      <div className='restaurant-login-options'>
        <button className='login-card-scan' type='button' onClick={onScanCard}>
          <span aria-hidden='true'>🪪</span>
          <strong>Quét thẻ</strong>
          <small>Sử dụng thẻ nhân viên để vào ca</small>
        </button>
        <span className='login-divider'>hoặc</span>
        <Button size='lg' onClick={onSelectCashier}>
          Mở phiên
        </Button>
      </div>
    </div>
  )
}
