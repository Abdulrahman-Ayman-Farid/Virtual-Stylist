# Virtual Stylist API Reference

## Introduction

- Base URL: `/api/stylist` on the Express server (`server.ts`, default port 3000, configurable via the `PORT` environment variable). In Vercel production, the serverless functions in `api/` serve the same paths (file-name based routing).
- All four stylist endpoints are **POST** with JSON bodies. `server.ts` sets `express.json({ limit: '50mb' })` (and `express.urlencoded` with the same limit) to allow base64 image uploads as data URLs.
- Image fields accept either a full data URL (`data:image/jpeg;base64,...`) or a raw base64 string (defaults to `image/jpeg` mime) — via the shared `parseBase64Image` helper.

## Health Check

`GET /health` → `200 { "status": "ok" }`

```bash
curl http://localhost:3000/health
```

## Endpoints

### POST /api/stylist/analyze-and-outfit

Analyzes an uploaded statement wardrobe item and returns a GarmentAnalysis plus 3 complete outfits (Casual, Business, Night Out).

**Request body:**

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `image` | string | Yes | Data URL or base64 of the garment photo. |
| `preferences` | object | No | StylingPreferences — fields `fit` (`'relaxed' \| 'tailored' \| 'oversized'`), `lens` (`'womenswear' \| 'menswear' \| 'versatile'`), `season` (`'spring/summer' \| 'fall/winter' \| 'all-season'`), `notes` (string, optional). |

**Response 200:** JSON object `{ analysis: GarmentAnalysis, outfits: OutfitOption[] }` (3 outfits; each outfit has id, occasion, title, mood, pieces (4–6 OutfitPiece), colorTheory, balanceRule, stylistRationale, flatLayPrompt; `flatLayImageUrl` is added client-side after image generation).

**Errors:**

- `405` `{ "error": "Method not allowed" }` for non-POST
- `400` `{ "error": "An image of the statement item is required." }` if image missing
- `500` `{ "error": "<message>" }` on Gemini/server failure

```bash
curl -X POST http://localhost:3000/api/stylist/analyze-and-outfit \
  -H "Content-Type: application/json" \
  -d '{
    "image": "data:image/jpeg;base64,<BASE64_DATA>",
    "preferences": {
      "fit": "tailored",
      "lens": "womenswear",
      "season": "all-season",
      "notes": "Prefer monochrome looks"
    }
  }'
```

```json
{
  "analysis": {
    "itemName": "...",
    "category": "...",
    "primaryColors": [{ "name": "...", "hex": "#...", "role": "dominant", "undertone": "warm" }],
    "silhouette": "...",
    "patternType": "...",
    "styleTags": ["..."],
    "stylingDifficulty": "Moderate",
    "stylingChallenge": "...",
    "stylistCoreTip": "..."
  },
  "outfits": [
    {
      "id": "...",
      "occasion": "Casual",
      "title": "...",
      "mood": "...",
      "pieces": [{ "id": "...", "category": "top", "name": "...", "color": "...", "material": "...", "stylingTip": "..." }],
      "colorTheory": "...",
      "balanceRule": "...",
      "stylistRationale": "...",
      "flatLayPrompt": "..."
    }
  ]
}
```

### POST /api/stylist/generate-flatlay

Generates a flat-lay image from a text prompt (optionally conditioned on an original garment image).

**Request body:**

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `prompt` | string | Yes | Text prompt describing the flat-lay. |
| `originalImage` | string | No | Data URL/base64 reference image. |
| `aspectRatio` | string | No | Default `'1:1'`; supports `'1:1' \| '4:3' \| '3:4'`. |

**Response 200:** `{ "imageUrl": "data:image/png;base64,..." }` (data URL of generated image).

**Errors:**

- `405` `{ "error": "Method not allowed" }`
- `400` `{ "error": "Prompt is required" }`
- `502` `{ "error": "No image generated" }`
- `500` `{ "error": "<message>" }`

```bash
curl -X POST http://localhost:3000/api/stylist/generate-flatlay \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Flat-lay of a camel blazer with white tee and dark denim",
    "originalImage": "data:image/jpeg;base64,<BASE64_DATA>",
    "aspectRatio": "1:1"
  }'
```

```json
{
  "imageUrl": "data:image/png;base64,..."
}
```

### POST /api/stylist/edit-flatlay

Edits an existing flat-lay photograph per a natural-language edit instruction.

**Request body:**

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `currentImage` | string | Yes | Data URL/base64 of the flat-lay to edit. |
| `editPrompt` | string | Yes | The edit instruction. |

**Response 200:** `{ "imageUrl": "data:image/png;base64,...", "note": "Applied edit: \"<editPrompt>\"" }`.

