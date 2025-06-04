---
sidebar_position: 70
title: Console
description: Deploy Console
---
import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

## Configure Postgres database

Conduktor Console **requires a Postgres database to store its state**.

### Postgres requirements

- Postgres version 13 or higher
- Provided connection role should have grant `ALL PRIVILEGES` on the configured database. Console should be able to create/update/delete schemas and tables on the database.
- For your Postgres deployment use at least 1-2 vCPU, 1 GB of Ram, and 10 GB of disk.

:::warning[AWS RDS/Aurora]
If you want to use AWS RDS or AWS Aurora as a database with Console, consider the following: Console will not work with all PostgreSQL engines within RDS, it will only work with engine versions 14.8+ / 15.3+ (other versions are not fully supported).
:::

### Database configuration properties

- `database` : is a key/value configuration consisting of:
   - `database.url` : database connection url in the format `[jdbc:]postgresql://[user[:password]@][[netloc][:port],...][/dbname][?param1=value1&...]`
   - `database.hosts[].host` : Postgresql server hosts name
   - `database.hosts[].port` : Postgresql server ports
   - `database.host` : Postgresql server host name (Deprecated. Use `database.hosts` instead)
   - `database.port` : Postgresql server port (Deprecated. Use `database.hosts` instead)
   - `database.name` : Database name
   - `database.username` : Database login role
   - `database.password` : Database login password
   - `database.connection_timeout` : Connection timeout option in seconds

#### URL format

