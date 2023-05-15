---
sidebar_position: 3
title: Open Source Installation
description:  Open source installation
---

- [Overview](#overview)
- [Quick Start](#quick-start-and-demo)
    - [Get a Kafka instance](#get-a-kafka-instance)
    - [Run the gateway](#database-properties)
    - [Run the logging interceptor](#run-the-logging-interceptor)
- [Configure an interceptor from Conduktor Marketplace](#configure-an-interceptor-from-conduktor-marketplace)
- [Use your own Kafka cluster and Kafka clients](#use-your-own-kafka-cluster-and-kafka-clients)
  - [Kafka Client to Conduktor Gateway configuration](#kafka-client-to-conduktor-gateway-configuration)
  - [Conduktor Gateway to Kafka cluster configuration](#Conduktor-gateway-to-kafka-cluster-configuration)

# Overview

The opensource Conduktor Gateway is made up of two components, the gateway transport layer, and interceptors downloaded from the Conduktor Marketplace.

The gateway transport layer is the wiring between your Kafka client application and your Kafka broker. It has access to all the Kafka data flowing through it. 

Interceptors are loaded into the gateway.  The interceptors are triggered when Kafka data flows through the gateway, and provide functionality such as adding chaos to aid with testing, or adding safeguards around what Kafka configurations are allowed and keep your Kafka cluster protected.

It is also possible to [write your own interceptor](../interceptors/write-an-interceptor.md).

This diagram show the high level architecture of the open source Conduktor Gateway

![GatewayAndMarketPlace.png](GatewayAndMarketPlace.png)

# Quick Start

The quick start guide demonstrates how to install Conduktor Gateway and configure it to run with a locally running Kafka. It then uses the example logging interceptor to write a log line to stdout when Kafka traffic flows through the gateway.

## Get a Kafka instance

Follow step 1 and step 2 (Zookeeper or KRaft version) from the [Apache Kafka Quick Start](https://kafka.apache.org/quickstart) to create a single broker cluster running on your local system.  Use the default configuration, which will start a broker on `localhost:9092`.

If you're not familiar with Kafka, follow the [Conduktor Kafkademy tutorial](https://www.conduktor.io/kafka/starting-kafka/) for a step by step guide on how to do this.

You can also use an existing Kafka cluster, by updating the [Conduktor gateway configuration](#conduktor-gateway-to-kafka-cluster-configuration).

## Run the gateway

Build the Gateway image.

:::caution
Note this requires Java 17 or later. If you are using an older version, please download Java 17+

You'll also need a local kafka cluster running with a bootstrap address of `localhost:9092`
:::

```bash
git clone https://github.com/conduktor/conduktor-gateway && cd conduktor-gateway
mvn clean package
```

This clones the conduktor-gateway repository, and then builds and packages the Conduktor Gateway jar file.

Once the `mvn clean package` has run successfully, you can run the gateway with the demonstration logger interceptor.  

To confirm a successful build, look for `BUILD_SUCCESS` in the output from the `mvn clean package`:

![img_1.png](img_1.png)


## Run the logging interceptor

Add the demo [logger interceptor](https://github.com/conduktor/conduktor-gateway/tree/main/logger-interceptor) to the classpath, and then start the gateway:

```bash
CLASSPATH=logger-interceptor/target/logger-interceptor-0.5.0-SNAPSHOT.jar bin/run-gateway.sh
```

In the terminal window, you should see a log line similar to this, which indicates the gateway has started successfully:
```
Gateway started successfully with port range: 6969:6975`
```

Test the demonstration logger interceptor using the Kafka command line tools.  The logger interceptor writes lines to standard out (here the gateway logs) when Kafka traffic flows through the gateway:

```bash
cd <kafka_install_directory>
bin/kafka-topics.sh --create --topic my-gateway --bootstrap-server localhost:6969
bin/kafka-console-producer.sh --topic my-gateway --bootstrap-server localhost:6969
bin/kafka-console-consumer.sh --topic my-gateway --bootstrap-server localhost:6969 --from-beginning --property print.headers=true
```

Each Kafka flow that is sent by the calls above is intercepted by the Logger Interceptor as it passes through the Gateway, and information about that Kafka flow is written to the logs.

Look in the terminal window where the gateway is running. You'll find log lines, written by the Logger Interceptor, similar to:

```bash
Hello there, a class org.apache.kafka.common.requests.FetchResponse was sent/received
Produce was called with version: 9
Fetch was requested from localhost
```

This completes the quick start and demo.

# Configure an interceptor from Conduktor Marketplace

Next, explore the Interceptors on the [Conduktor Marketplace](https://marketplace.conduktor.io).

In the Marketplace you'll find a wide range of Interceptors, a number of which are available for use for free in the open-source Conduktor Gateway. 

Once you've decided which of the free interceptors you'd like to try, select the "Download" button on the Interceptor's page in the Marketplace to download that interceptor's jar file.  Save this to a location on your machine that you can add to your Java classpath.

[Update your Gateway's configuration file](https://docs.conduktor.io/platform/gateway/configuration/opensource-yaml-config/#interceptors), found at `<GATEWAY_REPOSITORY_LOCATION>/gateway-core/config/application.yaml` to enable each interceptor you'd like to try.  The `Configuration` section on each Interceptor's page in the Marketplace describes the available configuration.  

Multiple interceptors can be configured, each as a separate list item, under the `interceptors` field in the `application.yaml` configuration file.

This example adds the [Create topic validation](https://conduktor-marketplace.vercel.app/interceptors/safeguard-topic-creation-validation/) and [Schema id present](https://conduktor-marketplace.vercel.app/interceptors/safeguard-schema-id-present/) interceptors.

```yaml
kafkaSelector:
  type: file
  path: gateway-core/config/kafka.config
interceptors:
  - name: myCreateTopicChecksInterceptor
    pluginClass: io.conduktor.gateway.interceptor.CreateTopicSafeGuardPlugin
    priority: 100
    config:
      - key: topic
        value: '.*'
      - key: minNumPartition
        value: 5
      - key: maxNumPartition
        value: 10
      - key: minReplicationFactor
        value: 1
      - key: maxReplicationFactor
        value: 1
  - name: mySchemaIdPresentInterceptor
    pluginClass: io.conduktor.gateway.interceptor.SchemaIdPresentValidationPlugin
    priority: 100
    config:
      - key: topic
        value: my_topic_.*
      - key: schemaIdRequired
        value: false

```

Once you've updated the configuration file, update your classpath to include the interceptor jar file(s), and then restart the gateway to pick up the changes.  For the example above, this would be:

```bash
CLASSPATH=<DOWNLOAD_LOCATION>/gateway-create-topic-safeguard-1.0.0.jar:<DOWNLOAD_LOCATION>/gateway-schema-id-present-validation-interceptor-1.0.0.jar bin/run-gateway.sh 
```

:::note
If you remove the logger interceptor from your classpath, as is shown in the example above, don't forget to remove the entry for this interceptor from your`application.yaml` configuration file too.
:::

# Use your own Kafka cluster and Kafka clients

Once you've decided on your interceptors, update the configuration to use your own Kafka cluster and Kafka clients, so you can start exploring the benefits Conduktor Gateway can bring to your environment.

There are two sets of properties to configure when using your own client and your own Kafka cluster:

- The Kafka client to Conduktor Gateway connection information
- The Conduktor Gateway to Kafka cluster connection information


![img.png](img.png)


## Kafka Client to Conduktor Gateway configuration

By default the Conduktor Open Source Gateway does not run with any security enabled. [Basic security](../configuration/oss_security.md) is available.

To connect your Kafka clients to the gateway update the `bootstrap.servers` in the client properties to be `localhost:6969`. This will ensure all Kafka traffic is routed via the gateway.

If needed, you can update the host and port for the gateway by editing the [hostport configuration](../configuration/opensource-yaml-config.md#hostport-configurations).  If you update this configuration, remember to update the bootstrap.servers in your client configuration to match.

## Conduktor Gateway to Kafka cluster configuration

Conduktor Gateway can connect to any Kafka cluster that a standard Kafka application can connect to.

Gateway configuration is set in a `kafka.config` properties file, the location of which is configured by your [gateway configuration file](https://docs.conduktor.io/platform/gateway/configuration/opensource-yaml-config/).

The default gateway configuration file can be found at `<GATEWAY_DOWNLOAD_LOCATION>/gateway-core/config/application.yaml`

The location of the Kafka configuration file used to connect to the backing Kafka cluster is set by the kafkaSelector section in the yaml file:

```yaml
kafkaSelector:
  type: file
  path: gateway-core/config/kafka.config
```

[Open Source Conduktor Gateway Security](../configuration/oss_security.md) describes the format of the kafka.config file in more detail, including how to connect to a secured Kafka cluster.




