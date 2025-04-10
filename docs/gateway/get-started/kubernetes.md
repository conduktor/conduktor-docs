---
sidebar_position: 2
title: Kubernetes
description: This guide is for deploying Conduktor Gateway on a local Minikube instance, **not production**.
---

:::info
We welcome contributions and feedback. If you have issues, you can open an issue on our [GitHub repository](https://github.com/conduktor/conduktor-public-charts/issues) or contact [support](https://www.conduktor.io/contact/support/).
:::

# Helm chart installation

Conduktor provides a [Helm repository](https://helm.conduktor.io) containing a chart that will deploy Conduktor Gateway on your Kubernetes cluster.  This is a quick start guide to help you deploy a local instance of Gateway for non production purposes.

## Compatibility matrix
This compatibility matrix is a resource to help you find which versions of Conduktor Gateway work on which version of our Conduktor Gateway Helm chart.

> We recommend you use the version of Gateway that comes pre-configured with the Helm chart. You can adjust the version in your values property according to the supported Gateway version, if required.

> Breaking changes column only lists a **breaking change in the Helm chart**. See Conduktor [release notes](https://docs.conduktor.io/changelog/) to determine whether there are breaking changes within the artifacts.

### Helm chart compatibility

Breaking changes:

🟡 - Breaks additional services (e.g. Grafana dashboard changes)

🔴 - Breaks overall deployment of the product (e.g. renaming variables in .values, major product releases)


| Chart version | Supported Gateway version | Breaking changes |
| ------------- | ------------------------- | ---------------- |
| [conduktor-gateway-3.8.1](https://github.com/conduktor/conduktor-public-charts/releases/tag/conduktor-gateway-3.8.1) | **3.8.0**, 3.7.1, 3.7.0, 3.6.1, 3.6.0, 3.5.0, 3.4.1, 3.4.0, 3.3.1, 3.3.0, 3.2.2, 3.2.1, 3.2.0, 3.1.1, 3.1.0 | |
| [conduktor-gateway-3.8.0](https://github.com/conduktor/conduktor-public-charts/releases/tag/conduktor-gateway-3.8.0) | **3.8.0**, 3.7.1, 3.7.0, 3.6.1, 3.6.0, 3.5.0, 3.4.1, 3.4.0, 3.3.1, 3.3.0, 3.2.2, 3.2.1, 3.2.0, 3.1.1, 3.1.0 | |
| [conduktor-gateway-3.7.1](https://github.com/conduktor/conduktor-public-charts/releases/tag/conduktor-gateway-3.7.1) | **3.7.1**, 3.7.0, 3.6.1, 3.6.0, 3.5.0, 3.4.1, 3.4.0, 3.3.1, 3.3.0, 3.2.2, 3.2.1, 3.2.0, 3.1.1, 3.1.0 | |
| [conduktor-gateway-3.7.0](https://github.com/conduktor/conduktor-public-charts/releases/tag/conduktor-gateway-3.7.0) | **3.7.0**, 3.6.1, 3.6.0, 3.5.0, 3.4.1, 3.4.0, 3.3.1, 3.3.0, 3.2.2, 3.2.1, 3.2.0, 3.1.1, 3.1.0 | 🟡 Updated Grafana template [see here](https://github.com/conduktor/conduktor-public-charts/pull/160) <br/> 🟡 Removed dependency on in-built Kafka cluster [see here](https://github.com/conduktor/conduktor-public-charts/pull/154) |
| [conduktor-gateway-3.6.1](https://github.com/conduktor/conduktor-public-charts/releases/tag/conduktor-gateway-3.6.1) | **3.6.1**, 3.6.0, 3.5.0, 3.4.1, 3.4.0, 3.3.1, 3.3.0, 3.2.2, 3.2.1, 3.2.0, 3.1.1, 3.1.0 | |
| [conduktor-gateway-3.6.0](https://github.com/conduktor/conduktor-public-charts/releases/tag/conduktor-gateway-3.6.0) | **3.6.0**, 3.5.0, 3.4.1, 3.4.0, 3.3.1, 3.3.0, 3.2.2, 3.2.1, 3.2.0, 3.1.1, 3.1.0 | |
| [conduktor-gateway-3.5.0](https://github.com/conduktor/conduktor-public-charts/releases/tag/conduktor-gateway-3.5.0) | **3.5.0**, 3.4.1, 3.4.0, 3.3.1, 3.3.0, 3.2.2, 3.2.1, 3.2.0, 3.1.1, 3.1.0 | |
| [conduktor-gateway-3.4.1](https://github.com/conduktor/conduktor-public-charts/releases/tag/conduktor-gateway-3.4.1) | **3.4.1**, 3.4.0, 3.3.1, 3.3.0, 3.2.2, 3.2.1, 3.2.0, 3.1.1, 3.1.0 | |
| [conduktor-gateway-3.4.0](https://github.com/conduktor/conduktor-public-charts/releases/tag/conduktor-gateway-3.4.0) | **3.4.0**, 3.3.1, 3.3.0, 3.2.2, 3.2.1, 3.2.0, 3.1.1, 3.1.0 | 🔴 Change service account creation behavior [see here](https://github.com/conduktor/conduktor-public-charts/pull/125) <br/> 🟡 Updated Grafana template [see here](https://github.com/conduktor/conduktor-public-charts/pull/123) |
| [conduktor-gateway-3.3.1](https://github.com/conduktor/conduktor-public-charts/releases/tag/conduktor-gateway-3.3.1) | **3.3.1**, 3.3.0, 3.2.2, 3.2.1, 3.2.0, 3.1.1, 3.1.0 | |
| [conduktor-gateway-3.3.0](https://github.com/conduktor/conduktor-public-charts/releases/tag/conduktor-gateway-3.3.0) | **3.3.0**, 3.2.2, 3.2.1, 3.2.0, 3.1.1, 3.1.0 | |
| [conduktor-gateway-3.2.2](https://github.com/conduktor/conduktor-public-charts/releases/tag/conduktor-gateway-3.2.2) | **3.2.2**, 3.2.1, 3.2.0, 3.1.1, 3.1.0 | 🟡 Updated Grafana template [see here](https://github.com/conduktor/conduktor-public-charts/pull/98) |
| [conduktor-gateway-3.2.1](https://github.com/conduktor/conduktor-public-charts/releases/tag/conduktor-gateway-3.2.1) | **3.2.1**, 3.2.0, 3.1.1, 3.1.0 | |
| [conduktor-gateway-3.2.0](https://github.com/conduktor/conduktor-public-charts/releases/tag/conduktor-gateway-3.2.0) | **3.2.1**, 3.2.0, 3.1.1, 3.1.0 | |
| [conduktor-gateway-3.1.1](https://github.com/conduktor/conduktor-public-charts/releases/tag/conduktor-gateway-3.1.1) | **3.1.1**, 3.1.0 | |
| [conduktor-gateway-3.1.0](https://github.com/conduktor/conduktor-public-charts/releases/tag/conduktor-gateway-3.1.0) | **3.1.1**, 3.1.0 | 🟡 Updated Grafana template [see here](https://github.com/conduktor/conduktor-public-charts/pull/81) |
| [conduktor-gateway-3.0.1](https://github.com/conduktor/conduktor-public-charts/releases/tag/conduktor-gateway-3.0.1) | **3.0.1**, 3.0.0 | |
| [conduktor-gateway-3.0.0](https://github.com/conduktor/conduktor-public-charts/releases/tag/conduktor-gateway-3.0.0) | **3.0.0** | 🔴 Major product update [see here](https://github.com/conduktor/conduktor-public-charts/pull/56) |

## General requirements

* Minikube 1.33+ ([install](https://minikube.sigs.k8s.io/docs/start/?arch=%2Fmacos%2Farm64%2Fstable%2Fbinary+download))
* Kubectl ([install](https://kubernetes.io/docs/tasks/tools/#kubectl)) with proper kube context configured
* Helm 3.1.0+ ([install](https://helm.sh/docs/intro/install/))
* Docker 27 + ([install](https://docs.docker.com/engine/install/))
* Basic knowledge of Kubernetes

### Install the Gateway chart

#### Default configuration:

1. Assumes a local installation on minikube
2. Deploys a single Kafka broker
3. Deploys a single Zookeeper instance
4. Deploys 2 instances of Gateway
5. Deploys [Audit Interceptor](https://docs.conduktor.io/gateway/interceptors/data-security/audit/)
6. Gateway is accessible on port 9099
7. Gateway admin is accessible on port 8888

#### Deploying against and existing Kafka cluster

If you wish to deploy against an existing Kafka cluster, you will need to modify the template as follows:

1. Set the following parameter to `false`

```yaml
kafka:
  ## @param kafka.enabled Deploy a kafka along side gateway (This should only used for testing purpose)
  enabled: true
```

2. Uncomment the following:

```yaml
  env:
    KAFKA_BOOTSTRAP_SERVERS: "<hostname/IP>:<port>"
    GATEWAY_BIND_HOST: "0.0.0.0"
    GATEWAY_ADVERTISED_HOST: "localhost"
    GATEWAY_ROUTING_MECHANISM: "port"
    GATEWAY_CLUSTER_ID: "default"
    GATEWAY_SECURITY_PROTOCOL: "PLAINTEXT"
    NAMESPACE: "default"
```
3. Set the following property to the hostname/IP and port of your Kafka broker listeners:

```yaml
  env:
    KAFKA_BOOTSTRAP_SERVERS: "<hostname/IP>:<port>"
```

4. Make sure that your external Kafka cluster is reachable from your Minikube instance (outside the scope of this guide).

#### Template deployment

1. Copy the following template into a file called **values.yaml**.

```yaml
# Default values for conduktor-gateway

global:
  ## @param global.imagePullSecrets [array, nullable] Docker login secrets name for image pull
  imagePullSecrets:
  ## @param global.env The environment name
  env: ""

## @section Conduktor-gateway configurations
## @descriptionStart
## This section contains configuration of the gateway
## @descriptionEnd
gateway:
  ## @section Conduktor-gateway image configuration
  ## @descriptionStart
  ## This section define the image to be used
  ## @descriptionEnd
  image:
    ## @param gateway.image.registry Docker registry to use
    registry: docker.io
    ## @param gateway.image.repository Image in repository format (conduktor/conduktor-gateway)
    repository: conduktor/conduktor-gateway
    ## @param gateway.image.tag Image tag
    tag: 3.2.1
    ## @param gateway.image.pullPolicy Kubernetes image pull policy
    pullPolicy: IfNotPresent

  ## @param gateway.replicas number of Gateway instances to be deployed
  replicas: 2
  ## @param gateway.secretRef Secret name to load sensitive env var from
  secretRef: ""
  ## @param gateway.extraSecretEnvVars Array with extra secret environment variables
  ## e.g:
  ## extraSecretEnvVars:
  ##  - name: SECRET_1
  ##    valueFrom:
  ##      secretKeyRef:
  ##        name: secret-test
  ##        key: SECRET_1
  ##  - name: SECRET_2
  ##    valueFrom:
  ##      secretKeyRef:
  ##        name: secret-test
  ##        key: SECRET_2
  extraSecretEnvVars: []
  ## @param gateway.secretSha256sum [nullable] Optional sha256sum of the referenced secret. This could be set to have a automatic restart of Gateway deployment if secret change
  secretSha256sum: ""

  ## @param gateway.env [object] Environment variables for gateway deployment
  env:
    GATEWAY_ADVERTISED_HOST: "localhost"
    # KAFKA_BOOTSTRAP_SERVERS: "<hostname/IP>:<port>"
    # GATEWAY_BIND_HOST: "0.0.0.0"
    # GATEWAY_ROUTING_MECHANISM: "port"
    # GATEWAY_CLUSTER_ID: "default"
    # GATEWAY_SECURITY_PROTOCOL: "PLAINTEXT"
    # NAMESPACE: "default"

  ## @param gateway.interceptors Json configuration for interceptors to be loaded at startup by Gateway
  interceptors: '[{
  "name": "myAuditInterceptorPlugin",
  "pluginClass": "io.conduktor.gateway.interceptor.AuditPlugin",
  "priority": 100,
  "config": {
    "topic": ".*",
    "apiKeys": [
      "PRODUCE",
      "FETCH"
    ],
    "vcluster": ".*",
    "username": ".*",
    "consumerGroupId": ".*",
    "topicPartitions": [
      1,
      2
    ]
  }
}]'

  portRange:
    ## @param gateway.portRange.start Start port of the Gateway port range
    start: 9099
    ## @param gateway.portRange.count Max number of broker to expose
    count: 1

  admin:
    ## @param gateway.admin.port Admin http server port
    port: 8888

  jmx:
    ## @param gateway.jmx.enable Enable jmx jvm options
    enable: false
    ## @param gateway.jmx.port jmx port to expose by default jvm args
    port: 9999
    ## @param gateway.jmx.jvmArgs arguments to pass to the Gateway container jvm
    jvmArgs: -Dcom.sun.management.jmxremote.port={{ .Values.gateway.jmx.port }} -Dcom.sun.management.jmxremote.rmi.port={{ .Values.gateway.jmx.port }} -Dcom.sun.management.jmxremote.authenticate=false -Dcom.sun.management.jmxremote.local.only=false -Dcom.sun.management.jmxremote.ssl=false -Djava.rmi.server.hostname=127.0.0.1

  ## @param gateway.startupProbeDelay [nullable] Optional delay in second before startup probe should be running (default 10)
  startupProbeDelay: ""

  ## @param gateway.podLabels Specific labels to be added to Gateway pod by deployment
  podLabels: {}

  ## @param gateway.podAnnotations Gateway pod annotations
  podAnnotations: {}

  ## @param gateway.securityContext Container security context
  securityContext: {}
    # capabilities:
    #   drop:
    #   - ALL
    # readOnlyRootFilesystem: true
    # runAsNonRoot: true
    # runAsUser: 1000

  ## @param gateway.volumes Define user specific volumes for Gateway deployment
  volumes: {}

  ## @param gateway.volumeMounts Define user specific volumeMounts  for Gateway container in deployment
  volumeMounts: {}

## @section TLS configuration
## @descriptionStart
## This section is for configuring Gateway to handle certificate to manage SSL endpoint inside Gateway deployment
## @descriptionEnd
tls:
  ## @param tls.enable Enable tls injection into Gateway
  enable: false
  ## @param tls.secretRef Secret name with keystore to load
  secretRef: ""
  ## @param tls.keystoreKey Key in the secret to load as keystore
  keystoreKey: keystore.jks
  ## @param tls.keystoreFile File name to mount keystore as
  keystoreFile: keystore.jks

## @section Conduktor-gateway service configurations
## @descriptionStart
## This section contains kubernetes services configuration
## @descriptionEnd
service:
  ## @section Conduktor-gateway external service configurations
  ## @descriptionStart
  ## This section specify external service configuration
  ## @descriptionEnd
  external:
    ## @param service.external.enable Enable a service for external connection to Gateway
    enable: false
    ## @param service.external.type Type of load balancer
    type: ClusterIP
    ## @param service.external.ip Ip to configure
    ip: ""
    ## @param service.external.annotations
    annotations: {}
    # LoadBalancer externaldns gke support by annotation https://github.com/kubernetes-sigs/external-dns/blob/master/docs/tutorials/gke.md#verify-using-an-external-load-balancer
    # external-dns.alpha.kubernetes.io/hostname: "{{ required "A valid .Values.gateway.domain is required!" .Values.gateway.domain }}"
    ## @param service.external.admin Enable admin exposition on external service
    admin: false
    ## @param service.external.jmx Enable jmx exposition on external service
    jmx: false
  ## @section Conduktor-gateway internal service configurations
  ## @descriptionStart
  ## This section specify internal service configuration
  ## @descriptionEnd
  internal:
    ## @param service.internal.annotations
    annotations: {}

## @section Conduktor-gateway metrics activation
## @descriptionStart
## Gateway embed metrics to be installed within you cluster if your have the correct capabilities (Prometheus and Grafana operators)
## @descriptionEnd
metrics:
  alerts:
    ## @param metrics.alerts.enable Enable prometheus alerts if prometheus alerts rules is supported on cluster
    enable: false
  checklyAlerts:
    ## @param metrics.checklyAlerts.enable Enable alerts for checky jobs if prometheus rules is supported on cluster
    enable: false
  prometheus:
    ## @param metrics.prometheus.enable Enable ServiceMonitor prometheus operator configuration for metrics scrapping
    enable: false
    ## @param metrics.prometheus.metricRelabelings Configure metric relabeling in ServiceMonitor
    metricRelabelings: {}
    ## @param metrics.prometheus.relabelings Configure relabelings in ServiceMonitor
    relabelings: {}
    ## @param metrics.prometheus.extraParams Extra parameters in ServiceMonitor
    extraParams: {}
      # basicAuth:
      #   password:
      #     name: conduktor-admin-user # secret name
      #     key: password
      #   username:
      #     name: conduktor-admin-user # secret name
      #     key: username
  grafana:
    ## @param metrics.grafana.enable Enable grafana dashboards to installation
    enable: false
    datasources:
      ## @param metrics.grafana.datasources.prometheus Prometheus datasource to use for metric dashboard
      prometheus: prometheus
      ## @param metrics.grafana.datasources.loki Loki datasource to use for log dashboard
      loki: loki


## @section Kubernetes common configuration
## @descriptionStart
## Shared kubernetes configuration of the chart
## @descriptionEnd

serviceAccount:
  ## @param serviceAccount.create Create Kubernetes service account. Default kube value if false
  # Specifies whether a service account should be created
  # If AWS IAM is used, need to have create: false
  create: false

## @param commonLabels Labels to be applied to all resources created by this chart
commonLabels: {}

## @param nodeSelector Container node selector
nodeSelector: {}

## @param tolerations Container tolerations
tolerations: []

## @param affinity Container affinity
affinity: {}

## @section Dependencies
## @descriptionStart
## Enable and configure chart dependencies if not available in your deployment
## @descriptionEnd
kafka:
  ## @param kafka.enabled Deploy a kafka along side Gateway (This should only used for testing purposes)
  enabled: true
```

2. Install the chart on your cluster referencing the values.yaml file (Note: This can a take a few minutes to complete):

```shell
helm install mygateway conduktor/conduktor-gateway -f values.yaml
```

3. Validate the cluster is up and running, you should see 4 pods:

```shell
kubectl get pods
```

4. Setup port forwarding to connect to Gateway through a browser:

```shell
kubectl port-forward deployment/mygateway-conduktor-gateway -n default 8888:8888
```

5. Validate you can connect to the Gateway Admin interface in your browser:

```
http://localhost:8888
```

6. Validate that the Audit Interceptor is deployed:

```shell
curl http://localhost:8888/admin/interceptors/v1/all -u admin:conduktor | jq .
```

7. Setup port forwarding for a client connection:

```shell
kubectl port-forward deployment/mygateway-conduktor-gateway -n default 9099:9099
```

8. Your clients can now interact with Conduktor Gateway like any other Kafka cluster:

```shell
bin/kafka-topics.sh --create --topic orders --bootstrap-server localhost:9099
```

### Additional properties

Additional properties can be found in the Gateway [Helm chart repository](https://github.com/conduktor/conduktor-public-charts/blob/main/charts/gateway/README.md).
