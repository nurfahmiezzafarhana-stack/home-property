// Generates index.html — Kapar K1 "Cinematic" — from the SAME storyboard and map
// data the Remotion version uses:
//   ../remotion/src/kapar/data.ts     (shots, timing, copy)
//   ../remotion/src/kapar/mapData.ts  (OpenStreetMap-derived geometry)
// Run:  node --experimental-strip-types build.mts
import fs from 'node:fs';
import {project, shots, starts, TOTAL, startOf, spanDur, cue, voWords, VO_LEAD} from '../remotion/src/kapar/data.ts';
import {vo} from '../remotion/src/kapar/vo.ts';
import {roads, land, places, hwLabels} from '../remotion/src/kapar/mapData.ts';

const r = (n: number) => Math.round(n * 1000) / 1000;
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const st = starts();
const PKG_WORDS = [0, 6, 9, 10, 14];
const SPEC_WORDS = [2, 7, 11, 13, 19];
const TICKP = (i: number) => cue('package', PKG_WORDS[i]);
const TICKS = (i: number) => cue('specs', SPEC_WORDS[i]);
const tw: string[] = []; // GSAP timeline lines
const T = (s: string) => tw.push(s);
let lane = 3;

// ---------- shots ----------
const WHIP = ['reveal', 'orbit', 'package', 'specs', 'cta'];
const shotHtml = shots
  .map((s, i) => {
    const t0 = st[i];
    if (s.kind === 'map') return ''; // map built below
    const z = s.zoom ?? [1, 1];
    const x = s.x ?? [50, 50];
    const rot = s.kind === 'video' ? s.rot ?? [0, 0] : [0, 0];
    T(`tl.fromTo('#m-${s.id}',{scale:${z[0]},rotation:${rot[0]},objectPosition:'${x[0]}% 50%'},{scale:${z[1]},rotation:${rot[1]},objectPosition:'${x[1]}% 50%',duration:${s.dur},ease:'sine.inOut'},${r(t0)});`);
    if (WHIP.includes(s.id)) T(`tl.fromTo('#w-${s.id}',{xPercent:35,scale:1.15,filter:'blur(18px)'},{xPercent:0,scale:1,filter:'blur(0px)',duration:0.23,ease:'power3.out'},${r(t0)});`);
    // video: the <video> is the timed clip; its untimed wrappers carry the motion
    if (s.kind === 'video')
      return `<div class="wrap" id="w-${s.id}" style="z-index:${i + 1}"><div class="inner" id="m-${s.id}"><video id="v-${s.id}" class="clip media" src="assets/media/${s.src}.mp4" data-start="${r(t0)}" data-duration="${r(s.dur)}" data-media-start="${s.from}" data-playback-rate="${s.rate}" data-track-index="0" muted playsinline></video></div></div>`;
    return `<div id="shot-${s.id}" class="clip shot" data-start="${r(t0)}" data-duration="${r(s.dur)}" data-track-index="0" style="z-index:${i + 1}"><div class="wrapi" id="w-${s.id}"><img class="media" id="m-${s.id}" src="assets/media/render.jpg" alt=""></div></div>`;
  })
  .join('\n      ');

// ---------- map (real geography; close -> wide zoom like a map app) ----------
const ms = startOf('map');
const mapShot = shots.find((s) => s.id === 'map')!;
const CLOSE = [3100, -200, 10500];
const WIDE = [10000, 4200, 27000];
const vb = ([cx, cy, w]: number[]) => `${cx - w / 2} ${cy - (w * 16) / 18} ${w} ${(w * 16) / 9}`;
const line = (d: string, c: string, w: number) => `<path d="${d}" stroke="${c}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>`;
const near = (ref: string, tgt: [number, number]) => {
  const pts = hwLabels[ref] || [];
  return pts.reduce((a, b) => (Math.hypot(b[0] - tgt[0], b[1] - tgt[1]) < Math.hypot(a[0] - tgt[0], a[1] - tgt[1]) ? b : a), pts[0]);
};
// close-view labels sized for the close zoom, wide-view labels for the wide zoom
const kClose = CLOSE[2] / 1080; // metres per px
const kWide = WIDE[2] / 1080;
const svgLabel = (id: string, [x, y]: [number, number], text: string, px: number, k: number, weight = 700, color = '#202124') =>
  `<text id="${id}" x="${x}" y="${y}" font-family="Inter" font-weight="${weight}" font-size="${px * k}" fill="${color}" stroke="#F1F3F4" stroke-width="${6 * k}" paint-order="stroke" text-anchor="middle" dominant-baseline="middle">${esc(text)}</text>`;
