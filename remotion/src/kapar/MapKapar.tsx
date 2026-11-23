import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

// Stylised map of the Kapar area (diagram, NOT to scale, no real map tiles).
// West coast on the left, WCE running north–south, NKVE heading NE to
// Setia Alam, Federal Highway east to Shah Alam, project pin at Tok Muda.
const PIN = {x: 420, y: 700};

const TH = {
  light: {bg: '#EEF1F2', sea: '#AECBFA', street: '#FFFFFF', green: '#D3E8CF', hwCase: '#E8B53A', hw: '#FCD670', pin: '#EA4335', pinDot: '#A50E0E', card: '#FFFFFF', ink: '#202124', sub: '#5F6368', border: 'none', poiBg: '#4F6F96', dash: '#EA4335', shieldBg: '#2E7D4F', shieldInk: '#fff', shieldBorder: '3px solid #fff', town: '#5F6368'},
  dark: {bg: '#15171A', sea: '#13202E', street: '#272A2E', green: '#1C2620', hwCase: '#8C6F38', hw: '#D4B06A', pin: '#D4B06A', pinDot: '#15171A', card: '#101113', ink: '#F5EFE3', sub: '#B9AE98', border: '2px solid #D4B06A', poiBg: '#3A3F45', dash: '#D4B06A', shieldBg: '#101113', shieldInk: '#E2C27D', shieldBorder: '2px solid #D4B06A', town: '#B9AE98'},
};

const HW = [
  {id: 'wce', d: 'M 690 120 C 670 500, 700 900, 680 1250 S 650 1700, 690 1950', label: 'WCE', sx: 700, sy: 430, delay: 4},
  {id: 'nkve', d: 'M 690 1180 C 820 1100, 940 1010, 1120 900', label: 'NKVE', sx: 900, sy: 1010, delay: 10},
  {id: 'fed', d: 'M 280 1560 C 520 1520, 760 1480, 1120 1440', label: 'FEDERAL', sx: 470, sy: 1530, delay: 16},
];
const STREETS = ['M 150 560 L 1080 600', 'M 150 860 L 1080 900', 'M 300 300 L 330 1900', 'M 520 200 L 540 1900', 'M 150 1100 L 1080 1130', 'M 850 200 L 880 1900', 'M 150 1320 L 1080 1340'];
const POIS = [
  {x: 250, y: 600, icon: '🕌', text: 'Masjid', delay: 26},
  {x: 520, y: 610, icon: '🚆', text: 'ECRL Kapar', delay: 29},
  {x: 210, y: 840, icon: '🏫', text: 'Sekolah', delay: 32},
  {x: 470, y: 970, icon: '🏥', text: 'Klinik', delay: 35},
];
const TOWNS = [
  {x: 560, y: 820, text: 'Pekan Kapar'},
  {x: 900, y: 860, text: 'Setia Alam'},
  {x: 900, y: 1390, text: 'Shah Alam'},
];

