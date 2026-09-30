window.KD_MOD = window.KD_MOD || {};
window.KD_MOD["luan10sao"] = function() {
const host = document.querySelector('.kd-mod[data-mod="luan10sao"]');
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