# Dakshina Rajya — Image Generation Prompt Pipeline

Use this pipeline with ChatGPT / Image Gen 2. Prefix every prompt with the **Style Base** and append the **Format Spec**. Add the **Negative Prompt** when the model supports it.

## Important: One Asset Per Prompt

**Image Gen 2 generates a single image per prompt.** To avoid getting everything mashed into one picture, run each prompt individually. Do not paste the entire list into one chat message and ask for all assets — the model will likely draw them all overlapping in one scene.

**Recommended workflow:**
1. Paste the **Style Base** once and ask it to confirm the style.
2. Then paste **one asset prompt at a time** and request: `"Generate this as a single isolated game asset."`
3. Download each image before moving to the next prompt.

**If you want to batch faster**, you can ask for a **sprite sheet / grid of variants** of the *same type* (e.g., 4 Palegadu portraits in one image with clear separation), but still keep one category per generation.

---

## Style Base (copy-paste before every prompt)

```
Ancient South Indian board game illustration, 5th century Andhra & Telangana aesthetic, 
rich parchment and bronze tones, hand-painted miniature meets clean vector art, 
flat colors, bold outlines, no gradients, no photorealism, no modern objects, 
no text, no letters, isolated asset on transparent background.
```

## Format Spec (append to every prompt)

```
Isolated game asset, centered, transparent background, 1:1 square aspect ratio, 
high resolution, crisp edges, ready for game UI use.
```

## Negative Prompt (use when supported)

```
photorealistic, 3D render, blurry, watermark, signature, modern clothing, 
English text, Telugu text, letters, numbers, complex background, shadow, 
photograph, gradient shading, low detail.
```

---

## How to phrase a single request

```
Generate one isolated game asset for Dakshina Rajya.

[Style Base]

[Asset Prompt]

[Format Spec]

Single asset only. No scene. No other objects. Transparent background.
```

---

## Batch / Sprite Sheet Option (same category only)

If your Go plan gives limited generations, you can ask for a **sprite sheet** of *one category* at a time. This still keeps assets separated within the image.

```
[Style Base]

Sprite sheet of 4 distinct Palegadu chieftain portraits for a South Indian board game, 
one per row, equal spacing, white background between portraits, no overlap, flat vector style, 
front-facing busts, distinct clothing and expressions.

No text. No letters. Transparent background preferred, otherwise pure white background.
```

```
[Style Base]

Sprite sheet of 8 Naadu banner icons, one per row, equal spacing, no overlap, 
flat vector, transparent background, distinct colors and symbols.

No text. No letters.
```

After downloading, use an image editor or Python script to slice the grid into individual PNG files.

---

```
Ancient South Indian board game illustration, 5th century Andhra & Telangana aesthetic, 
rich parchment and bronze tones, hand-painted miniature meets clean vector art, 
flat colors, bold outlines, no gradients, no photorealism, no modern objects, 
no text, no letters, isolated asset on transparent background.
```

## Format Spec (append to every prompt)

```
Isolated game asset, centered, transparent background, 1:1 square aspect ratio, 
high resolution, crisp edges, ready for game UI use.
```

## Negative Prompt (use when supported)

```
photorealistic, 3D render, blurry, watermark, signature, modern clothing, 
English text, Telugu text, letters, numbers, complex background, shadow, 
photograph, gradient shading, low detail.
```

---

## 1. Board & Map Assets

### Board Ring
```
Main game board: a square ring-shaped track with 40 spaces arranged around a large 
central title area, ornate South Indian temple border, parchment texture, Krishna 
and Godavari rivers hinted in corners, space for 40 small property tiles around the 
perimeter, top-down view, muted earth tones with bronze and saffron accents.
```
**Aspect ratio:** 1:1 (or 4:3 for print)

### Naadu Banners (generate 8)
```
Banner icon for the Naadu of [Karmaraashtra / Andhrapatha / Andhraka / Sriparvata / 
Kalinga Coast / Velanadu / Trikalinga / Sabbinadu], rectangular cloth banner with 
ancient South Indian emblem, stylized animal or symbol, [color], tassels, wooden pole, 
flat vector art.
```
**Colors to assign:** Karmaraashtra=brown, Andhrapatha=cyan, Andhraka=pink, Sriparvata=orange, Kalinga Coast=red, Velanadu=yellow, Trikalinga=green, Sabbinadu=dark blue.

### Corner Spaces
```
Royal Court space: golden throne under a stone mandapa, ceremonial umbrellas, 
Indrapalaura court, regal and welcoming mood.
```
```
Forest Exile space: dense Deccan forest, banyan trees, hermitage hut, contemplative 
and slightly ominous mood.
```
```
Dharma Sangha Festival space: Buddhist monks in a circle, lotus flowers, great stupa 
in background, peaceful and celebratory mood.
```
```
Royal Banishment space: king's herald with palm-leaf edict, palace gates, dramatic 
saffron and red mood.
```

