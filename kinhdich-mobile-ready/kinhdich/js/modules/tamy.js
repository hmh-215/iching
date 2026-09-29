window.KD_MOD = window.KD_MOD || {};
window.KD_MOD["tamy"] = function() {
  const host = document.querySelector('.kd-mod[data-mod="tamy"]');
  if (!host) return;

  /* ---- Original Module Logic ---- */
/* =========================================================================
 * PHẦN 1 — LÕI THUẬT TOÁN (BẢO TOÀN 100% TỪ NOTEBOOK GỐC tam_y_tam_sinh.ipynb)
 * ========================================================================= */

  const { KHAM_BASE, transform } = window.KD_FLYINGSTAR || {
    KHAM_BASE: [[2, 3, 7], [6, 1, 5], [4, 8, 9]],
    transform: (m, k) => m
  };
  const { mod: pymod, toggleStepBox } = window.KD_UTIL || {
    mod: (n, m) => ((n % m) + m) % m,
    toggleStepBox: id => document.getElementById(id)?.classList.toggle('open')
  };

function flyingStarMatrix(gua, centerNumber = 1) {
  const base = transform(KHAM_BASE, GUA_TRANSFORM[gua]);
  const shift = centerNumber - 1;
  return base.map(row => row.map(v => pymod(v - 1 + shift, 9) + 1));
}

// --- Dữ liệu tham khảo ---

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

const LUC_THAP_HOA_GIAP = {
  1:'Giáp Tý',2:'Ất Sửu',3:'Bính Dần',4:'Đinh Mão',5:'Mậu Thìn',6:'Kỷ Tỵ',7:'Canh Ngọ',8:'Tân Mùi',9:'Nhâm Thân',10:'Quý Dậu',
  11:'Giáp Tuất',12:'Ất Hợi',13:'Bính Tý',14:'Đinh Sửu',15:'Mậu Dần',16:'Kỷ Mão',17:'Canh Thìn',18:'Tân Tỵ',19:'Nhâm Ngọ',20:'Quý Mùi',
  21:'Giáp Thân',22:'Ất Dậu',23:'Bính Tuất',24:'Đinh Hợi',25:'Mậu Tý',26:'Kỷ Sửu',27:'Canh Dần',28:'Tân Mão',29:'Nhâm Thìn',30:'Quý Tỵ',
  31:'Giáp Ngọ',32:'Ất Mùi',33:'Bính Thân',34:'Đinh Dậu',35:'Mậu Tuất',36:'Kỷ Hợi',37:'Canh Tý',38:'Tân Sửu',39:'Nhâm Dần',40:'Quý Mão',
  41:'Giáp Thìn',42:'Ất Tỵ',43:'Bính Ngọ',44:'Đinh Mùi',45:'Mậu Thân',46:'Kỷ Dậu',47:'Canh Tuất',48:'Tân Hợi',49:'Nhâm Tý',50:'Quý Sửu',
  51:'Giáp Dần',52:'Ất Mão',53:'Bính Thìn',54:'Đinh Tỵ',55:'Mậu Ngọ',56:'Kỷ Mùi',57:'Canh Thân',58:'Tân Dậu',59:'Nhâm Tuất',60:'Quý Hợi',
};
const LUC_THAP_HOA_GIAP_REVERSE = Object.fromEntries(Object.entries(LUC_THAP_HOA_GIAP).map(([k,v]) => [v, parseInt(k)]));

const HAU_THIEN_SO = {
  'Càn': 6, 'Đoài': 7, 'Ly': 9, 'Chấn': 3, 'Tốn': 4, 'Khảm': 1, 'Cấn': 8, 'Khôn': [2, 5],
};

const THIEN_CAN_FROM_YEAR_LAST_DIGIT = {
  4:'Giáp',5:'Ất',6:'Bính',7:'Đinh',8:'Mậu',9:'Kỷ',0:'Canh',1:'Tân',2:'Nhâm',3:'Quý',
};

const CHI_MAP = {
  0:'Thân',1:'Dậu',2:'Tuất',3:'Hợi',4:'Tý',5:'Sửu',6:'Dần',7:'Mão',8:'Thìn',9:'Tỵ',10:'Ngọ',11:'Mùi',
};

const NGU_HO_DON_MAP = {
  'Giáp':'Bính','Kỷ':'Bính','Ất':'Mậu','Canh':'Mậu','Bính':'Canh','Tân':'Canh','Nhâm':'Nhâm','Đinh':'Nhâm','Mậu':'Giáp','Quý':'Giáp',
};

const THIEN_CAN_ORDER = ['Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý'];

const DIA_CHI_MONTH_ORDER = ['Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi','Tý','Sửu'];

const GUA_DIRECTIONS = {
  'Càn':'Tây Bắc', 'Đoài':'Tây', 'Ly':'Nam', 'Chấn':'Đông',
  'Tốn':'Đông Nam', 'Khảm':'Bắc', 'Cấn':'Đông Bắc', 'Khôn':'Tây Nam',
};

const CUU_TINH_TRUC_NIEN_MONTHS = {
  'Tý':  [8,7,6,5,4,3,2,1,9,8,7,6],
  'Ngọ': [8,7,6,5,4,3,2,1,9,8,7,6],
  'Mão': [8,7,6,5,4,3,2,1,9,8,7,6],
  'Dậu': [8,7,6,5,4,3,2,1,9,8,7,6],
  'Thìn':[5,4,3,2,1,9,8,7,6,5,4,3],
  'Tuất':[5,4,3,2,1,9,8,7,6,5,4,3],
  'Sửu': [5,4,3,2,1,9,8,7,6,5,4,3],
  'Mùi': [5,4,3,2,1,9,8,7,6,5,4,3],
  'Dần': [2,1,9,8,7,6,5,4,3,2,1,9],
  'Thân':[2,1,9,8,7,6,5,4,3,2,1,9],
  'Tỵ':  [2,1,9,8,7,6,5,4,3,2,1,9],
  'Hợi': [2,1,9,8,7,6,5,4,3,2,1,9],
};

const START_COORDINATES_MAP = {
  'Giáp':[0,0], 'Kỷ':[0,0], 'Bính':[0,1], 'Tân':[0,1], 'Mậu':[0,2], 'Quý':[0,2],
  'Canh':[2,2], 'Ất':[2,2], 'Nhâm':[2,1], 'Đinh':[2,1],
};

// --- Hàm tính toán ---

function calculateCungPhiNumber(year) {
  const sumDigits = String(year).split('').reduce((a, d) => a + parseInt(d), 0);
  let n = pymod(sumDigits, 9);
  if (n === 0) n = 9;
  return n;
}

function getGuaFromCungPhi(gender, yearOfBirth) {
  const cungPhiNum = calculateCungPhiNumber(yearOfBirth);
  let matrixTypeGua, matrixCenterNum;
  if (gender === 'male') { matrixTypeGua = 'Khôn'; matrixCenterNum = 6; }
  else if (gender === 'female') { matrixTypeGua = 'Càn'; matrixCenterNum = 1; }
  else throw new Error("Giới tính phải là 'male' hoặc 'female'");

  const generatedMatrix = flyingStarMatrix(matrixTypeGua, matrixCenterNum);

  let rowIdx = -1, colIdx = -1;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (generatedMatrix[r][c] === cungPhiNum) { rowIdx = r; colIdx = c; break; }
    }
    if (rowIdx !== -1) break;
  }
  if (rowIdx === -1) return { guaName: null, matrix: generatedMatrix, cungPhiNum, rowIdx, colIdx };

  let guaName;
  if (rowIdx === 1 && colIdx === 1) guaName = 'Khôn';
  else guaName = LAC_THU_BA_GUA_ARRANGEMENT[rowIdx][colIdx];

  return { guaName, matrix: generatedMatrix, cungPhiNum, rowIdx, colIdx, matrixTypeGua, matrixCenterNum };
}

