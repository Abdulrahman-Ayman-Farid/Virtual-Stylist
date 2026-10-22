# Virtual-Stylist Secrets

## Overview

`k8s/base/secrets.yaml` defines a Kubernetes Secret named **`virtual-stylist-secrets`** (type `Opaque`) consumed by the Virtual-Stylist app (React/Vite frontend + `server.ts` backend). The manifest is part of the Kustomize base (`k8s/base`) and is rendered into each environment overlay (`dev`, `uat`, `prod`) and deployed via ArgoCD (`k8s/argocd/`).

Both values are currently set to the placeholder `"REPLACE_ME"`. Placeholders are used so the manifest can be safely committed to Git and applied by ArgoCD without leaking real credentials — real values are injected directly into the cluster, never into the repository.

## Required Keys

| Key | Description |
| --- | --- |
| `GEMINI_API_KEY` | API key used by the backend (`server.ts`) to authenticate against the Gemini API. |
| `APP_URL` | Public/base URL of the deployed application (used for callbacks, links, and CORS). |

## How to Fill In Values

Apply real values directly in each environment's namespace. Namespaces per environment:

- dev → `virtual-stylist`
- uat → `virtual-stylist-uat`
- prod → `virtual-stylist-prod`

**Option A — create/replace the secret imperatively:**

```bash
kubectl create secret generic virtual-stylist-secrets \
  --namespace virtual-stylist \
  --from-literal=GEMINI_API_KEY='<real-key>' \
  --from-literal=APP_URL='<real-url>' \
  --dry-run=client -o yaml | kubectl apply -f -
```

Repeat with `--namespace virtual-stylist-uat` and `--namespace virtual-stylist-prod` for the other environments.

**Option B — edit the existing secret:**

```bash
kubectl edit secret virtual-stylist-secrets -n virtual-stylist
```

Replace the `REPLACE_ME` values under `stringData` (values are base64-encoded automatically on save), then restart the deployment to pick up the new values:

```bash
kubectl rollout restart deployment -n virtual-stylist
```

## Security Notes

- **Never commit real credentials** to this repository. Keep `REPLACE_ME` placeholders in Git; only inject real values in the cluster.
- **GitOps flow**: ArgoCD syncs the manifests from Git. If you edit the secret in-cluster, ArgoCD may flag drift or overwrite it on sync depending on your sync policy — prefer `kubectl create secret ... --dry-run=client | kubectl apply` and consider ignoring the Secret resource in the ArgoCD application config, or manage secrets out-of-band.
- For production, consider **External Secrets Operator (ESO)** with a secrets manager (e.g., HashiCorp Vault, AWS Secrets Manager) so no secret material lives in Git or in-cluster manifests at all.

## Rotation Procedure

1. Generate a new `GEMINI_API_KEY` in the Gemini console (keep the old key valid until cutover).
2. Update the secret in each namespace:
   ```bash
   kubectl create secret generic virtual-stylist-secrets \
     --namespace virtual-stylist \
     --from-literal=GEMINI_API_KEY='<new-key>' \
     --from-literal=APP_URL='<current-url>' \
     --dry-run=client -o yaml | kubectl apply -f -
   ```
   (Repeat for `virtual-stylist-uat` and `virtual-stylist-prod`.)
3. Restart workloads to reload the secret:
   ```bash
   kubectl rollout restart deployment -n virtual-stylist
   ```
4. Verify the app is healthy, then revoke the old key in the Gemini console.
