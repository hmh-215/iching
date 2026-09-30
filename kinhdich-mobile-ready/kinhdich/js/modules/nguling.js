window.KD_MOD = window.KD_MOD || {};
window.KD_MOD["nguling"] = function() {
const host = document.querySelector('.kd-mod[data-mod="nguling"]');
if (!host) return;
const { DICH_64_BY_PAIR, TRIGRAM_TUONG, CAN: THIEN_CAN, CHI: DIA_CHI, CAN_DUONG, CAN_AM, SO_TIEN_THIEN, TRIGRAM_TO_BIN: TRIGRAM_TO_BINARY, BIN_TO_TRIGRAM: BINARY_TO_TRIGRAM, TRIGRAM_SYMBOL } = window.KD_DATA;
const { getName: getTenQueDichFromTrigrams, flipBit } = window.KD_DICH;
const { coordEq, mod: pymod } = window.KD_UTIL;
const { svgEl } = window.KD_GRID;
const THIEN_TINH_MAP = [
{ queDon:"C\u00e0n",  soHieu:1,  nguHanh:"Th\u1ee7y+", sao:"Thi\u00ean B\u1ed3ng" },
{ queDon:"\u0110o\u00e0i", soHieu:2,  nguHanh:"Th\u1ed5-",  sao:"Thi\u00ean Nhu\u1ebf" },
{ queDon:"Ly",   soHieu:3,  nguHanh:"M\u1ed9c+",  sao:"Thi\u00ean Xung" },
{ queDon:"Ch\u1ea5n", soHieu:4,  nguHanh:"M\u1ed9c-",  sao:"Thi\u00ean Ph\u1ee5" },
{ queDon:"T\u1ed1n",  soHieu:5,  nguHanh:"H\u1ecfa+",  sao:"Thi\u00ean C\u1ea7m" },
{ queDon:"Kh\u1ea3m", soHieu:6,  nguHanh:"Kim+",  sao:"Thi\u00ean T\u00e2m" },
{ queDon:"C\u1ea5n",  soHieu:7,  nguHanh:"Kim-",  sao:"Thi\u00ean Tr\u1ee5" },
{ queDon:"Kh\u00f4n", soHieu:8,  nguHanh:"Th\u1ed5+",  sao:"Thi\u00ean Nh\u1eadm" },
{ queDon:"C\u00e0n",  soHieu:9,  nguHanh:"H\u1ecfa-",  sao:"Thi\u00ean Anh" },
{ queDon:"\u0110o\u00e0i", soHieu:10, nguHanh:"Th\u1ee7y-", sao:"Thi\u00ean Kh\u00f4ng" },
];
const SO_HIEU_BY_NGU_HANH = Object.fromEntries(THIEN_TINH_MAP.map(r => [r.nguHanh, r.soHieu]));
const ROW_BY_SO_HIEU = Object.fromEntries(THIEN_TINH_MAP.map(r => [r.soHieu, r]));
const NGU_LINH_TABLES = {
"Th\u00e2n_T\u00fd_Th\u00ecn": [
["C\u1ea5n","Kh\u00f4n","Ch\u1ea5n","Ch\u1ea5n"],
["C\u1ea5n",null,null,"Ly"],
["Kh\u1ea3m",null,null,"\u0110o\u00e0i"],
["T\u1ed1n","T\u1ed1n","C\u00e0n","\u0110o\u00e0i"],
],
"D\u1ea7n_Ng\u1ecd_Tu\u1ea5t": [
["\u0110o\u00e0i","C\u00e0n","T\u1ed1n","T\u1ed1n"],
["\u0110o\u00e0i",null,null,"Kh\u1ea3m"],
["Ly",null,null,"C\u1ea5n"],
["Ch\u1ea5n","Ch\u1ea5n","Kh\u00f4n","C\u1ea5n"],
],
"H\u1ee3i_M\u00e3o_M\u00f9i": [
["T\u1ed1n","Kh\u1ea3m","C\u1ea5n","C\u1ea5n"],
["T\u1ed1n",null,null,"Kh\u00f4n"],
["C\u00e0n",null,null,"Ch\u1ea5n"],
["\u0110o\u00e0i","\u0110o\u00e0i","Ly","Ch\u1ea5n"],
],
"T\u1ef5_D\u1eadu_S\u1eedu": [
["Ch\u1ea5n","Ly","\u0110o\u00e0i","\u0110o\u00e0i"],
["Ch\u1ea5n",null,null,"C\u00e0n"],
["Kh\u00f4n",null,null,"T\u1ed1n"],
["C\u1ea5n","C\u1ea5n","Kh\u1ea3m","T\u1ed1n"],
],
};
const GROUP_LABEL = {
"Th\u00e2n_T\u00fd_Th\u00ecn": "Th\u00e2n \u2013 T\u00fd \u2013 Th\u00ecn",
"D\u1ea7n_Ng\u1ecd_Tu\u1ea5t": "D\u1ea7n \u2013 Ng\u1ecd \u2013 Tu\u1ea5t",
"H\u1ee3i_M\u00e3o_M\u00f9i": "H\u1ee3i \u2013 M\u00e3o \u2013 M\u00f9i",
"T\u1ef5_D\u1eadu_S\u1eedu": "T\u1ef5 \u2013 D\u1eadu \u2013 S\u1eedu",
};
const NGU_HANH_SEQUENCE = ["Kim+","Kim-","Th\u1ee7y+","Th\u1ee7y-","H\u1ecfa+","H\u1ecfa-","Th\u1ed5+","Th\u1ed5-","M\u1ed9c+","M\u1ed9c-"];
const STARTING_NGU_HANH_MAP = {
"T\u00fd":"Kim+","S\u1eedu":"Kim+","Ng\u1ecd":"Kim+","M\u00f9i":"Kim+",
"D\u1ea7n":"Th\u1ee7y+","M\u00e3o":"Th\u1ee7y+","Th\u00e2n":"Th\u1ee7y+","D\u1eadu":"Th\u1ee7y+",
"Th\u00ecn":"H\u1ecfa+","T\u1ef5":"H\u1ecfa+","Tu\u1ea5t":"H\u1ecfa+","H\u1ee3i":"H\u1ecfa+",
};
const CHI_DUONG_NAM = ["T\u00fd","D\u1ea7n","Th\u00ecn","Ng\u1ecd","Th\u00e2n","Tu\u1ea5t"];
const CAN_NGAY_TO_TY_CAN = {
"Gi\u00e1p":"Gi\u00e1p","K\u1ef7":"Gi\u00e1p",
"\u1ea4t":"B\u00ednh","Canh":"B\u00ednh",
"B\u00ednh":"M\u1eadu","T\u00e2n":"M\u1eadu",
"\u0110inh":"Canh","Nh\u00e2m":"Canh",
"M\u1eadu":"Nh\u00e2m","Qu\u00fd":"Nh\u00e2m",
};
const DIA_CHI_TO_HOUR_INDEX = {
"T\u00fd":0,"S\u1eedu":1,"D\u1ea7n":2,"M\u00e3o":3,"Th\u00ecn":4,"T\u1ef5":5,"Ng\u1ecd":6,"M\u00f9i":7,"Th\u00e2n":8,"D\u1eadu":9,"Tu\u1ea5t":10,"H\u1ee3i":11,
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
if (["Th\u00e2n","T\u00fd","Th\u00ecn"].includes(chiNam)) return { key:"Th\u00e2n_T\u00fd_Th\u00ecn", table:NGU_LINH_TABLES["Th\u00e2n_T\u00fd_Th\u00ecn"] };
if (["D\u1ea7n","Ng\u1ecd","Tu\u1ea5t"].includes(chiNam)) return { key:"D\u1ea7n_Ng\u1ecd_Tu\u1ea5t", table:NGU_LINH_TABLES["D\u1ea7n_Ng\u1ecd_Tu\u1ea5t"] };
if (["H\u1ee3i","M\u00e3o","M\u00f9i"].includes(chiNam)) return { key:"H\u1ee3i_M\u00e3o_M\u00f9i", table:NGU_LINH_TABLES["H\u1ee3i_M\u00e3o_M\u00f9i"] };
if (["T\u1ef5","D\u1eadu","S\u1eedu"].includes(chiNam)) return { key:"T\u1ef5_D\u1eadu_S\u1eedu", table:NGU_LINH_TABLES["T\u1ef5_D\u1eadu_S\u1eedu"] };
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
function orderQueByCanNgayAndGender(canNgay, chiNam, gioitinh, hauThienQueDon, tienThienQueDon) {
const isCanNgayDuong = CAN_DUONG.includes(canNgay);
if (!gioitinh || gioitinh.trim() === "") {
if (isCanNgayDuong) return [tienThienQueDon, hauThienQueDon];
return [hauThienQueDon, tienThienQueDon];
}
const isNam = gioitinh === "Nam";
const isNamDuong = CHI_DUONG_NAM.includes(chiNam);
if (isNam) {
if (isNamDuong && isCanNgayDuong) return [tienThienQueDon, hauThienQueDon];
if (!isNamDuong && isCanNgayDuong) return [hauThienQueDon, tienThienQueDon];
if (isNamDuong && !isCanNgayDuong) return [hauThienQueDon, tienThienQueDon];
if (!isNamDuong && !isCanNgayDuong) return [tienThienQueDon, hauThienQueDon];
} else {
if (isNamDuong && isCanNgayDuong) return [hauThienQueDon, tienThienQueDon];
if (!isNamDuong && isCanNgayDuong) return [tienThienQueDon, hauThienQueDon];
if (isNamDuong && !isCanNgayDuong) return [tienThienQueDon, hauThienQueDon];
if (!isNamDuong && !isCanNgayDuong) return [hauThienQueDon, tienThienQueDon];
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
const CHI_DUONG = ["T\u00fd","D\u1ea7n","Th\u00ecn","Ng\u1ecd","Th\u00e2n","Tu\u1ea5t"];
const CAN_TRANSFORMATION_MAP = {
"Gi\u00e1p":"K\u1ef7", "K\u1ef7":"Nh\u00e2m",
"\u1ea4t":"M\u1eadu",
"M\u1eadu":"Qu\u00fd",
"B\u00ednh":"T\u00e2n", "T\u00e2n":"Gi\u00e1p",
"\u0110inh":"Canh", "Canh":"\u1ea4t",
"Nh\u00e2m":"\u0110inh", "Qu\u00fd":"B\u00ednh",
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
const canPol = isDuong(newCanGio, "can") ? "D\u01b0\u01a1ng" : "\u00c2m";
const chiPol = isDuong(newChiGio, "chi") ? "D\u01b0\u01a1ng" : "\u00c2m";
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
{ gio: "D\u1ea7n", can: "Canh", ngay: 1, thang: 1, namchi: "T\u00fd", gioitinh: "" },
{ gio: "Tu\u1ea5t", can: "M\u1eadu", ngay: 3, thang: 8, namchi: "S\u1eedu", gioitinh: "Nam" },
{ gio: "T\u00fd", can: "\u1ea4t", ngay: 5, thang: 1, namchi: "Ng\u1ecd", gioitinh: "N\u1eef" },
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
errorBox.textContent = 'L\u1ed7i: ' + e.message;
return;
}
errorBox.style.display = 'none';
result.style.display = 'block';
const goldColor = getComputedStyle(document.documentElement).getPropertyValue('--gold').trim();
const jadeColor = getComputedStyle(document.documentElement).getPropertyValue('--jade').trim();
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
const tbody = document.getElementById('thientinh-tbody');
tbody.innerHTML = "";
THIEN_TINH_MAP.forEach(row => {
const tr = document.createElement('tr');
if (row.soHieu === r.tienThien.baseSoHieu) tr.classList.add('hl-base');
if (row.soHieu === r.tienThien.finalSoHieu) tr.classList.add('hl-final');
tr.innerHTML = `<td>${row.soHieu}</td><td class="name-cell">${TRIGRAM_SYMBOL[row.queDon]} ${row.queDon}</td><td>${row.nguHanh}</td><td>${row.sao}</td>`;
tbody.appendChild(tr);
});
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
document.getElementById('card-goc-title').textContent = r.tenQueGocDich;
document.getElementById('card-goc-symbols').textContent = `${r.finalNguLinhQueName} (${TRIGRAM_SYMBOL[r.orderedUpper]}${TRIGRAM_SYMBOL[r.orderedLower]})`;
renderBarsToElement('bars-goc', r.originalQueBinary, r.haoDong);
document.getElementById('card-bien-title').textContent = r.tenQueBienDich;
document.getElementById('card-bien-symbols').textContent = `${r.transformedQueName} (${TRIGRAM_SYMBOL[r.transformedQueNameUpper]}${TRIGRAM_SYMBOL[r.transformedQueNameLower]})`;
renderBarsToElement('bars-bien', r.transformedQueBinary, 0);
document.getElementById('card-ho-title').textContent = r.tenQueHoDich;
document.getElementById('card-ho-symbols').textContent = `${r.queHo.queHoName} (${TRIGRAM_SYMBOL[r.queHo.upperName]}${TRIGRAM_SYMBOL[r.queHo.lowerName]})`;
renderBarsToElement('bars-ho', r.queHo.queHoFullBinary, 0);
document.getElementById('goc-binary').textContent = r.originalQueBinary;
document.getElementById('bien-binary').textContent = r.transformedQueBinary;
document.getElementById('ho-binary').textContent = r.queHo.queHoFullBinary;
document.getElementById('haodong-value').textContent = `Hào ${r.haoDong}`;
document.getElementById('haodong-formula').innerHTML =
`Nguyên Đường = (${r.soTienThienHauThien} + ${r.tienThien.finalSoHieu}) mod 6 = ${r.haoNguyenDuong}<br>Hào Động = (${r.haoNguyenDuong} + ${DIA_CHI_TO_HOUR_INDEX[gio]}) mod 6 = ${r.haoDong}`;
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
hoanThoiCurrentCanGio = r.calculatedCanGio;
hoanThoiCurrentChiGio = gio;
hoanThoiOriginalCanNgay = can;
hoanThoiHistory = [{
type: "Gi\u1edd ch\u1ee7",
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
hoanThoiBtn.innerText = "Ho\u00e1n th\u1eddi ph\u00e1p";
updateHoanThoiCurrentLabel();
renderHoanThoiLog();
} else {
hoanThoiSection.style.display = 'block';
hoanThoiBtn.disabled = false;
hoanThoiBtn.innerText = "Ho\u00e1n th\u1eddi ph\u00e1p";
updateHoanThoiCurrentLabel();
renderHoanThoiLog();
}
}
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
card.className = 'hoanthoi-entry' + (entry.type === "Gi\u1edd ch\u1ee7" ? ' is-master' : '');
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
alert('Qu\u1ebb \u0110\u1eddi Ng\u01b0\u1eddi kh\u00f4ng \u00e1p d\u1ee5ng Ho\u00e1n Th\u1eddi Ph\u00e1p.');
return;
}
const currentCount = hoanThoiHistory.length - 1;
if (currentCount >= MAX_HOAN_THOI) {
alert('\u0110\u00e3 \u0111\u1ea1t gi\u1edbi h\u1ea1n t\u1ed1i \u0111a 59 l\u1ea7n ho\u00e1n th\u1eddi ph\u00e1p (t\u1ed1i \u0111a 59 qu\u1ebb theo gi\u1edd kh\u00e1ch).');
return;
}
if (hoanThoiCurrentCanGio === null || hoanThoiCurrentChiGio === null || hoanThoiOriginalCanNgay === null) {
alert('Vui l\u00f2ng th\u1ef1c hi\u1ec7n L\u1eadp Qu\u1ebb Ng\u0169 Linh tr\u01b0\u1edbc \u0111\u1ec3 thi\u1ebft l\u1eadp gi\u1edd ban \u0111\u1ea7u.');
return;
}
let newCanGio, newChiGio;
try {
[newCanGio, newChiGio] = hoanThoiPhap(hoanThoiCurrentCanGio, hoanThoiCurrentChiGio, hoanThoiOriginalCanNgay);
} catch (e) {
alert('L\u1ed7i Ho\u00e1n Th\u1eddi Ph\u00e1p: ' + e.message);
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
btn.innerText = "Ho\u00e1n th\u1eddi ph\u00e1p";
}
} catch (e) {
alert('L\u1ed7i Ho\u00e1n Th\u1eddi Ph\u00e1p: ' + e.message);
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
if (selGio) selGio.value = "D\u1ea7n";
if (selCan) selCan.value = "Canh";
if (selNgay) selNgay.value = "1";
if (selThang) selThang.value = "1";
if (selNamChi) selNamChi.value = "T\u00fd";
if (selGioiTinh) selGioiTinh.value = "";
if (typeof cast === 'function') {
window.cast = cast;
window.__KD_CAST = cast;
} else {
window.__KD_CAST = function() {};
}
};