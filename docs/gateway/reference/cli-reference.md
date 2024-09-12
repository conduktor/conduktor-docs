---
sidebar_position: 2
title: CLI Reference
description: CLI Reference
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# CLI Reference

Conduktor CLI gives you the ability to perform some operations directly from your command line or a CI/CD pipeline.  
Check for the list of supported resources and their definition in the dedicated [Resources Reference](../resources-reference) page.

[Read more](https://docs.conduktor.io/platform/navigation/self-serve/) about how the CLI can be used for Kafka Self-service.

## Install & Configure

You have 2 options to Install Conduktor CLI:
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

To use Conduktor CLI, you need to define 3 environment variables:
- The URL of Conduktor Gateway API
- The username & password for the API
````yaml
export CDK_GATEWAY_BASE_URL=http://localhost:8888
export CDK_GATEWAY_USER=admin
export CDK_GATEWAY_PASSWORD=conduktor
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
Interceptor/mask-sensitive-fields: NOT_CHANGED
Interceptor/encrypt-topic-customers: NOT_CHANGED
Interceptor/safeguard-all-topics: UPDATED
````

### Delete

The `delete` command allows you to delete a resource.

Please note that the resources are deleted instantly and cannot be recovered once deleted. Any data or access associated with the resource is permanently lost.

Example(s):
````
$ conduktor delete -f ./directoryOfResources
$ conduktor delete -f resource.yml
$ conduktor delete Interceptor guard-produce-policy --vcluster=passthrough
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
$ conduktor get Interceptor
````

### Version
Check the current version of your CLI using this command
````
$ conduktor version
Version: v0.3.0
Hash: 9911cbe9b956095ea29394fb1f7da95d39d0625f
````