export const MapKapar: React.FC<{durationInFrames: number; theme?: 'light' | 'dark'}> = ({durationInFrames, theme = 'light'}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const c = TH[theme];
  const zoom = interpolate(f, [0, durationInFrames], [1.0, 1.15], {extrapolateRight: 'clamp', easing: Easing.bezier(0.33, 0, 0.67, 1)});
  const draw = (delay: number) => interpolate(f, [delay, delay + 16], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const drop = spring({frame: f - 4, fps, config: {damping: 9, stiffness: 170, mass: 0.7}});
  const pulse = ((f - 12) % 30) / 30;
  const bubble = spring({frame: f - 12, fps, config: {damping: 14}});
  const kmLine = interpolate(f, [18, 34], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const kmLabel = interpolate(f, [30, 38], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{background: c.bg, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`, transformOrigin: `${PIN.x}px ${PIN.y}px`}}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
          {/* Straits of Malacca on the west */}
          <path d="M 0 0 L 170 0 C 140 400, 200 700, 150 1000 S 120 1600, 180 1920 L 0 1920 Z" fill={c.sea} />
          <path d="M 330 1180 C 400 1150, 480 1170, 470 1230 S 380 1290, 340 1260 Z" fill={c.green} />
          <path d="M 760 640 C 840 610, 960 640, 950 720 S 820 780, 780 740 Z" fill={c.green} />
          {STREETS.map((d, i) => (
            <path key={i} d={d} stroke={c.street} strokeWidth={14} fill="none" strokeLinecap="round" />
          ))}
          {HW.map((h) => (
            <g key={h.id}>
              <path d={h.d} stroke={c.hwCase} strokeWidth={32} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={draw(h.delay)} />
              <path d={h.d} stroke={c.hw} strokeWidth={22} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={draw(h.delay)} />
            </g>
          ))}
          {/* 5km dashed link pin -> Pekan Kapar */}
          <path d={`M ${PIN.x} ${PIN.y} Q 520 740 ${TOWNS[0].x} ${TOWNS[0].y - 10}`} stroke={c.dash} strokeWidth={5} fill="none" strokeDasharray="14 10" pathLength={1} style={{strokeDasharray: 1, strokeDashoffset: kmLine}} />
        </svg>

        {TOWNS.map((t) => (
          <div key={t.text} style={{position: 'absolute', left: t.x, top: t.y, transform: 'translate(-50%,-50%)', fontFamily: 'DM Sans', fontWeight: 700, fontSize: 30, letterSpacing: 1, color: c.town, textTransform: 'uppercase', opacity: interpolate(f, [8, 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
            {t.text}
          </div>
        ))}
        <div style={{position: 'absolute', left: 600, top: 712, opacity: kmLabel, fontFamily: 'DM Sans', fontWeight: 800, fontSize: 30, color: c.dash}}>5km</div>

        {HW.map((h) => (
          <Shield key={h.id} x={h.sx} y={h.sy} text={h.label} delay={h.delay + 8} bg={c.shieldBg} ink={c.shieldInk} border={c.shieldBorder} />
        ))}
        {POIS.map((p) => (
          <Poi key={p.text} {...p} bg={c.poiBg} ink={c.ink} stroke={c.bg} />
        ))}

        {f > 12 ? (
          <div style={{position: 'absolute', left: PIN.x - 60, top: PIN.y - 20, width: 120, height: 40, borderRadius: '50%', border: `4px solid ${c.pin}`, opacity: 1 - pulse, transform: `scale(${0.4 + pulse * 1.4})`}} />
        ) : null}
        <svg width={92} height={124} viewBox="0 0 46 62" style={{position: 'absolute', left: PIN.x - 46, top: PIN.y - 120, transform: `translateY(${(1 - drop) * -260}px)`, opacity: Math.min(1, drop * 3), filter: 'drop-shadow(0 6px 6px rgba(0,0,0,.3))'}}>
          <path d="M23 0C10.3 0 0 10.3 0 23c0 17.2 23 39 23 39s23-21.8 23-39C46 10.3 35.7 0 23 0z" fill={c.pin} />
          <circle cx="23" cy="23" r="9" fill={c.pinDot} />
        </svg>
        <div style={{position: 'absolute', left: PIN.x, top: PIN.y - 150, transform: `translate(-50%,-100%) scale(${bubble})`, transformOrigin: '50% 100%', background: c.card, border: c.border, borderRadius: 20, padding: '14px 24px 16px', boxShadow: '0 10px 30px rgba(0,0,0,.2)', whiteSpace: 'nowrap'}}>
          <div style={{fontFamily: 'DM Sans', fontWeight: 700, fontSize: 34, color: c.ink}}>Projek Teres Tok Muda</div>
          <div style={{fontFamily: 'DM Sans', fontWeight: 500, fontSize: 24, color: c.sub}}>Jalan Benteng Kanan, Kapar</div>
        </div>
      </AbsoluteFill>
      <div style={{position: 'absolute', top: 1262, left: 120, fontFamily: 'DM Sans', fontSize: 20, color: c.sub, opacity: 0.7}}>Ilustrasi, bukan skala</div>
    </AbsoluteFill>
  );
};

const Shield: React.FC<{x: number; y: number; text: string; delay: number; bg: string; ink: string; border: string}> = ({x, y, text, delay, bg, ink, border}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - delay, fps, config: {damping: 11, stiffness: 180}});
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${s})`, background: bg, color: ink, border, fontFamily: 'DM Sans', fontWeight: 700, fontSize: 30, padding: '6px 16px 8px', borderRadius: 10, boxShadow: '0 4px 12px rgba(0,0,0,.25)', letterSpacing: 1}}>
      {text}
    </div>
  );
};

const Poi: React.FC<{x: number; y: number; icon: string; text: string; delay: number; bg: string; ink: string; stroke: string}> = ({x, y, icon, text, delay, bg, ink, stroke}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [delay, delay + 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', left: x, top: y, display: 'flex', alignItems: 'center', gap: 10, opacity: o, transform: `translate(-20px,-50%) translateY(${(1 - o) * 10}px)`}}>
      <div style={{width: 44, height: 44, borderRadius: 22, background: bg, fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid #fff'}}>{icon}</div>
      <div style={{fontFamily: 'DM Sans', fontWeight: 700, fontSize: 28, color: ink, WebkitTextStroke: `6px ${stroke}`, paintOrder: 'stroke fill'}}>{text}</div>
    </div>
  );
};
