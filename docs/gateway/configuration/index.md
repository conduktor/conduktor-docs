---
sidebar_position: 4
title: Configuration
description: Conduktor Gateway configuration
---

To configure Conduktor Gateway, you have to:

1. Decide on your [networking](../configuration/network.md)/[load balancing](../reference/load-balancing.md) requirements.
1. Configure how [Gateway connects to your 'backing' Kafka cluster](../configuration/kafka-authentication.md).
1. Configure [Gateway to accept client connections](../configuration/client-authentication.md).
1. Decide whether you need [virtual clusters](../concepts/virtual-clusters.md).

## Authentication and authorization flows

:::warning[Conceptual visualization]
This is a conceptual view of the authentication and authorization flows. It **doesn't include** every network call in each stage or the exact order of the calls.
:::

### Gateway security with credentials managed by Gateway
Before:  
Security protocol: `SASL_PLAINTEXT` or `SASL_SSL`  
SASL mechanism: `PLAIN`  

Now:
```env
GATEWAY_SECURITY_MODE: GATEWAY_SECURITY
GATEWAY_SECURITY_PROTOCOL: SASL_PLAINTEXT or SASL_SSL
```
#### Authentication flow

```mermaid
sequenceDiagram
	autonumber
	participant A as application 
	box Gateway cluster
    participant GW as Gateway
    participant GW2 as Gateway users & ACLs store
    end
    participant K as backing Kafka cluster
	
	Note over A,GW: Application uses credentials `username:password`
    A->>+GW: Connects to Gateway using application credentials
    GW->>+GW2: Check application credentials
    GW2-->>-GW: Credentials are valid
    Note over GW,K: Gateway uses a DIFFERENT set of credentials `admin:password`
    GW->>+K: Connects to backing Kafka using Gateway credentials
    K-->>-GW: Connected
    GW-->>-A: Connected
```

#### Authorization flow (produce message)

```mermaid
sequenceDiagram
	autonumber
	participant A as application 
	box Gateway cluster
    participant GW as Gateway
    participant GW2 as Gateway users & ACLs store
    end
    box Backing Kafka cluster
    participant K as backing Kafka 
    participant K2 as backing Kafka ACLs<br/>(Kafka ACLs, Confluent RBAC, etc)
    end
    A->>+GW: Produce record to topic `my-topic`
    GW->>+GW2: Is `username` allowed to produce to `my-topic`?
    GW2-->>-GW: Allowed
    GW->>+K: Produce record to topic `my-topic`
    K->>+K2: Is `admin` allowed to produce to `my-topic`?
    K2-->>-K: Allowed
    K-->>-GW: Record produced
    GW-->>-A: Record produced
```

### Gateway security with OAuth
Before:
Security protocol: `SASL_PLAINTEXT` or `SASL_SSL`  
SASL mechanism: `OAUTHBEARER`

Now:
```env
GATEWAY_SECURITY_MODE: GATEWAY_SECURITY
GATEWAY_SECURITY_PROTOCOL: SASL_PLAINTEXT or SASL_SSL
```
#### Authentication flow

```mermaid
sequenceDiagram
	autonumber
	participant A as application 
	participant I as identity provider
	box Gateway cluster
    participant GW as Gateway
    participant GW2 as Gateway ACLs
    end
    participant K as backing Kafka cluster
	
	Note over A,GW: Application uses credentials `client-id:client-secret`
	A->>+I: Request access token
	I->>I: Validate credentials
    I-->>-A: Return access token (JWT)
    A->>+GW: Connects to Gateway using JWT
    GW->>+I: Validate JWT
    I-->>-GW: Valid
    GW->>GW: Extract `subject` from JWT
    
    Note over GW,K: Gateway uses a DIFFERENT set of credentials `admin:secret`
    GW->>+K: Connects to backing Kafka using Gateway credentials
    K-->>-GW: Connected
    GW-->>-A: Connected
```

#### Authorization flow (produce message)

