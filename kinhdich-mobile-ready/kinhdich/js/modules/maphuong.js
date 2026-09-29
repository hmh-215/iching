window.KD_MOD = window.KD_MOD || {};
window.KD_MOD["maphuong"] = function() {
  const host = document.querySelector('.kd-mod[data-mod="maphuong"]');
  if (!host) return;

  /* ---- Original Module Logic ---- */
/* =========================================================================
 * PHẦN 1 — LÕI THUẬT TOÁN MA PHƯƠNG (BẢO TOÀN 100% CƠ CẤU GỐC TỪ Ma_phuong.ipynb)
 * ========================================================================= */

  const { TRIGRAM_SYMBOL } = window.KD_DATA || { TRIGRAM_SYMBOL: { "Càn":"☰","Đoài":"☱","Ly":"☲","Chấn":"☳","Tốn":"☴","Khảm":"☵","Cấn":"☶","Khôn":"☷" } };
  const { mod: pymod, toggleStepBox } = window.KD_UTIL || { mod: (n, m) => ((n % m) + m) % m, toggleStepBox: id => document.getElementById(id)?.classList.toggle('open') };
  const { KHAM_BASE, transform } = window.KD_FLYINGSTAR || {
    KHAM_BASE: [[2, 3, 7], [6, 1, 5], [4, 8, 9]],
    transform: (m, k) => m
  };
  const { svgEl } = window.KD_GRID || {};

  const GUA_NAMES = ['Càn', 'Đoài', 'Ly', 'Chấn', 'Tốn', 'Khảm', 'Cấn', 'Khôn'];

const GUA_TRANSFORM = {
  'Khảm': 'flip_v',
  'Đoài': 'anti_transpose',
  'Ly':   'flip_h',
  'Cấn':  'transpose',
  'Khôn': 'rot270',
  'Chấn': 'rot180',
  'Tốn':  'e',
  'Càn':  'rot90',
};

function flyingStarMatrix(gua, centerNumber) {
  if (centerNumber === undefined) centerNumber = 1;
  const base = transform(KHAM_BASE, GUA_TRANSFORM[gua]);
  const shift = centerNumber - 1;
  return base.map(row => row.map(v => pymod(v - 1 + shift, 9) + 1));
}

// --- Bước 2: Bảng Nạp Chi ---
const NAP_CHI_DATA = {
  'Càn':  { 1:'Tý',  2:'Dần', 3:'Thìn', 4:'Ngọ', 5:'Thân', 6:'Tuất' },
  'Chấn': { 1:'Tý',  2:'Dần', 3:'Thìn', 4:'Ngọ', 5:'Thân', 6:'Tuất' },
  'Khảm': { 1:'Dần', 2:'Thìn',3:'Ngọ',  4:'Thân',5:'Tuất', 6:'Tý'   },
  'Cấn':  { 1:'Thìn',2:'Ngọ', 3:'Thân', 4:'Tuất',5:'Tý',   6:'Dần' },
  'Đoài': { 1:'Tỵ',  2:'Mão', 3:'Sửu',  4:'Hợi', 5:'Dậu',  6:'Mùi' },
  'Ly':   { 1:'Mão', 2:'Sửu', 3:'Hợi',  4:'Dậu', 5:'Mùi',  6:'Tỵ'  },
  'Tốn':  { 1:'Sửu', 2:'Hợi', 3:'Dậu',  4:'Mùi', 5:'Tỵ',   6:'Mão' },
  'Khôn': { 1:'Mùi', 2:'Tỵ',  3:'Mão',  4:'Sửu', 5:'Hợi',  6:'Dậu' },
};

// --- Bước 3: Bảng Địa chi -> tọa độ, Bảng Sinh - Thành ---
const DIA_CHI_COORD_MAP = {
  'Tỵ':[0,0], 'Ngọ':[0,1], 'Mùi':[0,2], 'Thân':[0,3],
  'Thìn':[1,0], 'Dậu':[1,3],
  'Mão':[2,0], 'Tuất':[2,3],
  'Dần':[3,0], 'Sửu':[3,1], 'Tý':[3,2], 'Hợi':[3,3],
};

const SINH_THANH_TABLE = [
  [3, 2, 5, 2],
  [1, null, null, 4],
  [9, null, null, 6],
  [7, 5, 7, 8],
];

// --- Bước 4: Họ của quẻ ---
const TIEN_THIEN_NUMBERS = { 'Càn':1,'Đoài':2,'Ly':3,'Chấn':4,'Tốn':5,'Khảm':6,'Cấn':7,'Khôn':8 };
const TIEN_THIEN_NAMES = { 1:'Càn',2:'Đoài',3:'Ly',4:'Chấn',5:'Tốn',6:'Khảm',7:'Cấn',8:'Khôn' };
const CUNG_NGHI_GUAS = new Set(['Càn', 'Đoài', 'Ly', 'Chấn']);
const KHAC_NGHI_GUAS = new Set(['Tốn', 'Khảm', 'Cấn', 'Khôn']);

function calcHoCuaQue(quatThuong, quaHa) {
  const soTienThienThuong = TIEN_THIEN_NUMBERS[quatThuong];
  const soTienThienHa = TIEN_THIEN_NUMBERS[quaHa];
  const total = soTienThienThuong + soTienThienHa;
  let hoCuaQue, nhanhTinh;
  if (total % 2 !== 0) {
    const resultNum = 9 - soTienThienHa;
    hoCuaQue = TIEN_THIEN_NAMES[resultNum];
    nhanhTinh = 'odd';
  } else {
    const thuongCungNghi = CUNG_NGHI_GUAS.has(quatThuong);
    const haCungNghi = CUNG_NGHI_GUAS.has(quaHa);
    if (thuongCungNghi === haCungNghi) {
      hoCuaQue = quaHa;
    } else {
      hoCuaQue = quatThuong;
    }
    nhanhTinh = 'even';
  }
  return { soTienThienThuong, soTienThienHa, total, hoCuaQue, nhanhTinh };
}

// --- Bước 6: Lạc Thư mapping (bố cục thị giác) ---
const LAC_THU_MAPPING = {
  'Tốn':[0,0], 'Ly':[0,1], 'Khôn':[0,2],
  'Chấn':[1,0], 'Đoài':[1,2],
  'Cấn':[2,0], 'Khảm':[2,1], 'Càn':[2,2],
};

// --- Bước 7: Hậu Thiên Bát Quái số -> tên quẻ ---
const HAU_THIEN_NUMBER_TO_GUA_NAME = {
  1:'Khảm', 2:'Khôn', 3:'Chấn', 4:'Tốn', 5:'Trung Cung', 6:'Càn', 7:'Đoài', 8:'Cấn', 9:'Ly',
};

function reversedRows(m) { return [m[2], m[1], m[0]]; }

function calculateMaPhuong(quatThuong, quaHa, haoDong) {
  // Bước 1-2: Nạp Chi
  const guaForNapChi = (haoDong >= 1 && haoDong <= 3) ? quaHa : quatThuong;
  const diaChi = NAP_CHI_DATA[guaForNapChi][haoDong];

  // Bước 3: Sinh Thành
  const coord = DIA_CHI_COORD_MAP[diaChi];
  const sinhThanhValue = SINH_THANH_TABLE[coord[0]][coord[1]];

  // Bước 4: Họ của quẻ
  const hoInfo = calcHoCuaQue(quatThuong, quaHa);
  const hoCuaQue = hoInfo.hoCuaQue;

  // Bước 5: Ma trận Sinh Thành gốc
  const matrixSinhThanh = flyingStarMatrix(hoCuaQue, sinhThanhValue);

  // Bước 6: Ma trận Quẻ Thượng
  const posThuong = LAC_THU_MAPPING[quatThuong];
  const centerThuong = matrixSinhThanh[2 - posThuong[0]][posThuong[1]];
  let matrixQueThuong = flyingStarMatrix(quatThuong, centerThuong);
  matrixQueThuong = matrixQueThuong.map(row => row.map(v => v === 5 ? centerThuong : v));

  // Bước 6: Ma trận Quẻ Hạ
  const posHa = LAC_THU_MAPPING[quaHa];
  const centerHa = matrixSinhThanh[2 - posHa[0]][posHa[1]];
  let matrixQueHa = flyingStarMatrix(quaHa, centerHa);
  matrixQueHa = matrixQueHa.map(row => row.map(v => v === 5 ? centerHa : v));

  // Bước 7: Ghép ma trận hoàn chỉnh
  const finalMagicSquare = [];
  for (let r = 0; r < 3; r++) {
    const rowDisplay = [];
    for (let c = 0; c < 3; c++) {
      const numThuong = matrixQueThuong[r][c];
      const numHa = matrixQueHa[r][c];
      const nameThuong = HAU_THIEN_NUMBER_TO_GUA_NAME[numThuong] || ('Số ' + numThuong + ' không xác định');
      const nameHa = HAU_THIEN_NUMBER_TO_GUA_NAME[numHa] || ('Số ' + numHa + ' không xác định');
      rowDisplay.push(nameThuong + '/' + nameHa);
    }
    finalMagicSquare.push(rowDisplay);
  }
  finalMagicSquare[1][1] = 'null';

  return {
    guaForNapChi, diaChi, coord, sinhThanhValue,
    hoInfo, hoCuaQue, matrixSinhThanh,
    posThuong, centerThuong, matrixQueThuong,
    posHa, centerHa, matrixQueHa,
    finalMagicSquare,
  };
}

/* =========================================================================
 * PHẦN 2 — GIAO DIỆN & HIỂN THỊ
 * ========================================================================= */

const selThuong = document.getElementById('sel-thuong');
const selHa = document.getElementById('sel-ha');
const selHao = document.getElementById('sel-hao');

GUA_NAMES.forEach(g => selThuong.add(new Option(g, g)));
GUA_NAMES.forEach(g => selHa.add(new Option(g, g)));
for (let h = 1; h <= 6; h++) selHao.add(new Option('Hào ' + h, h));

const PRESETS = [
  { thuong: 'Càn', ha: 'Khôn', hao: 1 },
  { thuong: 'Chấn', ha: 'Khảm', hao: 4 },
  { thuong: 'Ly', ha: 'Đoài', hao: 6 },
];

document.querySelectorAll('.preset-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const p = PRESETS[parseInt(btn.dataset.preset)];
    selThuong.value = p.thuong; selHa.value = p.ha; selHao.value = p.hao;
    cast();
  });
});


