// Meru — K1 "Cinematic" style (same language as the Kapar K1 the client picked):
// clean Montserrat type, soft-gold accent, whip + lens-flare transitions,
// beat-timed list items, real OpenStreetMap location map, CTA with phone + name.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {project, shots, startOf, starts, TOTAL} from './data';
import * as meruMap from './mapData';
import {Flare, Timeline} from '../kapar/Shots';
import {MapConfig, MapData} from '../kapar/MapReal';
import {SfxTrack, SfxCue} from '../components/Sfx';

const FPS = 30;
const GOLD = '#FFD27A';
const ease = Easing.bezier(0.22, 1, 0.36, 1);
const fade = (f: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(f, [a, b], [from, to], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
const rise = (f: number, d: number, dist = 40) => ({opacity: fade(f, d, d + 8), transform: `translateY(${fade(f, d, d + 12, dist, 0)}px)`});
const SAFE: React.CSSProperties = {position: 'absolute', left: 120, right: 192};
const BEAT = 15; // frames (0.5 s)

const MERU_MAP: MapConfig = {
  data: meruMap as unknown as MapData,
  close: [700, 450, 8600],
  wide: [2500, 1200, 26000],
  facilities: [
    {k: 'SK Meru', icon: '🏫', label: 'SK Meru', dy: 10, sub: '2 min'},
    {k: '99 Speedmart', icon: '🛒', label: '99 Speedmart', dy: 70, sub: '4 min'},
    {k: 'Hospital Kapar', icon: '🏥', label: 'Hospital Kapar', dy: 60, sub: '5 min'},
    {k: 'SMK Meru', icon: '🏫', label: 'SMK Meru', dy: -60, sub: '10 min'},
    {k: 'Klinik Kesihatan Meru', icon: '🏥', label: 'Klinik Kesihatan', dy: 40, sub: '4 min'},
  ],
  towns: ['Kapar', 'Meru', 'Klang', 'Setia Alam', 'Shah Alam'],
  shields: [
    ['E32', 'WCE', [-1500, 5500]],
    ['E1', 'NKVE', [9000, 6000]],
    ['FT2', 'Federal', [9000, 10500]],
  ],
  pinTitle: 'Projek Teres & Berkembar',
  pinSub: 'Jalan Nenas, Meru',
};

const Eyebrow: React.FC<{t: string; d?: number}> = ({t, d = 0}) => {
  const f = useCurrentFrame();
  return <div style={{...rise(f, d, 16), fontFamily: 'Montserrat', fontWeight: 700, fontSize: 28, letterSpacing: 6, color: GOLD, textTransform: 'uppercase', textShadow: '0 2px 10px rgba(0,0,0,.6)'}}>{t}</div>;
};
const Big: React.FC<{t: string; d?: number; size?: number}> = ({t, d = 0, size = 88}) => {
  const f = useCurrentFrame();
  return (
    <div style={{overflow: 'hidden', paddingBottom: 6}}>
      <div style={{...rise(f, d, 90), fontFamily: 'Montserrat', fontWeight: 900, fontSize: size, lineHeight: 1.04, color: '#fff', textShadow: '0 4px 24px rgba(0,0,0,.55)', letterSpacing: -1}}>{t}</div>
    </div>
  );
};
const Grad: React.FC<{css: string}> = ({css}) => <AbsoluteFill style={{background: css}} />;
const TOP = 'linear-gradient(180deg,rgba(0,0,0,.62) 0%,rgba(0,0,0,.25) 45%,rgba(0,0,0,0) 62%)';
const MID = 'linear-gradient(180deg,rgba(0,0,0,.05) 18%,rgba(0,0,0,.6) 34%,rgba(0,0,0,.6) 56%,rgba(0,0,0,.1) 75%)';
const DIM = 'linear-gradient(180deg,rgba(0,0,0,.72) 0%,rgba(0,0,0,.6) 60%,rgba(0,0,0,.25) 100%)';

// Room label + caption-style line for the interior photos
const Room: React.FC<{label: string; line: string}> = ({label, line}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Grad css="linear-gradient(180deg,rgba(0,0,0,0) 40%,rgba(0,0,0,.55) 58%,rgba(0,0,0,.55) 70%,rgba(0,0,0,0) 82%)" />
      <div style={{...SAFE, top: 980}}>
        <Eyebrow t={label} d={2} />
        <div style={{...rise(f, 6, 30), marginTop: 10, fontFamily: 'Montserrat', fontWeight: 900, fontSize: 60, lineHeight: 1.1, color: '#fff', textShadow: '0 4px 20px rgba(0,0,0,.6)'}}>{line}</div>
      </div>
    </AbsoluteFill>
  );
};

const Overlay: React.FC<{id: string}> = ({id}) => {
  const f = useCurrentFrame();
  switch (id) {
    case 'hook':
      return (
        <AbsoluteFill>
          <Grad css={TOP} />
          <div style={{...SAFE, top: 330}}>
            <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 92, lineHeight: 1.04, color: '#fff', textShadow: '0 4px 24px rgba(0,0,0,.6)', opacity: fade(f, 0, 6, 0.6, 1)}}>
              Booking <span style={{color: GOLD}}>RM1,000</span> je,
            </div>
            <div style={{...rise(f, 8, 50), fontFamily: 'Montserrat', fontWeight: 800, fontSize: 60, lineHeight: 1.12, color: '#fff', marginTop: 10, textShadow: '0 4px 20px rgba(0,0,0,.6)'}}>
              rumah freehold 5 minit ke Hospital Kapar?
            </div>
          </div>
        </AbsoluteFill>
      );
    case 'reveal':
      return (
        <AbsoluteFill>
          <Grad css={MID} />
          <div style={{...SAFE, top: 640}}>
            <Eyebrow t="Projek Baru · Jalan Nenas, Meru" d={3} />
            <div style={{height: 14}} />
            <Big t="Teres &" d={7} />
            <Big t="Berkembar" d={11} />
            <div style={{...rise(f, 16, 20), fontFamily: 'Montserrat', fontWeight: 800, fontSize: 48, color: GOLD, marginTop: 4}}>1-Tingkat · Klang</div>
          </div>
        </AbsoluteFill>
      );
    case 'exterior':
      return <Room label="Jom tengok" line="dalam rumah →" />;
    case 'living':
      return <Room label="Ruang Tamu & Dapur" line="Luas, terang, terus ke dapur" />;
    case 'hallway':
      return <Room label="Koridor Bilik" line="4 Bilik Tidur" />;
    case 'bath':
      return <Room label="Bilik Air" line="2 Bilik Air" />;
    case 'package':
      return (
        <AbsoluteFill>
          <Grad css={DIM} />
          <div style={{...SAFE, top: 380}}>
            <Eyebrow t="Pakej Pembelian" />
            {project.pkg.map((p, i) => (
              <div key={p} style={{...rise(f, 9 + i * BEAT * 2, 24), display: 'flex', gap: 20, alignItems: 'center', marginTop: 30}}>
                <div style={{width: 56, height: 56, flex: '0 0 56px', borderRadius: 28, border: `3px solid ${GOLD}`, color: GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 30}}>✓</div>
                <div style={{fontFamily: 'Montserrat', fontWeight: i === 0 ? 900 : 800, fontSize: i === 0 ? 56 : 50, lineHeight: 1.1, color: '#fff', textShadow: '0 2px 12px rgba(0,0,0,.6)'}}>{p}</div>
              </div>
            ))}
          </div>
        </AbsoluteFill>
      );
    case 'specs':
      return (
        <AbsoluteFill>
          <Grad css={DIM} />
          <div style={{...SAFE, top: 320}}>
            <Eyebrow t="Pilih Jenis Rumah" />
            <div style={{display: 'flex', flexDirection: 'column', gap: 22, marginTop: 22}}>
              {project.types.map((t, i) => (
                <div key={t.name} style={{...rise(f, 8 + i * BEAT * 2, 30), border: '1.5px solid rgba(255,210,122,.6)', borderRadius: 18, padding: '20px 26px', background: 'rgba(0,0,0,.35)'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
                    <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 40, color: '#fff'}}>{t.name}</div>
                  </div>
                  <div style={{fontFamily: 'Montserrat', fontWeight: 600, fontSize: 28, color: '#E0E0E0', marginTop: 8}}>Tanah {t.land}</div>
                  <div style={{fontFamily: 'Montserrat', fontWeight: 600, fontSize: 28, color: '#E0E0E0'}}>Binaan {t.built}</div>
                  <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 44, color: GOLD, marginTop: 6}}>dari {t.price}</div>
                </div>
              ))}
            </div>
            <div style={{marginTop: 22}}>
              {project.common.map((c, i) => (
                <div key={c} style={{...rise(f, 8 + (4 + i) * BEAT, 16), fontFamily: 'Montserrat', fontWeight: 800, fontSize: 34, color: '#fff', marginTop: 8, textShadow: '0 2px 10px rgba(0,0,0,.6)'}}>
                  <span style={{color: GOLD}}>•</span> {c}
                </div>
              ))}
            </div>
          </div>
        </AbsoluteFill>
      );
    case 'map':
      return (
        <AbsoluteFill>
          <div style={{...SAFE, top: 300}}>
            <div style={{...rise(f, 0, 16), fontFamily: 'Montserrat', fontWeight: 900, fontSize: 56, color: '#202124'}}>Lokasi Strategik</div>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 16}}>
              {project.access.map((a, i) => (
                <div key={a} style={{...rise(f, 50 + i * 4, 14), fontFamily: 'Montserrat', fontWeight: 700, fontSize: 26, color: '#fff', background: '#202124', borderRadius: 999, padding: '8px 18px'}}>{a}</div>
              ))}
            </div>
            <div style={{...rise(f, 70, 14), marginTop: 6}}>
            {project.malls.map((m) => (
              <div key={m} style={{display: 'inline-block', marginRight: 10, marginTop: 8, fontFamily: 'Montserrat', fontWeight: 700, fontSize: 26, color: '#202124', background: 'rgba(255,255,255,.92)', borderRadius: 999, padding: '6px 16px', boxShadow: '0 2px 8px rgba(0,0,0,.15)'}}>{m}</div>
            ))}
            </div>
          </div>
        </AbsoluteFill>
      );
    case 'cta':
      return (
        <AbsoluteFill>
          <Grad css="linear-gradient(180deg,rgba(0,0,0,.72) 0%,rgba(0,0,0,.58) 60%,rgba(0,0,0,.25) 100%)" />
          <div style={{...SAFE, top: 330, textAlign: 'center'}}>
            <Eyebrow t="Projek Perumahan Baru" d={2} />
            <div style={{...rise(f, 6, 20), fontFamily: 'Montserrat', fontWeight: 600, fontSize: 34, color: '#E8E8E8', marginTop: 30}}>Teres 1-Tingkat dari</div>
            <div style={{...rise(f, 9, 30), fontFamily: 'Montserrat', fontWeight: 900, fontSize: 112, color: '#fff', letterSpacing: -2, lineHeight: 1}}>{project.priceFrom}</div>
            <div style={{...rise(f, 13, 20), fontFamily: 'Montserrat', fontWeight: 700, fontSize: 32, color: '#E8E8E8', marginTop: 10}}>Berkembar dari RM516,420</div>
            <div style={{...rise(f, 16, 20), display: 'inline-block', marginTop: 24, fontFamily: 'Montserrat', fontWeight: 900, fontSize: 42, color: '#1a1a1a', background: GOLD, padding: '10px 28px', borderRadius: 999}}>Booking {project.booking} sahaja!</div>
            <div style={{...rise(f, 19, 16), fontFamily: 'Montserrat', fontWeight: 600, fontSize: 28, color: '#E8E8E8', marginTop: 22}}>Freehold · 4 Bilik · 2 Bilik Air · Siap Q3 2027</div>
            <div style={{...rise(f, 25, 20), fontFamily: 'Montserrat', fontWeight: 900, fontSize: 80, color: '#fff', marginTop: 50}}>{project.phone}</div>
            <div style={{...rise(f, 28, 16), fontFamily: 'Montserrat', fontWeight: 700, fontSize: 36, color: GOLD}}>{project.agent}</div>
          </div>
        </AbsoluteFill>
      );
  }
  return null;
};

