/* =========================================================================
 * Dịch Học Ngũ Linh — Nạp Lục Thân dùng chung (js/core/lucthan.js)
 *
 * Lõi thuật toán chuyển nguyên văn từ tim_luc_than_que.html
 * (Tim_luc_than_que.ipynb): nạp chi từng hào → ngũ hành → họ của quẻ
 * → lục thân. KHÔNG đổi logic, chỉ đóng gói lại để mọi module có
 * Quẻ Gốc + Quẻ Biến gọi chung.
 *
 * Quy ước nhị phân giống toàn app: chuỗi 6 bit, ký tự đầu = hào 1,
 * bit 0..2 = Quẻ Hạ, bit 3..5 = Quẻ Thượng.
 *
 * Hiển thị (KD_LUCTHAN.renderPair):
 *   - Quẻ Gốc: nhãn lục thân viết tắt cho đủ 6 hào.
 *   - Quẻ Biến: chỉ ghi nhãn ở hào động (hào khác nhau giữa gốc và biến).
 *     Lục thân hào biến = ngũ hành địa chi của hào đó trong quẻ biến,
 *     so với ngũ hành HỌ CỦA QUẺ GỐC.
 * ========================================================================= */

(function () {
  'use strict';

  window.KD_CORE = window.KD_CORE || {};

  /* ---------- Bước 1: 8 quẻ ---------- */
  const trigrams = ['Càn', 'Đoài', 'Ly', 'Chấn', 'Tốn', 'Khảm', 'Cấn', 'Khôn'];

  const BIN_TO_TRIGRAM = {
    '111': 'Càn', '110': 'Đoài', '101': 'Ly', '100': 'Chấn',
    '011': 'Tốn', '010': 'Khảm', '001': 'Cấn', '000': 'Khôn'
  };

  /* ---------- Bước 2: Nạp chi của từng hào ---------- */
  const nap_chi_map_lower = {
    'Càn':  {1: 'Tý',   2: 'Dần', 3: 'Thìn'},
    'Chấn': {1: 'Tý',   2: 'Dần', 3: 'Thìn'},
    'Khảm': {1: 'Dần',  2: 'Thìn',3: 'Ngọ'},
    'Cấn':  {1: 'Thìn', 2: 'Ngọ', 3: 'Thân'},
    'Đoài': {1: 'Tỵ',   2: 'Mão', 3: 'Sửu'},
    'Ly':   {1: 'Mão',  2: 'Sửu', 3: 'Hợi'},
    'Tốn':  {1: 'Sửu',  2: 'Hợi', 3: 'Dậu'},
    'Khôn': {1: 'Mùi',  2: 'Tỵ',  3: 'Mão'}
  };

  const nap_chi_map_upper = {
    'Càn':  {4: 'Ngọ',  5: 'Thân', 6: 'Tuất'},
    'Chấn': {4: 'Ngọ',  5: 'Thân', 6: 'Tuất'},
    'Khảm': {4: 'Thân', 5: 'Tuất', 6: 'Tý'},
    'Cấn':  {4: 'Tuất', 5: 'Tý',   6: 'Dần'},
    'Đoài': {4: 'Hợi',  5: 'Dậu',  6: 'Mùi'},
    'Ly':   {4: 'Dậu',  5: 'Mùi',  6: 'Tỵ'},
    'Tốn':  {4: 'Mùi',  5: 'Tỵ',   6: 'Mão'},
    'Khôn': {4: 'Sửu',  5: 'Hợi',  6: 'Dậu'}
  };

  function get_nap_chi(trigram, hao_number) {
    if (hao_number >= 1 && hao_number <= 3) {
      const m = nap_chi_map_lower[trigram];
      return m ? (m[hao_number] ?? null) : null;
    } else if (hao_number >= 4 && hao_number <= 6) {
      const m = nap_chi_map_upper[trigram];
      return m ? (m[hao_number] ?? null) : null;
    }
    return null;
  }

  const ngu_hanh_map = {
    'Tý': 'Thủy', 'Hợi': 'Thủy',
    'Sửu': 'Thổ', 'Mùi': 'Thổ', 'Thìn': 'Thổ', 'Tuất': 'Thổ',
    'Dần': 'Mộc', 'Mão': 'Mộc',
    'Tỵ': 'Hỏa', 'Ngọ': 'Hỏa',
    'Thân': 'Kim', 'Dậu': 'Kim'
  };

  function get_ngu_hanh(dia_chi) {
    return ngu_hanh_map[dia_chi] ?? null;
  }

  /* ---------- Bước 3: Họ của quẻ ---------- */
  const tien_thien_map = {
    'Càn': 1, 'Đoài': 2, 'Ly': 3, 'Chấn': 4,
    'Tốn': 5, 'Khảm': 6, 'Cấn': 7, 'Khôn': 8
  };

  const cung_nghi_trigrams = ['Càn', 'Đoài', 'Ly', 'Chấn'];
  const khac_nghi_trigrams = ['Tốn', 'Khảm', 'Cấn', 'Khôn'];

  function calculate_ho_cua_que(upper_trigram, lower_trigram) {
    const upper_tien_thien = tien_thien_map[upper_trigram];
    const lower_tien_thien = tien_thien_map[lower_trigram];

    if (upper_tien_thien === undefined || lower_tien_thien === undefined) {
      return null;
    }

    const total_tien_thien = upper_tien_thien + lower_tien_thien;

    if (total_tien_thien % 2 !== 0) { // Tổng số ra số lẻ
      const ho_tien_thien = 9 - lower_tien_thien;
      for (const [trigram_name, value] of Object.entries(tien_thien_map)) {
        if (value === ho_tien_thien) return trigram_name;
      }
    } else { // Tổng số ra số chẵn
      const upper_is_cung_nghi = cung_nghi_trigrams.includes(upper_trigram);
      const lower_is_cung_nghi = cung_nghi_trigrams.includes(lower_trigram);

      if ((upper_is_cung_nghi && lower_is_cung_nghi) || (!upper_is_cung_nghi && !lower_is_cung_nghi)) {
        return lower_trigram; // Cùng nghi
      } else {
        return upper_trigram; // Khác nghi
      }
    }
    return null;
  }

  /* ---------- Bước 4: Lục thân của các hào ---------- */
  const tuong_sinh_map = { 'Kim': 'Thủy', 'Thủy': 'Mộc', 'Mộc': 'Hỏa', 'Hỏa': 'Thổ', 'Thổ': 'Kim' };
  const tuong_khac_map = { 'Kim': 'Mộc', 'Mộc': 'Thổ', 'Thổ': 'Thủy', 'Thủy': 'Hỏa', 'Hỏa': 'Kim' };

  const ho_cua_que_ngu_hanh_map = {
    'Càn': 'Kim', 'Đoài': 'Kim', 'Ly': 'Hỏa', 'Chấn': 'Mộc',
    'Tốn': 'Mộc', 'Khảm': 'Thủy', 'Cấn': 'Thổ', 'Khôn': 'Thổ'
  };

  function tinh_luc_than(ngu_hanh_ho_cua_que, ngu_hanh_hao) {
    if (ngu_hanh_ho_cua_que === ngu_hanh_hao) {
      return 'Huynh đệ';
    } else if (tuong_sinh_map[ngu_hanh_ho_cua_que] === ngu_hanh_hao) {
      return 'Tử tôn';
    } else if (tuong_khac_map[ngu_hanh_ho_cua_que] === ngu_hanh_hao) {
      return 'Thê tài';
    } else if (tuong_sinh_map[ngu_hanh_hao] === ngu_hanh_ho_cua_que) {
      return 'Phụ mẫu';
    } else if (tuong_khac_map[ngu_hanh_hao] === ngu_hanh_ho_cua_que) {
      return 'Quan quỷ';
    }
    return 'Không xác định';
  }

  /* =======================================================================
   * Đóng gói dùng chung
   * ======================================================================= */

  const ABBR = {
    'Huynh đệ': 'HĐ', 'Tử tôn': 'TTn', 'Thê tài': 'ThT',
    'Phụ mẫu': 'PM', 'Quan quỷ': 'QQ', 'Không xác định': '?'
  };
  const CLS = {
    'Huynh đệ': 'lt-hd', 'Tử tôn': 'lt-ttn', 'Thê tài': 'lt-tht',
    'Phụ mẫu': 'lt-pm', 'Quan quỷ': 'lt-qq', 'Không xác định': 'lt-unk'
  };

  function isBinary6(b) { return typeof b === 'string' && /^[01]{6}$/.test(b); }

  function trigramsOf(binary6) {
    return { lower: BIN_TO_TRIGRAM[binary6.slice(0, 3)], upper: BIN_TO_TRIGRAM[binary6.slice(3, 6)] };
  }

  /** Quan hệ ngũ hành giữa họ quẻ và hào, viết thành câu ngắn cho phần diễn giải */
  function quanHe(nhHo, nhHao) {
    if (nhHo === nhHao) return `${nhHao} đồng hành ${nhHo}`;
    if (tuong_sinh_map[nhHo] === nhHao) return `${nhHo} sinh ${nhHao}`;
    if (tuong_khac_map[nhHo] === nhHao) return `${nhHo} khắc ${nhHao}`;
    if (tuong_sinh_map[nhHao] === nhHo) return `${nhHao} sinh ${nhHo}`;
    if (tuong_khac_map[nhHao] === nhHo) return `${nhHao} khắc ${nhHo}`;
    return '—';
  }

  /** Thông tin 1 hào trong quẻ binary6, so với ngũ hành họ đã cho */
  function haoInfo(binary6, hao, nhHo) {
    const t = trigramsOf(binary6);
    const trigram = hao <= 3 ? t.lower : t.upper;
    const chi = get_nap_chi(trigram, hao);
    const nguHanh = get_ngu_hanh(chi);
    const lucThan = tinh_luc_than(nhHo, nguHanh);
    return { hao, trigram, viTri: hao <= 3 ? 'Hạ' : 'Thượng', chi, nguHanh, lucThan, abbr: ABBR[lucThan], quanHe: quanHe(nhHo, nguHanh) };
  }

  /** Phân tích đủ 6 hào của 1 quẻ (theo đúng các bước của module gốc) */
  function analyze(binary6) {
    if (!isBinary6(binary6)) return null;
    const { upper, lower } = trigramsOf(binary6);
    const ho = calculate_ho_cua_que(upper, lower);
    const nhHo = ho_cua_que_ngu_hanh_map[ho];
    const ttUpper = tien_thien_map[upper], ttLower = tien_thien_map[lower];
    const tong = ttUpper + ttLower;
    let hoFormula;
    if (tong % 2 !== 0) {
      hoFormula = `${ttUpper} + ${ttLower} = ${tong} (lẻ) → 9 − ${ttLower} = ${9 - ttLower}`;
    } else {
      const cung = cung_nghi_trigrams.includes(upper) === cung_nghi_trigrams.includes(lower);
      hoFormula = `${ttUpper} + ${ttLower} = ${tong} (chẵn) → ${cung ? 'cùng nghi → lấy Quẻ Hạ' : 'khác nghi → lấy Quẻ Thượng'}`;
    }
    const hao = [];
    for (let i = 1; i <= 6; i++) hao.push(haoInfo(binary6, i, nhHo));
    return { binary: binary6, upper, lower, ho, nhHo, ttUpper, ttLower, tong, hoFormula, hao };
  }

  /** Các hào động = vị trí khác nhau giữa quẻ gốc và quẻ biến */
  function changedHao(gocBinary, bienBinary) {
    const out = [];
    if (!isBinary6(gocBinary) || !isBinary6(bienBinary)) return out;
    for (let i = 0; i < 6; i++) if (gocBinary[i] !== bienBinary[i]) out.push(i + 1);
    return out;
  }

  /** Phân tích cặp Gốc/Biến: đủ 6 hào gốc + các hào động ở quẻ biến (so với họ quẻ gốc) */
  function analyzePair(gocBinary, bienBinary) {
    const goc = analyze(gocBinary);
    if (!goc) return null;
    const dong = changedHao(gocBinary, bienBinary);
    const bien = dong.map(h => haoInfo(bienBinary, h, goc.nhHo));
    const bt = isBinary6(bienBinary) ? trigramsOf(bienBinary) : null;
    return { goc, dong, bien, bienUpper: bt && bt.upper, bienLower: bt && bt.lower };
  }

  function resolveEl(el) {
    if (!el) return null;
    return typeof el === 'string' ? document.getElementById(el) : el;
  }

  /** Gắn nhãn vào các .bar-row đã được KD_GRID.renderBars vẽ sẵn */
  function tagRows(container, infos, opts) {
    if (!container) return;
    container.classList.add('has-lt');
    container.querySelectorAll('.lt-tag').forEach(n => n.remove());
    infos.forEach(info => {
      const row = container.querySelector(`.bar-row[data-hao="${info.hao}"]`);
      if (!row) return;
      if (opts && opts.markDynamic) row.classList.add('dynamic', 'active', 'lt-bien-dong');
      const tag = document.createElement('span');
      tag.className = 'lt-tag ' + CLS[info.lucThan];
      tag.textContent = info.abbr;
      tag.title = info.lucThan;
      row.appendChild(tag);
    });
  }

  /**
   * Gắn lục thân cho cặp Quẻ Gốc / Quẻ Biến (gọi SAU khi đã renderBars).
   * @returns kết quả analyzePair (dùng lại cho phần diễn giải)
   */
  function renderPair(gocContainer, bienContainer, gocBinary, bienBinary) {
    const r = analyzePair(gocBinary, bienBinary);
    if (!r) return null;
    tagRows(resolveEl(gocContainer), r.goc.hao);
    if (bienContainer) tagRows(resolveEl(bienContainer), r.bien, { markDynamic: true });
    return r;
  }

  function tenQue(upper, lower) {
    return (window.KD_DICH && window.KD_DICH.getName) ? window.KD_DICH.getName(upper, lower) : `${upper}/${lower}`;
  }

  /** HTML các bước trung gian — nối vào cuối phần "Các bước tính" của module */
  function stepsHtml(gocBinary, bienBinary, title) {
    const r = analyzePair(gocBinary, bienBinary);
    if (!r) return '';
    const g = r.goc;
    let h = `<div class="lt-steps"><div class="lt-steps-head">${title || 'Nạp Lục Thân'}</div>`;
    h += `- Quẻ Gốc: <b>${tenQue(g.upper, g.lower)}</b> · Thượng ${g.upper} / Hạ ${g.lower}<br>`;
    h += `- Họ của quẻ (số tiên thiên ${g.upper} + ${g.lower}): ${g.hoFormula} → Họ <b>${g.ho}</b> (${g.nhHo})<br>`;
    h += `- Nạp chi → ngũ hành → lục thân từng hào:<br>`;
    for (let i = 5; i >= 0; i--) {
      const x = g.hao[i];
      h += `&nbsp;&nbsp;Hào ${x.hao} (${x.viTri} · ${x.trigram}): ${x.chi} → ${x.nguHanh} (${x.quanHe}) → <b>${x.lucThan}</b> (${x.abbr})<br>`;
    }
    if (r.dong.length && r.bienUpper) {
      h += `- Quẻ Biến: <b>${tenQue(r.bienUpper, r.bienLower)}</b> · lục thân hào động tính theo ngũ hành họ Quẻ Gốc (${g.nhHo}):<br>`;
      r.bien.forEach(x => {
        h += `&nbsp;&nbsp;Hào ${x.hao} biến (${x.viTri} · ${x.trigram}): ${x.chi} → ${x.nguHanh} (${x.quanHe}) → <b>${x.lucThan}</b> (${x.abbr})<br>`;
      });
    }
    h += `<span class="lt-legend">HĐ = Huynh đệ · TTn = Tử tôn · ThT = Thê tài · PM = Phụ mẫu · QQ = Quan quỷ</span></div>`;
    return h;
  }

  const KD_LUCTHAN = {
    trigrams, get_nap_chi, get_ngu_hanh, calculate_ho_cua_que, tinh_luc_than,
    ho_cua_que_ngu_hanh_map, tien_thien_map, cung_nghi_trigrams, khac_nghi_trigrams,
    ABBR, analyze, analyzePair, changedHao, renderPair, stepsHtml
  };

  window.KD_CORE.LUCTHAN = KD_LUCTHAN;
  window.KD_LUCTHAN = KD_LUCTHAN;
})();
