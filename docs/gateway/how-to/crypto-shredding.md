---
sidebar_position: 1
title: Crypto shredding
description: Reduce costs and maintain compliance with centralized and secure key management
---

## Overview

:::info[**Conduktor Shield** feature]
:::

Conduktor provides a cost-efficient and scalable crypto shredding solution that works seamlessly with Kafka. Keys are centrally managed and securely stored which ensures that deleting a key instantly makes all associated data unreadable, without the complexity of self-managed vaults, expensive per-user encryption or additional infrastructure overhead.

![Conduktor's crypto shredding solution](/images/changelog/gateway/v3.7.0/crypto-shredding-concept.png)

This allows you to honor deletion requests and maintain compliance with regulations like GDPR (General Data Protection Regulation) and CCPA (California Consumer Privacy Act). This approach is also particularly valuable for organizations that need to implement crypto shredding at scale, across large user bases or high-volume data sets, offering both **substantial cost savings** and **improved performance** compared to managing individual keys directly in an external KMS such as AWS.

Conduktor's solution:

- stores only a single master key in your external KMS
- securely manages thousands of individual encryption keys in Gateway's internal key store
- deletes specific user keys when needed, rendering their data permanently inaccessible

### How does it work?

- Conduktor generates the **user-specific encryption key** from a central master key provided by an external KMS (e.g. AWS KMS).
- This encryption key is securely stored within Kafka.
- All the messages from one user are encrypted using the **unique per-user key**.
- When a deletion request is received, the key for that `UserID` is permanently removed.
- The new KMS type *gateway* allows you to manage granular encryption keys for individual users or records.
- The keys stored by Gateway are all encrypted themselves via a configured master key externally held in your KMS - ensuring they remain secure and useless without access to the external KMS.

## Context

Are there any pre-requisites? Could use tabs if we offer a choice.

[Configure the Gateway KMS](/gateway/interceptors/data-security/encryption/encryption-configuration#gateway-kms)

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="TAB 1" label="TAB ONE">

</TabItem>
<TabItem value="TAB 2" label="TAB TWO">

</TabItem>
</Tabs>


## Sample use case
Let's pick one scenario - either the most common one or one we wat to promote.

###  1. First, do this

###  2. Then do this


## Troubleshoot
Any known issues that can occur? Existing workarounds? Use the accordions:
<details>
  <summary>How do I do something?</summary>
  <p>Answer.</p>
</details>
<details>
  <summary>I get this error</summary>
  <p>Explain how to resolve it</p>
</details>


## Related resources
- [Learn Apache Kafka](https://learn.conduktor.io/kafka/)
- [Give us feedback/request a feature](https://conduktor.io/roadmap)