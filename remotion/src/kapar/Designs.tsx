// Three design options for the Tok Muda, Kapar launch video.
//  K1 "Cinematic"  — closest to the Pinterest reference: speed-ramped drone, whip
//                    + lens-flare transitions, beat cuts, clean white type
//  K2 "Promo Bold" — Malaysian launch-promo energy: yellow/red stickers, price
//                    burst, ticks popping on the beat, zoom-punch cuts
//  K3 "Luxe Gold"  — Noir Gold family: film grade, gold frame, serif, dark map
import React from 'react';
import {AbsoluteFill, Easing, interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {cue, project, startOf, starts, TOTAL} from './data';
import {KaraokeCaps, VoTrack} from './Voice';
import {Flare, Timeline} from './Shots';
import {SfxTrack, SfxCue} from '../components/Sfx';

const FPS = 30;
const ease = Easing.bezier(0.22, 1, 0.36, 1);
const fade = (f: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(f, [a, b], [from, to], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
const rise = (f: number, d: number, dist = 40) => ({opacity: fade(f, d, d + 8), transform: `translateY(${fade(f, d, d + 12, dist, 0)}px)`});
const SAFE: React.CSSProperties = {position: 'absolute', left: 120, right: 192};
const cuts = () => starts().slice(1);
// List items appear when the voiceover says them (frames from scene start)
const PKG_WORDS = [0, 6, 9, 10, 14]; // Booking, rebate, legal, fees, pemaju
const SPEC_WORDS = [2, 7, 11, 13, 19]; // hak milik, saiz tanah, 64, 4 bilik, air
const TICKP = (i: number) => Math.round(cue('package', PKG_WORDS[i]) * FPS);
const TICKS = (i: number) => Math.round(cue('specs', SPEC_WORDS[i]) * FPS);

// ---------- shared SFX map ----------
const baseCues = (whoosh: string, vol: number): SfxCue[] => [
  {at: 0.0, file: 'impact.wav', volume: 0.85},
  ...cuts().map((t) => ({at: t - 0.12, file: whoosh, volume: vol})),
  {at: startOf('reveal'), file: 'shimmer.wav', volume: 0.5},
  ...project.pkg.map((_, i) => ({at: startOf('package') + TICKP(i) / FPS, file: 'pop.wav', volume: 0.55})),
  ...project.specs.map((_, i) => ({at: startOf('specs') + TICKS(i) / FPS, file: 'click.wav', volume: 0.55})),
  {at: startOf('map') + 0.25, file: 'pop.wav', volume: 0.6},
  {at: startOf('cta') - 1.3, file: 'riser.wav', volume: 0.35},
  {at: startOf('cta') + 0.05, file: 'impact.wav', volume: 0.6},
  {at: startOf('cta') + 1.1, file: 'ding.wav', volume: 0.5},
];

// =====================================================================
// K1 — CINEMATIC
// =====================================================================
const W = '#FFFFFF';
const Eyebrow: React.FC<{t: string; d?: number; color?: string}> = ({t, d = 0, color = '#FFD27A'}) => {
  const f = useCurrentFrame();
  return <div style={{...rise(f, d, 16), fontFamily: 'Montserrat', fontWeight: 700, fontSize: 28, letterSpacing: 6, color, textTransform: 'uppercase', textShadow: '0 2px 10px rgba(0,0,0,.6)'}}>{t}</div>;
};
const Big: React.FC<{t: string; d?: number; size?: number}> = ({t, d = 0, size = 92}) => {
  const f = useCurrentFrame();
  return (
    <div style={{overflow: 'hidden', paddingBottom: 6}}>
      <div style={{...rise(f, d, 90), fontFamily: 'Montserrat', fontWeight: 900, fontSize: size, lineHeight: 1.02, color: W, textShadow: '0 4px 24px rgba(0,0,0,.55)', letterSpacing: -1}}>{t}</div>
    </div>
  );
};
const Shade: React.FC<{top?: boolean}> = ({top}) => (
  <AbsoluteFill style={{background: top ? 'linear-gradient(180deg,rgba(0,0,0,.6) 0%,rgba(0,0,0,.15) 45%,rgba(0,0,0,0) 60%)' : 'linear-gradient(180deg,rgba(0,0,0,0) 35%,rgba(0,0,0,.65) 75%)'}} />
);

const K1Overlay: React.FC<{id: string}> = ({id}) => {
  const f = useCurrentFrame();
  switch (id) {
    case 'hook':
      return (
        <AbsoluteFill>
          <Shade top />
          <div style={{...SAFE, top: 330}}>
            <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 96, lineHeight: 1.02, color: W, textShadow: '0 4px 24px rgba(0,0,0,.6)', opacity: fade(f, 0, 6, 0.5, 1)}}>
              Booking <span style={{color: '#FFD27A'}}>RM500</span> je,
            </div>
            <div style={{...rise(f, 8, 50), fontFamily: 'Montserrat', fontWeight: 800, fontSize: 64, lineHeight: 1.1, color: W, marginTop: 10, textShadow: '0 4px 20px rgba(0,0,0,.6)'}}>
              dapat rumah teres freehold?
            </div>
          </div>
        </AbsoluteFill>
      );
    case 'reveal':
      return (
        <AbsoluteFill>
          <AbsoluteFill style={{background: 'linear-gradient(180deg,rgba(0,0,0,.1) 15%,rgba(0,0,0,.62) 30%,rgba(0,0,0,.6) 50%,rgba(0,0,0,.45) 70%,rgba(0,0,0,.15) 90%)'}} />
          <div style={{...SAFE, top: 620}}>
            <Eyebrow t="Projek Baru · Dibuka Untuk Pendaftaran" d={4} />
            <div style={{height: 14}} />
            <Big t="Rumah Teres" d={8} />
            <Big t="1-Tingkat" d={13} />
          </div>
        </AbsoluteFill>
      );
    case 'orbit':
      return (
        <AbsoluteFill>
          <Shade />
          <div style={{...SAFE, top: 700}}>
            <Eyebrow t="📍 Tok Muda, Kapar" d={2} />
            <div style={{height: 10}} />
            <Big t="5km dari Pekan Kapar" d={6} size={70} />
          </div>
        </AbsoluteFill>
      );
    case 'package':
      return (
        <AbsoluteFill>
          <AbsoluteFill style={{background: 'linear-gradient(180deg,rgba(0,0,0,.65) 0%,rgba(0,0,0,.45) 60%,rgba(0,0,0,.1) 100%)'}} />
          <div style={{...SAFE, top: 330}}>
            <Eyebrow t="Pakej Pembelian" d={0} />
            <div style={{height: 20}} />
            {project.pkg.map((p, i) => (
              <div key={p} style={{...rise(f, TICKP(i), 24), display: 'flex', gap: 18, alignItems: 'flex-start', marginTop: 18}}>
                <div style={{width: 44, height: 44, flex: '0 0 44px', borderRadius: 22, border: '2.5px solid #FFD27A', color: '#FFD27A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 24}}>✓</div>
                <div style={{fontFamily: 'Montserrat', fontWeight: i === 0 ? 900 : 700, fontSize: i === 0 ? 46 : 38, lineHeight: 1.15, color: W, textShadow: '0 2px 12px rgba(0,0,0,.6)'}}>{p}</div>
              </div>
            ))}
            <div style={{...rise(f, Math.round(cue('package', 15) * FPS), 10), marginTop: 22, fontFamily: 'Montserrat', fontWeight: 600, fontSize: 28, color: '#D8D8D8'}}>*Tertakluk pada terma semasa</div>
          </div>
        </AbsoluteFill>
      );
    case 'specs':
      return (
        <AbsoluteFill>
          <AbsoluteFill style={{background: 'linear-gradient(180deg,rgba(0,0,0,.7) 0%,rgba(0,0,0,.5) 60%,rgba(0,0,0,.15) 100%)'}} />
          <div style={{...SAFE, top: 330}}>
            <Eyebrow t="Spesifikasi" d={0} />
            {project.specs.map((s, i) => (
              <div key={s.k} style={{...rise(f, TICKS(i), 24), marginTop: 26, borderLeft: '3px solid #FFD27A', paddingLeft: 22}}>
                <div style={{fontFamily: 'Montserrat', fontWeight: 600, fontSize: 24, letterSpacing: 3, color: '#D8D8D8', textTransform: 'uppercase'}}>{s.k}</div>
                <div style={{fontFamily: 'Montserrat', fontWeight: 800, fontSize: 44, color: W}}>{s.v}</div>
              </div>
            ))}
          </div>
        </AbsoluteFill>
      );
    case 'map':
      return (
        <AbsoluteFill>
          <div style={{...SAFE, top: 300}}>
            <div style={{...rise(f, 0, 16), fontFamily: 'Montserrat', fontWeight: 900, fontSize: 56, color: '#202124'}}>Lokasi Strategik</div>
          </div>
          <div style={{...SAFE, top: 385, display: 'flex', flexWrap: 'wrap', gap: 10}}>
            {project.access.map((a, i) => (
              <div key={a} style={{...rise(f, 40 + i * 4, 14), fontFamily: 'Montserrat', fontWeight: 700, fontSize: 26, color: W, background: '#202124', borderRadius: 999, padding: '8px 18px'}}>{a}</div>
            ))}
          </div>
        </AbsoluteFill>
      );
    case 'cta':
      return <CtaK1 />;
  }
  return null;
};

const CtaK1: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(180deg,rgba(0,0,0,.7) 0%,rgba(0,0,0,.55) 55%,rgba(0,0,0,.2) 100%)'}} />
      <div style={{...SAFE, top: 330, textAlign: 'center'}}>
        <Eyebrow t="Dibuka Untuk Pendaftaran" d={2} />
        <div style={{...rise(f, 6, 20), fontFamily: 'Montserrat', fontWeight: 600, fontSize: 34, color: '#E8E8E8', marginTop: 34}}>Harga dari</div>
        <div style={{...rise(f, 9, 30), fontFamily: 'Montserrat', fontWeight: 900, fontSize: 118, color: W, letterSpacing: -2, lineHeight: 1}}>{project.priceFrom}</div>
        <div style={{...rise(f, 14, 20), display: 'inline-block', marginTop: 24, fontFamily: 'Montserrat', fontWeight: 900, fontSize: 42, color: '#1a1a1a', background: '#FFD27A', padding: '10px 28px', borderRadius: 999}}>Booking {project.booking} sahaja!</div>
        <div style={{...rise(f, 18, 16), fontFamily: 'Montserrat', fontWeight: 600, fontSize: 28, color: '#E8E8E8', marginTop: 24}}>Freehold · 4 Bilik · 2 Bilik Air</div>
        <div style={{...rise(f, 24, 20), marginTop: 46, fontFamily: 'Montserrat', fontWeight: 800, fontSize: 40, color: '#fff'}}>DM atau komen <span style={{color: '#1a1a1a', background: '#FFD27A', padding: '0 14px', borderRadius: 10}}>“NAK”</span></div>
        <div style={{...rise(f, 27, 20), fontFamily: 'Montserrat', fontWeight: 900, fontSize: 76, color: W}}>{project.phone}</div>
        <div style={{...rise(f, 30, 16), fontFamily: 'Montserrat', fontWeight: 600, fontSize: 32, color: '#E8E8E8'}}>{project.agent}</div>
      </div>
    </AbsoluteFill>
  );
};

export const K1Cinematic: React.FC = () => (
  <AbsoluteFill>
    <Timeline mapTheme="light" whipInto={['reveal', 'orbit', 'package', 'specs', 'cta']} grade={{filter: 'contrast(1.06) saturate(1.08)'}} overlay={(id) => <K1Overlay id={id} />} />
    <Flare at={startOf('reveal')} />
    <Flare at={startOf('cta')} />
    <KaraokeCaps />
    <VoTrack />
    <SfxTrack cues={baseCues('whoosh.wav', 0.38)} fps={FPS} />
  </AbsoluteFill>
);

// =====================================================================
// K2 — PROMO BOLD
// =====================================================================
const Y = '#FFE11A';
const R = '#E8262B';
const Sticker: React.FC<{t: string; bg?: string; color?: string; rot?: number; size?: number; d?: number}> = ({t, bg = Y, color = '#111', rot = -3, size = 52, d = 0}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - d, fps, config: {damping: 9, stiffness: 200, mass: 0.6}});
  return (
    <div style={{display: 'inline-block', fontFamily: 'Poppins', fontWeight: 900, fontSize: size, lineHeight: 1.05, color, background: bg, padding: '8px 24px 12px', borderRadius: 14, border: '5px solid #111', boxShadow: '7px 7px 0 #111', transform: `scale(${s}) rotate(${rot * s}deg)`, whiteSpace: 'pre-wrap'}}>
      {t}
    </div>
  );
};
const Burst: React.FC<{size: number; color: string}> = ({size, color}) => {
  const pts = Array.from({length: 32}, (_, i) => {
    const r = i % 2 ? size * 0.42 : size * 0.5;
    const a = (i / 32) * Math.PI * 2;
    return `${size / 2 + Math.cos(a) * r},${size / 2 + Math.sin(a) * r}`;
  }).join(' ');
  return (
    <svg width={size} height={size} style={{position: 'absolute', inset: 0}}>
      <polygon points={pts} fill={color} stroke="#111" strokeWidth={6} />
    </svg>
  );
};
const Punch: React.FC<{children: React.ReactNode}> = ({children}) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, 6], [1.25, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  return <AbsoluteFill style={{transform: `scale(${s})`}}>{children}</AbsoluteFill>;
};

