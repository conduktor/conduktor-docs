---
version: 3.2.0
title: Large Message/Batch Handling
description: Increase performance and reduce costs with cold storage of Kafka data in Cloud storage (Amazon S3/Azure Blob storage).
parent: optimize
license: enterprise
---

## Introduction

Large message/batch handling interceptor will save the actual message produced to gateway into a cloud storage service. It helps to protect data or optimize storage in actual kafka.

Currently supported cloud storages are Amazon S3 or Azure Blob Storage:
 - Amazon S3 or Amazon Simple Storage Service is a service offered by Amazon Web Services that provides object storage through a web service interface.
 - Azure Blob Storage is a service offered by Microsoft Azure to provide blob storage.


## Configuration

Note: On versions earlier then 3.2.0, you will need to specify the `localDiskDirectory` property in the S3 connector itself and not in the general configuration.

| key                | type            | default | description                                                                                            |
|:-------------------|:----------------|:--------|:-------------------------------------------------------------------------------------------------------|
| topic              | String          | `.*`    | Topics that match this regex will have the interceptor applied                                         |
| s3Config           | S3              |         | Amazon S3 Configuration                                                                                |
| azureConfig        | [Azure](#azure) |         | Azure Blob Storage Configuration                                                                       |
| minimumSizeInBytes | int             |         | Only upload to s3 for batch/message record has size greater than or equal to this `minimumSizeInBytes` |
| localDiskDirectory | string          |         | Local temp storage, used when we download file from S3 while fetching messages                         |

### S3

By default, s3 credentials default on managed identity. They will be overwritten if a specific `basic credentials` (`accessKey` and `secretKey`) 
or `session credentials` (`accessKey`, `secretKey` and `sessionToken`) is configured.

| key                | type         | description                                                                    |
|:-------------------|:-------------|:-------------------------------------------------------------------------------|
| accessKey          | string       | S3 access key                                                                  |
| secretKey          | string       | S3 secret key                                                                  |
| sessionToken       | string       | S3 session token                                                               |
| bucketName         | string       | S3 bucket name                                                                 |
| uri                | string       | S3 uri                                                                         |
| region             | string       | S3 Region                                                                      |

### Azure

Note that your application will require at least **Storage Blob Data Contributor** permissions to be able to read/write the data.

| key           | type         | description                                        |
|:--------------|:-------------|:---------------------------------------------------|
| tenantId      | string       | Azure tenant id                                    |
| clientId      | string       | Azure client id                                    |
| secret        | string       | Azure client secret                                |
| blobEndpoint  | string       | Azure blob storage endpoint to use                 |
| bucketName    | string       | Bucket (container) name in blob storage configured to store in |

## Examples

### Large batches

Each *batch* above the minimumSizeInBytes threshold will be saved in one file on s3.

With credentials default on managed identity:
```json
{
  "name": "myLargeBatchHandlingPlugin",
  "pluginClass": "io.conduktor.gateway.interceptor.LargeBatchHandlingPlugin",
  "priority": 100,
  "config": {
    "topic": "topic.*",
    "minimumSizeInBytes": 1024,
    "localDiskDirectory": "myStorage/",
    "s3Config": {
      "bucketName": "myBucketName",
      "uri": "http://myexampleuri",
      "region": "us-east-1",
    }
  }
}
```

With `basic credentials`:
```json
{
  "name": "myLargeBatchHandlingPlugin",
  "pluginClass": "io.conduktor.gateway.interceptor.LargeBatchHandlingPlugin",
  "priority": 100,
  "config": {
    "topic": "topic.*",
    "minimumSizeInBytes": 1024,
    "localDiskDirectory": "myStorage/",
    "s3Config": {
      "accessKey": "myAccessKey",
      "secretKey": "mySecretKey",
      "bucketName": "myBucketName",
      "uri": "http://myexampleuri",
      "region": "us-east-1",
    }
  }
}
```

With `session credentials`:
```json
{
  "name": "myLargeBatchHandlingPlugin",
  "pluginClass": "io.conduktor.gateway.interceptor.LargeBatchHandlingPlugin",
  "priority": 100,
  "config": {
    "topic": "topic.*",
    "minimumSizeInBytes": 1024,
    "localDiskDirectory": "myStorage/",
    "s3Config": {
      "accessKey": "myAccessKey",
      "secretKey": "mySecretKey",
      "sessionToken": "mySessionToken",
      "bucketName": "myBucketName",
      "uri": "http://myexampleuri",
      "region": "us-east-1",
    }
  }
}
```

### Large messages

Each *individual message* above the minimumSizeInBytes threshold will be saved in one file on s3.

With credentials default on managed identity:
```json
{
  "name": "myLargeMessageHandlingPlugin",
  "pluginClass": "io.conduktor.gateway.interceptor.LargeMessageHandlingPlugin",
  "priority": 100,
  "config": {
    "topic": "topic.*",
    "minimumSizeInBytes": 1024,
    "localDiskDirectory": "myStorage/",
    "s3Config": {
      "bucketName": "myBucketName",
      "uri": "http://myexampleuri",
      "region": "us-east-1",
    }
  }
}
```

With `basic credentials`:
```json
{
  "name": "myLargeMessageHandlingPlugin",
  "pluginClass": "io.conduktor.gateway.interceptor.LargeMessageHandlingPlugin",
  "priority": 100,
  "config": {
    "topic": "topic.*",
    "minimumSizeInBytes": 1024,
    "localDiskDirectory": "myStorage/",
    "s3Config": {
      "accessKey": "myAccessKey",
      "secretKey": "mySecretKey",
      "bucketName": "myBucketName",
      "uri": "http://myexampleuri",
      "region": "us-east-1",
    }
  }
}
```

With `sessionCredentials`:
```json
{
  "name": "myLargeMessageHandlingPlugin",
  "pluginClass": "io.conduktor.gateway.interceptor.LargeMessageHandlingPlugin",
  "priority": 100,
  "config": {
    "topic": "topic.*",
    "minimumSizeInBytes": 1024,
    "localDiskDirectory": "myStorage/",
    "s3Config": {
      "accessKey": "myAccessKey",
      "secretKey": "mySecretKey",
      "sessionToken": "mySessionToken",
      "bucketName": "myBucketName",
      "uri": "http://myexampleuri",
      "region": "us-east-1",
    }
  }
}
```
