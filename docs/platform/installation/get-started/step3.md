---
sidebar_position: 3
---

# Docker Compose

Use Docker Compose to start:
 - Single node Kafka cluster
 - Schema Registry
 - The latest version of Conduktor Platform

Once you have started Conduktor, you can [customize it](#customizing-the-docker-compose) to connect to your own infrastructure.

### Prerequisites

:::info
Install [Docker Compose](https://docs.docker.com/compose/install)
:::

## Run Conduktor Platform

Note that when you run this command, you will be prompted for your **organization name** and be asked to create **admin credentials**.

```bash
curl -sS https://raw.githubusercontent.com/conduktor/conduktor-platform/main/example-local/autorun/autorun.sh | bash -s setup
```

If you do not want to use the auto-run script, you can find more information about starting the platform locally via Docker Compose in the example repository:

https://github.com/conduktor/conduktor-platform/tree/main/example-local

## Access Conduktor

After a few minutes, **Conduktor will be available at [http://localhost:8080](http://localhost:8080)**

## Customizing the Docker Compose

Conduktor depends on a configuration file `platform-config.yaml`. This is used to setup your oganizations environment. The file is used to declare:
 - Organization name
 - Kafka clusters
 - External database (optional)
 - User authentication (Basic or SSO)

In the above example, a default `platform-config.yaml` is used to start the platform. However, if you would like to see more examples for connecting to your own infrastructure, see the [configuration snippets](./../../configuration/configuration-snippets.md).