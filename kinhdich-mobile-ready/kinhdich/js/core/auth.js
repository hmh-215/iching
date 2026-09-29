/* =========================================================================
 * Dịch Học Ngũ Linh — Tầng Xác Thực Mật Khẩu (js/core/auth.js)
 * Cổng bảo vệ truy cập ứng dụng bằng mật khẩu với mã băm SHA-256 + Salt.
 * ========================================================================= */

(function() {
  'use strict';

  const CONFIG = {
    SALT: 'iching_ngulinh_auth_salt_2026',
    // SHA-256 của "iching_ngulinh_auth_salt_2026:KinhDich@2026"
    HASH: '82cf600622f5644820a10a517453a6f03ad6e0f2fed25b95491edc0bff4655b8',
    // Fallback legacy SHA-256 của "iching_ngulinh_auth_salt_2026:300703"
    LEGACY_HASH: '6f1a15ccbad5eb8aecba77cd37397f4d5975df943e9bdff34885a8b19d833c74',
    SESSION_KEY: 'kd_auth_token',
    AUTH_VALID_VALUE: 'kd_authorized_session_2026'
  };

  async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function isAuthorized() {
    try {
      const val = sessionStorage.getItem(CONFIG.SESSION_KEY) || sessionStorage.getItem('kd_pin_auth_token');
      return val === CONFIG.AUTH_VALID_VALUE || val === 'kd_authorized_session_300703';
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
        border-radius: 10px;
        width: 100%;
        max-width: 380px;
        padding: 32px 26px;
        text-align: center;
        box-sizing: border-box;
      }
      .kd-auth-emblem {
        font-size: 34px;
        color: var(--gold, #c19a4b);
        margin-bottom: 10px;
        line-height: 1;
      }
      .kd-auth-title {
        font-family: 'Spectral', serif;
        font-size: 23px;
        font-style: italic;
        font-weight: 600;
        color: var(--paper, #e7dfc9);
        margin: 0 0 6px 0;
      }
      .kd-auth-subtitle {
        font-size: 13px;
        color: var(--paper-dim, rgba(231,223,201,0.65));
        margin: 0 0 22px 0;
        line-height: 1.45;
      }
      .kd-auth-input-wrapper {
        position: relative;
        width: 100%;
        margin-bottom: 14px;
      }
      .kd-auth-input {
        width: 100%;
        height: 46px;
        padding: 0 44px 0 14px;
        background: var(--ink-800, #1d1f27);
        border: 1px solid var(--line-strong, rgba(231,223,201,0.25));
        border-radius: 6px;
        color: var(--paper, #e7dfc9);
        font-size: 16px;
        box-sizing: border-box;
        outline: none;
        transition: border-color .18s ease, box-shadow .18s ease;
      }
      .kd-auth-input:focus {
        border-color: var(--gold, #c19a4b);
        box-shadow: 0 0 0 2px rgba(193,154,75,0.25);
      }
      .kd-auth-input::placeholder {
        color: rgba(231,223,201,0.35);
        font-size: 14px;
      }
      .kd-auth-eye-btn {
        position: absolute;
        right: 8px;
        top: 50%;
        transform: translateY(-50%);
        background: transparent;
        border: none;
        cursor: pointer;
        font-size: 18px;
        padding: 4px 6px;
        color: var(--paper-dim, rgba(231,223,201,0.65));
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
      }
      .kd-auth-eye-btn:hover {
        color: var(--gold, #c19a4b);
      }
      .kd-auth-error {
        min-height: 20px;
        font-size: 12.5px;
        color: var(--cinnabar, #c24632);
        margin-bottom: 14px;
        font-weight: 500;
        text-align: left;
      }
      .kd-auth-submit {
        width: 100%;
        height: 46px;
        background: var(--gold, #c19a4b);
        color: #0e0f13;
        font-size: 15px;
        font-weight: 600;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: background .18s ease, transform .12s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        letter-spacing: 0.02em;
      }
      .kd-auth-submit:hover {
        background: #d4aa59;
      }
      .kd-auth-submit:active {
        transform: scale(0.98);
      }
      .kd-auth-hint {
        margin-top: 14px;
        font-size: 11.5px;
        color: rgba(231,223,201,0.45);
        line-height: 1.4;
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

    const overlay = document.createElement('div');
    overlay.id = 'kd-auth-overlay';

    const card = document.createElement('div');
    card.className = 'kd-auth-card';

    card.innerHTML = `
      <div class="kd-auth-emblem">☯</div>
      <h2 class="kd-auth-title">Khóa Bảo Mật</h2>
      <p class="kd-auth-subtitle">Ứng dụng Dịch Học Ngũ Linh<br>Vui lòng nhập mật khẩu để mở khóa ứng dụng</p>
      
      <div class="kd-auth-input-wrapper">
        <input type="password" id="kd-auth-input" class="kd-auth-input" placeholder="Nhập mật khẩu truy cập..." autocomplete="current-password" spellcheck="false">
        <button type="button" id="kd-auth-toggle-eye" class="kd-auth-eye-btn" title="Hiện/ẩn mật khẩu">👁</button>
      </div>

      <div class="kd-auth-error" id="kd-auth-error-msg"></div>

      <button type="button" id="kd-auth-submit-btn" class="kd-auth-submit">Mở Khóa Truy Cập</button>
      <div class="kd-auth-hint">Nhập mật khẩu và nhấn Enter hoặc nút Mở Khóa</div>
    `;

    overlay.appendChild(card);
    document.body.appendChild(overlay);

    const inputEl = card.querySelector('#kd-auth-input');
    const eyeBtn = card.querySelector('#kd-auth-toggle-eye');
    const submitBtn = card.querySelector('#kd-auth-submit-btn');
    const errorEl = card.querySelector('#kd-auth-error-msg');

    // Auto-focus input
    setTimeout(() => {
      if (inputEl) inputEl.focus();
    }, 100);

    // Toggle show/hide password
    eyeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (inputEl.type === 'password') {
        inputEl.type = 'text';
        eyeBtn.textContent = '🔒';
        eyeBtn.title = 'Ẩn mật khẩu';
      } else {
        inputEl.type = 'password';
        eyeBtn.textContent = '👁';
        eyeBtn.title = 'Hiện mật khẩu';
      }
      inputEl.focus();
    });

    async function handleVerify() {
      const pwd = inputEl.value.trim();
      if (!pwd) {
        errorEl.textContent = 'Vui lòng nhập mật khẩu!';
        inputEl.focus();
        return;
      }

      errorEl.textContent = 'Đang xác thực…';
      submitBtn.disabled = true;

      const combined = `${CONFIG.SALT}:${pwd}`;
      const hashed = await sha256(combined);

      if (hashed === CONFIG.HASH || hashed === CONFIG.LEGACY_HASH) {
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
        submitBtn.disabled = false;
        card.classList.remove('kd-auth-shake');
        void card.offsetWidth; // Trigger reflow
        card.classList.add('kd-auth-shake');
        errorEl.textContent = 'Mật khẩu không chính xác. Vui lòng thử lại!';
        inputEl.value = '';
        inputEl.focus();
      }
    }

    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      handleVerify();
    });

    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleVerify();
      } else {
        errorEl.textContent = '';
      }
    });
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
