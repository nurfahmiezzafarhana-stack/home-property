// DESIGN B — "Bold Pop" : high-energy TikTok sticker style.
//  Hook  : POV kinetic stack, "SIAP RENOVATE" slams in (scale 2.2→1) with impact + shake
//  Cuts  : 6-frame zoom-punch (1.25→1) + whoosh on every cut
//  Labels: yellow sticker chip, springs in rotated, pop sfx
//  Caps  : Poppins ExtraBold, active word in a pink pill with hard shadow
//  CTA   : phone in black card, "CALL / WHATSAPP" sticker, bouncing arrow, "SAVE" sticker
import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FPS, hooks, listing} from '../data';
import {Captions} from '../components/Captions';
import {MusicBed, SfxTrack, SfxCue} from '../components/Sfx';
import {Tour, cutTimes, labelTimes, sceneStart} from '../components/Tour';

const YEL = '#FFE11A';
const PINK = '#FF4FA3';

const Punch: React.FC<{children: React.ReactNode; first: boolean}> = ({children, first}) => {
  const frame = useCurrentFrame();
  const s = first ? 1 : interpolate(frame, [0, 6], [1.25, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const flash = first ? 0 : interpolate(frame, [0, 4], [0.35, 0], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{transform: `scale(${s})`}}>
      {children}
      <AbsoluteFill style={{background: '#fff', opacity: flash}} />
    </AbsoluteFill>
  );
};

const Sticker: React.FC<{text: string; bg?: string; rot?: number; size?: number; delay?: number; color?: string}> = ({text, bg = YEL, rot = -4, size = 54, delay = 0, color = '#111'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - delay, fps, config: {damping: 9, stiffness: 200, mass: 0.6}});
  return (
    <div
      style={{
        display: 'inline-block',
        fontFamily: 'Poppins',
        fontWeight: 800,
        fontSize: size,
        color,
        background: bg,
        padding: '8px 26px 12px',
        borderRadius: 16,
        border: '5px solid #111',
        boxShadow: '8px 8px 0 #111',
        transform: `scale(${s}) rotate(${rot * s}deg)`,
        whiteSpace: 'pre',
      }}
    >
      {text}
    </div>
  );
};

