# Hệ thống — bản đồ trùng lặp & kế hoạch gỡ dần

Nguyên tắc hiện tại: **thuật toán từng module giữ nguyên 100%**. Việc hợp nhất
mới chỉ làm ở tầng vỏ (UI, token màu, hồ sơ dùng chung, sổ tay diễn giải, lịch sử).
File này ghi lại chỗ trùng để gỡ dần sau, mỗi lần một hàm, có đối chiếu kết quả.

## Cấu trúc hiện tại

```
app.dc.html                  vỏ app: tab, hồ sơ dùng chung, sổ tay, lịch sử, sáng/tối
index.html                   chuyển hướng sang app.dc.html
css/core/kd.css              token dùng chung (dark/light) + lớp hoà giải module
css/modules/<slug>.css       CSS gốc của tool, đã scope vào .kd-mod[data-mod=slug]
css/modules/luan64.css       CSS phần luận giải
html/modules/<slug>.frag.html  markup gốc của tool (nguyên bản, giữ đúng id)
js/runtime/support.js        runtime vỏ app
js/core/                     tầng dùng chung sau khi gỡ trùng (đang trống)
js/modules/<slug>.js         script gốc của tool, chỉ bọc trong 1 factory
data/luan64.json             64 quẻ luận giải, tách khỏi HTML (872 KB → nạp lười)
legacy/kinh-dich-tools/      9 file tool gốc, để đối chiếu
```

Sửa đúng 2 chỗ trong script gốc, không đụng thuật toán:
1. bọc toàn bộ trong `window.KD_MOD[slug] = function(){ … }`
2. `document.addEventListener('DOMContentLoaded', fn)` → `fn()` (chỉ ở `chanlinh`)

## Hàm trùng lặp giữa các module

| Hàm | Có ở | Ghi chú |
|---|---|---|
| `pymod` | chanlinh, maphuong, nguling, tamtuyet | giống nhau — gỡ trước tiên |
| `transform` / `flyingStarMatrix` / `flying_star_matrix` | cungsinh, maphuong, tamtuyet | ma trận phi tinh cửu cung; tamtuyet dùng snake_case |
| `svgEl` | cungsinh, maphuong, dothu, nguling, tamtuyet | y hệt |
| `cellCenter` / `cellCenter3` / `cellCenter4` | cungsinh, maphuong, dothu, nguling, tamtuyet | chỉ khác hằng số ô/gốc → hợp thành 1 hàm có tham số |
| `renderGrid` / `renderGrid3` / `renderGrid4` / `renderMatrixGrid` | 5 module | cùng thân, khác kích thước & nhãn |
| `highlightCell` / `highlightCell3` / `flashCell` | cungsinh, nguling, tamtuyet, dothu | |
| `drawPathAnimated` / `drawArrowSegment` / `playSteps` | cungsinh, nguling, dothu | animation đường đi |
| `renderBars` / `renderBarsToElement` / `renderCombinedBars` / `renderMiniBars` | cungsinh, dothu, nguling, luan64 | vẽ 6 hào |
| `toggleStepBox` | cungsinh, maphuong, nguling, tamtuyet | vỏ app đã thay bằng sổ tay bên phải |
| `coordEq` / `indexOfCoord` / `pathIndexOf` / `pathIndexOfCoord` | cungsinh, dothu, nguling, tamtuyet | 4 tên cho cùng 1 việc |
| `getTenQueDichFromTrigrams` | cungsinh, nguling | |
| `calculateBienKhi` / `calculate_bien_khi` | cungsinh, tamtuyet | |
| `getNguHanh` + `NGU_HANH_SINH_MAP` / `KHAC_MAP` | cungsinh, nguling | |
| `cast` | 6 module | điểm vào, giữ riêng — vỏ app gọi qua `window.__KD_CAST` |

## Bảng dữ liệu trùng lặp

| Dữ liệu | Có ở |
|---|---|
| `TRIGRAM_SYMBOL` (☰☱☲☳☴☵☶☷) | cungsinh, dichtu, maphuong, nguling, tamtuyet |
| `THIEN_CAN` / `CAN_DUONG` / `CAN_AM` | chanlinh, cungsinh, nguling, tamtuyet |
| `DIA_CHI` / `CHI_DUONG` / `CHI_AM` | chanlinh, cungsinh, nguling, dothu |
| `LUC_THAP_HOA_GIAP` (60 can chi) | chanlinh, tamtuyet |
| `HAU_THIEN_SO` / `HAU_THIEN_NUMBER_TO_GUA_NAME` | cungsinh, maphuong, tamtuyet |
| `LAC_THU_*` (ma trận / pattern / toạ độ) | dothu, maphuong, tamtuyet, cungsinh |
| `TIEN_THIEN_NUMBERS` / `SO_TIEN_THIEN` | maphuong, nguling |
| `DICH_64_BY_PAIR` (64 tên quẻ) | cungsinh, nguling — và `HEXAGRAMS_RAW` ở dichtu, `data/luan64.json` |
| `GUA_TRANSFORM` / `KHAM_BASE` | cungsinh, maphuong, tamtuyet |
| `NAP_CHI_DATA` | maphuong (chanlinh có bảng nạp giáp riêng) |

