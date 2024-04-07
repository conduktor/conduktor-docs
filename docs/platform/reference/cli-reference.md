---
sidebar_position: 3
title: CLI Reference
description: Prometheus metrics available for Console
---
# CLI Reference

Conduktor CLI gives you the ability to perform some operations directly from your command line or a CI/CD pipeline.  
Check for the list of supported resources and their definition below.

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

## Administrator Resources

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

Application checks
-   `spec.owner` is a valid Console Group
-   Delete MUST fail if there are associated `ApplicationInstance`


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
  resources:
  - type: TOPIC
    name: "click."
    patternType: PREFIXED
  - type: GROUP
    name: "click."
    patternType: PREFIXED
````
AppInstance checks:
- `metadata.application` is a valid Application
- `spec.cluster` is a valid Console Cluster technical id
- `spec.cluster` is immutable (can't update after creation)
- `spec.serviceAccount` is **optional**, and if present not already used by other AppInstance for the same `spec.cluster`
- `spec.resources[].type` can be `TOPIC`, `GROUP`, `SUBJECT`.
- `spec.resources[].patternType` can be `PREFIXED` or `LITERAL`.
- `spec.resources[].name` must no overlap with any other `ApplicationInstance` on the same cluster.
    -   ie: If there is already an owner for `click.` this is forbidden:
        -   `click.orders.`: Resource is a child-resource of `click.`
        -   `cli`: Resource is a parent-resource of `click.`


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
Cross Application permission checks:
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


## Integrate Conduktor CLI with your CI/CD

Conduktor CLI can be easily integrated to a CI/CD pipeline.

This example presents 2 pipelines.

The first one triggers on each new PR and launches the CLI using the `--dry-run` flag, generating a report confirming that the resources can be successfully created or modified.

The second one triggers on a push to the `main` branch, making the changes live.

Consider the following folder structure:
````
├── resources/
│   ├── topics.yml          # Your topics are there
|   ├── permissions.yml     # Your permissions to other Apps are there
````

### Github Actions
````
├── .github/
│   ├── workflows/
│   |   ├── on-pr.yml
│   |   ├── on-push.yml
````

````yaml title=".github/workflows/on-pr.yml"

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
````
````yaml title=".github/workflows/on-push.yml"
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
      - run: /bin/conduktor apply -f resources/
        env:
          CDK_BASE_URL: https://conduktor.domain.com
          CDK_TOKEN: ${{ secrets.CONDUKTOR_TOKEN }}
````
### Gitlab CI
````yaml title=".gitlab-ci.yml"
conduktor-pr:
  only:
    - merge_requests
  stage: check
  image:
    name: conduktor/conduktor-ctl
  before_script:
    - export CDK_BASE_URL=https://conduktor.domain.com
    - export CDK_TOKEN=${CONDUKTOR_TOKEN}
  script:
    - /bin/conduktor apply -f resources/ --dry-run

conduktor-main:
  only:
    refs:
      - master
  stage: deploy
  image:
    name: conduktor/conduktor-ctl
  before_script:
    - export CDK_BASE_URL=https://conduktor.domain.com
    - export CDK_TOKEN=${CONDUKTOR_TOKEN}
  script:
    - /bin/conduktor apply -f resources/ --dry-run
````
          
