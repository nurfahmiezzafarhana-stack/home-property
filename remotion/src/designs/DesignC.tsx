// DESIGN C — "Sage Minimal" : editorial, matches the unit's sage-green walls.
//  Hook  : "Tak perlu renovate lagi." serif lines rise from masks (staggered 5f),
//          spec chips + price fade up; bottom sage gradient
//  Cuts  : 8-frame vertical mask wipe (clip-path) + soft whoosh
//  Labels: "02 — Ruang Tamu" index eyebrow with growing hairline
//  Caps  : DM Sans in frosted sage pill, words brighten as spoken
//  CTA   : clean listing card slides up: price, specs, phone, agent
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {FPS, hooks, listing, scenes} from '../data';
import {Captions} from '../components/Captions';
import {MusicBed, SfxTrack, SfxCue} from '../components/Sfx';
import {Tour, cutTimes, sceneStart} from '../components/Tour';

const SAGE = '#C9D6BC';
const INK = '#1F2A22';

const ease = Easing.bezier(0.22, 1, 0.36, 1);
const rise = (frame: number, delay: number, dist = 60) => ({
  transform: `translateY(${interpolate(frame, [delay, delay + 14], [dist, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease})}px)`,
  opacity: interpolate(frame, [delay, delay + 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
});

const Wipe: React.FC<{children: React.ReactNode; first: boolean}> = ({children, first}) => {
  const frame = useCurrentFrame();
  const p = first ? 0 : interpolate(frame, [0, 8], [100, 0], {extrapolateRight: 'clamp', easing: ease});
  return <AbsoluteFill style={{clipPath: `inset(${p}% 0 0 0)`}}>{children}</AbsoluteFill>;
};

const HookC: React.FC = () => {
  const frame = useCurrentFrame();
  const lines = hooks.C.title.split('\n');
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: `linear-gradient(180deg,rgba(31,42,34,.1) 10%,rgba(31,42,34,.78) 42%,rgba(31,42,34,.86) 70%,rgba(31,42,34,.3) 100%)`}} />
      <div style={{position: 'absolute', left: 120, right: 192, top: 600}}>
        <div style={{...rise(frame, 2, 20), fontFamily: 'DM Sans', fontWeight: 700, fontSize: 30, letterSpacing: 8, color: SAGE, textTransform: 'uppercase'}}>
          {hooks.C.eyebrow}
        </div>
        {lines.map((l, i) => (
          <div key={i} style={{overflow: 'hidden'}}>
            <div style={{...rise(frame, 6 + i * 5, 130), fontFamily: 'DM Serif Display', fontSize: 132, lineHeight: 1.02, color: '#fff'}}>{l}</div>
          </div>
        ))}
        <div style={{...rise(frame, 26, 20), display: 'flex', gap: 12, marginTop: 34, flexWrap: 'wrap'}}>
          {listing.specs.map((s) => (
            <div key={s} style={{fontFamily: 'DM Sans', fontWeight: 600, fontSize: 30, color: '#fff', border: `1.5px solid ${SAGE}`, borderRadius: 999, padding: '8px 22px'}}>
              {s}
            </div>
          ))}
        </div>
        <div style={{...rise(frame, 32, 20), fontFamily: 'DM Sans', fontWeight: 700, fontSize: 54, color: SAGE, marginTop: 26}}>{hooks.C.price}</div>
      </div>
    </AbsoluteFill>
  );
};

