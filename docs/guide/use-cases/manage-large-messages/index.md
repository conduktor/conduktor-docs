---
sidebar_position: 370
title: Manage large messages
description: Handle large Kafka messages using Conduktor
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';
import ProductScalePlus from '@site/src/components/shared/product-scale-plus.md';

<ProductScalePlus /> 

The <GlossaryTerm>Interceptor</GlossaryTerm> for handling large messages/batches will save the actual messages produced to <GlossaryTerm>Gateway</GlossaryTerm> into a cloud storage service. This helps to protect data or optimize storage in actual Kafka.

We currently support:

- **Amazon S3** (Amazon Simple Storage Service) is a service offered by AWS (Amazon Web Services) that provides object storage through a web service interface.
- **Azure Blob Storage** is a service offered by Microsoft Azure that provides blob storage.

## Configuration

| Key                | Type            | Default | Description                                                                                            |
|:-------------------|:----------------|:--------|:-------------------------------------------------------------------------------------------------------|
| topic              | String          | `.*`    | Topics that match this regex will have the Interceptor applied                                         |
| s3Config           | [S3](#s3)       |         | Amazon S3 configuration                                                                                |
| azureConfig        | [Azure](#azure) |         | Azure Blob Storage configuration                                                                       |
| minimumSizeInBytes | int             |         | Only upload to S3 if batch/message record has size greater than or equal to this `minimumSizeInBytes` |
| localDiskDirectory | string          |         | Local temp storage, used when we download file from S3 while fetching messages                         |

### Amazon S3

The S3 credentials default to managed identity. They will be overwritten if a specific `basic credentials` (`accessKey` and `secretKey`) or `session credentials` (`accessKey`, `secretKey` and `sessionToken`) are configured.

| Key                | Type         | Description                                                                    |
|:-------------------|:-------------|:-------------------------------------------------------------------------------|
| accessKey          | string       | S3 access key                                                                  |
| secretKey          | string       | S3 secret key                                                                  |
| sessionToken       | string       | S3 session token                                                               |
| bucketName         | string       | S3 bucket name                                                                 |
| uri                | string       | S3 URI                                                                         |
| region             | string       | S3 region                                                                      |

### Azure Blob Storage

Note that your application will require at least **Storage Blob Data Contributor** permissions to be able to read/write the data.

| Key           | Type         | Description                                        |
|:--------------|:-------------|:---------------------------------------------------|
| tenantId      | string       | Azure tenant ID                                    |
| clientId      | string       | Azure client ID                                    |
| secret        | string       | Azure client secret                                |
| blobEndpoint  | string       | Azure Blob Storage endpoint to use                 |
| bucketName    | string       | Bucket (container) name in Blob Storage configured to store in |

## Examples

#### Large batches

Each *batch* that's above the `minimumSizeInBytes` threshold will be saved in **one file** on Amazon S3, with credentials defaulting to managed identity:

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

#### Large messages

Each *individual message* that's above the `minimumSizeInBytes` threshold will be saved in **one file** on Amazon S3, with credentials defaulting to managed identity:

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
