---
sidebar_position: 2
title: SNI routing
displayed: false
description: Make the most out of the ports you have
---
import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

## Overview

<GlossaryTerm>SNI</GlossaryTerm> routing reduces the number of Gateway ports exposed to clients.

Unlike port mapping, which differentiates brokers based on the port a client connects to, **SNI routing distinguishes brokers by the hostname the client wants to connect to**. This allows Gateway to expose a single port while directing traffic to the appropriate broker based on the client's requested hostname.

This is particularly useful if you are:

- Experiencing a high administrative overhead for managing multiple ports.
- Restricted by your security department in the number of ports you can expose.

## Context about client connection

To understand the different steps required to set up SNI routing, let's break it down into the connection steps each client would take:

1. Connect to Gateway advertised host
2. Retrieve how to reach the right broker for each topic partition in the metadata returned by Gateway
3. Directly connect to the desired broker through Gateway

This means that we will have to:

- [Define which ports we need to configure](#1-define-ports) for Gateway to listen on and return in the metadata.
- [Make sure Gateway handles the TLS termination](#2-tls-termination).
- [Prepare the keystore certificate for Gateway](#3-prepare-gateways-keystore-certificate) to include **the Gateway hostname as well as a SAN for each broker in the cluster**. Alternatively, **wildcards** `*` can be used in the SAN, if supported by your issuer and security team.
- [Add the same entries to the DNS server](#4-configure-dns) to allow the clients to be properly routed to the Gateway advertised host and Kafka brokers through Gateway.
- [Configure Gateway to use the SNI routing](#5-configure-gateway) mechanism.

:::note
In order to keep Gateway as **stateless** as possible, **we do not store the metadata internally**. We simply pass it on to the client. This means that the metadata will be refreshed every time a client asks for it (e.g. when a new client connects or when the connection refreshes).
:::

## Set up SNI routing

### 1. Define ports

With Gateway using SNI routing, you only expose a single port for all your brokers.

However, depending on your infrastructure, you may want to differentiate between the port the Gateway container listens on and the port returned in the metadata for clients to connect.

This could be the case if you're using a load balancer:

import Ports from '/guide/ports-sni.png';

<img src={Ports} alt="Ports with SNI routing" style={{ width: 500, display: 'block', margin: 'auto' }} />

By default, Gateway listens on port 6969. This port can be configured using the `GATEWAY_PORT_START` [environment variable](/gateway/configuration/env-variables/#port--sni-routing).

To configure the port that is returned in the metadata, you can use the `GATEWAY_ADVERTISED_SNI_PORT`. By default, this port will be the same as the `GATEWAY_PORT_START`.

### 2. TLS termination

The concept of SNI routing isn't specific to Gateway. It relies on information inside the TLS connection for the SNI router to determine how to forward network requests. To be able to access this information, the SNI router must terminate the TLS connection.

In our case, as Gateway acts as SNI router, it has to:

- handle the TLS handshake with the client and
- have a valid keystore certificate for the advertised host (and all the brokers in the cluster)

### 3. Prepare Gateway's keystore certificate

The keystore certificate for Gateway with SNI routing needs to include **the Gateway advertised host, as well as a SAN for each advertised broker in the cluster**.

Alternatively, **wildcards** `*` can be used in the SAN, if supported by your issuer and security team.

If you need to detail all the advertised brokers in the Gateway keystore, here is the format returned by Gateway for each broker:

import AdvertisedBrokersStructure from '/guide/advertised-brokers.png';

<img src={AdvertisedBrokersStructure} alt="Advertised brokers structure" style={{ width: 600, display: 'block', margin: 'auto' }} />

We can find:

- The **advertised host prefix**, which is customizable with `GATEWAY_ADVERTISED_HOST_PREFIX` and defaults to `broker`
- The **Kafka cluster ID** in Gateway, which is not customizable and defaults to `main`.
- The **broker ID** in the Kafka cluster, which is unique for each broker and retrieved directly from your Kafka cluster.
- The **SNI host separator**, which is customizable with `GATEWAY_SNI_HOST_SEPARATOR` and defaults to `-`.
- The **advertised host**, which is customizable with `GATEWAY_ADVERTISED_HOST`.

**Example:**

Let's say we want to advertise Gateway as `gateway.conduktor.sni-demo.local` and we have a Kafka cluster with 3 brokers with IDs 1, 2, and 3. The SANs for the certificate would be:

```properties
gateway.conduktor.sni-demo.local
brokermain1-gateway.conduktor.sni-demo.local
brokermain2-gateway.conduktor.sni-demo.local
brokermain3-gateway.conduktor.sni-demo.local
```

Another option is to use wildcards in the SANs, for example:

```properties
*.conduktor.sni-demo.local
```

### 4. Configure DNS

Next, create DNS entries to allow clients to be properly routed to the **Gateway advertised host and Kafka brokers through Gateway**.

```properties
gateway.conduktor.sni-demo.local
brokermain1-gateway.conduktor.sni-demo.local
brokermain2-gateway.conduktor.sni-demo.local
brokermain3-gateway.conduktor.sni-demo.local
```

### 5. Configure Gateway

Here's the minimum configurations required, depending on the security protocol you want to use for your clients to connect to Gateway.

Note that this is in addition to the `KAFKA_` properties required for Gateway to connect to the Kafka cluster.

Please check the list of environment variables for [Gateway SSL configuration](/gateway/configuration/env-variables/#SSL) and [Gateway SNI routing configuration](/gateway/configuration/env-variables/#port--sni-routing)

<Tabs>
<TabItem value="SASL_SSL" label="SASL_SSL">

```yaml
GATEWAY_ROUTING_MECHANISM: host
GATEWAY_ADVERTISED_HOST: gateway.conduktor.sni-demo.local
GATEWAY_ADVERTISED_HOST_PREFIX: broker
GATEWAY_SECURITY_PROTOCOL: SASL_SSL
GATEWAY_SSL_KEY_STORE_PATH: /security/kafka.gateway.conduktor.sni-demo.local.keystore.jks
GATEWAY_SSL_KEY_STORE_PASSWORD: conduktor
GATEWAY_SSL_KEY_PASSWORD: conduktor
```

</TabItem>
<TabItem value="DELEGATED_SASL_SSL" label="DELEGATED_SASL_SSL">

```yaml
GATEWAY_ROUTING_MECHANISM: host
GATEWAY_ADVERTISED_HOST: gateway.conduktor.sni-demo.local
GATEWAY_ADVERTISED_HOST_PREFIX: broker
GATEWAY_SECURITY_PROTOCOL: DELEGATED_SASL_SSL
GATEWAY_SSL_KEY_STORE_PATH: /security/kafka.gateway.conduktor.sni-demo.local.keystore.jks
GATEWAY_SSL_KEY_STORE_PASSWORD: conduktor
GATEWAY_SSL_KEY_PASSWORD: conduktor
```

</TabItem>
<TabItem value="TLS" label="TLS">

```yaml
GATEWAY_ROUTING_MECHANISM: host
GATEWAY_ADVERTISED_HOST: gateway.conduktor.sni-demo.local
GATEWAY_ADVERTISED_HOST_PREFIX: broker
GATEWAY_SECURITY_PROTOCOL: SSL
GATEWAY_SSL_KEY_STORE_PATH: /security/kafka.gateway.conduktor.sni-demo.local.keystore.jks
GATEWAY_SSL_KEY_STORE_PASSWORD: conduktor
GATEWAY_SSL_KEY_PASSWORD: conduktor
```

</TabItem>
<TabItem value="mTLS" label="mTLS">

```yaml
GATEWAY_ROUTING_MECHANISM: host
GATEWAY_ADVERTISED_HOST: gateway.conduktor.sni-demo.local
GATEWAY_ADVERTISED_HOST_PREFIX: broker
GATEWAY_SECURITY_PROTOCOL: SSL
GATEWAY_SSL_KEY_STORE_PATH: /security/kafka.gateway.conduktor.sni-demo.local.keystore.jks
GATEWAY_SSL_KEY_STORE_PASSWORD: conduktor
GATEWAY_SSL_KEY_PASSWORD: conduktor
GATEWAY_SSL_CLIENT_AUTH: REQUIRE
GATEWAY_SSL_TRUST_STORE_PATH: /security/kafka.gateway.conduktor.sni-demo.local.truststore.jks
GATEWAY_SSL_TRUST_STORE_PASSWORD: conduktor
```

</TabItem>
</Tabs>

## Debug and troubleshoot

You can use Console's Brokers tab to view the advertised listeners of a Gateway once the initial connection and authentication are successful:

![Console Brokers view](/guide/console-broker-view.png)

Alternatively, [kcat](https://github.com/edenhill/kcat)'s metadata list mode (-L) can be used to check whether the right advertised listeners have been configured or how many brokers are in a given cluster.

Setting `LOG4J2_IO_CONDUKTOR_PROXY_NETWORK_LEVEL` to `DEBUG` might be helpful when debugging issues.

For more details, see a [comprehensive SNI routing troubleshooting guide](https://support.conduktor.io/hc/en-gb/articles/29104372472977-Conduktor-Gateway-SNI-Routing-Troubleshooting-Guide).
