// Generates index.html — Meru, Design M "Minimalist" — from the SAME data the
// Remotion version uses:
//   ../remotion/src/meru/data.ts     (shots, timing, copy)
//   ../remotion/src/meru/mapData.ts  (OpenStreetMap-derived geometry)
// Run:  node --experimental-strip-types build.mts
import fs from 'node:fs';
import {project, shots, starts, startOf, TOTAL} from '../remotion/src/meru/data.ts';
import {roads, land, places, hwLabels} from '../remotion/src/meru/mapData.ts';

const r = (n: number) => Math.round(n * 1000) / 1000;
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const st = starts();
const tw: string[] = [];
const T = (s: string) => tw.push(s);
const rise = (sel: string, t: number, dist = 24) => T(`tl.fromTo('${sel}',{opacity:0,y:${dist}},{opacity:1,y:0,duration:0.45,ease:'power3.out'},${r(t)});`);

const PAPER = '#F6F4EF';
const INK = '#1C1C1C';
const GREY = '#8A8680';
const LINE = '#D9D4CB';
const CARD = {left: 96, top: 300, width: 888, height: 600};

// ---------- scenes ----------
const sceneHtml: string[] = [];
const scene = (id: string, inner: string) => {
  const i = shots.findIndex((s) => s.id === id);
  sceneHtml.push(`<div id="sc-${id}" class="clip scene" data-start="${r(st[i])}" data-duration="${r(shots[i].dur)}" data-track-index="0" style="z-index:${i + 1}">${inner}</div>`);
};
const photo = (id: string) => {
  const s = shots.find((x) => x.id === id)!;
  if (s.kind !== 'image') return '';
  const x = s.x ?? [50, 50];
  const t0 = startOf(id);
  T(`tl.fromTo('#card-${id}',{opacity:0,y:40},{opacity:1,y:0,duration:0.5,ease:'power3.out'},${r(t0)});`);
  T(`tl.fromTo('#ph-${id}',{scale:1,objectPosition:'${x[0]}% 50%'},{scale:1.06,objectPosition:'${x[1]}% 50%',duration:${s.dur},ease:'none'},${r(t0)});`);
  return `<div class="card" id="card-${id}"><img class="ph" id="ph-${id}" src="assets/media/${s.img ?? 'render.jpg'}" alt=""></div>`;
};
const text = (id: string, parts: [string, string, number][], top = 960) => {
  // parts: [className, html, delay seconds]
  const t0 = startOf(id);
  parts.forEach(([, , d], k) => rise(`#t-${id}-${k}`, t0 + d, 18));
  return `<div class="text" style="top:${top}px">${parts.map(([c, h], k) => `<div id="t-${id}-${k}" class="${c}">${h}</div>`).join('')}</div>`;
};
const index = (id: string, n: string) => {
  T(`tl.fromTo('#ix-${id}',{opacity:0},{opacity:1,duration:0.35},${r(startOf(id) + 0.2)});`);
  return `<div class="ix" id="ix-${id}">${n}</div>`;
};

scene('hook', photo('hook') + `<div class="text" style="top:960px"><div class="eyebrow">Projek Baru · Meru, Klang</div><div class="title">Booking RM1,000.</div><div id="t-hook-b" class="body">Rumah teres &amp; berkembar 1-tingkat, freehold.</div></div>`);
rise('#t-hook-b', 0.2, 16);
scene('reveal', photo('reveal') + text('reveal', [['eyebrow', 'Jalan Nenas, Meru', 0.13], ['title', '5 minit ke Hospital Kapar.', 0.27]]));
scene('exterior', photo('exterior') + index('exterior', '01 / 04') + text('exterior', [['eyebrow', 'Luar rumah', 0.13], ['title', 'Jom tengok dalam.', 0.27]]));
scene('living', photo('living') + index('living', '02 / 04') + text('living', [['eyebrow', 'Ruang tamu &amp; dapur', 0.13], ['title t76', 'Terbuka, terus ke dapur.', 0.27]]));
scene('hallway', photo('hallway') + index('hallway', '03 / 04') + text('hallway', [['eyebrow', 'Bilik', 0.13], ['title', '4 bilik tidur.', 0.27]]));
scene('bath', photo('bath') + index('bath', '04 / 04') + text('bath', [['eyebrow', 'Bilik air', 0.13], ['title', '2 bilik air.', 0.27]]));

