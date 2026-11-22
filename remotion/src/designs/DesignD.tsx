// DESIGN D — "Noir Gold" : cinematic luxury.
//  Look  : warm, slightly desaturated grade, vignette, animated film grain,
//          thin champagne-gold frame with corner marks over the whole video
//  Hook  : gold eyebrow tracks in, hairline draws, serif title rises line by line,
//          price in gold gradient with a light sweep; deep boom + shimmer
//  Cuts  : 8-frame dip from black + slight settle (1.04 → 1), soft whoosh
//  Labels: Roman numeral + spaced small caps in gold, centred
//  Caps  : Playfair italic, active word champagne gold, no stroke
//  Map   : dark map with gold highways, gold pin
//  CTA   : black glass card with gold border + monogram, gold price, contact
import React from 'react';
import {AbsoluteFill, Easing, interpolate, random, useCurrentFrame} from 'remotion';
import {FPS, listing, scenes} from '../data';
import {Captions} from '../components/Captions';
import {MusicBed, SfxTrack, SfxCue} from '../components/Sfx';
import {Tour, cutTimes, sceneStart} from '../components/Tour';

const GOLD = '#D4B06A';
const GOLD_GRAD = 'linear-gradient(100deg,#B8904A 0%,#E9D3A0 30%,#FFF4D8 45%,#D4B06A 60%,#9C7638 100%)';
const IVORY = '#F5EFE3';
const ease = Easing.bezier(0.22, 1, 0.36, 1);
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

const fade = (f: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(f, [a, b], [from, to], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});

const Dip: React.FC<{children: React.ReactNode; first: boolean}> = ({children, first}) => {
  const f = useCurrentFrame();
  const black = first ? 0 : fade(f, 0, 8, 1, 0);
  const s = first ? 1 : fade(f, 0, 14, 1.04, 1);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{transform: `scale(${s})`}}>{children}</AbsoluteFill>
      <AbsoluteFill style={{background: '#000', opacity: black}} />
    </AbsoluteFill>
  );
};

// Film look: vignette + deterministic grain + gold frame. Sits over everything.
const FilmLook: React.FC = () => {
  const f = useCurrentFrame();
  const seed = Math.floor(f / 2);
  const ox = Math.floor(random(`gx${seed}`) * 200);
  const oy = Math.floor(random(`gy${seed}`) * 200);
  const corner = (pos: React.CSSProperties, rot: number) => (
    <div style={{position: 'absolute', width: 46, height: 46, borderTop: `2px solid ${GOLD}`, borderLeft: `2px solid ${GOLD}`, transform: `rotate(${rot}deg)`, ...pos}} />
  );
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,.55) 100%)'}} />
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: 0.09, mixBlendMode: 'overlay'}}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={seed % 50} />
        </filter>
        <rect x={-ox} y={-oy} width={1400} height={2200} filter="url(#grain)" />
      </svg>
      <div style={{position: 'absolute', inset: 40, border: `1.5px solid rgba(212,176,106,.55)`}} />
      {corner({left: 28, top: 28}, 0)}
      {corner({right: 28, top: 28}, 90)}
      {corner({right: 28, bottom: 28}, 180)}
      {corner({left: 28, bottom: 28}, 270)}
    </AbsoluteFill>
  );
};

