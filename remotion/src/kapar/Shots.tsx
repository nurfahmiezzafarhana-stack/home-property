import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Shot, shots, starts} from './data';
import {MapKapar} from './MapKapar';
import {MapReal} from './MapReal';

const lerp = (f: number, d: number, a?: [number, number], def = 0) =>
  a ? interpolate(f, [0, d], a, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.33, 0, 0.67, 1)}) : def;

const ShotView: React.FC<{shot: Shot; d: number; mapTheme: 'light' | 'dark'}> = ({shot, d, mapTheme}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (shot.kind === 'map') return mapTheme === 'light' ? <MapReal durationInFrames={d} /> : <MapKapar durationInFrames={d} theme={mapTheme} />;
  const zoom = lerp(f, d, shot.zoom, 1);
  const x = lerp(f, d, shot.x, 50);
  const rot = shot.kind === 'video' ? lerp(f, d, shot.rot, 0) : 0;
  const style: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: `${x}% 50%`,
    transform: `rotate(${rot}deg) scale(${zoom})`,
  };
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
      {shot.kind === 'video' ? (
        <OffthreadVideo
          src={staticFile(`kapar/${shot.src}.mp4`)}
          trimBefore={Math.round(shot.from * fps)}
          playbackRate={shot.rate}
          muted
          style={style}
        />
      ) : (
        <Img src={staticFile('kapar/render.jpg')} style={style} />
      )}
    </AbsoluteFill>
  );
};

// Whip transition: incoming shot slides in with directional blur (ref 10.0–10.5 s)
export const Whip: React.FC<{children: React.ReactNode; on: boolean; frames?: number}> = ({children, on, frames = 7}) => {
  const f = useCurrentFrame();
  if (!on) return <>{children}</>;
  const p = interpolate(f, [0, frames], [1, 0], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  return <AbsoluteFill style={{transform: `translateX(${p * 35}%) scale(${1 + p * 0.15})`, filter: `blur(${p * 18}px)`}}>{children}</AbsoluteFill>;
};

// Lens flare / light leak over a cut (ref 10.37–10.47 s)
export const Flare: React.FC<{at: number; color?: string}> = ({at, color = '255,170,90'}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const c = at * fps;
  const o = interpolate(f, [c - 5, c, c + 8], [0, 0.85, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  if (o <= 0) return null;
  const sx = interpolate(f, [c - 5, c + 8], [-20, 120]);
  return (
    <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'screen', opacity: o}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse 55% 35% at ${sx}% 40%, rgba(${color},1) 0%, rgba(${color},.35) 40%, rgba(0,0,0,0) 75%)`}} />
      <AbsoluteFill style={{background: `linear-gradient(100deg, rgba(0,0,0,0) ${sx - 30}%, rgba(255,240,220,.6) ${sx}%, rgba(0,0,0,0) ${sx + 30}%)`}} />
    </AbsoluteFill>
  );
};

export const Timeline: React.FC<{
  mapTheme?: 'light' | 'dark';
  grade?: React.CSSProperties;
  whipInto?: string[];
  overlay?: (id: string, d: number) => React.ReactNode;
}> = ({mapTheme = 'light', grade, whipInto = [], overlay}) => {
  const {fps} = useVideoConfig();
  const st = starts();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {shots.map((s, i) => {
        const d = Math.round(s.dur * fps);
        return (
          <Sequence key={s.id} from={Math.round(st[i] * fps)} durationInFrames={d} name={s.id}>
            <AbsoluteFill style={grade}>
              <Whip on={whipInto.includes(s.id)}>
                <ShotView shot={s} d={d} mapTheme={mapTheme} />
              </Whip>
            </AbsoluteFill>
            {overlay ? overlay(s.id, d) : null}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