const LabelC: React.FC<{text: string; index: number}> = ({text, index}) => {
  const frame = useCurrentFrame();
  const w = interpolate(frame, [4, 18], [0, 70], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  return (
    <div style={{position: 'absolute', top: 320, left: 110, display: 'flex', alignItems: 'center', gap: 18, padding: '10px 30px 14px 26px', borderRadius: 999, background: 'rgba(31,42,34,.62)', backdropFilter: 'blur(12px)', ...rise(frame, 2, 24)}}>
      <div style={{fontFamily: 'DM Sans', fontWeight: 700, fontSize: 30, color: SAGE, letterSpacing: 2}}>{String(index).padStart(2, '0')}</div>
      <div style={{height: 2, width: w, background: SAGE}} />
      <div style={{fontFamily: 'DM Serif Display', fontSize: 60, color: '#fff'}}>{text}</div>
    </div>
  );
};

const CtaC: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: 'rgba(31,42,34,.35)'}} />
      <div style={{position: 'absolute', left: 120, right: 192, top: 330, ...rise(frame, 4, 120)}}>
        <div style={{background: '#F6F4EE', borderRadius: 36, padding: '44px 48px 40px', boxShadow: '0 30px 80px rgba(0,0,0,.35)'}}>
          <div style={{fontFamily: 'DM Sans', fontWeight: 700, fontSize: 26, letterSpacing: 4, color: '#7C8F70', textTransform: 'uppercase'}}>
            {listing.area}
          </div>
          <div style={{fontFamily: 'DM Sans', fontWeight: 500, fontSize: 28, color: '#5b6358', marginTop: 4}}>{listing.city}</div>
          <div style={{fontFamily: 'DM Serif Display', fontSize: 104, color: INK, lineHeight: 1.05, marginTop: 10}}>{listing.price}</div>
          <div style={{display: 'flex', gap: 10, marginTop: 22, flexWrap: 'wrap'}}>
            {listing.specs.map((s) => (
              <div key={s} style={{fontFamily: 'DM Sans', fontWeight: 600, fontSize: 28, color: INK, background: SAGE, borderRadius: 999, padding: '8px 20px'}}>
                {s}
              </div>
            ))}
          </div>
          <div style={{marginTop: 22, ...rise(frame, 10, 16)}}>
            {listing.perks.map((p) => (
              <div key={p} style={{fontFamily: 'DM Sans', fontWeight: 600, fontSize: 28, color: INK, marginTop: 6}}>
                <span style={{color: '#6E8B5E', marginRight: 12}}>✓</span>
                {p}
              </div>
            ))}
          </div>
          <div style={{height: 1.5, background: '#D8D6CC', margin: '28px 0 24px'}} />
          <div style={{fontFamily: 'DM Sans', fontWeight: 500, fontSize: 32, color: '#5b6358', ...rise(frame, 14, 16)}}>WhatsApp untuk info & viewing</div>
          <div style={{fontFamily: 'DM Sans', fontWeight: 700, fontSize: 76, color: INK, ...rise(frame, 18, 16)}}>{listing.phone}</div>
          <div style={{fontFamily: 'DM Sans', fontWeight: 500, fontSize: 32, color: '#5b6358', ...rise(frame, 22, 16)}}>{listing.agent}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const DesignC: React.FC = () => {
  const labelled = scenes.filter((s) => s.label).map((s) => s.id);
  const cues: SfxCue[] = [
    {at: 0.2, file: 'whoosh-soft.wav', volume: 0.5},
    {at: 0.9, file: 'pop.wav', volume: 0.35},
    ...cutTimes().map((t) => ({at: t - 0.08, file: 'whoosh-soft.wav', volume: 0.45})),
    {at: sceneStart('bath') + 10 / FPS, file: 'shutter.wav', volume: 0.45},
    {at: sceneStart('cta') + 0.15, file: 'whoosh.wav', volume: 0.35},
    {at: sceneStart('cta') + 0.75, file: 'ding.wav', volume: 0.4},
  ];
  return (
    <AbsoluteFill>
      <Tour
        grade={{filter: 'saturate(0.92) brightness(1.03)'}}
        wrap={(child, _s, i) => <Wipe first={i === 0}>{child}</Wipe>}
        label={(s) => <LabelC text={s.label!} index={labelled.indexOf(s.id) + 1} />}
        overlay={(s) => (s.id === 'hook' ? <HookC /> : s.id === 'cta' ? <CtaC /> : null)}
      />
      <Captions variant="C" />
      <MusicBed volume={0.26} />
      <SfxTrack cues={cues} fps={FPS} />
    </AbsoluteFill>
  );
};