/* --- 4x4 grid (Bảng Sinh Thành) --- */
const CELL4 = 64, ORIGIN4 = 6;
function cellCenter4(r, c) { return [ORIGIN4 + c * CELL4 + CELL4 / 2, ORIGIN4 + r * CELL4 + CELL4 / 2]; }

function renderSinhThanhGrid(svgId, highlightCoord) {
  const svg = document.getElementById(svgId);
  svg.innerHTML = "";
  const size = ORIGIN4 * 2 + CELL4 * 4;
  svg.setAttribute("viewBox", `0 0 ${size} ${size}`);

  for (let i = 0; i <= 4; i++) {
    svg.appendChild(svgEl("line", { x1: ORIGIN4, y1: ORIGIN4 + i*CELL4, x2: ORIGIN4 + 4*CELL4, y2: ORIGIN4 + i*CELL4, stroke: "var(--line-strong)", "stroke-width": 1 }));
    svg.appendChild(svgEl("line", { x1: ORIGIN4 + i*CELL4, y1: ORIGIN4, x2: ORIGIN4 + i*CELL4, y2: ORIGIN4 + 4*CELL4, stroke: "var(--line-strong)", "stroke-width": 1 }));
  }

  const gold = getComputedStyle(document.documentElement).getPropertyValue('--gold').trim();

  // Center 2x2 is unused in Sinh-Thanh table — mark it as void
  [[1,1],[1,2],[2,1],[2,2]].forEach(([r,c]) => {
    const [cx, cy] = cellCenter4(r, c);
    svg.appendChild(svgEl("rect", { x: cx - CELL4/2 + 3, y: cy - CELL4/2 + 3, width: CELL4 - 6, height: CELL4 - 6, fill: "none", stroke: "var(--paper-faint)", "stroke-width": 1, "stroke-dasharray": "3,3", rx: 2 }));
  });

  for (const [chi, [r, c]] of Object.entries(DIA_CHI_COORD_MAP)) {
    const val = SINH_THANH_TABLE[r][c];
    const [cx, cy] = cellCenter4(r, c);
    const isHl = highlightCoord && highlightCoord[0] === r && highlightCoord[1] === c;
    if (isHl) {
      svg.appendChild(svgEl("rect", { x: cx - CELL4/2 + 3, y: cy - CELL4/2 + 3, width: CELL4 - 6, height: CELL4 - 6, fill: gold, opacity: 0.2, stroke: gold, "stroke-width": 1.6, rx: 2 }));
    }
    const t1 = svgEl("text", { x: cx, y: cy - 10, "text-anchor": "middle", "dominant-baseline": "middle", fill: isHl ? "var(--paper)" : "var(--paper-dim)", "font-size": 11.5, "font-weight": 500 });
    t1.textContent = chi;
    svg.appendChild(t1);
    const t2 = svgEl("text", { x: cx, y: cy + 12, "text-anchor": "middle", "dominant-baseline": "middle", fill: isHl ? gold : "var(--paper-faint)", "font-size": 15, "font-weight": 600 });
    t2.textContent = val;
    svg.appendChild(t2);
  }
}

