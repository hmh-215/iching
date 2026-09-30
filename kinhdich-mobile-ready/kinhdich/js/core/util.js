(function() {
'use strict';
window.KD_CORE = window.KD_CORE || {};
const KD_UTIL = {
mod(n, m) {
return ((n % m) + m) % m;
},
coordEq(a, b) {
if (!a || !b) return false;
return a[0] === b[0] && a[1] === b[1];
},
indexOfCoord(path, coord) {
if (!path || !coord) return -1;
for (let i = 0; i < path.length; i++) {
if (KD_UTIL.coordEq(path[i], coord)) return i;
}
return -1;
},
findInMatrix(val, matrix) {
if (!matrix) return null;
for (let r = 0; r < matrix.length; r++) {
for (let c = 0; c < matrix[r].length; c++) {
if (matrix[r][c] === val) return [r, c];
}
}
return null;
},
norm(str) {
if (!str) return '';
return String(str)
.toLowerCase()
.normalize('NFD')
.replace(/[\u0300-\u036f]/g, '')
.replace(/đ/g, 'd')
.trim();
},
toggleStepBox(id) {
const box = document.getElementById(id);
if (box) box.classList.toggle('open');
},
initAccordion(container) {
if (!container) return;
container.addEventListener('toggle', function(e) {
if (e.target.tagName !== 'DETAILS' || !e.target.open) return;
const details = container.querySelectorAll('details[open]');
details.forEach(d => {
if (d !== e.target) d.open = false;
});
}, true);
}
};
window.KD_CORE.UTIL = KD_UTIL;
window.KD_UTIL = KD_UTIL;
})();