function binaryXor(a, b) {
  let out = '';
  for (let i = 0; i < a.length; i++) out += (a[i] !== b[i]) ? '1' : '0';
  return out;
}

function getBienKhiMeaning(gua1, gua2) {
  const xorResult = binaryXor(BA_GUA_BINARY[gua1], BA_GUA_BINARY[gua2]);
  return BIEN_KHI_MEANINGS[xorResult] || 'Không xác định';
}

function findMatchingGuaForBienKhi(userGua, targetMeaning) {
  for (const guaName of Object.keys(BA_GUA_BINARY)) {
    if (getBienKhiMeaning(userGua, guaName) === targetMeaning) return guaName;
  }
  return null;
}

function getSingleHauThienSo(guaName) {
  const num = HAU_THIEN_SO[guaName];
  if (Array.isArray(num)) return 2; // Khôn luôn trả về 2
  return num;
}

function findGuaCoords(guaName) {
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (LAC_THU_BA_GUA_ARRANGEMENT[r][c] === guaName) return [r, c];
    }
  }
  return null;
}

function getCanFromYear(year) { return THIEN_CAN_FROM_YEAR_LAST_DIGIT[pymod(year, 10)]; }
function getChiFromYear(year) { return CHI_MAP[pymod(year, 12)]; }