// package — numbered list with hairlines
{
  const t0 = startOf('package');
  rise('#pk-eb', t0 + 0.07, 12);
  T(`tl.fromTo('#pk-hair',{scaleX:0,transformOrigin:'0 50%'},{scaleX:1,duration:0.6,ease:'power3.out'},${r(t0 + 0.13)});`);
  project.pkg.forEach((_, i) => rise(`#pk-${i}`, t0 + (10 + i * 30) / 30, 20));
  scene('package', `<div class="text" style="top:330px"><div id="pk-eb" class="eyebrow">Pakej</div><div id="pk-hair" class="hair"></div>${project.pkg
    .map((p, i) => `<div id="pk-${i}" class="row"><span class="num">0${i + 1}</span><span class="${i === 0 ? 'rowserif' : 'rowsans'}">${esc(p)}</span></div>`)
    .join('')}</div>`);
}
// specs — two columns
{
  const t0 = startOf('specs');
  rise('#sp-eb', t0 + 0.07, 12);
  T(`tl.fromTo('#sp-hair',{scaleX:0,transformOrigin:'0 50%'},{scaleX:1,duration:0.6,ease:'power3.out'},${r(t0 + 0.13)});`);
  project.types.forEach((_, i) => rise(`#ty-${i}`, t0 + (10 + i * 24) / 30, 24));
  project.common.forEach((_, i) => rise(`#cm-${i}`, t0 + (70 + i * 15) / 30, 12));
  const col = (t: (typeof project.types)[number], i: number) => {
    const [la, ls] = t.land.split(' (');
    const [ba, bs] = t.built.split(' (');
    return `<div id="ty-${i}"><div class="colname">${esc(t.name.replace(' 1-Tingkat', ''))}</div>
      <div class="k">TANAH</div><div class="v">${esc(la)}</div><div class="s">${esc(ls.replace(')', ''))}</div>
      <div class="k">BINAAN</div><div class="v">${esc(ba)}</div><div class="s">${esc(bs.replace(')', ''))}</div>
      <div class="k">DARI</div><div class="price">${esc(t.price)}</div></div>`;
  };
  scene('specs', `<div class="text" style="top:320px"><div id="sp-eb" class="eyebrow">Dua pilihan</div><div id="sp-hair" class="hair"></div>
    <div class="grid">${project.types.map(col).join('')}</div>
    <div class="common">${project.common.map((c, i) => `<div id="cm-${i}" class="cm">${esc(c)}</div>`).join('')}</div></div>`);
}

