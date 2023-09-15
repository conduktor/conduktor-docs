---
sidebar_position: 5
title: Cortex Configuration
description: Cortex Configuration
---

:::caution
This Configuration is for Cortex dependency image `conduktor/conduktor-platform-cortex`
:::

This image is exclusively configured through Environement Variables.  


The only required property is `CDK_CONSOLE-URL`, everything else related to storage for the metrics.  


By default, data will be stored in `/var/conduktor/monitoring` inside the running image.
You can mount a volume on this folder to keep metrics data between updates.
Otherwise, you can use the storage parameters described below to store the data using either `s3`, `gcs`, `azure` or `swift`

| Env                                           | Description                              | Mandatory | Type   | Default                 | Since    |
|-----------------------------------------------|------------------------------------------|-----------|--------|-------------------------|----------|
| `CDK_CONSOLE-URL`                             | Console URL and port       | true      | string | ∅                       | `1.18.0` |
| `CDK_MONITORING_STORAGE_S3_ENDPOINT`          | S3 storage endpoint                      | false     | string | ∅                       | `1.18.0` |
| `CDK_MONITORING_STORAGE_S3_REGION`            | S3 storage region                        | false     | string | ∅                       | `1.18.0` |
| `CDK_MONITORING_STORAGE_S3_BUCKET`            | S3 storage bucket name                   | true      | string | ∅                       | `1.18.0` |
| `CDK_MONITORING_STORAGE_S3_INSECURE`          | S3 storage SSL/TLS check flag            | false     | bool   | false                   | `1.18.0` |
| `CDK_MONITORING_STORAGE_S3_ACCESSKEYID`       | S3 storage access key                    | true      | string | ∅                       | `1.18.0` |
| `CDK_MONITORING_STORAGE_S3_SECRETACCESSKEY`   | S3 storage access key secret             | true      | string | ∅                       | `1.18.0` |
| `CDK_MONITORING_STORAGE_GCS_BUCKETNAME`       | GCS storage bucket name                  | true      | string | ∅                       | `1.18.0` |
| `CDK_MONITORING_STORAGE_GCS_SERVICEACCOUNT`   | GCS storage service account json content | true      | string | ∅                       | `1.18.0` |
| `CDK_MONITORING_STORAGE_AZURE_ACCOUNTNAME`    | Azure storage account name               | true      | string | ∅                       | `1.18.0` |
| `CDK_MONITORING_STORAGE_AZURE_ACCOUNTKEY`     | Azure storage account key                | true      | string | ∅                       | `1.18.0` |
| `CDK_MONITORING_STORAGE_AZURE_CONTAINERNAME`  | Azure storage container name             | true      | string | ∅                       | `1.18.0` |
| `CDK_MONITORING_STORAGE_AZURE_ENDPOINTSUFFIX` | Azure storage endpoint suffix            | false     | string | "blob.core.windows.net" | `1.18.0` |
| `CDK_MONITORING_STORAGE_SWIFT_AUTHURL`        | Swift storage authentication URL         | true      | string | ∅                       | `1.18.0` |
| `CDK_MONITORING_STORAGE_SWIFT_PASSWORD`       | Swift storage user password              | true      | string | ∅                       | `1.18.0` |
| `CDK_MONITORING_STORAGE_SWIFT_CONTAINERNAME`  | Swift storage container name             | true      | string | ∅                       | `1.18.0` |
| `CDK_MONITORING_STORAGE_SWIFT_USERID`         | Swift storage user id                    | false     | string | ∅                       | `1.18.0` |
| `CDK_MONITORING_STORAGE_SWIFT_USERNAME`       | Swift storage user name                  | false     | string | ∅                       | `1.18.0` |
| `CDK_MONITORING_STORAGE_SWIFT_USERDOMAINNAME` | Swift storage user domain name           | false     | string | ∅                       | `1.18.0` |
| `CDK_MONITORING_STORAGE_SWIFT_USERDOMAINID`   | Swift storage user domain id             | false     | string | ∅                       | `1.18.0` |
| `CDK_MONITORING_STORAGE_SWIFT_DOMAINID`       | Swift storage user domain id             | false     | string | ∅                       | `1.18.0` |
| `CDK_MONITORING_STORAGE_SWIFT_DOMAINNAME`     | Swift storage user domain name           | false     | string | ∅                       | `1.18.0` |
| `CDK_MONITORING_STORAGE_SWIFT_PROJECTID`      | Swift storage project ID                 | false     | string | ∅                       | `1.18.0` |
| `CDK_MONITORING_STORAGE_SWIFT_REGIONNAME`     | Swift storage region name                | false     | string | ∅                       | `1.18.0` |

Typically, in docker compose it would look like this:
````yaml
version: '3.8'
services:
  conduktor-platform:
    image: conduktor/conduktor-platform:1.18.0
    ports:
      - "8080:8080"
      CDK_MONITORING_CORTEX-URL: http://cortex:9009/
      CDK_MONITORING_ALERT-MANAGER-URL: http://cortex:9010/
      CDK_MONITORING_CALLBACK-URL: http://conduktor-platform:8080/monitoring/api/
      CDK_MONITORING_NOTIFICATIONS-CALLBACK-URL: http://localhost:8080
  conduktor-monitoring:
    hostname: cortex
    image: ghcr.io/conduktor/conduktor-platform-cortex:1.18.0
    environment:
      CDK_CONSOLE-URL: "conduktor-platform:8080"
````
