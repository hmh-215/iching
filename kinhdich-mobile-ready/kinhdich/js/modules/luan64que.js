window.KD_MOD = window.KD_MOD || {};
window.KD_MOD["luan64que"] = function() {
  const host = document.querySelector('.kd-mod[data-mod="luan64que"]');
  if (!host) return;

  const { norm } = window.KD_UTIL || { norm: s => (s||'').toLowerCase() };
  const { nameToBinary } = window.KD_DICH || {};
  const { renderBars } = window.KD_GRID || {};
  const CODE_SYMBOL = (window.KD_DATA && {
    '111': '☰', '110': '☱', '101': '☲', '100': '☳',
    '011': '☴', '010': '☵', '001': '☶', '000': '☷'
  }) || {};

  function buildHexagramMini(binary6) {
    const wrap = document.createElement('div');
    wrap.className = 'hexagram-mini';

    const bars = document.createElement('div');
    bars.className = 'bars';
    if (renderBars) {
      renderBars(bars, binary6, 0, { showIndex: false });
    }
    wrap.appendChild(bars);

    const info = document.createElement('div');
    info.className = 'hexagram-mini-info';

    const lowerCode = binary6.slice(0, 3);
    const upperCode = binary6.slice(3, 6);

    const symbols = document.createElement('span');
    symbols.className = 'mini-symbols';
    symbols.textContent = (CODE_SYMBOL[upperCode] || '?') + (CODE_SYMBOL[lowerCode] || '?');

    const bin = document.createElement('span');
    bin.className = 'mini-binary';
    bin.textContent = binary6;

    info.appendChild(symbols);
    info.appendChild(bin);
    wrap.appendChild(info);

    return wrap;
  }

  // ---- Search & Filter behavior ----
  const searchInput = host.querySelector('#accordion-search');
  const filterToggleBtn = host.querySelector('#filter-toggle-btn');
  const filterPopover = host.querySelector('#filter-popover');
  const filterBadge = host.querySelector('#filter-badge');
  const filterResetBtn = host.querySelector('#filter-reset-btn');
  const filterCloseBtn = host.querySelector('#filter-close-btn');

  const groups = Array.from(host.querySelectorAll('.que-group'));

  const items = Array.from(host.querySelectorAll('details[name="que-item"]')).map((el) => {
    const summaryEl = el.querySelector(':scope > summary');
    const rawName = summaryEl?.querySelector('strong')?.textContent || '';
    const cleanName = rawName.replace(/\s*\(\d+\)\s*$/, '').trim();
    const binary = nameToBinary ? nameToBinary(cleanName) : null;

    if (binary && summaryEl && !el.querySelector('.hexagram-mini')) {
      summaryEl.insertAdjacentElement('afterend', buildHexagramMini(binary));
    }

    return {
      el,
      group: el.closest('.que-group'),
      name: norm(summaryEl?.textContent),
      binary,
      hoQue: el.getAttribute('data-ho-que') || '',
      loaiQue: el.getAttribute('data-loai-que') || ''
    };
  });

  if (filterToggleBtn && filterPopover) {
    filterToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      filterPopover.classList.toggle('open');
      filterToggleBtn.classList.toggle('active', filterPopover.classList.contains('open'));
    });

    document.addEventListener('click', (e) => {
      if (!filterPopover.contains(e.target) && !filterToggleBtn.contains(e.target)) {
        filterPopover.classList.remove('open');
        filterToggleBtn.classList.remove('active');
      }
    });

    if (filterCloseBtn) {
      filterCloseBtn.addEventListener('click', () => {
        filterPopover.classList.remove('open');
        filterToggleBtn.classList.remove('active');
      });
    }

    if (filterResetBtn) {
      filterResetBtn.addEventListener('click', () => {
        const checkboxes = filterPopover.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => cb.checked = false);
        applyFilter();
      });
    }
  }

  function applyFilter() {
    if (!searchInput) return;
    const rawQuery = searchInput.value;
    const trimmed = rawQuery.trim();
    const filter = norm(trimmed);
    const isBinaryQuery = /^[01]{1,6}$/.test(trimmed);

    const selectedHo = filterPopover ? Array.from(filterPopover.querySelectorAll('input[name="ho-que"]:checked')).map(cb => cb.value) : [];
    const selectedLoai = filterPopover ? Array.from(filterPopover.querySelectorAll('input[name="loai-que"]:checked')).map(cb => cb.value) : [];

    if (filterBadge) {
      const totalSelected = selectedHo.length + selectedLoai.length;
      if (totalSelected > 0) {
        filterBadge.textContent = totalSelected;
        filterBadge.classList.add('show');
      } else {
        filterBadge.classList.remove('show');
      }
    }

    if (filter === '' && selectedHo.length === 0 && selectedLoai.length === 0) {
      items.forEach(({ el }) => { el.style.display = ''; el.open = false; });
      groups.forEach((g) => { g.style.display = ''; g.open = false; });
      return;
    }

    const groupHasMatch = new Map(groups.map((g) => [g, false]));

    items.forEach(({ el, group, name, binary, hoQue, loaiQue }) => {
      const textMatch = filter === '' || name.includes(filter);
      const binMatch = isBinaryQuery && !!binary && binary.includes(trimmed);
      const searchMatch = textMatch || binMatch;

      const hoMatch = selectedHo.length === 0 || selectedHo.includes(hoQue);
      const loaiMatch = selectedLoai.length === 0 || selectedLoai.includes(loaiQue);

      const isMatch = searchMatch && hoMatch && loaiMatch;

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
    searchInput.addEventListener('input', applyFilter);
  }

  if (filterPopover) {
    const checkboxes = filterPopover.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => cb.addEventListener('change', applyFilter));
  }

  // Scoped Accordion
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

  window.__KD_CAST = function() {};
};
