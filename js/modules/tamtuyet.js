window.KD_MOD = window.KD_MOD || {};
window.KD_MOD["tamtuyet"] = function() {
  const host = document.querySelector('.kd-mod[data-mod="tamtuyet"]');
  if (!host) return;

  /* ---- Original Module Logic ---- */
/* =========================================================================
 * PHẦN 1 — LÕI THUẬT TOÁN (Port trực tiếp từ Tam_tuyet_phap_v2.ipynb)
 * Không thay đổi logic gốc.
 * ========================================================================= */

  const { KHAM_BASE, transform } = window.KD_FLYINGSTAR || {
    KHAM_BASE: [[2, 3, 7], [6, 1, 5], [4, 8, 9]],
    transform: (m, k) => m
  };
  const { mod: pymod, coordEq, toggleStepBox } = window.KD_UTIL || {
    mod: (n, m) => ((n % m) + m) % m,
    coordEq: (a, b) => a[0] === b[0] && a[1] === b[1],
    toggleStepBox: id => document.getElementById(id)?.classList.toggle('open')
  };

// GUA_TRANSFORM — giữ nguyên comment gốc từ notebook
const GUA_TRANSFORM = {
  'Khảm': 'flip_v',           // Lật trên-dưới (was e)
  'Đoài': 'anti_transpose',   // Lật theo đường chéo phụ (was rot90)
  'Ly':   'flip_h',           // Lật trái-phải (was rot180)
  'Cấn':  'transpose',        // Lật theo đường chéo chính (was rot270)
  'Khôn': 'transpose',        // Đã chỉnh sửa: Dùng transpose thay vì rot270
  'Chấn': 'rot180',           // Xoay 180° (was flip_h)
  'Tốn':  'e',                // Giữ nguyên (base 'Khảm') (was flip_v)
  'Càn':  'anti_transpose',   // Đã chỉnh sửa: Dùng anti_transpose thay vì rot90
};


function flying_star_matrix(gua, center_number = 1) {
  const base = transform(KHAM_BASE, GUA_TRANSFORM[gua]);
  const shift = center_number - 1;
  return base.map(row => row.map(v => pymod(v - 1 + shift, 9) + 1));
}

const LAC_THU_BA_GUA_ARRANGEMENT = [
  ['Tốn', 'Ly', 'Khôn'],
  ['Chấn', null, 'Đoài'],
  ['Cấn', 'Khảm', 'Càn'],
];

const BA_GUA_BINARY = {
  'Càn': '111', 'Đoài': '110', 'Ly': '101', 'Chấn': '100',
  'Tốn': '011', 'Khảm': '010', 'Cấn': '001', 'Khôn': '000',
};

const BIEN_KHI_MEANINGS = {
  '001': 'Sinh khí', '011': 'Ngũ quỷ', '111': 'Diên niên', '101': 'Lục sát',
  '100': 'Họa hại', '110': 'Thiên y', '010': 'Tuyệt mệnh', '000': 'Phục vị',
};

const TRIGRAM_SYMBOL = { "Càn":"☰","Đoài":"☱","Ly":"☲","Chấn":"☳","Tốn":"☴","Khảm":"☵","Cấn":"☶","Khôn":"☷" };

const LUC_THAP_HOA_GIAP_LIST = [
  'Giáp Tý','Ất Sửu','Bính Dần','Đinh Mão','Mậu Thìn','Kỷ Tỵ','Canh Ngọ','Tân Mùi','Nhâm Thân','Quý Dậu',
  'Giáp Tuất','Ất Hợi','Bính Tý','Đinh Sửu','Mậu Dần','Kỷ Mão','Canh Thìn','Tân Tỵ','Nhâm Ngọ','Quý Mùi',
  'Giáp Thân','Ất Dậu','Bính Tuất','Đinh Hợi','Mậu Tý','Kỷ Sửu','Canh Dần','Tân Mão','Nhâm Thìn','Quý Tỵ',
  'Giáp Ngọ','Ất Mùi','Bính Thân','Đinh Dậu','Mậu Tuất','Kỷ Hợi','Canh Tý','Tân Sửu','Nhâm Dần','Quý Mão',
  'Giáp Thìn','Ất Tỵ','Bính Ngọ','Đinh Mùi','Mậu Thân','Kỷ Dậu','Canh Tuất','Tân Hợi','Nhâm Tý','Quý Sửu',
  'Giáp Dần','Ất Mão','Bính Thìn','Đinh Tỵ','Mậu Ngọ','Kỷ Mùi','Canh Thân','Tân Dậu','Nhâm Tuất','Quý Hợi',
];
// LUC_THAP_HOA_GIAP: số hiệu (1..60) -> tên Can Chi, giống dict gốc trong notebook
const LUC_THAP_HOA_GIAP = {};
LUC_THAP_HOA_GIAP_LIST.forEach((name, i) => { LUC_THAP_HOA_GIAP[i+1] = name; });

const HAU_THIEN_SO = {
  'Càn': 6, 'Đoài': 7, 'Ly': 9, 'Chấn': 3, 'Tốn': 4, 'Khảm': 1, 'Cấn': 8, 'Khôn': [2, 5],
};

const THIEN_CAN_FROM_YEAR_LAST_DIGIT = {
  4: 'Giáp', 5: 'Ất', 6: 'Bính', 7: 'Đinh', 8: 'Mậu', 9: 'Kỷ', 0: 'Canh', 1: 'Tân', 2: 'Nhâm', 3: 'Quý',
};

function calculate_cung_phi_number(year) {
  const sum_digits = String(year).split('').reduce((a,d) => a + (parseInt(d,10) || 0), 0);
  let cung_phi_num = pymod(sum_digits, 9);
  if (cung_phi_num === 0) cung_phi_num = 9;
  return cung_phi_num;
}

function get_gua_from_cung_phi(gender, year_of_birth) {
  const cung_phi_num = calculate_cung_phi_number(year_of_birth);
  let matrix_type_gua, matrix_center_num;
  if (gender === 'male') { matrix_type_gua = 'Khôn'; matrix_center_num = 6; }
  else if (gender === 'female') { matrix_type_gua = 'Càn'; matrix_center_num = 1; }
  else throw new Error("Giới tính phải là 'male' hoặc 'female'");

  const generated_matrix = flying_star_matrix(matrix_type_gua, matrix_center_num);
  let row_idx = -1, col_idx = -1;
  for (let r = 0; r < 3 && row_idx === -1; r++) {
    for (let c = 0; c < 3; c++) {
      if (generated_matrix[r][c] === cung_phi_num) { row_idx = r; col_idx = c; break; }
    }
  }
  if (row_idx === -1) return { gua_name: null, matrix: generated_matrix, cung_phi_num, matrix_type_gua, matrix_center_num };
  const gua_name = LAC_THU_BA_GUA_ARRANGEMENT[row_idx][col_idx];
  return { gua_name, matrix: generated_matrix, cung_phi_num, row_idx, col_idx, matrix_type_gua, matrix_center_num };
}

function get_so_hieu_from_can_chi(can_chi_name) {
  for (const so_hieu in LUC_THAP_HOA_GIAP) {
    if (LUC_THAP_HOA_GIAP[so_hieu] === can_chi_name) return parseInt(so_hieu, 10);
  }
  return null;
}

function get_gua_from_hau_thien_so(num_value) {
  for (const gua in HAU_THIEN_SO) {
    const num = HAU_THIEN_SO[gua];
    if (Array.isArray(num)) { if (num.includes(num_value)) return gua; }
    else if (num_value === num) return gua;
  }
  return null;
}

function get_lac_thu_coordinates(gua_name) {
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
    if (LAC_THU_BA_GUA_ARRANGEMENT[r][c] === gua_name) return [r, c];
  }
  return [null, null];
}