// ---------- map (monochrome, close -> wide like a map app) ----------
{
  const id = 'map';
  const t0 = startOf(id);
  const CLOSE = [700, 450, 8600];
  const WIDE = [2500, 1200, 26000];
  const vb = ([cx, cy, w]: number[]) => `${cx - w / 2} ${cy - (w * 16) / 18} ${w} ${(w * 16) / 9}`;
  const line = (d: string, c: string, w: number) => `<path d="${d}" stroke="${c}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>`;
  const kC = CLOSE[2] / 1080;
  const kW = WIDE[2] / 1080;
  const lbl = (sid: string, [x, y]: [number, number], t: string, px: number, k: number, color = INK) =>
    `<text id="${sid}" x="${x}" y="${y}" font-family="DM Sans" font-weight="700" font-size="${px * k}" fill="${color}" stroke="#F3F1EC" stroke-width="${6 * k}" paint-order="stroke" dominant-baseline="middle">${esc(t)}</text>`;
  const FAC: [string, string, number][] = [
    ['SK Meru', 'SK Meru · 2 min', 10],
    ['99 Speedmart', '99 Speedmart · 4 min', 70],
    ['Hospital Kapar', 'Hospital Kapar · 5 min', 60],
    ['SMK Meru', 'SMK Meru · 10 min', -60],
    ['Klinik Kesihatan Meru', 'Klinik Kesihatan · 4 min', 40],
  ];
  const close = FAC.map(([k, t, dy], i) => `<circle cx="${places[k][0]}" cy="${places[k][1]}" r="${9 * kC}" fill="#6B6760"/>` + lbl(`mf-${i}`, [places[k][0] + 22 * kC, places[k][1] + dy * kC], t, 26, kC, '#3A3A3A')).join('');
  const towns = ['Kapar', 'Meru', 'Klang', 'Setia Alam', 'Shah Alam'].map((t, i) => lbl(`mt-${i}`, places[t] as [number, number], t, 38, kW)).join('');
  const near = (ref: string, tgt: [number, number]) => (hwLabels[ref] || []).reduce((a, b) => (Math.hypot(b[0] - tgt[0], b[1] - tgt[1]) < Math.hypot(a[0] - tgt[0], a[1] - tgt[1]) ? b : a), (hwLabels[ref] || [[0, 0]])[0]);
  const shields = ([['E32', 'WCE', [-1500, 5500]], ['E1', 'NKVE', [9000, 6000]], ['FT2', 'Federal', [9000, 10500]]] as [string, string, [number, number]][])
    .map(([ref, t, tgt], i) => {
      const [x, y] = near(ref, tgt);
      const w = (t.length * 19 + 28) * kW;
      const h = 44 * kW;
      return `<g id="ms-${i}" opacity="0"><rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="${6 * kW}" fill="${INK}"/><text x="${x}" y="${y}" font-family="DM Sans" font-weight="700" font-size="${28 * kW}" fill="#fff" text-anchor="middle" dominant-baseline="central">${t}</text></g>`;
    })
    .join('');
  const [px, py] = places['Projek'];
  const pinW = 84 * kC;
  const inner = `<div class="mapbg"></div>
    <svg id="map-svg" width="1080" height="1920" viewBox="${vb(CLOSE)}" style="position:absolute;inset:0" data-layout-ignore>
      ${land.map((d) => `<path d="${d}" fill="#F3F1EC"/>`).join('')}
      ${roads.primary.map((d) => line(d, '#E2DED6', 5)).join('')}${roads.primary.map((d) => line(d, '#FFFFFF', 3.5)).join('')}
      ${roads.secondary.map((d) => line(d, '#FFFFFF', 6)).join('')}
      ${roads.trunk.map((d) => line(d, '#BDB8AF', 8)).join('')}
      ${roads.motorway.map((d) => line(d, '#3A3A3A', 9)).join('')}
      <g id="map-close">${close}</g>
      <g id="map-wide" opacity="0">${towns}</g>
      ${shields}
      <g id="map-pin"><path transform="translate(${px - pinW / 2} ${py - pinW * 1.32}) scale(${pinW / 46})" d="M23 0C10.3 0 0 10.3 0 23c0 17.2 23 39 23 39s23-21.8 23-39C46 10.3 35.7 0 23 0z" fill="${INK}"/></g>
    </svg>
    <div class="text" style="top:300px"><div id="mp-0" class="title t64">Lokasi.</div><div id="mp-1" class="maptxt">${project.access.map(esc).join('  ·  ')}</div><div id="mp-2" class="mapsub">${project.malls.map(esc).join('  ·  ')}</div></div>
    <div class="credit">Data peta © OpenStreetMap contributors</div>`;
  scene(id, inner);
  T(`tl.fromTo('#map-svg',{attr:{viewBox:'${vb(CLOSE)}'}},{attr:{viewBox:'${vb(WIDE)}'},duration:1.33,ease:'power3.inOut'},${r(t0 + 1.47)});`);
  T(`tl.fromTo('#map-pin',{y:${-260 * kC},opacity:0},{y:0,opacity:1,duration:0.45,ease:'bounce.out'},${r(t0 + 0.07)});`);
  T(`tl.fromTo('#map-close',{opacity:0},{opacity:1,duration:0.4},${r(t0 + 0.4)});tl.to('#map-close',{opacity:0,duration:0.4},${r(t0 + 1.7)});`);
  T(`tl.to('#map-wide',{opacity:1,duration:0.4},${r(t0 + 2.3)});`);
  [0, 1, 2].forEach((i) => T(`tl.to('#ms-${i}',{opacity:1,duration:0.3},${r(t0 + 2.2 + i * 0.1)});`));
  rise('#mp-0', t0, 12);
  rise('#mp-1', t0 + 0.27, 10);
  rise('#mp-2', t0 + 0.53, 10);
}

