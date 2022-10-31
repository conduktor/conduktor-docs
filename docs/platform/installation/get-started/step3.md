---
sidebar_position: 3
---

# Docker Compose

Use Docker Compose to start a single node Kafka cluster, Schema Registry and the latest version of the Conduktor Platform.

### Prerequisites

:::info
Install [Docker Compose](https://docs.docker.com/compose/install)
:::

## Run Conduktor Platform

Note that when you run this command, you will be prompted for your organization name and be asked to create admin credentials.

```
curl -sS https://raw.githubusercontent.com/conduktor/conduktor-platform/main/example-local/autorun/autorun.sh | bash -s setup
```

If you do not want to use the auto-run script, you can find more information about starting the platform locally via Docker Compose in the example repository:

https://github.com/conduktor/conduktor-platform/tree/main/example-local

## Access Conduktor

After a few minutes, **Conduktor will be available at [http://localhost:8080](http://localhost:8080)**

## Additional Configuration

Conduktor depends on a configuration file `platform-config.yaml`. This is used to setup your oganizations environment. The file is used to declare:
 - Cluster configurations
 - User authentication (Basic or SSO)

In the above example, a default `platform-config.yaml` is used to start the platform. However, if you would like to see more examples of customization, see [YAML snippets](#somewhere).