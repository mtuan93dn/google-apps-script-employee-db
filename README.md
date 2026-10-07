# Employee Database với Google Apps Script

Dự án này xây dựng một hệ thống quản lý nhân viên bằng Google Sheets + Google Apps Script, có các tính năng:

- Thêm nhân viên mới
- Xem / tìm kiếm / lọc nhân viên
- Cập nhật thông tin
- Xóa nhân viên
- Xuất danh sách
- Kiểm tra dữ liệu đầu vào
- Giới hạn quyền truy cập theo email được cấp phép
- Web App riêng biệt để quản lý trên trình duyệt

## Cấu trúc thư mục

- `Code.gs` – backend Apps Script
- `Index.html` – giao diện người dùng
- `Styles.css` – giao diện và layout
- `Script.js` – logic frontend
- `appsscript.json` – cấu hình Apps Script

## Bước 1: Tạo Google Sheet

1. Mở Google Sheets
2. Tạo file mới
3. Đặt tên sheet là `Employees`
4. Thêm header đúng thứ tự:

```
employee_id,full_name,position,department,division,phone,email,status
```

Ví dụ dữ liệu:

```
EMP001,Nguyễn Văn A,Quản lý,Phòng Kế toán,Phòng Ban Hành chính,0901234567,nguyenvana@example.com,Hoạt động
```

## Bước 2: Tạo Apps Script project

1. Truy cập: https://script.google.com
2. Chọn `Blank project`
3. Copy toàn bộ nội dung các file trong repo này vào project tương ứng
4. Lưu lại project

## Bước 3: Cấu hình quyền truy cập

Trong Apps Script, mở `Code.gs`, tìm hàm:

```javascript
function setAllowedEmails() {
  PropertiesService.getScriptProperties().setProperty('ALLOWED_EMAILS', 'yourmail@example.com,another@example.com');
}
```

Thay email của bạn và các email được phép truy cập. Chạy hàm này một lần.

## Bước 4: Triển khai Web App

1. Trong Apps Script, chọn `Deploy` → `New deployment`
2. Chọn kiểu `Web app`
3. Thiết lập:
   - Execute as: `Me`
   - Who has access: `Anyone`
4. Nhấn `Deploy`
5. Copy URL web app

## Bước 5: Kiểm thử

Truy cập URL web app, đăng nhập bằng tài khoản Google đã được whitelist.

## Lưu ý quan trọng

- `ALLOWED_EMAILS` là cách giới hạn quyền truy cập
- Apps Script sẽ đọc email hiện tại với `Session.getActiveUser().getEmail()`
- Nếu email không thuộc whitelist, hệ thống sẽ chặn truy cập
- Bảng `Employees` là database chính của dự án

## Tính năng đã có

- Thêm nhân viên mới
- Cập nhật nhân viên
- Xóa nhân viên
- Tìm kiếm / lọc bộ phận / trạng thái
- Validate dữ liệu
- Xuất danh sách CSV

## Cập nhật sau này

Bạn có thể mở rộng dự án bằng các module sau:

- Chứng nhận nhân sự
- Dòng thời gian thay đổi
- Import dữ liệu từ Excel
- Tự động gửi email khi thay đổi trạng thái
- Tạo dashboard báo cáo

---

Nếu muốn, tôi có thể tiếp tục với bước 1: chuẩn bị file `Code.gs` và `Index.html` cho bạn để chạy ngay trên Apps Script.
