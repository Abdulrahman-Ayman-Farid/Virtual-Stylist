# Environment Variables

Virtual Stylist uses a small set of environment variables for configuration. `.env.example` documents the two required variables; a few optional/runtime-injected variables are also supported.

## Required Variables

`.env.example` contains exactly two variables:

| Name | Purpose | Where it's used | How to set locally | How to set on Vercel | How to set in Kubernetes |
| --- | --- | --- | --- | --- | --- |
| `GEMINI_API_KEY` | Required for Gemini AI API calls. AI Studio automatically injects this at runtime from user secrets. Users configure this via the Secrets panel in the AI Studio UI. | `server.ts` (GoogleGenAI client `apiKey`) and the Vercel serverless functions in `api/` (`analyze-and-outfit.ts`, `generate-flatlay.ts`, `edit-flatlay.ts`, `chat.ts`) | Append to `.env`, e.g. `GEMINI_API_KEY="your-key"`. `.env` is loaded by dotenv in `server.ts`. `.env` is gitignored and must NEVER be committed. | **Project Settings → Environment Variables** (required for the `api/` serverless functions) | Comes from Secret `virtual-stylist-secrets` (`k8s/base/secrets.yaml`, key `GEMINI_API_KEY`), injected via `envFrom` on the deployment. Fill in the placeholder in `k8s/base/secrets.yaml` (currently `REPLACE_ME`); see `k8s/base/SECRETS.md` for filling values and the rotation procedure. |
| `APP_URL` | The URL where this applet is hosted. AI Studio automatically injects this at runtime with the Cloud Run service URL. Used for self-referential links, OAuth callbacks, and API endpoints. | Self-referential links, OAuth callbacks, and API endpoints | Append to `.env`, e.g. `APP_URL="http://localhost:3000"`. `.env` is loaded by dotenv in `server.ts`. `.env` is gitignored and must NEVER be committed. | **Project Settings → Environment Variables** | Comes from Secret `virtual-stylist-secrets` (`k8s/base/secrets.yaml`, key `APP_URL`). Fill in the placeholder in `k8s/base/secrets.yaml` (currently `REPLACE_ME`); see `k8s/base/SECRETS.md` for filling values and the rotation procedure. |

## Optional / Runtime-Injected Variables

These variables are **not** in `.env.example` but are supported at runtime:

- `PORT` — Port the Express server listens on. Defaults to **3000** in `server.ts`.
- `DISABLE_HMR` — Set to `'true'` in AI Studio to disable Vite HMR/file watching.
