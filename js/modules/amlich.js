/* ============================================================================
   Âm lịch — module tra cứu & đổi Dương lịch ⇄ Âm lịch Việt Nam
   ----------------------------------------------------------------------------
   Module ĐỘC LẬP: không dùng js/core, không gọi module khác và không được module
   khác gọi tới. Mọi hàm, bảng dữ liệu nằm trong closure của file này.

   PHẦN 1 — thư viện lịch, giống hệt amlich.js / amlich.py (bản gốc kèm kiểm thử):
     · Quy tắc lịch theo Hồ Ngọc Đức: ngày chứa Sóc là mùng 1, tháng chứa Đông chí
       là tháng 11, năm 13 tháng thì tháng đầu tiên không chứa Trung khí là tháng
       nhuận; mọi thời điểm theo giờ UTC+7.
     · Sóc: Meeus, Astronomical Algorithms (1998) ch.49, đủ số hạng tuần hoàn và
       hành tinh. Mặt Trời: VSOP87D rút gọn 131 số hạng + hiệu chỉnh DE405 (sxwnl),
       chương động IAU 1980, quang sai. ΔT: Espenak & Meeus (NASA).
     · Đối chiếu từng ngày 1800–2199 với lịch chính xác cao sxwnl (寿星万年历):
       khớp 146 097/146 097 ngày; 9 600 tiết khí đúng ngày, lệch tối đa 8 giây.
   PHẦN 2 — giao diện module theo chuẩn window.KD_MOD['amlich'].
   ============================================================================ */
