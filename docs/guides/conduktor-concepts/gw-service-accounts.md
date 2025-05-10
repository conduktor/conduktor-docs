---
title: Gateway service accounts
description: Learn Conduktor terminology
---

## Gateway Service Accounts & Authentication

Gateway Service Accounts are tightly coupled to the Authentication method you choose to connect your clients to the Gateway.

:::info
The objective of Authentication, whatever the method used, is to provide Conduktor Gateway with a Service Account **name** to be used in Kafka, and optionally a **set of Groups** and a **Virtual Cluster** to associate to the Service Account.
:::

There are 3 ways to authenticate users with the Gateway:

- **Delegating** authentication to the backing cluster (Confluent Cloud API Keys for instance)
- Using an **External** source of authentication such as OAuth/OIDC, mTLS, LDAP
- Using Gateway **Local** Service Accounts

Check the dedicated [Authentication page]for more details.