export const MeruK1: React.FC = () => {
  const st = starts();
  const cues: SfxCue[] = [
    {at: 0.0, file: 'impact.wav', volume: 0.85},
    ...st.slice(1).map((t) => ({at: t - 0.12, file: 'whoosh.wav', volume: 0.5})),
    {at: startOf('reveal'), file: 'shimmer.wav', volume: 0.5},
    ...project.pkg.map((_, i) => ({at: startOf('package') + (9 + i * BEAT * 2) / FPS, file: 'pop.wav', volume: 0.6})),
    ...project.types.map((_, i) => ({at: startOf('specs') + (8 + i * BEAT * 2) / FPS, file: 'pop.wav', volume: 0.55})),
    ...project.common.map((_, i) => ({at: startOf('specs') + (8 + (4 + i) * BEAT) / FPS, file: 'click.wav', volume: 0.55})),
    {at: startOf('map') + 0.25, file: 'pop.wav', volume: 0.6},
    {at: startOf('cta') - 1.3, file: 'riser.wav', volume: 0.35},
    {at: startOf('cta') + 0.05, file: 'impact.wav', volume: 0.6},
    {at: startOf('cta') + 1.0, file: 'ding.wav', volume: 0.5},
  ];
  return (
    <AbsoluteFill>
      <Timeline
        list={shots}
        dir="meru"
        mapCfg={MERU_MAP}
        mapTheme="light"
        whipInto={['reveal', 'exterior', 'package', 'cta']}
        grade={{filter: 'contrast(1.06) saturate(1.06)'}}
        overlay={(id) => <Overlay id={id} />}
      />
      <Flare at={startOf('reveal')} />
      <Flare at={startOf('exterior')} />
      <Flare at={startOf('cta')} />
      <SfxTrack cues={cues} fps={FPS} />
    </AbsoluteFill>
  );
};

export const MERU_FRAMES = Math.round(TOTAL * FPS);