(function () {
'use strict';

// ═════════════════════════════════════════════════════════════════════════════
// PHẦN 1 — THƯ VIỆN LỊCH
// ═════════════════════════════════════════════════════════════════════════════
const TZ_VN = 7;

// ─── Bảng tên ────────────────────────────────────────────────────────────────
const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
const CON_GIAP = ['Chuột', 'Trâu', 'Hổ', 'Mèo', 'Rồng', 'Rắn', 'Ngựa', 'Dê', 'Khỉ', 'Gà', 'Chó', 'Lợn'];
const THU = ['Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy', 'Chủ nhật'];
const TEN_THANG = ['Giêng', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy', 'Tám', 'Chín', 'Mười', 'Mười một', 'Chạp'];
/** 24 tiết khí; chỉ số k ứng với kinh độ Mặt Trời 15°·k (0 = Xuân phân). */
const TIET_KHI = ['Xuân phân', 'Thanh minh', 'Cốc vũ', 'Lập hạ', 'Tiểu mãn', 'Mang chủng',
  'Hạ chí', 'Tiểu thử', 'Đại thử', 'Lập thu', 'Xử thử', 'Bạch lộ',
  'Thu phân', 'Hàn lộ', 'Sương giáng', 'Lập đông', 'Tiểu tuyết', 'Đại tuyết',
  'Đông chí', 'Tiểu hàn', 'Đại hàn', 'Lập xuân', 'Vũ thủy', 'Kinh trập'];
/** 12 thần trực theo vòng Thanh Long: [tên, Hoàng đạo?]. */
const THAN_HOANG_DAO = [['Thanh Long', true], ['Minh Đường', true], ['Thiên Hình', false],
  ['Chu Tước', false], ['Kim Quỹ', true], ['Kim Đường', true], ['Bạch Hổ', false], ['Ngọc Đường', true],
  ['Thiên Lao', false], ['Huyền Vũ', false], ['Tư Mệnh', true], ['Câu Trận', false]];
/** Ngày lễ dương lịch: 'ngày/tháng' → [tên, năm bắt đầu áp dụng | null]. */
const LE_DUONG = {
  '1/1': ['Tết Dương lịch', null],
  '3/2': ['Ngày thành lập Đảng Cộng sản Việt Nam', 1930],
  '14/2': ['Lễ Tình nhân', null],
  '8/3': ['Ngày Quốc tế Phụ nữ', 1910],
  '30/4': ['Ngày Giải phóng miền Nam, thống nhất đất nước', 1975],
  '1/5': ['Ngày Quốc tế Lao động', 1886],
  '7/5': ['Ngày Chiến thắng Điện Biên Phủ', 1954],
  '19/5': ['Ngày sinh Chủ tịch Hồ Chí Minh', 1890],
  '1/6': ['Ngày Quốc tế Thiếu nhi', 1950],
  '27/7': ['Ngày Thương binh Liệt sĩ', 1947],
  '19/8': ['Ngày Cách mạng Tháng Tám', 1945],
  '2/9': ['Quốc khánh', 1945],
  '10/10': ['Ngày Giải phóng Thủ đô', 1954],
  '20/10': ['Ngày Phụ nữ Việt Nam', 1930],
  '20/11': ['Ngày Nhà giáo Việt Nam', 1982],
  '22/12': ['Ngày thành lập Quân đội Nhân dân Việt Nam', 1944],
  '24/12': ['Đêm Giáng sinh', null],
};
/** Ngày lễ âm lịch (chỉ áp dụng cho tháng không nhuận): 'ngày/tháng' → tên. */
const LE_AM = {
  '1/1': 'Tết Nguyên Đán', '2/1': 'Tết Nguyên Đán', '3/1': 'Tết Nguyên Đán',
  '15/1': 'Tết Nguyên Tiêu (Rằm tháng Giêng)',
  '3/3': 'Tết Hàn thực', '10/3': 'Giỗ Tổ Hùng Vương',
  '15/4': 'Lễ Phật Đản', '5/5': 'Tết Đoan ngọ',
  '15/7': 'Lễ Vu Lan', '15/8': 'Tết Trung thu',
  '9/9': 'Tết Trùng cửu', '10/10': 'Tết Trùng thập',
  '23/12': 'Ông Công Ông Táo',
};

// ─── Lịch Julius ─────────────────────────────────────────────────────────────
const PI = Math.PI;
const DR = PI / 180;
const AS = PI / 648000;          // giây cung → radian
const J2000 = 2451545.0;
const SYNODIC = 29.530588861;   // tháng giao hội trung bình
const NM0 = 2451550.09766;       // JDE của Sóc k = 0 (6/1/2000)
const floor = Math.floor;
const idiv = (a, b) => floor(a / b);
const mod = (a, n) => ((a % n) + n) % n;

/** Số ngày Julius (JDN) của ngày dương (lịch Julius trước 15/10/1582). */
function jdFromDate(year, month, day) {
  const a = idiv(14 - month, 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  let jd = day + idiv(153 * m + 2, 5) + 365 * y + idiv(y, 4) - idiv(y, 100) + idiv(y, 400) - 32045;
  if (jd < 2299161) jd = day + idiv(153 * m + 2, 5) + 365 * y + idiv(y, 4) - 32083;
  return jd;
}

/** Đổi JDN về [năm, tháng, ngày]. */
function jdToDate(jd) {
  let b, c;
  if (jd > 2299160) {
    const a = jd + 32044;
    b = idiv(4 * a + 3, 146097);
    c = a - idiv(b * 146097, 4);
  } else {
    b = 0;
    c = jd + 32082;
  }
  const d = idiv(4 * c + 3, 1461);
  const e = c - idiv(1461 * d, 4);
  const m = idiv(5 * e + 2, 153);
  const day = e - idiv(153 * m + 2, 5) + 1;
  const month = m + 3 - 12 * idiv(m, 10);
  const year = b * 100 + d - 4800 + idiv(m, 10);
  return [year, month, day];
}

// ─── Thiên văn ───────────────────────────────────────────────────────────────
/** ΔT = TT − UT (giây), đa thức Espenak & Meeus (NASA, 2006). */
function deltaT(jd) {
  const y = 2000 + (jd - J2000 - 14) / 365.24217;
  let u;
  if (y < -500) { u = (y - 1820) / 100; return -20 + 32 * u * u; }
  if (y < 500) {
    u = y / 100;
    return 10583.6 - 1014.41 * u + 33.78311 * u ** 2 - 5.952053 * u ** 3 - 0.1798452 * u ** 4
      + 0.022174192 * u ** 5 + 0.0090316521 * u ** 6;
  }
  if (y < 1600) {
    u = (y - 1000) / 100;
    return 1574.2 - 556.01 * u + 71.23472 * u ** 2 + 0.319781 * u ** 3 - 0.8503463 * u ** 4
      - 0.005050998 * u ** 5 + 0.0083572073 * u ** 6;
  }
  if (y < 1700) { u = y - 1600; return 120 - 0.9808 * u - 0.01532 * u ** 2 + u ** 3 / 7129.0; }
  if (y < 1800) {
    u = y - 1700;
    return 8.83 + 0.1603 * u - 0.0059285 * u ** 2 + 0.00013336 * u ** 3 - u ** 4 / 1174000;
  }
  if (y < 1860) {
    u = y - 1800;
    return 13.72 - 0.332447 * u + 0.0068612 * u ** 2 + 0.0041116 * u ** 3 - 0.00037436 * u ** 4
      + 0.0000121272 * u ** 5 - 0.0000001699 * u ** 6 + 0.000000000875 * u ** 7;
  }
  if (y < 1900) {
    u = y - 1860;
    return 7.62 + 0.5737 * u - 0.251754 * u ** 2 + 0.01680668 * u ** 3 - 0.0004473624 * u ** 4
      + u ** 5 / 233174;
  }
  if (y < 1920) {
    u = y - 1900;
    return -2.79 + 1.494119 * u - 0.0598939 * u ** 2 + 0.0061966 * u ** 3 - 0.000197 * u ** 4;
  }
  if (y < 1941) { u = y - 1920; return 21.20 + 0.84493 * u - 0.076100 * u ** 2 + 0.0020936 * u ** 3; }
  if (y < 1961) { u = y - 1950; return 29.07 + 0.407 * u - u ** 2 / 233 + u ** 3 / 2547; }
  if (y < 1986) { u = y - 1975; return 45.45 + 1.067 * u - u ** 2 / 260 - u ** 3 / 718; }
  if (y < 2005) {
    u = y - 2000;
    return 63.86 + 0.3345 * u - 0.060374 * u ** 2 + 0.0017275 * u ** 3 + 0.000651814 * u ** 4
      + 0.00002373599 * u ** 5;
  }
  if (y < 2050) { u = y - 2000; return 62.92 + 0.32217 * u + 0.005589 * u * u; }
  u = (y - 1820) / 100;
  if (y < 2150) return -20 + 32 * u * u - 0.5628 * (2150 - y);
  return -20 + 32 * u * u;
}

// Sóc — Meeus ch.49: [hệ số, lũy thừa E, bội M, bội M', bội F, bội Ω]
const NM_TERMS = [
  [-0.40720, 0, 0, 1, 0, 0], [0.17241, 1, 1, 0, 0, 0], [0.01608, 0, 0, 2, 0, 0],
  [0.01039, 0, 0, 0, 2, 0], [0.00739, 1, -1, 1, 0, 0], [-0.00514, 1, 1, 1, 0, 0],
  [0.00208, 2, 2, 0, 0, 0], [-0.00111, 0, 0, 1, -2, 0], [-0.00057, 0, 0, 1, 2, 0],
  [0.00056, 1, 1, 2, 0, 0], [-0.00042, 0, 0, 3, 0, 0], [0.00042, 1, 1, 0, 2, 0],
  [0.00038, 1, 1, 0, -2, 0], [-0.00024, 1, -1, 2, 0, 0], [-0.00017, 0, 0, 0, 0, 1],
  [-0.00007, 0, 2, 1, 0, 0], [0.00004, 0, 0, 2, -2, 0], [0.00004, 0, 3, 0, 0, 0],
  [0.00003, 0, 1, 1, -2, 0], [0.00003, 0, 0, 2, 2, 0], [-0.00003, 0, 1, 1, 2, 0],
  [0.00003, 0, -1, 1, 2, 0], [-0.00002, 0, -1, 1, -2, 0], [-0.00002, 0, 1, 3, 0, 0],
  [0.00002, 0, 0, 4, 0, 0],
];
// Số hạng hành tinh A2..A14: [A0, hệ số của k, biên độ]
const NM_PLANETARY = [
  [251.88, 0.016321, 0.000165], [251.83, 26.651886, 0.000164], [349.42, 36.412478, 0.000126],
  [84.66, 18.206239, 0.000110], [141.74, 53.303771, 0.000062], [207.14, 2.453732, 0.000060],
  [154.84, 7.306860, 0.000056], [34.52, 27.261239, 0.000047], [207.19, 0.121824, 0.000042],
  [291.34, 1.844379, 0.000040], [161.72, 24.198154, 0.000037], [239.56, 25.513099, 0.000035],
  [331.55, 3.592518, 0.000023],
];
// Hiệu chỉnh (giây) cho Sóc sát nửa đêm UTC+7 — xem amlich.py. Duy nhất 8/7/1967.
const NM_FIX = { '-402': 6.0 };

/** Thời điểm (JD, UT) của điểm Sóc thứ k (k = 0: Sóc ngày 6/1/2000). */
function newMoon(k) {
  const T = k / 1236.85, T2 = T * T, T3 = T2 * T, T4 = T3 * T;
  let jde = 2451550.09766 + SYNODIC * k + 0.00015437 * T2 - 0.000000150 * T3 + 0.00000000073 * T4;
  const E = 1 - 0.002516 * T - 0.0000074 * T2;
  const M = (2.5534 + 29.10535670 * k - 0.0000014 * T2 - 0.00000011 * T3) * DR;
  const Mp = (201.5643 + 385.81693528 * k + 0.0107582 * T2 + 0.00001238 * T3 - 0.000000058 * T4) * DR;
  const F = (160.7108 + 390.67050284 * k - 0.0016118 * T2 - 0.00000227 * T3 + 0.000000011 * T4) * DR;
  const Om = (124.7746 - 1.56375588 * k + 0.0020672 * T2 + 0.00000215 * T3) * DR;
  let c = 0.000325 * Math.sin((299.77 + 0.107408 * k - 0.009173 * T2) * DR);
  for (const [coef, ep, a, b, f, o] of NM_TERMS) c += coef * E ** ep * Math.sin(a * M + b * Mp + f * F + o * Om);
  for (const [a0, a1, coef] of NM_PLANETARY) c += coef * Math.sin((a0 + a1 * k) * DR);
  jde += c;
  return jde - deltaT(jde) / 86400 + (NM_FIX[k] || 0) / 86400;
}

// Kinh độ nhật tâm Trái Đất — VSOP87D rút gọn (|A| ≥ 1e-7 rad); τ: nghìn năm Julius từ J2000.
const VSOP87D_L = [
  [ // L0
    [1.7534704567, 0, 0], [0.0334165646, 4.669256804, 6283.075849991], [0.0003489428, 4.6261024, 12566.1517],
    [3.49706e-05, 2.744118, 5753.384885], [3.41757e-05, 2.828866, 3.523118], [3.1359e-05, 3.62767, 77713.771468],
    [2.67622e-05, 4.418084, 7860.419392], [2.34269e-05, 6.135162, 3930.209696], [1.32429e-05, 0.742464, 11506.76977],
    [1.27317e-05, 2.037097, 529.690965], [1.19917e-05, 1.109629, 1577.343542], [9.9025e-06, 5.23268, 5884.92685],
    [9.0186e-06, 2.04505, 26.29832], [8.5722e-06, 3.50849, 398.149], [7.7979e-06, 1.17883, 5223.69392],
    [7.5314e-06, 2.53339, 5507.55324], [5.0526e-06, 4.58293, 18849.22755], [4.9238e-06, 4.20507, 775.52261],
    [3.5666e-06, 2.91954, 0.06731], [3.1709e-06, 5.84902, 11790.62909], [2.8413e-06, 1.89869, 796.29801],
    [2.7104e-06, 0.31489, 10977.0788], [2.4281e-06, 0.34481, 5486.77784], [2.0616e-06, 4.80647, 2544.31442],
    [2.0539e-06, 1.86948, 5573.1428], [2.0226e-06, 2.45768, 6069.77675], [1.5552e-06, 0.83306, 213.2991],
    [1.3221e-06, 3.41118, 2942.46342], [1.2618e-06, 1.08303, 20.7754], [1.1513e-06, 0.64545, 0.98032],
    [1.0285e-06, 0.636, 4694.00295], [1.019e-06, 0.97569, 15720.83878], [1.0172e-06, 4.2668, 7.11355],
    [9.921e-07, 6.2099, 2146.1654], [9.761e-07, 0.681, 155.4204], [8.58e-07, 5.9832, 161000.6857],
    [8.513e-07, 1.2987, 6275.9623], [8.471e-07, 3.6708, 71430.6956], [7.964e-07, 1.8079, 17260.1547],
    [7.876e-07, 3.037, 12036.4607], [7.465e-07, 1.7551, 5088.6288], [7.387e-07, 3.5032, 3154.6871],
    [7.355e-07, 4.6793, 801.8209], [6.963e-07, 0.833, 9437.7629], [6.245e-07, 3.9776, 8827.3903],
    [6.115e-07, 1.8184, 7084.8968], [5.696e-07, 2.7843, 6286.599], [5.612e-07, 4.3869, 14143.4952],
    [5.558e-07, 3.4701, 6279.5527], [5.199e-07, 0.1891, 12139.5535], [5.161e-07, 1.3328, 1748.0164],
    [5.115e-07, 0.2831, 5856.4777], [4.9e-07, 0.4874, 1194.447], [4.104e-07, 5.3682, 8429.2413],
    [4.094e-07, 2.3985, 19651.0485], [3.92e-07, 6.1683, 10447.3878], [3.677e-07, 6.0413, 10213.2855],
    [3.66e-07, 2.5696, 1059.3819], [3.595e-07, 1.7088, 2352.8662], [3.557e-07, 1.776, 6812.7668],
    [3.329e-07, 0.5931, 17789.8456], [3.041e-07, 0.4429, 83996.8473], [3.005e-07, 2.7398, 1349.8674],
    [2.535e-07, 3.1647, 4690.4798], [2.474e-07, 0.2148, 3.5904], [2.366e-07, 0.4847, 8031.0923],
    [2.357e-07, 2.0653, 3340.6124], [2.282e-07, 5.222, 4705.7323], [2.189e-07, 5.5559, 553.5694],
    [2.142e-07, 1.4256, 16730.4637], [2.109e-07, 4.1483, 951.7184], [2.03e-07, 0.3713, 283.8593],
    [1.992e-07, 5.2221, 12168.0027], [1.986e-07, 5.7747, 6309.3742], [1.912e-07, 3.8222, 23581.2582],
    [1.889e-07, 5.3863, 149854.4001], [1.79e-07, 2.2149, 13367.9726], [1.748e-07, 4.5605, 135.0651],
    [1.622e-07, 5.9884, 11769.8537], [1.508e-07, 4.1957, 6256.7775], [1.442e-07, 4.1932, 242.7286],
    [1.435e-07, 3.7236, 38.0277], [1.397e-07, 4.4014, 6681.2249], [1.362e-07, 1.8893, 7632.9433],
    [1.25e-07, 1.1305, 5.5229], [1.205e-07, 2.6223, 955.5997], [1.2e-07, 1.0035, 632.7837],
    [1.129e-07, 0.1774, 4164.312], [1.083e-07, 0.3273, 103.0928], [1.052e-07, 0.9387, 11926.2544],
    [1.05e-07, 5.3591, 1592.596], [1.033e-07, 6.1998, 6438.4962], [1.001e-07, 6.0291, 5746.2713],
  ],
  [ // L1
    [6283.3196674749, 0, 0], [0.0020605886, 2.67823456, 6283.07584999], [4.30343e-05, 2.635127, 12566.1517],
    [4.2526e-06, 1.59047, 3.52312], [1.1926e-06, 5.79557, 26.29832], [1.0898e-06, 2.96618, 1577.34354],
    [9.348e-07, 2.5921, 18849.2275], [7.212e-07, 1.1385, 529.691], [6.777e-07, 1.8747, 398.149],
    [6.733e-07, 4.4092, 5507.5532], [5.903e-07, 2.888, 5223.6939], [5.598e-07, 2.1747, 155.4204],
    [4.541e-07, 0.398, 796.298], [3.637e-07, 0.4662, 775.5226], [2.896e-07, 2.6471, 7.1135],
    [2.084e-07, 5.3414, 0.9803], [1.91e-07, 1.8463, 5486.7778], [1.851e-07, 4.9686, 213.2991],
    [1.729e-07, 2.9912, 6275.9623], [1.623e-07, 0.0322, 2544.3144], [1.583e-07, 1.4305, 2146.1654],
    [1.462e-07, 1.2053, 10977.0788], [1.246e-07, 2.8343, 1748.0164], [1.188e-07, 3.258, 5088.6288],
    [1.181e-07, 5.2738, 1194.447], [1.151e-07, 2.075, 4694.003], [1.064e-07, 0.7661, 553.5694],
  ],
  [ // L2
    [0.0005291887, 0, 0], [8.71984e-05, 1.072097, 6283.07585], [3.0913e-06, 0.86729, 12566.1517],
    [2.734e-07, 0.053, 3.5231], [1.633e-07, 5.1883, 26.2983], [1.575e-07, 3.6846, 155.4204],
  ],
  [ // L3
    [2.8923e-06, 5.84384, 6283.07585], [3.496e-07, 0, 0], [1.682e-07, 5.4877, 12566.1517],
  ],
  [ // L4
    [1.1408e-06, 3.14159, 0],
  ],
  [ // L5
    [8.8e-09, 3.14, 0],
  ],
];
// Chương động theo kinh độ, IAU 1980 (18 số hạng; đơn vị 0.0001″): [D, M, M', F, Ω, hệ số, hệ số·T]
const NUTATION = [
  [0, 0, 0, 0, 1, -171996, -174.2], [-2, 0, 0, 2, 2, -13187, -1.6], [0, 0, 0, 2, 2, -2274, -0.2],
  [0, 0, 0, 0, 2, 2062, 0.2], [0, 1, 0, 0, 0, 1426, -3.4], [0, 0, 1, 0, 0, 712, 0.1],
  [-2, 1, 0, 2, 2, -517, 1.2], [0, 0, 0, 2, 1, -386, -0.4], [0, 0, 1, 2, 2, -301, 0],
  [-2, -1, 0, 2, 2, 217, -0.5], [-2, 0, 1, 0, 0, -158, 0], [-2, 0, 0, 2, 1, 129, 0.1],
  [0, 0, -1, 2, 2, 123, 0], [2, 0, 0, 0, 0, 63, 0], [0, 0, 1, 0, 1, 63, 0.1],
  [2, 0, -1, 2, 2, -59, 0], [0, 0, -1, 0, 1, -58, -0.1], [0, 0, 1, 2, 1, -51, 0],
];

/** Kinh độ biểu kiến của Mặt Trời (radian, 0..2π) tại thời điểm JD (UT). */
function sunLongitude(jdUt) {
  const jde = jdUt + deltaT(jdUt) / 86400;
  const tau = (jde - J2000) / 365250;
  let L = 0, tn = 1;
  for (const series of VSOP87D_L) {
    let s = 0;
    for (const [a, b, c] of series) s += a * Math.cos(b + c * tau);
    L += tn * s;
    tn *= tau;
  }
  L += (-0.0728 - 2.7702 * tau - 1.1019 * tau ** 2 - 0.0996 * tau ** 3) * AS;   // VSOP87 → DE405
  const T = tau * 10;
  const D = (297.85036 + 445267.111480 * T - 0.0019142 * T * T) * DR;
  const M = (357.52772 + 35999.050340 * T - 0.0001603 * T * T) * DR;
  const Mp = (134.96298 + 477198.867398 * T + 0.0086972 * T * T) * DR;
  const F = (93.27191 + 483202.017538 * T - 0.0036825 * T * T) * DR;
  const Om = (125.04452 - 1934.136261 * T + 0.0020708 * T * T) * DR;
  let dpsi = 0;
  for (const [d, m, mp, f, o, a, b] of NUTATION) dpsi += (a + b * T) * Math.sin(d * D + m * M + mp * Mp + f * F + o * Om);
  dpsi *= 1e-4;
  const R = 1.00013989 + 0.01670700 * Math.cos(3.0984635 + 6283.07585 * tau)
    + 0.00013956 * Math.cos(3.05525 + 12566.1517 * tau);
  const lon = L + PI + (dpsi - 20.4898 / R) * AS;
  return lon - 2 * PI * floor(lon / (2 * PI));
}

// ─── Lõi âm lịch ─────────────────────────────────────────────────────────────
const cacheNM = new Map(), cacheM11 = new Map(), cacheLeap = new Map();

function newMoonDay(k, tz) {
  const key = k + '|' + tz;
  let v = cacheNM.get(key);
  if (v === undefined) {
    v = floor(newMoon(k) + 0.5 + tz / 24);
    cacheNM.set(key, v);
  }
  return v;
}

function kOfMonthStart(jdn, tz) {
  const k = Math.round((jdn - NM0) / SYNODIC);
  for (const kk of [k, k - 1, k + 1]) if (newMoonDay(kk, tz) === jdn) return kk;
  throw new RangeError(`JDN ${jdn} không phải ngày Sóc`);
}

const majorTerm = (jdn, tz) => floor(sunLongitude(jdn - 0.5 - tz / 24) / PI * 6);
const term24 = (tUt) => floor(sunLongitude(tUt) / PI * 12);
const dayStartUt = (jd, tz) => jd - 0.5 - tz / 24;

function lunarMonth11(year, tz) {
  const key = year + '|' + tz;
  let nm = cacheM11.get(key);
  if (nm === undefined) {
    const k = floor((jdFromDate(year, 12, 31) - NM0) / SYNODIC);
    nm = newMoonDay(k, tz);
    if (majorTerm(nm, tz) >= 9) nm = newMoonDay(k - 1, tz);   // Sóc sau Đông chí → lùi một tháng
    cacheM11.set(key, nm);
  }
  return nm;
}

function leapMonthOffset(a11, tz) {
  const key = a11 + '|' + tz;
  let v = cacheLeap.get(key);
  if (v === undefined) {
    const k = kOfMonthStart(a11, tz);
    let i = 1, last;
    let arc = majorTerm(newMoonDay(k + i, tz), tz);
    do {
      last = arc;
      i++;
      arc = majorTerm(newMoonDay(k + i, tz), tz);
    } while (arc !== last && i < 14);
    v = i - 1;
    cacheLeap.set(key, v);
  }
  return v;
}

/** [năm, tháng, ngày, nhuận, JDN mùng 1] cho một JDN. */
function solarToLunarJd(dayNumber, tz) {
  let k = floor((dayNumber - NM0) / SYNODIC) + 1;
  while (newMoonDay(k, tz) > dayNumber) k--;
  const monthStart = newMoonDay(k, tz);
  const yy = jdToDate(dayNumber)[0];
  let a11 = lunarMonth11(yy, tz), b11 = a11, lunarYear;
  if (a11 >= monthStart) {
    lunarYear = yy;
    a11 = lunarMonth11(yy - 1, tz);
  } else {
    lunarYear = yy + 1;
    b11 = lunarMonth11(yy + 1, tz);
  }
  const lunarDay = dayNumber - monthStart + 1;
  const diff = floor((monthStart - a11) / 29);
  let leap = false, lunarMonth = diff + 11;
  if (b11 - a11 > 365) {
    const leapDiff = leapMonthOffset(a11, tz);
    if (diff >= leapDiff) {
      lunarMonth = diff + 10;
      if (diff === leapDiff) leap = true;
    }
  }
  if (lunarMonth > 12) lunarMonth -= 12;
  if (lunarMonth >= 11 && diff < 4) lunarYear -= 1;
  return [lunarYear, lunarMonth, lunarDay, leap, monthStart];
}

function monthStartJd(lunarYear, month, leap, tz) {
  if (!(month >= 1 && month <= 12)) throw new RangeError(`Tháng âm lịch phải từ 1 đến 12 (nhận ${month})`);
  const [a11, b11] = month < 11
    ? [lunarMonth11(lunarYear - 1, tz), lunarMonth11(lunarYear, tz)]
    : [lunarMonth11(lunarYear, tz), lunarMonth11(lunarYear + 1, tz)];
  const k = kOfMonthStart(a11, tz);
  let off = month - 11;
  if (off < 0) off += 12;
  if (b11 - a11 > 365) {
    const leapOff = leapMonthOffset(a11, tz);
    let leapM = leapOff - 2;
    if (leapM < 0) leapM += 12;
    if (leap && month !== leapM) throw new RangeError(`Năm âm ${lunarYear} không nhuận tháng ${month} (nhuận tháng ${leapM})`);
    if (leap || off >= leapOff) off += 1;
  } else if (leap) {
    throw new RangeError(`Năm âm ${lunarYear} không có tháng nhuận`);
  }
  return newMoonDay(k + off, tz);
}

const monthLengthFromStart = (startJd, tz) => newMoonDay(kOfMonthStart(startJd, tz) + 1, tz) - startJd;

/** Đọc ngày từ đối số: (y, m, d, ...rest) | (Date, ...rest) | (jd, ...rest). */
function readDay(args) {
  const [a] = args;
  if (a instanceof Date) return [jdFromDate(a.getFullYear(), a.getMonth() + 1, a.getDate()), args.slice(1)];
  if (typeof a === 'number' && a > 100000) return [a, args.slice(1)];
  if (args.length >= 3) return [jdFromDate(+args[0], +args[1], +args[2]), args.slice(3)];
  throw new TypeError('Cần (năm, tháng, ngày), một Date hoặc số ngày Julius');
}
const tzOf = (rest) => (rest[0] === undefined ? TZ_VN : rest[0]);
const ymd = (jd) => { const [year, month, day] = jdToDate(jd); return { year, month, day, jd }; };

// ─── API chuyển đổi ─────────────────────────────────────────────────────────
/** Dương → âm: { year, month, day, leap }. */
function solarToLunar(...args) {
  const [jd, rest] = readDay(args);
  const [year, month, day, leap] = solarToLunarJd(jd, tzOf(rest));
  return { year, month, day, leap };
}

/** Âm → dương: { year, month, day, jd }. RangeError nếu ngày âm không tồn tại. */
function lunarToSolar(year, month, day, leap = false, tz = TZ_VN) {
  const start = monthStartJd(year, month, leap, tz);
  const length = monthLengthFromStart(start, tz);
  if (!(day >= 1 && day <= length)) {
    throw new RangeError(`Tháng ${month}${leap ? ' nhuận' : ''}/${year} âm lịch chỉ có ${length} ngày`);
  }
  return ymd(start + day - 1);
}

/** Tháng nhuận của năm âm (0 nếu không nhuận). */
function leapMonth(lunarYear, tz = TZ_VN) {
  for (const aYear of [lunarYear - 1, lunarYear]) {
    const a11 = lunarMonth11(aYear, tz), b11 = lunarMonth11(aYear + 1, tz);
    if (b11 - a11 > 365) {
      let leapM = leapMonthOffset(a11, tz) - 2;
      if (leapM < 0) leapM += 12;
      if (aYear === lunarYear - 1 && leapM >= 1 && leapM <= 10) return leapM;
      if (aYear === lunarYear && leapM >= 11) return leapM;
    }
  }
  return 0;
}

function lunarMonthLength(year, month, leap = false, tz = TZ_VN) {
  return monthLengthFromStart(monthStartJd(year, month, leap, tz), tz);
}

/** Các tháng (kể cả nhuận) của năm âm, từ tháng Giêng đến tháng Chạp. */
function lunarYearMonths(lunarYear, tz = TZ_VN) {
  const lm = leapMonth(lunarYear, tz);
  const out = [];
  for (let m = 1; m <= 12; m++) {
    for (const lp of (m === lm ? [false, true] : [false])) {
      const start = monthStartJd(lunarYear, m, lp, tz);
      out.push({
        year: lunarYear, month: m, leap: lp, start: ymd(start),
        length: monthLengthFromStart(start, tz), canChi: canChiMonth(lunarYear, m),
        name: (lp ? 'Nhuận ' : '') + 'tháng ' + TEN_THANG[m - 1],
      });
    }
  }
  return out;
}

// ─── Can chi ─────────────────────────────────────────────────────────────────
function canChiDay(...args) {
  const [jd] = readDay(args);
  return `${CAN[mod(jd + 9, 10)]} ${CHI[mod(jd + 1, 12)]}`;
}
/** Can chi tháng âm (tháng nhuận dùng can chi của tháng chính). */
const canChiMonth = (lunarYear, lunarMonth) =>
  `${CAN[mod(lunarYear * 12 + lunarMonth + 3, 10)]} ${CHI[mod(lunarMonth + 1, 12)]}`;
const canChiYear = (lunarYear) => `${CAN[mod(lunarYear + 6, 10)]} ${CHI[mod(lunarYear + 8, 12)]}`;
/** Can chi của giờ thứ chiIndex (0 = Tý) trong ngày JDN jd. */
const canChiHour = (jd, chiIndex) => `${CAN[mod((jd - 1) * 2 + chiIndex, 10)]} ${CHI[chiIndex]}`;
/** Can chi giờ Tý đầu ngày. */
function gioDauNgay(...args) { return canChiHour(readDay(args)[0], 0); }

// ─── Tiết khí ────────────────────────────────────────────────────────────────
/** { name, starts }: tiết khí đang hiệu lực, starts = bắt đầu trong ngày này. */
function tietKhi(...args) {
  const [jd, rest] = readDay(args);
  const tz = tzOf(rest);
  const k0 = term24(dayStartUt(jd, tz)), k1 = term24(dayStartUt(jd + 1, tz));
  return k1 !== k0 ? { name: TIET_KHI[k1], starts: true } : { name: TIET_KHI[k0], starts: false };
}

function localTime(tUt, tz) {
  const t = tUt + 0.5 + tz / 24;
  let jdn = floor(t);
  let secs = Math.round((t - jdn) * 86400);
  if (secs >= 86400) { jdn += 1; secs -= 86400; }
  const [year, month, day] = jdToDate(jdn);
  return { year, month, day, hour: floor(secs / 3600), minute: floor(secs / 60) % 60, second: secs % 60 };
}

/** 24 tiết khí của năm dương (thời điểm gần đúng ±10 giây, giờ địa phương). */
function solarTerms(year, tz = TZ_VN) {
  const out = [];
  let jd = jdFromDate(year, 1, 1);
  const end = jdFromDate(year + 1, 1, 1);
  let prev = term24(dayStartUt(jd, tz));
  for (; jd < end; jd++) {
    const next = term24(dayStartUt(jd + 1, tz));
    if (next !== prev) {
      let lo = dayStartUt(jd, tz), hi = dayStartUt(jd + 1, tz);
      for (let i = 0; i < 40; i++) {
        const mid = (lo + hi) / 2;
        if (term24(mid) === prev) lo = mid; else hi = mid;
      }
      out.push({ index: next, name: TIET_KHI[next], longitude: next * 15, major: next % 2 === 0,
        date: ymd(jd), time: localTime(hi, tz) });
      prev = next;
    }
  }
  return out;
}

// ─── Hoàng đạo ───────────────────────────────────────────────────────────────
/** Giờ Hoàng đạo của ngày (allHours = true: cả 12 giờ, kèm thần trực). */
function gioHoangDao(...args) {
  const [jd, rest] = readDay(args);
  const allHours = rest[0] === true;
  const start = mod(8 + 2 * (mod(jd + 1, 12) % 6), 12);   // giờ Thanh Long
  const out = [];
  for (let h = 0; h < 12; h++) {
    const [than, good] = THAN_HOANG_DAO[mod(h - start, 12)];
    if (good || allHours) {
      out.push({ chi: CHI[h], canChi: canChiHour(jd, h), start: (2 * h + 23) % 24, end: (2 * h + 1) % 24, than, hoangDao: good });
    }
  }
  return out;
}

/** { than, hoangDao }: thần trực ngày theo tháng âm và chi của ngày. */
function ngayHoangDao(lunarMonth, ...args) {
  const [jd] = readDay(args);
  const start = 2 * ((lunarMonth - 1) % 6);   // ngày Thanh Long của tháng
  const [than, hoangDao] = THAN_HOANG_DAO[mod(mod(jd + 1, 12) - start, 12)];
  return { than, hoangDao };
}

// ─── Ngày lễ ─────────────────────────────────────────────────────────────────
function holidays(...args) {
  const [jd, rest] = readDay(args);
  const tz = tzOf(rest);
  const [y, m, d] = jdToDate(jd);
  const out = [];
  const le = LE_DUONG[`${d}/${m}`];
  if (le && (le[1] === null || y >= le[1])) out.push(le[0]);
  const [, lm, ld, leap] = solarToLunarJd(jd, tz);
  if (!leap && LE_AM[`${ld}/${lm}`]) out.push(LE_AM[`${ld}/${lm}`]);
  const [, nm, nd, nleap] = solarToLunarJd(jd + 1, tz);
  if (nm === 1 && nd === 1 && !nleap) out.push('Giao thừa');
  return out;
}

// ─── Văn bản ─────────────────────────────────────────────────────────────────
/** 'Mùng 5', 'Rằm', '23'… */
const lunarDayName = (day) => (day <= 10 ? `Mùng ${day}` : day === 15 ? 'Rằm' : String(day));
/** 'tháng Tám', 'Nhuận tháng Sáu' */
const lunarMonthName = (month, leap = false) => (leap ? 'Nhuận ' : '') + 'tháng ' + TEN_THANG[month - 1];
/** 'Ngày 28 tháng Tám năm Bính Ngọ' */
const lunarLongText = ({ year, month, day, leap }) =>
  `Ngày ${day} tháng ${leap ? 'nhuận ' : ''}${TEN_THANG[month - 1]} năm ${canChiYear(year)}`;

// ─── Tổng hợp ────────────────────────────────────────────────────────────────
/** Toàn bộ thông tin của một ngày dương (mặc định: hôm nay theo giờ máy). */
function getDayInfo(...args) {
  if (args.length === 0) args = [new Date()];
  const [jd, rest] = readDay(args);
  const tz = tzOf(rest);
  const [ly, lm, ld, leap, mstart] = solarToLunarJd(jd, tz);
  const tk = tietKhi(jd, tz);
  const nhd = ngayHoangDao(lm, jd);
  const lunar = { year: ly, month: lm, day: ld, leap };
  return {
    solar: ymd(jd),
    lunar,
    lunarText: lunarLongText(lunar),
    jd,
    weekday: THU[mod(jd, 7)],
    weekdayIndex: mod(jd + 1, 7),   // 0 = Chủ nhật … 6 = Thứ bảy (như Date.getDay)
    canChiDay: canChiDay(jd),
    canChiMonth: canChiMonth(ly, lm),
    canChiYear: canChiYear(ly),
    conGiap: CON_GIAP[mod(ly + 8, 12)],
    gioDauNgay: gioDauNgay(jd),
    tietKhi: tk.name,
    tietKhiBatDau: tk.starts,
    monthLength: monthLengthFromStart(mstart, tz),
    thanNgay: nhd.than,
    ngayHoangDao: nhd.hoangDao,
    gioHoangDao: gioHoangDao(jd),
    holidays: holidays(jd, tz),
  };
}

/** getDayInfo cho mọi ngày của tháng dương. */
function getMonthCalendar(year, month, tz = TZ_VN) {
  const start = jdFromDate(year, month, 1);
  const end = jdFromDate(year + (month === 12 ? 1 : 0), (month % 12) + 1, 1);
  const out = [];
  for (let jd = start; jd < end; jd++) out.push(getDayInfo(jd, tz));
  return out;
}

// ═════════════════════════════════════════════════════════════════════════════
// PHẦN 2 — GIAO DIỆN MODULE (vỏ app gọi lại mỗi lần mở module)
// ═════════════════════════════════════════════════════════════════════════════
window.KD_MOD = window.KD_MOD || {};
window.KD_MOD['amlich'] = function () {
  const host = document.querySelector('.kd-mod[data-mod="amlich"]');
  if (!host) return;
  const $ = (id) => host.querySelector('#' + id);

  const YMIN = 1800, YMAX = 2199;
  const MIN_JD = jdFromDate(YMIN, 1, 1), MAX_JD = jdFromDate(YMAX, 12, 31);
  const WD_SHORT = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  const pad = (n) => String(n).padStart(2, '0');
  const fmt = (o) => `${pad(o.day)}/${pad(o.month)}/${o.year}`;
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const clampJd = (jd) => Math.min(Math.max(jd, MIN_JD), MAX_JD);
  const wdIdx = (jd) => mod(jd, 7);                    // 0 = thứ hai … 6 = chủ nhật
  const lunarShort = (l) => `${l.day}/${l.month}${l.leap ? ' nhuận' : ''}/${l.year}`;
  const deg = (rad) => rad * 180 / PI;
  const tStr = (t) => `${pad(t.hour)}:${pad(t.minute)} ${pad(t.day)}/${pad(t.month)}/${t.year}`;

  const GIO_CHI_RANGES = [
    { chi: 'Tý', start: '23:00', end: '01:00', label: 'Tý (23h–01h)', hDef: 0 },
    { chi: 'Sửu', start: '01:00', end: '03:00', label: 'Sửu (01h–03h)', hDef: 2 },
    { chi: 'Dần', start: '03:00', end: '05:00', label: 'Dần (03h–05h)', hDef: 4 },
    { chi: 'Mão', start: '05:00', end: '07:00', label: 'Mão (05h–07h)', hDef: 6 },
    { chi: 'Thìn', start: '07:00', end: '09:00', label: 'Thìn (07h–09h)', hDef: 8 },
    { chi: 'Tỵ', start: '09:00', end: '11:00', label: 'Tỵ (09h–11h)', hDef: 10 },
    { chi: 'Ngọ', start: '11:00', end: '13:00', label: 'Ngọ (11h–13h)', hDef: 12 },
    { chi: 'Mùi', start: '13:00', end: '15:00', label: 'Mùi (13h–15h)', hDef: 14 },
    { chi: 'Thân', start: '15:00', end: '17:00', label: 'Thân (15h–17h)', hDef: 16 },
    { chi: 'Dậu', start: '17:00', end: '19:00', label: 'Dậu (17h–19h)', hDef: 18 },
    { chi: 'Tuất', start: '19:00', end: '21:00', label: 'Tuất (19h–21h)', hDef: 20 },
    { chi: 'Hợi', start: '21:00', end: '23:00', label: 'Hợi (21h–23h)', hDef: 22 },
  ];

  function getChiIndexFromSolarTime(timeStr) {
    if (!timeStr) return floor((new Date().getHours() + 1) / 2) % 12;
    const parts = String(timeStr).split(':');
    const hh = parseInt(parts[0], 10) || 0;
    return floor((hh + 1) / 2) % 12;
  }

  const now = new Date();
  const TODAY = clampJd(jdFromDate(now.getFullYear(), now.getMonth() + 1, now.getDate()));
  const initialChiHour = floor((now.getHours() + 1) / 2) % 12;
  const st = { sel: TODAY, vy: 0, vm: 0, castKey: '', yearKey: '', selectedHour: initialChiHour };

  // ── Khởi tạo các ô chọn ──
  for (let d = 1; d <= 30; d++) $('al-lday').add(new Option(d, d));
  TEN_THANG.forEach((t, i) => $('al-lmonth').add(new Option(t, i + 1)));
  for (let m = 1; m <= 12; m++) $('al-vmonth').add(new Option(`Tháng ${m}`, m));
  if ($('al-lhour')) {
    GIO_CHI_RANGES.forEach((g, idx) => $('al-lhour').add(new Option(g.label, idx)));
    $('al-lhour').value = initialChiHour;
  }
  if ($('al-stime')) {
    $('al-stime').value = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  }

  // ── Đổi ngày & giờ ──
  function syncMode() {
    const mode = $('al-mode').value;
    host.querySelectorAll('[data-al-mode]').forEach((el) => { el.hidden = el.dataset.alMode !== mode; });
    updateLeapHint();
    if (mode === 's2l') {
      const chiIdx = getChiIndexFromSolarTime($('al-stime') ? $('al-stime').value : '');
      st.selectedHour = chiIdx;
      if ($('al-lhour')) $('al-lhour').value = chiIdx;
    } else {
      const chiIdx = $('al-lhour') ? +$('al-lhour').value : 0;
      st.selectedHour = chiIdx;
      if ($('al-stime')) $('al-stime').value = `${pad(GIO_CHI_RANGES[chiIdx].hDef)}:00`;
    }
  }

  function updateLeapHint() {
    const y = Math.round(+$('al-lyear').value);
    const ok = y >= YMIN && y <= YMAX;
    const lm = ok ? leapMonth(y) : 0;
    $('al-leap-hint').textContent = !ok ? 'Nhập năm 1800–2199' : lm ? `Năm ${y} nhuận ${lunarMonthName(lm)}` : `Năm ${y} không nhuận`;
    const allow = lm > 0 && +$('al-lmonth').value === lm;
    $('al-leap').disabled = !allow;
    if (!allow) $('al-leap').checked = false;
  }

  function showError(msg) { const e = $('al-error'); e.textContent = msg; e.style.display = 'block'; }
  function hideError() { const e = $('al-error'); e.textContent = ''; e.style.display = 'none'; }

  function formatSolarTimeDisplay(solarYmd, timeStr) {
    const dStr = `${pad(solarYmd.day)}/${pad(solarYmd.month)}/${solarYmd.year}`;
    if (!timeStr) return dStr;
    const parts = String(timeStr).split(':');
    const hh = parseInt(parts[0], 10) || 0;
    const mm = parseInt(parts[1], 10) || 0;
    const period = hh >= 12 ? 'PM' : 'AM';
    const h12 = hh % 12 === 0 ? 12 : hh % 12;
    return `${h12}:${pad(mm)}${period} - ${dStr}`;
  }

  function checkIsLateNight(mode, timeStr) {
    if (mode !== 's2l' || !timeStr) return false;
    const hh = parseInt(String(timeStr).split(':')[0], 10) || 0;
    return hh >= 23;
  }

  function renderResult(jd) {
    const i = getDayInfo(jd);
    const box = $('al-result');
    const pBox = $('al-profile-box');
    const mode = $('al-mode') ? $('al-mode').value : 's2l';
    const stimeVal = $('al-stime') ? $('al-stime').value : '';

    const isLateNight = checkIsLateNight(mode, stimeVal);
    const effJd = isLateNight ? jd + 1 : jd;
    const effInfo = isLateNight ? getDayInfo(effJd) : i;

    const chiIdx = st.selectedHour !== undefined ? st.selectedHour : 0;
    const chiH = CHI[chiIdx];
    // Can của giờ: với Dạ Tý (23h–24h), lấy Can theo ngày gốc jd (ví dụ 15/02 Giáp Dần -> Giáp Tý)
    const canH = CAN[mod((jd - 1) * 2 + chiIdx, 10)];
    const canChiH = `${canH} ${chiH}`;
    const rangeH = GIO_CHI_RANGES[chiIdx].start + ' – ' + GIO_CHI_RANGES[chiIdx].end;

    const allHours = gioHoangDao(effJd, true);
    const curHInfo = allHours.find(h => h.chi === chiH) || { than: 'Thanh Long', hoangDao: true };

    const solarTimeDisplay = formatSolarTimeDisplay(i.solar, stimeVal);
    let solarSub = i.weekday;
    if (i.holidays && i.holidays.length) solarSub += ` · ${i.holidays.join(' · ')}`;
    if (i.tietKhi) solarSub += ` · Tiết ${i.tietKhi}`;

    const lunarVal = `giờ ${chiH} - ${effInfo.lunar.day}/${effInfo.lunar.month}/${effInfo.lunar.year}${effInfo.lunar.leap ? ' (nhuận)' : ''}`;
    const lunarSub = esc(effInfo.lunarText);

    const canChiVal = `giờ ${canChiH}, ngày ${effInfo.canChiDay}, tháng ${effInfo.canChiMonth}, năm ${effInfo.canChiYear}`;
    const canChiSub = `${rangeH} · ${curHInfo.than} (${curHInfo.hoangDao ? 'Hoàng đạo' : 'Hắc đạo'})`;

    box.innerHTML =
      `<div><span class="al-k">Dương lịch</span><span class="al-v">${esc(solarTimeDisplay)}</span><span class="al-s">${esc(solarSub)}</span></div>` +
      `<div><span class="al-k">Âm lịch</span><span class="al-v">${esc(lunarVal)}</span><span class="al-s">${lunarSub}</span></div>` +
      `<div><span class="al-k">Lịch can chi</span><span class="al-v">${esc(canChiVal)}</span><span class="al-s">${esc(canChiSub)}</span></div>`;
    box.hidden = false;

    // Cập nhật Profile preview chips
    if (pBox) {
      if ($('al-chip-year')) $('al-chip-year').textContent = `${effInfo.lunar.year} (${effInfo.canChiYear})`;
      if ($('al-chip-month')) $('al-chip-month').textContent = `${effInfo.lunar.month}${effInfo.lunar.leap ? ' (nhuận)' : ''}`;
      if ($('al-chip-day')) $('al-chip-day').textContent = `${effInfo.lunar.day}`;
      if ($('al-chip-can-day')) $('al-chip-can-day').textContent = `${effInfo.canChiDay.split(' ')[0]}`;
      if ($('al-chip-chi-hour')) $('al-chip-chi-hour').textContent = `${chiH}`;
      if ($('al-chip-can-hour')) $('al-chip-can-hour').textContent = `${canH}`;
      pBox.hidden = false;
    }
  }

  function syncToProfile() {
    const jd = st.sel;
    const mode = $('al-mode') ? $('al-mode').value : 's2l';
    const stimeVal = $('al-stime') ? $('al-stime').value : '';
    const isLateNight = checkIsLateNight(mode, stimeVal);
    const effectiveJd = isLateNight ? jd + 1 : jd;
    const [ly, lm, ld, leap] = solarToLunarJd(effectiveJd, TZ_VN);
    const chiIdx = st.selectedHour !== undefined ? st.selectedHour : 0;
    const canH = CAN[mod((jd - 1) * 2 + chiIdx, 10)];
    const chiH = CHI[chiIdx];
    const canD = CAN[mod(effectiveJd + 9, 10)];
    const chiY = CHI[mod(ly + 8, 12)];

    let currentGender = 'Nam';
    try {
      const existing = JSON.parse(localStorage.getItem('kd.profile') || '{}');
      if (existing && existing.gioiTinh) currentGender = existing.gioiTinh;
    } catch (e) {}

    const newProfile = {
      gioiTinh: currentGender,
      namSinh: ly,
      chiNam: chiY,
      thangAm: lm,
      ngayAm: ld,
      canNgay: canD,
      chiGio: chiH,
      canGio: canH,
    };

    localStorage.setItem('kd.profile', JSON.stringify(newProfile));

    if (window.__KD_APP) {
      window.__KD_APP.setState({ profile: newProfile }, () => {
        if (typeof window.__KD_APP.syncProfileInputs === 'function') {
          window.__KD_APP.syncProfileInputs();
        }
      });
    }

    const toast = $('al-sync-toast');
    if (toast) {
      const canChiH = `${canH} ${chiH}`;
      const effInfo = getDayInfo(effectiveJd);
      toast.innerHTML =
        `<div class="al-toast-title">✓ Đã nạp thành công vào Hồ sơ dùng chung!</div>` +
        `<div class="al-toast-desc">` +
          `Dữ liệu đã sẵn sàng: Năm <b>${newProfile.namSinh} (${effInfo.canChiYear})</b> · ` +
          `Tháng âm <b>${newProfile.thangAm}</b> · ` +
          `Ngày âm <b>${newProfile.ngayAm}</b> (Can ngày: <b>${newProfile.canNgay}</b>) · ` +
          `Giờ âm: <b>${canChiH} (${newProfile.chiGio})</b>.<br>` +
          `Toàn bộ thông số này sẽ tự động điền sẵn khi bạn mở các module gieo quẻ.` +
        `</div>` +
        `<div class="al-toast-links">` +
          `<button type="button" class="al-toast-pill" data-mod-target="dothu">Mở Đồ Thư Phi Bàn Độn →</button>` +
          `<button type="button" class="al-toast-pill" data-mod-target="nguling">Mở Ngũ Linh →</button>` +
          `<button type="button" class="al-toast-pill" data-mod-target="chanlinh">Mở Chân Linh Nhân Độn →</button>` +
          `<button type="button" class="al-toast-pill" data-mod-target="cungsinh">Mở Cung Sinh - Cung Phi →</button>` +
        `</div>`;
      toast.hidden = false;

      toast.querySelectorAll('[data-mod-target]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const tgt = btn.dataset.modTarget;
          if (window.__KD_APP && typeof window.__KD_APP.load === 'function') {
            window.__KD_APP.load(tgt);
          }
        });
      });

      toast.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  /** Đổi không được: báo lỗi, và ghi đúng ô nhập lỗi vào #input-echo để Lịch sử của vỏ app không gắn nhầm kết quả cũ. */
  function fail(what, msg) {
    $('al-result').hidden = true;
    if ($('al-profile-box')) $('al-profile-box').hidden = true;
    $('input-echo').textContent = what + ' — không hợp lệ';
    showError(msg);
  }

  /** Đọc ô nhập và đổi ngày. force = true khi người dùng bấm nút. */
  function cast(force) {
    if (!host.isConnected || host.getAttribute('data-mod') !== 'amlich') return;
    const mode = $('al-mode').value;
    updateLeapHint();
    const stimeVal = $('al-stime') ? $('al-stime').value : '';
    const lhourVal = $('al-lhour') ? $('al-lhour').value : '';
    const key = [mode, $('al-solar').value, stimeVal, $('al-lday').value, $('al-lmonth').value, $('al-lyear').value, $('al-leap').checked, lhourVal].join('|');
    if (!force && key === st.castKey) { renderAll(); return; }
    st.castKey = key;
    hideError();
    let jd, echo;
    if (mode === 's2l') {
      const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec($('al-solar').value);
      if (!m || +m[1] < YMIN || +m[1] > YMAX) { fail('Dương → Âm · ' + ($('al-solar').value || 'chưa chọn ngày'), 'Chọn một ngày dương lịch trong khoảng 1800–2199.'); return; }
      jd = jdFromDate(+m[1], +m[2], +m[3]);
      st.selectedHour = getChiIndexFromSolarTime(stimeVal);
      if ($('al-lhour')) $('al-lhour').value = st.selectedHour;
      const isLate = checkIsLateNight(mode, stimeVal);
      const effJd = isLate ? jd + 1 : jd;
      echo = `Dương → Âm · ${fmt(ymd(jd))} ${stimeVal || ''} → ${lunarShort(solarToLunar(effJd))} giờ ${CHI[st.selectedHour]}`;
    } else {
      const y = Math.round(+$('al-lyear').value), mo = +$('al-lmonth').value, d = +$('al-lday').value, leap = $('al-leap').checked;
      const what = `Âm → Dương · ${lunarShort({ year: y, month: mo, day: d, leap })}`;
      if (!(y >= YMIN && y <= YMAX)) { fail(what, 'Nhập năm âm lịch trong khoảng 1800–2199.'); return; }
      try {
        jd = lunarToSolar(y, mo, d, leap).jd;
      } catch (e) {
        fail(what, e.message + '.');
        return;
      }
      st.selectedHour = $('al-lhour') ? +$('al-lhour').value : 0;
      if ($('al-stime')) $('al-stime').value = `${pad(GIO_CHI_RANGES[st.selectedHour].hDef)}:00`;
      echo = `Âm → Dương · ${lunarShort({ year: y, month: mo, day: d, leap })} giờ ${CHI[st.selectedHour]} → ${fmt(ymd(jd))}`;
    }
    $('input-echo').textContent = echo;
    renderResult(jd);
    select(jd);
  }

  function preset(name) {
    const tl = solarToLunar(TODAY);
    if (name === 'today') {
      const t = ymd(TODAY);
      $('al-mode').value = 's2l';
      $('al-solar').value = `${t.year}-${pad(t.month)}-${pad(t.day)}`;
      if ($('al-stime')) $('al-stime').value = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
    } else {
      $('al-mode').value = 'l2s';
      $('al-lyear').value = tl.year;
      $('al-lmonth').value = name === 'tet' ? 1 : 8;
      $('al-lday').value = name === 'tet' ? 1 : 15;
      $('al-leap').checked = false;
      if ($('al-lhour')) $('al-lhour').value = 0; // Giờ Tý
    }
    syncMode();
    cast(true);
  }

  // ── Tờ lịch ──
  function renderLeaf() {
    const i = getDayInfo(st.sel);
    const L = i.lunar;
    const chiIdx = st.selectedHour !== undefined ? st.selectedHour : 0;
    const canChiH = canChiHour(st.sel, chiIdx);
    const chiH = CHI[chiIdx];
    const rangeH = GIO_CHI_RANGES[chiIdx].start + '–' + GIO_CHI_RANGES[chiIdx].end;

    $('al-leaf').classList.toggle('al-red', wdIdx(st.sel) === 6 || i.holidays.length > 0);
    $('al-lf-month').textContent = `Tháng ${i.solar.month} · ${i.solar.year}`;
    $('al-lf-week').textContent = i.weekday;
    $('al-lf-day').textContent = i.solar.day;
    $('al-lf-hol').textContent = i.holidays.join(' · ');
    $('al-lf-lmonth').textContent = `Tháng ${TEN_THANG[L.month - 1]}${L.leap ? ' nhuận' : ''}`;
    $('al-lf-lday').textContent = L.day;
    $('al-lf-llen').textContent = i.monthLength === 30 ? 'tháng đủ' : 'tháng thiếu';
    $('al-cc-year').textContent = i.canChiYear;
    $('al-cc-month').textContent = i.canChiMonth;
    $('al-cc-day').textContent = i.canChiDay;
    $('al-cc-hour').textContent = i.gioDauNgay;
    if ($('al-cc-cur-hour')) {
      $('al-cc-cur-hour').textContent = `${canChiH} (${rangeH})`;
    }
    $('al-lf-text').textContent = i.lunarText;
    $('al-f-term').innerHTML = esc(i.tietKhi) + (i.tietKhiBatDau ? '<span class="al-pill al-new">bắt đầu</span>' : '');
    $('al-f-than').innerHTML = esc(i.thanNgay) + (i.ngayHoangDao
      ? '<span class="al-pill al-good">Hoàng đạo</span>' : '<span class="al-pill al-bad">Hắc đạo</span>');
    $('al-hours').innerHTML = i.gioHoangDao.map((g) => {
      const isActive = g.chi === chiH ? ' al-hour-active' : '';
      return `<li class="${isActive}" data-chi="${g.chi}" title="${esc(g.canChi)} · ${esc(g.than)} (Bấm để chọn giờ)"><b>${g.chi}</b><small>${g.start}–${g.end}h</small></li>`;
    }).join('');

    $('al-hours').querySelectorAll('li').forEach((li) => {
      li.addEventListener('click', () => {
        const c = li.dataset.chi;
        const idx = CHI.indexOf(c);
        if (idx >= 0) {
          st.selectedHour = idx;
          if ($('al-lhour')) $('al-lhour').value = idx;
          if ($('al-stime')) $('al-stime').value = `${pad(GIO_CHI_RANGES[idx].hDef)}:00`;
          renderLeaf();
          renderResult(st.sel);
        }
      });
    });
  }

  // ── Lưới tháng ──
  function renderGrid() {
    const y = st.vy, m = st.vm;
    $('al-vmonth').value = m;
    $('al-vyear').value = y;
    const first = jdFromDate(y, m, 1);
    const last = jdFromDate(y + (m === 12 ? 1 : 0), (m % 12) + 1, 1) - 1;
    const lead = wdIdx(first);
    const start = first - lead;
    const cells = Math.ceil((lead + last - first + 1) / 7) * 7;
    const html = WD_SHORT.map((w, k) => `<div class="al-wdh${k === 6 ? ' al-sun' : ''}" role="columnheader">${w}</div>`);
    for (let jd = start; jd < start + cells; jd++) {
      if (jd < MIN_JD || jd > MAX_JD) { html.push('<div class="al-cell al-out" aria-hidden="true"></div>'); continue; }
      const [sy, sm, sd] = jdToDate(jd);
      const l = solarToLunar(jd);
      const hol = holidays(jd);
      const tk = tietKhi(jd);
      const cls = ['al-cell'];
      if (jd < first || jd > last) cls.push('al-out');
      if (wdIdx(jd) === 6) cls.push('al-sun');
      if (hol.length) cls.push('al-hol');
      if (ngayHoangDao(l.month, jd).hoangDao) cls.push('al-hd');
      if (jd === TODAY) cls.push('al-today');
      if (jd === st.sel) cls.push('al-sel');
      const showMonth = l.day === 1 || jd === first;
      const ldTxt = showMonth ? `${l.day}/${l.month}${l.leap ? 'n' : ''}` : l.day;
      const ldCls = l.day === 1 ? 'al-ld al-m1' : l.day === 15 ? 'al-ld al-full' : 'al-ld';
      const label = `${sd} tháng ${sm} năm ${sy}, âm lịch ${l.day} ${lunarMonthName(l.month, l.leap)}${hol.length ? ', ' + hol.join(', ') : ''}`;
      html.push(`<button type="button" class="${cls.join(' ')}" data-jd="${jd}" role="gridcell" aria-label="${esc(label)}" ` +
        `aria-selected="${jd === st.sel}" tabindex="${jd === st.sel ? 0 : -1}"><span class="al-sd">${sd}</span>` +
        `<span class="al-tk">${tk.starts ? tk.name : ''}</span><span class="${ldCls}">${ldTxt}</span></button>`);
    }
    $('al-grid').innerHTML = html.join('');
    const a = solarToLunar(first), b = solarToLunar(last);
    const nA = lunarMonthName(a.month, a.leap), nB = lunarMonthName(b.month, b.leap);
    $('al-msub').textContent = a.year === b.year
      ? `${cap(nA)} – ${nB} năm ${canChiYear(a.year)}`
      : `${cap(nA)} năm ${canChiYear(a.year)} – ${nB} năm ${canChiYear(b.year)}`;
  }

  // ── Năm âm lịch + 24 tiết khí ──
  function renderYear() {
    const l = solarToLunar(st.sel);
    const key = l.year + '|' + st.vy;
    if (key !== st.yearKey) {
      st.yearKey = key;
      const lm = leapMonth(l.year);
      const months = lunarYearMonths(l.year);
      const total = months.reduce((s, x) => s + x.length, 0);
      $('al-y-eyebrow').textContent = `Năm âm lịch ${l.year}`;
      $('al-y-title').textContent = `Năm ${canChiYear(l.year)}`;
      $('al-y-sub').textContent = `${months.length} tháng, ${total} ngày · ${lm ? 'nhuận ' + lunarMonthName(lm) : 'không có tháng nhuận'} · năm con ${CON_GIAP[mod(l.year + 8, 12)]}`;
      $('al-t-months-title').textContent = `Các tháng âm lịch năm ${canChiYear(l.year)}`;
      $('al-t-months').innerHTML = months.map((x) =>
        `<tr data-jd="${x.start.jd}" data-end="${x.start.jd + x.length - 1}"><td class="al-nm${x.leap ? ' al-leapm' : ''}">${cap(x.name)}</td>` +
        `<td>${x.canChi}</td><td>${fmt(x.start)}</td><td class="al-num">${x.length} <span class="al-tag">${x.length === 30 ? 'đủ' : 'thiếu'}</span></td></tr>`).join('');
      $('al-t-terms-title').textContent = `24 tiết khí năm ${st.vy}`;
      $('al-t-terms').innerHTML = solarTerms(st.vy).map((t) =>
        `<tr data-jd="${t.date.jd}" class="${t.major ? 'al-major' : 'al-minor'}"><td class="al-nm">${t.name}</td>` +
        `<td class="al-num">${t.longitude}°</td><td>${pad(t.time.day)}/${pad(t.time.month)} ${pad(t.time.hour)}:${pad(t.time.minute)}</td></tr>`).join('');
    }
    for (const tr of $('al-t-months').rows) tr.classList.toggle('al-cur', st.sel >= +tr.dataset.jd && st.sel <= +tr.dataset.end);
    for (const tr of $('al-t-terms').rows) tr.classList.toggle('al-cur', +tr.dataset.jd === st.sel);
  }

  // ── Diễn giải từng bước (vỏ app sao chép sang Sổ tay) ──
  const solsticeCache = {};
  function solsticeOf(year) {
    if (!solsticeCache[year]) solsticeCache[year] = solarTerms(year).find((t) => t.index === 18);
    return solsticeCache[year];
  }

  function renderSteps() {
    const jd = st.sel, tz = TZ_VN;
    const S = ymd(jd);
    const [ly, lm, ld, leap, mstart] = solarToLunarJd(jd, tz);
    const k = kOfMonthStart(mstart, tz);
    const nm = localTime(newMoon(k), tz);
    const nextStart = newMoonDay(k + 1, tz);
    // hai tháng 11 bao quanh ngày đang xét
    let y11 = S.year;
    let a11 = lunarMonth11(y11, tz);
    if (a11 >= mstart) { y11 -= 1; a11 = lunarMonth11(y11, tz); }
    const b11 = lunarMonth11(y11 + 1, tz);
    const sA = solsticeOf(y11), sB = solsticeOf(y11 + 1);
    const nMonths = kOfMonthStart(b11, tz) - kOfMonthStart(a11, tz);
    const pos = k - kOfMonthStart(a11, tz);
    let leapLine = 'Giữa hai tháng 11 có 12 tháng nên năm này không có tháng nhuận.';
    if (nMonths === 13) {
      const off = leapMonthOffset(a11, tz);
      let lpM = off - 2; if (lpM < 0) lpM += 12;
      const lpStart = ymd(newMoonDay(kOfMonthStart(a11, tz) + off, tz));
      leapLine = `Giữa hai tháng 11 có 13 tháng. Tháng thứ ${off} sau tháng 11 (mùng 1 là ${fmt(lpStart)}) là tháng đầu tiên ` +
        `không chứa Trung khí nào, nên đó là <em>tháng ${TEN_THANG[lpM - 1]} nhuận</em>.`;
    }
    const lon = deg(sunLongitude(jd - 0.5 - tz / 24));
    const tk = tietKhi(jd);
    const chiDay = mod(jd + 1, 12);
    const tlStart = mod(8 + 2 * (chiDay % 6), 12);
    const ndStart = 2 * ((lm - 1) % 6);
    const nhd = ngayHoangDao(lm, jd);
    const steps = [
      ['Số ngày Julius', `Ngày ${fmt(S)} dương lịch ứng với số ngày Julius <code>JDN = ${jd}</code>. Mọi phép tính sau đều theo giờ UTC+7.`],
      ['Điểm Sóc mở đầu tháng', `Điểm Sóc (trăng mới) gần nhất trước ngày này xảy ra lúc <code>${tStr(nm)}</code>, nên mùng 1 là ngày ${fmt(ymd(mstart))}. ` +
        `Sóc kế tiếp rơi vào ${fmt(ymd(nextStart))}, nên tháng này có ${nextStart - mstart} ngày (tháng ${nextStart - mstart === 30 ? 'đủ' : 'thiếu'}).`],
      ['Tháng 11 chứa Đông chí', `Đông chí năm ${y11} lúc <code>${tStr(sA.time)}</code> nằm trong tháng bắt đầu ${fmt(ymd(a11))}; ` +
        `Đông chí năm ${y11 + 1} lúc <code>${tStr(sB.time)}</code> nằm trong tháng bắt đầu ${fmt(ymd(b11))}. Hai tháng này là tháng 11 âm lịch.`],
      ['Tháng nhuận', leapLine],
      ['Đánh số tháng và ngày', `Tháng chứa ngày đang xét là tháng thứ ${pos} kể từ tháng 11 đầu (${fmt(ymd(a11))}), tức <em>${lunarMonthName(lm, leap)}</em> năm âm ${ly}. ` +
        `Ngày âm = ${jd} − ${mstart} + 1 = <em>${ld}</em>.`],
      ['Can chi', `Ngày: can <code>(JDN + 9) mod 10 = ${mod(jd + 9, 10)}</code> → ${CAN[mod(jd + 9, 10)]}, chi <code>(JDN + 1) mod 12 = ${chiDay}</code> → ${CHI[chiDay]}. ` +
        `Tháng: can <code>(${ly}·12 + ${lm} + 3) mod 10</code> → ${CAN[mod(ly * 12 + lm + 3, 10)]}, chi tháng ${lm} → ${CHI[mod(lm + 1, 12)]}. ` +
        `Năm: can <code>(${ly} + 6) mod 10</code> → ${CAN[mod(ly + 6, 10)]}, chi <code>(${ly} + 8) mod 12</code> → ${CHI[mod(ly + 8, 12)]}. ` +
        `Giờ Tý đầu ngày: ${gioDauNgay(jd)}.`],
      ['Tiết khí', `Lúc 0h, kinh độ Mặt Trời là <code>${lon.toFixed(2)}°</code>, thuộc tiết ${TIET_KHI[floor(lon / 15)]} (${floor(lon / 15) * 15}°).` +
        (tk.starts ? ` Trong ngày Mặt Trời đi qua ${(TIET_KHI.indexOf(tk.name)) * 15}°, bắt đầu tiết <em>${tk.name}</em>.` : '')],
      ['Ngày và giờ hoàng đạo', `Tháng ${TEN_THANG[lm - 1]}: Thanh Long trực ngày ${CHI[ndStart]}; ngày ${CHI[chiDay]} gặp <em>${nhd.than}</em> ` +
        `(${nhd.hoangDao ? 'Hoàng đạo' : 'Hắc đạo'}). Ngày ${CHI[chiDay]}: Thanh Long trực giờ ${CHI[tlStart]}, ` +
        `các giờ hoàng đạo là ${gioHoangDao(jd).map((g) => g.chi).join(', ')}.`],
    ];
    $('al-steps').innerHTML = steps.map(([t, body], n) => `<div class="al-step"><b>${n + 1}. ${t}</b>${body}</div>`).join('');
  }

  function renderAll() { renderLeaf(); renderGrid(); renderYear(); renderSteps(); }

  function select(jd, opts) {
    st.sel = clampJd(jd);
    const [y, m] = jdToDate(st.sel);
    st.vy = y; st.vm = m;
    renderAll();
    if (opts && opts.focus) { const c = $('al-grid').querySelector('.al-sel'); if (c) c.focus(); }
  }

  function showMonth(y, m) {
    if (m < 1) { m = 12; y--; } else if (m > 12) { m = 1; y++; }
    if (y < YMIN || y > YMAX) return;
    const sd = jdToDate(st.sel)[2];
    const dim = jdFromDate(y + (m === 12 ? 1 : 0), (m % 12) + 1, 1) - jdFromDate(y, m, 1);
    select(jdFromDate(y, m, Math.min(sd, dim)));
  }

  // ── Sự kiện (chỉ gắn vào phần tử trong module, vỏ app thay mới mỗi lần nạp) ──
  $('al-mode').addEventListener('change', syncMode);
  $('al-lyear').addEventListener('input', updateLeapHint);
  $('al-lmonth').addEventListener('change', updateLeapHint);
  if ($('al-stime')) {
    const onStimeChange = () => {
      st.selectedHour = getChiIndexFromSolarTime($('al-stime').value);
      if ($('al-lhour')) $('al-lhour').value = st.selectedHour;
      renderLeaf();
      if ($('al-result') && !$('al-result').hidden) renderResult(st.sel);
    };
    $('al-stime').addEventListener('input', onStimeChange);
    $('al-stime').addEventListener('change', onStimeChange);
  }
  if ($('al-lhour')) {
    $('al-lhour').addEventListener('change', () => {
      st.selectedHour = +$('al-lhour').value;
      if ($('al-stime')) $('al-stime').value = `${pad(GIO_CHI_RANGES[st.selectedHour].hDef)}:00`;
      renderLeaf();
      if ($('al-result') && !$('al-result').hidden) renderResult(st.sel);
    });
  }
  if ($('al-sync-profile-btn')) {
    $('al-sync-profile-btn').addEventListener('click', syncToProfile);
  }
  if ($('al-sync-console-btn')) {
    $('al-sync-console-btn').addEventListener('click', () => {
      cast(true);
      syncToProfile();
    });
  }
  $('cast-btn').addEventListener('click', () => cast(true));
  host.querySelectorAll('.console input').forEach((el) => el.addEventListener('keydown', (e) => { if (e.key === 'Enter') cast(true); }));
  host.querySelectorAll('[data-al-preset]').forEach((b) => b.addEventListener('click', () => preset(b.dataset.alPreset)));
  $('al-grid').addEventListener('click', (e) => { const c = e.target.closest('.al-cell[data-jd]'); if (c) select(+c.dataset.jd); });
  $('al-grid').addEventListener('keydown', (e) => {
    const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
    if (step) { e.preventDefault(); select(st.sel + step, { focus: true }); }
  });
  $('al-prev-month').addEventListener('click', () => showMonth(st.vy, st.vm - 1));
  $('al-next-month').addEventListener('click', () => showMonth(st.vy, st.vm + 1));
  $('al-prev-day').addEventListener('click', () => select(st.sel - 1));
  $('al-next-day').addEventListener('click', () => select(st.sel + 1));
  $('al-today').addEventListener('click', () => select(TODAY));
  $('al-vmonth').addEventListener('change', () => showMonth(st.vy, +$('al-vmonth').value));
  $('al-vyear').addEventListener('change', () => {
    const y = Math.round(+$('al-vyear').value);
    if (y >= YMIN && y <= YMAX) showMonth(y, st.vm); else $('al-vyear').value = st.vy;
  });
  for (const id of ['al-t-months', 'al-t-terms']) {
    $(id).addEventListener('click', (e) => { const tr = e.target.closest('tr[data-jd]'); if (tr) select(+tr.dataset.jd); });
  }

  // Vỏ app gọi __KD_CAST khi khôi phục lịch sử, khi "Điền vào module này" và khi đổi sáng/tối.
  window.__KD_CAST = () => cast(false);

  // ── Trạng thái ban đầu: hôm nay ──
  const t0 = ymd(TODAY), l0 = solarToLunar(TODAY);
  $('al-solar').value = `${t0.year}-${pad(t0.month)}-${pad(t0.day)}`;
  if ($('al-stime')) $('al-stime').value = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  $('al-lyear').value = l0.year;
  $('al-lmonth').value = l0.month;
  $('al-lday').value = l0.day;
  if ($('al-lhour')) $('al-lhour').value = initialChiHour;
  syncMode();
  // coi như đã đổi xong bộ giá trị ban đầu, để __KD_CAST lúc đổi sáng/tối không kéo lịch về hôm nay
  const stimeInit = $('al-stime') ? $('al-stime').value : '';
  const lhourInit = $('al-lhour') ? $('al-lhour').value : '';
  st.castKey = [$('al-mode').value, $('al-solar').value, stimeInit, $('al-lday').value, $('al-lmonth').value, $('al-lyear').value, $('al-leap').checked, lhourInit].join('|');
  select(TODAY);
};

})();
