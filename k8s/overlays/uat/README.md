# UAT Overlay

## Overview

The `uat` overlay deploys the Virtual Stylist application to the User Acceptance Testing (UAT) environment. It builds on the shared base manifests (`../../base`) and applies environment-specific patches for the deployment, Istio Gateway, and VirtualService. UAT is used for pre-release validation before changes are promoted to production.

## Configuration

| Setting        | Value                     |
| -------------- | ------------------------- |
| Namespace      | `virtual-stylist-uat`     |
| Hostname       | `virtual-stylist-uat.com` |
| TLS Credential | `virtual-stylist-tls-uat` |
| Image Tag      | `uat`                     |

## Patches Applied

- `deployment-patch.yaml` — environment-specific Deployment settings
- `gateway-patch.yaml` — sets the Istio Gateway host to `virtual-stylist-uat.com` and the TLS credentialName to `virtual-stylist-tls-uat`
- `virtualservice-patch.yaml` — sets the VirtualService host to `virtual-stylist-uat.com`

## Rendering

Preview the rendered manifests before applying:

```bash
kustomize build k8s/overlays/uat
```

Apply directly with kubectl:

```bash
kustomize build k8s/overlays/uat | kubectl apply -f -
```
