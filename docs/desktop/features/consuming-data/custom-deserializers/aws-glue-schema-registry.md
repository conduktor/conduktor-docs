---
sidebar_position: 2
title: AWS Glue Schema Registry
description: Using Glue Schema with Conduktor Desktop
---

# AWS Glue Schema Registry

:::info
This method is temporary as we plan to integrate with the AWS Glue Registry Serdes directly in
Conduktor soon.
:::

In order to successfully consume messages serialized with AWS Glue Registry, you first need to repackage the Glue deserializers into a single jar with all its dependencies. Here we'll use <a href="https://get-coursier.io/docs/cli-bootstrap#assemblies" target="_blank">Coursier</a> but feel free to use maven plugins if you prefer.

```
cs bootstrap software.amazon.glue:schema-registry-serde:1.1.10 --assembly -M com.amazonaws.services.schemaregistry.deserializers.GlueSchemaRegistryKafkaDeserializer -o glue-schema-registry-serde-1.1.10-with-dependancies.jar
```

We have also generated the fat jar for your convenience: <a href="/assets/glue-schema-registry-serde-1.1.10-with-dependancies.jar">glue-schema-registry-serde-1.1.10-with-dependancies.jar</a>

Now import this jar file in your cluster configuration and use the class `GlueSchemaRegistryKafkaDeserializer` in the Custom Format (Plugin) from the Consume screen.

```
region=us-west-2
avroRecordType=GENERIC_RECORD
```

:::tip
You can further configure your deserializer as described in the Glue documentation:

- [https://docs.aws.amazon.com/glue/latest/dg/schema-registry-gs.html#schema-registry-gs-serde])https://docs.aws.amazon.com/glue/latest/dg/schema-registry-gs.html#schema-registry-gs-serde
- [https://github.com/awslabs/aws-glue-schema-registry](https://github.com/awslabs/aws-glue-schema-registry)
  :::

:::caution
The Glue library doesn't pick the AWS profile from the Kafka config
**sasl.jaas.config**. If you need to use a different profile than the
**default**, you must set the following environment variable:
**AWS_PROFILE="your-profile"**
:::
