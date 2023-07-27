---
sidebar_position: 4
title: Configuration Snippets
description: This demonstrates a complete configuration for Conduktor Enterprise consisting of two Kafka clusters with Schema Registry, SSO and license key.
---

# Configuration Snippets

:::warning
Cluster configuration from YAML have several limitation you should be aware of:
- This it not GitOps compatible (changes after the initial deployment will not be reflected)
- No Audit log events send on cluster configuration
- No SSL authentication support on Schema Registry and Kafka Connect
- Limited AWS Glue support
- Certificates defined in properties or with CDK_SSL_TRUSTSTORE_PATH are not stored in the Conduktor Platform Certificate Store and cannot be updated from the UI

The new **recommended** way to configure Kafka Cluster, Schema Registry and Kafka Connect is using [Conduktor Platform UI](../installation/get-started/cloud.md#configure-your-first-cluster).  

The Manage Clusters page (`/admin/clusters`) has several advantages over the YAML configuration:
- Intuitive interface with live update capabilities
- Centralized and secured with RBAC and Audit Logs Events
- Certificate store to help with your Custom certificates needs (no more JKS files and volume mounts)

Need to configure your Kafka Clusters using GitOps processes?   
Contact our [Customer Success](https://www.conduktor.io/contact/support) or give us [feedback](https://product.conduktor.help/c/75-public-apis) on this feature.

If you absolutely need to configure your clusters using YAML, keep reading.
:::

Below outlines snippets demonstrating different configuration options for the `platform-config.yaml`.

Jump to:

- [Complete Configuration Example](#complete-configuration-example)
- [Plain Auth Example](#plain-auth-example)
- [Plain Auth With Schema Registry](#plain-auth-with-schema-registry)
- [Amazon MSK with IAM Authentication Example](#amazon-msk-with-iam-authentication-example)
- [Amazon MSK with Glue Schema Registry](#amazon-msk-with-glue-schema-registry)
- [Confluent Cloud Example](#confluent-cloud-example)
- [Confluent Cloud with Schema Registry](#confluent-cloud-with-schema-registry)
- [SSL Certificates Example - Aiven (truststore)](#ssl-certificates-example---aiven-truststore)
- [2 Way SSL (keystore + truststore)](#2-way-ssl-keystore--truststore)
- [Kafka Connect](#kafka-connect)


## Complete Configuration Example

This demonstrates a complete configuration for Conduktor Enterprise consisting of two Kafka clusters with Schema Registry, SSO and license key.

```yml
organization:
  name: conduktor

admin:
  email: admin@company.io
  password: admin

clusters:
  - id: my-local-kafka-cluster
    name: My Local Kafka Cluster
    color: '#0013E7'
    bootstrapServers: 'my-bootstrap-server:9092'
    schemaRegistry:
      id: my-schema-registry
      url: 'http://my-schema-registry:8081'

  - id: confluent-pkc
    name: Confluent pkc-lq8v7
    color: '#E70000'
    bootstrapServers: 'pkc-lq8v7.eu-central-1.aws.confluent.cloud:9092'
    properties: |
      security.protocol=SASL_SSL
      sasl.mechanism=PLAIN
      sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username="<username>" password="<password>";
    schemaRegistry:
      id: confluent-sr
      url: 'https://psrc-o268o.eu-central-1.aws.confluent.cloud'
      security:
        username: <username>
        password: <password>
    labels: {}

sso:
  oauth2:
    - name: 'auth0'
      default: true
      client-id: <client_id>
      client-secret: <client_secret>
      callback-uri: http://localhost/auth/oauth/callback/auth0
      openid:
        issuer: https://conduktor-staging.eu.auth0.com/

license: '<license_key>'
```

## Plain Auth Example

Connect to a local cluster with no auth/encryption, for example a local development Kafka

```yml
clusters:
  - id: local
    name: My Local Kafka Cluster
    color: '#0013E7'
    ignoreUntrustedCertificate: false
    bootstrapServers: 'localhost:9092'
```

## Plain Auth With Schema Registry

Connect to a local cluster with schema registry

```yml
clusters:
  - id: local
    name: My Local Kafka Cluster
    color: '#0013E7'
    bootstrapServers: 'localhost:9092'
    schemaRegistry:
      id: Local SR
      url: 'http://localhost:8081'
```

## Amazon MSK with IAM Authentication Example

Connect to an MSK cluster with IAM Authentication using AWS Access Key and Secret

### Billing note

Note that deploying this CloudFormation template into your environment will result in billable resources being consumed.  See [Amazon MSK pricing](https://aws.amazon.com/msk/pricing/) for more information.

```yml
clusters:
  - id: amazon-msk-iam
    name: Amazon MSK IAM
    color: #FF9900
    bootstrapServers: 'b-3-public.****.kafka.eu-west-1.amazonaws.com:9198'
    properties: |
      security.protocol=SASL_SSL
      sasl.mechanism=AWS_MSK_IAM
      sasl.jaas.config=software.amazon.msk.auth.iam.IAMLoginModule required;
      sasl.client.callback.handler.class=io.conduktor.aws.IAMClientCallbackHandler
      aws_access_key_id=<access-key-id>
      aws_secret_access_key=<secret-access-key>
```

Connect to an MSK cluster with IAM credentials inherited from environment

```yml
clusters:
  - id: amazon-msk-iam
    name: Amazon MSK IAM
    color: #FF9900
    bootstrapServers: 'b-3-public.****.kafka.eu-west-1.amazonaws.com:9198'
    properties: |
      security.protocol=SASL_SSL
      sasl.mechanism=AWS_MSK_IAM
      sasl.jaas.config=software.amazon.msk.auth.iam.IAMLoginModule required;
      sasl.client.callback.handler.class=software.amazon.msk.auth.iam.IAMClientCallbackHandler
```

On top of that, you can override either the `default` profile or the role to assume.
Override Profile

```
sasl.jaas.config = software.amazon.msk.auth.iam.IAMLoginModule required awsProfileName="other-profile";
```

Override Role

```
sasl.jaas.config = software.amazon.msk.auth.iam.IAMLoginModule required awsRoleArn="arn:aws:iam::123456789012:role/msk_client_role";
```

## Amazon MSK with Glue Schema Registry

Connect to an MSK cluster with schema registry using credentials

```yml
clusters:
  - id: amazon-msk-iam
    name: Amazon MSK IAM
    color: #FF9900
    bootstrapServers: 'b-3-public.****.kafka.eu-west-1.amazonaws.com:9198'
    properties: |
      security.protocol=SASL_SSL
      sasl.mechanism=AWS_MSK_IAM
      sasl.jaas.config=software.amazon.msk.auth.iam.IAMLoginModule required;
      sasl.client.callback.handler.class=io.conduktor.aws.IAMClientCallbackHandler
      aws_access_key_id=<access-key-id>
      aws_secret_access_key=<secret-access-key>
    schemaRegistry:
      region: <aws-region>
      security:
        type: Credentials
        accessKeyId: <access-key-id>
        secretKey: <secret-key>
```

Connect to an MSK cluster with schema registry using the default chain of credentials providers

```yml
clusters:
  - id: amazon-msk-iam
    name: Amazon MSK IAM
    color: #FF9900
    bootstrapServers: 'b-3-public.****.kafka.eu-west-1.amazonaws.com:9198'
    properties: |
      security.protocol=SASL_SSL
      sasl.mechanism=AWS_MSK_IAM
      sasl.jaas.config=software.amazon.msk.auth.iam.IAMLoginModule required;
      sasl.client.callback.handler.class=io.conduktor.aws.IAMClientCallbackHandler
      aws_access_key_id=<access-key-id>
      aws_secret_access_key=<secret-access-key>
    schemaRegistry:
      region: <aws-region>
      security:
        type: FromContext
        profile: <profile> # optional to use the default profile
```

Connect to an MSK cluster with schema registry using a specific role

```yml
clusters:
  - id: amazon-msk-iam
    name: Amazon MSK IAM
    color: #FF9900
    bootstrapServers: 'b-3-public.****.kafka.eu-west-1.amazonaws.com:9198'
    properties: |
      security.protocol=SASL_SSL
      sasl.mechanism=AWS_MSK_IAM
      sasl.jaas.config=software.amazon.msk.auth.iam.IAMLoginModule required;
      sasl.client.callback.handler.class=io.conduktor.aws.IAMClientCallbackHandler
      aws_access_key_id=<access-key-id>
      aws_secret_access_key=<secret-access-key>
    schemaRegistry:
      region: <aws-region>
      security:
        type: FromRole
        role: <role>
```

On top of that, and for all these previous configuration example,
you can add a `registryName` to the `schemaRegistry` section to use a specific registry for this cluster.

````yml
schemaRegistry:
  region: <aws-region>
  security:
    type: Credentials
    accessKeyId: <access-key-id>
    secretKey: <secret-key>
  registryName: <registry-name>
````

## Confluent Cloud Example

Connect to a confluent cloud cluster using API keys

```yml
clusters:
  - id: confluent-pkc
    name: Confluent pkc-lzoyy
    color: '#E70000'
    bootstrapServers: 'pkc-lzoyy.eu-central-1.aws.confluent.cloud:9092'
    properties: |
      security.protocol=SASL_SSL
      sasl.mechanism=PLAIN
      sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username="<username>" password="<password>";
```

## Confluent Cloud with Schema Registry

Connect to a confluent cloud cluster with schema registry using basic auth

```yml
- id: confluent-pkc
  name: Confluent pkc-lq8v7
  color: '#E70000'
  bootstrapServers: 'pkc-lq8v7.eu-central-1.aws.confluent.cloud:9092'
  properties: |
    security.protocol=SASL_SSL
    sasl.mechanism=PLAIN
    sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username="<usernam>" password="<password>";
  schemaRegistry:
    id: confluent-sr
    url: 'https://psrc-o268o.eu-central-1.aws.confluent.cloud'
    security:
      username: <username>
      password: <password>
```

## SSL Certificates Example - Aiven (truststore)

Keystore and truststore are not supported. But you can directly use the PEM formatted files (.pem or .cer)  
Aiven example providing inline CA certificate  
Please make sure the certificate is on one single line

```yml
- id: aiven-stg
  name: My Aiven Cluster
  bootstrapServers: 'kafka-09ba.aivencloud.com:21661'
  properties: |
    security.protocol=SASL_SSL
    sasl.mechanism=SCRAM-SHA-512
    sasl.jaas.config=org.apache.kafka.common.security.scram.ScramLoginModule required username="<username>" password="<password>";
    ssl.truststore.type=PEM
    ssl.truststore.certificates=-----BEGIN CERTIFICATE----- <YOUR CA CERTIFICATE> -----END CERTIFICATE-----
```

## 2 Way SSL (keystore + truststore)

You should have 3 files, and generally they are embedded in 2 files:

- Your access key (in the keystore.jks file)
- Your access certificate (in the keystore.jks file)
- Your CA certificate (in the truststore.jks file)
  Please make sure to have the content is on a single line

```yaml
- id: aiven-ssl
  name: Aiven SSL
  bootstrapServers: kafka-09ba.aivencloud.com:21650
  properties: |
    security.protocol=SSL
    ssl.truststore.type=PEM
    ssl.truststore.certificates=-----BEGIN CERTIFICATE----- <YOUR CA CERTIFICATE> -----END CERTIFICATE-----
    ssl.keystore.type=PEM
    ssl.keystore.key=-----BEGIN PRIVATE KEY----- <YOUR ACCES KEY> -----END PRIVATE KEY-----
    ssl.keystore.certificate.chain=-----BEGIN CERTIFICATE----- <YOUR ACCESS CERTIFICATE> -----END CERTIFICATE-----
```

## Kafka Connect

Cluster with Kafka Connect configured with Basic Auth

```yml
- id: cluster-connect
  name: My Kafka With Connect
  color: #C90000
  bootstrapServers: '{Bootstrap Servers}'
  properties:
  kafkaConnects:
    - url: '{Kafka Connect URL}'
      id: kafka-connect
      name: kafkConnect
      security:
        username: <username>
        password: <password>
```
