import React from 'react';
import {Composition} from 'remotion';
import './fonts';
import {FPS, HEIGHT, TOTAL_FRAMES, WIDTH} from './data';
import {DesignA} from './designs/DesignA';
import {DesignB} from './designs/DesignB';
import {DesignC} from './designs/DesignC';
import {DesignD} from './designs/DesignD';

export const Root: React.FC = () => (
  <>
    <Composition id="DesignA-Luxe" component={DesignA} durationInFrames={TOTAL_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="DesignB-Pop" component={DesignB} durationInFrames={TOTAL_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="DesignD-NoirGold" component={DesignD} durationInFrames={TOTAL_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="DesignC-Minimal" component={DesignC} durationInFrames={TOTAL_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
  </>
);
