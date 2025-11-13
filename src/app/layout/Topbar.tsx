import { useNavigate } from 'react-router-dom'
import { Button } from '../../shared/components/ui/Button'

interface TopbarProps {
  onToggleSidebar: () => void
}

export function Topbar ({ onToggleSidebar }: TopbarProps): JSX.Element {
  const navigate = useNavigate()

  return (
    <header className='topbar'>
      <button
        type='button'
        className='topbar-menu'
        onClick={onToggleSidebar}
        aria-label='Mở menu'
      >
        <span />
        <span />
        <span />
      </button>
      <div className='topbar-heading'>
        <h1 className='topbar-title'>MyPOS Demo Shop</h1>
        <p className='topbar-subtitle'>Kết nối: Online • Máy in: Sẵn sàng</p>
      </div>
      <div className='topbar-actions'>
        <Button variant='secondary' onClick={() => navigate('/pos')}>
          Đổi cửa hàng
        </Button>
        <Button onClick={() => console.log('Đồng bộ dữ liệu')}>
          Đồng bộ dữ liệu
        </Button>
      </div>
    </header>
  )
}
