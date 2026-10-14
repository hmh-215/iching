window.KD_MOD = window.KD_MOD || {};
window.KD_MOD["cungsinh"] = function() {
  const host = document.querySelector('.kd-mod[data-mod="cungsinh"]');
  if (!host) return;

  /* ---- Original Module Logic ---- */
/* =========================================================================
 * PHẦN 1 — LÕI THUẬT TOÁN (DỊCH 1:1 TỪ Cung_sinh_cung_phi.ipynb, KHÔNG ĐỔI LOGIC)
 * ========================================================================= */

  const { KHAM_BASE, transform } = window.KD_FLYINGSTAR || {
    KHAM_BASE: [[2, 3, 7], [6, 1, 5], [4, 8, 9]],
    transform: (m, k) => m
  };

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

function flyingStarMatrix(gua, centerNumber = 1) {
  const base = transform(KHAM_BASE, GUA_TRANSFORM[gua]);
  const shift = centerNumber - 1;
  return base.map(row => row.map(v => ((v - 1 + shift) % 9) + 1));
}

// ---- Cell 1: Bảng địa chi / Cung Sinh 1 / Cung Sinh 2 ----
const DIA_CHI_TABLE_CUNG_SINH = [
  ['Tỵ', 'Ngọ', 'Mùi', 'Thân'],
  ['Thìn', null, null, 'Dậu'],
  ['Mão', null, null, 'Tuất'],
  ['Dần', 'Sửu', 'Tý', 'Hợi'],
];

const CUNG_SINH_TABLE_1 = [
  [4, 9, 2, 2],
  [4, null, null, 7],
  [3, null, null, 6],
  [8, 8, 3, 6],
];

const CUNG_SINH_TABLE_2 = [
  [4, 5, 6],
  [3, null, 7],
  [2, null, 8],
  [1, null, 9],
];

// ---- Cell 2: Đường đi + các bảng tra + hàm tính ----
const CUNG_SINH_TABLE_1_PATH = [
  [3,2], [3,3], [2,3], [1,3], [0,3], [0,2], [0,1], [0,0], [1,0], [2,0], [3,0], [3,1]
];

const CUNG_SINH_TABLE_2_PATH = [
  [0,0], [0,1], [0,2], [1,2], [2,2], [3,2], [3,0], [2,0], [1,0]
];

const HOU_THIEN_NUMBER_TO_GUA_NAME = {
  6: 'Càn', 7: 'Đoài', 9: 'Ly', 3: 'Chấn', 4: 'Tốn', 1: 'Khảm', 8: 'Cấn', 2: 'Khôn'
};

const GUA_TO_NGU_HANH = {
  'Càn': 'Kim', 'Đoài': 'Kim',
  'Ly': 'Hỏa',
  'Chấn': 'Mộc', 'Tốn': 'Mộc',
  'Khảm': 'Thủy',
  'Cấn': 'Thổ', 'Khôn': 'Thổ'
};

const NGU_HANH_SINH_MAP = {
  'Kim': 'Thủy', 'Thủy': 'Mộc', 'Mộc': 'Hỏa', 'Hỏa': 'Thổ', 'Thổ': 'Kim'
};

const NGU_HANH_KHAC_MAP = {
  'Kim': 'Mộc', 'Mộc': 'Thổ', 'Thổ': 'Thủy', 'Thủy': 'Hỏa', 'Hỏa': 'Kim'
};

const GUA_TO_BINARY_MAP = {
  'Càn': '111', 'Đoài': '110', 'Ly': '101', 'Chấn': '100', 'Tốn': '011', 'Khảm': '010', 'Cấn': '001', 'Khôn': '000'
};

const XOR_RESULT_TO_BIEN_KHI = {
  '001': 'Sinh khí', '011': 'Ngũ quỷ', '111': 'Diên niên', '101': 'Lục sát',
  '100': 'Họa hại', '110': 'Thiên y', '010': 'Tuyệt mệnh', '000': 'Phục vị'
};

const { TRIGRAM_SYMBOL, TRIGRAM_TUONG, DICH_64_BY_PAIR, CAN_DUONG, CAN_AM, CHI_DUONG, CHI_AM } = window.KD_DATA || {
  TRIGRAM_SYMBOL: {}, TRIGRAM_TUONG: {}, DICH_64_BY_PAIR: {},
  CAN_DUONG: ['Giáp', 'Bính', 'Mậu', 'Canh', 'Nhâm'],
  CAN_AM: ['Ất', 'Đinh', 'Kỷ', 'Tân', 'Quý'],
  CHI_DUONG: ['Tý', 'Dần', 'Thìn', 'Ngọ', 'Thân', 'Tuất'],
  CHI_AM: ['Sửu', 'Mão', 'Tỵ', 'Mùi', 'Dậu', 'Hợi']
};

function getTenQueDichFromTrigrams(upper, lower) {
  if (window.KD_DICH) return window.KD_DICH.getName(upper, lower);
  if (!TRIGRAM_TUONG[upper] || !TRIGRAM_TUONG[lower]) return "Không xác định";
  const key = `${upper}_${lower}`;
  if (DICH_64_BY_PAIR[key]) return DICH_64_BY_PAIR[key];
  if (upper === lower) return `Thuần ${upper}`;
  return `${TRIGRAM_TUONG[upper]} ${TRIGRAM_TUONG[lower]}`;
}

function isValidCanChi(canHour, chiHour) {
  const canIsDuong = CAN_DUONG.includes(canHour);
  const canIsAm = CAN_AM.includes(canHour);
  const chiIsDuong = CHI_DUONG.includes(chiHour);
  const chiIsAm = CHI_AM.includes(chiHour);
  if (canIsDuong && chiIsDuong) return true;
  if (canIsAm && chiIsAm) return true;
  return false;
}

function pathIndexOfCoord(path, coord) {
  for (let i = 0; i < path.length; i++) if (path[i][0] === coord[0] && path[i][1] === coord[1]) return i;
  return -1;
}

function findChiStartIndexOnPath(chiHourValue) {
  let chiTableCoords = null;
  for (let r = 0; r < DIA_CHI_TABLE_CUNG_SINH.length; r++) {
    for (let c = 0; c < DIA_CHI_TABLE_CUNG_SINH[r].length; c++) {
      if (DIA_CHI_TABLE_CUNG_SINH[r][c] === chiHourValue) { chiTableCoords = [r, c]; break; }
    }
    if (chiTableCoords) break;
  }
  if (!chiTableCoords) {
    throw new Error(`Địa chi '${chiHourValue}' không tìm thấy trong Bảng địa chi Cung Sinh.`);
  }
  const idx = pathIndexOfCoord(CUNG_SINH_TABLE_1_PATH, chiTableCoords);
  if (idx === -1) {
    throw new Error(`Tọa độ (${chiTableCoords}) của địa chi '${chiHourValue}' không tìm thấy trên đường đi Cung Sinh 1.`);
  }
  return { idx, chiTableCoords };
}

function calculateCungSinhValue(canHour, chiHour) {
  const { idx: startPathIndex } = findChiStartIndexOnPath(chiHour);
  const canIndex = CAN_OPTIONS.indexOf(canHour);
  const finalPathIndex = (startPathIndex + canIndex) % CUNG_SINH_TABLE_1_PATH.length;
  const finalCoords = CUNG_SINH_TABLE_1_PATH[finalPathIndex];
  const cungSinhValue = CUNG_SINH_TABLE_1[finalCoords[0]][finalCoords[1]];
  return { cungSinhValue, finalCoords, startPathIndex, finalPathIndex, canIndex };
}

function findStartCoordsOnTable2(valueFromTable1) {
  for (let r = 0; r < CUNG_SINH_TABLE_2.length; r++) {
    for (let c = 0; c < CUNG_SINH_TABLE_2[r].length; c++) {
      if (CUNG_SINH_TABLE_2[r][c] === valueFromTable1) return [r, c];
    }
  }
  throw new Error(`Giá trị '${valueFromTable1}' từ Bảng Cung Sinh 1 không tìm thấy trong Bảng Cung Sinh 2.`);
}

function getNguHanh(guaName) {
  if (guaName === 'Trung Cung' || guaName === 'Không xác định') return null;
  return GUA_TO_NGU_HANH[guaName] || null;
}

function calculateSinhKhacRelationship(cungSinhGuaName, cungPhiGuaName) {
  const nguHanhSinh = getNguHanh(cungSinhGuaName);
  const nguHanhPhi = getNguHanh(cungPhiGuaName);

  if (nguHanhSinh === null || nguHanhPhi === null) {
    return { text: "Không thể tính Sinh-Khắc (một trong các quẻ không xác định Ngũ Hành hoặc là Trung Cung).", tag: "unknown" };
  }
  if (nguHanhSinh === nguHanhPhi) {
    return { text: `Ngũ hành của cung sinh (${nguHanhSinh}) bằng cung phi (${nguHanhPhi}) (trung bình)`, tag: "neutral" };
  }
  if (NGU_HANH_SINH_MAP[nguHanhSinh] === nguHanhPhi) {
    return { text: `Ngũ hành của cung sinh (${nguHanhSinh}) sinh cung phi (${nguHanhPhi}) (tốt nhất)`, tag: "best" };
  }
  if (NGU_HANH_SINH_MAP[nguHanhPhi] === nguHanhSinh) {
    return { text: `Ngũ hành của cung phi (${nguHanhPhi}) sinh cung sinh (${nguHanhSinh}) (xấu nhì)`, tag: "bad" };
  }
  if (NGU_HANH_KHAC_MAP[nguHanhSinh] === nguHanhPhi) {
    return { text: `Ngũ hành của cung sinh (${nguHanhSinh}) khắc cung phi (${nguHanhPhi}) (xấu nhất)`, tag: "worst" };
  }
  if (NGU_HANH_KHAC_MAP[nguHanhPhi] === nguHanhSinh) {
    return { text: `Ngũ hành của cung phi (${nguHanhPhi}) khắc cung sinh (${nguHanhSinh}) (tốt nhì)`, tag: "good" };
  }
  return { text: "Không có mối quan hệ Sinh-Khắc trực tiếp được định nghĩa.", tag: "unknown" };
}

function calculateBienKhi(gua1Name, gua2Name) {
  const binary1 = GUA_TO_BINARY_MAP[gua1Name];
  const binary2 = GUA_TO_BINARY_MAP[gua2Name];

  if (!binary1 || !binary2) {
    return { text: "Không thể tính Biến Khí (một trong các quẻ không có giá trị nhị phân).", bienKhi: null };
  }

  const int1 = parseInt(binary1, 2);
  const int2 = parseInt(binary2, 2);
  const xorResultInt = int1 ^ int2;
  const xorResultBinaryStr = xorResultInt.toString(2).padStart(3, '0');
  const bienKhi = XOR_RESULT_TO_BIEN_KHI[xorResultBinaryStr] || "Không xác định Biến Khí";

  return {
    text: `Biến Khí giữa quẻ ${gua1Name} và quẻ ${gua2Name} (XOR ${binary1} và ${binary2} = ${xorResultBinaryStr}): ${bienKhi}`,
    bienKhi, binary1, binary2, xorResultBinaryStr
  };
}

// ---- Cell 4: Widget dropdown options + Lạc Thư mapping + on_save_button_clicked ----
const GENDER_OPTIONS = ['Nam', 'Nữ'];
const CAN_OPTIONS = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
const CHI_OPTIONS = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

// Lạc Thư position-to-Gua mapping (khớp visual: 0=trên, 2=dưới)
const LAC_THU_POSITION_TO_GUA = {
  '0,0': 'Tốn', '0,1': 'Ly', '0,2': 'Khôn',
  '1,0': 'Chấn', '1,1': 'Trung Cung', '1,2': 'Đoài',
  '2,0': 'Cấn', '2,1': 'Khảm', '2,2': 'Càn'
};
function posKey(r, c) { return `${r},${c}`; }

/**
 * Hàm tổng hợp, dịch 1:1 nội dung của on_save_button_clicked trong notebook gốc.
 * Không thay đổi bất kỳ bước tính toán/điều kiện đặc biệt nào.
 */
function calculateCungSinhCungPhi(gender, birthYear, canHour, chiHour) {
  const log = [];
  log.push("Thông tin người dùng đã nhập:");
  log.push(`- Giới tính: ${gender}`);
  log.push(`- Năm sinh: ${birthYear}`);
  log.push(`- Can giờ sinh: ${canHour}`);
  log.push(`- Chi giờ sinh: ${chiHour}`);

  log.push("");
  log.push("-- Tính toán Cung Phi --");

  // 1. Tổng chữ số năm sinh, mod 9
  const yearStr = String(birthYear);
  let yearSum = 0;
  for (const ch of yearStr) {
    if (ch >= '0' && ch <= '9') yearSum += parseInt(ch, 10);
  }
  let cungPhiNumber = yearSum % 9;
  if (cungPhiNumber === 0) cungPhiNumber = 9;

  log.push(`Tổng các chữ số của năm sinh (${birthYear}) là ${yearSum}.`);
  log.push(`Số cung phi tính toán (tổng mod 9) là: ${cungPhiNumber}`);

  // 2. Quẻ gốc + trung cung theo giới tính
  let baseGua = '', centerValue = 0;
  if (gender === 'Nam') { baseGua = 'Khôn'; centerValue = 6; }
  else if (gender === 'Nữ') { baseGua = 'Càn'; centerValue = 1; }

  log.push(`Giới tính '${gender}' -> Dùng quẻ '${baseGua}' với trung cung ban đầu là '${centerValue}'.`);

  // 3. Sinh ma trận Cung Phi
  const cungPhiMatrix = flyingStarMatrix(baseGua, centerValue);

  log.push("");
  log.push("Ma trận Cung Phi tương ứng:");
  for (let r = 2; r >= 0; r--) log.push(`[${cungPhiMatrix[r].join(', ')}]`);

  // 4. Tìm vị trí số cung phi trong ma trận
  let cungPhiGuaName = "Không xác định";
  let foundInternalPos = null;
  let adjustedVisualPos = null;

  for (let rIdx = 0; rIdx < 3; rIdx++) {
    for (let cIdx = 0; cIdx < 3; cIdx++) {
      if (cungPhiMatrix[rIdx][cIdx] === cungPhiNumber) { foundInternalPos = [rIdx, cIdx]; break; }
    }
    if (foundInternalPos) break;
  }

  if (foundInternalPos) {
    const visualR = 2 - foundInternalPos[0];
    const visualC = foundInternalPos[1];
    adjustedVisualPos = [visualR, visualC];

    if (foundInternalPos[0] === 1 && foundInternalPos[1] === 1) {
      if (gender === 'Nam') cungPhiGuaName = 'Khôn';
      else if (gender === 'Nữ') cungPhiGuaName = 'Cấn';
    } else {
      cungPhiGuaName = LAC_THU_POSITION_TO_GUA[posKey(visualR, visualC)] || "Không tìm thấy quẻ tương ứng";
    }
    log.push("");
    log.push(`Số cung phi '${cungPhiNumber}' nằm ở vị trí (${foundInternalPos}) trong ma trận nội bộ, tương ứng với vị trí (${adjustedVisualPos}) trên Lạc Thư, ứng với quẻ: ${cungPhiGuaName}`);
  } else {
    log.push("");
    log.push(`Số cung phi '${cungPhiNumber}' không tìm thấy trong ma trận Cung Phi.`);
  }

  log.push("");
  log.push("-- Tính toán Cung Sinh --");
  let finalGuaName = "Không xác định";
  let cungSinhDetail = null;

  try {
    const { cungSinhValue, finalCoords, canIndex } = calculateCungSinhValue(canHour, chiHour);
    log.push(`Can giờ sinh: '${canHour}', Chi giờ sinh: '${chiHour}'.`);
    log.push(`Tọa độ kết thúc trên bảng cung sinh 1 kèm số tương ứng: (${finalCoords}) với số ${cungSinhValue}.`);

    // Bước 1: tọa độ bắt đầu trên bảng Cung Sinh 2
    const startCoordsTable2 = findStartCoordsOnTable2(cungSinhValue);
    log.push("");
    log.push(`Tọa độ bắt đầu trên bảng cung sinh 2 (tương ứng với số ${cungSinhValue} từ Bảng Cung Sinh 1): (${startCoordsTable2})`);

    // Bước 2: vị trí cuối cùng trên đường đi bảng Cung Sinh 2
    const startPathIndexTable2 = pathIndexOfCoord(CUNG_SINH_TABLE_2_PATH, startCoordsTable2);
    if (startPathIndexTable2 === -1) {
      throw new Error(`Tọa độ bắt đầu (${startCoordsTable2}) không tìm thấy trên đường đi Cung Sinh 2.`);
    }

    const finalPathIndexTable2 = (startPathIndexTable2 + canIndex) % CUNG_SINH_TABLE_2_PATH.length;
    const finalCoordsTable2 = CUNG_SINH_TABLE_2_PATH[finalPathIndexTable2];
    const finalValueTable2 = CUNG_SINH_TABLE_2[finalCoordsTable2[0]][finalCoordsTable2[1]];

    // Xử lý đặc biệt: tọa độ (0,1) và giá trị 5 trên bảng Cung Sinh 2
    if (finalCoordsTable2[0] === 0 && finalCoordsTable2[1] === 1 && finalValueTable2 === 5) {
      if (finalCoords[0] === 3 && finalCoords[1] === 2) finalGuaName = 'Khảm';
      else if (finalCoords[0] === 2 && finalCoords[1] === 3) finalGuaName = 'Ly';
      else if ((finalCoords[0] === 0 && finalCoords[1] === 3) || (finalCoords[0] === 0 && finalCoords[1] === 1)) finalGuaName = 'Cấn';
      else if (finalCoords[0] === 1 && finalCoords[1] === 0) finalGuaName = 'Đoài';
      else if (finalCoords[0] === 3 && finalCoords[1] === 1) finalGuaName = 'Khôn';
      else finalGuaName = "Không xác định (trường hợp đặc biệt)";
    } else {
      finalGuaName = HOU_THIEN_NUMBER_TO_GUA_NAME[finalValueTable2] || "Không xác định";
    }

    log.push(`Tọa độ kết thúc trên bảng cung sinh 2: (${finalCoordsTable2}), số tương ứng trên bảng cung sinh 2: ${finalValueTable2}, và tên của quẻ (Cung Sinh): ${finalGuaName}`);

    // Lấy lại chỉ số/tọa độ bắt đầu trên đường đi Bảng 1 (dùng cho hiển thị + vẽ đường đi)
    const { idx: startPathIndexTable1, chiTableCoords: startCoordsTable1 } = findChiStartIndexOnPath(chiHour);
    const finalPathIndexTable1 = (startPathIndexTable1 + canIndex) % CUNG_SINH_TABLE_1_PATH.length;

    cungSinhDetail = {
      cungSinhValue, finalCoords, startCoordsTable1, startPathIndexTable1, finalPathIndexTable1,
      startCoordsTable2, startPathIndexTable2,
      finalPathIndexTable2, finalCoordsTable2, finalValueTable2, canIndex
    };
  } catch (e) {
    log.push(`Lỗi khi tính toán Cung Sinh: ${e.message}`);
  }

  log.push("");
  log.push("-- Tính toán Sinh - Khắc --");
  const sinhKhacResult = calculateSinhKhacRelationship(finalGuaName, cungPhiGuaName);
  log.push(sinhKhacResult.text);

  log.push("");
  log.push("-- Tính toán Du Niên Biến Khí --");
  const binaryCungPhi = GUA_TO_BINARY_MAP[cungPhiGuaName];
  const binaryCungSinh = GUA_TO_BINARY_MAP[finalGuaName];

  if (binaryCungPhi && binaryCungSinh) {
    log.push(`Vị trí đặt quẻ thượng (quẻ Cung Phi: ${cungPhiGuaName}): ${binaryCungPhi}`);
    log.push(`Vị trí đặt quẻ hạ (quẻ Cung Sinh: ${finalGuaName}): ${binaryCungSinh}`);
  } else {
    log.push("Không thể xác định vị trí đặt quẻ thượng/hạ (thiếu thông tin nhị phân).");
  }

  const bienKhiResult = calculateBienKhi(finalGuaName, cungPhiGuaName);
  log.push(bienKhiResult.text);

  return {
    log,
    yearSum, cungPhiNumber, baseGua, centerValue, cungPhiMatrix,
    foundInternalPos, adjustedVisualPos, cungPhiGuaName,
    finalGuaName, cungSinhDetail,
    sinhKhacResult, binaryCungPhi, binaryCungSinh, bienKhiResult
  };
}

/* =========================================================================
 * PHẦN 2 — GIAO DIỆN &amp; HIỂN THỊ
 * ========================================================================= */

const selGender = document.getElementById('sel-gender');
const inpYear = document.getElementById('inp-year');
const selCan = document.getElementById('sel-can');
const selChi = document.getElementById('sel-chi');

GENDER_OPTIONS.forEach(g => selGender.add(new Option(g, g)));
CAN_OPTIONS.forEach(c => selCan.add(new Option(c, c)));
CHI_OPTIONS.forEach(c => selChi.add(new Option(c, c)));

const PRESETS = [
  { gender: 'Nam', year: 1990, can: 'Giáp', chi: 'Tý' },
  { gender: 'Nữ', year: 1985, can: 'Canh', chi: 'Ngọ' },
  { gender: 'Nam', year: 2000, can: 'Đinh', chi: 'Mão' },
];

document.querySelectorAll('.preset-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const p = PRESETS[parseInt(btn.dataset.preset)];
    selGender.value = p.gender; inpYear.value = p.year;
    selCan.value = p.can; selChi.value = p.chi;
    cast();
  });
});

