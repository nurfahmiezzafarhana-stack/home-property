import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {listing} from '../data';

// Google-Maps-style location beat, drawn as vector (no real map tiles / no Google branding).
// Stylised diagram, NOT to scale: Elmina pin, GCE on the east, DASH heading south-east,
// LATAR across the north, nearby school/shop POIs.
const PIN = {x: 470, y: 860};

const roads = {
  // highways (drawn on)
  gce: 'M 820 120 C 790 420, 760 640, 745 860 S 720 1400, 760 1900',
  dash: 'M 560 930 C 650 980, 760 1010, 870 1090 S 1010 1220, 1120 1260',
  latar: 'M -40 470 C 220 430, 520 420, 760 380 S 1000 330, 1120 300',
  // local streets (static)
  local: [
    'M 0 760 L 1080 820',
    'M 0 1010 L 1080 1060',
    'M 260 0 L 300 1920',
    'M 560 300 L 600 1920',
    'M 0 1320 L 1080 1340',
    'M 120 600 L 700 640',
    'M 380 700 L 420 1200',
    'M 0 1560 L 1080 1600',
  ],
};

type Theme = 'light' | 'dark';
const TH = {
  light: {bg: '#F1F3F4', street: '#FFFFFF', park: '#CDE7C9', lake: '#AECBFA', hwCase: '#E8B53A', hw: '#FCD670', pin: '#EA4335', pinDot: '#A50E0E', bubbleBg: '#fff', bubbleBorder: 'none', title: '#202124', sub: '#5F6368', poiText: '#3E4A5C', poiStroke: '#F1F3F4', poiBg: '#5E7FA8', note: '#9AA0A6'},
  dark: {bg: '#16181A', street: '#2B2E31', park: '#1E2A22', lake: '#1B2633', hwCase: '#8C6F38', hw: '#D4B06A', pin: '#D4B06A', pinDot: '#16181A', bubbleBg: '#111214', bubbleBorder: '2px solid #D4B06A', title: '#F5EFE3', sub: '#B9AE98', poiText: '#E9E1D0', poiStroke: '#16181A', poiBg: '#3A3F45', note: '#6F6A60'},
};

