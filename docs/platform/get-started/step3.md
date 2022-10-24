---
sidebar_position: 3
---

# Docker Compose

Use Docker Compose to start a single node Kafka cluster, Schema Registry and the latest version of the Conduktor Platform.

### Prerequisites

:::info
Install **[Docker Compose](https://docs.docker.com/compose/install/)**
:::

## Run Conduktor Platform

Note that when you run this command, you will be prompted for your organization name and be asked to create admin credentials.

```
curl -sS https://raw.githubusercontent.com/conduktor/conduktor-platform/main/example-local/autorun/autorun.sh | bash -s setup
```

## Access Conduktor

After a few minutes, **Conduktor will be available at [http://localhost:8080](http://localhost:8080)**
