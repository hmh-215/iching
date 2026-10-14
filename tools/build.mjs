#!/usr/bin/env node
/* =========================================================================
 * tools/build.mjs — đóng gói app thành 1 file HTML (tương đương bundle.ps1)
 *                   + tuỳ chọn obfuscate bản phát hành.
 *
 *   npm install                      # 1 lần, cài javascript-obfuscator + csso
 *   node tools/build.mjs             # bản thường  (giống bundle.ps1)
 *   node tools/build.mjs --obfuscate # bản phát hành đã làm rối mã
 *
 * Kết quả: dist/kinh-dich-ngu-linh.html, chép sang index.html.
 * Mã nguồn (js/, css/, html/) KHÔNG bị sửa — chỉ bản đóng gói bị làm rối.
 *
 * Khi --obfuscate:
 *   - js/core/*.js và js/modules/*.js: javascript-obfuscator, mỗi file riêng.
 *     Giữ nguyên tên toàn cục (KD_MOD, KD_GRID, KD_LUCTHAN, __KD_CAST…)
 *     vì các module gọi nhau qua window.*.
 *   - CSS: rút gọn (csso), bỏ chú thích.
 *   - html/modules/*.frag.html: bỏ chú thích <!-- -->.
 *   - Không đụng: vỏ app (app.dc.html — template biên dịch lúc chạy bằng Babel),
 *     js/runtime/support.js (runtime dùng chung), data/*.json (nội dung luận giải).
 * ========================================================================= */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OBF = process.argv.includes('--obfuscate');
const OUT = path.join(ROOT, 'dist', 'kinh-dich-ngu-linh.html');

const SLUGS = [
  'luan8que', 'luan64que', 'luan10sao', 'bienkhi', 'luan9sao', 'khiclndd',
  'dothu', 'nguling', 'amlich', 'maphuong', 'cungsinh', 'tieuvan', 'tamtuyet', 'tamy', 'dichtu', 'chanlinh'
];
const CORE = ['auth.js', 'util.js', 'data.js', 'grid.js', 'flyingstar.js', 'interpret.js', 'lunar.js', 'lucthan.js'];
const DATA = ['data/luan64.json', 'data/khi_clndd.json', 'data/bienkhi.json'];

const read = rel => fs.readFileSync(path.join(ROOT, rel), 'utf8').replace(/^﻿/, '');
const exists = rel => fs.existsSync(path.join(ROOT, rel));

/* ---------- bộ biến đổi khi obfuscate ---------- */
let obfuscateJs = s => s, minifyCss = s => s, cleanHtml = s => s;

if (OBF) {
  let JO, csso;
  try {
    JO = (await import('javascript-obfuscator')).default;
    csso = await import('csso');
  } catch (e) {
    console.error('Thiếu thư viện. Chạy "npm install" trong thư mục dự án trước.');
    process.exit(1);
  }
  const OPTS = {
    target: 'browser',
    compact: true,
    seed: 2026,                        // cố định để mỗi lần build ra cùng kết quả
    identifierNamesGenerator: 'hexadecimal',
    renameGlobals: false,              // giữ tên toàn cục: các module gọi nhau qua chúng
    renameProperties: false,
    transformObjectKeys: true,
    stringArray: true,
    stringArrayEncoding: ['base64'],
    stringArrayThreshold: 0.8,
    stringArrayRotate: true,
    stringArrayShuffle: true,
    stringArrayWrappersCount: 2,
    stringArrayWrappersType: 'function',
    splitStrings: true,
    splitStringsChunkLength: 8,
    numbersToExpressions: true,
    simplify: true,
    // Tắt các tuỳ chọn làm chậm / dễ gãy: amlich tính thiên văn nặng,
    // vỏ app nạp lại script lõi lần 2.
    controlFlowFlattening: false,
    deadCodeInjection: false,
    selfDefending: false,
    debugProtection: false,
    disableConsoleOutput: false,
    unicodeEscapeSequence: false,
    sourceMap: false
  };
  obfuscateJs = (src, name) => {
    try {
      return JO.obfuscate(src, OPTS).getObfuscatedCode();
    } catch (e) {
      throw new Error(`Obfuscate lỗi ở ${name}: ${e.message}`);
    }
  };
  minifyCss = s => csso.minify(s, { restructure: false, comments: false }).css;
  cleanHtml = s => s.replace(/<!--[\s\S]*?-->/g, '');
}

/* ---------- 1. vỏ app + CSS nhúng base64 ---------- */
let html = read('app.dc.html');

for (const rel of ['css/core/kd.css', ...SLUGS.map(s => `css/modules/${s}.css`)]) {
  if (!exists(rel)) continue;
  const b64 = Buffer.from(minifyCss(read(rel)), 'utf8').toString('base64');
  html = html.split(`href="${rel}"`).join(`href="data:text/css;base64,${b64}"`);
}

/* ---------- 2. bỏ manifest cục bộ ---------- */
html = html.replace(/\n?<link rel="manifest"[^>]*>/g, '');

/* ---------- 3. nhúng script lõi ---------- */
const safeInline = js => js.replace(/<\/script/gi, '<\\/script');
for (const f of CORE) {
  const rel = `js/core/${f}`;
  if (!exists(rel)) continue;
  const tag = `<script src="js/core/${f}"></script>`;
  const code = safeInline(obfuscateJs(read(rel), rel));
  html = html.split(tag).join(`<script>\n${code}\n</script>`);
}

/* ---------- 4. module + dữ liệu vào KD_INLINE ---------- */
const entries = {};
for (const s of SLUGS) {
  const frag = `html/modules/${s}.frag.html`, js = `js/modules/${s}.js`;
  if (exists(frag)) entries[frag] = cleanHtml(read(frag));
  if (exists(js)) entries[js] = obfuscateJs(read(js), js);
}
for (const d of DATA) entries[d] = read(d);

const jsonStr = v => JSON.stringify(v).replace(/<\//g, '<\\/').replace(/<!--/g, '<\\!--');
const inline = '{' + Object.entries(entries).map(([k, v]) => `\n  ${JSON.stringify(k)}: ${jsonStr(v)}`).join(',') + '\n}';

const support = read('js/runtime/support.js').split('<x-dc>').join('[x-dc]');
const inject =
  `<script>\n/* noi dung module nhung san — sinh boi tools/build.mjs${OBF ? ' (obfuscated)' : ''} */\n` +
  `window.KD_INLINE = ${inline};\n</script>\n<script>\n${support}\n</script>`;
html = html.split('<script src="./js/runtime/support.js"></script>').join(inject);

/* ---------- 5. ghi file ---------- */
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, html, 'utf8');
fs.writeFileSync(path.join(ROOT, 'index.html'), html, 'utf8');

const mb = (fs.statSync(OUT).size / 1048576).toFixed(2);
console.log(`Đã tạo ${path.relative(ROOT, OUT)} (${mb} MB)${OBF ? ' — đã obfuscate' : ''} và đồng bộ index.html`);