// ---------- CTA (phone + name only) ----------
{
  const t0 = startOf('cta');
  const parts: [string, string, number][] = [
    ['eyebrow', 'Projek Perumahan Baru', 0.07],
    ['ctasub', 'Teres 1-tingkat dari', 0.2],
    ['ctaprice', project.priceFrom, 0.3],
    ['ctasub', 'Berkembar dari RM516,420', 0.43],
    ['ctabook', `Booking ${project.booking} sahaja.`, 0.53],
    ['hair', '', 0.67],
    ['ctaphone', project.phone, 0.8],
    ['ctaname', project.agent, 0.9],
  ];
  scene('cta', text('cta', parts, 360));
}

// ---------- SFX ----------
const DUR: Record<string, number> = {'whoosh-soft': 0.45, click: 0.04, pop: 0.1, ding: 1.0};
const cues: [number, string, number][] = [
  [0, 'pop', 0.45],
  ...st.slice(1).map((t) => [t - 0.1, 'whoosh-soft', 0.35] as [number, string, number]),
  ...project.pkg.map((_, i) => [startOf('package') + (10 + i * 30) / 30, 'click', 0.5] as [number, string, number]),
  ...project.types.map((_, i) => [startOf('specs') + (10 + i * 24) / 30, 'click', 0.5] as [number, string, number]),
  [startOf('map') + 0.25, 'pop', 0.4],
  [startOf('cta') + 0.9, 'ding', 0.3],
];
const lanes: number[] = [];
const audio = cues
  .sort((a, b) => a[0] - b[0])
  .map(([at, f, v], i) => {
    const d = Math.min(DUR[f], TOTAL - at);
    let l = lanes.findIndex((e) => e <= at + 1e-6);
    if (l < 0) {
      l = lanes.length;
      lanes.push(0);
    }
    lanes[l] = at + d;
    return `<audio id="sfx-${i}-${f}" class="clip" src="assets/sfx/${f}.wav" data-start="${r(at)}" data-duration="${r(d)}" data-track-index="${10 + l}" data-volume="${v}"></audio>`;
  })
  .join('\n      ');

