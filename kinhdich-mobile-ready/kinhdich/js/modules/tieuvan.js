window.KD_MOD = window.KD_MOD || {};
window.KD_MOD["tieuvan"] = function() {
  const host = document.querySelector('.kd-mod[data-mod="tieuvan"]');
  if (!host) return;

  /* ---- Original Module Logic ---- */
/* =========================================================================
 * BẢNG 64 QUẺ DỊCH TRA CỨU
 * ========================================================================= */

  const { DICH_64_BY_PAIR, TRIGRAM_TUONG, TRIGRAM_SYMBOL } = window.KD_DATA || { DICH_64_BY_PAIR: {}, TRIGRAM_TUONG: {}, TRIGRAM_SYMBOL: {} };
  const { getName: getTenQueDichFromTrigrams } = window.KD_DICH || {
    getName: (u, l) => `${TRIGRAM_TUONG[u]||u} ${TRIGRAM_TUONG[l]||l}`
  };
  const { KHAM_BASE, transform } = window.KD_FLYINGSTAR || {
    KHAM_BASE: [[2, 3, 7], [6, 1, 5], [4, 8, 9]],
    transform: (m, k) => m
  };
  const { mod: pymod } = window.KD_UTIL || { mod: (n, m) => ((n % m) + m) % m };

const GUA_TRANSFORM = {
  'Khảm': 'flip_v',
  'Đoài': 'anti_transpose',
  'Ly':   'flip_h',
  'Cấn':  'transpose',
  'Khôn': 'transpose',
  'Chấn': 'rot180',
  'Tốn':  'e',
  'Càn':  'anti_transpose',
};

function flying_star_matrix(gua, center_number = 1) {
  const base = transform(KHAM_BASE, GUA_TRANSFORM[gua]);
  const shift = center_number - 1;
  return base.map(row => row.map(v => pymod(v - 1 + shift, 9) + 1));
}

// Bảng Lạc Thư (Ba Gua arrangement)
const LAC_THU_BA_GUA_ARRANGEMENT = [
  ['Tốn', 'Ly', 'Khôn'],
  ['Chấn', null, 'Đoài'],
  ['Cấn', 'Khảm', 'Càn'],
];

// Các quẻ dưới dạng số nhị phân
const BA_GUA_BINARY = {
  'Càn': '111', 'Đoài': '110', 'Ly': '101', 'Chấn': '100',
  'Tốn': '011', 'Khảm': '010', 'Cấn': '001', 'Khôn': '000',
};
const reverse_ba_gua_binary = Object.fromEntries(Object.entries(BA_GUA_BINARY).map(([k, v]) => [v, k]));

const HAU_THIEN_SO = {
  'Càn': 6, 'Đoài': 7, 'Ly': 9, 'Chấn': 3, 'Tốn': 4, 'Khảm': 1, 'Cấn': 8,
  'Khôn': [2, 5], 
};

const TIEN_THIEN_SO = {
  "Càn": 1, "Đoài": 2, "Ly": 3, "Chấn": 4, "Tốn": 5, "Khảm": 6, "Cấn": 7, "Khôn": 8,
};

const CHI_MAP = {
  0: 'Thân', 1: 'Dậu', 2: 'Tuất', 3: 'Hợi', 4: 'Tý', 5: 'Sửu',
  6: 'Dần', 7: 'Mão', 8: 'Thìn', 9: 'Tỵ', 10: 'Ngọ', 11: 'Mùi',
};

const CUU_TINH_TRUC_NIEN_MONTHS = {
  'Tý':   [8, 7, 6, 5, 4, 3, 2, 1, 9, 8, 7, 6],
  'Ngọ':  [8, 7, 6, 5, 4, 3, 2, 1, 9, 8, 7, 6],
  'Mão':  [8, 7, 6, 5, 4, 3, 2, 1, 9, 8, 7, 6],
  'Dậu':  [8, 7, 6, 5, 4, 3, 2, 1, 9, 8, 7, 6],
  'Thìn': [5, 4, 3, 2, 1, 9, 8, 7, 6, 5, 4, 3],
  'Tuất': [5, 4, 3, 2, 1, 9, 8, 7, 6, 5, 4, 3],
  'Sửu':  [5, 4, 3, 2, 1, 9, 8, 7, 6, 5, 4, 3],
  'Mùi':  [5, 4, 3, 2, 1, 9, 8, 7, 6, 5, 4, 3],
  'Dần':  [2, 1, 9, 8, 7, 6, 5, 4, 3, 2, 1, 9],
  'Thân': [2, 1, 9, 8, 7, 6, 5, 4, 3, 2, 1, 9],
  'Tỵ':   [2, 1, 9, 8, 7, 6, 5, 4, 3, 2, 1, 9],
  'Hợi':  [2, 1, 9, 8, 7, 6, 5, 4, 3, 2, 1, 9],
};

const THANG_SINH_SO_CUC = {
  1:  { so_tieu: 3, so_dai: 8 },  10: { so_tieu: 3, so_dai: 8 },
  2:  { so_tieu: 2, so_dai: 7 },  9:  { so_tieu: 2, so_dai: 7 },
  3:  { so_tieu: 4, so_dai: 9 },  8:  { so_tieu: 4, so_dai: 9 },
  4:  { so_tieu: 1, so_dai: 6 },  7:  { so_tieu: 1, so_dai: 6 },
  5:  { so_tieu: 5, so_dai: 10 }, 6:  { so_tieu: 5, so_dai: 10 },
  11: { so_tieu: 5, so_dai: 10 }, 12: { so_tieu: 5, so_dai: 10 },
};

const CHI_CYCLIC_ORDER = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

const MONTH_TO_CHI_MAP = {
  1: 'Dần', 2: 'Mão', 3: 'Thìn', 4: 'Tỵ', 5: 'Ngọ', 6: 'Mùi',
  7: 'Thân', 8: 'Dậu', 9: 'Tuất', 10: 'Hợi', 11: 'Tý', 12: 'Sửu',
};

function move_chi(current_chi, steps) {
  const current_idx = CHI_CYCLIC_ORDER.indexOf(current_chi);
  const new_idx = pymod(current_idx + steps, CHI_CYCLIC_ORDER.length);
  return CHI_CYCLIC_ORDER[new_idx];
}

function get_chi_from_year(year) {
  const remainder = pymod(year, 12);
  return CHI_MAP[remainder];
}

function calculate_cung_phi_number(year) {
  const sum_digits = String(year).split('').reduce((s, d) => s + parseInt(d, 10), 0);
  let cung_phi_num = pymod(sum_digits, 9);
  if (cung_phi_num === 0) cung_phi_num = 9;
  return cung_phi_num;
}

function get_gua_from_cung_phi(gender, year_of_birth) {
  const cung_phi_num = calculate_cung_phi_number(year_of_birth);

  let matrix_type_gua, matrix_center_num;
  if (gender === 'male') { matrix_type_gua = 'Khôn'; matrix_center_num = 6; }
  else if (gender === 'female') { matrix_type_gua = 'Càn'; matrix_center_num = 1; }
  else { throw new Error("Giới tính phải là 'male' hoặc 'female'"); }

  const generated_matrix = flying_star_matrix(matrix_type_gua, matrix_center_num);

  let row_idx = -1, col_idx = -1;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (generated_matrix[r][c] === cung_phi_num) { row_idx = r; col_idx = c; break; }
    }
    if (row_idx !== -1) break;
  }
  if (row_idx === -1) return { gua_name: null, generated_matrix, cung_phi_num };

  let gua_name;
  if (row_idx === 1 && col_idx === 1) {
    if (gender === 'male') gua_name = 'Khôn';
    else if (gender === 'female') gua_name = 'Cấn';
  } else {
    gua_name = LAC_THU_BA_GUA_ARRANGEMENT[row_idx][col_idx];
  }

  return { gua_name, generated_matrix, cung_phi_num };
}