const FAC: [string, string, number][] = [
  ['SK Tok Muda', '🏫 SK Tok Muda', 40],
  ['Klinik Kesihatan Kapar', '🏥 Klinik Kesihatan', -70],
  ['SMK Tengku Idris Shah', '🏫 SMK Tengku Idris', 60],
  ['Hospital Kapar', '🏥 Hospital Kapar', 130],
];
const closeLabels = FAC.map(([k, t, dy], i) => svgLabel(`fac-${i}`, [places[k][0] + 120 * kClose, places[k][1] + dy * kClose], t, 26, kClose, 700, '#3C4043')).join('');
const wideTowns = ['Klang', 'Setia Alam', 'Shah Alam'].map((t, i) => svgLabel(`town-${i}`, places[t] as [number, number], t, 38, kWide)).join('');
const shields = ([['E32', 'WCE', [7500, -2000]], ['E1', 'NKVE', [24000, 2800]], ['FT2', 'Federal', [17500, 6500]]] as [string, string, [number, number]][])
  .map(([ref, t, tgt], i) => {
    const [x, y] = near(ref, tgt) ?? [0, 0];
    const w = (t.length * 19 + 28) * kWide;
    const h = 44 * kWide;
    return `<g id="sh-${i}" opacity="0"><rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="${8 * kWide}" fill="#1E8E3E" stroke="#fff" stroke-width="${3 * kWide}"/><text x="${x}" y="${y}" font-family="Inter" font-weight="700" font-size="${30 * kWide}" fill="#fff" text-anchor="middle" dominant-baseline="central">${t}</text></g>`;
  })
  .join('');
const [px, py] = places['Projek'];
const pinW = 84 * kClose;
const mapHtml = `<div id="map" class="clip" data-start="${r(ms)}" data-duration="${r(mapShot.dur)}" data-track-index="0" style="z-index:6;position:absolute;inset:0;background:#AADAFF">
        <svg id="map-svg" width="1080" height="1920" viewBox="${vb(CLOSE)}" style="position:absolute;inset:0" data-layout-ignore>
          ${land.map((d) => `<path d="${d}" fill="#F1F3F4"/>`).join('')}
          ${roads.primary.map((d) => line(d, '#DADCE0', 5)).join('')}${roads.primary.map((d) => line(d, '#FFFFFF', 3.5)).join('')}
          ${roads.secondary.map((d) => line(d, '#FFFFFF', 6)).join('')}
          ${roads.trunk.map((d) => line(d, '#F9AB00', 11)).join('')}${roads.trunk.map((d) => line(d, '#FDE293', 7)).join('')}
          ${roads.motorway.map((d) => line(d, '#E37400', 13)).join('')}${roads.motorway.map((d) => line(d, '#FBC26A', 9)).join('')}
          <g id="close-labels">${closeLabels}${svgLabel('kapar-lbl', [places['Pekan Kapar'][0], places['Pekan Kapar'][1] - 20 * kClose], 'Pekan Kapar', 30, kClose)}</g>
          <g id="wide-labels" opacity="0">${wideTowns}${svgLabel('kapar-w', [places['Pekan Kapar'][0] + 2600, places['Pekan Kapar'][1] - 600], 'Pekan Kapar', 30, kWide)}</g>
          ${shields}
          <g id="pin"><ellipse id="pulse" cx="${px}" cy="${py}" rx="${60 * kClose}" ry="${20 * kClose}" fill="none" stroke="#EA4335" stroke-width="${4 * kClose}"/>
            <path transform="translate(${px - pinW / 2} ${py - pinW * 1.32}) scale(${pinW / 46})" d="M23 0C10.3 0 0 10.3 0 23c0 17.2 23 39 23 39s23-21.8 23-39C46 10.3 35.7 0 23 0z" fill="#EA4335"/></g>
        </svg>
        <div id="map-bubble" style="position:absolute;left:${r(540 + (px - CLOSE[0]) / kClose)}px;top:${r(960 + (py - CLOSE[1]) / kClose - 140)}px;transform:translate(-50%,-100%);background:#fff;border-radius:18px;padding:12px 22px 14px;box-shadow:0 8px 24px rgba(0,0,0,.2);white-space:nowrap">
          <div style="font:700 30px Inter;color:#202124">Projek Teres Tok Muda</div><div style="font:500 22px Inter;color:#5F6368">Jalan Benteng Kanan, Kapar</div></div>
        <div class="txt" style="top:300px"><div id="map-title" style="font:900 56px Montserrat;color:#202124">Lokasi Strategik</div>
          <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:20px">${project.access.map((a, i) => `<span id="acc-${i}" style="font:700 26px Montserrat;color:#fff;background:#202124;border-radius:999px;padding:8px 18px">${esc(a)}</span>`).join('')}</div></div>
        <div style="position:absolute;top:1200px;left:120px;font:600 26px Inter;color:#5F6368;background:rgba(241,243,244,.85);padding:4px 10px;border-radius:6px">Data peta © OpenStreetMap contributors</div>
      </div>`;