const HookD: React.FC = () => {
  const f = useCurrentFrame();
  const track = fade(f, 0, 30, 26, 10);
  const line = fade(f, 0, 22, 40, 260);
  const l1 = fade(f, 0, 16, 0.45, 1);
  const l2 = fade(f, 4, 22, 0.2, 1);
  const price = fade(f, 18, 32);
  const sweep = interpolate(f, [26, 62], [-60, 160], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(180deg,rgba(10,10,10,.75) 0%,rgba(10,10,10,.35) 40%,rgba(10,10,10,.55) 75%,rgba(10,10,10,.8) 100%)'}} />
      <div style={{position: 'absolute', top: 470, left: 120, right: 192, textAlign: 'center'}}>
        <div style={{fontFamily: 'Montserrat', fontWeight: 700, fontSize: 26, color: GOLD, letterSpacing: track, textTransform: 'uppercase', opacity: l1}}>Untuk Dijual</div>
        <div style={{height: 1.5, width: line, background: GOLD, margin: '26px auto 34px'}} />
        <div style={{fontFamily: 'Playfair Display', fontWeight: 500, fontSize: 104, lineHeight: 1.05, color: IVORY, opacity: l1, transform: `translateY(${(1 - l1) * 40}px)`}}>Rumah idaman,</div>
        <div style={{fontFamily: 'Playfair Display', fontStyle: 'italic', fontWeight: 600, fontSize: 104, lineHeight: 1.1, color: IVORY, opacity: l2, transform: `translateY(${(1 - l2) * 40}px)`}}>tanpa renovate.</div>
        <div style={{fontFamily: 'Montserrat', fontWeight: 700, fontSize: 24, color: '#CFC4AE', letterSpacing: 8, textTransform: 'uppercase', marginTop: 44, opacity: price}}>City of Elmina · Shah Alam</div>
        <div
          style={{
            fontFamily: 'Playfair Display',
            fontWeight: 600,
            fontSize: 112,
            marginTop: 12,
            backgroundImage: `linear-gradient(100deg, rgba(255,255,255,0) ${sweep - 20}%, rgba(255,250,235,.95) ${sweep}%, rgba(255,255,255,0) ${sweep + 20}%), ${GOLD_GRAD}`,
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            opacity: price,
            transform: `translateY(${(1 - price) * 24}px)`,
            filter: 'drop-shadow(0 6px 20px rgba(0,0,0,.6))',
          }}
        >
          {listing.price}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const LabelD: React.FC<{text: string; index: number}> = ({text, index}) => {
  const f = useCurrentFrame();
  const o = fade(f, 4, 16);
  const w = fade(f, 6, 22, 0, 70);
  return (
    <div style={{position: 'absolute', top: 300, left: 120, right: 192, textAlign: 'center', opacity: o, padding: '26px 0 30px', background: 'radial-gradient(ellipse 60% 55% at 50% 55%, rgba(0,0,0,.6), rgba(0,0,0,0) 100%)'}}>
      <div style={{fontFamily: 'Playfair Display', fontStyle: 'italic', fontSize: 40, color: GOLD, textShadow: '0 2px 10px rgba(0,0,0,.7)'}}>{ROMAN[index]}</div>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginTop: 6}}>
        <div style={{height: 1.5, width: w, background: GOLD}} />
        <div style={{fontFamily: 'Montserrat', fontWeight: 700, fontSize: 32, letterSpacing: fade(f, 4, 26, 18, 9), color: IVORY, textTransform: 'uppercase', textShadow: '0 2px 2px rgba(0,0,0,.6), 0 4px 20px rgba(0,0,0,.8)'}}>
          {text}
        </div>
        <div style={{height: 1.5, width: w, background: GOLD}} />
      </div>
    </div>
  );
};

