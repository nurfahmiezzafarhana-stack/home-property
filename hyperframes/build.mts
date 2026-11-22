// Generates index.html (Design A "Luxe Serif") from the SAME storyboard the
// Remotion project uses: ../remotion/src/data.ts
// Run:  node --experimental-strip-types build.mts
import fs from 'node:fs';
import {scenes, sceneStarts, buildChunks, listing, hooks, TOTAL_SEC} from '../remotion/src/data.ts';

const st = sceneStarts();
const r = (n: number) => Math.round(n * 1000) / 1000;
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const startOf = (id: string) => st[scenes.findIndex((s) => s.id === id)];

// ---------- shots ----------
const shots = scenes
  .map((s, i) => {
    const inner = s.photo2
      ? `<div class="half top"><img id="img-${s.id}-a" src="assets/photos/${s.photo}" alt=""></div>
         <div class="half bot" id="bot-${s.id}"><img id="img-${s.id}-b" src="assets/photos/${s.photo2}" alt=""></div>`
      : `<img id="img-${s.id}" src="assets/photos/${s.photo}" alt="">`;
    return `<div id="shot-${s.id}" class="clip shot" data-start="${r(st[i])}" data-duration="${r(s.dur)}" data-track-index="0" style="z-index:1">${inner}</div>`;
  })
  .join('\n      ');

const moveTween = (sel: string, move: string, t: number, d: number) => {
  switch (move) {
    case 'push-in': return `tl.fromTo('${sel}',{scale:1.02},{scale:1.14,duration:${d},ease:'sine.inOut'},${t});`;
    case 'pull-out': return `tl.fromTo('${sel}',{scale:1.18},{scale:1.03,duration:${d},ease:'sine.inOut'},${t});`;
    case 'pan-left': return `tl.fromTo('${sel}',{scale:1.06,objectPosition:'78% 50%'},{objectPosition:'22% 50%',duration:${d},ease:'sine.inOut'},${t});`;
    case 'pan-right': return `tl.fromTo('${sel}',{scale:1.06,objectPosition:'22% 50%'},{objectPosition:'78% 50%',duration:${d},ease:'sine.inOut'},${t});`;
    case 'walk': return `tl.fromTo('${sel}',{scale:1.0},{scale:1.28,duration:${d},ease:'power2.in'},${t});`;
  }
  return '';
};
const shotTweens = scenes
  .map((s, i) =>
    s.photo2
      ? [moveTween(`#img-${s.id}-a`, 'push-in', r(st[i]), r(s.dur)), moveTween(`#img-${s.id}-b`, 'push-in', r(st[i]), r(s.dur)),
         `tl.fromTo('#bot-${s.id}',{xPercent:100},{xPercent:0,duration:0.3,ease:'power3.out'},${r(st[i] + 0.33)});`].join('\n      ')
      : moveTween(`#img-${s.id}`, s.move, r(st[i]), r(s.dur)),
  )
  .join('\n      ');

// ---------- room labels ----------
const labels = scenes
  .map((s, i) => (s.label ? {s, i} : null))
  .filter(Boolean)
  .map(({s, i}: any) => `<div id="label-${s.id}" class="clip label" data-start="${r(st[i])}" data-duration="${r(s.dur)}" data-track-index="1" style="z-index:5"><span class="rule" id="lr1-${s.id}"></span><span class="ltxt" id="lt-${s.id}">${esc(s.label)}</span><span class="rule" id="lr2-${s.id}"></span></div>`)
  .join('\n      ');
const labelTweens = scenes
  .map((s, i) => (s.label ? `tl.fromTo('#lt-${s.id}',{opacity:0,y:10},{opacity:1,y:0,duration:0.27,ease:'power2.out'},${r(st[i] + 0.07)});
      tl.fromTo(['#lr1-${s.id}','#lr2-${s.id}'],{scaleX:0},{scaleX:1,duration:0.4,ease:'power3.out'},${r(st[i] + 0.13)});` : ''))
  .filter(Boolean)
  .join('\n      ');

// ---------- captions (2–3 words, active word yellow) ----------
const chunks = buildChunks();
const capGroups = chunks
  .map((c, k) => `<div id="cap-${k}" class="clip cap" data-start="${r(c.start)}" data-duration="${r(c.end - c.start + 0.05)}">${c.words.map((w, j) => `<span id="w-${k}-${j}">${esc(w.text)}</span>`).join(' ')}</div>`)
  .join('\n        ');
const capTweens = chunks
  .flatMap((c, k) => c.words.map((w, j) => `tl.set('#w-${k}-${j}',{color:'#FFE500'},${r(w.start)});tl.set('#w-${k}-${j}',{color:'#fff'},${r(w.end + 0.04)});`))
  .join('\n      ');

