window.KD_MOD = window.KD_MOD || {};
window.KD_MOD["chanlinh"] = function() {
  const host = document.querySelector('.kd-mod[data-mod="chanlinh"]');
  if (!host) return;

  /* ---- Original Module Logic ---- */
/* =========================================================================
 * PHẦN 0 — TRA CỨU 64 QUẺ DỊCH (chỉ để hiển thị, không ảnh hưởng logic)
 * ========================================================================= */
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
  'Khảm': 'flip_v',
  'Đoài': 'anti_transpose',
  'Ly':   'flip_h',
  'Cấn':  'transpose',
  'Khôn': 'transpose',
  'Chấn': 'rot180',
  'Tốn':  'e',
  'Càn':  'anti_transpose',
};

function flyingStarMatrix(gua, centerNumber = 1) {
  const base = transform(KHAM_BASE, GUA_TRANSFORM[gua]);
  const shift = centerNumber - 1;
  return base.map(row => row.map(v => pymod(v - 1 + shift, 9) + 1));
}

const LAC_THU_BA_GUA_ARRANGEMENT = [
  ['Tốn', 'Ly', 'Khôn'],
  ['Chấn', null, 'Đoài'],
  ['Cấn', 'Khảm', 'Càn']
];

const BA_GUA_BINARY = {
  'Càn': '111', 'Đoài': '110', 'Ly': '101', 'Chấn': '100',
  'Tốn': '011', 'Khảm': '010', 'Cấn': '001', 'Khôn': '000'
};

const BIEN_KHI_MEANINGS = {
  '001': 'Sinh khí', '011': 'Ngũ quỷ', '111': 'Diên niên', '101': 'Lục sát',
  '100': 'Họa hại', '110': 'Thiên y', '010': 'Tuyệt mệnh', '000': 'Phục vị'
};

const HAU_THIEN_SO = {
  'Càn': 6, 'Đoài': 7, 'Ly': 9, 'Chấn': 3, 'Tốn': 4, 'Khảm': 1, 'Cấn': 8, 'Khôn': [2, 5]
};

const THIEN_CAN_FROM_YEAR_LAST_DIGIT = {
  4: 'Giáp', 5: 'Ất', 6: 'Bính', 7: 'Đinh', 8: 'Mậu',
  9: 'Kỷ', 0: 'Canh', 1: 'Tân', 2: 'Nhâm', 3: 'Quý'
};

const CHI_MAP = {
  0: 'Thân', 1: 'Dậu', 2: 'Tuất', 3: 'Hợi', 4: 'Tý', 5: 'Sửu',
  6: 'Dần', 7: 'Mão', 8: 'Thìn', 9: 'Tỵ', 10: 'Ngọ', 11: 'Mùi'
};

const DIA_CHI_MONTH_ORDER = [
  'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi',
  'Thân', 'Dậu', 'Tuất', 'Hợi', 'Tý', 'Sửu'
];

const DIA_CHI_MATRIX = [
  ['Thìn_Tỵ', 'Ngọ', 'Mùi_Thân'],
  ['Mão', null, 'Dậu'],
  ['Sửu_Dần', 'Tý', 'Tuất_Hợi']
];

const KHI_MATRIX = [
  ['Phá bại', 'Thông thiên', 'Cô thương'],
  ['Đại an', null, 'Thụ ám'],
  ['Nguyên cát', 'Không Vong', 'Địa lợi']
];

const NAP_CAN_AN_MALE = {
  'Càn': ['Giáp'], 'Đoài': ['Đinh', 'Kỷ'], 'Ly': ['Nhâm'], 'Chấn': ['Canh'],
  'Tốn': ['Tân'], 'Khảm': ['Quý'], 'Cấn': ['Bính', 'Mậu'], 'Khôn': ['Ất']
};
const NAP_CAN_AN_FEMALE = {
  'Càn': ['Giáp', 'Nhâm'], 'Đoài': ['Đinh'], 'Ly': ['Kỷ'], 'Chấn': ['Canh'],
  'Tốn': ['Tân'], 'Khảm': ['Mậu'], 'Cấn': ['Bính'], 'Khôn': ['Ất', 'Quý']
};

