# Chạy trên điện thoại

## Ràng buộc phải biết trước

App **luôn cần internet**, kể cả khi mọi file nằm sẵn trong máy. Lý do nằm ở
`js/runtime/support.js`: nó tải React 18.3.1, ReactDOM và Babel standalone từ
`unpkg.com` lúc chạy, cộng thêm font từ `fonts.googleapis.com`.

```js
// support.js
var REACT_URL = "https://unpkg.com/react@18.3.1/umd/react.production.min.js";
var BABEL_URL = "https://unpkg.com/@babel/standalone@7.29.0/babel.min.js";
```

Nên vấn đề cần giải chỉ là **bỏ máy chủ tĩnh cục bộ**, không phải "chạy offline".
Xem mục cuối nếu thật sự cần offline hoàn toàn.

---

## Cách 1 — Hosting tĩnh (khuyến nghị)

Thư mục này đã là một static site hoàn chỉnh, không có bước build. Chỉ cần đẩy lên:

| Nơi | Cách làm | Ghi chú |
|---|---|---|
| **Netlify Drop** | vào `app.netlify.com/drop`, kéo cả thư mục vào | nhanh nhất, ~30 giây, không cần tài khoản |
| **Cloudflare Pages** | Create project → Direct Upload → kéo thư mục | miễn phí, có domain riêng |
| **GitHub Pages** | push repo → Settings → Pages → chọn branch | URL `https://<user>.github.io/<repo>/` |

Sau đó mở URL trên điện thoại. `index.html` sẽ tự chuyển sang `app.dc.html`.

Đã thêm `manifest.webmanifest`, nên bấm **Thêm vào màn hình chính** / *Add to
Home Screen* là app chạy toàn màn hình, không có thanh địa chỉ.

Lưu ý GitHub Pages: thư mục `legacy/` nặng ~2,8 MB. Nếu không cần đối chiếu bản
gốc thì thêm vào `.gitignore` cho repo gọn.

## Cách 2 — Serve từ laptop, mở trên điện thoại cùng WiFi

Nhanh nhất để thử ngay:

```bash
./serve.sh
# Máy này : http://localhost:8000/
# Điện thoại (cùng WiFi): http://192.168.1.x:8000/
```

`serve.sh` đã bind `0.0.0.0` và tự in IP LAN. Nếu điện thoại không vào được:
tường lửa laptop đang chặn cổng 8000, hoặc WiFi bật chế độ AP isolation.

## Cách 3 — Chạy máy chủ ngay trên điện thoại

- **Android** — [Termux](https://f-droid.org/packages/com.termux/) (bản F-Droid,
  bản Play Store đã ngừng cập nhật):
  ```bash
  pkg install python
  cd /sdcard/kinhdich && python -m http.server 8000
  ```
  rồi mở `http://localhost:8000/` bằng Chrome.
- **iOS** — a-Shell (miễn phí, có `python3`), cùng lệnh trên.

Cách này hoạt động nhưng vướng quyền truy cập thư mục, chỉ nên dùng khi không có
mạng LAN lẫn hosting.

---

## Nếu cần offline hoàn toàn

Phải gộp cả React + ReactDOM + Babel vào file. Runtime có sẵn hook cho việc này —
`window.__resources` ánh xạ URL → data-URI:

```js
window.__resources = {
  "https://unpkg.com/react@18.3.1/umd/react.production.min.js": "data:text/javascript;base64,…",
  "https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js": "data:text/javascript;base64,…",
  "https://unpkg.com/@babel/standalone@7.29.0/babel.min.js": "data:text/javascript;base64,…",
  "css/core/kd.css": "data:text/css;base64,…"
};
```

Đặt trước thẻ `<script src="./js/runtime/support.js">`. Riêng Babel standalone
nặng ~2,9 MB nên file HTML cuối sẽ khoảng 5 MB. Ngoài ra còn phải nội tuyến
`html/modules/*.frag.html`, `js/modules/*.js` và `data/luan64.json` bằng cách sửa
`fetchText` trong `app.dc.html`:

```js
async fetchText(url) {
  if (window.KD_INLINE && window.KD_INLINE[url] != null) return window.KD_INLINE[url];
  if (!this.srcCache[url]) this.srcCache[url] = (await fetch(url)).text();
  return this.srcCache[url];
}
```

Đây là việc riêng một buổi, không nên làm nếu Cách 1 đã đủ.

---

## Giao diện trên màn hình hẹp

Chưa kiểm chứng. Vỏ app có `viewport` meta và thanh tab `overflow-x:auto` nên sẽ
dùng được, nhưng bố cục đặt `max-width:1600px` và nhiều module vẽ lưới SVG cửu
cung cỡ cố định — nhiều khả năng phải chỉnh lại ở `css/core/kd.css`. Cần mở thử
từng tab trên máy thật rồi mới biết chỗ nào vỡ.
