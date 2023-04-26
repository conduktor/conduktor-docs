---
sidebar_position: 5
title: Kubernetes
description: The below guide details how to deploy kubernetes resources to run Conduktor Platform.
---

The below guide will help you to deploy a production-ready instance of Conduktor Platform on Kubernetes.

:::info
Deployment of Conduktor Cloud on Kubernetes **is currently in public beta**. The deployment method may
change without notice, we welcome [feedback](https://product.conduktor.help/c/55-helm-chart). If you
have issues, please contact our [support](https://www.conduktor.io/contact/support/).
:::

# Helm installation

Conduktor provide a [Helm repository](https://helm.conduktor.io) containing a chart that will deploy the Conduktor Platform using the [controller pattern](https://kubernetes.io/docs/concepts/architecture/controller/). 

## Architecture
//TODO

## Requirements

* Kubernetes Cluster 1.16+ ([setup a local cluster](https://k3d.io/v5.4.9/#installation))[^1]
    * A namespace with a [minimal role](#minimal-role-rules)
* Kubectl ([install](https://kubernetes.io/docs/tasks/tools/#kubectl))
* Helm 3.1.0+ ([install](https://helm.sh/docs/intro/install/))
* Basic knowledge of Kubernetes

## Versions compatibility matrix

Because Conduktor Platform, Platform-Controller and it's Helm chart have different version, please consult following version compatibility table to know what version of the chart deploy what version of the Conduktor Platform.

| Conduktor Platform | Platform-controller | Helm chart |
|--------------------|---------------------|------------|
| 1.11.1             | 0.4.0               | 0.2.1      |
| 1.11.1             | 0.5.0               | 0.2.2      |
| 1.11.1             | 0.5.0               | 0.2.3      |
| 1.11.1             | 0.6.0               | 0.2.4      |
| 1.12.1             | 0.7.0               | 0.2.5      |
| 1.13.0             | 0.8.0               | 0.3.0      |
| 1.14.0             | 0.9.0               | 0.4.0      |

## Getting started

### Setup Conduktor Helm repository

Configure helm in order to recognize **Conduktor Repository**, you only have to do this step once.

```shell
helm repo add conduktor https://helm.conduktor.io
helm repo update
```

### Install platform controller chart
Make you configured `kubectl` with the proper context. You can deploy the **helm chart** which will create
a platform with an **external database** 
(from [bitnami](https://github.com/bitnami/charts/tree/main/bitnami/postgresql)).

```shell
export NAMESPACE=conduktor
export RELEASE_NAME=platform
export ORGANIZATION="MyOrganization"
export ADMIN_EMAIL="admin@my.org"
export ADMIN_PASSWORD="changeMe"

helm install -n ${NAMESPACE} --create-namespace \
    ${RELEASE_NAME} conduktor/platform-controller \
   --set platform.config.organization=${ORGANIZATION} \
   --set platform.config.adminEmail=${ADMIN_EMAIL} \
   --set platform.config.adminPassword=${ADMIN_PASSWORD}
```

Once deployed, you will be able to access the platform on [localhost](localhost) by using a port-forward (you can configure an ingress with helm values).

```bash
kubectl port-forward deployment/platform -n ${NAMESPACE} 80:80
```

Then login using the configured credentials in `ADMIN_EMAIL` and `ADMIN_PASSWORD`

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
export ORGANIZATION="MyOrganization"
export ADMIN_EMAIL="admin@my.org"
export ADMIN_PASSWORD="changeMe"

helm install -n ${NAMESPACE} --create-namespace ${RELEASE_NAME} \
   conduktor/platform-controller \
   --set platform.config.license=${LICENSE} \
   --set platform.config.organization=${ORGANIZATION} \
   --set platform.config.adminEmail=${ADMIN_EMAIL} \
   --set platform.config.adminPassword=${ADMIN_PASSWORD}
```

#### Minimal Role rules
Platform Controller need a service account with a bind role containing the following rules to work properly.
```
  - apiGroups: ["networking.k8s.io"]
    resources: ["ingresses"]
    verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
  - apiGroups: ["apps"]
    resources: ["deployments"]
    verbs: ["create", "delete", "get", "list", "patch", "update", "watch"]
  - apiGroups: [""]
    resources: ["services", "pods", "configmaps"]
    verbs: ["create", "delete", "get", "list", "patch", "update", "watch"]
```
By default this service account and role will be created by the chart. 
It can be disabled with `controller.serviceAccount.create` value. In this case you should also provide an already existing service account using `controller.serviceAccount.name` value.

[^1]: You don't have to be administrator of the cluster, but your should be able to create new resources in a namespace.
