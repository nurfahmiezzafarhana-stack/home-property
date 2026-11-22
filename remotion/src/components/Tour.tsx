import React from 'react';
import {AbsoluteFill, Sequence, useVideoConfig} from 'remotion';
import {scenes, sceneStarts, Scene} from '../data';
import {PhotoMove, SplitPhotos} from './Photo';
import {MapScene} from './MapScene';

// Lays every scene on the timeline. Designs plug in:
//  - wrap: per-shot transition wrapper (zoom punch, wipe, …)
//  - label: room-label overlay
//  - overlays: anything keyed by scene id (hook, CTA)
export const Tour: React.FC<{
  wrap?: (child: React.ReactNode, scene: Scene, index: number) => React.ReactNode;
  label?: (scene: Scene, index: number) => React.ReactNode;
  overlay?: (scene: Scene, durationInFrames: number) => React.ReactNode;
  grade?: React.CSSProperties;
  mapTheme?: 'light' | 'dark';
}> = ({wrap, label, overlay, grade, mapTheme}) => {
  const {fps} = useVideoConfig();
  const starts = sceneStarts();
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {scenes.map((s, i) => {
        const d = Math.round(s.dur * fps);
        const photo = s.kind === 'map' ? (
          <MapScene durationInFrames={d} theme={mapTheme} />
        ) : s.photo2 ? (
          <SplitPhotos a={s.photo} b={s.photo2} durationInFrames={d} />
        ) : (
          <PhotoMove src={s.photo} move={s.move} durationInFrames={d} />
        );
        return (
          <Sequence key={s.id} from={Math.round(starts[i] * fps)} durationInFrames={d} name={s.id}>
            <AbsoluteFill style={grade}>{wrap ? wrap(photo, s, i) : photo}</AbsoluteFill>
            {label && s.label ? label(s, i) : null}
            {overlay ? overlay(s, d) : null}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

// Cue helpers for SFX
export const cutTimes = () => sceneStarts().slice(1);
export const labelTimes = () => {
  const st = sceneStarts();
  return scenes.map((s, i) => (s.label ? st[i] : -1)).filter((t) => t >= 0);
};
export const sceneStart = (id: string) => sceneStarts()[scenes.findIndex((s) => s.id === id)];
