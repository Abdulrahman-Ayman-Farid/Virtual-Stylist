# AI Stylist Chatbot & Image Design Engine

This enhancement integrates a multi-turn AI fashion consultation drawer into Virtual Stylist, featuring a high-fashion editorial director persona who provides candid, discerning opinions, deep styling advice, and directly designs or refines luxury flat-lay images inside the conversation thread.

### User Review & Critical Decisions

> [!IMPORTANT]
> The following decisions were confirmed by the user and guide this implementation:
>
> - **Chatbot Persona & Tone**: High-fashion editorial director with honest, constructive, and sophisticated opinions (reminiscent of senior fashion editors at Vogue and Harper's Bazaar).
> - **Placement & Experience**: Elegant slide-over consultation drawer accessible from any outfit card or the top navigation bar, preserving user context.
> - **Image Design in Chat**: The chatbot can directly design, generate, and edit flat-lay outfit images inline using `gemini-nano-banana-2.1`, with a 1-click "Apply to Showcase" button.
> - **Model Strategy**: Multi-turn chat powered by `gemini-3.8-flash` (with option for `gemini-4-argon` for complex wardrobe overhauls), paired with `gemini-nano-banana-2.1` for image synthesis and editing.

---

### 1. Overview & Core Concept

- **What It Does**: Users can open the Stylist Consultation Drawer at any time to debate styling choices, ask for alternative color combinations, get frank critiques on whether a pairing works, or request custom flat-lay redesigns. When the user requests visual modifications (e.g., *"Design a flat-lay of this skirt with a cropped bomber jacket and chunky loafers"*), the AI drafts the rationale and automatically triggers a new flat-lay image rendered right into the chat thread.
- **Target Audience**: Users seeking real-time fashion advice, second opinions, or specific custom iterations that go beyond static presets.
- **Key Value**: Provides an interactive, human-like dialogue with an elite stylist who has taste, context about the uploaded piece, and the visual tools to manifest outfit ideas instantly.

---

### 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Summoning the Stylist**: A floating luxury consultation button (`"Consult Stylist"`) and top navigation link open the slide-over drawer with the current garment and selected outfit already loaded into context.
  2. **Conversational Thread**: A clean, scrollable editorial chat history with message bubbles styled in warm paper (`#FAF8F5`) and deep charcoal (`#1C1917`), featuring timestamps and clean unboxed metadata.
  3. **Editorial Starter Prompts**: Context-aware suggested prompts, such as:
     - *"What is your completely honest critique of this piece?"*
     - *"How can I dress this down for a casual Sunday coffee date?"*
     - *"Design a bolder, avant-garde evening variation with metallic accents."*
     - *"Can this be worn to a winter garden wedding?"*
  4. **Inline Image Design Cards**: When the AI designs or modifies an outfit, an interactive visual card appears directly in the message stream showing the new flat-lay on textured linen, accompanied by a piece breakdown and a *"Set as Current Outfit"* action.
  5. **Model & Persona Quick Switch**: Easy switch between General Fast Styling (`gemini-3.8-flash`) and Deep Wardrobe Overhaul (`gemini-4-argon`).

- **Visual Identity & Theme**:
  - Consistent with the editorial luxury boutique design system: warm travertine canvas, fine hairline borders (`#E5E0D8`), and high-contrast typography (`Playfair Display` headers and `Plus Jakarta Sans` body).
  - No generic purple gradient chat bubbles or AI sparkle slop; strictly refined fashion atelier aesthetics.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Context-Aware Multi-Turn Server Endpoint (`/api/stylist/chat`)**
  - *Chosen Approach*: Maintain full conversational history along with active garment metadata (colors, silhouette, category) injected into the system instruction, enabling contextual continuity across multiple turns.
  - *Why*: The stylist immediately knows what item the user is looking at without requiring repetitive explanations.

- **Decision 2: Dual Response Capability (Text Critique + Visual Flat-Lay Generation)**
  - *Chosen Approach*: The chat endpoint detects when the user requests an image or visual outfit modification, returns the stylist's commentary along with an image design prompt, and generates the flat-lay visual via `gemini-nano-banana-2.1`.
  - *Why*: Fulfills the user requirement for the AI to "design images and talk his opinions" within a single cohesive workflow.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND                                  │
│                                                                        │
│  ┌──────────────────────┐  ┌────────────────────────────────────────┐  │
│  │ TopBar / Floating    │  │ "Consult Stylist" Action Trigger       │  │
│  └──────────────────────┘  └────────────────────────────────────────┘  │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ StylistChatDrawer Component                                      │  │
│  │ ┌──────────────────────────────────────────────────────────────┐ │  │
│  │ │ Context Pill: Active Garment & Selected Occasion             │ │  │
│  │ ├──────────────────────────────────────────────────────────────┤ │  │
│  │ │ Scrollable Message Stream: User & Editorial Stylist Responses│ │  │
│  │ │ • Honest opinions & fashion critique                         │ │  │
│  │ │ • Inline Flat-Lay Image Design Cards                         │ │  │
│  │ │ • "Apply to Outfit Board" Handlers                           │ │  │
│  │ ├──────────────────────────────────────────────────────────────┤ │  │
│  │ │ Quick Prompt Suggestion Strip                                │ │  │
│  │ ├──────────────────────────────────────────────────────────────┤ │  │
│  │ │ Text Input Area with Multi-Modal Image Design Support        │ │  │
│  │ └──────────────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ POST /api/stylist/chat
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       SERVER (server.ts / Vercel API)                  │
│                                                                        │
│  ┌───────────────────────────────────┐  ┌───────────────────────────┐  │
│  │ POST /api/stylist/chat            │  │ Gemini 3.8 Flash /         │  │
│  │ Multi-turn conversation           │  │ Gemini 4 Argon             │  │
│  │ Context-injected system prompt    │  │ Structured Critique Schema │  │
│  └───────────────────────────────────┘  └───────────────────────────┘  │
│                                    │                                   │
│                                    ▼ (When image generation requested) │
│  ┌───────────────────────────────────┐  ┌───────────────────────────┐  │
│  │ gemini-nano-banana-2.1            │  │ High-Res Flat-Lay Visual   │  │
│  │ Image design synthesis            │  │ Base64 data returned       │  │
│  └───────────────────────────────────┘  └───────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

- **Data Model**:
  - `ChatMessage`: `id`, `role: 'user' | 'model'`, `content: string`, `timestamp: string`, `designedImage?: { url: string; prompt: string; outfitTitle: string; pieces?: string[] }`, `isDesigningImage?: boolean`.
  - `ChatContext`: `activeGarment: GarmentAnalysis`, `activeOutfit?: OutfitOption`.