T(`tl.fromTo('#map-svg',{attr:{viewBox:'${vb(CLOSE)}'}},{attr:{viewBox:'${vb(WIDE)}'},duration:1.33,ease:'power3.inOut'},${r(ms + 1.47)});`);
T(`tl.fromTo('#pin',{y:-260*${kClose.toFixed(2)},opacity:0},{y:0,opacity:1,duration:0.45,ease:'bounce.out'},${r(ms + 0.07)});`);
T(`tl.fromTo('#pulse',{scale:0.4,opacity:1,transformOrigin:'50% 50%'},{scale:1.8,opacity:0,duration:1,repeat:2,ease:'none'},${r(ms + 0.35)});`);
T(`tl.fromTo('#map-bubble',{opacity:0,scale:0.6},{opacity:1,scale:1,duration:0.3,ease:'back.out(1.6)'},${r(ms + 0.33)});`);
T(`tl.to('#map-bubble',{opacity:0,duration:0.3},${r(ms + 1.6)});`);
FAC.forEach((_, i) => T(`tl.fromTo('#fac-${i}',{opacity:0},{opacity:1,duration:0.27},${r(ms + 0.4 + i * 0.13)});`));
T(`tl.to('#close-labels',{opacity:0,duration:0.4},${r(ms + 1.7)});`);
T(`tl.to('#wide-labels',{opacity:1,duration:0.4},${r(ms + 2.3)});`);
[0, 1, 2].forEach((i) => T(`tl.to('#sh-${i}',{opacity:1,duration:0.3},${r(ms + 2.2 + i * 0.1)});`));
T(`tl.fromTo('#map-title',{opacity:0,y:16},{opacity:1,y:0,duration:0.35,ease:'power3.out'},${r(ms)});`);
project.access.forEach((_, i) => T(`tl.fromTo('#acc-${i}',{opacity:0,y:14},{opacity:1,y:0,duration:0.3,ease:'power3.out'},${r(ms + 1.33 + i * 0.13)});`));

