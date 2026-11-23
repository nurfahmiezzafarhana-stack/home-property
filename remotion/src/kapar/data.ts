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
  // Contact carried over from the previous listing — confirm before final render
  phone: '011-6364 8721',
  agent: 'Farhana',
};

// Beat grid: 120 BPM (0.5 s). Every cut lands on a beat so a trending sound
// added in the TikTok app lines up with the edit.
export const BEAT = 0.5;

export type Shot =
  | {id: string; kind: 'video'; src: 'drone1' | 'drone2'; from: number; rate: number; dur: number; rot?: [number, number]; zoom?: [number, number]; x?: [number, number]}
  | {id: string; kind: 'image'; dur: number; zoom?: [number, number]; x?: [number, number]}
  | {id: string; kind: 'map'; dur: number};

// Storyboard (21.5 s). Source footage: drone1 = slow orbit of the site,
// drone2 = slow forward push along the site, render.jpg = finished house.
// Slow 20 s drone takes are sped up 2–3x (removes the dead, repetitive time).
export const shots: Shot[] = [
  // HOOK — overhead "twist" like the reference opener (rotating + speed-ramped)
  {id: 'hook', kind: 'video', src: 'drone2', from: 1.0, rate: 2.5, dur: 2.0, rot: [0, -14], zoom: [1.7, 1.5], x: [50, 50]},
  // REVEAL — transformation: land -> finished house (whip + flare)
  {id: 'reveal', kind: 'image', dur: 2.5, zoom: [1.0, 1.1], x: [30, 40]},
  // LOCATION — orbit of the site, sped up
  {id: 'orbit', kind: 'video', src: 'drone1', from: 0.0, rate: 3.0, dur: 2.0, zoom: [1.0, 1.12], x: [40, 60]},
  // PACKAGE — render, slow pan across the row of houses
  {id: 'package', kind: 'image', dur: 4.0, zoom: [1.15, 1.2], x: [15, 85]},
  // SPECS — forward drone push
  {id: 'specs', kind: 'video', src: 'drone2', from: 9.0, rate: 1.6, dur: 3.0, zoom: [1.0, 1.15], x: [50, 50]},
  // MAP — facilities & highways
  {id: 'map', kind: 'map', dur: 3.5},
  // CTA — render, wide
  {id: 'cta', kind: 'image', dur: 4.5, zoom: [1.12, 1.0], x: [28, 28]},
];

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
export const TOTAL = shots.reduce((a, s) => a + s.dur, 0);
