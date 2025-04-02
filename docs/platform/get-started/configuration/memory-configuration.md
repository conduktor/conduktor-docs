---
sidebar_position: 8
title: Memory configuration
description: Fine tune memory usage of Conduktor
---
# Memory configuration

:::
**RUN_MODE** has been deprecated. We now rely on container CGroups limits and use up to 80% of the container memory limit for JVM max heap size.
:::

```bash
-XX:+UseContainerSupport -XX:MaxRAMPercentage=80
```

You now only need to care about the limits that you set on your container.  

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="Console Helm" label="Console Helm">

```yaml
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

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
...
template:
  spec:
    containers:
      - name: console
        image: conduktor/conduktor-console
        resources:
          limits:
            memory: 8G
...
```

</TabItem>
<TabItem value="Docker Compose" label="Docker Compose">

```yaml
# docker-compose.yaml
...
  conduktor-console:
    image: conduktor/conduktor-console
    deploy:
      resources:
        limits:
          memory: 8G
...
```

</TabItem>
</Tabs>

[Find out more](https://bell-sw.com/announcements/2020/10/28/JVM-in-Linux-containers-surviving-the-isolation/).