const html = `<!doctype html>
<html lang="ms" data-resolution="portrait">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <!-- GENERATED by build.mts from ../remotion/src/meru/{data,mapData}.ts — edit those, then rebuild -->
    <script src="assets/vendor/gsap.min.js"></script>
    <style>
      @font-face { font-family: 'DM Sans'; font-weight: 500; src: url('assets/fonts/dm-sans-latin-500-normal.woff2') format('woff2'); }
      @font-face { font-family: 'DM Sans'; font-weight: 600; src: url('assets/fonts/dm-sans-latin-600-normal.woff2') format('woff2'); }
      @font-face { font-family: 'DM Sans'; font-weight: 700; src: url('assets/fonts/dm-sans-latin-700-normal.woff2') format('woff2'); }
      @font-face { font-family: 'DM Serif Display'; font-weight: 400; src: url('assets/fonts/dm-serif-display-latin-400-normal.woff2') format('woff2'); }
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { width: 1080px; height: 1920px; overflow: hidden; background: ${PAPER}; }
      #root { position: relative; width: 100%; height: 100%; overflow: hidden; background: ${PAPER}; }
      .scene { position: absolute; inset: 0; background: ${PAPER}; }
      .card { position: absolute; left: ${CARD.left}px; top: ${CARD.top}px; width: ${CARD.width}px; height: ${CARD.height}px; border-radius: 28px; overflow: hidden; background: #ddd; }
      .ph { width: 100%; height: 100%; object-fit: cover; }
      .ix { position: absolute; top: ${CARD.top + CARD.height + 18}px; right: 300px; font: 500 28px 'DM Sans'; color: ${GREY}; letter-spacing: 2px; }
      .text { position: absolute; left: 120px; right: 300px; }
      .eyebrow { font: 600 28px 'DM Sans'; letter-spacing: 6px; color: ${GREY}; text-transform: uppercase; }
      .title { font: 400 84px/1.05 'DM Serif Display'; color: ${INK}; margin-top: 12px; }
      .t76 { font-size: 76px; } .t64 { font-size: 64px; margin-top: 0; }
      .body { font: 500 36px/1.35 'DM Sans'; color: #4A4741; margin-top: 16px; }
      .hair { height: 2px; width: 120px; background: ${INK}; margin-top: 22px; }
      .row { display: flex; align-items: baseline; gap: 26px; padding: 34px 0; border-bottom: 2px solid ${LINE}; }
      .num { font: 500 30px 'DM Sans'; color: ${GREY}; width: 54px; }
      .rowserif { font: 400 72px/1.1 'DM Serif Display'; color: ${INK}; }
      .rowsans { font: 600 50px/1.1 'DM Sans'; color: ${INK}; }
      .grid { display: grid; grid-template-columns: 1fr 1fr; column-gap: 36px; margin-top: 30px; }
      .colname { font: 400 54px/1.05 'DM Serif Display'; color: ${INK}; }
      .k { font: 500 26px 'DM Sans'; color: ${GREY}; margin-top: 18px; letter-spacing: 2px; }
      .v { font: 600 32px 'DM Sans'; color: ${INK}; }
      .s { font: 500 26px 'DM Sans'; color: ${GREY}; }
      .price { font: 400 50px 'DM Serif Display'; color: ${INK}; }
      .common { border-top: 2px solid ${LINE}; margin-top: 34px; padding-top: 22px; }
      .cm { font: 600 34px 'DM Sans'; color: ${INK}; margin-top: 8px; }
      .mapbg { position: absolute; inset: 0; background: #DCDCDC; }
      .maptxt { font: 600 28px/1.45 'DM Sans'; color: #4A4741; margin-top: 10px; }
      .mapsub { font: 500 26px/1.45 'DM Sans'; color: ${GREY}; margin-top: 8px; }
      .credit { position: absolute; top: 1200px; left: 120px; font: 600 26px 'DM Sans'; color: ${GREY}; background: #F3F1EC; padding: 4px 10px; border-radius: 6px; }
      .ctasub { font: 500 34px 'DM Sans'; color: ${GREY}; margin-top: 24px; }
      .ctaprice { font: 400 120px/1 'DM Serif Display'; color: ${INK}; }
      .ctabook { font: 700 40px 'DM Sans'; color: ${INK}; margin-top: 30px; }
      .ctaphone { font: 700 76px 'DM Sans'; color: ${INK}; margin-top: 34px; letter-spacing: 1px; }
      .ctaname { font: 400 48px 'DM Serif Display'; color: ${GREY}; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${r(TOTAL)}" data-width="1080" data-height="1920">
      ${sceneHtml.join('\n      ')}
      ${audio}
    </div>
    <script>
      const tl = gsap.timeline({ paused: true });
      ${tw.join('\n      ')}
      window.__timelines["main"] = tl;
      tl.seek(0);
    </script>
  </body>
</html>
`;
fs.writeFileSync(new URL('./index.html', import.meta.url), html);
console.log('index.html written:', shots.length, 'scenes,', cues.length, 'sfx, total', TOTAL, 's');
