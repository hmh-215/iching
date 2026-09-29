/* =========================================================================
 * Dịch Học Ngũ Linh — Tầng Xác Thực Mã PIN (js/core/auth.js)
 * Cổng bảo vệ truy cập ứng dụng bằng mã PIN với mã băm SHA-256 (Mã PIN: 300703).
 * ========================================================================= */

(function() {
  'use strict';

  const CONFIG = {
    SALT: 'iching_ngulinh_auth_salt_2026',
    // SHA-256 của "iching_ngulinh_auth_salt_2026:300703"
    HASH: '6f1a15ccbad5eb8aecba77cd37397f4d5975df943e9bdff34885a8b19d833c74',
    PIN_LENGTH: 6,
    SESSION_KEY: 'kd_pin_auth_token',
    AUTH_VALID_VALUE: 'kd_authorized_session_300703'
  };

  async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function isAuthorized() {
    try {
      return sessionStorage.getItem(CONFIG.SESSION_KEY) === CONFIG.AUTH_VALID_VALUE;
    } catch (e) {
      return false;
    }
  }

  function setAuthorized() {
    try {
      sessionStorage.setItem(CONFIG.SESSION_KEY, CONFIG.AUTH_VALID_VALUE);
    } catch (e) {}
  }

  function clearAuthorized() {
    try {
      sessionStorage.removeItem(CONFIG.SESSION_KEY);
    } catch (e) {}
  }

  // Inject CSS cho Gatekeeper Modal
  function injectAuthStyles() {
    if (document.getElementById('kd-auth-style')) return;
    const style = document.createElement('style');
    style.id = 'kd-auth-style';
    style.textContent = `
      #kd-auth-overlay {
        position: fixed;
        inset: 0;
        z-index: 999999;
        background: rgba(14, 15, 19, 0.94);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        font-family: 'Inter', system-ui, sans-serif;
        color: var(--paper, #e7dfc9);
        animation: kdAuthFadeIn .25s ease-out;
      }
      @keyframes kdAuthFadeIn { from { opacity: 0; } to { opacity: 1; } }
      .kd-auth-card {
        background: var(--ink-850, #191b21);
        border: 1px solid var(--cinnabar, #c24632);
        box-shadow: 0 20px 50px rgba(0,0,0,0.65), 0 0 0 1px rgba(194,70,50,0.2);
        border-radius: 8px;
        width: 100%;
        max-width: 360px;
        padding: 28px 24px;
        text-align: center;
        box-sizing: border-box;
      }
      .kd-auth-emblem {
        font-size: 32px;
        color: var(--gold, #c19a4b);
        margin-bottom: 8px;
        line-height: 1;
      }
      .kd-auth-title {
        font-family: 'Spectral', serif;
        font-size: 22px;
        font-style: italic;
        font-weight: 600;
        color: var(--paper, #e7dfc9);
        margin: 0 0 6px 0;
      }
      .kd-auth-subtitle {
        font-size: 12.5px;
        color: var(--paper-dim, rgba(231,223,201,0.65));
        margin: 0 0 24px 0;
        line-height: 1.4;
      }
      .kd-auth-dots {
        display: flex;
        justify-content: center;
        gap: 12px;
        margin-bottom: 22px;
      }
      .kd-auth-dot {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 2px solid var(--line-strong, rgba(231,223,201,0.25));
        background: transparent;
        transition: all .18s ease;
      }
      .kd-auth-dot.filled {
        background: var(--gold, #c19a4b);
        border-color: var(--gold, #c19a4b);
        box-shadow: 0 0 10px rgba(193,154,75,0.45);
        transform: scale(1.1);
      }
      .kd-auth-error {
        min-height: 20px;
        font-size: 12px;
        color: var(--cinnabar, #c24632);
        margin-bottom: 18px;
        font-weight: 500;
      }
      .kd-auth-numpad {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
        max-width: 280px;
        margin: 0 auto;
      }
      .kd-auth-btn {
        background: var(--ink-800, #1d1f27);
        border: 1px solid var(--line, rgba(231,223,201,0.12));
        color: var(--paper, #e7dfc9);
        border-radius: 6px;
        font-size: 20px;
        font-weight: 500;
        height: 54px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all .15s ease;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
      }
      .kd-auth-btn:hover {
        background: var(--ink-750, #242631);
        border-color: var(--gold, #c19a4b);
        color: var(--gold, #c19a4b);
      }
      .kd-auth-btn:active {
        transform: scale(0.95);
        background: var(--cinnabar, #c24632);
        color: #fff;
      }
      .kd-auth-btn.action {
        font-size: 15px;
        color: var(--paper-dim, rgba(231,223,201,0.65));
      }
      .kd-auth-shake {
        animation: kdShake 0.4s cubic-bezier(.36,.07,.19,.97) both;
      }
      @keyframes kdShake {
        10%, 90% { transform: translate3d(-2px, 0, 0); }
        20%, 80% { transform: translate3d(4px, 0, 0); }
        30%, 50%, 70% { transform: translate3d(-6px, 0, 0); }
        40%, 60% { transform: translate3d(6px, 0, 0); }
      }
      .kd-auth-locked-body {
        overflow: hidden !important;
      }
    `;
    document.head.appendChild(style);
  }

  function showAuthModal() {
    if (document.getElementById('kd-auth-overlay')) return;
    injectAuthStyles();
    document.body.classList.add('kd-auth-locked-body');

    let currentPin = '';

    const overlay = document.createElement('div');
    overlay.id = 'kd-auth-overlay';

    const card = document.createElement('div');
    card.className = 'kd-auth-card';

    card.innerHTML = `
      <div class="kd-auth-emblem">☯</div>
      <h2 class="kd-auth-title">Khóa Bảo Mật</h2>
      <p class="kd-auth-subtitle">Ứng dụng Dịch Học Ngũ Linh<br>Vui lòng nhập mã PIN gồm 6 chữ số để mở khóa</p>
      <div class="kd-auth-dots">
        ${Array.from({ length: CONFIG.PIN_LENGTH }, () => '<div class="kd-auth-dot"></div>').join('')}
      </div>
      <div class="kd-auth-error" id="kd-auth-error-msg"></div>
      <div class="kd-auth-numpad">
        <button type="button" class="kd-auth-btn" data-val="1">1</button>
        <button type="button" class="kd-auth-btn" data-val="2">2</button>
        <button type="button" class="kd-auth-btn" data-val="3">3</button>
        <button type="button" class="kd-auth-btn" data-val="4">4</button>
        <button type="button" class="kd-auth-btn" data-val="5">5</button>
        <button type="button" class="kd-auth-btn" data-val="6">6</button>
        <button type="button" class="kd-auth-btn" data-val="7">7</button>
        <button type="button" class="kd-auth-btn" data-val="8">8</button>
        <button type="button" class="kd-auth-btn" data-val="9">9</button>
        <button type="button" class="kd-auth-btn action" data-val="clear">Xóa</button>
        <button type="button" class="kd-auth-btn" data-val="0">0</button>
        <button type="button" class="kd-auth-btn action" data-val="back">⌫</button>
      </div>
    `;

    overlay.appendChild(card);
    document.body.appendChild(overlay);

    const dots = card.querySelectorAll('.kd-auth-dot');
    const errorEl = card.querySelector('#kd-auth-error-msg');

    function updateDots() {
      dots.forEach((dot, idx) => {
        dot.classList.toggle('filled', idx < currentPin.length);
      });
    }

    async function handleVerify() {
      if (currentPin.length !== CONFIG.PIN_LENGTH) return;
      errorEl.textContent = 'Đang xác thực…';

      const combined = `${CONFIG.SALT}:${currentPin}`;
      const hashed = await sha256(combined);

      if (hashed === CONFIG.HASH) {
        setAuthorized();
        errorEl.textContent = '';
        overlay.style.transition = 'opacity .25s ease';
        overlay.style.opacity = '0';
        setTimeout(() => {
          overlay.remove();
          document.body.classList.remove('kd-auth-locked-body');
          window.dispatchEvent(new CustomEvent('kd:authorized'));
        }, 250);
      } else {
        card.classList.remove('kd-auth-shake');
        void card.offsetWidth; // Trigger reflow
        card.classList.add('kd-auth-shake');
        errorEl.textContent = 'Mã PIN không chính xác. Vui lòng thử lại!';
        currentPin = '';
        updateDots();
      }
    }

    function addDigit(digit) {
      if (currentPin.length < CONFIG.PIN_LENGTH) {
        currentPin += digit;
        errorEl.textContent = '';
        updateDots();
        if (currentPin.length === CONFIG.PIN_LENGTH) {
          setTimeout(handleVerify, 80);
        }
      }
    }

    function backspace() {
      if (currentPin.length > 0) {
        currentPin = currentPin.slice(0, -1);
        errorEl.textContent = '';
        updateDots();
      }
    }

    function clear() {
      currentPin = '';
      errorEl.textContent = '';
      updateDots();
    }

    // Sự kiện Numpad cảm ứng
    card.querySelectorAll('.kd-auth-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const val = btn.dataset.val;
        if (val === 'clear') clear();
        else if (val === 'back') backspace();
        else if (/^[0-9]$/.test(val)) addDigit(val);
      });
    });

    // Sự kiện bàn phím vật lý
    function onKeyDown(e) {
      if (!document.getElementById('kd-auth-overlay')) {
        window.removeEventListener('keydown', onKeyDown);
        return;
      }
      if (/^[0-9]$/.test(e.key)) {
        addDigit(e.key);
      } else if (e.key === 'Backspace') {
        backspace();
      } else if (e.key === 'Escape' || e.key === 'Delete') {
        clear();
      }
    }
    window.addEventListener('keydown', onKeyDown);
  }

  function checkAndPrompt() {
    if (!isAuthorized()) {
      showAuthModal();
    }
  }

  // Khởi động bảo vệ ngay khi DOM tải
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkAndPrompt);
  } else {
    checkAndPrompt();
  }

  const KD_AUTH = {
    isAuthorized,
    showModal: showAuthModal,
    lock() {
      clearAuthorized();
      showAuthModal();
    }
  };

  window.KD_CORE = window.KD_CORE || {};
  window.KD_CORE.AUTH = KD_AUTH;
  window.KD_AUTH = KD_AUTH;
})();
