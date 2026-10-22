# Operational Runbook — Virtual-Stylist

## Overview

This runbook covers day-to-day operations for the **Virtual-Stylist** Kubernetes deployment across the three environments (`dev`, `uat`, `prod`), including image rollouts, validation, rollout checks, health checks, and troubleshooting.

## Deploying a new image tag

1. Edit the `images:` field in the environment's Kustomization to set a new `newTag`:

   ```bash
   # k8s/overlays/dev/kustomization.yaml
   # k8s/overlays/uat/kustomization.yaml
   # k8s/overlays/prod/kustomization.yaml
   ```

   ```yaml
   images:
     - name: virtual-stylist
       newTag: <new-tag>
   ```

2. Commit and push the change:

   ```bash
   git add k8s/overlays/<env>/kustomization.yaml
   git commit -m "chore: bump virtual-stylist image tag to <new-tag> (<env>)"
   git push
   ```

3. ArgoCD auto-syncs the change (automated sync with `prune: true` and `selfHeal: true`), or apply manually:

   ```bash
   kubectl apply -k k8s/overlays/<env>
   ```

> **Note:** the base deployment uses the image `virtual-stylist:latest`; the prod overlay pins `newTag: prod`.

## Validating with kustomize build

Render any overlay locally to inspect the final manifests before applying:

```bash
# Dev (default target)
kustomize build k8s/overlays/dev

# UAT
kustomize build k8s/overlays/uat

# Prod
kustomize build k8s/overlays/prod
```

> **Note:** the root `k8s/kustomization.yaml` references only `overlays/dev`, so `kustomize build k8s` defaults to rendering the **dev** environment.

## Checking rollout status

```bash
# Rollout status (namespace depends on environment)
kubectl rollout status deployment/virtual-stylist -n virtual-stylist       # dev
kubectl rollout status deployment/virtual-stylist -n virtual-stylist-uat   # uat
kubectl rollout status deployment/virtual-stylist -n virtual-stylist-prod  # prod

# Pods
kubectl get pods -n <namespace>

# Pod details (events, probe failures, scheduling issues)
kubectl describe pod <pod-name> -n <namespace>
```

## Checking the /health endpoint

The liveness and readiness probes hit `/health` on containerPort `3000`.

Check locally with port-forwarding:

```bash
kubectl port-forward deployment/virtual-stylist 3000:3000 -n <namespace>
curl http://localhost:3000/health
```

Or via the Istio Gateway host for the environment:

```bash
# Dev
curl http://virtual-stylist.com/health

# UAT
curl http://virtual-stylist-uat.com/health

# Prod
curl http://virtual-stylist-prod.com/health
```

## Troubleshooting CrashLoopBackOff

1. Identify the failing pods:

   ```bash
   kubectl get pods -n <namespace>
   ```

2. Check the logs from the previous (crashed) container:

   ```bash
   kubectl logs <pod-name> -n <namespace> --previous
   ```

3. Inspect pod events and container state:

   ```bash
   kubectl describe pod <pod-name> -n <namespace>
   ```

   Look for:
   - **Probe failures** — liveness/readiness probes on `/health:3000` failing (app not listening yet or crashing on startup)
   - **OOMKilled** — the container exceeded its limits (`500m` CPU / `512Mi` memory)

4. Check secret/configmap references — the deployment uses `envFrom` with secretRef `virtual-stylist-secrets` and configMapRef `virtual-stylist-config`; missing or invalid references will prevent the container from starting:

   ```bash
   kubectl get secret virtual-stylist-secrets -n <namespace>
   kubectl get configmap virtual-stylist-config -n <namespace>
   ```

5. Check the ArgoCD sync status — a failed or out-of-sync application may indicate a bad manifest or a stuck rollout:

   ```bash
   argocd app get virtual-stylist-<env>
   ```

6. Check Istio sidecar issues — the workload is annotated for sidecar injection (`sidecar.istio.io/inject: "true"`); a missing or misconfigured sidecar can cause networking/probe failures:

   ```bash
   kubectl get pod <pod-name> -n <namespace> -o jsonpath='{.spec.containers[*].name}'
   kubectl logs <pod-name> -n <namespace> -c istio-proxy
   ```
