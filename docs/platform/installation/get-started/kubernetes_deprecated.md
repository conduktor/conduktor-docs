---
sidebar_position: 6
title: Kubernetes (deprecated)
description: The below guide details how to deploy kubernetes resources to run Conduktor.
---

The below guide will help you to deploy a production-ready instance of Conduktor on Kubernetes.

:::alert
Be aware that this method is deprecated and shouldn't be used anymore. 

If you have issues, please contact our [support](https://www.conduktor.io/contact/support/).   
:::

# Helm installation

Conduktor provides a [Helm repository](https://helm.conduktor.io) containing a chart that will deploy Conduktor using the [controller pattern](https://kubernetes.io/docs/concepts/architecture/controller/). 

## Migrate to conduktor/console helm chart

## Architecture

The controller chart follows the Kubernetes controller pattern to deploy Conduktor. The controller service (deployed inside a Pod) watches a standard ConfigMap resource and runs reconciliation processes upon changes to this ConfigMap.

1. When installing the Conduktor controller chart, the chart deploys several things:
    - `Secret` for sensitive data such as the administrator password, database password, license, SSO secrets
    - `ConfigMap` containing configuration for Conduktor and for other resources managed by the controller
    - `ServiceAccount` with proper permissions for the controller to access Kubernetes API
    - `Deployment` for the controller service 
    - `Service` to access controller APIs (healthcheck, state, ...)
    - Optionally, an `Ingress` to expose controller `Service` (not needed for now)
    - Optionally, a `ServiceMonitor` service for collecting prometheus metrics from the controller (see [troubleshooting](#troubleshooting))
    - Optionally, [Bitnami PostgreSQL](https://github.com/bitnami/charts/tree/main/bitnami/postgresql) dependency for demo/trial purposes. This can be disabled with `postgresql.enabled=false`
    - Optionally, [Bitnami MinIO](https://github.com/bitnami/charts/tree/main/bitnami/minio) dependency for demo/trial purposes. This can be used to provide an S3 Bucket for Conduktor to offload monitoring data. Can be disabled with `minio.enabled=false`
    - Optionally, [Bitnami Kafka](https://github.com/bitnami/charts/tree/main/bitnami/kafka) dependency for demo/trial purposes. This can be used to provide a Kafka broker that is automatically configured in Conduktor. Can be disabled with `kafka.enabled=false`


2. In case of a migration, when the controller starts it will start a watcher on `ConfigMap` containing the Conduktor configuration and start it's reconciliation loop. 
Depending on the configuration, the controller might ask Kubernetes API to deploy:
   - A `Deployment` for Conduktor with all configurations read in input `ConfigMap` and `Secret`    
   - A `Service` to access Conduktor exposed ports   
   - Optionally, an `Ingress` to expose Conduktor on some host url. See [ingress configuration](#setup-ingress-for-conduktor-platform) for more details.
  

:::info   
All resources deployed by the controller are in fact [owned](https://kubernetes.io/docs/concepts/overview/working-with-objects/owners-dependents/) by the input `ConfigMap`. This means that even if the controller is down or updating itself, Conduktor is still running. And if the `ConfigMap` is removed, everything owned by it is also purged.   
:::

![Platform Controller diagram](/img/get-started/kubernetes-platform-controller-diag.png)

## General requirements

* Kubernetes Cluster 1.16+ ([setup a local cluster](https://k3d.io/v5.4.9/#installation))[^1]
    * With access to a namespace with [minimal role](#minimal-role-rules)
* Kubectl ([install](https://kubernetes.io/docs/tasks/tools/#kubectl)) with proper kube context configured
* Helm 3.1.0+ ([install](https://helm.sh/docs/intro/install/))
* Basic knowledge of Kubernetes

## Production requirements
For production environments, this is  **mandatory**: 

* To setup an [external PostgreSQL (13+) database](../../configuration/database.md) with appropriate backup policy and disable the dependency on Bitnami PostgreSQL with `postgresql.enabled=false`
* To setup an [external S3 Bucket](#setup-s3) and disable the dependency on Bitnami MinIO with `minio.enabled=false`
* To disable demo Kafka broker with `kafka.enabled=false` and [use your own Kafka cluster](../../admin/managing-clusters.mdx).
* Enough resources to run Conduktor and its dependencies (PostgreSQL, MinIO, Kafka) with the [recommended configuration](../hardware.md#hardware-requirements)

### Database
Conduktor and the controller need a PostgreSQL database to work.   

By default, and for trial and demo purposes, the chart comes with an optional [Bitnami PostgreSQL](https://github.com/bitnami/charts/tree/main/bitnami/postgresql) dependency that is used as database. 

But for **production environments**, it is **strongly recommended** to provide a PostgreSQL database that is not managed by the chart and to disable dependency on using `postgresql.enabled=false`.

See [external database configuration](#setup-external-database) section for more details.

### S3 Bucket
Conduktor requires an S3 bucket to store monitoring data. For that purpose, the Helm chart deploys by default a MinIO dependency service that acts as an S3 provider. 

But for **production environments**, it is **strongly recommended** to setup an external S3 service and disable MinIO dependency with `minio.enabled=false` value.

See [external S3 configuration](#setup-s3) section for more details.

## Versions compatibility matrix

Conduktor console, the Platform-controller, and its Helm chart have different versions.
Please consult the following version compatibility matrix to understand which version of the chart deploys the corresponding version of Conduktor.

| Conduktor console                                   | Platform-controller | Helm chart |
|-----------------------------------------------------|---------------------|------------|
| [1.11.1](https://www.conduktor.io/changelog/1.11.1) | 0.4.0               | 0.2.1      |
| [1.11.1](https://www.conduktor.io/changelog/1.11.1) | 0.5.0               | 0.2.2      |
| [1.11.1](https://www.conduktor.io/changelog/1.11.1) | 0.5.0               | 0.2.3      |
| [1.11.1](https://www.conduktor.io/changelog/1.11.1) | 0.6.0               | 0.2.4      |
| [1.12.1](https://www.conduktor.io/changelog/1.12.1) | 0.7.0               | 0.2.5      |
| [1.13.0](https://www.conduktor.io/changelog/1.13.0) | 0.8.0               | 0.3.0      |
| [1.14.0](https://www.conduktor.io/changelog/1.14.0) | 0.9.0               | 0.4.0      |
| [1.15.0](https://www.conduktor.io/changelog/1.15.0) | 0.10.2              | 0.5.0      |
| [1.15.0](https://www.conduktor.io/changelog/1.15.0) | 0.10.2              | 0.5.1      |
| [1.15.0](https://www.conduktor.io/changelog/1.15.0) | 0.12.1              | 0.6.1      |
| [1.16.1](https://www.conduktor.io/changelog/1.16.1) | 0.13.0              | 0.7.0      |
| [1.16.3](https://www.conduktor.io/changelog/1.16.3) | 0.14.2              | 0.8.1      |

## Getting started

### Setup Conduktor Helm repository

Configure helm in order to recognize **Conduktor Repository**. You only have to do this step once.

```shell
helm repo add conduktor https://helm.conduktor.io
helm repo update
```

### How to install the Conduktor chart

To install the Conduktor helm chart you need to provide some basic mandatory configuration for it to work. 

Here is a basic value file `custom-values.yaml` that will be used to configure the chart.
```yaml
platform:
  config:
    organization: "MyOrganization"
    adminEmail: "admin@my.org"
    adminPassword: "changeMe"
    license: "..." # Optional
```

Then, run helm install using previous values file.
```shell
export NAMESPACE=conduktor
export RELEASE_NAME=platform

helm install -n ${NAMESPACE} --create-namespace \
    ${RELEASE_NAME} conduktor/platform-controller \
    -f custom-values.yaml
```

Once deployed, you will be able to access Conduktor on [localhost:8080](localhost:8080) by using a port-forward (you can also configure an [ingress](#setup-ingress-for-conduktor-platform) with helm values).

```bash
kubectl port-forward deployment/platform -n ${NAMESPACE} 8080:80
```

Then, login using the configured credentials provided in the `custom-values.yaml` configuration file. You are now able to enjoy Conduktor.

If you want to expose Conduktor on an ingress, read the [Ingress configuration](#setup-ingress-for-conduktor-platform) section for more details.


### How to upgrade the Controller

Usually, it only requires a Helm Conduktor repository update and a Helm upgrade with pre-existing configuration values.  
```bash
# update public repository to download new releases of conduktor/platform-controller
helm repo update
# upgrade previous HELM_RELEASE_NAME on namespace NAMESPACE with custom values custom-values.yaml
helm upgrade -n ${NAMESPACE} ${HELM_RELEASE_NAME} conduktor/platform-controller -f custom-values.yaml
```

An upgrade will update the deployed Controller image, optional dependencies and update `ConfigMap` and `Secret` if required. Then, the new Controller will do a reconciliation that asks to update the Conduktor image and other managed Kubernetes resources. 

See [versions compatibility matrix](#versions-compatibility-matrix) to know which version of the chart deploys the corresponding version of Conduktor.

### Custom deployment

You can customize values of the helm chart in order to match your setup. Learn more about available values in the [helm chart documentation](https://helm.conduktor.io/platform-controller/#parameters).

#### Extra environment variables

You can provide extra environment variables that will be forwarded to Conduktor. These extra environment variables can be provided using:

  - `platform.config.extraEnvVars`: directly provide key-value pairs
  - `platform.config.extraEnvVarsCM`: provide environment variables from an existing `ConfigMap`
  - `platform.config.extraEnvVarsSecret`: provide environment variables from an existing `Secret`

This is useful as a workaround for non-supported configurations in the controller chart values. 

Example with a cluster definition:

Existing `ConfigMap` named `extra-platform-config`
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: extra-platform-config
  namespace: NAMESPACE
data:
  CDK_CLUSTERS_0_ID: "cluster-id"
  CDK_CLUSTERS_0_NAME: "My Cluster"
  CDK_CLUSTERS_0_BOOTSTRAPSERVERS: "my-kafka:9092"
  CDK_CLUSTERS_0_SCHEMAREGISTRY_ID: "My Schema Registry"
  CDK_CLUSTERS_0_SCHEMAREGISTRY_URL: "my-sr:8080"
```

Existing `Secret` name `extra-platform-secret`
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: my-platform-secret
  namespace: NAMESPACE
type: Opaque
data:
    CDK_CLUSTERS_0_SCHEMAREGISTRY_SECURITY_USERNAME: "aaaa"
    CDK_CLUSTERS_0_SCHEMAREGISTRY_SECURITY_PASSWORD: "bbbb"
```

Chart values : 
```yaml
platform:
  config:
    extraEnvVars:
      - name: "CDK_CLUSTERS_0_COLOR"
        value: "#E70000"
    extraEnvVarsCM: "extra-platform-config"
    extraEnvVarsSecret: "extra-platform-secret"
```
All extra environment variables will be concatenated and set on Conduktor controller `Deployment`. Secrets will not be read and only references are forwarded to Conduktor controller `Deployment`. 

#### Secrets

As described in the [architecture](#architecture) section, the controller Helm chart will deploy a `Secret` resource containing all sensitive data provided as values during installation.

However, you can also provide an existing `Secret` to the chart, which can be used in-place of the one created automatically. 

The following keys are expected in the provided existing `Secret`: 
- `admin-password` : Platform administrator password (Required)
- `database-password` : PostgreSQL authentication password. Required if `postgresql.enabled=false` and password not directly provided using `platform.config.database.password`.
- `license` : Platform enterprise license. Required in secrets, can be empty for free use.
- `sso-oauth2-client-id` : SSO OIDC client ID. Optional, only used if `platform.config.sso.enabled=true` and OIDC client setup.
- `sso-oauth2-client-secret` : SSO OIDC client secret (since chart 0.5.0). Optional, only used if `platform.config.sso.enabled=true` and OIDC client setup.
- `sso-ldap-manager-password` : SSO LDAP manager authentication password. Optional, only used if `platform.config.sso.enabled=true` and LDAP server is setup.
- `monitoring-s3-access-key` : Monitoring S3 access key (since chart 0.5.0). Optional, only used if S3 setup and `minio.enabled=false`.
- `monitoring-s3-secret-key` : Monitoring S3 secret key (since chart 0.5.0). Optional, only used if S3 setup and `minio.enabled=false`.

Example: 
Custom secret named `my-platform-secret`.
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: my-platform-secret
  namespace: NAMESPACE
type: Opaque
data:
  admin-password: 'aaaaa'
  license: 'bbbbb'
  database-password: 'ccccc'
  sso-oauth2-client-id: 'ddddd'
  sso-oauth2-client-secret: 'eeeee'
  sso-ldap-manager-password: 'fffff'
```

Chart custom value
```yaml
platform: 
  existingSecret: "my-platform-secret"
  organization: "MyOrganization"
  adminEmail: "admin@my.org"
```

#### Setup external database

To setup an external database you should setup `platform.config.database` configuration properties. 
The database host should be reachable by the Controller AND the Platform. 

See [database requirement](../../configuration/database.md#database-requirements) for more details on supported PostgreSQL version.

Configuration example: 
```yaml
postgresql:
  enabled: false    # disabled dependency Bitnami PostgreSQL

platform:
  config:
    database:
      host: ""      # Host reachable by controller and platform Pods
      port: 5432
      username: ""  # Database authentication login
      password: ""  # Database authentication password 
      name: ""      # Database name
```
If you want to use your own `Secret` to provide the database password, see the [Secrets](#secrets) section for more details.

#### Setup Ingress for Conduktor 

By default, Conduktor is not exposed by an `Ingress`. To enable it, you need a proper `IngressController` configured in your cluster such as [Nginx Ingress Controller](https://docs.nginx.com/nginx-ingress-controller/), and add the configuration values.


```yaml
platform:
  ingress: 
    enabled: true
    ingressClassName: "nginx" # your ingress controller class name. In this case nginx for an Nginx Ingress Controller
    host: "conduktor.my-domain.org"
    tls:
      enabled: true 
      host: "conduktor.my-domain.org"
      secretRef: platform-secret-tls # secret containing tls.crt certificate and tls.key private key
    annotations: {} # extra annotations for ingress 
```

#### Setup S3

Conduktor can offload Kafka metrics collected for internal monitoring into a S3 object storage. This enables you to retain as minimal state as possible inside the Pod. 

By default, the Conduktor controller chart comes with an optional [Bitnami MinIO](https://github.com/bitnami/charts/tree/main/bitnami/minio) dependency to provide such S3. It can be disabled with `minio.enabled=false`, but in that case it's recommended to provide your own.


```yaml
minio:
  enabled: false    # disabled dependency Bitnami MinIO

platform:
  config: 
    monitoring:
      storage:
        s3:
          bucket: ""
          endpoint: ""
          accessKey: ""
          secretKey: ""
          region: "" 
          insecure: true
```

You can provide `accessKey` and `secretKey` using an existing secret via `monitoring-s3-access-key` and `monitoring-s3-secret-key` secret data keys.

See [secrets](#secrets) section for more details.

### Miscellaneous

#### Minimal Role rules
The controller needs a service account with a bind role containing the following rules to work properly.
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
By default, this service account and role will be created by the chart. It can be disabled with `controller.serviceAccount.create` value. 

In this case you should also provide an existing service account using `controller.serviceAccount.name` value.

> Note: Platform pod do not require a service account and use the default one from the namespace. But if needed you can provide a custom existing service account using `platform.serviceAccount.name` value.

#### Setup node affinity
Since chart 0.5.0, we provide a way to setup node affinity for platform and controller pods.
Example : 
```yaml
# platform specific node affinity configuration
platform:
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: kubernetes.io/os
            operator: In
            values:
            - linux
            - 
# controller specific node affinity configuration
controller: 
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
         - matchExpressions:
         - key: kubernetes.io/ok
           operator: In
           values:
            - linux
```
See Kubernetes [documentation](https://kubernetes.io/docs/tasks/configure-pod-container/assign-pods-nodes-using-node-affinity/#schedule-a-pod-using-required-node-affinity) on Node Affinity for more details.

#### Platform service type NodePort

Since chart 0.6.1, we provide a way to configure the type of service is 
created for the platform. By default, the service type is ClusterIP, but you 
can also configure it to be NodePort, as followed:

```yaml
platform:
  service:
    type: NodePort
    nodePorts:
      # You can either specify a port here, or leave it empty so Kubernetes will
      # allocate a port automatically.
      platform: ""
```

#### Taints and tolerations support
Since chart 0.6.1, we provide a way to configure taints and tolerations for the platform and controller pods.
See kubernetes [documentation](https://kubernetes.io/docs/concepts/configuration/taint-and-toleration/) on taints and tolerations for more details.

```yaml
controller:
  tolerations:
     - key: "key1"
       operator: "Equal"
       value: "value1"
       effect: "NoSchedule"
     
platform:
  tolerations:
     - key: "key2"
       operator: "Exists"
       effect: "NoExecute"
```

## Troubleshooting

### See Controller logs

```bash
kubectl logs -f -n NAMESPACE -l conduktor.io/app-name=platform-controller --all-containers
```

### See Conduktor logs

```bash
kubectl logs -f -n NAMESPACE -l conduktor.io/app-name=platform --all-containers
```

[^1]: You don't have to be an administrator of the cluster, but you should be able to create new resources in a namespace.
