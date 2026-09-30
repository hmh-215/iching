(function() {
'use strict';
window.KD_CORE = window.KD_CORE || {};
const KHAM_BASE = [
[2, 3, 7],
[6, 1, 5],
[4, 8, 9]
];
const GUA_TRANSFORM_A = {
'Kh\u1ea3m': 'e',
'Kh\u00f4n': 'rot270',
'Ch\u1ea5n': 'flip_h',
'T\u1ed1n': 'rot180',
'C\u00e0n': 'rot90',
'\u0110o\u00e0i': 'flip_v',
'C\u1ea5n': 'transpose',
'Ly': 'anti_transpose'
};
const GUA_TRANSFORM_B = {
'Kh\u1ea3m': 'e',
'Kh\u00f4n': 'transpose',
'Ch\u1ea5n': 'rot90',
'T\u1ed1n': 'rot180',
'C\u00e0n': 'anti_transpose',
'\u0110o\u00e0i': 'rot270',
'C\u1ea5n': 'flip_v',
'Ly': 'flip_h'
};
const BIEN_KHI_MEANINGS = {
"000": "Ph\u1ee5c v\u1ecb",
"001": "H\u1ecda h\u1ea1i",
"010": "Tuy\u1ec7t m\u1ec7nh",
"011": "L\u1ee5c s\u00e1t",
"100": "Sinh kh\u00ed",
"101": "Di\u00ean ni\u00ean",
"110": "Ng\u0169 qu\u1ef7",
"111": "Thi\u00ean y"
};
const KD_FLYINGSTAR = {
KHAM_BASE,
GUA_TRANSFORM_A,
GUA_TRANSFORM_B,
BIEN_KHI_MEANINGS,
transform(matrix, kind) {
const n = 3;
const result = [[0,0,0],[0,0,0],[0,0,0]];
for (let r = 0; r < n; r++) {
for (let c = 0; c < n; c++) {
const r0 = r - 1, c0 = c - 1;
let nr0, nc0;
if (kind === 'e') { nr0 = r0; nc0 = c0; }
else if (kind === 'rot90') { nr0 = c0; nc0 = -r0; }
else if (kind === 'rot180') { nr0 = -r0; nc0 = -c0; }
else if (kind === 'rot270') { nr0 = -c0; nc0 = r0; }
else if (kind === 'flip_h') { nr0 = r0; nc0 = -c0; }
else if (kind === 'flip_v') { nr0 = -r0; nc0 = c0; }
else if (kind === 'transpose') { nr0 = c0; nc0 = r0; }
else if (kind === 'anti_transpose') { nr0 = -c0; nc0 = -r0; }
else { nr0 = r0; nc0 = c0; }
result[nr0 + 1][nc0 + 1] = matrix[r][c];
}
}
return result;
},
getMatrix(gua, centerNumber, variant = 'A') {
const mapping = variant === 'B' ? GUA_TRANSFORM_B : GUA_TRANSFORM_A;
const kind = mapping[gua] || 'e';
const transformed = KD_FLYINGSTAR.transform(KHAM_BASE, kind);
const shift = ((centerNumber - 1) % 9 + 9) % 9;
const result = [[0,0,0],[0,0,0],[0,0,0]];
for (let r = 0; r < 3; r++) {
for (let c = 0; c < 3; c++) {
result[r][c] = ((transformed[r][c] - 1 + shift) % 9) + 1;
}
}
return result;
},
calculateCungPhi(year, gender = 'Nam') {
const yearStr = String(year);
let yearSum = 0;
for (const ch of yearStr) {
if (ch >= '0' && ch <= '9') yearSum += parseInt(ch, 10);
}
let cungPhiNum = yearSum % 9;
if (cungPhiNum === 0) cungPhiNum = 9;
const isMale = String(gender).toLowerCase().includes('nam');
const baseGua = isMale ? 'Kh\u00f4n' : 'C\u00e0n';
const centerVal = isMale ? 2 : 6;
const matrix = KD_FLYINGSTAR.getMatrix(baseGua, centerVal, 'A');
const LAC_THU_TO_GUA = {
'0,0': 'T\u1ed1n', '0,1': 'Ly', '0,2': 'Kh\u00f4n',
'1,0': 'Ch\u1ea5n', '1,1': 'Trung Cung', '1,2': '\u0110o\u00e0i',
'2,0': 'C\u1ea5n', '2,1': 'Kh\u1ea3m', '2,2': 'C\u00e0n'
};
let foundPos = null;
for (let r = 0; r < 3; r++) {
for (let c = 0; c < 3; c++) {
if (matrix[r][c] === cungPhiNum) {
foundPos = [r, c];
break;
}
}
if (foundPos) break;
}
let guaName = "Kh\u00f4n";
if (foundPos) {
const visualPos = [2 - foundPos[0], foundPos[1]];
const key = `${visualPos[0]},${visualPos[1]}`;
guaName = LAC_THU_TO_GUA[key] || "Kh\u00f4n";
if (guaName === "Trung Cung") {
guaName = isMale ? "Kh\u00f4n" : "C\u1ea5n";
}
}
return {
year, gender, yearSum, cungPhiNum,
baseGua, centerVal, matrix,
cungPhiGua: guaName
};
},
calculateBienKhi(gua1, gua2) {
const data = window.KD_DATA || (window.KD_CORE && window.KD_CORE.DATA);
const toBin = (data && data.TRIGRAM_TO_BIN) || {
"C\u00e0n": "111", "\u0110o\u00e0i": "110", "Ly": "101", "Ch\u1ea5n": "100",
"T\u1ed1n": "011", "Kh\u1ea3m": "010", "C\u1ea5n": "001", "Kh\u00f4n": "000"
};
const b1 = toBin[gua1] || "000";
const b2 = toBin[gua2] || "000";
let xorResult = "";
for (let i = 0; i < 3; i++) {
xorResult += (b1[i] !== b2[i] ? "1" : "0");
}
const meaning = BIEN_KHI_MEANINGS[xorResult] || "Ph\u1ee5c v\u1ecb";
return {
binary1: b1,
binary2: b2,
xorBinary: xorResult,
meaning
};
}
};
window.KD_CORE.FLYINGSTAR = KD_FLYINGSTAR;
window.KD_FLYINGSTAR = KD_FLYINGSTAR;
})();