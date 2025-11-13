import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './app/layout/AppLayout';
import { ChartsPage } from './modules/charts/pages/ChartsPage';
import { PosStoreSelection } from './modules/pos/pages/PosStoreSelection';
import { PosPage } from './modules/pos/pages/PosPage';
import { OrdersPage } from './modules/orders/pages/OrdersPage';
import { ComingSoon } from './shared/components/ComingSoon';

function App(): JSX.Element {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/charts" replace />} />
        <Route path="/charts" element={<ChartsPage />} />
        <Route path="/pos" element={<PosStoreSelection />} />
        <Route path="/pos/:storeId" element={<PosPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route
          path="/inventory"
          element={
            <ComingSoon
              title="Quản lý kho"
              description="Theo dõi tồn kho, nhập - xuất - kiểm kê và cảnh báo hết hàng."
            />
          }
        />
        <Route
          path="/customers"
          element={
            <ComingSoon
              title="Khách hàng"
              description="Quản lý hồ sơ khách, chương trình khách hàng thân thiết và lịch sử mua hàng."
            />
          }
        />
        <Route
          path="/reports"
          element={
            <ComingSoon
              title="Báo cáo nâng cao"
              description="Bảng điều khiển cá nhân hóa, xuất báo cáo định kỳ và theo dõi KPI chi tiết."
            />
          }
        />
        <Route
          path="/settings"
          element={
            <ComingSoon
              title="Cài đặt hệ thống"
              description="Cấu hình máy in, phân quyền người dùng và thiết lập đa chi nhánh."
            />
          }
        />
        <Route path="*" element={<Navigate to="/charts" replace />} />
      </Routes>
    </AppLayout>
  );
}

export default App;
