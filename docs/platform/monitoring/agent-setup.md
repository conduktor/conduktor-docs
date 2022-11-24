---
sidebar_position: 2
title: Agent Setup
description: Learn how to get started with Monitoring
---

# Agent Setup

You should setup the Agent to use Monitoring at full capacity. Running Prometheus node exporter and JMX exporter will ensure you maximize the metrics you have access to within Conduktor. As there can be a wide range of unique configurations and edge cases when seting up an agent, these instructions should only be considered guidelines. Should you encounter any issues with setup, please contact us directly using the chat widget on this page.

## Setup JMX Exporter

### Download the agent and its configuration

Create a new directory for jmx-exporter

```bash
mkdir /opt/jmx-exporter
```

Download the jar into your newly generated directory:

```bash
curl https://repo1.maven.org/maven2/io/prometheus/jmx/jmx_prometheus_javaagent/0.17.2/jmx_prometheus_javaagent-0.17.2.jar -o/opt/jmx-exporter/jmx_prometheus_javaagent-0.17.2.jar
```

Download the associated monitoring configuration file:

```bash
curl http://demo.conduktor.io/monitoring/kafka-broker.yml -o /opt/jmx-exporter/kafka-broker.yml
```

### Start your Kafka service

Your Kafka server must start with the following javaagent:

```bash
-javaagent:/opt/jmx-exporter/jmx_prometheus_javaagent-0.17.2.jar=9101:/opt/jmx-exporter/kafka-broker.yml
```

For instance, you can set the environment variable:

```bash
KAFKA_OPTS=-javaagent:/opt/jmx-exporter/jmx_prometheus_javaagent-0.17.2.jar=9101:/opt/jmx-exporter/kafka-broker.yml
```

---

## Setup Node Exporter

Install Prometheus node exporter on your server (apt based systems):

```bash
apt install prometheus-node-exporter
```

Note on other systems you can install it manually (<a href="https://prometheus.io/docs/guides/node-exporter/#installing-and-running-the-node-exporter">docs</a>).

Node exporter can be started with its default configuration and should listen on port 9100. However, you may want to select which filesystems are monitored. You can use the `--collector.filesystem.mount-points-exclude=...` option for this.
