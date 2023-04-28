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

Platform Controller chart follow controller pattern where the controller service (deployed inside Pod) watch a standard ConfigMap resource and run reconciliation process upon changes to this ConfigMap to deploy a Conduktor Platform.


1. So when installing Platform Controller chart, the chart deploy several things : 

    - A `Secret` for platform sensitive data like administrator password, database password, license, SSO secrets, ...
    - A `ConfigMap` containing configuration for the Conduktor Platform and for other resources managed by the controller
    - A `ServiceAccount` with poper permission for Controller to access Kubernetes API
    - A `Deployment` for the Controller service 
    - A `Service` to access Controller APIs (healthcheck, state, ...)
    - Optionally an `Ingress` to expose controller `Service` (not needed for now)
    - Optionally a `ServiceMonitor` service for collecting prometheus metrics from the Controller (see [troubleshooting](#troubleshooting))
    - Optionally [Bitnami PostgreSQL](https://github.com/bitnami/charts/tree/main/bitnami/postgresql) dependency for demo/trial purpose. Can be disabled with `postgresql.enabled=false`.
    - Optionally [Bitnami MinIO](https://github.com/bitnami/charts/tree/main/bitnami/minio) dependency for demo/trial purpose to provide a S3 Bucket for the platform to offload monitoring data. Can be disabled with `minio.enabled=false`.
    - Optionally [Bitnami Kafka](https://github.com/bitnami/charts/tree/main/bitnami/kafka) dependency for demo/trial purpose to provide a Kafka broker that is automatically configured in the Platform. Can be disabled with `kafka.enabled=false`.


2. When Controller start after migrating itself if needed, it start a watcher on `ConfigMap` containing Conduktor Platform configuration and start it's reconciliation loop. 
Depending on the configuration the Controller might ask Kubernetes API to deploy :

    - A `Deployment` for the Conduktor Platform with all configuration read in input `ConfigMap` and `Secret`. 
    - A `Service` to access Condutkro Platform exposed ports
    - Optionally an `Ingress` to expose Platform on some host url. See [ingress configuration](#setup-ingress-for-conduktor-platform) for mor details.

:::info   
All resources deployed by the Controller are in fact [owned](https://kubernetes.io/docs/concepts/overview/working-with-objects/owners-dependents/) by input `ConfigMap`. That mean that even if Controller is down or updating itself, Platform is still running. And if `ConfigMap` is removed, everythink owned by it is also purged.   
:::

![Platform Controller diagram](/img/get-started/kubernetes-platform-controller-diag.png)

## Requirements

* Kubernetes Cluster 1.16+ ([setup a local cluster](https://k3d.io/v5.4.9/#installation))[^1]
    * With access to a namespace with [minimal role](#minimal-role-rules)
* Kubectl ([install](https://kubernetes.io/docs/tasks/tools/#kubectl)) with proper kube context configured.
* Helm 3.1.0+ ([install](https://helm.sh/docs/intro/install/))
* Basic knowledge of Kubernetes

### Database
Conduktor Platform and the Platform Controller need a PostgreSQL database to work.   

By default, for trial and demo purpose the chart come with an optional [Bitnami PostgreSQL](https://github.com/bitnami/charts/tree/main/bitnami/postgresql) dependency that is used as database. 

But for production environment, it is strongly recommended to provide a PostgreSQL database not managed by the chart and disable dependency on using `postgresql.enabled=false`.

See [external database configuration](#setup-external-database) section for more details.

### S3 Bucket
Conduktor Platform need a S3 bucket to offload monitoring data and be stateless as much as possible. 
For that purpose, Helm chart deploy by default a MinIO dependecy service that act an S3 provider. 

But for production environement, it is recommended to setup an external S3 service and disable MinIO dependency with `minio.enabled=false` value.

See [external S3 configuration](#setup-s3) section for more details.

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

### How to install Platform Controller chart

To install helm chart of Platform Controller you need to provide some basic mandatory configuration fit it to work. 

Here is a basic value file `custom-values.yaml` that will be used to configure the chart.
```yaml
platform:
  config:
    organization: "MyOrganization"
    adminEmail: "admin@my.org"
    adminPassword: "changeMe"
    license: "..." # Optional
```

Then run helm install using prevous values file.
```shell
export NAMESPACE=conduktor
export RELEASE_NAME=platform

helm install -n ${NAMESPACE} --create-namespace \
    ${RELEASE_NAME} conduktor/platform-controller \
    -f custom-values.yaml
```

Once deployed, you will be able to access the platform on [localhost:8080](localhost:8080) by using a port-forward (you can also configure an [ingress](#setup-ingress-for-conduktor-platform) with helm values).

```bash
kubectl port-forward deployment/platform -n ${NAMESPACE} 8080:80
```

Then login using the configured credentials provided in `custom-values.yaml` configuration file. And you can enjoy Conduktor Platform.

If you want to expose Conduktor Platform on an ingress read [Ingress configuration](#setup-ingress-for-conduktor-platform) section for more details.


### How to upgrade Platform Controller

Usually, it only need an Helm Conduktor repository update and an Helm upgrade with previous existing configuration values.  
```bash
# update public repository to download new releases of conduktor/platform-controller
helm repo update
# upgrade previous HELM_RELEASE_NAME on namespace NAMESPACE with custom values custom-values.yaml
helm upgrade -n ${NAMESPACE} ${HELM_RELEASE_NAME} conduktor/platform-controller -f custom-values.yaml
```

Upgrade will update deployed Controller image and optional dependencies as well as updating `ConfigMap` and `Secret` if needed. Then the new Controller will do a reconciliation to ask to update the Conduktor Platform image and others managed Kubernetes resources. 

See [verions compatibility matrix](#versions-compatibility-matrix) to know which version of the chart deploy which version of the Conduktor Platform

### Custom deployment

You can customize values of the helm chart in order to match your setup. You can learn about
available values in the [helm chart documentation](https://helm.conduktor.io/platform-controller/#parameters).

#### Extra environement variables

If some [Platform configuration](../../configuration/env-variables.md) is not available in chart values, you can use `platform.config.extraEnvVars`, `platform.config.extraEnvVarsCM` and `platform.condig.extraEnvVarsSecret` to provide them from environement variables comming from values, a `ConfigMap` or a `Secret` 

Example with a cluster definition. 

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
All extra environment variables will end up been concatenated and set on Platform `Deployment`. Secrets will not be read and only references are forwarded to Platform `Deployment`. 

#### Secrets

As describe in [architecture](#architecture) section, Platform Controller Helm chart will deploy a `Secret` resource containing all sensitive data given in values during installation.

But you can also provide an existing `Secret` to the chart to be used in-place of the one created automatically. 

The following keys are expected in provided existing `Secret` : 
- `admin-password` : Platform administrator password (Required)
- `database-password` : PostgreSQL authentication password. Required if `postgresql.enabled=false` and password not directly provied using `platform.config.database.password`.
- `license` : Platform enterprise license. Required in secrets, can be empty for free use.
- `sso-oauth2-client-secret` : SSO OIDC client secret. Optional, only used if `platform.config.sso.enabled=true` and OIDC client setup.
- `sso-ldap-manager-password` : SSO LDAP manager authentication password. Optional, only used if `platform.config.sso.enabled=true` and LDAP server setup.

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
  database-password: 'cccccc'
  sso-oauth2-client-secret: 'ddddd'
  sso-ldap-manager-password: 'eeeee'
```

Chart custom value
```yaml
platform: 
  existingSecret: "my-platform-secret"
  organization: "MyOrganization"
  adminEmail: "admin@my.org"
```

#### Setup external database

To setup external database you have to setup `platform.config.database` configuration properties. 
Database host should be reachable by the Controller AND the Platform. 

See [database requirement](../../configuration/database.md#database-requirements) for more details on supported PostgreSQL version.

Configuration example : 
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
If you want to your own `Secret` to provide database password, see [`Secrets`](#secrets) section for more details.

#### Setup Ingress for Conduktor Platform 

By default, Conduktor Platform is not exposed by an `Ingress`. To enable it you need an proper `IngressController` configured in your cluster like [Nginx Ingress Controller](https://docs.nginx.com/nginx-ingress-controller/) and add configure it in your values.


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

Conduktor platform can offload kafka metrics collected for internal monitoring into a S3 object storage and so retain as less state as possible inside the Pod. 

By default, Platform Controller chart come with an optional [Bitnami MinIO](https://github.com/bitnami/charts/tree/main/bitnami/minio) dependency to provide such S3. It can be disabled with `minio.enabled=false` but in that case it is recommended to provide your own.


```yaml
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

Currently S3 `accessKey` and `secretKey` are not supported as `Secret` but as workaround `platform.condig.extraEnvVarsSecret` can be used to provide them using `CDK_MONITORING_STORAGE_S3_ACCESSKEYID` and `CDK_MONITORING_STORAGE_S3_SECRETACCESSKEY` environment variables. See [secrets](#secrets) section for more details.

### Miscellaneous

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

## Troubleshooting

### See Platform Controller logs

```bash
kubectl logs -f -n NAMESPACE -l conduktor.io/app-name=platform-controller --all-containers
```

### See Conduktor Platform logs

```bash
kubectl logs -f -n NAMESPACE -l conduktor.io/app-name=platform --all-containers
```

[^1]: You don't have to be administrator of the cluster, but your should be able to create new resources in a namespace.
