---
title: Interceptors
description: Learn Conduktor terminology
---

import Label from '@site/src/components/Labels';
import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

Conduktor <GlossaryTerm>Gateway</GlossaryTerm> offers a number of powerful Interceptors that enhance your Kafka usage. For example, you can use them to:

- perform full-body or field-level encryption and decryption
- reject (during produce) or skip (during consume) records that don't match specified data quality rules
- enforce producer configurations such as acks or compression
- override or enforce configurations during a *CreateTopic* request, such as a replication factor or naming convention

## Configure and use

To deploy an Interceptor, you need to prepare its configuration. Here's an example for an interceptor that will **block the creation of topics with more than six partitions**:

<Tabs>
<TabItem  value="CLI" label="CLI">

  ````json
  curl \
    --request PUT \
    --url 'http://localhost:8888/gateway/v2/interceptor' \
    --header 'Authorization: Basic YWRtaW46Y29uZHVrdG9y' \
    --header 'Content-Type: application/json' \
    --data-raw '{
    "kind" : "Interceptor",
    "apiVersion" : "gateway/v2",
    "metadata" : {
      "name" : "less-than-6-partitions"
    },
    "spec" : {
      "pluginClass": "io.conduktor.gateway.interceptor.safeguard.CreateTopicPolicyPlugin",
      "priority": 100,
      "config": {
        "topic": ".*",
        "numPartition": {
          "min": 1,
          "max": 6,
          "action": "BLOCK"
        }
      }
    }
  }'
  ````

</TabItem>

<TabItem  value="API" label="API">


````json
POST /admin/interceptors/v1/interceptor/enforce-partition-limit
{
  "pluginClass": "io.conduktor.gateway.interceptor.safeguard.CreateTopicPolicyPlugin",
  "priority": 100,
  "config": {
    "topic": ".*",
    "numPartition": {
      "min": 1,
      "max": 6,
      "action": "BLOCK"
    }
}
}
````

</TabItem>
</Tabs>

Interceptors also combine with each other to create very powerful interactions and solve many interesting use-cases in different ways.

