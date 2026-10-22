# Homepage Redesign Spec — "Amelia Laing, Fashion Stylist"

Design specification for a homepage redesign based on the reference image: a stylist portfolio landing page ("Amelia Laing, Fashion Stylist"). All measurements are estimates taken from the reference at desktop mockup scale; copy strings are verbatim from the reference.

## Layout

The page is a **centered single-column desktop layout** set on a light marble backdrop. Content is organized as a vertical stack of full-width sections:

1. **Hero** — full-bleed photographic hero occupying roughly **55% of the viewport height**, with a dark overlay containing the top navigation and centered hero content.
2. **About** — cream section with a three-column composition: a narrow tall image flush to the left edge, a larger center portrait, and a right-hand text block of roughly **40% width**.
3. **Collaborations** — a logo bar on the cream background.
4. **Mission banner** — full-width dark photographic banner, roughly **200px tall**, with centered white text.
5. **CTA** — cream section with a large serif heading ("LET'S WORK TOGETHER") and a thin underline rule.

No footer is visible in the reference (the section is cut off at the bottom of the image).

## Color Palette

Hex values are estimates from the reference image.

| Token | Hex | Usage |
| --- | --- | --- |
| Cream page background | `#F5E9E2` / `#F6ECE5` | About, Collaborations, and CTA section backgrounds |
| Marble outer backdrop | `#E8E4E0` | Page backdrop behind the centered column |
| Hero overlay (warm dark brown) | `#2A1E14` | Dark overlay on the hero photograph |
| Mission banner (dark navy/charcoal) | `#1E222A` | Mission banner background/photo tone |
| Primary text (charcoal) | `#2B2B2B` | Headings and primary copy |
| Body gray | `#6B6B6B` | Body paragraphs and secondary text |
| White | `#FFFFFF` | Text on dark sections, button borders |
| Button border (white ~80% opacity) | `rgba(255, 255, 255, 0.8)` | Outlined "Book Now" button |
| Amber/orange accent | `#C87A2E` | Imagery only (not used in UI chrome) |

## Typography

- **Display headings** — high-contrast serif in the Didot/Playfair style, set in all caps:
  - Hero: ~48–56px
  - About: ~28–32px
  - Mission: ~24–28px
  - CTA: ~40–48px
- **Nav/eyebrow labels** — small uppercase sans-serif, ~10–11px, with 1–2px letter-spacing.
- **Body copy** — sans-serif, ~12–13px, line-height 1.6, in body gray.
- **Logo wordmark** — serif, ~16px, mixed case ("Amelia Laing").

## Sections

Section copy below is verbatim from the reference image.

### Nav

- Logo: "Amelia Laing"
- Links: `SERVICES` / `ABOUT` / `COURSE` / `CONTACT`
- Outlined "Book Now" button
- Hamburger icon

### Hero

- Heading: "AMELIA LAING / FASHION STYLIST"
- Subtext: "My mission is to help you unlock your full potential with personalized coaching that blends expert"
- Three social icons: Instagram, Pinterest, TikTok

### About

- Eyebrow: "TRANSFORM YOUR WARDROBE"
- Heading: "BRINGING YOUR STYLE TO LIFE WITH LOOKS THAT INSPIRE CONFIDENCE."
- Body paragraph about personalized coaching.

### Collaborations

- Label: "COLLABORATIONS:"
- Logos: goop, GLAMOUR, POPSUGAR, Forbes, ELLE

### Mission

- Eyebrow: "MY MISSION."
- Heading: "TO BREAK BOUNDARIES AND EMPOWER WOMEN TO EMBRACE THEIR TRUE SELVES."

### CTA

- Heading: "LET'S WORK TOGETHER"

No footer is visible in the reference (section cut off).

## Imagery

- **Style** — editorial fashion photography throughout.
- **Hero** — full-bleed photograph with a dark warm-brown overlay for text legibility.
- **About** — a tall narrow crop of a Diptyque candle in amber tones, flush to the left edge; a portrait of a woman in a white shirt and orange sunglasses.
- **Mission banner** — dark, moody navy/charcoal photograph.
- The amber/orange accent (`#C87A2E`) appears only within imagery, not in UI elements.