### Special Space Icons
```
Yagna Altar icon: sacred fire pit with flames, brahmin priest silhouette, Vedic ritual, 
saffron and gold, small square icon.
```
```
Planetary Oracle icon: celestial diagram with Saturn, Jupiter, and eclipse, ancient 
astrolabe, deep purple and gold, small square icon.
```
```
Weapon Hoard icon: rack of traditional Telugu weapons (khadga, chakra, gada, shakti, 
dhanush), small square icon.
```
```
Grama Devata Utsavam icon: village goddess shrine with flower garlands, drums, dancers, 
small square icon.
```
```
River Festival icon: Krishna river festival with boats, pilgrims, decorated ghats, 
small square icon.
```
```
Royal Tribute icon: weighing scale with gold coins and palm-leaf scroll, royal tax, 
small square icon.
```
```
Merchant Tax icon: amphora, Roman coin, and cotton bale, small square icon.
```

---

## 2. City Property Illustrations (22 properties)

For each city, use:

```
Ancient South Indian city of [CITY NAME], 5th century CE, [key feature], 
flat vector game tile, muted earth tones, bronze highlights, no text, no letters.
```

Examples:
- **Amaravati:** Great Stupa with white marble sculptures and torana gateway.
- **Nagarjunakonda:** Buddhist monasteries on the Krishna river, island museum hint.
- **Dharanikota:** Satavahana capital on Krishna river, fort walls and stupa.
- **Ghantasala:** Ancient Roman-trade port with ships and amphorae.
- **Masulipatnam:** Muslin-weavers and pepper traders on a bustling wharf.
- **Srisailam:** Sacred Shaivite hill, temple on the Krishna, pilgrims.
- **Kotilingala:** Earliest Telugu-speaking capital, early coinage and fort mound.
- **Rajamahendri:** Godavari river ghats, pilgrims, Dakshina Kashi atmosphere.
- **Kalingapatnam:** Northern Andhra port with Southeast Asian trade ships.
- **Dantapura:** Kalinga capital with sacred tooth relic shrine.

---

## 3. Character Portraits (Ranis)

### Base Prompt

```
Portrait of Rani [NAME], [dynasty] queen of [era], [archetype] archetype, 
5th century South Indian royal woman, [distinctive feature], wearing silk sari 
in [color], traditional Deccan jewelry: maang tikka, choker necklace, jhumka 
earrings, bangles, dignified expression, front-facing bust, flat vector portrait, 
rich parchment and bronze tones, no text, isolated on transparent background.
```

### Examples for the 8 starting Ranis

```
Rani Naganika, Satavahana regent, 2nd century BCE, military commander holding a 
small coin, coins struck in her name, saffron and bronze sari, confident expression, 
front-facing bust, flat vector portrait.
```
```
Rani Gautami Balasri, Satavahana matriarch, venerable queen mother, sacred 
thread and prayer beads, white and gold sari, serene expression, front-facing bust, 
flat vector portrait.
```
```
Rani Chamtisiri, Ikshvaku patron, Buddhist donor, standing beside a Mahachaitya 
stupa, pink and ivory sari, peaceful expression, front-facing bust, flat vector portrait.
```
```
Rani Kodabalisiri, Ikshvaku trader, caravan leader with ledger and coins, 
cream and teal sari, shrewd expression, front-facing bust, flat vector portrait.
```
```
Rani Bhatideva, Ikshvaku sovereign, seated on throne with royal edict, 
red and gold sari, commanding expression, front-facing bust, flat vector portrait.
```
```
Rani Rudradhara-bhattarika, Ikshvaku diplomat, holding a sealed palm-leaf treaty, 
purple and gold sari, diplomatic smile, front-facing bust, flat vector portrait.
```
```
Rani Chandrasiri, Ikshvaku devi, village goddess devotee, lotus in hand, 
blue and white sari, divine calm, front-facing bust, flat vector portrait.
```
```
Rani Bodhisiri, Ikshvaku scholar, palm-leaf manuscript and writing stylus, 
saffron and white sari, scholarly gaze, front-facing bust, flat vector portrait.
```

---

## 4. Palegadu & Village Assets

### Palegadu Chieftain Archetypes (4–6 variants)

```
Frontier Telugu chieftain, Palegadu, [disposition: proud/hostile/tribute-friendly], 
5th century Andhra village leader, wearing dhoti and shawl, [weapon or scroll], 
bronze skin, turban or head cloth, flat vector portrait, no text, transparent background.
```

### Village Backdrops (4 variants)
```
Krishna delta village backdrop: rice fields, palm trees, river, small stupa, flat vector.
```
```
Deccan hill village backdrop: rocky hills, banyan tree, fort watchtower, flat vector.
```
```
Coastal Andhra village backdrop: fishing boats, beach, salt pans, flat vector.
```
```
Forest village backdrop: dense teak forest, hermitage, wildflowers, flat vector.
```

---

## 5. Card Art

