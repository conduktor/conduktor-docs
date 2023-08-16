---
sidebar_position: 5
title: Kubernetes
description: The below guide details how to deploy kubernetes resources to run Conduktor.
---

The below guide will help you to deploy a production-ready instance of Conduktor on Kubernetes.

:::info
We welcome contributions and feedback, if you have issues, you can either 
open an issue on our [GitHub repository](https://github.com/conduktor/conduktor-public-charts/issues)
or contact our [support](https://www.conduktor.io/contact/support/).
:::

# Helm chart installation

Conduktor provides a [Helm repository](https://helm.conduktor.io) containing a 
chart that will deploy Conduktor Platform on your Kubernetes cluster.

## TL;DR

We do not provide any relational database dependency, you will have to provide
your own database. Check our 
[**production requirements**](#production-requirements) section for more 
information.

Check our [Snippets](#snippets) section for more examples.

```shell
# Setup Helm repository
helm repo add conduktor https://helm.conduktor.io
helm repo update

# Deploy helm chart
helm install console conduktor/console \
    --create-namespace -n conduktor \
    --set config.organization.name="my-org" \
    --set config.admin.email="admin@my-org.com" \
    --set config.admin.password="admin" \
    --set config.database.password="${POSTGRES_PASSWORD}" \
    --set config.database.username="${POSTGRES_USER}" \
    --set config.database.host="${POSTGRES_HOST}" \
    --set license="${LICENSE}"
    
# Port forward to access the platform
kubectl port-forward deployment/console -n ${NAMESPACE} 8080:8080
open http://localhost:8080
```

## General requirements

* Kubernetes Cluster 1.19+ ([setup a local cluster](https://k3d.io/#installation))[^1]
* Kubectl ([install](https://kubernetes.io/docs/tasks/tools/#kubectl)) with proper kube context configured
* Helm 3.1.0+ ([install](https://helm.sh/docs/intro/install/))
* Basic knowledge of Kubernetes

## Production requirements
For production environments, this is  **mandatory**:

* To setup an [external PostgreSQL (13+) database](../../configuration/database.md) with appropriate backup policy and disable the dependency on Bitnami PostgreSQL with `postgresql.enabled=false`
* To setup an [external S3 Bucket](#setup-s3) and disable the dependency on Bitnami MinIO with `minio.enabled=false`
* Enough resources to run Conduktor and its dependencies (PostgreSQL, MinIO, Kafka) with the [recommended configuration](../hardware.md#hardware-requirements)

## Getting started

### Setup Helm repository

```shell
helm repo add conduktor https://helm.conduktor.io
helm repo update
```

### Install the Console Chart

Configure the platform with the following values:

```shell
# values.yaml
config:
  organization:
    name: "my-org"

  admin:
    email: "admin@my-org.com"
    password: "admin"

  database:
    host: '${POSTGRES_HOST}'
    port: 5432
    name: '${POSTGRES_DATABASE}'
    username: '${POSTGRES_USERNAME}'
    password: '${POSTGRES_PASSWORD}'
    
  # HERE you can paste the console configuration
  # Ref: https://docs.conduktor.io/platform/configuration/env-variables/
```

Install the chart on your cluster:

```shell
helm install console conduktor/console \
    --create-namespace -n conduktor \
    --values values.yaml \
    --set license="${LICENSE}"
```

Once deployed, you will be able to access Conduktor on 
[localhost:8080](localhost:8080) by using a port-forward 
(you can also configure an [ingress](#install-with-an-ingress) with helm values).

```bash
kubectl port-forward deployment/console -n ${NAMESPACE} 8080:8080
```

## Snippets

### Install with an enterprise license

```yaml
config:
  organization:
    name: "my-org"

  admin:
    email: "admin@my-org.com"
    password: "admin"

  database:
    host: ''
    port: 5432
    name: 'postgres'
    username: ''
    password: ''

  license: "${ENTERPRISE_LICENSE}"
```    

### Install with a PodAffinity

```yaml
config:
  organization:
    name: "my-org"

  admin:
    email: "admin@my-org.com"
    password: "admin"

  database:
    host: ''
    port: 5432
    name: 'postgres'
    username: ''
    password: ''

platform:
  affinity:
    podAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        - labelSelector:
            matchExpressions:
              - key: security
                operator: In
                values:
                  - S1
          topologyKey: topology.kubernetes.io/zone
```

### Install with a toleration

```yaml
config:
  organization:
    name: "my-org"

  admin:
    email: "admin@my-org.com"
    password: "admin"

  database:
    host: ''
    port: 5432
    name: 'postgres'
    username: ''
    password: ''

  platform:
    external:
      url: "https://platform.local"
    https:
      selfSigned: true
platform:
  tolerations:
    - key: "donotschedule"
      operator: "Exists"
      effect: "NoSchedule"
```

### Install with Self-Signed TLS certificate

```yaml
config:
  organization:
    name: "my-org"

  admin:
    email: "admin@my-org.com"
    password: "admin"

  database:
    host: ''
    port: 5432
    name: 'postgres'
    username: ''
    password: ''

  platform:
    external:
      url: "https://platform.local"
    https:
      selfSigned: true
```

### Install with a custom TLS certificate on the platform Pod

```yaml
config:
  organization:
    name: "my-org"

  admin:
    email: "admin@my-org.com"
    password: "admin"

  database:
    host: ''
    port: 5432
    name: 'postgres'
    username: ''
    password: ''

  platform:
    external:
      url: "https://platform.local"
    https:
      selfSigned: false
      existingSecret: "platform-tls"
ingress:
  secrets:
    - name: platform-tls
      certificate: |-
        -----BEGIN CERTIFICATE-----
        ...
        -----END CERTIFICATE-----
      key: |-
        -----BEGIN PRIVATE KEY-----
        ...
        -----END PRIVATE KEY-----
```

### Install with a custom service account

```yaml
config:
  organization:
    name: "my-org"

  admin:
    email: "admin@my-org.com"
    password: "admin"

  database:
    host: ''
    port: 5432
    name: 'postgres'
    username: ''
    password: ''

serviceAccount:
  create: false
  name: "my-service-account"
```

### Install with a AWS EKS IAM Role

```yaml
config:
  organization:
    name: "my-org"

  admin:
    email: "admin@my-org.com"
    password: "admin"

  database:
    host: ''
    port: 5432
    name: 'postgres'
    username: ''
    password: ''

serviceAccount:
    annotations:
        eks.amazonaws.com/role-arn: "arn:aws:iam::123456789012:role/my-role"
```

### Install with an Ingress

```yaml
config:
  organization:
    name: "my-org"

  admin:
    email: "admin@my-org.com"
    password: "admin"

  database:
    host: ''
    port: 5432
    name: 'postgres'
    username: ''
    password: ''

  ingress:
    enabled: true
    pathType: "Prefix"
    hostname: platform.my-org.local
    # Replace with your ingress Class Name
    ingressClassName: "nginx"
```