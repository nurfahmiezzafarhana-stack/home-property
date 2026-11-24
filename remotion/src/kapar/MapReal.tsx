import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import * as kaparData from './mapData';

// Real-geography map (OpenStreetMap data, Google-Maps-like styling).
// Units in mapData are metres from the project site, y down.
// Camera: close-up on the pin + nearby facilities, then zoom out to the region.

const W = 1080;
const H = 1920;
const STYLE = {
  land: '#F1F3F4',
  sea: '#AADAFF',
  river: '#AADAFF',
  secondary: '#FFFFFF',
  primary: '#FFFFFF',
  primaryCase: '#DADCE0',
  trunk: '#FDE293',
  trunkCase: '#F9AB00',
  motorway: '#FBC26A',
  motorwayCase: '#E37400',
  pin: '#EA4335',
  ink: '#202124',
  sub: '#5F6368',
};

export type MapData = {roads: Record<string, readonly string[]>; land: string[]; places: Record<string, [number, number]>; hwLabels: Record<string, [number, number][]>};
export type MapConfig = {
  data: MapData;
  close: [number, number, number]; // [centerX, centerY, widthMetres]
  wide: [number, number, number];
  facilities: {k: string; icon: string; label: string; dy: number; sub?: string}[];
  towns: string[]; // shown in the wide view
  nearTown?: string; // shown from the start (close view)
  shields: [string, string, [number, number]][]; // [ref, label, target point]
  pinTitle: string;
  pinSub: string;
};

// [centerX, centerY, widthMetres]
const CLOSE: [number, number, number] = [3100, -200, 10500];
const WIDE: [number, number, number] = [10000, 4200, 27000];

// dy: label nudge in px so neighbours around Pekan Kapar don't collide
const FACILITIES: MapConfig['facilities'] = [
  {k: 'SK Tok Muda', icon: '🏫', label: 'SK Tok Muda', dy: 40},
  {k: 'Klinik Kesihatan Kapar', icon: '🏥', label: 'Klinik Kesihatan', dy: -70},
  {k: 'SMK Tengku Idris Shah', icon: '🏫', label: 'SMK Tengku Idris', dy: 60},
  {k: 'Hospital Kapar', icon: '🏥', label: 'Hospital Kapar', dy: 130},
];
const TOWNS = ['Pekan Kapar', 'Klang', 'Setia Alam', 'Shah Alam'];
// which highway refs to label, and the display text
// [ref, label, target point in metres: shield goes on the route vertex nearest to it]
const HW_SHIELDS: [string, string, [number, number]][] = [
  ['E32', 'WCE', [7500, -2000]],
  ['E1', 'NKVE', [24000, 2800]],
  ['FT2', 'Federal', [17500, 6500]],
];

export const KAPAR_MAP: MapConfig = {
  data: kaparData as unknown as MapData,
  close: CLOSE,
  wide: WIDE,
  facilities: FACILITIES,
  towns: TOWNS,
  nearTown: 'Pekan Kapar',
  shields: HW_SHIELDS,
  pinTitle: 'Projek Teres Tok Muda',
  pinSub: 'Jalan Benteng Kanan, Kapar',
};

