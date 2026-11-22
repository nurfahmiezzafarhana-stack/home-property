// DESIGN A — "Luxe Serif" : closest to the reference TikTok.
//  Hook  : serif price drops in from above with blur (ref f6→f20), location in gold
//          with a sparkle sweep (ref 0:00.5–0:01.5)
//  Cuts  : hard cuts (ref uses hard cuts only) + soft whoosh
//  Caps  : Montserrat Black uppercase, black stroke, active word yellow, 2–3 words
//  CTA   : yellow bar grows from centre at -3°, name sparkles in, phone types digit
//          by digit (~2 frames/char), burst doodles (ref 2:30.3–2:31.6)
import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FPS, hooks, listing, scenes} from '../data';
import {Captions} from '../components/Captions';
import {MusicBed, SfxTrack, SfxCue} from '../components/Sfx';
import {Tour, cutTimes, sceneStart} from '../components/Tour';

const GOLD = 'linear-gradient(180deg,#FFF6D5 0%,#F3D27A 40%,#C9962E 70%,#FBE7A6 100%)';

const Sparkles: React.FC<{progress: number; width: number; seed?: number}> = ({progress, width, seed = 1}) => {
  // deterministic particles sweeping left -> right with the reveal
  const pts = Array.from({length: 18}, (_, i) => {
    const r = Math.abs(Math.sin((i + 1) * 12.9898 * seed) * 43758.5453) % 1;
    const r2 = Math.abs(Math.sin((i + 1) * 78.233 * seed) * 12543.13) % 1;
    return {x: r, y: r2};
  });
  return (
    <>
      {pts.map((p, i) => {
        const local = progress * 1.3 - p.x;
        const o = interpolate(local, [0, 0.08, 0.35], [0, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        const s = 6 + p.y * 10;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: p.x * width,
              top: -20 + p.y * 110,
              width: s,
              height: s,
              opacity: o,
              background: 'radial-gradient(circle,#fff 0%,#FFE7A0 35%,rgba(255,215,120,0) 70%)',
              transform: `rotate(45deg) scale(${1 + o})`,
              filter: 'drop-shadow(0 0 6px #FFD36B)',
            }}
          />
        );
      })}
    </>
  );
};

