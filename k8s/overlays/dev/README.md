# Dev Overlay

## Overview

The `dev` overlay deploys the Virtual Stylist application to the development environment. It builds on the shared base manifests (`../../base`) and applies environment-specific patches for the deployment, Istio Gateway, and VirtualService. This is the first stop for every change before promotion to UAT and production.

## Configuration

| Setting        | Value                    |
| -------------- | ------------------------ |
| Namespace      | `virtual-stylist`        |
| Hostname       | `virtual-stylist.com`    |
| TLS Credential | `virtual-stylist-tls-dev`|
| Image Tag      | `dev`                    |

## Patches Applied

- `deployment-patch.yaml` — environment-specific Deployment settings
- `gateway-patch.yaml` — sets the Istio Gateway host to `virtual-stylist.com` and the TLS credentialName to `virtual-stylist-tls-dev`
- `virtualservice-patch.yaml` — sets the VirtualService host to `virtual-stylist.com`

## Rendering

Preview the rendered manifests before applying:

```bash
kustomize build k8s/overlays/dev
```

Apply directly with kubectl:

```bash
kustomize build k8s/overlays/dev | kubectl apply -f -
```
