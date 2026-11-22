import React from 'react';
import {spring, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {buildChunks} from '../data';

export type CaptionStyle = 'A' | 'B' | 'C' | 'D';

const chunks = buildChunks();

// TikTok captions, word-by-word highlight.
//  A = reference style: Montserrat Black, white + black stroke, active word yellow, hard cut
//  B = pop: Poppins ExtraBold, active word in a coloured pill, card springs in
//  C = minimal: DM Sans in frosted pill, inactive words dimmed
export const Captions: React.FC<{variant: CaptionStyle; top?: number}> = ({variant, top}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const chunk = chunks.find((c) => t >= c.start && t < c.end + 0.05);
  if (!chunk) return null;
  const local = frame - Math.round(chunk.start * fps);

  const y = top ?? (variant === 'C' ? 1100 : 1060);

  if (variant === 'A') {
    return (
      <div style={{position: 'absolute', top: y, left: 120, right: 300, textAlign: 'center'}}>
        <div
          style={{
            fontFamily: 'Montserrat',
            fontWeight: 900,
            fontSize: 74,
            lineHeight: 1.02,
            textTransform: 'uppercase',
            letterSpacing: -0.5,
            color: '#fff',
            WebkitTextStroke: '12px #000',
            paintOrder: 'stroke fill',
            textShadow: '0 6px 0 rgba(0,0,0,0.35)',
          }}
        >
          {chunk.words.map((w, i) => {
            const active = t >= w.start && t < w.end + 0.04;
            return (
              <span key={i} style={{color: active || w.accent ? '#FFE500' : '#fff'}}>
                {w.text}
                {i < chunk.words.length - 1 ? ' ' : ''}
              </span>
            );
          })}
        </div>
      </div>
    );
  }

  if (variant === 'D') {
    const o = interpolate(local, [0, 6], [0, 1], {extrapolateRight: 'clamp'});
    return (
      <div style={{position: 'absolute', top: y - 40, left: 60, right: 240, padding: '40px 60px', textAlign: 'center', opacity: o, background: 'radial-gradient(ellipse 62% 58% at 50% 50%, rgba(0,0,0,.62), rgba(0,0,0,0) 100%)'}}>
        <div style={{fontFamily: 'Playfair Display', fontStyle: 'italic', fontWeight: 600, fontSize: 64, lineHeight: 1.12, color: '#F5EFE3', textShadow: '0 2px 3px rgba(0,0,0,.7), 0 6px 28px rgba(0,0,0,.75)'}}>
          {chunk.words.map((w, i) => {
            const active = t >= w.start && t < w.end + 0.04;
            return (
              <span key={i} style={{color: active || w.accent ? '#E2C27D' : '#F5EFE3'}}>
                {w.text}
                {i < chunk.words.length - 1 ? ' ' : ''}
              </span>
            );
          })}
        </div>
      </div>
    );
  }

  if (variant === 'B') {
    const s = spring({frame: local, fps, config: {damping: 12, stiffness: 220, mass: 0.6}});
    return (
      <div
        style={{
          position: 'absolute',
          top: y,
          left: 120,
          right: 300,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '6px 14px',
          transform: `scale(${interpolate(s, [0, 1], [0.6, 1])}) rotate(${interpolate(s, [0, 1], [-4, 0])}deg)`,
          opacity: Math.min(1, s * 2),
        }}
      >
        {chunk.words.map((w, i) => {
          const active = t >= w.start && t < w.end + 0.04;
          return (
            <span
              key={i}
              style={{
                fontFamily: 'Poppins',
                fontWeight: 800,
                fontSize: 78,
                lineHeight: 1.1,
                padding: '2px 18px 6px',
                borderRadius: 18,
                color: active ? '#111' : '#fff',
                background: active ? '#FF4FA3' : 'transparent',
                WebkitTextStroke: active ? '0px' : '10px #111',
                paintOrder: 'stroke fill',
                transform: active ? 'scale(1.08) rotate(-2deg)' : 'none',
                boxShadow: active ? '6px 6px 0 #111' : 'none',
              }}
            >
              {w.text}
            </span>
          );
        })}
      </div>
    );
  }

  // C
  const o = interpolate(local, [0, 5], [0, 1], {extrapolateRight: 'clamp'});
  const ty = interpolate(local, [0, 6], [14, 0], {extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', top: y, left: 120, right: 300, display: 'flex', justifyContent: 'center', opacity: o, transform: `translateY(${ty}px)`}}>
      <div
        style={{
          fontFamily: 'DM Sans',
          fontWeight: 700,
          fontSize: 58,
          color: '#fff',
          padding: '18px 34px 22px',
          borderRadius: 999,
          background: 'rgba(31,42,34,0.74)',
          backdropFilter: 'blur(14px)',
          border: '1.5px solid rgba(255,255,255,0.25)',
          maxWidth: 660,
          textAlign: 'center',
        }}
      >
        {chunk.words.map((w, i) => {
          const active = t >= w.start;
          return (
            <span key={i} style={{opacity: active ? 1 : 0.5, color: w.accent ? '#D9E8C8' : '#fff'}}>
              {w.text}
              {i < chunk.words.length - 1 ? ' ' : ''}
            </span>
          );
        })}
      </div>
    </div>
  );
};
