window.KD_MOD = window.KD_MOD || {};
window.KD_MOD["nguling"] = function() {
  const host = document.querySelector('.kd-mod[data-mod="nguling"]');
  if (!host) return;

  /* ---- Original Module Logic ---- */
  const { DICH_64_BY_PAIR, TRIGRAM_TUONG, CAN: THIEN_CAN, CHI: DIA_CHI, CAN_DUONG, CAN_AM, SO_TIEN_THIEN, TRIGRAM_TO_BIN: TRIGRAM_TO_BINARY, BIN_TO_TRIGRAM: BINARY_TO_TRIGRAM, TRIGRAM_SYMBOL } = window.KD_DATA;
  const { getName: getTenQueDichFromTrigrams, flipBit } = window.KD_DICH;
  const { coordEq, mod: pymod } = window.KD_UTIL;
  const { svgEl } = window.KD_GRID;

/* =========================================================================
 * PHẦN 1 — LÕI THUẬT TOÁN NGŨ LINH
 * ========================================================================= */

const THIEN_TINH_MAP = [
  { queDon:"Càn",  soHieu:1,  nguHanh:"Thủy+", sao:"Thiên Bồng" },
  { queDon:"Đoài", soHieu:2,  nguHanh:"Thổ-",  sao:"Thiên Nhuế" },
  { queDon:"Ly",   soHieu:3,  nguHanh:"Mộc+",  sao:"Thiên Xung" },
  { queDon:"Chấn", soHieu:4,  nguHanh:"Mộc-",  sao:"Thiên Phụ" },
  { queDon:"Tốn",  soHieu:5,  nguHanh:"Hỏa+",  sao:"Thiên Cầm" },
  { queDon:"Khảm", soHieu:6,  nguHanh:"Kim+",  sao:"Thiên Tâm" },
  { queDon:"Cấn",  soHieu:7,  nguHanh:"Kim-",  sao:"Thiên Trụ" },
  { queDon:"Khôn", soHieu:8,  nguHanh:"Thổ+",  sao:"Thiên Nhậm" },
  { queDon:"Càn",  soHieu:9,  nguHanh:"Hỏa-",  sao:"Thiên Anh" },
  { queDon:"Đoài", soHieu:10, nguHanh:"Thủy-", sao:"Thiên Không" },
];
const SO_HIEU_BY_NGU_HANH = Object.fromEntries(THIEN_TINH_MAP.map(r => [r.nguHanh, r.soHieu]));
const ROW_BY_SO_HIEU = Object.fromEntries(THIEN_TINH_MAP.map(r => [r.soHieu, r]));

const NGU_LINH_TABLES = {
  "Thân_Tý_Thìn": [
    ["Cấn","Khôn","Chấn","Chấn"],
    ["Cấn",null,null,"Ly"],
    ["Khảm",null,null,"Đoài"],
    ["Tốn","Tốn","Càn","Đoài"],
  ],
  "Dần_Ngọ_Tuất": [
    ["Đoài","Càn","Tốn","Tốn"],
    ["Đoài",null,null,"Khảm"],
    ["Ly",null,null,"Cấn"],
    ["Chấn","Chấn","Khôn","Cấn"],
  ],
  "Hợi_Mão_Mùi": [
    ["Tốn","Khảm","Cấn","Cấn"],
    ["Tốn",null,null,"Khôn"],
    ["Càn",null,null,"Chấn"],
    ["Đoài","Đoài","Ly","Chấn"],
  ],
  "Tỵ_Dậu_Sửu": [
    ["Chấn","Ly","Đoài","Đoài"],
    ["Chấn",null,null,"Càn"],
    ["Khôn",null,null,"Tốn"],
    ["Cấn","Cấn","Khảm","Tốn"],
  ],
};
const GROUP_LABEL = {
  "Thân_Tý_Thìn": "Thân – Tý – Thìn",
  "Dần_Ngọ_Tuất": "Dần – Ngọ – Tuất",
  "Hợi_Mão_Mùi": "Hợi – Mão – Mùi",
  "Tỵ_Dậu_Sửu": "Tỵ – Dậu – Sửu",
};

const NGU_HANH_SEQUENCE = ["Kim+","Kim-","Thủy+","Thủy-","Hỏa+","Hỏa-","Thổ+","Thổ-","Mộc+","Mộc-"];
const STARTING_NGU_HANH_MAP = {
  "Tý":"Kim+","Sửu":"Kim+","Ngọ":"Kim+","Mùi":"Kim+",
  "Dần":"Thủy+","Mão":"Thủy+","Thân":"Thủy+","Dậu":"Thủy+",
  "Thìn":"Hỏa+","Tỵ":"Hỏa+","Tuất":"Hỏa+","Hợi":"Hỏa+",
};
const CHI_DUONG_NAM = ["Tý","Dần","Thìn","Ngọ","Thân","Tuất"];

const CAN_NGAY_TO_TY_CAN = {
  "Giáp":"Giáp","Kỷ":"Giáp",
  "Ất":"Bính","Canh":"Bính",
  "Bính":"Mậu","Tân":"Mậu",
  "Đinh":"Canh","Nhâm":"Canh",
  "Mậu":"Nhâm","Quý":"Nhâm",
};

const DIA_CHI_TO_HOUR_INDEX = {
  "Tý":0,"Sửu":1,"Dần":2,"Mão":3,"Thìn":4,"Tỵ":5,"Ngọ":6,"Mùi":7,"Thân":8,"Dậu":9,"Tuất":10,"Hợi":11,
};

const HAU_THIEN_PATH = [
  [3,0],[2,0],[1,0],[0,0],
  [0,1],[0,2],[0,3],[1,3],
  [2,3],[3,3],[3,2],[3,1],
];

function pathIndexOf(coord) {
  for (let i = 0; i < HAU_THIEN_PATH.length; i++) if (coordEq(HAU_THIEN_PATH[i], coord)) return i;
  return -1;
}

function calculateCanGio(canNgay, chiGio) {
  const baseCanTy = CAN_NGAY_TO_TY_CAN[canNgay];
  const baseIdx = THIEN_CAN.indexOf(baseCanTy);
  const offset = DIA_CHI.indexOf(chiGio);
  return THIEN_CAN[pymod(baseIdx + offset, THIEN_CAN.length)];
}

function calculateNguHanhGio(canGio, chiGio) {
  const startNguHanh = STARTING_NGU_HANH_MAP[chiGio];
  const startIdx = NGU_HANH_SEQUENCE.indexOf(startNguHanh);
  const canOffset = THIEN_CAN.indexOf(canGio);
  return NGU_HANH_SEQUENCE[pymod(startIdx + canOffset, NGU_HANH_SEQUENCE.length)];
}

function getYearTableForChi(chiNam) {
  if (["Thân","Tý","Thìn"].includes(chiNam)) return { key:"Thân_Tý_Thìn", table:NGU_LINH_TABLES["Thân_Tý_Thìn"] };
  if (["Dần","Ngọ","Tuất"].includes(chiNam)) return { key:"Dần_Ngọ_Tuất", table:NGU_LINH_TABLES["Dần_Ngọ_Tuất"] };
  if (["Hợi","Mão","Mùi"].includes(chiNam)) return { key:"Hợi_Mão_Mùi", table:NGU_LINH_TABLES["Hợi_Mão_Mùi"] };
  if (["Tỵ","Dậu","Sửu"].includes(chiNam)) return { key:"Tỵ_Dậu_Sửu", table:NGU_LINH_TABLES["Tỵ_Dậu_Sửu"] };
  throw new Error(`Chi năm '${chiNam}' không hợp lệ.`);
}

function calculateHauThienQueDon(chiNam, month, day, chiGio) {
  const { key, table } = getYearTableForChi(chiNam);
  const hourIndex = DIA_CHI_TO_HOUR_INDEX[chiGio];
  const totalSteps = (month + day + hourIndex) - 2;
  const finalPathIndex = pymod(totalSteps, HAU_THIEN_PATH.length);
  const finalCoords = HAU_THIEN_PATH[finalPathIndex];
  const [row, col] = finalCoords;
  const queDon = table[row][col];
  return { queDon, coords: finalCoords, totalSteps, finalPathIndex, groupKey: key, table };
}

function calculateTienThienQueDon(canGio, chiGio, hauThienCoords) {
  const nguHanhGio = calculateNguHanhGio(canGio, chiGio);
  const baseSoHieu = SO_HIEU_BY_NGU_HANH[nguHanhGio];
  const startCoords = [3, 2];
  const startIndex = pathIndexOf(startCoords);

  let targetCoordsForDistance = hauThienCoords;
  if (coordEq(hauThienCoords, [0, 2])) targetCoordsForDistance = [3, 1];
  else if (coordEq(hauThienCoords, [2, 3])) targetCoordsForDistance = [1, 0];

  const targetIndex = pathIndexOf(targetCoordsForDistance);
  let steps = 0, specialCount = 0, currentIndex = startIndex;
  const traversed = [HAU_THIEN_PATH[startIndex]];

  while (currentIndex !== targetIndex) {
    currentIndex = (currentIndex + 1) % HAU_THIEN_PATH.length;
    steps += 1;
    traversed.push(HAU_THIEN_PATH[currentIndex]);
    const cur = HAU_THIEN_PATH[currentIndex];
    if (coordEq(cur, [0, 2]) || coordEq(cur, [2, 3])) specialCount += 1;
  }
  const distance = steps - specialCount;

  let finalSoHieu = baseSoHieu + distance;
  let wrapped = false;
  if (finalSoHieu > 10) { finalSoHieu -= 10; wrapped = true; }

  const row = ROW_BY_SO_HIEU[finalSoHieu];
  return {
    queDon: row.queDon, nguHanhGio, baseSoHieu, distance, finalSoHieu, wrapped,
    startIndex, targetIndex, traversed, sao: row.sao,
  };
}

/* =========================================================================
 * CẬP NHẬT CHUẨN XÁC LOGIC XẾP QUẺ ĐỜI NGƯỜI VÀ HỎI VIỆC
 * ========================================================================= */
function orderQueByCanNgayAndGender(canNgay, chiNam, gioitinh, hauThienQueDon, tienThienQueDon) {
  const isCanNgayDuong = CAN_DUONG.includes(canNgay);

  // 1. Quẻ Hỏi Việc (Không chọn giới tính)
  if (!gioitinh || gioitinh.trim() === "") {
    if (isCanNgayDuong) return [tienThienQueDon, hauThienQueDon];
    return [hauThienQueDon, tienThienQueDon];
  }

  // 2. Quẻ Đời Người (Phối hợp Giới tính + Năm Âm/Dương + Ngày Âm/Dương)
  const isNam = gioitinh === "Nam";
  const isNamDuong = CHI_DUONG_NAM.includes(chiNam);

  if (isNam) {
    if (isNamDuong && isCanNgayDuong) return [tienThienQueDon, hauThienQueDon];   // Nam, Năm Dương, Ngày Dương -> Tiên Thiên / Hậu Thiên
    if (!isNamDuong && isCanNgayDuong) return [hauThienQueDon, tienThienQueDon];  // Nam, Năm Âm, Ngày Dương   -> Hậu Thiên / Tiên Thiên
    if (isNamDuong && !isCanNgayDuong) return [hauThienQueDon, tienThienQueDon];  // Nam, Năm Dương, Ngày Âm   -> Hậu Thiên / Tiên Thiên
    if (!isNamDuong && !isCanNgayDuong) return [tienThienQueDon, hauThienQueDon]; // Nam, Năm Âm, Ngày Âm     -> Tiên Thiên / Hậu Thiên
  } else {
    if (isNamDuong && isCanNgayDuong) return [hauThienQueDon, tienThienQueDon];  // Nữ, Năm Dương, Ngày Dương  -> Hậu Thiên / Tiên Thiên
    if (!isNamDuong && isCanNgayDuong) return [tienThienQueDon, hauThienQueDon]; // Nữ, Năm Âm, Ngày Dương    -> Tiên Thiên / Hậu Thiên
    if (isNamDuong && !isCanNgayDuong) return [tienThienQueDon, hauThienQueDon]; // Nữ, Năm Dương, Ngày Âm    -> Tiên Thiên / Hậu Thiên
    if (!isNamDuong && !isCanNgayDuong) return [hauThienQueDon, tienThienQueDon]; // Nữ, Năm Âm, Ngày Âm      -> Hậu Thiên / Tiên Thiên
  }
}


function calculateQueHo(originalQueBinary) {
  const queHoLowerBinary = originalQueBinary.slice(1, 4);
  const queHoUpperBinary = originalQueBinary.slice(2, 5);

  const lowerName = BINARY_TO_TRIGRAM[queHoLowerBinary];
  const upperName = BINARY_TO_TRIGRAM[queHoUpperBinary];
  const queHoName = `${upperName} / ${lowerName}`;
  const queHoFullBinary = queHoLowerBinary + queHoUpperBinary;

  return { queHoName, queHoFullBinary, upperName, lowerName };
}

const CHI_DUONG = ["Tý","Dần","Thìn","Ngọ","Thân","Tuất"];
const CAN_TRANSFORMATION_MAP = {
  "Giáp":"Kỷ", "Kỷ":"Nhâm",
  "Ất":"Mậu",
  "Mậu":"Quý",
  "Bính":"Tân", "Tân":"Giáp",
  "Đinh":"Canh", "Canh":"Ất",
  "Nhâm":"Đinh", "Quý":"Bính",
};

function isDuong(item, itemType) {
  if (itemType === "can") return CAN_DUONG.includes(item);
  if (itemType === "chi") return CHI_DUONG.includes(item);
  return null;
}

function hoanThoiPhap(currentCanGio, currentChiGio, originalCanNgay) {
  const newCanGio = CAN_TRANSFORMATION_MAP[currentCanGio];
  if (!newCanGio) throw new Error(`Can giờ '${currentCanGio}' không hợp lệ để hoán đổi.`);

  const isCanNgayDuong = CAN_DUONG.includes(originalCanNgay);
  const isChiGioDuong = CHI_DUONG.includes(currentChiGio);

  let chiOffset = 0;
  if (isChiGioDuong && isCanNgayDuong) chiOffset = -3;
  else if (isChiGioDuong && !isCanNgayDuong) chiOffset = 3;
  else if (!isChiGioDuong && isCanNgayDuong) chiOffset = 5;
  else chiOffset = -5;

  const curIdx = DIA_CHI.indexOf(currentChiGio);
  const newChiGio = DIA_CHI[pymod(curIdx + chiOffset, DIA_CHI.length)];

  if (isDuong(newCanGio, "can") !== isDuong(newChiGio, "chi")) {
    const canPol = isDuong(newCanGio, "can") ? "Dương" : "Âm";
    const chiPol = isDuong(newChiGio, "chi") ? "Dương" : "Âm";
    throw new Error(
      `Hoán Thời Pháp tạo ra giờ không hợp lệ: Can '${newCanGio}' (${canPol}) không khớp với Chi '${newChiGio}' (${chiPol}).`
    );
  }

  return [newCanGio, newChiGio];
}

function calculateNguLinhQue(chiGio, canNgay, lunarDay, lunarMonth, chiNam, gioitinh) {
  const calculatedCanGio = calculateCanGio(canNgay, chiGio);
  const hauThien = calculateHauThienQueDon(chiNam, lunarMonth, lunarDay, chiGio);
  const tienThien = calculateTienThienQueDon(calculatedCanGio, chiGio, hauThien.coords);

  const [orderedUpper, orderedLower] = orderQueByCanNgayAndGender(canNgay, chiNam, gioitinh, hauThien.queDon, tienThien.queDon);
  const finalNguLinhQueName = `${orderedUpper} / ${orderedLower}`;

  const soTienThienHauThien = SO_TIEN_THIEN[hauThien.queDon];
  let haoNguyenDuong = pymod(soTienThienHauThien + tienThien.finalSoHieu, 6);
  if (haoNguyenDuong === 0) haoNguyenDuong = 6;

  const chiGioIndex = DIA_CHI_TO_HOUR_INDEX[chiGio];
  let haoDong = pymod(haoNguyenDuong + chiGioIndex, 6);
  if (haoDong === 0) haoDong = 6;

  const binaryUpper = TRIGRAM_TO_BINARY[orderedUpper];
  const binaryLower = TRIGRAM_TO_BINARY[orderedLower];
  const originalQueBinary = binaryLower + binaryUpper;

  const transformedQueBinary = flipBit(originalQueBinary, haoDong);
  const transformedLower = transformedQueBinary.slice(0, 3);
  const transformedUpper = transformedQueBinary.slice(3, 6);
  const transformedQueNameLower = BINARY_TO_TRIGRAM[transformedLower];
  const transformedQueNameUpper = BINARY_TO_TRIGRAM[transformedUpper];
  const transformedQueName = `${transformedQueNameUpper} / ${transformedQueNameLower}`;

  const tenQueGocDich = getTenQueDichFromTrigrams(orderedUpper, orderedLower);
  const tenQueBienDich = getTenQueDichFromTrigrams(transformedQueNameUpper, transformedQueNameLower);

  const queHo = calculateQueHo(originalQueBinary);
  const tenQueHoDich = getTenQueDichFromTrigrams(queHo.upperName, queHo.lowerName);

  return {
    finalNguLinhQueName, calculatedCanGio,
    hauThien, tienThien,
    soTienThienHauThien,
    originalQueBinary, haoNguyenDuong, haoDong,
    transformedQueBinary, transformedQueName,
    orderedUpper, orderedLower,
    transformedQueNameUpper, transformedQueNameLower,
    tenQueGocDich, tenQueBienDich,
    queHo, tenQueHoDich
  };
}

/* =========================================================================
 * PHẦN 2 — GIAO DIỆN & HIỂN THỊ
 * ========================================================================= */

const selGio = host.querySelector('#sel-gio') || document.getElementById('sel-gio');
const selCan = host.querySelector('#sel-can') || document.getElementById('sel-can');
const selNgay = host.querySelector('#sel-ngay') || document.getElementById('sel-ngay');
const selThang = host.querySelector('#sel-thang') || document.getElementById('sel-thang');
const selNamChi = host.querySelector('#sel-namchi') || document.getElementById('sel-namchi');
const selGioiTinh = host.querySelector('#sel-gioitinh') || document.getElementById('sel-gioitinh');

if (selGio && selGio.options.length === 0) DIA_CHI.forEach(g => selGio.add(new Option(`Giờ ${g}`, g)));
if (selCan && selCan.options.length === 0) THIEN_CAN.forEach(c => selCan.add(new Option(c, c)));
if (selNgay && selNgay.options.length === 0) for (let d = 1; d <= 30; d++) selNgay.add(new Option(`Ngày ${d}`, d));
if (selThang && selThang.options.length === 0) for (let m = 1; m <= 12; m++) selThang.add(new Option(`Tháng ${m}`, m));
if (selNamChi && selNamChi.options.length === 0) DIA_CHI.forEach(g => selNamChi.add(new Option(`Năm ${g}`, g)));

const PRESETS = [
  { gio: "Dần", can: "Canh", ngay: 1, thang: 1, namchi: "Tý", gioitinh: "" },
  { gio: "Tuất", can: "Mậu", ngay: 3, thang: 8, namchi: "Sửu", gioitinh: "Nam" },
  { gio: "Tý", can: "Ất", ngay: 5, thang: 1, namchi: "Ngọ", gioitinh: "Nữ" },
];

document.querySelectorAll('.preset-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const p = PRESETS[parseInt(btn.dataset.preset)];
    selGio.value = p.gio; selCan.value = p.can;
    selNgay.value = p.ngay; selThang.value = p.thang; selNamChi.value = p.namchi;
    selGioiTinh.value = p.gioitinh;
    cast();
  });
});