const CELL = 64, GAP = 6;
function cellCenter(r, c) { return [GAP + c * CELL + CELL / 2, GAP + r * CELL + CELL / 2]; }
function svgEl(tag, attrs) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  return el;
}

function renderGrid(svgId, rows, cols, markerColor) {
  const svg = document.getElementById(svgId);
  svg.innerHTML = "";
  const width = GAP * 2 + cols * CELL, height = GAP * 2 + rows * CELL;
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

  const defs = svgEl("defs", {});
  const marker = svgEl("marker", {
    id: svgId + "-arrow", markerWidth: 8, markerHeight: 8,
    refX: 6, refY: 3, orient: "auto", markerUnits: "strokeWidth"
  });
  marker.appendChild(svgEl("path", { d: "M0,0 L6,3 L0,6 Z", fill: markerColor }));
  defs.appendChild(marker);
  svg.appendChild(defs);

  for (let i = 0; i <= rows; i++) {
    svg.appendChild(svgEl("line", { x1: GAP, y1: GAP + i * CELL, x2: GAP + cols * CELL, y2: GAP + i * CELL, stroke: "var(--line-strong)", "stroke-width": 1 }));
  }
  for (let j = 0; j <= cols; j++) {
    svg.appendChild(svgEl("line", { x1: GAP + j * CELL, y1: GAP, x2: GAP + j * CELL, y2: GAP + rows * CELL, stroke: "var(--line-strong)", "stroke-width": 1 }));
  }
}

