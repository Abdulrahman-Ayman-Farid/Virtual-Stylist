# Virtual Stylist — Component Documentation

## Introduction

Virtual Stylist is a React + TypeScript + Vite application. All UI is built from **React function components** typed with `React.FC` and explicit TypeScript prop interfaces, and styled exclusively with **Tailwind CSS utility classes** (no separate CSS modules for components).

Typography is loaded in `index.html` via Google Fonts:

- **Cormorant Garamond** — editorial serif accents
- **Playfair Display** — display headings
- **Plus Jakarta Sans** — body / UI text

The global page background is a warm off-white, `#F9F8F6`, with ink-dark text (`#1C1917`) and terracotta/gold accents (`#9A3412`, `#D4AF37`).

## App Shell (`src/App.tsx`)

The default export `App` is the single stateful shell that orchestrates the entire experience.

**State responsibilities:**

- `preferences: StylingPreferences` — the styling lens (`fit` / `lens` / `season`) shared with the uploader form and API calls.
- `garmentAnalysis: GarmentAnalysis` — the current garment's visual decomposition (palette, silhouette, tags, tip).
- `outfits: OutfitOption[]` — the active 3-outfit board.
- `savedOutfits: OutfitOption[]` — the wardrobe capsule, persisted to `localStorage` under the key `virtual_stylist_saved_capsule` (lazy-initialized from storage on mount, synced via `useEffect` on every change).
- Modal/drawer open flags: capsule drawer, methodology modal, deploy-guide modal, stylist chat, and the currently editing outfit (`editingOutfit`).
- Toast state (`toastMessage` / `toastType`), auto-dismissed after 3.2 s.

**Server interactions:**

- `POST /api/stylist/analyze-and-outfit` — sends the uploaded image (data URL) + preferences; receives `analysis` and `outfits`, with a fallback `flatLayImageUrl` when no image is rendered yet.
- `POST /api/stylist/generate-flatlay` — sends the outfit's `flatLayPrompt`, the `originalImage`, and `aspectRatio: '1:1'`; receives a regenerated `imageUrl`.

**Rendered tree:** `TopBar`, `GarmentUploader`, `GarmentAnalysisCard`, `OutfitShowcase`, plus overlays `CapsuleDrawer`, `StylistChatDrawer`, `ImagePromptStudioModal`, `StylistMethodologyModal`, `VercelDeployModal`, a fixed floating **"Consult Stylist"** button, and the toast notification. An editorial footer provides secondary links.

On first load, the app defaults to the **first curated sample** from `SAMPLE_WARDROBE_ITEMS` (`src/data/samples`), so the page is visually rich immediately.

## Components (`src/components/`)

### `TopBar.tsx`

**Path:** `src/components/TopBar.tsx`

**Purpose:** Sticky navigation bar with the brand wordmark, nav links, and a capsule badge showing the number of saved outfits (`savedCount`). Opens the capsule drawer, methodology modal, deploy guide, and stylist chat; "New Piece" smooth-scrolls to the top of the page.

```ts
interface TopBarProps {
  onNewPieceClick: () => void;
  onOpenCapsule: () => void;
  onOpenMethodology: () => void;
  onOpenDeployGuide: () => void;
  onOpenChat: () => void;
  savedCount: number;
}
```

### `GarmentUploader.tsx`

**Path:** `src/components/GarmentUploader.tsx`

**Purpose:** The sample selection hub and custom image entry point. Users pick a curated statement sample or upload their own photo via file picker, camera capture, or drag-and-drop. Includes a collapsible styling preferences form controlling `fit`, `lens`, and `season`, which is passed back with the upload. Shows a loading state while analysis is in flight.

```ts
interface GarmentUploaderProps {
  onSelectSample: (sample: StatementSampleItem) => void;
  onUploadCustomImage: (imageDataUrl: string, preferences: StylingPreferences) => void;
  isLoading: boolean;
  preferences: StylingPreferences;
  onPreferencesChange: (newPrefs: StylingPreferences) => void;
}
```

### `GarmentAnalysisCard.tsx`

**Path:** `src/components/GarmentAnalysisCard.tsx`

**Purpose:** Displays the AI analysis results for the current garment: the extracted color palette (each swatch is click-to-copy for its hex value), silhouette description, style tags, and a stylist tip. Optionally renders the item image alongside the decomposition.

```ts
interface GarmentAnalysisCardProps {
  analysis: GarmentAnalysis;
  itemImage?: string;
}
```

### `OutfitShowcase.tsx`

**Path:** `src/components/OutfitShowcase.tsx`

**Purpose:** The editorial showcase of the 3 outfit options. Each card shows a flat-lay image, occasion filter tabs, and a piece checklist with copy-to-clipboard. Per-outfit actions: regenerate the flat-lay image, edit the image prompt (opens the prompt studio modal), save/remove the outfit to/from the capsule, and open the stylist chat.

