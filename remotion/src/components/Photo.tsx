import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Move} from '../data';

// Ken-Burns style camera move on a still photo, filling 9:16.
export const PhotoMove: React.FC<{
  src: string;
  move: Move;
  durationInFrames: number;
  style?: React.CSSProperties;
}> = ({src, move, durationInFrames, style}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.33, 0, 0.67, 1),
  });

  let scale = 1;
  let x = 50;
  let y = 50;
  let ty = 0;
  switch (move) {
    case 'push-in':
      scale = interpolate(p, [0, 1], [1.02, 1.14]);
      break;
    case 'pull-out':
      scale = interpolate(p, [0, 1], [1.18, 1.03]);
      break;
    case 'pan-left':
      scale = 1.06;
      x = interpolate(p, [0, 1], [78, 22]);
      break;
    case 'pan-right':
      scale = 1.06;
      x = interpolate(p, [0, 1], [22, 78]);
      break;
    case 'walk': {
      // forward "gimbal walk": accelerating push + subtle step bob
      const pe = Easing.in(Easing.quad)(p);
      scale = interpolate(pe, [0, 1], [1.0, 1.28]);
      ty = Math.sin(frame / 4.2) * 4;
      y = 46;
      break;
    }
  }

  return (
    <AbsoluteFill style={{overflow: 'hidden', backgroundColor: '#111', ...style}}>
      <Img
        src={staticFile(`photos/${src}`)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: `${x}% ${y}%`,
          transform: `translateY(${ty}px) scale(${scale})`,
          transformOrigin: `${x}% ${y}%`,
        }}
      />
    </AbsoluteFill>
  );
};

// Two photos stacked (used for the 2 bathrooms beat). Second one slides in.
export const SplitPhotos: React.FC<{a: string; b: string; durationInFrames: number; delay?: number}> = ({
  a,
  b,
  durationInFrames,
  delay = 10,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const slide = interpolate(frame, [delay, delay + 0.3 * fps], [100, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 960, overflow: 'hidden'}}>
        <PhotoMove src={a} move="push-in" durationInFrames={durationInFrames} />
      </div>
      <div
        style={{
          position: 'absolute',
          top: 960,
          left: 0,
          right: 0,
          height: 960,
          overflow: 'hidden',
          transform: `translateX(${slide}%)`,
        }}
      >
        <PhotoMove src={b} move="push-in" durationInFrames={durationInFrames} />
      </div>
      <div style={{position: 'absolute', top: 956, left: 0, right: 0, height: 8, background: '#fff', transform: `scaleX(${1 - slide / 100})`}} />
    </AbsoluteFill>
  );
};
