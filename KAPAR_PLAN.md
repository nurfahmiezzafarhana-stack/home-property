# Projek Teres 1-Tingkat Tok Muda, Kapar — Edit Plan (PREVIEW)

## Analisis rujukan (pin.it/1G9vuK5kV, 63 s, 720×1280)
"Cinematic Walkthrough": **tiada teks langsung**, cut ikut beat muzik setiap ~1 s (46 cut).
Komponen yang dianalisis frame by frame (30 fps):

| Masa | Komponen | Apa berlaku |
|---|---|---|
| 0.00–1.60 | Hook drone | Top-down, kamera **berpusing** laju, speed ramp, micro-cut setiap ~0.4 s |
| 1.6–9.3 | Drone establish | Orbit / tilt atas kawasan, cut pada beat |
| 9.27 | Cut | Hard cut tepat atas beat |
| 10.0–10.5 | **Whip pan** | Gerakan laju dengan motion blur dan **lens flare / light leak** (10.37–10.47) masuk ke porch |
| 11.71 | **Match cut** | Pintu tertutup → pintu terbuka, framing sama |
| 12.3–12.9 | Push-in | Kamera laju menembusi pintu (speed ramp) |
| 13–63 | Walkthrough | Bilik demi bilik, ~1 s setiap shot, outro drone belakang rumah |

## Bahan anda
- `drone1` (20 s, senyap): orbit perlahan keliling tapak.
- `drone2` (20 s): terbang ke depan menyusuri tapak. **Audio = lagu berhak cipta** ("I'm the king of my homeland…"), **bukan suara**: tiada skrip untuk ditranscribe, jadi audio dibuang.
- `render.jpg`: rumah siap (3D render).

**Buang yang berulang:** kedua-dua drone sangat perlahan dan berulang (20 s pergerakan sama), jadi
dipercepat 1.6–3× dan cuma bahagian terbaik diambil. Tiada jeda janggal (tiada suara).

## Storyboard (23.5 s, grid beat 120 BPM / 0.5 s) — design dipilih: **K1 Cinematic**
| # | Masa | Shot | Teknik (dari rujukan) | Teks |
|---|---|---|---|---|
| 1 | 0.0–2.0 | drone2 2.5× | **berpusing −14° + speed ramp** | HOOK: "Booking RM500 je, dapat rumah teres freehold?" |
| 2 | 2.0–4.5 | render | **whip + lens flare** (tanah → rumah siap) | Rumah Teres 1-Tingkat · Dibuka untuk pendaftaran |
| 3 | 4.5–6.5 | drone1 3× | orbit dipercepat | Tok Muda, Kapar · 5km dari Pekan Kapar |
| 4 | 6.5–10.5 | render pan | pan merentas deretan rumah | Pakej: 5 tick, satu setiap beat |
| 5 | 10.5–14.0 | drone2 1.6× | push ke depan | Spesifikasi: 5 baris, satu setiap beat |
| 6 | 14.0–17.5 | **peta sebenar** | pin jatuh, zoom keluar macam app peta | Kemudahan dekat → WCE / NKVE / Federal, Klang, Setia Alam, Shah Alam |
| 7 | 17.5–23.5 | render | whip + flare | Harga dari RM346,500 · Booking RM500 · WhatsApp |

## SFX
impact (hook, CTA) · whoosh setiap cut · shimmer masa reveal · pop setiap tick pakej · klik setiap baris spec ·
pop pin peta · riser sebelum CTA · ding di hujung. Muzik: trending sound ditambah dalam app TikTok.

## 3 design
- **K1 Cinematic:** paling dekat rujukan. Whip + flare, teks putih bersih Montserrat, aksen emas lembut.
- **K2 Promo Bold:** gaya promo pelancaran. Sticker kuning/merah, "RM500" slam + gegar, tick hijau, starburst harga.
- **K3 Luxe Gold:** keluarga Noir Gold. Film grade, bingkai emas, serif, peta gelap.

## Peta (geografi sebenar)
Data: **OpenStreetMap** (© OpenStreetMap contributors, ODbL — kredit dipaparkan dalam video).
- Lokasi projek, Pekan Kapar, SK Tok Muda, SMK Tengku Idris Shah, Klinik Kesihatan Kapar, Hospital Kapar (dalam pembinaan): koordinat dari Nominatim.
- Lebuh raya (WCE E32, NKVE E1, Federal FT2, Jalan Kapar FT5, KESAS/E5) dan jalan utama: dari OpenStreetMap; segmen disambung ikut urutan geografi.
- Garis pantai: `@geo-maps/earth-lands-10m` (terbitan OpenStreetMap, ketepatan ~1 km, hanya nampak dalam zoom luas).
- Tiada dalam OpenStreetMap, jadi tidak dipin: Masjid Al-Ehsan, Klinik Kesihatan Tok Muda, Stesen ECRL Kapar, Sek Men Islam Hira'.
- Data mentah: `remotion/scripts/osm-data/`; janakan semula `remotion/src/kapar/mapData.ts` dengan `scripts/osm-to-map.py`.

## Hyperframes
`hyperframes-kapar/` — K1 dijana dari `remotion/src/kapar/{data,mapData}.ts` oleh `build.mts`. `hyperframes check`: 0 error.

## Perlu disahkan
- No. telefon & nama ejen: **011-6364 8721 / Farhana** (disahkan).
- Rizab Melayu: ditulis seperti dalam info.

## Voiceover (v3)
Skrip (dikemas dari teks yang diberi; captions ikut ayat ini):
1. Hook — "Okey, kalau korang tengah cari rumah area Kapar, boleh tengok yang ni."
2. Reveal — "Projek baru dekat Tok Muda, Kapar."
3. Orbit — "Lebih kurang 5km dari Pekan Kapar."
4. Pakej — "Booking bermula RM500, dan ada pakej rebate serta beberapa legal fees yang ditanggung oleh pemaju, tertakluk pada terma semasa."
5. Spesifikasi — "Rumah ni hak milik kekal, Rizab Melayu, saiz tanah 20 x 64, ada 4 bilik tidur dan 2 bilik air."
6. (Peta — tiada VO, SFX sahaja)
7. CTA — "Kalau nak tengok full details, kelayakan dan kira anggaran, boleh DM atau komen “nak”."

Suara: **AI sementara** (Meta MMS-TTS Bahasa Melayu `facebook/mms-tts-zlm`, lesen CC-BY-NC 4.0 — untuk preview;
ganti dengan rakaman sendiri untuk post komersial). Jana semula: `HF_HUB_DISABLE_XET=1 python3 -I remotion/scripts/gen-vo.py`.
Setiap babak dipanjangkan ikut ayatnya (video 38.1 s). Item pakej & spesifikasi muncul tepat bila disebut.

## Projek Meru (Jalan Nenas, Meru, Klang) — `remotion/src/meru/`
Gaya K1 Cinematic, 33.9 s, tiada voiceover (teks + SFX). Gambar: render (resolusi rendah 1225×772 — zoom dihadkan),
luar rumah, ruang tamu/dapur, koridor, bilik air. Peta OpenStreetMap berpusat di Jalan Nenas, Taman Meru Impian 2
(dipilih kerana jarak ke Klinik Kesihatan Meru / SMK Meru / Hospital Kapar sepadan dengan senarai).
CTA: nombor telefon + nama sahaja (tiada teks WhatsApp) — juga dikemas kini untuk Kapar K1.
