---
sidebar_position: 2
title: Kubernetes
description: The below guide details how to deploy Kubernetes resources to run Conduktor.
---
# Kubernetes

Deploy a production-ready instance of Conduktor on Kubernetes.

:::info
We welcome contributions and feedback. If you have issues, you can either open an issue on our [GitHub repository](https://github.com/conduktor/conduktor-public-charts/issues) or [contact support](https://www.conduktor.io/contact/support/).
:::

# Helm chart installation

Conduktor provides a [Helm repository](https://helm.conduktor.io) containing a chart that will deploy Conduktor Platform on your Kubernetes cluster.

### Overview

We don't provide any relational database dependency, you will have to provide your own database. See the [production requirements](#production-requirements) for details.

Check out the [snippets](#snippets) section for more examples.

```shell
# Setup Helm repository
helm repo add conduktor https://helm.conduktor.io
helm repo update

export ADMIN_EMAIL="<your_admin_email>"
export ADMIN_PASSWORD="<your_admin_password>"
export ORG_NAME="<your_org_name>"
export NAMESPACE="<your_kubernetes_namespace>"

# Deploy Helm chart
helm install console conduktor/console \
  --create-namespace -n ${NAMESPACE} \
  --set config.organization.name="${ORG_NAME}" \
  --set config.admin.email="${ADMIN_EMAIL}" \
  --set config.admin.password="${ADMIN_PASSWORD}" \
  --set config.database.password="<your_postgres_password>" \
  --set config.database.username="<your_postgres_user>" \
  --set config.database.host="<your_postgres_host>" \
  --set config.database.port="5432" \
  --set config.license="${LICENSE}" # can be omitted if deploying the free tier
    
# Port forward to access Conduktor
kubectl port-forward deployment/console -n ${NAMESPACE} 8080:8080
open http://localhost:8080
```

## Compatibility matrix
Find out which versions of Conduktor Platform work on which version of our Conduktor Platform Helm chart.

> We recommend you use the version of Platform that comes pre-configured with the Helm chart. You can adjust the version in your values property according to the supported Platform version, if required.

> Breaking changes column only lists **changes in the Helm chart**. See Conduktor [release notes](https://docs.conduktor.io/changelog/) to determine whether there are breaking changes within the artifacts.

### Helm chart compatibility

Breaking changes:

🟡 - Breaks additional services (e.g. Grafana dashboard changes)

🔴 - Breaks overall deployment of the product (e.g. renaming variables in .values, major product releases)

| Chart version | Supported Platform version | Breaking changes |
| ------------- | ------------------------- | ---------------- |
| [console-1.17.0](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.17.0) | **1.32.0**, 1.31.2, 1.31.1, 1.31.0, 1.30.0, 1.29.2, 1.29.1, 1.29.0, 1.28.0, 1.27.1, 1.27.0, 1.26.0, 1.25.1, 1.25.0, 1.24.1, 1.24.0 | |
| [console-1.16.2](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.16.2) | **1.31.2**, 1.31.1, 1.31.0, 1.30.0, 1.29.2, 1.29.1, 1.29.0, 1.28.0, 1.27.1, 1.27.0, 1.26.0, 1.25.1, 1.25.0, 1.24.1, 1.24.0 | |
| [console-1.16.1](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.16.1) | **1.31.1**, 1.31.0, 1.30.0, 1.29.2, 1.29.1, 1.29.0, 1.28.0, 1.27.1, 1.27.0, 1.26.0, 1.25.1, 1.25.0, 1.24.1, 1.24.0 | |
| [console-1.16.0](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.16.0) | **1.31.0**, 1.30.0, 1.29.2, 1.29.1, 1.29.0, 1.28.0, 1.27.1, 1.27.0, 1.26.0, 1.25.1, 1.25.0, 1.24.1, 1.24.0 | |
| [console-1.15.0](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.15.0) | **1.30.0**, 1.29.2, 1.29.1, 1.29.0, 1.28.0, 1.27.1, 1.27.0, 1.26.0, 1.25.1, 1.25.0, 1.24.1, 1.24.0 | |
| [console-1.14.2](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.14.2) | **1.29.2**, 1.29.1, 1.29.0, 1.28.0, 1.27.1, 1.27.0, 1.26.0, 1.25.1, 1.25.0, 1.24.1, 1.24.0 | |
| [console-1.14.1](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.14.1) | **1.29.1**, 1.29.0, 1.28.0, 1.27.1, 1.27.0, 1.26.0, 1.25.1, 1.25.0, 1.24.1, 1.24.0 | |
| [console-1.14.0](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.14.0) | **1.29.0**, 1.28.0, 1.27.1, 1.27.0, 1.26.0, 1.25.1, 1.25.0, 1.24.1, 1.24.0 | |
| [console-1.13.0](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.13.0) | **1.28.0**, 1.27.1, 1.27.0, 1.26.0, 1.25.1, 1.25.0, 1.24.1, 1.24.0 | |
| [console-1.12.1](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.12.1) | **1.27.1**, 1.27.0, 1.26.0, 1.25.1, 1.25.0, 1.24.1, 1.24.0 | |
| [console-1.12.0](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.12.0) | **1.27.0**, 1.26.0, 1.25.1, 1.25.0, 1.24.1, 1.24.0 | |
| [console-1.11.0](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.11.0) | **1.26.0**, 1.25.1, 1.25.0, 1.24.1, 1.24.0 |
| [console-1.10.0](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.10.0) | **1.25.1**, 1.25.0, 1.24.1, 1.24.0 | |
| [console-1.9.1](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.9.1)   | **1.24.1**, 1.24.0 | |
| [console-1.9.0](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.9.0)   | **1.24.0** | 🔴 Changed liveness and readiness probe path [see here](https://github.com/conduktor/conduktor-public-charts/pull/80) |
| [console-1.8.1](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.8.1)   | **1.23.0**, 1.22.1, 1.22.0 | |
| [console-1.8.0](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.8.0)   | **1.23.0**, 1.22.1, 1.22.0 | |
| [console-1.7.2](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.7.2)   | **1.22.1**, 1.22.0 | 🔴 Service Monitor endpoint changes, Grafana template changes [see here](https://github.com/conduktor/conduktor-public-charts/pull/65) |
| [console-1.6.2](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.6.2)   | **1.21.3**, 1.21.2, 1.21.1, 1.21.0 | |
| [console-1.6.1](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.6.1)   | **1.21.1**, 1.21.0 | |
| [console-1.6.0](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.6.0)   | **1.21.0** | 🔴 Paths and folder changed [see here](https://github.com/conduktor/conduktor-public-charts/pull/54) |
| [console-1.5.5](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.5.5)   | **1.20.0**, 1.19.2, 1.19.1, 1.19.0, 1.18.4, 1.18.2, 1.18.1, 1.18.0, 1.17.3 | |
| [console-1.5.4](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.5.4)   | **1.20.0**, 1.19.2, 1.19.1, 1.19.0, 1.18.4, 1.18.2, 1.18.1, 1.18.0, 1.17.3 | 🟡 Updated Grafana template [see here](https://github.com/conduktor/conduktor-public-charts/pull/49) |
| [console-1.5.3](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.5.3)   | **1.20.0**, 1.19.2, 1.19.1, 1.19.0, 1.18.4, 1.18.2, 1.18.1, 1.18.0, 1.17.3 | 🟡 Updated Grafana template [see here](https://github.com/conduktor/conduktor-public-charts/pull/47) |
| [console-1.5.2](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.5.2)   | **1.20.0**, 1.19.2, 1.19.1, 1.19.0, 1.18.4, 1.18.2, 1.18.1, 1.18.0, 1.17.3 | 🟡 Updated Grafana template [see here](https://github.com/conduktor/conduktor-public-charts/pull/44) |
| [console-1.5.1](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.5.1)   | **1.20.0**, 1.19.2, 1.19.1, 1.19.0, 1.18.4, 1.18.2, 1.18.1, 1.18.0, 1.17.3 | |
| [console-1.5.0](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.5.0)   | **1.20.0**, 1.19.2, 1.19.1, 1.19.0, 1.18.4, 1.18.2, 1.18.1, 1.18.0, 1.17.3 | |
| [console-1.4.2](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.4.2)   | **1.19.2**, 1.19.1, 1.19.0, 1.18.4, 1.18.2, 1.18.1, 1.18.0, 1.17.3 | |
| [console-1.4.1](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.4.1)   | **1.19.1**, 1.19.0, 1.18.4, 1.18.2, 1.18.1, 1.18.0, 1.17.3 | |
| [console-1.4.0](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.4.0)   | **1.19.0**, 1.18.4, 1.18.2, 1.18.1, 1.18.0, 1.17.3 | |
| [console-1.3.9](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.3.9)   | **1.18.4**, 1.18.2, 1.18.1, 1.18.0, 1.17.3 | |
| [console-1.3.8](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.3.8)   | **1.18.4**, 1.18.2, 1.18.1, 1.18.0, 1.17.3 | |
| [console-1.3.7](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.3.7)   | **1.18.3**, 1.18.2, 1.18.1, 1.18.0, 1.17.3 | |
| [console-1.3.6](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.3.6)   | **1.18.2**, 1.18.1, 1.18.0, 1.17.3 | |
| [console-1.3.5](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.3.5)   | **1.18.1**, 1.18.0, 1.17.3 | |
| [console-1.3.4](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.3.4)   | **1.18.1**, 1.18.0, 1.17.3 | |
| [console-1.3.3](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.3.3)   | **1.18.1**, 1.18.0, 1.17.3 | |
| [console-1.3.2](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.3.2)   | **1.18.0**, 1.17.3 | |
| [console-1.3.1](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.3.1)   | **1.18.0**, 1.17.3 | |
| [console-1.3.0](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.3.0)   | **1.18.0**, 1.17.3 | |
| [console-1.2.4](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.2.4)   | **1.17.3** | |
| [console-1.2.3](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.2.3)   | **1.17.3** | |
| [console-1.2.2](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.2.2)   | **1.17.3** | |
| [console-1.2.1](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.2.1)   | **1.17.3** | |
| [console-1.2.0](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.2.0)   | **1.17.3** | |
| [console-1.1.4](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.1.4)   | **1.17.3** | 🔴 Fixed issue with license checksum [see here](https://github.com/conduktor/conduktor-public-charts/pull/14) |
| [console-1.1.3](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.1.3)   | **1.17.3**, 1.17.2 | |
| [console-1.1.2](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.1.2)   | **1.17.3**, 1.17.2 | |
| [console-1.1.1](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.1.1)   | **1.17.3**, 1.17.2 | |
| [console-1.1.0](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.1.0)   | **1.17.3**, 1.17.2 | |
| [console-1.0.3](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.0.3)   | **1.17.3**, 1.17.2 | |
| [console-1.0.2](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.0.2)   | **1.17.3**, 1.17.2 | |
| [console-1.0.1](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.0.1)   | **1.17.3**, 1.17.2 | |
| [console-1.0.0](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.0.0)   | **1.17.2** | |

## General requirements
* Basic knowledge of Kubernetes
* Kubernetes cluster 1.19+ ([set up a local cluster](https://k3d.io/#installation))[^1]
* Kubectl ([install](https://kubernetes.io/docs/tasks/tools/#kubectl)) with proper kube context configured
* Helm 3.1.0+ ([install](https://helm.sh/docs/intro/install/))


## Production requirements
**Mandatory for production environments**:
* To set up an [external PostgreSQL (13+) database](../../configuration/database.md) with an appropriate backup policy
* To set up an [external S3 Bucket](../../configuration/env-variables.md#monitoring-properties)
* Enough resources to run Conduktor with the [recommended configuration](../hardware.md#hardware-requirements)

### A note on TLS and URL forwarding
For production environments, we recommend to run with TLS enabled from your ingress controller and terminating on Platform.  This creates a more secure connection, while also telling Platform that it should use TLS when forwarding on any URL requests (e.g. requests to SSO providers).

Without TLS terminating on Platform itself, requests between the ingress controller and Platform will be in plain text, as will URL forwarding to your SSO provider which can lead to rejection of the request for not being secure.

## Getting started

### Setup Helm repository

```shell
helm repo add conduktor https://helm.conduktor.io
helm repo update
```

### Install the Platform chart

Configure Platform with the following values:

```yaml title="values.yaml"
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
```

Install the chart on your cluster:

```shell
helm install console conduktor/console \
  --create-namespace -n conduktor \
  --values values.yaml \
  --set config.license="${LICENSE}" # can be omitted if deploying the free tier
``` 

Once deployed, you will be able to access Conduktor on 
[localhost:8080](localhost:8080) by using a port-forward. You can also configure an ingress to make Platform available externally, check out our [snippets](#snippets).

```bash
kubectl port-forward deployment/console -n ${NAMESPACE} 8080:8080
```

## Configure Platform

### Fresh install

You can configure Platform by inserting it into the `config` section of the
`values.yaml` file. Find available configurations in the [configuration section](../../configuration/env-variables.md).


### Based on a Docker configuration

If you're already using a config file within Docker,you can use it by giving it to the Helm chart with the following command:

```yaml title="values.yaml"
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
```

### Configure with an enterprise license

```yaml title="values.yaml"
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

  license: "<your_license>"

  # HERE you can paste the console configuration (under the config key)
```

## Snippets

For coding snippets, see our [README](https://github.com/conduktor/conduktor-public-charts/blob/main/charts/console/README.md#snippets).