```ts
interface OutfitShowcaseProps {
  outfits: OutfitOption[];
  onOpenEditModal: (outfit: OutfitOption) => void;
  onRegenerateImage: (outfit: OutfitOption) => void;
  onSaveOutfit: (outfit: OutfitOption) => void;
  isSaved: (outfitId: string) => boolean;
  onOpenStylistChat?: () => void;
}
```

### `CapsuleDrawer.tsx`

**Path:** `src/components/CapsuleDrawer.tsx`

**Purpose:** Right-side drawer listing all saved outfits in the wardrobe capsule. Supports removing an outfit, selecting/focusing an outfit (promotes it onto the active outfit board), and downloading the flat-lay image.

```ts
interface CapsuleDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedOutfits: OutfitOption[];
  onRemoveOutfit: (outfitId: string) => void;
  onSelectOutfit: (outfit: OutfitOption) => void;
}
```

### `StylistChatDrawer.tsx`

**Path:** `src/components/StylistChatDrawer.tsx`

**Purpose:** Conversational chat UI with the "Jean-Luc" stylist persona, seeded with starter prompts. Messages are sent to `POST /api/stylist/chat` with the garment context and active outfit. When the stylist designs a new flat-lay, it can be applied back to the outfit board via `onApplyDesignedOutfit`.

```ts
interface StylistChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  garmentContext: GarmentAnalysis | null;
  activeOutfit?: OutfitOption | null;
  onApplyDesignedOutfit?: (designed: DesignedFlatLay) => void;
}
```

### `ImagePromptStudioModal.tsx`

**Path:** `src/components/ImagePromptStudioModal.tsx`

**Purpose:** Modal for editing the flat-lay image prompt of an outfit. Offers quick-prompt chips for common adjustments and keeps an edit history. Submits to `POST /api/stylist/edit-flatlay` and applies the resulting image back to the outfit board via `onApplyUpdatedImage`.

```ts
interface ImagePromptStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  outfit: OutfitOption | null;
  onApplyUpdatedImage: (outfitId: string, newImageUrl: string) => void;
}
```

### `StylistMethodologyModal.tsx`

**Path:** `src/components/StylistMethodologyModal.tsx`

**Purpose:** Static, purely presentational modal explaining "The Three Invariants of Styling" — the methodology behind the app's outfit curation. No data fetching or callbacks beyond open/close.

```ts
interface StylistMethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}
```

### `VercelDeployModal.tsx`

**Path:** `src/components/VercelDeployModal.tsx`

**Purpose:** Deployment guide modal with a copyable `vercel.json` snippet and step-by-step CLI commands: `vercel login`, `vercel link`, `vercel env add GEMINI_API_KEY`, and `vercel` (deploy).

```ts
interface VercelDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}
```

## State Flow

All state lives in `App` and flows down via props; child components communicate back exclusively through callbacks.

1. **Sample select / upload → analysis.** Choosing a curated sample (`onSelectSample`) instantly swaps in the sample's preview image, `GarmentAnalysis`, and 3 pre-curated outfits, with a success toast. Uploading a custom image (`onUploadCustomImage`) sets the garment image, turns on the global loading state, and POSTs the image data URL + `StylingPreferences` to `/api/stylist/analyze-and-outfit`. On success, `garmentAnalysis` and `outfits` are replaced (outfits enriched with a fallback `flatLayImageUrl`); on failure, an error toast shows the server's message.

2. **Analysis → outfit board.** `GarmentAnalysisCard` renders the new decomposition; `OutfitShowcase` renders the 3 outfits. Regenerating an image (`onRegenerateImage`) flags the outfit as `isGeneratingImage`, POSTs the prompt + original image + `aspectRatio: '1:1'` to `/api/stylist/generate-flatlay`, and swaps in the returned `imageUrl` (errors clear the flag and toast).

3. **Edit prompt.** `onOpenEditModal` sets `editingOutfit`, opening `ImagePromptStudioModal`. Applying an edited image calls `onApplyUpdatedImage(outfitId, newImageUrl)`, which patches that outfit's `flatLayImageUrl` and toasts confirmation.

4. **Chat consultation.** Opening the chat (TopBar, footer, or the floating "Consult Stylist" button) passes the current `garmentAnalysis` and the first outfit as context. When Jean-Luc designs a flat-lay, `onApplyDesignedOutfit` overwrites the first outfit's title, image, prompt, and (if provided) piece list, then toasts.

5. **Save to capsule.** `onSaveOutfit` toggles membership: saving prepends the outfit and toasts; saving an already-saved outfit removes it. `isSaved` drives the saved/unsaved button state. Removals from `CapsuleDrawer` and selections (`onSelectOutfit`, which promotes the outfit onto the board, replacing others of the same occasion) also toast.

6. **Persistence.** Every change to `savedOutfits` is written to `localStorage` under `virtual_stylist_saved_capsule`; the capsule is restored from storage on mount (falling back to an empty list if parsing fails), so saved outfits survive page reloads.

7. **Toast feedback.** Every user-facing outcome — loads, analyses, image renders, saves, removals, chat applications, and errors — surfaces as a toast (success with a gold check, error with a red alert) that auto-dismisses after ~3.2 seconds.