// ---------- text overlays ----------
const rise = (sel: string, t: number, dist = 40) => T(`tl.fromTo('${sel}',{opacity:0,y:${dist}},{opacity:1,y:0,duration:0.4,ease:'power3.out'},${r(t)});`);
const ov = (id: string, inner: string, shade: string) => {
  const s = shots.find((x) => x.id === id)!;
  return `<div id="ov-${id}" class="clip ov" data-start="${r(startOf(id))}" data-duration="${r(spanDur(id))}" data-track-index="1" style="z-index:${20}"><div class="shade" style="background:${shade}"></div>${inner}</div>`;
};
const B = 'linear-gradient(180deg,rgba(0,0,0,.1) 15%,rgba(0,0,0,.62) 30%,rgba(0,0,0,.6) 50%,rgba(0,0,0,.45) 70%,rgba(0,0,0,.15) 90%)';
const TOPD = 'linear-gradient(180deg,rgba(0,0,0,.7) 0%,rgba(0,0,0,.5) 60%,rgba(0,0,0,.15) 100%)';
const overlays = [
  ov('hook', `<div class="txt" style="top:330px"><div id="h1" class="big" style="font-size:96px">Booking <span style="color:#FFD27A">RM500</span> je,</div><div id="h2" class="big" style="font-size:64px;font-weight:800;margin-top:10px">dapat rumah teres freehold?</div></div>`, 'linear-gradient(180deg,rgba(0,0,0,.6) 0%,rgba(0,0,0,.15) 45%,rgba(0,0,0,0) 60%)'),
  ov('reveal', `<div class="txt" style="top:620px"><div id="r1" class="eyebrow">Projek Baru · Dibuka Untuk Pendaftaran</div><div style="overflow:hidden;margin-top:14px"><div id="r2" class="big">Rumah Teres</div></div><div style="overflow:hidden"><div id="r3" class="big">1-Tingkat</div></div></div>`, B),
  ov('orbit', `<div class="txt" style="top:700px"><div id="o1" class="eyebrow">📍 Tok Muda, Kapar</div><div id="o2" class="big" style="font-size:70px;margin-top:10px">5km dari Pekan Kapar</div></div>`, 'linear-gradient(180deg,rgba(0,0,0,0) 35%,rgba(0,0,0,.65) 75%)'),
  ov('package', `<div class="txt" style="top:330px"><div id="p0" class="eyebrow">Pakej Pembelian</div>${project.pkg.map((p, i) => `<div id="pk-${i}" class="row"><span class="tick">✓</span><span style="font:${i === 0 ? 900 : 700} ${i === 0 ? 46 : 38}px/1.15 Montserrat">${esc(p)}</span></div>`).join('')}<div id="pk-note" style="margin-top:22px;font:600 28px Montserrat;color:#D8D8D8">*Tertakluk pada terma semasa</div></div>`, TOPD),
  ov('specs', `<div class="txt" style="top:330px"><div id="s0" class="eyebrow">Spesifikasi</div>${project.specs.map((s, i) => `<div id="sp-${i}" class="spec"><div class="k">${esc(s.k)}</div><div class="v">${esc(s.v)}</div></div>`).join('')}</div>`, TOPD),
  ov('cta', `<div class="txt" style="top:330px;text-align:center"><div id="c1" class="eyebrow">Dibuka Untuk Pendaftaran</div><div id="c2" style="font:600 34px Montserrat;color:#E8E8E8;margin-top:34px">Harga dari</div><div id="c3" style="font:900 118px/1 Montserrat;color:#fff;letter-spacing:-2px">${project.priceFrom}</div><div id="c4" style="display:inline-block;margin-top:24px;font:900 42px Montserrat;color:#1a1a1a;background:#FFD27A;padding:10px 28px;border-radius:999px">Booking ${project.booking} sahaja!</div><div id="c5" style="font:600 28px Montserrat;color:#E8E8E8;margin-top:24px">Freehold · 4 Bilik · 2 Bilik Air</div><div id="c6" style="margin-top:46px;font:800 40px Montserrat;color:#fff">DM atau komen <span style="color:#1a1a1a;background:#FFD27A;padding:0 14px;border-radius:10px">“NAK”</span></div><div id="c7" style="font:900 76px Montserrat;color:#fff">${project.phone}</div><div id="c8" style="font:600 32px Montserrat;color:#E8E8E8">${project.agent}</div></div>`, 'linear-gradient(180deg,rgba(0,0,0,.7) 0%,rgba(0,0,0,.55) 55%,rgba(0,0,0,.2) 100%)'),
].join('\n      ');
const h = startOf('hook');
T(`tl.fromTo('#h1',{opacity:0.5},{opacity:1,duration:0.2},${h});`);
rise('#h2', h + 0.27, 50);
[['#r1', 0.13, 16], ['#r2', 0.27, 90], ['#r3', 0.43, 90]].forEach(([s, d, k]) => rise(s as string, startOf('reveal') + (d as number), k as number));
rise('#o1', startOf('orbit') + 0.07, 16);
rise('#o2', startOf('orbit') + 0.2, 90);
rise('#p0', startOf('package'), 16);
project.pkg.forEach((_, i) => rise(`#pk-${i}`, startOf('package') + TICKP(i), 24));
rise('#pk-note', startOf('package') + cue('package', 15), 10);
rise('#s0', startOf('specs'), 16);
project.specs.forEach((_, i) => rise(`#sp-${i}`, startOf('specs') + TICKS(i), 24));
['#c1', '#c2', '#c3', '#c4', '#c5', '#c6', '#c7', '#c8'].forEach((s, i) => rise(s, startOf('cta') + [0.07, 0.2, 0.3, 0.47, 0.6, 0.8, 0.9, 1.0][i], 20));

