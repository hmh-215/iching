/* =========================================================================
 * Dịch Học Ngũ Linh — Lõi Tương Tác Tra Cứu Luận Giải Quẻ & Khí (js/core/interpret.js)
 * Đáp ứng tương tác theo Ảnh 2 (bấm thẻ quẻ xem luận giải 64 quẻ)
 * và Ảnh 3 (bấm ô khí xem luận giải Bát khí Chân Linh Nhân Độn).
 * ========================================================================= */

(function() {
  'use strict';

  const CACHE = {
    luan64: null,
    khiClndd: null,
    bienKhi: null
  };

  const ELEMENT_CODE = {
    'Thiên': '111', 'Càn': '111',
    'Trạch': '110', 'Đoài': '110',
    'Hỏa':   '101', 'Ly':   '101',
    'Lôi':   '100', 'Chấn': '100',
    'Phong': '011', 'Tốn':  '011',
    'Thủy':  '010', 'Khảm': '010',
    'Sơn':   '001', 'Cấn':  '001',
    'Địa':   '000', 'Khôn': '000'
  };

  const CODE_SYMBOL = {
    '111': '☰', '110': '☱', '101': '☲', '100': '☳',
    '011': '☴', '010': '☵', '001': '☶', '000': '☷'
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
      if (!r.ok) throw new Error('Không tải được ' + url);
      return r.json();
    });
  }

  async function getLuan64() {
    if (!CACHE.luan64) {
      try {
        CACHE.luan64 = await fetchJSON('data/luan64.json');
      } catch (e) {
        console.warn('Lỗi nạp luan64.json:', e);
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
        console.warn('Lỗi nạp khi_clndd.json:', e);
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
        console.warn('Lỗi nạp bienkhi.json:', e);
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
    if (words[0] === 'Thuần') {
      const code = ELEMENT_CODE[words[1]];
      return code ? code + code : null;
    }
    const upper = ELEMENT_CODE[words[0]];
    const lower = ELEMENT_CODE[words[1]];
    if (!upper || !lower) return null;
    // Thứ tự 6 hào: hào 1-3 (quẻ hạ) + hào 4-6 (quẻ thượng)
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

  /* -------------------------------------------------------------------------
   * QUẢN LÝ POPUP TRẠNG THÁI TẬP TRUNG (Single active popup lifecycle)
   * ------------------------------------------------------------------------- */
  let activePopup = null;
  let activeAnchor = null;

  function closeAllPopups() {
    // 1. Gỡ bỏ tất cả thẻ popup luận giải đang hiển thị
    document.querySelectorAll('.kd-interp-card').forEach(c => c.remove());
    // 2. Phục hồi hiển thị đầy đủ cho toàn bộ các thẻ quẻ đã bị ẩn (display: none -> display: '')
    document.querySelectorAll('.hexagram-card').forEach(c => {
      if (c.style.display === 'none') {
        c.style.display = '';
      }
    });
    activePopup = null;
    activeAnchor = null;
  }

  // Đóng nhanh bằng phím Escape
  document.addEventListener('keydown', function(ev) {
    if (ev.key === 'Escape' || ev.key === 'Esc') {
      if (activePopup) {
        closeAllPopups();
      }
    }
  });

  /* -------------------------------------------------------------------------
   * HIỂN THỊ LUẬN GIẢI 64 QUẺ (Ảnh 2)
   * ------------------------------------------------------------------------- */
  async function showHexInterpretation(hexQuery, anchorEl) {
    if (!hexQuery || !anchorEl) return;

    // Nếu chính thẻ này đang mở popup thì bấm lại sẽ đóng (toggle)
    if (activeAnchor === anchorEl && activePopup) {
      closeAllPopups();
      return;
    }

    // Đóng bất kỳ popup nào đang mở trước khi mở popup mới
    closeAllPopups();

    const list = await getLuan64();
    let q = null;

    if (typeof hexQuery === 'number') {
      q = list.find(x => x.num === hexQuery);
    } else if (typeof hexQuery === 'string') {
      let clean = hexQuery
        .replace(/^[0-9]+[\.\s\-:]+/g, '') // Bỏ số thứ tự đầu dòng (01. ...)
        .replace(/[\u2630-\u2637]/g, '')   // Bỏ biểu tượng quái Unicode (☰☱☲☳☴☵☶☷)
        .replace(/\(.*?\)/g, '')          // Bỏ thông tin trong ngoặc (Khôn / Càn)
        .trim();

      // Bảng map tên quẻ đơn (Bát Thuần) và các cách gọi biến thể (e.g. Càn Vi Thiên)
      const EXACT_MAP = {
        'càn': 'Thuần Càn',
        'càn vi thiên': 'Thuần Càn',
        'khôn': 'Thuần Khôn',
        'khôn vi địa': 'Thuần Khôn',
        'khảm': 'Thuần Khảm',
        'khảm vi thủy': 'Thuần Khảm',
        'khảm vi thuỷ': 'Thuần Khảm',
        'ly': 'Thuần Ly',
        'ly vi hỏa': 'Thuần Ly',
        'ly vi hoả': 'Thuần Ly',
        'chấn': 'Thuần Chấn',
        'chấn vi lôi': 'Thuần Chấn',
        'cấn': 'Thuần Cấn',
        'cấn vi sơn': 'Thuần Cấn',
        'tốn': 'Thuần Tốn',
        'tốn vi phong': 'Thuần Tốn',
        'đoài': 'Thuần Đoài',
        'đoài vi trạch': 'Thuần Đoài'
      };

      const lowerClean = clean.toLowerCase();
      if (EXACT_MAP[lowerClean]) {
        clean = EXACT_MAP[lowerClean];
      }

      // 1. Khớp chính xác có dấu tiếng Việt (ngăn ngừa tuyệt đối nhầm lẫn Càn vs Cấn)
      q = list.find(x => x.name.trim().toLowerCase() === clean.toLowerCase());

      // 2. Khớp chuỗi con có dấu tiếng Việt
      if (!q) {
        const clLower = clean.toLowerCase();
        q = list.find(x => {
          const nl = x.name.trim().toLowerCase();
          return nl.includes(clLower) || clLower.includes(nl);
        });
      }

      // 3. Khớp không dấu (norm) có kèm bảo vệ Càn / Cấn
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
      console.warn('Không tìm thấy quẻ trong data/luan64.json:', hexQuery);
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

    // Nút đóng đầu thẻ: Nổi bật, tương phản cao, rõ ràng
    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'kd-interp-close';
    closeBtn.innerHTML = '<span style="font-weight:700;font-size:14px;line-height:1;">✕</span><span>Đóng</span>';
    closeBtn.title = 'Đóng luận giải (Esc hoặc bấm ra ngoài)';
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

    // BẮT BUỘC theo Ảnh 2: các thẻ <details> con (hào từ, lời quẻ) mặc định collapse
    body.querySelectorAll('details').forEach(d => {
      d.open = false;
    });

    card.appendChild(body);

    // Nút đóng cuối thẻ (footer) hỗ trợ người dùng đóng nhanh sau khi cuộn đọc nội dung dài
    const footer = document.createElement('div');
    footer.className = 'kd-interp-footer';
    const footerCloseBtn = document.createElement('button');
    footerCloseBtn.type = 'button';
    footerCloseBtn.className = 'kd-interp-close';
    footerCloseBtn.innerHTML = '<span style="font-weight:700;font-size:14px;line-height:1;">✕</span><span>Đóng luận giải</span>';
    footerCloseBtn.title = 'Đóng luận giải (Esc hoặc bấm ra ngoài)';
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

  /* -------------------------------------------------------------------------
   * HIỂN THỊ LUẬN GIẢI BÁT KHÍ CLNĐĐ (Ảnh 3)
   * ------------------------------------------------------------------------- */
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
      console.warn('Không tìm thấy giải thích khí:', khiName);
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

    // Nút đóng đầu thẻ
    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'kd-interp-close';
    closeBtn.innerHTML = '<span style="font-weight:700;font-size:14px;line-height:1;">✕</span><span>Đóng</span>';
    closeBtn.title = 'Đóng luận giải (Esc hoặc bấm ra ngoài)';
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

    // Nút đóng cuối thẻ
    const footer = document.createElement('div');
    footer.className = 'kd-interp-footer';
    const footerCloseBtn = document.createElement('button');
    footerCloseBtn.type = 'button';
    footerCloseBtn.className = 'kd-interp-close';
    footerCloseBtn.innerHTML = '<span style="font-weight:700;font-size:14px;line-height:1;">✕</span><span>Đóng luận giải</span>';
    footerCloseBtn.title = 'Đóng luận giải (Esc hoặc bấm ra ngoài)';
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

  /* -------------------------------------------------------------------------
   * EVENT DELEGATION TOÀN CỤC (Click Outside & Hexagram/Khi Click)
   * ------------------------------------------------------------------------- */
  document.addEventListener('click', function(ev) {
    // 1. Nếu click bên trong thẻ luận giải -> không làm gì, để người dùng cuộn xem nội dung
    if (ev.target.closest('.kd-interp-card')) return;

    // 2. Thẻ quẻ (.hexagram-card) — Ảnh 2
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

    // 3. Chip Khí (Chân Linh Nhân Độn) — Ảnh 3
    const chipEl = ev.target.closest('#t3-chung-chips .chip, #t3-rieng-chips .chip, .chip, [data-khi]');
    if (chipEl) {
      const labelEl = chipEl.querySelector('.chip-lbl, .label');
      const valEl = chipEl.querySelector('.chip-val, .val, .value');
      const labelText = labelEl ? labelEl.textContent.trim() : '';
      const valText = valEl ? valEl.textContent.trim() : chipEl.textContent.trim();

      if (/khí/i.test(labelText) || /khí/i.test(valText) || chipEl.hasAttribute('data-khi')) {
        const khiName = valText || labelText;
        if (khiName && khiName !== '—') {
          ev.preventDefault();
          showKhiInterpretation(khiName, chipEl);
          return;
        }
      }
    }

    // 4. Nếu người dùng bấm chuột ra ngoài màn hình (không phải popup, không phải thẻ quẻ / chip)
    // -> TỰ ĐỘNG ĐÓNG POP-UP ĐANG MỞ
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