function calculate_bien_khi(gua1, gua2) {
  const b1 = BA_GUA_BINARY[gua1], b2 = BA_GUA_BINARY[gua2];
  if (!b1 || !b2) return "Không tìm thấy quẻ nhị phân";
  const xor = parseInt(b1,2) ^ parseInt(b2,2);
  const xorStr = xor.toString(2).padStart(3,'0');
  return BIEN_KHI_MEANINGS[xorStr] || "Không tìm thấy ý nghĩa";
}

// LAC_THU_PATTERN: đường "phi tinh hệ Càn" — vị trí của các số 1..9 trong
// ma trận cơ sở flying_star_matrix('Càn', 1). (Biến này được dùng trong
// notebook gốc nhưng không có trong các cell còn lại; được suy ra chính xác
// bằng cách đối chiếu ngược lại toàn bộ output số đã in ra của notebook —
// xem ghi chú kiểm chứng ở cuối file.)
function buildLacThuPattern() {
  const base = flying_star_matrix('Càn', 1);
  const pattern = [];
  for (let v = 1; v <= 9; v++) {
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
      if (base[r][c] === v) pattern.push([r,c]);
    }
  }
  return pattern;
}
const LAC_THU_PATTERN = buildLacThuPattern();

const center_mapping = {1:1,2:9,3:8,4:7,5:6,6:2,7:4,8:3,9:2};

const start_positions_mapping = [
  { digits: [4,9], coords: [0,0] }, // Giáp, Kỷ
  { digits: [6,1], coords: [0,1] }, // Bính, Tân
  { digits: [8,3], coords: [0,2] }, // Mậu, Quý
  { digits: [7,2], coords: [2,1] }, // Đinh, Nhâm
  { digits: [5,0], coords: [2,2] }, // Mậu, Canh (giữ nguyên như notebook gốc)
];
function get_start_coords_le_cung(last_digit) {
  for (const {digits, coords} of start_positions_mapping) {
    if (digits.includes(last_digit)) return coords;
  }
  return null;
}
function pathIndexOf(path, coord) {
  for (let i=0;i<path.length;i++) if (coordEq(path[i],coord)) return i;
  return -1;
}

