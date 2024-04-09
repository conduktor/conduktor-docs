---
sidebar_position: 3
title: CLI Reference
description: CLI Reference
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# CLI Reference

Conduktor CLI gives you the ability to perform some operations directly from your command line or a CI/CD pipeline.  
Check for the list of supported resources and their definition in the dedicated [Resources Reference](./resource-reference) page.


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


