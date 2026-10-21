# Virtual Stylist 👗✨

> **Solving the *"I don't know what to wear with this"* dilemma with multi-modal AI and editorial flat-lay styling.**

Virtual Stylist is a luxury fashion curation application built with React, Vite, Tailwind CSS v4, and the Google Gemini API. When you own a statement or difficult-to-match garment (e.g. an emerald pleated satin skirt, an ornate floral jacquard blazer, or vintage leopard silk), Virtual Stylist deconstructs its color undertones, structural drape, and proportions, then curates **3 complete, distinct outfits** (**Casual**, **Business**, and **Night Out**) visualised as clean **"flat-lay" style images** on textured linen.

---

## 🌟 Key Features

1. **Multi-Modal Garment Decomposition**:
   - Upload any photo or take a picture using your mobile/device camera.
   - Extracts dominant, accent, and undertone colors with precise hex codes.
   - Analyzes silhouette, drape, fabric texture, and styling difficulty.
   - Provides an editorial **Stylist's Golden Rule** tailored specifically to that garment.

2. **The 3-Outfit Editorial Showcase**:
   - **Casual**: Relaxed, effortless everyday chic (combining formal textures with raw denim, chunky knitwear, and low-top trainers).
   - **Business / Smart Casual**: Polished, architectural corporate power pairings (framing statement pieces with structured blazers and refined loafers).
   - **Night Out**: Dramatic evening and cocktail glamour (juxtaposing liquid silks, sheer layers, and sculptural metallic jewelry).
   - Each ensemble includes an itemized coordinate list, color harmony theory, and the Stylist's Rule of Balance.

3. **Multi-Turn AI Stylist Chatbot ("Jean-Luc")**:
   - Converse in real-time with an editorial fashion director who provides honest, candid critiques on your wardrobe pieces.
   - Debate color palettes, ask for casual vs. formal balance rules, and explore footwear alternatives.
   - Switch between **Gemini 3.8 Flash** (general fast consultation), **Gemini 4 Argon** (deep wardrobe analysis), and **Gemini 3.1 Flash Lite** (ultra-fast).

4. **Direct Flat-Lay Image Design in Chat (`gemini-nano-banana-2.1`)**:
   - Ask the chatbot to design or modify an outfit in conversation (e.g. *"Design a casual streetwear flat-lay with chunky sneakers and knitwear"*).
   - Generates high-resolution flat-lay images directly in the chat thread on textured linen, complete with a 1-click *"Set as Active Outfit"* button.
   - Dedicated Prompt Studio modal for granular before-and-after image refinement.

4. **Curated 1-Click Statement Samples**:
   - Ready-to-test statement pieces included out of the box:
     - *Emerald Silk Accordion Midi Skirt*
     - *Artisanal Botanical Jacquard Blazer*
     - *Cobalt Architectural Wide-Leg Trousers*
     - *Vintage Silk Leopard Print Slip Dress*

5. **Capsule Wardrobe Persistence**:
   - Save favorite outfits to your local wardrobe capsule for quick reference.
   - One-click copy of the entire outfit checklist (pieces, colors, materials, and styling tips).
   - One-click high-resolution download of flat-lay boards.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Google Fonts (*Playfair Display*, *Cormorant Garamond*, *Plus Jakarta Sans*).
- **Backend**: Express + Vite middleware proxy (`server.ts`).
- **AI Integration**: `@google/genai` TypeScript SDK:
  - `gemini-3.8-flash` for multi-modal fashion analysis and structured JSON outfit curation.
  - `gemini-nano-banana-2.1` / `gemini-3.1-flash-lite-image` for high-resolution flat-lay image generation and prompt-based image editing.
- **Vercel Readiness**: Built-in `vercel.json` and standalone serverless API endpoints in `/api/` for zero-configuration Vercel deployment.

---

## 🚀 Local Development Setup

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **pnpm** / **yarn**
- A **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/your-username/virtual-stylist.git
cd virtual-stylist

