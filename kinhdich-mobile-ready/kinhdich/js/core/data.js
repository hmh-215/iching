(function() {
'use strict';
window.KD_CORE = window.KD_CORE || {};
const THIEN_CAN = ["Gi\u00e1p","\u1ea4t","B\u00ednh","\u0110inh","M\u1eadu","K\u1ef7","Canh","T\u00e2n","Nh\u00e2m","Qu\u00fd"];
const DIA_CHI = ["T\u00fd","S\u1eedu","D\u1ea7n","M\u00e3o","Th\u00ecn","T\u1ef5","Ng\u1ecd","M\u00f9i","Th\u00e2n","D\u1eadu","Tu\u1ea5t","H\u1ee3i"];
const CAN_DUONG = ["Gi\u00e1p","B\u00ednh","M\u1eadu","Canh","Nh\u00e2m"];
const CAN_AM = ["\u1ea4t","\u0110inh","K\u1ef7","T\u00e2n","Qu\u00fd"];
const CHI_DUONG = ["T\u00fd","D\u1ea7n","Th\u00ecn","Ng\u1ecd","Th\u00e2n","Tu\u1ea5t"];
const CHI_AM = ["S\u1eedu","M\u00e3o","T\u1ef5","M\u00f9i","D\u1eadu","H\u1ee3i"];
const LUC_THAP_HOA_GIAP = [
"Gi\u00e1p T\u00fd","\u1ea4t S\u1eedu","B\u00ednh D\u1ea7n","\u0110inh M\u00e3o","M\u1eadu Th\u00ecn","K\u1ef7 T\u1ef5","Canh Ng\u1ecd","T\u00e2n M\u00f9i","Nh\u00e2m Th\u00e2n","Qu\u00fd D\u1eadu",
"Gi\u00e1p Tu\u1ea5t","\u1ea4t H\u1ee3i","B\u00ednh T\u00fd","\u0110inh S\u1eedu","M\u1eadu D\u1ea7n","K\u1ef7 M\u00e3o","Canh Th\u00ecn","T\u00e2n T\u1ef5","Nh\u00e2m Ng\u1ecd","Qu\u00fd M\u00f9i",
"Gi\u00e1p Th\u00e2n","\u1ea4t D\u1eadu","B\u00ednh Tu\u1ea5t","\u0110inh H\u1ee3i","M\u1eadu T\u00fd","K\u1ef7 S\u1eedu","Canh D\u1ea7n","T\u00e2n M\u00e3o","Nh\u00e2m Th\u00ecn","Qu\u00fd T\u1ef5",
"Gi\u00e1p Ng\u1ecd","\u1ea4t M\u00f9i","B\u00ednh Th\u00e2n","\u0110inh D\u1eadu","M\u1eadu Tu\u1ea5t","K\u1ef7 H\u1ee3i","Canh T\u00fd","T\u00e2n S\u1eedu","Nh\u00e2m D\u1ea7n","Qu\u00fd M\u00e3o",
"Gi\u00e1p Th\u00ecn","\u1ea4t T\u1ef5","B\u00ednh Ng\u1ecd","\u0110inh M\u00f9i","M\u1eadu Th\u00e2n","K\u1ef7 D\u1eadu","Canh Tu\u1ea5t","T\u00e2n H\u1ee3i","Nh\u00e2m T\u00fd","Qu\u00fd S\u1eedu",
"Gi\u00e1p D\u1ea7n","\u1ea4t M\u00e3o","B\u00ednh Th\u00ecn","\u0110inh T\u1ef5","M\u1eadu Ng\u1ecd","K\u1ef7 M\u00f9i","Canh Th\u00e2n","T\u00e2n D\u1eadu","Nh\u00e2m Tu\u1ea5t","Qu\u00fd H\u1ee3i"
];
const TRIGRAM_SYMBOL = {
"C\u00e0n": "\u2630", "\u0110o\u00e0i": "\u2631", "Ly": "\u2632", "Ch\u1ea5n": "\u2633",
"T\u1ed1n": "\u2634", "Kh\u1ea3m": "\u2635", "C\u1ea5n": "\u2636", "Kh\u00f4n": "\u2637"
};
const TRIGRAM_TUONG = {
"C\u00e0n": "Thi\u00ean", "\u0110o\u00e0i": "Tr\u1ea1ch", "Ly": "H\u1ecfa", "Ch\u1ea5n": "L\u00f4i",
"T\u1ed1n": "Phong", "Kh\u1ea3m": "Th\u1ee7y", "C\u1ea5n": "S\u01a1n", "Kh\u00f4n": "\u0110\u1ecba"
};
const TRIGRAM_TO_BIN = {
"C\u00e0n": "111", "\u0110o\u00e0i": "110", "Ly": "101", "Ch\u1ea5n": "100",
"T\u1ed1n": "011", "Kh\u1ea3m": "010", "C\u1ea5n": "001", "Kh\u00f4n": "000"
};
const BIN_TO_TRIGRAM = {
"111": "C\u00e0n", "110": "\u0110o\u00e0i", "101": "Ly", "100": "Ch\u1ea5n",
"011": "T\u1ed1n", "010": "Kh\u1ea3m", "001": "C\u1ea5n", "000": "Kh\u00f4n"
};
const SO_TIEN_THIEN = {
"C\u00e0n": 1, "\u0110o\u00e0i": 2, "Ly": 3, "Ch\u1ea5n": 4,
"T\u1ed1n": 5, "Kh\u1ea3m": 6, "C\u1ea5n": 7, "Kh\u00f4n": 8
};
const HAU_THIEN_SO = {
"Kh\u1ea3m": 1, "Kh\u00f4n": 2, "Ch\u1ea5n": 3, "T\u1ed1n": 4,
"C\u00e0n": 6, "\u0110o\u00e0i": 7, "C\u1ea5n": 8, "Ly": 9
};
const DICH_64_BY_PAIR = {
"C\u00e0n_C\u00e0n": "Thu\u1ea7n C\u00e0n", "C\u00e0n_\u0110o\u00e0i": "Thi\u00ean Tr\u1ea1ch L\u00fd", "C\u00e0n_Ly": "Thi\u00ean H\u1ecfa \u0110\u1ed3ng Nh\u00e2n", "C\u00e0n_Ch\u1ea5n": "Thi\u00ean L\u00f4i V\u00f4 V\u1ecdng",
"C\u00e0n_T\u1ed1n": "Thi\u00ean Phong C\u1ea5u", "C\u00e0n_Kh\u1ea3m": "Thi\u00ean Th\u1ee7y T\u1ee5ng", "C\u00e0n_C\u1ea5n": "Thi\u00ean S\u01a1n \u0110\u1ed9n", "C\u00e0n_Kh\u00f4n": "Thi\u00ean \u0110\u1ecba B\u0129",
"\u0110o\u00e0i_C\u00e0n": "Tr\u1ea1ch Thi\u00ean Qu\u1ea3i", "\u0110o\u00e0i_\u0110o\u00e0i": "Thu\u1ea7n \u0110o\u00e0i", "\u0110o\u00e0i_Ly": "Tr\u1ea1ch H\u1ecfa C\u00e1ch", "\u0110o\u00e0i_Ch\u1ea5n": "Tr\u1ea1ch L\u00f4i T\u00f9y",
"\u0110o\u00e0i_T\u1ed1n": "Tr\u1ea1ch Phong \u0110\u1ea1i Qu\u00e1", "\u0110o\u00e0i_Kh\u1ea3m": "Tr\u1ea1ch Th\u1ee7y Kh\u1ed1n", "\u0110o\u00e0i_C\u1ea5n": "Tr\u1ea1ch S\u01a1n H\u00e0m", "\u0110o\u00e0i_Kh\u00f4n": "Tr\u1ea1ch \u0110\u1ecba T\u1ee5y",
"Ly_C\u00e0n": "H\u1ecfa Thi\u00ean \u0110\u1ea1i H\u1eefu", "Ly_\u0110o\u00e0i": "H\u1ecfa Tr\u1ea1ch Khu\u00ea", "Ly_Ly": "Thu\u1ea7n Ly", "Ly_Ch\u1ea5n": "H\u1ecfa L\u00f4i Ph\u1ec7 H\u1ea1p",
"Ly_T\u1ed1n": "H\u1ecfa Phong \u0110\u1ec9nh", "Ly_Kh\u1ea3m": "H\u1ecfa Th\u1ee7y V\u1ecb T\u1ebf", "Ly_C\u1ea5n": "H\u1ecfa S\u01a1n L\u1eef", "Ly_Kh\u00f4n": "H\u1ecfa \u0110\u1ecba T\u1ea5n",
"Ch\u1ea5n_C\u00e0n": "L\u00f4i Thi\u00ean \u0110\u1ea1i Tr\u00e1ng", "Ch\u1ea5n_\u0110o\u00e0i": "L\u00f4i Tr\u1ea1ch Quy Mu\u1ed9i", "Ch\u1ea5n_Ly": "L\u00f4i H\u1ecfa Phong", "Ch\u1ea5n_Ch\u1ea5n": "Thu\u1ea7n Ch\u1ea5n",
"Ch\u1ea5n_T\u1ed1n": "L\u00f4i Phong H\u1eb1ng", "Ch\u1ea5n_Kh\u1ea3m": "L\u00f4i Th\u1ee7y Gi\u1ea3i", "Ch\u1ea5n_C\u1ea5n": "L\u00f4i S\u01a1n Ti\u1ec3u Qu\u00e1", "Ch\u1ea5n_Kh\u00f4n": "L\u00f4i \u0110\u1ecba D\u1ef1",
"T\u1ed1n_C\u00e0n": "Phong Thi\u00ean Ti\u1ec3u S\u00fac", "T\u1ed1n_\u0110o\u00e0i": "Phong Tr\u1ea1ch Trung Phu", "T\u1ed1n_Ly": "Phong H\u1ecfa Gia Nh\u00e2n", "T\u1ed1n_Ch\u1ea5n": "Phong L\u00f4i \u00cdch",
"T\u1ed1n_T\u1ed1n": "Thu\u1ea7n T\u1ed1n", "T\u1ed1n_Kh\u1ea3m": "Phong Th\u1ee7y Ho\u00e1n", "T\u1ed1n_C\u1ea5n": "Phong S\u01a1n Ti\u1ec7m", "T\u1ed1n_Kh\u00f4n": "Phong \u0110\u1ecba Quan",
"Kh\u1ea3m_C\u00e0n": "Th\u1ee7y Thi\u00ean Nhu", "Kh\u1ea3m_\u0110o\u00e0i": "Th\u1ee7y Tr\u1ea1ch Ti\u1ebft", "Kh\u1ea3m_Ly": "Th\u1ee7y H\u1ecfa K\u00fd T\u1ebf", "Kh\u1ea3m_Ch\u1ea5n": "Th\u1ee7y L\u00f4i Tru\u00e2n",
"Kh\u1ea3m_T\u1ed1n": "Th\u1ee7y Phong T\u1ec9nh", "Kh\u1ea3m_Kh\u1ea3m": "Thu\u1ea7n Kh\u1ea3m", "Kh\u1ea3m_C\u1ea5n": "Th\u1ee7y S\u01a1n Ki\u1ec3n", "Kh\u1ea3m_Kh\u00f4n": "Th\u1ee7y \u0110\u1ecba T\u1ef7",
"C\u1ea5n_C\u00e0n": "S\u01a1n Thi\u00ean \u0110\u1ea1i S\u00fac", "C\u1ea5n_\u0110o\u00e0i": "S\u01a1n Tr\u1ea1ch T\u1ed5n", "C\u1ea5n_Ly": "S\u01a1n H\u1ecfa B\u00ed", "C\u1ea5n_Ch\u1ea5n": "S\u01a1n L\u00f4i Di",
"C\u1ea5n_T\u1ed1n": "S\u01a1n Phong C\u1ed5", "C\u1ea5n_Kh\u1ea3m": "S\u01a1n Th\u1ee7y M\u00f4ng", "C\u1ea5n_C\u1ea5n": "Thu\u1ea7n C\u1ea5n", "C\u1ea5n_Kh\u00f4n": "S\u01a1n \u0110\u1ecba B\u00e1c",
"Kh\u00f4n_C\u00e0n": "\u0110\u1ecba Thi\u00ean Th\u00e1i", "Kh\u00f4n_\u0110o\u00e0i": "\u0110\u1ecba Tr\u1ea1ch L\u00e2m", "Kh\u00f4n_Ly": "\u0110\u1ecba H\u1ecfa Minh Di", "Kh\u00f4n_Ch\u1ea5n": "\u0110\u1ecba L\u00f4i Ph\u1ee5c",
"Kh\u00f4n_T\u1ed1n": "\u0110\u1ecba Phong Th\u0103ng", "Kh\u00f4n_Kh\u1ea3m": "\u0110\u1ecba Th\u1ee7y S\u01b0", "Kh\u00f4n_C\u1ea5n": "\u0110\u1ecba S\u01a1n Khi\u00eam", "Kh\u00f4n_Kh\u00f4n": "Thu\u1ea7n Kh\u00f4n"
};
const KD_DICH = {
getName(upper, lower) {
if (!upper || !lower) return "";
const key = `${upper}_${lower}`;
if (DICH_64_BY_PAIR[key]) return DICH_64_BY_PAIR[key];
if (upper === lower) return `Thuần ${upper}`;
if (TRIGRAM_TUONG[upper] && TRIGRAM_TUONG[lower]) {
return `${TRIGRAM_TUONG[upper]} ${TRIGRAM_TUONG[lower]}`;
}
return "Kh\u00f4ng x\u00e1c \u0111\u1ecbnh";
},
flipBit(binaryStr, position) {
if (!binaryStr || position < 1 || position > binaryStr.length) return binaryStr;
const idx = position - 1;
const chars = binaryStr.split("");
chars[idx] = chars[idx] === "1" ? "0" : "1";
return chars.join("");
},
getQueHo(originalQueBinary) {
if (!originalQueBinary || originalQueBinary.length < 6) return null;
const lowerBin = originalQueBinary.slice(1, 4);
const upperBin = originalQueBinary.slice(2, 5);
const lowerName = BIN_TO_TRIGRAM[lowerBin] || "Kh\u1ea3m";
const upperName = BIN_TO_TRIGRAM[upperBin] || "Kh\u1ea3m";
const fullName = KD_DICH.getName(upperName, lowerName);
return {
lowerName, upperName,
lowerBin, upperBin,
binary: lowerBin + upperBin,
name: fullName
};
},
nameToBinary(fullName) {
if (!fullName) return null;
const clean = fullName.replace(/\(.*?\)/g, '').trim();
const words = clean.split(/\s+/);
if (words.length < 2) return null;
if (words[0] === 'Thu\u1ea7n') {
const code = TRIGRAM_TO_BIN[words[1]];
return code ? code + code : null;
}
const upperKey = Object.keys(TRIGRAM_TUONG).find(k => TRIGRAM_TUONG[k] === words[0]) || words[0];
const lowerKey = Object.keys(TRIGRAM_TUONG).find(k => TRIGRAM_TUONG[k] === words[1]) || words[1];
const upper = TRIGRAM_TO_BIN[upperKey];
const lower = TRIGRAM_TO_BIN[lowerKey];
if (!upper || !lower) return null;
return lower + upper;
}
};
const KD_DATA = {
CAN: THIEN_CAN,
CHI: DIA_CHI,
CAN_DUONG, CAN_AM,
CHI_DUONG, CHI_AM,
HOA_GIAP_60: LUC_THAP_HOA_GIAP,
TRIGRAM_SYMBOL,
TRIGRAM_TUONG,
TRIGRAM_TO_BIN,
BIN_TO_TRIGRAM,
SO_TIEN_THIEN,
HAU_THIEN_SO,
DICH_64_BY_PAIR
};
window.KD_CORE.DATA = KD_DATA;
window.KD_CORE.DICH = KD_DICH;
window.KD_DATA = KD_DATA;
window.KD_DICH = KD_DICH;
})();