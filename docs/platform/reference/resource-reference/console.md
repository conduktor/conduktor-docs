---
sidebar_position: 1
title: Console Resources
description: Console resources
---


import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

import Admonition from '@theme/Admonition';

export const Highlight = ({children, color, text}) => (
<span style={{ backgroundColor: color, borderRadius: '4px', color: text, padding: '0.2rem 0.5rem', fontWeight: '500', }}>
{children}
</span>
);

export const CLI = () => (
<Highlight color="#F8F1EE" text="#7D5E54">CLI</Highlight>
);

export const API = () => (
<Highlight color="#E7F9F5" text="#067A6F">API</Highlight>
);

export const TF = () => (
<Highlight color="#FCEFFC" text="#9C2BAD">Terraform</Highlight>
);

export const GUI = () => (
<Highlight color="#F6F4FF" text="#422D84">Console UI</Highlight>
);


export const AppToken = () => (
<Highlight color="#F0F4FF" text="#3451B2">Application Token</Highlight>
);

export const AdminToken = () => (
<Highlight color="#FEEFF6" text="#CB1D63">Admin Token</Highlight>
);


## Console Resources

### KafkaCluster
:::caution Not implemented yet
This concept will be available in a future version
:::

**API Keys:** <AdminToken />  
**Managed with:** <API /> <GUI />

Creates a Kafka Cluster Definition in Console.
````yaml
---
apiVersion: v1
kind: KafkaCluster
metadata:
  name: julien-cloud
spec:
  displayName: "Julien's cloud"
  icon: "poop"
  color: "#C90000"
  bootstrapServers: "34.140.204.135:12092"
  ignoreUntrustedCertificate: false
  properties:
    sasl.jaas.config: org.apache.kafka.common.security.plain.PlainLoginModule required username="admin" password="admin-secret";
    kafka.ssl.truststore.certificate.chain: |
      -----BEGIN CERTIFICATE-----
      MIIOXzCCDUegAwIBAgIRAPRytMVYJNUgCbhnA+eYumgwDQYJKoZIhvcNAQELBQAw
      RjELMAkGA1UEBhMCVVMxIjAgBgNVBAoTGUdvb2dsZSBUcnVzdCBTZXJ2aWNlcyBM
      TEMxEzARBgNVBAMTCkdUUyBDQSAxQzMwHhcNMjQwMzE4MTkzNzE5WhcNMjQwNjEw
      MTkzNzE4WjAXMRUwEwYDVQQDDAwqLmdvb2dsZS5jb20wWTATBgcqhkjOPQIBBggq
      ...
      8/s+YDKveNdoeQoAmGQpUmxhvJ9rbNYj+4jiaujkfxT/6WtFN8N95r+k3W/1K4hs
      IFyCs+xkcgvHFtBjjel4pnIET0agtbGJbGDEQBNxX+i4MDA=
      -----END CERTIFICATE-----
  schemaRegistry:
    type: "CONFLUENT"
    url: http://34.140.204.135/registry/
    security:
      username: superUser
      password: superUser
    properties:
    ignoreUntrustedCertificate: false
  amazonSecurity:
    type: "CREDENTIALS"
    accessKeyId: "string"
    secretKey: "string"
  kafkaFlavor:
    type: "CONFLUENT"
    key: "string"
    secret: "string"
    confluentEnvironmentId: "string"
    confluentClusterId: "string"
````
### KafkaConnectCluster
:::caution Not implemented yet
This concept will be available in a future version
:::

**API Keys:** <AdminToken />  
**Managed with:** <API /> <GUI />

Creates a Kafka Connect Cluster Definition in Console.
````yaml
---
apiVersion: v1
kind: KafkaConnectCluster
metadata:
  name: connect-1
  cluster: julien-cloud
spec:
  displayName: "Connect 1"
  url: "http://34.140.204.135/connect/"
  headers:
    a: b
    c: d
  ignoreUntrustedCertificate: false
  security: SEE BELOW
########  
  security:
    type: "BasicAuth"
    username: "toto"
    password: "my-secret"

  security:
    type: "BearerToken"
    token: "toto"

  security:
    type: "NoSecurity"

  security:
    type: "SSLAuth"
    key: "toto"
    certificateChain: "tata"
````
### KsqlDBCluster
:::caution Not implemented yet
This concept will be available in a future version
:::

**API Keys:** <AdminToken />  
**Managed with:** <API /> <GUI />

Creates a ksqlDB Cluster Definition in Console.
````yaml
---
apiVersion: v1
kind: KsqlDBCluster
metadata:
  name: connect-1
  cluster: julien-cloud
spec:
  displayName: "Connect 1"
  url: "http://34.140.204.135/connect/"
  headers:
    a: b
    c: d
  ignoreUntrustedCertificate: false
  security: SEE BELOW
########  
  security:
    type: "BasicAuth"
    username: "toto"
    password: "my-secret"

  security:
    type: "BearerToken"
    token: "toto"

  security:
    type: "NoSecurity"

  security:
    type: "SSLAuth"
    key: "toto"
    certificateChain: "tata"
````
### ConsoleGroup
### ConsoleUser
### Alert
### DataMaskingPolicy