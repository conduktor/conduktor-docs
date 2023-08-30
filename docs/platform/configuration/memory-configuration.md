---
sidebar_position: 10
title: Memory configuration
description: Fine tune memory usage of Conduktor
---

# Memory configuration

Conduktor use environment variable `RUN_MODE` to select between different memory configuration preset for internal components. 

| `RUN_MODE` | Target RAM usage   | Console Xmx | Governance Xmx | Authenticator Xmx |
| ---------- | ------------------ |------------ | -------------- | ----------------- |
| `nano`     | `3GB`              | `1024m`     | `256m`         | `128m`            |
| `small`    | `4GB`              | `1700m`     | `512m`         | `128m`            |
| `medium`   | `6GB`              | `3072m`     | `1024m`        | `256m`            |
| `large`    | `8GB`              | `4096m`     | `2048m`        | `256m`            |
| `custom`   | No target          | N.A.        | N.A.           | N.A.              |

This mean that Conduktor wont start it the container CGroup memory limit is set below target RAM usage.

### Using `custom` RUN_MODE

When `RUN_MODE=custom` Conduktor require to set manually memory Java options for internal components using following environment variables : 
- **`CONSOLE_MEMORY_OPTS`** : Used by Console backend (should scale with the number of users and kafka resources)
- **`GOVERNANCE_MEMORY_OPTS`** : Used by governance and internal indexer modules (should scale for large kafka cluster to index)
- **`AUTHENTICATOR_MEMORY_OPTS`** : Used by internal authentication module (scale on internal user list size and number of concurrent users connected)

#### Example
Conduktor run environment variables with a target of 16Go: 

```
RUN_MODE=custom
CONSOLE_MEMORY_OPTS="-Xms2048m -Xmx8000"
GOVERNANCE_MEMORY_OPTS="-Xms1025m -Xmx5000"
AUTHENTICATOR_MEMORY_OPTS="-Xms128m -Xmx512m"
``` 
In this example we set around 8Go for Console, 5Go for Governance and 510Mo for Authenticator leaving a safty marging of 2,5Go for other JVM memory pools and extra internal modules.


### Override specific module memory settings
You can also use `CONSOLE_MEMORY_OPTS`, `GOVERNANCE_MEMORY_OPTS` and `AUTHENTICATOR_MEMORY_OPTS` environement variable to override one module memory settings and using `RUN_MODE` preset for the others. 


#### Example

```
RUN_MODE=small
GOVERNANCE_MEMORY_OPTS="-Xms1025m -Xmx5000"
``` 
In this example we set around 5Go of RAM for Governance and leave other modules like Cosnole and Authenticator with `small` memory presets. 


:::caution
Be aware that in this example target RAM usage is increased from 4Go to 8-9Go and container CGroup limit memory should be set accordingly.
:::