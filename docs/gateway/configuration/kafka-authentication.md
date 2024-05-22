---
sidebar_position: 2
title: Gateway to Kafka Configuration
description: Securing Conduktor Gateway
---

You can use all the Kafka security protocols; `PLAINTEXT`, `SASL_PLAINTEXT`, `SASL_SSL` and `SSL`.
For these security protocols we support all SASL mechanisms; `PLAIN`, `SCRAM SHA`, `OAuthBearer`, `Kerberos` etc.

Provide Gateway with the environment variables to connect to Kafka.
Use the variables that start with a `KAFKA_` prefix as it is Gateway's connection to **Kafka**.

```yaml
conduktor-gateway:
    image: conduktor/conduktor-gateway:2.3.0
    environment:
      KAFKA_BOOTSTRAP_SERVERS: kafka1:9092,kafka2:9092
      KAFKA_SASL_MECHANISM: PLAIN
      KAFKA_SECURITY_PROTOCOL: SASL_PLAINTEXT
      KAFKA_SASL_JAAS_CONFIG: org.apache.kafka.common.security.plain.PlainLoginModule required  username="admin" password="admin-secret";
```

## Service Account and ACL requirements

Depending on the Client to Gateway Authentication method you choose, the Service Account used to connect the Gateway might need different ACLs to operate properly.

### Delegated Authentication
In Delegated Authentcation, a Client connection is established from the Gateway to the client using the same service account provided to the Gateway.  
As a result, the ACLs are directly checked against this Service Account.

For this reason, Gateway Service Account requires the following ACLS:
- read on internal topics and they should (ofc) exist
- describe consumer group for internal topic
- Describe on cluster
- Describe topics for alias topics creation

### Non-Delegated