/* =========================================================================
 * MODULE: Đồ Thư Phi Bàn Độn (dothu.js)
 * Chuẩn kiến trúc MVVM:
 * - Model: Lõi giải thuật Hà Đồ (Tiên Thiên) & Lạc Thư (Hậu Thiên) chuẩn 1:1 từ quedothu.py
 * - ViewModel & View: Tương tác DOM, vẽ SVG ma trận, mũi tên định hướng, bước đi & 6 hào
 * ========================================================================= */

window.KD_MOD = window.KD_MOD || {};
window.KD_MOD["dothu"] = function() {
  const host = document.querySelector('.kd-mod[data-mod="dothu"]');
  if (!host) return;

  // Lấy dịch vụ dùng chung từ tầng KD_CORE
  const { CAN: THIEN_CAN_LIST, CHI: DIA_CHI_LIST } = window.KD_DATA;
  const { getName: getTenQueDichFromTrigrams, flipBit } = window.KD_DICH;
  const { coordEq, indexOfCoord } = window.KD_UTIL;
  const { renderBars: renderBarsToElement, svgEl } = window.KD_GRID;

  /* =========================================================================
   * [1. MODEL] LÕI THUẬT TOÁN ĐỒ THƯ PHI BÀN ĐỘN (CHUẨN 1:1 TỪ BẢN GỐC)
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
  const TRUNG_CUNG_TRIGRAM = BAT_QUAI.find(t => t.name === "Khôn"); // Ô số 5 trung cung quy ước quẻ Khôn

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
    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < matrix[r].length; c++) {
        const cell = matrix[r][c];
        if (cell === null) continue;
        if (String(cell).split("/").includes(v)) return [r, c];
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

  // Quẻ Thượng (Tiên Thiên — Hà Đồ & Bát Môn)
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

  // Quẻ Hạ (Hậu Thiên — Lạc Thư & đường 9 ô: Tháng -> Ngày -> Giờ)
  function getQueHa(thang, ngay, gio) {
    if (!(gio in DIA_CHI_ORDINAL)) throw new Error(`Giờ '${gio}' không hợp lệ.`);
    const thangCoord = findInMatrix(thang, THANG_MATRIX);
    const idx0 = indexOfCoord(LAC_THU_PATTERN, thangCoord);

    // Đi (ngay - 1) bước đến Ngày
    const daySteps = ngay - 1;
    const idxDay = (idx0 + daySteps) % LAC_THU_PATTERN.length;
    const dayCoord = LAC_THU_PATTERN[idxDay];

    // Tại ô Ngày, đặt làm giờ Tý, đi tiếp hourSteps bước đến Giờ lập quẻ
    const hourSteps = DIA_CHI_ORDINAL[gio];
    const idxFinal = (idxDay + hourSteps) % LAC_THU_PATTERN.length;
    const finalCoord = LAC_THU_PATTERN[idxFinal];

    const number = LAC_THU_MATRIX[finalCoord[0]][finalCoord[1]];
    const trigram = trigramFromHauThien(number);

    const dayPath = [];
    for (let i = 0; i <= daySteps; i++) {
      dayPath.push(LAC_THU_PATTERN[(idx0 + i) % LAC_THU_PATTERN.length]);
    }

    const hourPath = [];
    for (let i = 0; i <= hourSteps; i++) {
      hourPath.push(LAC_THU_PATTERN[(idxDay + i) % LAC_THU_PATTERN.length]);
    }

    // Ghép toàn bộ đường đi liên tục từ Tháng -> Ngày -> Giờ
    const haFullPath = dayPath.concat(hourPath.slice(1));

    return {
      trigram,
      number,
      thangCoord,
      dayCoord,
      finalCoord,
      daySteps,
      hourSteps,
      dayPath,
      hourPath,
      haFullPath
    };
  }

  // Hào Nguyên Đường: Lấy Tháng mod 6 (nếu = 0 lấy 6)
  function getHaoNguyenDuong(thang) {
    const h = thang % 6;
    return h === 0 ? 6 : h;
  }

  // Hào Động: Đặt hào nguyên đường là Tý, đếm khoảng cách tới Chi của Giờ lập quẻ, cộng dồn rồi mod 6 (nếu = 0 lấy 6)
  function getHaoDong(thang, gio) {
    if (!(gio in DIA_CHI_ORDINAL)) throw new Error(`Giờ '${gio}' không hợp lệ.`);
    const haoNguyenDuong = getHaoNguyenDuong(thang);
    const khoangCach = DIA_CHI_ORDINAL[gio];
    const raw = (haoNguyenDuong + khoangCach) % 6;
    const haoDong = raw === 0 ? 6 : raw;
    return { haoNguyenDuong, khoangCach, haoDong };
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
    lapQue(gio, canNgay, thang, ngay) {
      const thuong = getQueThuong(gio, canNgay);
      const ha = getQueHa(thang, ngay, gio);

      const gocBinary = ha.trigram.binary + thuong.trigram.binary; // Hào 1-3: Hạ, Hào 4-6: Thượng
      const gocName = `${thuong.trigram.name} / ${ha.trigram.name}`;
      const tenQueGocDich = getTenQueDichFromTrigrams(thuong.trigram.name, ha.trigram.name);

      const haoInfo = getHaoDong(thang, gio);
      const haoDong = haoInfo.haoDong;

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
        haoInfo,
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
   * [2. VIEW & VIEWMODEL] SVG GRID & BINDING TƯƠNG TÁC
   * ========================================================================= */
  const CELL = 76;
  const GAP_ORIGIN = 6;
  const SIZE = GAP_ORIGIN * 2 + CELL * 3; // 240px

  function cellCenter(r, c) {
    return [GAP_ORIGIN + c * CELL + CELL / 2, GAP_ORIGIN + r * CELL + CELL / 2];
  }

  function renderGrid(svgId, numberMatrix, labelMatrix, arrowColor) {
    const svg = host.querySelector(`#${svgId}`);
    if (!svg) return null;
    svg.innerHTML = "";
    svg.setAttribute("viewBox", `0 0 ${SIZE} ${SIZE}`);

    // Định nghĩa mũi tên arrowhead
    const defs = svgEl("defs");
    const marker = svgEl("marker", {
      id: `${svgId}-arrowhead`,
      markerWidth: "8",
      markerHeight: "8",
      refX: "6",
      refY: "3",
      orient: "auto",
      markerUnits: "strokeWidth"
    });
    const markerPath = svgEl("path", {
      d: "M0,0 L6,3 L0,6 Z",
      fill: arrowColor
    });
    marker.appendChild(markerPath);
    defs.appendChild(marker);
    svg.appendChild(defs);

    // Kẻ lưới 3x3
    for (let i = 0; i <= 3; i++) {
      svg.appendChild(svgEl("line", {
        x1: GAP_ORIGIN,
        y1: GAP_ORIGIN + i * CELL,
        x2: GAP_ORIGIN + 3 * CELL,
        y2: GAP_ORIGIN + i * CELL,
        stroke: "rgba(231,223,201,0.14)",
        "stroke-width": 1
      }));
      svg.appendChild(svgEl("line", {
        x1: GAP_ORIGIN + i * CELL,
        y1: GAP_ORIGIN,
        x2: GAP_ORIGIN + i * CELL,
        y2: GAP_ORIGIN + 3 * CELL,
        stroke: "rgba(231,223,201,0.14)",
        "stroke-width": 1
      }));
    }

    // Lớp hiệu ứng flash ô
    const fxLayer = svgEl("g", { class: "fx-layer" });
    svg.appendChild(fxLayer);

    // Nội dung ô (nhãn chữ & số)
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const [cx, cy] = cellCenter(r, c);
        const num = numberMatrix ? numberMatrix[r][c] : null;
        const lbl = labelMatrix ? labelMatrix[r][c] : null;

        if (lbl !== null && lbl !== undefined) {
          const t = svgEl("text", {
            x: cx,
            y: cy - (num !== null && num !== undefined ? 9 : 0),
            "text-anchor": "middle",
            "dominant-baseline": "middle",
            class: "cell-label",
            fill: "var(--paper-dim)",
            "font-size": 11,
            "font-family": "var(--font-mono, monospace)"
          });
          t.textContent = lbl;
          svg.appendChild(t);
        }

        if (num !== null && num !== undefined) {
          const isCenter = r === 1 && c === 1;
          const t = svgEl("text", {
            x: cx,
            y: cy + (lbl !== null && lbl !== undefined ? 11 : 0),
            "text-anchor": "middle",
            "dominant-baseline": "middle",
            class: "cell-num",
            fill: isCenter ? "var(--cinnabar)" : "var(--paper)",
            "font-size": 15,
            "font-family": "var(--font-mono, monospace)",
            "font-weight": isCenter ? "700" : "500"
          });
          t.textContent = num;
          svg.appendChild(t);
        }
      }
    }

    // Lớp vẽ đường mũi tên
    const arrowLayer = svgEl("g", { class: "arrow-layer" });
    svg.appendChild(arrowLayer);

    // Lớp highlight ô kết quả
    const resultLayer = svgEl("g", { class: "result-layer" });
    svg.appendChild(resultLayer);

    return { svg, fxLayer, arrowLayer, resultLayer };
  }

  function drawResultHighlight(resultLayer, coord, color) {
    if (!resultLayer || !coord) return;
    resultLayer.innerHTML = "";
    const [cx, cy] = cellCenter(coord[0], coord[1]);
    const rect = svgEl("rect", {
      x: cx - CELL / 2 + 3,
      y: cy - CELL / 2 + 3,
      width: CELL - 6,
      height: CELL - 6,
      rx: 6,
      fill: "none",
      stroke: color,
      "stroke-width": 2.5,
      opacity: 0.95
    });
    resultLayer.appendChild(rect);
  }

  function flashCell(fxLayer, coord, color, holdMs) {
    if (!fxLayer || !coord) return;
    const [cx, cy] = cellCenter(coord[0], coord[1]);
    const rect = svgEl("rect", {
      x: cx - CELL / 2 + 3,
      y: cy - CELL / 2 + 3,
      width: CELL - 6,
      height: CELL - 6,
      rx: 6,
      fill: color,
      opacity: 0
    });
    fxLayer.appendChild(rect);
    rect.style.transition = "opacity 90ms ease";
    requestAnimationFrame(() => { rect.style.opacity = 0.36; });
    setTimeout(() => {
      rect.style.opacity = 0;
      setTimeout(() => rect.remove(), 220);
    }, Math.max(holdMs - 90, 40));
  }

  function drawArrowSegment(arrowLayer, svgId, fromCoord, toCoord, color, animate = false) {
    if (!arrowLayer || !fromCoord || !toCoord) return;
    const [x1, y1] = cellCenter(fromCoord[0], fromCoord[1]);
    const [x2, y2] = cellCenter(toCoord[0], toCoord[1]);

    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.hypot(dx, dy) || 1;
    const shrink = 15; // Rút ngắn 2 đầu để không chạm vào số trong ô
    const ux = dx / len, uy = dy / len;
    const sx = x1 + ux * shrink, sy = y1 + uy * shrink;
    const ex = x2 - ux * shrink, ey = y2 - uy * shrink;

    const line = svgEl("line", {
      x1: sx, y1: sy,
      x2: ex, y2: ey,
      stroke: color,
      "stroke-width": 2.25,
      "stroke-linecap": "round",
      "marker-end": `url(#${svgId}-arrowhead)`,
      opacity: 0.88
    });

    if (animate) {
      const segLen = Math.hypot(ex - sx, ey - sy);
      line.setAttribute("stroke-dasharray", segLen);
      line.setAttribute("stroke-dashoffset", segLen);
      arrowLayer.appendChild(line);
      requestAnimationFrame(() => {
        line.style.transition = "stroke-dashoffset 240ms ease";
        line.setAttribute("stroke-dashoffset", "0");
      });
    } else {
      arrowLayer.appendChild(line);
    }
  }

  function drawStaticArrows(arrowLayer, svgId, path, color) {
    if (!arrowLayer) return;
    arrowLayer.innerHTML = "";
    if (!path || path.length < 2) return;
    for (let i = 1; i < path.length; i++) {
      drawArrowSegment(arrowLayer, svgId, path[i - 1], path[i], color, false);
    }
  }

  function playSteps(state, stepMs, btn, showArrows) {
    const { fxLayer, arrowLayer, path, color, svgId } = state;
    if (!path || path.length === 0) return;
    if (state.fadeTimeoutId) {
      clearTimeout(state.fadeTimeoutId);
      state.fadeTimeoutId = null;
    }
    if (btn) btn.disabled = true;
    arrowLayer.innerHTML = "";

    path.forEach((coord, i) => {
      setTimeout(() => {
        flashCell(fxLayer, coord, color, stepMs);
        if (showArrows && i > 0) {
          drawArrowSegment(arrowLayer, svgId, path[i - 1], coord, color, true);
        }
      }, i * stepMs);
    });

    const totalMs = path.length * stepMs;
    setTimeout(() => {
      if (btn) btn.disabled = false;
    }, totalMs + 150);
  }

  // Form Controls
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

  const PRESETS = [
    { gio: "Tý", can: "Giáp", thang: 1, ngay: 1 },
    { gio: "Thìn", can: "Kỷ", thang: 11, ngay: 15 },
    { gio: "Dậu", can: "Tân", thang: 9, ngay: 5 }
  ];

  host.querySelectorAll(".preset-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.dataset.preset, 10);
      const p = PRESETS[idx];
      if (p) {
        selGio.value = p.gio;
        selCan.value = p.can;
        selThang.value = p.thang;
        selNgay.value = p.ngay;
        cast();
      }
    });
  });

  let thuongSteps = { fxLayer: null, arrowLayer: null, svgId: "svg-hado", path: [], color: "", stepMs: 280 };
  let haSteps = { fxLayer: null, arrowLayer: null, svgId: "svg-lacthu", path: [], color: "", stepMs: 280 };

  function cast() {
    if (!selGio || !selCan || !selNgay || !selThang) return;
    const gio = selGio.value;
    const can = selCan.value;
    const ngay = parseInt(selNgay.value, 10);
    const thang = parseInt(selThang.value, 10);
    const showArrows = arrowToggle ? arrowToggle.checked : true;

    let r;
    try {
      r = DoThuModel.lapQue(gio, can, thang, ngay);
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

    // Step 1: Panel Hà Đồ (Quẻ Thượng)
    const gThuong = renderGrid("svg-hado", HA_DO_MATRIX, GIO_MATRIX, goldColor);
    if (gThuong) {
      drawResultHighlight(gThuong.resultLayer, r.thuong.finalCoord, goldColor);
      if (showArrows) {
        drawStaticArrows(gThuong.arrowLayer, "svg-hado", r.thuong.path, goldColor);
      }
      thuongSteps = {
        fxLayer: gThuong.fxLayer,
        arrowLayer: gThuong.arrowLayer,
        svgId: "svg-hado",
        path: r.thuong.path,
        color: goldColor,
        stepMs: 280
      };
    }

    const thuongDesc = host.querySelector("#thuong-desc");
    if (thuongDesc) {
      thuongDesc.innerHTML = `Giờ <b>${gio}</b> → đi <b>${r.thuong.steps}</b> bước bát môn đến Can <b>${can}</b> → Dừng tại ô số <b>${r.thuong.number}</b>.`;
    }
    const thuongSym = host.querySelector("#thuong-symbol");
    if (thuongSym) thuongSym.textContent = r.thuong.trigram.symbol;
    const thuongName = host.querySelector("#thuong-name");
    if (thuongName) thuongName.textContent = `Quẻ ${r.thuong.trigram.name}`;

    // Step 2: Panel Lạc Thư (Quẻ Hạ)
    const gHa = renderGrid("svg-lacthu", LAC_THU_MATRIX, THANG_MATRIX, jadeColor);
    if (gHa) {
      drawResultHighlight(gHa.resultLayer, r.ha.finalCoord, jadeColor);
      if (showArrows) {
        drawStaticArrows(gHa.arrowLayer, "svg-lacthu", r.ha.haFullPath, jadeColor);
      }
      haSteps = {
        fxLayer: gHa.fxLayer,
        arrowLayer: gHa.arrowLayer,
        svgId: "svg-lacthu",
        path: r.ha.haFullPath,
        color: jadeColor,
        stepMs: 280
      };
    }

    const haDesc = host.querySelector("#ha-desc");
    if (haDesc) {
      const haCenterHit = r.ha.finalCoord[0] === 1 && r.ha.finalCoord[1] === 1;
      haDesc.innerHTML = `Tháng <b>${thang}</b> → <b>${r.ha.daySteps}</b> bước đến Ngày <b>${ngay}</b> (đặt giờ Tý) → tiếp <b>${r.ha.hourSteps}</b> bước đến Giờ <b>${gio}</b>.` +
        (haCenterHit ? ' Dừng tại ô số 5 (trung cung) → quy ước lấy quẻ Khôn.' : ` Dừng tại ô số <b>${r.ha.number}</b>.`);
    }
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

    // Meta Thông Tin & Hào Động chuẩn xác
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
      haoDongFormula.innerHTML = `Nguyên đường (Tháng ${thang} mod 6 = ${r.haoInfo.haoNguyenDuong}) + Khoảng cách Tý→${gio} (${r.haoInfo.khoangCach}) = <b>Hào ${r.haoDong}</b>`;
    }

    const inputEcho = host.querySelector("#input-echo");
    if (inputEcho) {
      inputEcho.textContent = `Giờ ${gio} · Can ${can} · Ngày ${ngay} · Tháng ${thang}`;
    }
  }

  const castBtn = host.querySelector("#cast-btn");
  if (castBtn) castBtn.addEventListener("click", cast);

  const btnStepsThuong = host.querySelector("#steps-btn-thuong");
  if (btnStepsThuong) {
    btnStepsThuong.addEventListener("click", () => {
      playSteps(thuongSteps, thuongSteps.stepMs, btnStepsThuong, arrowToggle ? arrowToggle.checked : true);
    });
  }

  const btnStepsHa = host.querySelector("#steps-btn-ha");
  if (btnStepsHa) {
    btnStepsHa.addEventListener("click", () => {
      playSteps(haSteps, haSteps.stepMs, btnStepsHa, arrowToggle ? arrowToggle.checked : true);
    });
  }

  if (arrowToggle) {
    arrowToggle.addEventListener("change", () => {
      if (result && result.style.display === "block") {
        cast();
      }
    });
  }

  // Preset khởi tạo mặc định chuẩn
  if (selGio && !selGio.value) selGio.value = "Tý";
  if (selCan && !selCan.value) selCan.value = "Giáp";
  if (selNgay && !selNgay.value) selNgay.value = "1";
  if (selThang && !selThang.value) selThang.value = "1";

  window.cast = cast;
  window.__KD_CAST = cast;

  // Tự động lập quẻ ngay khi nạp module
  cast();
};