function calculateTamTuyetPhap(namSinhNam, namSinhNu, ngayCuoiCanChi, thangCuoiCanChi, namCuoi) {
  const result = {};

  // 1. Cung phi Nam & Nu
  const nam = get_gua_from_cung_phi('male', namSinhNam);
  const nu = get_gua_from_cung_phi('female', namSinhNu);
  result.cungPhiNam = nam;
  result.cungPhiNu = nu;

  // 2. Bien khi Nam vs Nu (Cung Phi ban menh)
  const bien_khi_meaning = calculate_bien_khi(nam.gua_name, nu.gua_name);
  result.bienKhiNamNu = bien_khi_meaning;

  // 3. Cuu Tinh Truc Nien (theo nam cuoi)
  const last_digit_nam_cuoi = pymod(namCuoi, 10);
  const thien_can_nam_cuoi = THIEN_CAN_FROM_YEAR_LAST_DIGIT[last_digit_nam_cuoi];
  const sum_digits_nam_cuoi = String(namCuoi).split('').reduce((a,d)=>a+(parseInt(d,10)||0),0);
  let modulo_result = pymod(sum_digits_nam_cuoi, 9);
  if (modulo_result === 0) modulo_result = 9;
  const center_for_cuu_tinh_matrix = center_mapping[modulo_result];
  const cuu_tinh_matrix = flying_star_matrix('Càn', center_for_cuu_tinh_matrix);
  result.cuuTinh = { thien_can_nam_cuoi, sum_digits_nam_cuoi, modulo_result, center_for_cuu_tinh_matrix, matrix: cuu_tinh_matrix };

  const [rN, cN] = get_lac_thu_coordinates(nam.gua_name);
  const gua_num_from_cuu_tinh_nam = cuu_tinh_matrix[rN][cN];
  const gua_from_cuu_tinh_nam = get_gua_from_hau_thien_so(gua_num_from_cuu_tinh_nam);
  const bien_khi_nam = calculate_bien_khi(nam.gua_name, gua_from_cuu_tinh_nam);
  result.cuuTinhNam = { coords:[rN,cN], num: gua_num_from_cuu_tinh_nam, gua: gua_from_cuu_tinh_nam, bienKhi: bien_khi_nam };

  const [rNu, cNu] = get_lac_thu_coordinates(nu.gua_name);
  const gua_num_from_cuu_tinh_nu = cuu_tinh_matrix[rNu][cNu];
  const gua_from_cuu_tinh_nu = get_gua_from_hau_thien_so(gua_num_from_cuu_tinh_nu);
  const bien_khi_nu = calculate_bien_khi(nu.gua_name, gua_from_cuu_tinh_nu);
  result.cuuTinhNu = { coords:[rNu,cNu], num: gua_num_from_cuu_tinh_nu, gua: gua_from_cuu_tinh_nu, bienKhi: bien_khi_nu };

  // 4. Le Cung Nien Van Do
  const so_hieu_ngay = get_so_hieu_from_can_chi(ngayCuoiCanChi);
  const so_hieu_thang = get_so_hieu_from_can_chi(thangCuoiCanChi);
  if (so_hieu_ngay === null || so_hieu_thang === null) {
    throw new Error("Không tìm thấy Can Chi của ngày hoặc tháng trong bảng Lục Thập Hoa Giáp.");
  }
  let so_buoc_di_chuyen;
  if (so_hieu_ngay === so_hieu_thang) {
    so_buoc_di_chuyen = 1; // Giả định 1 bước nếu ngày và tháng trùng số hiệu (như notebook gốc)
  } else if (so_hieu_ngay > so_hieu_thang) {
    so_buoc_di_chuyen = so_hieu_ngay - so_hieu_thang;
  } else {
    so_buoc_di_chuyen = 60 + so_hieu_ngay - so_hieu_thang;
  }

  const le_cung_base_matrix = flying_star_matrix('Càn', 5);
  const start_coords_le_cung = get_start_coords_le_cung(last_digit_nam_cuoi);
  if (!start_coords_le_cung) throw new Error(`Không tìm thấy vị trí bắt đầu cho chữ số cuối cùng của năm cưới ${last_digit_nam_cuoi}.`);
  const num_at_start_coords = le_cung_base_matrix[start_coords_le_cung[0]][start_coords_le_cung[1]];

  const idx_of_can_in_lac_thu_pattern = pathIndexOf(LAC_THU_PATTERN, [2,2]);
  const le_cung_flying_path_coords = LAC_THU_PATTERN.slice(idx_of_can_in_lac_thu_pattern).concat(LAC_THU_PATTERN.slice(0, idx_of_can_in_lac_thu_pattern));
  const start_index_in_le_cung_path = pathIndexOf(le_cung_flying_path_coords, start_coords_le_cung);
  const final_index = pymod(start_index_in_le_cung_path + so_buoc_di_chuyen, le_cung_flying_path_coords.length);
  const final_coords_le_cung = le_cung_flying_path_coords[final_index];
  const num_at_final_coords = le_cung_base_matrix[final_coords_le_cung[0]][final_coords_le_cung[1]];
  const gua_ban_cung_truc_nhat = get_gua_from_hau_thien_so(num_at_final_coords);

  const bien_khi_le_cung_nam = calculate_bien_khi(nam.gua_name, gua_ban_cung_truc_nhat);
  const bien_khi_le_cung_nu = calculate_bien_khi(nu.gua_name, gua_ban_cung_truc_nhat);

  result.leCung = {
    so_hieu_ngay, so_hieu_thang, so_buoc_di_chuyen,
    matrix: le_cung_base_matrix,
    start_coords_le_cung, num_at_start_coords,
    le_cung_flying_path_coords, start_index_in_le_cung_path,
    final_index, final_coords_le_cung, num_at_final_coords,
    gua_ban_cung_truc_nhat, bien_khi_le_cung_nam, bien_khi_le_cung_nu,
  };

  // 5. Tong hop Bien Khi
  const all_bien_khi_results = [bien_khi_meaning, bien_khi_nam, bien_khi_nu, bien_khi_le_cung_nam, bien_khi_le_cung_nu];
  const tuyet_menh_count = all_bien_khi_results.filter(x => x === 'Tuyệt mệnh').length;
  let finalMessage = "Không có biến khí 'Tuyệt mệnh' nào xuất hiện hoặc số lượng khác 1, 2, 3.";
  if (tuyet_menh_count === 1) finalMessage = "Phạm nhất tuyệt";
  else if (tuyet_menh_count === 2) finalMessage = "Phạm nhị tuyệt";
  else if (tuyet_menh_count === 3) finalMessage = "Phạm tam tuyệt";

  const tamTuyetPairs = [];
  if (tuyet_menh_count === 3) {
    if (bien_khi_le_cung_nam === 'Tuyệt mệnh') tamTuyetPairs.push({ thuong: gua_ban_cung_truc_nhat, ha: nam.gua_name, who: 'Nam' });
    if (bien_khi_le_cung_nu === 'Tuyệt mệnh') tamTuyetPairs.push({ thuong: gua_ban_cung_truc_nhat, ha: nu.gua_name, who: 'Nữ' });
  }

  result.tongHop = { all_bien_khi_results, tuyet_menh_count, finalMessage, tamTuyetPairs };

  return result;
}