function getMonthInfo(monthNum, canForYear, stepsToMove) {
  const canOfMonth1 = NGU_HO_DON_MAP[canForYear];
  if (!canOfMonth1) return null;

  const can1Index = THIEN_CAN_ORDER.indexOf(canOfMonth1);
  const canOfTargetMonthIndex = pymod(can1Index + (monthNum - 1), 10);
  const canForMonth = THIEN_CAN_ORDER[canOfTargetMonthIndex];

  const chiForMonth = DIA_CHI_MONTH_ORDER[pymod(monthNum - 1, 12)];

  const monthCanChiStr = `${canForMonth} ${chiForMonth}`;
  const initialIdx = LUC_THAP_HOA_GIAP_REVERSE[monthCanChiStr];
  if (!initialIdx) return null;

  // Ngày Can Chi hợp lệ đầu tiên trong vòng Lục Thập Hoa Giáp (chưa quy đổi ra ngày âm lịch)
  const firstValidDayIndex = pymod(initialIdx + stepsToMove - 1, 60) + 1;

  return { monthNumber: monthNum, canForMonth, chiForMonth, monthCanChiStr, initialIdx, firstValidDayIndex };
}

// Tính các ngày hợp lệ (ứng cát) trong tháng, quy đổi ra số ngày âm lịch dựa trên
// Can Chi của ngày mùng 1 do người dùng nhập, đúng theo thuật toán calculate_and_print_days
// mới (bản v4 — có xử lý "vòng giáp" của Lục Thập Hoa Giáp).
function getVongGiapStartIndex(lthgIndex) {
  if (lthgIndex === undefined || lthgIndex === null) return null;
  const lthgIndex0based = lthgIndex - 1;
  const vongGiap0based = Math.floor(lthgIndex0based / 10) * 10;
  return vongGiap0based + 1;
}

function getShiftedLthgIndex(originalLthgIndex, vongGiapStartIndex) {
  if (originalLthgIndex === undefined || originalLthgIndex === null ||
      vongGiapStartIndex === undefined || vongGiapStartIndex === null) return null;
  const shiftedIndex = pymod(originalLthgIndex - vongGiapStartIndex, 60);
  return shiftedIndex + 1;
}

