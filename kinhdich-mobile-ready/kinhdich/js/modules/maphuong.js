window.KD_MOD = window.KD_MOD || {};
window.KD_MOD["maphuong"] = function() {
const host = document.querySelector('.kd-mod[data-mod="maphuong"]');
if (!host) return;
const { TRIGRAM_SYMBOL } = window.KD_DATA || { TRIGRAM_SYMBOL: { "C\u00e0n":"\u2630","\u0110o\u00e0i":"\u2631","Ly":"\u2632","Ch\u1ea5n":"\u2633","T\u1ed1n":"\u2634","Kh\u1ea3m":"\u2635","C\u1ea5n":"\u2636","Kh\u00f4n":"\u2637" } };
const { mod: pymod, toggleStepBox } = window.KD_UTIL || { mod: (n, m) => ((n % m) + m) % m, toggleStepBox: id => document.getElementById(id)?.classList.toggle('open') };
const { KHAM_BASE, transform } = window.KD_FLYINGSTAR || {
KHAM_BASE: [[2, 3, 7], [6, 1, 5], [4, 8, 9]],
transform: (m, k) => m
};
const { svgEl } = window.KD_GRID || {};
const GUA_NAMES = ['C\u00e0n', '\u0110o\u00e0i', 'Ly', 'Ch\u1ea5n', 'T\u1ed1n', 'Kh\u1ea3m', 'C\u1ea5n', 'Kh\u00f4n'];
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
function flyingStarMatrix(gua, centerNumber) {
if (centerNumber === undefined) centerNumber = 1;
const base = transform(KHAM_BASE, GUA_TRANSFORM[gua]);
const shift = centerNumber - 1;
return base.map(row => row.map(v => pymod(v - 1 + shift, 9) + 1));
}
const NAP_CHI_DATA = {
'C\u00e0n':  { 1:'T\u00fd',  2:'D\u1ea7n', 3:'Th\u00ecn', 4:'Ng\u1ecd', 5:'Th\u00e2n', 6:'Tu\u1ea5t' },
'Ch\u1ea5n': { 1:'T\u00fd',  2:'D\u1ea7n', 3:'Th\u00ecn', 4:'Ng\u1ecd', 5:'Th\u00e2n', 6:'Tu\u1ea5t' },
'Kh\u1ea3m': { 1:'D\u1ea7n', 2:'Th\u00ecn',3:'Ng\u1ecd',  4:'Th\u00e2n',5:'Tu\u1ea5t', 6:'T\u00fd'   },
'C\u1ea5n':  { 1:'Th\u00ecn',2:'Ng\u1ecd', 3:'Th\u00e2n', 4:'Tu\u1ea5t',5:'T\u00fd',   6:'D\u1ea7n' },
'\u0110o\u00e0i': { 1:'T\u1ef5',  2:'M\u00e3o', 3:'S\u1eedu',  4:'H\u1ee3i', 5:'D\u1eadu',  6:'M\u00f9i' },
'Ly':   { 1:'M\u00e3o', 2:'S\u1eedu', 3:'H\u1ee3i',  4:'D\u1eadu', 5:'M\u00f9i',  6:'T\u1ef5'  },
'T\u1ed1n':  { 1:'S\u1eedu', 2:'H\u1ee3i', 3:'D\u1eadu',  4:'M\u00f9i', 5:'T\u1ef5',   6:'M\u00e3o' },
'Kh\u00f4n': { 1:'M\u00f9i', 2:'T\u1ef5',  3:'M\u00e3o',  4:'S\u1eedu', 5:'H\u1ee3i',  6:'D\u1eadu' },
};
const DIA_CHI_COORD_MAP = {
'T\u1ef5':[0,0], 'Ng\u1ecd':[0,1], 'M\u00f9i':[0,2], 'Th\u00e2n':[0,3],
'Th\u00ecn':[1,0], 'D\u1eadu':[1,3],
'M\u00e3o':[2,0], 'Tu\u1ea5t':[2,3],
'D\u1ea7n':[3,0], 'S\u1eedu':[3,1], 'T\u00fd':[3,2], 'H\u1ee3i':[3,3],
};
const SINH_THANH_TABLE = [
[3, 2, 5, 2],
[1, null, null, 4],
[9, null, null, 6],
[7, 5, 7, 8],
];
const TIEN_THIEN_NUMBERS = { 'C\u00e0n':1,'\u0110o\u00e0i':2,'Ly':3,'Ch\u1ea5n':4,'T\u1ed1n':5,'Kh\u1ea3m':6,'C\u1ea5n':7,'Kh\u00f4n':8 };
const TIEN_THIEN_NAMES = { 1:'C\u00e0n',2:'\u0110o\u00e0i',3:'Ly',4:'Ch\u1ea5n',5:'T\u1ed1n',6:'Kh\u1ea3m',7:'C\u1ea5n',8:'Kh\u00f4n' };
const CUNG_NGHI_GUAS = new Set(['C\u00e0n', '\u0110o\u00e0i', 'Ly', 'Ch\u1ea5n']);
const KHAC_NGHI_GUAS = new Set(['T\u1ed1n', 'Kh\u1ea3m', 'C\u1ea5n', 'Kh\u00f4n']);
function calcHoCuaQue(quatThuong, quaHa) {
const soTienThienThuong = TIEN_THIEN_NUMBERS[quatThuong];
const soTienThienHa = TIEN_THIEN_NUMBERS[quaHa];
const total = soTienThienThuong + soTienThienHa;
let hoCuaQue, nhanhTinh;
if (total % 2 !== 0) {
const resultNum = 9 - soTienThienHa;
hoCuaQue = TIEN_THIEN_NAMES[resultNum];
nhanhTinh = 'odd';
} else {
const thuongCungNghi = CUNG_NGHI_GUAS.has(quatThuong);
const haCungNghi = CUNG_NGHI_GUAS.has(quaHa);
if (thuongCungNghi === haCungNghi) {
hoCuaQue = quaHa;
} else {
hoCuaQue = quatThuong;
}
nhanhTinh = 'even';
}
return { soTienThienThuong, soTienThienHa, total, hoCuaQue, nhanhTinh };
}
const LAC_THU_MAPPING = {
'T\u1ed1n':[0,0], 'Ly':[0,1], 'Kh\u00f4n':[0,2],
'Ch\u1ea5n':[1,0], '\u0110o\u00e0i':[1,2],
'C\u1ea5n':[2,0], 'Kh\u1ea3m':[2,1], 'C\u00e0n':[2,2],
};
const HAU_THIEN_NUMBER_TO_GUA_NAME = {
1:'Kh\u1ea3m', 2:'Kh\u00f4n', 3:'Ch\u1ea5n', 4:'T\u1ed1n', 5:'Trung Cung', 6:'C\u00e0n', 7:'\u0110o\u00e0i', 8:'C\u1ea5n', 9:'Ly',
};
function reversedRows(m) { return [m[2], m[1], m[0]]; }
function calculateMaPhuong(quatThuong, quaHa, haoDong) {
const guaForNapChi = (haoDong >= 1 && haoDong <= 3) ? quaHa : quatThuong;
const diaChi = NAP_CHI_DATA[guaForNapChi][haoDong];
const coord = DIA_CHI_COORD_MAP[diaChi];
const sinhThanhValue = SINH_THANH_TABLE[coord[0]][coord[1]];
const hoInfo = calcHoCuaQue(quatThuong, quaHa);
const hoCuaQue = hoInfo.hoCuaQue;
const rawSinhThanh = flyingStarMatrix(hoCuaQue, sinhThanhValue);
const matrixSinhThanh = rawSinhThanh;
const posThuong = LAC_THU_MAPPING[quatThuong];
const centerThuong = matrixSinhThanh[2 - posThuong[0]][posThuong[1]];
const rawQueThuong = flyingStarMatrix(quatThuong, centerThuong);
const matrixQueThuong = rawQueThuong.map(row => row.map(v => v === 5 ? centerThuong : v));
const posHa = LAC_THU_MAPPING[quaHa];
const centerHa = matrixSinhThanh[2 - posHa[0]][posHa[1]];
const rawQueHa = flyingStarMatrix(quaHa, centerHa);
const matrixQueHa = rawQueHa.map(row => row.map(v => v === 5 ? centerHa : v));
const finalMagicSquare = [];
for (let r = 0; r < 3; r++) {
const rowDisplay = [];
for (let c = 0; c < 3; c++) {
const numThuong = matrixQueThuong[r][c];
const numHa = matrixQueHa[r][c];
const nameThuong = HAU_THIEN_NUMBER_TO_GUA_NAME[numThuong] || ('S\u1ed1 ' + numThuong + ' kh\u00f4ng x\u00e1c \u0111\u1ecbnh');
const nameHa = HAU_THIEN_NUMBER_TO_GUA_NAME[numHa] || ('S\u1ed1 ' + numHa + ' kh\u00f4ng x\u00e1c \u0111\u1ecbnh');
rowDisplay.push(nameThuong + '/' + nameHa);
}
finalMagicSquare.push(rowDisplay);
}
finalMagicSquare[1][1] = 'null';
return {
guaForNapChi, diaChi, coord, sinhThanhValue,
hoInfo, hoCuaQue, matrixSinhThanh, rawSinhThanh,
posThuong, centerThuong, matrixQueThuong, rawQueThuong,
posHa, centerHa, matrixQueHa, rawQueHa,
finalMagicSquare,
};
}
const selThuong = host.querySelector('#sel-thuong');
const selHa = host.querySelector('#sel-ha');
const selHao = host.querySelector('#sel-hao');
const arrowToggle = host.querySelector('#toggle-arrows');
if (selThuong && selThuong.options.length === 0) GUA_NAMES.forEach(g => selThuong.add(new Option(g, g)));
if (selHa && selHa.options.length === 0) GUA_NAMES.forEach(g => selHa.add(new Option(g, g)));
if (selHao && selHao.options.length === 0) for (let h = 1; h <= 6; h++) selHao.add(new Option('H\u00e0o ' + h, h));
const PRESETS = [
{ thuong: 'C\u00e0n', ha: 'Kh\u00f4n', hao: 1 },
{ thuong: 'Ch\u1ea5n', ha: 'Kh\u1ea3m', hao: 4 },
{ thuong: 'Ly', ha: '\u0110o\u00e0i', hao: 6 },
];
host.querySelectorAll('.preset-btn').forEach(btn => {
btn.addEventListener('click', () => {
const p = PRESETS[parseInt(btn.dataset.preset, 10)];
if (p && selThuong && selHa && selHao) {
selThuong.value = p.thuong;
selHa.value = p.ha;
selHao.value = p.hao;
cast();
}
});
});
const CELL4 = 64, ORIGIN4 = 6;
function cellCenter4(r, c) { return [ORIGIN4 + c * CELL4 + CELL4 / 2, ORIGIN4 + r * CELL4 + CELL4 / 2]; }
function renderSinhThanhGrid(svgId, highlightCoord) {
const svg = host.querySelector('#' + svgId);
if (!svg) return;
svg.innerHTML = "";
const size = ORIGIN4 * 2 + CELL4 * 4;
svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
for (let i = 0; i <= 4; i++) {
svg.appendChild(svgEl("line", { x1: ORIGIN4, y1: ORIGIN4 + i*CELL4, x2: ORIGIN4 + 4*CELL4, y2: ORIGIN4 + i*CELL4, stroke: "var(--line-strong)", "stroke-width": 1 }));
svg.appendChild(svgEl("line", { x1: ORIGIN4 + i*CELL4, y1: ORIGIN4, x2: ORIGIN4 + i*CELL4, y2: ORIGIN4 + 4*CELL4, stroke: "var(--line-strong)", "stroke-width": 1 }));
}
const gold = getComputedStyle(document.documentElement).getPropertyValue('--gold').trim();
[[1,1],[1,2],[2,1],[2,2]].forEach(([r,c]) => {
const [cx, cy] = cellCenter4(r, c);
svg.appendChild(svgEl("rect", { x: cx - CELL4/2 + 3, y: cy - CELL4/2 + 3, width: CELL4 - 6, height: CELL4 - 6, fill: "none", stroke: "var(--paper-faint)", "stroke-width": 1, "stroke-dasharray": "3,3", rx: 2 }));
});
for (const [chi, [r, c]] of Object.entries(DIA_CHI_COORD_MAP)) {
const val = SINH_THANH_TABLE[r][c];
const [cx, cy] = cellCenter4(r, c);
const isHl = highlightCoord && highlightCoord[0] === r && highlightCoord[1] === c;
if (isHl) {
svg.appendChild(svgEl("rect", { x: cx - CELL4/2 + 3, y: cy - CELL4/2 + 3, width: CELL4 - 6, height: CELL4 - 6, fill: gold, opacity: 0.2, stroke: gold, "stroke-width": 1.6, rx: 2 }));
}
const t1 = svgEl("text", { x: cx, y: cy - 10, "text-anchor": "middle", "dominant-baseline": "middle", fill: isHl ? "var(--paper)" : "var(--paper-dim)", "font-size": 11.5, "font-weight": 500 });
t1.textContent = chi;
svg.appendChild(t1);
const t2 = svgEl("text", { x: cx, y: cy + 12, "text-anchor": "middle", "dominant-baseline": "middle", fill: isHl ? gold : "var(--paper-faint)", "font-size": 15, "font-weight": 600 });
t2.textContent = val;
svg.appendChild(t2);
}
}
const CELL3 = 68, ORIGIN3 = 8;
function cellCenter3(r, c) { return [ORIGIN3 + c * CELL3 + CELL3 / 2, ORIGIN3 + r * CELL3 + CELL3 / 2]; }
function getMatrixPath(rawDisplay) {
const coords = {};
for (let r = 0; r < 3; r++) {
for (let c = 0; c < 3; c++) {
coords[rawDisplay[r][c]] = [r, c];
}
}
const path = [];
for (let n = 1; n <= 9; n++) {
if (coords[n]) path.push(coords[n]);
}
return path;
}
function drawArrowSegment(arrowLayer, svgId, fromCoord, toCoord, color, animate = false, dashed = false) {
if (!arrowLayer || !fromCoord || !toCoord) return;
const [x1, y1] = cellCenter3(fromCoord[0], fromCoord[1]);
const [x2, y2] = cellCenter3(toCoord[0], toCoord[1]);
const dx = x2 - x1, dy = y2 - y1;
const len = Math.hypot(dx, dy) || 1;
const shrink = 15;
const ux = dx / len, uy = dy / len;
const sx = x1 + ux * shrink, sy = y1 + uy * shrink;
const ex = x2 - ux * shrink, ey = y2 - uy * shrink;
const lineAttrs = {
x1: sx, y1: sy,
x2: ex, y2: ey,
stroke: color,
"stroke-width": 2.2,
"stroke-linecap": "round",
"marker-end": `url(#${svgId}-arrow)`,
opacity: dashed ? 0.6 : 0.85
};
if (dashed) {
lineAttrs["stroke-dasharray"] = "4,4";
}
const line = svgEl("line", lineAttrs);
if (animate) {
const segLen = Math.hypot(ex - sx, ey - sy);
line.setAttribute("stroke-dasharray", dashed ? "4,4" : segLen);
if (!dashed) {
line.setAttribute("stroke-dashoffset", segLen);
arrowLayer.appendChild(line);
requestAnimationFrame(() => {
line.style.transition = "stroke-dashoffset 240ms ease";
line.setAttribute("stroke-dashoffset", "0");
});
} else {
arrowLayer.appendChild(line);
}
} else {
arrowLayer.appendChild(line);
}
}
function drawStaticArrows(arrowLayer, svgId, path, color, loopDashed = true) {
if (!arrowLayer || !path || path.length < 2) return;
arrowLayer.innerHTML = "";
for (let i = 1; i < path.length; i++) {
drawArrowSegment(arrowLayer, svgId, path[i - 1], path[i], color, false, false);
}
if (loopDashed && path.length > 1) {
drawArrowSegment(arrowLayer, svgId, path[path.length - 1], path[0], color, false, true);
}
}
function flashCell(fxLayer, coord, color, holdMs) {
if (!fxLayer || !coord) return;
const [cx, cy] = cellCenter3(coord[0], coord[1]);
const rect = svgEl("rect", {
x: cx - CELL3 / 2 + 4,
y: cy - CELL3 / 2 + 4,
width: CELL3 - 8,
height: CELL3 - 8,
rx: 4,
fill: color,
opacity: 0
});
fxLayer.appendChild(rect);
rect.style.transition = "opacity 90ms ease";
requestAnimationFrame(() => { rect.style.opacity = 0.38; });
setTimeout(() => {
rect.style.opacity = 0;
setTimeout(() => rect.remove(), 220);
}, Math.max(holdMs - 90, 40));
}
function playSteps(state, stepMs, btn, showArrows) {
if (!state || !state.path || state.path.length === 0) return;
const { fxLayer, arrowLayer, path, color, svgId } = state;
if (btn) btn.disabled = true;
arrowLayer.innerHTML = "";
path.forEach((coord, i) => {
setTimeout(() => {
flashCell(fxLayer, coord, color, stepMs);
if (showArrows && i > 0) {
drawArrowSegment(arrowLayer, svgId, path[i - 1], coord, color, true, false);
}
if (showArrows && i === path.length - 1 && path.length > 1) {
setTimeout(() => {
drawArrowSegment(arrowLayer, svgId, path[path.length - 1], path[0], color, true, true);
}, 120);
}
}, i * stepMs);
});
const totalMs = path.length * stepMs + 250;
setTimeout(() => {
if (btn) btn.disabled = false;
}, totalMs);
}
function renderMatrixGrid(svgId, matrixDisplay, rawDisplay, opts) {
opts = opts || {};
const svg = host.querySelector('#' + svgId);
if (!svg) return null;
svg.innerHTML = "";
const size = ORIGIN3 * 2 + CELL3 * 3;
svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
const color = opts.color || getComputedStyle(document.documentElement).getPropertyValue('--gold').trim();
const defs = svgEl("defs", {});
const marker = svgEl("marker", { id: svgId + "-arrow", markerWidth: 8, markerHeight: 8, refX: 6, refY: 3, orient: "auto", markerUnits: "strokeWidth" });
marker.appendChild(svgEl("path", { d: "M0,0 L6,3 L0,6 Z", fill: color }));
defs.appendChild(marker);
svg.appendChild(defs);
for (let i = 0; i <= 3; i++) {
svg.appendChild(svgEl("line", { x1: ORIGIN3, y1: ORIGIN3 + i*CELL3, x2: ORIGIN3 + 3*CELL3, y2: ORIGIN3 + i*CELL3, stroke: "var(--line-strong)", "stroke-width": 1 }));
svg.appendChild(svgEl("line", { x1: ORIGIN3 + i*CELL3, y1: ORIGIN3, x2: ORIGIN3 + i*CELL3, y2: ORIGIN3 + 3*CELL3, stroke: "var(--line-strong)", "stroke-width": 1 }));
}
const fxLayer = svgEl("g", { class: "fx-layer" });
svg.appendChild(fxLayer);
for (let r = 0; r < 3; r++) {
for (let c = 0; c < 3; c++) {
const isCenter = (r === 1 && c === 1);
const [cx, cy] = cellCenter3(r, c);
if (isCenter) {
svg.appendChild(svgEl("rect", { x: cx - CELL3/2 + 4, y: cy - CELL3/2 + 4, width: CELL3 - 8, height: CELL3 - 8, fill: color, opacity: 0.16, stroke: color, "stroke-width": 1.5, rx: 3 }));
}
const t = svgEl("text", { x: cx, y: cy, "text-anchor": "middle", "dominant-baseline": "middle", fill: isCenter ? color : "var(--paper)", "font-size": 19, "font-weight": isCenter ? 700 : 500 });
t.textContent = matrixDisplay[r][c];
svg.appendChild(t);
}
}
const arrowLayer = svgEl("g", { class: "arrow-layer" });
svg.appendChild(arrowLayer);
const path = getMatrixPath(rawDisplay);
if (opts.showPath && path.length > 1) {
drawStaticArrows(arrowLayer, svgId, path, color, true);
}
return { svg, fxLayer, arrowLayer, path, color, svgId };
}
let matSinhThanhSteps = null;
let thuongSteps = null;
let haSteps = null;
function cast() {
if (!selThuong || !selHa || !selHao) return;
const quatThuong = selThuong.value;
const quaHa = selHa.value;
const haoDong = parseInt(selHao.value, 10);
const showArrows = arrowToggle ? arrowToggle.checked : true;
const errorBox = host.querySelector('#error-msg');
const result = host.querySelector('#result');
let r;
try {
r = calculateMaPhuong(quatThuong, quaHa, haoDong);
} catch (e) {
if (result) result.style.display = 'none';
if (errorBox) {
errorBox.style.display = 'block';
errorBox.textContent = 'L\u1ed7i: ' + e.message;
}
return;
}
if (errorBox) errorBox.style.display = 'none';
if (result) result.style.display = 'block';
const goldColor = getComputedStyle(document.documentElement).getPropertyValue('--gold').trim() || '#c19a4b';
const jadeColor = getComputedStyle(document.documentElement).getPropertyValue('--jade').trim() || '#3ea87a';
const guaLabel = (haoDong >= 1 && haoDong <= 3) ? 'Qu\u1ebb H\u1ea1' : 'Qu\u1ebb Th\u01b0\u1ee3ng';
const napDesc = host.querySelector('#napchi-desc');
if (napDesc) {
napDesc.innerHTML = `Hào Động <b>${haoDong}</b> thuộc <b>${guaLabel}</b> (Hào 1–3 tra Quẻ Hạ, Hào 4–6 tra Quẻ Thượng) → dùng quẻ <b>${r.guaForNapChi}</b> để tra Nạp Chi.`;
}
const napTable = host.querySelector('#napchi-table');
if (napTable) {
const napRow = NAP_CHI_DATA[r.guaForNapChi];
let napHtml = '<tr><th>H\u00e0o</th>' + [1,2,3,4,5,6].map(h => `<th>${h}</th>`).join('') + '</tr>';
napHtml += '<tr class="name-row"><td class="name-cell">' + r.guaForNapChi + '</td>' +
[1,2,3,4,5,6].map(h => `<td${h === haoDong ? ' class="hl"' : ''}>${napRow[h]}</td>`).join('') + '</tr>';
napTable.innerHTML = napHtml;
}
const napDiaChi = host.querySelector('#napchi-diachi');
if (napDiaChi) napDiaChi.textContent = r.diaChi;
const napTag = host.querySelector('#napchi-tag');
if (napTag) napTag.textContent = `Địa chi của Hào ${haoDong}`;
const napSteps = host.querySelector('#napchi-steps');
if (napSteps) {
napSteps.innerHTML = `
<b>Chi tiết Bước 1 — Nạp Chi:</b><br>
1. Quẻ Thượng = <b>${quatThuong}</b>, Quẻ Hạ = <b>${quaHa}</b>, Hào Động = <b>${haoDong}</b><br>
2. Hào ${haoDong} thuộc khoảng ${haoDong <= 3 ? '1–3 (Quẻ Hạ)' : '4–6 (Quẻ Thượng)'} → dùng quẻ <b>${r.guaForNapChi}</b><br>
3. Tra bảng Nạp Chi[${r.guaForNapChi}][${haoDong}] = <b>${r.diaChi}</b>
`;
}
renderSinhThanhGrid('svg-sinhthanh', r.coord);
const stDesc = host.querySelector('#sinhthanh-desc');
if (stDesc) {
stDesc.innerHTML = `Địa chi <b>${r.diaChi}</b> nằm ở tọa độ [${r.coord[0]}, ${r.coord[1]}] trong bảng Sinh Thành. Tâm bảng (2×2 giữa) không dùng.`;
}
const stCap = host.querySelector('#sinhthanh-caption');
if (stCap) stCap.textContent = `Tọa độ: [${r.coord[0]}, ${r.coord[1]}]`;
const stTag = host.querySelector('#sinhthanh-tag');
if (stTag) stTag.textContent = `Giá trị Sinh Thành = ${r.sinhThanhValue}`;
const stSteps = host.querySelector('#st-steps');
if (stSteps) {
stSteps.innerHTML = `
<b>Chi tiết Bước 2 — Sinh Thành:</b><br>
1. Địa chi <b>${r.diaChi}</b> → tọa độ [${r.coord[0]}, ${r.coord[1]}]<br>
2. Bảng Sinh-Thành[${r.coord[0]}][${r.coord[1]}] = <b>${r.sinhThanhValue}</b>
`;
}
const hi = r.hoInfo;
let hoFormula;
if (hi.nhanhTinh === 'odd') {
hoFormula = `Tổng = ${hi.soTienThienThuong} + ${hi.soTienThienHa} = <b>${hi.total}</b> (lẻ) → Họ = quẻ có số Tiên Thiên (9 − ${hi.soTienThienHa}) = <b>${9 - hi.soTienThienHa}</b> → <b>${hi.hoCuaQue}</b>`;
} else {
const thuongLoai = CUNG_NGHI_GUAS.has(quatThuong) ? 'C\u00f9ng Nghi' : 'Kh\u00e1c Nghi';
const haLoai = CUNG_NGHI_GUAS.has(quaHa) ? 'C\u00f9ng Nghi' : 'Kh\u00e1c Nghi';
const sameGroup = thuongLoai === haLoai;
hoFormula = `Tổng = ${hi.soTienThienThuong} + ${hi.soTienThienHa} = <b>${hi.total}</b> (chẵn) → Quẻ Thượng thuộc ${thuongLoai}, Quẻ Hạ thuộc ${haLoai} → ${sameGroup ? 'cùng nhóm' : 'khác nhóm'} → Họ = <b>${sameGroup ? 'Quẻ Hạ' : 'Quẻ Thượng'}</b> = <b>${hi.hoCuaQue}</b>`;
}
const hoDesc = host.querySelector('#ho-desc');
if (hoDesc) {
hoDesc.innerHTML = `Số Tiên Thiên: ${quatThuong} = <b>${hi.soTienThienThuong}</b>, ${quaHa} = <b>${hi.soTienThienHa}</b>. ${hoFormula}`;
}
const hoSym = host.querySelector('#ho-symbol');
if (hoSym) hoSym.textContent = TRIGRAM_SYMBOL[hi.hoCuaQue];
const hoName = host.querySelector('#ho-name');
if (hoName) hoName.textContent = hi.hoCuaQue;
const hoTag = host.querySelector('#ho-tag');
if (hoTag) hoTag.textContent = 'H\u1ecd c\u1ee7a qu\u1ebb';
const hoSteps = host.querySelector('#ho-steps');
if (hoSteps) {
hoSteps.innerHTML = `
<b>Chi tiết Bước 3 — Họ của quẻ:</b><br>
1. Số Tiên Thiên: ${quatThuong}=<b>${hi.soTienThienThuong}</b>, ${quaHa}=<b>${hi.soTienThienHa}</b><br>
2. Tổng = <b>${hi.total}</b> (${hi.nhanhTinh === 'odd' ? 'lẻ' : 'chẵn'})<br>
3. ${hoFormula}
`;
}
const displaySinhThanh = reversedRows(r.matrixSinhThanh);
const rawDisplaySinhThanh = reversedRows(r.rawSinhThanh);
matSinhThanhSteps = renderMatrixGrid('svg-matsinhthanh', displaySinhThanh, rawDisplaySinhThanh, { color: goldColor, showPath: showArrows });
const matstDesc = host.querySelector('#matsinhthanh-desc');
if (matstDesc) {
matstDesc.innerHTML = `Ma trận Phi Tinh của quẻ <b>${r.hoCuaQue}</b> với trung cung = <b>${r.sinhThanhValue}</b> (flying_star_matrix). Ma trận này là gốc để tra trung cung cho Quẻ Thượng và Quẻ Hạ qua bản đồ Lạc Thư.`;
}
const matstCap = host.querySelector('#matsinhthanh-caption');
if (matstCap) matstCap.textContent = `Họ của quẻ: ${r.hoCuaQue} · Trung cung: ${r.sinhThanhValue}`;
const displayThuong = reversedRows(r.matrixQueThuong);
const rawDisplayThuong = reversedRows(r.rawQueThuong);
thuongSteps = renderMatrixGrid('svg-thuong', displayThuong, rawDisplayThuong, { color: goldColor, showPath: showArrows });
const thuongTitle = host.querySelector('#thuong-title');
if (thuongTitle) thuongTitle.textContent = `Ma trận Quẻ Thượng — ${quatThuong}`;
const thuongDesc = host.querySelector('#thuong-desc');
if (thuongDesc) {
thuongDesc.innerHTML = `Vị trí <b>${quatThuong}</b> trong Lạc Thư: [${r.posThuong[0]}, ${r.posThuong[1]}] → trung cung = Ma trận Sinh Thành[${2 - r.posThuong[0]}][${r.posThuong[1]}] = <b>${r.centerThuong}</b>. Các ô có giá trị 5 (nếu có) được thay bằng trung cung.`;
}
const thuongCap = host.querySelector('#thuong-caption');
if (thuongCap) thuongCap.textContent = `Trung cung: ${r.centerThuong}`;
const displayHa = reversedRows(r.matrixQueHa);
const rawDisplayHa = reversedRows(r.rawQueHa);
haSteps = renderMatrixGrid('svg-ha', displayHa, rawDisplayHa, { color: jadeColor, showPath: showArrows });
const haTitle = host.querySelector('#ha-title');
if (haTitle) haTitle.textContent = `Ma trận Quẻ Hạ — ${quaHa}`;
const haDesc = host.querySelector('#ha-desc');
if (haDesc) {
haDesc.innerHTML = `Vị trí <b>${quaHa}</b> trong Lạc Thư: [${r.posHa[0]}, ${r.posHa[1]}] → trung cung = Ma trận Sinh Thành[${2 - r.posHa[0]}][${r.posHa[1]}] = <b>${r.centerHa}</b>. Các ô có giá trị 5 (nếu có) được thay bằng trung cung.`;
}
const haCap = host.querySelector('#ha-caption');
if (haCap) haCap.textContent = `Trung cung: ${r.centerHa}`;
const finalGrid = host.querySelector('#final-grid');
if (finalGrid) {
finalGrid.innerHTML = '';
const displayFinal = reversedRows(r.finalMagicSquare);
for (let rr = 0; rr < 3; rr++) {
for (let cc = 0; cc < 3; cc++) {
const cell = document.createElement('div');
const val = displayFinal[rr][cc];
cell.className = 'final-cell' + (val === 'null' ? ' center' : '');
cell.textContent = val;
finalGrid.appendChild(cell);
}
}
}
const stepsBody = host.querySelector('#steps-body');
if (stepsBody) {
stepsBody.innerHTML = `
- Quẻ Thượng: <b>${quatThuong}</b> · Quẻ Hạ: <b>${quaHa}</b> · Hào Động: <b>${haoDong}</b><br>
- Quẻ tra Nạp Chi: <b>${r.guaForNapChi}</b> → Địa chi: <b>${r.diaChi}</b><br>
- Tọa độ Địa chi: [${r.coord[0]}, ${r.coord[1]}] → Giá trị Sinh Thành: <b>${r.sinhThanhValue}</b><br>
- Họ của quẻ: <b>${r.hoCuaQue}</b> (Tổng Tiên Thiên = ${hi.total}, ${hi.nhanhTinh === 'odd' ? 'lẻ' : 'chẵn'})<br>
- Ma trận Sinh Thành (${r.hoCuaQue}, trung cung ${r.sinhThanhValue}): ${JSON.stringify(displaySinhThanh)}<br>
- Ma trận Quẻ Thượng (${quatThuong}, trung cung ${r.centerThuong}): ${JSON.stringify(displayThuong)}<br>
- Ma trận Quẻ Hạ (${quaHa}, trung cung ${r.centerHa}): ${JSON.stringify(displayHa)}<br>
- Ma phương hoàn chỉnh: ${JSON.stringify(reversedRows(r.finalMagicSquare))}
`;
}
const inputEcho = host.querySelector('#input-echo');
if (inputEcho) {
inputEcho.textContent = `Quẻ Thượng ${quatThuong} · Quẻ Hạ ${quaHa} · Hào Động ${haoDong}`;
}
}
const castBtn = host.querySelector('#cast-btn');
if (castBtn) castBtn.addEventListener('click', cast);
if (arrowToggle) {
arrowToggle.addEventListener('change', () => {
const res = host.querySelector('#result');
if (res && res.style.display === 'block') cast();
});
}
const btnStepsMatSinhThanh = host.querySelector('#steps-btn-matsinhthanh');
if (btnStepsMatSinhThanh) {
btnStepsMatSinhThanh.addEventListener('click', () => {
const show = arrowToggle ? arrowToggle.checked : true;
playSteps(matSinhThanhSteps, 280, btnStepsMatSinhThanh, show);
});
}
const btnStepsThuong = host.querySelector('#steps-btn-thuong');
if (btnStepsThuong) {
btnStepsThuong.addEventListener('click', () => {
const show = arrowToggle ? arrowToggle.checked : true;
playSteps(thuongSteps, 280, btnStepsThuong, show);
});
}
const btnStepsHa = host.querySelector('#steps-btn-ha');
if (btnStepsHa) {
btnStepsHa.addEventListener('click', () => {
const show = arrowToggle ? arrowToggle.checked : true;
playSteps(haSteps, 280, btnStepsHa, show);
});
}
if (selThuong) selThuong.value = 'C\u00e0n';
if (selHa) selHa.value = 'Kh\u00f4n';
if (selHao) selHao.value = '1';
if (typeof cast === 'function') {
window.cast = cast;
window.__KD_CAST = cast;
} else {
window.__KD_CAST = function() {};
}
};