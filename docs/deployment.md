# Deployment

## Local Development

Install dependencies and start the Express server (`server.ts`), which serves both the React app and the API routes:

```bash
npm install    # Install project dependencies
npm run dev    # Start the Express server (tsx server.ts) on port 3000
```

`npm run dev` runs `tsx server.ts` — the Express server that serves the React app and the API routes under `/api/stylist/*` (`analyze-and-outfit`, plus the `generate-flatlay` / `edit-flatlay` / `chat` equivalents) and `GET /health`. The server listens on port **3000**, overridable via the `PORT` environment variable.

For a production-mode local run:

```bash
npm start      # NODE_ENV=production tsx server.ts
```

### Build, Preview, Test, Lint

```bash
npm run build    # vite build — outputs to dist/
npm run preview  # vite preview — serve the production build locally
npm test         # Run the test suite
npm run lint     # tsc --noEmit — type checking
```

### Vite Configuration

The Vite config (`vite.config.ts`) uses the `react` and `tailwindcss` plugins and defines a path alias `@` → project root. Hot Module Replacement (HMR) can be disabled by setting `DISABLE_HMR=true`.

## Vercel Deployment

Vercel configuration lives in `vercel.json`:

- `buildCommand`: `npm run build`
- `outputDirectory`: `dist`
- `framework`: `vite`
- Rewrite: source `/api/stylist/(.*)` → destination `/api/$1`

The rewrite strips the `/api/stylist` prefix so requests reach the serverless functions in `api/`:

| Serverless function | Endpoint |
| --- | --- |
| `api/analyze-and-outfit.ts` | `/api/stylist/analyze-and-outfit` |
| `api/generate-flatlay.ts` | `/api/stylist/generate-flatlay` |
| `api/edit-flatlay.ts` | `/api/stylist/edit-flatlay` |
| `api/chat.ts` | `/api/stylist/chat` |

Each function exports `default async function handler(req, res)`.

### Environment Variables

Set `GEMINI_API_KEY` in the Vercel project environment variables (**Project Settings → Environment Variables**).

## Kubernetes Deployment (Kustomize + Istio + ArgoCD)

### Base Manifests (`k8s/base/`)

| File | Description |
| --- | --- |
| `deployment.yaml` | App `virtual-stylist`, image `virtual-stylist:latest`, Istio sidecar injected, containerPort 3000. Resources: requests 100m CPU / 128Mi memory, limits 500m / 512Mi. Liveness and readiness probes on `/health` port 3000. Environment from secretRef `virtual-stylist-secrets` and configMapRef `virtual-stylist-config`. |
| `service.yaml` | ClusterIP service, port 80 → targetPort 3000 |
| `virtualservice.yaml` | Istio VirtualService for host `virtual-stylist.com`, routing to service `virtual-stylist` port 80 |
| `secrets.yaml` | Secret `virtual-stylist-secrets` with `stringData` placeholders: `GEMINI_API_KEY: "REPLACE_ME"`, `APP_URL: "REPLACE_ME"` |
| `configmap.yaml` | ConfigMap `virtual-stylist-config` |
| `gateway.yaml` | Istio Gateway |

`kustomization.yaml` lists all six resources.

### Environment Overlays (`k8s/overlays/`)

| Overlay | Namespace | Image tag | Host | Extras |
| --- | --- | --- | --- | --- |
| `dev` | `virtual-stylist` | `dev` | `virtual-stylist.com` | — |
| `uat` | `virtual-stylist-uat` | `uat` | `virtual-stylist-uat.com` | — |
| `prod` | `virtual-stylist-prod` | `prod` | `virtual-stylist-prod.com` | `hpa.yaml` (Horizontal Pod Autoscaler) |

Each overlay patches the deployment, gateway, and virtualservice for its environment.

### ArgoCD (`k8s/argocd/`)

ArgoCD Application manifests for each environment (`virtual-stylist-dev.yaml`, `virtual-stylist-uat.yaml`, `virtual-stylist-prod.yaml`), pointing at `https://github.com/Abdulrahman-Ayman-Farid/Virtual-Stylist.git` with:

- `path`: `k8s/overlays/<env>`
- `targetRevision`: `main`
- Automated sync with `prune` and `selfHeal` enabled
- `CreateNamespace=true`

The root `k8s/kustomization.yaml` bridges to `overlays/dev`.

### Commands

```bash
# Preview rendered manifests for an environment
kustomize build k8s/overlays/dev

# Apply via ArgoCD Application manifest
kubectl apply -f k8s/argocd/virtual-stylist-dev.yaml

# Or apply rendered manifests directly
kustomize build k8s/overlays/dev | kubectl apply -f -
```

Reference [`k8s/base/SECRETS.md`](../k8s/base/SECRETS.md) for filling in secret values and the rotation procedure.

## Health Checks

`GET /health` returns `{"status":"ok"}` with HTTP 200. It is used by the Kubernetes liveness probe (initialDelay 15s, period 30s) and readiness probe (initialDelay 5s, period 10s), as well as other orchestrators.