const HookA: React.FC = () => {
  const frame = useCurrentFrame();
  const drop = interpolate(frame, [0, 12], [-90, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const blur = interpolate(frame, [0, 12], [14, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const op = interpolate(frame, [0, 6], [0.35, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const reveal = interpolate(frame, [8, 34], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const h = hooks.A;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(180deg,rgba(0,0,0,0.55) 0%,rgba(0,0,0,0.05) 32%,rgba(0,0,0,0.05) 45%,rgba(0,0,0,0.55) 70%,rgba(0,0,0,0.2) 100%)'}} />
      <div
        style={{
          position: 'absolute',
          top: 330,
          left: 120,
          right: 192,
          textAlign: 'center',
          fontFamily: 'Playfair Display',
          fontWeight: 600,
          fontSize: 118,
          color: '#fff',
          letterSpacing: 1,
          textShadow: '0 6px 24px rgba(0,0,0,0.55), 0 2px 2px rgba(0,0,0,0.6)',
          transform: `translateY(${drop}px)`,
          filter: `blur(${blur}px)`,
          opacity: op,
        }}
      >
        {h.title}
      </div>
      <div style={{position: 'absolute', top: 1000, left: 120, right: 300, textAlign: 'center'}}>
        <div style={{position: 'relative', display: 'inline-block', clipPath: `inset(0 ${(1 - reveal) * 100}% 0 0)`}}>
          <div style={{fontFamily: 'Playfair Display', fontWeight: 500, fontSize: 46, letterSpacing: 8, color: '#fff', textTransform: 'uppercase', textShadow: '0 3px 12px rgba(0,0,0,.8)'}}>
            {h.kicker}
          </div>
          <div
            style={{
              fontFamily: 'Playfair Display',
              fontWeight: 700,
              fontSize: 92,
              letterSpacing: 2,
              textTransform: 'uppercase',
              backgroundImage: GOLD,
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              filter: 'drop-shadow(0 3px 2px rgba(0,0,0,.8)) drop-shadow(0 6px 18px rgba(0,0,0,.6))',
            }}
          >
            {h.sub}
          </div>
        </div>
        <div style={{position: 'absolute', left: 0, top: 20, width: 660, height: 140}}>
          <Sparkles progress={reveal} width={660} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const LabelA: React.FC<{text: string}> = ({text}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [2, 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const w = interpolate(frame, [4, 16], [0, 90], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  return (
    <div style={{position: 'absolute', top: 330, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22, opacity: o}}>
      <div style={{height: 3, width: w, background: '#F3D27A', boxShadow: '0 1px 4px rgba(0,0,0,.6)'}} />
      <div style={{fontFamily: 'Playfair Display', fontStyle: 'italic', fontWeight: 600, fontSize: 68, color: '#fff', textShadow: '0 2px 2px rgba(0,0,0,.7), 0 4px 24px rgba(0,0,0,.8)'}}>{text}</div>
      <div style={{height: 3, width: w, background: '#F3D27A', boxShadow: '0 1px 4px rgba(0,0,0,.6)'}} />
    </div>
  );
};

const Burst: React.FC<{side: 'l' | 'r'; o: number}> = ({side, o}) => (
  <svg width="70" height="70" viewBox="0 0 70 70" style={{position: 'absolute', [side === 'l' ? 'left' : 'right']: -64, top: side === 'l' ? 70 : -40, opacity: o}}>
    {[0, 1, 2].map((k) => (
      <line key={k} x1={35} y1={35} x2={35 + Math.cos(((side === 'l' ? 150 : -30) + k * 35) * (Math.PI / 180)) * 30} y2={35 + Math.sin(((side === 'l' ? 150 : -30) + k * 35) * (Math.PI / 180)) * 30} stroke="#fff" strokeWidth={6} strokeLinecap="round" />
    ))}
  </svg>
);

const CtaA: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const bar = interpolate(frame, [9, 24], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.4))});
  const nameRev = interpolate(frame, [14, 34], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const phone = listing.phone;
  const chars = Math.floor(interpolate(frame, [30, 30 + phone.length * 2], [0, phone.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const burst = interpolate(frame, [20, 26], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const priceIn = spring({frame: frame - 2, fps, config: {damping: 16}});
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(180deg,rgba(0,0,0,.72) 0%,rgba(0,0,0,.55) 28%,rgba(0,0,0,0) 45%,rgba(0,0,0,.55) 75%)'}} />
      <div style={{position: 'absolute', top: 340, left: 120, right: 192, textAlign: 'center', opacity: priceIn, transform: `translateY(${(1 - priceIn) * -40}px)`}}>
        <div style={{fontFamily: 'Playfair Display', fontSize: 44, letterSpacing: 8, color: '#F3D27A', textTransform: 'uppercase'}}>{listing.city}</div>
        <div style={{fontFamily: 'Playfair Display', fontWeight: 600, fontSize: 110, color: '#fff', textShadow: '0 6px 24px rgba(0,0,0,.55)'}}>{listing.price}</div>
        <div style={{fontFamily: 'Montserrat', fontWeight: 700, fontSize: 30, color: '#fff', letterSpacing: 1, marginTop: 10}}>{listing.specs.join('  •  ')}</div>
      </div>
      <div style={{position: 'absolute', top: 960, left: 120, right: 240, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div style={{position: 'relative', transform: 'rotate(-3deg)'}}>
          <div style={{width: 600, height: 130, background: '#FFE500', transform: `scaleX(${bar})`, boxShadow: '0 8px 0 rgba(0,0,0,.25)'}} />
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Poppins', fontStyle: 'italic', fontWeight: 800, fontSize: 70, color: '#1a1a1a', letterSpacing: 1}}>
            {phone.slice(0, chars)}
          </div>
          <Burst side="l" o={burst} />
          <Burst side="r" o={burst} />
        </div>
        <div style={{position: 'relative', marginTop: 18, transform: 'rotate(-3deg)'}}>
          <div style={{fontFamily: 'Poppins', fontWeight: 800, fontSize: 42, color: '#FFE500', letterSpacing: 2, textTransform: 'uppercase', WebkitTextStroke: '6px #000', paintOrder: 'stroke fill', clipPath: `inset(0 ${(1 - nameRev) * 100}% 0 0)`}}>
            {listing.agent}
          </div>
          <div style={{position: 'absolute', left: 0, top: 0, width: 420, height: 60}}>
            <Sparkles progress={nameRev} width={420} seed={3} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const DesignA: React.FC = () => {
  const phoneStart = sceneStart('cta') + 30 / FPS;
  const cues: SfxCue[] = [
    {at: 0.2, file: 'impact.wav', volume: 0.9},
    {at: 0.45, file: 'shimmer.wav', volume: 0.7},
    ...cutTimes().map((t) => ({at: t - 0.12, file: 'whoosh-soft.wav', volume: 0.5})),
    {at: sceneStart('bath') + 10 / FPS, file: 'shutter.wav', volume: 0.6},
    {at: sceneStart('cta') - 1.2, file: 'riser.wav', volume: 0.35},
    {at: sceneStart('cta') + 0.3, file: 'pop.wav', volume: 0.8},
    {at: sceneStart('cta') + 0.5, file: 'shimmer.wav', volume: 0.5},
    ...Array.from({length: listing.phone.replace(/ /g, '').length}, (_, i) => ({at: phoneStart + (i * 2.4) / FPS, file: 'click.wav', volume: 0.45})),
    {at: phoneStart + (listing.phone.length * 2) / FPS + 0.1, file: 'ding.wav', volume: 0.55},
  ];
  return (
    <AbsoluteFill>
      <Tour
        label={(s) => <LabelA text={s.label!} />}
        overlay={(s) => (s.id === 'hook' ? <HookA /> : s.id === 'cta' ? <CtaA /> : null)}
      />
      <Captions variant="A" />
      <MusicBed />
      <SfxTrack cues={cues} fps={FPS} />
    </AbsoluteFill>
  );
};

export const designANotes = scenes.length;
