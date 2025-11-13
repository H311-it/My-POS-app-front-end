# MyPOS Starter

> Giao diện React + API .NET cho hệ thống quản lý bán hàng/POS đa nền tảng.

## Yêu cầu môi trường
- [Node.js](https://nodejs.org/) >= 18 (tự động cài npm).
- [.NET SDK 9.0](https://dotnet.microsoft.com/).
- SQL Server / SQL Express hoặc LocalDB (nếu cần thử nghiệm dữ liệu).

## Cấu trúc thư mục
- `frontend/` – ứng dụng React (Vite + TypeScript).
- `backend/` – API ASP.NET Core (`MyPOS.Api`).

## Thiết lập nhanh
1. **Frontend**
   ```powershell
   cd frontend
   npm install
   npm run dev
   ```
   - Dev server chạy tại `http://localhost:8888`.
   - Proxy `/api` trỏ vào API .NET khi phát triển.

2. **Backend**
   ```powershell
   cd backend
   dotnet restore
   dotnet run
   ```
   - API mặc định chạy HTTPS ở `https://localhost:5001`.
   - Endpoint kiểm tra nhanh: `GET https://localhost:5001/api/health`.

## Luồng POS hiện tại
- `/pos` liệt kê danh sách cửa hàng (mock). Mỗi cửa hàng thể hiện trạng thái **Mở phiên bán hàng** hoặc **Tiếp tục phiên**.
- Với cửa hàng đánh dấu *Là nhà hàng*:
  1. Màn hình đăng nhập xuất hiện (Quét thẻ hoặc Chọn thu ngân).
  2. Nhấn “Mở phiên” sẽ hiển thị modal **Kiểm soát tiền mặt khi mở**.
  3. Sau khi xác nhận, hệ thống chuyển sang giao diện sơ đồ bàn (floor/table). Có thể tùy chỉnh hình dạng, sức chứa, nhãn, màu trạng thái (trống/đang phục vụ/đã phục vụ) và theo dõi tiến trình bếp (đang chế biến, hoàn tất, đã phục vụ).
  4. Chọn bàn để mở giao diện order sản phẩm.
- Với cửa hàng thường (không phải nhà hàng) ở trạng thái *phiên mới*, modal tiền mặt hiển thị ngay khi truy cập `/pos/:storeId`.
- Giỏ hàng bên phải có bộ công cụ giống ảnh tham chiếu: **Thông tin, Đơn vị tính, Bảng giá, Refund, Tạm tính, Tách, Nhập mã, Đặt lại CT, Reward, Ghi chú đơn hàng**. Các handler đã được mô phỏng và sẵn sàng nối với nghiệp vụ thật.
- Nút **Đóng** ở banner mở modal **Kiểm soát đóng** với 3 lựa chọn:
  1. **Đóng phiên** – reset trạng thái, đưa cửa hàng về “Mở phiên bán hàng”.
  2. **Tiếp tục mở phiên** – lưu trạng thái giỏ hàng và quay lại danh sách cửa hàng (hoặc sơ đồ bàn).
  3. **Tiếp tục bán** – đóng modal và tiếp tục thao tác.
- Giao diện áp dụng triết lý *mobile-first*: sidebar trở thành thanh điều hướng ngang trên mobile, POS/giỏ hàng/sơ đồ bàn xếp cột, quick actions tự co giãn. Khi ≥ 992px, layout chuyển sang 2 cột truyền thống với sidebar cố định.

## Gợi ý mở rộng
1. Kết nối API .NET cho danh sách cửa hàng, phiên ca, giỏ hàng và kitchen ticket.
2. Tách trạng thái ghi chú đơn hàng, chương trình khuyến mãi… vào persistent store (Redux/Zustand).
3. Hoàn thiện module Kho, Khách hàng, Báo cáo và Cài đặt dựa trên component chung.
4. Thêm kiểm thử (unit/UI) hoặc Storybook để chuẩn hóa UI trước khi nối backend.*** End Patch