One option is to [chain](#chain-interceptors) them together, so that each Interceptor performs its action sequentially and independently, then passes the result to the next Interceptor to action.

The order of execution is determined by the **priority** of each Interceptor. Lower numbers gets executed first.

 ```mermaid
flowchart LR
    A[User App]
    subgraph G [Gateway]
        direction LR
        Auth[Authentication & </br> Authorization]
        subgraph I [Dynamic interceptor pipeline]
            direction LR
            I1(Plugin </br> priority: 1 </br> interceptor)
            I2(Plugin </br> priority: 10 </br> interceptor1 & interceptor2)
            I3(Plugin </br> priority: 42 </br> interceptor)
            I1 <--> I2 <--> I3
        end
        subgraph Core [Core features]
            direction TB
            LT(Logical Topics)
            VC(Virtual clusters)
        end
        Auth <--> I
    end
    subgraph K [Main Kafka cluster]
    B1(broker 1)
    B2(broker 2)
    B3(broker 3)
    B1 === B2 === B3
    end
    A --> Auth
    I <--> Core
    Core <--> K
```

More advanced behaviors can also be configured such as [Scoping](#interceptor-scope) and **Overriding**. They are presented in the detailed Interceptor Concepts page.

### Chain Interceptors

Interceptors can be chained, allowing you to create powerful interactions for various scenarios.

Each Interceptor can have a distinct purpose that's unrelated to other Interceptors in the chain. Interceptors are executed in order of priority, starting with the lowest number. Interceptor actions are performed **sequentially and independently**, passing the results from one to the next one in the chain.

:::info[Chaining caveat]
The order of execution is calculated **after scoping and overriding**. For example, an overridden Interceptor can have a different priority from its parent.
:::

### Interceptor scope

Interceptor scoping lets you **define affected Kafka clients** (ultimately resolved as service accounts).

There are four targeting scopes:

- Global
- VirtualCluster
- Group
- ServiceAccount  

[See resource reference details](/gateway/reference/resources-reference/#interceptor-targeting).

Example:

````json
// This interceptor only applies to service account 'sa-clickstream'
curl \
  --request PUT \
  --url 'http://localhost:8888/gateway/v2/interceptor' \
  --header 'Authorization: Basic YWRtaW46Y29uZHVrdG9y' \
  --header 'Content-Type: application/json' \
  --data-raw '{
  "kind" : "Interceptor",
  "apiVersion" : "gateway/v2",
  "metadata" : {
    "name" : "less-than-6-partitions",
    "scope": {
      "username": "sa-clickstream"
    }
  },
  "spec" : {
    "pluginClass": "io.conduktor.gateway.interceptor.safeguard.CreateTopicPolicyPlugin",
    "priority": 100,
    "config": {
      "topic": ".*",
      "numPartition": {
        "min": 1,
        "max": 6,
        "action": "BLOCK"
      }
    }
  }
}'
````

### Overriding

Interceptor overriding lets you change the behavior of an Interceptor by **redeploying it with the same name but under a different scope**. This will effectively override the lower precedence Interceptors.

The order of precedence from highest (overrides all others) to lowest (easiest to override) is:

1. ServiceAccount
1. Group
1. VirtualCluster
1. Global

:::info[Overriding caveat]
In the two JSON examples above, both Interceptors have the same name (`enforce-partition-limit`) but two different scopes: the first one is global, the second one is targeting user `sa-clickstream`. These Interceptors aren't chained but the second one is overriding the first one. The `sa-clickstream` service account will be allowed to create topics with 1 to 20 partitions, while other service accounts will be limited to six. If these Interceptors had different names, they would be chained, so the first one would enforce the restriction to 6 partitions.
:::

### Interceptor interaction example

Here's an example combining Interceptors **chaining**, **scoping** and **overriding**:

- `interceptor-C` is deployed only for Alice (scoping)
- `interceptor-D` is deployed globally (scoping) but also deployed specifically for Bob (overriding)
- `interceptor-A` and `interceptor-B` are deployed globally (scoping)
- the priorities (`01`, `40`, `45` and `50`) are then considered for the final execution order (chaining)
(img/interceptor-example.png)

When you need Interceptors to apply conditionally, targeting by Service Account is the most straightforward way.

## Deploy Interceptor

**API key(s):** <Label type="AdminToken" />
**Managed with:** <Label type="API" /> <Label type="CLI" /> <Label type="UI" />

Deploys an Interceptor on the Gateway
````yaml
---
apiVersion: gateway/v2
kind: Interceptor
metadata:
  name: enforce-partition-limit
  # scope:
  #   vCluster: aaa
  #   group: bbb
  #   username: ccc
spec:
  pluginClass: "io.conduktor.gateway.interceptor.safeguard.CreateTopicPolicyPlugin"
  priority: 100
  config:
    topic: "myprefix-.*"
    numPartition:
      min: 5
      max: 5
      action: "INFO"
````

**Interceptor checks:**

- `metadata.scope` is optional (default empty). 
- `metadata.scope.[vCluster | group | username]` combine with each other to define the targeting
  - Check the dedicated [Interceptor Targeting](#interceptor-targeting) section
- `spec.pluginClass` is **mandatory**. Must be a valid Interceptor class name from our [available Interceptors](/gateway/category/interceptor-catalog/)
- `spec.priority` is **mandatory**
- `spec.config` is a valid config for the `pluginClass`

### Interceptor targeting

You can activate your Interceptor only in specific scenarios. Use the table below to configure Targeting settings.

| Use case                                            | `metadata.scope.vcluster` | `metadata.scope.group` | `metadata.scope.username` |
|-----------------------------------------------------|---------------------------|------------------------|---------------------------|
| Global Interceptor (Including Virtual Clusters)     | Set to `null`             | Set to `null`          | Set to `null`             |
| Global Interceptor (**Excluding** Virtual Clusters) | Empty                     | Empty                  | Empty                     |
| Username Targeting                                  | Empty                     | Empty                  | Set                       |
| Group Targeting                                     | Empty                     | Set                    | Empty                     |
| Virtual Cluster Targeting                           | Set                       | Empty                  | Empty                     |
| Virtual Cluster + Username Targeting                | Set                       | Empty                  | Set                       |
| Virtual Cluster + Group Targeting                   | Set                       | Set                    | Empty                     |

You can deploy multiple interceptors with the same name using a different targeting scope. This will effectively [override](../concepts/interceptors.md#overriding) the configuration for the scope.

:::info
The order of precedence from highest (overrides all others) to lowest (most easily overridden) is:

- ServiceAccount
- Group
- VirtualCluster
- Global

:::

**Examples**

````yaml
---
# This interceptor targets everyone (Including Virtual Clusters)
apiVersion: gateway/v2
kind: Interceptor
metadata:
  name: enforce-partition-limit
  scope:
    vCluster: null
    group: null
    username: null
spec:

---
# This interceptor targets everyone (Excluding Virtual Clusters)
apiVersion: gateway/v2
kind: Interceptor
metadata:
  name: enforce-partition-limit
spec:

---
# This interceptor targets only `admin` service account
apiVersion: gateway/v2
kind: Interceptor
metadata:
  name: enforce-partition-limit
  scope:
    username: admin
spec:
  
---
# This interceptor targets only `read-only` virtual cluster
apiVersion: gateway/v2
kind: Interceptor
metadata:
  name: enforce-partition-limit
  scope:
    vCluster: read-only
spec:
  

````

## GatewayServiceAccount

GatewayServiceAccount is generally optional when using Oauth, mTLS or Delegated Backing Kafka authentication.  

GatewayServiceAccount resource is enabled or not depending on your Gateway configuration. This is to prevent you to declare a resource that is incompatible with your current configuration:

| GATEWAY_SECURITY         | LOCAL GatewayServiceAccount | EXTERNAL GatewayServiceAccount        |
|--------------------------|--|--------------------------|
| PLAINTEXT                | 🚫 | 🚫                       |
| SSL                      | 🚫 | only if mTls             |
| SASL_PLAINTEXT           | ✅ | only if OAuth configured |
| SASL_SSL                 | ✅ | only if OAuth configured |
| DELEGATED_SASL_PLAINTEXT | 🚫 | ✅                        |
| DELEGATED_SASL_SSL       | 🚫 | ✅                        |

There are a few cases where you **must** declare GatewayServiceAccount objects:

- Creating Local Service Accounts
- Renaming Service Accounts for easier clarity when using Interceptors
- Attaching Service Accounts to Virtual Clusters

````yaml
---
# External User renamed
apiVersion: gateway/v2
kind: GatewayServiceAccount
metadata:
  name: application1
spec:
  type: EXTERNAL
  externalNames: 
  - 00u9vme99nxudvxZA0h7
---
# Local User on Virtual Cluster vc-B
apiVersion: gateway/v2
kind: GatewayServiceAccount
metadata:
  vCluster: vc-B
  name: admin
spec:
  type: LOCAL
````

**GatewayServiceAccount checks:**

- When `spec.type` is `EXTERNAL`:
  - `spec.externalNames` must be a non-empty list of external names. Each name must be unique across all declared GatewayServiceAccount.
  - **At the moment** we only support a list of one element. Support for multiple externalNames will be added in the future.

**GatewayServiceAccount side effects:**

- When `spec.type` is `EXTERNAL`:
  - During Client connection, the authenticated user will be checked against the list of `externalNames` to decide which GatewayServiceAccount it is.
- When `spec.type` is `LOCAL`:
  - Access to `/gateway/v2/tokens` endpoint to generate a password for this Service Account
  - Switching a GatewayServiceAccount `spec.type` from `LOCAL` to `EXTERNAL` does not invalidate previously emitted tokens. They will keep on working for their TTL.

## GatewayGroup

Gateway Group lets you add multiple users in the same GatewayGroup for easier Interceptor targeting capabilities.

````yaml
---
# Users added to the group manually
apiVersion: gateway/v2
kind: GatewayGroup
metadata:
  name: group-a
spec:
  members:
    - name: admin
    - vCluster: vc-B
      name: "0000-AAAA-BBBB-CCCC"
````

**GatewayGroup checks:**

- `spec.members[].name` is mandatory.
  - Currently, the username needs to refer to an existing GatewayServiceAccount otherwise it will fail. This is a known issue that we'll address in a further release.
- `spec.members[].vCluster` is optional. Must refer to an existing Virtual Cluster. When not using Virtual Clusters, don't set this attribute.

**GatewayGroup side effects:**

- All members of the group will be affected by Interceptors deployed with this group's scope.

## ConcentrationRule

Concentration Rules allow you to define patterns where topic creation won't generate a physical topic, but will instead use our Topic Concentration feature.

````yaml
---
apiVersion: gateway/v2
kind: ConcentrationRule
metadata:
  # vCluster: vc-B
  name: toutdanstiti
spec:
  pattern: titi-.*
  physicalTopics:
    delete: titi-delete
    compact: titi-compact
    deleteCompact: titi-cd
  autoManaged: false
  offsetCorrectness: false
````

**ConcentrationRule checks:**
- `metadata.vCluster` is optional. Must refer to an existing Virtual Cluster. When not using Virtual Clusters, don't set this attribute.
- `spec.physicalTopics.delete` is mandatory. Must be a valid topic name with a `cleanup.policy` set to `delete`
- `spec.physicalTopics.compact` is optional. Must be a valid topic name with a `cleanup.policy` set to `compact`
- `spec.physicalTopics.deleteCompact` is optional. Must be a valid topic name with a `cleanup.policy` set to `delete,compact`
- `spec.autoManaged` is optional, default `false`
- `spec.offsetCorrectness` is optional, default `false`

**ConcentrationRule side effects:**
- Once the Concentration Rule is deployed, topics created with a name matching the `spec.pattern` will not be created as real Kafka topics but as Concentrated Topics instead.  
- Depending on the topic's `cleanup.policy`, the topic's data will be stored in one of the configured physical topics.
- If a topic creation request is made with a `cleanup.policy` that isn't configured in the ConcentrationRule, topic creation will fail.
- It is not possible to update `cleanup.policy` of a concentrated topic.
- If `spec.autoManaged` is set to `true`, the underlying physical topics and configurations will be automatically created and/or extended to honour the topics configurations.
- If `spec.offsetCorrectness` is set to `true`, Gateway will maintain a list of offsets for each of the Concentrated Topic records. 
  - This allows for a proper calculation of Message Count and Consumer Group Lag.
  - There are some limitation. Read more about [Offset Correctness here](/gateway/concepts/logical-topics/concentrated-topics/#known-issues-and-limitations-with-offset-correctness)
- If `spec.offsetCorrectness` is set to `false`, Gateway will report the offsets of the backing topic records.

:::warning
If a ConcentrationRule spec changes, it will not affect previously created concentrated topics, it will only affect the topics created after the change.
:::

## Audit Interceptor

This <GlossaryTerm>Interceptor</GlossaryTerm> logs information from API key requests. To use it, inject it and implement `ApiKeyAuditLog` interface for audit.

The currently supported Kafka API requests are:

- ProduceRequest (PRODUCE)
- FetchRequest (FETCH)
- CreateTopicRequest (CREATE_TOPICS)
- DeleteTopicRequest (DELETE_TOPICS)
- AlterConfigRequest (ALTER_CONFIGS)

### Configure

| Name            | Type         | Default | Description                                                             |
|:----------------|:-------------|:--------|:------------------------------------------------------------------------|
| topic           | String       | `.*`    | Topics that match this regex will have the Interceptor applied          |
| apiKeys         | Set[string]  |         | Set of Kafka API keys to be audited                                     |
| vcluster        | String       | `.*`    | vcluster that matches this regex will have the Interceptor applied        |
| username        | String       | `.*`    | username that matches this regex will have the Interceptor applied        |
| consumerGroupId | String       | `.*`    | consumerGroupId that matches this regex will have the Interceptor applied |
| topicPartitions | Set[Integer] |         | Set of topic partitions to be audited                                   |

### Example

```json
{
  "name": "myAuditInterceptorPlugin",
  "pluginClass": "io.conduktor.gateway.interceptor.AuditPlugin",
  "priority": 100,
  "config": {
    "topic": ".*",
    "apiKeys": [
      "PRODUCE",
      "FETCH"
    ],
    "vcluster": ".*",
    "username": ".*",
    "consumerGroupId": ".*",
    "topicPartitions": [
      1,
      2
    ]
  }
}
```



## Data masking Interceptor

Field level data masking <GlossaryTerm>Interceptor</GlossaryTerm> masks sensitive fields within messages as they are consumed.

### Configuration

Policies will be actioned and applied when consuming messages.

| Key      | Type                    | Default | Description                                                    |
|:---------|:------------------------|:--------|:---------------------------------------------------------------|
| topic    | String                  | `.*`    | Topics that match this regex will have the Interceptor applied |
| policies | List[[Policy](#policy)] |         | List of your masking policies                                  |

### Policy

| Key                  |Type                               | Description                                                                                                                                                                                    |
|:---------------------|:-----------------------------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Name                 | String                             | Unique name for identifying your policy                                                                                                                                                        |                                                                                                    
| Fields               | List                               | List of fields that should be obfuscated with the masking rule. Fields can be nested structure with dot `.` such as `education.account.username`, `banks[0].accountNo` or `banks[*].accountNo` |
| rule                 | [Rule](#rule)                      | Rule                                                                                                                                                                                           |
| schemaRegistryConfig | [SchemaRegistry](#schema-registry) | Schema registry                                                                                                                                                                                | 

### Rule

| Key           | Type                          | Default    | Description                                                 |
|:--------------|:------------------------------|:-----------|:------------------------------------------------------------|
| type          | [Masking Type](#masking-type) | `MASK_ALL` | Masking type                                                |
| maskingChar   | char                          | `*`        | Character that the data masked                              |
| numberOfChars | number                        |            | number of masked characters, required if `type != MASK_ALL` |

### Masking type

- `MASK_ALL`: data will be masked,
- `MASK_FIRST_N`: The first `n` characters will be masked
- `MASK_LAST_N`: The last `n` characters will be masked

### Schema registry

| Key                   | Type   | Default     | Description                                                                                                                                                                                                         |
|-----------------------|--------|-------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `type`                | string | `CONFLUENT` | The type of schema registry to use: choose `CONFLUENT` (for Confluent-like schema registries including OSS Kafka) or `AWS` for AWS Glue schema registries.                                                      |
| `additionalConfigs`   | map    |             | Additional properties maps to specific security-related parameters. For enhanced security, you can hide the sensitive values using [environment variables as secrets](#use-environment-variables-as-secrets).​ |
| **Confluent Like**    |        |             | **Configuration for Confluent-like schema registries**                                                                                                                                                              |
| `host`                | string |             | URL of your schema registry.                                                                                                                                                                                        |
| `cacheSize`           | string | `50`        | Number of schemas that can be cached locally by this interceptor so that it doesn't have to query the schema registry every time.                                                                                   |
| **AWS Glue**          |        |             | **Configuration for AWS Glue schema registries**                                                                                                                                                                    |
| `region`              | string |             | The AWS region for the schema registry, e.g. `us-east-1`                                                                                                                                                            |
| `registryName`        | string |             | The name of the schema registry in AWS (leave blank for the AWS default of `default-registry`)                                                                                                                      |
| `basicCredentials`    | string |             | Access credentials for AWS (see below section for structure)                                                                                                                                                        |
| **AWS Credentials**   |        |             | **AWS Credentials Configuration**                                                                                                                                                                                   |
| `accessKey`           | string |             | The access key for the connection to the schema registry.                                                                                                                                                           |
| `secretKey`           | string |             | The secret key for the connection to the schema registry.                                                                                                                                                           |
| `validateCredentials` | bool   | `true`      | `true` / `false` flag to determine whether the credentials provided should be validated when set.                                                                                                                   |
| `accountId`           | string |             | The Id for the AWS account to use.                                                                                                                                                                                  |

:::warning[Missing credentials]
If you don't supply a `basicCredentials` section for the AWS Glue schema registry, the client used to connect will instead attempt to find the connection information is needs from the environment and the credentials required can be passed this way to the Gateway as part of its core configuration. [Find out more about this setup from AWS documentation](https://docs.aws.amazon.com/sdk-for-java/v1/developer-guide/credentials.html#credentials-default).
:::

[Read our blog about schema registry](https://www.conduktor.io/blog/what-is-the-schema-registry-and-why-do-you-need-to-use-it/).

### Example

```json
{
  "name": "myFieldLevelDataMaskingPlugin",
  "pluginClass": "io.conduktor.gateway.interceptor.FieldLevelDataMaskingPlugin",
  "priority": 100,
  "config": {
    "schemaRegistryConfig": {
      "host": "http://schema-registry:8081"
    },
    "policies": [
      {
        "name": "Mask password",
        "rule": {
          "type": "MASK_ALL"
        },
        "fields": [
          "password"
        ]
      },
      {
        "name": "Mask visa",
        "rule": {
          "type": "MASK_LAST_N",
          "maskingChar": "X",
          "numberOfChars": 4
        },
        "fields": [
          "visa"
        ]
      }
    ]
  }
}
```

### Secured schema registry

```json
{
  "name": "myFieldLevelDataMaskingPlugin",
  "pluginClass": "io.conduktor.gateway.interceptor.FieldLevelDataMaskingPlugin",
  "priority": 100,
  "config": {
    "schemaRegistryConfig": {
      "host": "http://schema-registry:8081",
      "additionalConfigs": {
        "schema.registry.url": "${SR_URL}",
        "basic.auth.credentials.source": "${SR_BASIC_AUTH_CRED_SRC}",
        "basic.auth.user.info": "${SR_BASIC_AUTH_USER_INFO}"
      }
    },
    "policies": [
      {
        "name": "Mask password",
        "rule": {
          "type": "MASK_ALL"
        },
        "fields": [
          "password"
        ]
      },
      {
        "name": "Mask visa",
        "rule": {
          "type": "MASK_LAST_N",
          "maskingChar": "X",
          "numberOfChars": 4
        },
        "fields": [
          "visa"
        ]
      }
    ]
  }
}
```


## Dynamic header injection Interceptor

Conduktor Gateway's dynamic header <GlossaryTerm>Interceptor</GlossaryTerm> injects headers (such as user ip) to the messages as they are produced through Gateway.

We support templating in this format: `X-CLIENT_IP: "{{userIp}} testing"`.

Here are the values we can expand:

- uuid
- userIp
- vcluster
- user
- clientId
- gatewayIp
- gatewayHost
- gatewayVersion
- apiKey
- apiKeyVersion
- timestampMillis

### Configuration

|Config           | Type    | Description                                                                                                                                           |
|:-----------------|:--------|:------------------------------------------------------------------------------------------------------------------------------------------------------|
| topic            | String  | Regular expression that matches topics from your produce request                                                                                      |
| headers          | Map     | Map of header key and header value will be injected, with the header value we can use `{{userIp}}` for the user ip information we want to be injected |
| overrideIfExists | boolean | Default `false`, configuration to override header on already exist                                                                                    |

### Example

```json
{
  "name": "myDynamicHeaderInjectionInterceptor",
  "pluginClass": "io.conduktor.gateway.interceptor.DynamicHeaderInjectionPlugin",
  "priority": 100,
  "config": {
    "topic": "topic.*",
    "headers": {
      "X-CLIENT_IP": "{{userIp}} testing"
    },
    "overrideIfExists": true
  }
}
```

Let's produce a simple record to the `injectHeaderTopic` topic.

```bash
echo 'inject_header' | docker-compose exec -T kafka-client \
    kafka-console-producer  \
        --bootstrap-server conduktor-gateway:6969 \
        --producer.config /clientConfig/gateway.properties \
        --topic injectHeaderTopic
```

Let's consume from our `injectHeaderTopic`.

```bash
docker-compose exec kafka-client \
  kafka-console-consumer \
    --bootstrap-server conduktor-gateway:6969 \
    --consumer.config /clientConfig/gateway.properties \
    --topic injectHeaderTopic \
    --from-beginning \
    --max-messages 1 \
    --property print.headers=true
```

You should see the message with headers as below

```
X-USER_IP:172.19.0.3 testing   inject_header
```


export const Highlight = ({children, color, text}) => (
<span style={{ backgroundColor: color, borderRadius: '4px', color: text, padding: '0.2rem 0.5rem', fontWeight: '500', }}>
{children}
</span>
);

export const KMS = () => (
<Highlight color="#F8F1EE" text="#7D5E54">KMS</Highlight>
);

export const KEK = () => (
<Highlight color="#E7F9F5" text="#067A6F">KEK</Highlight>
);

export const EDEK = () => (
<Highlight color="#F0F4FF" text="#3451B2">EDEK</Highlight>
);

export const DEK = () => (
<Highlight color="#FEEFF6" text="#CB1D63">DEK</Highlight>
);

## Encryption Interceptor overview

This <GlossaryTerm>Interceptor</GlossaryTerm> is a robust and versatile solution for securing data within Kafka records. Its primary function is to safeguard sensitive information from unauthorized access, thereby enhancing data security both in transit and at rest. The key features are:

- **Field-Level encryption**: encrypts specific fields within Kafka records, e.g. passwords or PII (Personally Identifiable Information). This is very useful when only certain parts of a message contain sensitive data.

- **Full Message encryption**: encrypts the entire Kafka record, ensuring that all contents of the message are secured. This is particularly useful when the entire message is sensitive.

### How it works

Once configured, the encryption and decryption processes are seamlessly managed by the interceptor.

**Encryption**: The interceptor identifies the data that needs to be encrypted & the KMS details to share the encryption key, Gateway will then encrypt and produce the message.

**Decryption**: Similar to encryption, the interceptor can decrypt either the entire message, specific fields or all the fields, based on your configuration.

### Flexibility and Compatibility

You can refine how it's encrypted with a choice of algorithm and KMS provider.

**Multiple Encryption Algorithms**: The interceptor supports a variety of encryption algorithms, allowing you to choose the one that best meets your security requirements.

**KMS Integration**: It integrates with various Key Management Services (KMS), providing flexibility in how you manage and store encryption keys.

### Use encryption Interceptor

#### Encrypt data

1. **Identify data**. The Interceptor first determines, based on its configuration, what data needs to be encrypted. This may include the entire message, specific fields or all the fields within the message. For example, if you have configured the interceptor to encrypt a `password` field, it will target this field within the incoming Kafka record for encryption.  

2. **Retrieve key**. The interceptor then generates a key and shares it with the the configured KMS (Key Management Service) or retrieves it, if it exists. Supported KMS options include *Vault*, *Azure*, *AWS*, *GCP* or an in-memory service for local development only. The key is fetched using the `keySecretId` specified in your configuration to ensure the correct key is utilized.

3. **Encrypt**. Once the key is generated/retrieved, the Interceptor encrypts the identified data using the specified encryption algorithm. The original data within the message is now replaced with the encrypted version.

4. **Transmit**. Finally, the encrypted data is either stored as is if it is an *Avro record* or converted into a *JSON format* and is then transmitted as a string to the designated destination.

#### Decrypt data

1. **Identify data**. The Interceptor first determines, based on its configuration, which data needs to be decrypted. This may include the entire message, specific fields, or all the fields within the message.

2. **Retrieve key**. Next, the Interceptor retrieves the decryption key from the KMS. Typically, this is the same key that was used during encryption. The correct key is obtained using the `keySecretId` provided in your Interceptor configuration and that's stored in the header of the record, on the backing Kafka.

3. **Decrypt**. The Interceptor then decrypts the identified data using the retrieved key and the specified encryption algorithm. The decrypted data replaces the encrypted data within the message.

4. **Consume**. Once decrypted, the message is ready for consumption by the end-user or application. The Interceptor ensures that the decrypted data is correctly formatted and fully compatible with the Kafka record structure.

:::info[Transparent process]
These encryption and decryption processes are fully transparent to the end-user or application. The Interceptor manages all these operations, allowing you to concentrate on the core business logic.
:::

### Manage keys

The Interceptor uses the `envelope encryption` technique to encrypt data. Here are some key terms we'll use:

|  Term   | Definition                                                                                                                                               |
|:-------:|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| <KMS/>  | **Key Management Service**: A system responsible for managing and storing cryptographic keys, including the <KEK/>.                                      |
| <KEK/>  | **Key Encryption Key**: A key stored in the <KMS/>, used to encrypt the <DEK/>. Notably, the <KEK/> is never exposed to or known by the interceptor.     |
| <DEK/>  | **Data Encryption Key**: A key generated by the interceptor, used to encrypt the actual data.                                                            |
| <EDEK/> | **Encrypted Data Encryption Key**: The <DEK/> that has been encrypted by the <KEK/>, ensuring that the <DEK/> remains secure when stored or transmitted. |

To **encrypt** the data, the Gateway:

1. Generates a <DEK/> that is used to encrypt the data
2. Sends the <DEK/> to the <KMS/>, so it encrypts it using its <KEK/> and returns the <EDEK/> to the Gateway
3. Cache the <DEK/> & <EDEK/> in memory for a [configurable Time to Live (TTL)](#optimizing-performance-with-caching)
4. Encrypts the data using the <DEK/>
5. Stores the <EDEK/> alongside the encrypted data, and both are sent to the backing Kafka

To **decrypt** the data, the Gateway:

1. Retrieves the <EDEK/> that's stored with the encrypted data
2. Sends the <EDEK/> to the <KMS/>, which decrypts it (using the <KEK/>) and returns the <DEK/> to Gateway
3. Decrypts the data using the <DEK/>

![envelope encryption](/guides/encryption.png)

### Optimizing performance with caching

To reduce the number of calls to the <KMS/> and avoid some of the steps detailed above, the interceptor caches the <DEK/> in memory. The cache has a configurable Time to Live (TTL), and the interceptor will call the <KMS/> to decrypt the <EDEK/> if the <DEK/> is not in the cache, as detailed in the steps 1 and 2 above.