# Install dependencies
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Add your Gemini API key in `.env`:
```env
GEMINI_API_KEY="your-gemini-api-key-here"
PORT=3000
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build
```bash
npm run build
npm run start
```

---

## ☁️ Deployment on Vercel

Virtual Stylist is pre-configured for frictionless deployment to [Vercel](https://vercel.com). Both the React Vite frontend and the serverless Gemini API endpoints (`/api/*`) deploy together seamlessly.

### Method 1: Deploy via Vercel Web Dashboard (Recommended)

1. Push your code to a GitHub, GitLab, or Bitbucket repository.
2. Go to [vercel.com/new](https://vercel.com/new) and import your repository.
3. Configure the Project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./` (leave default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. In the **Environment Variables** section, add:
   - `GEMINI_API_KEY`: Paste your Gemini API key from Google AI Studio.
5. Click **Deploy**. Vercel will build the frontend assets and automatically host the serverless functions in `/api`.

---

### Method 2: Deploy via Vercel CLI

```bash
# 1. Install the Vercel CLI globally
npm i -g vercel

# 2. Login to your Vercel account
vercel login

# 3. Link your project directory
vercel link

# 4. Add the required Gemini API Key secret
vercel env add GEMINI_API_KEY

# 5. Deploy to production
vercel --prod
```

---

## 📁 Project Structure

```
├── api/                             # Standalone Vercel Serverless Functions
│   ├── analyze-and-outfit.ts        # Garment analysis & 3-outfit curation
│   ├── generate-flatlay.ts          # Flat-lay image generation
│   └── edit-flatlay.ts              # Natural language prompt image editing
├── src/
│   ├── components/
│   │   ├── TopBar.tsx               # Editorial navigation adhering to 3-zone contract
│   │   ├── GarmentUploader.tsx      # Drag-and-drop, camera, & preset picker
│   │   ├── GarmentAnalysisCard.tsx  # Palette swatches, undertones, and difficulty
│   │   ├── OutfitShowcase.tsx       # Flat-lay display, piece list, and color theory
│   │   ├── ImagePromptStudioModal.tsx # Text-prompt image creator & editor
│   │   ├── CapsuleDrawer.tsx        # Saved wardrobe capsule management
│   │   ├── StylistMethodologyModal.tsx # The 3 Invariants of Styling
│   │   └── VercelDeployModal.tsx    # In-app deployment guide
│   ├── data/
│   ├── types/
│   ├── App.tsx                      # Main application orchestrator
│   ├── index.css                    # Tailwind CSS v4 with custom theme tokens
│   └── main.tsx
├── server.ts                        # Full-stack dev & production Express server
├── vercel.json                      # Vercel routing and build configuration
├── package.json
└── README.md
```

---

## 🎨 The Three Styling Invariants

Virtual Stylist is grounded in real-world editorial fashion theory:

1. **Volumetric Counterweight**: High-volume pieces (such as accordion skirts or wide-leg wool trousers) are balanced with streamlined coordinates (fitted knits, bodysuits, or structured shoulder tailoring).
2. **The High-Low Dialectic**: Ornate, formal statement fabrics (silk satin, woven jacquard) look effortlessly chic when paired with utilitarian everyday basics (raw denim, boxy cotton tees, white trainers).
3. **The Neutral Grounding Anchor**: High-chroma statement colors (emerald, cobalt, saffron) are grounded with warm organic neutrals (camel, chocolate espresso, oatmeal, ivory) rather than harsh solid black.

---

## 📚 Documentation

Full documentation lives in the [`docs/`](./docs/README.md) directory:

- [Architecture](./docs/architecture.md) — high-level overview, repository layout, data flow, and core domain types
- [API Reference](./docs/api-reference.md) — endpoint details for the Express server and Vercel serverless functions
- [Components](./docs/components.md) — React component guide
- [Deployment](./docs/deployment.md) — deployment guide
- [Environment Variables](./docs/environment-variables.md) — configuration reference
- [Business Cases (End Users)](./docs/business-cases/README.md) — end-user scenario guides for garment analysis, outfit generation, stylist chat, flat-lay studio, and capsule wardrobe

## 📄 License

Apache-2.0. Built with Google AI Studio.
