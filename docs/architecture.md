# Architecture

## High-Level Overview

Virtual Stylist is an AI-powered wardrobe companion. The user uploads a garment image; the app analyzes it (colors, silhouette, styling difficulty), generates 3 outfit options (Casual, Business, Night Out) each with a flat-lay image, and offers a multi-turn AI stylist chat.

## Tech Stack

### Frontend

| Layer | Technology | Version | Purpose |
| --- | --- | --- | --- |
| UI library | React + React DOM | ^19.0.1 | SPA UI; no router or state library — local React state only |
| Language | TypeScript | ^7.0.2 | Type-safe application code |
| Build tool | Vite | ^8.3.0 | Dev server and production bundler |
| Build plugin | @vitejs/plugin-react | ^6.1.1 | React fast refresh and JSX transform |
| Styling | Tailwind CSS (via @tailwindcss/vite) | ^4.3.3 | CSS-first configuration in `src/index.css` |
| Animation | Motion | ^12.23.24 | Animations and transitions |
| Icons | lucide-react | ^0.546.0 | Icon components |

### Backend

| Layer | Technology | Version | Purpose |
| --- | --- | --- | --- |
| Runtime | Node.js (ESM) | — | JavaScript runtime for the server |
| Web framework | Express | ^4.21.2 | `server.ts` — `/health` and `/api/stylist/*` routes, 50mb JSON body limit, serves `dist/` in production |
| Dev runner | tsx | ^4.21.0 | Runs `server.ts` for the dev and start scripts |
| Config | dotenv | ^17.2.3 | Environment variable loading |
| AI client | @google/genai | ^2.4.0 | Server-side Gemini client — `gemini-3.8-flash` for analysis, `gemini-nano-banana-2.1` / `gemini-3.1-flash-lite-image` for image generation |
| Hosting | Vercel serverless functions (with `vercel.json`) | — | Serverless deployment of the API in `api/` |

## Repository Layout

| Path | Description |
| --- | --- |
| `index.html` | Vite HTML entry point |
| `src/main.tsx` | React application bootstrap |
| `src/App.tsx` | Root component; orchestrates application state and all fetch calls to the API |
| `src/components/` | UI components (uploader, analysis card, outfit showcase, chat, modals) |
| `src/types/stylist.ts` | Shared TypeScript domain types |
| `server.ts` | Express server exposing `/health` and `/api/stylist/*` routes (local dev & production) |
| `api/` | Vercel serverless functions mirroring the same endpoints |
| `vite.config.ts` | Vite build/dev configuration |
| `vercel.json` | Vercel routing and build configuration |
| `tsconfig.json` | TypeScript compiler configuration |
| `package.json` | Dependencies and npm scripts |

## Data Flow

```
┌─────────────────────┐
│  Browser (React SPA)│
│   src/App.tsx       │
└─────────┬───────────┘
          │  fetch POST /api/stylist/<endpoint>
          ▼
┌──────────────────────────────────────────────┐
│ Local dev/prod: Express server (server.ts)   │
│ Production:     Vercel serverless (api/*.ts) │
└─────────┬────────────────────────────────────┘
          │  @google/genai SDK
          ▼
┌─────────────────────┐
│     Gemini AI       │
└─────────┬───────────┘
          │  JSON response
          ▼
   React state update (outfits, analysis, chat)
```

## Dual API Surface

The same endpoints are served two ways:

- **Express server** (`server.ts`) for local development and self-hosted production. Routes:
  - `/health`
  - `/api/stylist/analyze-and-outfit`
  - `/api/stylist/generate-flatlay`
  - `/api/stylist/edit-flatlay`
  - `/api/stylist/chat`
- **Vercel serverless functions** in `api/`: `api/analyze-and-outfit.ts`, `api/generate-flatlay.ts`, `api/edit-flatlay.ts`, `api/chat.ts`, each exporting `default async function handler(req: VercelRequest, res: VercelResponse)`.

| Endpoint | Serverless file |
| --- | --- |
| `/api/stylist/analyze-and-outfit` | `api/analyze-and-outfit.ts` |
| `/api/stylist/generate-flatlay` | `api/generate-flatlay.ts` |
| `/api/stylist/edit-flatlay` | `api/edit-flatlay.ts` |
| `/api/stylist/chat` | `api/chat.ts` |

## Core Domain Types (`src/types/stylist.ts`)

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

export interface StatementSampleItem {
  id: string;
  name: string;
  category: string;
  subtitle: string;
  previewImage: string;
  analysis: GarmentAnalysis;
  outfits: OutfitOption[];
}
```

Type purposes:

- `OccasionType` — The three outfit occasions the app generates: Casual, Business, Night Out.
- `FitPreference` — User's preferred garment fit.
- `StyleLens` — Styling perspective applied to outfit generation.
- `SeasonPreference` — Seasonal context for styling.
- `StylingPreferences` — User's styling inputs (fit, lens, season, optional notes).
- `ColorSwatch` — A single color extracted from the garment, with its role and undertone.
- `GarmentAnalysis` — AI analysis of the uploaded garment: name, category, colors, silhouette, pattern, style tags, difficulty, and stylist tips.
- `OutfitPiece` — One item in a generated outfit, including whether it is the original uploaded garment.
- `OutfitOption` — A complete outfit for one occasion, with pieces, color theory, balance rule, stylist rationale, and flat-lay image state.
- `DesignedFlatLay` — A generated flat-lay image with its prompt, title, and optional piece list.
- `ChatMessage` — A message in the multi-turn stylist chat, optionally carrying a designed image and the model used.
- `StatementSampleItem` — A pre-analyzed sample garment used for showcase/demo purposes.
