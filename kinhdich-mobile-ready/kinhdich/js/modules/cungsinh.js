window.KD_MOD = window.KD_MOD || {};
window.KD_MOD["cungsinh"] = function() {
const host = document.querySelector('.kd-mod[data-mod="cungsinh"]');
if (!host) return;
const { KHAM_BASE, transform } = window.KD_FLYINGSTAR || {
KHAM_BASE: [[2, 3, 7], [6, 1, 5], [4, 8, 9]],
transform: (m, k) => m
};
const GUA_TRANSFORM = {
'Kh\u1ea3m': 'flip_v',
'\u0110o\u00e0i': 'anti_transpose',
'Ly':   'flip_h',
'C\u1ea5n':  'transpose',
'Kh\u00f4n': 'rot270',
'Ch\u1ea5n': 'rot180',
'T\u1ed1n':  'e',
'C\u00e0n':  'rot90',
};
function flyingStarMatrix(gua, centerNumber = 1) {
const base = transform(KHAM_BASE, GUA_TRANSFORM[gua]);
const shift = centerNumber - 1;
return base.map(row => row.map(v => ((v - 1 + shift) % 9) + 1));
}
const DIA_CHI_TABLE_CUNG_SINH = [
['T\u1ef5', 'Ng\u1ecd', 'M\u00f9i', 'Th\u00e2n'],
['Th\u00ecn', null, null, 'D\u1eadu'],
['M\u00e3o', null, null, 'Tu\u1ea5t'],
['D\u1ea7n', 'S\u1eedu', 'T\u00fd', 'H\u1ee3i'],
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
const CUNG_SINH_TABLE_1_PATH = [
[3,2], [3,3], [2,3], [1,3], [0,3], [0,2], [0,1], [0,0], [1,0], [2,0], [3,0], [3,1]
];
const CUNG_SINH_TABLE_2_PATH = [
[0,0], [0,1], [0,2], [1,2], [2,2], [3,2], [3,0], [2,0], [1,0]
];
const HOU_THIEN_NUMBER_TO_GUA_NAME = {
6: 'C\u00e0n', 7: '\u0110o\u00e0i', 9: 'Ly', 3: 'Ch\u1ea5n', 4: 'T\u1ed1n', 1: 'Kh\u1ea3m', 8: 'C\u1ea5n', 2: 'Kh\u00f4n'
};
const GUA_TO_NGU_HANH = {
'C\u00e0n': 'Kim', '\u0110o\u00e0i': 'Kim',
'Ly': 'H\u1ecfa',
'Ch\u1ea5n': 'M\u1ed9c', 'T\u1ed1n': 'M\u1ed9c',
'Kh\u1ea3m': 'Th\u1ee7y',
'C\u1ea5n': 'Th\u1ed5', 'Kh\u00f4n': 'Th\u1ed5'
};
const NGU_HANH_SINH_MAP = {
'Kim': 'Th\u1ee7y', 'Th\u1ee7y': 'M\u1ed9c', 'M\u1ed9c': 'H\u1ecfa', 'H\u1ecfa': 'Th\u1ed5', 'Th\u1ed5': 'Kim'
};
const NGU_HANH_KHAC_MAP = {
'Kim': 'M\u1ed9c', 'M\u1ed9c': 'Th\u1ed5', 'Th\u1ed5': 'Th\u1ee7y', 'Th\u1ee7y': 'H\u1ecfa', 'H\u1ecfa': 'Kim'
};
const GUA_TO_BINARY_MAP = {
'C\u00e0n': '111', '\u0110o\u00e0i': '110', 'Ly': '101', 'Ch\u1ea5n': '100', 'T\u1ed1n': '011', 'Kh\u1ea3m': '010', 'C\u1ea5n': '001', 'Kh\u00f4n': '000'
};
const XOR_RESULT_TO_BIEN_KHI = {
'001': 'Sinh kh\u00ed', '011': 'Ng\u0169 qu\u1ef7', '111': 'Di\u00ean ni\u00ean', '101': 'L\u1ee5c s\u00e1t',
'100': 'H\u1ecda h\u1ea1i', '110': 'Thi\u00ean y', '010': 'Tuy\u1ec7t m\u1ec7nh', '000': 'Ph\u1ee5c v\u1ecb'
};
const { TRIGRAM_SYMBOL, TRIGRAM_TUONG, DICH_64_BY_PAIR, CAN_DUONG, CAN_AM, CHI_DUONG, CHI_AM } = window.KD_DATA || {
TRIGRAM_SYMBOL: {}, TRIGRAM_TUONG: {}, DICH_64_BY_PAIR: {},
CAN_DUONG: ['Gi\u00e1p', 'B\u00ednh', 'M\u1eadu', 'Canh', 'Nh\u00e2m'],
CAN_AM: ['\u1ea4t', '\u0110inh', 'K\u1ef7', 'T\u00e2n', 'Qu\u00fd'],
CHI_DUONG: ['T\u00fd', 'D\u1ea7n', 'Th\u00ecn', 'Ng\u1ecd', 'Th\u00e2n', 'Tu\u1ea5t'],
CHI_AM: ['S\u1eedu', 'M\u00e3o', 'T\u1ef5', 'M\u00f9i', 'D\u1eadu', 'H\u1ee3i']
};
function getTenQueDichFromTrigrams(upper, lower) {
if (window.KD_DICH) return window.KD_DICH.getName(upper, lower);
if (!TRIGRAM_TUONG[upper] || !TRIGRAM_TUONG[lower]) return "Kh\u00f4ng x\u00e1c \u0111\u1ecbnh";
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
if (guaName === 'Trung Cung' || guaName === 'Kh\u00f4ng x\u00e1c \u0111\u1ecbnh') return null;
return GUA_TO_NGU_HANH[guaName] || null;
}
function calculateSinhKhacRelationship(cungSinhGuaName, cungPhiGuaName) {
const nguHanhSinh = getNguHanh(cungSinhGuaName);
const nguHanhPhi = getNguHanh(cungPhiGuaName);
if (nguHanhSinh === null || nguHanhPhi === null) {
return { text: "Kh\u00f4ng th\u1ec3 t\u00ednh Sinh-Kh\u1eafc (m\u1ed9t trong c\u00e1c qu\u1ebb kh\u00f4ng x\u00e1c \u0111\u1ecbnh Ng\u0169 H\u00e0nh ho\u1eb7c l\u00e0 Trung Cung).", tag: "unknown" };
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
return { text: "Kh\u00f4ng c\u00f3 m\u1ed1i quan h\u1ec7 Sinh-Kh\u1eafc tr\u1ef1c ti\u1ebfp \u0111\u01b0\u1ee3c \u0111\u1ecbnh ngh\u0129a.", tag: "unknown" };
}
function calculateBienKhi(gua1Name, gua2Name) {
const binary1 = GUA_TO_BINARY_MAP[gua1Name];
const binary2 = GUA_TO_BINARY_MAP[gua2Name];
if (!binary1 || !binary2) {
return { text: "Kh\u00f4ng th\u1ec3 t\u00ednh Bi\u1ebfn Kh\u00ed (m\u1ed9t trong c\u00e1c qu\u1ebb kh\u00f4ng c\u00f3 gi\u00e1 tr\u1ecb nh\u1ecb ph\u00e2n).", bienKhi: null };
}
const int1 = parseInt(binary1, 2);
const int2 = parseInt(binary2, 2);
const xorResultInt = int1 ^ int2;
const xorResultBinaryStr = xorResultInt.toString(2).padStart(3, '0');
const bienKhi = XOR_RESULT_TO_BIEN_KHI[xorResultBinaryStr] || "Kh\u00f4ng x\u00e1c \u0111\u1ecbnh Bi\u1ebfn Kh\u00ed";
return {
text: `Biến Khí giữa quẻ ${gua1Name} và quẻ ${gua2Name} (XOR ${binary1} và ${binary2} = ${xorResultBinaryStr}): ${bienKhi}`,
bienKhi, binary1, binary2, xorResultBinaryStr
};
}
const GENDER_OPTIONS = ['Nam', 'N\u1eef'];
const CAN_OPTIONS = ['Gi\u00e1p', '\u1ea4t', 'B\u00ednh', '\u0110inh', 'M\u1eadu', 'K\u1ef7', 'Canh', 'T\u00e2n', 'Nh\u00e2m', 'Qu\u00fd'];
const CHI_OPTIONS = ['T\u00fd', 'S\u1eedu', 'D\u1ea7n', 'M\u00e3o', 'Th\u00ecn', 'T\u1ef5', 'Ng\u1ecd', 'M\u00f9i', 'Th\u00e2n', 'D\u1eadu', 'Tu\u1ea5t', 'H\u1ee3i'];
const LAC_THU_POSITION_TO_GUA = {
'0,0': 'T\u1ed1n', '0,1': 'Ly', '0,2': 'Kh\u00f4n',
'1,0': 'Ch\u1ea5n', '1,1': 'Trung Cung', '1,2': '\u0110o\u00e0i',
'2,0': 'C\u1ea5n', '2,1': 'Kh\u1ea3m', '2,2': 'C\u00e0n'
};
function posKey(r, c) { return `${r},${c}`; }
function calculateCungSinhCungPhi(gender, birthYear, canHour, chiHour) {
const log = [];
log.push("Th\u00f4ng tin ng\u01b0\u1eddi d\u00f9ng \u0111\u00e3 nh\u1eadp:");
log.push(`- Giới tính: ${gender}`);
log.push(`- Năm sinh: ${birthYear}`);
log.push(`- Can giờ sinh: ${canHour}`);
log.push(`- Chi giờ sinh: ${chiHour}`);
log.push("");
log.push("-- T\u00ednh to\u00e1n Cung Phi --");
const yearStr = String(birthYear);
let yearSum = 0;
for (const ch of yearStr) {
if (ch >= '0' && ch <= '9') yearSum += parseInt(ch, 10);
}
let cungPhiNumber = yearSum % 9;
if (cungPhiNumber === 0) cungPhiNumber = 9;
log.push(`Tổng các chữ số của năm sinh (${birthYear}) là ${yearSum}.`);
log.push(`Số cung phi tính toán (tổng mod 9) là: ${cungPhiNumber}`);
let baseGua = '', centerValue = 0;
if (gender === 'Nam') { baseGua = 'Kh\u00f4n'; centerValue = 6; }
else if (gender === 'N\u1eef') { baseGua = 'C\u00e0n'; centerValue = 1; }
log.push(`Giới tính '${gender}' -> Dùng quẻ '${baseGua}' với trung cung ban đầu là '${centerValue}'.`);
const cungPhiMatrix = flyingStarMatrix(baseGua, centerValue);
log.push("");
log.push("Ma tr\u1eadn Cung Phi t\u01b0\u01a1ng \u1ee9ng:");
for (let r = 2; r >= 0; r--) log.push(`[${cungPhiMatrix[r].join(', ')}]`);
let cungPhiGuaName = "Kh\u00f4ng x\u00e1c \u0111\u1ecbnh";
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
if (gender === 'Nam') cungPhiGuaName = 'Kh\u00f4n';
else if (gender === 'N\u1eef') cungPhiGuaName = 'C\u1ea5n';
} else {
cungPhiGuaName = LAC_THU_POSITION_TO_GUA[posKey(visualR, visualC)] || "Kh\u00f4ng t\u00ecm th\u1ea5y qu\u1ebb t\u01b0\u01a1ng \u1ee9ng";
}
log.push("");
log.push(`Số cung phi '${cungPhiNumber}' nằm ở vị trí (${foundInternalPos}) trong ma trận nội bộ, tương ứng với vị trí (${adjustedVisualPos}) trên Lạc Thư, ứng với quẻ: ${cungPhiGuaName}`);
} else {
log.push("");
log.push(`Số cung phi '${cungPhiNumber}' không tìm thấy trong ma trận Cung Phi.`);
}
log.push("");
log.push("-- T\u00ednh to\u00e1n Cung Sinh --");
let finalGuaName = "Kh\u00f4ng x\u00e1c \u0111\u1ecbnh";
let cungSinhDetail = null;
try {
const { cungSinhValue, finalCoords, canIndex } = calculateCungSinhValue(canHour, chiHour);
log.push(`Can giờ sinh: '${canHour}', Chi giờ sinh: '${chiHour}'.`);
log.push(`Tọa độ kết thúc trên bảng cung sinh 1 kèm số tương ứng: (${finalCoords}) với số ${cungSinhValue}.`);
const startCoordsTable2 = findStartCoordsOnTable2(cungSinhValue);
log.push("");
log.push(`Tọa độ bắt đầu trên bảng cung sinh 2 (tương ứng với số ${cungSinhValue} từ Bảng Cung Sinh 1): (${startCoordsTable2})`);
const startPathIndexTable2 = pathIndexOfCoord(CUNG_SINH_TABLE_2_PATH, startCoordsTable2);
if (startPathIndexTable2 === -1) {
throw new Error(`Tọa độ bắt đầu (${startCoordsTable2}) không tìm thấy trên đường đi Cung Sinh 2.`);
}
const finalPathIndexTable2 = (startPathIndexTable2 + canIndex) % CUNG_SINH_TABLE_2_PATH.length;
const finalCoordsTable2 = CUNG_SINH_TABLE_2_PATH[finalPathIndexTable2];
const finalValueTable2 = CUNG_SINH_TABLE_2[finalCoordsTable2[0]][finalCoordsTable2[1]];
if (finalCoordsTable2[0] === 0 && finalCoordsTable2[1] === 1 && finalValueTable2 === 5) {
if (finalCoords[0] === 3 && finalCoords[1] === 2) finalGuaName = 'Kh\u1ea3m';
else if (finalCoords[0] === 2 && finalCoords[1] === 3) finalGuaName = 'Ly';
else if ((finalCoords[0] === 0 && finalCoords[1] === 3) || (finalCoords[0] === 0 && finalCoords[1] === 1)) finalGuaName = 'C\u1ea5n';
else if (finalCoords[0] === 1 && finalCoords[1] === 0) finalGuaName = '\u0110o\u00e0i';
else if (finalCoords[0] === 3 && finalCoords[1] === 1) finalGuaName = 'Kh\u00f4n';
else finalGuaName = "Kh\u00f4ng x\u00e1c \u0111\u1ecbnh (tr\u01b0\u1eddng h\u1ee3p \u0111\u1eb7c bi\u1ec7t)";
} else {
finalGuaName = HOU_THIEN_NUMBER_TO_GUA_NAME[finalValueTable2] || "Kh\u00f4ng x\u00e1c \u0111\u1ecbnh";
}
log.push(`Tọa độ kết thúc trên bảng cung sinh 2: (${finalCoordsTable2}), số tương ứng trên bảng cung sinh 2: ${finalValueTable2}, và tên của quẻ (Cung Sinh): ${finalGuaName}`);
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
log.push("-- T\u00ednh to\u00e1n Sinh - Kh\u1eafc --");
const sinhKhacResult = calculateSinhKhacRelationship(finalGuaName, cungPhiGuaName);
log.push(sinhKhacResult.text);
log.push("");
log.push("-- T\u00ednh to\u00e1n Du Ni\u00ean Bi\u1ebfn Kh\u00ed --");
const binaryCungPhi = GUA_TO_BINARY_MAP[cungPhiGuaName];
const binaryCungSinh = GUA_TO_BINARY_MAP[finalGuaName];
if (binaryCungPhi && binaryCungSinh) {
log.push(`Vị trí đặt quẻ thượng (quẻ Cung Phi: ${cungPhiGuaName}): ${binaryCungPhi}`);
log.push(`Vị trí đặt quẻ hạ (quẻ Cung Sinh: ${finalGuaName}): ${binaryCungSinh}`);
} else {
log.push("Kh\u00f4ng th\u1ec3 x\u00e1c \u0111\u1ecbnh v\u1ecb tr\u00ed \u0111\u1eb7t qu\u1ebb th\u01b0\u1ee3ng/h\u1ea1 (thi\u1ebfu th\u00f4ng tin nh\u1ecb ph\u00e2n).");
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
const selGender = document.getElementById('sel-gender');
const inpYear = document.getElementById('inp-year');
const selCan = document.getElementById('sel-can');
const selChi = document.getElementById('sel-chi');
GENDER_OPTIONS.forEach(g => selGender.add(new Option(g, g)));
CAN_OPTIONS.forEach(c => selCan.add(new Option(c, c)));
CHI_OPTIONS.forEach(c => selChi.add(new Option(c, c)));
const PRESETS = [
{ gender: 'Nam', year: 1990, can: 'Gi\u00e1p', chi: 'T\u00fd' },
{ gender: 'N\u1eef', year: 1985, can: 'Canh', chi: 'Ng\u1ecd' },
{ gender: 'Nam', year: 2000, can: '\u0110inh', chi: 'M\u00e3o' },
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
errorBox.textContent = 'L\u1ed7i: N\u0103m sinh kh\u00f4ng h\u1ee3p l\u1ec7.';
return;
}
if (!isValidCanChi(can, chi)) {
result.style.display = 'none';
errorBox.style.display = 'block';
errorBox.textContent = 'Can v\u00e0 chi kh\u00f4ng h\u1ee3p l\u1ec7.';
return;
}
const r = calculateCungSinhCungPhi(gender, birthYear, can, chi);
errorBox.style.display = 'none';
result.style.display = 'block';
const goldColor = getComputedStyle(document.documentElement).getPropertyValue('--gold').trim();
const jadeColor = getComputedStyle(document.documentElement).getPropertyValue('--jade').trim();
const cinnabarColor = getComputedStyle(document.documentElement).getPropertyValue('--cinnabar').trim();
renderGrid('svg-cungphi', 3, 3, goldColor);
const svgCP = document.getElementById('svg-cungphi');
for (let visualR = 0; visualR < 3; visualR++) {
for (let visualC = 0; visualC < 3; visualC++) {
const internalR = 2 - visualR;
const value = r.cungPhiMatrix[internalR][visualC];
const isCenter = (visualR === 1 && visualC === 1);
let guaLabel;
if (isCenter) {
guaLabel = (gender === 'Nam') ? 'Kh\u00f4n' : 'C\u1ea5n';
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
document.getElementById('cungsinh1-desc').textContent = 'Kh\u00f4ng t\u00ednh \u0111\u01b0\u1ee3c (xem l\u1ed7i b\u00ean d\u01b0\u1edbi).';
document.getElementById('cungsinh1-caption').textContent = '';
document.getElementById('cungsinh1-value').textContent = '';
document.getElementById('cs1-steps').innerHTML = '';
}
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
document.getElementById('cungsinh2-desc').textContent = 'Kh\u00f4ng t\u00ednh \u0111\u01b0\u1ee3c (xem l\u1ed7i b\u00ean d\u01b0\u1edbi).';
document.getElementById('cungsinh2-caption').textContent = '';
document.getElementById('cungsinh2-symbol').textContent = '';
document.getElementById('cungsinh2-name').textContent = '';
document.getElementById('cungsinh2-nguhanh').textContent = '';
document.getElementById('cs2-steps').innerHTML = '';
}
const upperGua = r.cungPhiGuaName;
const lowerGua = r.finalGuaName;
const tenQueDich = getTenQueDichFromTrigrams(upperGua, lowerGua);
document.getElementById('tonghop-title').textContent = tenQueDich;
document.getElementById('ghep-title').textContent = tenQueDich;
document.getElementById('ghep-symbols').innerHTML =
`Thượng: <b>${TRIGRAM_SYMBOL[upperGua] || '?'} ${upperGua}</b> &nbsp;·&nbsp; Hạ: <b>${TRIGRAM_SYMBOL[lowerGua] || '?'} ${lowerGua}</b>`;
if (r.binaryCungPhi && r.binaryCungSinh) {
const combinedBinary6 = r.binaryCungSinh + r.binaryCungPhi;
renderCombinedBars('bars-ghep', combinedBinary6);
} else {
document.getElementById('bars-ghep').innerHTML = '';
}
document.getElementById('card-phi-title').textContent = `${TRIGRAM_SYMBOL[r.cungPhiGuaName] || ''} ${r.cungPhiGuaName}`;
document.getElementById('card-phi-sub').textContent = GUA_TO_NGU_HANH[r.cungPhiGuaName] ? `Ngũ hành: ${GUA_TO_NGU_HANH[r.cungPhiGuaName]}` : 'Ng\u0169 h\u00e0nh: \u2014';
if (r.binaryCungPhi) renderBars('bars-phi', r.binaryCungPhi, 'qcp'); else document.getElementById('bars-phi').innerHTML = '';
document.getElementById('card-sinh-title').textContent = `${TRIGRAM_SYMBOL[r.finalGuaName] || ''} ${r.finalGuaName}`;
document.getElementById('card-sinh-sub').textContent = GUA_TO_NGU_HANH[r.finalGuaName] ? `Ngũ hành: ${GUA_TO_NGU_HANH[r.finalGuaName]}` : 'Ng\u0169 h\u00e0nh: \u2014';
if (r.binaryCungSinh) renderBars('bars-sinh', r.binaryCungSinh, 'qcs'); else document.getElementById('bars-sinh').innerHTML = '';
document.getElementById('sinhkhac-value').textContent = r.sinhKhacResult.text;
const tagLabels = { best: 'R\u1ea5t t\u1ed1t', good: 'T\u1ed1t', neutral: 'Trung b\u00ecnh', bad: 'X\u1ea5u', worst: 'R\u1ea5t x\u1ea5u', unknown: 'Kh\u00f4ng r\u00f5' };
const chipText = tagLabels[r.sinhKhacResult.tag] || r.sinhKhacResult.tag;
document.getElementById('sinhkhac-chip-wrap').innerHTML = `<span class="sinh-khac-chip ${chipClass(r.sinhKhacResult.tag)}">${chipText}</span>`;
if (r.bienKhiResult.bienKhi) {
document.getElementById('bienkhi-value').textContent = r.bienKhiResult.bienKhi;
document.getElementById('bienkhi-formula').textContent = `XOR ${r.bienKhiResult.binary1} và ${r.bienKhiResult.binary2} = ${r.bienKhiResult.xorResultBinaryStr}`;
} else {
document.getElementById('bienkhi-value').textContent = '\u2014';
document.getElementById('bienkhi-formula').textContent = r.bienKhiResult.text;
}
document.getElementById('steps-body').textContent = r.log.join('\n');
document.getElementById('input-echo').textContent = `${gender} · ${birthYear} · Can ${can} · Chi ${chi}`;
}
document.getElementById('cast-btn').addEventListener('click', cast);
document.getElementById('toggle-arrows').addEventListener('change', () => {
if (document.getElementById('result').style.display === 'block') cast();
});
selGender.value = "Nam"; inpYear.value = 1990; selCan.value = "Gi\u00e1p"; selChi.value = "T\u00fd";
if (typeof cast === 'function') {
window.cast = cast;
window.__KD_CAST = cast;
} else {
window.__KD_CAST = function() {};
}
};