const CtaD: React.FC = () => {
  const f = useCurrentFrame();
  const card = fade(f, 4, 22);
  const items = (d: number) => ({opacity: fade(f, d, d + 12), transform: `translateY(${fade(f, d, d + 12, 18, 0)}px)`});
  const sweep = interpolate(f, [30, 70], [-60, 160], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: 'rgba(8,8,8,.62)'}} />
      <div style={{position: 'absolute', left: 120, right: 192, top: 330, opacity: card, transform: `scale(${fade(f, 4, 22, 0.96, 1)})`}}>
        <div style={{border: `1.5px solid ${GOLD}`, background: 'rgba(14,14,15,.72)', backdropFilter: 'blur(10px)', padding: '50px 44px 44px', textAlign: 'center'}}>
          <div style={{...items(8), width: 84, height: 84, margin: '0 auto', borderRadius: 42, border: `1.5px solid ${GOLD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Playfair Display', fontStyle: 'italic', fontSize: 40, color: GOLD}}>
            HE
          </div>
          <div style={{...items(12), fontFamily: 'Montserrat', fontWeight: 700, fontSize: 22, letterSpacing: 7, color: '#CFC4AE', textTransform: 'uppercase', marginTop: 22}}>{listing.area}</div>
          <div style={{...items(12), fontFamily: 'Playfair Display', fontStyle: 'italic', fontSize: 30, color: IVORY, marginTop: 6}}>{listing.city}</div>
          <div
            style={{
              ...items(16),
              fontFamily: 'Playfair Display',
              fontWeight: 600,
              fontSize: 104,
              marginTop: 10,
              backgroundImage: `linear-gradient(100deg, rgba(255,255,255,0) ${sweep - 20}%, rgba(255,250,235,.95) ${sweep}%, rgba(255,255,255,0) ${sweep + 20}%), ${GOLD_GRAD}`,
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {listing.price}
          </div>
          <div style={{...items(20), fontFamily: 'Montserrat', fontWeight: 600, fontSize: 24, color: IVORY, letterSpacing: 1, lineHeight: 1.6}}>
            {listing.specs.join('  ·  ')}
          </div>
          <div style={{...items(24), marginTop: 18}}>
            {listing.perks.map((p) => (
              <div key={p} style={{fontFamily: 'Playfair Display', fontStyle: 'italic', fontSize: 28, color: '#E9E1D0', marginTop: 4}}>
                {p}
              </div>
            ))}
          </div>
          <div style={{...items(26), height: 1, background: 'rgba(212,176,106,.5)', margin: '30px 40px 26px'}} />
          <div style={{...items(28), fontFamily: 'Montserrat', fontWeight: 700, fontSize: 22, letterSpacing: 6, color: GOLD, textTransform: 'uppercase'}}>WhatsApp · Viewing Persendirian</div>
          <div style={{...items(32), fontFamily: 'Playfair Display', fontWeight: 600, fontSize: 76, color: IVORY, marginTop: 8}}>{listing.phone}</div>
          <div style={{...items(36), fontFamily: 'Playfair Display', fontStyle: 'italic', fontSize: 32, color: '#CFC4AE'}}>{listing.agent}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const DesignD: React.FC = () => {
  const labelled = scenes.filter((s) => s.label).map((s) => s.id);
  const loc = sceneStart('location');
  const cta = sceneStart('cta');
  const cues: SfxCue[] = [
    {at: 0.0, file: 'impact.wav', volume: 0.75},
    {at: 0.35, file: 'shimmer.wav', volume: 0.45},
    {at: 1.15, file: 'shimmer.wav', volume: 0.45},
    ...cutTimes().map((t) => ({at: t - 0.15, file: 'whoosh-soft.wav', volume: 0.38})),
    {at: sceneStart('bath') + 0.33, file: 'shutter.wav', volume: 0.35},
    {at: loc + 0.32, file: 'pop.wav', volume: 0.45},
    {at: cta - 1.2, file: 'riser.wav', volume: 0.25},
    {at: cta + 0.15, file: 'impact.wav', volume: 0.5},
    {at: cta + 1.0, file: 'shimmer.wav', volume: 0.45},
    {at: cta + 1.3, file: 'ding.wav', volume: 0.35},
  ];
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Tour
        grade={{filter: 'saturate(0.82) contrast(1.08) brightness(0.92) sepia(0.12)'}}
        mapTheme="dark"
        wrap={(child, _s, i) => <Dip first={i === 0}>{child}</Dip>}
        label={(s) => <LabelD text={s.label!} index={labelled.indexOf(s.id)} />}
        overlay={(s) => (s.id === 'hook' ? <HookD /> : s.id === 'cta' ? <CtaD /> : null)}
      />
      <Captions variant="D" />
      <FilmLook />
      <MusicBed />
      <SfxTrack cues={cues} fps={FPS} />
    </AbsoluteFill>
  );
};