export const MapReal: React.FC<{durationInFrames: number; cfg?: MapConfig}> = ({durationInFrames, cfg = KAPAR_MAP}) => {
  const {roads, land, places, hwLabels} = cfg.data;
  const [CLOSE, WIDE] = [cfg.close, cfg.wide];
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const z = interpolate(f, [44, 84], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  // interpolate zoom geometrically so the move feels like a real map zoom
  const vw = CLOSE[2] * Math.pow(WIDE[2] / CLOSE[2], z) * interpolate(f, [0, durationInFrames], [1.04, 1]);
  const cx = interpolate(z, [0, 1], [CLOSE[0], WIDE[0]]);
  const cy = interpolate(z, [0, 1], [CLOSE[1], WIDE[1]]);
  const vh = (vw * H) / W;
  const k = W / vw; // px per metre
  const toPx = ([x, y]: [number, number]) => [(x - (cx - vw / 2)) * k, (y - (cy - vh / 2)) * k] as const;

  const drop = spring({frame: f - 2, fps, config: {damping: 9, stiffness: 170, mass: 0.7}});
  const pulse = ((f - 10) % 30) / 30;
  const [px, py] = toPx(places['Projek']);
  const facO = (i: number) => interpolate(f, [12 + i * 4, 20 + i * 4], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) * interpolate(z, [0.25, 0.6], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const wideO = interpolate(z, [0.55, 0.95], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const hwGlow = interpolate(z, [0.4, 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const sw = (closePx: number, widePx: number) => interpolate(z, [0, 1], [closePx, widePx]);

  const line = (d: string, stroke: string, width: number, key: string) => (
    <path key={key} d={d} stroke={stroke} strokeWidth={width} fill="none" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
  );

  return (
    <AbsoluteFill style={{background: STYLE.sea, overflow: 'hidden'}}>
      <svg width={W} height={H} viewBox={`${cx - vw / 2} ${cy - vh / 2} ${vw} ${vh}`} style={{position: 'absolute', inset: 0}}>
        {land.map((d, i) => (
          <path key={`l${i}`} d={d} fill={STYLE.land} />
        ))}
        {roads.river.map((d, i) => line(d, STYLE.river, sw(10, 5), `r${i}`))}
        {roads.secondary.map((d, i) => line(d, STYLE.secondary, sw(12, 3), `s${i}`))}
        {roads.primary.map((d, i) => line(d, STYLE.primaryCase, sw(17, 5), `pc${i}`))}
        {roads.primary.map((d, i) => line(d, STYLE.primary, sw(13, 3.5), `p${i}`))}
        {roads.trunk.map((d, i) => line(d, STYLE.trunkCase, sw(20, 8), `tc${i}`))}
        {roads.trunk.map((d, i) => line(d, STYLE.trunk, sw(15, 5.5), `t${i}`))}
        {roads.motorway.map((d, i) => line(d, STYLE.motorwayCase, sw(22, 9 + hwGlow * 4), `mc${i}`))}
        {roads.motorway.map((d, i) => line(d, STYLE.motorway, sw(16, 6 + hwGlow * 3), `m${i}`))}
      </svg>

      {/* towns (regional view) */}
      {cfg.towns.map((t) => {
        const [x, y] = toPx(places[t]);
        const o = t === cfg.nearTown ? 1 : wideO;
        return (
          <div key={t} style={{position: 'absolute', left: x, top: y + (t === cfg.nearTown ? -20 : 0), transform: 'translate(-50%,-50%)', opacity: o, fontFamily: 'DM Sans', fontWeight: 700, fontSize: t === cfg.nearTown ? 30 : 38, color: STYLE.ink, WebkitTextStroke: `7px ${STYLE.land}`, paintOrder: 'stroke fill', whiteSpace: 'nowrap'}}>
            {t}
          </div>
        );
      })}

      {/* highway shields */}
      {cfg.shields.map(([ref, text, target]) => {
        const pts = hwLabels[ref];
        if (!pts || !pts.length) return null;
        const best = pts.reduce((a, b) => (Math.hypot(b[0] - target[0], b[1] - target[1]) < Math.hypot(a[0] - target[0], a[1] - target[1]) ? b : a));
        const [x, y] = toPx(best);
        return (
          <div key={ref} style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${0.6 + hwGlow * 0.4})`, opacity: hwGlow, background: '#1E8E3E', color: '#fff', fontFamily: 'DM Sans', fontWeight: 700, fontSize: 30, padding: '5px 14px 7px', borderRadius: 8, border: '3px solid #fff', boxShadow: '0 3px 10px rgba(0,0,0,.25)'}}>
            {text}
          </div>
        );
      })}

      {/* facilities (close view) */}
      {cfg.facilities.map((p, i) => {
        if (!places[p.k]) return null;
        const [x, y] = toPx(places[p.k]);
        return (
          <div key={p.k} style={{position: 'absolute', left: x, top: y + p.dy, display: 'flex', alignItems: 'center', gap: 8, transform: 'translate(-22px,-50%)', opacity: facO(i)}}>
            <div style={{width: 44, height: 44, borderRadius: 22, background: '#5E7FA8', fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid #fff', boxShadow: '0 2px 6px rgba(0,0,0,.25)'}}>{p.icon}</div>
            <div style={{fontFamily: 'DM Sans', fontWeight: 700, fontSize: 26, color: '#3C4043', WebkitTextStroke: `6px ${STYLE.land}`, paintOrder: 'stroke fill', whiteSpace: 'nowrap'}}>{p.label}{p.sub ? <span style={{color: '#1A73E8'}}> · {p.sub}</span> : null}</div>
          </div>
        );
      })}

      {/* pin */}
      {f > 10 ? <div style={{position: 'absolute', left: px - 60, top: py - 20, width: 120, height: 40, borderRadius: '50%', border: `4px solid ${STYLE.pin}`, opacity: 1 - pulse, transform: `scale(${0.4 + pulse * 1.4})`}} /> : null}
      <svg width={84} height={113} viewBox="0 0 46 62" style={{position: 'absolute', left: px - 42, top: py - 110, transform: `translateY(${(1 - drop) * -260}px)`, opacity: Math.min(1, drop * 3), filter: 'drop-shadow(0 6px 6px rgba(0,0,0,.3))'}}>
        <path d="M23 0C10.3 0 0 10.3 0 23c0 17.2 23 39 23 39s23-21.8 23-39C46 10.3 35.7 0 23 0z" fill={STYLE.pin} />
        <circle cx="23" cy="23" r="9" fill="#A50E0E" />
      </svg>
      <div style={{position: 'absolute', left: px, top: py - 130, transform: `translate(-50%,-100%) scale(${spring({frame: f - 10, fps, config: {damping: 14}})})`, transformOrigin: '50% 100%', opacity: interpolate(z, [0.15, 0.45], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), background: '#fff', borderRadius: 18, padding: '12px 22px 14px', boxShadow: '0 8px 24px rgba(0,0,0,.2)', whiteSpace: 'nowrap'}}>
        <div style={{fontFamily: 'DM Sans', fontWeight: 700, fontSize: 30, color: STYLE.ink}}>{cfg.pinTitle}</div>
        <div style={{fontFamily: 'DM Sans', fontWeight: 500, fontSize: 22, color: STYLE.sub}}>{cfg.pinSub}</div>
      </div>

      <div style={{position: 'absolute', top: 1200, left: 120, fontFamily: 'DM Sans', fontWeight: 600, fontSize: 26, color: STYLE.sub, background: 'rgba(241,243,244,.85)', padding: '4px 10px', borderRadius: 6}}>Data peta © OpenStreetMap contributors</div>
    </AbsoluteFill>
  );
};