/* =========================================================================
 * PHẦN 2 — GIAO DIỆN & HIỂN THỊ
 * ========================================================================= */

const selNgayCuoi = document.getElementById('sel-ngay-cuoi');
const selThangCuoi = document.getElementById('sel-thang-cuoi');
const inNamSinhNam = document.getElementById('in-nam-sinh-nam');
const inNamSinhNu = document.getElementById('in-nam-sinh-nu');
const inNamCuoi = document.getElementById('in-nam-cuoi');

LUC_THAP_HOA_GIAP_LIST.forEach((name, i) => {
  selNgayCuoi.add(new Option(`${i+1}. ${name}`, name));
  selThangCuoi.add(new Option(`${i+1}. ${name}`, name));
});

const PRESETS = [
  { namSinhNam: 1972, namSinhNu: 1978, ngay: 'Tân Dậu', thang: 'Kỷ Sửu', namCuoi: 2000 },
  { namSinhNam: 1990, namSinhNu: 1992, ngay: 'Giáp Tý', thang: 'Bính Dần', namCuoi: 2015 },
  { namSinhNam: 1985, namSinhNu: 1988, ngay: 'Mậu Thìn', thang: 'Quý Mão', namCuoi: 2022 },
];

document.querySelectorAll('.preset-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const p = PRESETS[parseInt(btn.dataset.preset)];
    inNamSinhNam.value = p.namSinhNam;
    inNamSinhNu.value = p.namSinhNu;
    selNgayCuoi.value = p.ngay;
    selThangCuoi.value = p.thang;
    inNamCuoi.value = p.namCuoi;
    cast();
  });
});

const CELL = 64, GAP_ORIGIN = 6;
function cellCenter3(r, c) { return [GAP_ORIGIN + c * CELL + CELL/2, GAP_ORIGIN + r * CELL + CELL/2]; }
function svgEl(tag, attrs) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  return el;
}

function renderGrid3(svgId) {
  const svg = document.getElementById(svgId);
  svg.innerHTML = "";
  const size = GAP_ORIGIN * 2 + CELL * 3;
  svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
  for (let i = 0; i <= 3; i++) {
    svg.appendChild(svgEl("line", { x1: GAP_ORIGIN, y1: GAP_ORIGIN + i*CELL, x2: GAP_ORIGIN + 3*CELL, y2: GAP_ORIGIN + i*CELL, stroke: "var(--line-strong)", "stroke-width": 1 }));
    svg.appendChild(svgEl("line", { x1: GAP_ORIGIN + i*CELL, y1: GAP_ORIGIN, x2: GAP_ORIGIN + i*CELL, y2: GAP_ORIGIN + 3*CELL, stroke: "var(--line-strong)", "stroke-width": 1 }));
  }
}