// ---------- SFX ----------
type Cue = {at: number; file: string; vol: number};
const cta = startOf('cta');
const phoneStart = cta + 1.0;
const cues: Cue[] = [
  {at: 0.2, file: 'impact', vol: 0.9},
  {at: 0.45, file: 'shimmer', vol: 0.7},
  ...st.slice(1).map((t) => ({at: t - 0.12, file: 'whoosh-soft', vol: 0.5})),
  {at: startOf('bath') + 0.33, file: 'shutter', vol: 0.6},
  {at: cta - 1.2, file: 'riser', vol: 0.35},
  {at: cta + 0.3, file: 'pop', vol: 0.8},
  {at: cta + 0.5, file: 'shimmer', vol: 0.5},
  ...Array.from({length: listing.phone.replace(/ /g, '').length}, (_, i) => ({at: phoneStart + i * 0.08, file: 'click', vol: 0.45})),
  {at: phoneStart + listing.phone.length * 0.067 + 0.1, file: 'ding', vol: 0.55},
];
const DUR: Record<string, number> = {click: 0.04, ding: 1.0, impact: 0.9, pop: 0.1, riser: 1.4, shimmer: 1.5, shutter: 0.14, 'whoosh-soft': 0.45, whoosh: 0.64};
// greedy lane packing: an SFX takes the lowest lane (10+) free at its start
const laneEnds: number[] = [];
const audio = cues
  .slice()
  .sort((a, b) => a.at - b.at)
  .map((c, i) => {
    const at = Math.max(0, c.at);
    const d = Math.min(DUR[c.file], TOTAL_SEC - at);
    let lane = laneEnds.findIndex((e) => e <= at + 1e-6);
    if (lane < 0) { lane = laneEnds.length; laneEnds.push(0); }
    laneEnds[lane] = at + d;
    return `<audio id="sfx-${i}-${c.file}" class="clip" src="assets/sfx/${c.file}.wav" data-start="${r(at)}" data-duration="${r(d)}" data-track-index="${10 + lane}" data-volume="${c.vol}"></audio>`;
  })
  .join('\n      ');

// phone typewriter: one span per char, revealed every 2 frames (ref 2:31.0–2:31.6)
const phoneSpans = [...listing.phone].map((ch, i) => `<span id="ph-${i}" class="ph">${ch === ' ' ? '&nbsp;' : esc(ch)}</span>`).join('');
const phoneTweens = [...listing.phone].map((_, i) => `tl.set('#ph-${i}',{opacity:1},${r(phoneStart + i * 0.067)});`).join('\n      ');

const sparkles = (prefix: string, n: number, w: number) =>
  Array.from({length: n}, (_, i) => {
    const x = (Math.abs(Math.sin((i + 1) * 12.9898) * 43758.5453) % 1) * w;
    const y = (Math.abs(Math.sin((i + 1) * 78.233) * 12543.13) % 1) * 110 - 20;
    return `<i id="${prefix}-${i}" class="spark" style="left:${x.toFixed(0)}px;top:${y.toFixed(0)}px"></i>`;
  }).join('');
const sparkTweens = (prefix: string, n: number, t0: number, span: number) =>
  Array.from({length: n}, (_, i) => {
    const p = Math.abs(Math.sin((i + 1) * 12.9898) * 43758.5453) % 1;
    const t = t0 + p * span;
    return `tl.fromTo('#${prefix}-${i}',{opacity:0,scale:0.4},{opacity:1,scale:1.6,duration:0.1,ease:'power1.out'},${r(t)});tl.to('#${prefix}-${i}',{opacity:0,scale:0.6,duration:0.3},${r(t + 0.1)});`;
  }).join('\n      ');

