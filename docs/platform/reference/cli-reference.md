---
sidebar_position: 3
title: CLI Reference
description: Prometheus metrics available for Console
---
# CLI Reference

Conduktor CLI gives your the ability to perform some operations directly from your command line or a CI/CD pipeline.  
Check for the list of supported resources and their definition below.

## Install & Configure

You have 2 options to Install Conduktor CLI.
- Native binary for individual use and testing
- Docker build for integration in CI/CD pipelines

### Native binary
Download Conduktor CLI from the [Releases page on GitHub](https://github.com/conduktor/ctl/releases).  
In the Assets lists, download the build that corresponds to your machine (`darwin-arm64` for Apple Silicon)

### Docker
````
docker pull conduktor/conduktor-ctl
````

### Configure

To use Conduktor CLI, you need to define 2 environment variables:

-   The URL of Conduktor Console
-   Your API token (either a User Token or Application Token)

These variables can be defined in a dedicated Configuration file or by Environment.

If you define both, Environment takes precedence


Alternatively, you can set the following Environment Variables
````yaml
CDK_TOKEN=<admin-token>
CDK_BASE_URL=http://localhost:8080/public/v1
````
## Commands Usage
````
Usage: conduktor [-hvV] [COMMAND]

Description:

These are common Kafkactl commands.

Options:
  -h, --help      Show this help message and exit.
  -v, --verbose   Enable the verbose mode.
  -V, --version   Print version information and exit.

Commands:
  apply             Create or update a resource.
  delete            Delete a resource.
  diff              Get differences between a new resource and a old resource.
  get               Get resources by resource type for the current namespace.
  actions           empty topic, reset offsets, restart connectors, ...
````


### Apply

The `apply` command allows you to deploy any resource.

    Usage: conduktor apply [-hRvV] [--dry-run] [-f=<file>] [-n=<optionalNamespace>]

    Description:

    Create or update a resource.

    Options:
          --dry-run       Does not persist resources. Validate only.
      -f, --file=<file>   YAML file or directory containing resources.
      -h, --help          Show this help message and exit.
      -R, --recursive     Search file recursively.
      -v, --verbose       Enable the verbose mode.
      -V, --version       Print version information and exit.

Example:

    # topics.yml
    ---
    apiVersion: v1
    kind: Topic
    metadata:
      name: abc.myTopic
    spec:
      replicationFactor: 1
      partitions: 3
      configs:
        min.insync.replicas: 1
        cleanup.policy: delete
        retention.ms: 604800000
    ---
    apiVersion: v1
    kind: Topic
    metadata:
      name: abcd.myTopicWrong
    spec:
      replicationFactor: 1
      partitions: 3
      configs:
        min.insync.replicas: 1
        cleanup.policy: delete
        retention.ms: 604800000

    julien@macbook ~ % conduktor apply -f topic.yml --dry-run
    Dry run execution.
    Topic "abc.myTopic" created.
    Topic "abcd.myTopicWrong" failed because invalid topic abcd.mytopicwrong (422):
     - Namespace not owner of this topic abcd.myTopicWrong.

### Delete

The `delete` command allows you to delete a resource.

Please note that the resources are deleted instantly and cannot be recovered once deleted. Any data or access associated with the resource is permanently lost.

    Usage: conduktor delete [-hvV] [--dry-run] [-n=<optionalNamespace>] ([<resourceType> <name>] | [[-f=<file>] [-R]])

    Description:

    Delete a resource.

    Parameters:
          <resourceType>   Resource type.
          <name>           Resource name.

    Options:
          --dry-run        Does not persist operation. Validate only.
      -f, --file=<file>    YAML file or directory containing resources.
      -h, --help           Show this help message and exit.
      -R, --recursive      Search file recursively.
      -v, --verbose        Enable the verbose mode.
      -V, --version        Print version information and exit.

Example(s):

    conduktor delete -f ./directoryOfResources
    conduktor delete -f resource.yml
    conduktor delete topic myTopic

### Diff

The `diff` command allows you to compare a new YAML descriptor with the current one deployed in, allowing you to easily identify any differences.

    Usage: conduktor diff [-hRvV] [-f=<file>] [-n=<optionalNamespace>]

    Description:

    Get differences between a new resource and a old resource.

    Options:
      -f, --file=<file>   YAML file or directory containing resources.
      -h, --help          Show this help message and exit.
      -n, --namespace=<optionalNamespace>
                          Override namespace defined in config or YAML resources.
      -R, --recursive     Search file recursively.
      -v, --verbose       Enable the verbose mode.
      -V, --version       Print version information and exit.

Example(s):

    conduktor diff -f resource.yml

### Get

The `get` command allows you to retrieve information about one or multiple resources.

    Usage: conduktor get [-hvV] [-n=<optionalNamespace>] [-o=<output>] <resourceType> [<resourceName>]

    Description:

    Get resources by resource type for the current namespace.

    Parameters:
          <resourceType>      Resource type or 'all' to display resources of all types.
          [<resourceName>]    Resource name.

    Options:
      -h, --help              Show this help message and exit.
      -o, --output=<output>   Output format. One of: yaml|table
      -v, --verbose           Enable the verbose mode.
      -V, --version           Print version information and exit.

-   `resourceType`: This option specifies one of the managed resources: `topic`, `connector`, `acl`, `schema`, `stream` or `all` to fetch all the resources.
-   `resourceName`: This option specifies the name of the resource to consult.

Example(s):

    ## List all resources
    julien@macbook-pro-de-julien .docker % java -jar kafkactl-1.11.1.jar get all -n myNamespace
    ACL                  GRANTED_BY   GRANTED_TO   TYPE             RESOURCE  PATTERN   PERMISSION  AGE
    myTopicAcl           myNamespace  myNamespace  TOPIC            abc.      PREFIXED  OWNER       il y a 13 minutes
    myConnectAcl         myNamespace  myNamespace  CONNECT          abc.      PREFIXED  OWNER       il y a 13 minutes
    myGroupAcl           myNamespace  myNamespace  GROUP            abc.      PREFIXED  OWNER       il y a 13 minutes

    QUOTA  COUNT/TOPICS  COUNT/PARTITIONS  DISK/TOPICS  COUNT/CONNECTORS  USER/CONSUMER_BYTE_RATE  USER/PRODUCER_BYTE_RATE
           1             3                 0B           0                 102400.0B/s              102400.0B/s

    TOPIC        RETENTION  POLICY  AGE
    abc.myTopic  7d         delete  4 minutes ago


    ## Display a topic (Table view)
    julien@macbook ~ % conduktor get topic abc.myTopic
    TOPIC        RETENTION  POLICY  CREATED
    abc.myTopic  7d         delete  5 minutes ago



    ## Display a topic (as YAML)
    julien@macbook ~ % conduktor get topic abc.myTopic -o yaml
    ---
    apiVersion: v1
    kind: Topic
    metadata:
      cluster: local
      creationTimestamp: 2023-12-01T23:40:38.457Z
      labels: null
      name: abc.myTopic
      namespace: myNamespace
    spec:
      replicationFactor: 1
      partitions: 3
      configs:
        min.insync.replicas: '1'
        cleanup.policy: delete
        retention.ms: '604800000'

    conduktor get all
    conduktor get topics
    conduktor get topic myTopic

# Resources

## Admin resources

### Cluster

```
---
apiVersion: "v1"
kind: "Cluster"
meta:
  name: "shadow-it"
spec:
  description: "Julien's Cloud"
  bootstrapServers: "redpanda-0:9092"
  ignoreUntrustedCertificate: false
  properties: ""
  schemaRegistry:
    type: "Confluent" # [Confluent | Glue]
    url: "http://redpanda-0:18081"
  kafkaConnects:
    - technical-id: "my-kafka-connector"
      name: "My Kafka Connector"
      url: "http://localhost:8083/"
      security:
        type: "BasicAuth" # [BasicAuth | SSL | ...]
        username": "test"
        password": "test"
  kafkaFlavor:
    type: "Confluent"
    key: "7TQIUZNLNOXV5PUL"
    secret: "IwBiUhCKvV6FBD8k...YFrOnqXmYIAZPTgu"
    confluentEnvironmentId: "env-k5nmg"
    confluentClusterId: "lkc-w5rpmw"

```

### Group

### Application

    # Application
    ---
    apiVersion: "v1"
    kind: "Application"
    meta:
      name: "ClickstreamApp"
      annotations:
        gitops-managed: true
    spec:
      owner: "groupA"            # technical-id of Console Group

-   `spec.owner` must be a valid Console Group
    -   Should we now prevent deleting groups linked with SelfServe, interesting idea ??

### Application Instance

    ---
    apiVersion: "v1"
    kind: "AppInstance"
    meta:
      name: "ClickstreamApp-Dev"
    spec:
      application: "ClickstreamApp"
      cluster: "shadow-it"
      service-account: "sa-clicko"

-   `spec.application` is a valid Application
-   `spec.cluster` is a valid Console Cluster technical id
-   `spec.service-account` is unique (the tuple `cluster` / `service-account`)
    -   Confluent Cloud reuse the same SA across clusters
    -   Let's not worry about creating the SA for now
-   The tuple `application/cluster/service-account` is immutable after creation
    -   Reject update

### Application Permission

    # Application Ownership Permissions
    ---
    apiVersion: v1
    kind: "AppPermission"
    metadata:
      name: ClickstreamApp-Dev-XXX
    spec:
      resourceType: TOPIC
      resource: "click."
      resourcePatternType: PREFIXED
      permission: OWNER
      grantedTo: "ClickstreamApp-Dev"
    ---
    apiVersion: v1
    kind: "AppPermission"
    metadata:
      name: ClickstreamApp-Dev-YYY
    spec:
      resourceType: GROUP
      resource: "click."
      resourcePatternType: PREFIXED
      permission: OWNER
      grantedTo: "ClickstreamApp-Dev"
    ---

-   `spec.resourceType` can be `TOPIC`, `GROUP`, `CONNECT`, or `CONNECT_CLUSTER`.
-   `spec.resourcePatternType` can be `PREFIXED` or `LITERAL`.
-   `spec.permission` can be `READ` or `WRITE`.
-   `spec.grantedTo` must reference a namespace on the same Kafka cluster as yours.
-   `spec.resource` must reference any “sub-resource” that you own. For example, if you are owner of the prefix “aaa”, you can grant READ or WRITE access to:
    -   the whole prefix: “aaa”
    -   a sub prefix: “aaa_subprefix”
    -   a literal topic name: “aaa_myTopic”

## User resources

### Topic

    ---
    apiVersion: v1
    kind: Topic
    metadata:
      name: myPrefix.topic
      labels:
          key: value
      annotations:
          conduktor/access: public
    spec:
      replicationFactor: 3
      partitions: 3
      configs:
        min.insync.replicas: '2'
        cleanup.policy: delete
        retention.ms: '60000'

-   The `metadata.name` field must be part of your allowed ACLs. Visit your namespace's ACLs to understand which topics you are allowed to manage.
-   The validation of `spec` properties, and especially `spec.config` properties, depends on the topic validation rules associated with your application.
-   `spec.replicationFactor` and `spec.partitions` are immutable and cannot be modified once the topic is created.

### Cross Application Permission

To provide access to your topics to another Application Instance, you can add an Access Control List (ACL) using the following example, where "daaagbl0" is your namespace and "dbbbgbl0" is the namespace that needs access to your topics:

    # Permission granted by other Applications
    ---
    apiVersion: v1
    kind: "AppPermission"
    metadata:
      name: ClickstreamApp-Dev-ZZZ
    spec:
      resourceType: TOPIC
      resource: "appB.orders"
      resourcePatternType: LITERAL
      permission: READ
      grantedTo: "ClickstreamApp-Dev"
    ---
    ---
    apiVersion: v1
    kind: AccessControlEntry
    metadata:
      name: acl-topic-a-b
      namespace: daaagbl0
    spec:
      resourceType: TOPIC
      resource: aaa.your-topic
      resourcePatternType: LITERAL
      permission: READ
      grantedTo: asking-customer

Here are some points to keep in mind:

-   `spec.resourceType` can be `TOPIC`, `GROUP`, `CONNECT`, or `CONNECT_CLUSTER`.
-   `spec.resourcePatternType` can be `PREFIXED` or `LITERAL`.
-   `spec.permission` can be `READ` or `WRITE`.
-   `spec.grantedTo` must reference a namespace on the same Kafka cluster as yours.
-   `spec.resource` must reference any “sub-resource” that you own. For example, if you are owner of the prefix “aaa”, you can grant READ or WRITE access to:
    -   the whole prefix: “aaa”
    -   a sub prefix: “aaa_subprefix”
    -   a literal topic name: “aaa_myTopic”

### Connector

    ---
    apiVersion: v1
    kind: Connector
    metadata:
      name: myPrefix.myConnector
      connectCluster: myConnectCluster
      annotations:
        conduktor/auto-restart: yes
    spec:
        connector.class: myConnectorClass
        tasks.max: '1'
      config:
        topics: myPrefix.myTopic
        file: /tmp/output.out
        consumer.override.sasl.jaas.config: o.a.k.s.s.ScramLoginModule required username="<user>" password="<password>";

-   `spec.connectCluster` must refer to one of the Kafka Connect clusters authorized in your namespace. It can also refer to a Kafka Connect cluster that you have self-deployed or have been granted access to.
-   Everything else depend on the connect validation rules associated to your namespace.

### Schema

The `Schema` resource allows you to declare subjects for your schemas. You can either reference a local `avsc` file with `spec.schemaFile`, or define your schema directly inline with `spec.schema`.

**Local file**

    ---
    apiVersion: v1
    kind: Schema
    metadata:
      name: myPrefix.topic-value # your subject name
    spec:
      schemaFile: schemas/topic.avsc # relative to kafkactl binary

**Inline**

    ---
    apiVersion: v1
    kind: Schema
    metadata:
      name: myPrefix.topic-value
    spec:
      schema: |
        {
          "type": "long"
        }

**References**

If your schema references a type that is already stored in the Schema Registry, you can do the following:

    ---
    apiVersion: v1
    kind: Schema
    metadata:
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
      references:
        - name: "com.schema.avro.Address"
          subject: "commons.address-value"
          version: 1

This example assumes that a subject named `commons.address-value` with version 1 is already available in the Schema Registry.

!! Your schema's permissions are inherited from your topic's permissions. If you are allowed to create a topic `myPrefix.topic`, then you are automatically allowed to create the subjects `myPrefix.topic-key` and `myPrefix.topic-value`.

-

# Integrate Conduktor CLI with your CI/CD

Conduktor CI can be easily added to a CI/CD pipeline using the Docker images on Docker Hub.

This example presents 2 pipelines.

The first one triggers on each new PR and launches the CLI using the `--dry-run` flag, generating a report confirming that the resources can be successfully created or modified.

The second one triggers on a push to the `main` branch, making the changes live.

Consider the following folder structure:

    ├── resources/
    │   ├── topics.yml          # Your topics are there
    |   ├── permissions.yml     # Your permissions to other Apps are there

## Github Actions

    # ├── .github/
    # │   ├── workflows/
    # │   |   ├── on-pr.yml
    # │   |   ├── on-push.yml
    # File: .github/workflows/on-pr.yml
    name: Check PR Validity
    on:
      pull_request:
        branches: [ "main" ]
      workflow_dispatch:
    jobs:
      build:
        runs-on: ubuntu-latest
        container: conduktor/conduktor-cli:latest
        steps:
          - uses: actions/checkout@v3
          - run: conduktor-cli apply -f resources/ --dry-run
            env:
              CONDUKTOR_API: https://conduktor.domain.com
              CONDUKTOR_USER_TOKEN: ${{ secrets.CONDUKTOR_TOKEN }}

    # File: .github/workflows/on-push.yml
    name: Execute Commited Changes
    on:
      push:
        branches: [ "main" ]
    jobs:
      build:
        runs-on: ubuntu-latest
        container: conduktor/conduktor-cli:latest
        steps:
          - uses: actions/checkout@v3
          - run: conduktor-cli apply -f resources/
            env:
              CONDUKTOR_API: https://conduktor.domain.com
              CONDUKTOR_USER_TOKEN: ${{ secrets.CONDUKTOR_TOKEN }}

## Gitlab CI

    # File: .gitlab-ci.yml
    conduktor-pr:
      only:
        - merge_requests
      stage: check
      image:
        name: conduktor/conduktor-cli
      before_script:
        - export CONDUKTOR_API=https://conduktor.domain.com
        - export CONDUKTOR_USER_TOKEN=${CONDUKTOR_TOKEN}
      script:
        - conduktor-cli apply -f resources/ --dry-run

    conduktor-main:
      only:
        refs:
          - master
      stage: deploy
      image:
        name: conduktor/conduktor-cli
      before_script:
        - export CONDUKTOR_API=https://conduktor.domain.com
        - export CONDUKTOR_USER_TOKEN=${CONDUKTOR_TOKEN}
      script:
        - conduktor-cli apply -f resources/

# Examples

## List all resources for your Application Instance

```
conduktor get all -n myNamespace
ACL                  GRANTED_BY   GRANTED_TO   TYPE             RESOURCE  PATTERN   PERMISSION  AGE
myTopicAcl           myNamespace  myNamespace  TOPIC            abc.      PREFIXED  OWNER       il y a 13 minutes
myConnectAcl         myNamespace  myNamespace  CONNECT          abc.      PREFIXED  OWNER       il y a 13 minutes
myGroupAcl           myNamespace  myNamespace  GROUP            abc.      PREFIXED  OWNER       il y a 13 minutes

QUOTA  COUNT/TOPICS  COUNT/PARTITIONS  DISK/TOPICS  COUNT/CONNECTORS  USER/CONSUMER_BYTE_RATE  USER/PRODUCER_BYTE_RATE
       1             3                 0B           0                 102400.0B/s              102400.0B/s

TOPIC        RETENTION  POLICY  AGE
abc.myTopic  7d         delete  il y a 4 minutes

```

          