function drawCellContent3(svg, r, c, number, label, opts) {
  opts = opts || {};
  const [cx, cy] = cellCenter3(r, c);
  const t1 = svgEl("text", { x: cx, y: cy - 6, "text-anchor": "middle", "dominant-baseline": "middle", fill: opts.fill || "var(--paper)", "font-size": opts.size || 20, "font-weight": opts.weight || 600, "font-family": "'Spectral', serif" });
  t1.textContent = number;
  svg.appendChild(t1);
  if (label) {
    const t2 = svgEl("text", { x: cx, y: cy + 16, "text-anchor": "middle", "dominant-baseline": "middle", fill: "var(--paper-faint)", "font-size": 10.5, "font-family": "'IBM Plex Mono', monospace" });
    t2.textContent = label;
    svg.appendChild(t2);
  }
}

function highlightCell3(svg, coord, color, opacity) {
  if (coord[0] === null || coord[1] === null) return;
  const [cx, cy] = cellCenter3(coord[0], coord[1]);
  const rect = svgEl("rect", {
    x: cx - CELL/2 + 3, y: cy - CELL/2 + 3, width: CELL - 6, height: CELL - 6,
    fill: color, opacity: opacity !== undefined ? opacity : 0.2, stroke: color, "stroke-width": 1.6, rx: 2,
  });
  svg.appendChild(rect);
}

function drawGridWithMatrix(svgId, matrix) {
  renderGrid3(svgId);
  const svg = document.getElementById(svgId);
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
    const label = LAC_THU_BA_GUA_ARRANGEMENT[r][c];
    drawCellContent3(svg, r, c, matrix[r][c], label);
  }
}


function fmtCoord(c) { return `[${c[0]}, ${c[1]}]`; }