function flipBit(binary6, haoNum) {
  const arr = binary6.split('');
  const idx = haoNum - 1;
  arr[idx] = arr[idx] === '0' ? '1' : '0';
  return arr.join('');
}

function nameOfBinary6(binary6) {
  const lowerBin = binary6.slice(0, 3), upperBin = binary6.slice(3, 6);
  const lowerName = reverse_ba_gua_binary[lowerBin];
  const upperName = reverse_ba_gua_binary[upperBin];
  return { lowerName, upperName, name: getTenQueDichFromTrigrams(upperName, lowerName) };
}

function calculateQueTieuVan(gender, year_of_birth, birth_month, qua_quoc_khi_van_do_binary, chi_of_year_to_calculate) {
  if (!/^[01]{6}$/.test(qua_quoc_khi_van_do_binary)) {
    throw new Error('Quẻ Quốc Khí Vận Đồ phải là chuỗi nhị phân đúng 6 ký tự, chỉ gồm 0 và 1.');
  }
  if (!Number.isInteger(year_of_birth) || year_of_birth < 1) {
    throw new Error('Năm sinh không hợp lệ.');
  }
  if (!THANG_SINH_SO_CUC[birth_month]) {
    throw new Error('Tháng sinh không hợp lệ.');
  }

  /* ---- Tính Cung Phi bản mệnh ---- */
  const { gua_name: cung_phi_gua, generated_matrix: cung_phi_matrix, cung_phi_num } = get_gua_from_cung_phi(gender, year_of_birth);
  let hau_thien_raw = HAU_THIEN_SO[cung_phi_gua];
  
  if (cung_phi_gua === 'Khôn' && Array.isArray(hau_thien_raw)) {
    hau_thien_raw = 2; // Default to 2 for Khôn as per python version 
  }
  const hau_thien_so_ban_menh = hau_thien_raw;

  /* ---- Số Lưỡng Tích / Hào Nguyên Đường ---- */
  const qua_don_1_binary = qua_quoc_khi_van_do_binary.slice(0, 3);
  const qua_don_2_binary = qua_quoc_khi_van_do_binary.slice(3, 6);
  const qua_don_1_name = reverse_ba_gua_binary[qua_don_1_binary];
  const qua_don_2_name = reverse_ba_gua_binary[qua_don_2_binary];
  const tien_thien_1 = TIEN_THIEN_SO[qua_don_1_name];
  const tien_thien_2 = TIEN_THIEN_SO[qua_don_2_name];
  const tong_so_tien_thien = tien_thien_1 + tien_thien_2;
  const so_luong_tich = tong_so_tien_thien + hau_thien_so_ban_menh;
  let hao_nguyen_duong = pymod(so_luong_tich, 6);
  if (hao_nguyen_duong === 0) hao_nguyen_duong = 6;

  /* ---- Số Tham Tích / Số lượng hào động ---- */
  const chi_for_birth_year = get_chi_from_year(year_of_birth);
  const sao_list_for_chi = CUU_TINH_TRUC_NIEN_MONTHS[chi_for_birth_year];
  const sao_thang_sinh = sao_list_for_chi[birth_month - 1];
  const so_tham_tich = so_luong_tich + sao_thang_sinh;
  const so_tieu = THANG_SINH_SO_CUC[birth_month].so_tieu;
  const so_dai = THANG_SINH_SO_CUC[birth_month].so_dai;

  let so_luong_hao_dong;
  let qua_quoc_khi_van_do_binary_modified = qua_quoc_khi_van_do_binary;
  let truongHopText;
  if (so_tham_tich < so_tieu) {
    so_luong_hao_dong = so_tieu - so_tham_tich;
    qua_quoc_khi_van_do_binary_modified = qua_quoc_khi_van_do_binary.split('').reverse().join('');
    truongHopText = `Tham Tích (${so_tham_tich}) &lt; Số Tiểu (${so_tieu}) → Quẻ Quốc Khí Vận Đồ bị đảo ngược.`;
  } else if (so_tieu < so_tham_tich && so_tham_tich < so_dai) {
    so_luong_hao_dong = pymod(so_tham_tich, so_tieu);
    if (so_luong_hao_dong === 0) so_luong_hao_dong = so_tieu;
    truongHopText = `Số Tiểu (${so_tieu}) &lt; Tham Tích (${so_tham_tich}) &lt; Số Đại (${so_dai}) → Quẻ Quốc Khí Vận Đồ giữ nguyên.`;
  } else if (so_tham_tich > so_dai) {
    so_luong_hao_dong = pymod(so_tham_tich, so_dai);
    if (so_luong_hao_dong === 0) so_luong_hao_dong = 6;
    if (so_luong_hao_dong > 6) {
      so_luong_hao_dong = pymod(so_luong_hao_dong, so_tieu);
      if (so_luong_hao_dong === 0) so_luong_hao_dong = so_tieu;
    }
    truongHopText = `Tham Tích (${so_tham_tich}) &gt; Số Đại (${so_dai}) → Quẻ Quốc Khí Vận Đồ giữ nguyên. Áp dụng quy tắc mới cho số hào động.`;
  } else {
    throw new Error(`Số Tham Tích (${so_tham_tich}) trùng đúng với Số Tiểu hoặc Số Đại — thuật toán Python gốc chưa định nghĩa trường hợp biên này.`);
  }

  /* ---- Âm Dương theo giới tính & năm sinh ---- */
  const is_year_even = pymod(year_of_birth, 2) === 0;
  let am_duong_type;
  if (gender === 'male') am_duong_type = is_year_even ? 'Nam+' : 'Nam-';
  else am_duong_type = is_year_even ? 'Nữ+' : 'Nữ-';

  let operation_sequence;
  if (am_duong_type === 'Nam+' || am_duong_type === 'Nữ-') operation_sequence = [3, -5];
  else operation_sequence = [5, -3];

  /* ---- Tòng Động Biến Hào → Quẻ Tiểu Vận ---- */
  const active_chis = [chi_for_birth_year];
  let current_chi_for_movement = chi_for_birth_year;
  if (so_luong_hao_dong > 1) {
    let op_idx = 0;
    for (let i = 0; i < so_luong_hao_dong - 1; i++) {
      const steps = operation_sequence[pymod(op_idx, operation_sequence.length)];
      current_chi_for_movement = move_chi(current_chi_for_movement, steps);
      active_chis.push(current_chi_for_movement);
      op_idx++;
    }
  }

  const active_hao_numbers_raw = [];
  const active_hao_numbers_unique = new Set();
  let current_hao_num_reference = hao_nguyen_duong;
  const chi_ty_idx = CHI_CYCLIC_ORDER.indexOf('Tý');

  for (let i = 0; i < so_luong_hao_dong; i++) {
    const target_chi = active_chis[i];
    const target_chi_idx = CHI_CYCLIC_ORDER.indexOf(target_chi);
    const num_steps_chi_cycle = pymod(target_chi_idx - chi_ty_idx, CHI_CYCLIC_ORDER.length);
    const current_hao_dong_num = pymod(current_hao_num_reference + num_steps_chi_cycle - 1, 6) + 1;
    active_hao_numbers_raw.push(current_hao_dong_num);
    active_hao_numbers_unique.add(current_hao_dong_num);
    current_hao_num_reference = current_hao_dong_num;
  }

  let que_tieu_van_arr = qua_quoc_khi_van_do_binary_modified.split('');
  active_hao_numbers_unique.forEach(hao_num => {
    const idx = hao_num - 1;
    que_tieu_van_arr[idx] = que_tieu_van_arr[idx] === '0' ? '1' : '0';
  });
  const que_tieu_van = que_tieu_van_arr.join('');

  /* ---- Quẻ Biến của Quẻ Tiểu Vận ---- */
  const qd1_bin = que_tieu_van.slice(0, 3), qd2_bin = que_tieu_van.slice(3, 6);
  const qd1_name = reverse_ba_gua_binary[qd1_bin], qd2_name = reverse_ba_gua_binary[qd2_bin];
  const tt1 = TIEN_THIEN_SO[qd1_name], tt2 = TIEN_THIEN_SO[qd2_name];
  const tong_so_tien_thien_tieu_van = tt1 + tt2;

  let hao_nguyen_duong_tieu_van = pymod(tong_so_tien_thien_tieu_van, 6);
  if (hao_nguyen_duong_tieu_van === 0) hao_nguyen_duong_tieu_van = 6;

  const chi_sinh_idx = CHI_CYCLIC_ORDER.indexOf(chi_for_birth_year);
  const num_steps_chi_cycle_tv = pymod(chi_sinh_idx - chi_ty_idx, CHI_CYCLIC_ORDER.length);
  let hao_dong_of_que_tieu_van = pymod(hao_nguyen_duong_tieu_van + num_steps_chi_cycle_tv - 1, 6) + 1;

  const que_bien_of_que_tieu_van = flipBit(que_tieu_van, hao_dong_of_que_tieu_van);

  /* ---- Vận từng tháng trong năm ---- */
  const sao_list_for_chi_current_year = CUU_TINH_TRUC_NIEN_MONTHS[chi_of_year_to_calculate];
  if (!sao_list_for_chi_current_year) {
    throw new Error(`Không tìm thấy dữ liệu sao cho Chi '${chi_of_year_to_calculate}'.`);
  }

  const monthly = [];
  for (let month = 1; month <= 12; month++) {
    const sao_thang_hien_tai = sao_list_for_chi_current_year[month - 1];

    // 1. Hào động của quẻ gốc của tháng (từ Quẻ Tiểu Vận)
    const sum_for_hao_dong = tong_so_tien_thien_tieu_van + hau_thien_so_ban_menh + sao_thang_hien_tai;
    let hao_dong_thang_hien_tai = pymod(sum_for_hao_dong, 6);
    if (hao_dong_thang_hien_tai === 0) hao_dong_thang_hien_tai = 6;

    // 2. Quẻ gốc của tháng = Quẻ Tiểu Vận biến tại hào động trên
    const que_goc_cua_thang = flipBit(que_tieu_van, hao_dong_thang_hien_tai);
    const gocThangInfo = nameOfBinary6(que_goc_cua_thang);

    // 3. Tổng số Tiên Thiên của Quẻ gốc của tháng
    const qd1b_goc = que_goc_cua_thang.slice(0, 3), qd2b_goc = que_goc_cua_thang.slice(3, 6);
    const qd1n_goc = reverse_ba_gua_binary[qd1b_goc], qd2n_goc = reverse_ba_gua_binary[qd2b_goc];
    const tong_tt_goc_thang = TIEN_THIEN_SO[qd1n_goc] + TIEN_THIEN_SO[qd2n_goc];

    // 4. Hào Nguyên Đường của Quẻ gốc của tháng
    let hao_nguyen_duong_goc_thang = pymod(tong_tt_goc_thang, 6);
    if (hao_nguyen_duong_goc_thang === 0) hao_nguyen_duong_goc_thang = 6;

    // 5. Từ Hào Nguyên Đường đặt làm "Tý", di chuyển thuận đến Chi của tháng hiện tại
    const chi_of_current_month = MONTH_TO_CHI_MAP[month];
    const chi_current_month_idx = CHI_CYCLIC_ORDER.indexOf(chi_of_current_month);
    const num_steps_chi_cycle_month = pymod(chi_current_month_idx - chi_ty_idx, CHI_CYCLIC_ORDER.length);
    const hao_dong_cuoi_cung_cua_thang = pymod(hao_nguyen_duong_goc_thang + num_steps_chi_cycle_month - 1, 6) + 1;

    // 6. Quẻ biến của tháng = Quẻ gốc của tháng biến tại hào động cuối cùng
    const que_bien_cua_thang = flipBit(que_goc_cua_thang, hao_dong_cuoi_cung_cua_thang);
    const bienThangInfo = nameOfBinary6(que_bien_cua_thang);

    monthly.push({
      month,
      sao: sao_thang_hien_tai,
      haoDong: hao_dong_thang_hien_tai,
      binaryGoc: que_goc_cua_thang,
      nameGoc: gocThangInfo.name,
      chiThang: chi_of_current_month,
      haoDongCuoi: hao_dong_cuoi_cung_cua_thang,
      binaryBien: que_bien_cua_thang,
      nameBien: bienThangInfo.name,
    });
  }

  const gocInfo = nameOfBinary6(que_tieu_van);
  const bienInfo = nameOfBinary6(que_bien_of_que_tieu_van);

  return {
    cung_phi_num, cung_phi_gua, cung_phi_matrix, hau_thien_so_ban_menh,
    qua_don_1_name, qua_don_2_name, tien_thien_1, tien_thien_2, tong_so_tien_thien,
    so_luong_tich, hao_nguyen_duong,
    chi_for_birth_year, sao_thang_sinh, so_tham_tich, so_tieu, so_dai, truongHopText,
    so_luong_hao_dong, qua_quoc_khi_van_do_binary_modified,
    am_duong_type, active_chis,
    active_hao_numbers: Array.from(active_hao_numbers_unique).sort((a, b) => a - b),
    que_tieu_van, gocInfo,
    tong_so_tien_thien_tieu_van, hao_nguyen_duong_tieu_van,
    hao_dong_of_que_tieu_van, que_bien_of_que_tieu_van, bienInfo,
    monthly,
  };
}

