# Prod Overlay

## Overview

The `prod` overlay deploys the Virtual Stylist application to the production environment. It builds on the shared base manifests (`../../base`) plus an additional `hpa.yaml` resource for horizontal pod autoscaling, and applies environment-specific patches for the deployment, Istio Gateway, and VirtualService.

## Configuration

| Setting        | Value                      |
| -------------- | -------------------------- |
| Namespace      | `virtual-stylist-prod`     |
| Hostname       | `virtual-stylist-prod.com` |
| TLS Credential | `virtual-stylist-tls-prod` |
| Image Tag      | `prod`                     |

## Patches Applied

- `deployment-patch.yaml` — environment-specific Deployment settings
- `gateway-patch.yaml` — sets the Istio Gateway host to `virtual-stylist-prod.com` and the TLS credentialName to `virtual-stylist-tls-prod`
- `virtualservice-patch.yaml` — sets the VirtualService host to `virtual-stylist-prod.com`

In addition to the base resources, this overlay includes `hpa.yaml`, which defines a HorizontalPodAutoscaler for production scaling. This resource is unique to the prod overlay.

## Rendering

Preview the rendered manifests before applying:

```bash
kustomize build k8s/overlays/prod
```

Apply directly with kubectl:

```bash
kustomize build k8s/overlays/prod | kubectl apply -f -
```