**Errors:**

- `405` `{ "error": "Method not allowed" }`
- `400` `{ "error": "currentImage and editPrompt are required." }`
- `502` `{ "error": "Image editing did not return an updated visual." }`
- `500` `{ "error": "<message>" }`

```bash
curl -X POST http://localhost:3000/api/stylist/edit-flatlay \
  -H "Content-Type: application/json" \
  -d '{
    "currentImage": "data:image/png;base64,<BASE64_DATA>",
    "editPrompt": "Swap the shoes for white sneakers"
  }'
```

```json
{
  "imageUrl": "data:image/png;base64,...",
  "note": "Applied edit: \"Swap the shoes for white sneakers\""
}
```

### POST /api/stylist/chat

Conversational styling advice with the "Jean-Luc" persona, aware of the active garment and outfit; can auto-generate a designed flat-lay image.

**Request body:**

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `messages` | array | Yes | Non-empty array of ChatMessage-shaped items `{ role: 'user' \| 'model', content: string }` (role `'model'` is mapped to the model role; anything else treated as user). |
| `garmentContext` | object | No | A GarmentAnalysis used to ground the persona. |
| `activeOutfit` | object | No | An OutfitOption used to ground the persona. |
| `modelPreference` | string | No | Default `'gemini-3.8-flash'`; also accepts `'gemini-4-argon'` and `'gemini-3.1-flash-lite'`. |
| `requestImageDesign` | boolean | No | Default `false`; appends an instruction asking the model to emit a `[[DESIGN_FLATLAY: {...}]]` block. |

**Response 200:** `{ "reply": string, "designedImage": DesignedFlatLay \| null, "modelUsed": string }`. When the model emits a DESIGN_FLATLAY block, it is stripped from `reply` and parsed into `designedImage` (`{ url, prompt, title, pieces }`).

**Errors:**

- `405` `{ "error": "Method not allowed" }`
- `400` `{ "error": "Conversation history is required." }`
- `500` `{ "error": "<message>" }`

```bash
curl -X POST http://localhost:3000/api/stylist/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{ "role": "user", "content": "What shoes should I wear with this?" }],
    "modelPreference": "gemini-3.8-flash",
    "requestImageDesign": true
  }'
```

```json
{
  "reply": "...",
  "designedImage": {
    "url": "data:image/png;base64,...",
    "prompt": "...",
    "title": "...",
    "pieces": ["..."]
  },
  "modelUsed": "gemini-3.8-flash"
}
```

## Type definitions

Copied verbatim from `src/types/stylist.ts`:

```ts
export type OccasionType = 'Casual' | 'Business' | 'Night Out';

export type FitPreference = 'relaxed' | 'tailored' | 'oversized';
export type StyleLens = 'womenswear' | 'menswear' | 'versatile';
export type SeasonPreference = 'spring/summer' | 'fall/winter' | 'all-season';

export interface StylingPreferences {
  fit: FitPreference;
  lens: StyleLens;
  season: SeasonPreference;
  notes?: string;
}

export interface ColorSwatch {
  name: string;
  hex: string;
  role: 'dominant' | 'accent' | 'undertone' | 'secondary';
  undertone: 'warm' | 'cool' | 'neutral';
}

export interface GarmentAnalysis {
  itemName: string;
  category: string;
  primaryColors: ColorSwatch[];
  silhouette: string;
  patternType: string;
  styleTags: string[];
  stylingDifficulty: 'Easy' | 'Moderate' | 'Challenging' | 'Expert Statement';
  stylingChallenge: string;
  stylistCoreTip: string;
}

export interface OutfitPiece {
  id: string;
  category: 'top' | 'bottom' | 'outerwear' | 'shoes' | 'bag' | 'jewelry' | 'accessory' | 'layer';
  name: string;
  color: string;
  material: string;
  stylingTip: string;
  isOriginalItem?: boolean;
}

export interface OutfitOption {
  id: string;
  occasion: OccasionType;
  title: string;
  mood: string;
  pieces: OutfitPiece[];
  colorTheory: string;
  balanceRule: string;
  stylistRationale: string;
  flatLayImageUrl?: string;
  flatLayPrompt: string;
  isGeneratingImage?: boolean;
}

export interface DesignedFlatLay {
  url: string;
  prompt: string;
  title: string;
  pieces?: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  designedImage?: DesignedFlatLay;
  isDesigningImage?: boolean;
  modelUsed?: string;
}
```

## Frontend usage note

The frontend calls these endpoints via `fetch('/api/stylist/...')` from `src/App.tsx`, `src/components/ImagePromptStudioModal.tsx`, and `src/components/StylistChatDrawer.tsx`.
