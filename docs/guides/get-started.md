---
sidebar_position: 20
id: get-started
title: Get started
description: Get started with Conduktor
---
import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

:::info[Pre-requisite]
[Docker Compose](https://docs.docker.com/compose/install)
:::

[Get started with Conduktor](https://www.conduktor.io/get-started) in just a few minutes.

This example builds a complete Conduktor deployment consisting of all Conduktor <GlossaryTerm>artifacts</GlossaryTerm>, Redpanda Kafka, schema registry and supporting services for data generation.

## Overview

Once deployed, you’ll have access to a fully functional Kafka stack integrated with Conduktor’s UI and backend services. This environment is ideal for trying out Conduktor’s features before deploying to a production environment.

![Get start overview](/guides/get-start-overview.png)

The Conduktor get-started stack is described as follows:

1. The **data generation service** publishes a continuous stream of synthetic events that *simulate an e-commerce business*.
1. Conduktor **Gateway intercepts Kafka traffic** to apply real-time operational controls — including *encryption*, *decryption*, *data masking*, and *Traffic Control Policies* — without requiring changes to producers or consumers.
1. The intercepted **data flows through the Conduktor Gateway proxy and lands in a Redpanda Kafka cluster** with a *schema registry* enforcing structure and compatibility across topics.
1. Conduktor Console provides a **centralized UI-based control plane** to manage both the Redpanda Kafka cluster and Conduktor Gateway. It allows you to monitor topics, schemas, consumer groups, connectors; define and apply Gateway policies; trace message flows; and audit activity across the entire stack — making it easier to govern, operate, and troubleshoot distributed data pipelines.

## Data policies

The data policies configured in the get-started stack are described as follows:

  | **Policy**                        | **Description**                                            |
  | --------------------------------- | ---------------------------------------------------------- |
  | ProducePolicyPlugin            | Increase resilience and data quality by ensuring produced messages adhere to the specified configuration requirements. Parameters configure **Block** acks value **-1**, and **audits** compression values (GZIP, LS4, ZSTD, SNAPPY).    |
  | EncryptPlugin          | Full payload encryption on topics matching pattern: `.*_encrypted$`. Note you should switch to the `local-kafka` from the primary navigation to see the effect in topic **customers_encrypted**. |
  | DecryptPlugin          | Decrypt full payloads on consume for topics matching pattern: `.*_encrypted$`. Note this determines why you see the encrypted data in plain-text when using cluster `cdk-gateway`.   |
  | FieldLevelDataMaskingPlugin        | Masks fields `profile.creditCardNumber`, `contact.email` and `contact.phone` for topics matching pattern: `^[A-Za-z]*_masked$``.   |
  | CreateTopicPolicyPlugin       | Ensures your topic configuration adheres to your own standards. Parameters configured validate the **number of partitions** is between **1** and **3**, else the topic creation action will be **BLOCK**.   |

## Run Conduktor

```bash
curl -L https://releases.conduktor.io/quick-start -o docker-compose.yml && docker compose up -d --wait && echo "Conduktor started on http://localhost:8080"
```

## Advanced configuration

[View the Docker Compose file](https://raw.githubusercontent.com/conduktor/conduktor-platform/main/quick-start.yml) for the get-started stack. For advanced configuration see:
- configuration properties and env variables per component
- ...
- ...

## Next steps

- Configure your own Kafka clusters
- Deploy Conduktor in production
- Check out Conduktor concepts
-
