---
sidebar_position: 6
title: Configure Custom Deserializers
description: Reference Documentation for Topic related pages
---

### Overview

This guide will help you install, configure and use your Custom [Kafka Deserializer](https://kafka.apache.org/37/javadoc/org/apache/kafka/common/serialization/Deserializer.html) with Console.

Importing your Custom Deserializers will allow Console to present to your users your serialized messages in a human friendly way.

It assumes that you already have your Custom Deserializer available and that you know how to configure it.

:::tip
This is especially interesting if your Deserializer is presenting data in a JSON-ish form. This will allow you to exploit the full extend of Console's filtering and visualization capabilities.
:::

### Create your Custom Deserializer
To create your Custom Deserializer, you need to implement the [org.apache.kafka.common.serialization.Deserializer](https://kafka.apache.org/40/javadoc/org/apache/kafka/common/serialization/Deserializer.html) interface.
The object returned by the `deserialize` method will be transformed into a JSON object and displayed in Console.

Console requires that your Custom Deserializer is packaged in a single JAR file that contains all the necessary dependencies (also known as Fat JAR or Uber JAR).

If you are using sbt to build your project, we suggest you use the [sbt-assembly](https://github.com/sbt/sbt-assembly) plugin to create the Fat JAR.
The assembly merge strategy should be configured properly to include all the necessary classes and resources for your deserializer to work.
A misconfiguration of the merge strategy is the first cause of issues when using Custom Deserializers in Console.

Similar plugins exist for other build systems to build a Fat jar like the [Maven Assembly Plugin](https://maven.apache.org/plugins/maven-assembly-plugin/) for Maven.

You can find some Kafka deserializer implementation examples in this open-source Github repository: [my_custom_deserializers](https://github.com/conduktor/my_custom_deserializers)

### Install your Custom Deserializer

Console looks for jars present in folder `/opt/conduktor/plugins` during startup.

There are different ways of making your Custom Deserializers available into Console.

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="Docker Compose" label="Docker Compose">

```yml
conduktor-console:
  image: conduktor/conduktor-console
  ports:
    - '8080:8080'
  volumes:
    - /local/my_custom_deserializers_2.13-2.0.0.jar:/opt/conduktor/plugins/my_custom_deserializers_2.13-2.0.0.jar
```

</TabItem>
<TabItem value="Kubernetes" label="Kubernetes">

There are various way to add Custom Deserializers jar to Console inside a Kubernetes environment.

Here we cover some idea of how to do it but it always depend on your infrastructure/polcies in place.

<Tabs>
<TabItem value="init" label="InitContainer">
You can also use a custom InitContainer that will be responsible to download jar from a trusted source (S3, SFTP, HTTP,...)

For that you just have to provide your init container configuration to the Console Helm Chart like :

```yaml title="console-values.yaml"
platform:
  initContainers:
    - name: init-plugins
    image: curlimages/curl:latest  # Using curl image
    args: [ "-L", "https://github.com/conduktor/my_custom_deserializers/releases/download/2.0.0/my_custom_deserializers_2.13-2.0.0.jar", "-o", "/opt/conduktor/plugins/my_custom_deserializers_2.13-2.0.0.jar" ]    
    securityContext: # avoid permission issues and curl image not having numeral UID error
      fsGroup: 0 # same default GID as Console
      runAsNonRoot: true
      runAsUser: 10001 # same default UID as Console
    volumeMounts:
    - name: plugins
      mountPath: /opt/conduktor/plugins  # Mounting to the desired directory
  extraVolumes:
    - name: plugins
      emptyDir: {}
  extraVolumeMounts:
    - name: plugins
      mountPath: /opt/conduktor/plugins # Mount for Console container
```

</TabItem>
<TabItem value="PVC" label="PersistentVolumeClaim">

First create a [PersitentVolumeClaim](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims) (PVC) with read/write capabilities.

```yaml title="PVC.yaml"
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: console-plugins-pvc
  namespace: console-namespace
spec:
  accessModes:
    - ReadWriteMany # or ReadWriteOnce but limited to a single node
  volumeMode: Filesystem
  resources:
    requests:
      storage: 1Gi
  storageClassName: standard # change for one that support requested accessModes
```

Then when using [Console Helm Chart](/platform/get-started/installation/get-started/kubernetes/) provide created PVC as extra volume like :

```yaml title="console-values.yaml"
platform:
  extraVolumes:
    - name: plugins
      persistentVolumeClaim:
        claimName: console-plugins-pvc
  extraVolumeMounts:
    - name: plugins
      mountPath: /opt/conduktor/plugins
  podSecurityContext:
    runAsNonRoot: true # default
    fsGroup: 0 # enable write to the root group to allow our container user to write on plugin volume
```

When Console pod is up with volume mounted you can copy your Jar using `kubectl` command:

```sh
kubectl cp ./my_custom_deserializers_2.13-2.0.0.jar <console-pod>:/opt/conduktor/plugins/my_custom_deserializers_2.13-2.0.0.jar -n console-namespace
```

</TabItem>
</Tabs>

</TabItem>
<TabItem value="Extend Console Image" label="Extend Console Image">

1. Write a Dockerfile

```Dockerfile
FROM conduktor/conduktor-console::<version>
COPY ./my_custom_deserializers_2.13-2.0.0.jar /opt/conduktor/plugins/my_custom_deserializers_2.13-2.0.0.jar
```

2. Build the Dockerfile

```yaml
docker build . -t custom-console:<version>
```

3. Then replace the image in your docker compose or helm files

</TabItem>
</Tabs>

<hr />

:::caution
If your Custom deserializers have dependencies, they must be embedded within the same JAR file (Fat JAR / Uber JAR).
:::

If everything went well, you should see this in the Console starting:

```
Loading plugin my_custom_deserializers_2.13-2.0.0 from jar: /opt/conduktor/plugins/my_custom_deserializers_2.13-2.0.0.jar
Register custom Kafka Deserializer: class io.example.conduktor.custom.deserializers.MyCustomDeserializer
Register custom Kafka Deserializer: class io.example.conduktor.custom.deserializers.MyCustomProtobufDeserializer
...
```

### Configure your Custom Deserializer and consume data

From the Consume page, open the "Value Format" filter and pick your Custom Deserializer from the list.

- a dropdown allowing you to select your custom deserializer implementation class
- a textarea field allowing you to pass some properties to configure your custom deserializer instance (We'll call the [`org.apache.kafka.common.serialization.Deserializer<T>::configure`](<https://kafka.apache.org/37/javadoc/org/apache/kafka/common/serialization/Deserializer.html#configure(java.util.Map,boolean)>) method with these properties)

```properties title="Properties example"
apicurio.registry.url=https://test.serviceregistry.rhcloud.com/t/d4d411af-xxxx-4184-xxxx-342e6cd03580/apis/registry/v2
apicurio.auth.username=srvc-acct-a95c41e8-xxxx-4e99-xxxx-217755ad7046
apicurio.auth.password=7d94b05a-xxxx-4f70-xxxx-1e6aba25a8b4
```

![Custom deserializer](assets/topic-custom-deser.png)