function drawCellText(svg, r, c, text, opts = {}) {
  const [cx, cy] = cellCenter(r, c);
  const dy = opts.dy || 0;
  const t = svgEl("text", { x: cx, y: cy + dy, "text-anchor": "middle", "dominant-baseline": "middle", fill: opts.fill || "var(--paper)", "font-size": opts.size || 14, "font-weight": opts.weight || 500 });
  t.textContent = text;
  svg.appendChild(t);
}

function highlightCell(svg, r, c, color) {
  const [cx, cy] = cellCenter(r, c);
  svg.appendChild(svgEl("rect", {
    x: cx - CELL / 2 + 3, y: cy - CELL / 2 + 3, width: CELL - 6, height: CELL - 6,
    fill: color, opacity: 0.2, stroke: color, "stroke-width": 1.6, rx: 2,
  }));
}

function drawPathAnimated(svg, svgId, path, color, showArrows) {
  if (!showArrows) return;
  for (let i = 1; i < path.length; i++) {
    const [x1, y1] = cellCenter(path[i - 1][0], path[i - 1][1]);
    const [x2, y2] = cellCenter(path[i][0], path[i][1]);
    svg.appendChild(svgEl("line", {
      x1, y1, x2, y2, stroke: color, "stroke-width": 2.5,
      "marker-end": `url(#${svgId}-arrow)`, opacity: 0.85
    }));
  }
}

