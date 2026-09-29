/* =========================================================================
 * MODULE: Đồ Thư Phi Bàn Độn (dothu.js)
 * Chuẩn kiến trúc MVVM:
 * - Model: Lõi giải thuật Hà Đồ & Lạc Thư thuần túy
 * - ViewModel & View: Tương tác DOM, vẽ SVG ma trận & 6 hào
 * ========================================================================= */

window.KD_MOD = window.KD_MOD || {};
window.KD_MOD["dothu"] = function() {
  const host = document.querySelector('.kd-mod[data-mod="dothu"]');
  if (!host) return;

  // Lấy dịch vụ dùng chung từ tầng KD_CORE
  const { DICH_64_BY_PAIR, TRIGRAM_TUONG, CAN: THIEN_CAN_LIST, CHI: DIA_CHI_LIST } = window.KD_DATA;
  const { getName: getTenQueDichFromTrigrams, flipBit } = window.KD_DICH;
  const { coordEq, indexOfCoord } = window.KD_UTIL;
  const { renderBars: renderBarsToElement, svgEl } = window.KD_GRID;

  /* =========================================================================
   * [1. MODEL] LÕI THUẬT TOÁN ĐỒ THƯ PHI BÀN ĐỘN (0% DOM)
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
  const TRUNG_CUNG_TRIGRAM = BAT_QUAI.find(t => t.name === "Khôn");

  const HA_DO_MATRIX = [[2, 1, 5], [3, null, 6], [4, 8, 7]];
  const LAC_THU_MATRIX = [[4, 9, 2], [3, 5, 7], [8, 1, 6]];
  const GIO_MATRIX = [["Tị/Thìn", "Ngọ", "Mùi/Thân"], ["Mão", null, "Dậu"], ["Dần/Sửu", "Tý", "Tuất/Hợi"]];
  const THANG_MATRIX = [["6/5", "7", "8/9"], ["4", null, "10"], ["3/2", "1", "11/12"]];

  const BAT_MON_PATTERN = [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2], [2, 1], [2, 0], [1, 0]];
  const LAC_THU_PATTERN = [[0, 0], [1, 1], [2, 2], [1, 2], [2, 0], [0, 1], [2, 1], [0, 2], [1, 0]];

  const THIEN_CAN_STEPS = { "Giáp":0,"Ất":1,"Bính":2,"Đinh":3,"Mậu":4,"Kỷ":5,"Canh":6,"Tân":7,"Nhâm":8,"Quý":9 };
  const DIA_CHI_ORDINAL = { "Tý":0,"Sửu":1,"Dần":2,"Mão":3,"Thìn":4,"Tị":5,"Ngọ":6,"Mùi":7,"Thân":8,"Dậu":9,"Tuất":10,"Hợi":11 };

  function findInMatrix(value, matrix) {
    const v = String(value);
    for (let r = 0; r < matrix.length; r++) for (let c = 0; c < matrix[r].length; c++) {
      const cell = matrix[r][c];
      if (cell === null) continue;
      if (String(cell).split("/").includes(v)) return [r, c];
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
    for (let i = 0; i <= steps; i++) {
      path.push(BAT_MON_PATTERN[(startIdx + i) % BAT_MON_PATTERN.length]);
    }
    return { trigram, number, startCoord, finalCoord, steps, path };
  }

  function getQueHa(thang, ngay) {
    const startCoord = findInMatrix(thang, THANG_MATRIX);
    const startIdx = indexOfCoord(LAC_THU_PATTERN, startCoord);
    const steps = ngay - 1;
    const finalIdx = (startIdx + steps) % LAC_THU_PATTERN.length;
    const finalCoord = LAC_THU_PATTERN[finalIdx];
    const number = LAC_THU_MATRIX[finalCoord[0]][finalCoord[1]];
    const trigram = trigramFromHauThien(number);
    const path = [];
    for (let i = 0; i <= steps; i++) {
      path.push(LAC_THU_PATTERN[(startIdx + i) % LAC_THU_PATTERN.length]);
    }
    return { trigram, number, startCoord, finalCoord, steps, path };
  }

  function calculateQueHo(originalQueBinary) {
    const queHoLowerBinary = originalQueBinary.slice(1, 4);
    const queHoUpperBinary = originalQueBinary.slice(2, 5);

    const lowerTrigram = BINARY_TO_TRIGRAM[queHoLowerBinary];
    const upperTrigram = BINARY_TO_TRIGRAM[queHoUpperBinary];
    const queHoFullBinary = queHoLowerBinary + queHoUpperBinary;

    return {
      upperName: upperTrigram.name,
      lowerName: lowerTrigram.name,
      upperTrigram,
      lowerTrigram,
      queHoFullBinary
    };
  }

  const DoThuModel = {
    lapQue(gio, canNgay, ngay, thang) {
      const thuong = getQueThuong(gio, canNgay);
      const ha = getQueHa(thang, ngay);

      const gocBinary = ha.trigram.binary + thuong.trigram.binary; // Hào 1-3: Hạ, Hào 4-6: Thượng
      const gocName = `${thuong.trigram.name} / ${ha.trigram.name}`;
      const tenQueGocDich = getTenQueDichFromTrigrams(thuong.trigram.name, ha.trigram.name);

      const gioVal = DIA_CHI_ORDINAL[gio] + 1;
      const haoDong = ((thang + gioVal - 1) % 6) + 1;

      const bienBinary = flipBit(gocBinary, haoDong);
      const bienHaBinary = bienBinary.slice(0, 3);
      const bienThuongBinary = bienBinary.slice(3, 6);
      const bienHaTrigram = BINARY_TO_TRIGRAM[bienHaBinary];
      const bienThuongTrigram = BINARY_TO_TRIGRAM[bienThuongBinary];

      const tenQueBienDich = getTenQueDichFromTrigrams(bienThuongTrigram.name, bienHaTrigram.name);
      const ho = calculateQueHo(gocBinary);
      const tenQueHoDich = getTenQueDichFromTrigrams(ho.upperName, ho.lowerName);

      return {
        thuong,
        ha,
        gocBinary,
        gocName,
        tenQueGocDich,
        gioVal,
        haoDong,
        bienBinary,
        bienHaTrigram,
        bienThuongTrigram,
        tenQueBienDich,
        ho,
        tenQueHoDich
      };
    }
  };

  /* =========================================================================
   * [2. VIEW & VIEWMODEL] BINDING VÀ KẾT XUẤT ĐỒ HỌA
   * ========================================================================= */
  const CELL_SIZE = 64;
  const GAP = 6;
  const ORIGIN_X = 6;
  const ORIGIN_Y = 6;

  function cellCenter(r, c) {
    return {
      x: ORIGIN_X + c * (CELL_SIZE + GAP) + CELL_SIZE / 2,
      y: ORIGIN_Y + r * (CELL_SIZE + GAP) + CELL_SIZE / 2
    };
  }

  function renderGridBase(svgId, matrix, pathColor) {
    const svg = host.querySelector(`#${svgId}`);
    if (!svg) return;
    svg.innerHTML = "";

    const markerId = `${svgId}-arrow`;
    let defs = svg.querySelector("defs");
    if (!defs) {
      defs = svgEl("defs");
      svg.appendChild(defs);
    }
    const marker = svgEl("marker", {
      id: markerId,
      viewBox: "0 0 10 10",
      refX: "6", refY: "3",
      markerWidth: "6", markerHeight: "6",
      orient: "auto"
    });
    const markerPath = svgEl("path", {
      d: "M 0 0 L 6 3 L 0 6 z",
      fill: pathColor
    });
    marker.appendChild(markerPath);
    defs.appendChild(marker);

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const x = ORIGIN_X + c * (CELL_SIZE + GAP);
        const y = ORIGIN_Y + r * (CELL_SIZE + GAP);
        const isCenter = r === 1 && c === 1;

        const rect = svgEl("rect", {
          x, y,
          width: CELL_SIZE, height: CELL_SIZE,
          rx: 4, ry: 4,
          fill: isCenter ? "var(--ink-800)" : "var(--ink-750)",
          stroke: isCenter ? "var(--cinnabar)" : "var(--line)",
          "stroke-width": isCenter ? 1.5 : 1
        });
        svg.appendChild(rect);

        const val = matrix[r][c];
        const text = svgEl("text", {
          x: x + CELL_SIZE / 2,
          y: y + CELL_SIZE / 2 + 5,
          "text-anchor": "middle",
          fill: isCenter ? "var(--cinnabar)" : "var(--paper)",
          "font-size": val === 5 ? "16" : "15",
          "font-family": "var(--font-mono)",
          "font-weight": isCenter ? "700" : "500"
        });
        text.textContent = val === null ? "·" : val;
        svg.appendChild(text);
      }
    }
  }

  function drawCellHighlight(svg, coord, color) {
    const x = ORIGIN_X + coord[1] * (CELL_SIZE + GAP);
    const y = ORIGIN_Y + coord[0] * (CELL_SIZE + GAP);
    const rect = svgEl("rect", {
      x, y,
      width: CELL_SIZE, height: CELL_SIZE,
      rx: 4, ry: 4,
      fill: "none",
      stroke: color,
      "stroke-width": 2,
      opacity: 0.95
    });
    svg.appendChild(rect);
  }

  function drawCellLabel(svg, coord, labelText, color) {
    const center = cellCenter(coord[0], coord[1]);
    const label = svgEl("text", {
      x: center.x,
      y: center.y - CELL_SIZE / 2 + 11,
      "text-anchor": "middle",
      fill: color,
      "font-size": "9",
      "font-family": "var(--font-mono)",
      "font-weight": "700",
      "letter-spacing": "0.05em"
    });
    label.textContent = labelText;
    svg.appendChild(label);
  }

  function drawPathAnimated(svg, svgId, path, color, showArrows = true) {
    if (!path || path.length < 2) return;
    const markerId = `${svgId}-arrow`;
    for (let i = 0; i < path.length - 1; i++) {
      const p1 = cellCenter(path[i][0], path[i][1]);
      const p2 = cellCenter(path[i + 1][0], path[i + 1][1]);
      const line = svgEl("line", {
        x1: p1.x, y1: p1.y,
        x2: p2.x, y2: p2.y,
        stroke: color,
        "stroke-width": 2,
        "stroke-dasharray": "4 3",
        opacity: 0.85
      });
      if (showArrows) {
        line.setAttribute("marker-end", `url(#${markerId})`);
      }
      svg.appendChild(line);
    }
  }

  const selGio = host.querySelector("#sel-gio");
  const selCan = host.querySelector("#sel-can");
  const selNgay = host.querySelector("#sel-ngay");
  const selThang = host.querySelector("#sel-thang");
  const arrowToggle = host.querySelector("#arrow-toggle");
  const errorBox = host.querySelector("#error-msg");
  const result = host.querySelector("#result");

  if (selGio && selGio.options.length === 0) DIA_CHI_LIST.forEach(g => selGio.add(new Option(`Giờ ${g}`, g)));
  if (selCan && selCan.options.length === 0) THIEN_CAN_LIST.forEach(c => selCan.add(new Option(c, c)));
  if (selNgay && selNgay.options.length === 0) for (let d = 1; d <= 30; d++) selNgay.add(new Option(`Ngày ${d}`, d));
  if (selThang && selThang.options.length === 0) for (let m = 1; m <= 12; m++) selThang.add(new Option(`Tháng ${m}`, m));

  function cast() {
    if (!selGio || !selCan || !selNgay || !selThang) return;
    const gio = selGio.value;
    const can = selCan.value;
    const ngay = parseInt(selNgay.value, 10);
    const thang = parseInt(selThang.value, 10);
    const showArrows = arrowToggle ? arrowToggle.checked : true;

    let r;
    try {
      r = DoThuModel.lapQue(gio, can, ngay, thang);
    } catch (e) {
      if (result) result.style.display = "none";
      if (errorBox) {
        errorBox.style.display = "block";
        errorBox.textContent = "Lỗi: " + e.message;
      }
      return;
    }

    if (errorBox) errorBox.style.display = "none";
    if (result) result.style.display = "block";

    const goldColor = getComputedStyle(document.documentElement).getPropertyValue('--gold').trim() || "#c19a4b";
    const jadeColor = getComputedStyle(document.documentElement).getPropertyValue('--jade').trim() || "#3ea87a";

    // Step 1: Hà Đồ
    renderGridBase("svg-hado", HA_DO_MATRIX, goldColor);
    const svgHD = host.querySelector("#svg-hado");
    if (svgHD) {
      drawPathAnimated(svgHD, "svg-hado", r.thuong.path, goldColor, showArrows);
      drawCellHighlight(svgHD, r.thuong.finalCoord, goldColor);
      drawCellLabel(svgHD, r.thuong.startCoord, "Đầu", goldColor);
      drawCellLabel(svgHD, r.thuong.finalCoord, r.thuong.trigram.name, goldColor);
    }

    const thuongDesc = host.querySelector("#thuong-desc");
    if (thuongDesc) thuongDesc.innerHTML = `Giờ <b>${gio}</b> → Can <b>${can}</b> (${r.thuong.steps} bước) → Ô số <b>${r.thuong.number}</b>.`;
    const thuongSym = host.querySelector("#thuong-symbol");
    if (thuongSym) thuongSym.textContent = r.thuong.trigram.symbol;
    const thuongName = host.querySelector("#thuong-name");
    if (thuongName) thuongName.textContent = `Quẻ ${r.thuong.trigram.name}`;

    // Step 2: Lạc Thư
    renderGridBase("svg-lacthu", LAC_THU_MATRIX, jadeColor);
    const svgLT = host.querySelector("#svg-lacthu");
    if (svgLT) {
      drawPathAnimated(svgLT, "svg-lacthu", r.ha.path, jadeColor, showArrows);
      drawCellHighlight(svgLT, r.ha.finalCoord, jadeColor);
      drawCellLabel(svgLT, r.ha.startCoord, "Đầu", jadeColor);
      drawCellLabel(svgLT, r.ha.finalCoord, r.ha.trigram.name, jadeColor);
    }

    const haDesc = host.querySelector("#ha-desc");
    if (haDesc) haDesc.innerHTML = `Tháng <b>${thang}</b> → Ngày <b>${ngay}</b> (${r.ha.steps} bước) → Ô số <b>${r.ha.number}</b>.`;
    const haSym = host.querySelector("#ha-symbol");
    if (haSym) haSym.textContent = r.ha.trigram.symbol;
    const haName = host.querySelector("#ha-name");
    if (haName) haName.textContent = `Quẻ ${r.ha.trigram.name}`;

    // Quẻ Gốc
    const gocFull = host.querySelector("#goc-fullname");
    if (gocFull) gocFull.textContent = `${r.tenQueGocDich} (${r.gocName})`;
    const cardGocTitle = host.querySelector("#card-goc-title");
    if (cardGocTitle) cardGocTitle.textContent = r.tenQueGocDich;
    const cardGocSym = host.querySelector("#card-goc-symbols");
    if (cardGocSym) cardGocSym.textContent = `${r.gocName} (${r.thuong.trigram.symbol}${r.ha.trigram.symbol})`;
    renderBarsToElement(host.querySelector('#bars-goc'), r.gocBinary, r.haoDong);

    // Quẻ Biến
    const cardBienTitle = host.querySelector("#card-bien-title");
    if (cardBienTitle) cardBienTitle.textContent = r.tenQueBienDich;
    const cardBienSym = host.querySelector("#card-bien-symbols");
    if (cardBienSym) cardBienSym.textContent = `${r.bienThuongTrigram.name} / ${r.bienHaTrigram.name} (${r.bienThuongTrigram.symbol}${r.bienHaTrigram.symbol})`;
    renderBarsToElement(host.querySelector('#bars-bien'), r.bienBinary, 0);

    // Quẻ Hỗ
    const cardHoTitle = host.querySelector("#card-ho-title");
    if (cardHoTitle) cardHoTitle.textContent = r.tenQueHoDich;
    const cardHoSym = host.querySelector("#card-ho-symbols");
    if (cardHoSym) cardHoSym.textContent = `${r.ho.upperName} / ${r.ho.lowerName} (${r.ho.upperTrigram.symbol}${r.ho.lowerTrigram.symbol})`;
    renderBarsToElement(host.querySelector('#bars-ho'), r.ho.queHoFullBinary, 0);

    // Info Meta
    const gocBin = host.querySelector("#goc-binary");
    if (gocBin) gocBin.textContent = r.gocBinary;
    const bienBin = host.querySelector("#bien-binary");
    if (bienBin) bienBin.textContent = r.bienBinary;
    const hoBin = host.querySelector("#ho-binary");
    if (hoBin) hoBin.textContent = r.ho.queHoFullBinary;
    const haoDongVal = host.querySelector("#haodong-value");
    if (haoDongVal) haoDongVal.textContent = `Hào ${r.haoDong}`;
    const haoDongFormula = host.querySelector("#haodong-formula");
    if (haoDongFormula) {
      haoDongFormula.innerHTML = `Hào Động = (Tháng ${thang} + Giờ ${r.gioVal} - 1) mod 6 + 1 = <b>${r.haoDong}</b>`;
    }
    const inputEcho = host.querySelector("#input-echo");
    if (inputEcho) {
      inputEcho.textContent = `Giờ ${gio} · Can ${can} · Ngày ${ngay} · Tháng ${thang}`;
    }
  }

  const castBtn = host.querySelector("#cast-btn");
  if (castBtn) castBtn.addEventListener("click", cast);
  if (arrowToggle) {
    arrowToggle.addEventListener("change", () => {
      if (result && result.style.display === "block") cast();
    });
  }

  if (selGio && !selGio.value) selGio.value = "Ngọ";
  if (selCan && !selCan.value) selCan.value = "Giáp";
  if (selNgay && !selNgay.value) selNgay.value = "1";
  if (selThang && !selThang.value) selThang.value = "1";

  window.cast = cast;
  window.__KD_CAST = cast;
};
