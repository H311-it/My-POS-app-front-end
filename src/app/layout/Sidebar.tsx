import { NavLink } from 'react-router-dom'
import type { JSX } from 'react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

type NavItem = {
  to: string
  label: string
  icon: JSX.Element
}

const navItems: NavItem[] = [
  {
    to: '/charts',
    label: 'Biểu đồ',
    icon: (
      <svg viewBox='0 0 24 24' aria-hidden='true'>
        <path
          d='M4 19v-6m6 6V5m6 14v-9.5M20 19V9'
          stroke='currentColor'
          strokeWidth='1.8'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    )
  },
  {
    to: '/pos',
    label: 'POS',
    icon: (
      <svg viewBox='0 0 24 24' aria-hidden='true'>
        <path
          d='M6 9h12M6 13h7m7-4.5V17a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5z'
          stroke='currentColor'
          strokeWidth='1.8'
          strokeLinecap='round'
          strokeLinejoin='round'
          fill='none'
        />
      </svg>
    )
  },
  {
    to: '/orders',
    label: 'Đơn hàng',
    icon: (
      <svg viewBox='0 0 24 24' aria-hidden='true'>
        <path
          d='M7 4h10l3 4v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h2zm0 0v4h10'
          stroke='currentColor'
          strokeWidth='1.8'
          strokeLinecap='round'
          strokeLinejoin='round'
          fill='none'
        />
      </svg>
    )
  },
  {
    to: '/inventory',
    label: 'Kho',
    icon: (
      <svg viewBox='0 0 24 24' aria-hidden='true'>
        <path
          d='M4 19V9.5a1 1 0 0 1 .553-.894l7.447-3.723a1 1 0 0 1 .894 0L20 8.606a1 1 0 0 1 .553.894V19M4 19h16M4 19h6m10 0h-6m-4-7h8m-8 4h4'
          stroke='currentColor'
          strokeWidth='1.8'
          strokeLinecap='round'
          strokeLinejoin='round'
          fill='none'
        />
      </svg>
    )
  },
  {
    to: '/customers',
    label: 'Khách hàng',
    icon: (
      <svg viewBox='0 0 24 24' aria-hidden='true'>
        <path
          d='M16 18v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1m12-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM20 21v-2a3 3 0 0 0-2.5-2.958'
          stroke='currentColor'
          strokeWidth='1.8'
          strokeLinecap='round'
          strokeLinejoin='round'
          fill='none'
        />
      </svg>
    )
  },
  {
    to: '/reports',
    label: 'Báo cáo',
    icon: (
      <svg viewBox='0 0 24 24' aria-hidden='true'>
        <path
          d='M8 20H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h7.5L20 10.5V18a2 2 0 0 1-2 2h-1M8 14h8m-8-4h4'
          stroke='currentColor'
          strokeWidth='1.8'
          strokeLinecap='round'
          strokeLinejoin='round'
          fill='none'
        />
      </svg>
    )
  },
  {
    to: '/settings',
    label: 'Cài đặt',
    icon: (
      <svg viewBox='0 0 24 24' aria-hidden='true'>
        <path
          d='M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm7.5-3a1.5 1.5 0 0 0 .75-2.812l-1.01-.584a6.03 6.03 0 0 0-.426-1.029l.159-1.158A1.5 1.5 0 0 0 17.516 4l-1.159.159a6.03 6.03 0 0 0-1.028-.426L14.745 2.72a1.5 1.5 0 0 0-2.49 0l-.585 1.01a6.03 6.03 0 0 0-1.028.426L9.484 4.159A1.5 1.5 0 0 0 7.527 5.27l.159 1.158a6.03 6.03 0 0 0-.426 1.029l-1.01.584A1.5 1.5 0 0 0 6.75 12c0 .533.285 1.025.75 1.293l1.01.584c.108.355.249.699.426 1.029l-.159 1.158A1.5 1.5 0 0 0 9.484 20l1.158-.159c.33.177.674.318 1.029.426l.585 1.01a1.5 1.5 0 0 0 2.49 0l.584-1.01c.355-.108.7-.249 1.029-.426l1.158.159a1.5 1.5 0 0 0 1.957-1.11l-.159-1.158c.177-.33.318-.674.426-1.029l1.01-.584A1.5 1.5 0 0 0 19.5 12z'
          stroke='currentColor'
          strokeWidth='1.2'
          fill='none'
        />
      </svg>
    )
  }
]

export function Sidebar ({ isOpen, onClose }: SidebarProps): JSX.Element {
  return (
    <aside className={`sidebar ${isOpen ? 'is-open' : ''}`}>
      <div className='sidebar-header'>
        <div className='sidebar-logo'>MyPOS</div>
        <button
          type='button'
          className='sidebar-close'
          onClick={onClose}
          aria-label='Đóng menu'
        >
          <svg viewBox='0 0 24 24' aria-hidden='true'>
            <path
              d='M6 6l12 12M6 18L18 6'
              stroke='currentColor'
              strokeWidth='1.8'
              strokeLinecap='round'
            />
          </svg>
        </button>
      </div>

      <nav aria-label='Điều hướng chính'>
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <span className='sidebar-icon'>{item.icon}</span>
            <span className='sidebar-text'>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