const CELL = 64, GAP_ORIGIN = 6;
function cellCenter(r, c) { return [GAP_ORIGIN + c * CELL + CELL/2, GAP_ORIGIN + r * CELL + CELL/2]; }

function renderGrid4(svgId, opts) {
  const svg = document.getElementById(svgId);
  svg.innerHTML = "";
  const size = GAP_ORIGIN * 2 + CELL * 4;
  svg.setAttribute("viewBox", `0 0 ${size} ${size}`);

  const defs = svgEl("defs", {});
  const marker = svgEl("marker", {
    id: svgId + "-arrow", markerWidth: 8, markerHeight: 8,
    refX: 6, refY: 3, orient: "auto", markerUnits: "strokeWidth"
  });
  marker.appendChild(svgEl("path", { d: "M0,0 L6,3 L0,6 Z", fill: opts.pathColor }));
  defs.appendChild(marker);
  svg.appendChild(defs);

  for (let i = 0; i <= 4; i++) {
    svg.appendChild(svgEl("line", { x1: GAP_ORIGIN, y1: GAP_ORIGIN + i*CELL, x2: GAP_ORIGIN + 4*CELL, y2: GAP_ORIGIN + i*CELL, stroke: "var(--line-strong)", "stroke-width": 1 }));
    svg.appendChild(svgEl("line", { x1: GAP_ORIGIN + i*CELL, y1: GAP_ORIGIN, x2: GAP_ORIGIN + i*CELL, y2: GAP_ORIGIN + 4*CELL, stroke: "var(--line-strong)", "stroke-width": 1 }));
  }

  if (opts.markSpecial) {
    [[0,2],[2,3]].forEach(coord => {
      const [cx, cy] = cellCenter(coord[0], coord[1]);
      svg.appendChild(svgEl("rect", {
        x: cx - CELL/2 + 3, y: cy - CELL/2 + 3, width: CELL - 6, height: CELL - 6,
        fill: "none", stroke: "var(--paper-faint)", "stroke-width": 1, "stroke-dasharray": "3,3", rx: 2,
      }));
    });
  }
}

