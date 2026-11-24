import React from 'react';
import {Composition} from 'remotion';
import './fonts';
import {FPS, HEIGHT, TOTAL_FRAMES, WIDTH} from './data';
import {DesignA} from './designs/DesignA';
import {DesignB} from './designs/DesignB';
import {DesignC} from './designs/DesignC';
import {DesignD} from './designs/DesignD';
import {MeruK1, MERU_FRAMES} from './meru/Design';
import {MeruMinimal, MERU_MIN_FRAMES} from './meru/Minimal';
import {K1Cinematic, K2PromoBold, K3LuxeGold, KAPAR_FRAMES} from './kapar/Designs';

export const Root: React.FC = () => (
  <>
    <Composition id="DesignA-Luxe" component={DesignA} durationInFrames={TOTAL_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="DesignB-Pop" component={DesignB} durationInFrames={TOTAL_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="DesignD-NoirGold" component={DesignD} durationInFrames={TOTAL_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="DesignC-Minimal" component={DesignC} durationInFrames={TOTAL_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="Kapar-K1-Cinematic" component={K1Cinematic} durationInFrames={KAPAR_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="Kapar-K2-PromoBold" component={K2PromoBold} durationInFrames={KAPAR_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="Kapar-K3-LuxeGold" component={K3LuxeGold} durationInFrames={KAPAR_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="Meru-K1-Cinematic" component={MeruK1} durationInFrames={MERU_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="Meru-M-Minimal" component={MeruMinimal} durationInFrames={MERU_MIN_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
  </>
);
