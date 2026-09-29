/* =========================================================================
 * Dịch Học Ngũ Linh — Tầng Dữ Liệu Dùng Chung (js/core/data.js)
 * Tập trung hóa Bát Quái, 64 Quẻ, Can Chi, 60 Hoa Giáp và phép toán Dịch học.
 * ========================================================================= */

(function() {
  'use strict';

  window.KD_CORE = window.KD_CORE || {};

  const THIEN_CAN = ["Giáp","Ất","Bính","Đinh","Mậu","Kỷ","Canh","Tân","Nhâm","Quý"];
  const DIA_CHI = ["Tý","Sửu","Dần","Mão","Thìn","Tỵ","Ngọ","Mùi","Thân","Dậu","Tuất","Hợi"];

  const CAN_DUONG = ["Giáp","Bính","Mậu","Canh","Nhâm"];
  const CAN_AM = ["Ất","Đinh","Kỷ","Tân","Quý"];
  const CHI_DUONG = ["Tý","Dần","Thìn","Ngọ","Thân","Tuất"];
  const CHI_AM = ["Sửu","Mão","Tỵ","Mùi","Dậu","Hợi"];

  // 60 Hoa Giáp
  const LUC_THAP_HOA_GIAP = [
    "Giáp Tý","Ất Sửu","Bính Dần","Đinh Mão","Mậu Thìn","Kỷ Tỵ","Canh Ngọ","Tân Mùi","Nhâm Thân","Quý Dậu",
    "Giáp Tuất","Ất Hợi","Bính Tý","Đinh Sửu","Mậu Dần","Kỷ Mão","Canh Thìn","Tân Tỵ","Nhâm Ngọ","Quý Mùi",
    "Giáp Thân","Ất Dậu","Bính Tuất","Đinh Hợi","Mậu Tý","Kỷ Sửu","Canh Dần","Tân Mão","Nhâm Thìn","Quý Tỵ",
    "Giáp Ngọ","Ất Mùi","Bính Thân","Đinh Dậu","Mậu Tuất","Kỷ Hợi","Canh Tý","Tân Sửu","Nhâm Dần","Quý Mão",
    "Giáp Thìn","Ất Tỵ","Bính Ngọ","Đinh Mùi","Mậu Thân","Kỷ Dậu","Canh Tuất","Tân Hợi","Nhâm Tý","Quý Sửu",
    "Giáp Dần","Ất Mão","Bính Thìn","Đinh Tỵ","Mậu Ngọ","Kỷ Mùi","Canh Thân","Tân Dậu","Nhâm Tuất","Quý Hợi"
  ];

  // Bát Quái
  const TRIGRAM_SYMBOL = {
    "Càn": "☰", "Đoài": "☱", "Ly": "☲", "Chấn": "☳",
    "Tốn": "☴", "Khảm": "☵", "Cấn": "☶", "Khôn": "☷"
  };

  const TRIGRAM_TUONG = {
    "Càn": "Thiên", "Đoài": "Trạch", "Ly": "Hỏa", "Chấn": "Lôi",
    "Tốn": "Phong", "Khảm": "Thủy", "Cấn": "Sơn", "Khôn": "Địa"
  };

  const TRIGRAM_TO_BIN = {
    "Càn": "111", "Đoài": "110", "Ly": "101", "Chấn": "100",
    "Tốn": "011", "Khảm": "010", "Cấn": "001", "Khôn": "000"
  };

  const BIN_TO_TRIGRAM = {
    "111": "Càn", "110": "Đoài", "101": "Ly", "100": "Chấn",
    "011": "Tốn", "010": "Khảm", "001": "Cấn", "000": "Khôn"
  };

  const SO_TIEN_THIEN = {
    "Càn": 1, "Đoài": 2, "Ly": 3, "Chấn": 4,
    "Tốn": 5, "Khảm": 6, "Cấn": 7, "Khôn": 8
  };

  const HAU_THIEN_SO = {
    "Khảm": 1, "Khôn": 2, "Chấn": 3, "Tốn": 4,
    "Càn": 6, "Đoài": 7, "Cấn": 8, "Ly": 9
  };

  // Bảng 64 Quẻ tra theo cặp Thượng_Hạ
  const DICH_64_BY_PAIR = {
    "Càn_Càn": "Thuần Càn", "Càn_Đoài": "Thiên Trạch Lý", "Càn_Ly": "Thiên Hỏa Đồng Nhân", "Càn_Chấn": "Thiên Lôi Vô Vọng",
    "Càn_Tốn": "Thiên Phong Cấu", "Càn_Khảm": "Thiên Thủy Tụng", "Càn_Cấn": "Thiên Sơn Độn", "Càn_Khôn": "Thiên Địa Bĩ",

    "Đoài_Càn": "Trạch Thiên Quải", "Đoài_Đoài": "Thuần Đoài", "Đoài_Ly": "Trạch Hỏa Cách", "Đoài_Chấn": "Trạch Lôi Tùy",
    "Đoài_Tốn": "Trạch Phong Đại Quá", "Đoài_Khảm": "Trạch Thủy Khốn", "Đoài_Cấn": "Trạch Sơn Hàm", "Đoài_Khôn": "Trạch Địa Tụy",

    "Ly_Càn": "Hỏa Thiên Đại Hữu", "Ly_Đoài": "Hỏa Trạch Khuê", "Ly_Ly": "Thuần Ly", "Ly_Chấn": "Hỏa Lôi Phệ Hạp",
    "Ly_Tốn": "Hỏa Phong Đỉnh", "Ly_Khảm": "Hỏa Thủy Vị Tế", "Ly_Cấn": "Hỏa Sơn Lữ", "Ly_Khôn": "Hỏa Địa Tấn",

    "Chấn_Càn": "Lôi Thiên Đại Tráng", "Chấn_Đoài": "Lôi Trạch Quy Muội", "Chấn_Ly": "Lôi Hỏa Phong", "Chấn_Chấn": "Thuần Chấn",
    "Chấn_Tốn": "Lôi Phong Hằng", "Chấn_Khảm": "Lôi Thủy Giải", "Chấn_Cấn": "Lôi Sơn Tiểu Quá", "Chấn_Khôn": "Lôi Địa Dự",

    "Tốn_Càn": "Phong Thiên Tiểu Súc", "Tốn_Đoài": "Phong Trạch Trung Phu", "Tốn_Ly": "Phong Hỏa Gia Nhân", "Tốn_Chấn": "Phong Lôi Ích",
    "Tốn_Tốn": "Thuần Tốn", "Tốn_Khảm": "Phong Thủy Hoán", "Tốn_Cấn": "Phong Sơn Tiệm", "Tốn_Khôn": "Phong Địa Quan",

    "Khảm_Càn": "Thủy Thiên Nhu", "Khảm_Đoài": "Thủy Trạch Tiết", "Khảm_Ly": "Thủy Hỏa Ký Tế", "Khảm_Chấn": "Thủy Lôi Truân",
    "Khảm_Tốn": "Thủy Phong Tỉnh", "Khảm_Khảm": "Thuần Khảm", "Khảm_Cấn": "Thủy Sơn Kiển", "Khảm_Khôn": "Thủy Địa Tỷ",

    "Cấn_Càn": "Sơn Thiên Đại Súc", "Cấn_Đoài": "Sơn Trạch Tổn", "Cấn_Ly": "Sơn Hỏa Bí", "Cấn_Chấn": "Sơn Lôi Di",
    "Cấn_Tốn": "Sơn Phong Cổ", "Cấn_Khảm": "Sơn Thủy Mông", "Cấn_Cấn": "Thuần Cấn", "Cấn_Khôn": "Sơn Địa Bác",

    "Khôn_Càn": "Địa Thiên Thái", "Khôn_Đoài": "Địa Trạch Lâm", "Khôn_Ly": "Địa Hỏa Minh Di", "Khôn_Chấn": "Địa Lôi Phục",
    "Khôn_Tốn": "Địa Phong Thăng", "Khôn_Khảm": "Địa Thủy Sư", "Khôn_Cấn": "Địa Sơn Khiêm", "Khôn_Khôn": "Thuần Khôn"
  };

  const KD_DICH = {
    /**
     * Tra tên quẻ 64 từ 2 quẻ đơn Thượng / Hạ
     */
    getName(upper, lower) {
      if (!upper || !lower) return "";
      const key = `${upper}_${lower}`;
      if (DICH_64_BY_PAIR[key]) return DICH_64_BY_PAIR[key];
      if (upper === lower) return `Thuần ${upper}`;
      if (TRIGRAM_TUONG[upper] && TRIGRAM_TUONG[lower]) {
        return `${TRIGRAM_TUONG[upper]} ${TRIGRAM_TUONG[lower]}`;
      }
      return "Không xác định";
    },

    /**
     * Đảo bit hào động (1..6) trong chuỗi nhị phân 6 bit
     */
    flipBit(binaryStr, position) {
      if (!binaryStr || position < 1 || position > binaryStr.length) return binaryStr;
      const idx = position - 1;
      const chars = binaryStr.split("");
      chars[idx] = chars[idx] === "1" ? "0" : "1";
      return chars.join("");
    },

    /**
     * Tính Quẻ Hỗ: hào 2,3,4 làm quẻ hạ; hào 3,4,5 làm quẻ thượng
     */
    getQueHo(originalQueBinary) {
      if (!originalQueBinary || originalQueBinary.length < 6) return null;
      const lowerBin = originalQueBinary.slice(1, 4);
      const upperBin = originalQueBinary.slice(2, 5);
      const lowerName = BIN_TO_TRIGRAM[lowerBin] || "Khảm";
      const upperName = BIN_TO_TRIGRAM[upperBin] || "Khảm";
      const fullName = KD_DICH.getName(upperName, lowerName);
      return {
        lowerName, upperName,
        lowerBin, upperBin,
        binary: lowerBin + upperBin,
        name: fullName
      };
    },

    /**
     * Chuyển tên quẻ Dịch thành mã nhị phân 6 bit
     */
    nameToBinary(fullName) {
      if (!fullName) return null;
      const clean = fullName.replace(/\(.*?\)/g, '').trim();
      const words = clean.split(/\s+/);
      if (words.length < 2) return null;
      if (words[0] === 'Thuần') {
        const code = TRIGRAM_TO_BIN[words[1]];
        return code ? code + code : null;
      }
      const upperKey = Object.keys(TRIGRAM_TUONG).find(k => TRIGRAM_TUONG[k] === words[0]) || words[0];
      const lowerKey = Object.keys(TRIGRAM_TUONG).find(k => TRIGRAM_TUONG[k] === words[1]) || words[1];
      const upper = TRIGRAM_TO_BIN[upperKey];
      const lower = TRIGRAM_TO_BIN[lowerKey];
      if (!upper || !lower) return null;
      return lower + upper;
    }
  };

  const KD_DATA = {
    CAN: THIEN_CAN,
    CHI: DIA_CHI,
    CAN_DUONG, CAN_AM,
    CHI_DUONG, CHI_AM,
    HOA_GIAP_60: LUC_THAP_HOA_GIAP,
    TRIGRAM_SYMBOL,
    TRIGRAM_TUONG,
    TRIGRAM_TO_BIN,
    BIN_TO_TRIGRAM,
    SO_TIEN_THIEN,
    HAU_THIEN_SO,
    DICH_64_BY_PAIR
  };

  window.KD_CORE.DATA = KD_DATA;
  window.KD_CORE.DICH = KD_DICH;
  window.KD_DATA = KD_DATA;
  window.KD_DICH = KD_DICH;
})();