function highlightCell(svg, coord, color) {
  const [cx, cy] = cellCenter(coord[0], coord[1]);
  const rect = svgEl("rect", {
    x: cx - CELL/2 + 3, y: cy - CELL/2 + 3, width: CELL - 6, height: CELL - 6,
    fill: color, opacity: 0.2, stroke: color, "stroke-width": 1.6, rx: 2,
  });
  svg.appendChild(rect);
}

function drawCellText(svg, r, c, text, opts) {
  const [cx, cy] = cellCenter(r, c);
  const dy = opts.dy || 0;
  const t = svgEl("text", { x: cx, y: cy + dy, "text-anchor": "middle", "dominant-baseline": "middle", fill: opts.fill || "var(--paper)", "font-size": opts.size || 13, "font-weight": opts.weight || 500 });
  t.textContent = text;
  svg.appendChild(t);
}

function drawPathAnimated(svg, svgId, path, color, showArrows) {
  if (!showArrows) return;
  path.forEach((coord, i) => {
    if (i === 0) return;
    const [x1, y1] = cellCenter(path[i-1][0], path[i-1][1]);
    const [x2, y2] = cellCenter(coord[0], coord[1]);
    const line = svgEl("line", {
      x1, y1, x2, y2, stroke: color, "stroke-width": 2.5,
      "marker-end": `url(#${svgId}-arrow)`, opacity: 0.85
    });
    svg.appendChild(line);
  });
}

