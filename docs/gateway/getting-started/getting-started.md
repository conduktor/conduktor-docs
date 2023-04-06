---
title: Getting Started
description: Conduktor Proxy is provided as a Docker image. This can either be deployed in a single container or a number of proxies can be deployed behind a load balancer.
---

# System Requirements



Interceptors are configured in the Conduktor Gateway's [application.yaml](../gateway-core/config/application.yaml) configuration file by specifying a fully qualified class name, configuration details and a priority.  Multiple interceptors can be configured to run sequentially, in the priority specified order.  The project [README.md](../README.md) documents configuring and starting the Gateway.


Conduktor Proxy sits between your Kafka deployment and the clients it serves. By having a complete view over all the traffic in and out of the cluster, Conduktor Proxy can provide insights that are not available anywhere else.

Conduktor proxy is 100% compatible with the Apache Kafka wire protocol. This means that it can analyse, react to and modify client interactions to provide a fuller data streaming experience. You can explore more of the features of Conduktor Proxy [here](./features/features.md)


Conduktor Proxy is provided as a Docker image. This can either be deployed in a single container or a number of proxies can be deployed behind a load balancer.

Jump to:

- [Hardware Requirements](#hardware-requirements)
- [Disabling a Module](#disabling-a-module)

## Hardware Requirements

# Running

## Preparation

To run conduktor-gateway you will first require:

* Java 17+
* a running kafka cluster
* an updated **gateway-core/config/kafka.config** to point to your kafka cluster.


**Minimum**

- 4 CPU cores
- 8 GB of RAM
- 5 GB of disk space


## Kafka Requirements

Conduktor Proxy requires Apache Kafka version 2.5.0 or higher. 

Conduktor Proxy should connect to Kafka as an admin user. As a minimum this user should have rights to:
* Create/Delete/Alter topics
* Commit offsets
* Create/alter/delete consumer groups
* Describe cluster information


# How to start?

The following Quick Start steps guide you through setting up the Gateway, the demo interceptor, and validating the configuration.

### Get a Kafka instance:

Follow step 1 and step 2 (Zookeeper or KRaft) from the  [Apache Kafka Quick Start](https://kafka.apache.org/quickstart) to start a single broker cluster running on your local system.

OR

Get the connection information for your existing Kafka cluster

### Download and build

```bash
$ git clone https://github.com/conduktor/conduktor-gateway && cd conduktor-gateway
$ code gateway-core/config/kafka.config   # Use the defaults, or update to include your existing Kafka cluster configuration.
$ mvn clean package                # build the .jar, requires Java 17+
```

### Start Conduktor Gateway:

```bash
$ export CLASSPATH=loggerInterceptor/target/logger-interceptor-1.0-SNAPSHOT.jar # Add the logger interceptor to the classpath, or add your own interceptor jar files here
$ bin/run-gateway.sh
```

### Validate

Conduktor Gateway comes with an included interceptor which writes log lines and information about the Kakfka traffic to stdout.


Test the APIs using the command line tools
```bash
cd <kafka_install_directory>
bin/kafka-topics.sh --create --topic quickstart-events --bootstrap-server localhost:6969
bin/kafka-console-producer.sh --topic quickstart-events --bootstrap-server localhost:6969
bin/kafka-console-consumer.sh --topic quickstart-events --bootstrap-server localhost:6969 --from-beginning --property print.headers=true
```

Then look in the terminal where the gateway is running, you should find log lines, written by the loggerInterceptor, similar to:

```
Hello there, a class org.apache.kafka.common.requests.FetchResponse was sent/received 
Produce was called with version: 9
Fetch was requested from localhost
```

OR

Update your Kafka Clients' `bootstrap.servers` to `localhost:6969` (the Gateway) and remove any authentication configuration. Note that Conduktor Gateway does not use the same authentication scheme as the backing Kafka cluster and so clients should be configured according to the authenticatorType configuration rather than what is configured in the Kafka cluster.

Run your Kafka Client workload, and look for the log lines written to the terminal where Gateway is running.  These will include information about the flows passing through the Gateway from your application.



--------
