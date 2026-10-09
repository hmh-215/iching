<div align="center">
  <h1>DỰ ÁN TÀI LIỆU & CÔNG CỤ KINH DỊCH</h1>
  <p><i>Hệ thống tài liệu tra cứu kiến thức và các công cụ hỗ trợ lập quẻ, tính toán ứng dụng Kinh Dịch — Tái cấu trúc chuẩn MVVM & Tích hợp Cổng bảo vệ Mật Khẩu.</i></p>
  <p>
    <a href="https://hmh-215.github.io/iching/">
      <img src="https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-brightgreen?style=for-the-badge&logo=github" alt="Live Demo" />
    </a>
    <img src="https://img.shields.io/badge/Architecture-MVVM%20Modular-blue?style=for-the-badge" alt="MVVM Modular" />
  </p>
  <p>
    🌐 <b>Trải nghiệm Trực Tuyến:</b> <a href="https://hmh-215.github.io/iching/"><b>https://hmh-215.github.io/iching/</b></a><br>
    🔒 <i>Ứng dụng yêu cầu mật khẩu truy cập để bảo vệ tài nguyên học thuật. Vui lòng liên hệ tác giả để nhận thông tin đăng nhập.</i>
  </p>
</div>

<hr>

## 📚 Danh Mục Module Ứng Dụng

Hệ thống được chia thành 5 phân hệ chính theo chuẩn kiến trúc phân cấp:

### 1. Khối Tài Liệu Kiến Thức
Bao gồm các tài liệu tra cứu, luận giải kiến thức nền tảng về Bát Quái, Thần Sát, 64 Quẻ và Biến Khí:

<table>
  <thead>
    <tr>
      <th align="left">Mã Module</th>
      <th align="left">Tên Phân Hệ</th>
      <th align="left">Mô Tả Nội Dung Chi Tiết</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>luan8que</code></td>
      <td>Bát Quái Cơ Bản</td>
      <td>Tài liệu luận giải chi tiết 8 quẻ đơn (Bát Quái: Càn, Đoài, Ly, Chấn, Tốn, Khảm, Cấn, Khôn).</td>
    </tr>
    <tr>
      <td><code>luan10sao</code></td>
      <td>Thập Thiên Tinh</td>
      <td>Tài liệu tra cứu và luận giải 10 thiên tinh (Bồng, Nhuế, Xung, Phụ, Cầm, Tâm, Trụ, Nhậm, Anh, Không).</td>
    </tr>
    <tr>
      <td><code>luan64que</code></td>
      <td>64 Quẻ Dịch</td>
      <td>Tài liệu luận giải 64 quẻ Kinh Dịch và ý nghĩa các hào từ, lời quẻ.</td>
    </tr>
    <tr>
      <td><code>bienkhi</code></td>
      <td>Du Niên Biến Khí</td>
      <td>Kiến thức về du niên biến khí (Sinh Khí, Diên Niên, Thiên Y, Phục Vị, Tuyệt Mệnh, Ngũ Quỷ, Lục Sát, Họa Hại).</td>
    </tr>
    <tr>
      <td><code>luan9sao</code></td>
      <td>Cửu Tinh Độn</td>
      <td>Kiến thức Cửu Tinh trong phương pháp Chân Linh Nhân Đồ Độn.</td>
    </tr>
    <tr>
      <td><code>khiclndd</code></td>
      <td>Khí Chân Linh</td>
      <td>Kiến thức các khí và sự phối hợp của các khí trong Chân Linh Nhân Đồ Độn.</td>
    </tr>
  </tbody>
</table>

### 2. Khối Công Cụ Gieo Quẻ
Bao gồm các công cụ hỗ trợ gieo quẻ theo 2 phương pháp dựa trên giờ động tâm và chu kỳ Lục Thập Hoa Giáp:

<table>
  <thead>
    <tr>
      <th align="left">Mã Module</th>
      <th align="left">Tên Phân Hệ</th>
      <th align="left">Mô Tả Nội Dung Chi Tiết</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>dothu</code></td>
      <td>Đồ Thư Phi Bàn Độn</td>
      <td>Công cụ lập <b>Quẻ Đồ Thư Phi Bàn Độn</b> (Hà Đồ tìm Quẻ Thượng, Lạc Thư tìm Quẻ Hạ, xác định Hào Động, Quẻ Biến và Quẻ Hỗ)</td>
    </tr>
    <tr>
      <td><code>nguling</code></td>
      <td>Quẻ Ngũ Linh</td>
      <td>Công cụ lập <b>Quẻ Ngũ Linh</b> - Gieo quẻ hỏi việc, Hoán Thời Pháp, và Gieo quẻ Đời người.</td>
    </tr>
  </tbody>
