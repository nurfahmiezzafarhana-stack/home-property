# Edit Plan — TikTok Property Tour (PREVIEW stage, belum final render)

## 1. Analisis video rujukan (vt.tiktok.com/ZSseffuHH)

Banglo RM3.8 juta, Kampung Tunku PJ. 155 s, 720×1280, 30 fps. Transkrip penuh ada dalam
`reference/reference-transcript.txt` (Whisper, Bahasa Melayu, word timestamps dalam `.json`).
Saya scan setiap 0.5 s untuk keseluruhan video. Bahagian beranimasi saya scan **frame by frame (30 fps)**:

| Komponen | Masa (ref) | Apa yang berlaku setiap frame |
|---|---|---|
| **Hook harga** | 0:00.0–0:00.7 | f0–f5 bersih, tiada teks. f6–f20: "RM3,800,000" serif putih turun dari atas (~90 px) dengan blur → tajam, drop shadow. Lepas itu kekal statik sampai 0:06.7 |
| **Lokasi** | 0:00.5–0:01.5 | "KAMPUNG TUNKU / PETALING JAYA" serif, emas bergradient, muncul kiri→kanan dengan partikel sparkle |
| **Caption** | sepanjang video | Montserrat Black, HURUF BESAR, putih + stroke hitam tebal, 2–3 perkataan sekad, 1–2 baris, ~60% tinggi skrin. **Hard cut**, tiada pop. Perkataan yang sedang disebut jadi **kuning** dan berubah tepat ikut perkataan (cth "RUMAH" kuning f9–f18, "NI" f19–f23, "BERKONSEPKAN" f24+) |
| **Potongan** | 23 cut | Semua hard cut, tiada transition. Drone (udara) diselang dengan walkthrough gimbal |
| **CTA** | 2:30.3–2:31.6 | f9: bar kuning mula dari tengah. f9–f24: bar melebar (scaleX), condong −3°. f14–f30: nama "SHAHMI HAZIM" muncul dengan sparkle. f30+: nombor telefon ditaip **satu digit setiap ~2 frame**. Doodle "burst" 3 garisan di kiri dan kanan bar |

**Struktur:** Hook (harga + lokasi, 0–6 s) → "Jom kita tengok" → aerial + spec (sqft) → masuk rumah →
bilik demi bilik → CTA nombor telefon.

### Apa yang patut dibuang dalam rujukan (repetitive / awkward)
- "Rumah ni memang sangat cantik… rumah ni memang sangat moden dan luas" (0:24–0:29): idea yang sama diulang 2×
- "Sangat cantik" diulang ±10× sepanjang video
- Filler: "Okey, so…", "Haa…", "Alright", "Jom, okey dekat bahagian atas ni…", "kita ada lagi 6 bilik" (diulang dua kali di 0:71–0:77)
- Jeda 0:06.7–0:09.3 (drone tanpa suara, ~2.6 s)
- 155 s terlalu panjang untuk TikTok. Versi kita **28.8 s**, satu beat setiap ~2 s

## 2. Bahan anda: 13 gambar (tiada video/suara)

Tiada audio pada gambar, jadi saya **tulis skrip VO** gaya rujukan. Skrip yang sama digunakan untuk caption.
Kalau anda rakam suara nanti, saya boleh transcribe dan timing semula caption ikut suara sebenar.

**Dibuang (repetitive):** `tv-room.jpg`. Bilik yang sama dengan `flexi-room.jpg` (kipas kayu, langsir, lantai jubin sama).
**Digabung:** 2 bilik air dalam 1 beat split-screen (atas/bawah).
Nota: beberapa gambar nampak dari unit berbeza (meja makan kayu vs marble, kepala paip dapur hitam vs emas).
Kalau ini listing untuk satu unit, sila sahkan.

## 3. Storyboard (sama untuk ketiga-tiga design)

