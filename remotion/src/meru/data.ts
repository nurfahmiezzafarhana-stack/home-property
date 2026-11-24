// ============================================================
//  Projek Teres & Berkembar 1-Tingkat — Jalan Nenas, Meru, Klang
//  SINGLE SOURCE OF TRUTH for the Meru video (K1 Cinematic style).
// ============================================================
import type {Shot} from '../kapar/data.ts';

export const project = {
  status: 'Projek Perumahan Baru',
  type: 'Rumah Teres & Berkembar 1-Tingkat',
  address: 'Jalan Nenas, Meru, Klang',
  hookLine: '5 minit ke Hospital Kapar',
  priceFrom: 'RM441,720',
  booking: 'RM1,000',
  pkg: ['Booking RM1,000 sahaja', 'FREE SPA Legal Fee', 'FREE MOT Fee'],
  common: ['Freehold · Rezab Melayu', '4 Bilik Tidur · 2 Bilik Air', 'Dijangka siap Q3 2027'],
  types: [
    {name: 'Teres 1-Tingkat', land: "20' x 82' (1,740 sqft)", built: "20' x 47' (940 sqft)", price: 'RM441,720'},
    {name: 'Berkembar 1-Tingkat', land: "34' x 87' (2,958 sqft)", built: "24' x 47' (1,128 sqft)", price: 'RM516,420'},
  ],
  access: ['Meru – Puncak Alam', 'NKVE (exit Setia Alam)', 'Federal', 'WCE', 'Lebuhraya Selat Klang'],
  malls: ['Setia City Mall · 12 min', "Lotus's Setia Alam · 12 min", 'UiTM Puncak Alam · 20 min'],
  phone: '011-6364 8721',
  agent: 'Farhana',
};

// Storyboard (~34 s, no voiceover: on-screen text + SFX). Every photo is used
// once, except the render, which is cropped differently each time it returns
// (left houses / right houses / centre / tree-side) so no frame repeats.
export const shots: Shot[] = [
  {id: 'hook', kind: 'image', img: 'render.jpg', dur: 3.0, zoom: [1.0, 1.08], x: [8, 30]},
  {id: 'reveal', kind: 'image', img: 'render.jpg', dur: 2.5, zoom: [1.12, 1.04], x: [62, 82]},
  {id: 'exterior', kind: 'image', img: 'exterior.jpg', dur: 2.2, zoom: [1.0, 1.1], x: [75, 55]},
  {id: 'living', kind: 'image', img: 'living.jpg', dur: 2.4, zoom: [1.0, 1.08], x: [35, 60]},
  {id: 'hallway', kind: 'image', img: 'hallway.jpg', dur: 2.2, zoom: [1.0, 1.25], x: [32, 32]},
  {id: 'bath', kind: 'image', img: 'bath.jpg', dur: 2.0, zoom: [1.05, 1.15], x: [50, 50]},
  {id: 'package', kind: 'image', img: 'render.jpg', dur: 3.6, zoom: [1.0, 1.06], x: [45, 52]},
  {id: 'specs', kind: 'image', img: 'render.jpg', dur: 6.0, zoom: [1.0, 1.06], x: [90, 98]},
  {id: 'map', kind: 'map', dur: 4.0},
  {id: 'cta', kind: 'image', img: 'render.jpg', dur: 6.0, zoom: [1.12, 1.0], x: [20, 28]},
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
export const TOTAL = Math.round(shots.reduce((a, s) => a + s.dur, 0) * 30) / 30;