/* --- 3x3 grid (Ma trận Phi Tinh) --- */
const CELL3 = 68, ORIGIN3 = 8;
function cellCenter3(r, c) { return [ORIGIN3 + c * CELL3 + CELL3 / 2, ORIGIN3 + r * CELL3 + CELL3 / 2]; }

function renderMatrixGrid(svgId, matrixDisplay, opts) {
  opts = opts || {};
  const svg = document.getElementById(svgId);
  svg.innerHTML = "";
  const size = ORIGIN3 * 2 + CELL3 * 3;
  svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
  const color = opts.color || getComputedStyle(document.documentElement).getPropertyValue('--gold').trim();

  const defs = svgEl("defs", {});
  const marker = svgEl("marker", { id: svgId + "-arrow", markerWidth: 8, markerHeight: 8, refX: 6, refY: 3, orient: "auto", markerUnits: "strokeWidth" });
  marker.appendChild(svgEl("path", { d: "M0,0 L6,3 L0,6 Z", fill: color }));
  defs.appendChild(marker);
  svg.appendChild(defs);

  for (let i = 0; i <= 3; i++) {
    svg.appendChild(svgEl("line", { x1: ORIGIN3, y1: ORIGIN3 + i*CELL3, x2: ORIGIN3 + 3*CELL3, y2: ORIGIN3 + i*CELL3, stroke: "var(--line-strong)", "stroke-width": 1 }));
    svg.appendChild(svgEl("line", { x1: ORIGIN3 + i*CELL3, y1: ORIGIN3, x2: ORIGIN3 + i*CELL3, y2: ORIGIN3 + 3*CELL3, stroke: "var(--line-strong)", "stroke-width": 1 }));
  }

  if (opts.showPath) {
    const coords = {};
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
      if (coords[matrixDisplay[r][c]] === undefined) coords[matrixDisplay[r][c]] = [r, c];
    }
    const path = [];
    for (let n = 1; n <= 9; n++) if (coords[n]) path.push(coords[n]);
    for (let i = 1; i < path.length; i++) {
      const [r1, c1] = path[i-1], [r2, c2] = path[i];
      const [x1, y1] = cellCenter3(r1, c1), [x2, y2] = cellCenter3(r2, c2);
      svg.appendChild(svgEl("line", { x1, y1, x2, y2, stroke: color, "stroke-width": 2, "marker-end": `url(#${svgId}-arrow)`, opacity: 0.8 }));
    }
    if (coords[9] && coords[1]) {
      const [r9, c9] = coords[9], [r1c, c1c] = coords[1];
      const [x1, y1] = cellCenter3(r9, c9), [x2, y2] = cellCenter3(r1c, c1c);
      svg.appendChild(svgEl("line", { x1, y1, x2, y2, stroke: color, "stroke-width": 2, "stroke-dasharray": "4,4", "marker-end": `url(#${svgId}-arrow)`, opacity: 0.6 }));
    }
  }

  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const isCenter = (r === 1 && c === 1);
      const [cx, cy] = cellCenter3(r, c);
      if (isCenter) {
        svg.appendChild(svgEl("rect", { x: cx - CELL3/2 + 4, y: cy - CELL3/2 + 4, width: CELL3 - 8, height: CELL3 - 8, fill: color, opacity: 0.16, stroke: color, "stroke-width": 1.5, rx: 3 }));
      }
      const t = svgEl("text", { x: cx, y: cy, "text-anchor": "middle", "dominant-baseline": "middle", fill: isCenter ? color : "var(--paper)", "font-size": 19, "font-weight": isCenter ? 700 : 500 });
      t.textContent = matrixDisplay[r][c];
      svg.appendChild(t);
    }
  }
}


