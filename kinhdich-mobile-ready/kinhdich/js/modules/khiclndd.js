window.KD_MOD = window.KD_MOD || {};
window.KD_MOD["khiclndd"] = function() {
  const host = document.querySelector('.kd-mod[data-mod="khiclndd"]');
  if (!host) return;

  const norm = (window.KD_UTIL && window.KD_UTIL.norm) || (s => (s||'').toLowerCase());

  // ---- Search behavior ----
  const searchInput = host.querySelector('#accordion-search');
  const groups = Array.from(host.querySelectorAll('.khi-group'));

  const items = Array.from(host.querySelectorAll('details[name="bien-khi-item"]')).map((el) => ({
    el,
    group: el.closest('.khi-group'),
    name: norm(el.querySelector('summary')?.textContent),
  }));

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

  function applyFilter(rawQuery) {
    const filter = norm(rawQuery);

    if (filter === '') {
      items.forEach(({ el }) => { el.style.display = ''; el.open = false; });
      groups.forEach((g) => { g.style.display = ''; g.open = false; });
      return;
    }

    const groupHasMatch = new Map(groups.map((g) => [g, false]));

    items.forEach(({ el, group, name }) => {
      const isMatch = name.includes(filter);
      el.style.display = isMatch ? '' : 'none';
      el.open = false;
      if (isMatch && group) groupHasMatch.set(group, true);
    });

    groups.forEach((g) => {
      const hit = groupHasMatch.get(g);
      g.style.display = hit ? '' : 'none';
      g.open = hit;
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => applyFilter(e.target.value));
  }

  /* ---- Unified Bridge ---- */
  window.__KD_CAST = function() {};
};
