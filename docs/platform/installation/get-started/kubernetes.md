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

export ADMIN_EMAIL="<your_admin_email>"
export ADMIN_PASSWORD="<your_admin_password>"
export ORG_NAME="<your_org_name>"

# Deploy helm chart
helm install console conduktor/console \
    --create-namespace -n conduktor \
    --set config.organization.name="${ORG_NAME}" \
    --set config.admin.email="${ADMIN_EMAIL}" \
    --set config.admin.password="${ADMIN_PASSWORD}" \
    --set config.database.password="${POSTGRES_PASSWORD}" \
    --set config.database.username="${POSTGRES_USER}" \
    --set config.database.host="${POSTGRES_HOST}" \
    --set config.license="${LICENSE}" # can be omitted if deploying the free tier
    
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

* To setup an [external PostgreSQL (13+) database](../../configuration/database.md) with appropriate backup policy
* To setup an [external S3 Bucket](../../configuration/env-variables.md#monitoring-properties)
* Enough resources to run Conduktor with the [recommended configuration](../hardware.md#hardware-requirements)

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
    name: "<your_org_name>"

  admin:
    email: "<your_admin_email>"
    password: "<your_admin_password>"

  database:
    host: '<postgres_host>'
    port: 5432
    name: '<postgres_database>'
    username: '<postgres_username>'
    password: '<postgres_password>'
    
  # HERE you can paste the console configuration (under the config key)
  # Ref: https://docs.conduktor.io/platform/configuration/env-variables/
```

Install the chart on your cluster:

```shell
helm install console conduktor/console \
    --create-namespace -n conduktor \
    --values values.yaml \
    --set config.license="${LICENSE}" # can be omitted if deploying the free tier
``` 

Once deployed, you will be able to access Conduktor on 
[localhost:8080](localhost:8080) by using a port-forward. You can also 
configure an ingress to make the console available externally, check out our 
[snippets](#snippets).

```bash
kubectl port-forward deployment/console -n ${NAMESPACE} 8080:8080
```

## Configure the platform

### Fresh install

You can configure the platform by inserting into the `config` section of the
`values.yaml` file the configuration of platform you want to apply. You can 
find available configuration in the [configuration section](../../configuration/env-variables.md)


### Based on a docker configuration

If you already have a configuration file that you were using within docker,
you can use it by giving it to the helm chart with the following command:

```shell
# values.yaml
config:
  organization:
    name: "<your_org_name>"

  admin:
    email: "<your_admin_email>"
    password: "<your_admin_password>"
    
  database:
    host: '<postgres_host>'
    port: 5432
    name: '<postgres_database>'
    username: '<postgres_username>'
    password: '<postgres_password>'
    
  # HERE you can paste the platform configuration (under the config key)
  # Ref: https://docs.conduktor.io/platform/configuration/env-variables/
```

### Provide the license as secret

We expect the secret to contain a key named `license` which contains your 
license key.

```shell
# values.yaml
config:
  organization:
    name: "<your_org_name>"

  admin:
    email: "<your_admin_email>"
    password: "<your_admin_password>"
    
  database:
    host: '<postgres_host>'
    port: 5432
    name: '<postgres_database>'
    username: '<postgres_username>'
    password: '<postgres_password>'

  existingLicenseSecret: "<your_secret_name>"
```

## Snippets

Please refer to our helm chart [README](https://github.com/conduktor/conduktor-public-charts/blob/main/charts/console/README.md#snippets)
for config snippets.