const BAT_QUAI_CHAN_LINH_THAN_TY_THIN = [
  ['Khảm', 'Ly', 'Đoài'],
  ['Chấn', null, 'Tốn'],
  ['Càn', 'Cấn', 'Khôn']
];
const BAT_QUAI_CHAN_LINH_DAN_NGO_TUAT = [
  ['Khôn', 'Cấn', 'Càn'],
  ['Tốn', null, 'Chấn'],
  ['Đoài', 'Ly', 'Khảm']
];
const BAT_QUAI_CHAN_LINH_TY_DAU_SUU = [
  ['Đoài', 'Tốn', 'Khôn'],
  ['Ly', null, 'Cấn'],
  ['Khảm', 'Chấn', 'Càn']
];
const BAT_QUAI_CHAN_LINH_HOI_MAO_MUI = [
  ['Càn', 'Chấn', 'Khảm'],
  ['Cấn', null, 'Ly'],
  ['Khôn', 'Tốn', 'Đoài']
];

function pickBatQuaiChanLinhMatrix(chiMonth) {
  if (['Dần','Ngọ','Tuất'].includes(chiMonth)) return BAT_QUAI_CHAN_LINH_DAN_NGO_TUAT;
  if (['Thân','Tý','Thìn'].includes(chiMonth)) return BAT_QUAI_CHAN_LINH_THAN_TY_THIN;
  if (['Tỵ','Dậu','Sửu'].includes(chiMonth)) return BAT_QUAI_CHAN_LINH_TY_DAU_SUU;
  if (['Hợi','Mão','Mùi'].includes(chiMonth)) return BAT_QUAI_CHAN_LINH_HOI_MAO_MUI;
  return null;
}

const CUU_TINH_UNG_BAT_QUAI = {
  'La Hầu': {Hanh:'Thủy', Que:'Khảm'}, 'Thổ Tú': {Hanh:'Thổ', Que:'Khôn'},
  'Thủy Diệu': {Hanh:'Thủy', Que:'Khảm'}, 'Thái Bạch': {Hanh:'Kim', Que:'Càn'},
  'Thái Dương': {Hanh:'Hỏa', Que:'Ly'}, 'Vân Hớn': {Hanh:'Mộc', Que:'Tốn'},
  'Kế Đô': {Hanh:'Thổ', Que:'Cấn'}, 'Thái Âm': {Hanh:'Kim', Que:'Đoài'},
  'Mộc Đức': {Hanh:'Mộc', Que:'Chấn'}
};

const CUU_TINH_NIEN_VAN_NAM_PLUS = [
  ['Thái Bạch', 'Mộc Đức', 'Thổ Tú'],
  ['Thủy Diệu', 'Thái Dương', 'Kế Đô'],
  ['Thái Dương', 'La Hầu', 'Vân Hớn']
];
const CUU_TINH_NIEN_VAN_NAM_MINUS = [
  ['Thái Bạch', 'Mộc Đức', 'Thổ Tú'],
  ['Thủy Diệu', 'Thái Dương', 'Kế Đô'],
  ['Thái Âm', 'La Hầu', 'Vân Hớn']
];
const CUU_TINH_NIEN_VAN_NU_PLUS = [
  ['Thái Âm', 'Thủy Diệu', 'Thổ Tú'],
  ['Mộc Đức', 'Thổ Tú', 'Thái Dương'],
  ['Thái Bạch', 'Kế Đô', 'La Hầu']
];
const CUU_TINH_NIEN_VAN_NU_MINUS = [
  ['Thái Âm', 'Thủy Diệu', 'Vân Hớn'],
  ['Mộc Đức', 'Thổ Tú', 'Thái Dương'],
  ['Thổ Tú', 'Kế Đô', 'La Hầu']
];

function pickCuuTinhNienVanMatrix(amDuongType) {
  if (amDuongType === 'Nam+') return CUU_TINH_NIEN_VAN_NAM_PLUS;
  if (amDuongType === 'Nam-') return CUU_TINH_NIEN_VAN_NAM_MINUS;
  if (amDuongType === 'Nữ+') return CUU_TINH_NIEN_VAN_NU_PLUS;
  if (amDuongType === 'Nữ-') return CUU_TINH_NIEN_VAN_NU_MINUS;
  return null;
}