/* =========================================================================
 * GIAO DIỆN & HIỂN THỊ
 * ========================================================================= */

const DIA_CHI = ["Tý","Sửu","Dần","Mão","Thìn","Tỵ","Ngọ","Mùi","Thân","Dậu","Tuất","Hợi"];

const selGender = document.getElementById('sel-gender');
const inpYear = document.getElementById('inp-year');
const selMonth = document.getElementById('sel-month');
const inpBinary = document.getElementById('inp-binary');
const selNamTinh = document.getElementById('sel-namtinh');

for (let m = 1; m <= 12; m++) selMonth.add(new Option(`Tháng ${m}`, m));
DIA_CHI.forEach(c => selNamTinh.add(new Option(`Năm ${c}`, c)));

const PRESETS = [
  { gender: 'female', year: 1979, month: 9, binary: '101001', namtinh: 'Ngọ' },
  { gender: 'male', year: 1973, month: 7, binary: '110111', namtinh: 'Mùi' },
];

document.querySelectorAll('.preset-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const p = PRESETS[parseInt(btn.dataset.preset)];
    selGender.value = p.gender; inpYear.value = p.year;
    selMonth.value = p.month; inpBinary.value = p.binary;
    selNamTinh.value = p.namtinh;
    updatePreview();
    cast();
  });
});

