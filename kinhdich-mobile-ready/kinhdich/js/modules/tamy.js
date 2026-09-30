window.KD_MOD = window.KD_MOD || {};
window.KD_MOD["tamy"] = function() {
const host = document.querySelector('.kd-mod[data-mod="tamy"]');
if (!host) return;
const { KHAM_BASE, transform } = window.KD_FLYINGSTAR || {
KHAM_BASE: [[2, 3, 7], [6, 1, 5], [4, 8, 9]],
transform: (m, k) => m
};
const { mod: pymod, toggleStepBox } = window.KD_UTIL || {
mod: (n, m) => ((n % m) + m) % m,
toggleStepBox: id => document.getElementById(id)?.classList.toggle('open')
};
const GUA_TRANSFORM = {
'Kh\u1ea3m': 'flip_v',
'\u0110o\u00e0i': 'anti_transpose',
'Ly':   'flip_h',
'C\u1ea5n':  'transpose',
'Kh\u00f4n': 'transpose',
'Ch\u1ea5n': 'rot180',
'T\u1ed1n':  'e',
'C\u00e0n':  'anti_transpose',
};
function flyingStarMatrix(gua, centerNumber = 1) {
const base = transform(KHAM_BASE, GUA_TRANSFORM[gua]);
const shift = centerNumber - 1;
return base.map(row => row.map(v => pymod(v - 1 + shift, 9) + 1));
}
const LAC_THU_BA_GUA_ARRANGEMENT = [
['T\u1ed1n', 'Ly', 'Kh\u00f4n'],
['Ch\u1ea5n', null, '\u0110o\u00e0i'],
['C\u1ea5n', 'Kh\u1ea3m', 'C\u00e0n'],
];
const BA_GUA_BINARY = {
'C\u00e0n': '111', '\u0110o\u00e0i': '110', 'Ly': '101', 'Ch\u1ea5n': '100',
'T\u1ed1n': '011', 'Kh\u1ea3m': '010', 'C\u1ea5n': '001', 'Kh\u00f4n': '000',
};
const BIEN_KHI_MEANINGS = {
'001': 'Sinh kh\u00ed', '011': 'Ng\u0169 qu\u1ef7', '111': 'Di\u00ean ni\u00ean', '101': 'L\u1ee5c s\u00e1t',
'100': 'H\u1ecda h\u1ea1i', '110': 'Thi\u00ean y', '010': 'Tuy\u1ec7t m\u1ec7nh', '000': 'Ph\u1ee5c v\u1ecb',
};
const LUC_THAP_HOA_GIAP = {
1:'Gi\u00e1p T\u00fd',2:'\u1ea4t S\u1eedu',3:'B\u00ednh D\u1ea7n',4:'\u0110inh M\u00e3o',5:'M\u1eadu Th\u00ecn',6:'K\u1ef7 T\u1ef5',7:'Canh Ng\u1ecd',8:'T\u00e2n M\u00f9i',9:'Nh\u00e2m Th\u00e2n',10:'Qu\u00fd D\u1eadu',
11:'Gi\u00e1p Tu\u1ea5t',12:'\u1ea4t H\u1ee3i',13:'B\u00ednh T\u00fd',14:'\u0110inh S\u1eedu',15:'M\u1eadu D\u1ea7n',16:'K\u1ef7 M\u00e3o',17:'Canh Th\u00ecn',18:'T\u00e2n T\u1ef5',19:'Nh\u00e2m Ng\u1ecd',20:'Qu\u00fd M\u00f9i',
21:'Gi\u00e1p Th\u00e2n',22:'\u1ea4t D\u1eadu',23:'B\u00ednh Tu\u1ea5t',24:'\u0110inh H\u1ee3i',25:'M\u1eadu T\u00fd',26:'K\u1ef7 S\u1eedu',27:'Canh D\u1ea7n',28:'T\u00e2n M\u00e3o',29:'Nh\u00e2m Th\u00ecn',30:'Qu\u00fd T\u1ef5',
31:'Gi\u00e1p Ng\u1ecd',32:'\u1ea4t M\u00f9i',33:'B\u00ednh Th\u00e2n',34:'\u0110inh D\u1eadu',35:'M\u1eadu Tu\u1ea5t',36:'K\u1ef7 H\u1ee3i',37:'Canh T\u00fd',38:'T\u00e2n S\u1eedu',39:'Nh\u00e2m D\u1ea7n',40:'Qu\u00fd M\u00e3o',
41:'Gi\u00e1p Th\u00ecn',42:'\u1ea4t T\u1ef5',43:'B\u00ednh Ng\u1ecd',44:'\u0110inh M\u00f9i',45:'M\u1eadu Th\u00e2n',46:'K\u1ef7 D\u1eadu',47:'Canh Tu\u1ea5t',48:'T\u00e2n H\u1ee3i',49:'Nh\u00e2m T\u00fd',50:'Qu\u00fd S\u1eedu',
51:'Gi\u00e1p D\u1ea7n',52:'\u1ea4t M\u00e3o',53:'B\u00ednh Th\u00ecn',54:'\u0110inh T\u1ef5',55:'M\u1eadu Ng\u1ecd',56:'K\u1ef7 M\u00f9i',57:'Canh Th\u00e2n',58:'T\u00e2n D\u1eadu',59:'Nh\u00e2m Tu\u1ea5t',60:'Qu\u00fd H\u1ee3i',
};
const LUC_THAP_HOA_GIAP_REVERSE = Object.fromEntries(Object.entries(LUC_THAP_HOA_GIAP).map(([k,v]) => [v, parseInt(k)]));
const HAU_THIEN_SO = {
'C\u00e0n': 6, '\u0110o\u00e0i': 7, 'Ly': 9, 'Ch\u1ea5n': 3, 'T\u1ed1n': 4, 'Kh\u1ea3m': 1, 'C\u1ea5n': 8, 'Kh\u00f4n': [2, 5],
};
const THIEN_CAN_FROM_YEAR_LAST_DIGIT = {
4:'Gi\u00e1p',5:'\u1ea4t',6:'B\u00ednh',7:'\u0110inh',8:'M\u1eadu',9:'K\u1ef7',0:'Canh',1:'T\u00e2n',2:'Nh\u00e2m',3:'Qu\u00fd',
};
const CHI_MAP = {
0:'Th\u00e2n',1:'D\u1eadu',2:'Tu\u1ea5t',3:'H\u1ee3i',4:'T\u00fd',5:'S\u1eedu',6:'D\u1ea7n',7:'M\u00e3o',8:'Th\u00ecn',9:'T\u1ef5',10:'Ng\u1ecd',11:'M\u00f9i',
};
const NGU_HO_DON_MAP = {
'Gi\u00e1p':'B\u00ednh','K\u1ef7':'B\u00ednh','\u1ea4t':'M\u1eadu','Canh':'M\u1eadu','B\u00ednh':'Canh','T\u00e2n':'Canh','Nh\u00e2m':'Nh\u00e2m','\u0110inh':'Nh\u00e2m','M\u1eadu':'Gi\u00e1p','Qu\u00fd':'Gi\u00e1p',
};
const THIEN_CAN_ORDER = ['Gi\u00e1p','\u1ea4t','B\u00ednh','\u0110inh','M\u1eadu','K\u1ef7','Canh','T\u00e2n','Nh\u00e2m','Qu\u00fd'];
const DIA_CHI_MONTH_ORDER = ['D\u1ea7n','M\u00e3o','Th\u00ecn','T\u1ef5','Ng\u1ecd','M\u00f9i','Th\u00e2n','D\u1eadu','Tu\u1ea5t','H\u1ee3i','T\u00fd','S\u1eedu'];
const GUA_DIRECTIONS = {
'C\u00e0n':'T\u00e2y B\u1eafc', '\u0110o\u00e0i':'T\u00e2y', 'Ly':'Nam', 'Ch\u1ea5n':'\u0110\u00f4ng',
'T\u1ed1n':'\u0110\u00f4ng Nam', 'Kh\u1ea3m':'B\u1eafc', 'C\u1ea5n':'\u0110\u00f4ng B\u1eafc', 'Kh\u00f4n':'T\u00e2y Nam',
};
const CUU_TINH_TRUC_NIEN_MONTHS = {
'T\u00fd':  [8,7,6,5,4,3,2,1,9,8,7,6],
'Ng\u1ecd': [8,7,6,5,4,3,2,1,9,8,7,6],
'M\u00e3o': [8,7,6,5,4,3,2,1,9,8,7,6],
'D\u1eadu': [8,7,6,5,4,3,2,1,9,8,7,6],
'Th\u00ecn':[5,4,3,2,1,9,8,7,6,5,4,3],
'Tu\u1ea5t':[5,4,3,2,1,9,8,7,6,5,4,3],
'S\u1eedu': [5,4,3,2,1,9,8,7,6,5,4,3],
'M\u00f9i': [5,4,3,2,1,9,8,7,6,5,4,3],
'D\u1ea7n': [2,1,9,8,7,6,5,4,3,2,1,9],
'Th\u00e2n':[2,1,9,8,7,6,5,4,3,2,1,9],
'T\u1ef5':  [2,1,9,8,7,6,5,4,3,2,1,9],
'H\u1ee3i': [2,1,9,8,7,6,5,4,3,2,1,9],
};
const START_COORDINATES_MAP = {
'Gi\u00e1p':[0,0], 'K\u1ef7':[0,0], 'B\u00ednh':[0,1], 'T\u00e2n':[0,1], 'M\u1eadu':[0,2], 'Qu\u00fd':[0,2],
'Canh':[2,2], '\u1ea4t':[2,2], 'Nh\u00e2m':[2,1], '\u0110inh':[2,1],
};
function calculateCungPhiNumber(year) {
const sumDigits = String(year).split('').reduce((a, d) => a + parseInt(d), 0);
let n = pymod(sumDigits, 9);
if (n === 0) n = 9;
return n;
}
function getGuaFromCungPhi(gender, yearOfBirth) {
const cungPhiNum = calculateCungPhiNumber(yearOfBirth);
let matrixTypeGua, matrixCenterNum;
if (gender === 'male') { matrixTypeGua = 'Kh\u00f4n'; matrixCenterNum = 6; }
else if (gender === 'female') { matrixTypeGua = 'C\u00e0n'; matrixCenterNum = 1; }
else throw new Error("Gi\u1edbi t\u00ednh ph\u1ea3i l\u00e0 'male' ho\u1eb7c 'female'");
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
if (rowIdx === 1 && colIdx === 1) guaName = 'Kh\u00f4n';
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
return BIEN_KHI_MEANINGS[xorResult] || 'Kh\u00f4ng x\u00e1c \u0111\u1ecbnh';
}
function findMatchingGuaForBienKhi(userGua, targetMeaning) {
for (const guaName of Object.keys(BA_GUA_BINARY)) {
if (getBienKhiMeaning(userGua, guaName) === targetMeaning) return guaName;
}
return null;
}
function getSingleHauThienSo(guaName) {
const num = HAU_THIEN_SO[guaName];
if (Array.isArray(num)) return 2;
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
const firstValidDayIndex = pymod(initialIdx + stepsToMove - 1, 60) + 1;
return { monthNumber: monthNum, canForMonth, chiForMonth, monthCanChiStr, initialIdx, firstValidDayIndex };
}
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
const rawValidDays = [];
let currentIndexFor7Solutions = pymod(info.initialIdx - 1 + stepsToMove, 60) + 1;
for (let i = 0; i < 7; i++) {
const canChiStr = LUC_THAP_HOA_GIAP[currentIndexFor7Solutions];
rawValidDays.push({ index: currentIndexFor7Solutions, canChi: canChiStr });
currentIndexFor7Solutions = pymod(currentIndexFor7Solutions - 1 + 9, 60) + 1;
}
const vongGiapStartIndex = getVongGiapStartIndex(info.initialIdx);
const shiftedDay1LthgIndex = getShiftedLthgIndex(day1Index, vongGiapStartIndex);
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
const cungPhi = getGuaFromCungPhi(gender, yearOfBirth);
if (!cungPhi.guaName) throw new Error('Kh\u00f4ng x\u00e1c \u0111\u1ecbnh \u0111\u01b0\u1ee3c Cung Phi b\u1ea3n m\u1ec7nh.');
const cungPhiGua = cungPhi.guaName;
const matchingGua = findMatchingGuaForBienKhi(cungPhiGua, calculationType);
if (!matchingGua) throw new Error(`Không tìm thấy quẻ ${calculationType} cho Cung Phi '${cungPhiGua}'.`);
const cungPhiGuaCoords = findGuaCoords(cungPhiGua);
if (!cungPhiGuaCoords) throw new Error(`Không tìm thấy tọa độ cho Cung Phi '${cungPhiGua}' trong Lạc Thư.`);
const matchingGuaHauThienSo = getSingleHauThienSo(matchingGua);
const baseCanMatrix = transform(KHAM_BASE, GUA_TRANSFORM['C\u00e0n']);
const vAtCungPhiInBaseCan = baseCanMatrix[cungPhiGuaCoords[0]][cungPhiGuaCoords[1]];
const shiftForCenterNum = pymod(matchingGuaHauThienSo - 1 - (vAtCungPhiInBaseCan - 1), 9);
const centerNumForCanMatrix = shiftForCenterNum + 1;
const cuuTinhTrucNguyetMatrix = flyingStarMatrix('C\u00e0n', centerNumForCanMatrix);
const canForYear = getCanFromYear(yearToCalculate);
const chiForYear = getChiFromYear(yearToCalculate);
const startCoords = START_COORDINATES_MAP[canForYear];
const valueAtStartCoords = cuuTinhTrucNguyetMatrix[startCoords[0]][startCoords[1]];
const matchingGuaCoords = findGuaCoords(matchingGua);
const valueAtMatchingGuaCoords = cuuTinhTrucNguyetMatrix[matchingGuaCoords[0]][matchingGuaCoords[1]];
const stepsToMove = pymod(valueAtMatchingGuaCoords - valueAtStartCoords, 9);
const starsForChi = CUU_TINH_TRUC_NIEN_MONTHS[chiForYear];
const monthIndices = [];
starsForChi.forEach((v, idx) => { if (v === valueAtStartCoords) monthIndices.push(idx); });
const monthsInfo = monthIndices.map(idx => getMonthInfo(idx + 1, canForYear, stepsToMove));
const direction = GUA_DIRECTIONS[matchingGua];
return {
cungPhi, cungPhiGua, matchingGua, matchingGuaHauThienSo,
cungPhiGuaCoords, baseCanMatrix, vAtCungPhiInBaseCan, shiftForCenterNum, centerNumForCanMatrix,
cuuTinhTrucNguyetMatrix, canForYear, chiForYear, startCoords, valueAtStartCoords,
matchingGuaCoords, valueAtMatchingGuaCoords, stepsToMove,
starsForChi, monthIndices, monthsInfo, direction,
};
}
const TRIGRAM_SYMBOL = { "C\u00e0n":"\u2630","\u0110o\u00e0i":"\u2631","Ly":"\u2632","Ch\u1ea5n":"\u2633","T\u1ed1n":"\u2634","Kh\u1ea3m":"\u2635","C\u1ea5n":"\u2636","Kh\u00f4n":"\u2637" };
const inNamSinh = document.getElementById('in-namsinh');
const inNamTinh = document.getElementById('in-namtinh');
const selGender = document.getElementById('sel-gender');
const selType = document.getElementById('sel-type');
const PRESETS = [
{ namsinh: 2003, namtinh: 2003, gender: 'male', type: 'Thi\u00ean y' },
{ namsinh: 2003, namtinh: 2003, gender: 'male', type: 'Sinh kh\u00ed' },
{ namsinh: 2023, namtinh: 2027, gender: 'female', type: 'Thi\u00ean y' },
{ namsinh: 2023, namtinh: 2027, gender: 'female', type: 'Sinh kh\u00ed' },
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
errorBox.textContent = 'L\u1ed7i: ' + e.message;
return;
}
errorBox.style.display = 'none';
result.style.display = 'block';
const goldColor = getComputedStyle(document.documentElement).getPropertyValue('--gold').trim();
const jadeColor = getComputedStyle(document.documentElement).getPropertyValue('--jade').trim();
const cinnabarColor = getComputedStyle(document.documentElement).getPropertyValue('--cinnabar').trim();
const svgCP = renderGrid3('svg-cungphi');
for (let rr = 0; rr < 3; rr++) for (let cc = 0; cc < 3; cc++) {
const label = (rr === 1 && cc === 1) ? 'Kh\u00f4n*' : (LAC_THU_BA_GUA_ARRANGEMENT[rr][cc] || '');
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
document.getElementById('bienkhi-title').textContent = `Quẻ ${type === 'Thiên y' ? 'Thiên Y' : 'Sinh Khí'}`;
document.getElementById('bienkhi-desc').innerHTML =
`XOR nhị phân giữa Cung Phi <b>${r.cungPhiGua}</b> (${BA_GUA_BINARY[r.cungPhiGua]}) và các quẻ còn lại, tìm kết quả mang nghĩa <b>${type}</b>.`;
document.getElementById('bienkhi-symbol').textContent = TRIGRAM_SYMBOL[r.matchingGua];
document.getElementById('bienkhi-name').textContent = r.matchingGua;
document.getElementById('bienkhi-meaning').textContent = type === 'Thi\u00ean y' ? 'Thi\u00ean Y' : 'Sinh Kh\u00ed';
document.getElementById('bienkhi-direction').textContent = `Hướng: ${r.direction}`;
document.getElementById('bk-steps').innerHTML = `
<b>Chi tiết các bước Biến Khí:</b><br>
1. Nhị phân Cung Phi ${r.cungPhiGua} = <b>${BA_GUA_BINARY[r.cungPhiGua]}</b><br>
2. Duyệt các quẻ, XOR nhị phân, đối chiếu bảng ý nghĩa Bát Biến<br>
3. Quẻ cho kết quả '${type}' = <b>${r.matchingGua}</b> (${BA_GUA_BINARY[r.matchingGua]})<br>
4. XOR = ${binaryXor(BA_GUA_BINARY[r.cungPhiGua], BA_GUA_BINARY[r.matchingGua])} → <b>${type}</b>
`;
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
inNamSinh.value = 1990; inNamTinh.value = 2024; selGender.value = 'male'; selType.value = 'Thi\u00ean y';
if (typeof cast === 'function') {
window.cast = cast;
window.__KD_CAST = cast;
} else {
window.__KD_CAST = function() {};
}
};