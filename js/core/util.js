/* =========================================================================
 * Dịch Học Ngũ Linh — Tầng Tiện Ích Dùng Chung (js/core/util.js)
 * Cung cấp các hàm toán học, xử lý chuỗi và tương tác DOM chung.
 * ========================================================================= */

(function() {
  'use strict';

  window.KD_CORE = window.KD_CORE || {};

  const KD_UTIL = {
    /**
     * Modulo toán học luôn dương: (n % m + m) % m
     */
    mod(n, m) {
      return ((n % m) + m) % m;
    },

    /**
     * So sánh tọa độ 2D [r, c]
     */
    coordEq(a, b) {
      if (!a || !b) return false;
      return a[0] === b[0] && a[1] === b[1];
    },

    /**
     * Tìm vị trí của tọa độ [r, c] trong một mảng đường đi
     */
    indexOfCoord(path, coord) {
      if (!path || !coord) return -1;
      for (let i = 0; i < path.length; i++) {
        if (KD_UTIL.coordEq(path[i], coord)) return i;
      }
      return -1;
    },

    /**
     * Tìm tọa độ [r, c] của một giá trị trong ma trận 2D
     */
    findInMatrix(val, matrix) {
      if (!matrix) return null;
      for (let r = 0; r < matrix.length; r++) {
        for (let c = 0; c < matrix[r].length; c++) {
          if (matrix[r][c] === val) return [r, c];
        }
      }
      return null;
    },

    /**
     * Chuẩn hóa chuỗi tiếng Việt: chữ thường, gỡ dấu thanh NFD, đ -> d
     */
    norm(str) {
      if (!str) return '';
      return String(str)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .trim();
    },

    /**
     * Đóng / mở khung diễn giải từng bước
     */
    toggleStepBox(id) {
      const box = document.getElementById(id);
      if (box) box.classList.toggle('open');
    },

    /**
     * Khởi tạo tính năng đóng mở độc quyền (accordion) cho các thẻ <details>
     */
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
