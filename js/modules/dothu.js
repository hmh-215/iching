/* =========================================================================
 * MODULE: Đồ Thư Phi Bàn Độn (dothu.js)
 * Chuẩn 1:1 từ html_css_modules/01-que_do_thu.html
 * ========================================================================= */

window.KD_MOD = window.KD_MOD || {};
window.KD_MOD["dothu"] = function() {
  const host = document.querySelector('.kd-mod[data-mod="dothu"]');
  if (!host) return;

  /* =========================================================================
   * PHẦN 1 — LÕI THUẬT TOÁN (port 1:1 từ 01-que_do_thu.html)
   * ========================================================================= */
  const BAT_QUAI = [
    { name: "Càn",  tienThien: 1, hauThien: 6, binary: "111", symbol: "☰" },
    { name: "Đoài", tienThien: 2, hauThien: 7, binary: "110", symbol: "☱" },
    { name: "Ly",   tienThien: 3, hauThien: 9, binary: "101", symbol: "☲" },
    { name: "Chấn", tienThien: 4, hauThien: 3, binary: "100", symbol: "☳" },
    { name: "Tốn",  tienThien: 5, hauThien: 4, binary: "011", symbol: "☴" },
    { name: "Khảm", tienThien: 6, hauThien: 1, binary: "010", symbol: "☵" },
    { name: "Cấn",  tienThien: 7, hauThien: 8, binary: "001", symbol: "☶" },
    { name: "Khôn", tienThien: 8, hauThien: 2, binary: "000", symbol: "☷" },
  ];

  const TIEN_THIEN_TO_TRIGRAM = Object.fromEntries(BAT_QUAI.map(t => [t.tienThien, t]));
  const HAU_THIEN_TO_TRIGRAM = Object.fromEntries(BAT_QUAI.map(t => [t.hauThien, t]));
  const BINARY_TO_TRIGRAM = Object.fromEntries(BAT_QUAI.map(t => [t.binary, t]));
  const TRUNG_CUNG_TRIGRAM = BAT_QUAI.find(t => t.name === "Khôn"); // Ô số 5 (trung cung): quy ước lấy quẻ Khôn

  const HA_DO_MATRIX = [[2, 1, 5], [3, null, 6], [4, 8, 7]];
  const LAC_THU_MATRIX = [[4, 9, 2], [3, 5, 7], [8, 1, 6]];
  const GIO_MATRIX = [["Tị/Tỵ/Thìn", "Ngọ", "Mùi/Thân"], ["Mão", null, "Dậu"], ["Dần/Sửu", "Tý/Tí", "Tuất/Hợi"]];
  const THANG_MATRIX = [["6/5", "7", "8/9"], ["4", null, "10"], ["3/2", "1", "11/12"]];

  const BAT_MON_PATTERN = [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2], [2, 1], [2, 0], [1, 0]];
  const LAC_THU_PATTERN = [[0, 0], [1, 1], [2, 2], [1, 2], [2, 0], [0, 1], [2, 1], [0, 2], [1, 0]];

  const THIEN_CAN_STEPS = { "Giáp":0,"Ất":1,"Bính":2,"Đinh":3,"Mậu":4,"Kỷ":5,"Kỉ":5,"Canh":6,"Tân":7,"Nhâm":8,"Quý":9,"Quí":9 };
  const DIA_CHI_ORDINAL = { "Tý":0,"Tí":0,"Sửu":1,"Dần":2,"Mão":3,"Thìn":4,"Tị":5,"Tỵ":5,"Ngọ":6,"Mùi":7,"Thân":8,"Dậu":9,"Tuất":10,"Hợi":11 };

  const THIEN_CAN_LIST = ["Giáp","Ất","Bính","Đinh","Mậu","Kỷ","Canh","Tân","Nhâm","Quý"];
  const DIA_CHI_LIST = ["Tý","Sửu","Dần","Mão","Thìn","Tị","Ngọ","Mùi","Thân","Dậu","Tuất","Hợi"];

  function coordEq(a, b) { return a[0] === b[0] && a[1] === b[1]; }
  function indexOfCoord(pattern, coord) {
    for (let i = 0; i < pattern.length; i++) if (coordEq(pattern[i], coord)) return i;
    return -1;
  }

  function findInMatrix(value, matrix) {
    const v = String(value || '').trim();
    const vNorm = v.replace(/Tỵ/g, 'Tị').replace(/Tí/g, 'Tý');
    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < matrix[r].length; c++) {
        const cell = matrix[r][c];
        if (cell === null) continue;
        const parts = String(cell).split("/").map(s => s.trim());
        const partsNorm = parts.map(s => s.replace(/Tỵ/g, 'Tị').replace(/Tí/g, 'Tý'));
        if (parts.includes(v) || partsNorm.includes(vNorm)) return [r, c];
      }
    }
    throw new Error(`Không tìm thấy '${value}' trong bảng đã cho.`);
  }

  function trigramFromTienThien(number) {
    if (number === null || number === undefined) return TRUNG_CUNG_TRIGRAM;
    const t = TIEN_THIEN_TO_TRIGRAM[number];
    if (!t) throw new Error(`Số Tiên Thiên '${number}' không hợp lệ.`);
    return t;
  }

  function trigramFromHauThien(number) {
    if (number === null || number === undefined || number === 5) return TRUNG_CUNG_TRIGRAM;
    const t = HAU_THIEN_TO_TRIGRAM[number];
    if (!t) throw new Error(`Số Hậu Thiên '${number}' không hợp lệ.`);
    return t;
  }

  function getQueThuong(gio, canNgay) {
    if (!(canNgay in THIEN_CAN_STEPS)) throw new Error(`Can '${canNgay}' không hợp lệ.`);
    const startCoord = findInMatrix(gio, GIO_MATRIX);
    const startIdx = indexOfCoord(BAT_MON_PATTERN, startCoord);
    const steps = THIEN_CAN_STEPS[canNgay];
    const finalIdx = (startIdx + steps) % BAT_MON_PATTERN.length;
    const finalCoord = BAT_MON_PATTERN[finalIdx];
    const number = HA_DO_MATRIX[finalCoord[0]][finalCoord[1]];
    const trigram = trigramFromTienThien(number);
    const path = [];
    for (let i = 0; i <= steps; i++) path.push(BAT_MON_PATTERN[(startIdx + i) % BAT_MON_PATTERN.length]);
    return { trigram, startCoord, finalCoord, path, steps };
  }

  function getQueHa(thang, ngay, gio) {
    if (!(gio in DIA_CHI_ORDINAL)) throw new Error(`Giờ '${gio}' không hợp lệ.`);
    const thangCoord = findInMatrix(thang, THANG_MATRIX);
    const idx0 = indexOfCoord(LAC_THU_PATTERN, thangCoord);
    const idxDay = (idx0 + (ngay - 1)) % LAC_THU_PATTERN.length;
    const dayCoord = LAC_THU_PATTERN[idxDay];
    const hourSteps = DIA_CHI_ORDINAL[gio];
    const idxFinal = (idxDay + hourSteps) % LAC_THU_PATTERN.length;
    const finalCoord = LAC_THU_PATTERN[idxFinal];
    const number = LAC_THU_MATRIX[finalCoord[0]][finalCoord[1]];
    const trigram = trigramFromHauThien(number);
    const dayPath = [];
    for (let i = 0; i <= (ngay - 1); i++) dayPath.push(LAC_THU_PATTERN[(idx0 + i) % LAC_THU_PATTERN.length]);
    const hourPath = [];
    for (let i = 0; i <= hourSteps; i++) hourPath.push(LAC_THU_PATTERN[(idxDay + i) % LAC_THU_PATTERN.length]);
    return { trigram, thangCoord, dayCoord, finalCoord, dayPath, hourPath };
  }

  function binary6Of(thuong, ha) { return ha.binary + thuong.binary; }
  function queHoOf(thuong, ha) {
    const b = binary6Of(thuong, ha);
    return { thuong: BINARY_TO_TRIGRAM[b.slice(2, 5)], ha: BINARY_TO_TRIGRAM[b.slice(1, 4)] };
  }
  function queBienOf(thuong, ha, haoDong) {
    const b = binary6Of(thuong, ha).split("");
    const idx = haoDong - 1;
    b[idx] = b[idx] === "0" ? "1" : "0";
    return { thuong: BINARY_TO_TRIGRAM[b.slice(3, 6).join("")], ha: BINARY_TO_TRIGRAM[b.slice(0, 3).join("")] };
  }

  function getQueGoc(gio, canNgay, thang, ngay) {
    const thuongResult = getQueThuong(gio, canNgay);
    const haResult = getQueHa(thang, ngay, gio);
    const binary6 = binary6Of(thuongResult.trigram, haResult.trigram);
    const ho = queHoOf(thuongResult.trigram, haResult.trigram);
    return {
      thuong: thuongResult.trigram,
      ha: haResult.trigram,
      name: `${thuongResult.trigram.name}/${haResult.trigram.name}`,
      binary6,
      ho,
      thuongTrace: thuongResult,
      haTrace: haResult,
    };
  }

  function getHaoNguyenDuong(thang) {
    const h = thang % 6;
    return h === 0 ? 6 : h;
  }

  function getHaoDong(thang, gio) {
    if (!(gio in DIA_CHI_ORDINAL)) throw new Error(`Giờ '${gio}' không hợp lệ.`);
    const haoNguyenDuong = getHaoNguyenDuong(thang);
    const khoangCach = DIA_CHI_ORDINAL[gio];
    const raw = (haoNguyenDuong + khoangCach) % 6;
    const haoDong = raw === 0 ? 6 : raw;
    return { haoNguyenDuong, khoangCach, haoDong };
  }

  /* =========================================================================
   * PHẦN 2 — GIAO DIỆN & VẼ SVG / BARS (1:1 TỪ 01-QUE_DO_THU.HTML)
   * ========================================================================= */
  const CELL = 76;
  const GAP_ORIGIN = 6;
  function cellCenter(r, c) { return [GAP_ORIGIN + c * CELL + CELL / 2, GAP_ORIGIN + r * CELL + CELL / 2]; }

  function svgEl(tag, attrs) {
    const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
    for (const k in attrs) el.setAttribute(k, attrs[k]);
    return el;
  }

  function renderGrid(svgId, numberMatrix, labelMatrix, arrowColor) {
    const svg = host.querySelector(`#${svgId}`);
    if (!svg) return null;
    svg.innerHTML = "";
    const size = GAP_ORIGIN * 2 + CELL * 3;
    svg.setAttribute("viewBox", `0 0 ${size} ${size}`);

    // Đỉnh mũi tên (dùng khi bật toggle "Hiện mũi tên")
    const defs = svgEl("defs", {});
    const marker = svgEl("marker", {
      id: svgId + "-arrowhead", markerWidth: 8, markerHeight: 8,
      refX: 6, refY: 3, orient: "auto", markerUnits: "strokeWidth"
    });
    marker.appendChild(svgEl("path", { d: "M0,0 L6,3 L0,6 Z", fill: arrowColor }));
    defs.appendChild(marker);
    svg.appendChild(defs);

    // Đường lưới
    for (let i = 0; i <= 3; i++) {
      svg.appendChild(svgEl("line", { x1: GAP_ORIGIN, y1: GAP_ORIGIN + i * CELL, x2: GAP_ORIGIN + 3 * CELL, y2: GAP_ORIGIN + i * CELL, stroke: "rgba(231,223,201,0.14)", "stroke-width": 1 }));
      svg.appendChild(svgEl("line", { x1: GAP_ORIGIN + i * CELL, y1: GAP_ORIGIN, x2: GAP_ORIGIN + i * CELL, y2: GAP_ORIGIN + 3 * CELL, stroke: "rgba(231,223,201,0.14)", "stroke-width": 1 }));
    }

    // Lớp hiệu ứng flash từng ô
    const fxLayer = svgEl("g", { class: "fx-layer" });
    svg.appendChild(fxLayer);

    // Nội dung ô
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const [cx, cy] = cellCenter(r, c);
        const num = numberMatrix ? numberMatrix[r][c] : null;
        const lbl = labelMatrix ? labelMatrix[r][c] : null;
        if (lbl !== null && lbl !== undefined) {
          const t = svgEl("text", { x: cx, y: cy - (num !== null && num !== undefined ? 9 : 0), "text-anchor": "middle", "dominant-baseline": "middle", class: "cell-label", fill: "var(--paper-dim)", "font-size": 11 });
          t.textContent = lbl;
          svg.appendChild(t);
        }
        if (num !== null && num !== undefined) {
          const t = svgEl("text", { x: cx, y: cy + (lbl !== null && lbl !== undefined ? 11 : 0), "text-anchor": "middle", "dominant-baseline": "middle", class: "cell-num", fill: "var(--paper)", "font-size": 15 });
          t.textContent = num;
          svg.appendChild(t);
        }
      }
    }

    // Lớp mũi tên
    const arrowLayer = svgEl("g", { class: "arrow-layer" });
    svg.appendChild(arrowLayer);

    // Lớp highlight kết quả
    const resultLayer = svgEl("g", { class: "result-layer" });
    svg.appendChild(resultLayer);

    return { svg, size, fxLayer, arrowLayer, resultLayer };
  }

  function drawResultHighlight(resultLayer, coord, color) {
    if (!resultLayer || !coord) return;
    resultLayer.innerHTML = "";
    const [cx, cy] = cellCenter(coord[0], coord[1]);
    const rect = svgEl("rect", {
      x: cx - CELL / 2 + 3, y: cy - CELL / 2 + 3, width: CELL - 6, height: CELL - 6,
      rx: 6, fill: "none", stroke: color, "stroke-width": 2.5, opacity: 0,
    });
    resultLayer.appendChild(rect);
    requestAnimationFrame(() => {
      rect.style.transition = "opacity 260ms ease";
      rect.style.opacity = 1;
    });
  }

  function flashCell(fxLayer, coord, color, holdMs) {
    if (!fxLayer || !coord) return;
    const [cx, cy] = cellCenter(coord[0], coord[1]);
    const rect = svgEl("rect", {
      x: cx - CELL / 2 + 3, y: cy - CELL / 2 + 3, width: CELL - 6, height: CELL - 6,
      rx: 6, fill: color, opacity: 0,
    });
    fxLayer.appendChild(rect);
    rect.style.transition = "opacity 90ms ease";
    requestAnimationFrame(() => { rect.style.opacity = 0.36; });
    setTimeout(() => {
      rect.style.opacity = 0;
      setTimeout(() => rect.remove(), 220);
    }, Math.max(holdMs - 90, 40));
  }

  function drawArrowSegment(arrowLayer, svgId, fromCoord, toCoord, color, drawMs) {
    if (!arrowLayer || !fromCoord || !toCoord) return;
    const [x1, y1] = cellCenter(fromCoord[0], fromCoord[1]);
    const [x2, y2] = cellCenter(toCoord[0], toCoord[1]);
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.hypot(dx, dy) || 1;
    const shrink = 15;
    const ux = dx / len, uy = dy / len;
    const sx = x1 + ux * shrink, sy = y1 + uy * shrink;
    const ex = x2 - ux * shrink, ey = y2 - uy * shrink;

    const line = svgEl("line", {
      x1: sx, y1: sy, x2: ex, y2: ey, stroke: color, "stroke-width": 2.25,
      "stroke-linecap": "round",
      "marker-end": `url(#${svgId}-arrowhead)`,
      opacity: 0.85,
    });
    const segLen = Math.hypot(ex - sx, ey - sy);
    line.setAttribute("stroke-dasharray", segLen);
    line.setAttribute("stroke-dashoffset", segLen);
    arrowLayer.appendChild(line);
    requestAnimationFrame(() => {
      line.style.transition = `stroke-dashoffset ${drawMs}ms ease`;
      line.setAttribute("stroke-dashoffset", "0");
    });
  }

  const ARROW_HOLD_MS = 2000;
  const ARROW_FADE_MS = 500;

  function fadeOutArrows(arrowLayer, fadeMs) {
    if (!arrowLayer) return;
    const lines = arrowLayer.querySelectorAll('line');
    if (lines.length === 0) return;
    lines.forEach(line => {
      line.style.transition = `opacity ${fadeMs}ms ease`;
      line.style.opacity = 0;
    });
    setTimeout(() => { arrowLayer.innerHTML = ""; }, fadeMs + 30);
  }

  function playSteps(state, stepMs, btn, showArrows) {
    const { fxLayer, arrowLayer, path, color, svgId } = state;
    if (!path || path.length === 0) return;
    if (state.fadeTimeoutId) { clearTimeout(state.fadeTimeoutId); state.fadeTimeoutId = null; }
    if (btn) btn.disabled = true;
    arrowLayer.innerHTML = "";
    path.forEach((coord, i) => {
      setTimeout(() => {
        flashCell(fxLayer, coord, color, stepMs);
        if (showArrows && i > 0) {
          drawArrowSegment(arrowLayer, svgId, path[i - 1], coord, color, Math.max(stepMs - 60, 120));
        }
      }, i * stepMs);
    });
    const totalMs = path.length * stepMs;
    setTimeout(() => { if (btn) btn.disabled = false; }, totalMs + 150);
    if (showArrows) {
      state.fadeTimeoutId = setTimeout(() => {
        fadeOutArrows(arrowLayer, ARROW_FADE_MS);
        state.fadeTimeoutId = null;
      }, totalMs + ARROW_HOLD_MS);
    }
  }

  /* ---------- Bar / hexagram rendering ---------- */
  let currentGoc = null;

  function renderBarsToElement(elementId, binary6, activeHao = 0) {
    const container = host.querySelector('#' + elementId);
    if (!container) return;
    if (window.KD_GRID && typeof window.KD_GRID.renderBars === 'function') {
      window.KD_GRID.renderBars(container, binary6, activeHao);
    } else {
      container.innerHTML = "";
      for (let hao = 6; hao >= 1; hao--) {
        const bit = binary6[hao - 1];
        const row = document.createElement('div');
        row.className = 'bar-row ' + (hao >= 4 ? 'thuong' : 'ha') + (hao === activeHao ? ' active dynamic' : '');
        row.dataset.hao = hao;

        const idxLabel = document.createElement('span');
        idxLabel.className = 'bar-idx';
        idxLabel.textContent = hao;
        row.appendChild(idxLabel);

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
        container.appendChild(row);
      }
    }
  }

  /* ---------- Controls & Event Listeners ---------- */
  const selGio = host.querySelector('#sel-gio');
  const selCan = host.querySelector('#sel-can');
  const selThang = host.querySelector('#sel-thang');
  const selNgay = host.querySelector('#sel-ngay');
  const arrowToggle = host.querySelector('#arrow-toggle');
  const errorBox = host.querySelector('#error-msg');
  const result = host.querySelector('#result');

  if (selGio && selGio.options.length === 0) DIA_CHI_LIST.forEach(g => selGio.add(new Option(`Giờ ${g}`, g)));
  if (selCan && selCan.options.length === 0) THIEN_CAN_LIST.forEach(c => selCan.add(new Option(c, c)));
  if (selThang && selThang.options.length === 0) for (let m = 1; m <= 12; m++) selThang.add(new Option(`Tháng ${m}`, m));
  if (selNgay && selNgay.options.length === 0) for (let d = 1; d <= 30; d++) selNgay.add(new Option(`Ngày ${d}`, d));

  const PRESETS = [
    { gio: "Tý", can: "Giáp", thang: 1, ngay: 1 },
    { gio: "Thìn", can: "Kỷ", thang: 11, ngay: 15 },
    { gio: "Dậu", can: "Tân", thang: 9, ngay: 5 },
  ];

  host.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const p = PRESETS[parseInt(btn.dataset.preset, 10)];
      if (!p) return;
      if (selGio) selGio.value = p.gio;
      if (selCan) selCan.value = p.can;
      if (selThang) selThang.value = String(p.thang);
      if (selNgay) selNgay.value = String(p.ngay);
      cast();
    });
  });

  let thuongSteps = { fxLayer: null, arrowLayer: null, svgId: 'svg-hado', path: [], color: '', stepMs: 300 };
  let haSteps = { fxLayer: null, arrowLayer: null, svgId: 'svg-lacthu', path: [], color: '', stepMs: 300 };

  function cast() {
    if (!selGio || !selCan || !selThang || !selNgay) return;
    const gio = selGio.value;
    const can = selCan.value;
    const thang = parseInt(selThang.value, 10);
    const ngay = parseInt(selNgay.value, 10);

    let goc;
    try {
      goc = getQueGoc(gio, can, thang, ngay);
    } catch (e) {
      if (result) result.style.display = 'none';
      if (errorBox) {
        errorBox.style.display = 'block';
        errorBox.textContent = 'Lỗi: ' + e.message;
      }
      return;
    }

    if (errorBox) errorBox.style.display = 'none';
    if (result) result.style.display = 'block';
    currentGoc = goc;

    const goldColor = getComputedStyle(document.documentElement).getPropertyValue('--gold').trim() || "#c19a4b";
    const jadeColor = getComputedStyle(document.documentElement).getPropertyValue('--jade').trim() || "#5b9686";

    // --- Panel Hà Đồ (Quẻ Thượng) ---
    const gThuong = renderGrid('svg-hado', HA_DO_MATRIX, GIO_MATRIX, goldColor);
    if (gThuong) {
      drawResultHighlight(gThuong.resultLayer, goc.thuongTrace.finalCoord, goldColor);
      thuongSteps = { fxLayer: gThuong.fxLayer, arrowLayer: gThuong.arrowLayer, svgId: 'svg-hado', path: goc.thuongTrace.path, color: goldColor, stepMs: 300 };
    }
    const thuongDesc = host.querySelector('#thuong-desc');
    if (thuongDesc) thuongDesc.textContent = `Giờ ${gio} → đi ${goc.thuongTrace.steps} bước bát môn đến Can ${can}.`;
    const thuongSym = host.querySelector('#thuong-symbol');
    if (thuongSym) thuongSym.textContent = goc.thuong.symbol;
    const thuongName = host.querySelector('#thuong-name');
    if (thuongName) thuongName.textContent = goc.thuong.name;

    // --- Panel Lạc Thư (Quẻ Hạ) ---
    const gHa = renderGrid('svg-lacthu', LAC_THU_MATRIX, THANG_MATRIX, jadeColor);
    if (gHa) {
      drawResultHighlight(gHa.resultLayer, goc.haTrace.finalCoord, jadeColor);
      const haFullPath = goc.haTrace.dayPath.concat(goc.haTrace.hourPath.slice(1));
      haSteps = { fxLayer: gHa.fxLayer, arrowLayer: gHa.arrowLayer, svgId: 'svg-lacthu', path: haFullPath, color: jadeColor, stepMs: 300 };
    }
    const haDesc = host.querySelector('#ha-desc');
    if (haDesc) {
      const haCenterHit = goc.haTrace.finalCoord[0] === 1 && goc.haTrace.finalCoord[1] === 1;
      haDesc.textContent = `Tháng ${thang} → ${ngay - 1} bước đến Ngày ${ngay} (đặt giờ Tý) → tiếp ${goc.haTrace.hourPath.length - 1} bước đến Giờ ${gio}.` +
        (haCenterHit ? ' Dừng tại ô số 5 (trung cung) → quy ước lấy quẻ Khôn.' : '');
    }
    const haSym = host.querySelector('#ha-symbol');
    if (haSym) haSym.textContent = goc.ha.symbol;
    const haName = host.querySelector('#ha-name');
    if (haName) haName.textContent = goc.ha.name;

    // --- Hexagrams: Gốc, Biến, Hỗ ---
    const haoInfo = getHaoDong(thang, gio);
    const bien = queBienOf(goc.thuong, goc.ha, haoInfo.haoDong);
    const ho = queHoOf(goc.thuong, goc.ha);

    const tenGocDich = (window.KD_DICH && typeof window.KD_DICH.getName === "function")
      ? window.KD_DICH.getName(goc.thuong.name, goc.ha.name)
      : goc.name;
    const gocBinary = goc.binary6;

    const tenBienDich = (window.KD_DICH && typeof window.KD_DICH.getName === "function")
      ? window.KD_DICH.getName(bien.thuong.name, bien.ha.name)
      : `${bien.thuong.name}/${bien.ha.name}`;
    const bienBinary = bien.ha.binary + bien.thuong.binary;

    const tenHoDich = (window.KD_DICH && typeof window.KD_DICH.getName === "function")
      ? window.KD_DICH.getName(ho.thuong.name, ho.ha.name)
      : `${ho.thuong.name}/${ho.ha.name}`;
    const hoBinary = ho.ha.binary + ho.thuong.binary;

    // 1. Tiêu đề chính
    const gocFullnameEl = host.querySelector('#goc-fullname');
    if (gocFullnameEl) gocFullnameEl.textContent = `${tenGocDich} (${goc.name})`;
    const gocNameEl = host.querySelector('#goc-name');
    if (gocNameEl) gocNameEl.textContent = tenGocDich ? `${tenGocDich} (${goc.name})` : goc.name;
    const gocSymbolsEl = host.querySelector('#goc-symbols');
    if (gocSymbolsEl) gocSymbolsEl.textContent = goc.thuong.symbol + goc.ha.symbol;

    // 2. Thẻ Quẻ Gốc
    const cardGoc = host.querySelector('.hexagram-card[data-card-type="goc"]');
    if (cardGoc) cardGoc.setAttribute('data-hex', tenGocDich);
    const cardGocTitle = host.querySelector('#card-goc-title');
    if (cardGocTitle) cardGocTitle.textContent = tenGocDich;
    const cardGocSymbols = host.querySelector('#card-goc-symbols');
    if (cardGocSymbols) cardGocSymbols.textContent = `${goc.name} (${goc.thuong.symbol}${goc.ha.symbol})`;
    renderBarsToElement('bars-goc', gocBinary, haoInfo.haoDong);
    renderBarsToElement('bars-container', gocBinary, haoInfo.haoDong); // Tương thích ngược

    // 3. Thẻ Quẻ Biến
    const cardBien = host.querySelector('.hexagram-card[data-card-type="bien"]');
    if (cardBien) cardBien.setAttribute('data-hex', tenBienDich);
    const cardBienTitle = host.querySelector('#card-bien-title');
    if (cardBienTitle) cardBienTitle.textContent = tenBienDich;
    const cardBienSymbols = host.querySelector('#card-bien-symbols');
    if (cardBienSymbols) cardBienSymbols.textContent = `${bien.thuong.name}/${bien.ha.name} (${bien.thuong.symbol}${bien.ha.symbol})`;
    renderBarsToElement('bars-bien', bienBinary, 0);

    // 3b. Nạp Lục Thân (js/core/lucthan.js): đủ 6 hào Quẻ Gốc + hào động Quẻ Biến
    if (window.KD_LUCTHAN) {
      window.KD_LUCTHAN.renderPair(host.querySelector('#bars-goc'), host.querySelector('#bars-bien'), gocBinary, bienBinary);
      const ltStepsBody = host.querySelector('#lt-steps-body');
      if (ltStepsBody) ltStepsBody.innerHTML = window.KD_LUCTHAN.stepsHtml(gocBinary, bienBinary);
    }

    // 4. Thẻ Quẻ Hỗ
    const cardHo = host.querySelector('.hexagram-card[data-card-type="ho"]');
    if (cardHo) cardHo.setAttribute('data-hex', tenHoDich);
    const cardHoTitle = host.querySelector('#card-ho-title');
    if (cardHoTitle) cardHoTitle.textContent = tenHoDich;
    const cardHoSymbols = host.querySelector('#card-ho-symbols');
    if (cardHoSymbols) cardHoSymbols.textContent = `${ho.thuong.name}/${ho.ha.name} (${ho.thuong.symbol}${ho.ha.symbol})`;
    renderBarsToElement('bars-ho', hoBinary, 0);

    // 5. Thông tin Hào động & Nhị phân
    const gocBinaryEl = host.querySelector('#goc-binary');
    if (gocBinaryEl) gocBinaryEl.textContent = gocBinary;
    const bienBinaryEl = host.querySelector('#bien-binary');
    if (bienBinaryEl) bienBinaryEl.textContent = bienBinary;
    const hoBinaryEl = host.querySelector('#ho-binary');
    if (hoBinaryEl) hoBinaryEl.textContent = hoBinary;

    const haodongVal = host.querySelector('#haodong-value');
    if (haodongVal) haodongVal.textContent = `Hào ${haoInfo.haoDong}`;
    const haodongFormula = host.querySelector('#haodong-formula');
    if (haodongFormula) {
      haodongFormula.innerHTML = `Nguyên đường = Tháng ${thang} mod 6 = ${haoInfo.haoNguyenDuong}<br>Hào động = (${haoInfo.haoNguyenDuong} + khoảng cách ${haoInfo.khoangCach} [Tý→${gio}]) mod 6 = <b>Hào ${haoInfo.haoDong}</b>`;
    }
    const haodongCaptionEl = host.querySelector('#haodong-caption');
    if (haodongCaptionEl) {
      haodongCaptionEl.textContent = `hào động: nguyên đường ${haoInfo.haoNguyenDuong} (tháng ${thang} mod 6) + khoảng cách ${haoInfo.khoangCach} (Tý→giờ ${gio}) → hào ${haoInfo.haoDong}`;
    }

    const hoValueEl = host.querySelector('#ho-value');
    if (hoValueEl) hoValueEl.innerHTML = `${ho.thuong.name}/${ho.ha.name} <span class="mini-symbols">${ho.thuong.symbol}${ho.ha.symbol}</span>`;
    const bienValueEl = host.querySelector('#bien-value');
    if (bienValueEl) bienValueEl.innerHTML = `${bien.thuong.name}/${bien.ha.name} <span class="mini-symbols">${bien.thuong.symbol}${bien.ha.symbol}</span>`;

    const inputEchoEl = host.querySelector('#input-echo');
    if (inputEchoEl) {
      inputEchoEl.textContent = `Giờ ${gio} · Can ${can} · Tháng ${thang} · Ngày ${ngay}`;
    }
  }

  const castBtn = host.querySelector('#cast-btn');
  if (castBtn) castBtn.addEventListener('click', cast);

  const btnStepsThuong = host.querySelector('#steps-btn-thuong');
  if (btnStepsThuong) {
    btnStepsThuong.addEventListener('click', function() {
      playSteps(thuongSteps, thuongSteps.stepMs, this, arrowToggle ? arrowToggle.checked : false);
    });
  }

  const btnStepsHa = host.querySelector('#steps-btn-ha');
  if (btnStepsHa) {
    btnStepsHa.addEventListener('click', function() {
      playSteps(haSteps, haSteps.stepMs, this, arrowToggle ? arrowToggle.checked : false);
    });
  }

  // Khởi tạo mặc định
  if (selGio && !selGio.value) selGio.value = "Tý";
  if (selCan && !selCan.value) selCan.value = "Giáp";
  if (selThang && !selThang.value) selThang.value = "1";
  if (selNgay && !selNgay.value) selNgay.value = "1";

  window.cast = cast;
  window.__KD_CAST = cast;

  cast();
};
