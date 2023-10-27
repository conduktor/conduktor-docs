---
sidebar_position: 9
title: Memory Configuration
description: Fine tune memory usage of Conduktor
---
# Memory configuration (1.19 and later)

**RUN_MODE** is gone!  
We now rely on container CGroups limits and use up to 80% of container memory limit for JVM max heap size.
Our settings are the following
```` shell
-XX:+UseContainerSupport -XX:MaxRAMPercentage=80
````

You now only need to care about the limits that you set to your container.  

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="Console Helm" label="Console Helm">

```yml
# Values.yaml
...
platform:
  resources:
    limits:
      memory: 8Gi
...
```

</TabItem>
<TabItem value="Kubernetes" label="Kubernetes">

```bash
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
...
template:
  spec:
    containers:
      - name: platform
        image: conduktor/conduktor-platform:1.19.0
        resources:
          limits:
            memory: 8G
...
```

</TabItem>
<TabItem value="Docker Compose" label="Docker Compose">

```bash
# docker-compose.yaml
...
  conduktor-platform:
    image: conduktor/conduktor-platform:1.19.0
    deploy:
      resources:
        limits:
          memory: 8G
...
```

</TabItem>
</Tabs>

Read [this article](https://bell-sw.com/announcements/2020/10/28/JVM-in-Linux-containers-surviving-the-isolation/) to understand what this is about.

# Memory configuration Before 1.19

Conduktor Console uses the environment variable `RUN_MODE` to switch between different memory configuration presets. 

| `RUN_MODE` | Target RAM usage   | Console Xmx | Governance Xmx | Authenticator Xmx |
| ---------- | ------------------ |------------ | -------------- | ----------------- |
| `nano`     | `3GB`              | `1024m`     | `256m`         | `128m`            |
| `small`    | `4GB`              | `1700m`     | `512m`         | `128m`            |
| `medium`   | `6GB`              | `3072m`     | `1024m`        | `256m`            |
| `large`    | `8GB`              | `4096m`     | `2048m`        | `256m`            |
| `custom`   | No target          | N.A.        | N.A.           | N.A.              |

:::caution   
This means that Conduktor Console won't start if the container **CGroup memory limit** is set below the target RAM usage.   
:::

#### Modules memory usage
- **Console** : contains administation, RBAC and kafka resources exploration. Should scale with the number of users and kafka resources. 
- **Governance** : contains data-masking engine, kafka indexer and kafka metrics exporter. Should scale for large kafka cluster to index.
- **Authenticator** : Authentication module to interface SSO/LDAP and local users. Scale on internal user list size and number of concurrent users connected.

### Override specific module memory settings

All modules memory presets can be overridden using following the environment variables :

- **`CONSOLE_MEMORY_OPTS`** : Used by Console module
- **`GOVERNANCE_MEMORY_OPTS`** : Used by governance  module
- **`AUTHENTICATOR_MEMORY_OPTS`** : Used by authenticator module

The other modules will still use the preset from the `RUN_MODE` value.

#### Example

```
RUN_MODE=small
GOVERNANCE_MEMORY_OPTS="-Xms1025m -Xmx5000"
``` 
In this example we set around 5GB of RAM for Governance and leave other modules like Console and Authenticator with `small` memory presets. 

:::caution   
Be aware that in this example the target RAM usage is increased from 4GB to 8-9GB and **container CGroup memory limit** should be set accordingly.   
:::

### Using `custom` RUN_MODE

If existing `RUN_MODE` presets are too restrictive or don't meet your needs, you can use the `custom` `RUN_MODE` and this removes the CGroup memory limit startup check and requires that you set manually the Java memory options for all internal components using the environment variables `CONSOLE_MEMORY_OPTS`, `GOVERNANCE_MEMORY_OPTS` and `AUTHENTICATOR_MEMORY_OPTS`.  

Unlike single module override, **all environment variables must be set** when `RUN_MODE=custom`.


#### Example
Conduktor Console running environment variables with a target of 16GB: 

```
RUN_MODE=custom
CONSOLE_MEMORY_OPTS="-Xms2048m -Xmx8000"
GOVERNANCE_MEMORY_OPTS="-Xms1025m -Xmx5000"
AUTHENTICATOR_MEMORY_OPTS="-Xms128m -Xmx512m"
``` 
In this example we set around 8GB for Console, 5GB for Governance and 510MB for Authenticator leaving a safety margin of 2.5GB for other JVM memory pools and extra internal modules.


:::caution     
In `custom` mode, Conduktor will not check CGroup memory limits to prevent under provisioning that could lead to an unexpected crash.  
:::
