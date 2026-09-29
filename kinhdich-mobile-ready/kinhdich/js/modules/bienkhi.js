window.KD_MOD = window.KD_MOD || {};
window.KD_MOD["bienkhi"] = function() {
  const host = document.querySelector('.kd-mod[data-mod="bienkhi"]');
  if (!host) return;

  const norm = (window.KD_UTIL && window.KD_UTIL.norm) || (s => (s||'').toLowerCase());

  // ---- Accordion behavior (scoped to host) ----
  host.addEventListener('toggle', (event) => {
    const el = event.target;
    if (!el || el.tagName !== 'DETAILS') return;
    if (el.open) {
      const name = el.getAttribute('name');
      if (name) {
        host.querySelectorAll(`details[name="${name}"][open]`).forEach((other) => {
          if (other !== el) other.open = false;
        });
      }
    } else {
      el.querySelectorAll('details[open]').forEach((nested) => { nested.open = false; });
    }
  }, true);

  // ---- Search functionality ----
  const searchInput = host.querySelector('#search-input');
  const items = Array.from(host.querySelectorAll('details[name="bien-khi-item"]')).map(el => ({
    el,
    text: norm(el.innerText)
  }));
  const groups = host.querySelectorAll('details.que-group');

  function applyFilter(rawQuery) {
    const filter = norm(rawQuery);

    items.forEach(({ el, text }) => {
      const isMatch = text.includes(filter);
      el.style.display = isMatch ? '' : 'none';
      if (!isMatch) el.open = false;
    });

    groups.forEach((g) => {
      const visibleItems = g.querySelectorAll('details[name="bien-khi-item"]:not([style*="display: none"])');
      const hit = visibleItems.length > 0;
      g.style.display = hit ? '' : 'none';
      if (filter !== '') g.open = hit;
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => applyFilter(e.target.value));
  }

  /* ---- Unified Bridge ---- */
  window.__KD_CAST = function() {};
};
