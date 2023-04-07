---
sidebar_position: 5
title: Kubernetes
description: The below guide details how to deploy kubernetes resources to run Conduktor Platform.
---

The below guide will help you to deploy a production-ready instance of Conduktor Platform on
Kubernetes.

:::info
Deployment of Conduktor Cloud on Kubernetes **is currently in public beta**. The deployment method may
change without notice, we welcome [feedbacks](https://product.conduktor.help/c/55-helm-chart). If you
have issues, please contact our [support](https://www.conduktor.io/contact/support/).
:::

## Requirements

* Kubernetes Cluster 1.16+ ([setup a local cluster](https://k3d.io/v5.4.9/#installation))[^1]
* Kubectl ([install](https://kubernetes.io/docs/tasks/tools/#kubectl))
* Helm 3.1.0+ ([install](https://helm.sh/docs/intro/install/))
* Basic knowledge of Kubernetes

## Getting started

Configure helm in order to recognize **Conduktor Repository**, you only have to do this step once.

```shell
helm repo add conduktor https://helm.conduktor.io
helm repo update
```

Make you configured `kubectl` with the proper context. You can deploy the **helm chart** which will create
a platform with an **external database** 
(from [bitnami](https://github.com/bitnami/charts/tree/main/bitnami/postgresql)).

```shell
export NAMESPACE=conduktor
export RELEASE_NAME=platform

helm install -n ${NAMESPACE} --create-namespace \
    ${RELEASE_NAME} conduktor/platform-controller
```

Once deployed, you will be able to access the platform on [localhost](localhost) by using a port-forward (you can configure an ingress with helm values).

```bash
kubectl port-forward deployment/platform -n ${NAMESPACE} 80:10000
```

**Default credentials** are `admin@conduktor.io` / `admin`

### Custom deployment

You can customize values of the helm chart in order to match your setup. You can learn about
available values in the [helm chart documentation](https://helm.conduktor.io/platform-controller/#parameters).

Due to the specificities of the helm chart (see 
[Architecture](https://helm.conduktor.io/platform-controller/#architecture)), based on the controller 
version used, it will deploy a specific version of the platform 
(see [compatibility matrix](https://helm.conduktor.io/platform-controller/#versions-matrix)).

### Enterprise license

```bash
export NAMESPACE=conduktor
export RELEASE_NAME=platform

export LICENSE="..."
export ORGANIZATION_NAME="MyOrganization"
export ADMIN_EMAIL="admin@my.org"
export ADMIN_PASSWORD="changeMe"

helm install -n ${NAMESPACE} --create-namespace ${RELEASE_NAME} \
   conduktor/platform-controller \
   --set platform.config.license=${LICENSE} \
   --set platform.config.organization=${ORGANIZATION_NAME} \
   --set platform.config.adminEmail=${ADMIN_EMAIL} \
   --set platform.config.adminPassword=${ADMIN_PASSWORD}
```

[^1]: You don't have to be administrator of the cluster, but your should be able to create new resources in a namespace.
