/* =========================================================================
 * Dịch Học Ngũ Linh — Tầng Phi Tinh Cửu Cung & Cung Phi (js/core/flyingstar.js)
 * Cung cấp ma trận Khảm cơ sở, biến đổi phi tinh và tính Cung Phi bản mệnh.
 * ========================================================================= */

(function() {
  'use strict';

  window.KD_CORE = window.KD_CORE || {};

  const KHAM_BASE = [
    [2, 3, 7],
    [6, 1, 5],
    [4, 8, 9]
  ];

  // Biến thể A: Cung Sinh, Ma Phương
  const GUA_TRANSFORM_A = {
    'Khảm': 'e',
    'Khôn': 'rot270',
    'Chấn': 'flip_h',
    'Tốn': 'rot180',
    'Càn': 'rot90',
    'Đoài': 'flip_v',
    'Cấn': 'transpose',
    'Ly': 'anti_transpose'
  };

  // Biến thể B: Tam Tuyệt, Tam Ý, Tiểu Vận, Chân Linh
  const GUA_TRANSFORM_B = {
    'Khảm': 'e',
    'Khôn': 'transpose',
    'Chấn': 'rot90',
    'Tốn': 'rot180',
    'Càn': 'anti_transpose',
    'Đoài': 'rot270',
    'Cấn': 'flip_v',
    'Ly': 'flip_h'
  };

  const BIEN_KHI_MEANINGS = {
    "000": "Phục vị",
    "001": "Họa hại",
    "010": "Tuyệt mệnh",
    "011": "Lục sát",
    "100": "Sinh khí",
    "101": "Diên niên",
    "110": "Ngũ quỷ",
    "111": "Thiên y"
  };

  const KD_FLYINGSTAR = {
    KHAM_BASE,
    GUA_TRANSFORM_A,
    GUA_TRANSFORM_B,
    BIEN_KHI_MEANINGS,

    /**
     * Biến đổi hình học ma trận 3×3 (xoay, lật, chuyển vị)
     */
    transform(matrix, kind) {
      const n = 3;
      const result = [[0,0,0],[0,0,0],[0,0,0]];
      for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
          const r0 = r - 1, c0 = c - 1;
          let nr0, nc0;
          if (kind === 'e') { nr0 = r0; nc0 = c0; }
          else if (kind === 'rot90') { nr0 = c0; nc0 = -r0; }
          else if (kind === 'rot180') { nr0 = -r0; nc0 = -c0; }
          else if (kind === 'rot270') { nr0 = -c0; nc0 = r0; }
          else if (kind === 'flip_h') { nr0 = r0; nc0 = -c0; }
          else if (kind === 'flip_v') { nr0 = -r0; nc0 = c0; }
          else if (kind === 'transpose') { nr0 = c0; nc0 = r0; }
          else if (kind === 'anti_transpose') { nr0 = -c0; nc0 = -r0; }
          else { nr0 = r0; nc0 = c0; }
          result[nr0 + 1][nc0 + 1] = matrix[r][c];
        }
      }
      return result;
    },

    /**
     * Tính ma trận phi tinh theo quẻ và số trung cung
     * @param {string} gua - Tên quẻ (Khảm, Khôn, Chấn...)
     * @param {number} centerNumber - Số nhập trung cung (1..9)
     * @param {string} variant - 'A' (Cung Sinh, Ma Phương) hoặc 'B' (Tam Tuyệt, Tam Ý, Tiểu Vận, Chân Linh)
     */
    getMatrix(gua, centerNumber, variant = 'A') {
      const mapping = variant === 'B' ? GUA_TRANSFORM_B : GUA_TRANSFORM_A;
      const kind = mapping[gua] || 'e';
      const transformed = KD_FLYINGSTAR.transform(KHAM_BASE, kind);
      const shift = ((centerNumber - 1) % 9 + 9) % 9;
      const result = [[0,0,0],[0,0,0],[0,0,0]];
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          result[r][c] = ((transformed[r][c] - 1 + shift) % 9) + 1;
        }
      }
      return result;
    },

    /**
     * Tính quẻ Cung Phi từ năm sinh và giới tính
     * @param {number} year - Năm sinh âm lịch (ví dụ 1990)
     * @param {string} gender - 'Nam' hoặc 'Nữ'
     */
    calculateCungPhi(year, gender = 'Nam') {
      const yearStr = String(year);
      let yearSum = 0;
      for (const ch of yearStr) {
        if (ch >= '0' && ch <= '9') yearSum += parseInt(ch, 10);
      }
      let cungPhiNum = yearSum % 9;
      if (cungPhiNum === 0) cungPhiNum = 9;

      const isMale = String(gender).toLowerCase().includes('nam');
      const baseGua = isMale ? 'Khôn' : 'Càn';
      const centerVal = isMale ? 2 : 6;
      
      const matrix = KD_FLYINGSTAR.getMatrix(baseGua, centerVal, 'A');
      
      // Vị trí trên ma trận Lạc Thư
      const LAC_THU_TO_GUA = {
        '0,0': 'Tốn', '0,1': 'Ly', '0,2': 'Khôn',
        '1,0': 'Chấn', '1,1': 'Trung Cung', '1,2': 'Đoài',
        '2,0': 'Cấn', '2,1': 'Khảm', '2,2': 'Càn'
      };

      let foundPos = null;
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          if (matrix[r][c] === cungPhiNum) {
            foundPos = [r, c];
            break;
          }
        }
        if (foundPos) break;
      }

      let guaName = "Khôn";
      if (foundPos) {
        const visualPos = [2 - foundPos[0], foundPos[1]];
        const key = `${visualPos[0]},${visualPos[1]}`;
        guaName = LAC_THU_TO_GUA[key] || "Khôn";
        if (guaName === "Trung Cung") {
          guaName = isMale ? "Khôn" : "Cấn";
        }
      }

      return {
        year, gender, yearSum, cungPhiNum,
        baseGua, centerVal, matrix,
        cungPhiGua: guaName
      };
    },

    /**
     * Tính biến khí (Du Niên) giữa 2 quẻ đơn qua XOR nhị phân 3 bit
     */
    calculateBienKhi(gua1, gua2) {
      const data = window.KD_DATA || (window.KD_CORE && window.KD_CORE.DATA);
      const toBin = (data && data.TRIGRAM_TO_BIN) || {
        "Càn": "111", "Đoài": "110", "Ly": "101", "Chấn": "100",
        "Tốn": "011", "Khảm": "010", "Cấn": "001", "Khôn": "000"
      };

      const b1 = toBin[gua1] || "000";
      const b2 = toBin[gua2] || "000";

      let xorResult = "";
      for (let i = 0; i < 3; i++) {
        xorResult += (b1[i] !== b2[i] ? "1" : "0");
      }

      const meaning = BIEN_KHI_MEANINGS[xorResult] || "Phục vị";
      return {
        binary1: b1,
        binary2: b2,
        xorBinary: xorResult,
        meaning
      };
    }
  };

  window.KD_CORE.FLYINGSTAR = KD_FLYINGSTAR;
  window.KD_FLYINGSTAR = KD_FLYINGSTAR;
})();
