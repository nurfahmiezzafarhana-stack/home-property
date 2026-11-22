// ============================================================
//  SINGLE SOURCE OF TRUTH — edit listing info + script here.
//  Fields in [BRACKETS] / "XXX" are PLACEHOLDERS: replace them
//  with real listing details before the final render.
// ============================================================

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const listing = {
  price: 'RM350,000',
  area: 'Pangsapuri Harmoni Elmina 1',
  city: 'City of Elmina, Shah Alam',
  phone: '01X XXX XXXX', // [NO. TELEFON] — belum diberi
  agent: '[NAMA EJEN]', // belum diberi
  specs: ['1,000 sqft', '3 Bilik', '2 Bilik Air', '2 Parking', 'Freehold'],
  extras: ['Partial furnished + aircond', 'Akses DASH, GCE & LATAR'],
  perks: ['Loan bank & lawyer boleh dibantu', 'First home buyer dialu-alukan'],
};

export type Move = 'push-in' | 'pull-out' | 'pan-left' | 'pan-right' | 'walk';

export type Scene = {
  id: string;
  photo: string; // file in public/photos
  photo2?: string; // optional second photo -> split screen
  dur: number; // seconds
  move: Move;
  label?: string; // room label chip
  caption: string; // burned-in caption / VO line ('' = none)
  highlight?: string[]; // words forced to accent colour
};

// Tour order follows the reference: hook -> living -> kitchen -> corridor
// -> rooms -> bathrooms -> utility -> CTA.  Hard cuts with motion on
// every shot, new beat every ~2 s.
// DROPPED as repetitive: tv-room.jpg (same room as flexi-room.jpg).
export const scenes: Scene[] = [
  {id: 'hook', photo: 'living-hero.jpg', dur: 3.2, move: 'push-in', caption: ''},
  {id: 'living', photo: 'living-tv.jpg', dur: 2.2, move: 'pan-left', label: 'Ruang Tamu', caption: 'Ruang tamu luas siap aircond'},
  {id: 'dining', photo: 'living-sofa.jpg', dur: 2.0, move: 'pan-right', label: 'Ruang Makan', caption: 'Partial furnished, terus boleh masuk'},
  {id: 'kitchen', photo: 'kitchen-galley.jpg', dur: 2.4, move: 'walk', label: 'Dapur', caption: 'Dapur cantik dah siap renovate'},
  {id: 'kitchen2', photo: 'kitchen-u.jpg', dur: 2.0, move: 'push-in', caption: 'Kemas dan dijaga dengan baik'},
  {id: 'corridor', photo: 'corridor.jpg', dur: 1.8, move: 'walk', caption: 'Jom tengok bilik pula'},
  {id: 'bed1', photo: 'bedroom-main.jpg', dur: 2.2, move: 'pull-out', label: 'Bilik Utama', caption: 'Bilik utama luas dan terang'},
  {id: 'bed2', photo: 'bedroom-2.jpg', dur: 2.0, move: 'push-in', label: 'Bilik 2', caption: 'Bilik kedua sesuai untuk anak'},
  {id: 'flexi', photo: 'flexi-room.jpg', dur: 2.0, move: 'pan-left', label: 'Bilik 3', caption: 'Bilik ketiga boleh buat santai'},
  {id: 'bath', photo: 'bath-brown.jpg', photo2: 'bath-green.jpg', dur: 2.4, move: 'push-in', label: '2 Bilik Air', caption: 'Dua bilik air siap shower'},
  {id: 'laundry', photo: 'laundry.jpg', dur: 2.0, move: 'pan-right', label: 'Laundry', caption: 'Ruang laundry pun lapang'},
  // CTA line is drawn by each design's CTA card (VO: "Nak tengok sendiri? Call saya sekarang.")
  {id: 'cta', photo: 'living-hero.jpg', dur: 4.6, move: 'pull-out', caption: ''},
];

export const sceneStarts = (): number[] => {
  const out: number[] = [];
  let t = 0;
  for (const s of scenes) {
    out.push(t);
    t += s.dur;
  }
  return out;
};

export const TOTAL_SEC = scenes.reduce((a, s) => a + s.dur, 0);
export const TOTAL_FRAMES = Math.round(TOTAL_SEC * FPS);

// Hook copy per design (strong first-second hooks)
export const hooks = {
  A: {kicker: listing.area, title: listing.price, sub: listing.city, vo: `Rumah siap renovate, harga ${listing.price} je dekat ${listing.city}. Jom tengok!`},
  B: {line1: 'POV:', line2: 'Jumpa rumah', line3: 'SIAP RENOVATE', line4: 'tinggal bawa beg je 🧳'},
  C: {eyebrow: 'Untuk Dijual · Elmina', title: 'Tak perlu\nrenovate\nlagi.', price: listing.price},
};

// ---- caption chunking (TikTok style: 2–3 words per card, word-by-word highlight)
export type Word = {text: string; start: number; end: number; accent: boolean};
export type Chunk = {words: Word[]; start: number; end: number};

export const buildChunks = (): Chunk[] => {
  const starts = sceneStarts();
  const chunks: Chunk[] = [];
  scenes.forEach((s, i) => {
    if (!s.caption) return;
    const tokens = s.caption.split(' ');
    const lead = 0.12;
    const usable = s.dur - lead - 0.1;
    const per = usable / tokens.length;
    const words: Word[] = tokens.map((t, k) => ({
      text: t,
      start: starts[i] + lead + k * per,
      end: starts[i] + lead + (k + 1) * per,
      accent: (s.highlight ?? []).includes(t),
    }));
    // 3 words per card, 2 if a single word would be left over
    let k = 0;
    while (k < words.length) {
      const remaining = words.length - k;
      const size = remaining === 4 ? 2 : Math.min(3, remaining);
      const w = words.slice(k, k + size);
      chunks.push({words: w, start: w[0].start, end: w[w.length - 1].end});
      k += size;
    }
  });
  return chunks;
};
