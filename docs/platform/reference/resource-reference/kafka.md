---
sidebar_position: 2
title: Kafka Resources
description: Kafka resources
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
<Highlight color="#F0F4FF" text="#3451B2">Application API Key</Highlight>
);

export const AdminToken = () => (
<Highlight color="#FEEFF6" text="#CB1D63">Admin API Key</Highlight>
);

## Kafka Resources

### Topic
Creates a Topic in Kafka.

**API Keys:** <AdminToken />  <AppToken />  
**Managed with:** <CLI /> <API /> <GUI />


````yaml
---
apiVersion: v2
kind: Topic
metadata:
  cluster: shadow-it
  name: click.event-stream.avro
spec:
  replicationFactor: 3
  partitions: 3
  configs:
    min.insync.replicas: '2'
    cleanup.policy: delete
    retention.ms: '60000'
````
**Topic checks:**
- `spec.cluster` is a valid Kafka Cluster
- `metadata.name` must belong to the Application Instances
- `spec.replicationFactor` and `spec.partitions` are immutable and cannot be modified once the topic is created
- All properties are validated against [TopicPolicies](#topic-policy) attached to the Application Instance

**Side effect in Console & Kafka:**
- Kafka
  - Topic is created / updated.
  - In dry-run mode, topic creation is validated against the Kafka Cluster using AdminClient's [CreateTopicOption.validateOnly(true)](https://kafka.apache.org/37/javadoc/org/apache/kafka/clients/admin/CreateTopicsOptions.html) flag

### Subject
:::caution Not implemented yet
This concept will be available in a future version
:::
Creates a Subject in the Schema Registry.

**API Keys:** <AdminToken />  <AppToken />  
**Managed with:** <CLI /> <API /> <GUI />

**Local file**

```yaml
---
apiVersion: v1
kind: Subject
metadata:
  cluster: shadow-it
  name: myPrefix.topic-value
spec:
  schemaFile: schemas/topic.avsc # relative to conduktor CLI execution context
  format: AVRO
  compatibility: FORWARD_TRANSITIVE
```

**Inline**

```yaml
---
apiVersion: v1
kind: Subject
metadata:
  cluster: shadow-it
  name: myPrefix.topic-value
spec:
  schema: |
    {
      "type": "long"
    }
  format: AVRO
```

**Schema Reference**

```yaml
---
apiVersion: v1
kind: Subject
metadata:
  cluster: shadow-it
  name: myPrefix.topic-value
spec:
  schema: |
    {
      "type": "record",
      "namespace": "com.schema.avro",
      "name": "Client",
      "fields": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "address",
          "type": "com.schema.avro.Address"
        }
      ]
    }
  format: AVRO
  references:
    - name: com.schema.avro.Address
      subject: commons.address-value
      version: 1
```

**Subject checks:**
- `metadata.cluster` is a valid Kafka Cluster
- `metadata.name` must belong to the Application Instance
- One of `spec.schema` or `spec.schemaFile` must be present. `schema` requires an inline schema, `schemaFile` requires a path to a file that contains the schema (relative to the CLI execution path)
- `spec.format` is optional. Defines the schema format: AVRO, PROTOBUF, JSON
- `spec.compatibility` is optional. Defines the subject compatibility mode: BACKWARD, BACKWARD_TRANSITIVE, FORWARD, FORWARD_TRANSITIVE, FULL, FULL_TRANSITIVE, NONE
  - Unset the field if you want the compatibility mode to be the one defined at the Schema Registry global level
- `spec.references` is optional. It specifies the names of referenced schemas


**Side effect in Console & Kafka:**
- Kafka / Schema Registry
  - Subject is created / updated
  - In dry-run mode, subject will be checked against the SchemaRegistry's [/compatibility/subjects/:subject/versions API](https://docs.confluent.io/platform/current/schema-registry/develop/api.html#sr-api-compatibility) API

### Connector
:::caution Not implemented yet
This concept will be available in a future version
:::
**API Keys:** <AdminToken />  <AppToken />  
**Managed with:** <CLI /> <API /> <GUI />

```yaml
---
apiVersion: v1
kind: Connector
metadata:
  name: myPrefix.myConnector
spec:
  connectCluster: myConnectCluster
  config:
    connector.class: io.connect.jdbc.JdbcSourceConnector
    tasks.max: '1'
    topics: myPrefix.myTopic
    connection.url: "jdbc:mysql://127.0.0.1:3306/sample?verifyServerCertificate=false&useSSL=true&requireSSL=true"
    consumer.override.sasl.jaas.config: o.a.k.s.s.ScramLoginModule required username="<user>" password="<password>";

```