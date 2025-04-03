---
sidebar_position: 4
title: Configuration
description: Conduktor Gateway configuration
---

Configuring Conduktor Gateway involves making decisions regarding several subjects.

1. Choose your [Networking](../configuration/network.md) / [Load Balancing](../reference/load-balancing.md) requirements
2. Configure how the [Gateway connects to your Backing Kafka Cluster](../configuration/kafka-authentication.md)
3. Configure the [Gateway to accept Client connections](../configuration/client-authentication.md)
4. Decide whether you need [Virtual Cluster](../concepts/virtual-clusters.md) capabilities

## Authentication and Authorization Flows
:::caution
This is a **conceptual** view of the authentication and authorization flows.  
Specifically:
- it does not include every network call involved within each stage
- it does not reflect the exact order of the network calls
:::

### Gateway Security with Credentials managed by Gateway
 
Security protocol: `SASL_PLAINTEXT` or `SASL_SSL`  
SASL mechanism: `PLAIN`
#### Authentication Flow
```mermaid
sequenceDiagram
	autonumber
	participant A as Application 
	box Gateway Cluster
    participant GW as Gateway
    participant GW2 as Gateway Users & ACLs Store
    end
    participant K as Backing Kafka
	
	Note over A,GW: Application uses credentials `username:password`
    A->>+GW: Connects to Gateway using Application credentials
    GW->>+GW2: Check Application credentials
    GW2-->>-GW: Credentials are valid
    Note over GW,K: Gateway uses a DIFFERENT set of credentials `admin:password`
    GW->>+K: Connects to Backing Kafka using Gateway credentials
    K-->>-GW: Connected
    GW-->>-A: Connected
```
#### Authorization Flow (Produce Message)
```mermaid
sequenceDiagram
	autonumber
	participant A as Application 
	box Gateway Cluster
    participant GW as Gateway
    participant GW2 as Gateway Users & ACLs Store
    end
    participant K as Backing Kafka
    A->>+GW: Produce Record to topic `my-topic`
    GW->>+GW2: Is `username` allowed to produce to `my-topic`?
    GW2-->>-GW: Allowed
    GW->>+K: Produce Record to topic `my-topic`
    K-->>-GW: Record produced
    GW-->>-A: Record produced
```

### Gateway Security with Oauth
Security protocol: `SASL_PLAINTEXT` or `SASL_SSL`  
SASL mechanism: `OAUTHBEARER`
#### Authentication Flow
```mermaid
sequenceDiagram
	autonumber
	participant A as Application 
	participant I as Identity Provider
	box Gateway Cluster
    participant GW as Gateway
    participant GW2 as Gateway ACLs
    end
    participant K as Backing Kafka
	
	Note over A,GW: Application uses credentials `client-id:client-secret`
	A->>+I: Request Access Token
	I->>I: Validate credentials
    I-->>-A: Return Access Token (JWT)
    A->>+GW: Connects to Gateway using JWT
    GW->>+I: Validate JWT
    I-->>-GW: Valid
    GW->>GW: Extract `subject` from JWT
    
    Note over GW,K: Gateway uses a DIFFERENT set of credentials `admin:secret`
    GW->>+K: Connects to Backing Kafka using Gateway credentials
    K-->>-GW: Connected
    GW-->>-A: Connected
```
#### Authorization Flow (Produce Message)
```mermaid
sequenceDiagram
	autonumber
	participant A as Application 
	participant I as Identity Provider
	box Gateway Cluster
    participant GW as Gateway
    participant GW2 as Gateway ACLs
    end
    participant K as Backing Kafka
    A->>+GW: Produce Record to topic `my-topic`
    GW->>+GW2: Is `subject` allowed to produce to `my-topic`?
    GW2-->>-GW: Allowed
    GW->>+K: Produce Record to topic `my-topic`
    K-->>-GW: Record produced
    GW-->>-A: Record produced
```

### Backing Kafka Security with SASL User
Security protocol: `DELEGATED_SASL_PLAINTEXT` or `DELEGATED_SASL_SSL`  
SASL mechanism: `PLAIN` (ie Confluent Cloud) or `SCRAM-SHA-256` or `SCRAM-SHA-512`
#### Authentication Flow
```mermaid
sequenceDiagram
	autonumber
	participant A as Application 
    participant GW as Gateway
    participant K as Backing Kafka
    
	Note over A,GW: Application uses credentials `username:password`
    A->>+GW: Connects to Gateway using Application credentials
    Note over GW,K: Gateway uses the SAME set of credentials `username:password`
    GW->>+K: Connects to Backing Kafka using Application credentials
    K->>K: Validate credentials
    K-->>-GW: Connected
    GW-->>-A: Connected
```
#### Authorization Flow (Produce Message)
```mermaid
sequenceDiagram
	autonumber
	participant A as Application 
    participant GW as Gateway
    participant K as Backing Kafka

    A->>+GW: Produce Record to topic `my-topic`
    GW->>+K: Produce Record to topic `my-topic`
    K->>K: Is `username` allowed to produce to `my-topic`?
    K-->>-GW: Record produced
    GW-->>-A: Record produced

```

### Backing Kafka Security with OAuth
Security protocol: `DELEGATED_SASL_PLAINTEXT` or `DELEGATED_SASL_SSL`    
SASL mechanism: `OAUTHBEARER`
#### Authentication Flow
```mermaid
sequenceDiagram
	autonumber
	participant A as Application 
	participant I as Identity Provider
    participant GW as Gateway
    participant K as Backing Kafka
	
	Note over A,GW: Application uses credentials `client-id:client-secret`
	A->>+I: Request Access Token
	I->>I: Validate credentials
    I-->>-A: Return Access Token (JWT)
    A->>+GW: Connects to Gateway using JWT
    GW->>GW: Extract `subject` from JWT
    Note over GW,K: Gateway forwards the JWT to the backing Kafka
    GW->>+K: Connects to Backing Kafka using JWT
    K->>+I: Validate JWT
    I-->>-K: Valid
    K-->>-GW: Connected
    GW-->>-A: Connected
```
#### Authorization Flow (Produce Message)
```mermaid
sequenceDiagram
	autonumber
	participant A as Application 
	participant I as Identity Provider
    participant GW as Gateway
    participant K as Backing Kafka 
    A->>+GW: Produce Record to topic `my-topic`
    GW->>+K: Produce Record to topic `my-topic`
    K->>K: Is `subject` allowed to produce to `my-topic`?
    K-->>-GW: Record produced
    GW-->>-A: Record produced
```