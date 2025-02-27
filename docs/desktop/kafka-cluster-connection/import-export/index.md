---
title: Import/Export configurations
description: Import or export your configurations for Conduktor
---

# Import/Export configurations

This feature is for **Enterprise** users where this is typically needed, to share your configuration with your team.
You can also use [GitHub](/desktop/kafka-cluster-connection/import-export/github-enterprise) to auto-synchronize your configuration with your team.

### Export the configuration all several clusters

With the export button you can export all your cluster in a single file.
![](../../assets/config/import-export/blur-export.png)

This export include sensitive data like credentials, secretes and certificate files, you will have to provide a password to secure it.

![](../../assets/config/import-export/password.png)

### Export a specific Cluster Configuration

On the welcome screen, you can export your configuration to a file \(cluster-name.json\).

![](../../assets/config/import-export/1-export.png)

### Import Configurations

You can import Cluster Configurations from a file, from [GitHub](/desktop/kafka-cluster-connection/import-export/github-enterprise) or directly from your clipboard!
If the cluster already exist,we will ask you if you want to override the existing cluster configuration or not \(see below\).

![](../../assets/config/import-export/2-import.png)

### Overriding or Copying an existing cluster configuration

Conduktor will detect if you already have the cluster configuration and will ask you what to do. This can happen when you clone a configuration of yours for instance, or if you just want to update a cluster configuration that you got from someone.

![](../../assets/config/import-export/3-override.png)

### What the import/export does copy

The import/export is only about the configuration, not your personal preferences, which topics or consumer groups you've favorited, your producer templates etc. It's only about the cluster configuration \(Apache Kafka, Kafka Connect, Kafka Streams, ksqlDB, Schema Registry, Metrics...\)
