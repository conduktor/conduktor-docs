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
In Delegated Authentication, the credentials provided to establish the connection between the Client and the Gateway are the same used from the Gateway to the backing Kafka.  
As a result, the Client will inherit the ACLs of the service account configured on the backing cluster.

On top of that, Gateway needs its own Service Account with the following ACLs to operate correctly:
- read on internal topics and they should (ofc) exist
- describe consumer group for internal topic
- Describe on cluster
- Describe topics for alias topics creation

### Non-Delegated
In Non-Delegated Authentication (Local, Oauth or mTLS), the connection is using the Gateway's Service Account to connect to the backing Kafka.

This Service Account must have all the necessary ACLs to perform not only the Gateway operations:
- read on internal topics and they should (ofc) exist
- describe consumer group for internal topic
- Describe on cluster
- Describe topics for alias topics creation
... but also all the permissions necessary to serve all Gateway users.

If necessary, you can enable ACLs for Non-Delegated Authentication.  
First configure `GATEWAY_ACL_STORE_ENABLED=true` then use can use AdminClient to maintain ACLs with any service account declared in `GATEWAY_ADMIN_API_USERS`