const NHAT_BIEN_HA_VI_LIEM_MATRIX = [
  ['Phụ Bật','Liêm Trinh','Lộc Tồn'],
  ['Tham Lang', null, 'Phá Quân'],
  ['Cự Môn','Văn Khúc','Vũ Khúc']
];
const NHAT_BIEN_HA_VI_LIEM = {
  'Liêm Trinh': 1, 'Phá Quân': 2, 'Phụ Bật': 3, 'Văn Khúc': 4,
  'Vũ Khúc': 5, 'Cự Môn': 6, 'Lộc Tồn': 7, 'Tham Lang': 8
};

const THIEN_CAN_TO_INDEX_FEMALE = {
  'Giáp':0,'Ất':1,'Bính':2,'Đinh':3,'Mậu':4,'Kỷ':5,'Canh':6,'Tân':7,'Nhâm':0,'Quý':1
};
const INDEX_TO_THIEN_CAN_FEMALE = {
  0:'Giáp/Nhâm',1:'Ất/Quý',2:'Bính',3:'Đinh',4:'Mậu',5:'Kỷ',6:'Canh',7:'Tân'
};
const THIEN_CAN_TO_INDEX_MALE = {
  'Giáp':0,'Ất':1,'Bính':2,'Đinh':3,'Mậu':2,'Kỷ':3,'Canh':4,'Tân':5,'Nhâm':6,'Quý':7
};
const INDEX_TO_THIEN_CAN_MALE = {
  0:'Giáp',1:'Ất',2:'Bính/Mậu',3:'Đinh/Kỷ',4:'Canh',5:'Tân',6:'Nhâm',7:'Quý'
};

// User specified: Nam- và Nữ+ có matrix đi "ngược chiều đồng hồ"
const BASE_MATRIX_COUNTER_CLOCKWISE = [
  [0, 7, 6],
  [1, null, 5],
  [2, 3, 4]
];
// User specified: Nam+ và Nữ- có matrix đi "xuôi chiều đồng hồ"
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