const html = `<!doctype html>
<html lang="ms" data-resolution="portrait" data-composition-variables='${JSON.stringify([
  {id: 'price', type: 'string', label: 'Harga', default: listing.price},
  {id: 'area', type: 'string', label: 'Kawasan', default: listing.area},
  {id: 'city', type: 'string', label: 'Bandar', default: listing.city},
  {id: 'agent', type: 'string', label: 'Nama ejen', default: listing.agent},
  {id: 'specs', type: 'string', label: 'Spesifikasi', default: listing.specs.join('  •  ')},
]).replace(/'/g, '&#39;')}'>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <!-- GENERATED by build.mts from ../remotion/src/data.ts — edit data.ts, then rebuild -->
    <script src="assets/vendor/gsap.min.js"></script>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { width: 1080px; height: 1920px; overflow: hidden; background: #000; }
      #root { position: relative; width: 100%; height: 100%; overflow: hidden; background: #000; }
      .shot { position: absolute; inset: 0; overflow: hidden; }
      .shot > img, .half > img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
      .half { position: absolute; left: 0; right: 0; height: 960px; overflow: hidden; }
      .half.top { top: 0; } .half.bot { top: 960px; border-top: 8px solid #fff; }
      .grad { position: absolute; inset: 0; }
      .label { position: absolute; top: 330px; left: 0; right: 0; display: flex; gap: 22px; align-items: center; justify-content: center; }
      .label .rule { width: 90px; height: 3px; background: #F3D27A; box-shadow: 0 1px 4px rgba(0,0,0,.6); }
      .label .ltxt { font: italic 600 68px 'Playfair Display'; color: #fff; text-shadow: 0 2px 2px rgba(0,0,0,.7), 0 4px 24px rgba(0,0,0,.8); }
      #captions { position: absolute; inset: 0; pointer-events: none; }
      .cap { position: absolute; top: 1060px; left: 120px; right: 300px; text-align: center;
        font: 900 74px/1.02 'Montserrat'; text-transform: uppercase; letter-spacing: -0.5px; color: #fff;
        -webkit-text-stroke: 12px #000; paint-order: stroke fill; text-shadow: 0 6px 0 rgba(0,0,0,.35); }
      #hook-price { position: absolute; top: 330px; left: 120px; right: 192px; text-align: center; font: 600 118px 'Playfair Display'; color: #fff; letter-spacing: 1px; text-shadow: 0 6px 24px rgba(0,0,0,.55), 0 2px 2px rgba(0,0,0,.6); }
      #hook-loc { position: absolute; top: 1000px; left: 120px; right: 300px; text-align: center; }
      #hook-kicker { font: 500 46px 'Playfair Display'; letter-spacing: 8px; color: #fff; text-transform: uppercase; text-shadow: 0 3px 12px rgba(0,0,0,.8); }
      #hook-city { font: 700 92px 'Playfair Display'; letter-spacing: 2px; text-transform: uppercase;
        background-image: linear-gradient(180deg,#FFF6D5 0%,#F3D27A 40%,#C9962E 70%,#FBE7A6 100%); -webkit-background-clip: text; background-clip: text; color: transparent;
        filter: drop-shadow(0 3px 2px rgba(0,0,0,.8)) drop-shadow(0 6px 18px rgba(0,0,0,.6)); }
      .spark-box { position: absolute; left: 0; top: 20px; width: 660px; height: 140px; }
      .spark { position: absolute; width: 12px; height: 12px; opacity: 0; transform: rotate(45deg);
        background: radial-gradient(circle,#fff 0%,#FFE7A0 35%,rgba(255,215,120,0) 70%); }
      #cta-top { position: absolute; top: 340px; left: 120px; right: 192px; text-align: center; }
      #cta-city { font: 400 44px 'Playfair Display'; letter-spacing: 8px; color: #F3D27A; text-transform: uppercase; }
      #cta-price { font: 600 110px 'Playfair Display'; color: #fff; text-shadow: 0 6px 24px rgba(0,0,0,.55); }
      #cta-specs { font: 700 30px 'Montserrat'; color: #fff; letter-spacing: 1px; margin-top: 10px; }
      #cta-bar-wrap { position: absolute; top: 960px; left: 150px; width: 600px; height: 130px; transform: rotate(-3deg); }
      #cta-bar { position: absolute; inset: 0; background: #FFE500; box-shadow: 0 8px 0 rgba(0,0,0,.25); }
      #cta-phone { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font: italic 800 70px 'Poppins'; color: #1a1a1a; }
      .ph { opacity: 0; }
      #cta-agent { position: absolute; top: 1110px; left: 120px; right: 300px; text-align: center; transform: rotate(-3deg);
        font: 800 42px 'Poppins'; color: #FFE500; letter-spacing: 2px; text-transform: uppercase; -webkit-text-stroke: 6px #000; paint-order: stroke fill; }
      .burst { position: absolute; width: 70px; height: 70px; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${r(TOTAL_SEC)}" data-width="1080" data-height="1920">
      <!-- shots (lane 0) -->
      ${shots}

      <!-- hook overlay (ref 0:00–0:06: serif price drops in, gold location sparkles) -->
      <div id="hook" class="clip" data-start="0" data-duration="${r(scenes[0].dur)}" data-track-index="2" data-track-kind="graphics" style="position:absolute;inset:0;z-index:6" data-layout-allow-overlap>
        <div class="grad" style="background:linear-gradient(180deg,rgba(0,0,0,.55) 0%,rgba(0,0,0,.05) 32%,rgba(0,0,0,.05) 45%,rgba(0,0,0,.55) 70%,rgba(0,0,0,.2) 100%)"></div>
        <div id="hook-price" data-var-text="price">${esc(hooks.A.title)}</div>
        <div id="hook-loc">
          <div id="hook-reveal">
            <div id="hook-kicker" data-var-text="area">${esc(hooks.A.kicker)}</div>
            <div id="hook-city" data-var-text="city">${esc(hooks.A.sub)}</div>
          </div>
          <div class="spark-box" data-layout-ignore>${sparkles('hs', 18, 660)}</div>
        </div>
      </div>

      <!-- room labels (lane 1) -->
      ${labels}

      <!-- CTA (ref 2:30–2:35: yellow bar grows at -3°, name sparkles, phone types in) -->
      <div id="cta" class="clip" data-start="${r(cta)}" data-duration="${r(scenes[scenes.length - 1].dur)}" data-track-index="2" data-track-kind="graphics" style="position:absolute;inset:0;z-index:6" data-layout-allow-overlap>
        <div class="grad" style="background:linear-gradient(180deg,rgba(0,0,0,.72) 0%,rgba(0,0,0,.55) 28%,rgba(0,0,0,0) 45%,rgba(0,0,0,.55) 75%)"></div>
        <div id="cta-top">
          <div id="cta-city" data-var-text="city">${esc(listing.city)}</div>
          <div id="cta-price" data-var-text="price">${esc(listing.price)}</div>
          <div id="cta-specs" data-var-text="specs">${esc(listing.specs.join('  •  '))}</div>
        </div>
        <div id="cta-bar-wrap">
          <div id="cta-bar"></div>
          <div id="cta-phone">${phoneSpans}</div>
          <svg id="burst-l" class="burst" style="left:-64px;top:70px" viewBox="0 0 70 70" data-layout-ignore><g stroke="#fff" stroke-width="6" stroke-linecap="round"><line x1="35" y1="35" x2="9" y2="50"/><line x1="35" y1="35" x2="5" y2="35"/><line x1="35" y1="35" x2="15" y2="12"/></g></svg>
          <svg id="burst-r" class="burst" style="right:-64px;top:-40px" viewBox="0 0 70 70" data-layout-ignore><g stroke="#fff" stroke-width="6" stroke-linecap="round"><line x1="35" y1="35" x2="61" y2="20"/><line x1="35" y1="35" x2="65" y2="35"/><line x1="35" y1="35" x2="55" y2="58"/></g></svg>
        </div>
        <div id="cta-agent" data-var-text="agent">${esc(listing.agent)}</div>
      </div>

      <!-- captions host (one host holds every caption group) -->
      <div id="captions" data-track-kind="captions" style="z-index:8">
        ${capGroups}
      </div>

      <!-- music + sfx -->
      <audio id="music" class="clip" src="assets/sfx/music-placeholder.wav" data-start="0" data-duration="${r(TOTAL_SEC)}" data-track-index="9" data-volume="0.28"></audio>
      ${audio}
    </div>
    <script>
      const tl = gsap.timeline({ paused: true });
      // camera moves on stills
      ${shotTweens}
      // hook
      tl.fromTo('#hook-price',{opacity:0.35,y:-90,filter:'blur(14px)'},{opacity:1,y:0,filter:'blur(0px)',duration:0.4,ease:'power3.out'},0);
      tl.fromTo('#hook-reveal',{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)',duration:0.87,ease:'none'},0.27);
      ${sparkTweens('hs', 18, 0.27, 0.87)}
      // labels
      ${labelTweens}
      // captions word highlight
      ${capTweens}
      // CTA
      tl.fromTo('#cta-top',{opacity:0,y:-40},{opacity:1,y:0,duration:0.5,ease:'power3.out'},${r(cta + 0.07)});
      tl.fromTo('#cta-bar',{scaleX:0},{scaleX:1,duration:0.5,ease:'back.out(1.4)'},${r(cta + 0.3)});
      tl.fromTo(['#burst-l','#burst-r'],{opacity:0,scale:0.5},{opacity:1,scale:1,duration:0.2},${r(cta + 0.67)});
      tl.fromTo('#cta-agent',{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)',duration:0.67,ease:'none'},${r(cta + 0.47)});
      ${phoneTweens}
      window.__timelines["main"] = tl;
      tl.seek(0);
    </script>
  </body>
</html>
`;
fs.writeFileSync(new URL('./index.html', import.meta.url), html);
console.log('index.html written:', scenes.length, 'shots,', chunks.length, 'caption groups,', cues.length, 'sfx cues, total', r(TOTAL_SEC), 's');
