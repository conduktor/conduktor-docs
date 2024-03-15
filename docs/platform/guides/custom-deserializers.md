---
sidebar_position: 4
title: Configure Custom Deserializers
description: Reference Documentation for Topic related pages
---
This guide describes how to use your custom Kafka Deserializer with Console.   
It assumes that you already have your custom Deserializer available and that you know how to configure it.
### Overview

A Kafka deserializer is an implementation of the `org.apache.kafka.common.serialization.Deserializer<T>` Java interface (for more information, see [kafka-clients documentation](https://kafka.apache.org/30/javadoc/org/apache/kafka/common/serialization/Deserializer.html)).  
You need to have one, or more, jar(s) containing these implementations so you can add these jar files in the "Plugins" section of your cluster configuration in Conduktor.

You can find some Kafka deserializer implementation examples in this open-source Github repository: [my_custom_deserializers](https://github.com/conduktor/my_custom_deserializers)

### Install your Custom Deserializer

Console looks for jars present in folder `/opt/conduktor/plugins` during startup.

:::caution warning
**Custom deserializers must be packaged each into a single JAR with all their dependencies (Fat JAR / Uber JAR).**
:::
import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="docker-compose" label="docker-compose">

```yml
  conduktor-console:
    image: conduktor/conduktor-console
    ports:
      - "8080:8080"
    volumes:
      - /local/custom-deserializer.jar:/opt/conduktor/plugins/custom-deserializer.jar
```
</TabItem>
<TabItem value="Kubernetes" label="Kubernetes">


First upload your jar as a ConfigMap
```yaml
kubectl create configmap my-deserializer-cm --from-file=/local/custom-deserializer.jar
```
Then mount in the Pod
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: conduktor-console
spec:
  containers:
  - name: conduktor-console
    image: conduktor/conduktor-console
    volumeMounts:
    - name: deserializer-mount
      mountPath: /opt/conduktor/plugins/custom-deserializer.jar
  volumes:
  - name: deserializer-mount
    configMap:
      name: my-deserializer-cm
```

</TabItem>
</Tabs>

<hr />

If everything went well, you should see this in the Console starting:
````
2024-03-15T10:32:03,489Z [console] INFO  i.c.plugin.PluginResource - Loading plugin from jar: /opt/conduktor/plugins/serdes.jar
2024-03-15T10:32:03,489Z [console] INFO  i.c.plugin.PluginResource - Register custom Kafka Deserializer: com.company.kafka.serdes.MyDeserializer
````

### Configure your Custom Deserializer and consume data

From the Consume page, open the "Value Format" filter and pick your Custom Deserializer from the list.
- a dropdown allowing you to select your custom deserializer implementation class
- a textarea field allowing you to pass some properties to your custom deserializer implementation (We'll call the `org.apache.kafka.common.serialization.Deserializer<T>::configure` method with these properties)
````properties title="Properties example"
apicurio.registry.url=https://test.serviceregistry.rhcloud.com/t/d4d411af-xxxx-4184-xxxx-342e6cd03580/apis/registry/v2
apicurio.auth.username=srvc-acct-a95c41e8-xxxx-4e99-xxxx-217755ad7046
apicurio.auth.password=7d94b05a-xxxx-4f70-xxxx-1e6aba25a8b4
````

![Capture d’écran 2023-12-12 à 16.04.53.png](img/topic-custom-deser.png)

