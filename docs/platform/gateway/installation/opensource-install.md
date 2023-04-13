---
sidebar_position: 3
title: Open Source Installation
description:  Open source installation
---


The opensource Conduktor Gateway is made up of two components, the gateway transport layer, and interceptors downloaded from the Conduktor Marketplace.

The gateway transport layer is the wiring between your Kafka client application and your Kafka broker. It has access to all the Kafka data flowing through it. 

Interceptors are loaded into the gateway.  The interceptors are triggered when Kafka data flows through the gateway, and provide functionality such as adding chaos to aid with testing, or adding safeguards around what Kafka configurations are allowed and keep your Kafka cluster protected.

It is also possible to [write your own interceptor](../interceptors/write-an-interceptor.md).

This diagram show the high level architecture of the open source Conduktor Gateway

![GatewayAndMarketPlace.png](GatewayAndMarketPlace.png)

# Quick start and demo

The quick start guide will demonstrate how to install Conduktor Gateway and configure it against a Kafka running on localhost. The logging interceptor will be used to write a log to stdout when Kafka traffic flows through the gateway.

## Get a Kafka instance

Follow step 1 and step 2 (Zookeeper or KRaft version) from the [Apache Kafka Quick Start](https://kafka.apache.org/quickstart) to create a single broker cluster running on your local system.  Use the default configuration, which will start a broker on `localhost:9092`.

## Run the gateway

Build the Gateway image.

:::caution
Note this requires Java 17 or later. If you are using an older version, please download Java 17+
:::

```bash
$ git clone https://github.com/conduktor/conduktor-gateway && cd conduktor-gateway
$ mvn clean package 
```



Add the demo [logger interceptor](https://github.com/conduktor/conduktor-gateway/tree/main/logger-interceptor) to the classpath, and then start the gateway:

```bash
$ CLASSPATH=logger-interceptor/target/logger-interceptor-0.2.0-SNAPSHOT.jar bin/run-gateway.sh
```

In the terminal window, you should see a log line similar to this, which indicates the gateway has started successfully:
```
2023-04-05 22:00:12 [      main] [INFO ] [GatewayExecutor:50] - Gateway started successfully with port range: 6969:6975`
```

## Validate 
Test the demonstration logger interceptor using the Kafka command line tools.  The logger interceptor writes lines to standard out (here the gateway logs) when Kafka traffic flows through the gateway:

```bash
cd <kafka_install_directory>
bin/kafka-topics.sh --create --topic my-gateway --bootstrap-server localhost:6969
bin/kafka-console-producer.sh --topic my-gateway --bootstrap-server localhost:6969
bin/kafka-console-consumer.sh --topic my-gateway --bootstrap-server localhost:6969 --from-beginning --property print.headers=true
```

Look in the terminal where the gateway is running, you should find log lines, written by the logger interceptor, similar to:

```bash
Hello there, a class org.apache.kafka.common.requests.FetchResponse was sent/received
Produce was called with version: 9
Fetch was requested from localhost
```

This completes the quick start and demo.

# Bring your own Kafka Cluster and Kafka Clients.

The next step is to use your own Kafka cluster and Kafka clients, so you can start exploring the benefits Conduktor Gateway can bring to your environment.

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

Gateway configuration is set in a kafka.config properties file, the location of which is configured by your gateway configuration yaml file.

The default gateway configuration file can be found at `<GATEWAY_DOWNLOAD_LOCATION>/gateway-core/config/application.yaml`

The location of the Kafka configuration file used to connect to the backing Kafka cluster is set by the kafkaSelector section in the yaml file:

```yaml
kafkaSelector:
  type: file
  path: gateway-core/config/kafka.config
```

[Open Source Conduktor Gateway Security](../configuration/oss_security.md) describes the format of the kafka.config file in more detail, including how to connect to a secured Kafka cluster.