| # | Masa | Gambar | Gerakan | Label | Caption / VO |
|---|---|---|---|---|---|
| 1 | 0.0–3.2 | living-hero | push-in | — | **HOOK** (lihat design) |
| 2 | 3.2–5.4 | living-tv | pan kiri | Ruang Tamu | Ruang tamu luas dan terang |
| 3 | 5.4–7.4 | living-sofa | pan kanan | Ruang Makan | Siap ada ruang makan family |
| 4 | 7.4–9.8 | kitchen-galley | "walk" ke depan | Dapur | Dapur full built-in kabinet |
| 5 | 9.8–11.8 | kitchen-u | push-in | — | Lengkap oven, hob dan hood |
| 6 | 11.8–13.6 | corridor | "walk" | — | Jom tengok bilik pula |
| 7 | 13.6–15.8 | bedroom-main | pull-out | Bilik Utama | Bilik utama muat katil queen |
| 8 | 15.8–17.8 | bedroom-2 | push-in | Bilik 2 | Bilik kedua ada sudut study |
| 9 | 17.8–19.8 | flexi-room | pan kiri | Bilik 3 | Bilik ketiga boleh buat santai |
| 10 | 19.8–22.2 | bath-brown + bath-green | split, bawah slide masuk | 2 Bilik Air | Dua bilik air siap shower |
| 11 | 22.2–24.2 | laundry | pan kanan | Laundry | Ruang laundry pun lapang |
| 12 | 24.2–28.8 | living-hero | pull-out | — | **CTA** harga + no. telefon |

## 4. Sound FX (lokasi)

| Bila | SFX | Kenapa |
|---|---|---|
| 0.2 s | impact (bass hit) | harga muncul, untuk hook |
| 0.45 s | shimmer | sparkle lokasi (A) |
| setiap cut −0.1 s | whoosh (A/C lembut, B kuat) | potongan |
| label muncul | pop (B) | sticker |
| bilik air +0.33 s | shutter | split-screen masuk |
| CTA −1.2 s | riser | bina tension ke CTA |
| CTA | pop + shimmer, **klik setiap digit**, ding di hujung | typewriter nombor telefon (ikut rujukan) |
| sepanjang | music bed placeholder | **tukar ke trending sound dalam app TikTok** |

SFX ini saya jana sendiri (ffmpeg) sebagai placeholder. Boleh tukar ke SFX library anda dalam `remotion/public/sfx/`.

## 5. Tiga design untuk dipilih

- **A — Luxe Serif (paling dekat dengan rujukan):** harga serif turun dengan blur, lokasi emas bersparkle,
  caption Montserrat kuning ikut perkataan, label italik dengan garis emas, CTA bar kuning dengan nombor ditaip.
  Ada dalam **Remotion** dan **Hyperframes**.
- **B — Bold Pop:** hook "POV: Jumpa rumah SIAP RENOVATE, tinggal bawa beg je" dengan slam + skrin bergegar,
  zoom-punch + flash setiap cut, label sticker kuning, caption pill pink, CTA kad hitam "CALL / WHATSAPP".
  Paling bertenaga, sesuai untuk audiens muda / first-time buyer.
- **C — Sage Minimal:** ikut warna dinding sage unit ini. Hook "Tak perlu renovate lagi." serif,
  wipe menegak, label bernombor, caption pill frosted, CTA kad listing bersih. Nampak premium.

## 6. PLACEHOLDER yang perlu diisi (dalam `remotion/src/data.ts`)

`price` (RM XXX,XXX), `area` ([KAWASAN]), `city` ([BANDAR]), `phone` (01X XXX XXXX), `agent` ([NAMA EJEN]),
`specs` (3 Bilik • 2 Bilik Air • Fully Renovated: sila sahkan). Caption juga perlu disemak:
"muat katil queen" dan "lengkap oven" saya tulis berdasarkan apa yang nampak dalam gambar.

## 7. Cara preview / render

```bash
# Remotion (3 design)
cd remotion && npm i && npm run studio          # preview interaktif
npm run stills                                  # contact sheet -> preview/
npm run render:a   # FINAL. Jalankan selepas design dipilih dan placeholder diisi

# Hyperframes (Design A)
cd hyperframes && node --experimental-strip-types build.mts   # jana index.html dari data.ts
npx hyperframes preview                          # Studio
npx hyperframes check                            # lint + safe-zone + contrast
```