function cast() {
  const namSinhNam = parseInt(inNamSinhNam.value, 10);
  const namSinhNu = parseInt(inNamSinhNu.value, 10);
  const ngayCuoi = selNgayCuoi.value;
  const thangCuoi = selThangCuoi.value;
  const namCuoi = parseInt(inNamCuoi.value, 10);

  const errorBox = document.getElementById('error-msg');
  const result = document.getElementById('result');

  if (isNaN(namSinhNam) || isNaN(namSinhNu) || isNaN(namCuoi)) {
    result.style.display = 'none';
    errorBox.style.display = 'block';
    errorBox.textContent = 'Lỗi: Vui lòng nhập đầy đủ Năm sinh Nam / Nữ và Năm cưới (số nguyên hợp lệ).';
    return;
  }

  let r;
  try {
    r = calculateTamTuyetPhap(namSinhNam, namSinhNu, ngayCuoi, thangCuoi, namCuoi);
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
  const cinnabarColor = getComputedStyle(document.documentElement).getPropertyValue('--cinnabar').trim();

  // --- Cung Phi Nam ---
  drawGridWithMatrix('svg-cungphinam', r.cungPhiNam.matrix);
  highlightCell3(document.getElementById('svg-cungphinam'), [r.cungPhiNam.row_idx, r.cungPhiNam.col_idx], goldColor);
  document.getElementById('cungphinam-desc').innerHTML =
    `Năm sinh <b>${namSinhNam}</b> · Tổng chữ số mod 9 = <b>${r.cungPhiNam.cung_phi_num}</b> → tìm số ${r.cungPhiNam.cung_phi_num} trong ma trận Khôn (trung cung 6) tại ${fmtCoord([r.cungPhiNam.row_idx, r.cungPhiNam.col_idx])}.`;
  document.getElementById('cungphinam-symbol').textContent = TRIGRAM_SYMBOL[r.cungPhiNam.gua_name] || '';
  document.getElementById('cungphinam-name').textContent = r.cungPhiNam.gua_name || '—';
  document.getElementById('cpn-steps').innerHTML = `
    <b>Chi tiết các bước Cung Phi Nam:</b><br>
    1. Tổng chữ số năm sinh ${namSinhNam} mod 9 = <b>${r.cungPhiNam.cung_phi_num}</b><br>
    2. Ma trận phi tinh hệ <b>Khôn</b>, trung cung = <b>6</b><br>
    3. Vị trí số ${r.cungPhiNam.cung_phi_num} trong ma trận: <b>${fmtCoord([r.cungPhiNam.row_idx, r.cungPhiNam.col_idx])}</b><br>
    4. Tên quẻ tại vị trí đó (theo bảng Lạc Thư Bát Quái): <b>${r.cungPhiNam.gua_name}</b>
  `;

  // --- Cung Phi Nu ---
  drawGridWithMatrix('svg-cungphinu', r.cungPhiNu.matrix);
  highlightCell3(document.getElementById('svg-cungphinu'), [r.cungPhiNu.row_idx, r.cungPhiNu.col_idx], jadeColor);
  document.getElementById('cungphinu-desc').innerHTML =
    `Năm sinh <b>${namSinhNu}</b> · Tổng chữ số mod 9 = <b>${r.cungPhiNu.cung_phi_num}</b> → tìm số ${r.cungPhiNu.cung_phi_num} trong ma trận Càn (trung cung 1) tại ${fmtCoord([r.cungPhiNu.row_idx, r.cungPhiNu.col_idx])}.`;
  document.getElementById('cungphinu-symbol').textContent = TRIGRAM_SYMBOL[r.cungPhiNu.gua_name] || '';
  document.getElementById('cungphinu-name').textContent = r.cungPhiNu.gua_name || '—';
  document.getElementById('cpnu-steps').innerHTML = `
    <b>Chi tiết các bước Cung Phi Nữ:</b><br>
    1. Tổng chữ số năm sinh ${namSinhNu} mod 9 = <b>${r.cungPhiNu.cung_phi_num}</b><br>
    2. Ma trận phi tinh hệ <b>Càn</b>, trung cung = <b>1</b><br>
    3. Vị trí số ${r.cungPhiNu.cung_phi_num} trong ma trận: <b>${fmtCoord([r.cungPhiNu.row_idx, r.cungPhiNu.col_idx])}</b><br>
    4. Tên quẻ tại vị trí đó (theo bảng Lạc Thư Bát Quái): <b>${r.cungPhiNu.gua_name}</b>
  `;

  // --- Bien Khi Nam vs Nu ---
  document.getElementById('bienkhi-namnu-desc').innerHTML =
    `${TRIGRAM_SYMBOL[r.cungPhiNam.gua_name]} <b>${r.cungPhiNam.gua_name}</b> (${BA_GUA_BINARY[r.cungPhiNam.gua_name]}) XOR ${TRIGRAM_SYMBOL[r.cungPhiNu.gua_name]} <b>${r.cungPhiNu.gua_name}</b> (${BA_GUA_BINARY[r.cungPhiNu.gua_name]})`;
  document.getElementById('bienkhi-namnu-result').textContent = r.bienKhiNamNu;

  // --- Cuu Tinh Truc Nien ---
  drawGridWithMatrix('svg-cuutinh', r.cuuTinh.matrix);
  const svgCT = document.getElementById('svg-cuutinh');
  highlightCell3(svgCT, r.cuuTinhNam.coords, goldColor, 0.28);
  highlightCell3(svgCT, r.cuuTinhNu.coords, jadeColor, 0.28);
  document.getElementById('cuutinh-desc').innerHTML =
    `Năm cưới <b>${namCuoi}</b> · Tổng chữ số mod 9 = <b>${r.cuuTinh.modulo_result}</b> → Trung cung = <b>${r.cuuTinh.center_for_cuu_tinh_matrix}</b> (Thiên Can năm cưới: <b>${r.cuuTinh.thien_can_nam_cuoi}</b>).`;
  document.getElementById('cuutinh-nam-value').textContent = r.cuuTinhNam.bienKhi;
  document.getElementById('cuutinh-nam-formula').innerHTML =
    `Cung Phi Nam <b>${r.cungPhiNam.gua_name}</b> tại ${fmtCoord(r.cuuTinhNam.coords)} → số <b>${r.cuuTinhNam.num}</b> → Quẻ <b>${r.cuuTinhNam.gua}</b>`;
  document.getElementById('cuutinh-nu-value').textContent = r.cuuTinhNu.bienKhi;
  document.getElementById('cuutinh-nu-formula').innerHTML =
    `Cung Phi Nữ <b>${r.cungPhiNu.gua_name}</b> tại ${fmtCoord(r.cuuTinhNu.coords)} → số <b>${r.cuuTinhNu.num}</b> → Quẻ <b>${r.cuuTinhNu.gua}</b>`;
  document.getElementById('ct-steps').innerHTML = `
    <b>Chi tiết các bước Cửu Tinh Trực Niên:</b><br>
    1. Tổng chữ số năm cưới ${namCuoi} mod 9 = <b>${r.cuuTinh.modulo_result}</b> → Trung cung (theo bảng ánh xạ) = <b>${r.cuuTinh.center_for_cuu_tinh_matrix}</b><br>
    2. Ma trận Cửu Tinh Trực Niên (hệ Càn, trung cung ${r.cuuTinh.center_for_cuu_tinh_matrix})<br>
    3. Tọa độ Cung Phi Nam (${r.cungPhiNam.gua_name}) trong Lạc Thư: <b>${fmtCoord(r.cuuTinhNam.coords)}</b> → số tại đó = <b>${r.cuuTinhNam.num}</b> → Quẻ = <b>${r.cuuTinhNam.gua}</b> → Biến Khí = <b>${r.cuuTinhNam.bienKhi}</b><br>
    4. Tọa độ Cung Phi Nữ (${r.cungPhiNu.gua_name}) trong Lạc Thư: <b>${fmtCoord(r.cuuTinhNu.coords)}</b> → số tại đó = <b>${r.cuuTinhNu.num}</b> → Quẻ = <b>${r.cuuTinhNu.gua}</b> → Biến Khí = <b>${r.cuuTinhNu.bienKhi}</b>
  `;

  // --- Le Cung Nien Van Do ---
  drawGridWithMatrix('svg-lecung', r.leCung.matrix);
  const svgLC = document.getElementById('svg-lecung');
  highlightCell3(svgLC, r.leCung.start_coords_le_cung, goldColor, 0.28);
  highlightCell3(svgLC, r.leCung.final_coords_le_cung, cinnabarColor, 0.28);
  document.getElementById('lecung-desc').innerHTML =
    `Số hiệu Ngày cưới (${ngayCuoi}) = <b>${r.leCung.so_hieu_ngay}</b> · Số hiệu Tháng cưới (${thangCuoi}) = <b>${r.leCung.so_hieu_thang}</b> → Số bước di chuyển = <b>${r.leCung.so_buoc_di_chuyen}</b>.<br>
     Chữ số cuối năm cưới = <b>${pymod(namCuoi,10)}</b> → điểm xuất phát ${fmtCoord(r.leCung.start_coords_le_cung)} (số ${r.leCung.num_at_start_coords}) → di chuyển ${r.leCung.so_buoc_di_chuyen} bước trên đường phi tinh hệ Càn (chu kỳ 9 ô) → điểm đến ${fmtCoord(r.leCung.final_coords_le_cung)} (số ${r.leCung.num_at_final_coords}).`;
  document.getElementById('lecung-symbol').textContent = TRIGRAM_SYMBOL[r.leCung.gua_ban_cung_truc_nhat] || '';
  document.getElementById('lecung-name').textContent = `${r.leCung.gua_ban_cung_truc_nhat || '—'} (Bản cung trực nhật)`;
  document.getElementById('lecung-nam-value').textContent = r.leCung.bien_khi_le_cung_nam;
  document.getElementById('lecung-nu-value').textContent = r.leCung.bien_khi_le_cung_nu;
  document.getElementById('lc-steps').innerHTML = `
    <b>Chi tiết các bước Lệ Cung Niên Vận Đồ:</b><br>
    1. Số hiệu Ngày cưới = <b>${r.leCung.so_hieu_ngay}</b>, Số hiệu Tháng cưới = <b>${r.leCung.so_hieu_thang}</b><br>
    2. Số bước di chuyển = ${r.leCung.so_hieu_ngay === r.leCung.so_hieu_thang ? '1 (giả định do trùng số hiệu)' : (r.leCung.so_hieu_ngay > r.leCung.so_hieu_thang ? `${r.leCung.so_hieu_ngay} − ${r.leCung.so_hieu_thang} = <b>${r.leCung.so_buoc_di_chuyen}</b>` : `60 + ${r.leCung.so_hieu_ngay} − ${r.leCung.so_hieu_thang} = <b>${r.leCung.so_buoc_di_chuyen}</b>`)}<br>
    3. Ma trận Lệ Cung Niên Vận Đồ (hệ Càn, trung cung 5)<br>
    4. Điểm xuất phát (theo chữ số cuối năm cưới ${pymod(namCuoi,10)}): <b>${fmtCoord(r.leCung.start_coords_le_cung)}</b> → số <b>${r.leCung.num_at_start_coords}</b><br>
    5. Vị trí trên đường phi tinh hệ Càn sau ${r.leCung.so_buoc_di_chuyen} bước (mod 9, index ${r.leCung.start_index_in_le_cung_path} + ${r.leCung.so_buoc_di_chuyen} → ${r.leCung.final_index}): <b>${fmtCoord(r.leCung.final_coords_le_cung)}</b> → số <b>${r.leCung.num_at_final_coords}</b><br>
    6. Quẻ Bản cung trực nhật: <b>${r.leCung.gua_ban_cung_truc_nhat}</b><br>
    7. Biến Khí (Cung Phi Nam &amp; Bản cung trực nhật): <b>${r.leCung.bien_khi_le_cung_nam}</b><br>
    8. Biến Khí (Cung Phi Nữ &amp; Bản cung trực nhật): <b>${r.leCung.bien_khi_le_cung_nu}</b>
  `;

  // --- Tong Hop ---
  const labels = [
    `Cung Phi Nam (${r.cungPhiNam.gua_name}) ↔ Cung Phi Nữ (${r.cungPhiNu.gua_name})`,
    `Cung Phi Nam (${r.cungPhiNam.gua_name}) ↔ Cửu Tinh Trực Niên (${r.cuuTinhNam.gua})`,
    `Cung Phi Nữ (${r.cungPhiNu.gua_name}) ↔ Cửu Tinh Trực Niên (${r.cuuTinhNu.gua})`,
    `Cung Phi Nam (${r.cungPhiNam.gua_name}) ↔ Bản Cung Trực Nhật (${r.leCung.gua_ban_cung_truc_nhat})`,
    `Cung Phi Nữ (${r.cungPhiNu.gua_name}) ↔ Bản Cung Trực Nhật (${r.leCung.gua_ban_cung_truc_nhat})`,
  ];
  const tbody = document.getElementById('bienkhi-tbody');
  tbody.innerHTML = "";
  r.tongHop.all_bien_khi_results.forEach((val, i) => {
    const tr = document.createElement('tr');
    if (val === 'Tuyệt mệnh') tr.classList.add('is-tuyet');
    tr.innerHTML = `<td>${i+1}</td><td class="name-cell">${labels[i]}</td><td>${val}</td>`;
    tbody.appendChild(tr);
  });

  const verdictEl = document.getElementById('summary-verdict');
  verdictEl.textContent = `${r.tongHop.finalMessage} (${r.tongHop.tuyet_menh_count}/5 lần Tuyệt Mệnh)`;
  verdictEl.classList.toggle('is-alert', r.tongHop.tuyet_menh_count >= 1);

  const tamTuyetWrap = document.getElementById('tamtuyet-cards-wrap');
  const tamTuyetCards = document.getElementById('tamtuyet-cards');
  tamTuyetCards.innerHTML = "";
  if (r.tongHop.tuyet_menh_count === 3 && r.tongHop.tamTuyetPairs.length > 0) {
    tamTuyetWrap.style.display = 'block';
    r.tongHop.tamTuyetPairs.forEach(p => {
      const card = document.createElement('div');
      card.className = 'tamtuyet-card';
      card.innerHTML = `
        <div class="who">${p.who}</div>
        <div class="pair">${TRIGRAM_SYMBOL[p.thuong]} ${p.thuong} / ${TRIGRAM_SYMBOL[p.ha]} ${p.ha}</div>
      `;
      tamTuyetCards.appendChild(card);
    });
  } else {
    tamTuyetWrap.style.display = 'none';
  }

  // --- Steps Summary (đối chiếu print() gốc) ---
  document.getElementById('steps-body').innerHTML = `
    - Năm sinh Nam: <b>${namSinhNam}</b> → Cung Phi: <b>${r.cungPhiNam.gua_name}</b><br>
    - Năm sinh Nữ: <b>${namSinhNu}</b> → Cung Phi: <b>${r.cungPhiNu.gua_name}</b><br>
    - Biến Khí (Cung Phi Nam &amp; Nữ): <b>${r.bienKhiNamNu}</b><br>
    - Năm cưới: <b>${namCuoi}</b> · Thiên Can năm cưới: <b>${r.cuuTinh.thien_can_nam_cuoi}</b><br>
    - Trung cung Cửu Tinh Trực Niên: <b>${r.cuuTinh.center_for_cuu_tinh_matrix}</b><br>
    - Quẻ Cửu Tinh Trực Niên cho Nam: <b>${r.cuuTinhNam.gua}</b> → Biến Khí: <b>${r.cuuTinhNam.bienKhi}</b><br>
    - Quẻ Cửu Tinh Trực Niên cho Nữ: <b>${r.cuuTinhNu.gua}</b> → Biến Khí: <b>${r.cuuTinhNu.bienKhi}</b><br>
    - Số hiệu Ngày cưới (${ngayCuoi}): <b>${r.leCung.so_hieu_ngay}</b> | Số hiệu Tháng cưới (${thangCuoi}): <b>${r.leCung.so_hieu_thang}</b> | Số bước: <b>${r.leCung.so_buoc_di_chuyen}</b><br>
    - Quẻ Bản cung trực nhật: <b>${r.leCung.gua_ban_cung_truc_nhat}</b><br>
    - Biến Khí (Lệ Cung Nam): <b>${r.leCung.bien_khi_le_cung_nam}</b> | Biến Khí (Lệ Cung Nữ): <b>${r.leCung.bien_khi_le_cung_nu}</b><br>
    - Tất cả kết quả Biến Khí: <b>[${r.tongHop.all_bien_khi_results.join(', ')}]</b><br>
    - Số lần 'Tuyệt mệnh': <b>${r.tongHop.tuyet_menh_count}</b> → <b>${r.tongHop.finalMessage}</b>
  `;

  document.getElementById('input-echo').textContent =
    `Nam ${namSinhNam} · Nữ ${namSinhNu} · Ngày cưới ${ngayCuoi} · Tháng cưới ${thangCuoi} · Năm cưới ${namCuoi}`;
}

document.getElementById('cast-btn').addEventListener('click', cast);

selNgayCuoi.value = "Tân Dậu";
selThangCuoi.value = "Kỷ Sửu";

  /* ---- Unified Bridge ---- */
  if (typeof cast === 'function') {
    window.cast = cast;
    window.__KD_CAST = cast;
  } else {
    window.__KD_CAST = function() {};
  }
};
