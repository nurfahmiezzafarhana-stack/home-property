// Meru — Design M "Minimalist".
//  Look   : warm off-white page, photos inside a rounded card (not full-bleed),
//           generous whitespace, DM Serif Display + DM Sans, ink/grey only,
//           one hairline accent; no flares, glows or heavy shadows
//  Motion : card rises 40px + fades (10f), photo drifts slowly inside the card,
//           text lines rise in sequence; soft whoosh + clicks only
//  Map    : real OpenStreetMap geography in a monochrome palette
//  CTA    : typographic — price, booking, phone + name (no WhatsApp)
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {project, shots, startOf, starts, TOTAL} from './data';
import * as meruMap from './mapData';
import {MapConfig, MapData, MapReal} from '../kapar/MapReal';
import {SfxTrack, SfxCue} from '../components/Sfx';

const FPS = 30;
const PAPER = '#F6F4EF';
const INK = '#1C1C1C';
const GREY = '#8A8680';
const LINE = '#D9D4CB';
const ease = Easing.bezier(0.22, 1, 0.36, 1);
const fade = (f: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(f, [a, b], [from, to], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
const rise = (f: number, d: number, dist = 24) => ({opacity: fade(f, d, d + 10), transform: `translateY(${fade(f, d, d + 14, dist, 0)}px)`});

const CARD = {left: 96, top: 300, width: 888, height: 600};
const TEXT_TOP = 960; // text block under the card (inside the 288–1248 safe band)

const MONO_MAP: MapConfig = {
  data: meruMap as unknown as MapData,
  close: [700, 450, 8600],
  wide: [2500, 1200, 26000],
  facilities: [
    {k: 'SK Meru', icon: '·', label: 'SK Meru', dy: 10, sub: '2 min'},
    {k: '99 Speedmart', icon: '·', label: '99 Speedmart', dy: 70, sub: '4 min'},
    {k: 'Hospital Kapar', icon: '·', label: 'Hospital Kapar', dy: 60, sub: '5 min'},
    {k: 'SMK Meru', icon: '·', label: 'SMK Meru', dy: -60, sub: '10 min'},
    {k: 'Klinik Kesihatan Meru', icon: '·', label: 'Klinik Kesihatan', dy: 40, sub: '4 min'},
  ],
  towns: ['Kapar', 'Meru', 'Klang', 'Setia Alam', 'Shah Alam'],
  shields: [
    ['E32', 'WCE', [-1500, 5500]],
    ['E1', 'NKVE', [9000, 6000]],
    ['FT2', 'Federal', [9000, 10500]],
  ],
  pinTitle: 'Projek Teres & Berkembar',
  pinSub: 'Jalan Nenas, Meru',
  style: {
    land: '#F3F1EC', sea: '#DCDCDC', river: '#DCDCDC', primary: '#FFFFFF', primaryCase: '#E2DED6', secondary: '#FFFFFF',
    trunk: '#BDB8AF', trunkCase: '#BDB8AF', motorway: '#3A3A3A', motorwayCase: '#3A3A3A', pin: INK, pinDot: PAPER,
    ink: INK, sub: GREY, shield: INK, poi: '#6B6760', poiInk: '#3A3A3A', accent: GREY,
  },
};

// ---------- building blocks ----------
const Photo: React.FC<{img: string; d: number; x: [number, number]; zoom: [number, number]}> = ({img, d, x, zoom}) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, d], zoom, {extrapolateRight: 'clamp'});
  const px = interpolate(f, [0, d], x, {extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', ...CARD, borderRadius: 28, overflow: 'hidden', ...rise(f, 0, 40), background: '#ddd'}}>
      <Img src={staticFile(`meru/${img}`)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${px}% 50%`, transform: `scale(${z})`}} />
    </div>
  );
};
const Index: React.FC<{n: string}> = ({n}) => {
  const f = useCurrentFrame();
  return <div style={{position: 'absolute', top: CARD.top + CARD.height + 18, right: CARD.left, fontFamily: 'DM Sans', fontWeight: 500, fontSize: 28, color: GREY, letterSpacing: 2, opacity: fade(f, 6, 16)}}>{n}</div>;
};
const Eyebrow: React.FC<{t: string; d?: number}> = ({t, d = 4}) => {
  const f = useCurrentFrame();
  return <div style={{...rise(f, d, 12), fontFamily: 'DM Sans', fontWeight: 600, fontSize: 28, letterSpacing: 6, color: GREY, textTransform: 'uppercase'}}>{t}</div>;
};
const Title: React.FC<{t: string; d?: number; size?: number}> = ({t, d = 8, size = 84}) => {
  const f = useCurrentFrame();
  return <div style={{...rise(f, d, 30), fontFamily: 'DM Serif Display', fontSize: size, lineHeight: 1.05, color: INK, marginTop: 12}}>{t}</div>;
};
const Body: React.FC<{t: string; d?: number}> = ({t, d = 14}) => {
  const f = useCurrentFrame();
  return <div style={{...rise(f, d, 16), fontFamily: 'DM Sans', fontWeight: 500, fontSize: 36, lineHeight: 1.35, color: '#4A4741', marginTop: 16}}>{t}</div>;
};
const Hair: React.FC<{d?: number}> = ({d = 10}) => {
  const f = useCurrentFrame();
  return <div style={{height: 2, width: fade(f, d, d + 18, 0, 120), background: INK, marginTop: 22}} />;
};
const Text: React.FC<{children: React.ReactNode; top?: number}> = ({children, top = TEXT_TOP}) => <div style={{position: 'absolute', left: CARD.left + 8, right: 192, top}}>{children}</div>;

// ---------- scenes ----------
const Scene: React.FC<{id: string; d: number}> = ({id, d}) => {
  const f = useCurrentFrame();
  const s = shots.find((x) => x.id === id)!;
  const photo = s.kind === 'image' ? <Photo img={s.img ?? 'render.jpg'} d={d} x={s.x ?? [50, 50]} zoom={[1.0, 1.06]} /> : null;
  switch (id) {
    case 'hook':
      return (
        <>
          {photo}
          <Text>
            <div style={{fontFamily: 'DM Sans', fontWeight: 600, fontSize: 28, letterSpacing: 6, color: GREY, textTransform: 'uppercase'}}>Projek Baru · Meru, Klang</div>
            <div style={{fontFamily: 'DM Serif Display', fontSize: 96, lineHeight: 1.02, color: INK, marginTop: 12}}>Booking RM1,000.</div>
            <Body t="Rumah teres & berkembar 1-tingkat, freehold." d={6} />
          </Text>
        </>
      );
    case 'reveal':
      return (
        <>
          {photo}
          <Text>
            <Eyebrow t="Jalan Nenas, Meru" />
            <Title t="5 minit ke Hospital Kapar." />
          </Text>
        </>
      );
    case 'exterior':
      return (
        <>
          {photo}
          <Index n="01 / 04" />
          <Text>
            <Eyebrow t="Luar rumah" />
            <Title t="Jom tengok dalam." />
          </Text>
        </>
      );
    case 'living':
      return (
        <>
          {photo}
          <Index n="02 / 04" />
          <Text>
            <Eyebrow t="Ruang tamu & dapur" />
            <Title t="Terbuka, terus ke dapur." size={76} />
          </Text>
        </>
      );
    case 'hallway':
      return (
        <>
          {photo}
          <Index n="03 / 04" />
          <Text>
            <Eyebrow t="Bilik" />
            <Title t="4 bilik tidur." />
          </Text>
        </>
      );
    case 'bath':
      return (
        <>
          {photo}
          <Index n="04 / 04" />
          <Text>
            <Eyebrow t="Bilik air" />
            <Title t="2 bilik air." />
          </Text>
        </>
      );
    case 'package':
      return (
        <Text top={330}>
          <Eyebrow t="Pakej" d={2} />
          <Hair d={4} />
          {project.pkg.map((p, i) => (
            <div key={p} style={{...rise(f, 10 + i * 30, 20), display: 'flex', alignItems: 'baseline', gap: 26, padding: '34px 0', borderBottom: `2px solid ${LINE}`}}>
              <div style={{fontFamily: 'DM Sans', fontWeight: 500, fontSize: 30, color: GREY, width: 54}}>{`0${i + 1}`}</div>
              <div style={{fontFamily: i === 0 ? 'DM Serif Display' : 'DM Sans', fontWeight: i === 0 ? 400 : 600, fontSize: i === 0 ? 72 : 50, lineHeight: 1.1, color: INK}}>{p}</div>
            </div>
          ))}
        </Text>
      );
    case 'specs':
      return (
        <Text top={320}>
          <Eyebrow t="Dua pilihan" d={2} />
          <Hair d={4} />
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 36, marginTop: 30}}>
            {project.types.map((t, i) => (
              <div key={t.name} style={{...rise(f, 10 + i * 24, 24)}}>
                <div style={{fontFamily: 'DM Serif Display', fontSize: 54, color: INK, lineHeight: 1.05}}>{t.name.replace(' 1-Tingkat', '')}</div>
                <div style={{fontFamily: 'DM Sans', fontWeight: 500, fontSize: 26, color: GREY, marginTop: 20, letterSpacing: 2}}>TANAH</div>
                <div style={{fontFamily: 'DM Sans', fontWeight: 600, fontSize: 32, color: INK}}>{t.land.split(' (')[0]}</div>
                <div style={{fontFamily: 'DM Sans', fontWeight: 500, fontSize: 26, color: GREY}}>{t.land.split(' (')[1]?.replace(')', '')}</div>
                <div style={{fontFamily: 'DM Sans', fontWeight: 500, fontSize: 26, color: GREY, marginTop: 16, letterSpacing: 2}}>BINAAN</div>
                <div style={{fontFamily: 'DM Sans', fontWeight: 600, fontSize: 32, color: INK}}>{t.built.split(' (')[0]}</div>
                <div style={{fontFamily: 'DM Sans', fontWeight: 500, fontSize: 26, color: GREY}}>{t.built.split(' (')[1]?.replace(')', '')}</div>
                <div style={{fontFamily: 'DM Sans', fontWeight: 500, fontSize: 26, color: GREY, marginTop: 16, letterSpacing: 2}}>DARI</div>
                <div style={{fontFamily: 'DM Serif Display', fontSize: 50, color: INK}}>{t.price}</div>
              </div>
            ))}
          </div>
          <div style={{borderTop: `2px solid ${LINE}`, marginTop: 34, paddingTop: 22}}>
            {project.common.map((c, i) => (
              <div key={c} style={{...rise(f, 70 + i * 15, 12), fontFamily: 'DM Sans', fontWeight: 600, fontSize: 34, color: INK, marginTop: 8}}>{c}</div>
            ))}
          </div>
        </Text>
      );
    case 'map':
      return (
        <>
          <MapReal durationInFrames={d} cfg={MONO_MAP} />
          <Text top={300}>
            <div style={{...rise(f, 0, 12), fontFamily: 'DM Serif Display', fontSize: 64, color: INK}}>Lokasi.</div>
            <div style={{...rise(f, 50, 10), fontFamily: 'DM Sans', fontWeight: 600, fontSize: 28, color: '#4A4741', marginTop: 10, lineHeight: 1.45}}>
              {project.access.join('  ·  ')}
            </div>
            <div style={{...rise(f, 66, 10), fontFamily: 'DM Sans', fontWeight: 500, fontSize: 26, color: GREY, marginTop: 8, lineHeight: 1.45}}>{project.malls.join('  ·  ')}</div>
          </Text>
        </>
      );
    case 'cta':
      return (
        <Text top={360}>
          <Eyebrow t="Projek Perumahan Baru" d={2} />
          <div style={{...rise(f, 6, 16), fontFamily: 'DM Sans', fontWeight: 500, fontSize: 34, color: GREY, marginTop: 40}}>Teres 1-tingkat dari</div>
          <div style={{...rise(f, 9, 24), fontFamily: 'DM Serif Display', fontSize: 132, lineHeight: 1, color: INK}}>{project.priceFrom}</div>
          <div style={{...rise(f, 13, 16), fontFamily: 'DM Sans', fontWeight: 500, fontSize: 34, color: GREY, marginTop: 18}}>Berkembar dari RM516,420</div>
          <div style={{...rise(f, 16, 16), fontFamily: 'DM Sans', fontWeight: 700, fontSize: 40, color: INK, marginTop: 30}}>Booking {project.booking} sahaja.</div>
          <Hair d={20} />
          <div style={{...rise(f, 24, 16), fontFamily: 'DM Sans', fontWeight: 700, fontSize: 84, color: INK, marginTop: 34, letterSpacing: 1}}>{project.phone}</div>
          <div style={{...rise(f, 27, 12), fontFamily: 'DM Serif Display', fontSize: 48, color: GREY}}>{project.agent}</div>
        </Text>
      );
  }
  return null;
};

export const MeruMinimal: React.FC = () => {
  const {fps} = useVideoConfig();
  const st = starts();
  const cues: SfxCue[] = [
    {at: 0.0, file: 'pop.wav', volume: 0.45},
    ...st.slice(1).map((t) => ({at: t - 0.1, file: 'whoosh-soft.wav', volume: 0.35})),
    ...project.pkg.map((_, i) => ({at: startOf('package') + (10 + i * 30) / FPS, file: 'click.wav', volume: 0.5})),
    ...project.types.map((_, i) => ({at: startOf('specs') + (10 + i * 24) / FPS, file: 'click.wav', volume: 0.5})),
    {at: startOf('map') + 0.25, file: 'pop.wav', volume: 0.4},
    {at: startOf('cta') + 0.9, file: 'ding.wav', volume: 0.3},
  ];
  return (
    <AbsoluteFill style={{background: PAPER}}>
      {shots.map((s, i) => {
        const d = Math.round(s.dur * fps);
        return (
          <Sequence key={s.id} from={Math.round(st[i] * fps)} durationInFrames={d} name={s.id}>
            <Scene id={s.id} d={d} />
          </Sequence>
        );
      })}
      <SfxTrack cues={cues} fps={FPS} />
    </AbsoluteFill>
  );
};

export const MERU_MIN_FRAMES = Math.round(TOTAL * FPS);