```mermaid
sequenceDiagram
	autonumber
	participant A as application 
	participant I as identity provider
	box Gateway cluster
    participant GW as Gateway
    participant GW2 as Gateway ACLs
    end
    box Backing Kafka cluster
    participant K as backing Kafka 
    participant K2 as backing Kafka ACLs<br/>(Kafka ACLs, Confluent RBAC, etc)
    end
    A->>+GW: Produce record to topic `my-topic`
    GW->>+GW2: Is `subject` allowed to produce to `my-topic`?
    GW2-->>-GW: Allowed
    GW->>+K: Produce record to topic `my-topic`
    K->>+K2: Is `admin` allowed to produce to `my-topic`?
    K2-->>-K: Allowed
    K-->>-GW: Record produced
    GW-->>-A: Record produced
```

### Backing Kafka security with SASL users
Before:  
Security protocol: `DELEGATED_SASL_PLAINTEXT` or `DELEGATED_SASL_SSL`  
SASL mechanism: `PLAIN` (ie Confluent Cloud) or `SCRAM-SHA-256` or `SCRAM-SHA-512`

Now:
```env
GATEWAY_SECURITY_MODE: BACKING_KAFKA_SECURITY
GATEWAY_SECURITY_PROTOCOL: SASL_PLAINTEXT or SASL_SSL
```
#### Authentication flow

```mermaid
sequenceDiagram
	autonumber
	participant A as application 
    participant GW as Gateway
    participant K as backing Kafka cluster

	Note over A,GW: Application uses credentials `username:password`
    A->>+GW: Connects to Gateway using application credentials
    Note over GW,K: Gateway uses the SAME set of credentials `username:password`
    GW->>+K: Connects to backing Kafka using application credentials
    K->>K: Validate credentials
    K-->>-GW: Connected
    GW-->>-A: Connected
```

#### Authorization flow (produce message)

```mermaid
sequenceDiagram
	autonumber
	participant A as application 
    participant GW as Gateway
    box Backing Kafka cluster
    participant K as backing Kafka 
    participant K2 as backing Kafka ACLs<br/>(Kafka ACLs, Confluent RBAC, etc)
    end

    A->>+GW: Produce record to topic `my-topic`
    GW->>+K: Produce record to topic `my-topic`
    K->>+K2: Is `username` allowed to produce to `my-topic`?
    K2-->>-K: Allowed
    K-->>-GW: Record produced
    GW-->>-A: Record produced

```

### Backing Kafka Security with OAuth
Before:  
Security protocol: `DELEGATED_SASL_PLAINTEXT` or `DELEGATED_SASL_SSL`    
SASL mechanism: `OAUTHBEARER`

Now:
```env
GATEWAY_SECURITY_MODE: BACKING_KAFKA_SECURITY
GATEWAY_SECURITY_PROTOCOL: SASL_PLAINTEXT or SASL_SSL
```
#### Authentication flow

```mermaid
sequenceDiagram
	autonumber
	participant A as application 
	participant I as identity provider
    participant GW as Gateway
    participant K as backing Kafka cluster
	
	Note over A,GW: application uses credentials `client-id:client-secret`
	A->>+I: Request access token
	I->>I: Validate credentials
    I-->>-A: Return access token (JWT)
    A->>+GW: Connects to Gateway using JWT
    GW->>GW: Extract `subject` from JWT
    Note over GW,K: Gateway forwards the JWT to the backing Kafka
    GW->>+K: Connects to backing Kafka using JWT
    K->>+I: Validate JWT
    I-->>-K: Valid
    K-->>-GW: Connected
    GW-->>-A: Connected
```

#### Authorization flow (produce message)

```mermaid
sequenceDiagram
	autonumber
	participant A as application 
    participant GW as Gateway
    box Backing Kafka cluster
    participant K as backing Kafka 
    participant K2 as backing Kafka ACLs<br/>(Kafka ACLs, Confluent RBAC, etc)
    end
    
    A->>+GW: Produce record to topic `my-topic`
    GW->>+K: Produce record to topic `my-topic`
    K->>+K2: Is `subject` allowed to produce to `my-topic`?
    K2-->>-K: Allowed
    K-->>-GW: Record produced
    GW-->>-A: Record produced
```
