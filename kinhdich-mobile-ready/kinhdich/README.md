# Dịch Học Ngũ Linh — bộ công cụ hợp nhất

## Chạy

App nạp module bằng `fetch`, nên **phải chạy qua một máy chủ tĩnh**, không mở
trực tiếp bằng `file://`.

```bash
./serve.sh          # mặc định cổng 8000
./serve.sh 9000     # hoặc chỉ định cổng
# rồi mở http://localhost:8000/
```

Tương đương: `python3 -m http.server 8000` tại thư mục gốc dự án.

## Cấu trúc

```
index.html              chuyển hướng sang app.dc.html (để mở được ở "/")
app.dc.html             vỏ app: tab module, hồ sơ dùng chung, sổ tay, lịch sử, sáng/tối
                        — phải giữ đuôi .dc.html, runtime kiểm tra đuôi này

css/
  core/kd.css           token màu dùng chung (tối/sáng) + lớp hoà giải module
  modules/<slug>.css    CSS gốc từng tool, đã scope vào .kd-mod[data-mod=slug]
  modules/luan64.css    CSS phần luận giải 64 quẻ

html/
  modules/<slug>.frag.html   markup gốc từng tool (giữ nguyên id)

js/
  runtime/support.js    runtime của vỏ app (không sửa)
  core/                 tầng dùng chung — đang trống, xem js/core/README.md
  modules/<slug>.js     thuật toán gốc từng tool, bọc trong window.KD_MOD[slug]

data/luan64.json        luận giải 64 quẻ (872 KB, nạp lười khi mở Sổ tay)
docs/HE-THONG.md        bản đồ trùng lặp giữa các module + kế hoạch gỡ dần
legacy/kinh-dich-tools/ 9 file tool gốc, giữ nguyên để đối chiếu
```

## Module

7 module: Đồ Thư · Ngũ Linh · Ma Phương · Cung Sinh · Tam Tuyệt · Chân Linh · Dịch Tự.
Luận giải 64 quẻ nằm trong ngăn "Sổ tay" bên phải, tự nhận quẻ có trong kết quả.

Thuật toán từng module **giữ nguyên 100%** (đối chiếu checksum sau khi tái cấu trúc).

## Thêm một module mới

1. `html/modules/<slug>.frag.html` — markup
2. `css/modules/<slug>.css` — CSS, scope vào `.kd-mod[data-mod="<slug>"]`
3. `js/modules/<slug>.js` — bọc trong `window.KD_MOD["<slug>"] = function(){ … }`
4. Trong `app.dc.html`: thêm 1 dòng `<link>` vào `<helmet>` và 1 mục vào mảng `MODS`

## Đổi cấu trúc thư mục

Mọi đường dẫn động nằm trong hằng `PATHS` ở đầu khối `<script data-dc-script>`
của `app.dc.html`:

```js
const PATHS = {
  frag : slug => 'html/modules/' + slug + '.frag.html',
  mod  : slug => 'js/modules/'   + slug + '.js',
  luan : 'data/luan64.json',
};
```

Đường dẫn tĩnh (`css/…`, `js/runtime/support.js`) nằm ở các thẻ `<link>` /
`<script>` trong `<head>` và `<helmet>`.