const K2Overlay: React.FC<{id: string}> = ({id}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  switch (id) {
    case 'hook': {
      const shake = f >= 8 && f < 16 ? Math.sin(f * 3.1) * (16 - f) * 1.8 : 0;
      return (
        <AbsoluteFill style={{transform: `translate(${shake}px,${shake * 0.5}px)`}}>
          <AbsoluteFill style={{background: 'linear-gradient(180deg,rgba(0,0,0,.5),rgba(0,0,0,0) 55%)'}} />
          <div style={{...SAFE, top: 320, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 18}}>
            <Sticker t="BOOKING" bg="#fff" size={64} d={0} rot={-4} />
            <div style={{transform: `scale(${interpolate(f, [0, 8], [1.3, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic)})})`, transformOrigin: 'left center'}}>
              <div style={{fontFamily: 'Poppins', fontWeight: 900, fontSize: 150, lineHeight: 1, color: Y, WebkitTextStroke: '14px #111', paintOrder: 'stroke fill'}}>RM500</div>
            </div>
            <Sticker t="JE?!" bg={R} color="#fff" size={70} d={14} rot={5} />
            <Sticker t="Rumah teres freehold 🏡" bg="#fff" size={44} d={22} rot={-2} />
          </div>
        </AbsoluteFill>
      );
    }
    case 'reveal':
      return (
        <AbsoluteFill>
          <div style={{...SAFE, top: 330, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16}}>
            <Sticker t="PROJEK BARU!" bg={R} color="#fff" size={46} d={2} rot={-4} />
            <Sticker t={'Rumah Teres\n1-Tingkat'} size={74} d={7} rot={2} />
            <Sticker t="Tok Muda, Kapar" bg="#fff" size={42} d={13} rot={-2} />
          </div>
        </AbsoluteFill>
      );
    case 'orbit':
      return (
        <AbsoluteFill>
          <div style={{...SAFE, top: 960, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 14}}>
            <Sticker t="📍 5km je" size={68} d={2} rot={-3} />
            <Sticker t="dari Pekan Kapar" bg="#fff" size={46} d={8} rot={2} />
          </div>
        </AbsoluteFill>
      );
    case 'package':
      return (
        <AbsoluteFill>
          <AbsoluteFill style={{background: 'rgba(0,0,0,.45)'}} />
          <div style={{...SAFE, top: 310}}>
            <Sticker t="PAKEJ MANTAP 🔥" bg={R} color="#fff" size={52} d={0} rot={-3} />
            <div style={{marginTop: 26}}>
              {project.pkg.map((p, i) => {
                const s = spring({frame: f - TICKP(i), fps, config: {damping: 10, stiffness: 200, mass: 0.6}});
                return (
                  <div key={p} style={{display: 'flex', gap: 16, alignItems: 'center', marginTop: 16, transform: `translateX(${(1 - s) * -60}px)`, opacity: Math.min(1, s * 2)}}>
                    <div style={{width: 52, height: 52, flex: '0 0 52px', borderRadius: 26, background: '#22C55E', border: '4px solid #111', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Poppins', fontWeight: 900, fontSize: 30, transform: `scale(${s})`}}>✓</div>
                    <div style={{fontFamily: 'Poppins', fontWeight: 800, fontSize: i === 0 ? 46 : 36, lineHeight: 1.15, color: i === 0 ? Y : '#fff', WebkitTextStroke: '8px #111', paintOrder: 'stroke fill'}}>{p}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </AbsoluteFill>
      );
    case 'specs':
      return (
        <AbsoluteFill>
          <AbsoluteFill style={{background: 'rgba(0,0,0,.4)'}} />
          <div style={{...SAFE, top: 310, display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start'}}>
            {project.specs.map((s, i) => (
              <Sticker key={s.k} t={`${s.k}: ${s.v}`} bg={i % 2 ? '#fff' : Y} size={36} d={TICKS(i)} rot={i % 2 ? 2 : -2} />
            ))}
          </div>
        </AbsoluteFill>
      );
    case 'map':
      return (
        <AbsoluteFill>
          <div style={{...SAFE, top: 300}}>
            <Sticker t="LOKASI STRATEGIK 📍" bg={Y} size={48} d={0} rot={-3} />
          </div>
          <div style={{...SAFE, top: 1120, display: 'flex', flexWrap: 'wrap', gap: 10}}>
            {project.access.map((a, i) => (
              <Sticker key={a} t={a} bg={i % 2 ? '#fff' : Y} size={28} d={40 + i * 4} rot={i % 2 ? 3 : -3} />
            ))}
          </div>
        </AbsoluteFill>
      );
    case 'cta': {
      const b = spring({frame: f - 8, fps, config: {damping: 8, stiffness: 160}});
      const spin = f * 0.6;
      return (
        <AbsoluteFill>
          <AbsoluteFill style={{background: 'rgba(0,0,0,.45)'}} />
          <div style={{...SAFE, top: 310, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18}}>
            <Sticker t="DIBUKA UNTUK PENDAFTARAN!" bg={R} color="#fff" size={38} d={0} rot={-2} />
            <div style={{position: 'relative', width: 520, height: 520, transform: `scale(${b}) rotate(${-6 * b}deg)`}}>
              <div style={{position: 'absolute', inset: 0, transform: `rotate(${spin}deg)`}}>
                <Burst size={520} color={Y} />
              </div>
              <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Poppins', color: '#111'}}>
                <div style={{fontWeight: 800, fontSize: 40}}>HARGA DARI</div>
                <div style={{fontWeight: 900, fontSize: 66, lineHeight: 1}}>{project.priceFrom}</div>
                <div style={{fontWeight: 800, fontSize: 34, marginTop: 8, background: R, color: '#fff', padding: '4px 16px', borderRadius: 10}}>Booking RM500 je!</div>
              </div>
            </div>
            <div style={{transform: `scale(${spring({frame: f - 22, fps, config: {damping: 12}})})`, background: '#111', borderRadius: 30, padding: '20px 44px 26px', border: `6px solid ${Y}`, textAlign: 'center'}}>
              <div style={{fontFamily: 'Poppins', fontWeight: 800, fontSize: 30, color: Y, letterSpacing: 3}}>HUBUNGI SEKARANG</div>
              <div style={{fontFamily: 'Poppins', fontWeight: 900, fontSize: 70, color: '#fff'}}>{project.phone}</div>
              <div style={{fontFamily: 'Poppins', fontWeight: 600, fontSize: 30, color: '#ddd'}}>{project.agent}</div>
            </div>
          </div>
        </AbsoluteFill>
      );
    }
  }
  return null;
};

export const K2PromoBold: React.FC = () => {
  const cues = [
    ...baseCues('whoosh.wav', 0.55),
    {at: 0.15, file: 'impact.wav', volume: 0.9},
    {at: 0.47, file: 'pop.wav', volume: 0.7},
    {at: 0.73, file: 'pop.wav', volume: 0.7},
    {at: startOf('cta') + 0.27, file: 'pop.wav', volume: 0.8},
  ];
  return (
    <AbsoluteFill>
      <Timeline mapTheme="light" whipInto={['reveal']} grade={{filter: 'saturate(1.2) contrast(1.08)'}} overlay={(id) => (id === 'map' ? <K2Overlay id={id} /> : <><K2Overlay id={id} /></>)} />
      <Flare at={startOf('reveal')} color="255,225,26" />
      <SfxTrack cues={cues} fps={FPS} />
    </AbsoluteFill>
  );
};

// =====================================================================
// K3 — LUXE GOLD
// =====================================================================
const GOLD = '#D4B06A';
const IVORY = '#F5EFE3';
const GOLD_GRAD = 'linear-gradient(100deg,#B8904A 0%,#E9D3A0 30%,#FFF4D8 45%,#D4B06A 60%,#9C7638 100%)';
const FilmLook: React.FC = () => {
  const f = useCurrentFrame();
  const seed = Math.floor(f / 2);
  const ox = Math.floor(random(`gx${seed}`) * 200);
  const oy = Math.floor(random(`gy${seed}`) * 200);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,.55) 100%)'}} />
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: 0.08, mixBlendMode: 'overlay'}}>
        <filter id="kgrain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={seed % 50} />
        </filter>
        <rect x={-ox} y={-oy} width={1400} height={2200} filter="url(#kgrain)" />
      </svg>
      <div style={{position: 'absolute', inset: 40, border: '1.5px solid rgba(212,176,106,.55)'}} />
    </AbsoluteFill>
  );
};
const GoldText: React.FC<{t: string; size: number; d: number; sweepAt?: number}> = ({t, size, d, sweepAt}) => {
  const f = useCurrentFrame();
  const sw = interpolate(f, [sweepAt ?? d + 8, (sweepAt ?? d + 8) + 36], [-60, 160], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{...rise(f, d, 24), fontFamily: 'Playfair Display', fontWeight: 600, fontSize: size, lineHeight: 1.05, backgroundImage: `linear-gradient(100deg, rgba(255,255,255,0) ${sw - 20}%, rgba(255,250,235,.95) ${sw}%, rgba(255,255,255,0) ${sw + 20}%), ${GOLD_GRAD}`, WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 6px 18px rgba(0,0,0,.6))'}}>
      {t}
    </div>
  );
};
const Cap: React.FC<{t: string; d?: number; size?: number}> = ({t, d = 0, size = 26}) => {
  const f = useCurrentFrame();
  return <div style={{...rise(f, d, 14), fontFamily: 'Montserrat', fontWeight: 700, fontSize: size, letterSpacing: 7, color: GOLD, textTransform: 'uppercase', textShadow: '0 2px 10px rgba(0,0,0,.7)'}}>{t}</div>;
};
const Serif: React.FC<{t: string; d?: number; size?: number; italic?: boolean}> = ({t, d = 0, size = 72, italic}) => {
  const f = useCurrentFrame();
  return <div style={{...rise(f, d, 40), fontFamily: 'Playfair Display', fontStyle: italic ? 'italic' : 'normal', fontWeight: 600, fontSize: size, lineHeight: 1.08, color: IVORY, textShadow: '0 2px 3px rgba(0,0,0,.6), 0 6px 26px rgba(0,0,0,.7)'}}>{t}</div>;
};
const Dark: React.FC<{o?: number}> = ({o = 0.55}) => <AbsoluteFill style={{background: `rgba(8,8,8,${o})`}} />;

const K3Overlay: React.FC<{id: string}> = ({id}) => {
  const f = useCurrentFrame();
  const line = (d: number) => <div style={{height: 1.5, width: fade(f, d, d + 18, 0, 220), background: GOLD, margin: '22px auto'}} />;
  switch (id) {
    case 'hook':
      return (
        <AbsoluteFill>
          <Dark o={0.35} />
          <div style={{...SAFE, top: 520, textAlign: 'center'}}>
            <Cap t="Projek Baru · Kapar" d={0} />
            {line(0)}
            <div style={{fontFamily: 'Playfair Display', fontWeight: 500, fontSize: 84, lineHeight: 1.08, color: IVORY, opacity: fade(f, 0, 10, 0.5, 1), textShadow: '0 6px 26px rgba(0,0,0,.7)'}}>Rumah freehold,</div>
            <div style={{...rise(f, 6, 30), fontFamily: 'Playfair Display', fontStyle: 'italic', fontWeight: 600, fontSize: 84, lineHeight: 1.1, color: IVORY, textShadow: '0 6px 26px rgba(0,0,0,.7)'}}>booking hanya</div>
            <GoldText t="RM500" size={150} d={12} />
          </div>
        </AbsoluteFill>
      );
    case 'reveal':
      return (
        <AbsoluteFill>
          <AbsoluteFill style={{background: 'linear-gradient(180deg,rgba(0,0,0,.6),rgba(0,0,0,.1) 45%,rgba(0,0,0,0))'}} />
          <div style={{...SAFE, top: 330, textAlign: 'center'}}>
            <Cap t="Dibuka Untuk Pendaftaran" d={4} />
            {line(6)}
            <Serif t="Rumah Teres" d={8} size={88} />
            <Serif t="1-Tingkat" d={13} size={88} italic />
          </div>
        </AbsoluteFill>
      );
    case 'orbit':
      return (
        <AbsoluteFill>
          <AbsoluteFill style={{background: 'linear-gradient(180deg,rgba(0,0,0,0) 40%,rgba(0,0,0,.7))'}} />
          <div style={{...SAFE, top: 980, textAlign: 'center'}}>
            <Cap t="Jalan Benteng Kanan" d={2} />
            <Serif t="Tok Muda, Kapar" d={6} size={76} />
            <div style={{...rise(f, 12, 14), fontFamily: 'Playfair Display', fontStyle: 'italic', fontWeight: 600, fontSize: 50, color: '#E9CF95', marginTop: 8, textShadow: '0 2px 3px rgba(0,0,0,.8), 0 4px 20px rgba(0,0,0,.8)'}}>5km dari Pekan Kapar</div>
          </div>
        </AbsoluteFill>
      );
    case 'package':
      return (
        <AbsoluteFill>
          <Dark o={0.62} />
          <div style={{...SAFE, top: 330, textAlign: 'center'}}>
            <Cap t="Pakej Eksklusif" d={0} />
            {line(2)}
            {project.pkg.map((p, i) => (
              <div key={p} style={{...rise(f, TICKP(i), 20), marginTop: 22}}>
                {i === 0 ? <GoldText t={p} size={58} d={TICKP(i)} /> : <div style={{fontFamily: 'Playfair Display', fontStyle: 'italic', fontSize: 40, lineHeight: 1.2, color: IVORY}}>{p}</div>}
              </div>
            ))}
          </div>
        </AbsoluteFill>
      );
    case 'specs':
      return (
        <AbsoluteFill>
          <Dark o={0.6} />
          <div style={{...SAFE, top: 330, textAlign: 'center'}}>
            <Cap t="Spesifikasi" d={0} />
            {line(2)}
            {project.specs.map((s, i) => (
              <div key={s.k} style={{...rise(f, TICKS(i), 20), marginTop: 22}}>
                <div style={{fontFamily: 'Montserrat', fontWeight: 700, fontSize: 22, letterSpacing: 6, color: GOLD, textTransform: 'uppercase'}}>{s.k}</div>
                <div style={{fontFamily: 'Playfair Display', fontWeight: 600, fontSize: 46, color: IVORY}}>{s.v}</div>
              </div>
            ))}
          </div>
        </AbsoluteFill>
      );
    case 'map':
      return (
        <AbsoluteFill>
          <div style={{...SAFE, top: 300, textAlign: 'center'}}>
            <Cap t="Lokasi Strategik" d={0} size={30} />
          </div>
          <div style={{...SAFE, top: 1130, textAlign: 'center', ...rise(f, 40, 14)}}>
            <div style={{display: 'inline-block', background: 'rgba(16,17,19,.85)', border: `1.5px solid ${GOLD}`, padding: '14px 28px'}}>
              <div style={{fontFamily: 'Montserrat', fontWeight: 700, fontSize: 22, letterSpacing: 5, color: GOLD}}>AKSES MUDAH</div>
              <div style={{fontFamily: 'Playfair Display', fontStyle: 'italic', fontSize: 34, color: IVORY}}>WCE · NKVE · Federal Highway</div>
              <div style={{fontFamily: 'Playfair Display', fontStyle: 'italic', fontSize: 34, color: IVORY}}>Shah Alam · Setia Alam</div>
            </div>
          </div>
        </AbsoluteFill>
      );
    case 'cta':
      return (
        <AbsoluteFill>
          <Dark o={0.6} />
          <div style={{...SAFE, top: 330, opacity: fade(f, 2, 18), transform: `scale(${fade(f, 2, 18, 0.96, 1)})`}}>
            <div style={{border: `1.5px solid ${GOLD}`, background: 'rgba(14,14,15,.72)', padding: '46px 40px 42px', textAlign: 'center'}}>
              <Cap t="Dibuka Untuk Pendaftaran" d={4} size={22} />
              <div style={{...rise(f, 8, 16), fontFamily: 'Playfair Display', fontStyle: 'italic', fontSize: 34, color: IVORY, marginTop: 14}}>Rumah Teres 1-Tingkat · Tok Muda, Kapar</div>
              <div style={{...rise(f, 12, 16), fontFamily: 'Montserrat', fontWeight: 600, fontSize: 24, letterSpacing: 4, color: '#CFC4AE', marginTop: 26, textTransform: 'uppercase'}}>Harga dari</div>
              <GoldText t={project.priceFrom} size={110} d={14} />
              <div style={{...rise(f, 18, 14), fontFamily: 'Playfair Display', fontStyle: 'italic', fontSize: 40, color: GOLD, marginTop: 6}}>Booking {project.booking} sahaja</div>
              <div style={{...rise(f, 22, 14), fontFamily: 'Montserrat', fontWeight: 600, fontSize: 24, color: IVORY, marginTop: 14}}>Freehold · 4 Bilik · 2 Bilik Air · Siap Q1 2029</div>
              <div style={{height: 1, background: 'rgba(212,176,106,.5)', margin: '30px 40px 24px'}} />
              <Cap t="Daftar Sekarang" d={26} size={22} />
              <div style={{...rise(f, 29, 16), fontFamily: 'Playfair Display', fontWeight: 600, fontSize: 72, color: IVORY, marginTop: 6}}>{project.phone}</div>
              <div style={{...rise(f, 32, 14), fontFamily: 'Playfair Display', fontStyle: 'italic', fontSize: 32, color: '#CFC4AE'}}>{project.agent}</div>
            </div>
          </div>
        </AbsoluteFill>
      );
  }
  return null;
};

export const K3LuxeGold: React.FC = () => (
  <AbsoluteFill>
    <Timeline mapTheme="dark" whipInto={['reveal', 'cta']} grade={{filter: 'saturate(0.85) contrast(1.08) brightness(0.95) sepia(0.12)'}} overlay={(id) => <K3Overlay id={id} />} />
    <Flare at={startOf('reveal')} />
    <Flare at={startOf('cta')} />
    <FilmLook />
    <SfxTrack cues={baseCues('whoosh-soft.wav', 0.4)} fps={FPS} />
  </AbsoluteFill>
);

export const KAPAR_FRAMES = Math.round(TOTAL * FPS);
export {Punch};
