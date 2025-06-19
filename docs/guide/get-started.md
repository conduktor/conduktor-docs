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

This example builds a **complete Conduktor deployment** that consists of all Conduktor <GlossaryTerm>artifacts</GlossaryTerm>, Redpanda Kafka, schema registry and supporting services for data generation.

## Overview

Once deployed, you’ll have access to a fully functional Kafka stack integrated with Conduktor’s UI and backend services. This environment is ideal for trying out Conduktor’s features before deploying to a production environment.

<a href="/guide/get-start-overview.png" target="_blank" rel="noopener">
  <img src="/guide/get-start-overview.png" alt="Get started" style={{maxWidth: '100%'}} style={{paddingTop: '10px'}} />
</a>


1. The **data generation service** publishes a continuous stream of synthetic events that *simulate an e-commerce business*.
1. Conduktor **Gateway intercepts Kafka traffic** to apply real-time operational controls — including *encryption*, *decryption*, *data masking*, and *Traffic Control Policies* — without requiring changes to producers or consumers.
1. The intercepted **data flows through the Conduktor Gateway proxy and lands in a Redpanda Kafka cluster** with a *schema registry* enforcing structure and compatibility across topics.
1. Conduktor Console provides a **centralized UI-based control plane** to manage both the Redpanda Kafka cluster and Conduktor Gateway, allowing you to:

    - monitor topics, schemas, consumer groups and connectors
    - define and apply Gateway policies
    - trace message flows
    - audit activity across the entire stack

## Data policies

The data policies configured in this get-started stack are:

  | **Policy**                        | **Description**                                            |
  | --------------------------------- | ---------------------------------------------------------- |
  | ProducePolicyPlugin            | Increases resilience and data quality by ensuring produced messages adhere to the specified configuration requirements. Parameters configure **Block** acks value `-1` and **audits** compression values (GZIP, LS4, ZSTD, SNAPPY).    |
  | EncryptPlugin          | Full payload encryption on topics matching pattern: `.*_encrypted$`. Switch to the `local-kafka` from the primary navigation to see the effect in the **customers_encrypted** topic. |
  | DecryptPlugin          | Decrypts full payloads *on consume* for topics matching the `.*_encrypted$` pattern. This determines showing the *encrypted data in plain-text* when using the `cdk-gateway` cluster.   |
  | FieldLevelDataMaskingPlugin        | Masks `profile.creditCardNumber`, `contact.email` and `contact.phone` fields for topics matching the ```^[A-Za-z]*_masked$``` pattern.   |
  | CreateTopicPolicyPlugin       | Ensures that topic configuration adheres to your own standards. Configured parameters validate that the **number of partitions is between 1 and 3** else the topic creation action will be **Block**.   |

## Run Conduktor

```bash
curl -L https://releases.conduktor.io/quick-start -o docker-compose.yml && docker compose up -d --wait && echo "Conduktor started on http://localhost:8080"
```

### Advanced configuration

[Here's the Docker Compose file](https://raw.githubusercontent.com/conduktor/conduktor-platform/main/quick-start.yml) for the get-started stack. For advanced configuration see:

- [Gateway environment variables](/guide/conduktor-in-production/deploy-artifacts/deploy-gateway/env-variables)
- [Console environment variables](/guide/conduktor-in-production/deploy-artifacts/deploy-console/env-variables)

## Next steps

- [Configure your own Kafka clusters](/guide/conduktor-in-production/admin/configure-clusters)
- [Deploy Conduktor in production](/guide/conduktor-in-production)
- [Check out Conduktor concepts](/guide/conduktor-concepts)