function renderBarsToElement(elementId, binary6, activeHao = 0) {
  const container = host.querySelector('#' + elementId) || document.getElementById(elementId);
  if (window.KD_GRID) {
    window.KD_GRID.renderBars(container, binary6, activeHao);
  }
}

function cast() {
  const gender = selGender.value;
  const year = parseInt(inpYear.value, 10);
  const month = parseInt(selMonth.value, 10);
  const binary = inpBinary.value.trim();
  const namtinh = selNamTinh.value;

  const errorBox = document.getElementById('error-msg');
  const result = document.getElementById('result');

  let r;
  try {
    r = calculateQueTieuVan(gender, year, month, binary, namtinh);
  } catch (e) {
    result.style.display = 'none';
    errorBox.style.display = 'block';
    errorBox.textContent = '⚠ ' + e.message;
    return;
  }
  errorBox.style.display = 'none';
  result.style.display = 'block';

  document.getElementById('header-name').textContent = `${r.gocInfo.name}  →  ${r.bienInfo.name}`;

  document.getElementById('card-goc-title').textContent = r.gocInfo.name;
  document.getElementById('card-goc-symbols').textContent = `${r.gocInfo.upperName} / ${r.gocInfo.lowerName} (${TRIGRAM_SYMBOL[r.gocInfo.upperName]}${TRIGRAM_SYMBOL[r.gocInfo.lowerName]})`;
  renderBarsToElement('bars-goc', r.que_tieu_van, r.hao_dong_of_que_tieu_van);

  document.getElementById('card-bien-title').textContent = r.bienInfo.name;
  document.getElementById('card-bien-symbols').textContent = `${r.bienInfo.upperName} / ${r.bienInfo.lowerName} (${TRIGRAM_SYMBOL[r.bienInfo.upperName]}${TRIGRAM_SYMBOL[r.bienInfo.lowerName]})`;
  renderBarsToElement('bars-bien', r.que_bien_of_que_tieu_van, 0);

  document.getElementById('goc-binary').textContent = r.que_tieu_van;
  document.getElementById('bien-binary').textContent = r.que_bien_of_que_tieu_van;
  document.getElementById('haodong-value').textContent = `Hào ${r.hao_dong_of_que_tieu_van}`;
  document.getElementById('haodong-formula').innerHTML =
    `Hào Nguyên Đường (Tiểu Vận) = (${r.tong_so_tien_thien_tieu_van}) mod 6 = ${r.hao_nguyen_duong_tieu_van}<br>` +
    `Hào Động = (${r.hao_nguyen_duong_tieu_van} + số bước Tý→${r.chi_for_birth_year} − 1) mod 6 + 1 = ${r.hao_dong_of_que_tieu_van}`;

  // Bảng vận từng tháng
  const tbody = document.getElementById('months-tbody');
  tbody.innerHTML = "";
  r.monthly.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td class="month-cell">Tháng ${row.month}</td>` +
      `<td>${row.sao}</td>` +
      `<td class="name-cell">${row.nameGoc} <span style="color:var(--paper-faint);font-family:'IBM Plex Mono',monospace;font-size:11px;">(${row.binaryGoc}) · Hào ${row.haoDong}</span></td>` +
      `<td class="name-cell">${row.nameBien} <span style="color:var(--paper-faint);font-family:'IBM Plex Mono',monospace;font-size:11px;">(${row.binaryBien}) · ${row.chiThang} · Hào ${row.haoDongCuoi}</span></td>`;
    tbody.appendChild(tr);
  });

  // Các bước tính trung gian
  document.getElementById('steps-body').innerHTML = `
    <div class="sect">Cung Phi bản mệnh</div>
    - Giới tính: <b>${gender === 'male' ? 'Nam' : 'Nữ'}</b> · Năm sinh: <b>${year}</b><br>
    - Số Cung Phi: <b>${r.cung_phi_num}</b> → Cung Phi bản mệnh: <b>${r.cung_phi_gua}</b><br>
    - Số Hậu Thiên tương ứng Cung Phi: <b>${r.hau_thien_so_ban_menh}</b>

    <div class="sect">Số Lưỡng Tích &amp; Hào Nguyên Đường</div>
    - Quẻ Quốc Khí Vận Đồ: <b>${binary}</b> → Quẻ đơn 1 (${binary.slice(0,3)}) = ${r.qua_don_1_name} = ${r.tien_thien_1} · Quẻ đơn 2 (${binary.slice(3,6)}) = ${r.qua_don_2_name} = ${r.tien_thien_2}<br>
    - Tổng số Tiên Thiên: <b>${r.tong_so_tien_thien}</b><br>
    - Số Lưỡng Tích (Tổng Tiên Thiên + Hậu Thiên): <b>${r.so_luong_tich}</b><br>
    - Hào Nguyên Đường: <b>${r.hao_nguyen_duong}</b>

    <div class="sect">Số Tham Tích &amp; Số lượng hào động</div>
    - Chi năm sinh: <b>${r.chi_for_birth_year}</b> · Sao tương ứng tháng sinh (Tháng ${month}): <b>${r.sao_thang_sinh}</b><br>
    - Số Tham Tích (Lưỡng Tích + Sao tháng sinh): <b>${r.so_tham_tich}</b><br>
    - Số Tiểu / Số Đại (theo tháng sinh): <b>${r.so_tieu} / ${r.so_dai}</b><br>
    - ${r.truongHopText}<br>
    - Số lượng hào động: <b>${r.so_luong_hao_dong}</b><br>
    - Quẻ Quốc Khí Vận Đồ (sau điều chỉnh): <b>${r.qua_quoc_khi_van_do_binary_modified}</b>

    <div class="sect">Tòng Động Biến Hào → Quẻ Tiểu Vận</div>
    - Âm Dương: <b>${r.am_duong_type}</b><br>
    - Thứ tự Chi của các hào động: <b>${r.active_chis.join(' → ')}</b><br>
    - Các hào bị động (duy nhất): <b>${r.active_hao_numbers.join(', ')}</b><br>
    - Quẻ Tiểu Vận (sau khi đã động): <b>${r.que_tieu_van}</b> → <b>${r.gocInfo.name}</b>

    <div class="sect">Quẻ Biến của Quẻ Tiểu Vận</div>
    - Tổng số Tiên Thiên của Quẻ Tiểu Vận: <b>${r.tong_so_tien_thien_tieu_van}</b><br>
    - Hào Nguyên Đường của Quẻ Tiểu Vận: <b>${r.hao_nguyen_duong_tieu_van}</b><br>
    - Hào Động của Quẻ Tiểu Vận: <b>${r.hao_dong_of_que_tieu_van}</b><br>
    - Quẻ Biến của Quẻ Tiểu Vận: <b>${r.que_bien_of_que_tieu_van}</b> → <b>${r.bienInfo.name}</b>
  `;

  document.getElementById('input-echo').textContent =
    `${gender === 'male' ? 'Nam' : 'Nữ'} · Sinh ${year}/${month} · Quẻ QKVĐ ${binary} · Chi năm tính ${namtinh}`;
}

document.getElementById('cast-btn').addEventListener('click', cast);

/* ---- Xem trước hình dạng Quẻ Quốc Khí Vận Đồ theo số binary nhập vào ---- */
function updatePreview() {
  const raw = inpBinary.value.trim();
  const previewSection = document.getElementById('preview-section');
  const previewError = document.getElementById('preview-error');

  if (raw.length === 0) {
    previewSection.style.display = 'none';
    previewError.style.display = 'none';
    return;
  }

  if (!/^[01]{6}$/.test(raw)) {
    previewSection.style.display = 'none';
    previewError.style.display = 'block';
    previewError.textContent = '⚠ Quẻ Quốc Khí Vận Đồ phải là chuỗi nhị phân đúng 6 ký tự, chỉ gồm 0 và 1.';
    return;
  }

  previewError.style.display = 'none';
  previewSection.style.display = 'block';

  const info = nameOfBinary6(raw);
  document.getElementById('preview-name').textContent = info.name;
  document.getElementById('preview-title').textContent = info.name;
  document.getElementById('preview-symbols').textContent = `${info.upperName} / ${info.lowerName} (${TRIGRAM_SYMBOL[info.upperName]}${TRIGRAM_SYMBOL[info.lowerName]})`;
  renderBarsToElement('bars-preview', raw, 0);
}

inpBinary.addEventListener('input', updatePreview);

// Giá trị mặc định theo ví dụ trong thuật toán gốc
selGender.value = 'female'; inpYear.value = 1979; selMonth.value = 9;
inpBinary.value = '101001'; selNamTinh.value = 'Ngọ';
updatePreview();

  /* ---- Unified Bridge ---- */
  if (typeof cast === 'function') {
    window.cast = cast;
    window.__KD_CAST = cast;
  } else {
    window.__KD_CAST = function() {};
  }
};