function renderBarsToElement(elementId, binary6, activeHao = 0) {
  const container = host.querySelector('#' + elementId) || document.getElementById(elementId);
  if (window.KD_GRID) {
    window.KD_GRID.renderBars(container, binary6, activeHao);
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

function cast() {
  const gio = selGio.value, can = selCan.value, namchi = selNamChi.value;
  const ngay = parseInt(selNgay.value), thang = parseInt(selThang.value);
  const gioitinh = selGioiTinh.value;
  const showArrows = document.getElementById('toggle-arrows').checked;

  const errorBox = document.getElementById('error-msg');
  const result = document.getElementById('result');

  let r;
  try {
    r = calculateNguLinhQue(gio, can, ngay, thang, namchi, gioitinh);
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

  // --- Panel 1: Hậu Thiên ---
  renderGrid4('svg-hauthien', { pathColor: goldColor });
  const svgHT = document.getElementById('svg-hauthien');
  const { table: htTable } = getYearTableForChi(namchi);
  for (let rr = 0; rr < 4; rr++) for (let cc = 0; cc < 4; cc++) {
    if (htTable[rr][cc]) drawCellText(svgHT, rr, cc, htTable[rr][cc], { size: 12.5, fill: "var(--paper-dim)" });
  }
  const forwardPath = HAU_THIEN_PATH.slice(0, r.hauThien.finalPathIndex + 1);
  drawPathAnimated(svgHT, 'svg-hauthien', forwardPath, goldColor, showArrows);
  highlightCell(svgHT, r.hauThien.coords, goldColor);

  document.getElementById('hauthien-desc').innerHTML =
    `Năm <b>${namchi}</b> (bàn 4x4 ${GROUP_LABEL[r.hauThien.groupKey]}) · Tháng ${thang} + Ngày ${ngay} + Giờ ${gio} (${DIA_CHI_TO_HOUR_INDEX[gio]}) − 2 = <b>${r.hauThien.totalSteps}</b> bước → vị trí index ${r.hauThien.finalPathIndex}.`;
  document.getElementById('hauthien-caption').textContent = `Tọa độ đích: [${r.hauThien.coords[0]}, ${r.hauThien.coords[1]}]`;
  document.getElementById('hauthien-symbol').textContent = TRIGRAM_SYMBOL[r.hauThien.queDon];
  document.getElementById('hauthien-name').textContent = r.hauThien.queDon;

  document.getElementById('ht-steps').innerHTML = `
    <b>Chi tiết các bước Quẻ Hậu Thiên:</b><br>
    1. Tổng số bước = Tháng(${thang}) + Ngày(${ngay}) + Chỉ số Giờ(${DIA_CHI_TO_HOUR_INDEX[gio]}) - 2 = <b>${r.hauThien.totalSteps}</b><br>
    2. Vị trí trên đường biên 12 ô = ${r.hauThien.totalSteps} mod 12 = <b>${r.hauThien.finalPathIndex}</b><br>
    3. Tọa độ tương ứng: <b>[${r.hauThien.coords[0]}, ${r.hauThien.coords[1]}]</b> → Quẻ: <b>${r.hauThien.queDon}</b>
  `;

  // --- Panel 2: Tiên Thiên ---
  renderGrid4('svg-tienthien', { pathColor: jadeColor, markSpecial: true });
  const svgTT = document.getElementById('svg-tienthien');
  drawCellText(svgTT, 3, 2, String(r.tienThien.baseSoHieu), { size: 16, weight: 600, fill: goldColor });
  if (!coordEq(r.tienThien.traversed[r.tienThien.traversed.length-1], [3,2])) {
    const endC = r.tienThien.traversed[r.tienThien.traversed.length-1];
    drawCellText(svgTT, endC[0], endC[1], String(r.tienThien.finalSoHieu), { size: 16, weight: 600, fill: jadeColor });
  }
  drawPathAnimated(svgTT, 'svg-tienthien', r.tienThien.traversed, jadeColor, showArrows);
  highlightCell(svgTT, [3,2], goldColor);
  highlightCell(svgTT, r.hauThien.coords, jadeColor);

  document.getElementById('tienthien-desc').innerHTML =
    `Ngũ hành giờ <b>${r.calculatedCanGio} ${gio}</b> = <b>${r.tienThien.nguHanhGio}</b> → Số hiệu gốc <b>${r.tienThien.baseSoHieu}</b> tại [3,2]. Di chuyển <b>${r.tienThien.distance}</b> bước → Số hiệu cuối = <b>${r.tienThien.finalSoHieu}</b>.`;
  document.getElementById('tienthien-symbol').textContent = TRIGRAM_SYMBOL[r.tienThien.queDon];
  document.getElementById('tienthien-name').textContent = r.tienThien.queDon;
  document.getElementById('tienthien-sao').textContent = `Sao: ${r.tienThien.sao}`;

  document.getElementById('tt-steps').innerHTML = `
    <b>Chi tiết các bước Quẻ Tiên Thiên:</b><br>
    1. Can Giờ = <b>${r.calculatedCanGio}</b> | Ngũ Hành Giờ = <b>${r.tienThien.nguHanhGio}</b><br>
    2. Số hiệu gốc = <b>${r.tienThien.baseSoHieu}</b> (xuất phát tại ô [3,2])<br>
    3. Khoảng cách thực tế (loại bỏ ô đặc biệt [0,2], [2,3]) = <b>${r.tienThien.distance}</b> bước<br>
    4. Số hiệu cuối = ${r.tienThien.baseSoHieu} + ${r.tienThien.distance} = <b>${r.tienThien.finalSoHieu}</b> → Quẻ: <b>${r.tienThien.queDon}</b>
  `;

  // --- Bảng Thiên Tinh ---
  const tbody = document.getElementById('thientinh-tbody');
  tbody.innerHTML = "";
  THIEN_TINH_MAP.forEach(row => {
    const tr = document.createElement('tr');
    if (row.soHieu === r.tienThien.baseSoHieu) tr.classList.add('hl-base');
    if (row.soHieu === r.tienThien.finalSoHieu) tr.classList.add('hl-final');
    tr.innerHTML = `<td>${row.soHieu}</td><td class="name-cell">${TRIGRAM_SYMBOL[row.queDon]} ${row.queDon}</td><td>${row.nguHanh}</td><td>${row.sao}</td>`;
    tbody.appendChild(tr);
  });

  // --- Hexagram Dual Section ---
  const isCanDuong = CAN_DUONG.includes(can);
  const isNamDuong = CHI_DUONG_NAM.includes(namchi);
  let orderText = "";
  if (!gioitinh || gioitinh.trim() === "") {
    orderText = `Quẻ Hỏi Việc (Can ngày ${can} - ${isCanDuong ? "Dương" : "Âm"}) → Xếp Quẻ: ${isCanDuong ? "Tiên Thiên / Hậu Thiên" : "Hậu Thiên / Tiên Thiên"}`;
  } else {
    orderText = `Quẻ Đời Người (${gioitinh} · Năm ${namchi} - ${isNamDuong ? "Dương" : "Âm"} · Can ngày ${can} - ${isCanDuong ? "Dương" : "Âm"}) → Xếp Quẻ: ${r.orderedUpper === r.tienThien.queDon ? "Tiên Thiên / Hậu Thiên" : "Hậu Thiên / Tiên Thiên"}`;
  }
  document.getElementById('order-note').textContent = orderText;

  document.getElementById('goc-fullname').textContent = `${r.tenQueGocDich} (${r.finalNguLinhQueName})`;

  // Render Quẻ Gốc
  document.getElementById('card-goc-title').textContent = r.tenQueGocDich;
  document.getElementById('card-goc-symbols').textContent = `${r.finalNguLinhQueName} (${TRIGRAM_SYMBOL[r.orderedUpper]}${TRIGRAM_SYMBOL[r.orderedLower]})`;
  renderBarsToElement('bars-goc', r.originalQueBinary, r.haoDong);

  // Render Quẻ Biến
  document.getElementById('card-bien-title').textContent = r.tenQueBienDich;
  document.getElementById('card-bien-symbols').textContent = `${r.transformedQueName} (${TRIGRAM_SYMBOL[r.transformedQueNameUpper]}${TRIGRAM_SYMBOL[r.transformedQueNameLower]})`;
  renderBarsToElement('bars-bien', r.transformedQueBinary, 0);

  // Render Quẻ Hỗ
  document.getElementById('card-ho-title').textContent = r.tenQueHoDich;
  document.getElementById('card-ho-symbols').textContent = `${r.queHo.queHoName} (${TRIGRAM_SYMBOL[r.queHo.upperName]}${TRIGRAM_SYMBOL[r.queHo.lowerName]})`;
  renderBarsToElement('bars-ho', r.queHo.queHoFullBinary, 0);

  // Hexagram Info
  document.getElementById('goc-binary').textContent = r.originalQueBinary;
  document.getElementById('bien-binary').textContent = r.transformedQueBinary;
  document.getElementById('ho-binary').textContent = r.queHo.queHoFullBinary;
  document.getElementById('haodong-value').textContent = `Hào ${r.haoDong}`;
  document.getElementById('haodong-formula').innerHTML =
    `Nguyên Đường = (${r.soTienThienHauThien} + ${r.tienThien.finalSoHieu}) mod 6 = ${r.haoNguyenDuong}<br>Hào Động = (${r.haoNguyenDuong} + ${DIA_CHI_TO_HOUR_INDEX[gio]}) mod 6 = ${r.haoDong}`;

  // Steps Summary
  document.getElementById('steps-body').innerHTML = `
    - Loại Quẻ: <b>${!gioitinh ? "Quẻ Hỏi Việc" : `Quẻ Đời Người (${gioitinh})`}</b><br>
    - Can / Chi Giờ: <b>${r.calculatedCanGio} ${gio}</b><br>
    - Ngũ hành giờ: <b>${r.tienThien.nguHanhGio}</b><br>
    - Quẻ Hậu Thiên: <b>${r.hauThien.queDon}</b> (Tọa độ: [${r.hauThien.coords[0]}, ${r.hauThien.coords[1]}])<br>
    - Quẻ Tiên Thiên: <b>${r.tienThien.queDon}</b> (Số hiệu gốc: ${r.tienThien.baseSoHieu} → Cuối: ${r.tienThien.finalSoHieu})<br>
    - Mã nhị phân Quẻ Gốc: <b>${r.originalQueBinary}</b> → Tên quẻ Dịch: <b>${r.tenQueGocDich}</b><br>
    - Hào Nguyên Đường: <b>${r.haoNguyenDuong}</b> | Hào Động: <b>${r.haoDong}</b><br>
    - Mã nhị phân Quẻ Biến: <b>${r.transformedQueBinary}</b> → Tên quẻ Dịch: <b>${r.tenQueBienDich}</b><br>
    - Mã nhị phân Quẻ Hỗ: <b>${r.queHo.queHoFullBinary}</b> → Tên quẻ Dịch: <b>${r.tenQueHoDich}</b>
  `;

  document.getElementById('input-echo').textContent = `Giờ ${gio} · Can ${can} · Ngày ${ngay} · Tháng ${thang} · Năm ${namchi}${gioitinh ? ` · ${gioitinh}` : ''}`;

  // Trạng thái Hoán Thời Pháp
  hoanThoiCurrentCanGio = r.calculatedCanGio;
  hoanThoiCurrentChiGio = gio;
  hoanThoiOriginalCanNgay = can;
  hoanThoiHistory = [{
    type: "Giờ chủ",
    can: r.calculatedCanGio,
    chi: gio,
    nguHanhGio: r.tienThien.nguHanhGio,
    hauThienCoords: r.hauThien.coords,
    hauThienQueDon: r.hauThien.queDon,
    tienThienQueDon: r.tienThien.queDon,
    finalNguLinhQueName: r.finalNguLinhQueName,
    tenQueGocDich: r.tenQueGocDich,
    originalQueBinary: r.originalQueBinary,
    transformedQueName: r.transformedQueName,
    tenQueBienDich: r.tenQueBienDich,
    queHoName: r.queHo.queHoName,
    tenQueHoDich: r.tenQueHoDich,
  }];

  const hoanThoiBtn = document.getElementById('hoanthoi-btn');
  const hoanThoiSection = document.getElementById('hoanthoi-section');

  if (gioitinh && gioitinh.trim() !== "") {
    hoanThoiSection.style.display = 'block';
    hoanThoiBtn.disabled = true;
    hoanThoiBtn.innerText = "Hoán thời pháp";
    updateHoanThoiCurrentLabel();
    renderHoanThoiLog();
  } else {
    hoanThoiSection.style.display = 'block';
    hoanThoiBtn.disabled = false;
    hoanThoiBtn.innerText = "Hoán thời pháp";
    updateHoanThoiCurrentLabel();
    renderHoanThoiLog();
  }
}

/* =========================================================================
 * PHẦN 3 — HOÁN THỜI PHÁP
 * ========================================================================= */

let hoanThoiCurrentCanGio = null;
let hoanThoiCurrentChiGio = null;
let hoanThoiOriginalCanNgay = null;
let hoanThoiHistory = [];
const MAX_HOAN_THOI = 59;

function updateHoanThoiCurrentLabel() {
  const hoanThoiCount = hoanThoiHistory.length - 1;
  document.getElementById('hoanthoi-current-label').innerHTML =
    `Can Giờ Hiện Tại: <b>${hoanThoiCurrentCanGio}</b> &nbsp;·&nbsp; Chi Giờ Hiện Tại: <b>${hoanThoiCurrentChiGio}</b> &nbsp;·&nbsp; Số lần hoán thời pháp: <b>${hoanThoiCount}/${MAX_HOAN_THOI}</b>`;
}

function renderHoanThoiLog() {
  const container = document.getElementById('hoanthoi-log');
  container.innerHTML = "";
  hoanThoiHistory.forEach(entry => {
    const card = document.createElement('div');
    card.className = 'hoanthoi-entry' + (entry.type === "Giờ chủ" ? ' is-master' : '');
    card.innerHTML = `
      <div class="hoanthoi-entry-head">
        <span class="hoanthoi-entry-type">${entry.type}</span>
        <span class="hoanthoi-entry-canchi">${entry.can} ${entry.chi}</span>
      </div>
      <div class="hoanthoi-entry-body">
        Ngũ hành giờ: <b>${entry.nguHanhGio}</b> · Tọa độ ô chủ thời lệnh: <b>[${entry.hauThienCoords[0]}, ${entry.hauThienCoords[1]}]</b><br>
        Quẻ Hậu Thiên: <b>${entry.hauThienQueDon}</b> · Quẻ Tiên Thiên: <b>${entry.tienThienQueDon}</b><br>
        Quẻ Gốc: <b>${entry.finalNguLinhQueName}</b> → <b>${entry.tenQueGocDich}</b> (Binary: ${entry.originalQueBinary})<br>
        Quẻ Biến: <b>${entry.transformedQueName}</b> → <b>${entry.tenQueBienDich}</b><br>
        Quẻ Hỗ: <b>${entry.queHoName}</b> → <b>${entry.tenQueHoDich}</b>
      </div>
    `;
    container.appendChild(card);
  });
  container.scrollTop = container.scrollHeight;
}

function performHoanThoiPhap() {
  if (selGioiTinh.value && selGioiTinh.value.trim() !== "") {
    alert('Quẻ Đời Người không áp dụng Hoán Thời Pháp.');
    return;
  }

  const currentCount = hoanThoiHistory.length - 1;
  if (currentCount >= MAX_HOAN_THOI) {
    alert('Đã đạt giới hạn tối đa 59 lần hoán thời pháp (tối đa 59 quẻ theo giờ khách).');
    return;
  }

  if (hoanThoiCurrentCanGio === null || hoanThoiCurrentChiGio === null || hoanThoiOriginalCanNgay === null) {
    alert('Vui lòng thực hiện Lập Quẻ Ngũ Linh trước để thiết lập giờ ban đầu.');
    return;
  }

  let newCanGio, newChiGio;
  try {
    [newCanGio, newChiGio] = hoanThoiPhap(hoanThoiCurrentCanGio, hoanThoiCurrentChiGio, hoanThoiOriginalCanNgay);
  } catch (e) {
    alert('Lỗi Hoán Thời Pháp: ' + e.message);
    return;
  }

  hoanThoiCurrentCanGio = newCanGio;
  hoanThoiCurrentChiGio = newChiGio;

  try {
    const lastEntry = hoanThoiHistory[hoanThoiHistory.length - 1];
    const prevCoords = lastEntry.hauThienCoords;
    const prevIndex = pathIndexOf(prevCoords);
    if (prevIndex === -1) throw new Error(`Tọa độ trước đó [${prevCoords[0]}, ${prevCoords[1]}] không nằm trên đường di chuyển Hậu Thiên.`);

    const hourIndexNew = DIA_CHI_TO_HOUR_INDEX[newChiGio];
    const newPathIndex = pymod(prevIndex + hourIndexNew, HAU_THIEN_PATH.length);
    const transformedHauThienCoords = HAU_THIEN_PATH[newPathIndex];

    const { table } = getYearTableForChi(selNamChi.value);
    const [row, col] = transformedHauThienCoords;
    const transformedHauThienQueDon = table[row][col];
    if (!transformedHauThienQueDon) {
      throw new Error(`Không tìm thấy Quẻ đơn tại tọa độ [${row}, ${col}] sau Hoán Thời Pháp.`);
    }

    const nguHanhGioNew = calculateNguHanhGio(newCanGio, newChiGio);
    const tienThienNew = calculateTienThienQueDon(newCanGio, newChiGio, transformedHauThienCoords);

    const [orderedUpperNew, orderedLowerNew] = orderQueByCanNgayAndGender(
      hoanThoiOriginalCanNgay, selNamChi.value, selGioiTinh.value, transformedHauThienQueDon, tienThienNew.queDon
    );
    const finalNguLinhQueNameNew = `${orderedUpperNew} / ${orderedLowerNew}`;
    const tenQueGocDichNew = getTenQueDichFromTrigrams(orderedUpperNew, orderedLowerNew);

    const soTienThienHauThienNew = SO_TIEN_THIEN[transformedHauThienQueDon];
    let haoNguyenDuongNew = pymod(soTienThienHauThienNew + tienThienNew.finalSoHieu, 6);
    if (haoNguyenDuongNew === 0) haoNguyenDuongNew = 6;
    let haoDongNew = pymod(haoNguyenDuongNew + hourIndexNew, 6);
    if (haoDongNew === 0) haoDongNew = 6;

    const binaryUpperNew = TRIGRAM_TO_BINARY[orderedUpperNew];
    const binaryLowerNew = TRIGRAM_TO_BINARY[orderedLowerNew];
    const originalQueBinaryNew = binaryLowerNew + binaryUpperNew;

    const transformedQueBinaryNew = flipBit(originalQueBinaryNew, haoDongNew);
    const transformedLowerNew = transformedQueBinaryNew.slice(0, 3);
    const transformedUpperNew = transformedQueBinaryNew.slice(3, 6);
    const transformedQueNameLowerNew = BINARY_TO_TRIGRAM[transformedLowerNew];
    const transformedQueNameUpperNew = BINARY_TO_TRIGRAM[transformedUpperNew];
    const transformedQueNameNew = `${transformedQueNameUpperNew} / ${transformedQueNameLowerNew}`;
    const tenQueBienDichNew = getTenQueDichFromTrigrams(transformedQueNameUpperNew, transformedQueNameLowerNew);

    const queHoNew = calculateQueHo(originalQueBinaryNew);
    const tenQueHoDichNew = getTenQueDichFromTrigrams(queHoNew.upperName, queHoNew.lowerName);

    const newEntry = {
      type: `Giờ khách ${hoanThoiHistory.length}`,
      can: newCanGio,
      chi: newChiGio,
      nguHanhGio: nguHanhGioNew,
      hauThienCoords: transformedHauThienCoords,
      hauThienQueDon: transformedHauThienQueDon,
      tienThienQueDon: tienThienNew.queDon,
      finalNguLinhQueName: finalNguLinhQueNameNew,
      tenQueGocDich: tenQueGocDichNew,
      originalQueBinary: originalQueBinaryNew,
      transformedQueName: transformedQueNameNew,
      tenQueBienDich: tenQueBienDichNew,
      queHoName: queHoNew.queHoName,
      tenQueHoDich: tenQueHoDichNew,
    };

    hoanThoiHistory.push(newEntry);
    updateHoanThoiCurrentLabel();
    renderHoanThoiLog();

    if (hoanThoiHistory.length - 1 >= MAX_HOAN_THOI) {
      const btn = document.getElementById('hoanthoi-btn');
      btn.disabled = true;
      btn.innerText = "Hoán thời pháp";
    }

  } catch (e) {
    alert('Lỗi Hoán Thời Pháp: ' + e.message);
  }
}

const castBtn = host.querySelector('#cast-btn') || document.getElementById('cast-btn');
const hoanthoiBtn = host.querySelector('#hoanthoi-btn') || document.getElementById('hoanthoi-btn');
const toggleArrows = host.querySelector('#toggle-arrows') || document.getElementById('toggle-arrows');

if (castBtn) castBtn.addEventListener('click', cast);
if (hoanthoiBtn) hoanthoiBtn.addEventListener('click', performHoanThoiPhap);
if (toggleArrows) {
  toggleArrows.addEventListener('change', () => {
    const res = host.querySelector('#result') || document.getElementById('result');
    if (res && res.style.display === 'block') cast();
  });
}

if (selGio) selGio.value = "Dần";
if (selCan) selCan.value = "Canh";
if (selNgay) selNgay.value = "1";
if (selThang) selThang.value = "1";
if (selNamChi) selNamChi.value = "Tý";
if (selGioiTinh) selGioiTinh.value = "";

  /* ---- Unified Bridge ---- */
  if (typeof cast === 'function') {
    window.cast = cast;
    window.__KD_CAST = cast;
  } else {
    window.__KD_CAST = function() {};
  }
};