## Spacing & Roundness

All values are estimates at desktop mockup scale.

- **Outer margins** — generous: ~90px top, ~95px sides.
- **Content margins** — consistent ~32px.
- **Hero nav** — ~24px top padding, ~32px side padding.
- **About** — ~80px vertical padding, ~40px gaps between columns.
- **Collaborations** — ~40px vertical padding.
- **Mission** — ~48px vertical padding.
- **CTA** — ~60px top padding.
- **Corners** — sharp throughout: no border-radius on images, buttons, or sections. Buttons are thin 1px outlined rectangles.

## Current Implementation Audit

Audit of the homepage as currently implemented in the codebase, to map the reference design onto existing files.

### Homepage render path

The default export `App` in `src/App.tsx` renders on initial load, in order:

1. `TopBar` — always rendered.
2. `GarmentUploader` — always rendered, inside `<main>`.
3. `GarmentAnalysisCard` — gated by `garmentAnalysis` state; truthy by default since it is initialized from `SAMPLE_WARDROBE_ITEMS[0].analysis`.
4. `OutfitShowcase` — gated by `outfits && outfits.length > 0`; truthy by default from sample data.

Overlays/drawers gated by state:

- `ImagePromptStudioModal` — `editingOutfit`
- `CapsuleDrawer` — `isCapsuleOpen`
- `StylistMethodologyModal` — `isMethodologyOpen`
- `VercelDeployModal` — `isDeployGuideOpen`
- `StylistChatDrawer` — `isChatOpen`
- Plus a toast.

Page root: `min-h-screen bg-[#F9F8F6] text-[#1C1917]`. Footer: `border-t border-[#E7E2D9] bg-[#F4F1EA]`.

### Current palette hexes

Tailwind arbitrary values found in code:

| Role | Hex |
| --- | --- |
| Page background | `#F9F8F6` (App root, index.html body) |
| TopBar background | `#FAF9F6`/90 with backdrop-blur, border `#E7E2D9` |
| Primary text | `#1C1917` |
| Secondary text | `#78716C`, body text `#57534E` |
| Accent (rust/amber) | `#9A3412` (eyebrows, icons, hover), gold `#D4AF37` (sparkle icon) |
| Primary button | `#1C1917` bg, hover `#2E2A27`, text `#FAF8F5` |
| Card background | `#FFFFFF`, borders `#E7E2D9` |
| Footer background | `#F4F1EA` |
| Selection | `#9A3412`/20 |

### Current fonts

From the index.html Google Fonts link:

- **Cormorant Garamond** — 400/600/700 + italic 400
- **Playfair Display** — 500/600/700 + italic 500
- **Plus Jakarta Sans** — 400–700

Components use the `font-editorial` class for serif headings (TopBar wordmark, GarmentUploader h1) and the default sans for body text.

### Current section order

1. **TopBar** (sticky)
2. **GarmentUploader** — "The Wardrobe Atelier" hero + upload zone + statement presets
3. **GarmentAnalysisCard**
4. **OutfitShowcase**
5. **Footer**

### Mapping table

| Reference design element | Current file/component to change |
| --- | --- |
| Nav bar (logo, links, Book Now button, hamburger) | src/components/TopBar.tsx |
| Hero section (full-bleed photo, dark overlay, display heading, social icons) | src/App.tsx + src/components/GarmentUploader.tsx (currently a light editorial header, no photo hero) |
| About section (3-column images + text) | new section in src/App.tsx (does not exist) |
| Collaborations logo bar | new section in src/App.tsx (does not exist) |
| Mission dark banner | new section in src/App.tsx (does not exist) |
| CTA "LET'S WORK TOGETHER" | new section in src/App.tsx (does not exist) |
| Garment analysis / outfit showcase (app-specific, no reference equivalent) | src/components/GarmentAnalysisCard.tsx, src/components/OutfitShowcase.tsx |
| Fonts (Playfair/Didot-style serif display) | index.html (Google Fonts link) + Tailwind font-editorial token |
| Color palette (cream `#F5E9E2`, charcoal `#2B2B2B`) | index.html body classes, src/App.tsx root, TopBar.tsx, GarmentUploader.tsx |
| Footer | src/App.tsx footer block |
