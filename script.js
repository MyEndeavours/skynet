/* =============================================================
   Site engine. No edits needed – update projects.js instead.
   ============================================================= */
(() => {
  'use strict';
  const root = document.documentElement;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const mqReduce = matchMedia('(prefers-reduced-motion: reduce)');
  const mqFine = matchMedia('(hover: hover) and (pointer: fine)');
  const mqDark = matchMedia('(prefers-color-scheme: dark)');
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'other';
  const isDark = () => { const t = root.getAttribute('data-theme'); return t ? t === 'dark' : mqDark.matches; };
  const prng = seed => { let a = seed | 0; return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
  const hash = str => { let a = 0; for (const ch of String(str)) a = (Math.imul(a, 31) + ch.charCodeAt(0)) | 0; return a; };
  const on = (el, ev, fn, opt) => el && el.addEventListener(ev, fn, opt);

  /* ---------- Entrance: one orchestrated moment ---------- */
  let ready = false;
  const queue = [];
  const whenReady = fn => (ready ? fn() : queue.push(fn));
  const fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  Promise.race([fontsReady, new Promise(r => setTimeout(r, 900))]).then(() => requestAnimationFrame(() => {
    root.classList.add('is-ready');
    ready = true;
    queue.splice(0).forEach(fn => fn());
  }));

  /* ---------- Project previews (drawn when no screenshot is supplied) ---------- */
  const MOCK = (() => {
    let uid = 0;
    const SANS = 'Archivo, Helvetica, Arial, sans-serif';
    const hex = h => { h = String(h).replace('#', ''); if (h.length === 3) h = h.split('').map(c => c + c).join(''); const v = parseInt(h, 16) || 0; return [v >> 16 & 255, v >> 8 & 255, v & 255]; };
    const mix = (a, b, t) => { const A = hex(a), B = hex(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); };
    const lum = h => { const c = hex(h).map(v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }); return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]; };
    const ink = A => (lum(A) > .4 ? '#0B0F16' : '#FFFFFF');
    const n = v => +(+v).toFixed(1);
    const R = (x, y, w, h, f, rx = 0, o = 1, extra = '') => `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" rx="${rx}" fill="${f}"${o < 1 ? ` fill-opacity="${o}"` : ''}${extra}/>`;
    const T = (x, y, s, size, f, w = 400, anchor = 'start', fam = SANS, extra = '') => `<text x="${n(x)}" y="${n(y)}" font-family="${fam}" font-size="${size}" font-weight="${w}" fill="${f}" text-anchor="${anchor}"${extra}>${esc(s)}</text>`;
    const tone = dark => dark
      ? { dark: true, bg: '#0B0F16', surf: '#121826', surf2: '#171F2E', side: '#0E131C', line: '#232C3B', ink: '#F1F4F9', mute: '#6E7A8F', faint: '#2A3344' }
      : { dark: false, bg: '#F5F7FA', surf: '#FFFFFF', surf2: '#F0F3F7', side: '#FFFFFF', line: '#E1E6ED', ink: '#0F1624', mute: '#8D97A8', faint: '#E6EAF0' };
    const smooth = pts => pts.map((p, i, a) => {
      if (!i) return `M${n(p[0])} ${n(p[1])}`;
      const p0 = a[i - 2] || a[i - 1], p1 = a[i - 1], p3 = a[i + 1] || p;
      return `C${n(p1[0] + (p[0] - p0[0]) / 6)} ${n(p1[1] + (p[1] - p0[1]) / 6)} ${n(p[0] - (p3[0] - p1[0]) / 6)} ${n(p[1] - (p3[1] - p1[1]) / 6)} ${n(p[0])} ${n(p[1])}`;
    }).join('');

    const plate = (cx, cy, r, food) =>
      `<circle cx="${n(cx)}" cy="${n(cy + r * .07)}" r="${n(r)}" fill="#000" fill-opacity=".35"/>` +
      `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}" fill="#F1ECE4"/>` +
      `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r * .8)}" fill="none" stroke="#000" stroke-opacity=".07" stroke-width="2"/>` +
      `<circle cx="${n(cx - r * .04)}" cy="${n(cy + r * .03)}" r="${n(r * .5)}" fill="${food}"/>` +
      `<circle cx="${n(cx + r * .2)}" cy="${n(cy - r * .16)}" r="${n(r * .13)}" fill="#86AE5E"/>` +
      `<circle cx="${n(cx - r * .22)}" cy="${n(cy + r * .2)}" r="${n(r * .09)}" fill="#86AE5E" fill-opacity=".85"/>`;

    function art(x, y, w, h, A, kind, id) {
      const hi = mix(A, '#FFFFFF', .55), lo = mix(A, '#000000', .45);
      const defs = `<defs><linearGradient id="${id}a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${hi}"/><stop offset=".55" stop-color="${A}"/><stop offset="1" stop-color="${lo}"/></linearGradient><radialGradient id="${id}b" cx=".22" cy=".18" r=".9"><stop offset="0" stop-color="#fff" stop-opacity=".45"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/></radialGradient><clipPath id="${id}c"><rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" rx="18"/></clipPath></defs>`;
      let g = '', gloss = true;
      if (kind === 'arch') {
        g = R(x, y, w, h, `url(#${id}a)`) +
          `<circle cx="${n(x + w * .8)}" cy="${n(y + h * .25)}" r="${n(h * .1)}" fill="#fff" fill-opacity=".9"/>` +
          `<path d="M${n(x + w * .12)} ${n(y + h)}V${n(y + h * .44)}a${n(w * .17)} ${n(w * .17)} 0 0 1 ${n(w * .34)} 0V${n(y + h)}Z" fill="#fff" fill-opacity=".9"/>` +
          `<path d="M${n(x + w * .56)} ${n(y + h)}V${n(y + h * .6)}a${n(w * .12)} ${n(w * .12)} 0 0 1 ${n(w * .24)} 0V${n(y + h)}Z" fill="#fff" fill-opacity=".45"/>` +
          R(x, y + h * .9, w, h * .1, lo, 0, .3);
      } else if (kind === 'plates') {
        gloss = false;
        g = R(x, y, w, h, mix(A, '#000000', .76)) +
          plate(x + w * .36, y + h * .56, h * .4, mix(A, '#7A2E12', .3)) +
          plate(x + w * .8, y + h * .3, h * .22, mix(A, '#F2C572', .55)) +
          `<circle cx="${n(x + w * .82)}" cy="${n(y + h * .8)}" r="${n(h * .1)}" fill="#fff" fill-opacity=".07" stroke="#fff" stroke-opacity=".3" stroke-width="2"/>`;
      } else if (kind === 'fire') {
        gloss = false;
        g = R(x, y, w, h, mix(A, '#000000', .84)) +
          `<ellipse cx="${n(x + w * .5)}" cy="${n(y + h * .98)}" rx="${n(w * .7)}" ry="${n(h * .55)}" fill="${A}" fill-opacity=".55"/>` +
          `<ellipse cx="${n(x + w * .5)}" cy="${n(y + h * 1.02)}" rx="${n(w * .42)}" ry="${n(h * .36)}" fill="${mix(A, '#FFD27A', .5)}" fill-opacity=".8"/>` +
          `<ellipse cx="${n(x + w * .5)}" cy="${n(y + h * 1.06)}" rx="${n(w * .2)}" ry="${n(h * .2)}" fill="#FFF1C9"/>`;
      } else if (kind === 'wood') {
        gloss = false;
        g = R(x, y, w, h, '#3A2416');
        for (let i = 0; i < 7; i++) g += R(x, y + i * h / 7, w, h / 7 - 3, mix('#5E3822', '#A36B3F', ((i * 37) % 7) / 7));
      } else if (kind === 'stripes') {
        gloss = false;
        g = R(x, y, w, h, '#0A0C10') +
          `<path d="M${n(x + w * .06)} ${n(y + h)}L${n(x + w * .5)} ${n(y)}H${n(x + w * .7)}L${n(x + w * .26)} ${n(y + h)}Z" fill="${A}"/>` +
          `<path d="M${n(x + w * .38)} ${n(y + h)}L${n(x + w * .82)} ${n(y)}H${n(x + w * .88)}L${n(x + w * .44)} ${n(y + h)}Z" fill="${A}" fill-opacity=".45"/>` +
          `<circle cx="${n(x + w * .76)}" cy="${n(y + h * .66)}" r="${n(h * .2)}" fill="none" stroke="#fff" stroke-opacity=".75" stroke-width="6"/>`;
      } else {
        g = R(x, y, w, h, `url(#${id}a)`) +
          `<circle cx="${n(x + w * .5)}" cy="${n(y + h * 1.05)}" r="${n(h * .8)}" fill="#fff" fill-opacity=".12"/>` +
          `<circle cx="${n(x + w * .5)}" cy="${n(y + h * 1.05)}" r="${n(h * .5)}" fill="#fff" fill-opacity=".14"/>`;
      }
      return defs + `<g clip-path="url(#${id}c)">${g}${gloss ? R(x, y, w, h, `url(#${id}b)`) : ''}</g>`;
    }

    function nav(t, A, v, fam) {
      let s = R(0, 0, 1200, 68, t.bg) + R(48, 21, 26, 26, A, 7) + T(86, 41, v.brand, 19, t.ink, 700, 'start', fam);
      (v.links || ['', '', '', '']).slice(0, 4).forEach((l, i) => { s += l ? T(548 + i * 112, 40, l, 14, t.mute, 500) : R(560 + i * 92, 30, 60, 8, t.mute, 4, .5); });
      const cta = v.cta || 'Get started';
      s += R(1018, 16, 134, 36, A, 18) + T(1085, 39, cta, 14, ink(A), 600, 'middle');
      return s + R(0, 68, 1200, 1, t.line);
    }

    function site(p, v, t, A, id) {
      const fam = v.font || SANS, hl = v.headline || [p.name];
      let s = nav(t, A, v, fam);
      hl.forEach((l, i) => { s += T(48, 184 + i * 66, l, 58, t.ink, 700, 'start', fam, ' letter-spacing="-1.5"'); });
      const py = 184 + hl.length * 66 - 12;
      [440, 400, 290].forEach((w, i) => { s += R(48, py + i * 22, w, 10, t.mute, 5, .45); });
      const by = py + 92;
      s += R(48, by, 172, 52, A, 26) + T(134, by + 32, v.cta || 'Get started', 16, ink(A), 600, 'middle') +
        `<rect x="234" y="${by}" width="156" height="52" rx="26" fill="none" stroke="${t.line}" stroke-width="2"/>` +
        T(312, by + 32, v.cta2 || 'Learn more', 16, t.ink, 600, 'middle');
      s += art(640, 100, 512, 388, A, v.art || 'glow', id + 'h');
      (v.cards || ['', '', '']).slice(0, 3).forEach((c, i) => {
        const x = 48 + i * 376;
        s += R(x, 524, 352, 190, t.surf, 16, 1, ` stroke="${t.line}"`) + R(x + 24, 550, 46, 46, A, 12, .16) + R(x + 38, 564, 18, 18, A, 5) +
          (c ? T(x + 24, 632, c, 20, t.ink, 650, 'start', fam) : R(x + 24, 620, 150, 12, t.ink, 6, .8)) +
          R(x + 24, 652, 290, 9, t.mute, 4.5, .4) + R(x + 24, 672, 236, 9, t.mute, 4.5, .4);
      });
      return s;
    }

    function siteCenter(p, v, t, A, id) {
      const fam = v.font || SANS, hl = v.headline || [p.name];
      let s = nav(t, A, v, fam);
      if (v.kicker) { const kw = v.kicker.length * 7.6 + 40; s += R(600 - kw / 2, 98, kw, 30, A, 15, .16) + T(600, 118, v.kicker, 13, A, 600, 'middle'); }
      hl.forEach((l, i) => { s += T(600, 196 + i * 70, l, 62, t.ink, 500, 'middle', fam, ' letter-spacing="-1"'); });
      const py = 196 + hl.length * 70 - 20;
      [520, 400].forEach((w, i) => { s += R(600 - w / 2, py + i * 22, w, 10, t.mute, 5, .45); });
      const by = py + 64;
      s += R(426, by, 164, 50, A, 25) + T(508, by + 31, v.cta || 'Book', 15, ink(A), 600, 'middle') +
        `<rect x="610" y="${by}" width="164" height="50" rx="25" fill="none" stroke="${t.line}" stroke-width="2"/>` +
        T(692, by + 31, v.cta2 || 'Learn more', 15, t.ink, 600, 'middle');
      const iy = by + 80, ih = 750 - iy - 28, arts = v.arts || ['glow', 'glow', 'glow'];
      return s + art(48, iy, 540, ih, A, arts[0], id + 'a') + art(604, iy, 268, ih, A, arts[1], id + 'b') + art(888, iy, 264, ih, A, arts[2], id + 'c');
    }

    function dash(p, v, t, A, id) {
      const fam = v.font || SANS, rnd = prng(hash(p.name)), act = v.active == null ? 1 : v.active;
      let s = R(0, 0, 232, 750, t.side) + R(231, 0, 1, 750, t.line) + R(28, 26, 30, 30, A, 8) + T(70, 47, v.brand, 18, t.ink, 700, 'start', fam);
      (v.nav || ['Overview', 'Orders', 'Customers', 'Team', 'Invoices', 'Reports', 'Settings']).slice(0, 7).forEach((label, i) => {
        const y = 104 + i * 46, a = i === act;
        if (a) s += R(16, y - 9, 200, 38, A, 9, .15);
        s += R(32, y + 1, 18, 18, a ? A : t.mute, 5, a ? 1 : .45) + T(62, y + 15, label, 15, a ? t.ink : t.mute, a ? 600 : 500);
      });
      s += `<circle cx="46" cy="706" r="16" fill="${mix(A, t.bg, .45)}"/>` + R(72, 696, 100, 9, t.ink, 4.5, .7) + R(72, 712, 70, 8, t.mute, 4, .5);
      s += T(264, 58, v.title || 'Overview', 26, t.ink, 700, 'start', fam) +
        R(744, 28, 300, 38, t.surf2, 10, 1, ` stroke="${t.line}"`) + `<circle cx="770" cy="47" r="7" fill="none" stroke="${t.mute}" stroke-width="2"/>` + R(788, 43, 120, 8, t.mute, 4, .5) +
        `<circle cx="1134" cy="47" r="19" fill="${A}"/>` + T(1134, 53, String(v.brand || 'A').charAt(0), 15, ink(A), 700, 'middle');
      (v.kpis || [['Active', '1,204'], ['Completed', '98%'], ['Pending', '36'], ['Avg. time', '2.4h']]).slice(0, 4).forEach(([label, val], i) => {
        const x = 264 + i * 230;
        s += R(x, 92, 214, 112, t.surf, 14, 1, ` stroke="${t.line}"`) + T(x + 20, 124, label, 13, t.mute, 500) + T(x + 20, 172, val, 32, t.ink, 700, 'start', fam);
        let d = '', yv = .5;
        for (let k = 0; k < 8; k++) { yv = Math.min(.95, Math.max(.05, yv + (rnd() - .45) * .5)); d += (k ? 'L' : 'M') + (x + 132 + k * 9) + ' ' + n(182 - yv * 34); }
        s += `<path d="${d}" fill="none" stroke="${A}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`;
      });
      s += R(264, 220, 584, 300, t.surf, 14, 1, ` stroke="${t.line}"`) + T(284, 254, v.chart || 'Last 30 days', 15, t.ink, 600);
      for (let k = 0; k < 4; k++) s += R(284, 300 + k * 60, 544, 1, t.line);
      const pts = []; let val = .45;
      for (let k = 0; k < 16; k++) { val = Math.min(.9, Math.max(.15, val + (rnd() - .4) * .2)); pts.push([284 + k * (544 / 15), 490 - val * 190]); }
      const line = smooth(pts), lp = pts[15];
      s += `<defs><linearGradient id="${id}f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${A}" stop-opacity=".32"/><stop offset="1" stop-color="${A}" stop-opacity="0"/></linearGradient></defs>` +
        `<path d="${line}L${n(lp[0])} 496L284 496Z" fill="url(#${id}f)"/>` +
        `<path d="${line}" fill="none" stroke="${A}" stroke-width="3" stroke-linecap="round"/>` +
        `<circle cx="${n(lp[0])}" cy="${n(lp[1])}" r="6" fill="${t.surf}" stroke="${A}" stroke-width="3"/>`;
      s += R(864, 220, 304, 300, t.surf, 14, 1, ` stroke="${t.line}"`) + T(884, 254, v.side || 'Status', 15, t.ink, 600);
      const circ = 2 * Math.PI * 56, segs = [[.62, A], [.24, mix(A, t.dark ? '#FFFFFF' : '#0F1624', .4)], [.14, t.faint]];
      let off = 0;
      s += `<g transform="rotate(-90 950 388)">`;
      segs.forEach(([f, c]) => { s += `<circle cx="950" cy="388" r="56" fill="none" stroke="${c}" stroke-width="18" stroke-dasharray="${n(f * circ - 3)} ${n(circ)}" stroke-dashoffset="${n(-off * circ)}"/>`; off += f; });
      s += `</g>` + T(950, 395, '62%', 21, t.ink, 700, 'middle', fam);
      (v.legend || ['On track', 'At risk', 'Late']).slice(0, 3).forEach((l, i) => { const y = 352 + i * 36; s += `<circle cx="1040" cy="${y}" r="5" fill="${segs[i][1]}"/>` + T(1054, y + 5, l, 13, t.mute, 500); });
      s += R(264, 536, 904, 190, t.surf, 14, 1, ` stroke="${t.line}"`);
      const cols = [284, 440, 700, 940];
      (v.cols || ['Reference', 'Customer', 'Status', 'Updated']).slice(0, 4).forEach((h, i) => { s += T(cols[i], 568, h, 12.5, t.mute, 600); });
      s += R(264, 582, 904, 1, t.line);
      const st = v.statuses || [['In progress', A], ['Complete', '#35C28A'], ['Delayed', '#F2A33A'], ['Scheduled', t.mute]];
      for (let r = 0; r < 4; r++) {
        const y = 612 + r * 30, [label, col] = st[r % st.length];
        s += T(cols[0], y + 5, `${v.ref || 'REF'}-${20480 + Math.floor(rnd() * 900)}`, 13.5, t.ink, 600) +
          R(cols[1], y - 3, 110 + rnd() * 90, 9, t.mute, 4.5, .55) +
          R(cols[2], y - 11, label.length * 7.3 + 26, 24, col, 12, .16) + T(cols[2] + 13, y + 5, label, 12.5, col, 600) +
          T(cols[3], y + 5, `${r * 6 + 2} min ago`, 13, t.mute, 500);
      }
      return s;
    }

    function calendar(p, v, t, A, id) {
      const fam = v.font || SANS, rnd = prng(hash(p.name + '/cal'));
      let s = R(0, 0, 1200, 72, t.surf) + R(0, 72, 1200, 1, t.line) + R(28, 22, 28, 28, A, 8) + T(68, 43, v.brand, 18, t.ink, 700, 'start', fam);
      s += T(600, 44, v.week || '12 – 16 October', 16, t.ink, 600, 'middle') +
        `<path d="M500 37l-6 6 6 6M700 37l6 6-6 6" fill="none" stroke="${t.mute}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
      s += R(1018, 18, 150, 36, A, 10) + T(1093, 41, v.cta || 'New booking', 14, ink(A), 600, 'middle');
      s += T(28, 114, v.month || 'October', 15, t.ink, 600, 'start', fam);
      for (let r = 0; r < 5; r++) for (let c = 0; c < 7; c++) {
        const d = r * 7 + c - 1; if (d < 1 || d > 31) continue;
        const x = 28 + c * 34, y = 132 + r * 30, today = d === 14;
        if (today) s += R(x - 1, y - 1, 30, 26, A, 7);
        s += T(x + 14, y + 17, String(d), 12, today ? ink(A) : t.mute, today ? 700 : 500, 'middle');
      }
      s += R(28, 296, 236, 1, t.line) + T(28, 330, v.people || 'On shift today', 14, t.ink, 600);
      const tones = [A, mix(A, '#4F7FE8', .65), mix(A, '#E0607E', .65), mix(A, '#2FB889', .65), mix(A, '#8B6CEF', .65)];
      for (let i = 0; i < 5; i++) { const y = 364 + i * 52; s += `<circle cx="46" cy="${y}" r="16" fill="${tones[i]}" fill-opacity=".9"/>` + R(72, y - 10, 110 + rnd() * 40, 9, t.ink, 4.5, .75) + R(72, y + 6, 70 + rnd() * 30, 8, t.mute, 4, .5); }
      const gx = 296, gw = 876, lab = 58, cols = 5, cw = (gw - lab) / cols, top = 140, rowH = 58, hours = 10;
      s += R(gx, 90, gw, 644, t.surf, 14, 1, ` stroke="${t.line}"`);
      (v.days || ['Mon 12', 'Tue 13', 'Wed 14', 'Thu 15', 'Fri 16']).slice(0, 5).forEach((d, i) => { s += T(gx + lab + i * cw + cw / 2, 120, d, 13, i === 2 ? A : t.mute, 600, 'middle'); });
      for (let h = 0; h < hours; h++) { const y = top + h * rowH; s += R(gx + lab, y, gw - lab - 12, 1, t.line) + T(gx + lab - 12, y + 4, `${String(8 + h).padStart(2, '0')}:00`, 11, t.mute, 500, 'end'); }
      for (let i = 1; i < cols; i++) s += R(gx + lab + i * cw, top, 1, rowH * (hours - 1), t.line);
      for (let c = 0; c < cols; c++) {
        let tt = rnd() * .8;
        for (let guard = 0; guard < 6; guard++) {
          const dur = 1 + Math.floor(rnd() * 2) + (rnd() < .35 ? .5 : 0);
          if (tt + dur > hours - 1.1) break;
          const x = gx + lab + c * cw + 6, y = top + tt * rowH + 3, h = dur * rowH - 6, col = tones[Math.floor(rnd() * tones.length)];
          s += R(x, y, cw - 12, h, col, 8, .17) + R(x, y, 4, h, col, 2) + R(x + 14, y + 14, (cw - 44) * (.5 + rnd() * .4), 8, t.ink, 4, .75) + R(x + 14, y + 30, (cw - 44) * .4, 7, t.mute, 3.5, .6);
          tt += dur + .25 + rnd() * 1.1;
        }
      }
      const ny = top + 3.4 * rowH;
      return s + R(gx + lab + 2 * cw, ny, cw, 2, A) + `<circle cx="${n(gx + lab + 2 * cw)}" cy="${n(ny + 1)}" r="5" fill="${A}"/>`;
    }

    function svg(p) {
      const v = Object.assign({}, p.preview || {});
      v.brand = v.brand || String(p.name || '').split(' ')[0];
      const id = 'mk' + (++uid) + '-';
      const A = /^#[0-9a-f]{3,6}$/i.test(v.accent || '') ? v.accent : '#2B7FFF';
      const t = tone(v.tone !== 'light');
      const layout = v.layout || (/platform|portal|app|system/i.test(p.category || '') ? 'dash' : 'site');
      const body = layout === 'dash' ? dash(p, v, t, A, id)
        : layout === 'calendar' ? calendar(p, v, t, A, id)
        : layout === 'site-center' ? siteCenter(p, v, t, A, id)
        : site(p, v, t, A, id);
      return `<svg viewBox="0 0 1200 750" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><rect width="1200" height="750" fill="${t.bg}"/>${body}</svg>`;
    }
    return { svg };
  })();

  const visual = p => (p.image ? `<img src="${esc(p.image)}" alt="" loading="lazy" decoding="async">` : MOCK.svg(p));
  const host = p => { try { return new URL(p.url).hostname.replace(/^www\./, ''); } catch (e) { return ''; } };

  /* ---------- Data clean-up ---------- */
  PROJECTS.forEach((p, i) => {
    p._i = i;
    p.category = p.category || 'Project';
    p._cat = slug(p.category);
    if (!p.code) p.code = 'SKY-' + String(1000 + (PROJECTS.length - i) * 7).slice(-4);
  });

  /* ---------- Filters + manifest ---------- */
  const filtersEl = $('#filters'), manifest = $('#manifest');
  function renderFilters() {
    const cats = [];
    PROJECTS.forEach(p => {
      let c = cats.find(x => x.key === p._cat);
      if (!c) cats.push(c = { key: p._cat, label: /s$/i.test(p.category) ? p.category : p.category + 's', n: 0 });
      c.n++;
    });
    if (cats.length < 2) { filtersEl.hidden = true; return; }
    filtersEl.innerHTML = [{ key: 'all', label: 'All', n: PROJECTS.length }].concat(cats).map(c =>
      `<button class="filter" type="button" data-f="${c.key}" aria-pressed="${c.key === 'all'}">${esc(c.label)}<span class="count"><span class="sr-only">, </span>${c.n}</span></button>`).join('');
  }
  function renderManifest() {
    if (!PROJECTS.length) { manifest.innerHTML = '<li class="m-row"><p class="m-sum" style="padding:22px 12px">Projects will appear here.</p></li>'; return; }
    manifest.innerHTML = PROJECTS.map(p => `
      <li class="m-row" data-cat="${p._cat}" data-i="${p._i}">
        <button class="m-btn" type="button" data-i="${p._i}" aria-haspopup="dialog">
          <span class="m-thumb cut" aria-hidden="true">${visual(p)}</span>
          <span class="m-code">${esc(p.code)}</span>
          <span class="m-name">${esc(p.name)}</span>
          <span class="m-sum">${esc(p.summary)}</span>
          <span class="m-year">${esc(p.year || '')}</span>
          <span class="m-cat">${esc(p.category)}</span>
        </button>
      </li>`).join('');
  }
  renderFilters();
  renderManifest();

  /* ---------- Monitor ---------- */
  const screen = $('#screen'), scan = $('#scanline');
  let current = -1, hoverTimer = 0;
  function select(i, animate = true) {
    const p = PROJECTS[i];
    if (!p || i === current) return;
    current = i;
    $$('.m-row', manifest).forEach(r => r.classList.toggle('is-active', +r.dataset.i === i));
    const motion = animate && !mqReduce.matches;
    const layer = document.createElement('span');
    layer.className = 'layer' + (motion ? ' enter' : '');
    layer.innerHTML = visual(p);
    screen.appendChild(layer);
    const old = $$('.layer', screen).slice(0, -1);
    if (motion) {
      scan.classList.remove('run'); void scan.offsetWidth; scan.classList.add('run');
      setTimeout(() => old.forEach(o => o.remove()), 600);
    } else old.forEach(o => o.remove());
    $('#mi-code').textContent = p.code;
    $('#mi-cat').textContent = p.category;
    $('#mi-year').textContent = p.year ? `Delivered ${p.year}` : '';
    $('#mi-name').textContent = p.name;
    $('#mi-sum').textContent = p.summary || '';
    $('#mi-url').textContent = host(p) || p.name;
    $('#mi-status').textContent = p.status || 'Live';
    const live = $('#mi-live');
    if (p.url) { live.href = p.url; live.hidden = false; } else live.hidden = true;
  }
  on(manifest, 'pointerover', e => {
    if (!mqFine.matches) return;
    const b = e.target.closest('.m-btn'); if (!b) return;
    clearTimeout(hoverTimer);
    hoverTimer = setTimeout(() => select(+b.dataset.i), 70);
  });
  on(manifest, 'focusin', e => { const b = e.target.closest('.m-btn'); if (b) select(+b.dataset.i); });
  on(manifest, 'click', e => { const b = e.target.closest('.m-btn'); if (b) { clearTimeout(hoverTimer); openCase(+b.dataset.i, b); } });
  on(filtersEl, 'click', e => {
    const b = e.target.closest('.filter'); if (!b) return;
    $$('.filter', filtersEl).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    const f = b.dataset.f; let first = -1;
    $$('.m-row', manifest).forEach(r => { const show = f === 'all' || r.dataset.cat === f; r.hidden = !show; if (show && first < 0) first = +r.dataset.i; });
    const cur = manifest.querySelector(`.m-row[data-i="${current}"]`);
    if (first >= 0 && (!cur || cur.hidden)) select(first);
  });
  select(0, false);

  /* ---------- Project details dialog ---------- */
  const dlg = $('#case');
  let caseIdx = -1, lastOpener = null;
  const visibleOrder = () => $$('.m-row', manifest).filter(r => !r.hidden && r.dataset.i != null).map(r => +r.dataset.i);
  function fillCase(i) {
    const p = PROJECTS[i]; if (!p) return;
    caseIdx = i;
    $('#c-code').textContent = p.code;
    $('#c-cat').textContent = p.category;
    $('#c-year').textContent = p.year ? `Delivered ${p.year}` : '';
    $('#case-title').textContent = p.name;
    $('#c-sum').textContent = p.summary || '';
    $('#c-screen').innerHTML = visual(p);
    const part = (wrap, has, fill) => { $(wrap).hidden = !has; if (has) fill(); };
    part('#c-brief-wrap', !!p.brief, () => { $('#c-brief').textContent = p.brief; });
    part('#c-built-wrap', !!(p.built && p.built.length), () => { $('#c-built').innerHTML = p.built.map(b => `<li>${esc(b)}</li>`).join(''); });
    part('#c-outcome-wrap', !!p.outcome, () => { $('#c-outcome').textContent = p.outcome; });
    part('#c-stack-wrap', !!(p.stack && p.stack.length), () => { $('#c-stack').innerHTML = p.stack.map(s => `<span class="chip">${esc(s)}</span>`).join(''); });
    const live = $('#c-live');
    if (p.url) { live.href = p.url; live.hidden = false; } else live.hidden = true;
    const many = visibleOrder().length > 1;
    $$('[data-step]', dlg).forEach(b => { b.hidden = !many; });
    $('#case-panel').scrollTop = 0;
  }
  function openCase(i, opener) {
    if (!PROJECTS[i]) return;
    fillCase(i);
    if (i !== current) select(i, false);
    if (!dlg.open) {
      lastOpener = opener || null;
      if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
    }
  }
  function step(d) {
    const order = visibleOrder(); if (order.length < 2) return;
    const pos = Math.max(0, order.indexOf(caseIdx));
    const next = order[(pos + d + order.length) % order.length];
    fillCase(next); select(next, false);
  }
  $$('[data-step]', dlg).forEach(b => on(b, 'click', () => step(+b.dataset.step)));
  on($('#c-close'), 'click', () => dlg.close());
  on(dlg, 'click', e => { if (e.target === dlg) dlg.close(); });
  on(dlg, 'keydown', e => {
    if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
  });
  on(dlg, 'close', () => { if (lastOpener && document.contains(lastOpener)) lastOpener.focus({ preventScroll: true }); });
  on($('#mi-open'), 'click', e => openCase(current, e.currentTarget));
  on(screen, 'click', () => openCase(current, $('#mi-open')));

  /* ---------- Service illustrations ---------- */
  $('#svc-web').innerHTML = MOCK.svg({ name: 'Your brand', category: 'Website', preview: { layout: 'site', tone: 'dark', accent: '#2B7FFF', brand: 'Your brand', headline: ['Your business,', 'always open.'], cta: 'Get a quote', cta2: 'Our work', links: ['Services', 'Work', 'About', 'Contact'], cards: ['Fast', 'Easy to find', 'Easy to edit'], art: 'glow' } });
  $('#svc-platform').innerHTML = MOCK.svg({ name: 'Your platform', category: 'Service platform', preview: { layout: 'dash', tone: 'dark', accent: '#2B7FFF', brand: 'Your brand', title: 'Bookings', nav: ['Overview', 'Bookings', 'Customers', 'Team', 'Payments', 'Reports', 'Settings'], kpis: [['Bookings today', '48'], ['Paid online', '92%'], ['No-shows', '3'], ['Avg. rating', '4.9']], chart: 'Bookings, last 30 days', side: 'Today', legend: ['Confirmed', 'Pending', 'Cancelled'], cols: ['Booking', 'Customer', 'Status', 'Updated'], ref: 'BK', statuses: [['Confirmed', '#2B7FFF'], ['Paid', '#35C28A'], ['Moved', '#F2A33A'], ['Pending', '#6E7A8F']] } });

  $$('.svc-visual svg').forEach(s => s.setAttribute('preserveAspectRatio', 'xMidYMin slice'));

  /* ---------- Contact details + form ---------- */
  $$('[data-email]').forEach(a => { a.href = 'mailto:' + CONFIG.email; a.textContent = CONFIG.email; });
  $$('[data-availability]').forEach(el => { el.textContent = CONFIG.availability; });
  $$('[data-response]').forEach(el => { el.textContent = CONFIG.responseTime; });
  $('#year').textContent = new Date().getFullYear();

  const form = $('#brief'), note = $('#form-note');
  $('#f-budget').innerHTML = '<option value="">Choose a range</option>' + CONFIG.budgets.map(b => `<option>${esc(b)}</option>`).join('');
  $('#submit-label').textContent = CONFIG.formEndpoint ? 'Send brief' : 'Email this brief';
  on(form, 'input', e => { if (e.target.getAttribute('aria-invalid') === 'true') e.target.setAttribute('aria-invalid', 'false'); });
  on(form, 'submit', async e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(form).entries());
    const checks = [['f-name', !!String(d.name || '').trim()], ['f-email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(d.email || '').trim())], ['f-msg', !!String(d.message || '').trim()]];
    let firstBad = null;
    checks.forEach(([id, ok]) => { const el = document.getElementById(id); el.setAttribute('aria-invalid', String(!ok)); if (!ok && !firstBad) firstBad = el; });
    if (firstBad) {
      note.className = 'form-note is-error';
      note.textContent = 'Add your name, a valid email address and a few words about the project.';
      firstBad.focus();
      return;
    }
    const subject = `Project brief: ${d.type} for ${d.company || d.name}`;
    const lines = [`Name: ${d.name}`, `Email: ${d.email}`];
    if (d.company) lines.push(`Company: ${d.company}`);
    lines.push(`Needs: ${d.type}`);
    if (d.budget) lines.push(`Budget: ${d.budget}`);
    lines.push('', d.message);
    if (CONFIG.formEndpoint) {
      try {
        const r = await fetch(CONFIG.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(Object.assign({ _subject: subject }, d)) });
        if (!r.ok) throw new Error(String(r.status));
        note.className = 'form-note';
        note.textContent = `Brief sent. We’ll reply within ${CONFIG.responseTime}.`;
        form.reset();
        return;
      } catch (err) { /* fall back to email below */ }
    }
    note.className = 'form-note';
    note.innerHTML = `Your email app should open with this brief filled in. If it doesn’t, email <a href="mailto:${esc(CONFIG.email)}">${esc(CONFIG.email)}</a>.`;
    try { window.location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`; } catch (err) { /* note above covers it */ }
  });

  /* ---------- Navigation ---------- */
  const nav = $('#nav'), hero = $('.hero');
  let ticking = false;
  const onScroll = () => {
    ticking = false;
    const y = window.scrollY || 0;
    nav.classList.toggle('is-scrolled', y > 12);
    nav.classList.toggle('show-word', y > hero.offsetHeight * .42);
  };
  on(window, 'scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  const navLinks = $$('.nav-links a');
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        navLinks.forEach(a => { if (a.hash === '#' + en.target.id) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['top', 'work', 'services', 'process', 'contact'].forEach(id => { const el = document.getElementById(id); if (el) spy.observe(el); });
  }

  const menuBtn = $('#menu-btn'), menu = $('#menu');
  const setMenu = open => {
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.hidden = !open;
    nav.classList.toggle('is-open', open);
  };
  on(menuBtn, 'click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
  on(menu, 'click', e => { if (e.target.closest('a')) setMenu(false); });
  on(document, 'keydown', e => { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); menuBtn.focus(); } });
  on(matchMedia('(min-width: 901px)'), 'change', e => { if (e.matches) setMenu(false); });

  /* ---------- Hero logo: light sweep on arrival, gentle tilt on pointer ---------- */
  const heroLogo = $('#hero-logo'), tilt = $('#logo-tilt'), sheen = $('#logo-sheen');
  const runSheen = () => { if (mqReduce.matches) return; sheen.classList.remove('run'); void sheen.offsetWidth; sheen.classList.add('run'); };
  on(sheen, 'animationend', () => sheen.classList.remove('run'));
  whenReady(() => setTimeout(runSheen, 1050));
  if (mqFine.matches) {
    on(hero, 'pointermove', e => {
      if (mqReduce.matches) return;
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      tilt.style.setProperty('--ry', (x * 8).toFixed(2) + 'deg');
      tilt.style.setProperty('--rx', (-y * 6).toFixed(2) + 'deg');
    });
    on(hero, 'pointerleave', () => { tilt.style.setProperty('--ry', '0deg'); tilt.style.setProperty('--rx', '0deg'); });
    on(heroLogo, 'pointerenter', () => { if (!sheen.classList.contains('run')) runSheen(); });
  }

  /* ---------- Sky: planet limb + delivery routes ---------- */
  const sky = (() => {
    const canvas = $('#sky');
    if (!canvas || !canvas.getContext) return null;
    const ctx = canvas.getContext('2d');
    const box = canvas.parentElement;
    const rand = prng(20260930);
    let W = 1, H = 1, dpr = 1, G = null, C = {}, nodes = [], hub = null, trips = [];
    let running = false, raf = 0, last = 0, igniteAt = -1, nextSpawn = 0, launched = false, inView = true;
    const base = document.createElement('canvas'), limb = document.createElement('canvas');

    const rgba = (str, a) => {
      str = String(str || '').trim();
      let r = 0, g = 0, b = 0, al = 1;
      if (str[0] === '#') {
        let h = str.slice(1); if (h.length === 3) h = h.split('').map(c => c + c).join('');
        const v = parseInt(h.slice(0, 6), 16) || 0; r = v >> 16 & 255; g = v >> 8 & 255; b = v & 255;
      } else {
        const m = str.match(/[\d.]+/g) || []; r = +m[0] || 0; g = +m[1] || 0; b = +m[2] || 0; al = m[3] != null ? +m[3] : 1;
      }
      return `rgba(${r},${g},${b},${Math.max(0, Math.min(1, al * a)).toFixed(3)})`;
    };
    const limbY = x => G.cy - Math.sqrt(Math.max(0, G.R * G.R - (x - G.cx) * (x - G.cx)));
    const bez = (t, a, c, b) => { const u = 1 - t; return [u * u * a.x + 2 * u * t * c.x + t * t * b.x, u * u * a.y + 2 * u * t * c.y + t * t * b.y]; };
    const ease = t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    function readColors() {
      const cs = getComputedStyle(root), g = k => cs.getPropertyValue(k).trim();
      C = { top: g('--sky-top'), bottom: g('--sky-bottom'), planet: g('--planet'), line: g('--planet-line'), limb: g('--limb'), hot: g('--limb-hot'), star: g('--star'), packet: g('--packet'), route: g('--route'), glow: g('--glow'), dark: isDark() };
    }
    function measure() {
      const r = box.getBoundingClientRect();
      W = Math.max(1, Math.round(r.width)); H = Math.max(1, Math.round(r.height));
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = base.width = limb.width = Math.round(W * dpr);
      canvas.height = base.height = limb.height = Math.round(H * dpr);
      const vis = Math.max(90, Math.min(H * .14, 150));
      const R = Math.max(W * 1.6, 700);
      G = { cx: W / 2, y0: H - vis, R, cy: H - vis + R, vis };
      const pr = prng(11);
      const xs = W < 640 ? [.1, .3, .7, .9] : [.08, .18, .28, .38, .62, .72, .82, .92];
      nodes = xs.map(f => { const x = W * (f + (pr() - .5) * .03); const ly = limbY(x); return { x, y: ly + 8 + pr() * Math.max(4, Math.min(26, (H - ly) * .3)), pulse: 0 }; });
      hub = { x: G.cx, y: G.y0 + 12, pulse: 0 };
      trips = [];
    }
    function paintBase() {
      const b = base.getContext('2d');
      b.setTransform(dpr, 0, 0, dpr, 0, 0);
      b.clearRect(0, 0, W, H);
      const sg = b.createLinearGradient(0, 0, 0, G.y0 + 20);
      sg.addColorStop(0, C.top); sg.addColorStop(1, C.bottom);
      b.fillStyle = sg; b.fillRect(0, 0, W, H);
      if (C.dark) {
        const pr = prng(3), count = Math.min(260, Math.round(W * H / 6500));
        b.fillStyle = C.star;
        for (let i = 0; i < count; i++) {
          const x = pr() * W, y = pr() * G.y0, big = pr() < .07, s = big ? 1.25 : .45 + pr() * .55, a = .15 + pr() * .6, ly = limbY(x);
          if (y > ly - 12) continue;
          b.globalAlpha = a * Math.min(1, (ly - y) / 180);
          b.beginPath(); b.arc(x, y, s, 0, 6.283); b.fill();
        }
        b.globalAlpha = 1;
      }
      b.save();
      b.translate(G.cx, G.y0); b.scale(1, .3);
      const ag = b.createRadialGradient(0, 0, 0, 0, 0, W * .62);
      ag.addColorStop(0, rgba(C.glow, C.dark ? .8 : .7)); ag.addColorStop(.5, rgba(C.glow, C.dark ? .2 : .16)); ag.addColorStop(1, rgba(C.glow, 0));
      b.fillStyle = ag; b.fillRect(-W, -W * 3, W * 2, W * 6);
      b.restore();
      b.save();
      b.beginPath(); b.arc(G.cx, G.cy, G.R, 0, 6.283); b.closePath();
      b.fillStyle = C.planet; b.fill();
      b.clip();
      b.save();
      b.translate(G.cx, G.y0); b.scale(1, .42);
      const rl = b.createRadialGradient(0, 0, 0, 0, 0, W * .5);
      rl.addColorStop(0, rgba(C.glow, C.dark ? .38 : .28)); rl.addColorStop(1, rgba(C.glow, 0));
      b.fillStyle = rl; b.fillRect(-W, 0, W * 2, H * 4);
      b.restore();
      b.strokeStyle = C.line; b.lineWidth = 1;
      for (let k = 1; k < 12; k++) { const rr = G.R - Math.pow(k, 1.6) * 11; if (G.R - rr > H - G.y0 + 60) break; b.beginPath(); b.arc(G.cx, G.cy, rr, Math.PI, 2 * Math.PI); b.stroke(); }
      for (let j = -12; j <= 12; j++) { b.beginPath(); b.moveTo(G.cx + j * 14, G.y0); b.lineTo(G.cx + j * W * .16, H + 80); b.stroke(); }
      b.restore();
    }
    function paintLimb() {
      const l = limb.getContext('2d');
      l.setTransform(dpr, 0, 0, dpr, 0, 0);
      l.clearRect(0, 0, W, H);
      const k = Math.min(1, (W / 2 + 30) / G.R), a = Math.acos(k);
      const arc = () => { l.beginPath(); l.arc(G.cx, G.cy, G.R, Math.PI + a, 2 * Math.PI - a); };
      const grad = (peak, spread) => {
        const g = l.createLinearGradient(0, 0, W, 0);
        g.addColorStop(0, rgba(C.limb, 0));
        g.addColorStop(.5 - spread, rgba(C.limb, peak * .22));
        g.addColorStop(.5 - spread * .45, rgba(C.limb, peak));
        g.addColorStop(.5, rgba(C.hot, peak));
        g.addColorStop(.5 + spread * .45, rgba(C.limb, peak));
        g.addColorStop(.5 + spread, rgba(C.limb, peak * .22));
        g.addColorStop(1, rgba(C.limb, 0));
        return g;
      };
      l.save(); l.shadowColor = rgba(C.limb, C.dark ? 1 : .75); l.shadowBlur = 26 * dpr; l.lineWidth = 3; l.strokeStyle = grad(C.dark ? .9 : .7, .44); arc(); l.stroke(); l.restore();
      l.save(); l.shadowColor = rgba(C.hot, 1); l.shadowBlur = 8 * dpr; l.lineWidth = 1.6; l.strokeStyle = grad(1, .42); arc(); l.stroke(); l.restore();
      const hc = l.createLinearGradient(0, 0, W, 0);
      hc.addColorStop(.35, rgba(C.hot, 0)); hc.addColorStop(.5, rgba(C.hot, 1)); hc.addColorStop(.65, rgba(C.hot, 0));
      l.lineWidth = 2.2; l.strokeStyle = hc; arc(); l.stroke();
    }
    function drawNodes(dt, alpha) {
      if (alpha <= 0) return;
      ctx.save(); ctx.globalAlpha = alpha;
      for (const nd of nodes.concat(hub)) {
        nd.pulse = Math.max(0, nd.pulse - dt / 900);
        const rr = 11 + nd.pulse * 14;
        const gr = ctx.createRadialGradient(nd.x, nd.y, 0, nd.x, nd.y, rr);
        gr.addColorStop(0, rgba(C.hot, .5 + nd.pulse * .4)); gr.addColorStop(1, rgba(C.limb, 0));
        ctx.fillStyle = gr; ctx.beginPath(); ctx.ellipse(nd.x, nd.y, rr, rr * .45, 0, 0, 6.283); ctx.fill();
        ctx.fillStyle = rgba(C.packet, .95); ctx.beginPath(); ctx.arc(nd.x, nd.y, nd === hub ? 2.6 : 1.8, 0, 6.283); ctx.fill();
      }
      ctx.restore();
    }
    function spawn(from) {
      const a = from || (rand() < .4 ? hub : nodes[Math.floor(rand() * nodes.length)]);
      let b = null;
      for (let k = 0; k < 24; k++) { const c = nodes[Math.floor(rand() * nodes.length)]; if (c !== a && Math.abs(c.x - a.x) > W * .14) { b = c; break; } }
      if (!b) return;
      const d = Math.abs(b.x - a.x), h = Math.min(G.y0 * .5, d * (.34 + rand() * .2));
      trips.push({ a, b, c: { x: (a.x + b.x) / 2 + (rand() - .5) * d * .12, y: Math.min(a.y, b.y) - h }, p: 0, dur: 2300 + d * 1.5, after: 0 });
      a.pulse = 1;
    }
    function drawTrips(dt) {
      if (!trips.length) return;
      ctx.save();
      ctx.globalCompositeOperation = C.dark ? 'lighter' : 'source-over';
      ctx.lineCap = 'round';
      for (const t of trips) {
        if (t.p < 1) { t.p = Math.min(1, t.p + dt / t.dur); if (t.p >= 1) t.b.pulse = 1; } else t.after += dt;
        const e = ease(t.p), fade = t.p < 1 ? 1 : Math.max(0, 1 - t.after / 1500);
        ctx.beginPath();
        for (let s = 0; s <= 40; s++) { const q = bez(e * s / 40, t.a, t.c, t.b); if (s) ctx.lineTo(q[0], q[1]); else ctx.moveTo(q[0], q[1]); }
        ctx.strokeStyle = rgba(C.route, .75 * fade); ctx.lineWidth = 1; ctx.stroke();
        if (t.p < 1) {
          const tail = Math.max(0, e - .2);
          for (let s = 0; s < 12; s++) {
            const p0 = bez(tail + (e - tail) * s / 12, t.a, t.c, t.b), p1 = bez(tail + (e - tail) * (s + 1) / 12, t.a, t.c, t.b);
            ctx.strokeStyle = rgba(C.packet, (s + 1) / 12 * .9); ctx.lineWidth = .6 + (s + 1) / 12 * 1.6;
            ctx.beginPath(); ctx.moveTo(p0[0], p0[1]); ctx.lineTo(p1[0], p1[1]); ctx.stroke();
          }
          const hd = bez(e, t.a, t.c, t.b);
          const hg = ctx.createRadialGradient(hd[0], hd[1], 0, hd[0], hd[1], 16);
          hg.addColorStop(0, rgba(C.packet, .9)); hg.addColorStop(.3, rgba(C.limb, .4)); hg.addColorStop(1, rgba(C.limb, 0));
          ctx.fillStyle = hg; ctx.beginPath(); ctx.arc(hd[0], hd[1], 16, 0, 6.283); ctx.fill();
          ctx.fillStyle = rgba(C.packet, 1); ctx.beginPath(); ctx.arc(hd[0], hd[1], 1.9, 0, 6.283); ctx.fill();
        } else if (t.after < 1000) {
          const q = t.after / 1000, rr = 4 + q * 30;
          ctx.strokeStyle = rgba(C.hot, (1 - q) * .85); ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.ellipse(t.b.x, t.b.y, rr, rr * .32, 0, 0, 6.283); ctx.stroke();
        }
      }
      trips = trips.filter(t => t.after < 1500);
      ctx.restore();
    }
    function drawStill() {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(base, 0, 0);
      if (!ready && !mqReduce.matches) return;
      ctx.drawImage(limb, 0, 0);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (mqReduce.matches && nodes.length > 3) {
        ctx.save(); ctx.strokeStyle = rgba(C.route, .6); ctx.lineWidth = 1;
        [[hub, nodes[1]], [hub, nodes[nodes.length - 2]], [nodes[0], nodes[nodes.length - 1]]].forEach(([a, b], i) => {
          const d = Math.abs(b.x - a.x), c = { x: (a.x + b.x) / 2, y: Math.min(a.y, b.y) - Math.min(G.y0 * .45, d * (.36 + i * .06)) };
          ctx.beginPath(); for (let s = 0; s <= 40; s++) { const q = bez(s / 40, a, c, b); if (s) ctx.lineTo(q[0], q[1]); else ctx.moveTo(q[0], q[1]); } ctx.stroke();
        });
        ctx.restore();
      }
      drawNodes(0, 1);
    }
    function frame(now) {
      raf = 0;
      if (!running) return;
      const dt = last ? Math.min(48, now - last) : 16; last = now;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(base, 0, 0);
      const ig = igniteAt < 0 ? 0 : Math.min(1, (now - igniteAt) / 1400), e = 1 - Math.pow(1 - ig, 3);
      if (e >= 1) ctx.drawImage(limb, 0, 0);
      else if (e > 0) {
        const half = canvas.width / 2 * e;
        ctx.save(); ctx.beginPath(); ctx.rect(canvas.width / 2 - half, 0, half * 2, canvas.height); ctx.clip(); ctx.drawImage(limb, 0, 0); ctx.restore();
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawNodes(dt, e);
      if (igniteAt >= 0) {
        if (!launched && now - igniteAt > 1300) { launched = true; spawn(hub); nextSpawn = now + 1700; }
        else if (launched && now > nextSpawn && trips.length < 4) { spawn(); nextSpawn = now + 900 + rand() * 1300; }
      }
      drawTrips(dt);
      raf = requestAnimationFrame(frame);
    }
    function update() {
      const should = ready && inView && !document.hidden && !mqReduce.matches;
      if (should && !running) { running = true; last = 0; raf = requestAnimationFrame(frame); }
      else if (!should && running) { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; }
      if (!running) drawStill();
    }
    function rebuild() { readColors(); measure(); paintBase(); paintLimb(); if (!running) drawStill(); }
    function refresh() { readColors(); paintBase(); paintLimb(); if (!running) drawStill(); }

    rebuild();
    if ('ResizeObserver' in window) {
      let rt = 0, lastW = W, lastH = H;
      new ResizeObserver(() => {
        clearTimeout(rt);
        rt = setTimeout(() => { const r = box.getBoundingClientRect(); if (Math.round(r.width) !== lastW || Math.round(r.height) !== lastH) { rebuild(); lastW = W; lastH = H; } }, 80);
      }).observe(box);
    } else on(window, 'resize', rebuild);
    if ('IntersectionObserver' in window) new IntersectionObserver(([en]) => { inView = en.isIntersecting; update(); }).observe(box);
    on(document, 'visibilitychange', update);
    on(mqReduce, 'change', update);
    whenReady(() => { igniteAt = performance.now(); update(); });
    return { refresh };
  })();

  /* ---------- Theme ---------- */
  const themeBtn = $('#theme-btn');
  const syncTheme = () => {
    const d = isDark();
    themeBtn.dataset.mode = d ? 'dark' : 'light';
    themeBtn.setAttribute('aria-label', d ? 'Switch to light theme' : 'Switch to dark theme');
    if (sky) sky.refresh();
  };
  on(themeBtn, 'click', () => {
    const next = isDark() ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('skynet-theme', next); } catch (e) { /* storage unavailable */ }
  });
  if ('MutationObserver' in window) new MutationObserver(syncTheme).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
  on(mqDark, 'change', syncTheme);
  syncTheme();
})();