function calculateDaysForMonth(monthNum, canForYear, chiForYear, stepsToMove, canForFirstDay, chiForFirstDay) {
  const info = getMonthInfo(monthNum, canForYear, stepsToMove);
  if (!info) return null;

  const day1Str = `${canForFirstDay} ${chiForFirstDay}`;
  const day1Index = LUC_THAP_HOA_GIAP_REVERSE[day1Str];
  if (!day1Index) {
    return { ...info, error: `Can Chi ngày đầu tiên '${day1Str}' không hợp lệ.` };
  }

  // 1. Sinh danh sách 7 ứng cử viên Can Chi hợp lệ (cách nhau 9 vị trí trong vòng 60)
  const rawValidDays = [];
  let currentIndexFor7Solutions = pymod(info.initialIdx - 1 + stepsToMove, 60) + 1;
  for (let i = 0; i < 7; i++) {
    const canChiStr = LUC_THAP_HOA_GIAP[currentIndexFor7Solutions];
    rawValidDays.push({ index: currentIndexFor7Solutions, canChi: canChiStr });
    currentIndexFor7Solutions = pymod(currentIndexFor7Solutions - 1 + 9, 60) + 1;
  }

  // 2. Xác định điểm bắt đầu "vòng giáp" của tháng
  const vongGiapStartIndex = getVongGiapStartIndex(info.initialIdx);

  // 3. Quy đổi chỉ số ngày mùng 1 theo vòng giáp của tháng
  const shiftedDay1LthgIndex = getShiftedLthgIndex(day1Index, vongGiapStartIndex);

  // 4. Xác định phạm vi quét hợp lệ
  const startScanLthg = shiftedDay1LthgIndex;
  let endScanLthg;
  if (startScanLthg <= 30) {
    endScanLthg = Math.min(60, startScanLthg + 29);
  } else {
    endScanLthg = 60;
  }

  const days = [];
  for (const { index: originalLthgIndex, canChi: validDayCanChiStr } of rawValidDays) {
    const shiftedLthgIndex = getShiftedLthgIndex(originalLthgIndex, vongGiapStartIndex);
    const isInScanRange = startScanLthg <= endScanLthg &&
      (startScanLthg <= shiftedLthgIndex && shiftedLthgIndex <= endScanLthg);

    if (isInScanRange) {
      const dayOfMonth = pymod(shiftedLthgIndex - shiftedDay1LthgIndex, 60) + 1;
      if (dayOfMonth >= 1 && dayOfMonth <= 30) {
        days.push({ dayOfMonth, canChi: validDayCanChiStr });
      }
    }
  }

  return { ...info, day1Str, day1Index, days };
}

function calculateThienYSinhKhi(gender, yearOfBirth, yearToCalculate, calculationType) {
  // Bước 1: Cung Phi bản mệnh
  const cungPhi = getGuaFromCungPhi(gender, yearOfBirth);
  if (!cungPhi.guaName) throw new Error('Không xác định được Cung Phi bản mệnh.');
  const cungPhiGua = cungPhi.guaName;

  // Bước 2: Quẻ Thiên Y / Sinh Khí
  const matchingGua = findMatchingGuaForBienKhi(cungPhiGua, calculationType);
  if (!matchingGua) throw new Error(`Không tìm thấy quẻ ${calculationType} cho Cung Phi '${cungPhiGua}'.`);

  // Bước 3: Ma trận Cửu Tinh Trực Nguyệt
  const cungPhiGuaCoords = findGuaCoords(cungPhiGua);
  if (!cungPhiGuaCoords) throw new Error(`Không tìm thấy tọa độ cho Cung Phi '${cungPhiGua}' trong Lạc Thư.`);

  const matchingGuaHauThienSo = getSingleHauThienSo(matchingGua);
  const baseCanMatrix = transform(KHAM_BASE, GUA_TRANSFORM['Càn']);
  const vAtCungPhiInBaseCan = baseCanMatrix[cungPhiGuaCoords[0]][cungPhiGuaCoords[1]];
  const shiftForCenterNum = pymod(matchingGuaHauThienSo - 1 - (vAtCungPhiInBaseCan - 1), 9);
  const centerNumForCanMatrix = shiftForCenterNum + 1;
  const cuuTinhTrucNguyetMatrix = flyingStarMatrix('Càn', centerNumForCanMatrix);

  // Bước 4: Lệ Cung Niên Vận Đồ (Can/Chi năm cần tính)
  const canForYear = getCanFromYear(yearToCalculate);
  const chiForYear = getChiFromYear(yearToCalculate);
  const startCoords = START_COORDINATES_MAP[canForYear];
  const valueAtStartCoords = cuuTinhTrucNguyetMatrix[startCoords[0]][startCoords[1]];

  // Bước 5: Vị trí quẻ Thiên Y/Sinh Khí trên ma trận & số bước
  const matchingGuaCoords = findGuaCoords(matchingGua);
  const valueAtMatchingGuaCoords = cuuTinhTrucNguyetMatrix[matchingGuaCoords[0]][matchingGuaCoords[1]];
  // Đúng theo notebook gốc: steps_to_move = (target - start + 9) % 9 (không lấy trị tuyệt đối)
  const stepsToMove = pymod(valueAtMatchingGuaCoords - valueAtStartCoords, 9);

  // Bước 6: Xác định (các) tháng phù hợp. Ngày cụ thể trong tháng cần người dùng
  // nhập Can Chi ngày mùng 1 (đầu tháng) rồi mới tính được — xem calculateDaysForMonth().
  const starsForChi = CUU_TINH_TRUC_NIEN_MONTHS[chiForYear];
  const monthIndices = [];
  starsForChi.forEach((v, idx) => { if (v === valueAtStartCoords) monthIndices.push(idx); });

  const monthsInfo = monthIndices.map(idx => getMonthInfo(idx + 1, canForYear, stepsToMove));

  // Bước 7: Hướng
  const direction = GUA_DIRECTIONS[matchingGua];

  return {
    cungPhi, cungPhiGua, matchingGua, matchingGuaHauThienSo,
    cungPhiGuaCoords, baseCanMatrix, vAtCungPhiInBaseCan, shiftForCenterNum, centerNumForCanMatrix,
    cuuTinhTrucNguyetMatrix, canForYear, chiForYear, startCoords, valueAtStartCoords,
    matchingGuaCoords, valueAtMatchingGuaCoords, stepsToMove,
    starsForChi, monthIndices, monthsInfo, direction,
  };
}

