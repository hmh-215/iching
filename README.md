<div align="center">
  <h1>DỰ ÁN TÀI LIỆU & CÔNG CỤ KINH DỊCH</h1>
  <p><i>Hệ thống tài liệu tra cứu kiến thức và các công cụ hỗ trợ lập quẻ, tính toán ứng dụng Kinh Dịch — Tái cấu trúc chuẩn MVVM & Tích hợp Cổng bảo vệ Mã PIN.</i></p>
  <p>
    <a href="https://hmh-215.github.io/iching/">
      <img src="https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-brightgreen?style=for-the-badge&logo=github" alt="Live Demo" />
    </a>
    <img src="https://img.shields.io/badge/Security-PIN%20Protected-gold?style=for-the-badge&logo=auth0" alt="PIN Protected" />
    <img src="https://img.shields.io/badge/Architecture-MVVM%20Modular-blue?style=for-the-badge" alt="MVVM Modular" />
  </p>
  <p>
    🌐 <b>Trải nghiệm Trực Tuyến:</b> <a href="https://hmh-215.github.io/iching/"><b>https://hmh-215.github.io/iching/</b></a><br>
  </p>
</div>


<hr>

## 📚 Danh Mục Module Ứng Dụng

Hệ thống được chia thành 4 phân hệ chính theo chuẩn kiến trúc phân cấp:

### 1. Khối Tài Liệu Kiến Thức
Bao gồm các file tra cứu, luận giải kiến thức nền tảng về Bát Quái, Thần Sát, 64 Quẻ và Biến Khí:

<table>
  <thead>
    <tr>
      <th align="left">Mã Module</th>
      <th align="left">File Độc Lập Gốc</th>
      <th align="left">Mô Tả Nội Dung Chi Tiết</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>luan8que</code></td>
      <td><code>00-luan8que.html</code></td>
      <td>Tài liệu luận giải chi tiết 8 quẻ đơn (Bát Quái: Càn, Đoài, Ly, Chấn, Tốn, Khảm, Cấn, Khôn).</td>
    </tr>
    <tr>
      <td><code>luan10sao</code></td>
      <td><code>00-luan10sao.html</code></td>
      <td>Tài liệu tra cứu và luận giải 10 thiên tinh (Bồng, Nhuế, Xung, Phụ, Cầm, Tâm, Trụ, Nhậm, Anh, Không).</td>
    </tr>
    <tr>
      <td><code>luan64que</code></td>
      <td><code>00-luan64que.html</code></td>
      <td>Tài liệu luận giải 64 quẻ Kinh Dịch, tra cứu theo số hiệu và hào quái.</td>
    </tr>
    <tr>
      <td><code>bienkhi</code></td>
      <td><code>00-bien_khi.html</code></td>
      <td>Kiến thức về du niên biến khí (Sinh Khí, Diên Niên, Thiên Y, Phục Vị, Tuyệt Mệnh, Ngũ Quỷ, Lục Sát, Họa Hại).</td>
    </tr>
    <tr>
      <td><code>luan9sao</code></td>
      <td><code>00-luan9sao_clndd.html</code></td>
      <td>Kiến thức Cửu Tinh trong phương pháp Chân Linh Nhân Đồ Độn.</td>
    </tr>
    <tr>
      <td><code>khiclndd</code></td>
      <td><code>00-khi_clndd.html</code></td>
      <td>Kiến thức các khí và sự phối hợp của các khí trong Chân Linh Nhân Đồ Độn.</td>
    </tr>
  </tbody>
</table>

### 2. Khối Công Cụ Lập Quẻ
Bao gồm các công cụ hỗ trợ gieo quẻ theo 2 phương pháp dựa trên giờ động tâm và chu kỳ Lục Thập Hoa Giáp:

<table>
  <thead>
    <tr>
      <th align="left">Mã Module</th>
      <th align="left">File Độc Lập Gốc</th>
      <th align="left">Mô Tả Nội Dung Chi Tiết</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>dothu</code></td>
      <td><code>01-que_do_thu.html</code></td>
      <td>Công cụ lập <b>Quẻ Đồ Thư Phi Bàn Độn</b> (Hà Đồ tìm Quẻ Thượng, Lạc Thư tìm Quẻ Hạ, xác định Hào Động, Quẻ Biến và Quẻ Hỗ). Tách bạch Model tính toán và View ma trận SVG.</td>
    </tr>
    <tr>
      <td><code>nguling</code></td>
      <td><code>01-que_ngu_linh.html</code></td>
      <td>Công cụ lập <b>Quẻ Ngũ Linh</b> (bảng 4x4 Đồ Thư Phi Bàn Độn, an Bát Môn, phối Cửu Tinh và giải pháp Hoán Thời Pháp).</td>
    </tr>
  </tbody>
</table>

### 3. Khối Công Cụ Tiện Ích & Ứng Dụng
Các công cụ tính toán mở rộng và ứng dụng thực tiễn trong đời sống:

