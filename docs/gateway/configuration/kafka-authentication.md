---
sidebar_position: 2
title: Gateway to Kafka Configuration
description: Securing Conduktor Gateway
---

## Connecting Gateway to Kafka

Gateway depends on a 'backing' Kafka cluster for its operation.

Configuring the connection to the backing Kafka cluster resembles configuring a Kafka client to connect to a cluster.
The configuration is done via environment variables, as it is for other aspects of Gateway configuration.

All environment variables that start with `KAFKA_` are mapped to configuration properties.
As Gateway is based on the Java-based Kafka-clients, it supports all configuration properties as Java-clients do.
Environment variables are mapped to configuration properties as follows:
- drop the `KAFKA_` prefix,
- replace each `_` with a `.` (dot),
- convert to lowercase.

So, for example, the `bootstrap.servers` configuration is set by the `KAFKA_BOOTSTRAP_SERVERS` environment variable.

In case your Kafka cluster requires authentication, we refer to the user-name you need to provide as the Gateway service account.

### Supported Protocols

To authenticate Gateway to the Kafka cluster, you can use all the Kafka security protocols; `PLAINTEXT`, `SASL_PLAINTEXT`, `SASL_SSL` and `SSL`. We support all SASL mechanisms that Apache Kafka supports: `PLAIN`, `SCRAM-SHA`, `OAuthBearer`, `Kerberos` etc. In addition we support IAM authentication for AWS MSK clusters.



## Examples

In the following examples, we provide blocks of environment variables which you can, e.g., provide to Gateway in a docker-compose file or in a `helm` deployment. 

Information which should be customized is enclose between `<` and `>`.

### Kafka cluster without authentication (PLAINTEXT)

In this case you just need to provide the bootstrap servers:

```yaml
KAFKA_BOOTSTRAP_SERVERS: <your.kafka.broker-1:9092>,<your.kafka.broker-2:9092>
```

### Kafka cluster with SASL_PLAINTEXT and PLAIN SASL mechanism

```yaml
KAFKA_BOOTSTRAP_SERVERS: <your.kafka.broker-1:9092>,<your.kafka.broker-2:9092>
KAFKA_SECURITY_PROTOCOL: SASL_PLAINTEXT
KAFKA_SASL_MECHANISM: PLAIN
KAFKA_SASL_JAAS_CONFIG: org.apache.kafka.common.security.plain.PlainLoginModule required username="<gw-sa-username>" password="<gw-sa-password>";
```

### Kafka cluster with SASL_PLAINTEXT and SCRAM SASL mechanism

```yaml
KAFKA_BOOTSTRAP_SERVERS: <your.kafka.broker-1:9092>,<your.kafka.broker-2:9092>
KAFKA_SECURITY_PROTOCOL: SASL_PLAINTEXT
KAFKA_SASL_MECHANISM: 
KAFKA_SASL_JAAS_CONFIG: org.apache.kafka.common.security.plain.PlainLoginModule required username="<gw-sa-username>" password="<gw-sa-password>";
```

### Kafka cluster with SASL_SSL and PLAIN SASL mechanism

### Confluent Cloud with API key/secret
This example can be seen as a special case of the one above.

```yaml
KAFKA_BOOTSTRAP_SERVERS: <your.cluster.confluent.cloud:9092>
KAFKA_SECURITY_PROTOCOL: SASL_SSL
KAFKA_SASL_MECHANISM: PLAIN
KAFKA_SASL_JAAS_CONFIG: org.apache.kafka.common.security.plain.PlainLoginModule required username="<API_KEY>" password="<API_SECRET>";
```
As Confluent Cloud uses certificates signed by a well-known CA, you normally do not need to specify a trust-store.

Note: In case you are using this in a PoC setting without TLS encryption between *clients* and Gateway, you should set `GATEWAY_SECURITY_PROTOCOL` to `DELEGATED_SASL_PLAINTEXT`. Then clients will be able to authenticate using their own API keys/secrets.

### Kafka cluster with SASL_SSL and SCRAM SASL mechanism

### Kafka cluster with SASL_SSL and SCRAM Kerberos mechanism

### AWS MSK cluster with IAM


### Kafka cluster with mTLS client authentication  



## Service Account and ACL requirements

Depending on the Client to Gateway authentication method you choose, the Service Account used to connect the Gateway might need different ACLs to operate properly.

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
First configure `GATEWAY_ACL_STORE_ENABLED=true`, and then you can use AdminClient to maintain ACLs with any service account declared in `GATEWAY_ADMIN_API_USERS`.
