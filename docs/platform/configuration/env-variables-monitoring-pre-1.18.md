---
sidebar_position: 3
title: Configuration Properties & Environment Variables
description: Starting from Conduktor Platform 1.2.0 input configuration fields can be provided using environment variables.
---

### Monitoring properties

Monitoring allows multiple block storage backends to be used for storing 
monitoring data. Only one backend can be used at a time among S3, GCS, Azure 
Blob Storage and Swift, if none is specified, files are stored locally on 
container volume.

| Property                                  | Description                              | Env                                           | Mandatory | Type   | Default                 | Since    |
|-------------------------------------------|------------------------------------------|-----------------------------------------------|-----------|--------|-------------------------|----------|
| `monitoring.storage.s3.endpoint`          | S3 storage endpoint                      | `CDK_MONITORING_STORAGE_S3_ENDPOINT`          | false     | string | ∅                       | `1.5.0`  |
| `monitoring.storage.s3.region`            | S3 storage region                        | `CDK_MONITORING_STORAGE_S3_REGION`            | false     | string | ∅                       | `1.5.0`  |
| `monitoring.storage.s3.bucket`            | S3 storage bucket name                   | `CDK_MONITORING_STORAGE_S3_BUCKET`            | true      | string | ∅                       | `1.5.0`  |
| `monitoring.storage.s3.insecure`          | S3 storage SSL/TLS check flag            | `CDK_MONITORING_STORAGE_S3_INSECURE`          | false     | bool   | false                   | `1.5.0`  |
| `monitoring.storage.s3.accessKeyId`       | S3 storage access key                    | `CDK_MONITORING_STORAGE_S3_ACCESSKEYID`       | true      | string | ∅                       | `1.5.0`  |
| `monitoring.storage.s3.secretAccessKey`   | S3 storage access key secret             | `CDK_MONITORING_STORAGE_S3_SECRETACCESSKEY`   | true      | string | ∅                       | `1.5.0`  |
| `monitoring.storage.gcs.bucketName`       | GCS storage bucket name                  | `CDK_MONITORING_STORAGE_GCS_BUCKETNAME`       | true      | string | ∅                       | `1.16.0` |
| `monitoring.storage.gcs.serviceAccount`   | GCS storage service account json content | `CDK_MONITORING_STORAGE_GCS_SERVICEACCOUNT`   | true      | string | ∅                       | `1.16.0` |
| `monitoring.storage.azure.accountName`    | Azure storage account name               | `CDK_MONITORING_STORAGE_AZURE_ACCOUNTNAME`    | true      | string | ∅                       | `1.16.0` |
| `monitoring.storage.azure.accountKey`     | Azure storage account key                | `CDK_MONITORING_STORAGE_AZURE_ACCOUNTKEY`     | true      | string | ∅                       | `1.16.0` |
| `monitoring.storage.azure.containerName`  | Azure storage container name             | `CDK_MONITORING_STORAGE_AZURE_CONTAINERNAME`  | true      | string | ∅                       | `1.16.0` |
| `monitoring.storage.azure.endpointSuffix` | Azure storage endpoint suffix            | `CDK_MONITORING_STORAGE_AZURE_ENDPOINTSUFFIX` | false     | string | "blob.core.windows.net" | `1.16.0` |
| `monitoring.storage.swift.authUrl`        | Swift storage authentication URL         | `CDK_MONITORING_STORAGE_SWIFT_AUTHURL`        | true      | string | ∅                       | `1.16.0` |
| `monitoring.storage.swift.password`       | Swift storage user password              | `CDK_MONITORING_STORAGE_SWIFT_PASSWORD`       | true      | string | ∅                       | `1.16.0` |
| `monitoring.storage.swift.containerName`  | Swift storage container name             | `CDK_MONITORING_STORAGE_SWIFT_CONTAINERNAME`  | true      | string | ∅                       | `1.16.0` |
| `monitoring.storage.swift.userId`         | Swift storage user id                    | `CDK_MONITORING_STORAGE_SWIFT_USERID`         | false     | string | ∅                       | `1.16.0` |
| `monitoring.storage.swift.username`       | Swift storage user name                  | `CDK_MONITORING_STORAGE_SWIFT_USERNAME`       | false     | string | ∅                       | `1.16.0` |
| `monitoring.storage.swift.userDomainName` | Swift storage user domain name           | `CDK_MONITORING_STORAGE_SWIFT_USERDOMAINNAME` | false     | string | ∅                       | `1.16.0` |
| `monitoring.storage.swift.userDomainId`   | Swift storage user domain id             | `CDK_MONITORING_STORAGE_SWIFT_USERDOMAINID`   | false     | string | ∅                       | `1.16.0` |
| `monitoring.storage.swift.domainId`       | Swift storage user domain id             | `CDK_MONITORING_STORAGE_SWIFT_DOMAINID`       | false     | string | ∅                       | `1.16.0` |
| `monitoring.storage.swift.domainName`     | Swift storage user domain name           | `CDK_MONITORING_STORAGE_SWIFT_DOMAINNAME`     | false     | string | ∅                       | `1.16.0` |
| `monitoring.storage.swift.projectId`      | Swift storage project ID                 | `CDK_MONITORING_STORAGE_SWIFT_PROJECTID`      | false     | string | ∅                       | `1.16.0` |
| `monitoring.storage.swift.regionName`     | Swift storage region name                | `CDK_MONITORING_STORAGE_SWIFT_REGIONNAME`     | false     | string | ∅                       | `1.16.0` |

