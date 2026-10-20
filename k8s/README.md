# Kubernetes Deployment — Virtual-Stylist

## Overview

This directory contains the Kubernetes manifests for deploying **Virtual-Stylist** across three environments (`dev`, `uat`, `prod`) using [Kustomize](https://kustomize.io/) overlays. A shared `base/` defines the common workload, and each overlay patches it for its environment. Deployment is handled either directly with `kubectl apply -k` or declaratively via ArgoCD Applications. Traffic routing relies on Istio (Gateway + VirtualService), with sidecar injection enabled on the workload.

## Repository layout

```text
k8s/
├── kustomization.yaml          # Root bridge Kustomization; resources list contains only
│                               #   `overlays/dev` (dev is the default render target)
├── base/                       # Shared manifests common to all environments
│   ├── kustomization.yaml      # Resources: deployment.yaml, service.yaml, configmap.yaml,
│   │                           #   secrets.yaml, gateway.yaml, virtualservice.yaml
│   ├── deployment.yaml         # App `virtual-stylist`, image `virtual-stylist:latest`,
│   │                           #   containerPort 3000, Istio sidecar injection
│   │                           #   (`sidecar.istio.io/inject: "true"`, label
│   │                           #   `istio.io/rev: default`), envFrom secretRef
│   │                           #   `virtual-stylist-secrets` + configMapRef
│   │                           #   `virtual-stylist-config`, resource requests 100m/128Mi,
│   │                           #   limits 500m/512Mi, liveness/readiness probes on /health:3000,
│   │                           #   replicas 1
│   ├── service.yaml            # ClusterIP Service for the app
│   ├── configmap.yaml          # Non-sensitive configuration (`virtual-stylist-config`)
│   ├── secrets.yaml            # Secret configuration (`virtual-stylist-secrets`)
│   ├── gateway.yaml            # Istio Gateway definition
│   └── virtualservice.yaml     # Istio VirtualService routing rules
├── overlays/
│   ├── dev/                    # Dev overlay (namespace `virtual-stylist`)
│   │   ├── kustomization.yaml
│   │   ├── deployment-patch.yaml
│   │   ├── gateway-patch.yaml
│   │   └── virtualservice-patch.yaml
│   ├── uat/                    # UAT overlay (namespace `virtual-stylist-uat`)
│   │   ├── kustomization.yaml
│   │   ├── deployment-patch.yaml
│   │   ├── gateway-patch.yaml
│   │   └── virtualservice-patch.yaml
│   └── prod/                   # Prod overlay (namespace `virtual-stylist-prod`)
│       ├── kustomization.yaml  # Resources: ../../base + hpa.yaml; images: virtual-stylist
│       │                       #   newTag prod
│       ├── hpa.yaml            # HorizontalPodAutoscaler (prod only)
│       ├── deployment-patch.yaml
│       ├── gateway-patch.yaml
│       └── virtualservice-patch.yaml
└── argocd/
    ├── virtual-stylist-dev.yaml    # ArgoCD Application → k8s/overlays/dev
    ├── virtual-stylist-uat.yaml    # ArgoCD Application → k8s/overlays/uat
    └── virtual-stylist-prod.yaml   # ArgoCD Application → k8s/overlays/prod
```

## Prerequisites

- **kubectl** — to apply manifests and inspect the cluster
- **kustomize** (or `kubectl apply -k`, which bundles Kustomize) — to render overlays
- **ArgoCD** — if using GitOps-based deployment via the manifests in `k8s/argocd/`
- **Istio** installed in the cluster, with Gateway/VirtualService routing available — the workload is annotated for sidecar injection (`sidecar.istio.io/inject: "true"`, label `istio.io/rev: default`)

## Rendering manifests

Render any overlay locally to inspect the final output:

```bash
# Dev (default target)
kustomize build k8s/overlays/dev

# UAT
kustomize build k8s/overlays/uat

# Prod
kustomize build k8s/overlays/prod
```

> **Note:** the root `k8s/kustomization.yaml` references only `overlays/dev`, so `kustomize build k8s` (or `kubectl apply -k k8s`) defaults to rendering the **dev** environment.

## Applying manifests

Apply an overlay directly with `kubectl apply -k`:

```bash
# Dev
kubectl apply -k k8s/overlays/dev

# UAT
kubectl apply -k k8s/overlays/uat

# Prod
kubectl apply -k k8s/overlays/prod
```

## ArgoCD

Each environment has an ArgoCD `Application` manifest in `k8s/argocd/` pointing at the corresponding Kustomize overlay in this repository (e.g. the dev app uses `repoURL https://github.com/Abdulrahman-Ayman-Farid/Virtual-Stylist.git`, `path k8s/overlays/dev`, `targetRevision main`, destination namespace `virtual-stylist`).

Apply the Application manifests to register the apps with ArgoCD:

```bash
kubectl apply -f k8s/argocd/virtual-stylist-dev.yaml
kubectl apply -f k8s/argocd/virtual-stylist-uat.yaml
kubectl apply -f k8s/argocd/virtual-stylist-prod.yaml
```

Sync behavior (as configured in the dev Application, and mirrored by the other environments):

- **Automated sync** is enabled (`syncPolicy.automated`)
- **Prune** and **selfHeal** are enabled, so drift is corrected and removed resources are pruned
- **`CreateNamespace=true`** sync option is set, so the destination namespace is created automatically

## Environments

| Environment | Namespace              | Domain                  | TLS secret                | Image tag        |
|-------------|------------------------|-------------------------|---------------------------|------------------|
| dev         | `virtual-stylist`      | `virtual-stylist.com`   | `virtual-stylist-tls-dev` | `dev` (overlay `images` newTag) |
| uat         | `virtual-stylist-uat`  | `virtual-stylist-uat.com` | `virtual-stylist-tls-uat` | `uat` (overlay `images` newTag) |
| prod        | `virtual-stylist-prod` | `virtual-stylist-prod.com` | `virtual-stylist-tls-prod` | `prod` (overlay `images` newTag) |

## Health checks

The application exposes a health endpoint at **`/health` on port 3000**, used by both probes defined in `k8s/base/deployment.yaml`:

| Probe         | Path      | Port | initialDelaySeconds | periodSeconds |
|---------------|-----------|------|---------------------|---------------|
| livenessProbe | `/health` | 3000 | 15                  | 30            |
| readinessProbe| `/health` | 3000 | 5                   | 10            |

## Notes

- **HPA (prod only):** `k8s/overlays/prod/hpa.yaml` is the only overlay that includes a HorizontalPodAutoscaler; it is listed as an additional resource in the prod `kustomization.yaml` alongside `../../base`.
- **Configuration injection:** `secrets.yaml` and `configmap.yaml` live in `k8s/base/` and define `virtual-stylist-secrets` and `virtual-stylist-config`. The container consumes them via `envFrom` (secretRef + configMapRef), so all keys are injected as environment variables.
- **Istio:** the pod template carries `sidecar.istio.io/inject: "true"` and the label `istio.io/rev: default`, so an Istio sidecar is injected into every replica; ingress traffic is handled by the base Gateway/VirtualService, patched per environment for the domain and TLS secret listed above.