function cast() {
  const quatThuong = selThuong.value;
  const quaHa = selHa.value;
  const haoDong = parseInt(selHao.value);
  const showArrows = document.getElementById('toggle-arrows').checked;

  const errorBox = document.getElementById('error-msg');
  const result = document.getElementById('result');

  let r;
  try {
    r = calculateMaPhuong(quatThuong, quaHa, haoDong);
  } catch (e) {
    result.style.display = 'none';
    errorBox.style.display = 'block';
    errorBox.textContent = 'Lỗi: ' + e.message;
    return;
  }

  errorBox.style.display = 'none';
  result.style.display = 'block';

  const goldColor = getComputedStyle(document.documentElement).getPropertyValue('--gold').trim();
  const jadeColor = getComputedStyle(document.documentElement).getPropertyValue('--jade').trim();

  // --- Panel 1: Nap Chi ---
  const guaLabel = (haoDong >= 1 && haoDong <= 3) ? 'Quẻ Hạ' : 'Quẻ Thượng';
  document.getElementById('napchi-desc').innerHTML =
    `Hào Động <b>${haoDong}</b> thuộc <b>${guaLabel}</b> (Hào 1–3 tra Quẻ Hạ, Hào 4–6 tra Quẻ Thượng) → dùng quẻ <b>${r.guaForNapChi}</b> để tra Nạp Chi.`;

  const napTable = document.getElementById('napchi-table');
  const napRow = NAP_CHI_DATA[r.guaForNapChi];
  let napHtml = '<tr><th>Hào</th>' + [1,2,3,4,5,6].map(h => `<th>${h}</th>`).join('') + '</tr>';
  napHtml += '<tr class="name-row"><td class="name-cell">' + r.guaForNapChi + '</td>' +
    [1,2,3,4,5,6].map(h => `<td${h === haoDong ? ' class="hl"' : ''}>${napRow[h]}</td>`).join('') + '</tr>';
  napTable.innerHTML = napHtml;

  document.getElementById('napchi-diachi').textContent = r.diaChi;
  document.getElementById('napchi-tag').textContent = `Địa chi của Hào ${haoDong}`;

  document.getElementById('napchi-steps').innerHTML = `
    <b>Chi tiết Bước 1 — Nạp Chi:</b><br>
    1. Quẻ Thượng = <b>${quatThuong}</b>, Quẻ Hạ = <b>${quaHa}</b>, Hào Động = <b>${haoDong}</b><br>
    2. Hào ${haoDong} thuộc khoảng ${haoDong <= 3 ? '1–3 (Quẻ Hạ)' : '4–6 (Quẻ Thượng)'} → dùng quẻ <b>${r.guaForNapChi}</b><br>
    3. Tra bảng Nạp Chi[${r.guaForNapChi}][${haoDong}] = <b>${r.diaChi}</b>
  `;

  // --- Panel 2: Sinh Thanh ---
  renderSinhThanhGrid('svg-sinhthanh', r.coord);
  document.getElementById('sinhthanh-desc').innerHTML =
    `Địa chi <b>${r.diaChi}</b> nằm ở tọa độ [${r.coord[0]}, ${r.coord[1]}] trong bảng Sinh Thành. Tâm bảng (2×2 giữa) không dùng.`;
  document.getElementById('sinhthanh-caption').textContent = `Tọa độ: [${r.coord[0]}, ${r.coord[1]}]`;
  document.getElementById('sinhthanh-tag').textContent = `Giá trị Sinh Thành = ${r.sinhThanhValue}`;

  document.getElementById('st-steps').innerHTML = `
    <b>Chi tiết Bước 2 — Sinh Thành:</b><br>
    1. Địa chi <b>${r.diaChi}</b> → tọa độ [${r.coord[0]}, ${r.coord[1]}]<br>
    2. Bảng Sinh-Thành[${r.coord[0]}][${r.coord[1]}] = <b>${r.sinhThanhValue}</b>
  `;

  // --- Panel 3: Ho cua que ---
  const hi = r.hoInfo;
  let hoFormula;
  if (hi.nhanhTinh === 'odd') {
    hoFormula = `Tổng = ${hi.soTienThienThuong} + ${hi.soTienThienHa} = <b>${hi.total}</b> (lẻ) → Họ = quẻ có số Tiên Thiên (9 − ${hi.soTienThienHa}) = <b>${9 - hi.soTienThienHa}</b> → <b>${hi.hoCuaQue}</b>`;
  } else {
    const thuongLoai = CUNG_NGHI_GUAS.has(quatThuong) ? 'Cùng Nghi' : 'Khác Nghi';
    const haLoai = CUNG_NGHI_GUAS.has(quaHa) ? 'Cùng Nghi' : 'Khác Nghi';
    const sameGroup = thuongLoai === haLoai;
    hoFormula = `Tổng = ${hi.soTienThienThuong} + ${hi.soTienThienHa} = <b>${hi.total}</b> (chẵn) → Quẻ Thượng thuộc ${thuongLoai}, Quẻ Hạ thuộc ${haLoai} → ${sameGroup ? 'cùng nhóm' : 'khác nhóm'} → Họ = <b>${sameGroup ? 'Quẻ Hạ' : 'Quẻ Thượng'}</b> = <b>${hi.hoCuaQue}</b>`;
  }
  document.getElementById('ho-desc').innerHTML =
    `Số Tiên Thiên: ${quatThuong} = <b>${hi.soTienThienThuong}</b>, ${quaHa} = <b>${hi.soTienThienHa}</b>. ${hoFormula}`;
  document.getElementById('ho-symbol').textContent = TRIGRAM_SYMBOL[hi.hoCuaQue];
  document.getElementById('ho-name').textContent = hi.hoCuaQue;
  document.getElementById('ho-tag').textContent = 'Họ của quẻ';

  document.getElementById('ho-steps').innerHTML = `
    <b>Chi tiết Bước 3 — Họ của quẻ:</b><br>
    1. Số Tiên Thiên: ${quatThuong}=<b>${hi.soTienThienThuong}</b>, ${quaHa}=<b>${hi.soTienThienHa}</b><br>
    2. Tổng = <b>${hi.total}</b> (${hi.nhanhTinh === 'odd' ? 'lẻ' : 'chẵn'})<br>
    3. ${hoFormula}
  `;

  // --- Panel 4: Ma tran Sinh Thanh (base) ---
  const displaySinhThanh = reversedRows(r.matrixSinhThanh);
  renderMatrixGrid('svg-matsinhthanh', displaySinhThanh, { color: goldColor, showPath: showArrows });
  document.getElementById('matsinhthanh-desc').innerHTML =
    `Ma trận Phi Tinh của quẻ <b>${r.hoCuaQue}</b> với trung cung = <b>${r.sinhThanhValue}</b> (flying_star_matrix). Ma trận này là gốc để tra trung cung cho Quẻ Thượng và Quẻ Hạ qua bản đồ Lạc Thư.`;
  document.getElementById('matsinhthanh-caption').textContent = `Họ của quẻ: ${r.hoCuaQue} · Trung cung: ${r.sinhThanhValue}`;

  // --- Panel 5a: Que Thuong matrix ---
  const displayThuong = reversedRows(r.matrixQueThuong);
  renderMatrixGrid('svg-thuong', displayThuong, { color: goldColor, showPath: showArrows });
  document.getElementById('thuong-title').textContent = `Ma trận Quẻ Thượng — ${quatThuong}`;
  document.getElementById('thuong-desc').innerHTML =
    `Vị trí <b>${quatThuong}</b> trong Lạc Thư: [${r.posThuong[0]}, ${r.posThuong[1]}] → trung cung = Ma trận Sinh Thành[${2 - r.posThuong[0]}][${r.posThuong[1]}] = <b>${r.centerThuong}</b>. Các ô có giá trị 5 (nếu có) được thay bằng trung cung.`;
  document.getElementById('thuong-caption').textContent = `Trung cung: ${r.centerThuong}`;

  // --- Panel 5b: Que Ha matrix ---
  const displayHa = reversedRows(r.matrixQueHa);
  renderMatrixGrid('svg-ha', displayHa, { color: jadeColor, showPath: showArrows });
  document.getElementById('ha-title').textContent = `Ma trận Quẻ Hạ — ${quaHa}`;
  document.getElementById('ha-desc').innerHTML =
    `Vị trí <b>${quaHa}</b> trong Lạc Thư: [${r.posHa[0]}, ${r.posHa[1]}] → trung cung = Ma trận Sinh Thành[${2 - r.posHa[0]}][${r.posHa[1]}] = <b>${r.centerHa}</b>. Các ô có giá trị 5 (nếu có) được thay bằng trung cung.`;
  document.getElementById('ha-caption').textContent = `Trung cung: ${r.centerHa}`;

  // --- Final magic square ---
  const finalGrid = document.getElementById('final-grid');
  finalGrid.innerHTML = '';
  const displayFinal = reversedRows(r.finalMagicSquare);
  for (let rr = 0; rr < 3; rr++) {
    for (let cc = 0; cc < 3; cc++) {
      const cell = document.createElement('div');
      const val = displayFinal[rr][cc];
      cell.className = 'final-cell' + (val === 'null' ? ' center' : '');
      cell.textContent = val;
      finalGrid.appendChild(cell);
    }
  }

  // --- Steps summary ---
  document.getElementById('steps-body').innerHTML = `
    - Quẻ Thượng: <b>${quatThuong}</b> · Quẻ Hạ: <b>${quaHa}</b> · Hào Động: <b>${haoDong}</b><br>
    - Quẻ tra Nạp Chi: <b>${r.guaForNapChi}</b> → Địa chi: <b>${r.diaChi}</b><br>
    - Tọa độ Địa chi: [${r.coord[0]}, ${r.coord[1]}] → Giá trị Sinh Thành: <b>${r.sinhThanhValue}</b><br>
    - Họ của quẻ: <b>${r.hoCuaQue}</b> (Tổng Tiên Thiên = ${hi.total}, ${hi.nhanhTinh === 'odd' ? 'lẻ' : 'chẵn'})<br>
    - Ma trận Sinh Thành (${r.hoCuaQue}, trung cung ${r.sinhThanhValue}): ${JSON.stringify(displaySinhThanh)}<br>
    - Ma trận Quẻ Thượng (${quatThuong}, trung cung ${r.centerThuong}): ${JSON.stringify(displayThuong)}<br>
    - Ma trận Quẻ Hạ (${quaHa}, trung cung ${r.centerHa}): ${JSON.stringify(displayHa)}<br>
    - Ma phương hoàn chỉnh: ${JSON.stringify(displayFinal)}
  `;

  document.getElementById('input-echo').textContent = `Quẻ Thượng ${quatThuong} · Quẻ Hạ ${quaHa} · Hào Động ${haoDong}`;
}

document.getElementById('cast-btn').addEventListener('click', cast);
document.getElementById('toggle-arrows').addEventListener('change', () => {
  if (document.getElementById('result').style.display === 'block') cast();
});

// Load mặc định
selThuong.value = 'Càn'; selHa.value = 'Khôn'; selHao.value = '1';

  /* ---- Unified Bridge ---- */
  if (typeof cast === 'function') {
    window.cast = cast;
    window.__KD_CAST = cast;
  } else {
    window.__KD_CAST = function() {};
  }
};