/* =========================================================================
 * PHẦN 2 — CÁC HÀM TÍNH TOÁN (chuyển 1:1 từ notebook)
 * ========================================================================= */

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
  if (gender === 'male') { matrixTypeGua = 'Khôn'; matrixCenterNum = 6; }
  else { matrixTypeGua = 'Càn'; matrixCenterNum = 1; }
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
    guaName = gender === 'male' ? 'Khôn' : 'Cấn';
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
    if (cungPhiGua === 'Đoài') canAnValue = 'Kỷ';
    else if (cungPhiGua === 'Cấn') canAnValue = 'Kỷ';
    else { const list = NAP_CAN_AN_MALE[cungPhiGua]; if (list) canAnValue = list[0]; }
  } else if (gender === 'female') {
    if (cungPhiGua === 'Càn') canAnValue = 'Giáp';
    else if (cungPhiGua === 'Khôn') canAnValue = 'Ất';
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
  // User specified: Nữ+ và Nam- đi "ngược chiều đồng hồ"; Nữ- và Nam+ đi "xuôi chiều đồng hồ"
  if (gender === 'female') {
    return amDuongType === 'Nữ+' ? BASE_MATRIX_COUNTER_CLOCKWISE : BASE_MATRIX_CLOCKWISE;
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

/* ---- Bien khi / hao the / hao nguyen duong / hao dong / que bien ---- */
function computeQueBienStep(queThuongBinary, queHaBinary, cungPhiGuaStarValue, chiForDelta) {
  const fullBinaryCombined = queHaBinary + queThuongBinary; // L1..L6

  let bienKhiBinary = '';
  for (let i = 0; i < 3; i++) bienKhiBinary += (queThuongBinary[i] !== queHaBinary[i]) ? '1' : '0';
  const bienKhiMeaning = BIEN_KHI_MEANINGS[bienKhiBinary];

  let haoThe = 0;
  if (bienKhiMeaning === 'Họa hại') haoThe = 1;
  else if (bienKhiMeaning === 'Thiên y') haoThe = 2;
  else if (bienKhiMeaning === 'Diên niên' || bienKhiMeaning === 'Tuyệt mệnh') haoThe = 3;
  else if (bienKhiMeaning === 'Lục sát' || bienKhiMeaning === 'Ngũ quỷ') haoThe = 4;
  else if (bienKhiMeaning === 'Sinh khí') haoThe = 5;
  else if (bienKhiMeaning === 'Phục vị') haoThe = 6;

  const bitAtHaoThe = parseInt(fullBinaryCombined[haoThe - 1], 10);
  const baseStar = bitAtHaoThe === 0 ? 'Cự Môn' : 'Văn Khúc';
  const baseStarValue = NHAT_BIEN_HA_VI_LIEM[baseStar];
  // Khoảng cách sao dạng vòng tròn (cyclic), khớp bản đã chỉnh sửa trong Chan_linh_nhan_don_v4.ipynb
  const N_STARS = Object.keys(NHAT_BIEN_HA_VI_LIEM).length;
  const starDistance = pymod(N_STARS + cungPhiGuaStarValue - baseStarValue, N_STARS);
  const haoNguyenDuongLine = pymod((haoThe - 1) + starDistance, 6) + 1;

  const tyIndex = DIA_CHI_MONTH_ORDER.indexOf('Tý');
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

/* ---- Ho so ban menh dung chung cho ca 3 tab ---- */
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
  else amDuongType = isYearEven ? 'Nữ+' : 'Nữ-';

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

/* ---- Tab 1: Lap que Chan Linh Nhan Do Van Menh ---- */
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

/* ---- Tab 2: Lap que Chan Linh Nien Van ---- */
function computeTab2(core, birthMonth, yearForGuaCalculation) {
  const age = yearForGuaCalculation - core.yearOfBirth + 1;

  let initialStar, cuuTinhMatrixNiengan;
  if (core.amDuongType === 'Nam+') { initialStar = 'La Hầu'; cuuTinhMatrixNiengan = CUU_TINH_NIEN_VAN_NAM_PLUS; }
  else if (core.amDuongType === 'Nam-') { initialStar = 'La Hầu'; cuuTinhMatrixNiengan = CUU_TINH_NIEN_VAN_NAM_MINUS; }
  else if (core.amDuongType === 'Nữ+') { initialStar = 'Kế Đô'; cuuTinhMatrixNiengan = CUU_TINH_NIEN_VAN_NU_PLUS; }
  else { initialStar = 'Kế Đô'; cuuTinhMatrixNiengan = CUU_TINH_NIEN_VAN_NU_MINUS; }

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
    queHaFromNiengua = core.gender === 'male' ? 'Khôn' : 'Cấn';
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

/* ---- Tab 3: Tuyen Trach ---- */
function computeTab3(core, gioIndex, canNgay, ngay, thang, yearForTuyenTrach) {
  const age = yearForTuyenTrach - core.yearOfBirth + 1;

  // -- Tuyển trạch chung --
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
  const guaHaMatrixForPhi = flyingStarMatrix('Càn', core.hauThienSoBanMenh);
  const finalHauThienNumberForQueHa = guaHaMatrixForPhi[finalCoordsForPersonKhi[0]][finalCoordsForPersonKhi[1]];

  let queHaGoc = null;
  if (finalHauThienNumberForQueHa === 5) {
    queHaGoc = 'Khôn';
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

  // -- Tuyển trạch riêng --
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

/* =========================================================================
 * PHẦN 3 — RENDER HELPERS
 * ========================================================================= */

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

function coordStr(c) { return c ? `[${c[0]}, ${c[1]}]` : '—'; }

/* =========================================================================
 * PHẦN 4 — GẮN KẾT UI: OPTIONS CHO SELECT
 * ========================================================================= */

function fillMonthSelect(id) {
  const sel = document.getElementById(id);
  for (let m = 1; m <= 12; m++) {
    const opt = document.createElement('option');
    opt.value = m; opt.textContent = `Tháng ${m}`;
    sel.appendChild(opt);
  }
  sel.value = 7;
}

const THIEN_CAN_LIST = ['Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý'];
function fillCanSelect(id) {
  const sel = document.getElementById(id);
  THIEN_CAN_LIST.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c; opt.textContent = c;
    sel.appendChild(opt);
  });
}

const LUNAR_HOUR_LIST = ['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];
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

/* =========================================================================
 * PHẦN 5 — TABS
 * ========================================================================= */
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

/* =========================================================================
 * PHẦN 6 — TAB 1 CAST
 * ========================================================================= */
function castTab1() {
  hideError('error-msg-1');
  try {
    const gender = document.getElementById('t1-gender').value;
    const year = parseInt(document.getElementById('t1-year').value, 10);
    const month = parseInt(document.getElementById('t1-month').value, 10);
    if (!year || year < 1 || month < 1 || month > 12) throw new Error('Vui lòng nhập năm sinh và tháng sinh hợp lệ.');

    const core = computeCoreProfile(gender, year);
    const r = computeTab1(core, month);

    document.getElementById('t1-chips').innerHTML =
      chip('Cung Phi bản mệnh', core.cungPhiGua) +
      chip('Can ẩn', core.canAnUser, true) +
      chip('Sao tại Cung Phi', core.starAtCungPhiGua, true) +
      chip('Khí năm sinh', core.khiAtEndCoords);


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
    showError('error-msg-1', 'Lỗi: ' + e.message);
    document.getElementById('result-1').style.display = 'none';
  }
}
document.getElementById('cast-btn-1').addEventListener('click', castTab1);

/* =========================================================================
 * PHẦN 7 — TAB 2 CAST
 * ========================================================================= */
function castTab2() {
  hideError('error-msg-2');
  try {
    const gender = document.getElementById('t2-gender').value;
    const year = parseInt(document.getElementById('t2-year').value, 10);
    const month = parseInt(document.getElementById('t2-month').value, 10);
    const nienVanYear = parseInt(document.getElementById('t2-nienvan-year').value, 10);
    if (!year || month < 1 || month > 12 || !nienVanYear) throw new Error('Vui lòng nhập đầy đủ thông tin hợp lệ.');

    const core = computeCoreProfile(gender, year);
    const r = computeTab2(core, month, nienVanYear);

    document.getElementById('t2-chips').innerHTML =
      chip('Tuổi (năm ' + nienVanYear + ')', r.age + ' tuổi') +
      chip('Sao chiếu mệnh', r.finalStarForGuaThuong, true);

    document.getElementById('t2-goc-fullname').textContent = getTenQueDich(r.queGoc.thuong, r.queGoc.ha);
    renderHexCard('t2-card-goc', r.queGoc, r.detail.haoDong);
    renderHexCard('t2-card-bien', r.queBien, 0);

    // Month matrix + table
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
    showError('error-msg-2', 'Lỗi: ' + e.message);
    document.getElementById('result-2').style.display = 'none';
  }
}
document.getElementById('cast-btn-2').addEventListener('click', castTab2);

/* =========================================================================
 * PHẦN 8 — TAB 3 CAST
 * ========================================================================= */
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
    if (!year || !ttYear || ngay < 1 || thang < 1 || thang > 12) throw new Error('Vui lòng nhập đầy đủ thông tin hợp lệ.');

    const core = computeCoreProfile(gender, year);
    const r = computeTab3(core, gioIndex, canNgay, ngay, thang, ttYear);

    document.getElementById('t3-chips').innerHTML =
      chip('Cung Phi bản mệnh', core.cungPhiGua) +
      chip('Can / Chi năm sinh', `${core.canForBirthYear} ${core.chiForBirthYear}`, true) +
      chip('Tuổi (năm ' + ttYear + ')', r.age + ' tuổi');

    document.getElementById('t3-chung-chips').innerHTML =
      chip('Khí Tháng ' + thang, r.chung.khiMonth) +
      chip('Khí Ngày ' + ngay, r.chung.khiDay) +
      chip('Khí Giờ ' + LUNAR_HOUR_LIST[gioIndex], r.chung.khiHour) +
      chip('Khí người dùng', r.chung.khiPersonAtCan);

    document.getElementById('t3-goc-fullname').textContent = getTenQueDich(r.chung.queGoc.thuong, r.chung.queGoc.ha);
    renderHexCard('t3-card-goc', r.chung.queGoc, r.chung.detail.haoDong);
    renderHexCard('t3-card-bien', r.chung.queBien, 0);

    document.getElementById('t3-rieng-chips').innerHTML =
      chip('Khí Tháng ' + thang, r.rieng.khiMonthRieng || '—') +
      chip('Khí Ngày ' + ngay, r.rieng.khiDayRieng || '—') +
      chip('Khí Giờ ' + LUNAR_HOUR_LIST[gioIndex], r.rieng.khiHourRieng || '—');

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
    showError('error-msg-3', 'Lỗi: ' + e.message);
    document.getElementById('result-3').style.display = 'none';
  }
}
document.getElementById('cast-btn-3').addEventListener('click', castTab3);

  /* ---- Unified Bridge ---- */
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
