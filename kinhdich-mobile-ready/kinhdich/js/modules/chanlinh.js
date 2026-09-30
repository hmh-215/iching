window.KD_MOD = window.KD_MOD || {};
window.KD_MOD["chanlinh"] = function() {
const host = document.querySelector('.kd-mod[data-mod="chanlinh"]');
if (!host) return;
const { DICH_64_BY_PAIR, TRIGRAM_TUONG, TRIGRAM_SYMBOL } = window.KD_DATA || { DICH_64_BY_PAIR: {}, TRIGRAM_TUONG: {}, TRIGRAM_SYMBOL: {} };
const { getName: getTenQueDich } = window.KD_DICH || {
getName: (u, l) => (u && l ? `${TRIGRAM_TUONG[u]||u} ${TRIGRAM_TUONG[l]||l}` : '')
};
const { KHAM_BASE, transform } = window.KD_FLYINGSTAR || {
KHAM_BASE: [[2, 3, 7], [6, 1, 5], [4, 8, 9]],
transform: (m, k) => m
};
const { mod: pymod } = window.KD_UTIL || { mod: (n, m) => ((n % m) + m) % m };
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
['C\u1ea5n', 'Kh\u1ea3m', 'C\u00e0n']
];
const BA_GUA_BINARY = {
'C\u00e0n': '111', '\u0110o\u00e0i': '110', 'Ly': '101', 'Ch\u1ea5n': '100',
'T\u1ed1n': '011', 'Kh\u1ea3m': '010', 'C\u1ea5n': '001', 'Kh\u00f4n': '000'
};
const BIEN_KHI_MEANINGS = {
'001': 'Sinh kh\u00ed', '011': 'Ng\u0169 qu\u1ef7', '111': 'Di\u00ean ni\u00ean', '101': 'L\u1ee5c s\u00e1t',
'100': 'H\u1ecda h\u1ea1i', '110': 'Thi\u00ean y', '010': 'Tuy\u1ec7t m\u1ec7nh', '000': 'Ph\u1ee5c v\u1ecb'
};
const HAU_THIEN_SO = {
'C\u00e0n': 6, '\u0110o\u00e0i': 7, 'Ly': 9, 'Ch\u1ea5n': 3, 'T\u1ed1n': 4, 'Kh\u1ea3m': 1, 'C\u1ea5n': 8, 'Kh\u00f4n': [2, 5]
};
const THIEN_CAN_FROM_YEAR_LAST_DIGIT = {
4: 'Gi\u00e1p', 5: '\u1ea4t', 6: 'B\u00ednh', 7: '\u0110inh', 8: 'M\u1eadu',
9: 'K\u1ef7', 0: 'Canh', 1: 'T\u00e2n', 2: 'Nh\u00e2m', 3: 'Qu\u00fd'
};
const CHI_MAP = {
0: 'Th\u00e2n', 1: 'D\u1eadu', 2: 'Tu\u1ea5t', 3: 'H\u1ee3i', 4: 'T\u00fd', 5: 'S\u1eedu',
6: 'D\u1ea7n', 7: 'M\u00e3o', 8: 'Th\u00ecn', 9: 'T\u1ef5', 10: 'Ng\u1ecd', 11: 'M\u00f9i'
};
const DIA_CHI_MONTH_ORDER = [
'D\u1ea7n', 'M\u00e3o', 'Th\u00ecn', 'T\u1ef5', 'Ng\u1ecd', 'M\u00f9i',
'Th\u00e2n', 'D\u1eadu', 'Tu\u1ea5t', 'H\u1ee3i', 'T\u00fd', 'S\u1eedu'
];
const DIA_CHI_MATRIX = [
['Th\u00ecn_T\u1ef5', 'Ng\u1ecd', 'M\u00f9i_Th\u00e2n'],
['M\u00e3o', null, 'D\u1eadu'],
['S\u1eedu_D\u1ea7n', 'T\u00fd', 'Tu\u1ea5t_H\u1ee3i']
];
const KHI_MATRIX = [
['Ph\u00e1 b\u1ea1i', 'Th\u00f4ng thi\u00ean', 'C\u00f4 th\u01b0\u01a1ng'],
['\u0110\u1ea1i an', null, 'Th\u1ee5 \u00e1m'],
['Nguy\u00ean c\u00e1t', 'Kh\u00f4ng Vong', '\u0110\u1ecba l\u1ee3i']
];
const NAP_CAN_AN_MALE = {
'C\u00e0n': ['Gi\u00e1p'], '\u0110o\u00e0i': ['\u0110inh', 'K\u1ef7'], 'Ly': ['Nh\u00e2m'], 'Ch\u1ea5n': ['Canh'],
'T\u1ed1n': ['T\u00e2n'], 'Kh\u1ea3m': ['Qu\u00fd'], 'C\u1ea5n': ['B\u00ednh', 'M\u1eadu'], 'Kh\u00f4n': ['\u1ea4t']
};
const NAP_CAN_AN_FEMALE = {
'C\u00e0n': ['Gi\u00e1p', 'Nh\u00e2m'], '\u0110o\u00e0i': ['\u0110inh'], 'Ly': ['K\u1ef7'], 'Ch\u1ea5n': ['Canh'],
'T\u1ed1n': ['T\u00e2n'], 'Kh\u1ea3m': ['M\u1eadu'], 'C\u1ea5n': ['B\u00ednh'], 'Kh\u00f4n': ['\u1ea4t', 'Qu\u00fd']
};
const BAT_QUAI_CHAN_LINH_THAN_TY_THIN = [
['Kh\u1ea3m', 'Ly', '\u0110o\u00e0i'],
['Ch\u1ea5n', null, 'T\u1ed1n'],
['C\u00e0n', 'C\u1ea5n', 'Kh\u00f4n']
];
const BAT_QUAI_CHAN_LINH_DAN_NGO_TUAT = [
['Kh\u00f4n', 'C\u1ea5n', 'C\u00e0n'],
['T\u1ed1n', null, 'Ch\u1ea5n'],
['\u0110o\u00e0i', 'Ly', 'Kh\u1ea3m']
];
const BAT_QUAI_CHAN_LINH_TY_DAU_SUU = [
['\u0110o\u00e0i', 'T\u1ed1n', 'Kh\u00f4n'],
['Ly', null, 'C\u1ea5n'],
['Kh\u1ea3m', 'Ch\u1ea5n', 'C\u00e0n']
];
const BAT_QUAI_CHAN_LINH_HOI_MAO_MUI = [
['C\u00e0n', 'Ch\u1ea5n', 'Kh\u1ea3m'],
['C\u1ea5n', null, 'Ly'],
['Kh\u00f4n', 'T\u1ed1n', '\u0110o\u00e0i']
];
function pickBatQuaiChanLinhMatrix(chiMonth) {
if (['D\u1ea7n','Ng\u1ecd','Tu\u1ea5t'].includes(chiMonth)) return BAT_QUAI_CHAN_LINH_DAN_NGO_TUAT;
if (['Th\u00e2n','T\u00fd','Th\u00ecn'].includes(chiMonth)) return BAT_QUAI_CHAN_LINH_THAN_TY_THIN;
if (['T\u1ef5','D\u1eadu','S\u1eedu'].includes(chiMonth)) return BAT_QUAI_CHAN_LINH_TY_DAU_SUU;
if (['H\u1ee3i','M\u00e3o','M\u00f9i'].includes(chiMonth)) return BAT_QUAI_CHAN_LINH_HOI_MAO_MUI;
return null;
}
const CUU_TINH_UNG_BAT_QUAI = {
'La H\u1ea7u': {Hanh:'Th\u1ee7y', Que:'Kh\u1ea3m'}, 'Th\u1ed5 T\u00fa': {Hanh:'Th\u1ed5', Que:'Kh\u00f4n'},
'Th\u1ee7y Di\u1ec7u': {Hanh:'Th\u1ee7y', Que:'Kh\u1ea3m'}, 'Th\u00e1i B\u1ea1ch': {Hanh:'Kim', Que:'C\u00e0n'},
'Th\u00e1i D\u01b0\u01a1ng': {Hanh:'H\u1ecfa', Que:'Ly'}, 'V\u00e2n H\u1edbn': {Hanh:'M\u1ed9c', Que:'T\u1ed1n'},
'K\u1ebf \u0110\u00f4': {Hanh:'Th\u1ed5', Que:'C\u1ea5n'}, 'Th\u00e1i \u00c2m': {Hanh:'Kim', Que:'\u0110o\u00e0i'},
'M\u1ed9c \u0110\u1ee9c': {Hanh:'M\u1ed9c', Que:'Ch\u1ea5n'}
};
const CUU_TINH_NIEN_VAN_NAM_PLUS = [
['Th\u00e1i B\u1ea1ch', 'M\u1ed9c \u0110\u1ee9c', 'Th\u1ed5 T\u00fa'],
['Th\u1ee7y Di\u1ec7u', 'Th\u00e1i D\u01b0\u01a1ng', 'K\u1ebf \u0110\u00f4'],
['Th\u00e1i D\u01b0\u01a1ng', 'La H\u1ea7u', 'V\u00e2n H\u1edbn']
];
const CUU_TINH_NIEN_VAN_NAM_MINUS = [
['Th\u00e1i B\u1ea1ch', 'M\u1ed9c \u0110\u1ee9c', 'Th\u1ed5 T\u00fa'],
['Th\u1ee7y Di\u1ec7u', 'Th\u00e1i D\u01b0\u01a1ng', 'K\u1ebf \u0110\u00f4'],
['Th\u00e1i \u00c2m', 'La H\u1ea7u', 'V\u00e2n H\u1edbn']
];
const CUU_TINH_NIEN_VAN_NU_PLUS = [
['Th\u00e1i \u00c2m', 'Th\u1ee7y Di\u1ec7u', 'Th\u1ed5 T\u00fa'],
['M\u1ed9c \u0110\u1ee9c', 'Th\u1ed5 T\u00fa', 'Th\u00e1i D\u01b0\u01a1ng'],
['Th\u00e1i B\u1ea1ch', 'K\u1ebf \u0110\u00f4', 'La H\u1ea7u']
];
const CUU_TINH_NIEN_VAN_NU_MINUS = [
['Th\u00e1i \u00c2m', 'Th\u1ee7y Di\u1ec7u', 'V\u00e2n H\u1edbn'],
['M\u1ed9c \u0110\u1ee9c', 'Th\u1ed5 T\u00fa', 'Th\u00e1i D\u01b0\u01a1ng'],
['Th\u1ed5 T\u00fa', 'K\u1ebf \u0110\u00f4', 'La H\u1ea7u']
];
function pickCuuTinhNienVanMatrix(amDuongType) {
if (amDuongType === 'Nam+') return CUU_TINH_NIEN_VAN_NAM_PLUS;
if (amDuongType === 'Nam-') return CUU_TINH_NIEN_VAN_NAM_MINUS;
if (amDuongType === 'N\u1eef+') return CUU_TINH_NIEN_VAN_NU_PLUS;
if (amDuongType === 'N\u1eef-') return CUU_TINH_NIEN_VAN_NU_MINUS;
return null;
}
const NHAT_BIEN_HA_VI_LIEM_MATRIX = [
['Ph\u1ee5 B\u1eadt','Li\u00eam Trinh','L\u1ed9c T\u1ed3n'],
['Tham Lang', null, 'Ph\u00e1 Qu\u00e2n'],
['C\u1ef1 M\u00f4n','V\u0103n Kh\u00fac','V\u0169 Kh\u00fac']
];
const NHAT_BIEN_HA_VI_LIEM = {
'Li\u00eam Trinh': 1, 'Ph\u00e1 Qu\u00e2n': 2, 'Ph\u1ee5 B\u1eadt': 3, 'V\u0103n Kh\u00fac': 4,
'V\u0169 Kh\u00fac': 5, 'C\u1ef1 M\u00f4n': 6, 'L\u1ed9c T\u1ed3n': 7, 'Tham Lang': 8
};
const THIEN_CAN_TO_INDEX_FEMALE = {
'Gi\u00e1p':0,'\u1ea4t':1,'B\u00ednh':2,'\u0110inh':3,'M\u1eadu':4,'K\u1ef7':5,'Canh':6,'T\u00e2n':7,'Nh\u00e2m':0,'Qu\u00fd':1
};
const INDEX_TO_THIEN_CAN_FEMALE = {
0:'Gi\u00e1p/Nh\u00e2m',1:'\u1ea4t/Qu\u00fd',2:'B\u00ednh',3:'\u0110inh',4:'M\u1eadu',5:'K\u1ef7',6:'Canh',7:'T\u00e2n'
};
const THIEN_CAN_TO_INDEX_MALE = {
'Gi\u00e1p':0,'\u1ea4t':1,'B\u00ednh':2,'\u0110inh':3,'M\u1eadu':2,'K\u1ef7':3,'Canh':4,'T\u00e2n':5,'Nh\u00e2m':6,'Qu\u00fd':7
};
const INDEX_TO_THIEN_CAN_MALE = {
0:'Gi\u00e1p',1:'\u1ea4t',2:'B\u00ednh/M\u1eadu',3:'\u0110inh/K\u1ef7',4:'Canh',5:'T\u00e2n',6:'Nh\u00e2m',7:'Qu\u00fd'
};
const BASE_MATRIX_COUNTER_CLOCKWISE = [
[0, 7, 6],
[1, null, 5],
[2, 3, 4]
];
const BASE_MATRIX_CLOCKWISE = [
[0, 1, 2],
[7, null, 3],
[6, 5, 4]
];
const LUO_SHU_PATH = [[2,1],[0,2],[1,0],[0,0],[1,1],[2,2],[1,2],[2,0],[0,1]];
const CLOCKWISE_PATH = [
[0,0],[0,1],[0,2],
[1,2],
[2,2],[2,1],[2,0],
[1,0]
];
const COUNTER_CLOCKWISE_PATH = [...CLOCKWISE_PATH].reverse();
const MONTH_MATRIX = [
[{'3':[0,0],'4':[0,0]}, {'5':[0,1]}, {'6':[0,2],'7':[0,2]}],
[{'2':[1,0]}, null, {'8':[1,2]}],
[{'1':[2,0],'12':[2,0]}, {'11':[2,1]}, {'9':[2,2],'10':[2,2]}]
];
const CORNER_GROUPED_MONTHS_SEQUENCE = ['1/12', '2', '3/4', '5', '6/7', '8', '9/10', '11'];
const EDGE_GROUPED_MONTHS_SEQUENCE = ['1', '2/3', '4', '5/6', '7', '8/9', '10', '11/12'];
function coordsEqual(a, b) { return a && b && a[0] === b[0] && a[1] === b[1]; }
function indexOfCoords(path, coord) {
if (!coord) return -1;
return path.findIndex(p => coordsEqual(p, coord));
}
function findCoordsInMatrix(name, matrix) {
for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) if (matrix[r][c] === name) return [r, c];
return null;
}
function calculateCungPhiNumber(year) {
const sumDigits = String(year).split('').reduce((s, d) => s + parseInt(d, 10), 0);
let n = sumDigits % 9;
if (n === 0) n = 9;
return n;
}
function getGuaFromCungPhi(gender, yearOfBirth) {
const cungPhiNum = calculateCungPhiNumber(yearOfBirth);
let matrixTypeGua, matrixCenterNum;
if (gender === 'male') { matrixTypeGua = 'Kh\u00f4n'; matrixCenterNum = 6; }
else { matrixTypeGua = 'C\u00e0n'; matrixCenterNum = 1; }
const generatedMatrix = flyingStarMatrix(matrixTypeGua, matrixCenterNum);
let rowIdx = -1, colIdx = -1;
for (let r = 0; r < 3 && rowIdx === -1; r++) {
for (let c = 0; c < 3; c++) {
if (generatedMatrix[r][c] === cungPhiNum) { rowIdx = r; colIdx = c; break; }
}
}
if (rowIdx === -1) return [null, generatedMatrix, cungPhiNum];
let guaName;
if (rowIdx === 1 && colIdx === 1) {
guaName = gender === 'male' ? 'Kh\u00f4n' : 'C\u1ea5n';
} else {
guaName = LAC_THU_BA_GUA_ARRANGEMENT[rowIdx][colIdx];
}
return [guaName, generatedMatrix, cungPhiNum];
}
function getCanFromYear(year) { return THIEN_CAN_FROM_YEAR_LAST_DIGIT[pymod(year, 10)]; }
function getChiFromYear(year) { return CHI_MAP[pymod(year, 12)]; }
function getCanAn(gender, cungPhiGua) {
let canAnValue = null;
if (gender === 'male') {
if (cungPhiGua === '\u0110o\u00e0i') canAnValue = 'K\u1ef7';
else if (cungPhiGua === 'C\u1ea5n') canAnValue = 'K\u1ef7';
else { const list = NAP_CAN_AN_MALE[cungPhiGua]; if (list) canAnValue = list[0]; }
} else if (gender === 'female') {
if (cungPhiGua === 'C\u00e0n') canAnValue = 'Gi\u00e1p';
else if (cungPhiGua === 'Kh\u00f4n') canAnValue = '\u1ea4t';
else { const list = NAP_CAN_AN_FEMALE[cungPhiGua]; if (list) canAnValue = list[0]; }
}
return canAnValue;
}
function getDiaChiMatrixCoords(chiName) {
for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
const cell = DIA_CHI_MATRIX[r][c];
if (cell) {
if (cell.includes('_')) { if (cell.split('_').includes(chiName)) return [r, c]; }
else if (cell === chiName) return [r, c];
}
}
return null;
}
function generateThienCanMatrix(gender, canAn, startCoords) {
let canToIndexMap, indexToCanMap, baseIndexedMatrix;
if (gender === 'female') {
canToIndexMap = THIEN_CAN_TO_INDEX_FEMALE; indexToCanMap = INDEX_TO_THIEN_CAN_FEMALE; baseIndexedMatrix = BASE_MATRIX_COUNTER_CLOCKWISE;
} else {
canToIndexMap = THIEN_CAN_TO_INDEX_MALE; indexToCanMap = INDEX_TO_THIEN_CAN_MALE; baseIndexedMatrix = BASE_MATRIX_CLOCKWISE;
}
let canAnIdx = canToIndexMap[canAn];
if (canAnIdx === undefined) {
for (const k of Object.keys(canToIndexMap)) {
if (k.includes('/') && k.split('/').includes(canAn)) { canAnIdx = canToIndexMap[k]; break; }
}
}
const baseValAtStart = baseIndexedMatrix[startCoords[0]][startCoords[1]];
const shift = pymod(canAnIdx - baseValAtStart, 8);
const shiftedIndexedMatrix = [[null,null,null],[null,null,null],[null,null,null]];
for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++)
if (baseIndexedMatrix[r][c] !== null) shiftedIndexedMatrix[r][c] = pymod(baseIndexedMatrix[r][c] + shift, 8);
const resultMatrix = [[null,null,null],[null,null,null],[null,null,null]];
for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++)
if (shiftedIndexedMatrix[r][c] !== null) resultMatrix[r][c] = indexToCanMap[shiftedIndexedMatrix[r][c]];
return resultMatrix;
}
function getBaseMatrixForAmDuong(gender, amDuongType) {
if (gender === 'female') {
return amDuongType === 'N\u1eef+' ? BASE_MATRIX_COUNTER_CLOCKWISE : BASE_MATRIX_CLOCKWISE;
}
return amDuongType === 'Nam-' ? BASE_MATRIX_COUNTER_CLOCKWISE : BASE_MATRIX_CLOCKWISE;
}
function computeKhiPersonAtCanTuyenTrach(gender, amDuongType, canNgay, hourCoords, canForBirthYear) {
const canToIndexMap = gender === 'female' ? THIEN_CAN_TO_INDEX_FEMALE : THIEN_CAN_TO_INDEX_MALE;
const indexToCanMap = gender === 'female' ? INDEX_TO_THIEN_CAN_FEMALE : INDEX_TO_THIEN_CAN_MALE;
const baseIndexedMatrix = getBaseMatrixForAmDuong(gender, amDuongType);
const lunarDayCanInputIndex = canToIndexMap[canNgay];
const baseIndexAtHourCoords = baseIndexedMatrix[hourCoords[0]][hourCoords[1]];
const shift = pymod(lunarDayCanInputIndex - baseIndexAtHourCoords, 8);
const shiftedIndexedCanMatrix = [[null,null,null],[null,null,null],[null,null,null]];
for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++)
if (baseIndexedMatrix[r][c] !== null) shiftedIndexedCanMatrix[r][c] = pymod(baseIndexedMatrix[r][c] + shift, 8);
const thienCanMatrixForPersonKhi = [[null,null,null],[null,null,null],[null,null,null]];
for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++)
if (shiftedIndexedCanMatrix[r][c] !== null) thienCanMatrixForPersonKhi[r][c] = indexToCanMap[shiftedIndexedCanMatrix[r][c]];
const finalCoordsForPersonKhi = findCanCoordsInMatrix(canForBirthYear, thienCanMatrixForPersonKhi);
return { thienCanMatrixForPersonKhi, finalCoordsForPersonKhi };
}
function findCanCoordsInMatrix(canName, matrix) {
if (!matrix) return null;
for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
const cell = matrix[r][c];
if (cell != null) {
if (cell === canName || cell.split('/').includes(canName)) return [r, c];
}
}
return null;
}
function moveClockwise(startCoords, steps) {
const idx = indexOfCoords(CLOCKWISE_PATH, startCoords);
if (idx === -1) return null;
return CLOCKWISE_PATH[pymod(idx + steps, CLOCKWISE_PATH.length)];
}
function moveCounterClockwise(startCoords, steps) {
const idx = indexOfCoords(COUNTER_CLOCKWISE_PATH, startCoords);
if (idx === -1) return null;
return COUNTER_CLOCKWISE_PATH[pymod(idx + steps, COUNTER_CLOCKWISE_PATH.length)];
}
function findMonthCoords(monthNumber) {
const monthStr = String(monthNumber);
for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
const cell = MONTH_MATRIX[r][c];
if (!cell) continue;
if (Object.prototype.hasOwnProperty.call(cell, monthStr)) return cell[monthStr];
}
return null;
}
function generateTuyenTrachRiengMonthMatrix(age, gender, luoShuPath, clockwisePath, birthYearKhiCoords) {
const stepsForMonth1Pos = age - 2;
const startIndexInLuoshu = indexOfCoords(luoShuPath, birthYearKhiCoords);
if (startIndexInLuoshu === -1) return null;
const finalIndexInLuoshu = pymod(startIndexInLuoshu + stepsForMonth1Pos, luoShuPath.length);
const rawCoords = luoShuPath[finalIndexInLuoshu];
let effectiveStartCoords;
if (coordsEqual(rawCoords, [1,1])) {
effectiveStartCoords = gender === 'male' ? [0,2] : [2,0];
} else {
effectiveStartCoords = rawCoords;
}
if (!effectiveStartCoords) return null;
const isCornerStart = [[0,0],[0,2],[2,0],[2,2]].some(c => coordsEqual(c, effectiveStartCoords));
const selectedSequence = isCornerStart ? CORNER_GROUPED_MONTHS_SEQUENCE : EDGE_GROUPED_MONTHS_SEQUENCE;
const monthMatrix = [[null,null,null],[null,null,null],[null,null,null]];
const startIdxInPath = indexOfCoords(clockwisePath, effectiveStartCoords);
if (startIdxInPath === -1) return null;
for (let i = 0; i < clockwisePath.length; i++) {
const idx = pymod(startIdxInPath + i, clockwisePath.length);
const coords = clockwisePath[idx];
monthMatrix[coords[0]][coords[1]] = selectedSequence[i];
}
return monthMatrix;
}
function findMonthCoordsRieng(monthNumber, monthMatrix) {
const monthStr = String(monthNumber);
for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
const cell = monthMatrix[r][c];
if (cell && cell.split('/').includes(monthStr)) return [r, c];
}
return null;
}
function computeQueBienStep(queThuongBinary, queHaBinary, cungPhiGuaStarValue, chiForDelta) {
const fullBinaryCombined = queHaBinary + queThuongBinary;
let bienKhiBinary = '';
for (let i = 0; i < 3; i++) bienKhiBinary += (queThuongBinary[i] !== queHaBinary[i]) ? '1' : '0';
const bienKhiMeaning = BIEN_KHI_MEANINGS[bienKhiBinary];
let haoThe = 0;
if (bienKhiMeaning === 'H\u1ecda h\u1ea1i') haoThe = 1;
else if (bienKhiMeaning === 'Thi\u00ean y') haoThe = 2;
else if (bienKhiMeaning === 'Di\u00ean ni\u00ean' || bienKhiMeaning === 'Tuy\u1ec7t m\u1ec7nh') haoThe = 3;
else if (bienKhiMeaning === 'L\u1ee5c s\u00e1t' || bienKhiMeaning === 'Ng\u0169 qu\u1ef7') haoThe = 4;
else if (bienKhiMeaning === 'Sinh kh\u00ed') haoThe = 5;
else if (bienKhiMeaning === 'Ph\u1ee5c v\u1ecb') haoThe = 6;
const bitAtHaoThe = parseInt(fullBinaryCombined[haoThe - 1], 10);
const baseStar = bitAtHaoThe === 0 ? 'C\u1ef1 M\u00f4n' : 'V\u0103n Kh\u00fac';
const baseStarValue = NHAT_BIEN_HA_VI_LIEM[baseStar];
const N_STARS = Object.keys(NHAT_BIEN_HA_VI_LIEM).length;
const starDistance = pymod(N_STARS + cungPhiGuaStarValue - baseStarValue, N_STARS);
const haoNguyenDuongLine = pymod((haoThe - 1) + starDistance, 6) + 1;
const tyIndex = DIA_CHI_MONTH_ORDER.indexOf('T\u00fd');
const chiIndex = DIA_CHI_MONTH_ORDER.indexOf(chiForDelta);
const deltaChi = pymod(chiIndex - tyIndex, 12);
const haoDong = pymod((haoNguyenDuongLine - 1) + deltaChi, 6) + 1;
const bitsList = fullBinaryCombined.split('').map(Number);
bitsList[haoDong - 1] = 1 - bitsList[haoDong - 1];
const transformedStr = bitsList.join('');
const transformedHaBinary = transformedStr.slice(0, 3);
const transformedThuongBinary = transformedStr.slice(3, 6);
let transformedQueThuong = null, transformedQueHa = null;
for (const gua of Object.keys(BA_GUA_BINARY)) {
if (BA_GUA_BINARY[gua] === transformedThuongBinary) transformedQueThuong = gua;
if (BA_GUA_BINARY[gua] === transformedHaBinary) transformedQueHa = gua;
}
return {
fullBinaryCombined, bienKhiBinary, bienKhiMeaning, haoThe, bitAtHaoThe, baseStar, baseStarValue,
starDistance, haoNguyenDuongLine, deltaChi, haoDong,
transformedQueThuong, transformedQueHa,
transformedBinaryFull: transformedHaBinary + transformedThuongBinary
};
}
function computeCoreProfile(gender, yearOfBirth) {
const [cungPhiGua, cungPhiMatrix, cungPhiNum] = getGuaFromCungPhi(gender, yearOfBirth);
const hauThienRaw = HAU_THIEN_SO[cungPhiGua];
const hauThienSoBanMenh = Array.isArray(hauThienRaw) ? 2 : hauThienRaw;
const canForBirthYear = getCanFromYear(yearOfBirth);
const chiForBirthYear = getChiFromYear(yearOfBirth);
const canAnUser = getCanAn(gender, cungPhiGua);
const startCoordsMovement = getDiaChiMatrixCoords(chiForBirthYear);
const thienCan3x3Matrix = generateThienCanMatrix(gender, canAnUser, startCoordsMovement);
const endCoordsMovement = findCanCoordsInMatrix(canForBirthYear, thienCan3x3Matrix);
const khiAtEndCoords = KHI_MATRIX[endCoordsMovement[0]][endCoordsMovement[1]];
const isYearEven = (yearOfBirth % 2 === 0);
let amDuongType;
if (gender === 'male') amDuongType = isYearEven ? 'Nam+' : 'Nam-';
else amDuongType = isYearEven ? 'N\u1eef+' : 'N\u1eef-';
const cungPhiGuaCoords = findCoordsInMatrix(cungPhiGua, LAC_THU_BA_GUA_ARRANGEMENT);
const starAtCungPhiGua = NHAT_BIEN_HA_VI_LIEM_MATRIX[cungPhiGuaCoords[0]][cungPhiGuaCoords[1]];
const cungPhiGuaStarValue = NHAT_BIEN_HA_VI_LIEM[starAtCungPhiGua];
return {
gender, yearOfBirth, cungPhiGua, cungPhiMatrix, cungPhiNum, hauThienSoBanMenh,
canForBirthYear, chiForBirthYear, canAnUser, startCoordsMovement, thienCan3x3Matrix,
endCoordsMovement, khiAtEndCoords, isYearEven, amDuongType,
cungPhiGuaCoords, starAtCungPhiGua, cungPhiGuaStarValue
};
}
function computeTab1(core, birthMonth) {
const cuuTinhMatrix = pickCuuTinhNienVanMatrix(core.amDuongType);
const [er, ec] = core.endCoordsMovement;
const saoNienVan = cuuTinhMatrix[er][ec];
const queThuong = CUU_TINH_UNG_BAT_QUAI[saoNienVan].Que;
const chiMonth = DIA_CHI_MONTH_ORDER[birthMonth - 1];
const batQuaiMatrix = pickBatQuaiChanLinhMatrix(chiMonth);
const queHa = batQuaiMatrix[er][ec];
const queThuongBinary = BA_GUA_BINARY[queThuong];
const queHaBinary = BA_GUA_BINARY[queHa];
const gocBinaryFull = queHaBinary + queThuongBinary;
const bien = computeQueBienStep(queThuongBinary, queHaBinary, core.cungPhiGuaStarValue, core.chiForBirthYear);
return {
saoNienVan, queThuong, chiMonth, queHa,
queGoc: { thuong: queThuong, ha: queHa, binary: gocBinaryFull },
queBien: { thuong: bien.transformedQueThuong, ha: bien.transformedQueHa, binary: bien.transformedBinaryFull },
detail: bien
};
}
function computeTab2(core, birthMonth, yearForGuaCalculation) {
const age = yearForGuaCalculation - core.yearOfBirth + 1;
let initialStar, cuuTinhMatrixNiengan;
if (core.amDuongType === 'Nam+') { initialStar = 'La H\u1ea7u'; cuuTinhMatrixNiengan = CUU_TINH_NIEN_VAN_NAM_PLUS; }
else if (core.amDuongType === 'Nam-') { initialStar = 'La H\u1ea7u'; cuuTinhMatrixNiengan = CUU_TINH_NIEN_VAN_NAM_MINUS; }
else if (core.amDuongType === 'N\u1eef+') { initialStar = 'K\u1ebf \u0110\u00f4'; cuuTinhMatrixNiengan = CUU_TINH_NIEN_VAN_NU_PLUS; }
else { initialStar = 'K\u1ebf \u0110\u00f4'; cuuTinhMatrixNiengan = CUU_TINH_NIEN_VAN_NU_MINUS; }
const startCoordsForGuaThuong = findCoordsInMatrix(initialStar, cuuTinhMatrixNiengan);
const stepsToPhi = age - 1;
const startIdx1 = indexOfCoords(LUO_SHU_PATH, startCoordsForGuaThuong);
const endIdx1 = pymod(startIdx1 + stepsToPhi, LUO_SHU_PATH.length);
const endCoordsForGuaThuong = LUO_SHU_PATH[endIdx1];
const finalStarForGuaThuong = cuuTinhMatrixNiengan[endCoordsForGuaThuong[0]][endCoordsForGuaThuong[1]];
const queThuongFromNiengua = CUU_TINH_UNG_BAT_QUAI[finalStarForGuaThuong].Que;
const startCoordsForGuaHa = core.endCoordsMovement;
const stepsForGuaHa = age - 1;
const startIdx2 = indexOfCoords(LUO_SHU_PATH, startCoordsForGuaHa);
const endIdx2 = pymod(startIdx2 + stepsForGuaHa, LUO_SHU_PATH.length);
const finalCoordsForGuaHa = LUO_SHU_PATH[endIdx2];
let queHaFromNiengua;
if (coordsEqual(finalCoordsForGuaHa, [1,1])) {
queHaFromNiengua = core.gender === 'male' ? 'Kh\u00f4n' : 'C\u1ea5n';
} else {
const chiMonth = DIA_CHI_MONTH_ORDER[birthMonth - 1];
const batQuaiMatrix = pickBatQuaiChanLinhMatrix(chiMonth);
queHaFromNiengua = batQuaiMatrix[finalCoordsForGuaHa[0]][finalCoordsForGuaHa[1]];
}
const queThuongBinaryNiengan = BA_GUA_BINARY[queThuongFromNiengua];
const queHaBinaryNiengan = BA_GUA_BINARY[queHaFromNiengua];
const fullBinaryQueGocNiengan = queHaBinaryNiengan + queThuongBinaryNiengan;
const chiForNienganYear = getChiFromYear(yearForGuaCalculation);
const bien = computeQueBienStep(queThuongBinaryNiengan, queHaBinaryNiengan, core.cungPhiGuaStarValue, chiForNienganYear);
const monthMatrix = generateTuyenTrachRiengMonthMatrix(age, core.gender, LUO_SHU_PATH, CLOCKWISE_PATH, core.endCoordsMovement);
const monthlyKhi = {};
for (let m = 1; m <= 12; m++) {
const coords = findMonthCoordsRieng(m, monthMatrix);
monthlyKhi[m] = coords ? KHI_MATRIX[coords[0]][coords[1]] : null;
}
return {
age, startCoordsForGuaThuong, endCoordsForGuaThuong, finalStarForGuaThuong, queThuongFromNiengua,
finalCoordsForGuaHa, queHaFromNiengua, chiForNienganYear,
queGoc: { thuong: queThuongFromNiengua, ha: queHaFromNiengua, binary: fullBinaryQueGocNiengan },
queBien: { thuong: bien.transformedQueThuong, ha: bien.transformedQueHa, binary: bien.transformedBinaryFull },
monthMatrix, monthlyKhi, detail: bien
};
}
function computeTab3(core, gioIndex, canNgay, ngay, thang, yearForTuyenTrach) {
const age = yearForTuyenTrach - core.yearOfBirth + 1;
const monthCoords = findMonthCoords(thang);
const khiMonth = KHI_MATRIX[monthCoords[0]][monthCoords[1]];
const dayCoords = moveClockwise(monthCoords, ngay - 1);
const khiDay = KHI_MATRIX[dayCoords[0]][dayCoords[1]];
const hourCoords = moveClockwise(dayCoords, gioIndex);
const khiHour = KHI_MATRIX[hourCoords[0]][hourCoords[1]];
const { thienCanMatrixForPersonKhi, finalCoordsForPersonKhi } =
computeKhiPersonAtCanTuyenTrach(core.gender, core.amDuongType, canNgay, hourCoords, core.canForBirthYear);
const khiPersonAtCan = KHI_MATRIX[finalCoordsForPersonKhi[0]][finalCoordsForPersonKhi[1]];
const queThuongGoc = BAT_QUAI_CHAN_LINH_THAN_TY_THIN[finalCoordsForPersonKhi[0]][finalCoordsForPersonKhi[1]];
const guaHaMatrixForPhi = flyingStarMatrix('C\u00e0n', core.hauThienSoBanMenh);
const finalHauThienNumberForQueHa = guaHaMatrixForPhi[finalCoordsForPersonKhi[0]][finalCoordsForPersonKhi[1]];
let queHaGoc = null;
if (finalHauThienNumberForQueHa === 5) {
queHaGoc = 'Kh\u00f4n';
} else {
for (const guaName of Object.keys(HAU_THIEN_SO)) {
const htNumber = HAU_THIEN_SO[guaName];
if (Array.isArray(htNumber)) { if (htNumber.includes(finalHauThienNumberForQueHa)) { queHaGoc = guaName; break; } }
else if (htNumber === finalHauThienNumberForQueHa) { queHaGoc = guaName; break; }
}
}
const queThuongGocBinary = BA_GUA_BINARY[queThuongGoc];
const queHaGocBinary = BA_GUA_BINARY[queHaGoc];
const gocBinaryFullChung = queHaGocBinary + queThuongGocBinary;
const bienChung = computeQueBienStep(queThuongGocBinary, queHaGocBinary, core.cungPhiGuaStarValue, core.chiForBirthYear);
const monthMatrixRieng = generateTuyenTrachRiengMonthMatrix(age, core.gender, LUO_SHU_PATH, CLOCKWISE_PATH, core.endCoordsMovement);
const monthCoordsRieng = findMonthCoordsRieng(thang, monthMatrixRieng);
const khiMonthRieng = monthCoordsRieng ? KHI_MATRIX[monthCoordsRieng[0]][monthCoordsRieng[1]] : null;
const dayCoordsRieng = monthCoordsRieng ? moveClockwise(monthCoordsRieng, ngay - 1) : null;
const khiDayRieng = dayCoordsRieng ? KHI_MATRIX[dayCoordsRieng[0]][dayCoordsRieng[1]] : null;
const hourCoordsRieng = dayCoordsRieng ? moveClockwise(dayCoordsRieng, gioIndex) : null;
const khiHourRieng = hourCoordsRieng ? KHI_MATRIX[hourCoordsRieng[0]][hourCoordsRieng[1]] : null;
return {
age,
chung: {
monthCoords, khiMonth, dayCoords, khiDay, hourCoords, khiHour,
finalCoordsForPersonKhi, khiPersonAtCan, thienCanMatrixForPersonKhi,
queThuongGoc, queHaGoc, finalHauThienNumberForQueHa, guaHaMatrixForPhi,
queGoc: { thuong: queThuongGoc, ha: queHaGoc, binary: gocBinaryFullChung },
queBien: { thuong: bienChung.transformedQueThuong, ha: bienChung.transformedQueHa, binary: bienChung.transformedBinaryFull },
detail: bienChung
},
rieng: {
monthMatrixRieng, monthCoordsRieng, khiMonthRieng, dayCoordsRieng, khiDayRieng, hourCoordsRieng, khiHourRieng
}
};
}
function chip(label, value, small) {
return `<div class="chip"><div class="label">${label}</div><div class="value${small ? ' small' : ''}">${value}</div></div>`;
}
function renderMatrix3(containerId, matrix, activeCoord) {
const el = document.getElementById(containerId);
el.innerHTML = '';
for (let r = 0; r < 3; r++) {
for (let c = 0; c < 3; c++) {
const cell = matrix[r][c];
const div = document.createElement('div');
const isActive = activeCoord && activeCoord[0] === r && activeCoord[1] === c;
div.className = 'mcell' + (cell === null || cell === undefined ? ' empty' : '') + (isActive ? ' active' : '');
div.textContent = (cell === null || cell === undefined) ? '' : cell;
el.appendChild(div);
}
}
}
function renderBars(elementId, binary6, activeHao) {
const container = host.querySelector('#' + elementId) || document.getElementById(elementId);
if (window.KD_GRID) {
window.KD_GRID.renderBars(container, binary6, activeHao);
}
}
function renderHexCard(prefix, que, activeHao) {
document.getElementById(prefix + '-title').textContent = `${getTenQueDich(que.thuong, que.ha)}`;
document.getElementById(prefix + '-sub').textContent =
`${TRIGRAM_SYMBOL[que.thuong] || ''}${TRIGRAM_SYMBOL[que.ha] || ''} · ${que.thuong} / ${que.ha}`;
renderBars(prefix.replace('-card', '-bars').replace('card-', 'bars-'), que.binary, activeHao || 0);
}
function coordStr(c) { return c ? `[${c[0]}, ${c[1]}]` : '\u2014'; }
function fillMonthSelect(id) {
const sel = document.getElementById(id);
for (let m = 1; m <= 12; m++) {
const opt = document.createElement('option');
opt.value = m; opt.textContent = `Tháng ${m}`;
sel.appendChild(opt);
}
sel.value = 7;
}
const THIEN_CAN_LIST = ['Gi\u00e1p','\u1ea4t','B\u00ednh','\u0110inh','M\u1eadu','K\u1ef7','Canh','T\u00e2n','Nh\u00e2m','Qu\u00fd'];
function fillCanSelect(id) {
const sel = document.getElementById(id);
THIEN_CAN_LIST.forEach(c => {
const opt = document.createElement('option');
opt.value = c; opt.textContent = c;
sel.appendChild(opt);
});
}
const LUNAR_HOUR_LIST = ['T\u00fd','S\u1eedu','D\u1ea7n','M\u00e3o','Th\u00ecn','T\u1ef5','Ng\u1ecd','M\u00f9i','Th\u00e2n','D\u1eadu','Tu\u1ea5t','H\u1ee3i'];
function fillGioSelect(id) {
const sel = document.getElementById(id);
LUNAR_HOUR_LIST.forEach((c, idx) => {
const opt = document.createElement('option');
opt.value = idx; opt.textContent = `${c}`;
sel.appendChild(opt);
});
}
fillMonthSelect('t1-month');
fillMonthSelect('t2-month');
fillMonthSelect('t3-thang');
fillCanSelect('t3-can-ngay');
fillGioSelect('t3-gio');
document.querySelectorAll('.tab-btn').forEach(btn => {
btn.addEventListener('click', () => {
document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
btn.classList.add('active');
document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
});
});
function showError(id, msg) {
const el = document.getElementById(id);
el.textContent = msg;
el.style.display = 'block';
}
function hideError(id) {
document.getElementById(id).style.display = 'none';
}
function castTab1() {
hideError('error-msg-1');
try {
const gender = document.getElementById('t1-gender').value;
const year = parseInt(document.getElementById('t1-year').value, 10);
const month = parseInt(document.getElementById('t1-month').value, 10);
if (!year || year < 1 || month < 1 || month > 12) throw new Error('Vui l\u00f2ng nh\u1eadp n\u0103m sinh v\u00e0 th\u00e1ng sinh h\u1ee3p l\u1ec7.');
const core = computeCoreProfile(gender, year);
const r = computeTab1(core, month);
document.getElementById('t1-chips').innerHTML =
chip('Cung Phi b\u1ea3n m\u1ec7nh', core.cungPhiGua) +
chip('Can \u1ea9n', core.canAnUser, true) +
chip('Sao t\u1ea1i Cung Phi', core.starAtCungPhiGua, true) +
chip('Kh\u00ed n\u0103m sinh', core.khiAtEndCoords);
document.getElementById('t1-goc-fullname').textContent = getTenQueDich(r.queGoc.thuong, r.queGoc.ha);
renderHexCard('t1-card-goc', r.queGoc, r.detail.haoDong);
renderHexCard('t1-card-bien', r.queBien, 0);
document.getElementById('t1-steps-body').innerHTML = `
- Cung Phi bản mệnh: <b>${core.cungPhiGua}</b> (số cung phi ${core.cungPhiNum}) · Số Hậu Thiên: <b>${core.hauThienSoBanMenh}</b><br>
- Can/Chi năm sinh: <b>${core.canForBirthYear} ${core.chiForBirthYear}</b> · Can ẩn: <b>${core.canAnUser}</b><br>
- Tọa độ bắt đầu (từ Địa Chi): <b>${coordStr(core.startCoordsMovement)}</b> → Tọa độ khí năm sinh (từ Can thật): <b>${coordStr(core.endCoordsMovement)}</b><br>
- Khí năm sinh: <b>${core.khiAtEndCoords}</b> · Âm Dương: <b>${core.amDuongType}</b><br>
- Sao niên vận tại khí năm sinh: <b>${r.saoNienVan}</b> → Quẻ Thượng: <b>${r.queThuong}</b><br>
- Tháng sinh ${document.getElementById('t1-month').value} → Địa Chi: <b>${r.chiMonth}</b> → Quẻ Hạ: <b>${r.queHa}</b><br>
- Quẻ Gốc: <b>${r.queGoc.thuong}/${r.queGoc.ha}</b> (binary ${r.queGoc.binary})<br>
- Biến khí Thượng/Hạ: <b>${r.detail.bienKhiBinary}</b> (${r.detail.bienKhiMeaning}) → Hào thế: <b>${r.detail.haoThe}</b><br>
- Sao xuất phát hào nguyên đường: <b>${r.detail.baseStar}</b> (giá trị ${r.detail.baseStarValue}) · Sao tại Cung Phi: <b>${core.starAtCungPhiGua}</b> (giá trị ${core.cungPhiGuaStarValue})<br>
- Khoảng cách sao: <b>${r.detail.starDistance}</b> → Hào nguyên đường: <b>${r.detail.haoNguyenDuongLine}</b><br>
- Delta Chi (Tý → ${core.chiForBirthYear}): <b>${r.detail.deltaChi}</b> bước → Hào động: <b>${r.detail.haoDong}</b><br>
- Quẻ Biến: <b>${r.queBien.thuong}/${r.queBien.ha}</b> (binary ${r.queBien.binary})
`;
document.getElementById('result-1').style.display = 'block';
document.getElementById('input-echo').textContent =
`Tab 1 · ${gender === 'male' ? 'Nam' : 'Nữ'} · Sinh ${month}/${year}`;
} catch (e) {
showError('error-msg-1', 'L\u1ed7i: ' + e.message);
document.getElementById('result-1').style.display = 'none';
}
}
document.getElementById('cast-btn-1').addEventListener('click', castTab1);
function castTab2() {
hideError('error-msg-2');
try {
const gender = document.getElementById('t2-gender').value;
const year = parseInt(document.getElementById('t2-year').value, 10);
const month = parseInt(document.getElementById('t2-month').value, 10);
const nienVanYear = parseInt(document.getElementById('t2-nienvan-year').value, 10);
if (!year || month < 1 || month > 12 || !nienVanYear) throw new Error('Vui l\u00f2ng nh\u1eadp \u0111\u1ea7y \u0111\u1ee7 th\u00f4ng tin h\u1ee3p l\u1ec7.');
const core = computeCoreProfile(gender, year);
const r = computeTab2(core, month, nienVanYear);
document.getElementById('t2-chips').innerHTML =
chip('Tu\u1ed5i (n\u0103m ' + nienVanYear + ')', r.age + ' tu\u1ed5i') +
chip('Sao chi\u1ebfu m\u1ec7nh', r.finalStarForGuaThuong, true);
document.getElementById('t2-goc-fullname').textContent = getTenQueDich(r.queGoc.thuong, r.queGoc.ha);
renderHexCard('t2-card-goc', r.queGoc, r.detail.haoDong);
renderHexCard('t2-card-bien', r.queBien, 0);
renderMatrix3('t2-month-matrix', r.monthMatrix, null);
const tbody = document.getElementById('t2-month-tbody');
tbody.innerHTML = '';
for (let m = 1; m <= 12; m++) {
const tr = document.createElement('tr');
tr.innerHTML = `<td class="name-cell">Tháng ${m}</td><td>${r.monthlyKhi[m] || '—'}</td>`;
tbody.appendChild(tr);
}
document.getElementById('t2-steps-body').innerHTML = `
- Tuổi năm ${nienVanYear}: <b>${r.age}</b> tuổi (= ${nienVanYear} − ${year} + 1)<br>
- Sao khởi phi Quẻ Thượng: <b>${document.getElementById('t2-gender').value === 'male' ? 'La Hầu' : 'Kế Đô'}</b> tại ${coordStr(r.startCoordsForGuaThuong)} → sau ${r.age - 1} bước phi → ${coordStr(r.endCoordsForGuaThuong)}: <b>${r.finalStarForGuaThuong}</b> → Quẻ Thượng: <b>${r.queThuongFromNiengua}</b><br>
- Quẻ Hạ: từ tọa độ khí năm sinh ${coordStr(core.endCoordsMovement)} → sau ${r.age - 1} bước phi → ${coordStr(r.finalCoordsForGuaHa)}: Quẻ Hạ = <b>${r.queHaFromNiengua}</b><br>
- Quẻ Gốc niên vận: <b>${r.queGoc.thuong}/${r.queGoc.ha}</b> (binary ${r.queGoc.binary})<br>
- Biến khí: <b>${r.detail.bienKhiBinary}</b> (${r.detail.bienKhiMeaning}) → Hào thế: <b>${r.detail.haoThe}</b><br>
- Sao xuất phát: <b>${r.detail.baseStar}</b> (${r.detail.baseStarValue}) · Sao Cung Phi: <b>${core.starAtCungPhiGua}</b> (${core.cungPhiGuaStarValue}) → Khoảng cách: <b>${r.detail.starDistance}</b><br>
- Hào nguyên đường: <b>${r.detail.haoNguyenDuongLine}</b> · Chi năm niên vận: <b>${r.chiForNienganYear}</b> (delta ${r.detail.deltaChi}) → Hào biến: <b>${r.detail.haoDong}</b><br>
- Quẻ Biến niên vận: <b>${r.queBien.thuong}/${r.queBien.ha}</b> (binary ${r.queBien.binary})
`;
document.getElementById('result-2').style.display = 'block';
document.getElementById('input-echo').textContent =
`Tab 2 · ${gender === 'male' ? 'Nam' : 'Nữ'} · Sinh ${month}/${year} · Niên vận ${nienVanYear}`;
} catch (e) {
showError('error-msg-2', 'L\u1ed7i: ' + e.message);
document.getElementById('result-2').style.display = 'none';
}
}
document.getElementById('cast-btn-2').addEventListener('click', castTab2);
function castTab3() {
hideError('error-msg-3');
try {
const gender = document.getElementById('t3-gender').value;
const year = parseInt(document.getElementById('t3-year').value, 10);
const ttYear = parseInt(document.getElementById('t3-tt-year').value, 10);
const canNgay = document.getElementById('t3-can-ngay').value;
const gioIndex = parseInt(document.getElementById('t3-gio').value, 10);
const ngay = parseInt(document.getElementById('t3-ngay').value, 10);
const thang = parseInt(document.getElementById('t3-thang').value, 10);
if (!year || !ttYear || ngay < 1 || thang < 1 || thang > 12) throw new Error('Vui l\u00f2ng nh\u1eadp \u0111\u1ea7y \u0111\u1ee7 th\u00f4ng tin h\u1ee3p l\u1ec7.');
const core = computeCoreProfile(gender, year);
const r = computeTab3(core, gioIndex, canNgay, ngay, thang, ttYear);
document.getElementById('t3-chips').innerHTML =
chip('Cung Phi b\u1ea3n m\u1ec7nh', core.cungPhiGua) +
chip('Can / Chi n\u0103m sinh', `${core.canForBirthYear} ${core.chiForBirthYear}`, true) +
chip('Tu\u1ed5i (n\u0103m ' + ttYear + ')', r.age + ' tu\u1ed5i');
document.getElementById('t3-chung-chips').innerHTML =
chip('Kh\u00ed Th\u00e1ng ' + thang, r.chung.khiMonth) +
chip('Kh\u00ed Ng\u00e0y ' + ngay, r.chung.khiDay) +
chip('Kh\u00ed Gi\u1edd ' + LUNAR_HOUR_LIST[gioIndex], r.chung.khiHour) +
chip('Kh\u00ed ng\u01b0\u1eddi d\u00f9ng', r.chung.khiPersonAtCan);
document.getElementById('t3-goc-fullname').textContent = getTenQueDich(r.chung.queGoc.thuong, r.chung.queGoc.ha);
renderHexCard('t3-card-goc', r.chung.queGoc, r.chung.detail.haoDong);
renderHexCard('t3-card-bien', r.chung.queBien, 0);
document.getElementById('t3-rieng-chips').innerHTML =
chip('Kh\u00ed Th\u00e1ng ' + thang, r.rieng.khiMonthRieng || '\u2014') +
chip('Kh\u00ed Ng\u00e0y ' + ngay, r.rieng.khiDayRieng || '\u2014') +
chip('Kh\u00ed Gi\u1edd ' + LUNAR_HOUR_LIST[gioIndex], r.rieng.khiHourRieng || '\u2014');
document.getElementById('t3-steps-body').innerHTML = `
<u>Tuyển trạch chung</u><br>
- Khí Tháng ${thang}: ${coordStr(r.chung.monthCoords)} → <b>${r.chung.khiMonth}</b><br>
- Khí Ngày ${ngay} (di chuyển ${ngay - 1} bước xuôi): ${coordStr(r.chung.dayCoords)} → <b>${r.chung.khiDay}</b><br>
- Khí Giờ ${LUNAR_HOUR_LIST[gioIndex]} (di chuyển ${gioIndex} bước xuôi): ${coordStr(r.chung.hourCoords)} → <b>${r.chung.khiHour}</b><br>
- Khí người dùng: dựng ma trận Thiên Can (Can ngày <b>${canNgay}</b> đặt tại vị trí Giờ ${coordStr(r.chung.hourCoords)}, hướng theo ${core.amDuongType}) → tìm Can năm sinh <b>${core.canForBirthYear}</b> tại ${coordStr(r.chung.finalCoordsForPersonKhi)}: <b>${r.chung.khiPersonAtCan}</b><br>
- Quẻ Thượng gốc (tại vị trí khí người dùng): <b>${r.chung.queThuongGoc}</b><br>
- Ma trận phi Càn (tâm = Số Hậu Thiên Cung Phi ${core.hauThienSoBanMenh}) → số tại vị trí khí người dùng: <b>${r.chung.finalHauThienNumberForQueHa}</b> → Quẻ Hạ gốc: <b>${r.chung.queHaGoc}</b><br>
- Quẻ Gốc: <b>${r.chung.queGoc.thuong}/${r.chung.queGoc.ha}</b> (binary ${r.chung.queGoc.binary})<br>
- Biến khí: <b>${r.chung.detail.bienKhiBinary}</b> (${r.chung.detail.bienKhiMeaning}) → Hào thế: <b>${r.chung.detail.haoThe}</b> → Hào nguyên đường: <b>${r.chung.detail.haoNguyenDuongLine}</b> → Hào động: <b>${r.chung.detail.haoDong}</b><br>
- Quẻ Biến: <b>${r.chung.queBien.thuong}/${r.chung.queBien.ha}</b> (binary ${r.chung.queBien.binary})<br><br>
<u>Tuyển trạch riêng</u> (tuổi ${r.age}, năm ${ttYear})<br>
- Khí Tháng ${thang}: ${coordStr(r.rieng.monthCoordsRieng)} → <b>${r.rieng.khiMonthRieng}</b><br>
- Khí Ngày ${ngay}: ${coordStr(r.rieng.dayCoordsRieng)} → <b>${r.rieng.khiDayRieng}</b><br>
- Khí Giờ ${LUNAR_HOUR_LIST[gioIndex]}: ${coordStr(r.rieng.hourCoordsRieng)} → <b>${r.rieng.khiHourRieng}</b>
`;
document.getElementById('result-3').style.display = 'block';
document.getElementById('input-echo').textContent =
`Tab 3 · ${gender === 'male' ? 'Nam' : 'Nữ'} · Sinh ${year} · Giờ ${LUNAR_HOUR_LIST[gioIndex]} · Can ${canNgay} · Ngày ${ngay} · Tháng ${thang}`;
} catch (e) {
showError('error-msg-3', 'L\u1ed7i: ' + e.message);
document.getElementById('result-3').style.display = 'none';
}
}
document.getElementById('cast-btn-3').addEventListener('click', castTab3);
function cast() {
const activeTab = document.querySelector('.tab-btn.active');
const tabNum = activeTab ? activeTab.dataset.tab : '1';
if (tabNum === '2') castTab2();
else if (tabNum === '3') castTab3();
else castTab1();
}
window.cast = cast;
window.__KD_CAST = cast;
};