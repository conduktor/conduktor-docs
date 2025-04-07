---
sidebar_position: 1
title: Console resources
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
<Highlight color="#F0F4FF" text="#3451B2">Application API Key</Highlight>
);

export const AdminToken = () => (
<Highlight color="#FEEFF6" text="#CB1D63">Admin API Key</Highlight>
);

export const MissingLabelSupport = () => (
<Highlight color="#F5F5F5" text="#666666">Label Support Incoming</Highlight>
);

export const FullLabelSupport = () => (
<Highlight color="#E6F4EA" text="#1B7F4B">Full Label Support</Highlight>
);

export const PartialLabelSupport = () => (
<Highlight color="#FFF8E1" text="#B26A00">Partial Label Support (No UI yet)</Highlight>
);


## ConsoleGroup

**API Keys:** <AdminToken />  
**Managed with:** <API /> <CLI /> <TF /> <GUI />  
**Labels support:** <MissingLabelSupport />

Creates a Group with members and permissions in Console

<Tabs>
<TabItem  value="CLI" label="CLI">

````yaml
---
apiVersion: iam/v2
kind: Group
metadata:
  name: developers-a
spec:
  displayName: "Developers Team A"
  description: "Members of the Team A - Developers"
  externalGroups: 
    - "LDAP-GRP-A-DEV"
  members:
    - member1@company.org
    - member2@company.org
  permissions:
    - resourceType: TOPIC
      cluster: shadow-it
      patternType: PREFIXED
      name: toto-
      permissions:
        - topicViewConfig
        - topicConsume
        - topicProduce
````

</TabItem>
<TabItem value="Terraform" label="Terraform">

````hcl
resource "conduktor_group_v2" "developers-a" {
  name = "developers-a"
  spec {
    display_name    = "Developers Team A"
    description     = "Members of the Team A - Developers"
    external_groups = [ "LDAP-GRP-A-DEV" ]
    members         = [ "member1@company.org", "member1@company.org" ]
    permissions     = [
     {
        resource_type = "TOPIC"
        cluster       = "shadow-it"
        pattern_type  = "PREFIXED"
        name          = "toto-"
        permissions   = ["topicViewConfig", "topicConsume", "topicProduce"]
      }
    ]
  }
}
````

</TabItem>
</Tabs>

**Groups checks:**
- `spec.description` is **optional**
- `spec.externalGroups` is a list of LDAP or OIDC groups to sync with this Console Group
  - Members added this way will not appear in `spec.members` but `spec.membersFromExternalGroups` instead