Console supports both, the standard [PostgreSQL URL](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING-URIS) and [JDBC PostgreSQL](https://jdbc.postgresql.org/documentation/use/#connecting-to-the-database).

Connection username and password can be provided in the URL as basic authentication or as parameters.

```yaml
database:
  url: 'jdbc:postgresql://user:password@host:5432/database' # or 'postgresql://host:5432/database?user=user&password=password'
```

### SSL support

By default, Console will try to connect to the database using SSL mode `prefer`.  We plan to make this configurable in the future along with database certificate.

### Setup

There are several options available when configuring an external database:

1. From a single connection URL

   - With the `CDK_DATABASE_URL` environment variable.
   - With the `database.url` configuration field.
     In either case, this connection url is using a standard PostgreSQL url in the format `[jdbc:]postgresql://[user[:password]@][[netloc][:port],...][/dbname][?param1=value1&...]`

2. From decomposed configuration fields
   - With the `CDK_DATABASE_*` env vars.
   - With the `database.*` on configuration file.

```yaml
database:
  host: 'host'
  port: 5432
  name: 'database'
  username: 'user'
  password: 'password'
  connection_timeout: 30 # in seconds
```

#### Example

```shell
 docker run --rm \
  -p "8080:8080" \
  -e CDK_DATABASE_URL="postgresql://user:password@host:5432/database" \
  -e LICENSE_KEY="<your-license>" \
  conduktor/conduktor-console:latest
```

:::info[Additional notes]

- If all connection URLs and decomposed configuration fields are provided, **the decomposed configuration fields take priority**.
- If an invalid connection URL or a mandatory configuration field (`host`, `username` or `name`) is missing, Conduktor will fail gracefully with a meaningful error message.
- **Before Console v1.2.0**, the `EMBEDDED_POSTGRES=false` was mandatory to enable external Postgresql configuration.

:::

### Multi-host configuration

If you have a multi-host setup, you can configure the database connection with a list of hosts. Conduktor uses a PostgreSQL JDBC driver to connect to the database that supports [multiple hosts in the connection url](https://jdbc.postgresql.org/documentation/use/#connection-fail-over).

To configure a multi-host setup, you can use the `database.url` configuration field with a list of hosts separated by commas:

```yaml
database:
  url: 'jdbc:postgresql://user:password@host1:5432,host2:5432/database'
```

or with decomposed configuration fields:

```yaml
database:
  hosts: 
   - host: 'host1'
     port: 5432
   - host: 'host2' 
     port: 5432
  name: 'database'
  username: 'user'
  password: 'password'
  connection_timeout: 30 # in seconds
```

You can also provide [JDBC connection parameter](https://jdbc.postgresql.org/documentation/use/#connection-parameters) `targetServerType` to specify the target server type for the connection:

```yaml
database:
  url: 'jdbc:postgresql://user:password@host1:5432,host2:5432/database?targetServerType=primary'
```

Nearly all `targetServerType` are supported: `any`, `primary`, `master`, `slave`, `secondary`, `preferSlave`, `preferSecondary` and `preferPrimary`.

## Configuration snippets

There are different options for configuring Conduktor Console. You can use:

- a YAML configuration file
- environment variables
- [our API](/platform/reference/api-reference/) for some configurations (such as Kafka cluster configuration)
- the **CLusters** page in Console to configure clusters

#### GitOps: Manage clusters

If you want to configure clusters with a GitOps approach, we recommend using [Console API](https://developers.conduktor.io/?product=console).

Note that **from Console v1.19**, if you're configuring clusters through the YAML file, this will act as the source of truth for cluster definition. This means that if you make changes to the cluster via the UI, they will be overridden on the next restart containing a reference to your configuration file.

However, if you've created your cluster configurations using the Console UI, they will not be impacted by a restart. Removing the YAML block entirely will not remove existing clusters from the UI.

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

| Environment variable  | Default value |                                                                          |
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

| Environment variable          | Default value        | Description                                                                                                                             |
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

# Configuration properties and environment variables

## Docker image environment variables

| Environment variable                                                                                                   | Description                                                                                                                                                 | Default Value                                                                       | Since Version |
|------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------|---------------|
| **[Logs](/platform/get-started/troubleshooting/logs-configuration/)**                                                  |                                                                                                                                                             |                                                                                     |               |
| `CDK_DEBUG`                                                                                                            | Enable Console debug logs (equivalent to `CDK_ROOT_LOG_LEVEL=DEBUG`)                                                                                        | `false`                                                                             | 1.0.0         |
| `CDK_ROOT_LOG_LEVEL`                                                                                                   | Set the Console global log level (one of `DEBUG`, `INFO`, `WARN`, `ERROR`)                                                                                  | `INFO`                                                                              | 1.11.0        |
| `CDK_ROOT_LOG_FORMAT`                                                                                                  | Set logs format (one of `TEXT`, `JSON`)                                                                                                                     | `TEXT`                                                                              | 1.26.0        |
| `CDK_ROOT_LOG_COLOR`                                                                                                   | Enable ANSI colors in logs                                                                                                                                  | `true`                                                                              | 1.11.0        |
| `CDK_LOG_TIMEZONE`                                                                                                     | Timezone for dates in logs (in Olson timezone ID format, e.g. `Europe/Paris`)                                                                               | `TZ` environment variable or `UTC` if `TZ` is not defined                           | 1.28.0        |
| **[Proxy settings](/platform/get-started/configuration/http-proxy-configuration/)**                                    |                                                                                                                                                             |                                                                                     |               |
| `CDK_HTTP_PROXY_HOST`                                                                                                  | Proxy hostname                                                                                                                                              | ∅                                                                                   | 1.10.0        |
| `CDK_HTTP_PROXY_PORT`                                                                                                  | Proxy port                                                                                                                                                  | `80`                                                                                | 1.10.0        |
| `CDK_HTTP_NON_PROXY_HOSTS`                                                                                             | List of hosts that should be reached directly, bypassing the proxy. Hosts must be separated by `\|`, end with a `*` for wildcards, and not contain any `/`. | ∅                                                                                   | 1.10.0        |
| `CDK_HTTP_PROXY_USERNAME`                                                                                              | Proxy username                                                                                                                                              | ∅                                                                                   | 1.10.0        |
| `CDK_HTTP_PROXY_PASSWORD`                                                                                              | Proxy password                                                                                                                                              | ∅                                                                                   | 1.10.0        |
| [SSL](/platform/get-started/configuration/ssl-tls-configuration/#configure-custom-truststore-on-conduktor-console) |                                                                                                                                                             |                                                                                     |               |
| `CDK_SSL_TRUSTSTORE_PATH`                                                                                              | Truststore file path used by Console for Kafka, SSO, S3,... clients SSL/TLS verification                                                                    | ∅                                                                                   | 1.5.0         |
| `CDK_SSL_TRUSTSTORE_PASSWORD`                                                                                          | Truststore password (optional)                                                                                                                              | ∅                                                                                   | 1.5.0         |
| `CDK_SSL_TRUSTSTORE_TYPE`                                                                                              | Truststore type (optional)                                                                                                                                  | `jks`                                                                               | 1.5.0         |
| `CDK_SSL_DEBUG`                                                                                                        | Enable SSL/TLS debug logs                                                                                                                                   | `false`                                                                             | 1.9.0         |
| **Java**                                                                                                               |                                                                                                                                                             |                                                                                     |               |
| `CDK_GLOBAL_JAVA_OPTS`                                                                                                 | Custom JAVA_OPTS parameters passed to Console                                                                                                               | ∅                                                                                   | 1.10.0        |
| `CONSOLE_MEMORY_OPTS`                                                                                                  | Configure [Java memory options](memory-configuration.md)                                                                                                    | `-XX:+UseContainerSupport -XX:MaxRAMPercentage=80`                                  | 1.18.0        |
| **Console**                                                                                                            |                                                                                                                                                             |                                                                                     |               |
| `CDK_LISTENING_PORT`                                                                                                   | Console listening port                                                                                                                                      | `8080`                                                                              | 1.2.0         |
| `CDK_VOLUME_DIR`                                                                                                       | Volume directory where Console stores data                                                                                                                  | `/var/conduktor`                                                                    | 1.0.2         |
| `CDK_IN_CONF_FILE`                                                                                                     | Console configuration file location                                                                                                                         | [`/opt/conduktor/default-platform-config.yaml`](introduction.md#configuration-file) | 1.0.2         |
| `CDK_PLUGINS_DIR`                                                                                                      | Volume directory for [Custom Deserializers](/platform/guides/custom-deserializers/) plugins                                                                 | `/opt/conduktor/plugins`                                                            | 1.22.0        |
| **Nginx**                                                                                                              |                                                                                                                                                             |                                                                                     |               |
| `PROXY_BUFFER_SIZE`                                                                                                    | Tune internal Nginx `proxy_buffer_size`                                                                                                                     | `8k`                                                                                | 1.16.0        |

## Console properties reference

You have multiple options to configure Console: via environment variables, or via a YAML configuration file. You can find a mapping of the configuration fields in the `platform-config.yaml` to environment variables below.

Environment variables can be set on the container or imported from a file.  When importing from a file, mount the file into the container and provide its path by setting the environment variable `CDK_ENV_FILE`. Use a .env file with key value pairs.

```
MY_ENV_VAR1=value
MY_ENV_VAR2=otherValue
```

The logs will confirm, `Sourcing environment variables from $CDK_ENV_FILE`, or warn if set and the file is not found

```
Warning: CDK_ENV_FILE is set but the file does not exist or is not readable.
```

In case you set both environment variable and YAML value for a specific field, the environment variable will take precedence.

:::note
Lists start at index 0 and are provided using `_idx_` syntax.
:::

### YAML property cases

YAML configuration supports multiple case formats (`camelCase`/`kebab-case`/`lowercase`) for property fragments such as:

- `clusters[].schemaRegistry.ignoreUntrustedCertificate`
- `clusters[].schema-registry.ignore-untrusted-certificate`
- `clusters[].schemaregistry.ignoreuntrustedcertificate`

All are valid and equivalent in YAML.

### Environment variable conversion

At startup, Conduktor Console will merge environment variables and YAML based configuration files into one unified configuration. The conversion rules are:

- Filter for environment variables that start with `CDK_`
- Remove the `CDK_` prefix
- Convert the variable name to lowercase
- Replace `_` with `.` for nested properties
- Replace `_[0-9]+_` with `[0-9].` for list properties. (Lists start at index 0)

For example, the environment variables `CDK_DATABASE_URL` will be converted to `database.url`, or `CDK_SSO_OAUTH2_0_OPENID_ISSUER` will be converted into `sso.oauth2[0].openid.issuer`.

The YAML equivalent would be:

```yaml
database:
  url: "..."
sso:
  oauth2:
    - openid:
        issuer: "..."
```

When converting environment variables to YAML configuration, environment variables in `UPPER-KEBAB-CASE` will be converted to `kebab-case` in the YAML configuration.

#### Conversion edge cases

Because of YAML multiple case formats support, the conversion rules have some edge cases when trying to mix environment variables and YAML configuration.

Extra rules when mixing environment variables and YAML configuration:

- Don't use `camelCase` in YAML configuration. Use `kebab-case` or `lowercase`
- Stick to one compatible case format for a given property fragment using the following compatibility matrix

Compatibility matrix:

| YAML\Environment | `UPPER-KEBAB-CASE` | `UPPERCASE` |
|------------------|--------------------|-------------|
| `kebab-case`     | ✅                 | 🚫          |
| `lowercase`      | 🚫                 | ✅          |
| `camelCase`      | 🚫                 | 🚫          |

For example, `CDK_CLUSTERS_0_SCHEMAREGISTRY_IGNOREUNTRUSTEDCERTIFICATE` environment variable:

```yaml
# Is equivalent to and compatible with
clusters:
  - schemaregistry:
      ignoreuntrustedcertificate: true
# but not with
clusters:
  - schema-registry:
      ignore-untrusted-certificate: true
```

And `CDK_CLUSTERS_0_SCHEMA-REGISTRY_IGNORE-UNTRUSTED-CERTIFICATE`, that's why camelCase is not recommended in YAML configuration when mixing with environment variables.

### Support of shell expansion in the YAML configuration file

Console supports shell expansion for environment variables and home tilde `~`. This is useful if you have to use custom environment variables in your configuration.

For example, you can use the following syntax:

```yaml title="YAML configuration file"
database:
  url: "jdbc:postgresql://${DB_LOGIN}:${DB_PWD}@${DB_HOST}:${DB_PORT:-5432}/${DB_NAME}"
```

with the following environment variables:

| Environment variable | Value       |
|----------------------|-------------|
| `DB_LOGIN`           | `usr`       |
| `DB_PWD`             | `pwd`       |
| `DB_HOST`            | `some_host` |
| `DB_NAME`            | `cdk`       |

This will be expanded to:

```yaml title="Expanded configuration"
database:
  url: "jdbc:postgresql://usr:pwd@some_host:5432/cdk"
```

If you want to escape the shell expansion, you can use the following syntax: `$$`. For example, if you want `admin.password` to be `secret$123`, you should set `admin.password: "secret$$123"`.

### File path environment variables

When an environment variable ending with `_FILE` is set to a file path, its corresponding unprefixed environment variable will be replaced with the content of that file.

For example, if you set `CDK_LICENSE_FILE=/run/secrets/license`, the value of `CDK_LICENSE` will be overridden by the content of the file located at `/run/secrets/license`.

:::warning[Exception]
The `CDK_IN_CONF_FILE` is not supported.
:::

### Global properties

| Property                   | Description                                                                                                                                                                                                 | Environment variable           | Mandatory | Type    | Default     |
|----------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------|-----------|---------|-------------|
| `organization.name`        | Your organization's name                                                                                                                                                                                    | `CDK_ORGANIZATION_NAME`        | false     | string  | `"default"` |
| `admin.email`              | Your organization's root administrator account email  | `CDK_ADMIN_EMAIL`              | true      | string  | ∅           |
| `admin.password`           | Your organization's root administrator account password. Must be at least 8 characters in length, and include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special symbol | `CDK_ADMIN_PASSWORD`           | true      | string  | ∅           |
| `license`                  | Enterprise license key. If not provided, fallback to free plan. | `CDK_LICENSE` or `LICENSE_KEY` | false     | string  | ∅           |
| `platform.external.url`    | Force Console external URL. Useful for SSO callback URL when using a reverse proxy. By default, Console will try to guess it automatically using X-Forwarded-\* headers coming from upstream reverse proxy. | `CDK_PLATFORM_EXTERNAL_URL`    | false     | string  | ∅           |
| `platform.https.cert.path` | Path to the SSL certificate file                                                                                                                                                                            | `CDK_PLATFORM_HTTPS_CERT_PATH` | false     | string  | ∅           |
| `platform.https.key.path`  | Path to the SSL private key file                                                                                                                                                                            | `CDK_PLATFORM_HTTPS_KEY_PATH`  | false     | string  | ∅           |
| `enable_product_metrics`   | In order to improve Conduktor Console, we collect anonymous usage metrics. Set to `false`, this configuration disable all of our metrics collection.                                                        | `CDK_ENABLE_PRODUCT_METRICS`   | false     | boolean | `true`      |

### Database properties

See [database configuration](#) for details.

| Property                      | Description                                                                                                                                 | Environment variable             | Mandatory | Type   | Default |
|-------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------|-----------|--------|---------|
| `database.url`                | External PostgreSQL configuration URL in format `[jdbc:]postgresql://[user[:password]@][[netloc][:port],...][/dbname][?param1=value1&...] ` | `CDK_DATABASE_URL`               | false     | string | ∅       |
| `database.hosts[].host`       | External PostgreSQL servers hostname                                                                                                        | `CDK_DATABASE_HOSTS_0_HOST`      | false     | string | ∅       |
| `database.hosts[].port`       | External PostgreSQL servers port                                                                                                            | `CDK_DATABASE_HOSTS_0_PORT`      | false     | int    | ∅       |
| `database.host`               | External PostgreSQL server hostname (Deprecated, use `database.hosts` instead)                                                              | `CDK_DATABASE_HOST`              | false     | string | ∅       |
| `database.port`               | External PostgreSQL server port (Deprecated, use `database.hosts` instead)                                                                  | `CDK_DATABASE_PORT`              | false     | int    | ∅       |
| `database.name`               | External PostgreSQL database name                                                                                                           | `CDK_DATABASE_NAME`              | false     | string | ∅       |
| `database.username`           | External PostgreSQL login role                                                                                                              | `CDK_DATABASE_USERNAME`          | false     | string | ∅       |
| `database.password`           | External PostgreSQL login password                                                                                                          | `CDK_DATABASE_PASSWORD`          | false     | string | ∅       |
| `database.connection_timeout` | External PostgreSQL connection timeout in seconds                                                                                           | `CDK_DATABASE_CONNECTIONTIMEOUT` | false     | int    | ∅       |

### Session lifetime properties

| Property               | Description                                                                                           | Environment variable       | Mandatory | Type | Default value |
|------------------------|-------------------------------------------------------------------------------------------------------|----------------------------|-----------|------|---------------|
| `auth.sessionLifetime` | Max session lifetime in seconds                                                                       | `CDK_AUTH_SESSIONLIFETIME` | false     | int  | `259200`      |
| `auth.idleTimeout`     | Max idle session time in seconds (access token lifetime). Should be lower than `auth.sessionLifetime` | `CDK_AUTH_IDLETIMEOUT`     | false     | int  | `259200`      |

### Local users properties

Optional local account list used to log into Console.

| Property                      | Description   | Environment variable             | Mandatory | Type   | Default value          |
|-------------------------------|---------------|----------------------------------|-----------|--------|------------------------|
| `auth.local-users[].email`    | User login    | `CDK_AUTH_LOCALUSERS_0_EMAIL`    | true      | string | `"admin@conduktor.io"` |
| `auth.local-users[].password` | User password | `CDK_AUTH_LOCALUSERS_0_PASSWORD` | true      | string | `"admin"`              |

### Monitoring properties

To see monitoring graphs and use alerts, you have to ensure that [Cortex](/guides/conduktor-in-production/deploy-artifacts/cortex) is also deployed.

#### Monitoring Configuration for Console

First, we need to configure Console to connect to Cortex services. By default, Cortex ports are:

- Query port: 9009
- Alert manager port: 9010

| Property                                | Description                                                          | Environment variable                     | Mandatory | Type   | Default |
|-----------------------------------------|----------------------------------------------------------------------|------------------------------------------|-----------|--------|---------|
| `monitoring.cortex-url`                 | Cortex Search Query URL with port 9009                               | `CDK_MONITORING_CORTEXURL`               | true      | string | ∅       |
| `monitoring.alert-manager-url`          | Cortex Alert Manager URL with port 9010                              | `CDK_MONITORING_ALERTMANAGERURL`         | true      | string | ∅       |
| `monitoring.callback-url`               | Console API                                                          | `CDK_MONITORING_CALLBACKURL`             | true      | string | ∅       |
| `monitoring.notifications-callback-url` | Where the Slack notification should redirect                         | `CDK_MONITORING_NOTIFICATIONCALLBACKURL` | true      | string | ∅       |
| `monitoring.clusters-refresh-interval`  | Refresh rate in seconds for metrics                                  | `CDK_MONITORING_CLUSTERREFRESHINTERVAL`  | false     | int    | `60`    |
| `monitoring.use-aggregated-metrics`         | Defines whether use the new aggregated metrics in the Console graphs | `CDK_MONITORING_USEAGGREGATEDMETRICS`      | No        | Boolean | `false` |
| `monitoring.enable-non-aggregated-metrics`  | Toggles the collection of obsolete granular metrics                  | `CDK_MONITORING_ENABLENONAGGREGATEDMETRICS` | No        | Boolean | `true`  |

:::info
`monitoring.use-aggregated-metrics` and `monitoring.enable-non-aggregated-metrics` are temporary flags to help you transition to the new metrics collection system. They will be removed in a future release.

Swap their default value if you experience performance issues when Console is connected with large Kafka clusters:

```
CDK_MONITORING_USEAGGREGATEDMETRICS: true
CDK_MONITORING_ENABLENONAGGREGATEDMETRICS: false
```
:::

#### Monitoring configuration for Cortex

[See Cortex configuration for details](/platform/get-started/configuration/cortex/).

### SSO properties

[See authentication guide for snippets](/platform/category/configure-sso/).

| Property                         | Description                                                              | Environment variable                 | Mandatory | Type    | Default |
|----------------------------------|--------------------------------------------------------------------------|--------------------------------------|-----------|---------|---------|
| `sso.ignoreUntrustedCertificate` | Disable SSL checks                                                       | `CDK_SSO_IGNOREUNTRUSTEDCERTIFICATE` | false     | boolean | `false` |
| `sso.trustedCertificates`        | SSL public certificates for SSO authentication (LDAPS and OAuth2) as PEM | `CDK_SSO_TRUSTEDCERTIFICATES`        | false     | string  | ∅       |

#### LDAP properties

| Property                             | Description                                                                                                                                                                                        | Environment variable                   | Mandatory | Type         | Default              |
|--------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------|-----------|--------------|----------------------|
| `sso.ldap[].name`                    | Ldap connection name                                                                                                                                                                               | `CDK_SSO_LDAP_0_NAME`                  | true      | string       | ∅                    |
| `sso.ldap[].server`                  | Ldap server host and port                                                                                                                                                                          | `CDK_SSO_LDAP_0_SERVER`                | true      | string       | ∅                    |
| `sso.ldap[].managerDn`               | Sets the manager DN                                                                                                                                                                                | `CDK_SSO_LDAP_0_MANAGERDN`             | true      | string       | ∅                    |
| `sso.ldap[].managerPassword`         | Sets the manager password                                                                                                                                                                          | `CDK_SSO_LDAP_0_MANAGERPASSWORD`       | true      | string       | ∅                    |
| `sso.ldap[].search-subtree`          | Sets if the subtree should be searched.                                                                                                                                                            | `CDK_SSO_LDAP_0_SEARCHSUBTREE`         | false     | boolean      | `true`               |
| `sso.ldap[].search-base`             | Sets the base DN to search.                                                                                                                                                                        | `CDK_SSO_LDAP_0_SEARCHBASE`            | true      | string       | ∅                    |
| `sso.ldap[].search-filter`           | Sets the search filter. By default, the filter is set to `(uid={0})` for users using class type `InetOrgPerson`.                                                                                   | `CDK_SSO_LDAP_0_SEARCHFILTER`          | false     | string       | `"(uid={0})"`        |
| `sso.ldap[].search-attributes`       | Sets the attributes list to return. By default, all attributes are returned. Platform search for `uid`, `cn`, `mail`, `email`, `givenName`, `sn`, `displayName` attributes to map into user token. | `CDK_SSO_LDAP_0_SEARCHATTRIBUTES`      | false     | string array | `[]`                 |
| `sso.ldap[].groups-enabled`          | Sets if group search is enabled.                                                                                                                                                                   | `CDK_SSO_LDAP_0_GROUPSENABLED`         | false     | boolean      | `false`              |
| `sso.ldap[].groups-subtree`          | Sets if the subtree should be searched.                                                                                                                                                            | `CDK_SSO_LDAP_0_GROUPSSUBTREE`         | false     | boolean      | `true`               |
| `sso.ldap[].groups-base`             | Sets the base DN to search from.                                                                                                                                                                   | `CDK_SSO_LDAP_0_GROUPSBASE`            | true      | string       | ∅                    |
| `sso.ldap[].groups-filter`           | Sets the group search filter. If using group class type `GroupOfUniqueNames` use the filter `"uniqueMember={0}"`. For group class `GroupOfNames` use `"member={0}"`.                               | `CDK_SSO_LDAP_0_GROUPSFILTER`          | false     | string       | `"uniquemember={0}"` |
| `sso.ldap[].groups-filter-attribute` | Sets the name of the user attribute to bind to the group search filter. Defaults to the user’s DN.                                                                                                 | `CDK_SSO_LDAP_0_GROUPSFILTERATTRIBUTE` | false     | string       | ∅                    |
| `sso.ldap[].groups-attribute`        | Sets the group attribute name. Defaults to `cn`.                                                                                                                                                   | `CDK_SSO_LDAP_0_GROUPSATTRIBUTE`       | false     | string       | `"cn"`               |
| `sso.ldap[].properties`              | Additional properties that will be passed to identity provider context.                                                                                                                            | `CDK_SSO_LDAP_0_PROPERTIES`            | false     | dictionary   | ∅                    |

#### OAuth2 properties

| Property                                | Description                                                         | Environment variable                     | Mandatory | Type                                                                                                                                         | Default |
|-----------------------------------------|---------------------------------------------------------------------|------------------------------------------|-----------|----------------------------------------------------------------------------------------------------------------------------------------------|---------|
| `sso.oauth2[].name`                     | OAuth2 connection name                                              | `CDK_SSO_OAUTH2_0_NAME`                  | true      | string                                                                                                                                       | ∅       |
| `sso.oauth2[].default`                  | Use as default                                                      | `CDK_SSO_OAUTH2_0_DEFAULT`               | true      | boolean                                                                                                                                      | ∅       |
| `sso.oauth2[].client-id`                | OAuth2 client ID                                                    | `CDK_SSO_OAUTH2_0_CLIENTID`              | true      | string                                                                                                                                       | ∅       |
| `sso.oauth2[].client-secret`            | OAuth2 client secret                                                | `CDK_SSO_OAUTH2_0_CLIENTSECRET`          | true      | string                                                                                                                                       | ∅       |
| `sso.oauth2[].openid.issuer`            | Issuer to check on token                                            | `CDK_SSO_OAUTH2_0_OPENID_ISSUER`         | true      | string                                                                                                                                       | ∅       |
| `sso.oauth2[].scopes`                   | Scopes to be requested in the client credentials request            | `CDK_SSO_OAUTH2_0_SCOPES`                | true      | string                                                                                                                                       | `[]`    |
| `sso.oauth2[].groups-claim`             | Group attribute from your identity provider                         | `CDK_SSO_OAUTH2_0_GROUPSCLAIM`           | false     | string                                                                                                                                       | ∅       |
| `sso.oauth2[].username-claim`           | Email attribute from your identity provider                         | `CDK_SSO_OAUTH2_0_USERNAMECLAIM`         | false     | string                                                                                                                                       | `email` |
| `sso.oauth2[].allow-unsigned-id-tokens` | Allow unsigned ID tokens                                            | `CDK_SSO_OAUTH2_0_ALLOWUNSIGNEDIDTOKENS` | false     | boolean                                                                                                                                      | false   |
| `sso.oauth2[].preferred-jws-algorithm`  | Configure preferred JWS algorithm                                   | `CDK_SSO_OAUTH2_0_PREFERREDJWSALGORITHM` | false     | string one of: "HS256", "HS384", "HS512", "RS256", "RS384", "RS512", "ES256", "ES256K", "ES384", "ES512", "PS256", "PS384", "PS512", "EdDSA" | ∅       |
| `sso.oauth2-logout`                     | Wether the central identity provider logout should be called or not | `CDK_SSO_OAUTH2LOGOUT`                   | false     | boolean                                                                                                                                      | true    |

#### JWT auth properties

| Property                      | Description                                   | Environment variable            | Mandatory | Type   | Default  |
|-------------------------------|-----------------------------------------------|---------------------------------|-----------|--------|----------|
| `sso.jwt-auth.issuer`         | Issuer of your identity provider              | `CDK_SSO_JWTAUTH_ISSUER`        | true      | string | ∅        |
| `sso.jwt-auth.username-claim` | Email attribute from your identity provider   | `CDK_SSO_JWTAUTH_USERNAMECLAIM` | false     | string | `email`  |
| `sso.jwt-auth.groups-claim`   | Group attribute from your identity provider   | `CDK_SSO_JWTAUTH_GROUPSCLAIM`   | false     | string | `groups` |
| `sso.jwt-auth.api-key-claim`  | API key attribute from your identity provider | `CDK_SSO_JWTAUTH_APIKEYCLAIM`   | false     | string | `apikey` |

### Kafka cluster properties

:::warning
The new recommended way to configure clusters is through the CLI and YAML manifests. [Check KafkaCluster documentation for details](/platform/reference/resource-reference/console/#kafkacluster).
:::

For more information on configuring your Kafka clusters using GitOps processes, see [GitOps: Managing Cluster configurations](/platform/get-started/configuration/configuration-snippets/#gitops-managing-cluster-configurations).

You can find sample configurations on the [Configuration snippets](/platform/get-started/configuration/configuration-snippets/) page.

| Property                                | Description                                                    | Environment variable                        | Mandatory | Type                                     | Default |
|-----------------------------------------|----------------------------------------------------------------|---------------------------------------------|-----------|------------------------------------------|---------|
| `clusters[].id`                         | String used to uniquely identify your Kafka cluster            | `CDK_CLUSTERS_0_ID`                         | true      | string                                   | ∅       |
| `clusters[].name`                       | Alias or user-friendly name for your Kafka cluster             | `CDK_CLUSTERS_0_NAME`                       | true      | string                                   | ∅       |
| `clusters[].color`                      | Attach a color to associate with your cluster in the UI        | `CDK_CLUSTERS_0_COLOR`                      | false     | string in hexadecimal format (`#FFFFFF`) | random  |
| `clusters[].ignoreUntrustedCertificate` | Skip SSL certificate validation                                | `CDK_CLUSTERS_0_IGNOREUNTRUSTEDCERTIFICATE` | false     | boolean                                  | `false` |
| `clusters[].bootstrapServers`           | List of host:port for your Kafka brokers separated by coma `,` | `CDK_CLUSTERS_0_BOOTSTRAPSERVERS`           | true      | string                                   | ∅       |
| `clusters[].properties`                 | Any cluster configuration properties                           | `CDK_CLUSTERS_0_PROPERTIES`                 | false     | string where each line is a property     | ∅       |

### Kafka vendor specific properties

Note that you only need to set the [Kafka cluster properties](#kafka-clusters-properties) to use the core features of Console.

However, you can get additional benefits by setting the flavor of your cluster. This corresponds to the `Provider` tab of your cluster configuration in Console.

| Property                                        | Description                                                 | Environment variable                                | Mandatory | Type   | Default |
|-------------------------------------------------|-------------------------------------------------------------|-----------------------------------------------------|-----------|--------|---------|
| `clusters[].kafkaFlavor.type`                   | Kafka flavor type, one of `Confluent`, `Aiven`, `Gateway`   | `CDK_CLUSTERS_0_KAFKAFLAVOR_TYPE`                   | false     | string | ∅       |
| **Flavor is `Confluent`**                       | Manage Confluent Cloud service accounts, API keys, and ACLs |                                                     |           |        |         |
| `clusters[].kafkaFlavor.key`                    | Confluent Cloud API Key                                     | `CDK_CLUSTERS_0_KAFKAFLAVOR_KEY`                    | true      | string | ∅       |
| `clusters[].kafkaFlavor.secret`                 | Confluent Cloud API Secret                                  | `CDK_CLUSTERS_0_KAFKAFLAVOR_SECRET`                 | true      | string | ∅       |
| `clusters[].kafkaFlavor.confluentEnvironmentId` | Confluent Environment ID                                    | `CDK_CLUSTERS_0_KAFKAFLAVOR_CONFLUENTENVIRONMENTID` | true      | string | ∅       |
| `clusters[].kafkaFlavor.confluentClusterId`     | Confluent Cluster ID                                        | `CDK_CLUSTERS_0_KAFKAFLAVOR_CONFLUENTCLUSTERID`     | true      | string | ∅       |
| **Flavor is `Aiven`**                           | Manage Aiven service accounts and ACLs                      |                                                     |           |        |         |
| `clusters[].kafkaFlavor.apiToken`               | Aiven API token                                             | `CDK_CLUSTERS_0_KAFKAFLAVOR_APITOKEN`               | true      | string | ∅       |
| `clusters[].kafkaFlavor.project`                | Aiven project                                               | `CDK_CLUSTERS_0_KAFKAFLAVOR_PROJECT`                | true      | string | ∅       |
| `clusters[].kafkaFlavor.serviceName`            | Aiven service name                                          | `CDK_CLUSTERS_0_KAFKAFLAVOR_SERVICENAME`            | true      | string | ∅       |
| **Flavor is `Gateway`**                         | Manage Conduktor Gateway interceptors                       |                                                     |           |        |         |
| `clusters[].kafkaFlavor.url`                    | Gateway API endpoint URL                                    | `CDK_CLUSTERS_0_KAFKAFLAVOR_URL`                    | true      | string | ∅       |
| `clusters[].kafkaFlavor.user`                   | Gateway API username                                        | `CDK_CLUSTERS_0_KAFKAFLAVOR_USER`                   | true      | string | ∅       |
| `clusters[].kafkaFlavor.password`               | Gateway API password                                        | `CDK_CLUSTERS_0_KAFKAFLAVOR_PASSWORD`               | true      | string | ∅       |
| `clusters[].kafkaFlavor.virtualCluster`         | Gateway virtual cluster                                     | `CDK_CLUSTERS_0_KAFKAFLAVOR_VIRTUALCLUSTER`         | true      | string | ∅       |

### Schema registry properties

| Property                                               | Description                                  | Environment variable                                       | Mandatory | Type                                 | Default |
|--------------------------------------------------------|----------------------------------------------|------------------------------------------------------------|-----------|--------------------------------------|---------|
| `clusters[].schemaRegistry.url`                        | The schema registry URL                      | `CDK_CLUSTERS_0_SCHEMAREGISTRY_URL`                        | true      | string                               | ∅       |
| `clusters[].schemaRegistry.ignoreUntrustedCertificate` | Skip SSL certificate validation              | `CDK_CLUSTERS_0_SCHEMAREGISTRY_IGNOREUNTRUSTEDCERTIFICATE` | false     | boolean                              | `false` |
| `clusters[].schemaRegistry.properties`                 | Any schema registry configuration parameters | `CDK_CLUSTERS_0_SCHEMAREGISTRY_PROPERTIES`                 | false     | string where each line is a property | ∅       |
| **Basic Authentication**                               |                                              |                                                            |           |                                      |         |
| `clusters[].schemaRegistry.security.username`          | Basic auth username                          | `CDK_CLUSTERS_0_SCHEMAREGISTRY_SECURITY_USERNAME`          | false     | string                               | ∅       |
| `clusters[].schemaRegistry.security.password`          | Basic auth password                          | `CDK_CLUSTERS_0_SCHEMAREGISTRY_SECURITY_PASSWORD`          | false     | string                               | ∅       |
| **Bearer Token Authentication**                        |                                              |                                                            |           |                                      |         |
| `clusters[].schemaRegistry.security.token`             | Bearer auth token                            | `CDK_CLUSTERS_0_SCHEMAREGISTRY_SECURITY_TOKEN`             | false     | string                               | ∅       |
| **mTLS Authentication**                                |                                              |                                                            |           |                                      |         |
| `clusters[].schemaRegistry.security.key`               | Access Key                                   | `CDK_CLUSTERS_0_SCHEMAREGISTRY_SECURITY_KEY`               | false     | string                               | ∅       |
| `clusters[].schemaRegistry.security.certificateChain`  | Access certificate                           | `CDK_CLUSTERS_0_SCHEMAREGISTRY_SECURITY_CERTIFICATECHAIN`  | false     | string                               | ∅       |

#### Amazon Glue schema registry properties

| Property                                               | Description                                                                      | Environment variable                                       | Mandatory | Type   | Default |
|--------------------------------------------------------|----------------------------------------------------------------------------------|------------------------------------------------------------|-----------|--------|---------|
| `clusters[].schemaRegistry.region`                     | The Glue schema registry region                                                  | `CDK_CLUSTERS_0_SCHEMAREGISTRY_REGION`                     | true      | string | ∅       |
| `clusters[].schemaRegistry.registryName`               | The Glue schema registry name                                                    | `CDK_CLUSTERS_0_SCHEMAREGISTRY_REGISTRYNAME`               | false     | string | ∅       |
| `clusters[].schemaRegistry.amazonSecurity.type`        | Authentication with credentials, one of `Credentials`, `FromContext`, `FromRole` | `CDK_CLUSTERS_0_SCHEMAREGISTRY_AMAZONSECURITY_TYPE`        | true      | string | ∅       |
| **Credentials Security**                               |                                                                                  |                                                            |           |        |         |
| `clusters[].schemaRegistry.amazonSecurity.accessKeyId` | Credentials auth access key                                                      | `CDK_CLUSTERS_0_SCHEMAREGISTRY_AMAZONSECURITY_ACCESSKEYID` | true      | string | ∅       |
| `clusters[].schemaRegistry.amazonSecurity.secretKey`   | Credentials auth secret key                                                      | `CDK_CLUSTERS_0_SCHEMAREGISTRY_AMAZONSECURITY_SECRETKEY`   | true      | string | ∅       |
| **FromContext Security**                               |                                                                                  |                                                            |           |        |         |
| `clusters[].schemaRegistry.amazonSecurity.profile`     | Authentication profile                                                           | `CDK_CLUSTERS_0_SCHEMAREGISTRY_AMAZONSECURITY_PROFILE`     | false     | string | ∅       |
| **FromRole Security**                                  |                                                                                  |                                                            |           |        |         |
| `clusters[].schemaRegistry.amazonSecurity.role`        | Authentication role                                                              | `CDK_CLUSTERS_0_SCHEMAREGISTRY_AMAZONSECURITY_ROLE`        | true      | string | ∅       |

### Kafka Connect properties

| Property                                                | Description                                                     | Environment variable                                        | Mandatory | Type    | Default |
|---------------------------------------------------------|-----------------------------------------------------------------|-------------------------------------------------------------|-----------|---------|---------|
| `clusters[].kafkaConnects[].id`                         | String used to uniquely identify your Kafka Connect             | `CDK_CLUSTERS_0_KAFKACONNECTS_0_ID`                         | true      | string  | ∅       |
| `clusters[].kafkaConnects[].name`                       | Name your Kafka Connect                                         | `CDK_CLUSTERS_0_KAFKACONNECTS_0_NAME`                       | true      | string  | ∅       |
| `clusters[].kafkaConnects[].url`                        | The Kafka connect URL                                           | `CDK_CLUSTERS_0_KAFKACONNECTS_0_URL`                        | true      | string  | ∅       |
| `clusters[].kafkaConnects[].headers`                    | Optional additional headers (ie: `X-API-Token=123,X-From=Test`) | `CDK_CLUSTERS_0_KAFKACONNECTS_0_HEADERS`                    | false     | string  | ∅       |
| `clusters[].kafkaConnects[].ignoreUntrustedCertificate` | Skip SSL certificate validation                                 | `CDK_CLUSTERS_0_KAFKACONNECTS_0_IGNOREUNTRUSTEDCERTIFICATE` | false     | boolean | `false` |
| **Basic Authentication**                                |                                                                 |                                                             |           |         |         |
| `clusters[].kafkaConnects[].security.username`          | Basic auth username                                             | `CDK_CLUSTERS_0_KAFKACONNECTS_0_SECURITY_USERNAME`          | false     | string  | ∅       |
| `clusters[].kafkaConnects[].security.password`          | Basic auth password                                             | `CDK_CLUSTERS_0_KAFKACONNECTS_0_SECURITY_PASSWORD`          | false     | string  | ∅       |
| **Bearer Token Authentication**                         |                                                                 |                                                             |           |         |         |
| `clusters[].kafkaConnects[].security.token`             | Bearer token                                                    | `CDK_CLUSTERS_0_KAFKACONNECTS_0_SECURITY_TOKEN`             | false     | string  | ∅       |
| **mTLS Authentication**                                 |                                                                 |                                                             |           |         |         |
| `clusters[].kafkaConnects[].security.key`               | Access key                                                      | `CDK_CLUSTERS_0_KAFKACONNECTS_0_SECURITY_KEY`               | false     | string  | ∅       |
| `clusters[].kafkaConnects[].security.certificateChain`  | Access certificate                                              | `CDK_CLUSTERS_0_KAFKACONNECTS_0_SECURITY_CERTIFICATECHAIN`  | false     | string  | ∅       |

### ksqlDB properties

We support ksqlDB integration as of Conduktor Console v1.21.0.

| Property                                          | Description                                          | Environment variable                                  | Mandatory | Type    | Default |
|---------------------------------------------------|------------------------------------------------------|-------------------------------------------------------|-----------|---------|---------|
| `clusters[].ksqlDBs[].id`                         | String used to uniquely identify your ksqlDB Cluster | `CDK_CLUSTERS_0_KSQLDBS_0_ID`                         | true      | string  | ∅       |
| `clusters[].ksqlDBs[].name`                       | Name of your ksqlDB Cluster                          | `CDK_CLUSTERS_0_KSQLDBS_0_NAME`                       | true      | string  | ∅       |
| `clusters[].ksqlDBs[].url`                        | The ksqlDB API URL                                   | `CDK_CLUSTERS_0_KSQLDBS_0_URL`                        | true      | string  | ∅       |
| `clusters[].ksqlDBs[].ignoreUntrustedCertificate` | Skip SSL certificate validation                      | `CDK_CLUSTERS_0_KSQLDBS_0_IGNOREUNTRUSTEDCERTIFICATE` | false     | boolean | `false` |
| **Basic Authentication**                          |                                                      |                                                       |           |         |         |
| `clusters[].ksqlDBs[].security.username`          | Basic auth username                                  | `CDK_CLUSTERS_0_KSQLDBS_0_SECURITY_USERNAME`          | false     | string  | ∅       |
| `clusters[].ksqlDBs[].security.password`          | Basic auth password                                  | `CDK_CLUSTERS_0_KSQLDBS_0_SECURITY_PASSWORD`          | false     | string  | ∅       |
| **Bearer Token Authentication**                   |                                                      |                                                       |           |         |         |
| `clusters[].ksqlDBs[].security.token`             | Bearer token                                         | `CDK_CLUSTERS_0_KSQLDBS_0_SECURITY_TOKEN`             | false     | string  | ∅       |
| **mTLS Authentication**                           |                                                      |                                                       |           |         |         |
| `clusters[].ksqlDBs[].security.key`               | Access key                                           | `CDK_CLUSTERS_0_KSQLDBS_0_SECURITY_KEY`               | false     | string  | ∅       |
| `clusters[].ksqlDBs[].security.certificateChain`  | Access certificate                                   | `CDK_CLUSTERS_0_KSQLDBS_0_SECURITY_CERTIFICATECHAIN`  | false     | string  | ∅       |

### Indexer properties

The [indexer](/platform/navigation/console/about-indexing/) is the internal process of Conduktor Console that fetches metadata from your Kafka cluster (e.g. topics, consumer groups, subjects).
You should modify these parameters only if you see an issue with the performance of the indexer.

| Property                                             | Description                                                                                                                                   | Environment variable                               | Mandatory | Type | Default           |
|------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------|-----------|------|-------------------|
| **Lag exporter**                                     |                                                                                                                                               |                                                    |           |      |                   |
| `lagexporter.frequency`                              | Frequency in seconds of the execution of the lag exporter                                                                                     | `CDK_LAGEXPORTER_FREQUENCY`                        | false     | int  | `30`              |
| `lagexporter.clusterparallelism`                     | Number of clusters indexed in parallel for the lag exporter                                                                                   | `CDK_LAGEXPORTER_CLUSTERPARALLELISM`               | false     | int  | `1`               |
| `lagexporter.indexertimeout`                         | Lag exporter timeout in seconds                                                                                                               | `CDK_LAGEXPORTER_INDEXERTIMEOUT`                   | false     | int  | `300` (5 minutes) |
| **Metadata indexer**                                 |                                                                                                                                               |                                                    |           |      |                   |
| `metadataindexer.frequency`                          | Frequency in seconds of the execution of the metadata indexer                                                                                 | `CDK_METADATAINDEXER_FREQUENCY`                    | false     | int  | `30`              |
| `metadataindexer.clusterparallelism`                 | Number of clusters indexed in parallel for the metadata indexer                                                                               | `CDK_METADATAINDEXER_CLUSTERPARALLELISM`           | false     | int  | `1`               |
| `metadataindexer.indexertimeout`                     | Metadata indexer timeout in seconds                                                                                                           | `CDK_METADATAINDEXER_INDEXERTIMEOUT`               | false     | int  | `300` (5 minutes) |
| **Monitoring indexer**                               |                                                                                                                                               |                                                    |           |      |                   |
| `monitoringconfig.frequency`                         | Frequency in seconds of the execution of the monitoring indexer                                                                               | `CDK_MONITORINGCONFIG_FREQUENCY`                   | false     | int  | `30`              |
| `monitoringconfig.clusterparallelism`                | Number of clusters indexed in parallel for the monitoring indexer                                                                             | `CDK_MONITORINGCONFIG_CLUSTERPARALLELISM`          | false     | int  | `1`               |
| `monitoringconfig.indexertimeout`                    | Monitoring indexer timeout in seconds                                                                                                         | `CDK_MONITORINGCONFIG_INDEXERTIMEOUT`              | false     | int  | `300` (5 minutes) |
| **Schema registry indexer**                          |                                                                                                                                               |                                                    |           |      |                   |
| `registryindexer.frequency`                          | Frequency in seconds of the execution of the schema registry indexer                                                                          | `CDK_REGISTRYINDEXER_FREQUENCY`                    | false     | int  | `30`              |
| `registryindexer.clusterparallelism`                 | Number of clusters indexed in parallel for the schema registry indexer                                                                        | `CDK_REGISTRYINDEXER_CLUSTERPARALLELISM`           | false     | int  | `1`               |
| `registryindexer.indexertimeout`                     | Schema registry indexer timeout in seconds                                                                                                    | `CDK_REGISTRYINDEXER_INDEXERTIMEOUT`               | false     | int  | `300` (5 minutes) |
| **Kafka connect indexer**                            |                                                                                                                                               |                                                    |           |      |                   |
| `connectindexer.frequency`                           | Frequency in seconds of the execution of the kafka connect indexer                                                                            | `CDK_CONNECTINDEXER_FREQUENCY`                     | false     | int  | `30`              |
| `connectindexer.clusterparallelism`                  | Number of clusters indexed in parallel for the kafka connect indexer                                                                          | `CDK_CONNECTINDEXER_CLUSTERPARALLELISM`            | false     | int  | `1`               |
| `connectindexer.indexertimeout`                      | Kafka connect indexer timeout in seconds                                                                                                      | `CDK_CONNECTINDEXER_INDEXERTIMEOUT`                | false     | int  | `300` (5 minutes) |
| **Kafka admin client configuration**                 |                                                                                                                                               |                                                    |           |      |                   |
| `kafka_admin.list_consumer_group_offsets_batch_size` | How many consumer groups offset to fetch in a single query. Old versions of Kafka may time out when fetching too many offsets at once.        | `CDK_KAFKAADMIN_LISTCONSUMERGROUPOFFSETSBATCHSIZE` | false     | int  | `100`             |
| `kafka_admin.batch_parallel_size`                    | Maximum of batched requests that can be sent in parallel                                                                                      | `CDK_KAFKAADMIN_BATCHPARALLELSIZE`                 | false     | int  | `5`               |
| `kafka_admin.record_size_limit`                      | Maximum size in bytes of a single message to display in the consume page. For larger messages, you'll get a link to open in a dedicated page. | `CDK_KAFKAADMIN_RECORDSIZELIMIT`                   | false     | int  | `102400` (bytes)  |

### AuditLog export properties

The audit log can be exported to a Kafka topic, once configured in Console.
For details on the available exportable events refer to: [Exportable audit log events](docs/platform/navigation/settings/audit-log.md#exportable-audit-log-events).

| Property                                            | Description                                           | Environment variable                                  | Mandatory | Type   | Default |
|-----------------------------------------------------|-------------------------------------------------------|-------------------------------------------------------|-----------|--------|---------|
| `audit_log_publisher.cluster`                       | The cluster ID where the audit logs will be exported  | `CDK_AUDITLOGPUBLISHER_CLUSTER`                       | false     | string | ∅       |
| `audit_log_publisher.topicName`                     | The topic name where the audit logs will be exported  | `CDK_AUDITLOGPUBLISHER_TOPICNAME`                     | false     | string | ∅       |
| `audit_log_publisher.topicConfig.partition`         | The number of partitions for the audit log topic      | `CDK_AUDITLOGPUBLISHER_TOPICCONFIG_PARTITION`         | false     | int    | `1`     |
| `audit_log_publisher.topicConfig.replicationFactor` | The replication factor for the audit log topic        | `CDK_AUDITLOGPUBLISHER_TOPICCONFIG_REPLICATIONFACTOR` | false     | int    | `1`     |

### Conduktor SQL properties

In order to use Conduktor SQL, you need to configure a second database to store the topics data.  

You can configure Conduktor SQL Database using `CDK_KAFKASQL_DATABASE_URL` or set each value individually with `CDK_KAFKASQL_DATABASE_*`.

[Configure SQL to get started](/guides/tutorials/configure-sql).

| Property                                             | Description                                                                                                                           | Environment variable                               | Mandatory | Type   | Default        |
|------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------|-----------|--------|----------------|
| `kafka_sql.database.url`                             | External PostgreSQL configuration URL in format `[jdbc:]postgresql://[user[:password]@][[netloc][:port],...][/dbname][?param1=value1&...] ` | `CDK_KAFKASQL_DATABASE_URL`                        | false     | string | ∅               |
| `kafka_sql.database.hosts[].host`                    | External PostgreSQL servers hostname                                                                                                        | `CDK_KAFKASQL_DATABASE_HOSTS_0_HOST`               | false     | string | ∅               |
| `kafka_sql.database.hosts[].port`                    | External PostgreSQL servers port                                                                                                            | `CDK_KAFKASQL_DATABASE_HOSTS_0_PORT`               | false     | int    | ∅               |
| `kafka_sql.database.host`                            | External PostgreSQL server hostname (Deprecated, use `kafka_sql.database.hosts` instead)                                                    | `CDK_KAFKASQL_DATABASE_HOST`                       | false     | string | ∅               |
| `kafka_sql.database.port`                            | External PostgreSQL server port (Deprecated, use `kafka_sql.database.hosts` instead)                                                        | `CDK_KAFKASQL_DATABASE_PORT`                       | false     | int    | ∅               |
| `kafka_sql.database.name`                            | External PostgreSQL database name                                                                                                           | `CDK_KAFKASQL_DATABASE_NAME`                       | false     | string | ∅               |
| `kafka_sql.database.username`                        | External PostgreSQL login role                                                                                                              | `CDK_KAFKASQL_DATABASE_USERNAME`                   | false     | string | ∅               |
| `kafka_sql.database.password`                        | External PostgreSQL login password                                                                                                          | `CDK_KAFKASQL_DATABASE_PASSWORD`                   | false     | string | ∅               |
| `kafka_sql.database.connection_timeout`              | External PostgreSQL connection timeout in seconds                                                                                           | `CDK_KAFKASQL_DATABASE_CONNECTIONTIMEOUT`          | false     | int    | ∅               |

Advanced properties:

| Property                                             | Description                                                                                                                           | Environment variable                               | Mandatory | Type   | Default        |
|------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------|-----------|--------|----------------|
| `kafka_sql.commit_offset_every_in_sec`               | Frequency at which Conduktor SQL commits offsets into Kafka and flushes rows in the database                                          | `CDK_KAFKASQL_COMMITOFFSETEVERYINSEC`              | false     | int    | `30` (seconds) |
| `kafka_sql.clean_expired_record_every_in_hour`       | How often to check for expired records and delete them from the database                                                              | `CDK_KAFKASQL_CLEANEXPIREDRECORDEVERYINHOUR`  | false     | int    | `1` (hour)     |
| `kafka_sql.refresh_topic_configuration_every_in_sec` | Frequency at which Conduktor SQL looks for new topics to start indexing or stop indexing                                              | `CDK_KAFKASQL_REFRESHTOPICCONFIGURATIONEVERYINSEC` | false     | int    | `30` (seconds) |
| `kafka_sql.consumer_group_id`                        | Consumer group used to identify Conduktor SQL                                                                                         | `CDK_KAFKASQL_CONSUMER-GROUP-ID`                   | false     | string    | `conduktor-sql`  |
| `kafka_sql.refresh_user_permissions_every_in_sec`    | Frequency at which Conduktor SQL refreshes the role permissions in the DB to match the RBAC setup in Console                          | `CDK_KAFKASQL_REFRESHUSERPERMISSIONSEVERYINSEC`                   | false     | string    | `conduktor-sql`  |

### Partner Zones properties

Advanced configuration for [Partner Zones](/guides/conduktor-concepts/partner-zones).

| Property                                            | Description                                                                                                                                                                                                                                                     | Environment variable                             | Mandatory | Type   | Default       |
|-----------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------|-----------|--------|---------------|
| `partner_zone.reconcile-with-gateway-every-seconds` | The interval at which Partner Zone's state (that's stored on Console) is synchronized with Gateway. A lower value results in faster alignment between the required state and the current state on the Gateway. | CDK_PARTNERZONE_RECONCILEWITHGATEWAYEVERYSECONDS | false     | int    | `5` (seconds) |
