---
sidebar_position: 3
title: Configuration Snippets
description: This demonstrates a complete configuration for Conduktor Enterprise consisting of two Kafka clusters with Schema Registry, SSO and license key.
---

# Configuration Snippets

The Conduktor Console can be configured using a YAML configuration file or through environment variables. The full list of configurable properties can be found [here](/platform/get-started/configuration/env-variables/). Note that it's also possible to make some configurations (such as Kafka cluster configuration) through our [API](/platform/reference/api-reference/).

Note you can also configure your clusters within the [Admin](/platform/navigation/settings/managing-clusters/) section of Console, whereby you can also upload certificates using the [certificate store](/platform/get-started/configuration/ssl-tls-configuration/#using-the-conduktor-certificate-store).

## GitOps: Managing Cluster Configurations
:::tip
Our recommendation is to use the Console [API](/platform/reference/api-reference/) if you wish to configure clusters with a GitOps approach. 
:::

Note that from Console version `1.19`, if you are configuring clusters through the YAML file, this will act as the source of truth for cluster definition. Meaning, if you make changes to the cluster using the UI, they will be overridden on the next restart containing a reference to your configuration file. 

If you've created your cluster configurations from within the Console UI, they will not be impacted by a restart. Removing the YAML block entirely will not remove existing clusters from the UI.

## Configuration Examples
The below outlines reusable snippets for common configurations such as:

- [Complete Configuration Example](#complete-configuration-example)
- [Plain Auth Example](#plain-auth-example)
- [Plain Auth With Schema Registry](#plain-auth-with-schema-registry)
- [Kafka Connect](#kafka-connect)
- [Amazon MSK with IAM Authentication Example](#amazon-msk-with-iam-authentication-example)
- [Amazon MSK with Glue Schema Registry](#amazon-msk-with-glue-schema-registry)
- [Confluent Cloud Example](#confluent-cloud-example)
- [Confluent Cloud with Schema Registry](#confluent-cloud-with-schema-registry)
- [Confluent Cloud with Service Account Management](#confluent-cloud-with-service-account-management)
- [SSL Certificates Example - Aiven (truststore)](#ssl-certificates-example---aiven-truststore)
- [2 Way SSL (keystore + truststore)](#2-way-ssl-keystore--truststore)
- [Aiven with Service Account Management](#aiven-with-service-account-management)
- [Conduktor Gateway Virtual Cluster](#conduktor-gateway-virtual-cluster)
- [SASL/OAUTHBEARER and OIDC Kafka Cluster](#sasloauthbearer-and-oidc-kafka-cluster-example)


## Complete Configuration Example

This demonstrates a complete configuration for Conduktor Enterprise consisting of one Kafka cluster with Schema Registry, SSO and license key. 

For identity provider specific guides see [configuring SSO](/platform/category/configure-sso/). Note that if you don't have an Enterprise license, you should omit the SSO configuration and use [local users](/platform/get-started/configuration/user-authentication/local-admin-and-users/) instead.

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="YAML  File" label="YAML File">

```yml
organization:
  name: "conduktor"

database:
  hosts: 
   - host: 'postgresql'
     port: 5432
  name: 'conduktor'
  username: 'conduktor'
  password: 'change_me'
  connection_timeout: 30 # in seconds

monitoring:
  cortex-url: 'http://conduktor-monitoring:9009/'
  alert-manager-url: 'http://conduktor-monitoring:9010/'
  callback-url: 'http://conduktor-console:8080/monitoring/api/'
  notifications-callback-url: 'http://localhost:8080'

admin:
  email: 'name@your_company.io'
  password: "admin"

sso:
  oauth2:
    - name: 'auth0'
      client-id: '<client ID>'
      client-secret: '<client secret>'
      openid:
        issuer: 'https://<domain>'

clusters:
  - id: 'confluent-pkc'
    name: 'Confluent Prod'
    bootstrapServers: 'pkc-lq8v7.eu-central-1.aws.confluent.cloud:9092'
    properties: |
      security.protocol=SASL_SSL
      sasl.mechanism=PLAIN
      sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username="<username>" password="<password>";
    schemaRegistry:
      id: 'confluent-sr'
      url: 'https://psrc-o268o.eu-central-1.aws.confluent.cloud'
      security:
        username: 'user'
        password: 'password'

license: "" # license key if Enterprise
```

</TabItem>
<TabItem value="Environment Variables" label="Environment Variables">

```bash
    environment:
      CDK_ORGANIZATION_NAME: 'conduktor'
      CDK_LICENSE: '' # license key if Enterprise 
      CDK_DATABASE_URL: 'postgresql://conduktor:change_me@postgresql:5432/conduktor'
      CDK_MONITORING_CORTEX-URL: 'http://conduktor-monitoring:9009/'
      CDK_MONITORING_ALERT-MANAGER-URL: 'http://conduktor-monitoring:9010/'
      CDK_MONITORING_CALLBACK-URL: 'http://conduktor-console:8080/monitoring/api/'
      CDK_MONITORING_NOTIFICATIONS-CALLBACK-URL: 'http://localhost:8080'
      CDK_ADMIN_EMAIL: 'name@your_company.io'
      CDK_ADMIN_PASSWORD: 'admin'
      CDK_SSO_OAUTH2_0_NAME: 'auth0'
      CDK_SSO_OAUTH2_0_CLIENT-ID: '<client ID>'
      CDK_SSO_OAUTH2_0_CLIENT-SECRET: '<client secret>'
      CDK_SSO_OAUTH2_0_OPENID_ISSUER: 'https://<domain>'
      CDK_CLUSTERS_0_ID: 'confluent-pkc'
      CDK_CLUSTERS_0_NAME: 'Confluent Prod'
      CDK_CLUSTERS_0_BOOTSTRAPSERVERS: 'pkc-lq8v7.eu-central-1.aws.confluent.cloud:9092'
      CDK_CLUSTERS_0_PROPERTIES: "security.protocol=SASL_SSL\nsasl.mechanism=PLAIN\nsasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username=\"FY5NJX2SRXKTUBAD\" password=\"pqyHt7r+2oxIvmNCeagcpQieypHKUfvttCfNTf9Z8+sMF+cv6ai5b2KC/qmapOvC\";"
      CDK_CLUSTERS_0_SCHEMAREGISTRY_ID: 'confluent-sr'
      CDK_CLUSTERS_0_SCHEMAREGISTRY_URL: 'https://psrc-o268o.eu-central-1.aws.confluent.cloud'
      CDK_CLUSTERS_0_SCHEMAREGISTRY_SECURITY_USERNAME: 'user'
      CDK_CLUSTERS_0_SCHEMAREGISTRY_SECURITY_PASSWORD: 'password'
```

</TabItem>
</Tabs>


## Plain Auth Example

Connect to a local cluster with no auth/encryption, for example a local development Kafka.

<Tabs>
<TabItem value="YAML  File" label="YAML File">

```yml
clusters:
  - id: 'local'
    name: 'Local Kafka Cluster'
    bootstrapServers: 'localhost:9092'
```
</TabItem>
<TabItem value="Environment Variables" label="Environment Variables">

```bash
    environment:
      CDK_CLUSTERS_0_ID: 'local'
      CDK_CLUSTERS_0_NAME: 'Local Kafka Cluster'
      CDK_CLUSTERS_0_BOOTSTRAPSERVERS: 'localhost:9092'
```
</TabItem>
</Tabs>

## Plain Auth With Schema Registry

Connect to a local cluster with schema registry.

<Tabs>
<TabItem value="YAML  File" label="YAML File">

```yml
clusters:
  - id: 'local'
    name: 'Local Kafka Cluster'
    bootstrapServers: 'localhost:9092'
    schemaRegistry:
      id: 'local-sr'
      url: 'http://localhost:8081'
```
</TabItem>
<TabItem value="Environment Variables" label="Environment Variables">

```bash
    environment:
      CDK_CLUSTERS_0_ID: 'local'
      CDK_CLUSTERS_0_NAME: 'Local Kafka Cluster'
      CDK_CLUSTERS_0_BOOTSTRAPSERVERS: 'localhost:9092'
      CDK_CLUSTERS_0_SCHEMAREGISTRY_ID: 'local-sr'
      CDK_CLUSTERS_0_SCHEMAREGISTRY_URL: 'http://localhost:8081'
```
</TabItem>
</Tabs>

## Kafka Connect

Cluster with Kafka Connect configured with Basic Auth

<Tabs>
<TabItem value="YAML  File" label="YAML File">

```yaml
- id: 'kafka'
  name: 'Kafka'
  bootstrapServers: 'localhost:9092'
  kafkaConnects:
    - id: 'kafka-connect'
      name: 'My Kafka Connect'
      url: 'http://localhost:8083'
      security:
        username: '<username>'
        password: '<password>'
```

</TabItem>
<TabItem value="Environment Variables" label="Environment Variables">

```bash
    environment:
      CDK_CLUSTERS_0_ID: 'kafka'
      CDK_CLUSTERS_0_NAME: 'Kafka'
      CDK_CLUSTERS_0_BOOTSTRAPSERVERS: 'localhost:9092'
      CDK_CLUSTERS_0_KAFKACONNECTS_0_ID: 'kafka-connect'
      CDK_CLUSTERS_0_KAFKACONNECTS_0_NAME: 'My Kafka Connect'
      CDK_CLUSTERS_0_KAFKACONNECTS_0_URL: 'http://localhost:8083'
      CDK_CLUSTERS_0_KAFKACONNECTS_0_SECURITY_USERNAME: '<username>'
      CDK_CLUSTERS_0_KAFKACONNECTS_0_SECURITY_PASSWORD: '<password>'
```

</TabItem>
</Tabs>


## Amazon MSK with IAM Authentication Example

Connect to an MSK cluster with IAM Authentication using AWS Access Key and Secret.

### Billing note

Note that deploying this CloudFormation template into your environment will result in billable resources being consumed.  See [Amazon MSK pricing](https://aws.amazon.com/msk/pricing/) for more information.


<Tabs>
<TabItem value="YAML  File" label="YAML File">

```yml
clusters:
  - id: 'amazon-msk-iam'
    name: 'Amazon MSK IAM'
    bootstrapServers: 'b-3-public.****.kafka.eu-west-1.amazonaws.com:9198'
    properties: |
      security.protocol=SASL_SSL
      sasl.mechanism=AWS_MSK_IAM
      sasl.jaas.config=software.amazon.msk.auth.iam.IAMLoginModule required;
      sasl.client.callback.handler.class=io.conduktor.aws.IAMClientCallbackHandler
      aws_access_key_id=<access-key-id>
      aws_secret_access_key=<secret-access-key>
```
</TabItem>
<TabItem value="Environment Variables" label="Environment Variables">

```bash
    environment:
      CDK_CLUSTERS_0_ID: 'amazon-msk-iam'
      CDK_CLUSTERS_0_NAME: 'Amazon MSK IAM'
      CDK_CLUSTERS_0_BOOTSTRAPSERVERS: 'b-3-public.****.kafka.eu-west-1.amazonaws.com:9198'
      CDK_CLUSTERS_0_PROPERTIES: "security.protocol=SASL_SSL\nsasl.mechanism=AWS_MSK_IAM\nsasl.jaas.config=software.amazon.msk.auth.iam.IAMLoginModule required;\nsasl.client.callback.handler.class=io.conduktor.aws.IAMClientCallbackHandler\naws_access_key_id=<access-key-id>\naws_secret_access_key=<secret-access-key>"
```
</TabItem>
</Tabs>

Connect to an MSK cluster with IAM credentials inherited from environment.

<Tabs>
<TabItem value="YAML  File" label="YAML File">

```yml
clusters:
  - id: 'amazon-msk-iam'
    name: 'Amazon MSK IAM'
    bootstrapServers: 'b-3-public.****.kafka.eu-west-1.amazonaws.com:9198'
    properties: |
      security.protocol=SASL_SSL
      sasl.mechanism=AWS_MSK_IAM
      sasl.jaas.config=software.amazon.msk.auth.iam.IAMLoginModule required;
      sasl.client.callback.handler.class=software.amazon.msk.auth.iam.IAMClientCallbackHandler
```
</TabItem>
<TabItem value="Environment Variables" label="Environment Variables">

```bash
    environment:
      CDK_CLUSTERS_0_ID: 'amazon-msk-iam'
      CDK_CLUSTERS_0_NAME: 'Amazon MSK IAM'
      CDK_CLUSTERS_0_BOOTSTRAPSERVERS: 'b-3-public.****.kafka.eu-west-1.amazonaws.com:9198'
      CDK_CLUSTERS_0_PROPERTIES: "security.protocol=SASL_SSL\nsasl.mechanism=AWS_MSK_IAM\nsasl.jaas.config=software.amazon.msk.auth.iam.IAMLoginModule required;\nsasl.client.callback.handler.class=software.amazon.msk.auth.iam.IAMClientCallbackHandler"
```
</TabItem>
</Tabs>

On top of that, you can override either the `default` profile or the role to assume.

<Tabs>
<TabItem value="Override Profile" label="Override Profile">

```
sasl.jaas.config = software.amazon.msk.auth.iam.IAMLoginModule required awsProfileName="other-profile";
```
</TabItem>
<TabItem value="Override Role" label="Override Role">

```
sasl.jaas.config = software.amazon.msk.auth.iam.IAMLoginModule required awsRoleArn="arn:aws:iam::123456789012:role/msk_client_role";
```
</TabItem>
</Tabs>

## Amazon MSK with Glue Schema Registry

Connect to an MSK cluster with schema registry using credentials.

<Tabs>
<TabItem value="YAML  File" label="YAML File">

```yaml
clusters:
  - id: 'amazon-msk-iam'
    name: 'Amazon MSK IAM'
    bootstrapServers: 'b-3-public.****.kafka.eu-west-1.amazonaws.com:9198'
    properties: |
      security.protocol=SASL_SSL
      sasl.mechanism=AWS_MSK_IAM
      sasl.jaas.config=software.amazon.msk.auth.iam.IAMLoginModule required;
      sasl.client.callback.handler.class=io.conduktor.aws.IAMClientCallbackHandler
      aws_access_key_id=<access-key-id>
      aws_secret_access_key=<secret-access-key>
    schemaRegistry:
      region: '<aws-region>'
      security:
        type: 'Credentials'
        accessKeyId: '<access-key-id>'
        secretKey: '<secret-key>'
```
</TabItem>
<TabItem value="Environment Variables" label="Environment Variables">

```bash
    environment:
      CDK_CLUSTERS_0_ID: 'amazon-msk-iam'
      CDK_CLUSTERS_0_NAME: 'Amazon MSK IAM'
      CDK_CLUSTERS_0_BOOTSTRAPSERVERS: 'b-3-public.****.kafka.eu-west-1.amazonaws.com:9198'
      CDK_CLUSTERS_0_PROPERTIES: "security.protocol=SASL_SSL\nsasl.mechanism=AWS_MSK_IAM\n
      sasl.jaas.config=software.amazon.msk.auth.iam.IAMLoginModule required;\nsasl.client.callback.handler.class=io.conduktor.aws.IAMClientCallbackHandler\naws_access_key_id=<access-key-id>\naws_secret_access_key=<secret-access-key>"
      CDK_CLUSTERS_0_SCHEMAREGISTRY_REGION: '<aws-region>'
      CDK_CLUSTERS_0_SCHEMAREGISTRY_AMAZONSECURITY_TYPE: 'Credentials'
      CDK_CLUSTERS_0_SCHEMAREGISTRY_AMAZONSECURITY_ACCESSKEYID: '<access-key-id>'
      CDK_CLUSTERS_0_SCHEMAREGISTRY_AMAZONSECURITY_SECRETKEY: '<secret-key>'
```
</TabItem>
</Tabs>

Connect to an MSK cluster with schema registry using the default chain of credentials providers.

<Tabs>
<TabItem value="YAML  File" label="YAML File">

```yaml
clusters:
  - id: 'amazon-msk-iam'
    name: 'Amazon MSK IAM'
    bootstrapServers: 'b-3-public.****.kafka.eu-west-1.amazonaws.com:9198'
    properties: |
      security.protocol=SASL_SSL
      sasl.mechanism=AWS_MSK_IAM
      sasl.jaas.config=software.amazon.msk.auth.iam.IAMLoginModule required;
      sasl.client.callback.handler.class=io.conduktor.aws.IAMClientCallbackHandler
      aws_access_key_id=<access-key-id>
      aws_secret_access_key=<secret-access-key>
    schemaRegistry:
      region: '<aws-region>'
      security:
        type: 'FromContext'
        profile: '<profile>' # optional to use the default profile
```
</TabItem>
<TabItem value="Environment Variables" label="Environment Variables">

```bash
    environment:
      CDK_CLUSTERS_0_ID: 'amazon-msk-iam'
      CDK_CLUSTERS_0_NAME: 'Amazon MSK IAM'
      CDK_CLUSTERS_0_BOOTSTRAPSERVERS: 'b-3-public.****.kafka.eu-west-1.amazonaws.com:9198'
      CDK_CLUSTERS_0_PROPERTIES: "security.protocol=SASL_SSL\nsasl.mechanism=AWS_MSK_IAM\n
      sasl.jaas.config=software.amazon.msk.auth.iam.IAMLoginModule required;\nsasl.client.callback.handler.class=io.conduktor.aws.IAMClientCallbackHandler\naws_access_key_id=<access-key-id>\naws_secret_access_key=<secret-access-key>"
      CDK_CLUSTERS_0_SCHEMAREGISTRY_REGION: '<aws-region>'
      CDK_CLUSTERS_0_SCHEMAREGISTRY_AMAZONSECURITY_TYPE: 'FromContext'
      CDK_CLUSTERS_0_SCHEMAREGISTRY_AMAZONSECURITY_PROFILE: '<profile>'
```
</TabItem>
</Tabs>

Connect to an MSK cluster with schema registry using a specific role.

<Tabs>
<TabItem value="YAML  File" label="YAML File">

```yaml
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
      region: '<aws-region>'
      security:
        type: 'FromRole'
        role: '<role>'
```
</TabItem>
<TabItem value="Environment Variables" label="Environment Variables">

```bash
    environment:
      CDK_CLUSTERS_0_ID: 'amazon-msk-iam'
      CDK_CLUSTERS_0_NAME: 'Amazon MSK IAM'
      CDK_CLUSTERS_0_BOOTSTRAPSERVERS: 'b-3-public.****.kafka.eu-west-1.amazonaws.com:9198'
      CDK_CLUSTERS_0_PROPERTIES: "security.protocol=SASL_SSL\nsasl.mechanism=AWS_MSK_IAM\n
      sasl.jaas.config=software.amazon.msk.auth.iam.IAMLoginModule required;\nsasl.client.callback.handler.class=io.conduktor.aws.IAMClientCallbackHandler\naws_access_key_id=<access-key-id>\naws_secret_access_key=<secret-access-key>"
      CDK_CLUSTERS_0_SCHEMAREGISTRY_REGION: '<aws-region>'
      CDK_CLUSTERS_0_SCHEMAREGISTRY_AMAZONSECURITY_TYPE: 'FromRole'
      CDK_CLUSTERS_0_SCHEMAREGISTRY_AMAZONSECURITY_ROLE: '<role>'
```
</TabItem>
</Tabs>

On top of that, and for all these previous configuration example,
you can add a `registryName` to the `schemaRegistry` section to use a specific registry for this cluster.

<Tabs>
<TabItem value="YAML  File" label="YAML File">

```yaml
schemaRegistry:
  region: '<aws-region>'
  security:
    type: 'Credentials'
    accessKeyId: '<access-key-id>'
    secretKey: '<secret-key>'
  registryName: '<registry-name>'
```

</TabItem>
<TabItem value="Environment Variables" label="Environment Variables">

```bash
    environment:
      CDK_CLUSTERS_0_SCHEMAREGISTRY_REGION: '<aws-region>'
      CDK_CLUSTERS_0_SCHEMAREGISTRY_AMAZONSECURITY_TYPE: 'Credentials'
      CDK_CLUSTERS_0_SCHEMAREGISTRY_AMAZONSECURITY_ACCESSKEYID: '<access-key-id>'
      CDK_CLUSTERS_0_SCHEMAREGISTRY_AMAZONSECURITY_SECRETKEY: '<secret-key>'
      CDK_CLUSTERS_0_SCHEMAREGISTRY_REGISTRYNAME: '<registry-name>'
```

</TabItem>
</Tabs>

## Confluent Cloud Example

Connect to a Confluent cloud cluster using API keys.

<Tabs>
<TabItem value="YAML  File" label="YAML File">

```yaml
clusters:
  - id: 'confluent-pkc'
    name: 'Confluent Prod'
    bootstrapServers: 'pkc-lzoyy.eu-central-1.aws.confluent.cloud:9092'
    properties: |
      security.protocol=SASL_SSL
      sasl.mechanism=PLAIN
      sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username="<username>" password="<password>";
```

</TabItem>
<TabItem value="Environment Variables" label="Environment Variables">

```bash
    environment:
      CDK_CLUSTERS_0_ID: 'confluent-pkc'
      CDK_CLUSTERS_0_NAME: 'Confluent Prod'
      CDK_CLUSTERS_0_BOOTSTRAPSERVERS: 'pkc-lzoyy.eu-central-1.aws.confluent.cloud:9092'
      CDK_CLUSTERS_0_PROPERTIES: "security.protocol=SASL_SSL\nsasl.mechanism=PLAIN\nsasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username=\"<username>\" password=\"<password>\";"
```

</TabItem>
</Tabs>

## Confluent Cloud with Schema Registry

Connect to a Confluent cloud cluster with schema registry using basic auth.

<Tabs>
<TabItem value="YAML  File" label="YAML File">

```yaml
- id: 'confluent-pkc'
  name: 'Confluent Prod'
  bootstrapServers: 'pkc-lq8v7.eu-central-1.aws.confluent.cloud:9092'
  properties: |
    security.protocol=SASL_SSL
    sasl.mechanism=PLAIN
    sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username="<usernam>" password="<password>";
  schemaRegistry:
    id: 'confluent-sr'
    url: 'https://psrc-o268o.eu-central-1.aws.confluent.cloud'
    security:
      username: '<username>'
      password: '<password>'
```

</TabItem>
<TabItem value="Environment Variables" label="Environment Variables">

```bash
    environment:
      CDK_CLUSTERS_0_ID: 'confluent-pkc'
      CDK_CLUSTERS_0_NAME: 'Confluent Prod'
      CDK_CLUSTERS_0_BOOTSTRAPSERVERS: 'pkc-lq8v7.eu-central-1.aws.confluent.cloud:9092'
      CDK_CLUSTERS_0_PROPERTIES: "security.protocol=SASL_SSL\nsasl.mechanism=PLAIN\nsasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username=\"<username>\" password=\"<password>\";"
      CDK_CLUSTERS_0_SCHEMAREGISTRY_ID: 'confluent-sr'
      CDK_CLUSTERS_0_SCHEMAREGISTRY_URL: 'https://psrc-o268o.eu-central-1.aws.confluent.cloud'
      CDK_CLUSTERS_0_SCHEMAREGISTRY_SECURITY_USERNAME: '<username>'
      CDK_CLUSTERS_0_SCHEMAREGISTRY_SECURITY_PASSWORD: '<password>'
```

</TabItem>
</Tabs>

## Confluent Cloud with Service Account Management

Connect to a Confluent Cloud cluster and configure additional properties to manage Service Accounts, API Keys and ACLs. 

<Tabs>
<TabItem value="YAML  File" label="YAML File">

```yaml
- id: 'confluent-pkc'
  name: 'Confluent Prod'
  bootstrapServers: 'pkc-lq8v7.eu-central-1.aws.confluent.cloud:9092'
  properties: |
    security.protocol=SASL_SSL
    sasl.mechanism=PLAIN
    sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username="<username>" password="<password>";
  kafkaFlavor:
    type: "Confluent"
    key: "<api_key>" # Confluent Cloud API Key, NOT cluster API Key
    secret: "<api_secret>" # Confluent Cloud API Secret, NOT cluster API Secret
    confluentEnvironmentId: "<env_id>"
    confluentClusterId: "<cluster_id>"
```

</TabItem>
<TabItem value="Environment Variables" label="Environment Variables">

```bash
    environment:
    environment:
      CDK_CLUSTERS_0_ID: 'confluent-pkc'
      CDK_CLUSTERS_0_NAME: 'Confluent Prod'
      CDK_CLUSTERS_0_BOOTSTRAPSERVERS: 'pkc-lq8v7.eu-central-1.aws.confluent.cloud:9092'
      CDK_CLUSTERS_0_PROPERTIES: "security.protocol=SASL_SSL\nsasl.mechanism=PLAIN\nsasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username=\"<username>\" password=\"<password>\";"
      CDK_CLUSTERS_0_KAFKAFLAVOR_TYPE: "Confluent"
      CDK_CLUSTERS_0_KAFKAFLAVOR_KEY: "<api_key>"
      CDK_CLUSTERS_0_KAFKAFLAVOR_SECRET: "<api_secret>"
      CDK_CLUSTERS_0_KAFKAFLAVOR_CONFLUENTENVIRONMENTID: "<env_id>"
      CDK_CLUSTERS_0_KAFKAFLAVOR_CONFLUENTCLUSTERID: "<cluster_id>"
```

</TabItem>
</Tabs>

## SSL Certificates Example - Aiven (truststore)

You can directly use the PEM formatted files (.pem or .cer) by providing the CA certificate inline. Please make sure the certificate is on one single line

<Tabs>
<TabItem value="YAML  File" label="YAML File">

```yaml
- id: aiven
  name: My Aiven Cluster
  bootstrapServers: 'kafka-09ba.aivencloud.com:21661'
  properties: |
    security.protocol=SASL_SSL
    sasl.mechanism=SCRAM-SHA-512
    sasl.jaas.config=org.apache.kafka.common.security.scram.ScramLoginModule required username="<username>" password="<password>";
    ssl.truststore.type=PEM
    ssl.truststore.certificates=-----BEGIN CERTIFICATE----- <YOUR CA CERTIFICATE> -----END CERTIFICATE-----
```

</TabItem>
<TabItem value="Environment Variables" label="Environment Variables">

```bash
    environment:
      CDK_CLUSTERS_0_ID: 'aiven'
      CDK_CLUSTERS_0_NAME: 'My Aiven Cluster'
      CDK_CLUSTERS_0_BOOTSTRAPSERVERS: 'kafka-09ba.aivencloud.com:21661'
      CDK_CLUSTERS_0_PROPERTIES: "security.protocol=SASL_SSL\nsasl.mechanism=SCRAM-SHA-512\nsasl.jaas.config=org.apache.kafka.common.security.scram.ScramLoginModule required username=\"<username>\" password=\"<password>\";\nssl.truststore.type=PEM\nssl.truststore.certificates=-----BEGIN CERTIFICATE----- <YOUR CA CERTIFICATE> -----END CERTIFICATE-----"
```

</TabItem>
</Tabs>

## 2 Way SSL (keystore + truststore)

You should have 3 files, and generally they are embedded in 2 files:

- Your access key (in the keystore.jks file)
- Your access certificate (in the keystore.jks file)
- Your CA certificate (in the truststore.jks file)
  Please make sure to have the content is on a single line

<Tabs>
<TabItem value="YAML  File" label="YAML File">

```yaml
- id: 'aiven-ssl'
  name: 'Aiven SSL'
  bootstrapServers: 'kafka-09ba.aivencloud.com:21650'
  properties: |
    security.protocol=SSL
    ssl.truststore.type=PEM
    ssl.truststore.certificates=-----BEGIN CERTIFICATE----- <YOUR CA CERTIFICATE> -----END CERTIFICATE-----
    ssl.keystore.type=PEM
    ssl.keystore.key=-----BEGIN PRIVATE KEY----- <YOUR ACCES KEY> -----END PRIVATE KEY-----
    ssl.keystore.certificate.chain=-----BEGIN CERTIFICATE----- <YOUR ACCESS CERTIFICATE> -----END CERTIFICATE-----
```

</TabItem>
<TabItem value="Environment Variables" label="Environment Variables">

```bash
    environment:
      CDK_CLUSTERS_0_ID: 'aiven-ssl'
      CDK_CLUSTERS_0_NAME: 'Aiven SSL'
      CDK_CLUSTERS_0_BOOTSTRAPSERVERS: 'kafka-09ba.aivencloud.com:21650'
      CDK_CLUSTERS_0_PROPERTIES: "security.protocol=SSL\nssl.truststore.type=PEM\nssl.truststore.certificates=-----BEGIN CERTIFICATE----- <YOUR CA CERTIFICATE> -----END CERTIFICATE-----\nssl.keystore.type=PEM\nssl.keystore.key=-----BEGIN PRIVATE KEY----- <YOUR ACCES KEY> -----END PRIVATE KEY-----\nssl.keystore.certificate.chain=-----BEGIN CERTIFICATE----- <YOUR ACCESS CERTIFICATE> -----END CERTIFICATE-----"
```

</TabItem>
</Tabs>

## Aiven with Service Account Management

Connect to an Aiven cluster and configure additional properties to manage Service Accounts and ACLs. 

<Tabs>
<TabItem value="YAML  File" label="YAML File">

```yaml
- id: 'aiven-09ba'
  name: 'Aiven Prod'
  bootstrapServers: 'kafka-09ba.aivencloud.com:21661'
  properties: |
    security.protocol=SASL_SSL
    sasl.mechanism=SCRAM-SHA-512
    sasl.jaas.config=org.apache.kafka.common.security.scram.ScramLoginModule required username="<username>" password="<password>";
    ssl.truststore.type=PEM
    ssl.truststore.certificates=-----BEGIN CERTIFICATE----- <YOUR CA CERTIFICATE> -----END CERTIFICATE-----
  kafkaFlavor:
    type: "Aiven"
    apiToken: "<api_token>" 
    project: "<project>" 
    serviceName: "kafka-18350d67" # kafka cluster id (service name)
```

</TabItem>
<TabItem value="Environment Variables" label="Environment Variables">

```bash
    environment:
      CDK_CLUSTERS_0_ID: 'aiven-09ba'
      CDK_CLUSTERS_0_NAME: 'Aiven Prod'
      CDK_CLUSTERS_0_BOOTSTRAPSERVERS: 'kafka-09ba.aivencloud.com:21661'
      CDK_CLUSTERS_0_PROPERTIES: "    security.protocol=SASL_SSL\n
    sasl.mechanism=SCRAM-SHA-512\nsasl.jaas.config=org.apache.kafka.common.security.scram.ScramLoginModule required username="username" password="password";\nssl.truststore.type=PEM\nssl.truststore.certificates=-----BEGIN CERTIFICATE----- <YOUR CA CERTIFICATE> -----END CERTIFICATE-----"
      CDK_CLUSTERS_0_KAFKAFLAVOR_TYPE: "Aiven"
      CDK_CLUSTERS_0_KAFKAFLAVOR_APITOKEN: "<api_key>"
      CDK_CLUSTERS_0_KAFKAFLAVOR_PROJECT: "<api_secret>"
      CDK_CLUSTERS_0_KAFKAFLAVOR_SERVICENAME: "kafka-18350d67"
```

</TabItem>
</Tabs>

## Conduktor Gateway Virtual Cluster

Configure virtual clusters from your [Conduktor Gateway](https://docs.conduktor.io/gateway) deployment to manage interceptors within Console. 

<Tabs>
<TabItem value="YAML  File" label="YAML File">

```yaml
- id: 'kafka'
  name: 'Kafka'
  bootstrapServers: 'http://conduktor-proxy-internal:8888'
  kafkaFlavor:
    type: "Gateway"
    url: "http://conduktor-proxy-internal:8888" 
    user: "admin" 
    password: "conduktor" 
    virtualCluster: "passthrough" 
```

</TabItem>
<TabItem value="Environment Variables" label="Environment Variables">

```bash
    environment:
      CDK_CLUSTERS_0_ID: 'aiven-09ba'
      CDK_CLUSTERS_0_NAME: 'Aiven Prod'
      CDK_CLUSTERS_0_BOOTSTRAPSERVERS: 'conduktor-proxy-internal:9092'
      CDK_CLUSTERS_0_KAFKAFLAVOR_TYPE: "Gateway"
      CDK_CLUSTERS_0_KAFKAFLAVOR_URL: "http://conduktor-proxy-internal:8888"
      CDK_CLUSTERS_0_KAFKAFLAVOR_USER: "admin"
      CDK_CLUSTERS_0_KAFKAFLAVOR_PASSWORD: "conduktor"
      CDK_CLUSTERS_0_KAFKAFLAVOR_VIRTUALCLUSTER: "passthrough"
```

</TabItem>
</Tabs>

## SASL/OAUTHBEARER and OIDC Kafka Cluster Example

OAUTHBEARER with OIDC Authentication is possible since Kafka 3.1 and [KIP-768](https://cwiki.apache.org/confluence/pages/viewpage.action?pageId=186877575)

To demonstrate OIDC authentication, NASA has a Kafka Cluster from which you can connect to after you [Sign Up](https://gcn.nasa.gov/quickstart).  
Here's a config example that works for their cluster.  
Adapt the values to your needs for your own Kafka Cluster.

<Tabs>
<TabItem value="YAML  File" label="YAML File">

```yml
clusters:
  - id: 'nasa'
    name: 'GCN NASA Kafka'
    bootstrapServers: 'kafka.gcn.nasa.gov:9092'
    properties: |
      security.protocol=SASL_SSL
      sasl.mechanism=OAUTHBEARER
      sasl.jaas.config=org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginModule required \
      clientId="<YOUR_CLIENT_ID>" \
      clientSecret="<YOUR_CLIENT_SECRET>";
      sasl.oauthbearer.token.endpoint.url=https://auth.gcn.nasa.gov/oauth2/token
      sasl.login.callback.handler.class=org.apache.kafka.common.security.oauthbearer.secured.OAuthBearerLoginCallbackHandler
```
</TabItem>
<TabItem value="Environment Variables" label="Environment Variables">

```bash
    environment:
      CDK_CLUSTERS_0_ID: 'nasa'
      CDK_CLUSTERS_0_NAME: 'GCN NASA Kafka'
      CDK_CLUSTERS_0_BOOTSTRAPSERVERS: 'kafka.gcn.nasa.gov:9092'
      CDK_CLUSTERS_0_PROPERTIES: 'security.protocol=SASL_SSL\nsasl.mechanism=OAUTHBEARER\nsasl.jaas.config=org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginModule required clientId="<YOUR_CLIENT_ID>" clientSecret="<YOUR_CLIENT_SECRET>";\nsasl.oauthbearer.token.endpoint.url=https://auth.gcn.nasa.gov/oauth2/token\nsasl.login.callback.handler.class=org.apache.kafka.common.security.oauthbearer.secured.OAuthBearerLoginCallbackHandler'
```
</TabItem>
</Tabs>
