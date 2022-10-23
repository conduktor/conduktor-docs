---
sidebar_position: 2
---

# Docker Quick Start

Get started with the latest Conduktor Platform Docker image in just a few minutes.

Conduktor depends on a configuration file `platform-config.yaml`. This is used to setup your oganizations environment. The file is used to declare:
 - Cluster configurations
 - User authentication (Basic or SSO)

## Create a Configuration File

The below example shows how to configure Conduktor with a `SASL_SSL` Kafka cluster and Schema Registry. 

**Update the bootstrap server, cluster configuration properties, organization name and user credentials.**

For more examples, see [YAML snippets](#somewhere).

```
organization:
  name: default

clusters:
  - id: cluster-id
    name: My Kafka Cluster
    color: "#E70000"
    ignoreUntrustedCertificate: false
    bootstrapServers: "your-bootstrap-server:9092"
    properties: |
      security.protocol=SASL_SSL
      sasl.mechanism=PLAIN
      sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule   required username='username'   password='password';
    schemaRegistry:
      id: confluent-sr
      url: "http://your-schema-registry:8081"
      ignoreUntrustedCertificate: false
      security:
        username: "username"
        password: "password"
    labels: {}

auth:
  demo-users:
    - email: admin@conduktor.io
      password: admin
      groups:
        - ADMIN
```

## Launch Conduktor

Run the below command in the directory containing your `platform-config.yaml` file.

### MacOS / Linux

```
docker run --rm \
  -p "8080:8080" \
  --mount "type=bind,source=$PWD/platform-config.yaml,target=/opt/conduktor/default-platform-config.yaml" \
conduktor/conduktor-platform:1.1.3
```

### Windows

```
docker run --rm `
  -p "8080:8080" `
  --mount "type=bind,source=$pwd/platform-config.yaml,target=/opt/conduktor/default-platform-config.yaml" `
conduktor/conduktor-platform:1.1.3
```

## Access Conduktor

After a few minutes, **Conduktor will be available at [http://localhost:8080](http://localhost:8080)**

Use the credentials **specified in the YAML** file to login. If you did not change the default credentials, you should use:
```
User: admin@conduktor.io
Password: admin
```