## Thứ tự gỡ đề xuất (mỗi bước kiểm chứng bằng lịch sử lập quẻ đã lưu)

1. **Tầng thuần tuý, không rủi ro** — `pymod`, `coordEq`/`pathIndexOf`, `svgEl`
   → `js/core/util.js`.
2. **Bảng dữ liệu** — can/chi/60 hoa giáp, tiên thiên/hậu thiên số, tên 64 quẻ,
   ký hiệu bát quái → `js/core/data.js`. Ghép rồi so từng phần tử trước khi thay.
3. **Phi tinh cửu cung** — `transform` + `flyingStarMatrix`: 3 bản, đối chiếu
   đủ 9 tâm × 8 hệ quái rồi mới hợp nhất.
4. **Tầng vẽ** — `cellCenter*`, `renderGrid*`, `highlightCell*`, `renderBars*`
   → `js/core/grid.js` với tham số (số ô, cỡ ô, nhãn). Đây là phần chiếm nhiều
   dòng nhất (~40% mỗi file) và không ảnh hưởng kết quả tính.
5. **Ngũ hành sinh khắc & biến khí** — cuối cùng, vì mỗi tool có biến thể nhỏ.

Sau bước 4 mỗi module còn lại gần như chỉ phần thuật toán riêng, đủ để xem xét
bỏ hẳn `html/modules/*.frag.html` và viết lại giao diện module bằng chính hệ thống của vỏ app.

## Module độc lập: `amlich` (nhóm Đổi lịch)

`amlich` (đổi Dương ⇄ Âm lịch) nằm trong nhóm riêng `cat04` — **Đổi lịch**, không
thuộc Tạp dụng. Module cố ý **không** tham gia kế hoạch gỡ trùng ở trên: nó có bảng
`CAN` / `CHI` / `TIET_KHI` riêng và không đọc `js/core`, không gọi module khác,
cũng không được module khác gọi tới. Khi gỡ trùng, bỏ qua file này.

- `js/modules/amlich.js` trong repo là bản **đã obfuscate** (xem mục "JS trong repo
  và payload" bên dưới). Bản đọc được gồm 2 phần trong một closure: thư viện lịch
  (giống hệt bản gốc `amlich.js` / `amlich.py` có kèm kiểm thử) và giao diện
  `KD_MOD['amlich']`. Bản đọc được không đưa vào repo; muốn sửa thì sửa bản gốc,
  chạy kiểm thử, rồi obfuscate lại.
- Thiên văn chính xác cao (Sóc: Meeus ch.49; Mặt Trời: VSOP87D; ΔT Espenak–Meeus),
  đã đối chiếu từng ngày 1800–2199 với sxwnl. Công thức rút gọn của amlich.js cổ
  điển sai 146 tháng trong khoảng này (ví dụ đặt nhuận năm 2023 sau tháng Giêng),
  nên đừng thay lõi bằng công thức đó.
- Nối với vỏ app chỉ qua các điểm chuẩn: `#cast-btn` + `#input-echo` (Lịch sử),
  `window.__KD_CAST` (khôi phục lịch sử, đổi sáng/tối), `details.steps` (Sổ tay).
  `PROFILE_MAP.amlich` để trống: hồ sơ dùng chung không điền vào module này.

## JS trong repo và payload

Mọi file `js/runtime/support.js`, `js/core/*.js`, `js/modules/*.js` trong repo đều
là bản **đã obfuscate** (javascript-obfuscator 4.1.1: string array base64, tên hex,
`\x` escape, số thành biểu thức; không control-flow flattening). Chúng được sinh từ
đúng mã nguồn đang chạy trên bản deploy, nên `bundle.ps1` dựng lại đúng app đang
chạy, kể cả `auth.js` bỏ qua cổng mật khẩu thứ hai khi gatekeeper đã giải mã
(`window.__KD_ENCRYPTED_AUTH_PASSED`). Payload mã hoá trong `index.html` chứa chính
các bản obfuscate này.

## Chỗ vỏ app đã thay thế cho module

- nút sáng/tối riêng của từng tool: vẫn còn trong DOM (script gốc cần) nhưng ẩn
- `.steps` / `.step-by-step-box` / `.step-btn`: ẩn trong module, clone vào sổ tay
- tiêu đề `h1` / `.eyebrow` / `.subtitle`: giữ, dùng làm tiêu đề module
- token màu riêng của Dịch Tự (`--bg-0`, `--accent`, `--seal`…): map sang palette chung
