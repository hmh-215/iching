# js/core — tầng dùng chung (đang trống)

Nơi đặt các hàm/bảng dữ liệu được gỡ trùng lặp khỏi `js/modules/*.js`.
Thứ tự gỡ và danh sách hàm trùng: xem `docs/HE-THONG.md`.

Dự kiến:

| File | Nội dung | Nguồn |
|---|---|---|
| `util.js` | `pymod`, `coordEq` / `pathIndexOf`, `svgEl` | 5 module |
| `data.js` | can/chi, 60 hoa giáp, tiên/hậu thiên số, tên 64 quẻ, ký hiệu bát quái | 5 module |
| `flyingstar.js` | `transform` / `flyingStarMatrix` (phi tinh cửu cung) | cungsinh, maphuong, tamtuyet |
| `grid.js` | `cellCenter*`, `renderGrid*`, `highlightCell*`, `renderBars*` | 5 module |
| `nguhanh.js` | sinh/khắc + biến khí | cungsinh, nguling, tamtuyet |

Khi thêm file ở đây, nạp bằng thẻ `<script>` trong `app.dc.html` **trước** khi
`PATHS.mod(slug)` được gọi, để module thấy được các hàm chung.
