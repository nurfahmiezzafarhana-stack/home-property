import React from 'react';
import {Html5Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {shots, startOf, VO_LEAD, voWords} from './data';

// One audio clip per VO line, placed VO_LEAD s into its scene.
export const VoTrack: React.FC<{volume?: number}> = ({volume = 1}) => {
  const {fps} = useVideoConfig();
  return (
    <>
      {shots
        .filter((s) => s.vo)
        .map((s) => (
          <Sequence key={s.id} from={Math.round((startOf(s.id) + VO_LEAD) * fps)} durationInFrames={Math.round(12 * fps)} layout="none" name={`vo-${s.vo}`}>
            <Html5Audio src={staticFile(`kapar/vo/${s.vo}.wav`)} volume={volume} />
          </Sequence>
        ))}
    </>
  );
};

// TikTok karaoke captions, K1 style: Montserrat ExtraBold, white with dark
// stroke, the spoken word in gold. 3 words per card (2 if one would be left).
type W = {text: string; start: number; end: number};
const chunks: {words: W[]; start: number; end: number}[] = (() => {
  const all = voWords();
  const out: {words: W[]; start: number; end: number}[] = [];
  // group per VO line first (never let a card straddle two scenes)
  let i = 0;
  while (i < all.length) {
    let j = i;
    while (j + 1 < all.length && all[j + 1].start - all[j].end < 0.05) j++;
    const line = all.slice(i, j + 1);
    let k = 0;
    while (k < line.length) {
      const rem = line.length - k;
      const n = rem === 4 ? 2 : Math.min(3, rem);
      const ws = line.slice(k, k + n);
      out.push({words: ws, start: ws[0].start, end: ws[ws.length - 1].end});
      k += n;
    }
    i = j + 1;
  }
  return out;
})();

export const KaraokeCaps: React.FC<{top?: number}> = ({top = 1120}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const c = chunks.find((x) => t >= x.start && t < x.end + 0.06);
  if (!c) return null;
  const local = t - c.start;
  const pop = interpolate(local, [0, 0.1], [0.9, 1], {extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', top, left: 120, right: 192, textAlign: 'center', transform: `scale(${pop})`}}>
      <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 64, lineHeight: 1.08, color: '#fff', WebkitTextStroke: '10px rgba(0,0,0,.85)', paintOrder: 'stroke fill', textShadow: '0 4px 18px rgba(0,0,0,.5)'}}>
        {c.words.map((w, i) => (
          <span key={i} style={{color: t >= w.start && t < w.end + 0.04 ? '#FFD27A' : '#fff'}}>
            {w.text}
            {i < c.words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </div>
    </div>
  );
};