// ---------- lens flares over the reveal and CTA cuts ----------
const flares = ['reveal', 'cta']
  .map((id) => {
    const t = startOf(id);
    T(`tl.fromTo('#fl-${id}',{opacity:0,xPercent:-60},{opacity:0.85,xPercent:0,duration:0.17,ease:'power2.in'},${r(t - 0.17)});tl.to('#fl-${id}',{opacity:0,xPercent:60,duration:0.27,ease:'power2.out'},${r(t)});`);
    return `<div id="flare-${id}" class="clip" data-start="${r(t - 0.2)}" data-duration="0.5" data-track-index="2" style="z-index:30;position:absolute;inset:0;pointer-events:none" data-layout-ignore><div id="fl-${id}" class="flare"></div></div>`;
  })
  .join('\n      ');

// ---------- SFX (same map as the Remotion K1) ----------
const DUR: Record<string, number> = {whoosh: 0.64, impact: 0.9, shimmer: 1.5, pop: 0.1, click: 0.04, riser: 1.4, ding: 1.0};
const cues: [number, string, number][] = [
  [0, 'impact', 0.85],
  ...st.slice(1).map((t) => [t - 0.12, 'whoosh', 0.38] as [number, string, number]),
  [startOf('reveal'), 'shimmer', 0.5],
  ...project.pkg.map((_, i) => [startOf('package') + TICKP(i), 'pop', 0.55] as [number, string, number]),
  ...project.specs.map((_, i) => [startOf('specs') + TICKS(i), 'click', 0.55] as [number, string, number]),
  [startOf('map') + 0.25, 'pop', 0.6],
  [startOf('cta') - 1.3, 'riser', 0.35],
  [startOf('cta') + 0.05, 'impact', 0.6],
  [startOf('cta') + 1.1, 'ding', 0.5],
];
const laneEnds: number[] = [];
const audio = cues
  .sort((a, b) => a[0] - b[0])
  .map(([at, f, v], i) => {
    const d = Math.min(DUR[f], TOTAL - at);
    let l = laneEnds.findIndex((e) => e <= at + 1e-6);
    if (l < 0) {
      l = laneEnds.length;
      laneEnds.push(0);
    }
    laneEnds[l] = at + d;
    return `<audio id="sfx-${i}-${f}" class="clip" src="assets/sfx/${f}.wav" data-start="${r(at)}" data-duration="${r(d)}" data-track-index="${10 + l}" data-volume="${v}"></audio>`;
  })
  .join('\n      ');

// ---------- voiceover + karaoke captions ----------
const voAudio = shots
  .filter((s) => s.vo)
  .map((s) => `<audio id="vo-${s.vo}" class="clip" src="assets/vo/${s.vo}.wav" data-start="${r(startOf(s.id) + VO_LEAD)}" data-duration="${r(vo[s.vo!].dur)}" data-track-index="9" data-volume="1"></audio>`)
  .join('\n      ');