const HookB: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const h = hooks.B;
  const pov = spring({frame: frame - 2, fps, config: {damping: 14}});
  const l2 = spring({frame: frame - 8, fps, config: {damping: 14}});
  const slam = interpolate(frame, [16, 24], [2.2, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic)});
  const slamO = interpolate(frame, [16, 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const shake = frame >= 24 && frame < 32 ? Math.sin(frame * 3.1) * (32 - frame) * 1.6 : 0;
  return (
    <AbsoluteFill style={{transform: `translate(${shake}px, ${shake * 0.6}px)`}}>
      <AbsoluteFill style={{background: 'linear-gradient(180deg,rgba(0,0,0,.55),rgba(0,0,0,.1) 45%,rgba(0,0,0,.0))'}} />
      <div style={{position: 'absolute', top: 320, left: 120, right: 192, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8}}>
        <div style={{fontFamily: 'Poppins', fontWeight: 800, fontSize: 70, color: PINK, WebkitTextStroke: '10px #111', paintOrder: 'stroke fill', opacity: pov, transform: `translateX(${(1 - pov) * -80}px)`}}>
          {h.line1}
        </div>
        <div style={{fontFamily: 'Poppins', fontWeight: 800, fontSize: 96, color: '#fff', WebkitTextStroke: '12px #111', paintOrder: 'stroke fill', lineHeight: 1, opacity: l2, transform: `translateX(${(1 - l2) * -80}px)`}}>
          {h.line2}
        </div>
        <div style={{marginTop: 14, opacity: slamO, transform: `scale(${slam}) rotate(-3deg)`, transformOrigin: 'left center'}}>
          <div style={{fontFamily: 'Poppins', fontWeight: 900, fontSize: 100, lineHeight: 1, color: '#111', background: YEL, padding: '14px 26px 20px', border: '6px solid #111', boxShadow: '10px 10px 0 #111'}}>{h.line3}</div>
        </div>
        <div style={{marginTop: 30}}>
          <Sticker text={h.line4} bg="#fff" rot={3} size={50} delay={36} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const CtaB: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const card = spring({frame: frame - 4, fps, config: {damping: 12, stiffness: 160}});
  const bob = Math.sin(frame / 5) * 12;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: 'rgba(0,0,0,.35)'}} />
      <div style={{position: 'absolute', top: 310, left: 120, right: 192, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28}}>
        <Sticker text="Nak tengok sendiri?" bg="#fff" rot={-3} size={64} delay={0} />
        <Sticker text={listing.price} bg={YEL} rot={2} size={96} delay={6} />
        <div style={{display: 'flex', gap: 16}}>
          {listing.specs.map((s, i) => (
            <Sticker key={s} text={s} bg={i === 1 ? PINK : '#fff'} color="#111" rot={i % 2 ? 3 : -3} size={34} delay={10 + i * 3} />
          ))}
        </div>
      </div>
      <div style={{position: 'absolute', top: 820, left: 120, right: 240, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div style={{fontSize: 90, transform: `translateY(${bob}px)`, color: YEL, fontFamily: 'Poppins', fontWeight: 900, WebkitTextStroke: '8px #111', paintOrder: 'stroke fill'}}>↓</div>
        <div style={{transform: `scale(${card})`, background: '#111', borderRadius: 34, padding: '28px 54px 34px', border: `6px solid ${YEL}`, textAlign: 'center'}}>
          <div style={{fontFamily: 'Poppins', fontWeight: 800, fontSize: 36, color: YEL, letterSpacing: 4}}>CALL / WHATSAPP</div>
          <div style={{fontFamily: 'Poppins', fontWeight: 900, fontSize: 76, color: '#fff'}}>{listing.phone}</div>
          <div style={{fontFamily: 'Poppins', fontWeight: 600, fontSize: 34, color: '#ddd'}}>{listing.agent}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const DesignB: React.FC = () => {
  const cta = sceneStart('cta');
  const cues: SfxCue[] = [
    {at: 0.05, file: 'pop.wav', volume: 0.7},
    {at: 0.27, file: 'pop.wav', volume: 0.7},
    {at: 0.78, file: 'impact.wav', volume: 1},
    {at: 1.2, file: 'pop.wav', volume: 0.6},
    ...cutTimes().map((t) => ({at: t - 0.1, file: 'whoosh.wav', volume: 0.55})),
    ...labelTimes().map((t) => ({at: t + 0.12, file: 'pop.wav', volume: 0.55})),
    {at: sceneStart('bath') + 10 / FPS, file: 'shutter.wav', volume: 0.7},
    {at: cta + 0.05, file: 'pop.wav', volume: 0.7},
    {at: cta + 0.25, file: 'pop.wav', volume: 0.7},
    {at: cta + 0.5, file: 'impact.wav', volume: 0.6},
    {at: cta + 0.9, file: 'ding.wav', volume: 0.6},
  ];
  return (
    <AbsoluteFill>
      <Tour
        grade={{filter: 'saturate(1.18) contrast(1.06)'}}
        wrap={(child, _s, i) => <Punch first={i === 0}>{child}</Punch>}
        label={(s, i) => (
          <div style={{position: 'absolute', top: 320, left: 110}}>
            <Sticker text={s.label!} rot={i % 2 ? 4 : -4} size={58} delay={3} />
          </div>
        )}
        overlay={(s) => (s.id === 'hook' ? <HookB /> : s.id === 'cta' ? <CtaB /> : null)}
      />
      <Captions variant="B" />
      <MusicBed volume={0.32} />
      <SfxTrack cues={cues} fps={FPS} />
    </AbsoluteFill>
  );
};
