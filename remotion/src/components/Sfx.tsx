import React from 'react';
import {Html5Audio, Sequence, staticFile} from 'remotion';

export type SfxCue = {at: number; file: string; volume?: number}; // at = seconds

export const SfxTrack: React.FC<{cues: SfxCue[]; fps: number}> = ({cues, fps}) => (
  <>
    {cues.map((c, i) => (
      <Sequence key={i} from={Math.max(0, Math.round(c.at * fps))} durationInFrames={Math.round(2 * fps)} layout="none">
        <Html5Audio src={staticFile(`sfx/${c.file}`)} volume={c.volume ?? 0.8} />
      </Sequence>
    ))}
  </>
);

export const MusicBed: React.FC<{volume?: number}> = ({volume = 0.28}) => (
  <Html5Audio src={staticFile('sfx/music-placeholder.wav')} volume={volume} />
);
