# Virtual Stylist Documentation

Documentation for Virtual Stylist, an AI-powered wardrobe companion that analyzes garment images and generates styled outfit options.

## Documentation

- [Architecture](./architecture.md) — High-level system overview, repository layout, data flow, and core domain types.
- [API Reference](./api-reference.md) — Endpoint reference for the Express server and Vercel serverless functions. *(Coming soon)*
- [Components](./components.md) — React component reference for the uploader, analysis card, outfit showcase, chat, and modals. *(Coming soon)*
- [Deployment](./deployment.md) — Deployment guide covering local development, Vercel serverless deployment, and Kubernetes (kustomize + Istio + ArgoCD) with health checks.
- [Environment Variables](./environment-variables.md) — Reference for GEMINI_API_KEY and APP_URL, with setup instructions for local, Vercel, and Kubernetes environments.

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
