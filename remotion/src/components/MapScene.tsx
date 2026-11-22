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

const Shield: React.FC<{x: number; y: number; text: string; color: string; delay: number}> = ({x, y, text, color, delay}) => {
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
        background: color,
        color: '#fff',
        fontFamily: 'DM Sans',
        fontWeight: 700,
        fontSize: 34,
        padding: '6px 18px 8px',
        borderRadius: 10,
        border: '3px solid #fff',
        boxShadow: '0 4px 12px rgba(0,0,0,.25)',
        letterSpacing: 1,
      }}
    >
      {text}
    </div>
  );
};

const Poi: React.FC<{x: number; y: number; icon: string; text: string; delay: number}> = ({x, y, icon, text, delay}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [delay, delay + 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', left: x, top: y, display: 'flex', alignItems: 'center', gap: 10, opacity: o, transform: `translate(-20px,-50%) translateY(${(1 - o) * 10}px)`}}>
      <div style={{width: 40, height: 40, borderRadius: 20, background: '#5E7FA8', color: '#fff', fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid #fff'}}>{icon}</div>
      <div style={{fontFamily: 'DM Sans', fontWeight: 700, fontSize: 28, color: '#3E4A5C', WebkitTextStroke: '6px #F1F3F4', paintOrder: 'stroke fill'}}>{text}</div>
    </div>
  );
};

export const MapScene: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const zoom = interpolate(frame, [0, durationInFrames], [1.0, 1.18], {extrapolateRight: 'clamp', easing: Easing.bezier(0.33, 0, 0.67, 1)});
  const draw = (delay: number) => interpolate(frame, [delay, delay + 18], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const drop = spring({frame: frame - 6, fps, config: {damping: 9, stiffness: 170, mass: 0.7}});
  const pulse = ((frame - 14) % 30) / 30;
  const bubble = spring({frame: frame - 16, fps, config: {damping: 14}});

  return (
    <AbsoluteFill style={{background: '#F1F3F4', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`, transformOrigin: `${PIN.x}px ${PIN.y}px`}}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
          {/* parks & lake (Elmina central park / lake) */}
          <path d="M 120 880 C 180 820, 330 830, 360 900 S 320 1060, 220 1050 S 80 950, 120 880 Z" fill="#CDE7C9" />
          <path d="M 640 1150 C 700 1110, 860 1130, 880 1220 S 760 1330, 690 1290 S 600 1190, 640 1150 Z" fill="#CDE7C9" />
          <path d="M 160 1150 C 210 1110, 330 1130, 340 1190 S 250 1270, 190 1240 S 130 1180, 160 1150 Z" fill="#AECBFA" />
          <path d="M 880 520 C 960 500, 1080 520, 1080 600 L 1080 700 C 1000 720, 900 680, 880 620 Z" fill="#CDE7C9" />
          {/* local streets */}
          {roads.local.map((d, i) => (
            <path key={i} d={d} stroke="#FFFFFF" strokeWidth={16} fill="none" strokeLinecap="round" />
          ))}
          {/* highways: casing + fill, drawn on */}
          {[
            {d: roads.latar, delay: 2},
            {d: roads.gce, delay: 8},
            {d: roads.dash, delay: 14},
          ].map((r, i) => (
            <g key={i}>
              <path d={r.d} stroke="#E8B53A" strokeWidth={34} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={draw(r.delay)} />
              <path d={r.d} stroke="#FCD670" strokeWidth={24} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={draw(r.delay)} />
            </g>
          ))}
        </svg>

        <Shield x={900} y={345} text="LATAR" color="#2E7D4F" delay={16} />
        <Shield x={790} y={640} text="GCE" color="#2E7D4F" delay={22} />
        <Shield x={900} y={1110} text="DASH" color="#2E7D4F" delay={28} />
        <Poi x={830} y={830} icon="🏫" text="Sekolah" delay={34} />
        <Poi x={640} y={1440} icon="🛒" text="Kedai" delay={38} />
        <Poi x={150} y={1400} icon="🏫" text="Sekolah" delay={42} />

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
              border: '4px solid #EA4335',
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
          <path d="M23 0C10.3 0 0 10.3 0 23c0 17.2 23 39 23 39s23-21.8 23-39C46 10.3 35.7 0 23 0z" fill="#EA4335" />
          <circle cx="23" cy="23" r="9" fill="#A50E0E" />
        </svg>
        {/* info bubble */}
        <div
          style={{
            position: 'absolute',
            left: PIN.x,
            top: PIN.y - 150,
            transform: `translate(-50%,-100%) scale(${bubble})`,
            transformOrigin: '50% 100%',
            background: '#fff',
            borderRadius: 20,
            padding: '16px 26px 18px',
            boxShadow: '0 10px 30px rgba(0,0,0,.18)',
            whiteSpace: 'nowrap',
          }}
        >
          <div style={{fontFamily: 'DM Sans', fontWeight: 700, fontSize: 36, color: '#202124'}}>{listing.area.replace('Pangsapuri ', '')}</div>
          <div style={{fontFamily: 'DM Sans', fontWeight: 500, fontSize: 26, color: '#5F6368'}}>{listing.city}</div>
        </div>
      </AbsoluteFill>
      <div style={{position: 'absolute', top: 1262, left: 120, fontFamily: 'DM Sans', fontSize: 20, color: '#9AA0A6'}}>Ilustrasi, bukan skala</div>
    </AbsoluteFill>
  );
};