<table>
  <thead>
    <tr>
      <th align="left">Mã Module</th>
      <th align="left">File Độc Lập Gốc</th>
      <th align="left">Mô Tả Nội Dung Chi Tiết</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>maphuong</code></td>
      <td><code>02-ma_phuong.html</code></td>
      <td>Công cụ tính toán hỗ trợ vẽ <b>Ma Phương</b> và Bảng Sinh Thành Lạc Thư.</td>
    </tr>
    <tr>
      <td><code>cungsinh</code></td>
      <td><code>02-cung_sinh_cung_phi.html</code></td>
      <td>Công cụ tra cứu và tính toán <b>Cung Sinh (giờ sinh) — Cung Phi (năm sinh)</b> cho bản mệnh nam/nữ.</td>
    </tr>
    <tr>
      <td><code>tamtuyet</code></td>
      <td><code>02-tam_tuyet_phap.html</code></td>
      <td>Công cụ tính <b>Tam Tuyệt Pháp</b> — ứng dụng xem ngày lành cưới hỏi, phòng tránh hung sát.</td>
    </tr>
    <tr>
      <td><code>tamy</code></td>
      <td><code>02-tam_y_tam_sinh.html</code></td>
      <td>Công cụ tính tháng và ngày đón <b>Thiên Y / Sinh Khí</b> theo Cung Phi bản mệnh.</td>
    </tr>
    <tr>
      <td><code>tieuvan</code></td>
      <td><code>02-que_tieu_van.html</code></td>
      <td>Công cụ tính <b>Quẻ Tiểu Vận</b> dựa trên quẻ Quốc khí vận đồ và niên vận cá nhân.</td>
    </tr>
    <tr>
      <td><code>dichtu</code></td>
      <td><i>(Tích hợp mới)</i></td>
      <td>Công cụ tra cứu và đồ họa <b>Dịch Tự</b>, hiển thị SVG đồ họa tượng quẻ & âm dương tự.</td>
    </tr>
  </tbody>
</table>

### 4. Khối Chân Linh Nhân Độn
Hệ thống tính quẻ cao cấp tích hợp đa phương pháp:

<table>
  <thead>
    <tr>
      <th align="left">Mã Module</th>
      <th align="left">File Độc Lập Gốc</th>
      <th align="left">Mô Tả Nội Dung Chi Tiết</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>chanlinh</code></td>
      <td><code>03-chan_linh_nhan_do_don.html</code></td>
      <td>Công cụ tính quẻ và khí theo phương pháp <b>Chân Linh Nhân Đồ Độn</b> toàn diện: 3 Tab tương tác gồm Quẻ Bản Mệnh, Quẻ Niên Vận và Quẻ Tuyển Trạch (chuẩn hóa ma trận Thiên Can theo Nam/Nữ Âm Dương).</td>
    </tr>
  </tbody>
</table>

<hr>

## 🏗️ Kiến Trúc Hệ Thống (MVVM & Shared Core)

Dự án đã được tái cấu trúc triệt để, loại bỏ toàn bộ các hàm / bảng tra cứu trùng lặp thành **Tầng dịch vụ dùng chung (`js/core/`)**:

- **`js/core/auth.js` (`KD_AUTH`)**: Quản lý xác thực mã PIN, băm SHA-256 + salt, giao diện modal số.
- **`js/core/util.js` (`KD_UTIL`)**: Các hàm toán học nhị phân/modulo (`mod`), so sánh tọa độ (`coordEq`), chuẩn hóa chuỗi tiếng Việt (`norm`), điều khiển giao diện accordion.
- **`js/core/data.js` (`KD_DATA`, `KD_DICH`)**: Bảng hằng số Thiên Can, Địa Chi, 60 Hoa Giáp, Bát Quái nhị phân, bảng tra cứu 64 quẻ Kinh Dịch chuẩn mực.
- **`js/core/grid.js` (`KD_GRID`)**: Bộ dựng hình SVG dùng chung: vẽ ma trận, vẽ đường dịch chuyển hoạt họa (animated paths), vẽ hào âm dương (3 hào / 6 hào / hào động).
- **`js/core/flyingstar.js` (`KD_FLYINGSTAR`)**: Thuật toán Phi tinh, ma trận Khảm cơ sở, biến đổi ma trận 8 hướng (rot, transpose, flip).
- **`js/core/interpret.js`**: Hệ thống pop-up tra cứu luận giải quẻ tương tác khi nhấn vào bất kỳ quẻ nào trên màn hình.

<hr>

## 💻 Hướng Dẫn Cài Đặt & Chạy Cục Bộ

### 1. Mở trực tiếp bản đóng gói (Single-File App)
Chỉ cần nhấp đúp mở file `index.html` hoặc `kinhdich-mobile-ready/kinhdich/dist/kinh-dich-ngu-linh.html` bằng bất kỳ trình duyệt web hiện đại nào (Chrome, Edge, Firefox, Safari). Toàn bộ CSS, JS, Icon và dữ liệu 64 quẻ đã được nhúng sẵn 100%.

### 2. Chạy qua Local HTTP Server (PowerShell)
```powershell
# Chạy HTTP Server tích hợp tại cổng 8000
powershell -ExecutionPolicy Bypass -File kinhdich-mobile-ready/kinhdich/serve.ps1 -Port 8000
```
Sau đó truy cập: `http://localhost:8000`

### 3. Đóng gói lại sau khi sửa code (Bundle Script)
Khi có bất kỳ thay đổi nào trong `js/core/`, `js/modules/`, `html/modules/` hoặc `css/`:
```powershell
# Tự động gom toàn bộ modules thành file index.html / dist HTML duy nhất
powershell -ExecutionPolicy Bypass -File kinhdich-mobile-ready/kinhdich/bundle.ps1
Copy-Item kinhdich-mobile-ready/kinhdich/dist/kinh-dich-ngu-linh.html index.html -Force
```

<hr>

<div align="center">
  <p><i>Thuật toán từng module giữ nguyên bản gốc · Luận giải trích Dịch Học Ngũ Linh — Cao Từ Linh</i></p>
</div>
