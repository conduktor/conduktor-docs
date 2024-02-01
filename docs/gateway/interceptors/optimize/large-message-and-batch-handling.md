---
version: 2.5.0
title: Large message/batch handling
description: Increase performance and reduce costs with cold storage of Kafka data in Amazon S3.
parent: optimize
license: enterprise
---

## Introduction

Amazon S3 or Amazon Simple Storage Service is a service offered by Amazon Web Services that provides object storage through a web service interface.

Large message/batch handling interceptor will save the actual message produced to gateway into Amazon Simple Storage  Service.

It helps to protect data or optimize storage in actual kafka.

## Configuration

| key                | type           | default | description                                                                                            |
|:-------------------|:---------------|:--------|:-------------------------------------------------------------------------------------------------------|
| topic              | String         | `.*`    | Topics that match this regex will have the interceptor applied                                         |
| s3Config           | [S3](#s3)      |         | Amazon S3 Configuration                                                                                |
| minimumSizeInBytes | int            |         | Only upload to s3 for batch/message record has size greater than or equal to this `minimumSizeInBytes` |

### S3 

| key                | type         | description                                                                                                      |
|:-------------------|:-------------|:-----------------------------------------------------------------------------------------------------------------|
| accessKey          | String       | S3 access key                                                                                                    |
| secretKey          | String       | S3 secret key                                                                                                    |
| bucketName         | String       | S3 bucket name                                                                                                   |
| uri                | String       | S3 uri                                                                                                           |
| region             | String       | S3 Region                                                                                                        |
| localDiskDirectory | String       | Local temp storage, used when we download file from S3 while fetching messages                                   |

## Examples

### Large batches

Each *batch* above the minimumSizeInBytes threshold will be saved in one file on s3.

```json
{
  "name": "myLargeBatchHandlingPlugin",
  "pluginClass": "io.conduktor.gateway.interceptor.LargeBatchHandlingPlugin",
  "priority": 100,
  "config": {
    "topic": "topic.*",
    "minimumSizeInBytes": 1024,
    "s3Config": {
      "accessKey": "myAccessKey",
      "secretKey": "mySecretKey",
      "bucketName": "myBucketName",
      "uri": "http://myexampleuri",
      "region": "us-east-1",
      "localDiskDirectory": "myStorage/"
    }
  }
}
```

### Large messages

Each *individual message* above the minimumSizeInBytes threshold will be saved in one file on s3.

```json
{
  "name": "myLargeMessageHandlingPlugin",
  "pluginClass": "io.conduktor.gateway.interceptor.LargeMessageHandlingPlugin",
  "priority": 100,
  "config": {
    "topic": "topic.*",
    "minimumSizeInBytes": 1024,
    "s3Config": {
      "accessKey": "myAccessKey",
      "secretKey": "mySecretKey",
      "bucketName": "myBucketName",
      "uri": "http://myexampleuri",
      "region": "us-east-1",
      "localDiskDirectory": "myStorage/"
    }
  }
}
```