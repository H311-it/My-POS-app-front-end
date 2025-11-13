import { useNavigate } from 'react-router-dom';
import { Button } from '../../../shared/components/ui/Button';
import { usePosSession } from '../state/PosSessionProvider';
import '../store-selection.css';

function formatVietnamDate(date?: string): string {
  if (!date) return 'Chưa xác định';
  return new Intl.DateTimeFormat('vi-VN').format(new Date(date));
}

function formatCash(value?: number): string {
  if (value == null) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(value);
}

export function PosStoreSelection(): JSX.Element {
  const navigate = useNavigate();
  const { stores } = usePosSession();

  const handleOpenStore = (storeId: string): void => {
    const store = stores.find((item) => item.id === storeId);
    if (store == null) return;
    navigate(`/pos/${store.id}`, {
      state: {
        sessionType: store.status === 'active' ? 'resume' : 'new'
      }
    });
  };

  return (
    <div className="store-selection">
      <div className="store-selection-header">
        <h1>Chọn cửa hàng để bán</h1>
        <p style={{ color: 'var(--color-muted)', margin: 0 }}>
          Quản lý phiên bán hàng cho từng cửa hàng/chi nhánh. Bạn có thể mở phiên mới
          hoặc tiếp tục phiên trước đó.
        </p>
      </div>

      <div className="store-selection-grid">
        {stores.map((store) => {
          const isActive = store.status === 'active';
          const buttonLabel = isActive ? 'Tiếp tục phiên' : 'Mở phiên bán hàng';

          return (
            <article key={store.id} className="store-card">
              <header>
                <div>
                  <h2>{store.name}</h2>
                  <small>
                    {isActive
                      ? 'Đang có phiên bán hàng hoạt động'
                      : 'Cần mở phiên bán hàng mới'}
                  </small>
                </div>
                <Button variant="ghost" aria-label="Tùy chọn cửa hàng">
                  ⋮
                </Button>
              </header>

              <div className="store-meta">
                <span>
                  Ngày đóng cuối cùng:{' '}
                  <strong>{formatVietnamDate(store.lastClosedDate)}</strong>
                </span>
                <span>
                  Số dư tiền mặt lần đóng cuối:{' '}
                  <strong>{formatCash(store.lastCashBalance)}</strong>
                </span>
              </div>

              <div className="store-actions">
                <Button
                  size="lg"
                  onClick={() => handleOpenStore(store.id)}
                  isFullWidth
                >
                  {buttonLabel}
                </Button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