type CW = {text: string; start: number; end: number};
const all: CW[] = voWords();
const chunks: CW[][] = [];
for (let i = 0; i < all.length; ) {
  let j = i;
  while (j + 1 < all.length && all[j + 1].start - all[j].end < 0.05) j++;
  const line = all.slice(i, j + 1);
  for (let k = 0; k < line.length; ) {
    const rem = line.length - k;
    const n = rem === 4 ? 2 : Math.min(3, rem);
    chunks.push(line.slice(k, k + n));
    k += n;
  }
  i = j + 1;
}
const caps = chunks
  .map((c, k) => `<div id="cap-${k}" class="clip cap" data-start="${r(c[0].start)}" data-duration="${r(c[c.length - 1].end - c[0].start + 0.06)}">${c.map((w, j) => `<span id="cw-${k}-${j}">${esc(w.text)}</span>`).join(' ')}</div>`)
  .join('\n        ');
chunks.forEach((c, k) => {
  T(`tl.fromTo('#cap-${k}',{scale:0.9},{scale:1,duration:0.1},${r(c[0].start)});`);
  c.forEach((w, j) => T(`tl.set('#cw-${k}-${j}',{color:'#FFD27A'},${r(w.start)});tl.set('#cw-${k}-${j}',{color:'#fff'},${r(w.end + 0.04)});`));
});

const html = `<!doctype html>
<html lang="ms" data-resolution="portrait">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <!-- GENERATED by build.mts from ../remotion/src/kapar/{data,mapData}.ts — edit those, then rebuild -->
    <script src="assets/vendor/gsap.min.js"></script>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { width: 1080px; height: 1920px; overflow: hidden; background: #000; }
      #root { position: relative; width: 100%; height: 100%; overflow: hidden; background: #000; }
      .shot, .wrap, .wrapi, .inner { position: absolute; inset: 0; overflow: hidden; }
      .media { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
      .ov { position: absolute; inset: 0; }
      .shade { position: absolute; inset: 0; }
      .txt { position: absolute; left: 120px; right: 192px; }
      .eyebrow { font: 700 28px Montserrat; letter-spacing: 6px; color: #FFD27A; text-transform: uppercase; text-shadow: 0 2px 10px rgba(0,0,0,.6); }
      .big { font: 900 92px/1.02 Montserrat; color: #fff; letter-spacing: -1px; text-shadow: 0 4px 24px rgba(0,0,0,.55); }
      .row { display: flex; gap: 18px; align-items: flex-start; margin-top: 18px; color: #fff; text-shadow: 0 2px 12px rgba(0,0,0,.6); }
      .tick { width: 44px; height: 44px; flex: 0 0 44px; border-radius: 22px; border: 2.5px solid #FFD27A; color: #FFD27A; display: flex; align-items: center; justify-content: center; font: 900 24px Montserrat; }
      .spec { margin-top: 26px; border-left: 3px solid #FFD27A; padding-left: 22px; }
      .spec .k { font: 600 24px Montserrat; letter-spacing: 3px; color: #D8D8D8; text-transform: uppercase; }
      .spec .v { font: 800 44px Montserrat; color: #fff; }
      .cap { position: absolute; top: 1120px; left: 120px; right: 192px; text-align: center; font: 900 64px/1.08 Montserrat; color: #fff; -webkit-text-stroke: 10px rgba(0,0,0,.85); paint-order: stroke fill; text-shadow: 0 4px 18px rgba(0,0,0,.5); }
      #captions { position: absolute; inset: 0; pointer-events: none; }
      .flare { position: absolute; inset: 0; mix-blend-mode: screen; opacity: 0;
        background: radial-gradient(ellipse 55% 35% at 50% 40%, rgba(255,170,90,1) 0%, rgba(255,170,90,.35) 40%, rgba(0,0,0,0) 75%); }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${r(TOTAL)}" data-width="1080" data-height="1920">
      ${shotHtml}
      ${mapHtml}
      ${overlays}
      ${flares}
      <div id="captions" data-track-kind="captions" style="z-index:40">
        ${caps}
      </div>
      ${voAudio}
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
console.log('index.html written:', shots.length, 'shots,', cues.length, 'sfx, total', TOTAL, 's');
