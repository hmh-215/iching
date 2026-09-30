(function() {
'use strict';
window.KD_CORE = window.KD_CORE || {};
const SVG_NS = "http://www.w3.org/2000/svg";
const KD_GRID = {
svgEl(tag, attrs) {
const el = document.createElementNS(SVG_NS, tag);
if (attrs) {
for (const [k, v] of Object.entries(attrs)) {
el.setAttribute(k, v);
}
}
return el;
},
cellCenter(r, c, cellSize = 64, gapOrigin = 6) {
return {
x: gapOrigin + c * (cellSize + gapOrigin) + cellSize / 2,
y: gapOrigin + r * (cellSize + gapOrigin) + cellSize / 2
};
},
renderBars(container, binaryStr, activeHao = 0, options = {}) {
const el = typeof container === 'string' ? document.getElementById(container) : container;
if (!el || !binaryStr) return;
el.innerHTML = '';
const totalHao = binaryStr.length;
const showIndex = options.showIndex !== false;
for (let hao = totalHao; hao >= 1; hao--) {
const bit = binaryStr[hao - 1];
const isDynamic = hao === activeHao;
const row = document.createElement('div');
let rowClass = 'bar-row ';
if (totalHao === 6) {
rowClass += (hao >= 4 ? 'thuong' : 'ha');
} else {
rowClass += (options.rowClass || 'ha');
}
if (isDynamic) rowClass += ' dynamic';
row.className = rowClass;
if (showIndex) {
const idxLabel = document.createElement('span');
idxLabel.className = 'bar-idx';
idxLabel.textContent = hao;
row.appendChild(idxLabel);
}
const track = document.createElement('div');
track.className = 'bar-track';
if (bit === '1') {
const seg = document.createElement('div');
seg.className = 'bar-seg';
track.appendChild(seg);
} else {
const seg1 = document.createElement('div');
seg1.className = 'bar-seg';
const seg2 = document.createElement('div');
seg2.className = 'bar-seg';
track.appendChild(seg1);
track.appendChild(seg2);
}
row.appendChild(track);
el.appendChild(row);
}
},
ensureArrowMarker(svg, markerId, color = "var(--gold)") {
let defs = svg.querySelector('defs');
if (!defs) {
defs = KD_GRID.svgEl('defs');
svg.insertBefore(defs, svg.firstChild);
}
if (!svg.querySelector(`#${markerId}`)) {
const marker = KD_GRID.svgEl('marker', {
id: markerId,
viewBox: "0 0 10 10",
refX: "6", refY: "3",
markerWidth: "6", markerHeight: "6",
orient: "auto"
});
const path = KD_GRID.svgEl('path', {
d: "M 0 0 L 6 3 L 0 6 z",
fill: color
});
marker.appendChild(path);
defs.appendChild(marker);
}
},
highlightCell(svg, r, c, color, cellSize = 64, gap = 6) {
if (!svg || r < 0 || c < 0) return;
const x = gap + c * (cellSize + gap);
const y = gap + r * (cellSize + gap);
const rect = KD_GRID.svgEl('rect', {
x, y,
width: cellSize, height: cellSize,
rx: 4, ry: 4,
fill: "none",
stroke: color,
"stroke-width": 2,
opacity: 0.95
});
svg.appendChild(rect);
},
drawPathAnimated(svg, svgId, path, color, showArrows = true, cellSize = 64, gap = 6) {
if (!svg || !path || path.length < 2) return;
const markerId = `${svgId}-arrow`;
if (showArrows) {
KD_GRID.ensureArrowMarker(svg, markerId, color);
}
for (let i = 0; i < path.length - 1; i++) {
const p1 = KD_GRID.cellCenter(path[i][0], path[i][1], cellSize, gap);
const p2 = KD_GRID.cellCenter(path[i + 1][0], path[i + 1][1], cellSize, gap);
const line = KD_GRID.svgEl('line', {
x1: p1.x, y1: p1.y,
x2: p2.x, y2: p2.y,
stroke: color,
"stroke-width": 2,
"stroke-dasharray": "4 3",
opacity: 0.8
});
if (showArrows) {
line.setAttribute("marker-end", `url(#${markerId})`);
}
svg.appendChild(line);
}
}
};
window.KD_CORE.GRID = KD_GRID;
window.KD_GRID = KD_GRID;
})();