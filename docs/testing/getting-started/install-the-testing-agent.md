---
sidebar_position: 2
title: Install the Testing Agent
description: The testing agent ensures you can reach clusters securely and with isolation. Set it up to enable testing.
---

# Setup the Testing Agent

The Testing Agent is a micro-application that runs on your desktop, private network or CI environment. It ensures you can reach clusters that your host has access to securely and with isolation.

When you **Create** the Testing Agent in your Workspace, you will be provided the OS specific commands for **Running** the Agent.&#x20;

You **must** setup the Testing Agent to execute [Test Scenarios](../features/building-tests/test-scenarios).

:::tip
Testing Agent can be installed and used on GNU/Linux, macOS, FreeBSD, and Windows. You can install it:

- In a container
- By downloading a binary manually
  :::

## Agent Setup&#x20;

From within the Conduktor Testing UI, navigate to the **Agents** tab. Note you may need to create a [Workspace](../features/workspace) first.

![](<../assets/image (27) (1) (1) (1).png>)

Provide a **Name** to identify your agent, and confirm whether it will be personal, organisational, or used in your CI/CD environment.

- **Personal Agent:** For running locally on your own machine or server.
- **Organisation Agent**: For running inside a company server or network.
- **CI Agent:** You will use this token for executing tests in CI/CD jobs. Note this is only relevant when you have already created meaningful tests, and want to automate their execution.
  - \__[\_Learn more_](../features/ci-cd-automation) _about using the CI Agent_

Select **Create** to generate the commands for **downloading** and **running** your Agent.&#x20;

## Run the Testing Agent

Select the relevant **OS** for running your Agent. You will be provided commands for **downloading** and **running** the Agent on:

- MacOS
- Linux
- Windows
- Docker

:::info
Using Docker introduces complexity when trying to reach clusters on localhost, or referencing certificates on your local file system. 
For these use cases, we recommend using a [binary distribution](install-the-testing-agent#binary-installation).
:::

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
If you observe an error regarding the Java Runtime (class file version 55.0), please [download](https://www.oracle.com/java/technologies/downloads/) a more recent version of Java. The Agent supports **Java 11+**.
:::

Assuming setup was successful, you will see the green `Connection is successful!` message within the Conduktor Testing UI.

Ensure that your newly created Agent is selected in the left-hand navigation menu.&#x20;

![](<../assets/image (11) (1).png>)

Now you have the Testing Agent installed, you will be able to reach clusters that your host has access to within the Testing application. Continue to [connecting a Kafka cluster](connect-to-a-kafka-cluster).

## Binary Installation&#x20;

**Java 11+** is required for running the Testing Agent. If you do not meet these requirements, please [download](https://www.oracle.com/java/technologies/downloads/) a more recent Java version.

### [Download](https://releases.conduktor.io/testing-agent-jar) the Conduktor Testing Agent

Then, **Run** the below command via command line, populating the token parameter with your newly generated token.

```
java -jar conduktor-testing-agent-*.jar --token=<TOKEN>
```

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

## Running in your CI/CD Environment&#x20;

The Testing Agent is a long-running process, and should not be used in a CI pipeline.

For CI workflows, please read [our dedicated documentation](../features/ci-cd-automation).
