// ============================================================
//  Projek Teres 1-Tingkat — Tok Muda, Kapar
//  SINGLE SOURCE OF TRUTH for the Kapar designs (K1, K2, K3).
// ============================================================

export const project = {
  status: 'Dibuka Untuk Pendaftaran',
  type: 'Rumah Teres 1-Tingkat',
  address: 'Jalan Benteng Kanan, Tok Muda, Kapar',
  area: 'Tok Muda, Kapar',
  distance: '5km dari Pekan Kapar',
  priceFrom: 'RM346,500',
  booking: 'RM500',
  pkg: [
    'Booking RM500 sahaja',
    'Rebate 10%',
    'Free SPA + disbursement + stamp duty',
    'Free loan legal fee + stamp duty + disbursement',
    'Free MOT',
  ],
  specs: [
    {k: 'Pegangan', v: 'Freehold · Rizab Melayu'},
    {k: 'Saiz Tanah', v: "1,280 sqft (20' x 64')"},
    {k: 'Saiz Binaan', v: "820 sqft (20' x 41')"},
    {k: 'Bilik', v: '4 Bilik Tidur · 2 Bilik Air'},
    {k: 'Siap', v: 'Dijangka Q1 2029'},
  ],
  facilities: ['Masjid Al-Ehsan', 'SRA & SK Tok Muda', 'SMK Tengku Idris', 'Klinik Kesihatan', 'Stesen ECRL Kapar', 'Hospital Kapar', '99 Speedmart'],
  access: ['WCE', 'NKVE', 'Federal Highway', 'Shah Alam', 'Setia Alam'],
  phone: '011-6364 8721',
  agent: 'Farhana',
};

// Beat grid: 120 BPM (0.5 s). Every cut lands on a beat so a trending sound
// added in the TikTok app lines up with the edit.
export const BEAT = 0.5;

import {vo} from './vo.ts';

export type Base = {id: string; dur: number; vo?: string; span?: number};
export type Shot = Base &
  (
    | {kind: 'video'; src: 'drone1' | 'drone2'; from: number; rate: number; rot?: [number, number]; zoom?: [number, number]; x?: [number, number]}
    | {kind: 'image'; img?: string; zoom?: [number, number]; x?: [number, number]; y?: [number, number]}
    | {kind: 'map'}
  );

// Voiceover: each line starts VO_LEAD s into its scene; scenes are sized to fit
// their line (+ tail). `span` = the overlay/VO continues over the next N shots.
export const VO_LEAD = 0.15;
const fit = (line: string, tail = 0.35) => Math.ceil((vo[line].dur + VO_LEAD + tail) * 10) / 10;

// Storyboard (~37 s with VO). Source footage: drone1 = slow orbit of the site,
// drone2 = slow forward push along the site, render.jpg = finished house.
// No source range is used twice: drone2 0–10 s (hook) / 10–15.5 s (specs),
// drone1 0–9.6 s (orbit) / 10–14.5 s (specs, 2nd half).
export const shots: Shot[] = [
  // HOOK — overhead "twist" like the reference opener (rotating + sped up)
  {id: 'hook', kind: 'video', src: 'drone2', from: 0.0, rate: 2.0, dur: fit('hook'), vo: 'hook', rot: [0, -14], zoom: [1.7, 1.5], x: [50, 50]},
  // REVEAL — transformation: land -> finished house (whip + flare)
  {id: 'reveal', kind: 'image', dur: fit('reveal'), vo: 'reveal', zoom: [1.0, 1.1], x: [30, 40]},
  // LOCATION — orbit of the site, sped up
  {id: 'orbit', kind: 'video', src: 'drone1', from: 0.0, rate: 3.0, dur: fit('orbit'), vo: 'orbit', zoom: [1.0, 1.12], x: [40, 60]},
  // PACKAGE — two crops of the render (left porch, right row) under one list
  {id: 'package', kind: 'image', dur: 4.2, vo: 'package', span: 1, zoom: [1.35, 1.45], x: [8, 38]},
  {id: 'package2', kind: 'image', dur: Math.max(3.0, fit('package') - 4.2), zoom: [1.25, 1.35], x: [70, 92]},
  // SPECS — forward drone push, then the orbit's second half
  {id: 'specs', kind: 'video', src: 'drone2', from: 10.0, rate: 1.2, dur: 4.6, vo: 'specs', span: 1, zoom: [1.0, 1.12], x: [50, 50]},
  {id: 'specs2', kind: 'video', src: 'drone1', from: 10.0, rate: 1.0, dur: Math.max(3.0, fit('specs') - 4.6), zoom: [1.05, 1.15], x: [55, 45]},
  // MAP — facilities & highways (no VO line: SFX only)
  {id: 'map', kind: 'map', dur: 3.5},
  // CTA — render, wide
  {id: 'cta', kind: 'image', dur: Math.max(6.0, fit('cta', 0.9)), vo: 'cta', zoom: [1.12, 1.0], x: [28, 28]},
];

// Seconds (relative to the scene start) at which VO word `i` of `line` begins
export const cue = (line: string, i: number) => VO_LEAD + vo[line].words[Math.min(i, vo[line].words.length - 1)].start;

export const starts = () => {
  const out: number[] = [];
  let t = 0;
  for (const s of shots) {
    out.push(t);
    t += s.dur;
  }
  return out;
};
export const startOf = (id: string) => starts()[shots.findIndex((s) => s.id === id)];
export const TOTAL = Math.round(shots.reduce((a, s) => a + s.dur, 0) * 30) / 30;
// Overlay span (seconds) for a scene whose overlay continues over `span` shots
export const spanDur = (id: string) => {
  const i = shots.findIndex((s) => s.id === id);
  return shots.slice(i, i + 1 + (shots[i].span ?? 0)).reduce((a, s) => a + s.dur, 0);
};
// Global caption words (karaoke)
export const voWords = () =>
  shots.flatMap((s) => (s.vo ? vo[s.vo].words.map((w) => ({...w, start: startOf(s.id) + VO_LEAD + w.start, end: startOf(s.id) + VO_LEAD + w.end})) : []));
