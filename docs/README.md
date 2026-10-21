# Virtual Stylist Documentation

Documentation for Virtual Stylist, an AI-powered wardrobe companion that analyzes garment images and generates styled outfit options.

## Documentation

- [Architecture](./architecture.md) — High-level system overview, repository layout, data flow, and core domain types.
- [API Reference](./api-reference.md) — Endpoint reference for the Express server and Vercel serverless functions. *(Coming soon)*
- [Components](./components.md) — React component reference for the uploader, analysis card, outfit showcase, chat, and modals. *(Coming soon)*
- [Deployment](./deployment.md) — Deployment guide covering local development, Vercel serverless deployment, and Kubernetes (kustomize + Istio + ArgoCD) with health checks.
- [Environment Variables](./environment-variables.md) — Reference for GEMINI_API_KEY and APP_URL, with setup instructions for local, Vercel, and Kubernetes environments.

## Business Cases (End Users)

End-user scenarios showing how Virtual Stylist features are used in practice.

- [Business Cases Overview](./business-cases/README.md) — Index of end-user scenarios and how the features fit together.
- [Garment Analysis](./business-cases/garment-analysis.md) — Uploading a garment photo to extract its attributes and analysis.
- [Outfit Generation](./business-cases/outfit-generation.md) — Generating styled outfit options from an analyzed garment.
- [Stylist Chat](./business-cases/stylist-chat.md) — Conversing with the AI stylist for personalized styling advice.
- [Flat-Lay Studio](./business-cases/flat-lay-studio.md) — Creating flat-lay outfit visuals for sharing and planning.
- [Capsule Wardrobe](./business-cases/capsule-wardrobe.md) — Building a versatile capsule wardrobe from existing pieces.

## Getting Started

### Prerequisites

- Node.js 22+
- npm

### Commands

```bash
npm install    # Install project dependencies
npm run dev    # Start the Vite dev server for local development
npm run build  # Build the application for production
npm test       # Run the test suite
```