/* =========================================================================
 * PHẦN 2 — GIAO DIỆN & HIỂN THỊ
 * ========================================================================= */

const TRIGRAM_SYMBOL = { "Càn":"☰","Đoài":"☱","Ly":"☲","Chấn":"☳","Tốn":"☴","Khảm":"☵","Cấn":"☶","Khôn":"☷" };

const inNamSinh = document.getElementById('in-namsinh');
const inNamTinh = document.getElementById('in-namtinh');
const selGender = document.getElementById('sel-gender');
const selType = document.getElementById('sel-type');

const PRESETS = [
  { namsinh: 2003, namtinh: 2003, gender: 'male', type: 'Thiên y' },
  { namsinh: 2003, namtinh: 2003, gender: 'male', type: 'Sinh khí' },
  { namsinh: 2023, namtinh: 2027, gender: 'female', type: 'Thiên y' },
  { namsinh: 2023, namtinh: 2027, gender: 'female', type: 'Sinh khí' },
];

document.querySelectorAll('.preset-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const p = PRESETS[parseInt(btn.dataset.preset)];
    inNamSinh.value = p.namsinh; inNamTinh.value = p.namtinh;
    selGender.value = p.gender; selType.value = p.type;
    cast();
  });
});

const CELL = 80, GAP_ORIGIN = 6;
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
  return svg;
}

function highlightCell3(svg, r, c, color) {
  const [cx, cy] = cellCenter3(r, c);
  svg.appendChild(svgEl("rect", {
    x: cx - CELL/2 + 4, y: cy - CELL/2 + 4, width: CELL - 8, height: CELL - 8,
    fill: color, opacity: 0.2, stroke: color, "stroke-width": 1.6, rx: 3,
  }));
}

function drawCellText3(svg, r, c, text, opts) {
  const [cx, cy] = cellCenter3(r, c);
  const dy = opts.dy || 0;
  const t = svgEl("text", { x: cx, y: cy + dy, "text-anchor": "middle", "dominant-baseline": "middle", fill: opts.fill || "var(--paper)", "font-size": opts.size || 20, "font-weight": opts.weight || 600 });
  t.textContent = text;
  svg.appendChild(t);
}

function drawCellSub3(svg, r, c, text, opts) {
  const [cx, cy] = cellCenter3(r, c);
  const t = svgEl("text", { x: cx, y: cy + 20, "text-anchor": "middle", "dominant-baseline": "middle", fill: opts.fill || "var(--paper-faint)", "font-size": 10.5, "font-family": "'IBM Plex Mono', monospace" });
  t.textContent = text;
  svg.appendChild(t);
}