function traversePath(path, startIndex, steps) {
  const traversed = [path[startIndex]];
  let idx = startIndex;
  for (let i = 0; i < steps; i++) {
    idx = (idx + 1) % path.length;
    traversed.push(path[idx]);
  }
  return traversed;
}

function renderBars(elementId, binary3, rowClass) {
  const container = host.querySelector('#' + elementId) || document.getElementById(elementId);
  if (window.KD_GRID) {
    window.KD_GRID.renderBars(container, binary3, 0, { rowClass });
  }
}

function renderCombinedBars(elementId, binary6) {
  const container = host.querySelector('#' + elementId) || document.getElementById(elementId);
  if (window.KD_GRID) {
    window.KD_GRID.renderBars(container, binary6, 0);
  }
}

function toggleStepBox(id) {
  if (window.KD_UTIL) {
    window.KD_UTIL.toggleStepBox(id);
  } else {
    const box = document.getElementById(id);
    if (box) box.classList.toggle('open');
  }
}

function chipClass(tag) {
  return { best: 'best', good: 'good', neutral: 'neutral', bad: 'bad', worst: 'worst', unknown: 'unknown' }[tag] || 'unknown';
}

function cast() {
  const gender = selGender.value;
  const birthYear = parseInt(inpYear.value, 10);
  const can = selCan.value;
  const chi = selChi.value;
  const showArrows = document.getElementById('toggle-arrows').checked;

  const errorBox = document.getElementById('error-msg');
  const result = document.getElementById('result');

  if (isNaN(birthYear)) {
    result.style.display = 'none';
    errorBox.style.display = 'block';
    errorBox.textContent = 'Lỗi: Năm sinh không hợp lệ.';
    return;
  }

  if (!isValidCanChi(can, chi)) {
    result.style.display = 'none';
    errorBox.style.display = 'block';
    errorBox.textContent = 'Can và chi không hợp lệ.';
    return;
  }

  const r = calculateCungSinhCungPhi(gender, birthYear, can, chi);

  errorBox.style.display = 'none';
  result.style.display = 'block';

  const goldColor = getComputedStyle(document.documentElement).getPropertyValue('--gold').trim();
  const jadeColor = getComputedStyle(document.documentElement).getPropertyValue('--jade').trim();
  const cinnabarColor = getComputedStyle(document.documentElement).getPropertyValue('--cinnabar').trim();

  // --- Panel 1: Cung Phi (3x3 Lạc Thư) ---
  renderGrid('svg-cungphi', 3, 3, goldColor);
  const svgCP = document.getElementById('svg-cungphi');
  for (let visualR = 0; visualR < 3; visualR++) {
    for (let visualC = 0; visualC < 3; visualC++) {
      const internalR = 2 - visualR;
      const value = r.cungPhiMatrix[internalR][visualC];
      const isCenter = (visualR === 1 && visualC === 1);
      let guaLabel;
      if (isCenter) {
        guaLabel = (gender === 'Nam') ? 'Khôn' : 'Cấn';
      } else {
        guaLabel = LAC_THU_POSITION_TO_GUA[posKey(visualR, visualC)];
      }
      drawCellText(svgCP, visualR, visualC, String(value), { size: 17, weight: 600, dy: -8 });
      drawCellText(svgCP, visualR, visualC, guaLabel, { size: 10.5, fill: "var(--paper-dim)", dy: 12 });
    }
  }
  if (r.adjustedVisualPos) {
    highlightCell(svgCP, r.adjustedVisualPos[0], r.adjustedVisualPos[1], goldColor);
  }

  document.getElementById('cungphi-desc').innerHTML =
    `Năm sinh <b>${birthYear}</b>: tổng chữ số = <b>${r.yearSum}</b>, mod 9 = <b>${r.cungPhiNumber}</b>. Giới tính <b>${gender}</b> → quẻ gốc <b>${r.baseGua}</b>, trung cung <b>${r.centerValue}</b>.`;
  document.getElementById('cungphi-caption').textContent = r.adjustedVisualPos
    ? `Vị trí trên Lạc Thư: [${r.adjustedVisualPos[0]}, ${r.adjustedVisualPos[1]}]`
    : '';
  document.getElementById('cungphi-symbol').textContent = TRIGRAM_SYMBOL[r.cungPhiGuaName] || '';
  document.getElementById('cungphi-name').textContent = r.cungPhiGuaName;
  document.getElementById('cungphi-nguhanh').textContent = GUA_TO_NGU_HANH[r.cungPhiGuaName] ? `Ngũ hành: ${GUA_TO_NGU_HANH[r.cungPhiGuaName]}` : '';

  document.getElementById('cp-steps').innerHTML = `
    <b>Chi tiết các bước Cung Phi:</b><br>
    1. Tổng chữ số năm sinh (${birthYear}) = <b>${r.yearSum}</b><br>
    2. Số cung phi = ${r.yearSum} mod 9 = <b>${r.cungPhiNumber}</b> ${r.yearSum % 9 === 0 ? '(0 → quy về 9)' : ''}<br>
    3. Giới tính <b>${gender}</b> → quẻ gốc <b>${r.baseGua}</b>, trung cung <b>${r.centerValue}</b><br>
    4. Ma trận Cung Phi (flying_star_matrix): hàng trên cùng [${r.cungPhiMatrix[2].join(', ')}], hàng giữa [${r.cungPhiMatrix[1].join(', ')}], hàng dưới [${r.cungPhiMatrix[0].join(', ')}]<br>
    5. Vị trí nội bộ tìm thấy: (${r.foundInternalPos}) → vị trí Lạc Thư: (${r.adjustedVisualPos}) → Quẻ Cung Phi: <b>${r.cungPhiGuaName}</b>
  `;

  // --- Panel 2: Cung Sinh Bảng 1 (4x4) ---
  renderGrid('svg-cungsinh1', 4, 4, jadeColor);
  const svgCS1 = document.getElementById('svg-cungsinh1');
  for (let rr = 0; rr < 4; rr++) {
    for (let cc = 0; cc < 4; cc++) {
      const chiLabel = DIA_CHI_TABLE_CUNG_SINH[rr][cc];
      const val = CUNG_SINH_TABLE_1[rr][cc];
      if (chiLabel !== null) drawCellText(svgCS1, rr, cc, chiLabel, { size: 11.5, fill: "var(--paper-dim)", dy: -10 });
      if (val !== null) drawCellText(svgCS1, rr, cc, String(val), { size: 15, weight: 600, dy: 10 });
    }
  }

  let cs1Detail = r.cungSinhDetail;
  if (cs1Detail) {
    const cs1Traversed = traversePath(CUNG_SINH_TABLE_1_PATH, cs1Detail.startPathIndexTable1, cs1Detail.canIndex);
    drawPathAnimated(svgCS1, 'svg-cungsinh1', cs1Traversed, jadeColor, showArrows);
    highlightCell(svgCS1, cs1Detail.startCoordsTable1[0], cs1Detail.startCoordsTable1[1], goldColor);
    highlightCell(svgCS1, cs1Detail.finalCoords[0], cs1Detail.finalCoords[1], jadeColor);

    document.getElementById('cungsinh1-desc').innerHTML =
      `Chi giờ <b>${chi}</b> → tọa độ bắt đầu [${cs1Detail.startCoordsTable1}]. Can giờ <b>${can}</b> (bước ${cs1Detail.canIndex}) → tọa độ kết thúc [${cs1Detail.finalCoords}] = <b>${cs1Detail.cungSinhValue}</b>.`;
    document.getElementById('cungsinh1-caption').textContent = `Tọa độ đích: [${cs1Detail.finalCoords[0]}, ${cs1Detail.finalCoords[1]}]`;
    document.getElementById('cungsinh1-value').textContent = `Giá trị: ${cs1Detail.cungSinhValue}`;

    document.getElementById('cs1-steps').innerHTML = `
      <b>Chi tiết các bước Cung Sinh — Bảng 1:</b><br>
      1. Tìm tọa độ Chi giờ <b>${chi}</b> trong bảng địa chi → (${cs1Detail.startCoordsTable1})<br>
      2. Chỉ số bắt đầu trên đường đi 12 ô = <b>${cs1Detail.startPathIndexTable1}</b><br>
      3. Chỉ số Can giờ <b>${can}</b> trong danh sách Can = <b>${cs1Detail.canIndex}</b><br>
      4. Vị trí cuối = (bắt đầu + bước) mod 12 = <b>${cs1Detail.finalPathIndexTable1}</b> → tọa độ (${cs1Detail.finalCoords})<br>
      5. Giá trị tại tọa độ này trên Bảng Cung Sinh 1: <b>${cs1Detail.cungSinhValue}</b>
    `;
  } else {
    document.getElementById('cungsinh1-desc').textContent = 'Không tính được (xem lỗi bên dưới).';
    document.getElementById('cungsinh1-caption').textContent = '';
    document.getElementById('cungsinh1-value').textContent = '';
    document.getElementById('cs1-steps').innerHTML = '';
  }

  // --- Panel 3: Cung Sinh Bảng 2 (4x3) ---
  renderGrid('svg-cungsinh2', 4, 3, cinnabarColor);
  const svgCS2 = document.getElementById('svg-cungsinh2');
  for (let rr = 0; rr < 4; rr++) {
    for (let cc = 0; cc < 3; cc++) {
      const val = CUNG_SINH_TABLE_2[rr][cc];
      if (val !== null) drawCellText(svgCS2, rr, cc, String(val), { size: 16, weight: 600 });
    }
  }

  if (cs1Detail) {
    const startPathIdx2 = cs1Detail.startPathIndexTable2;
    const cs2Traversed = traversePath(CUNG_SINH_TABLE_2_PATH, startPathIdx2, cs1Detail.canIndex);
    drawPathAnimated(svgCS2, 'svg-cungsinh2', cs2Traversed, cinnabarColor, showArrows);
    highlightCell(svgCS2, cs1Detail.startCoordsTable2[0], cs1Detail.startCoordsTable2[1], goldColor);
    highlightCell(svgCS2, cs1Detail.finalCoordsTable2[0], cs1Detail.finalCoordsTable2[1], cinnabarColor);

    document.getElementById('cungsinh2-desc').innerHTML =
      `Giá trị <b>${cs1Detail.cungSinhValue}</b> từ Bảng 1 → tọa độ bắt đầu [${cs1Detail.startCoordsTable2}]. Di chuyển ${cs1Detail.canIndex} bước theo Can → tọa độ kết thúc [${cs1Detail.finalCoordsTable2}] = <b>${cs1Detail.finalValueTable2}</b>.`;
    document.getElementById('cungsinh2-caption').textContent = `Tọa độ đích: [${cs1Detail.finalCoordsTable2[0]}, ${cs1Detail.finalCoordsTable2[1]}]`;
    document.getElementById('cungsinh2-symbol').textContent = TRIGRAM_SYMBOL[r.finalGuaName] || '';
    document.getElementById('cungsinh2-name').textContent = r.finalGuaName;
    document.getElementById('cungsinh2-nguhanh').textContent = GUA_TO_NGU_HANH[r.finalGuaName] ? `Ngũ hành: ${GUA_TO_NGU_HANH[r.finalGuaName]}` : '';

    document.getElementById('cs2-steps').innerHTML = `
      <b>Chi tiết các bước Cung Sinh — Bảng 2:</b><br>
      1. Tìm giá trị <b>${cs1Detail.cungSinhValue}</b> trong Bảng Cung Sinh 2 → tọa độ (${cs1Detail.startCoordsTable2})<br>
      2. Chỉ số bắt đầu trên đường đi 9 ô = <b>${startPathIdx2}</b><br>
      3. Vị trí cuối = (bắt đầu + ${cs1Detail.canIndex}) mod 9 = <b>${cs1Detail.finalPathIndexTable2}</b> → tọa độ (${cs1Detail.finalCoordsTable2})<br>
      4. Giá trị tại tọa độ này: <b>${cs1Detail.finalValueTable2}</b> → Quẻ Cung Sinh: <b>${r.finalGuaName}</b>
      ${(cs1Detail.finalCoordsTable2[0] === 0 && cs1Detail.finalCoordsTable2[1] === 1 && cs1Detail.finalValueTable2 === 5) ? '<br>5. Áp dụng quy tắc đặc biệt cho ô (0,1) giá trị 5, dựa trên tọa độ kết thúc ở Bảng 1.' : ''}
    `;
  } else {
    document.getElementById('cungsinh2-desc').textContent = 'Không tính được (xem lỗi bên dưới).';
    document.getElementById('cungsinh2-caption').textContent = '';
    document.getElementById('cungsinh2-symbol').textContent = '';
    document.getElementById('cungsinh2-name').textContent = '';
    document.getElementById('cungsinh2-nguhanh').textContent = '';
    document.getElementById('cs2-steps').innerHTML = '';
  }

  // --- Kết quả tổng hợp: ghép quẻ theo thứ tự Thượng (Cung Phi) / Hạ (Cung Sinh) ---
  const upperGua = r.cungPhiGuaName;   // Quẻ Thượng = Cung Phi
  const lowerGua = r.finalGuaName;     // Quẻ Hạ = Cung Sinh
  const tenQueDich = getTenQueDichFromTrigrams(upperGua, lowerGua);

  document.getElementById('tonghop-title').textContent = tenQueDich;
  document.getElementById('ghep-title').textContent = tenQueDich;
  document.getElementById('ghep-symbols').innerHTML =
    `Thượng: <b>${TRIGRAM_SYMBOL[upperGua] || '?'} ${upperGua}</b> &nbsp;·&nbsp; Hạ: <b>${TRIGRAM_SYMBOL[lowerGua] || '?'} ${lowerGua}</b>`;

  if (r.binaryCungPhi && r.binaryCungSinh) {
    const combinedBinary6 = r.binaryCungSinh + r.binaryCungPhi; // hào 1-3 = Hạ (Cung Sinh), hào 4-6 = Thượng (Cung Phi)
    renderCombinedBars('bars-ghep', combinedBinary6);
  } else {
    document.getElementById('bars-ghep').innerHTML = '';
  }

  document.getElementById('card-phi-title').textContent = `${TRIGRAM_SYMBOL[r.cungPhiGuaName] || ''} ${r.cungPhiGuaName}`;
  document.getElementById('card-phi-sub').textContent = GUA_TO_NGU_HANH[r.cungPhiGuaName] ? `Ngũ hành: ${GUA_TO_NGU_HANH[r.cungPhiGuaName]}` : 'Ngũ hành: —';
  if (r.binaryCungPhi) renderBars('bars-phi', r.binaryCungPhi, 'qcp'); else document.getElementById('bars-phi').innerHTML = '';

  document.getElementById('card-sinh-title').textContent = `${TRIGRAM_SYMBOL[r.finalGuaName] || ''} ${r.finalGuaName}`;
  document.getElementById('card-sinh-sub').textContent = GUA_TO_NGU_HANH[r.finalGuaName] ? `Ngũ hành: ${GUA_TO_NGU_HANH[r.finalGuaName]}` : 'Ngũ hành: —';
  if (r.binaryCungSinh) renderBars('bars-sinh', r.binaryCungSinh, 'qcs'); else document.getElementById('bars-sinh').innerHTML = '';

  document.getElementById('sinhkhac-value').textContent = r.sinhKhacResult.text;
  const tagLabels = { best: 'Rất tốt', good: 'Tốt', neutral: 'Trung bình', bad: 'Xấu', worst: 'Rất xấu', unknown: 'Không rõ' };
  const chipText = tagLabels[r.sinhKhacResult.tag] || r.sinhKhacResult.tag;
  document.getElementById('sinhkhac-chip-wrap').innerHTML = `<span class="sinh-khac-chip ${chipClass(r.sinhKhacResult.tag)}">${chipText}</span>`;

  if (r.bienKhiResult.bienKhi) {
    document.getElementById('bienkhi-value').textContent = r.bienKhiResult.bienKhi;
    document.getElementById('bienkhi-formula').textContent = `XOR ${r.bienKhiResult.binary1} và ${r.bienKhiResult.binary2} = ${r.bienKhiResult.xorResultBinaryStr}`;
  } else {
    document.getElementById('bienkhi-value').textContent = '—';
    document.getElementById('bienkhi-formula').textContent = r.bienKhiResult.text;
  }

  // Steps summary (console.print trace)
  document.getElementById('steps-body').textContent = r.log.join('\n');

  document.getElementById('input-echo').textContent = `${gender} · ${birthYear} · Can ${can} · Chi ${chi}`;
}

document.getElementById('cast-btn').addEventListener('click', cast);
document.getElementById('toggle-arrows').addEventListener('change', () => {
  if (document.getElementById('result').style.display === 'block') cast();
});

// Load mặc định
selGender.value = "Nam"; inpYear.value = 1990; selCan.value = "Giáp"; selChi.value = "Tý";

  /* ---- Unified Bridge ---- */
  if (typeof cast === 'function') {
    window.cast = cast;
    window.__KD_CAST = cast;
  } else {
    window.__KD_CAST = function() {};
  }
};