const Shield: React.FC<{x: number; y: number; text: string; color: string; delay: number; dark?: boolean}> = ({x, y, text, color, delay, dark}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - delay, fps, config: {damping: 11, stiffness: 180}});
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%,-50%) scale(${s})`,
        background: dark ? '#111214' : color,
        color: dark ? '#E2C27D' : '#fff',
        fontFamily: 'DM Sans',
        fontWeight: 700,
        fontSize: 34,
        padding: '6px 18px 8px',
        borderRadius: 10,
        border: dark ? '2px solid #D4B06A' : '3px solid #fff',
        boxShadow: '0 4px 12px rgba(0,0,0,.25)',
        letterSpacing: 1,
      }}
    >
      {text}
    </div>
  );
};

const Poi: React.FC<{x: number; y: number; icon: string; text: string; delay: number; theme?: Theme}> = ({x, y, icon, text, delay, theme = 'light'}) => {
  const f = useCurrentFrame();
  const c = TH[theme];
  const o = interpolate(f, [delay, delay + 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', left: x, top: y, display: 'flex', alignItems: 'center', gap: 10, opacity: o, transform: `translate(-20px,-50%) translateY(${(1 - o) * 10}px)`}}>
      <div style={{width: 40, height: 40, borderRadius: 20, background: c.poiBg, color: '#fff', fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid #fff'}}>{icon}</div>
      <div style={{fontFamily: 'DM Sans', fontWeight: 700, fontSize: 28, color: c.poiText, WebkitTextStroke: `6px ${c.poiStroke}`, paintOrder: 'stroke fill'}}>{text}</div>
    </div>
  );
};

export const MapScene: React.FC<{durationInFrames: number; theme?: Theme}> = ({durationInFrames, theme = 'light'}) => {
  const frame = useCurrentFrame();
  const c = TH[theme];
  const dark = theme === 'dark';
  const {fps} = useVideoConfig();
  const zoom = interpolate(frame, [0, durationInFrames], [1.0, 1.18], {extrapolateRight: 'clamp', easing: Easing.bezier(0.33, 0, 0.67, 1)});
  const draw = (delay: number) => interpolate(frame, [delay, delay + 18], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const drop = spring({frame: frame - 6, fps, config: {damping: 9, stiffness: 170, mass: 0.7}});
  const pulse = ((frame - 14) % 30) / 30;
  const bubble = spring({frame: frame - 16, fps, config: {damping: 14}});

  return (
    <AbsoluteFill style={{background: c.bg, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`, transformOrigin: `${PIN.x}px ${PIN.y}px`}}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
          {/* parks & lake (Elmina central park / lake) */}
          <path d="M 120 880 C 180 820, 330 830, 360 900 S 320 1060, 220 1050 S 80 950, 120 880 Z" fill={c.park} />
          <path d="M 640 1150 C 700 1110, 860 1130, 880 1220 S 760 1330, 690 1290 S 600 1190, 640 1150 Z" fill={c.park} />
          <path d="M 160 1150 C 210 1110, 330 1130, 340 1190 S 250 1270, 190 1240 S 130 1180, 160 1150 Z" fill={c.lake} />
          <path d="M 880 520 C 960 500, 1080 520, 1080 600 L 1080 700 C 1000 720, 900 680, 880 620 Z" fill={c.park} />
          {/* local streets */}
          {roads.local.map((d, i) => (
            <path key={i} d={d} stroke={c.street} strokeWidth={16} fill="none" strokeLinecap="round" />
          ))}
          {/* highways: casing + fill, drawn on */}
          {[
            {d: roads.latar, delay: 2},
            {d: roads.gce, delay: 8},
            {d: roads.dash, delay: 14},
          ].map((r, i) => (
            <g key={i}>
              <path d={r.d} stroke={c.hwCase} strokeWidth={34} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={draw(r.delay)} />
              <path d={r.d} stroke={c.hw} strokeWidth={24} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={draw(r.delay)} />
            </g>
          ))}
        </svg>

        <Shield x={900} y={345} text="LATAR" color="#2E7D4F" delay={16} dark={dark} />
        <Shield x={790} y={640} text="GCE" color="#2E7D4F" delay={22} dark={dark} />
        <Shield x={900} y={1110} text="DASH" color="#2E7D4F" delay={28} dark={dark} />
        <Poi x={830} y={830} icon="🏫" text="Sekolah" delay={34} theme={theme} />
        <Poi x={640} y={1440} icon="🛒" text="Kedai" delay={38} theme={theme} />
        <Poi x={150} y={1400} icon="🏫" text="Sekolah" delay={42} theme={theme} />

        {/* pulse ring */}
        {frame > 14 ? (
          <div
            style={{
              position: 'absolute',
              left: PIN.x - 60,
              top: PIN.y - 20,
              width: 120,
              height: 40,
              borderRadius: '50%',
              border: `4px solid ${c.pin}`,
              opacity: 1 - pulse,
              transform: `scale(${0.4 + pulse * 1.4})`,
            }}
          />
        ) : null}
        {/* pin */}
        <svg
          width={92}
          height={124}
          viewBox="0 0 46 62"
          style={{position: 'absolute', left: PIN.x - 46, top: PIN.y - 120, transform: `translateY(${(1 - drop) * -260}px)`, opacity: Math.min(1, drop * 3), filter: 'drop-shadow(0 6px 6px rgba(0,0,0,.3))'}}
        >
          <path d="M23 0C10.3 0 0 10.3 0 23c0 17.2 23 39 23 39s23-21.8 23-39C46 10.3 35.7 0 23 0z" fill={c.pin} />
          <circle cx="23" cy="23" r="9" fill={c.pinDot} />
        </svg>
        {/* info bubble */}
        <div
          style={{
            position: 'absolute',
            left: PIN.x,
            top: PIN.y - 150,
            transform: `translate(-50%,-100%) scale(${bubble})`,
            transformOrigin: '50% 100%',
            background: c.bubbleBg,
            border: c.bubbleBorder,
            borderRadius: 20,
            padding: '16px 26px 18px',
            boxShadow: '0 10px 30px rgba(0,0,0,.18)',
            whiteSpace: 'nowrap',
          }}
        >
          <div style={{fontFamily: 'DM Sans', fontWeight: 700, fontSize: 36, color: c.title}}>{listing.area.replace('Pangsapuri ', '')}</div>
          <div style={{fontFamily: 'DM Sans', fontWeight: 500, fontSize: 26, color: c.sub}}>{listing.city}</div>
        </div>
      </AbsoluteFill>
      <div style={{position: 'absolute', top: 1262, left: 120, fontFamily: 'DM Sans', fontSize: 20, color: c.note}}>Ilustrasi, bukan skala</div>
    </AbsoluteFill>
  );
};
