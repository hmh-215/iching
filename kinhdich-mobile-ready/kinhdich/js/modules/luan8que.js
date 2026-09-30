window.KD_MOD = window.KD_MOD || {};
window.KD_MOD["luan8que"] = function() {
const host = document.querySelector('.kd-mod[data-mod="luan8que"]');
if (!host) return;
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