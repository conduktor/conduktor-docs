---
sidebar_position: 3
title: CLI Reference
description: Prometheus metrics available for Console
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# CLI Reference

Conduktor CLI gives you the ability to perform some operations directly from your command line or a CI/CD pipeline.  
Check for the list of supported resources and their definition below.
- [Platform Team Resources](#platform-team-resources)
  - [Application](#application)
  - [ApplicationInstance](#application-instance)
  - [TopicPolicy](#topic-policy)
- [Application Team Resources](#application-team-resources)
  - [Cross Application Permissions](#cross-application-permissions)
  - [Topic](#topic)

## Install & Configure

You have 2 options to Install Conduktor CLI.
- Native binary for individual use and testing
- Docker build for integration in CI/CD pipelines

### Native binary
**From Github (Windows, Linux, MacOS)**  
Download Conduktor CLI from the [Releases page on GitHub](https://github.com/conduktor/ctl/releases).  
In the Assets lists, download the build that corresponds to your machine (`darwin-arm64` for Apple Silicon)  
  
**Brew (MacOS)**
````
brew install conduktor/brew/conduktor-cli
````
### Docker
````
docker pull conduktor/conduktor-ctl
````

### Configure

To use Conduktor CLI, you need to define 2 environment variables:
- The URL of Conduktor Console
- Your API Key (either an [Admin API Key](/platform/navigation/settings/api-key/) or Application Token)
````yaml
export CDK_BASE_URL=http://localhost:8080
export CDK_TOKEN=<admin-token>
````

## Commands Usage
````
Usage:
  conduktor [command]

Available Commands:
  apply       upsert a resource on Conduktor
  completion  Generate the autocompletion script for the specified shell
  delete      delete resource of a given kind and name
  get         get resource of a given kind
  help        Help about any command
  version     display the version of conduktor

Flags:
  -h, --help      help for conduktor
  -v, --verbose   Show more information for debugging
````


### Apply

The `apply` command allows you to deploy any resource.

````
Usage:
  conduktor apply [flags]

Flags:
      --dry-run            Don't really apply change but check on backend the effect if applied
  -f, --file stringArray   Specify the files to apply
  -h, --help               help for apply

Global Flags:
  -v, --verbose   Show more information for debugging
````

Example:
````
$ conduktor apply -f .
application/clickstream-app: NotChanged
app-instance/clickstream-app-dev: NotChanged
````

### Delete

The `delete` command allows you to delete a resource.

Please note that the resources are deleted instantly and cannot be recovered once deleted. Any data or access associated with the resource is permanently lost.

Example(s):
````
$ conduktor delete -f ./directoryOfResources
$ conduktor delete -f resource.yml
$ conduktor delete topic myTopic
````

### Get
````
get resource of a given kind

Usage:
  conduktor get kind [name] [flags]

Flags:
  -h, --help   help for get

Global Flags:
  -v, --verbose   Show more information for debugging
````
Examples:
````
$ conduktor get app-instance
$ conduktor get app-instance clickstream-app-dev
````

## Platform Team Resources

To deploy these resources, you must use an Admin Token, generated from Settings/Api Keys.


### Application
This resource defines a Self Serve Application.

````yaml
# Application
---
apiVersion: "v1"
kind: "Application"
metadata:
  name: "clickstream-app"
spec:
  title: "Clickstream App"
  description: "FreeForm text, probably multiline markdown"
  owner: "groupA" # technical-id of Console Group
````

**Application checks:**
-   `spec.owner` is a valid Console Group
-   Delete MUST fail if there are associated `ApplicationInstance`

**Side effect in Console & Kafka:**  
None.  
Deploying this object only create the Application in Console. It can be viewed in the Application Catalog

### Application Instance

````yaml
---
apiVersion: "v1"
kind: "ApplicationInstance"
metadata:
  application: "clickstream-app"
  name: "clickstream-app-dev"
spec:
  cluster: "shadow-it"
  serviceAccount: "sa-clicko"
  topicPolicyRef:
    - "generic-dev-topic"
    - "clickstream-naming-rule"
  resources:
  - type: TOPIC
    name: "click."
    patternType: PREFIXED
  - type: GROUP
    name: "click."
    patternType: PREFIXED
````
**AppInstance checks:**
- `metadata.application` is a valid Application
- `spec.cluster` is a valid Console Cluster technical id
- `spec.cluster` is immutable (can't update after creation)
- `spec.serviceAccount` is **optional**, and if present not already used by other AppInstance for the same `spec.cluster`
- `spec.topicPolicyRef` is **optional**, and if present must be a valid list of TopicPolicy
- `spec.resources[].type` can be `TOPIC`, `GROUP`, `SUBJECT`.
- `spec.resources[].patternType` can be `PREFIXED` or `LITERAL`.
- `spec.resources[].name` must no overlap with any other `ApplicationInstance` on the same cluster.
    -   ie: If there is already an owner for `click.` this is forbidden:
        -   `click.orders.`: Resource is a child-resource of `click.`
        -   `cli`: Resource is a parent-resource of `click.`

**Side effect in Console & Kafka:**
- Console
  - Members of the Owner Group are given all permissions in the UI over the owned resources
- Kafka
  - Service Account is granted the following ACLs over the declared resources depending on the type:
    - Topic: READ, WRITE, DESCRIBE_CONFIGS
    - ConsumerGroup: READ


### Topic Policy

````yaml
---
apiVersion: "v1"
kind: "TopicPolicy"
metadata:
  name: "generic-dev-topic"
spec:
  policies:
    metadata.labels.conduktor.io/public-visibility:
      constraint: ValidString
      values: ["true", "false"]
    spec.configs.retention.ms: 
      constraint: "Range"
      max: 42,
      min: 3,
      required: false
    spec.replication.factor:
      constraint: ValidString
      values: ["3"]
    spec.cleanup.policy: 
      constraint: NonEmpty
---
apiVersion: "v1"
kind: "TopicPolicy"
metadata:
  name: "wiki-naming-rule"
spec:
  policies:
    metadata.name:
      constraint: Match
      pattern: ^wikipedia\.(?<event>[a-z0-9]+)\.(avro|json)$
````

## Application Team resources

### Cross Application Permissions
````yaml
# Permission granted to other Applications
---
apiVersion: v1
kind: "ApplicationInstancePermission"
metadata:
  application: "clickstream-app"
  appInstance: "clickstream-app-dev"
  name: "clickstream-app-dev-to-another"
spec:
  resource:
    type: TOPIC
    name: "click."
    patternType: PREFIXED
  permission: READ
  grantedTo: "another-appinstance-dev"
````
**Cross Application permission checks:**
- `spec` is immutable
    - Once created, you will only be able to update its metadata. **This is to protect you from making a change that could impact an external application.**
    - Remember this resource affects target ApplicationInstance's Kafka service account ACLs.
    - To edit this resource, delete and recreate it.
- `spec.resource.type` can be `TOPIC`, `GROUP`, `SUBJECT`.
- `spec.resource.patternType` can be `PREFIXED` or `LITERAL`.
- `spec.resource.name` must reference any "sub-resource" of `metadata.appInstance` .
    - For example, if you are owner of the prefix `click.`, you can grant READ or WRITE access to:
        -   the whole prefix: `click.`
        -   a sub prefix: `click.orders.`
        -   a literal topic name: `click.orders.france`
- `spec.permission` can be `READ` or `WRITE`.
- `spec.grantedTo` must be an `ApplicationInstance` on the same Kafka cluster as `metadata.appInstance`.

**Side effect in Console & Kafka:**
- Console
    - Members of the `grantedTo` ApplicationInstance are given the associated permissions (Read/Write) in the UI over the resources
- Kafka
    - Service Account of the `grantedTo` ApplicationInstance is granted the following ACLs over the `resource` depending on the permission:
        - READ: READ, DESCRIBE_CONFIGS
        - WRITE: READ, WRITE, DESCRIBE_CONFIGS


### Topic
````yaml
---
apiVersion: v1
kind: Topic
metadata:
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
- `metadata.name` must belong to the Application Instance.
- `spec.replicationFactor` and `spec.partitions` are immutable and cannot be modified once the topic is created.
- All other properties are validated if Application Instance has [TopicPolicies](#topic-policy) attached.

**Side effect in Console & Kafka:**
- Console
  - Members of the `grantedTo` ApplicationInstance are given the associated permissions (Read/Write) in the UI over the resources
- Kafka
  - Service Account of the `grantedTo` ApplicationInstance is granted the following ACLs over the `resource` depending on the permission:
    - READ: READ, DESCRIBE_CONFIGS
    - WRITE: READ, WRITE, DESCRIBE_CONFIGS

## Integrate Conduktor CLI with your CI/CD

Conduktor CLI can be easily integrated to a CI/CD pipeline.

This example presents 2 pipelines:
- The first one triggers on each new PR and launches the CLI using the `--dry-run` flag, generating a report confirming that the resources can be successfully created or modified.
- The second one triggers on a push to the `main` branch, making the changes live.

Consider the following folder structure:
````
├── resources/
│   ├── topics.yml          # Your topics are there
|   ├── permissions.yml     # Your permissions to other Apps are there
````




<Tabs>
<TabItem value="github" label="Github Actions">


```yaml title=".github/workflows/on-pr.yml"

name: Check PR Validity
on:
  pull_request:
    branches: [ "main" ]
  workflow_dispatch:
jobs:
  build:
    runs-on: ubuntu-latest
    container: conduktor/conduktor-ctl
    steps:
      - uses: actions/checkout@v3
      - run: /bin/conduktor apply -f resources/ --dry-run
        env:
          CDK_BASE_URL: https://conduktor.domain.com
          CDK_TOKEN: ${{ secrets.CONDUKTOR_TOKEN }}
```

```yaml title=".github/workflows/on-push.yml"
name: Execute Commited Changes
on:
  push:
    branches: [ "main" ]
jobs:
  build:
    runs-on: ubuntu-latest
    container: conduktor/conduktor-ctl
    steps:
      - uses: actions/checkout@v3
      // highlight-next-line
      - run: /bin/conduktor apply -f resources/
        env:
          CDK_BASE_URL: https://conduktor.domain.com
          CDK_TOKEN: ${{ secrets.CONDUKTOR_TOKEN }}
```

</TabItem>
<TabItem value="gitlab" label="Gitlab CI/CD">
    

```yaml title=".gitlab-ci.yml"
conduktor-pr:
  only:
    - merge_requests
  stage: deploy
  image:
    name: conduktor/conduktor-ctl
    entrypoint: [""] 
  variables:
    - export CDK_BASE_URL=https://conduktor.domain.com
    - export CDK_TOKEN=${CONDUKTOR_TOKEN}
  script:
    - /bin/conduktor apply -f resources/ --dry-run

conduktor-main:
  only:
    refs:
      - main
  stage: deploy
  image:
    name: conduktor/conduktor-ctl
    entrypoint: [""] 
  variables:
    - export CDK_BASE_URL=https://conduktor.domain.com
    - export CDK_TOKEN=${CONDUKTOR_TOKEN}
  script:
    - /bin/conduktor apply -f resources/
```
    

</TabItem>
</Tabs>


