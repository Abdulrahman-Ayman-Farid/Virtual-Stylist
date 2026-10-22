# ArgoCD Applications — Virtual-Stylist

## Overview

This directory contains three ArgoCD `Application` manifests, one per environment (`dev`, `uat`, `prod`). Each Application points at the corresponding Kustomize overlay in this repository and deploys it declaratively into its own namespace. All three use automated sync with pruning and self-healing, so the cluster state continuously converges to what is defined in Git.

## Comparison

| App name | File | Path | Destination namespace | Server | Target revision | Sync policy |
|---|---|---|---|---|---|---|
| `virtual-stylist-dev` | `virtual-stylist-dev.yaml` | `k8s/overlays/dev` | `virtual-stylist` | `https://kubernetes.default.svc` | `main` | automated, prune: true, selfHeal: true |
| `virtual-stylist-uat` | `virtual-stylist-uat.yaml` | `k8s/overlays/uat` | `virtual-stylist-uat` | `https://kubernetes.default.svc` | `main` | automated, prune: true, selfHeal: true |
| `virtual-stylist-prod` | `virtual-stylist-prod.yaml` | `k8s/overlays/prod` | `virtual-stylist-prod` | `https://kubernetes.default.svc` | `main` | automated, prune: true, selfHeal: true |

All three manifests share the following common configuration:

- `apiVersion: argoproj.io/v1alpha1`
- `kind: Application`
- `project: default`
- `repoURL: https://github.com/Abdulrahman-Ayman-Farid/Virtual-Stylist.git`
- `targetRevision: main`
- `destination.server: https://kubernetes.default.svc` (in-cluster)
- `syncPolicy.automated` with `prune: true` and `selfHeal: true`
- `syncOptions: CreateNamespace=true` (the destination namespace is created automatically if missing)

## Applications

### virtual-stylist-dev (`virtual-stylist-dev.yaml`)

Deploys the dev overlay (`k8s/overlays/dev`) into the `virtual-stylist` namespace.

### virtual-stylist-uat (`virtual-stylist-uat.yaml`)

Deploys the UAT overlay (`k8s/overlays/uat`) into the `virtual-stylist-uat` namespace.

### virtual-stylist-prod (`virtual-stylist-prod.yaml`)

Deploys the prod overlay (`k8s/overlays/prod`) into the `virtual-stylist-prod` namespace.

## Applying the manifests

Register the Applications with ArgoCD by applying them to the cluster:

```bash
kubectl apply -f k8s/argocd/virtual-stylist-dev.yaml
kubectl apply -f k8s/argocd/virtual-stylist-uat.yaml
kubectl apply -f k8s/argocd/virtual-stylist-prod.yaml
```

Once applied, ArgoCD will automatically sync each app from the `main` branch of the repository.

## Known limitations

- `argocd/virtual-stylist-prod.yaml` was flagged in a previous run as having a **mismatched `repoURL`** pending cleanup. As of the current file contents, the `repoURL` matches the other two apps (`https://github.com/Abdulrahman-Ayman-Farid/Virtual-Stylist.git`), but the manifest **remains flagged for verification/cleanup** — double-check it before relying on it in production.
