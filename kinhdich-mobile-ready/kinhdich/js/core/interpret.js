(function() {
'use strict';
const CACHE = {
luan64: null,
khiClndd: null,
bienKhi: null
};
const ELEMENT_CODE = {
'Thi\u00ean': '111', 'C\u00e0n': '111',
'Tr\u1ea1ch': '110', '\u0110o\u00e0i': '110',
'H\u1ecfa':   '101', 'Ly':   '101',
'L\u00f4i':   '100', 'Ch\u1ea5n': '100',
'Phong': '011', 'T\u1ed1n':  '011',
'Th\u1ee7y':  '010', 'Kh\u1ea3m': '010',
'S\u01a1n':   '001', 'C\u1ea5n':  '001',
'\u0110\u1ecba':   '000', 'Kh\u00f4n': '000'
};
const CODE_SYMBOL = {
'111': '\u2630', '110': '\u2631', '101': '\u2632', '100': '\u2633',
'011': '\u2634', '010': '\u2635', '001': '\u2636', '000': '\u2637'
};
const norm = s => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').trim();
function fetchJSON(url) {
if (window.KD_INLINE && window.KD_INLINE[url]) {
try {
return Promise.resolve(typeof window.KD_INLINE[url] === 'string' ? JSON.parse(window.KD_INLINE[url]) : window.KD_INLINE[url]);
} catch (e) {
return Promise.reject(e);
}
}
return fetch(url).then(r => {
if (!r.ok) throw new Error('Kh\u00f4ng t\u1ea3i \u0111\u01b0\u1ee3c ' + url);
return r.json();
});
}
async function getLuan64() {
if (!CACHE.luan64) {
try {
CACHE.luan64 = await fetchJSON('data/luan64.json');
} catch (e) {
console.warn('L\u1ed7i n\u1ea1p luan64.json:', e);
CACHE.luan64 = [];
}
}
return CACHE.luan64;
}
async function getKhiClndd() {
if (!CACHE.khiClndd) {
try {
CACHE.khiClndd = await fetchJSON('data/khi_clndd.json');
} catch (e) {
console.warn('L\u1ed7i n\u1ea1p khi_clndd.json:', e);
CACHE.khiClndd = [];
}
}
return CACHE.khiClndd;
}
async function getBienKhi() {
if (!CACHE.bienKhi) {
try {
CACHE.bienKhi = await fetchJSON('data/bienkhi.json');
} catch (e) {
console.warn('L\u1ed7i n\u1ea1p bienkhi.json:', e);
CACHE.bienKhi = [];
}
}
return CACHE.bienKhi;
}
function nameToBinary(fullName) {
if (!fullName) return null;
const clean = fullName.replace(/\(.*?\)/g, '').trim();
const words = clean.split(/\s+/);
if (words.length < 2) return null;
if (words[0] === 'Thu\u1ea7n') {
const code = ELEMENT_CODE[words[1]];
return code ? code + code : null;
}
const upper = ELEMENT_CODE[words[0]];
const lower = ELEMENT_CODE[words[1]];
if (!upper || !lower) return null;
return lower + upper;
}
function renderMiniBars(container, binary6) {
container.innerHTML = '';
for (let hao = 6; hao >= 1; hao--) {
const bit = binary6[hao - 1];
const row = document.createElement('div');
row.className = 'bar-row ' + (hao >= 4 ? 'thuong' : 'ha');
const track = document.createElement('div');
track.className = 'bar-track';
if (bit === '1') {
const seg = document.createElement('div');
seg.className = 'bar-seg';
track.appendChild(seg);
} else {
const seg1 = document.createElement('div'); seg1.className = 'bar-seg';
const seg2 = document.createElement('div'); seg2.className = 'bar-seg';
track.appendChild(seg1);
track.appendChild(seg2);
}
row.appendChild(track);
container.appendChild(row);
}
}
function buildHexagramMini(binary6) {
const wrap = document.createElement('div');
wrap.className = 'hexagram-mini';
const bars = document.createElement('div');
bars.className = 'bars';
renderMiniBars(bars, binary6);
wrap.appendChild(bars);
const info = document.createElement('div');
info.className = 'hexagram-mini-info';
const lowerCode = binary6.slice(0, 3);
const upperCode = binary6.slice(3, 6);
const symbols = document.createElement('span');
symbols.className = 'mini-symbols';
symbols.textContent = (CODE_SYMBOL[upperCode] || '') + (CODE_SYMBOL[lowerCode] || '');
const bin = document.createElement('span');
bin.className = 'mini-binary';
bin.textContent = binary6;
info.appendChild(symbols);
info.appendChild(bin);
wrap.appendChild(info);
return wrap;
}
let activePopup = null;
let activeAnchor = null;
function closeAllPopups() {
document.querySelectorAll('.kd-interp-card').forEach(c => c.remove());
document.querySelectorAll('.hexagram-card').forEach(c => {
if (c.style.display === 'none') {
c.style.display = '';
}
});
activePopup = null;
activeAnchor = null;
}
document.addEventListener('keydown', function(ev) {
if (ev.key === 'Escape' || ev.key === 'Esc') {
if (activePopup) {
closeAllPopups();
}
}
});
async function showHexInterpretation(hexQuery, anchorEl) {
if (!hexQuery || !anchorEl) return;
if (activeAnchor === anchorEl && activePopup) {
closeAllPopups();
return;
}
closeAllPopups();
const list = await getLuan64();
let q = null;
if (typeof hexQuery === 'number') {
q = list.find(x => x.num === hexQuery);
} else if (typeof hexQuery === 'string') {
let clean = hexQuery
.replace(/^[0-9]+[\.\s\-:]+/g, '')
.replace(/[\u2630-\u2637]/g, '')
.replace(/\(.*?\)/g, '')
.trim();
const EXACT_MAP = {
'c\u00e0n': 'Thu\u1ea7n C\u00e0n',
'c\u00e0n vi thi\u00ean': 'Thu\u1ea7n C\u00e0n',
'kh\u00f4n': 'Thu\u1ea7n Kh\u00f4n',
'kh\u00f4n vi \u0111\u1ecba': 'Thu\u1ea7n Kh\u00f4n',
'kh\u1ea3m': 'Thu\u1ea7n Kh\u1ea3m',
'kh\u1ea3m vi th\u1ee7y': 'Thu\u1ea7n Kh\u1ea3m',
'kh\u1ea3m vi thu\u1ef7': 'Thu\u1ea7n Kh\u1ea3m',
'ly': 'Thu\u1ea7n Ly',
'ly vi h\u1ecfa': 'Thu\u1ea7n Ly',
'ly vi ho\u1ea3': 'Thu\u1ea7n Ly',
'ch\u1ea5n': 'Thu\u1ea7n Ch\u1ea5n',
'ch\u1ea5n vi l\u00f4i': 'Thu\u1ea7n Ch\u1ea5n',
'c\u1ea5n': 'Thu\u1ea7n C\u1ea5n',
'c\u1ea5n vi s\u01a1n': 'Thu\u1ea7n C\u1ea5n',
't\u1ed1n': 'Thu\u1ea7n T\u1ed1n',
't\u1ed1n vi phong': 'Thu\u1ea7n T\u1ed1n',
'\u0111o\u00e0i': 'Thu\u1ea7n \u0110o\u00e0i',
'\u0111o\u00e0i vi tr\u1ea1ch': 'Thu\u1ea7n \u0110o\u00e0i'
};
const lowerClean = clean.toLowerCase();
if (EXACT_MAP[lowerClean]) {
clean = EXACT_MAP[lowerClean];
}
q = list.find(x => x.name.trim().toLowerCase() === clean.toLowerCase());
if (!q) {
const clLower = clean.toLowerCase();
q = list.find(x => {
const nl = x.name.trim().toLowerCase();
return nl.includes(clLower) || clLower.includes(nl);
});
}
if (!q) {
const isCan1 = /càn/i.test(clean);
const isCan2 = /cấn/i.test(clean);
const qNorm = norm(clean);
q = list.find(x => {
if (isCan1 && !/càn/i.test(x.name)) return false;
if (isCan2 && !/cấn/i.test(x.name)) return false;
const xNorm = norm(x.name);
return xNorm === qNorm || xNorm.includes(qNorm) || qNorm.includes(xNorm);
});
}
if (!q && /^[01]{6}$/.test(hexQuery)) {
q = list.find(x => nameToBinary(x.name) === hexQuery);
}
} else if (hexQuery && typeof hexQuery === 'object') {
if (hexQuery.num) q = list.find(x => x.num === hexQuery.num);
if (!q && hexQuery.name) {
return showHexInterpretation(hexQuery.name, anchorEl);
}
if (!q && hexQuery.binary) {
q = list.find(x => nameToBinary(x.name) === hexQuery.binary);
}
}
if (!q) {
console.warn('Kh\u00f4ng t\u00ecm th\u1ea5y qu\u1ebb trong data/luan64.json:', hexQuery);
return;
}
const binary = nameToBinary(q.name) || '111111';
const card = document.createElement('div');
card.className = 'kd-interp-card';
const header = document.createElement('div');
header.className = 'kd-interp-header';
const titleBox = document.createElement('div');
titleBox.className = 'kd-interp-title';
titleBox.innerHTML = `<strong>${q.name} (${q.num})</strong> ${q.tail ? '— ' + q.tail : ''} ${q.group ? '<span class="badge-cat">' + q.group + '</span>' : ''}`;
const closeBtn = document.createElement('button');
closeBtn.type = 'button';
closeBtn.className = 'kd-interp-close';
closeBtn.innerHTML = '<span style="font-weight:700;font-size:14px;line-height:1;">\u2715</span><span>\u0110\u00f3ng</span>';
closeBtn.title = '\u0110\u00f3ng lu\u1eadn gi\u1ea3i (Esc ho\u1eb7c b\u1ea5m ra ngo\u00e0i)';
closeBtn.addEventListener('click', (ev) => {
ev.stopPropagation();
closeAllPopups();
});
header.appendChild(titleBox);
header.appendChild(closeBtn);
card.appendChild(header);
card.appendChild(buildHexagramMini(binary));
const body = document.createElement('div');
body.className = 'kd-interp-body';
body.innerHTML = q.html || '';
body.querySelectorAll('details').forEach(d => {
d.open = false;
});
card.appendChild(body);
const footer = document.createElement('div');
footer.className = 'kd-interp-footer';
const footerCloseBtn = document.createElement('button');
footerCloseBtn.type = 'button';
footerCloseBtn.className = 'kd-interp-close';
footerCloseBtn.innerHTML = '<span style="font-weight:700;font-size:14px;line-height:1;">\u2715</span><span>\u0110\u00f3ng lu\u1eadn gi\u1ea3i</span>';
footerCloseBtn.title = '\u0110\u00f3ng lu\u1eadn gi\u1ea3i (Esc ho\u1eb7c b\u1ea5m ra ngo\u00e0i)';
footerCloseBtn.addEventListener('click', (ev) => {
ev.stopPropagation();
closeAllPopups();
});
footer.appendChild(footerCloseBtn);
card.appendChild(footer);
if (anchorEl.classList.contains('hexagram-card')) {
anchorEl.parentNode.insertBefore(card, anchorEl.nextSibling);
anchorEl.style.display = 'none';
} else {
anchorEl.parentNode.insertBefore(card, anchorEl.nextSibling);
}
activePopup = card;
activeAnchor = anchorEl;
card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
async function showKhiInterpretation(khiName, anchorEl) {
if (!khiName || !anchorEl) return;
if (activeAnchor === anchorEl && activePopup) {
closeAllPopups();
return;
}
closeAllPopups();
const khiList = await getKhiClndd();
const cleanName = khiName.replace(/^Khí\s+/i, '').replace(/^(Tháng|Ngày|Giờ|Người Dùng)\s*\d*\s*[:·-]?\s*/i, '').trim();
const nameNorm = norm(cleanName);
let found = khiList.find(x => norm(x.name) === nameNorm);
if (!found) {
found = khiList.find(x => norm(x.name).includes(nameNorm) || nameNorm.includes(norm(x.name)));
}
if (!found) {
const bienList = await getBienKhi();
found = bienList.find(x => norm(x.name) === nameNorm || norm(x.name).includes(nameNorm));
}
if (!found) {
console.warn('Kh\u00f4ng t\u00ecm th\u1ea5y gi\u1ea3i th\u00edch kh\u00ed:', khiName);
return;
}
const card = document.createElement('div');
card.className = 'kd-interp-card';
card.setAttribute('data-khi-active', khiName);
const header = document.createElement('div');
header.className = 'kd-interp-header';
const titleBox = document.createElement('div');
titleBox.className = 'kd-interp-title';
titleBox.innerHTML = `<strong>${found.name}</strong> ${found.badge ? '<span class="' + (found.badgeClass || 'badge-cat') + '">' + found.badge + '</span>' : ''}`;
const closeBtn = document.createElement('button');
closeBtn.type = 'button';
closeBtn.className = 'kd-interp-close';
closeBtn.innerHTML = '<span style="font-weight:700;font-size:14px;line-height:1;">\u2715</span><span>\u0110\u00f3ng</span>';
closeBtn.title = '\u0110\u00f3ng lu\u1eadn gi\u1ea3i (Esc ho\u1eb7c b\u1ea5m ra ngo\u00e0i)';
closeBtn.addEventListener('click', (ev) => {
ev.stopPropagation();
closeAllPopups();
});
header.appendChild(titleBox);
header.appendChild(closeBtn);
card.appendChild(header);
const body = document.createElement('div');
body.className = 'kd-interp-body';
body.innerHTML = found.bodyHtml || '';
card.appendChild(body);
const footer = document.createElement('div');
footer.className = 'kd-interp-footer';
const footerCloseBtn = document.createElement('button');
footerCloseBtn.type = 'button';
footerCloseBtn.className = 'kd-interp-close';
footerCloseBtn.innerHTML = '<span style="font-weight:700;font-size:14px;line-height:1;">\u2715</span><span>\u0110\u00f3ng lu\u1eadn gi\u1ea3i</span>';
footerCloseBtn.title = '\u0110\u00f3ng lu\u1eadn gi\u1ea3i (Esc ho\u1eb7c b\u1ea5m ra ngo\u00e0i)';
footerCloseBtn.addEventListener('click', (ev) => {
ev.stopPropagation();
closeAllPopups();
});
footer.appendChild(footerCloseBtn);
card.appendChild(footer);
if (anchorEl.parentNode) {
const grid = anchorEl.closest('.chips-grid') || anchorEl;
grid.parentNode.insertBefore(card, grid.nextSibling);
activePopup = card;
activeAnchor = anchorEl;
card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
}
document.addEventListener('click', function(ev) {
if (ev.target.closest('.kd-interp-card')) return;
const hexCard = ev.target.closest('.hexagram-card');
if (hexCard) {
let titleEl = hexCard.querySelector('.hexagram-card-title, .title, [id$="-title"]');
let name = (titleEl && titleEl.textContent.trim()) || hexCard.getAttribute('data-hex') || '';
if (!name) {
const txt = hexCard.textContent;
const m = txt.match(/([A-ZÀ-Ỹa-zà-ỹ\s]{3,20}\([^\)]+\)|[A-ZÀ-Ỹa-zà-ỹ\s]{4,20})/);
if (m) name = m[1].trim();
}
if (name) {
ev.preventDefault();
showHexInterpretation(name, hexCard);
return;
}
}
const chipEl = ev.target.closest('#t3-chung-chips .chip, #t3-rieng-chips .chip, .chip, [data-khi]');
if (chipEl) {
const labelEl = chipEl.querySelector('.chip-lbl, .label');
const valEl = chipEl.querySelector('.chip-val, .val, .value');
const labelText = labelEl ? labelEl.textContent.trim() : '';
const valText = valEl ? valEl.textContent.trim() : chipEl.textContent.trim();
if (/khí/i.test(labelText) || /khí/i.test(valText) || chipEl.hasAttribute('data-khi')) {
const khiName = valText || labelText;
if (khiName && khiName !== '\u2014') {
ev.preventDefault();
showKhiInterpretation(khiName, chipEl);
return;
}
}
}
if (activePopup) {
closeAllPopups();
}
}, false);
window.kdShowHexInterpretation = showHexInterpretation;
window.kdShowKhiInterpretation = showKhiInterpretation;
window.kdCloseAllPopups = closeAllPopups;
window.kdGetLuan64 = getLuan64;
window.kdGetKhiClndd = getKhiClndd;
})();