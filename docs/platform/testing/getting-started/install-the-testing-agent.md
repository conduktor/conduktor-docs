---
sidebar_position: 2
title: Setup the Testing Agent
description: The testing agent ensures you can reach clusters securely and with isolation. Set it up to enable testing.
---

# Setup the Testing Agent

The Testing Agent is a micro-application that runs on your desktop, private network or CI environment. It ensures you can reach clusters that your host has access to securely and with isolation.

- If you started Conduktor via **Docker**, the installation is bundled with an **embedded agent**
- If you are using **Conduktor Cloud**, you must [setup](#agent-setup) the Testing Agent to get started

## Agent Setup

:::tip
The Testing Agent can be installed and used on GNU/Linux, macOS, FreeBSD, and Windows. You can install it:

- In a container
- By downloading a binary manually

:::

From within the Conduktor Testing UI, navigate to the **Agents** tab. Note you may need to create a [Workspace](../features/workspace) first.

![](<../assets/image (27) (1) (1) (1).png>)

Provide a **Name** to identify your agent, and confirm whether it will be personal, organisational, or used in your CI/CD environment.

- **Personal Agent:** For running locally on your own machine or server.
- **Organisation Agent**: For running inside a company server or network.
- **CI Agent:** You will use this token for executing tests in CI/CD jobs. Note this is only relevant when you have already created meaningful tests, and want to automate their execution.
  - _[Learn more](../features/ci-cd-automation) about using the CI Agent_

Select **Create** to generate the commands for **downloading** and **running** your Agent.&#x20;

## Run the Testing Agent

Select the relevant **OS** for running your Agent. You will be provided commands for **downloading** and **running** the Agent on:

- MacOS
- Linux
- Windows
- Docker

![](<../assets/image (10) (1).png>)

:::tip
A token can be used by **multiple** agents, allowing it to scale horizontally.
However when running agents in different locations, or with different access or different resources, you should create separate tokens.
:::

### Download the Token

:::danger
You will only be shown the token **once**, so it's recommended you **Download** the token and store it somewhere secure.
:::

### Validate the Connection

After executing the commands, you should see `Agent connected!` in the logs.&#x20;

:::info
If you observe an error regarding the Java Runtime (class file version 55.0), please [download](https://www.oracle.com/java/technologies/downloads) a more recent version of Java. The Agent supports **Java 11+**.
:::

Assuming setup was successful, you will see the green `Connection is successful!` message within the Conduktor Testing UI.

Ensure that your newly created Agent is selected in the left-hand navigation menu.&#x20;

![](<../assets/image (11) (1).png>)

Now you have the Testing Agent installed, you will be able to reach clusters that your host has access to within the Testing application. Continue to [connecting a Kafka cluster](connect-to-a-kafka-cluster).

## Binary Installation&#x20;

**Java 11+** is required for running the Testing Agent. If you do not meet these requirements, please [download](https://www.oracle.com/java/technologies/downloads) a more recent Java version.

### [Download](https://releases.conduktor.io/testing-agent-jar) the Conduktor Testing Agent

Then, **Run** the below command via command line, populating the token parameter with your newly generated token.

```
java -jar conduktor-testing-agent-*.jar --token=<TOKEN>
```

:::tip
Using a proxy? You can inherit the configuration from your system by using :

`java -Djava.net.useSystemProxies=true -jar ...`

:::

### Container installation

:::info
Using Docker introduces complexity when trying to reach clusters on localhost or reference certificates on your local file system.
For these use cases, we recommend using the [binary distribution](install-the-testing-agent#binary-installation).
:::

**Container image**: `ghcr.io/conduktor/testing-agent:latest`

You will need to provide the agent token as well, through the **TOKEN** environment variable

**Run** with Docker:

```

docker run -e TOKEN=<TOKEN> -d ghcr.io/conduktor/testing-agent:latest

```

**Run** with Docker Compose:

```

# docker-compose.yaml

services:
testing-agent:
image: ghcr.io/conduktor/testing-agent:latest
environment:
TOKEN: <TOKEN>

```

## Using with self-hosted platforms

To allow external agents and CI runners to reach your on-premise platform, you will need to expose the **`7010`** TCP port on the platform.

The agent will initiate a connection using GRPC.

**Your platform needs to be reachable from the system running the agent**.
Make sure to setup your network accordingly.

You can then configure your agent/CI runner with the following environment variables:

- `PFM_HOST` : the IP/domain of your platform
- `PFM_PORT` : the port mapped to the 7010 internal port of your platform
- `PFM_USE_SSL` : true if you are using SSL, false otherwise

Alternatively, you can use the `--host=XX`, `--port=XX` and `--use-ssl=XX` command line arguments.

## Running in your CI/CD Environment&#x20;

The Testing Agent is a long-running process, and should not be used in a CI pipeline.

For CI workflows, please read [our dedicated documentation](../features/ci-cd-automation).