function cast() {
  const gender = selGender.value;
  const namSinh = parseInt(inNamSinh.value);
  const namTinh = parseInt(inNamTinh.value);
  const type = selType.value;

  const errorBox = document.getElementById('error-msg');
  const result = document.getElementById('result');

  let r;
  try {
    r = calculateThienYSinhKhi(gender, namSinh, namTinh, type);
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

  // --- Panel 1: Cung Phi ---
  const svgCP = renderGrid3('svg-cungphi');
  for (let rr = 0; rr < 3; rr++) for (let cc = 0; cc < 3; cc++) {
    const label = (rr === 1 && cc === 1) ? 'Khôn*' : (LAC_THU_BA_GUA_ARRANGEMENT[rr][cc] || '');
    drawCellText3(svgCP, rr, cc, String(r.cungPhi.matrix[rr][cc]), { fill: "var(--paper)" });
    drawCellSub3(svgCP, rr, cc, label, {});
  }
  highlightCell3(svgCP, r.cungPhi.rowIdx, r.cungPhi.colIdx, goldColor);

  document.getElementById('cungphi-desc').innerHTML =
    `Năm sinh <b>${namSinh}</b> (${gender === 'male' ? 'Nam' : 'Nữ'}) → Số Cung Phi = <b>${r.cungPhi.cungPhiNum}</b>. Ma trận nền: quẻ <b>${r.cungPhi.matrixTypeGua}</b>, trung cung = <b>${r.cungPhi.matrixCenterNum}</b>.`;
  document.getElementById('cungphi-symbol').textContent = TRIGRAM_SYMBOL[r.cungPhiGua];
  document.getElementById('cungphi-name').textContent = r.cungPhiGua;

  document.getElementById('cp-steps').innerHTML = `
    <b>Chi tiết các bước Cung Phi:</b><br>
    1. Tổng chữ số năm sinh ${namSinh} → mod 9 (0→9) = <b>${r.cungPhi.cungPhiNum}</b><br>
    2. Giới tính ${gender === 'male' ? 'Nam' : 'Nữ'} → ma trận nền <b>${r.cungPhi.matrixTypeGua}</b>, trung cung <b>${r.cungPhi.matrixCenterNum}</b><br>
    3. Vị trí số ${r.cungPhi.cungPhiNum} trong ma trận: hàng ${r.cungPhi.rowIdx}, cột ${r.cungPhi.colIdx}<br>
    4. Tra Lạc Thư (ô trung tâm quy ước là Khôn) → Cung Phi: <b>${r.cungPhiGua}</b>
  `;

  // --- Panel 2: Quẻ Thiên Y / Sinh Khí (text only) ---
  document.getElementById('bienkhi-title').textContent = `Quẻ ${type === 'Thiên y' ? 'Thiên Y' : 'Sinh Khí'}`;
  document.getElementById('bienkhi-desc').innerHTML =
    `XOR nhị phân giữa Cung Phi <b>${r.cungPhiGua}</b> (${BA_GUA_BINARY[r.cungPhiGua]}) và các quẻ còn lại, tìm kết quả mang nghĩa <b>${type}</b>.`;
  document.getElementById('bienkhi-symbol').textContent = TRIGRAM_SYMBOL[r.matchingGua];
  document.getElementById('bienkhi-name').textContent = r.matchingGua;
  document.getElementById('bienkhi-meaning').textContent = type === 'Thiên y' ? 'Thiên Y' : 'Sinh Khí';
  document.getElementById('bienkhi-direction').textContent = `Hướng: ${r.direction}`;

  document.getElementById('bk-steps').innerHTML = `
    <b>Chi tiết các bước Biến Khí:</b><br>
    1. Nhị phân Cung Phi ${r.cungPhiGua} = <b>${BA_GUA_BINARY[r.cungPhiGua]}</b><br>
    2. Duyệt các quẻ, XOR nhị phân, đối chiếu bảng ý nghĩa Bát Biến<br>
    3. Quẻ cho kết quả '${type}' = <b>${r.matchingGua}</b> (${BA_GUA_BINARY[r.matchingGua]})<br>
    4. XOR = ${binaryXor(BA_GUA_BINARY[r.cungPhiGua], BA_GUA_BINARY[r.matchingGua])} → <b>${type}</b>
  `;

  // --- Panel 3: Cửu Tinh Trực Nguyệt ---
  const svgCT = renderGrid3('svg-cuutinh');
  for (let rr = 0; rr < 3; rr++) for (let cc = 0; cc < 3; cc++) {
    const label = LAC_THU_BA_GUA_ARRANGEMENT[rr][cc] || 'Trung';
    drawCellText3(svgCT, rr, cc, String(r.cuuTinhTrucNguyetMatrix[rr][cc]), { fill: "var(--paper)" });
    drawCellSub3(svgCT, rr, cc, label, {});
  }
  highlightCell3(svgCT, r.startCoords[0], r.startCoords[1], jadeColor);
  highlightCell3(svgCT, r.matchingGuaCoords[0], r.matchingGuaCoords[1], cinnabarColor);

  document.getElementById('cuutinh-desc').innerHTML =
    `Số <b>${r.matchingGuaHauThienSo}</b> (Hậu Thiên số của quẻ ${r.matchingGua}) đặt tại vị trí quẻ <b>${r.cungPhiGua}</b> → trung cung hiệu chỉnh = <b>${r.centerNumForCanMatrix}</b> trên hệ quẻ Càn.`;
  document.getElementById('cuutinh-caption-gua').textContent = r.matchingGua;

  document.getElementById('ct-steps').innerHTML = `
    <b>Chi tiết các bước Cửu Tinh Trực Nguyệt:</b><br>
    1. Hậu Thiên số của quẻ ${r.matchingGua} = <b>${r.matchingGuaHauThienSo}</b><br>
    2. Ma trận nền quẻ Càn tại vị trí Cung Phi (${r.cungPhiGuaCoords.join(',')}) = <b>${r.vAtCungPhiInBaseCan}</b><br>
    3. Độ lệch (shift) = (${r.matchingGuaHauThienSo} − 1 − (${r.vAtCungPhiInBaseCan} − 1)) mod 9 = <b>${r.shiftForCenterNum}</b><br>
    4. Trung cung hiệu chỉnh = shift + 1 = <b>${r.centerNumForCanMatrix}</b><br>
    5. Ma trận Cửu Tinh Trực Nguyệt = flying_star_matrix('Càn', ${r.centerNumForCanMatrix})<br>
    6. Can năm ${namTinh} = <b>${r.canForYear}</b> → tọa độ khởi đầu ${r.startCoords.join(',')} → số sao = <b>${r.valueAtStartCoords}</b><br>
    7. Tọa độ quẻ ${r.matchingGua} = ${r.matchingGuaCoords.join(',')} → số sao = <b>${r.valueAtMatchingGuaCoords}</b><br>
    8. Số bước di chuyển = (${r.valueAtMatchingGuaCoords} − ${r.valueAtStartCoords} + 9) mod 9 = <b>${r.stepsToMove}</b>
  `;

  // --- Bảng sao - tháng ---
  document.getElementById('saothang-desc').innerHTML =
    `Chi năm <b>${namTinh}</b> = <b>${r.chiForYear}</b>. Highlight các tháng có số sao trùng với vị trí khởi đầu (<b>${r.valueAtStartCoords}</b>).`;
  const tbody = document.getElementById('saothang-tbody');
  tbody.innerHTML = "";
  const canOfMonth1 = NGU_HO_DON_MAP[r.canForYear];
  const can1Index = THIEN_CAN_ORDER.indexOf(canOfMonth1);
  r.starsForChi.forEach((star, idx) => {
    const monthNum = idx + 1;
    const canForMonth = THIEN_CAN_ORDER[pymod(can1Index + (monthNum - 1), 10)];
    const chiForMonth = DIA_CHI_MONTH_ORDER[pymod(monthNum - 1, 12)];
    const tr = document.createElement('tr');
    if (star === r.valueAtStartCoords) tr.classList.add('hl-start');
    tr.innerHTML = `<td>Tháng ${monthNum}</td><td class="name-cell">${canForMonth}</td><td class="name-cell">${chiForMonth}</td><td>${star}</td>`;
    tbody.appendChild(tr);
  });

  // --- Tháng & Ngày ---
  document.getElementById('months-desc').innerHTML =
    `Số bước di chuyển = <b>${r.stepsToMove}</b>. ${r.monthsInfo.length > 1 ? 'Có nhiều tháng phù hợp — hãy chọn Can Chi ngày mùng 1 (âm lịch) cho ' + 'từng' + ' tháng bên dưới.' : 'Hãy chọn Can Chi ngày mùng 1 (âm lịch) của tháng để tính ra các ngày ứng cát.'}`;
  const monthsContainer = document.getElementById('months-container');
  monthsContainer.innerHTML = "";
  if (r.monthsInfo.length === 0) {
    monthsContainer.innerHTML = `<p class="panel-desc">Không xác định được tháng phù hợp.</p>`;
  }
  r.monthsInfo.forEach(m => {
    if (!m) return;
    const block = document.createElement('div');
    block.className = 'month-block';
    block.innerHTML = `
      <div class="month-block-title">Tháng ${m.monthNumber} — ${m.monthCanChiStr}</div>
      <div class="month-block-sub">Do ứng dụng chưa có phần quy đổi lịch âm, vui lòng nhập can chi của ngày mùng 1 của tháng cần tính</div>
      <div class="day1-row">
        <label for="day1-sel-${m.monthNumber}">Ngày <b>mùng 1</b> (âm lịch) của tháng ${m.monthNumber} là Can Chi:</label>
        <select class="day1-select" id="day1-sel-${m.monthNumber}"></select>
        <button type="button" class="calc-days-btn">Tính ngày hợp lệ</button>
      </div>
      <div class="days-result"></div>
    `;
    monthsContainer.appendChild(block);

    const selectEl = block.querySelector('.day1-select');
    for (let i = 1; i <= 60; i++) {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = `${i}. ${LUC_THAP_HOA_GIAP[i]}`;
      selectEl.appendChild(opt);
    }

    const resultEl = block.querySelector('.days-result');
    const btnEl = block.querySelector('.calc-days-btn');

    const doCalcDays = () => {
      const canChiStr = LUC_THAP_HOA_GIAP[parseInt(selectEl.value)];
      const [can1, chi1] = canChiStr.split(' ');
      const dRes = calculateDaysForMonth(m.monthNumber, r.canForYear, r.chiForYear, r.stepsToMove, can1, chi1);

      if (!dRes || dRes.error) {
        resultEl.innerHTML = `<p class="panel-desc" style="color:var(--cinnabar)">${dRes ? dRes.error : 'Lỗi tính toán.'}</p>`;
        return;
      }
      if (dRes.days.length === 0) {
        resultEl.innerHTML = `<p class="panel-desc">Không có ngày hợp lệ nào trong tháng này.</p>`;
        return;
      }
      const daysHtml = dRes.days.map(d => `<div class="day-chip"><span class="idx">${d.canChi}</span> — ngày ${d.dayOfMonth}/${m.monthNumber}</div>`).join('');
      resultEl.innerHTML = `<div class="days-grid">${daysHtml}</div>`;
    };

    btnEl.addEventListener('click', doCalcDays);
  });

  // --- Steps Summary ---
  document.getElementById('steps-body').innerHTML = `
    - Cung Phi bản mệnh: <b>${r.cungPhiGua}</b> (số ${r.cungPhi.cungPhiNum})<br>
    - Quẻ ${type}: <b>${r.matchingGua}</b><br>
    - Hướng: <b>${r.direction}</b><br>
    - Can/Chi năm ${namTinh}: <b>${r.canForYear} ${r.chiForYear}</b><br>
    - Tọa độ khởi đầu: [${r.startCoords.join(',')}] = <b>${r.valueAtStartCoords}</b> | Tọa độ quẻ ${r.matchingGua}: [${r.matchingGuaCoords.join(',')}] = <b>${r.valueAtMatchingGuaCoords}</b><br>
    - Số bước di chuyển: <b>${r.stepsToMove}</b><br>
    - Các tháng khớp: <b>${r.monthIndices.map(i => i+1).join(', ') || 'Không có'}</b>
  `;

  document.getElementById('input-echo').textContent = `Sinh ${namSinh} · Tính ${namTinh} · ${gender === 'male' ? 'Nam' : 'Nữ'} · ${type}`;
}

document.getElementById('cast-btn').addEventListener('click', cast);

// Load mặc định
inNamSinh.value = 1990; inNamTinh.value = 2024; selGender.value = 'male'; selType.value = 'Thiên y';

  /* ---- Unified Bridge ---- */
  if (typeof cast === 'function') {
    window.cast = cast;
    window.__KD_CAST = cast;
  } else {
    window.__KD_CAST = function() {};
  }
};
