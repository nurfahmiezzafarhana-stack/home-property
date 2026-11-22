# Template Video TikTok Hartanah

Dibina dengan **Remotion** (Design A–D) dan **Hyperframes** (Design A). Format TikTok 1080×1920, ~30 s.

## Guna semula untuk listing baru

1. **Gambar:** letak dalam `remotion/public/photos/` (portrait atau landscape, JPG).
2. **Info + skrip:** edit `remotion/src/data.ts`
   - `listing`: harga, nama projek, bandar, telefon, nama ejen, specs, perks
   - `scenes`: urutan gambar, durasi, gerakan kamera, label bilik dan caption
   - Beat `location` (peta): tukar nama lebuh raya dalam `remotion/src/components/MapScene.tsx`
3. **Preview:**
   ```bash
   cd remotion && npm i
   npm run studio            # preview interaktif dalam browser
   npm run stills            # contact sheet dalam preview/
   ```
4. **Render final:**
   ```bash
   npm run render:c          # Sage Minimal
   npm run render:d          # Noir Gold (luxury)
   ```
   Output masuk ke `remotion/out/`.

## Design
| ID | Nama | Gaya |
|---|---|---|
| DesignA-Luxe | Luxe Serif | Ikut video rujukan: harga serif, caption kuning, CTA bar kuning |
| DesignB-Pop | Bold Pop | Sticker, zoom-punch, caption pill pink |
| DesignC-Minimal | Sage Minimal | Editorial, sage green, kad listing bersih |
| DesignD-NoirGold | Noir Gold | Sinematik, gelap + champagne gold, bingkai emas |

## Nota
- Muzik dimatikan (`USE_MUSIC = false` dalam `data.ts`). Trending sound ditambah dalam app TikTok.
- SFX dalam `remotion/public/sfx/` ialah placeholder yang dijana sendiri. Boleh ganti dengan fail sendiri (nama sama).
- Hyperframes: `cd hyperframes && node --experimental-strip-types build.mts && npx hyperframes preview`
- Analisis video rujukan dan transkrip ada dalam `reference/` dan `EDIT_PLAN.md`.