</table>

### 3. Khối Công Cụ Tạp Dụng
Các công cụ tính toán mở rộng và ứng dụng thực tiễn trong đời sống:

<table>
  <thead>
    <tr>
      <th align="left">Mã Module</th>
      <th align="left">Tên Phân Hệ</th>
      <th align="left">Mô Tả Nội Dung Chi Tiết</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>maphuong</code></td>
      <td>Ma Phương</td>
      <td>Công cụ tính toán hỗ trợ vẽ <b>Ma Phương</b> và Bảng Sinh Thành Lạc Thư.</td>
    </tr>
    <tr>
      <td><code>cungsinh</code></td>
      <td>Cung Sinh - Cung Phi</td>
      <td>Công cụ tra cứu và tính toán <b>Cung Sinh (giờ sinh) — Cung Phi (năm sinh)</b> cho bản mệnh nam/nữ.</td>
    </tr>
    <tr>
      <td><code>tamtuyet</code></td>
      <td>Tam Tuyệt Pháp</td>
      <td>Công cụ tính <b>Tam Tuyệt Pháp</b> — ứng dụng xem ngày lành cưới hỏi, phòng tránh hung sát.</td>
    </tr>
    <tr>
      <td><code>tamy</code></td>
      <td>Tam Y Tam Sinh</td>
      <td>Công cụ tính tháng và ngày đón <b>Thiên Y / Sinh Khí</b> theo Cung Phi bản mệnh.</td>
    </tr>
    <tr>
      <td><code>tieuvan</code></td>
      <td>Quẻ Tiểu Vận</td>
      <td>Công cụ tính <b>Quẻ Tiểu Vận</b> dựa trên quẻ Quốc khí vận đồ và niên vận cá nhân.</td>
    </tr>
    <tr>
      <td><code>dichtu</code></td>
      <td>Dịch Tự</td>
      <td>Công cụ tra cứu và đồ họa <b>Dịch Tự</b>, hiển thị SVG đồ họa tượng quẻ & âm dương tự.</td>
    </tr>
  </tbody>
</table>

### 4. Khối Chân Linh Nhân Đồ Độn
Hệ thống tính quẻ cao cấp tích hợp đa phương pháp:

<table>
  <thead>
    <tr>
      <th align="left">Mã Module</th>
      <th align="left">Tên Phân Hệ</th>
      <th align="left">Mô Tả Nội Dung Chi Tiết</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>chanlinh</code></td>
      <td>Chân Linh Toàn Diện</td>
      <td>Công cụ tính quẻ và khí theo phương pháp <b>Chân Linh Nhân Đồ Độn</b> toàn diện: 3 Tab tương tác gồm Quẻ Bản Mệnh, Quẻ Niên Vận và Quẻ Tuyển Trạch (chuẩn hóa ma trận Thiên Can theo Nam/Nữ Âm Dương).</td>
    </tr>
  </tbody>
</table>

### 5. Khối Đổi Lịch
Công cụ lịch pháp độc lập, tách riêng khỏi Tạp Dụng:

<table>
  <thead>
    <tr>
      <th align="left">Mã Module</th>
      <th align="left">Tên Phân Hệ</th>
      <th align="left">Mô Tả Nội Dung Chi Tiết</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>amlich</code></td>
      <td>Âm Lịch ⇄ Dương Lịch</td>
      <td>Công cụ <b>đổi Dương lịch ⇄ Âm lịch</b> Việt Nam (UTC+7, 1800–2199): lịch tháng, can chi ngày – tháng – năm – giờ, 24 tiết khí, ngày và giờ hoàng đạo, diễn giải từng bước. Sóc và tiết khí tính bằng thiên văn chính xác cao (Meeus ch.49, VSOP87D), khớp từng ngày với lịch sxwnl.</td>
    </tr>
  </tbody>
</table>

<hr>

<div align="center">
  <p><i> Luận giải trích Dịch Học Ngũ Linh — Cao Từ Linh</i></p>
</div>
