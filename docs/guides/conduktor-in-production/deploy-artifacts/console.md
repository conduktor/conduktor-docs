---
sidebar_position: 70
title: Console
description: Deploy Console
---
import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

## Configuration snippets

The Conduktor Console can be configured using a YAML configuration file or through environment variables. The full list of configurable properties can be found [here](/platform/get-started/configuration/env-variables/). Note that it's also possible to make some configurations (such as Kafka cluster configuration) through our [API](/platform/reference/api-reference/).

Note you can also configure your clusters within the [Admin](/platform/navigation/settings/managing-clusters/) section of Console, whereby you can also upload certificates using the [certificate store](/platform/get-started/configuration/ssl-tls-configuration/#using-the-conduktor-certificate-store).

#### GitOps: Managing cluster configurations

If you want to configure clusters with a GitOps approach, we recommend using [Console API](https://developers.conduktor.io/?product=console).

Note that from Console version `1.19`, if you are configuring clusters through the YAML file, this will act as the source of truth for cluster definition. Meaning, if you make changes to the cluster using the UI, they will be overridden on the next restart containing a reference to your configuration file.

If you've created your cluster configurations from within the Console UI, they will not be impacted by a restart. Removing the YAML block entirely will not remove existing clusters from the UI.

#### Complete configuration example

This demonstrates a complete configuration for Conduktor Enterprise consisting of one Kafka cluster with Schema Registry, SSO and license key. 

For identity provider specific guides see [configuring SSO](/platform/category/configure-sso/). Note that if you don't have an Enterprise license, you should omit the SSO configuration and use [local users](/platform/get-started/configuration/user-authentication/local-admin-and-users/) instead.

<Tabs>
<TabItem value="YAML  File" label="YAML file">

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
<TabItem value="Environment Variables" label="Environment variables">

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

#### Plain auth example

Connect to a local cluster with no auth/encryption. For example, a local dev Kafka.

<Tabs>
<TabItem value="YAML  File" label="YAML file">

```yml
clusters:
  - id: 'local'
    name: 'Local Kafka Cluster'
    bootstrapServers: 'localhost:9092'
```
</TabItem>
<TabItem value="Environment Variables" label="Environment variables">

```bash
    environment:
      CDK_CLUSTERS_0_ID: 'local'
      CDK_CLUSTERS_0_NAME: 'Local Kafka Cluster'
      CDK_CLUSTERS_0_BOOTSTRAPSERVERS: 'localhost:9092'
```
</TabItem>
</Tabs>

#### Plain auth with schema registry

Connect to a local cluster with schema registry.

<Tabs>
<TabItem value="YAML  File" label="YAML file">

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
<TabItem value="Environment Variables" label="Environment variables">

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

#### Kafka Connect

Cluster with Kafka Connect configured with Basic Auth.

<Tabs>
<TabItem value="YAML  File" label="YAML file">

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
<TabItem value="Environment Variables" label="Environment variables">

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

#### Amazon MSK with IAM authentication example

Connect to an MSK cluster with IAM Authentication using AWS Access Key and Secret.

:::warning[Potential costs]
Deploying this **CloudFormation** template to your environment might result in billable resources being consumed. [See Amazon MSK pricing for details](https://aws.amazon.com/msk/pricing/).
:::


<Tabs>
<TabItem value="YAML  File" label="YAML file">

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
<TabItem value="Environment Variables" label="Environment variables">

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
<TabItem value="YAML  File" label="YAML file">

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
<TabItem value="Environment Variables" label="Environment variables">

```bash
    environment:
      CDK_CLUSTERS_0_ID: 'amazon-msk-iam'
      CDK_CLUSTERS_0_NAME: 'Amazon MSK IAM'
      CDK_CLUSTERS_0_BOOTSTRAPSERVERS: 'b-3-public.****.kafka.eu-west-1.amazonaws.com:9198'
      CDK_CLUSTERS_0_PROPERTIES: "security.protocol=SASL_SSL\nsasl.mechanism=AWS_MSK_IAM\nsasl.jaas.config=software.amazon.msk.auth.iam.IAMLoginModule required;\nsasl.client.callback.handler.class=software.amazon.msk.auth.iam.IAMClientCallbackHandler"
```
</TabItem>
</Tabs>

You can also override either the `default` profile or role.

<Tabs>
<TabItem value="Override Profile" label="Override profile">

```
sasl.jaas.config = software.amazon.msk.auth.iam.IAMLoginModule required awsProfileName="other-profile";
```
</TabItem>
<TabItem value="Override Role" label="Override role">

```
sasl.jaas.config = software.amazon.msk.auth.iam.IAMLoginModule required awsRoleArn="arn:aws:iam::123456789012:role/msk_client_role";
```
</TabItem>
</Tabs>

#### Amazon MSK with Glue schema registry

Connect to an MSK cluster with schema registry using credentials.

<Tabs>
<TabItem value="YAML  File" label="YAML file">

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
<TabItem value="Environment Variables" label="Environment variables">

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
<TabItem value="YAML  File" label="YAML file">

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
<TabItem value="Environment Variables" label="Environment variables">

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
<TabItem value="YAML  File" label="YAML file">

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
<TabItem value="Environment Variables" label="Environment variables">

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

To use a specific registry for this cluster, you can add a `registryName` to the `schemaRegistry` section.

<Tabs>
<TabItem value="YAML  File" label="YAML file">

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
<TabItem value="Environment Variables" label="Environment variables">

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

#### Confluent Cloud example

Connect to a Confluent cloud cluster using API keys.

<Tabs>
<TabItem value="YAML  File" label="YAML file">

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
<TabItem value="Environment Variables" label="Environment variables">

```bash
    environment:
      CDK_CLUSTERS_0_ID: 'confluent-pkc'
      CDK_CLUSTERS_0_NAME: 'Confluent Prod'
      CDK_CLUSTERS_0_BOOTSTRAPSERVERS: 'pkc-lzoyy.eu-central-1.aws.confluent.cloud:9092'
      CDK_CLUSTERS_0_PROPERTIES: "security.protocol=SASL_SSL\nsasl.mechanism=PLAIN\nsasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username=\"<username>\" password=\"<password>\";"
```

</TabItem>
</Tabs>

#### Confluent Cloud with schema registry

Connect to a Confluent cloud cluster with schema registry using basic auth.

<Tabs>
<TabItem value="YAML  File" label="YAML file">

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
<TabItem value="Environment Variables" label="Environment variables">

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

#### Confluent Cloud with service account management

Connect to a Confluent Cloud cluster and configure additional properties to manage service accounts, API keys and <GlossaryTerm>ACLs</GlossaryTerm>.

<Tabs>
<TabItem value="YAML  File" label="YAML file">

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
<TabItem value="Environment Variables" label="Environment variables">

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

#### SSL certificate example - Aiven (truststore)

You can use the PEM formatted files (.pem or .cer) directly by providing the CA certificate inline. Make sure the certificate is **on one single line**.

<Tabs>
<TabItem value="YAML  File" label="YAML file">

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
<TabItem value="Environment Variables" label="Environment variables">

```bash
    environment:
      CDK_CLUSTERS_0_ID: 'aiven'
      CDK_CLUSTERS_0_NAME: 'My Aiven Cluster'
      CDK_CLUSTERS_0_BOOTSTRAPSERVERS: 'kafka-09ba.aivencloud.com:21661'
      CDK_CLUSTERS_0_PROPERTIES: "security.protocol=SASL_SSL\nsasl.mechanism=SCRAM-SHA-512\nsasl.jaas.config=org.apache.kafka.common.security.scram.ScramLoginModule required username=\"<username>\" password=\"<password>\";\nssl.truststore.type=PEM\nssl.truststore.certificates=-----BEGIN CERTIFICATE----- <YOUR CA CERTIFICATE> -----END CERTIFICATE-----"
```

</TabItem>
</Tabs>

#### Two-way SSL (keystore and truststore)

You should have three files:

1. Your access key (in the **keystore.jks** file)
1. Your access certificate (in the **keystore.jks** file)
1. Your CA certificate (in the **truststore.jks** file)

Ensure the content is on **a single line**.

<Tabs>
<TabItem value="YAML  File" label="YAML file">

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
<TabItem value="Environment Variables" label="Environment variables">

```bash
    environment:
      CDK_CLUSTERS_0_ID: 'aiven-ssl'
      CDK_CLUSTERS_0_NAME: 'Aiven SSL'
      CDK_CLUSTERS_0_BOOTSTRAPSERVERS: 'kafka-09ba.aivencloud.com:21650'
      CDK_CLUSTERS_0_PROPERTIES: "security.protocol=SSL\nssl.truststore.type=PEM\nssl.truststore.certificates=-----BEGIN CERTIFICATE----- <YOUR CA CERTIFICATE> -----END CERTIFICATE-----\nssl.keystore.type=PEM\nssl.keystore.key=-----BEGIN PRIVATE KEY----- <YOUR ACCES KEY> -----END PRIVATE KEY-----\nssl.keystore.certificate.chain=-----BEGIN CERTIFICATE----- <YOUR ACCESS CERTIFICATE> -----END CERTIFICATE-----"
```

</TabItem>
</Tabs>

#### Aiven with service account management

Connect to an Aiven cluster and configure additional properties to manage Service Accounts and ACLs.

<Tabs>
<TabItem value="YAML  File" label="YAML file">

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
<TabItem value="Environment Variables" label="Environment variables">

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

#### Conduktor Gateway virtual clusters

Configure <GlossaryTerm>virtual clusters</GlossaryTerm> with your <GlossaryTerm>Gateway</GlossaryTerm> deployment to manage <GlossaryTerm>Interceptors</GlossaryTerm> within <GlossaryTerm>Console</GlossaryTerm>.

<Tabs>
<TabItem value="YAML  File" label="YAML file">

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
<TabItem value="Environment Variables" label="Environment variables">

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

#### SASL/OAUTHBEARER and OIDC Kafka cluster example

OAUTHBEARER with OIDC Authentication is possible since Kafka 3.1 and [KIP-768](https://cwiki.apache.org/confluence/pages/viewpage.action?pageId=186877575). To demonstrate OIDC authentication, NASA has a Kafka Cluster from which you can connect to after you [sign up](https://gcn.nasa.gov/quickstart). Here's a config example that works for their cluster (adapt the values to your needs for your cluster).

<Tabs>
<TabItem value="YAML  File" label="YAML file">

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
<TabItem value="Environment Variables" label="Environment variables">

```bash
    environment:
      CDK_CLUSTERS_0_ID: 'nasa'
      CDK_CLUSTERS_0_NAME: 'GCN NASA Kafka'
      CDK_CLUSTERS_0_BOOTSTRAPSERVERS: 'kafka.gcn.nasa.gov:9092'
      CDK_CLUSTERS_0_PROPERTIES: 'security.protocol=SASL_SSL\nsasl.mechanism=OAUTHBEARER\nsasl.jaas.config=org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginModule required clientId="<YOUR_CLIENT_ID>" clientSecret="<YOUR_CLIENT_SECRET>";\nsasl.oauthbearer.token.endpoint.url=https://auth.gcn.nasa.gov/oauth2/token\nsasl.login.callback.handler.class=org.apache.kafka.common.security.oauthbearer.secured.OAuthBearerLoginCallbackHandler'
```
</TabItem>
</Tabs>

## Configure Console logs

<Tabs>
<TabItem  value="Env variables" label="Environment variables">

#### Console-wide log configuration

To configure Conduktor Console logs globally, you can use the following environment variables:

| Environment Variable  | Default value |                                                                          |
| --------------------  | ------------- | ------------------------------------------------------------------------ |
| `CDK_ROOT_LOG_LEVEL`  | `INFO`        | Global Console log level, one of `OFF`, `ERROR`, `WARN`, `INFO`, `DEBUG` |
| `CDK_ROOT_LOG_FORMAT` | `TEXT`        | Log format, one of `TEXT` or `JSON` (sice 1.26.0)                        |
| `CDK_ROOT_LOG_COLOR`  | `true`        | Enable color in logs when possible                                       |

:::info[Compatibility]
For backward compatibility, `CDK_DEBUG: true` is still supported and is equivalent to `CDK_ROOT_LOG_LEVEL: DEBUG`.
:::

#### Per module log configuration

To configure Conduktor Console logs on a per-module basis, you can use the environment variables detailed below.

Possible values for all of them are: `OFF`, `ERROR`, `WARN`, `INFO`, `DEBUG`, and `TRACE`.

| Environment Variable          | Default value        | Description                                                                                                                             |
| ----------------------------- | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `PLATFORM_STARTUP_LOG_LEVEL`  | `INFO`               | Set the setup/configuration process logs level. By default, it is set to `INFO`, but switches to `DEBUG` if `CDK_ROOT_LOG_LEVEL: DEBUG`. |
| `CONSOLE_ROOT_LOG_LEVEL`      | `CDK_ROOT_LOG_LEVEL` | Logs related to any actions done in the Console UI                                                                                      |
| `PLATFORM_API_ROOT_LOG_LEVEL` | `CDK_ROOT_LOG_LEVEL` | Internal platform API logs (health endpoints)                                                                                           |                                                                                       |

#### Log level inheritance

If you don't explicitly set the log level for a module, it will inherit the `CDK_ROOT_LOG_LEVEL`.

For instance, if you only set
```yaml
CDK_ROOT_LOG_LEVEL: DEBUG
# CONSOLE_ROOT_LOG_LEVEL isn't set
```
Then, `CONSOLE_ROOT_LOG_LEVEL` will be automatically set to `DEBUG`.

Similarly, if you set:
```yaml
CDK_ROOT_LOG_LEVEL: INFO
CONSOLE_ROOT_LOG_LEVEL: DEBUG
```

Then, `CONSOLE_ROOT_LOG_LEVEL` will still be set to `DEBUG`, and isn't overridden.

</TabItem>

<TabItem  value="Config file" label="Config file">

If you want to further customize your logging at an individual logger-level, you can use a per-module logback configuration file.

By default, all logback configuration files are in **/opt/conduktor/loggers/** with `READ-ONLY` permissions.

At startup, Console will copy all (missing) logback configuration files from `/opt/conduktor/loggers/` to `/var/conduktor/configs/loggers/` directory with `READ-WRITE` permissions.

Because all logback configuration files are set to reload themselves every 15 seconds, you can then edit them inside the container volume in **/var/conduktor/configs/loggers/** to tune log level per logger.

All logback configuration files declare some expected appenders:

| Appender name        | Description                                                   |
| -------------------- | ------------------------------------------------------------- |
| `STDOUT`             | Appender that writes logs to stdout                           |
| `STDOUT_COLOR`       | Appender that writes logs to stdout with color                |
| `ASYNC_STDOUT`       | Appender that writes logs to stdout asynchronously            |
| `ASYNC_STDOUT_COLOR` | Appender that writes logs to stdout asynchronously with color |

</TabItem>
</Tabs>

## Structured logging (JSON)

To enable structured logging, simply set `CONSOLE_ROOT_LOG_LEVEL=JSON`. The logs will be structured using following format:

```json
{
 "timestamp": "2024-06-14T10:09:25.802542476+00:00",
 "level": "<log level>",
 "message": "<log message>",
 "logger": "<logger name>",
 "thread": "<logger thread>",
 "stack_trace": "<throwable>",
 "mdc": {
   "key": "value"
 }
}
```

:::note[Log encoding]
The log `timestamp` is encoded in [ISO-8601 format](https://en.wikipedia.org/wiki/ISO_8601). When structured logging is enabled, `CDK_ROOT_LOG_COLOR` is always ignored.
:::

## Runtime logger configuration API

From version 1.28.0, Conduktor Console exposes an API to change the log level of a logger at runtime. This API **requires admin privileges** and is available on `/api/public/debug/v1/loggers`.

### Get all loggers and their log level

`GET /api/public/debug/v1/loggers` :

```bash
curl -X GET 'http://localhost:8080/api/public/debug/v1/loggers' \
  -H "Authorization: Bearer $API_KEY" | jq .
```
That will output :

```json
[
  {
    "name": "io",
    "level": "INFO"
  },
  {
    "name": "io.conduktor",
    "level": "INFO"
  },
  {
    "name": "io.conduktor.authenticator",
    "level": "INFO"
  },
  {
    "name": "io.conduktor.authenticator.ConduktorUserProfile",
    "level": "INFO"
  },
  {
    "name": "org",
    "level": "INFO"
  },
  {
    "name": "org.apache",
    "level": "INFO"
  },
  {
    "name": "org.apache.avro",
    "level": "INFO"
  },
  ...
]
```

### Get a specific logger and its log level

`GET /api/public/debug/v1/loggers/{loggerName}` :

```bash
curl -X GET 'http://localhost:8080/api/public/debug/v1/loggers/io.conduktor.authenticator' \
  -H "Authorization: Bearer $API_KEY" | jq .
```
That will output :

```json
[
  {
    "name": "io.conduktor.authenticator",
    "level": "INFO"
  },
  {
    "name": "io.conduktor.authenticator.ConduktorUserProfile",
    "level": "INFO"
  }
  ...
]
```

:::note[Logger name filter]
The `loggerName` filter uses a **contains** so you can either use the fully qualified cardinal name or just a part of it, meaning that the filter `authenticator` will match `io.conduktor.authenticator` and `io.conduktor.authenticator.ConduktorUserProfile` loggers.
:::

### Set a specific logger log level

`PUT /api/public/debug/v1/loggers/{loggerName}/{logLevel}` :

```bash
curl -X PUT 'http://localhost:8080/api/public/debug/v1/loggers/io.conduktor.authenticator/DEBUG' \
  -H "Authorization: Bearer $API_KEY" | jq .
```

That will output the list of loggers impacted by the update:

```json
[
  "io.conduktor.authenticator",
  "io.conduktor.authenticator.ConduktorUserProfile"
  ...
]
```

:::note[Logger name log level]
Like the `GET` endpoint, the `loggerName` filter use a **contains** so you can either use the fully qualified cardinal name or just a part of it. The `logLevel` is **case-insensitive** and can be: `TRACE`, `DEBUG`, `INFO`, `WARN`, `ERROR`, `OFF`.
:::

### Set multiple loggers log level

`PUT /api/public/debug/v1/loggers` :

```bash
curl -X PUT 'http://localhost:8080/public/debug/v1/loggers' \
   -H "Authorization: Bearer $API_KEY" \
  --data '[
      {
          "name": "io.conduktor.authenticator.ConduktorUserProfile",
          "level": "TRACE"
      },
      {
          "name": "io.conduktor.authenticator.adapter",
          "level": "DEBUG"
      }
  ]' | jq .
```

That will output the list of loggers impacted by the update:

```json
[
  "io.conduktor.authenticator.ConduktorUserProfile",
  "io.conduktor.authenticator.ConduktorUserProfile$LocalUserProfile",
  "io.conduktor.authenticator.adapter",
  "io.conduktor.authenticator.adapter.Http4sCacheSessionStore",
  ...
]
```









## Debug Console

Conduktor Console Docker image runs on Ubuntu Linux. It runs multiple services in a single Docker container. These services are supervised by [supervisord](http://supervisord.org/).

To troubleshoot Console:

1. Verify that Console is up and running.  
1. Manually debug Conduktor Console.
1. Check the logs and send them to our support team if necessary.

### 1. Verify that Conduktor is up and running

<Tabs>
<TabItem  value="Docker" label="From Docker">

First, verify that all the components are running.

```bash title="Get containers status"
docker ps
```

```txt title="Output"
NAME                   IMAGE                                       COMMAND                  SERVICE                CREATED          STATUS                    PORTS
conduktor-console      conduktor/conduktor-console:1.21.0          "/__cacert_entrypoin…"   conduktor-console      10 minutes ago   Up 9 minutes (healthy)    0.0.0.0:8080->8080/tcp
conduktor-monitoring   conduktor/conduktor-console-cortex:1.21.0   "/opt/conduktor/scri…"   conduktor-monitoring   10 minutes ago   Up 10 minutes (healthy)   0.0.0.0:9009-9010->9009-9010/tcp, 0.0.0.0:9090->9090/tcp
postgres               postgres:15.1                               "docker-entrypoint.s…"   postgres               10 minutes ago   Up 10 minutes             0.0.0.0:5432->5432/tcp
```

If you're using an external Kafka installation and external database, you will only need to verify that the `conduktor-console` container is showing `healthy` as the `STATUS`.

If Console is showing an "exited" status, check the Docker logs by running the command (with the appropriate container name):

```bash title="Get container logs"
docker logs conduktor-console
```

You can save these logs in a file:

```bash title="Store logs in a file"
docker logs conduktor-console >& docker-logs-output.txt
```

</TabItem>

<TabItem  value="Kubernetes" label="Kubernetes">

To get the status of the Conduktor Console pod in Kubernetes, you can run the following command (with the correct namespace, if any):

```bash title="Get containers status"
kubectl get pod --namespace conduktor
```

```txt title="Output"
NAME                                         READY   STATUS    RESTARTS   AGE
console-instance-cortex-5d85d5cfb4-qcxhs   1/1     Running   0          2m4s
console-instance-747d5ffc7b-gcpkx          1/1     Running   0          2m4s
```

The pod status is available in the **STATUS** column.

</TabItem>
</Tabs>

### 2. Manually debug Conduktor Console

#### Check services within the conduktor-console container

First, we will need to invoke a shell within the conduktor-console container. For that, you can use the following commands:

<Tabs>
<TabItem value="Based on container name" label="Based on container name">

```sh
docker exec -it conduktor-console bash
```

</TabItem>
<TabItem value="Based on container ID" label="Based on container ID">

```sh
docker exec -it fe4a5d1be98f bash
```

</TabItem>
</Tabs>

From within the container, you can verify that all expected services are started. Conduktor Console uses supervisord inside of the container to ensure various services are started:

```sh title="Check services status"
supervisorctl status
```

```txt title="Output"
console                          FATAL     Exited too quickly (process log may have details)
platform_api                     RUNNING   pid 39, uptime 0:49:39
proxy                            RUNNING   pid 33, uptime 0:49:39
```

In the example mentioned above, the console did not start successfully. This indicates that we need to look at the log files to investigate the issue further.

### 3. Get the logs and send them to support

Logs are kept in `/var/conduktor/log`. You can see them using:

```sh title="List log files"
ls /var/conduktor/log/
```

```txt title="Output"
console-stdout---supervisor-umscgn8w.log       proxy                                   proxy-stdout---supervisor-2gim6er7.log  supervisord.log
platform_api-stdout---supervisor-cqvwnsqi.log  proxy-stderr---supervisor-8i0bjkaz.log  startup.log
```

The best here is to simply bring all the logs to your local machine (in PWD) by running:

```sh
docker compose cp conduktor-console:/var/conduktor/log .
```

Then send these logs to our[support team](https://support.conduktor.io/hc/en-gb/requests/new). If you've contacted us before, [log into your account and create a ticket](https://support.conduktor.io/hc/en-gb/signin?return_to=https%3A%2F%2Fsupport.conduktor.io%2Fhc%2Fen-gb%2Frequests%2Fnew%3Fticket_form_id%3D17438312520209).


## Healthcheck endpoints

### Liveness endpoint

`/api/health/live`

Returns a status HTTP 200 when Console is up.

```shell title="cURL example"
curl -s  http://localhost:8080/api/health/live
```

Could be used to set up probes on Kubernetes or docker-compose.

#### docker-compose probe setup

```yaml
healthcheck:
  test:
    [
      'CMD-SHELL',
      'curl --fail http://localhost:${CDK_LISTENING_PORT:-8080}/api/health/live',
    ]
  interval: 10s
  start_period: 120s # Leave time for the psql init scripts to run
  timeout: 5s
  retries: 3
```

#### Kubernetes liveness probe

```yaml title="Port configuration"
ports:
  - containerPort: 8080
    protocol: TCP
    name: httpprobe
```

```yaml title="Probe configuration"
livenessProbe:
  httpGet:
    path: /api/health/live
    port: httpprobe
  initialDelaySeconds: 5
  periodSeconds: 10
  timeoutSeconds: 5
```

### Readiness/startup endpoint

`/api/health/ready`

Returns readiness of the Console.
Modules status :

- `NOTREADY` (initial state)
- `READY`

This endpoint returns a 200 status code if Console is in a `READY` state. Otherwise, it returns a 503 status code if Console fails to start.

```shell title="cURL example"
curl -s  http://localhost:8080/api/health/ready
# READY
```

#### Kubernetes startup probe

```yaml title="Port configuration"

ports:
  - containerPort: 8080
    protocol: TCP
    name: httpprobe
```

```yaml title="Probe configuration"
startupProbe:
    httpGet:
        path: /api/health/ready
        port: httpprobe
    initialDelaySeconds: 30
    periodSeconds: 10
    timeoutSeconds: 5
    failureThreshold: 30
```

### Console versions

`/api/versions`

This endpoint exposes module versions used to build the Console along with the overall Console version.

```shell title="cURL example"
curl -s  http://localhost:8080/api/versions | jq .
# {
#  "platform": "1.27.0",
#  "platformCommit": "ed849cbd545bb4711985ce0d0c93ca8588a6b31f",
#  "console": "f97704187a7122f78ddc9110c09abdd1a9f9d470",
#  "console_web": "05dea2124c01dfd9479bc0eb22d9f7d8aed6911b"
# }
```