- `spec.membersFromExternalGroups` is a **read-only** list of members added through `spec.externalGroups`
- `spec.members` must be email addresses of members you wish to add to this group
- `spec.permissions` are valid permissions as defined in [Permissions](#permissions)

**Side effect in Console & Kafka:**
- Console
  - Members of the Group are given the associated permissions in the UI over the resources
  - Members of the LDAP or OIDC groups will be automatically added or removed upon login
- Kafka
  - No side effect

## ConsoleUser

**API Keys:** <AdminToken />  
**Managed with:** <API /> <CLI /> <TF /> <GUI />  
**Labels support:** <MissingLabelSupport />

Create a user with Platform permissions.

<Tabs>
<TabItem  value="CLI" label="CLI">

````yaml
---
apiVersion: iam/v2
kind: User
metadata:
  name: john.doe@company.org
spec:
  firstName: "John"
  lastName: "Doe"
  permissions:
    - resourceType: PLATFORM
      permissions:
        - taasView
        - datamaskingView
    - resourceType: TOPIC
      cluster: shadow-it
      patternType: PREFIXED
      name: toto-
      permissions:
        - topicViewConfig
        - topicConsume
        - topicProduce
````

</TabItem>
<TabItem value="Terraform" label="Terraform">

````hcl
resource "conduktor_group_v2" "john.doe@company.org" {
  name = "john.doe@company.org"
  
  spec {
    firstname = "John"
    lastname  = "Doe"
    
    permissions = [
      {
        resource_type = "TOPIC"
        cluster       = "shadow-it"
        patternType   = "PREFIXED"
        name          = "toto-"
        permissions   = [
          "topicViewConfig",
          "datamaskingView",
          "auditLogView"
        ]
      },
      {
        resource_type = "PLATFORM"
        permissions   = [
          "taasView",
          "datamaskingView"
        ]
      }
    ]
  }
}
````

</TabItem>
</Tabs>

:::warning
Make sure you set permissions for this user, otherwise it won't have access to Platform functionality (such as `Application Catalog` or `Data Policies`) and Kafka resources.
:::

**Users checks:**
- `spec.permissions` are valid permissions as defined in [Permissions](#permissions)

**Side effect in Console & Kafka:**
- Console
  - User is given the associated permissions in the UI over the resources
- Kafka
  - No side effect

## KafkaCluster
Creates a Kafka Cluster Definition in Console.

**API Keys:** <AdminToken />  
**Managed with:** <API /> <CLI /> <TF /> <GUI />  
**Labels support:** <PartialLabelSupport />

<Tabs>
<TabItem  value="CLI" label="CLI">

````yaml
---
apiVersion: console/v2
kind: KafkaCluster
metadata:
  name: my-dev-cluster
spec:
  displayName: "My Dev Cluster"
  icon: "kafka"
  color: "#000000"
  bootstrapServers: "localhost:9092"
  ignoreUntrustedCertificate: false
  properties:
    sasl.jaas.config: org.apache.kafka.common.security.plain.PlainLoginModule required username="admin" password="admin-secret";
    security.protocol: SASL_SSL
    sasl.mechanism: PLAIN
  schemaRegistry:
    type: "ConfluentLike"
    url: http://localhost:8080
    security:
      type: BasicAuth
      username: some_user
      password: some_password
    ignoreUntrustedCertificate: false
  kafkaFlavor:
    type: "Confluent"
    key: "string"
    secret: "string"
    confluentEnvironmentId: "string"
    confluentClusterId: "string"
````

</TabItem>
<TabItem value="Terraform" label="Terraform">

````hcl
resource "conduktor_kafka_cluster_v2" "my-dev-cluster" {
  name = "my-dev-cluster"
  spec {
    display_name                 = "My Dev Cluster"
    icon                         = "kafka"
    color                        = "#000000"
    bootstrap_servers            = "localhost:9092"
    ignore_untrusted_certificate = false
    properties = {
      "sasl.jaas.config"  = "org.apache.kafka.common.security.plain.PlainLoginModule required username='admin' password='admin-secret';"
      "security.protocol" = "SASL_SSL"
      "sasl.mechanism"    = "PLAIN"
    }
    schema_registry = {
      type     = "ConfluentLike"
      url      = "http://localhost:8080"
      security = {
        type     = "BasicAuth"
        username = "some_user"
        password = "some_password"
      }
      ignore_untrusted_certificate = false
    }
    kafka_flavor = {
      type   = "Confluent"
      key    = "string"
      secret = "string"
      confluent_environment_id = "string"
      confluent_cluster_id     = "string"
    }
  }
}
````

</TabItem>
</Tabs>

:::info
`metadata.name`, `spec.displayName`, `spec.icon` and `spec.color` work together to build the visual identity of the KafkaCluster throughout Console.
![Cluster identity](assets/cluster-visual-identity.png)
:::

**KafkaCluster checks:**
- `spec.icon` (optional, default `kafka`) is a valid entry from our [Icon Sets](#icon-sets)
- `spec.color` (optional, default `#000000`) is a HEX color for `spec.icon`
- `spec.ignoreUntrustedCertificate` (optional, default `false`) must be one of [`true`, `false`]
- `spec.schemaRegistry.type` (optional) must be one of [`ConfluentLike`, `Glue`] 
  - See [Schema Registry Properties](#schema-registry) for the detailed list of options
- `spec.kafkaFlavor.type` (optional) must be one of [`Confluent`, `Aiven`, `Gateway`] 
  - See [Kafka Provider Properties](#kafka-provider) for the detailed list of options

:::warning Important
Conduktor CLI does not verify that your Kafka configuration (`spec.bootstrapServers`, `spec.properties`, ...) is valid.   
You need to check that in Console directly.
:::

### Schema Registry
This section lets you associate a Schema Registry to your KafkaCluster
#### Confluent or Confluent-like Registry

<Tabs>
<TabItem  value="CLI" label="CLI">

````yaml
spec:
  schemaRegistry:
    type: "ConfluentLike"
    url: http://localhost:8080
    ignoreUntrustedCertificate: false
    security:
      type: BasicAuth
      username: some_user
      password: some_password
````

</TabItem>
<TabItem value="Terraform" label="Terraform">

````hcl
spec {
  schema_registry = {
    type = "ConfluentLike"
    url = "http://localhost:8080
    ignore_untrusted_certificate = false
    security = {
      type     = "BasicAuth"
      username = "some_user"
      password = "some_password"
    }
  }
}
````

</TabItem>
</Tabs>

Confluent Schema Registry checks:
- `spec.schemaRegistry.urls` must be a single URL of a Kafka Connect cluster
  - **Multiple URLs are not supported for now. Coming soon**
- `spec.schemaRegistry.ignoreUntrustedCertificate` (optional, default `false`) must be one of [`true`, `false`]
- `spec.schemaRegistry.properties` (optional) is Java Properties formatted key values to further configure the SchemaRegistry
- `spec.security.type` (optional) must be one of [`BasicAuth`, `BearerToken`, `SSLAuth`]
  - See [HTTP Security Properties](#http-security-properties) for the detailed list of options

#### AWS Glue Registry

<Tabs>
<TabItem  value="CLI" label="CLI">

````yaml
spec:
  schemaRegistry:
    type: "Glue"
    region: eu-west-1
    registryName: default
    security:
      type: Credentials
      accessKeyId: accessKey
      secretKey: secretKey
````

</TabItem>
<TabItem value="Terraform" label="Terraform">

````hcl
spec {
  schema_registry = {
    type          = "Glue"
    region        = "eu-west-1"
    registry_name = "default"
    security = {
      type          = "Credentials"
      access_key_id = "accessKey"
      secret_key    = "secretKey"
    }
  }
}
````

</TabItem>
</Tabs>

AWS Glue Registry checks:
- `spec.schemaRegistry.region` must be a valid AWS region
- `spec.schemaRegistry.registryName` must be a valid AWS Glue Registry in this region
- `spec.schemaRegistry.security.type` must be one of [`Credentials`, `FromContext`, `FromRole`]

**Credentials**  
Use AWS API Key/Secret to connect to the Glue Registry

<Tabs>
<TabItem  value="CLI" label="CLI">

````yaml
    security:
      type: Credentials
      accessKeyId: AKIAIOSFODNN7EXAMPLE
      secretKey: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
````

</TabItem>
<TabItem value="Terraform" label="Terraform">

````hcl
    security = {
      type          = "Credentials"
      access_key_id = "AKIAIOSFODNN7EXAMPLE"
      secret_key    = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
    }
````

</TabItem>
</Tabs>

**FromContext**

<Tabs>
<TabItem  value="CLI" label="CLI">

````yaml
    security:
      type: FromContext
      profile: default
````

</TabItem>
<TabItem value="Terraform" label="Terraform">

````hcl
    security = {
      type    = "FromContext"
      profile = "default"
    }
````

</TabItem>
</Tabs>

**FromRole**

<Tabs>
<TabItem  value="CLI" label="CLI">

````yaml
    security:
      type: FromRole
      role: arn:aws:iam::123456789012:role/example-role
````

</TabItem>
<TabItem value="Terraform" label="Terraform">

````hcl
    security = {
      type    = "FromRole"
      profile = "arn:aws:iam::123456789012:role/example-role"
    }
````

</TabItem>
</Tabs>

### Kafka Provider
This section lets you configure the Kafka Provider for this KafkaCluster.

**Confluent Cloud**  
Provide your Confluent Cloud details to get additional features in Console:
- Confluent Cloud Service Accounts support
- Confluent Cloud API Keys support

<Tabs>
<TabItem  value="CLI" label="CLI">

````yaml
spec:
  kafkaFlavor:
    type: "Confluent"
    key: "yourApiKey123456"
    secret: "yourApiSecret123456"
    confluentEnvironmentId: "env-12345"
    confluentClusterId: "lkc-67890"
````

</TabItem>
<TabItem value="Terraform" label="Terraform">

````hcl
spec {
  kafka_flavor = {
    type                     = "Confluent"
    key                      = "yourApiKey123456"
    secret                   = "yourApiSecret123456"
    confluent_environment_id = "env-12345"
    confluent_cluster_id     = "lkc-67890"
  }
}
````

</TabItem>
</Tabs>

**Aiven**  
Provide your Aiven Cloud details to get additional features in Console:  
- Aiven Service Accounts support
- Aiven ACLs support

<Tabs>
<TabItem  value="CLI" label="CLI">

````yaml
spec:
  kafkaFlavor:
    type: "Aiven"
    apiToken: "a1b2c3d4e5f6g7h8i9j0"
    project: "my-kafka-project"
    serviceName: "my-kafka-service"
````

</TabItem>
<TabItem value="Terraform" label="Terraform">

````hcl
spec {
  kafka_flavor = {
    type         = "Aiven"
    api_token    = "a1b2c3d4e5f6g7h8i9j0"
    project      = "my-kafka-project"
    service_name = "my-kafka-service"
  }
}
````

</TabItem>
</Tabs>

**Gateway**  
Provide your Gateway details to get additional features in Console:
- Interceptors support

<Tabs>
<TabItem  value="CLI" label="CLI">

````yaml
spec:
  kafkaFlavor:
    type: "Gateway"
    url: "http://gateway:8888"
    user: "admin"
    password: "admin"
    virtualCluster: passthrough
````
</TabItem>
<TabItem value="Terraform" label="Terraform">

````hcl
spec {
  kafka_flavor = {
    type            = "Gateway"
    url             = "http://gateway:8888"
    user            = "admin"
    password        = "admin"
    virtual_cluster = "passthrough"
    ignore_untrusted_certificate = false
  }
}
````

</TabItem>
</Tabs>

### Icon Sets

| <svg height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentcolor" tabindex="-1" focusable="false" aria-hidden="true" role="img" class="ui-c-aIcSi ui-c-aIcSi-ckVrXY-size-regular ui-c-gulvcB"><path d="M352 351.1h-71.25l47.44-105.4c3.062-6.781 1.031-14.81-4.906-19.31c-5.969-4.469-14.22-4.312-19.94 .4687l-153.6 128c-5.156 4.312-7.094 11.41-4.781 17.72c2.281 6.344 8.281 10.56 15.03 10.56h71.25l-47.44 105.4c-3.062 6.781-1.031 14.81 4.906 19.31C191.6 510.9 194.1 512 198.4 512c3.656 0 7.281-1.25 10.25-3.719l153.6-128c5.156-4.312 7.094-11.41 4.781-17.72C364.8 356.2 358.8 351.1 352 351.1zM416 128c-.625 0-1.125 .25-1.625 .25C415.5 123 416 117.6 416 112C416 67.75 380.3 32 336 32c-24.62 0-46.25 11.25-61 28.75C256.4 24.75 219.3 0 176 0C114.1 0 64 50.13 64 112c0 7.25 .75 14.25 2.125 21.25C27.75 145.8 0 181.5 0 224c0 53 43 96 96 96h46.63l140.2-116.8c8.605-7.195 19.53-11.16 30.76-11.16c10.34 0 20.6 3.416 29.03 9.734c17.96 13.61 24.02 37.45 14.76 57.95L330.2 320H416c53 0 96-43 96-96S469 128 416 128z"></path></svg> | <svg height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="currentcolor" tabindex="-1" focusable="false" aria-hidden="true" role="img" class="ui-c-aIcSi ui-c-aIcSi-ckVrXY-size-regular ui-c-gulvcB"><path d="M430.8 304.9c10 5.625 19 12.37 27 20.37C487.1 292.8 529 272 576 272v-64c-61 0-116.2 24.62-156.8 64.25C424.9 282.2 429 293.2 430.8 304.9zM399.2 325.6C399.4 323.8 400 321.9 400 320c0-35.25-28.75-64-64-64c-12.62 0-24.25 3.75-34.13 10C284.2 227.1 245.4 200 200 200c-61.88 0-112 50.12-112 112c0 3 .75 5.75 .875 8.75C39.25 324.4 0 365.4 0 416c0 53 43 96 96 96h272c53 0 96-43 96-96C464 374 436.8 338.6 399.2 325.6zM238.6 173.6c21 5.875 40.38 16.5 56.62 31C359.6 119.4 461.2 64 576 64V0C437.1 0 314.2 68.75 238.6 173.6zM325.8 225.1C333.2 224.2 362.5 219.8 394.2 244C440.6 197.2 504.9 168 576 168v-64C474.8 104 384.4 151.4 325.8 225.1z"></path></svg> | <svg height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="currentcolor" tabindex="-1" focusable="false" aria-hidden="true" role="img" class="ui-c-aIcSi ui-c-aIcSi-ckVrXY-size-regular ui-c-gulvcB"><path d="M96.2 200.1C96.07 197.4 96 194.7 96 192C96 103.6 167.6 32 256 32C315.3 32 367 64.25 394.7 112.2C409.9 101.1 428.3 96 448 96C501 96 544 138.1 544 192C544 204.2 541.7 215.8 537.6 226.6C596 238.4 640 290.1 640 352C640 422.7 582.7 480 512 480H144C64.47 480 0 415.5 0 336C0 273.2 40.17 219.8 96.2 200.1z"></path></svg> | <svg height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentcolor" tabindex="-1" focusable="false" aria-hidden="true" role="img" class="ui-c-aIcSi ui-c-aIcSi-ckVrXY-size-regular ui-c-gulvcB"><path d="M475.6 384.1C469.7 394.3 458.9 400 447.9 400c-5.488 0-11.04-1.406-16.13-4.375l-25.09-14.64l5.379 20.29c3.393 12.81-4.256 25.97-17.08 29.34c-2.064 .5625-4.129 .8125-6.164 .8125c-10.63 0-20.36-7.094-23.21-17.84l-17.74-66.92L288 311.7l.0002 70.5l48.38 48.88c9.338 9.438 9.244 24.62-.1875 33.94C331.5 469.7 325.4 472 319.3 472c-6.193 0-12.39-2.375-17.08-7.125l-14.22-14.37L288 480c0 17.69-14.34 32-32.03 32s-32.03-14.31-32.03-32l-.0002-29.5l-14.22 14.37c-9.322 9.438-24.53 9.5-33.97 .1875c-9.432-9.312-9.525-24.5-.1875-33.94l48.38-48.88L223.1 311.7l-59.87 34.93l-17.74 66.92c-2.848 10.75-12.58 17.84-23.21 17.84c-2.035 0-4.1-.25-6.164-.8125c-12.82-3.375-20.47-16.53-17.08-29.34l5.379-20.29l-25.09 14.64C75.11 398.6 69.56 400 64.07 400c-11.01 0-21.74-5.688-27.69-15.88c-8.932-15.25-3.785-34.84 11.5-43.75l25.96-15.15l-20.33-5.508C40.7 316.3 33.15 303.1 36.62 290.3S53.23 270 66.09 273.4L132 291.3L192.5 256L132 220.7L66.09 238.6c-2.111 .5625-4.225 .8438-6.305 .8438c-10.57 0-20.27-7.031-23.16-17.72C33.15 208.9 40.7 195.8 53.51 192.3l20.33-5.508L47.88 171.6c-15.28-8.906-20.43-28.5-11.5-43.75c8.885-15.28 28.5-20.44 43.81-11.5l25.09 14.64L99.9 110.7C96.51 97.91 104.2 84.75 116.1 81.38C129.9 77.91 142.1 85.63 146.4 98.41l17.74 66.92L223.1 200.3l-.0002-70.5L175.6 80.88C166.3 71.44 166.3 56.25 175.8 46.94C185.2 37.59 200.4 37.72 209.8 47.13l14.22 14.37L223.1 32c0-17.69 14.34-32 32.03-32s32.03 14.31 32.03 32l.0002 29.5l14.22-14.37c9.307-9.406 24.51-9.531 33.97-.1875c9.432 9.312 9.525 24.5 .1875 33.94l-48.38 48.88L288 200.3l59.87-34.93l17.74-66.92c3.395-12.78 16.56-20.5 29.38-17.03c12.82 3.375 20.47 16.53 17.08 29.34l-5.379 20.29l25.09-14.64c15.28-8.906 34.91-3.75 43.81 11.5c8.932 15.25 3.785 34.84-11.5 43.75l-25.96 15.15l20.33 5.508c12.81 3.469 20.37 16.66 16.89 29.44c-2.895 10.69-12.59 17.72-23.16 17.72c-2.08 0-4.193-.2813-6.305-.8438L379.1 220.7L319.5 256l60.46 35.28l65.95-17.87C458.8 270 471.9 277.5 475.4 290.3c3.473 12.78-4.082 25.97-16.89 29.44l-20.33 5.508l25.96 15.15C479.4 349.3 484.5 368.9 475.6 384.1z"></path></svg> |
|:---:|:---:|:---:|:---:|
| `cloudBolt` | `cloudRainbow` | `cloud` | `snowflake` |
|  |  |  |  |
| <svg height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentcolor" tabindex="-1" focusable="false" aria-hidden="true" role="img" class="ui-c-aIcSi ui-c-aIcSi-ckVrXY-size-regular ui-c-gulvcB"><path d="M304 368H248.3l38.45-89.7c2.938-6.859 .7187-14.84-5.312-19.23c-6.096-4.422-14.35-4.031-19.94 .8906l-128 111.1c-5.033 4.391-6.783 11.44-4.439 17.67c2.346 6.25 8.314 10.38 14.97 10.38H199.7l-38.45 89.7c-2.938 6.859-.7187 14.84 5.312 19.23C169.4 510.1 172.7 512 175.1 512c3.781 0 7.531-1.328 10.53-3.953l128-111.1c5.033-4.391 6.783-11.44 4.439-17.67C316.6 372.1 310.7 368 304 368zM373.3 226.6C379.9 216.6 384 204.9 384 192c0-35.38-28.62-64-64-64h-5.875C317.8 118 320 107.3 320 96c0-53-43-96-96-96C218.9 0 213.9 .75 208.9 1.5C218.3 14.62 224 30.62 224 48C224 92.13 188.1 128 144 128H128C92.63 128 64 156.6 64 192c0 12.88 4.117 24.58 10.72 34.55C31.98 236.3 0 274.3 0 320c0 53.02 42.98 96 96 96h12.79c-4.033-4.414-7.543-9.318-9.711-15.1c-7.01-18.64-1.645-39.96 13.32-53.02l127.9-111.9C249.1 228.2 260.3 223.1 271.1 224c10.19 0 19.95 3.174 28.26 9.203c18.23 13.27 24.76 36.1 15.89 57.71l-19.33 45.1h7.195c19.89 0 37.95 12.51 44.92 31.11C355.3 384 351 402.8 339.1 416H352c53.02 0 96-42.98 96-96C448 274.3 416 236.3 373.3 226.6z"></path></svg> | <svg height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentcolor" tabindex="-1" focusable="false" aria-hidden="true" role="img" class="ui-c-aIcSi ui-c-aIcSi-ckVrXY-size-regular ui-c-gulvcB"><path d="M512 440.1C512 479.9 479.7 512 439.1 512H71.92C32.17 512 0 479.8 0 440c0-35.88 26.19-65.35 60.56-70.85C43.31 356 32 335.4 32 312C32 272.2 64.25 240 104 240h13.99C104.5 228.2 96 211.2 96 192c0-35.38 28.56-64 63.94-64h16C220.1 128 256 92.12 256 48c0-17.38-5.784-33.35-15.16-46.47C245.8 .7754 250.9 0 256 0c53 0 96 43 96 96c0 11.25-2.288 22-5.913 32h5.879C387.3 128 416 156.6 416 192c0 19.25-8.59 36.25-22.09 48H408C447.8 240 480 272.2 480 312c0 23.38-11.38 44.01-28.63 57.14C485.7 374.6 512 404.3 512 440.1z"></path></svg> | <svg height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentcolor" tabindex="-1" focusable="false" aria-hidden="true" role="img" class="ui-c-aIcSi ui-c-aIcSi-ckVrXY-size-regular ui-c-gulvcB"><path d="M240.5 224H352C365.3 224 377.3 232.3 381.1 244.7C386.6 257.2 383.1 271.3 373.1 280.1L117.1 504.1C105.8 513.9 89.27 514.7 77.19 505.9C65.1 497.1 60.7 481.1 66.59 467.4L143.5 288H31.1C18.67 288 6.733 279.7 2.044 267.3C-2.645 254.8 .8944 240.7 10.93 231.9L266.9 7.918C278.2-1.92 294.7-2.669 306.8 6.114C318.9 14.9 323.3 30.87 317.4 44.61L240.5 224z"></path></svg> | <svg height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="currentcolor" tabindex="-1" focusable="false" aria-hidden="true" role="img" class="ui-c-aIcSi ui-c-aIcSi-ckVrXY-size-regular ui-c-gulvcB"><path d="M255.1 301.7v130.3c0 8.814-7.188 16-16 16c-7.814 0-13.19-5.314-15.1-10.69c-5.906-16.72-24.1-25.41-40.81-19.5c-16.69 5.875-25.41 24.19-19.5 40.79C175.8 490.6 206.2 512 239.1 512C284.1 512 320 476.1 320 431.1v-130.3c-9.094-7.908-19.81-13.61-32-13.61C275.7 288.1 265.6 292.9 255.1 301.7zM575.7 280.9C547.1 144.5 437.3 62.61 320 49.91V32.01c0-17.69-14.31-32.01-32-32.01S255.1 14.31 255.1 32.01v17.91C138.3 62.61 29.48 144.5 .2949 280.9C-1.926 290.1 8.795 302.1 18.98 292.2c52-55.01 107.7-52.39 158.6 37.01c5.312 9.502 14.91 8.625 19.72 0C217.5 293.9 242.2 256 287.1 256c58.5 0 88.19 68.82 90.69 73.2c4.812 8.625 14.41 9.502 19.72 0c51-89.52 107.1-91.39 158.6-37.01C567.3 302.2 577.9 290.1 575.7 280.9z"></path></svg> |
| `pooStorm` | `poop` | `bolt` | `umbrella` |
|  |  |  |  |
| <svg height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentcolor" tabindex="-1" focusable="false" aria-hidden="true" role="img" class="ui-c-aIcSi ui-c-aIcSi-ckVrXY-size-regular ui-c-gulvcB"><path d="M363.1 319.8c-48.7 34.11-74.45 88.51-74.45 143.8c0 15.11 1.922 30.29 5.823 45.15c110.6-16.7 197.9-104 214.4-214.7c-14.72-3.875-29.85-6.031-45.1-6.031C428.9 288.1 393.7 298.4 363.1 319.8zM49.59 223.3c110.6 0 173.8-93.19 173.8-174.1c0-15.12-1.924-30.31-5.828-45.17c-110.4 16.67-197.5 103.7-214.3 214.1C18.35 221.3 33.95 223.3 49.59 223.3zM255.1-.0031c-1.928 0-3.793 .244-5.711 .287C253.1 15.98 255.8 31.95 255.8 47.85c0 97.43-76.7 208.1-207.5 208.1c-16.18 0-32.29-1.914-48-5.613c-.041 1.902-.285 3.756-.285 5.67c0 141.4 114.6 256 256 256c1.932 0 3.797-.2482 5.719-.2912c-3.677-15.69-5.488-31.65-5.488-47.55c0-96.97 76.25-207.9 207.1-207.9c16.3 0 32.55 1.901 48.39 5.631c.0449-1.977 .299-3.896 .299-5.881C511.1 114.6 397.4-.0031 255.1-.0031z"></path></svg> | <svg height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentcolor" tabindex="-1" focusable="false" aria-hidden="true" role="img" class="ui-c-aIcSi ui-c-aIcSi-ckVrXY-size-regular ui-c-gulvcB"><path d="M495.1 174.8c0-45.12-7.712-83.76-14.15-108.2c-4.688-17.54-18.34-31.23-36.04-35.95C435.5 27.91 392.9 16 337 16C149 16 15.1 154.6 15.1 337.2c0 45.12 7.714 83.77 14.15 108.2C35.22 464.3 50.46 496 174.9 496C362.1 496 495.1 357.4 495.1 174.8zM384 144c0 4.094-1.562 8.188-4.688 11.31l-52.67 52.67l20.69 20.69c3.125 3.125 4.688 7.219 4.688 11.31c0 9.133-7.468 16-16 16c-4.094 0-8.189-1.562-11.31-4.688L304 230.6l-25.38 25.38l20.69 20.69c3.125 3.125 4.688 7.219 4.688 11.31c0 9.141-7.474 16-16 16c-4.094 0-8.188-1.564-11.31-4.689l-20.69-20.69L230.6 303.1l20.69 20.69c3.125 3.125 4.688 7.219 4.688 11.31c0 9.141-7.474 16-16 16c-4.094 0-8.188-1.564-11.31-4.689l-20.69-20.69l-52.69 52.69C152.2 382.4 148.1 384 144 384C135.5 384 128 377.1 128 368c0-4.094 1.562-8.188 4.688-11.31l52.69-52.69L164.7 283.3C161.6 280.2 160 276.1 160 271.1c0-8.529 6.865-16 16-16c4.095 0 8.189 1.562 11.31 4.688l20.69 20.69l25.38-25.38L212.7 235.3C209.6 232.2 208 228.1 208 223.1c0-8.528 6.865-16 16-16c4.094 0 8.188 1.562 11.31 4.688l20.69 20.69l25.38-25.38l-20.69-20.69c-3.125-3.125-4.688-7.219-4.688-11.31c0-9.141 7.473-16 16-16c4.094 0 8.188 1.562 11.31 4.688l20.69 20.69l52.67-52.67C359.8 129.6 363.9 128 368 128C376.5 128 384 134.9 384 144z"></path></svg> | <svg height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentcolor" tabindex="-1" focusable="false" aria-hidden="true" role="img" class="ui-c-aIcSi ui-c-aIcSi-ckVrXY-size-regular ui-c-gulvcB"><path d="M173.7 128L216 20.3C220.8 8.053 232.7 0 245.8 0H266.2C279.3 0 291.2 8.053 295.1 20.3L338.3 128H173.7zM363.4 192L401.1 288H110.9L148.6 192H363.4zM48 448L85.71 352H426.3L464 448H480C497.7 448 512 462.3 512 480C512 497.7 497.7 512 480 512H32C14.33 512 0 497.7 0 480C0 462.3 14.33 448 32 448H48z"></path></svg> | <svg height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentcolor" tabindex="-1" focusable="false" aria-hidden="true" role="img" class="ui-c-aIcSi ui-c-aIcSi-ckVrXY-size-regular ui-c-gulvcB"><path d="M352 256h-38.54C297.7 242.5 277.9 232.9 256 228V180.5L224 177L192 180.5V228C170.1 233 150.3 242.6 134.5 256H16C7.125 256 0 263.1 0 272v96C0 376.9 7.125 384 16 384h92.78C129.4 421.8 173 448 224 448s94.59-26.25 115.2-64H352c17.62 0 32 14.29 32 31.91S398.4 448 416 448h64c17.62 0 32-14.31 32-31.94C512 327.7 440.4 256 352 256zM81.63 159.9L224 144.9l142.4 15C375.9 160.9 384 153.1 384 143.1V112.9c0-10-8.125-17.74-17.62-16.74L256 107.8V80C256 71.12 248.9 64 240 64h-32C199.1 64 192 71.12 192 80v27.75L81.63 96.14C72.13 95.14 64 102.9 64 112.9v30.24C64 153.1 72.13 160.9 81.63 159.9z"></path></svg> |
| `tennisBall` | `rugbyBall` | `trafficCone` | `faucet` |
|  |  |  |  |
| <svg height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="currentcolor" tabindex="-1" focusable="false" aria-hidden="true" role="img" class="ui-c-aIcSi ui-c-aIcSi-ckVrXY-size-regular ui-c-gulvcB"><path d="M243.1 2.706C254.8 8.821 259.4 23.31 253.3 35.07L171.7 192H404.3L322.7 35.07C316.6 23.31 321.2 8.821 332.9 2.706C344.7-3.409 359.2 1.167 365.3 12.93L458.4 192H544C561.7 192 576 206.3 576 224C576 241.7 561.7 256 544 256L492.1 463.5C484.1 492 459.4 512 430 512H145.1C116.6 512 91 492 83.88 463.5L32 256C14.33 256 0 241.7 0 224C0 206.3 14.33 192 32 192H117.6L210.7 12.93C216.8 1.167 231.3-3.409 243.1 2.706L243.1 2.706zM144 296C157.3 296 168 285.3 168 272C168 258.7 157.3 248 144 248C130.7 248 120 258.7 120 272C120 285.3 130.7 296 144 296zM432 248C418.7 248 408 258.7 408 272C408 285.3 418.7 296 432 296C445.3 296 456 285.3 456 272C456 258.7 445.3 248 432 248z"></path></svg> | <svg height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentcolor" tabindex="-1" focusable="false" aria-hidden="true" role="img" class="ui-c-aIcSi ui-c-aIcSi-ckVrXY-size-regular ui-c-gulvcB"><path d="M50.73 58.53C58.86 42.27 75.48 32 93.67 32H208V160H0L50.73 58.53zM240 160V32H354.3C372.5 32 389.1 42.27 397.3 58.53L448 160H240zM448 416C448 451.3 419.3 480 384 480H64C28.65 480 0 451.3 0 416V192H448V416z"></path></svg> | <svg height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="currentcolor" tabindex="-1" focusable="false" aria-hidden="true" role="img" class="ui-c-aIcSi ui-c-aIcSi-ckVrXY-size-regular ui-c-gulvcB"><path d="M554.9 154.5c-17.62-35.25-68.12-35.38-85.87 0c-87 174.3-84.1 165.9-84.1 181.5c0 44.13 57.25 80 128 80s127.1-35.88 127.1-80C639.1 319.9 641.4 327.3 554.9 154.5zM439.1 320l71.96-144l72.17 144H439.1zM256 336c0-16.12 1.375-8.75-85.12-181.5c-17.62-35.25-68.12-35.38-85.87 0c-87 174.3-84.1 165.9-84.1 181.5c0 44.13 57.25 80 127.1 80S256 380.1 256 336zM127.9 176L200.1 320H55.96L127.9 176zM495.1 448h-143.1V153.3C375.5 143 393.1 121.8 398.4 96h113.6c17.67 0 31.1-14.33 31.1-32s-14.33-32-31.1-32h-128.4c-14.62-19.38-37.5-32-63.62-32S270.1 12.62 256.4 32H128C110.3 32 96 46.33 96 64S110.3 96 127.1 96h113.6c5.25 25.75 22.87 47 46.37 57.25V448H144c-26.51 0-48.01 21.49-48.01 48c0 8.836 7.165 16 16 16h416c8.836 0 16-7.164 16-16C544 469.5 522.5 448 495.1 448z"></path></svg> | <svg height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="currentcolor" tabindex="-1" focusable="false" aria-hidden="true" role="img" class="ui-c-aIcSi ui-c-aIcSi-ckVrXY-size-regular ui-c-gulvcB"><path d="M574.1 280.4l-45.38-181.7c-5.875-23.75-21.5-43.1-43-55.75c-21.5-11.88-47-14.12-70.25-6.375L400.3 41.64c-8.375 2.75-12.88 11.87-10 20.25l5 15.12c2.75 8.375 11.88 12.87 20.25 10.12l13.12-4.375c10.88-3.625 23.04-3.625 33.17 1.75c10.25 5.25 17.71 14.62 20.46 25.75l38.38 153.9C494.4 255.9 467 251.8 439.5 251.6c-34.75 0-74 6.998-114.9 26.75H251.4C210.5 258.6 171.4 251.6 136.5 251.6c-27.5 .125-54.92 4.251-81.17 12.5l38.38-153.9C96.5 99.14 104 89.76 114.3 84.51C124.4 79.14 136.5 79.14 147.4 82.76L160.5 87.14c4 1.375 8.375 1.01 12.25-.8648c3.75-1.875 6.625-5.26 8-9.26l5-15.21C188.6 53.43 183.1 44.39 175.7 41.64l-15.25-5.125c-23.25-7.748-48.71-5.5-70.21 6.375c-21.5 11.75-37.13 31.1-43 55.75L1.875 280.4C.75 285.5 .125 290.6 0 295.9v70.25C0 428.1 51.62 480 115.3 480h37.04c60.38 0 110.5-46 114.1-105.4l2.875-38.62h35.75l2.875 38.62C313.3 433.1 363.3 480 423.7 480h37.04C524.4 480 576 428.1 576 366.1v-70.25C576 290.6 575.4 285.5 574.1 280.4zM64.25 367.9C64.25 367.3 64 366.8 64 366.1v-37.62c23.25-8.373 47.88-12.75 72.63-12.87c9.125 0 18.12 1.25 27.12 2.5L64.25 367.9zM372.4 365.9l-2.875-37.37c22.38-8.498 46-12.87 70-12.87c9.5 .125 19.12 .875 28.62 2.25L372.4 365.9z"></path></svg> |
| `basketShopping` | `box` | `scaleBalanced` | `sunglasses` |
|  |  |  |  |
| <svg height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentcolor" tabindex="-1" focusable="false" aria-hidden="true" role="img" class="ui-c-aIcSi ui-c-aIcSi-ckVrXY-size-regular ui-c-gulvcB"><path d="M110.1 227.6c-6.25-6.248-16.37-6.248-22.62 0l-18.75 18.75c-5.498 5.373-6.249 13.87-1.999 20.25l53.37 79.99l-53.5 53.5l-29.25-14.62c-5.375-2.748-11.75-1.623-16 2.625l-17.25 17.25c-5.5 5.375-5.5 14.25 0 19.62l82.87 82.87c5.375 5.5 14.25 5.5 19.62 0l17.25-17.25c4.25-4.25 5.375-10.62 2.625-16l-14.62-29.25l53.5-53.5l79.99 53.41c6.375 4.25 14.87 3.5 20.25-2l18.75-18.79c6.25-6.25 6.25-16.37 0-22.62L110.1 227.6zM493.7 .1497l-93.74 15.88L171.9 244.1l95.99 95.99l228.1-228.1l15.87-93.75C513.3 7.781 504.2-1.35 493.7 .1497z"></path></svg> | <svg height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentcolor" tabindex="-1" focusable="false" aria-hidden="true" role="img" class="ui-c-aIcSi ui-c-aIcSi-ckVrXY-size-regular ui-c-gulvcB"><path d="M256 32c-17.67 0-32 14.33-32 32v431.1C224 504.8 231.2 512 240 512h32c8.836 0 16-7.164 16-15.1V64C288 46.33 273.7 32 256 32zM101 13.61c-3.125-13-17.66-18.13-26.78-8.876C28.63 50.86 0 117.6 0 192s28.62 141.1 74.25 187.3c9.125 9.252 23.66 4.126 26.78-8.876C112.9 320.6 147.8 282.1 192 269.1V114.9C147.8 101.9 112.9 63.37 101 13.61zM512 160.9c-6.875-61.76-33.63-116.7-73-156.2c-9.25-9.252-24.08-4.107-27.21 8.895C399.8 63.37 364.6 101.9 320 114.9v154.3c44.63 13 79.79 51.49 91.79 101.3c3.125 13 17.96 18.15 27.21 8.896C478.4 339.8 505.1 284.9 512 223.1L449.3 192L512 160.9z"></path></svg> | <svg height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentcolor" tabindex="-1" focusable="false" aria-hidden="true" role="img" class="ui-c-aIcSi ui-c-aIcSi-ckVrXY-size-regular ui-c-gulvcB"><path d="M502.6 169.4l-160-160C336.4 3.125 328.2 0 320 0s-16.38 3.125-22.62 9.375c-12.5 12.5-12.5 32.75 0 45.25l6.975 6.977l-271.4 271c-38.75 38.75-45.13 102-9.375 143.5C44.08 500 72.76 512 101.5 512h.4473c26.38 0 52.75-9.1 72.88-30.12l275.2-274.6l7.365 7.367C463.6 220.9 471.8 224 480 224s16.38-3.125 22.62-9.375C515.1 202.1 515.1 181.9 502.6 169.4zM310.6 256H200.2l149.3-149.1l55.18 55.12L310.6 256z"></path></svg> | <svg height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentcolor" tabindex="-1" focusable="false" aria-hidden="true" role="img" class="ui-c-aIcSi ui-c-aIcSi-ckVrXY-size-regular ui-c-gulvcB"><path d="M467.1 241.1L351.1 288h94.34c-7.711 14.85-16.29 29.28-25.87 43.01l-132.5 52.99h85.65c-59.34 52.71-144.1 80.34-264.5 52.82l-68.13 68.13c-9.38 9.38-24.56 9.374-33.94 0c-9.375-9.375-9.375-24.56 0-33.94l253.4-253.4c4.846-6.275 4.643-15.19-1.113-20.95c-6.25-6.25-16.38-6.25-22.62 0l-168.6 168.6C24.56 58 366.9 8.118 478.9 .0846c18.87-1.354 34.41 14.19 33.05 33.05C508.7 78.53 498.5 161.8 467.1 241.1z"></path></svg> |
| `sword` | `axeBattle` | `vial` | `featherPointed` |
|  |  |  |  |
| <svg height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentcolor" tabindex="-1" focusable="false" aria-hidden="true" role="img" class="ui-c-aIcSi ui-c-aIcSi-ckVrXY-size-regular ui-c-gulvcB"><path d="M440.8 4.994C441.9 1.99 444.8 0 448 0C451.2 0 454.1 1.99 455.2 4.994L469.3 42.67L507 56.79C510 57.92 512 60.79 512 64C512 67.21 510 70.08 507 71.21L469.3 85.33L455.2 123C454.1 126 451.2 128 448 128C444.8 128 441.9 126 440.8 123L426.7 85.33L388.1 71.21C385.1 70.08 384 67.21 384 64C384 60.79 385.1 57.92 388.1 56.79L426.7 42.67L440.8 4.994zM289.4 97.37C301.9 84.88 322.1 84.88 334.6 97.37L363.3 126.1L380.7 108.7C386.9 102.4 397.1 102.4 403.3 108.7C409.6 114.9 409.6 125.1 403.3 131.3L385.9 148.7L414.6 177.4C427.1 189.9 427.1 210.1 414.6 222.6L403.8 233.5C411.7 255.5 416 279.3 416 304C416 418.9 322.9 512 208 512C93.12 512 0 418.9 0 304C0 189.1 93.12 96 208 96C232.7 96 256.5 100.3 278.5 108.3L289.4 97.37zM95.1 296C95.1 238.6 142.6 192 199.1 192H207.1C216.8 192 223.1 184.8 223.1 176C223.1 167.2 216.8 160 207.1 160H199.1C124.9 160 63.1 220.9 63.1 296V304C63.1 312.8 71.16 320 79.1 320C88.84 320 95.1 312.8 95.1 304V296z"></path></svg> | <svg height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentcolor" tabindex="-1" focusable="false" aria-hidden="true" role="img" class="ui-c-aIcSi ui-c-aIcSi-ckVrXY-size-regular ui-c-gulvcB"><path d="M64 496C64 504.8 56.75 512 48 512h-32C7.25 512 0 504.8 0 496V32c0-17.75 14.25-32 32-32s32 14.25 32 32V496zM476.3 0c-6.365 0-13.01 1.35-19.34 4.233c-45.69 20.86-79.56 27.94-107.8 27.94c-59.96 0-94.81-31.86-163.9-31.87C160.9 .3055 131.6 4.867 96 15.75v350.5c32-9.984 59.87-14.1 84.85-14.1c73.63 0 124.9 31.78 198.6 31.78c31.91 0 68.02-5.971 111.1-23.09C504.1 355.9 512 344.4 512 332.1V30.73C512 11.1 495.3 0 476.3 0z"></path></svg> | <svg height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentcolor" tabindex="-1" focusable="false" aria-hidden="true" role="img" class="ui-c-aIcSi ui-c-aIcSi-ckVrXY-size-regular ui-c-gulvcB"><path d="M0 190.9V185.1C0 115.2 50.52 55.58 119.4 44.1C164.1 36.51 211.4 51.37 244 84.02L256 96L267.1 84.02C300.6 51.37 347 36.51 392.6 44.1C461.5 55.58 512 115.2 512 185.1V190.9C512 232.4 494.8 272.1 464.4 300.4L283.7 469.1C276.2 476.1 266.3 480 256 480C245.7 480 235.8 476.1 228.3 469.1L47.59 300.4C17.23 272.1 .0003 232.4 .0003 190.9L0 190.9z"></path></svg> | <svg height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentcolor" tabindex="-1" focusable="false" aria-hidden="true" role="img" class="ui-c-aIcSi ui-c-aIcSi-ckVrXY-size-regular ui-c-gulvcB"><path d="M282.3 343.7L248.1 376.1C244.5 381.5 238.4 384 232 384H192V424C192 437.3 181.3 448 168 448H128V488C128 501.3 117.3 512 104 512H24C10.75 512 0 501.3 0 488V408C0 401.6 2.529 395.5 7.029 391L168.3 229.7C162.9 212.8 160 194.7 160 176C160 78.8 238.8 0 336 0C433.2 0 512 78.8 512 176C512 273.2 433.2 352 336 352C317.3 352 299.2 349.1 282.3 343.7zM376 176C398.1 176 416 158.1 416 136C416 113.9 398.1 96 376 96C353.9 96 336 113.9 336 136C336 158.1 353.9 176 376 176z"></path></svg> |
| `bomb` | `flag` | `heart` | `key` |
|  |  |  |  |
| <svg height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentcolor" tabindex="-1" focusable="false" aria-hidden="true" role="img" class="ui-c-aIcSi ui-c-aIcSi-ckVrXY-size-regular ui-c-gulvcB"><path d="M64 480c0 17.67 14.33 32 31.1 32H256c17.67 0 31.1-14.33 31.1-32l-.0001-32H64L64 480zM503.4 5.56c-5.453-4.531-12.61-6.406-19.67-5.188l-175.1 32c-11.41 2.094-19.7 12.03-19.7 23.63L224 56L224 32c0-17.67-14.33-32-31.1-32H160C142.3 0 128 14.33 128 32l.0002 26.81C69.59 69.32 20.5 110.6 1.235 168.4C-2.952 181 3.845 194.6 16.41 198.8C18.94 199.6 21.48 200 24 200c10.05 0 19.42-6.344 22.77-16.41C59.45 145.5 90.47 117.8 128 108L128 139.2C90.27 157.2 64 195.4 64 240L64 416h223.1l.0001-176c0-44.6-26.27-82.79-63.1-100.8L224 104l63.1-.002c0 11.59 8.297 21.53 19.7 23.62l175.1 31.1c1.438 .25 2.875 .375 4.297 .375c5.578 0 11.03-1.938 15.37-5.562c5.469-4.562 8.625-11.31 8.625-18.44V23.1C511.1 16.87 508.8 10.12 503.4 5.56zM176 96C167.2 96 160 88.84 160 80S167.2 64 176 64s15.1 7.164 15.1 16S184.8 96 176 96z"></path></svg> | <svg height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentcolor" tabindex="-1" focusable="false" aria-hidden="true" role="img" class="ui-c-aIcSi ui-c-aIcSi-ckVrXY-size-regular ui-c-gulvcB"><path d="M384 319.1C384 425.9 297.9 512 192 512s-192-86.13-192-192c0-58.67 27.82-106.8 54.57-134.1C69.54 169.3 96 179.8 96 201.5v85.5c0 35.17 27.97 64.5 63.16 64.94C194.9 352.5 224 323.6 224 288c0-88-175.1-96.12-52.15-277.2c13.5-19.72 44.15-10.77 44.15 13.03C215.1 127 384 149.7 384 319.1z"></path></svg> | <svg height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentcolor" tabindex="-1" focusable="false" aria-hidden="true" role="img" class="ui-c-aIcSi ui-c-aIcSi-ckVrXY-size-regular ui-c-gulvcB"><path d="M224 .0001c-123.8 0-224 87.99-224 232.5c0 111.7 134.2 224.5 194.9 269.9c17.25 12.87 41 12.87 58.25 0C313.8 456.1 448 344.2 448 232.5C448 87.99 347.8 .0001 224 .0001zM176 319.1h-32c-44.12 0-80-35.87-80-79.1c0-8.874 7.125-15.1 16-15.1h32c44.12 0 80 35.87 80 79.99C192 312.9 184.9 319.1 176 319.1zM304 319.1h-32c-8.875 0-16-7.125-16-15.1c0-44.12 35.88-79.99 80-79.99h32c8.875 0 16 7.124 16 15.1C384 284.1 348.1 319.1 304 319.1z"></path></svg> | <svg height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="currentcolor" tabindex="-1" focusable="false" aria-hidden="true" role="img" class="ui-c-aIcSi ui-c-aIcSi-ckVrXY-size-regular ui-c-gulvcB"><path d="M31.99 256c17.63 0 32.01-12.5 32.01-28V0L.9928 221.1C-4.132 238.9 11.24 256 31.99 256zM575 221.1L512 0v228c0 15.5 14.38 28 32 28C564.8 256 580.1 238.9 575 221.1zM480 210.9C480 90.38 288 0 288 0S95.1 90.38 95.1 210.9c0 82.75-22.88 145.9-31.13 180.6c-3.375 14.5 3.625 29.38 16.38 35.25L255.1 512V256L159.1 224L159.1 192h256L416 224l-96 32l-.0009 255.1l174.9-85.25c12.63-5.875 19.75-20.75 16.25-35.25C502.9 356.8 480 293.6 480 210.9z"></path></svg> |
| `fireExtinguisher` | `fireFlameCurved` | `alien` | `helmetBattle` |
|  |  |  |  |
| <svg height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentcolor" tabindex="-1" focusable="false" aria-hidden="true" role="img" class="ui-c-aIcSi ui-c-aIcSi-ckVrXY-size-regular ui-c-gulvcB"><path d="M186.1 .1032c-105.1 3.126-186.1 94.75-186.1 199.9v264c0 14.25 17.3 21.38 27.3 11.25l24.95-18.5c6.625-5.001 16-4.001 21.5 2.25l43 48.31c6.25 6.251 16.37 6.251 22.62 0l40.62-45.81c6.375-7.251 17.62-7.251 24 0l40.63 45.81c6.25 6.251 16.38 6.251 22.62 0l43-48.31c5.5-6.251 14.88-7.251 21.5-2.25l24.95 18.5c10 10.13 27.3 3.002 27.3-11.25V192C384 83.98 294.9-3.147 186.1 .1032zM128 224c-17.62 0-31.1-14.38-31.1-32.01s14.38-32.01 31.1-32.01s32 14.38 32 32.01S145.6 224 128 224zM256 224c-17.62 0-32-14.38-32-32.01s14.38-32.01 32-32.01c17.62 0 32 14.38 32 32.01S273.6 224 256 224z"></path></svg> | <svg height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="currentcolor" tabindex="-1" focusable="false" aria-hidden="true" role="img" class="ui-c-aIcSi ui-c-aIcSi-ckVrXY-size-regular ui-c-gulvcB"><path d="M9.375 233.4C3.375 239.4 0 247.5 0 256v128c0 8.5 3.375 16.62 9.375 22.62S23.5 416 32 416h32V224H32C23.5 224 15.38 227.4 9.375 233.4zM464 96H352V32c0-17.62-14.38-32-32-32S288 14.38 288 32v64H176C131.8 96 96 131.8 96 176V448c0 35.38 28.62 64 64 64h320c35.38 0 64-28.62 64-64V176C544 131.8 508.3 96 464 96zM256 416H192v-32h64V416zM224 296C201.9 296 184 278.1 184 256S201.9 216 224 216S264 233.9 264 256S246.1 296 224 296zM352 416H288v-32h64V416zM448 416h-64v-32h64V416zM416 296c-22.12 0-40-17.88-40-40S393.9 216 416 216S456 233.9 456 256S438.1 296 416 296zM630.6 233.4C624.6 227.4 616.5 224 608 224h-32v192h32c8.5 0 16.62-3.375 22.62-9.375S640 392.5 640 384V256C640 247.5 636.6 239.4 630.6 233.4z"></path></svg> | <svg height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="currentcolor" tabindex="-1" focusable="false" aria-hidden="true" role="img" class="ui-c-aIcSi ui-c-aIcSi-ckVrXY-size-regular ui-c-gulvcB"><path d="M332.7 19.85C334.6 8.395 344.5 0 356.1 0C363.6 0 370.6 3.52 375.1 9.502L392 32H444.1C456.8 32 469.1 37.06 478.1 46.06L496 64H552C565.3 64 576 74.75 576 88V112C576 156.2 540.2 192 496 192H426.7L421.6 222.5L309.6 158.5L332.7 19.85zM448 64C439.2 64 432 71.16 432 80C432 88.84 439.2 96 448 96C456.8 96 464 88.84 464 80C464 71.16 456.8 64 448 64zM416 256.1V480C416 497.7 401.7 512 384 512H352C334.3 512 320 497.7 320 480V364.8C295.1 377.1 268.8 384 240 384C211.2 384 184 377.1 160 364.8V480C160 497.7 145.7 512 128 512H96C78.33 512 64 497.7 64 480V249.8C35.23 238.9 12.64 214.5 4.836 183.3L.9558 167.8C-3.331 150.6 7.094 133.2 24.24 128.1C41.38 124.7 58.76 135.1 63.05 152.2L66.93 167.8C70.49 182 83.29 191.1 97.97 191.1H303.8L416 256.1z"></path></svg> | <svg height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="currentcolor" tabindex="-1" focusable="false" aria-hidden="true" role="img" class="ui-c-aIcSi ui-c-aIcSi-ckVrXY-size-regular ui-c-gulvcB"><path d="M512 32.05c-13.12 0-25.5 2.577-37.38 6.327C464.8 15.88 442.2 0 416 0c-35.38 0-64 28.62-64 64c0 23.62 13 44 32 55.12V160c0 17.62 14.38 32 32 32h8c4.375 0 8 3.625 8 8v16C432 220.4 428.4 224 424 224H416c-35.25 0-64-28.75-64-64V135.2C331.9 117.1 320 91.25 320 64c0-11.25 2.25-21.1 5.875-32L192 32.06c-106 0-192 85.98-192 191.1v111.1c0 8.875 7.125 15.1 16 15.1L32 352v143.1C32 504.9 39.12 512 48 512h64C120.9 512 128 504.9 128 496v-107.8c32.38 17.63 70.75 27.84 112 27.84s79.63-10.23 112-27.86v107.9C352 504.9 359.1 512 368 512h64c8.875 0 16-7.124 16-15.1V288l64 .0092c23.5 0 45.13-6.746 64-17.75V368c0 8.875-7.055 16.01-15.93 16.01S544 376.9 544 368.1s-7.125-16.07-16-16.07l-32 .0244c-8.875 0-16 7.124-16 15.1c0 46.88 40.49 84.46 88.37 79.59C609.1 443.4 640 405.2 640 363.3V160C640 89.29 582.8 32.05 512 32.05zM528 160c-8.875 0-16-7.118-16-15.99s7.125-15.1 16-15.1S544 135.2 544 144S536.9 160 528 160z"></path></svg> |
| `ghost` | `robot` | `dog` | `elephant` |
|  |  |  |  |
| <svg height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentcolor" tabindex="-1" focusable="false" aria-hidden="true" role="img" class="ui-c-aIcSi ui-c-aIcSi-ckVrXY-size-regular ui-c-gulvcB"><path d="M0 192V188.4C0 172.7 12.74 160 28.44 160H224C241.7 160 256 145.7 256 128V96C256 42.98 298.1 0 352 0C399.5 0 438.9 34.45 446.6 79.72L504.2 114.3C509 117.2 512 122.4 512 128C512 133.6 509 138.8 504.2 141.7L448 175.5V192C448 285.9 390.3 366.3 308.3 399.6L349.2 476.8C355.4 488.5 350.9 503 339.2 509.2C327.5 515.4 312.1 510.9 306.8 499.2L261.1 412.9C249 414.1 236.6 416 224 416C223 416 222 415.1 221 415.1L253.2 476.8C259.4 488.5 254.9 503 243.2 509.2C231.5 515.4 216.1 510.9 210.8 499.2L162.1 407.4C68.52 380.5 0 294.3 0 192V192zM352 96C338.7 96 328 106.7 328 120C328 133.3 338.7 144 352 144C365.3 144 376 133.3 376 120C376 106.7 365.3 96 352 96z"></path></svg> | <svg height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentcolor" tabindex="-1" focusable="false" aria-hidden="true" role="img" class="ui-c-aIcSi ui-c-aIcSi-ckVrXY-size-regular ui-c-gulvcB"><path d="M417.5 251.7C421.7 258.1 425.5 264.9 428.5 272h31.72l28.62-14.31c7.938-3.922 17.5-.7656 21.47 7.156c3.938 7.906 .75 17.52-7.156 21.47l-32 16C468.9 303.4 466.5 304 464 304h-27.07c.9277 6.297 1.928 12.58 1.928 19.14c0 2.91-.9961 5.617-1.668 8.4l15.88 5.291c2.344 .7813 4.5 2.109 6.25 3.859l32 32c6.25 6.25 6.25 16.38 0 22.62C488.2 398.4 484.1 400 480 400s-8.188-1.562-11.31-4.688l-29.34-29.33l-21.14-7.049l-30.71 30.71l33.56 11.19c2.344 .7813 4.5 2.109 6.25 3.859l32 32c6.25 6.25 6.25 16.38 0 22.62C456.2 462.4 452.1 464 448 464s-8.188-1.562-11.31-4.688l-29.34-29.33l-45.13-15.05l-16.84 16.84l30.85 18.51C381.1 453.2 384 458.4 384 464v32c0 8.844-7.156 16-16 16S352 504.8 352 496v-22.94L310.2 448H201.8L160 473.1V496C160 504.8 152.8 512 144 512S128 504.8 128 496v-32c0-5.625 2.938-10.83 7.781-13.72l30.85-18.51l-16.84-16.84l-45.14 15.05l-29.34 29.33C72.19 462.4 68.09 464 64 464s-8.188-1.562-11.31-4.688c-6.25-6.25-6.25-16.38 0-22.62l32-32c1.75-1.75 3.906-3.078 6.25-3.859l33.56-11.19l-30.71-30.71l-21.14 7.049l-29.34 29.33C40.19 398.4 36.09 400 32 400s-8.188-1.562-11.31-4.688c-6.25-6.25-6.25-16.38 0-22.62l32-32c1.75-1.75 3.906-3.078 6.25-3.859l15.88-5.291c-.6719-2.783-1.649-5.49-1.649-8.4c0-6.555 .9807-12.84 1.908-19.14H48c-2.469 0-4.938-.5781-7.156-1.688l-32-16C.9375 282.4-2.25 272.8 1.688 264.8c3.969-7.922 13.56-11.05 21.47-7.156L51.78 272H83.5c3.027-7.143 6.825-13.86 11.02-20.29L13.79 213.7C5.379 209.8 .0039 201.3 .0039 192V128c0-70.69 57.3-128 127.1-128h63.1l-63.1 64h63.1c0 35.35-28.65 64-63.1 64h-79.1v48.77l81.87 38.53C147.8 202.9 169.1 195.3 192 193.2L192 144C192 135.2 199.2 128 208 128S224 135.2 224 144L224.1 192H288V144C288 135.2 295.2 128 304 128S320 135.2 320 144l-.001 49.17c22.89 2.162 44.19 9.723 62.13 22.13l81.87-38.53V128h-79.1C348.7 128 319.1 99.35 319.1 64h63.1l-63.1-64h63.1c70.69 0 127.1 57.31 127.1 128v64c0 9.297-5.375 17.75-13.78 21.72L417.5 251.7z"></path></svg> | <svg height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="currentcolor" tabindex="-1" focusable="false" aria-hidden="true" role="img" class="ui-c-aIcSi ui-c-aIcSi-ckVrXY-size-regular ui-c-gulvcB"><path d="M544 32.75V32l-.375 .375C516.9 12.38 484 0 448 0s-68.88 12.38-95.63 32.38L352 32v.75C313.4 61.88 287.1 107.9 287.1 160c0 11.5 1.383 22.96 3.883 34.34c-35.88 5.25-91.76 23.26-131.9 83.64V192c0-53-43-96-96-96c-17.62 0-32 14.38-32 32s14.38 32 32 32s32 14.38 32 32v256c0 35.38 28.63 64 64 64h175.1c4.25 0 8.375-1.625 11.37-4.625s4.625-7.119 4.625-11.37V480c0-17.62-14.38-32-32-32H287.1l128-96v144c0 4.25 1.625 8.375 4.625 11.38S427.7 512 431.1 512h32.01c4.25 0 8.375-1.625 11.37-4.625s4.625-7.116 4.625-11.37V316.8C554.5 301.5 608 236 608 160C608 107.9 582.6 61.88 544 32.75zM448 32c26.12 0 51.63 8.125 73 23L480 96h-64l-41-40.88C396.4 40.12 421.9 32 448 32zM503.1 160C503.1 168.9 496.9 176 487.1 176S472 168.9 472 160s7.125-16 16-16c4.25 0 8.375 1.625 11.38 4.625S503.1 155.8 503.1 160zM423.1 160C423.1 168.9 416.9 176 407.1 176S392 168.9 392 160s7.125-16 16-16c4.25 0 8.375 1.625 11.38 4.625S423.1 155.8 423.1 160zM448 288c-70.63-.125-127.9-57.37-128-127.1c0-32.13 12.38-61.25 32-83.75V160c0 53 43 96 96 96s96-43 96-96V76.25C563.6 98.75 576 127.9 576 160C575.9 230.6 518.6 287.9 448 288zM162.1 68.76L202.6 85.36l16.6 39.65c.875 1.875 2.762 2.986 4.763 2.986c1.999 0 3.875-1.111 4.75-2.986L245.3 85.36l39.65-16.6c1.875-.875 2.992-2.756 2.992-4.756s-1.117-3.882-2.992-4.757L245.3 42.64L228.7 2.986C227.9 1.111 225.1 .0001 223.1 .0001c-2.001 0-3.888 1.111-4.763 2.986L202.6 42.64L162.1 59.24c-1.875 .875-2.98 2.757-2.98 4.757S161.1 67.88 162.1 68.76z"></path></svg> | <svg height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentcolor" tabindex="-1" focusable="false" aria-hidden="true" role="img" class="ui-c-aIcSi ui-c-aIcSi-ckVrXY-size-regular ui-c-gulvcB"><path d="M502.9 9.049c-23.5-23.5-88.26 .0789-167.1 54.84c-75.51-31.25-165.5-16.3-226.9 44.95c-61.26 61.38-76.21 151.4-44.95 226.9c-54.76 78.89-78.34 143.6-54.84 167.1c37.13 37.25 177.9-43.15 314.3-179.5S540.2 46.18 502.9 9.049zM346.5 346.5c-38.13 38.13-84.14 78.89-130.8 113.6c68.13 13.38 138.4-8.001 187.4-57.13c49.01-49.01 70.38-119.4 56.88-187.4C423.9 264.2 382.1 310.9 346.5 346.5z"></path></svg> |
| `bird` | `crab` | `catSpace` | `planetRinged` |
|  |  |  |  |
| <svg height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentcolor" tabindex="-1" focusable="false" aria-hidden="true" role="img" class="ui-c-aIcSi ui-c-aIcSi-ckVrXY-size-regular ui-c-gulvcB"><path d="M511.4 20.72c-11.63 38.75-34.38 111.8-61.38 187.8c7 2.125 13.38 4 18.63 5.625c4.625 1.375 8.375 4.751 10.13 9.127c1.875 4.5 1.625 9.501-.625 13.75c-22.13 42.25-82.63 152.8-142.5 214.4c-1 1.125-2.001 2.5-3.001 3.5c-76 76.13-199.4 76.13-275.5 .125c-76.13-76.13-76.13-199.5 0-275.7c1-1 2.375-2 3.5-3C122.1 116.5 232.5 55.97 274.1 33.84c4.25-2.25 9.25-2.5 13.63-.625c4.5 1.875 7.875 5.626 9.25 10.13c1.625 5.125 3.5 11.63 5.625 18.63c75.88-27 148.9-49.75 187.6-61.25c5.75-1.75 11.88-.2503 16.13 4C511.5 8.844 512.1 15.09 511.4 20.72zM319.1 319.1c0-70.63-57.38-128-128-128c-70.75 0-128 57.38-128 128c0 70.76 57.25 128 128 128C262.6 448 319.1 390.8 319.1 319.1zM191.1 287.1c0 17.63-14.37 32-32 32c-17.75 0-32-14.38-32-32s14.25-32 32-32c8.5 0 16.63 3.375 22.63 9.375S191.1 279.5 191.1 287.1zM223.9 367.1c0 8.876-7.224 16-15.97 16c-8.875 0-16-7.127-16-16c0-8.876 7.1-16 15.98-16C216.7 351.1 223.9 359.1 223.9 367.1z"></path></svg> | <svg height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentcolor" tabindex="-1" focusable="false" aria-hidden="true" role="img" class="ui-c-aIcSi ui-c-aIcSi-ckVrXY-size-regular ui-c-gulvcB"><path d="M32 256c0-123.8 100.3-224 223.8-224c11.36 0 29.7 1.668 40.9 3.746c9.616 1.777 11.75 14.63 3.279 19.44C245 86.5 211.2 144.6 211.2 207.8c0 109.7 99.71 193 208.3 172.3c9.561-1.805 16.28 9.324 10.11 16.95C387.9 448.6 324.8 480 255.8 480C132.1 480 32 379.6 32 256z"></path></svg> | <svg height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentcolor" tabindex="-1" focusable="false" aria-hidden="true" role="img" class="ui-c-aIcSi ui-c-aIcSi-ckVrXY-size-regular ui-c-gulvcB"><path d="M224 160C224 177.7 209.7 192 192 192C174.3 192 160 177.7 160 160C160 142.3 174.3 128 192 128C209.7 128 224 142.3 224 160zM512 256C512 263.8 511.7 271.5 510.1 279.1C438.8 304.7 351.2 320 256 320C160.8 320 73.15 304.7 1.027 279.1C.3472 271.5 0 263.8 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256V256zM192 80C147.8 80 112 115.8 112 160C112 204.2 147.8 240 192 240C236.2 240 272 204.2 272 160C272 115.8 236.2 80 192 80zM256 512C134.9 512 33.38 427.9 6.794 314.8C79.44 338.4 164.7 352 256 352C347.3 352 432.6 338.4 505.2 314.8C478.6 427.9 377.1 512 256 512V512z"></path></svg> | <svg height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentcolor" tabindex="-1" focusable="false" aria-hidden="true" role="img" class="ui-c-aIcSi ui-c-aIcSi-ckVrXY-size-regular ui-c-gulvcB"><path d="M117.8 127.1H207C286.9-3.743 409.5-8.542 483.9 5.255C495.6 7.41 504.6 16.45 506.7 28.07C520.5 102.5 515.7 225.1 384 304.1V394.2C384 419.7 370.6 443.2 348.7 456.2L260.2 508.6C252.8 513 243.6 513.1 236.1 508.9C228.6 504.6 224 496.6 224 488V373.3C224 350.6 215 328.1 199 312.1C183 296.1 161.4 288 138.7 288H24C15.38 288 7.414 283.4 3.146 275.9C-1.123 268.4-1.042 259.2 3.357 251.8L55.83 163.3C68.79 141.4 92.33 127.1 117.8 127.1H117.8zM384 88C361.9 88 344 105.9 344 128C344 150.1 361.9 168 384 168C406.1 168 424 150.1 424 128C424 105.9 406.1 88 384 88zM166.5 470C117 519.5 .4762 511.5 .4762 511.5C.4762 511.5-7.516 394.1 41.98 345.5C76.37 311.1 132.1 311.1 166.5 345.5C200.9 379.9 200.9 435.6 166.5 470zM119.8 392.2C108.3 380.8 89.81 380.8 78.38 392.2C61.92 408.7 64.58 447.4 64.58 447.4C64.58 447.4 103.3 450.1 119.8 433.6C131.2 422.2 131.2 403.7 119.8 392.2z"></path></svg> |
| `meteor` | `moon` | `spaceStation` | `rocketLaunch` |
|  |  |  |  |
| <svg height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentcolor" tabindex="-1" focusable="false" aria-hidden="true" role="img" class="ui-c-aIcSi ui-c-aIcSi-ckVrXY-size-regular ui-c-gulvcB"><path d="M511.6 36.86l-64 415.1c-1.5 9.734-7.375 18.22-15.97 23.05c-4.844 2.719-10.27 4.097-15.68 4.097c-4.188 0-8.319-.8154-12.29-2.472l-122.6-51.1l-50.86 76.29C226.3 508.5 219.8 512 212.8 512C201.3 512 192 502.7 192 491.2v-96.18c0-7.115 2.372-14.03 6.742-19.64L416 96l-293.7 264.3L19.69 317.5C8.438 312.8 .8125 302.2 .0625 289.1s5.469-23.72 16.06-29.77l448-255.1c10.69-6.109 23.88-5.547 34 1.406S513.5 24.72 511.6 36.86z"></path></svg> | <svg height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="currentcolor" tabindex="-1" focusable="false" aria-hidden="true" role="img" class="ui-c-aIcSi ui-c-aIcSi-ckVrXY-size-regular ui-c-gulvcB"><path d="M640 320V368C640 385.7 625.7 400 608 400H574.7C567.1 445.4 527.6 480 480 480C432.4 480 392.9 445.4 385.3 400H254.7C247.1 445.4 207.6 480 160 480C112.4 480 72.94 445.4 65.33 400H32C14.33 400 0 385.7 0 368V256C0 228.9 16.81 205.8 40.56 196.4L82.2 92.35C96.78 55.9 132.1 32 171.3 32H353.2C382.4 32 409.1 45.26 428.2 68.03L528.2 193C591.2 200.1 640 254.8 640 319.1V320zM171.3 96C158.2 96 146.5 103.1 141.6 116.1L111.3 192H224V96H171.3zM272 192H445.4L378.2 108C372.2 100.4 362.1 96 353.2 96H272V192zM525.3 400C527 394.1 528 389.6 528 384C528 357.5 506.5 336 480 336C453.5 336 432 357.5 432 384C432 389.6 432.1 394.1 434.7 400C441.3 418.6 459.1 432 480 432C500.9 432 518.7 418.6 525.3 400zM205.3 400C207 394.1 208 389.6 208 384C208 357.5 186.5 336 160 336C133.5 336 112 357.5 112 384C112 389.6 112.1 394.1 114.7 400C121.3 418.6 139.1 432 160 432C180.9 432 198.7 418.6 205.3 400z"></path></svg> | <svg height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentcolor" tabindex="-1" focusable="false" aria-hidden="true" role="img" class="ui-c-aIcSi ui-c-aIcSi-ckVrXY-size-regular ui-c-gulvcB"><path d="M243.4 2.587C251.4-.8625 260.6-.8625 268.6 2.587L492.6 98.59C506.6 104.6 514.4 119.6 511.3 134.4C508.3 149.3 495.2 159.1 479.1 160V168C479.1 181.3 469.3 192 455.1 192H55.1C42.74 192 31.1 181.3 31.1 168V160C16.81 159.1 3.708 149.3 .6528 134.4C-2.402 119.6 5.429 104.6 19.39 98.59L243.4 2.587zM256 128C273.7 128 288 113.7 288 96C288 78.33 273.7 64 256 64C238.3 64 224 78.33 224 96C224 113.7 238.3 128 256 128zM127.1 416H167.1V224H231.1V416H280V224H344V416H384V224H448V420.3C448.6 420.6 449.2 420.1 449.8 421.4L497.8 453.4C509.5 461.2 514.7 475.8 510.6 489.3C506.5 502.8 494.1 512 480 512H31.1C17.9 512 5.458 502.8 1.372 489.3C-2.715 475.8 2.515 461.2 14.25 453.4L62.25 421.4C62.82 420.1 63.41 420.6 63.1 420.3V224H127.1V416z"></path></svg> | <svg height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="currentcolor" tabindex="-1" focusable="false" aria-hidden="true" role="img" class="ui-c-aIcSi ui-c-aIcSi-ckVrXY-size-regular ui-c-gulvcB"><path d="M128 16C128 7.164 135.2 0 144 0H176C184.8 0 192 7.164 192 16V64H240V16C240 7.164 247.2 0 256 0H288C296.8 0 304 7.164 304 16V64H336V16C336 7.164 343.2 0 352 0H384C392.8 0 400 7.164 400 16V64H448V16C448 7.164 455.2 0 464 0H496C504.8 0 512 7.164 512 16V224H576V176C576 167.2 583.2 160 592 160H624C632.8 160 640 167.2 640 176V464C640 490.5 618.5 512 592 512H384V384C384 348.7 355.3 320 320 320C284.7 320 256 348.7 256 384V512H48C21.49 512 0 490.5 0 464V176C0 167.2 7.164 160 16 160H48C56.84 160 64 167.2 64 176V224H128V16z"></path></svg> |
| `paperPlane` | `carSide` | `buildingColumns` | `castle` |
|  |  |  |  |
| <svg height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentcolor" tabindex="-1" focusable="false" aria-hidden="true" role="img" class="ui-c-aIcSi ui-c-aIcSi-ckVrXY-size-regular ui-c-gulvcB"><path d="M.0014 160C.0014 160 .0014 160 .0014 160C.0014 160 .0014 160 .0014 160zM224 480c47.05-22.87 176-82.13 176-255.1h-352C48 397.9 176.1 457.1 224 480zM447.1 160C447.1 160 447.1 160 447.1 160C447.1 160 447.1 160 447.1 160zM352 64.04l-100.5 .0017c3.375-9.373 8.5-18.12 15.12-25.1C272.3 31.54 272 22.04 265.1 16.17l-11.25-11.37c-3.125-3.125-7.75-5.125-12-4.75c-4.375 .25-8.5 2.125-11.38 5.375c-14.75 16.75-24.5 36.1-29.38 58.62L96 64.04c-52.99 0-95.99 42.98-95.1 95.97C.0053 177.6 14.38 192 32 192h384c17.62 0 31.1-14.37 31.1-31.98C447.1 107 404.1 64.04 352 64.04z"></path></svg> | <svg height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentcolor" tabindex="-1" focusable="false" aria-hidden="true" role="img" class="ui-c-aIcSi ui-c-aIcSi-ckVrXY-size-regular ui-c-gulvcB"><path d="M50.38 220.8C45.93 218.6 42.03 215.5 38.97 211.6C35.91 207.7 33.78 203.2 32.75 198.4C31.71 193.5 31.79 188.5 32.99 183.7C54.97 97.02 146.5 32 255.1 32C365.5 32 457 97.02 479 183.7C480.2 188.5 480.3 193.5 479.2 198.4C478.2 203.2 476.1 207.7 473 211.6C469.1 215.5 466.1 218.6 461.6 220.8C457.2 222.9 452.3 224 447.3 224H64.67C59.72 224 54.84 222.9 50.38 220.8zM372.7 116.7C369.7 119.7 367.1 123.8 367.1 128C367.1 131.2 368.9 134.3 370.7 136.9C372.5 139.5 374.1 141.6 377.9 142.8C380.8 143.1 384 144.3 387.1 143.7C390.2 143.1 393.1 141.6 395.3 139.3C397.5 137.1 399.1 134.2 399.7 131.1C400.3 128 399.1 124.8 398.8 121.9C397.6 118.1 395.5 116.5 392.9 114.7C390.3 112.9 387.2 111.1 383.1 111.1C379.8 111.1 375.7 113.7 372.7 116.7V116.7zM244.7 84.69C241.7 87.69 239.1 91.76 239.1 96C239.1 99.16 240.9 102.3 242.7 104.9C244.5 107.5 246.1 109.6 249.9 110.8C252.8 111.1 256 112.3 259.1 111.7C262.2 111.1 265.1 109.6 267.3 107.3C269.5 105.1 271.1 102.2 271.7 99.12C272.3 96.02 271.1 92.8 270.8 89.88C269.6 86.95 267.5 84.45 264.9 82.7C262.3 80.94 259.2 79.1 255.1 79.1C251.8 79.1 247.7 81.69 244.7 84.69V84.69zM116.7 116.7C113.7 119.7 111.1 123.8 111.1 128C111.1 131.2 112.9 134.3 114.7 136.9C116.5 139.5 118.1 141.6 121.9 142.8C124.8 143.1 128 144.3 131.1 143.7C134.2 143.1 137.1 141.6 139.3 139.3C141.5 137.1 143.1 134.2 143.7 131.1C144.3 128 143.1 124.8 142.8 121.9C141.6 118.1 139.5 116.5 136.9 114.7C134.3 112.9 131.2 111.1 127.1 111.1C123.8 111.1 119.7 113.7 116.7 116.7L116.7 116.7zM475.3 388.7C478.3 391.7 479.1 395.8 479.1 400V416C479.1 432.1 473.3 449.3 461.3 461.3C449.3 473.3 432.1 480 415.1 480H95.1C79.02 480 62.74 473.3 50.74 461.3C38.74 449.3 31.1 432.1 31.1 416V400C31.1 395.8 33.68 391.7 36.68 388.7C39.68 385.7 43.75 384 47.1 384H463.1C468.2 384 472.3 385.7 475.3 388.7zM511.1 296.6C512.1 300.7 512.2 304.9 511.6 309.1C510.9 313.2 509.4 317.2 507.2 320.8C504.1 324.4 502.1 327.5 498.7 329.9C480.6 344.2 458.2 351.9 435.1 351.9C412 351.9 389.7 344.2 371.5 329.9C364.4 323.5 355.1 319.1 345.5 319.1C335.9 319.1 326.6 323.5 319.5 329.9C301.3 344.1 278.1 351.9 255.9 351.9C232.8 351.9 210.5 344.1 192.3 329.9C185.2 323.5 175.9 319.1 166.3 319.1C156.7 319.1 147.4 323.5 140.3 329.9C122.2 344.2 99.76 351.9 76.7 351.9C53.64 351.9 31.25 344.2 13.12 329.9C9.714 327.5 6.829 324.3 4.628 320.8C2.427 317.2 .9536 313.2 .2908 309C-.3719 304.9-.2103 300.7 .7661 296.6C1.742 292.5 3.515 288.6 5.981 285.2C8.448 281.8 11.56 278.9 15.14 276.7C18.72 274.5 22.7 273.1 26.86 272.4C31.01 271.7 35.25 271.9 39.34 272.9C43.42 273.8 47.28 275.6 50.69 278.1C57.85 284.5 67.11 287.1 76.7 287.1C86.3 287.1 95.55 284.5 102.7 278.1C120.9 263.8 143.2 256.1 166.3 256.1C189.4 256.1 211.7 263.8 229.9 278.1C237 284.5 246.3 288 255.9 288C265.5 288 274.8 284.5 281.9 278.1C300.1 263.8 322.4 256.1 345.5 256.1C368.6 256.1 390.9 263.8 409.1 278.1C416.2 284.5 425.5 288 435.1 288C444.7 288 453.1 284.5 461.1 278.1C464.5 275.6 468.4 273.8 472.5 272.8C476.6 271.8 480.8 271.7 485 272.3C489.2 273 493.2 274.5 496.7 276.7C500.3 278.9 503.4 281.8 505.9 285.2C508.4 288.6 510.1 292.5 511.1 296.6H511.1z"></path></svg> | <svg height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentcolor" tabindex="-1" focusable="false" aria-hidden="true" role="img" class="ui-c-aIcSi ui-c-aIcSi-ckVrXY-size-regular ui-c-gulvcB"><path d="M209.1 388l-99.14 77.75c20.5 19.13 44.51 34.13 70.64 44.13c10.75 4.125 22.88 2.125 31.63-5.125c8.876-7.25 13.25-18.75 11.38-30L209.1 388zM509.9 180.6c-10-26.13-25-50.13-44.13-70.63l-77.76 99.13l86.76 14.5c1.75 .25 3.5 .375 5.251 .375c10.5 0 20.38-5.125 26.38-13.88C512.3 201.5 513.7 190.5 509.9 180.6zM234.9 22.63c-5.001-16.25-21.88-25.75-38.38-21.63c-96.26 24-171.5 99.25-195.5 195.5C-3.163 213 6.338 229.9 22.59 234.9l208 64c11.25 3.5 23.63 .375 32-8L290.9 262.6c8.376-8.375 11.5-20.75 8.001-32L234.9 22.63zM447.8 65.63c-1.125-8.5-5.501-16.25-12.38-21.38C397.8 15.63 351.8 .125 304.5 0c-14.63 0-29.13 1.5-43.26 4.5c1.375 2.875 3.251 5.5 4.251 8.625l64.01 208c0 .25 0 .5 .125 .625c6.001-1.875 11.63-5 15.5-10l96.01-122.3C446.5 82.75 448.9 74.13 447.8 65.63zM221.7 329.6c-.125-.125-.375 0-.6251-.125L13.09 265.5c-2.875-1-5.751-2.25-8.501-3.625c-12.5 60.88 2 124.1 39.63 173.5c5.126 6.875 12.88 11.25 21.38 12.38c1.375 .125 2.75 .25 4.001 .25c7.251 0 14.13-2.375 19.75-6.875l122.4-96C216.9 341.1 219.9 335.6 221.7 329.6z"></path></svg> | <svg height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="currentcolor" tabindex="-1" focusable="false" aria-hidden="true" role="img" class="ui-c-aIcSi ui-c-aIcSi-ckVrXY-size-regular ui-c-gulvcB"><path d="M448 64H56C49.63 64 43.5 66.5 39 71S32 81.63 32 88V352c0 53 43 96 96 96h192c53 0 96-43 96-96v-32h32c70.75 0 128-57.25 128-128S518.8 64 448 64zM448 256h-32V128h32c35.38 0 64 28.62 64 64S483.4 256 448 256z"></path></svg> |
| `acorn` | `burgerLettuce` | `croissant` | `mug` |
|  |  |  |  |
| <svg height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentcolor" tabindex="-1" focusable="false" aria-hidden="true" role="img" class="ui-c-aIcSi ui-c-aIcSi-ckVrXY-size-regular ui-c-gulvcB"><path d="M464 224c-26.5 0-48 21.5-48 47.1v63.1c0 8.875-7.125 15.1-16 15.1H352V101.4c0-51.1-38.88-98.5-90.88-101.2c-26.25-1.375-51.1 8.126-71.13 26.25C170.9 44.51 160 69.63 160 96v127.1L112 224c-8.875 0-16-7.125-16-15.1V144c0-26.5-21.5-47.1-48-47.1S0 117.5 0 144v63.1c0 61.87 50.12 111.1 112 111.1H160v159.1C160 497.6 174.4 512 192 512h128c17.62 0 32-14.37 32-31.1v-31.1h48c61.88 0 112-50.12 112-111.1V272C512 245.5 490.5 224 464 224zM224 176c-8.875 0-16-7.125-16-15.1S215.1 144 224 144S240 151.1 240 160C240 168.9 232.9 176 224 176zM288 400c-8.875 0-16-7.125-16-15.1c0-8.875 7.125-15.1 16-15.1s16 7.125 16 15.1C304 392.9 296.9 400 288 400z"></path></svg> | <svg height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentcolor" tabindex="-1" focusable="false" aria-hidden="true" role="img" class="ui-c-aIcSi ui-c-aIcSi-ckVrXY-size-regular ui-c-gulvcB"><path d="M512 302.3c0 35.29-28.99 63.91-64.28 63.91c-38.82 0-88.7-22.75-122.4-40.92c18.17 33.7 40.92 83.57 40.92 122.4c0 35.29-28.61 63.91-63.91 63.91c-18.1 0-34.45-7.52-46.09-19.63C244.6 504.3 228 512 209.7 512c-35.29 0-63.91-28.99-63.91-64.28c0-38.82 22.75-88.7 40.92-122.4c-33.7 18.17-83.57 40.92-122.4 40.92c-35.29 0-63.91-28.61-63.91-63.91c0-18.1 7.52-34.45 19.63-46.09C7.676 244.6 0 228 0 209.7c0-35.29 28.99-63.91 64.28-63.91c38.82 0 88.7 22.75 122.4 40.92C168.5 152.1 145.8 103.1 145.8 64.28c0-35.29 28.61-63.91 63.91-63.91c18.1 0 34.45 7.52 46.09 19.63C267.4 7.676 283.1 0 302.3 0c35.29 0 63.91 28.99 63.91 64.28c0 38.82-22.75 88.7-40.92 122.4c33.7-18.17 83.57-40.92 122.4-40.92c35.29 0 63.91 28.61 63.91 63.91c0 18.1-7.52 34.45-19.63 46.09C504.3 267.4 512 283.1 512 302.3z"></path></svg> | <svg height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="currentcolor" tabindex="-1" focusable="false" aria-hidden="true" role="img" class="ui-c-aIcSi ui-c-aIcSi-ckVrXY-size-regular ui-c-gulvcB"><path d="M517.5 168.6L139.2 2.266C124.4-3.609 107.5 2.266 99.62 16.14l-95.37 166.9C-.4999 191.3-1.25 201 1.999 209.9c3.25 8.875 10.25 15.87 19.13 19.12l156.5 64.87l-39.87 106.1H63.1c0-26.51-21.49-47.98-47.1-47.98C7.163 352 0 359.2 0 368v127.1C0 504.8 7.163 512 15.1 512c26.51 0 47.1-21.49 47.1-47.1l96.05 0c13.33 0 25.26-8.268 29.94-20.75l46.87-124.1l68.5 28.37c9.25 3.375 19.5 2.375 27.87-2.875l189.2-118.4C544.7 211.5 541.7 178.3 517.5 168.6zM565.9 273.8l-35.37-15.5l-138.4 86.5l119.5 52.51c8.5 3.75 18.46-.132 22.21-8.632l40.74-92.62c1.75-4.125 1.878-8.756 .2534-12.88C573.2 278.9 569.1 275.6 565.9 273.8z"></path></svg> | <svg height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentcolor" tabindex="-1" focusable="false" aria-hidden="true" role="img" class="ui-c-aIcSi ui-c-aIcSi-ckVrXY-size-regular ui-c-gulvcB"><path d="M96 32C96 14.33 110.3 0 128 0C145.7 0 160 14.33 160 32V64H288V32C288 14.33 302.3 0 320 0C337.7 0 352 14.33 352 32V64H400C426.5 64 448 85.49 448 112V160H0V112C0 85.49 21.49 64 48 64H96V32zM448 464C448 490.5 426.5 512 400 512H48C21.49 512 0 490.5 0 464V192H448V464z"></path></svg> |
| `cactus` | `clover` | `cameraCctv` | `calendar` |
|  |  |  |  |
| <svg height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentcolor" tabindex="-1" focusable="false" aria-hidden="true" role="img" class="ui-c-aIcSi ui-c-aIcSi-ckVrXY-size-regular ui-c-gulvcB"><path d="M160 25.4L14.86 146.4C5.452 131.6 0 114.1 0 95.24C0 42.64 42.64 0 95.24 0C120.2 0 143 9.638 160 25.4zM121.9 467.4L86.63 502.6C74.13 515.1 53.87 515.1 41.37 502.6C28.88 490.1 28.88 469.9 41.37 457.4L76.6 422.2C48.59 384.8 32 338.3 32 288C32 164.3 132.3 64 256 64C379.7 64 480 164.3 480 288C480 338.3 463.4 384.8 435.4 422.2L470.6 457.4C483.1 469.9 483.1 490.1 470.6 502.6C458.1 515.1 437.9 515.1 425.4 502.6L390.2 467.4C352.8 495.4 306.3 512 256 512C205.7 512 159.2 495.4 121.9 467.4zM280 184C280 170.7 269.3 160 256 160C242.7 160 232 170.7 232 184V288C232 294.4 234.5 300.5 239 304.1L287 352.1C296.4 362.3 311.6 362.3 320.1 352.1C330.3 343.6 330.3 328.4 320.1 319L280 278.1V184zM497.1 146.4L352 25.4C368.1 9.638 391.8 0 416.8 0C469.4 0 512 42.64 512 95.24C512 114 506.5 131.6 497.1 146.4z"></path></svg> | <svg height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentcolor" tabindex="-1" focusable="false" aria-hidden="true" role="img" class="ui-c-aIcSi ui-c-aIcSi-ckVrXY-size-regular ui-c-gulvcB"><path d="M288 256C288 273.7 273.7 288 256 288C238.3 288 224 273.7 224 256C224 238.3 238.3 224 256 224C273.7 224 288 238.3 288 256zM0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256zM325.1 306.7L380.6 162.4C388.1 142.1 369 123.9 349.6 131.4L205.3 186.9C196.8 190.1 190.1 196.8 186.9 205.3L131.4 349.6C123.9 369 142.1 388.1 162.4 380.6L306.7 325.1C315.2 321.9 321.9 315.2 325.1 306.7V306.7z"></path></svg> | <svg height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="currentcolor" tabindex="-1" focusable="false" aria-hidden="true" role="img" class="ui-c-aIcSi ui-c-aIcSi-ckVrXY-size-regular ui-c-gulvcB"><path d="M640 384.2c0-5.257-.4576-10.6-1.406-15.98l-33.38-211.6C591.4 77.96 522 32 319.1 32C119 32 48.71 77.46 34.78 156.6l-33.38 211.6c-.9487 5.383-1.406 10.72-1.406 15.98c0 51.89 44.58 95.81 101.5 95.81c49.69 0 93.78-30.06 109.5-74.64l7.5-21.36h203l7.5 21.36c15.72 44.58 59.81 74.64 109.5 74.64C595.4 479.1 640 436.1 640 384.2zM247.1 248l-31.96-.0098L215.1 280c0 13.2-10.78 24-23.98 24c-13.2 0-24.02-10.8-24.02-24l.0367-32.01L135.1 248c-13.2 0-23.98-10.8-23.98-24c0-13.2 10.77-24 23.98-24l32.04-.011L167.1 168c0-13.2 10.82-24 24.02-24c13.2 0 23.98 10.8 23.98 24l.0368 31.99L247.1 200c13.2 0 24.02 10.8 24.02 24C271.1 237.2 261.2 248 247.1 248zM432 311.1c-22.09 0-40-17.92-40-40c0-22.08 17.91-40 40-40s40 17.92 40 40C472 294.1 454.1 311.1 432 311.1zM496 215.1c-22.09 0-40-17.92-40-40c0-22.08 17.91-40 40-40s40 17.92 40 40C536 198.1 518.1 215.1 496 215.1z"></path></svg> | <svg height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentcolor" tabindex="-1" focusable="false" aria-hidden="true" role="img" class="ui-c-aIcSi ui-c-aIcSi-ckVrXY-size-regular ui-c-gulvcB"><path d="M480 288H32c-17.62 0-32 14.38-32 32v128c0 17.62 14.38 32 32 32h448c17.62 0 32-14.38 32-32v-128C512 302.4 497.6 288 480 288zM352 408c-13.25 0-24-10.75-24-24s10.75-24 24-24s24 10.75 24 24S365.3 408 352 408zM416 408c-13.25 0-24-10.75-24-24s10.75-24 24-24s24 10.75 24 24S429.3 408 416 408zM480 32H32C14.38 32 0 46.38 0 64v128c0 17.62 14.38 32 32 32h448c17.62 0 32-14.38 32-32V64C512 46.38 497.6 32 480 32zM352 152c-13.25 0-24-10.75-24-24S338.8 104 352 104S376 114.8 376 128S365.3 152 352 152zM416 152c-13.25 0-24-10.75-24-24S402.8 104 416 104S440 114.8 440 128S429.3 152 416 152z"></path></svg> |
| `alarmClock` | `compass` | `gamepadModern` | `server` |
|  |  |  |  |
| <svg height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentcolor" tabindex="-1" focusable="false" aria-hidden="true" role="img" class="ui-c-aIcSi ui-c-aIcSi-ckVrXY-size-regular ui-c-gulvcB"><path d="M496 127.1C496 381.3 309.1 512 255.1 512C204.9 512 16 385.3 16 127.1c0-19.41 11.7-36.89 29.61-44.28l191.1-80.01c4.906-2.031 13.13-3.701 18.44-3.701c5.281 0 13.58 1.67 18.46 3.701l192 80.01C484.3 91.1 496 108.6 496 127.1z"></path></svg> | <svg height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentcolor" tabindex="-1" focusable="false" aria-hidden="true" role="img" class="ui-c-aIcSi ui-c-aIcSi-ckVrXY-size-regular ui-c-gulvcB"><path d="M416 0H32C14.38 0 0 14.38 0 32L0 400c0 8.875 7.125 16 16 16h416c8.875 0 16-7.125 16-16V32C448 14.38 433.6 0 416 0zM80 356c-11 0-20-9-20-20S69 316 80 316s20 9 20 20S91 356 80 356zM383.1 344c0 4.375-3.625 8-8 8h-144c-4.375 0-8-3.625-8-8L224 328c0-4.375 3.625-8 8-8h144c4.375 0 8 3.625 8 8L383.1 344zM384 224c0 17.62-14.38 32-32 32H96C78.38 256 64 241.6 64 224V96c0-17.62 14.38-32 32-32h256c17.62 0 32 14.38 32 32V224zM32 512h384v-64H32V512z"></path></svg> | <svg height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentcolor" tabindex="-1" focusable="false" aria-hidden="true" role="img" class="ui-c-aIcSi ui-c-aIcSi-ckVrXY-size-regular ui-c-gulvcB"><path d="M495 225l-17.24 1.124c-5.25-39.5-20.76-75.63-43.89-105.9l12.1-11.37c6.875-6.125 7.25-16.75 .75-23.38L426.5 64.38c-6.625-6.5-17.25-6.125-23.38 .75l-11.37 12.1c-30.25-23.12-66.38-38.64-105.9-43.89L287 17C287.5 7.75 280.2 0 271 0h-30c-9.25 0-16.5 7.75-16 17l1.124 17.24c-39.5 5.25-75.63 20.76-105.9 43.89L108.9 65.13C102.8 58.25 92.13 57.88 85.63 64.38L64.38 85.5C57.88 92.12 58.25 102.8 65.13 108.9l12.1 11.37C54.1 150.5 39.49 186.6 34.24 226.1L17 225C7.75 224.5 0 231.8 0 241v30c0 9.25 7.75 16.5 17 16l17.24-1.124c5.25 39.5 20.76 75.63 43.89 105.9l-12.1 11.37c-6.875 6.125-7.25 16.75-.75 23.25l21.25 21.25c6.5 6.5 17.13 6.125 23.25-.75l11.37-12.1c30.25 23.12 66.38 38.64 105.9 43.89L225 495C224.5 504.2 231.8 512 241 512h30c9.25 0 16.5-7.75 16-17l-1.124-17.24c39.5-5.25 75.63-20.76 105.9-43.89l11.37 12.1c6.125 6.875 16.75 7.25 23.38 .75l21.12-21.25c6.5-6.5 6.125-17.13-.75-23.25l-12.1-11.37c23.12-30.25 38.64-66.38 43.89-105.9L495 287C504.3 287.5 512 280.2 512 271v-30C512 231.8 504.3 224.5 495 225zM281.9 98.68c24.75 4 47.61 13.59 67.24 27.71L306.5 174.6c-8.75-5.375-18.38-9.507-28.62-11.88L281.9 98.68zM230.1 98.68l3.996 64.06C223.9 165.1 214.3 169.2 205.5 174.6L162.9 126.4C182.5 112.3 205.4 102.7 230.1 98.68zM126.4 163l48.35 42.48c-5.5 8.75-9.606 18.4-11.98 28.65L98.68 230.1C102.7 205.4 112.2 182.5 126.4 163zM98.68 281.9l64.06-3.996C165.1 288.1 169.3 297.8 174.6 306.5l-48.23 42.61C112.3 329.5 102.7 306.6 98.68 281.9zM230.1 413.3c-24.75-4-47.61-13.59-67.24-27.71l42.58-48.33c8.75 5.5 18.4 9.606 28.65 11.98L230.1 413.3zM256 288C238.4 288 224 273.6 224 256s14.38-32 32-32s32 14.38 32 32S273.6 288 256 288zM281.9 413.3l-3.996-64.06c10.25-2.375 19.9-6.48 28.65-11.98l42.48 48.35C329.5 399.8 306.6 409.3 281.9 413.3zM385.6 349l-48.25-42.5c5.375-8.75 9.507-18.38 11.88-28.62l64.06 3.996C409.3 306.6 399.8 329.5 385.6 349zM349.3 234.1c-2.375-10.25-6.48-19.9-11.98-28.65L385.6 163c14.13 19.5 23.69 42.38 27.69 67.13L349.3 234.1z"></path></svg> | <svg height="16" viewBox="0 0 343 532" xmlns="http://www.w3.org/2000/svg" fill="currentcolor" tabindex="-1" focusable="false" aria-hidden="true" role="img" class="ui-c-aIcSi ui-c-aIcSi-ckVrXY-size-regular ui-c-gulvcB"><path fill-rule="evenodd" clip-rule="evenodd" d="M102.353 10C61.7698 10 28.7622 43.002 28.7622 83.591C28.7622 115.928 49.7169 143.363 78.7066 153.225V175.654C39.2234 186.121 10 222.072 10 264.85C10 307.834 39.5097 343.918 79.2824 354.187V378.562C49.9871 388.257 28.7622 415.859 28.7622 448.409C28.7622 488.998 61.7698 522 102.353 522C142.937 522 175.944 488.998 175.944 448.409C175.944 415.859 154.719 388.257 125.424 378.562V354.187C141.622 350.01 156.38 341.508 168.117 329.602L186.681 342.742C185.771 347.316 185.277 352.052 185.277 356.917C185.277 397.506 218.285 430.508 258.868 430.508C299.452 430.508 332.459 397.506 332.459 356.917C332.459 316.328 299.452 283.326 258.868 283.326C239.873 283.326 222.594 290.594 209.565 302.407L191.285 289.467C193.479 281.656 194.706 273.412 194.706 264.85C194.706 256.474 193.532 248.404 191.429 240.745L209.658 227.949C222.676 239.712 239.918 246.948 258.868 246.948C299.452 246.948 332.459 213.946 332.459 173.357C332.459 132.768 299.452 99.7662 258.868 99.7662C218.285 99.7662 185.277 132.768 185.277 173.357C185.277 178.275 185.779 183.066 186.708 187.691L168.471 200.491C156.721 188.435 141.699 179.602 124.848 175.374V153.651C154.449 144.127 175.944 116.35 175.944 83.591C175.944 43.002 142.937 10 102.353 10ZM80.4234 83.591C80.4234 71.5099 90.2683 61.6623 102.353 61.6623C114.438 61.6623 124.282 71.5095 124.282 83.591C124.282 95.6724 114.438 105.52 102.353 105.52C90.2684 105.52 80.4234 95.672 80.4234 83.591ZM236.94 173.357C236.94 161.275 246.784 151.427 258.868 151.427C270.952 151.427 280.797 161.275 280.797 173.357C280.797 185.439 270.953 195.286 258.868 195.286C246.784 195.286 236.94 185.439 236.94 173.357ZM68.1079 264.85C68.1079 245.976 83.4768 230.607 102.351 230.607C121.224 230.607 136.593 245.975 136.593 264.85C136.593 283.721 121.225 299.088 102.351 299.088C83.4756 299.088 68.1079 283.721 68.1079 264.85ZM236.94 356.917C236.94 344.835 246.784 334.988 258.868 334.988C270.953 334.988 280.797 344.835 280.797 356.917C280.797 368.999 270.952 378.846 258.868 378.846C246.784 378.846 236.94 368.999 236.94 356.917ZM80.4234 448.409C80.4234 436.328 90.2684 426.48 102.353 426.48C114.438 426.48 124.282 436.328 124.282 448.409C124.282 460.491 114.438 470.338 102.353 470.338C90.2683 470.338 80.4234 460.49 80.4234 448.409Z"></path></svg> |
| `shieldBlank` | `computerClassic` | `dharmachakra` | `kafka` |



## KafkaConnectCluster
Creates a Kafka Connect Cluster Definition in Console.

**API Keys:** <AdminToken />  
**Managed with:** <API /> <CLI /> <TF /> <GUI />  
**Labels support:** <PartialLabelSupport />

<Tabs>
<TabItem  value="CLI" label="CLI">

````yaml
---
apiVersion: console/v2
kind: KafkaConnectCluster
metadata:
  cluster: my-dev-cluster
  name: connect-1
spec:
  displayName: "Connect 1"
  urls: "http://localhost:8083"
  headers:
    X-PROJECT-HEADER: value
    AnotherHeader: test
  ignoreUntrustedCertificate: false
  security:
    type: "BasicAuth"
    username: "toto"
    password: "my-secret"
````

</TabItem>
<TabItem value="Terraform" label="Terraform">

````hcl
resource "conduktor_kafka_connect_v2" "connect-1" {
  name    = "connect-1"
  cluster = "my-dev-kafka-cluster"
  spec {
    display_name = "Connect 1"
    urls         = "http://localhost:8083"
    headers = {
      X-PROJECT-HEADER = "value"
      Cache-Control : "no-cache"
    }
    ignore_untrusted_certificate = false
    security = {
      type     = "BasicAuth"
      username = "toto"
      password = "my-secret"
    }
  }
}
````

</TabItem>
</Tabs>

**KafkaConnectCluster checks:**
- `metadata.cluster` must be a valid KafkaCluster name
- `spec.urls` must be a single URL of a Kafka Connect cluster
  - **Multiple URLs are not supported for now. Coming soon**
- `spec.ignoreUntrustedCertificate` (optional, default `false`) must be one of [`true`, `false`]
- `spec.headers` (optional) must be key-value pairs of HTTP Headers
- `spec.security.type` (optional) must be one of [`BasicAuth`, `BearerToken`, `SSLAuth`]
  - See [HTTP Security Properties](#http-security-properties) for the detailed list of options


## KsqlDBCluster
**API Keys:** <AdminToken />  
**Managed with:** <API /> <CLI /> <GUI />  
**Labels support:** <MissingLabelSupport />

Creates a ksqlDB Cluster Definition in Console.
````yaml
---
apiVersion: console/v2
kind: KsqlDBCluster
metadata:
  cluster: my-dev-cluster
  name: ksql-1
spec:
  displayName: "KSQL 1"
  url: "http://localhost:8088"
  ignoreUntrustedCertificate: false
  security:
    type: "BasicAuth"
    username: "toto"
    password: "my-secret"
````
**KafkaConnectCluster checks:**
- `metadata.cluster` must be a valid KafkaCluster name
- `spec.url` must be a single URL of a KsqlDB cluster
- `spec.ignoreUntrustedCertificate` (optional, default `false`) must be one of [`true`, `false`]
- `spec.headers` (optional) must be key-value pairs of HTTP Headers
- `spec.security.type` (optional) must be one of [`BasicAuth`, `BearerToken`, `SSLAuth`]
  - See [HTTP Security Properties](#http-security-properties) for the detailed list of options

## Alert

**API Keys:** <AdminToken />  
**Managed with:** <API /> <CLI /> <GUI />  
**Labels support:** <MissingLabelSupport />

Creates an Alert in Console. 

````yaml
---
apiVersion: console/v3
kind: Alert
metadata:
  name: messages-in-dead-letter-queue
  group: support-team # will be the owner of the alert, can be either a user, a group or an appInstance
  # user: user@company.org
  # appInstance: my-app-instance
spec:
  cluster: my-dev-cluster
  type: TopicAlert
  topicName: wikipedia-parsed-DLQ
  metric: MessageCount
  operator: GreaterThan
  threshold: 0
  destination:
    type: Slack
    channel: "alerts-p1"
````

**Alert checks:**
- `metadata.user`|`metadata.group`|`metadata.appInstance` must be a valid user, group or appInstance
- `metadata.destination.type` can be either `Slack`, `Teams` or `Webhook`
- `spec.cluster` must be a valid KafkaCluster name
- `spec.type` must be one of [`BrokerAlert`,`TopicAlert`,`KafkaConnectAlert`]
  - Check the section below for the additional mandatory fields needed for each `spec.type`
- `spec.metric` is depending on the `spec.type`
  - Check section below
- `spec.operator` must be one of [`GreaterThan`, `GreaterThanOrEqual`, `LessThan`, `LessThanOrEqual`, `NotEqual`]
- `spec.threshold` must be a number
- `spec.disable` (optional, default `false`) must be one of [`true`, `false`]

**When `spec.destination.type` is `Slack`**
- `spec.destination.channel` must be a valid Slack channel id

**When `spec.destination.type` is `Teams`**
- `spec.destination.url` must be a valid Teams webhook URL

**When `spec.destination.type` is `Webhook`**
- `spec.destination.url` must be a valid URL
- `spec.destination.method` must be one of [`GET`, `POST`, `PUT`, `DELETE`]
- `spec.destination.headers` (optional) must be key-value pairs of HTTP Headers
- `spec.destination.authentification.type` (optional) must be one of [`BasicAuth`, `BearerToken`]
  - when is `BasicAuth` `spec.destination.authentification.username` and `spec.destination.authentification.password` must be set
  - when is `BearerToken` `spec.destination.authentification.token` must be set

**When `spec.type` is `BrokerAlert`**
- `spec.metric` must be one of [`MessageIn`, `MessageOut`, `MessageSize`, `OfflinePartitionCount`, `PartitionCount`, `UnderMinIsrPartitionCount`, `UnderReplicatedPartitionCount`]

**When `spec.type` is `TopicAlert`**
- `spec.metric` must be one of [`MessageCount`, `MessageIn`, `MessageOut`, `MessageSize`]
- `spec.topicName` must be a Kafka Topic that the owner can access

**When `spec.type` is `KafkaConnectAlert`**
- `spec.metric` must be `FailedTaskCount`
- `spec.connectName` must be a valid KafkaConnect Cluster associated to this `spec.cluster` Kafka Cluster
- `spec.connectorName` must be a Kafka Connect Connector that the owner can access

**When `spec.type` is `ConsumerGroupAlert`**
- `spec.metric` must be one of [`OffsetLag`, `TimeLag`]
- `spec.consumerGroupName` must be a Kafka Consumer Group that the owner can access

## DataMaskingPolicy

:::caution Not implemented yet
This concept will be available in a future version
:::

## Partner Zone

**API Keys:** <AdminToken />  
**Managed with:** <API /> <CLI /> <GUI />  
**Labels support:** <PartialLabelSupport />

Create or update a [Partner Zone](/platform/navigation/partner-zones/).

```yaml
---
apiVersion: console/v2
kind: PartnerZone
metadata:
  name: external-partner-zone
spec:
  displayName: External Partner Zone
  description: An external partner to exchange data with.
  url: https://partner1.com
  partner:
    name: John Doe
    role: Data analyst
    email: johndoe@partner.io
    phone: 07827 837 177
  cluster: cdk-gateway
  serviceAccount: partner-external-partner
  topics:
    - name: topic-a
      backingTopic: kafka-topic-a
      permission: WRITE
    - name: topic-b
      backingTopic: kafka-topic-a
      permission: READ
  trafficControlPolicies:
    maxProduceRate: 1e+06
    maxConsumeRate: 1e+06
    limitCommitOffset: 30
```

**Partner Zone checks:**
- `spec.displayName` is Mandatory
- `spec.description`, `spec.url` and `spec.partner` are **optional** context informations.
- `spec.cluster` must be a valid Console cluster technical id **with the Provider** configured as `Gateway`.
- `spec.serviceAccount` must be a Local Gateway Service Account. It doesn't need to exist before creating the Partner Zone. The service account will be created automatically.
- `topics[].name` is the name of the topic as it should appear to your partner. This can be different from `backingTopic`.
- `topics[].backingTopic` is the internal name of the topic that you want to share with your partner.
- `topics[].permission` must be set to either `READ` or `WRITE` (which additionally grants `READ`).
- `trafficControlPolicies.maxProduceRate` is **optional**. Sets the maximum rate (in bytes/s) at which the partner can produce messages to the topics per Gateway node.
- `trafficControlPolicies.maxConsumeRate` is **optional**. Sets the maximum rate (in bytes/s) at which the partner can consume messages from the topics per Gateway node.
- `trafficControlPolicies.limitCommitOffset` is **optional**. Sets the maximum number of commits requests (in requests/minute) that the partner can make per Gateway node.

**Side effect in Console & Kafka:**  
Upon creation or update, the following fields will be available:
- `metadata.updatedAt` field will be made available by consecutive get from the CLI/API.
- `metadata.status` field will be made available by consecutive get from the CLI/API. Possible values are `PENDING`, `READY` or `FAILED`.
- `metadata.failedReason` field will be populated in case of `FAILED` status.
- The service account will be created if it doesn't exist and will be granted the permissions as declared in `spec.topics`
- The traffic control policies will be applied to the service account.

## HTTP Security Properties

HTTP Security Properties are used in KafkaCluster ([Schema Registry](#confluent-or-confluent-like-registry)), [KafkaConnect](#kafkaconnectcluster), [KsqlDBCluster](#ksqldbcluster)
### Basic Authentication
````yaml
  security:
    type: "BasicAuth"
    username: "toto"
    password: "my-secret"
````
### Bearer Token
````yaml
  security:
    type: "BearerToken"
    token: "toto"
````
### mTLS / Client Certificate
````yaml
  security:
    type: "SSLAuth"
    key: |
      -----BEGIN PRIVATE KEY-----
      MIIOXzCCDUegAwIBAgIRAPRytMVYJNUgCbhnA+eYumgwDQYJKoZIhvcNAQELBQAw
      ...
      IFyCs+xkcgvHFtBjjel4pnIET0agtbGJbGDEQBNxX+i4MDA=
      -----END PRIVATE KEY-----
    certificateChain: |
      -----BEGIN CERTIFICATE-----
      MIIOXzCCDUegAwIBAgIRAPRytMVYJNUgCbhnA+eYumgwDQYJKoZIhvcNAQELBQAw
      RjELMAkGA1UEBhMCVVMxIjAgBgNVBAoTGUdvb2dsZSBUcnVzdCBTZXJ2aWNlcyBM
      ...
      8/s+YDKveNdoeQoAmGQpUmxhvJ9rbNYj+4jiaujkfxT/6WtFN8N95r+k3W/1K4hs
      IFyCs+xkcgvHFtBjjel4pnIET0agtbGJbGDEQBNxX+i4MDA=
      -----END CERTIFICATE-----
````


## Permissions

Permissions are used in [Groups](#consolegroup) and [Users](#consoleuser) and lets you configure all the access to any Kafka resource or Console feature.

A permission applies to a certain `resourceType`, which affect the necessary fields as detailed below.

- [Topic Permissions](#topic-permissions)
- [Subject Permissions](#subject-permissions)
- [ConsumerGroup Permissions](#consumergroup-permissions)
- [Cluster Permissions](#cluster-permissions)
- [KafkaConnect Permissions](#kafkaconnect-permissions)
- [KsqlDB Permissions](#ksqldb-permissions)
- [Platform Permissions](#platform-permissions)

### Topic Permissions
````yaml
# Grants Consume, Produce and View Config to all topics toto-* on shadow-it cluster
- resourceType: TOPIC
  cluster: shadow-it
  patternType: PREFIXED
  name: toto-
  permissions:
    - topicViewConfig
    - topicConsume
    - topicProduce
````

- `resourceType`: `TOPIC`
- `cluster` is a valid Kafka cluster
- `patternType` is either `PREFIXED` or `LITERAL`
- `name` is the name of the topic or topic prefix to apply the permissions to
- `permissions` is a list of valid topic permissions (See Table)

| Available Topic Permissions | Description |
|-----------------------------|--------|
| `topicConsume`              | Permission to consume messages from the topic. |
| `topicProduce`              | Permission to produce (write) messages to the topic. |
| `topicViewConfig`           | Permission to view the topic configuration. |
| `topicEditConfig`           | Permission to edit the topic configuration. |
| `topicCreate`               | Permission to create a new topic. |
| `topicDelete`               | Permission to delete the topic. |
| `topicAddPartition`         | Permission to add partitions to the topic. |
| `topicEmpty`                | Permission to empty (delete all messages from) the topic. |


### Subject Permissions
````yaml
# Grants View and Edit Compatibility to all subjects starting with sub-* on shadow-it cluster
- resourceType: SUBJECT
  cluster: shadow-it
  patternType: PREFIXED
  name: sub-
  permissions:
    - subjectView
    - subjectEditCompatibility
````

- `resourceType`: `SUBJECT`
- `cluster` is a valid Kafka cluster
- `patternType` is either `PREFIXED` or `LITERAL`
- `name` is the name of the subject or subject prefix to apply the permissions to
- `permissions` is a list of valid subject permissions (See Table)

| Available Subject Permissions      | Description |
|------------------------------------|--------|
| `subjectCreateUpdate`              | Permission to create or update the subject. |
| `subjectDelete`                    | Permission to delete the subject. |
| `subjectEditCompatibility`         | Permission to edit the subject compatibility settings. |
| `subjectView`                      | Permission to view the subject details. |

### ConsumerGroup Permissions
````yaml
# Grants View and Reset on all consumer groups starting with group-* on shadow-it cluster
- resourceType: CONSUMER_GROUP
  cluster: shadow-it
  patternType: PREFIXED
  name: group-
  permissions:
    - consumerGroupView
    - consumerGroupReset
````

- `resourceType`: `CONSUMER_GROUP`
- `cluster` is a valid Kafka cluster
- `patternType` is either `PREFIXED` or `LITERAL`
- `name` is the name of the consumer group or consumer group prefix to apply the permissions to
- `permissions` is a list of valid consumer group permissions (See Table)

| Available ConsumerGroup Permissions | Description |
|-------------------------------------|--------|
| `consumerGroupCreate`               | Permission to create a new consumer group. |
| `consumerGroupReset`                | Permission to reset the consumer group. |
| `consumerGroupDelete`               | Permission to delete the consumer group. |
| `consumerGroupView`                 | Permission to view the consumer group details. |

### Cluster Permissions
```yaml
# Grants View Broker, Edit Schema Registry Compatibility, Edit Broker, View ACL, and Manage ACL on shadow-it cluster
- resourceType: CLUSTER
  name: shadow-it
  permissions:
    - clusterViewBroker
    - clusterEditSRCompatibility
    - clusterEditBroker
    - clusterViewACL
    - clusterManageACL
```

- `resourceType`: `CLUSTER`
- `name` is the name of the cluster to apply the permissions to
  - Use `*` for all clusters
- `permissions` is a list of valid cluster permissions (See Table)

| Available Cluster Permissions | Description |
|-------------------------------|--------|
| `clusterViewBroker`           | Permission to view broker details. |
| `clusterEditSRCompatibility` | Permission to edit Schema Registry compatibility settings. |
| `clusterEditBroker`          | Permission to edit broker configuration. |
| `clusterViewACL`             | Permission to view Access Control Lists (ACLs) for the cluster. |
| `clusterManageACL`           | Permission to manage Access Control Lists (ACLs) for the cluster. |


### KafkaConnect Permissions
```yaml
# Grants Create and Delete on all connectors starting with connector-* on shadow-it cluster and kafka-connect-cluster
- resourceType: KAFKA_CONNECT
  cluster: shadow-it
  kafkaConnect: kafka-connect-cluster
  patternType: PREFIXED
  name: connector-
  permissions:
    - kafkaConnectorCreate
    - kafkaConnectorDelete
```

- `resourceType`: `KAFKA_CONNECT`
- `cluster` is a valid Kafka cluster
- `kafkaConnect` is a valid Kafka Connect cluster
- `patternType` is either `PREFIXED` or `LITERAL`
- `name` is the name of the connector or connector prefix to apply the permissions to
- `permissions` is a list of valid Kafka Connect permissions (See Table)

| Available KafkaConnect Permissions | Description |
|------------------------------------|--------|
| `kafkaConnectorViewConfig`         | Permission to view the Kafka Connect configuration. |
| `kafkaConnectorStatus`             | Permission to view the status of Kafka Connect connectors. |
| `kafkaConnectorEditConfig`         | Permission to edit the Kafka Connect configuration. |
| `kafkaConnectorDelete`             | Permission to delete connectors. |
| `kafkaConnectorCreate`             | Permission to create new connectors. |
| `kafkaConnectPauseResume`          | Permission to pause and resume connectors. |
| `kafkaConnectRestart`              | Permission to restart connectors. |


### KsqlDB Permissions
```yaml
# Grants all permissions on KsqlDB cluster ksql-cluster
- resourceType: KSQLDB
  cluster: shadow-it
  ksqlDB: ksql-cluster
  permissions:
    - ksqldbAccess
```

- `resourceType`: `KSQLDB`
- `cluster` is a valid Kafka cluster
- `ksqlDB` is a valid Kafka Connect cluster
- `permissions` is a list of valid KsqlDB permissions (See Table)

| Available KafkaConnect Permissions | Description                                                                          |
|------------------------------------|--------------------------------------------------------------------------------------|
| `ksqldbAccess`         | Grants all permissions on the KsqlDB Cluster. |


### Platform Permissions
```yaml
# Grants Platform permissions
- resourceType: PLATFORM
  permissions:
    - userView
    - datamaskingView
```

- `resourceType`: `PLATFORM`
- `permissions` is a list of valid Platform permissions

| Available Platform permissions | Description |
|------------------------------------|---------------------------------------------------------------|
| `clusterConnectionsManage`         | Permission to add / edit / remove Kafka clusters on Console   |
| `certificateManage`                | Permission to add / edit / remove TLS Certificates on Console |
| `userManage`                       | Permission to manage Console users, groups & permissions      |
| `userView`                         | Permission to view Console users, groups & permissions        |
| `datamaskingManage`                | Permission to manage Data policies (masking rules)            |
| `datamaskingView`                  | Permission to view Data policies                              |
| `notificationChannelManage`        | Permission to manage Integration channels                     |
| `notificationChannelView`          | Permission to view Integration channels                       |
| `auditLogView`                     | Permission to browse audit log                                |
| `taasView`                         | Permission to view Application Catalog                        | 