### Yagna Cards
```
Yagna ritual card: [Agnihotra / Rajasuya / Ashvamedha / Vajapeya / Shanti / Indrayagna], 
sacred fire altar, Vedic priests, flames, Sanskrit mandala border, saffron and gold, 
vertical trading card format, flat vector, no text.
```

### Astra/Weapon Cards
```
Astra weapon card: [Khadga sword / Chakra discus / Gada mace / Shakti spear / Dhanush bow / 
Pashupata / Brahmastra / Agneya / Varuna / Naga / Garuda / Indra], divine glow, Telugu 
weapon, ornate South Indian border, vertical trading card format, flat vector, no text.
```

### Festival Cards
```
Festival card: [Grama Devata village festival / Krishna Pushkarams / Godavari pilgrimage], 
village procession, decorated goddess, drums and dancers, vertical trading card format, 
flat vector, no text.
```

### Planetary Oracle Cards
```
Planetary oracle card: [Saturn Sade Sati / Rahu-Ketu eclipse / Mars Kuja Dosha / Jupiter Guru Yoga], 
celestial body, ancient astrology diagram, mystical glow, vertical trading card format, 
flat vector, no text.
```

### Decree & Chronicle Cards
```
Royal decree card: palm-leaf scroll with royal seal, South Indian king's court, vertical 
trading card format, flat vector, no text.
```
```
Chronicle card: ancient manuscript with quill and ink, Buddhist monastery library, 
vertical trading card format, flat vector, no text.
```

---

## 6. UI & HUD Icons

```
Gold coin icon: ancient South Indian punch-marked coin, bronze and gold, game icon, flat vector.
```
```
Grain sheaf icon: bundle of rice stalks, golden, game icon, flat vector.
```
```
Scholar scroll icon: palm-leaf manuscript tied with cord, game icon, flat vector.
```
```
Troop icon: shield and crossed spears, bronze, game icon, flat vector.
```
```
Weapon/astra hand icon: hand holding a glowing divine weapon, game icon, flat vector.
```
```
Conquer icon: crossed swords and battle banner, game icon, flat vector.
```
```
Negotiate icon: two hands shaking over a palm-leaf treaty, game icon, flat vector.
```
```
Build icon: temple tower under construction, bricks and scaffolding, game icon, flat vector.
```
```
Decree icon: royal edict scroll with seal, game icon, flat vector.
```
```
Crown/victory icon: South Indian royal crown with jewels, game icon, flat vector.
```

---

## 7. Audio Prompts

Give these to an audio/music generation model or composer:

- **Main theme:** Slow veena raga in raga Kalyani, mridangam rhythm, deep tanpura drone, 
  majestic and ancient, 2-minute loop, 80 BPM.
- **Ambient board loop:** Soft flute, bamboo swaras, distant temple bells, river sounds, 
  1-minute loop, 70 BPM.
- **Dice roll SFX:** Short wooden dice clatter on stone, 1–2 seconds.
- **Coin gain SFX:** Antique bronze coins dropping on a stone slab, bright and satisfying.
- **Conquest SFX:** War drum roll with short horn blast, 3 seconds.
- **Yagna SFX:** Sacred fire crackle with low chant hum, 4 seconds.
- **Victory fanfare:** Sitar and tabla triumph, 6 seconds.
- **Card flip SFX:** Palm-leaf manuscript flick, 0.5 seconds.
- **Token move SFX:** Soft stone-on-stone slide, 0.5 seconds.

---

## 8. Logo & Marketing

```
Game logo: "Dakshina Rajya" in English and Telugu script, ornate South Indian temple 
lettering, bronze and saffron, royal seal and lotus motifs, horizontal banner, transparent 
background, flat vector, no photorealism.
```
```
App icon: square icon, golden crown over a South Indian mandala, dark background, 
flat vector, bold and readable at small size.
```

---

## Batch Workflow Tips

1. **Generate style samples first.** Run the Style Base + "sample character portrait" 
   to lock the look before batching.
2. **Batch by category.** Generate all 8 banners together, then all 22 cities, then 
   all 8 starting Rani portraits.
3. **Use consistent colors.** Reference the exact hex codes from the game:
   - Karmaraashtra: #8D6748
   - Andhrapatha: #0097A7
   - Andhraka: #AD1457
   - Sriparvata: #E6510
   - Kalinga Coast: #B71C1C
   - Velanadu: #F57F17
   - Trikalinga: #2E7D32
   - Sabbinadu: #1A237E
4. **Export as PNG with transparency.** Image Gen 2 usually supports transparent 
   backgrounds if requested explicitly.
5. **Store assets in** `public/assets/` or `src/assets/` in the React project.

---

## File Naming Convention

```
board/board-ring.png
banners/banner-[naadu].png
corners/[corner-name].png
spaces/space-[city-name].png
cards/yagna-[name].png
cards/astra-[name].png
cards/festival-[name].png
cards/planet-[name].png
cards/decree.png / chronicle.png
characters/rani-[name].png
characters/palegadu-[type].png
ui/icons/icon-[name].png
ui/logo.png
ui/app-icon.png
audio/theme-loop.mp3
```
